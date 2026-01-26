
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

async function updateImages() {
    console.log('Starting image update from JSON...');

    const jsonPath = path.join(__dirname, '../informations/unitap_final/data.json');

    if (!fs.existsSync(jsonPath)) {
        console.error('JSON file not found:', jsonPath);
        return;
    }

    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const universitiesData = JSON.parse(rawData);

    console.log(`Found ${universitiesData.length} universities in JSON.`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const item of universitiesData) {
        const name = item.name;
        const apiData = item.api_data;

        if (!apiData) continue;

        let logoUrl = null;
        let imageUrl = null;

        if (apiData.logo) {
            logoUrl = `https://unitap.org/nova/files/${apiData.logo}/xl`;
        }

        if (apiData.gallery && apiData.gallery.length > 0) {
            // Use the first image from gallery
            imageUrl = `https://unitap.org/nova/files/${apiData.gallery[0]}/xl`;
        }

        if (logoUrl || imageUrl) {
            const updates = {};
            if (logoUrl) updates.logo_url = logoUrl;
            if (imageUrl) updates.image_url = imageUrl;

            // Update by name
            const { error } = await supabase
                .from('universities')
                .update(updates)
                .eq('name', name);

            if (error) {
                console.error(`Failed to update ${name}:`, error.message);
                errorCount++;
            } else {
                // console.log(`Updated ${name}`);
                updatedCount++;
            }
        }
    }

    console.log(`Finished! Updated: ${updatedCount}, Errors: ${errorCount}`);
}

updateImages();
