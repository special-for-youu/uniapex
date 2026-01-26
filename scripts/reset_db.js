const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function resetUniversities() {
    console.log('Deleting all universities...');
    const { error } = await supabase.from('universities').delete().neq('id', 'placeholder'); // Delete all
    if (error) {
        console.error('Error deleting universities:', error);
    } else {
        console.log('All universities deleted.');
    }
}

resetUniversities();
