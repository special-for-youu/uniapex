
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BACKUP_FILE = path.join('backups', 'universities_logos_backup.json');

async function restore() {
    if (!fs.existsSync(BACKUP_FILE)) {
        console.error(`Backup file not found: ${BACKUP_FILE}`);
        return;
    }

    console.log('Reading backup file...');
    const backupData = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf8'));
    console.log(`Found ${backupData.length} records. Restoring...`);

    let successCount = 0;
    let failCount = 0;

    // Process in chunks to avoid overwhelming the database
    const CHUNK_SIZE = 50;
    for (let i = 0; i < backupData.length; i += CHUNK_SIZE) {
        const chunk = backupData.slice(i, i + CHUNK_SIZE);

        const updates = chunk.map(record => {
            return supabase
                .from('universities')
                .update({ logo_url: record.logo_url })
                .eq('id', record.id);
        });

        const results = await Promise.all(updates);

        results.forEach(result => {
            if (result.error) {
                console.error('Error restoring record:', result.error);
                failCount++;
            } else {
                successCount++;
            }
        });

        console.log(`Processed ${Math.min(i + CHUNK_SIZE, backupData.length)} / ${backupData.length}`);
    }

    console.log(`\nRestore complete! Success: ${successCount}, Failed: ${failCount}`);
}

restore();
