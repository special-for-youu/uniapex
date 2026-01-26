import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from parent directory's .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedCareers() {
    console.log('Starting Careers seed...');
    const careers = [];

    try {
        const blsPath = path.join(__dirname, '../informations/bls/bls_careers.json');
        if (fs.existsSync(blsPath)) {
            const blsData = JSON.parse(fs.readFileSync(blsPath, 'utf8'));
            console.log(`Found ${blsData.length} items in BLS data.`);

            for (const item of blsData) {
                // Filter out metadata and invalid entries
                if (
                    item.title.includes('bls.gov') ||
                    item.title === 'OOH FAQ' ||
                    item.title === 'HOW TO FIND A JOB' ||
                    item.title === 'OOH SITE MAP'
                ) {
                    continue;
                }

                // Ensure we have at least some data
                if (!item.salary_text && !item.growth_rate && !item.description) {
                    continue;
                }

                careers.push({
                    title: item.title,
                    description: item.description,
                    salary_text: item.salary_text,
                    growth_rate: item.growth_rate,
                    url: item.url
                });
            }
        } else {
            console.warn('BLS data file not found:', blsPath);
        }
    } catch (e) {
        console.error('Error processing BLS data:', e);
    }

    console.log(`Total valid careers to insert: ${careers.length}`);

    // Clear existing data (using a condition that is always true for UUIDs to delete all)
    // Note: delete() requires a filter. neq('id', '0000...') is a hack if we don't know IDs.
    // Better to use a known condition or just delete all if allowed.
    // Since we just created the table, it's empty, but for re-runs:
    const { error: delError } = await supabase.from('careers').delete().neq('title', 'PLACEHOLDER_IMPOSSIBLE');
    if (delError) console.error('Error clearing careers:', delError);

    // Insert in batches
    const BATCH_SIZE = 50;
    for (let i = 0; i < careers.length; i += BATCH_SIZE) {
        const batch = careers.slice(i, i + BATCH_SIZE);
        const { error } = await supabase.from('careers').insert(batch);
        if (error) {
            console.error(`Error inserting careers batch ${i}:`, error);
        } else {
            if (i % 100 === 0) console.log(`Processed ${i} items...`);
        }
    }
    console.log('Careers seed completed.');
}

seedCareers().catch(console.error);
