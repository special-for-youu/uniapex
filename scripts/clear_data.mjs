import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const logFile = path.join(process.cwd(), 'clear_log.txt');
const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
};

fs.writeFileSync(logFile, ''); // Clear log

const envConfig = process.env;
const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
let supabaseKey = envConfig.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey || supabaseKey.length < 50) {
    log('⚠️ Service Role Key is missing or too short (likely placeholder). Using Anon Key.');
    supabaseKey = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

log(`Loaded Config Keys: ${JSON.stringify(Object.keys(envConfig).filter(k => k.includes('SUPABASE')))}`);
log(`URL: ${supabaseUrl}`);
log(`Key Length: ${supabaseKey ? supabaseKey.length : 0}`);
log(`Using Service Role Key: ${!!envConfig.SUPABASE_SERVICE_ROLE_KEY}`);

if (!supabaseUrl || !supabaseKey) {
    log('❌ Error: Supabase URL or Key not found in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearData() {
    log('🗑️  Clearing data from Supabase...');

    // Clear Universities
    const { data: deletedUni, error: uniError } = await supabase
        .from('universities')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000')
        .select();

    if (uniError) {
        log(`❌ Error clearing universities: ${uniError.message}`);
    } else {
        log(`✅ Universities table cleared. Deleted ${deletedUni ? deletedUni.length : 0} rows.`);
    }

    // Clear Extracurriculars
    const tables = ['extracurricular_activities', 'extracurriculars'];

    for (const table of tables) {
        const { data: deletedEx, error: exError } = await supabase
            .from(table)
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000')
            .select();

        if (exError) {
            if (exError.code !== '42P01') { // undefined_table
                log(`❌ Error clearing ${table}: ${exError.message}`);
            } else {
                log(`ℹ️  Table ${table} does not exist.`);
            }
        } else {
            log(`✅ ${table} table cleared. Deleted ${deletedEx ? deletedEx.length : 0} rows.`);
        }
    }
}

clearData();
