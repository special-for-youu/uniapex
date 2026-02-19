import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';

export const dynamic = 'force-dynamic';



export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const adminSession = cookieStore.get('admin_session');

        if (!adminSession) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            return NextResponse.json({ error: 'Email credentials missing' }, { status: 500 });
        }

        const supabase = await createClient();

        // 1. Fetch pending feedback from DB
        const { data: pendingFeedback, error: dbError } = await supabase
            .from('feedback')
            .select('*')
            .eq('status', 'pending');

        if (dbError) throw dbError;
        if (!pendingFeedback || pendingFeedback.length === 0) {
            return NextResponse.json({ message: 'No pending feedback to sync', syncedCount: 0 });
        }

        // 2. Connect to IMAP
        const config = {
            imap: {
                user: process.env.EMAIL_USER,
                password: process.env.EMAIL_PASS,
                host: 'imap.gmail.com',
                port: 993,
                tls: true,
                authTimeout: 3000,
            },
        };

        const connection = await imaps.connect(config);
        await connection.openBox('[Gmail]/Sent Mail');

        // 3. Search for replies
        // We look for emails sent in the last 30 days to optimize
        const delay = 30 * 24 * 3600 * 1000;
        const since = new Date(Date.now() - delay);

        const searchCriteria = [
            ['SINCE', since.toISOString()],
            ['HEADER', 'SUBJECT', 'Re: [Feedback]']
        ];

        const fetchOptions = {
            bodies: ['HEADER', 'TEXT', ''],
            markSeen: false,
        };

        const messages = await connection.search(searchCriteria, fetchOptions);
        let syncedCount = 0;

        for (const message of messages) {
            const all = message.parts.find((part: any) => part.which === '');
            const id = message.attributes.uid;
            const idHeader = 'Imap-Id: ' + id + '\r\n';

            const parsed = await simpleParser(idHeader + all.body);

            const subject = parsed.subject || '';
            const to = Array.isArray(parsed.to) ? parsed.to[0].text : parsed.to?.text;
            const textBody = parsed.text;

            if (!to || !textBody) continue;

            // Extract title from subject: "Re: [Feedback] My Title" -> "My Title"
            // The subject might be "Re: [Feedback] My Title"
            const titleMatch = subject.match(/Re: \[Feedback\] (.+)/i);
            const title = titleMatch ? titleMatch[1].trim() : null;

            if (!title) continue;

            // Find matching feedback
            // We match by User Email (To) and Title
            const match = pendingFeedback.find(f =>
                f.user_email.toLowerCase() === to.toLowerCase() &&
                f.title.toLowerCase().trim() === title.toLowerCase().trim()
            );

            if (match) {
                // Found a reply! Update DB
                // We clean up the body to remove the quoted original message if possible
                // Simple heuristic: split by "On ... wrote:" or "From: ..."
                const cleanReply = textBody.split(/On .+ wrote:|From: .+/)[0].trim();

                const { error: updateError } = await supabase
                    .from('feedback')
                    .update({
                        status: 'replied',
                        admin_reply: cleanReply,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', match.id);

                if (!updateError) {
                    syncedCount++;
                }
            }
        }

        connection.end();

        return NextResponse.json({ success: true, syncedCount });

    } catch (error: any) {
        console.error('Sync error:', error);
        return NextResponse.json(
            { error: 'Failed to sync', details: error.message },
            { status: 500 }
        );
    }
}
