import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkCount() {
    const { count, error } = await supabase.from('universities').select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error checking count:', error);
    } else {
        console.log(`Total universities: ${count}`);
    }

    const { data, error: fetchError } = await supabase.from('universities').select('*').limit(1);
    if (fetchError) {
        console.error('Error fetching data:', fetchError);
    } else if (data && data.length > 0) {
        console.log('First university record:', JSON.stringify(data[0], null, 2));
    } else {
        console.log('No data found.');
    }
}

checkCount();
