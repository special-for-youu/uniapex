
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanDatabase() {
    console.log('Cleaning unitap.org images from database...');

    // 1. Clean logo_url
    const { error: logoError } = await supabase
        .from('universities')
        .update({ logo_url: null })
        .ilike('logo_url', '%unitap.org%');

    if (logoError) console.error('Error cleaning logos:', logoError);
    else console.log('Cleaned logos.');

    // 2. Clean image_url if any (though we mostly use local paths now, just in case)
    const { error: imageError } = await supabase
        .from('universities')
        .update({ image_url: null })
        .ilike('image_url', '%unitap.org%');

    if (imageError) console.error('Error cleaning images:', imageError);
    else console.log('Cleaned images.');

    console.log('Database cleanup complete.');
}

cleanDatabase();
