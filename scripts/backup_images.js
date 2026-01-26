
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
const BACKUP_DIR = 'backups';
const BACKUP_FILE = path.join(BACKUP_DIR, 'universities_images_backup.json');

async function backup() {
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR);
    }

    console.log('Fetching university images...');

    let allData = [];
    let from = 0;
    const step = 1000;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from('universities')
            .select('id, image_url')
            .range(from, from + step - 1);

        if (error) {
            console.error('Error fetching data:', error);
            return;
        }

        if (data.length > 0) {
            allData = [...allData, ...data];
            from += step;
            console.log(`Fetched ${allData.length} records...`);
        }

        if (data.length < step) {
            hasMore = false;
        }
    }

    console.log(`Found ${allData.length} universities total. Saving backup...`);
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(allData, null, 2));
    console.log(`✅ Backup saved to ${BACKUP_FILE}`);
}

backup();
