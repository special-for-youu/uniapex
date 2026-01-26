
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function linkImages() {
    console.log('Starting image linking...');

    const imagesDir = path.join(__dirname, '../public/university_images');

    if (!fs.existsSync(imagesDir)) {
        console.error('Images directory not found:', imagesDir);
        return;
    }

    const files = fs.readdirSync(imagesDir);
    console.log(`Found ${files.length} images in directory.`);

    let updatedCount = 0;
    let notFoundCount = 0;

    // Get all universities
    const { data: universities, error } = await supabase
        .from('universities')
        .select('id, name');

    if (error) {
        console.error('Error fetching universities:', error);
        return;
    }

    console.log(`Found ${universities.length} universities in DB.`);

    for (const uni of universities) {
        // Try to find a matching image
        // The images are named like 'harvard-university.jpg'
        // We need to slugify the university name to match
        const slug = uni.name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        // Try exact match with .jpg
        let imageFile = files.find(f => f === `${slug}.jpg`);

        // If not found, try fuzzy match or partial match?
        // For now, let's stick to the slug match as that's likely how they were named

        if (imageFile) {
            const imageUrl = `/university_images/${imageFile}`;

            const { error: updateError } = await supabase
                .from('universities')
                .update({ image_url: imageUrl })
                .eq('id', uni.id);

            if (updateError) {
                console.error(`Failed to update ${uni.name}:`, updateError);
            } else {
                // console.log(`Linked ${uni.name} -> ${imageUrl}`);
                updatedCount++;
            }
        } else {
            // console.log(`No image found for ${uni.name} (slug: ${slug})`);
            notFoundCount++;
        }
    }

    console.log(`Finished! Updated: ${updatedCount}, No Image Found: ${notFoundCount}`);
}

linkImages();
