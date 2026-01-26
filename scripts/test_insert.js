import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function isCyrillic(text) {
    return /[а-яА-ЯЁё]/.test(text);
}

async function testInsert() {
    console.log('Testing insert of 2 items...');
    const unitapPath = path.join(__dirname, '../informations/unitap_final/data.json');
    const unitapData = JSON.parse(fs.readFileSync(unitapPath, 'utf8'));

    const itemsToInsert = [];

    for (const item of unitapData.slice(1, 2)) {
        const api = item.api_data || {};
        const name = api.universityName || item.name;

        let location = null;
        if (api.cityEN && api.country?.nameEN) {
            location = `${api.cityEN}, ${api.country.nameEN}`;
        } else if (api.cityEN) {
            location = api.cityEN;
        } else if (item.city && !isCyrillic(item.city)) {
            location = item.city;
        }

        let description = api.descriptionEN || api.fullDescriptionEN || item.description;
        if (isCyrillic(description)) {
            if (api.descriptionEN) description = api.descriptionEN;
            else if (api.fullDescriptionEN) description = api.fullDescriptionEN;
            else description = "Description not available in English.";
        }

        itemsToInsert.push({
            id: item.id,
            name: name,
            location: location,
            description: description,
            website: item.website || api.universityLink,
            image_url: item.image,
            logo_url: api.logo ? `https://unitap.org/assets/logos/${api.logo}` : null,
            admissions: {
                tuition: api.tuition,
                acceptance_rate: api.admissionPercent,
                requirements: {}
            },
            programs: [],
            // campus_life: [],
            // institution_type: null,
            // contact: null
        });
    }

    console.log(`Inserting ${itemsToInsert.length} items...`);

    const { data, error } = await supabase.from('universities').upsert(itemsToInsert).select();

    if (error) {
        console.error('Insert Error:', JSON.stringify(error, null, 2));
    } else {
        console.log(`Insert Success: ${data.length} items inserted.`);
    }
}

testInsert();
