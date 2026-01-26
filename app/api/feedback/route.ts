import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { title, description, userEmail } = await request.json();

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('Email credentials missing');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // 1. Save to Database
        const supabase = createRouteHandlerClient({ cookies });

        // Get user session to ensure we have the correct user_id
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { error: dbError } = await supabase
            .from('feedback')
            .insert({
                user_id: session.user.id,
                user_email: userEmail || session.user.email,
                title,
                description,
                status: 'pending'
            });

        if (dbError) {
            console.error('Database error:', dbError);
            // Continue to send email even if DB fails? 
            // Better to fail so user knows something went wrong, or at least log it.
            // For now, let's return error.
            return NextResponse.json(
                { error: 'Failed to save feedback' },
                { status: 500 }
            );
        }

        // 2. Send Email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to self (admin)
            replyTo: userEmail || undefined, // Allow replying to the user
            subject: `[Feedback] ${title}`,
            text: `
New Feedback Received:

From: ${userEmail || 'Anonymous'}
Title: ${title}
Description:
${description}

----------------------------------------------------
Sent from UNIAPEX Feedback System
            `,
            html: `
                <h2>New Feedback Received</h2>
                <p><strong>From:</strong> ${userEmail || 'Anonymous'}</p>
                <p><strong>Title:</strong> ${title}</p>
                <p><strong>Description:</strong></p>
                <p style="white-space: pre-wrap;">${description}</p>
                <hr />
                <p><small>Sent from UNIAPEX Feedback System</small></p>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Feedback email error:', error);
        return NextResponse.json(
            { error: 'Failed to send feedback' },
            { status: 500 }
        );
    }
}
