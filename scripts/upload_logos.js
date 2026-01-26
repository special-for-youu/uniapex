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
const IMAGES_DIR = path.join('informations', 'unitap_final', 'images_extracted');
const BUCKET_NAME = 'logos';

async function upload() {
    // 0. Ensure bucket exists
    console.log('Checking storage bucket...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) {
        console.error('Error listing buckets:', listError);
        return;
    }

    const bucketExists = buckets.find(b => b.name === BUCKET_NAME);
    if (!bucketExists) {
        console.log(`Creating bucket '${BUCKET_NAME}'...`);
        const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
            public: true
        });
        if (createError) {
            console.error('Error creating bucket:', createError);
            return;
        }
        console.log(`Bucket '${BUCKET_NAME}' created.`);
    } else {
        console.log(`Bucket '${BUCKET_NAME}' already exists.`);
    }

    // 1. Read files
    if (!fs.existsSync(IMAGES_DIR)) {
        console.error(`Images directory not found: ${IMAGES_DIR}`);
        return;
    }

    const files = fs.readdirSync(IMAGES_DIR);
    console.log(`Found ${files.length} images. Starting upload...`);

    let successCount = 0;
    let failCount = 0;

    for (const file of files) {
        if (!file.endsWith('.jpg') && !file.endsWith('.png') && !file.endsWith('.webp')) continue;

        const filePath = path.join(IMAGES_DIR, file);
        const fileBuffer = fs.readFileSync(filePath);

        // 2. Upload to Storage
        const { error: uploadError } = await supabase
            .storage
            .from(BUCKET_NAME)
            .upload(`unitap/${file}`, fileBuffer, { upsert: true });

        if (uploadError) {
            console.log(`❌ Error uploading ${file}:`, uploadError.message);
            failCount++;
            continue;
        }

        // 3. Get Public URL
        const { data: { publicUrl } } = supabase
            .storage
            .from(BUCKET_NAME)
            .getPublicUrl(`unitap/${file}`);

        // 4. Update DB
        const universityId = file.replace(/\.(jpg|png|webp)$/, '');

        const { error: updateError } = await supabase
            .from('universities')
            .update({ logo_url: publicUrl })
            .eq('id', universityId);

        if (updateError) {
            console.log(`❌ Error updating DB for ${universityId}:`, updateError.message);
            failCount++;
        } else {
            console.log(`✅ ${universityId} -> Updated`);
            successCount++;
        }
    }

    console.log(`\nUpload complete! Success: ${successCount}, Failed: ${failCount}`);
}

upload();
