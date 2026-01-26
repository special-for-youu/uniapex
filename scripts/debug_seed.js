import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testInsert() {
    console.log('Attempting to insert a test record...');
    const testUni = {
        id: 'test-university-' + Date.now(),
        name: 'Test University',
        location: 'Test City, Test Country',
        description: 'This is a test university.',
        website: 'https://example.com',
        admissions: { tuition: 10000 }
    };

    const { data, error } = await supabase.from('universities').insert([testUni]).select();

    if (error) {
        console.error('Insert Error:', JSON.stringify(error, null, 2));
    } else {
        console.log('Insert Success:', data);
    }

    console.log('Checking total count...');
    const { count, error: countError } = await supabase.from('universities').select('*', { count: 'exact', head: true });
    if (countError) {
        console.error('Count Error:', countError);
    } else {
        console.log('Total count in DB:', count);
    }
}

testInsert();
