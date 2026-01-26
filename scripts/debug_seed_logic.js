import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

function isCyrillic(text) {
    return /[а-яА-ЯЁё]/.test(text);
}

async function debugLogic() {
    console.log('Starting Debug Logic...');
    const universities = [];

    const unitapPath = path.join(__dirname, '../informations/unitap_final/data.json');
    if (fs.existsSync(unitapPath)) {
        const unitapData = JSON.parse(fs.readFileSync(unitapPath, 'utf8'));
        console.log(`Found ${unitapData.length} universities in Unitap data.`);

        // Process first 5 items
        for (const item of unitapData.slice(0, 5)) {
            console.log(`Processing ${item.name}...`);
            const api = item.api_data || {};

            const name = api.universityName || item.name;
            console.log(`  Name: ${name}`);

            let location = null;
            if (api.cityEN && api.country?.nameEN) {
                location = `${api.cityEN}, ${api.country.nameEN}`;
            } else if (api.cityEN) {
                location = api.cityEN;
            } else if (item.city && !isCyrillic(item.city)) {
                location = item.city;
            }
            console.log(`  Location: ${location}`);

            let description = api.descriptionEN || api.fullDescriptionEN || item.description;
            console.log(`  Description (start): ${description ? description.substring(0, 50) : 'null'}`);
            console.log(`  Is Cyrillic: ${isCyrillic(description)}`);

            if (isCyrillic(description)) {
                if (api.descriptionEN) {
                    description = api.descriptionEN;
                    console.log('  Switched to descriptionEN');
                } else if (api.fullDescriptionEN) {
                    description = api.fullDescriptionEN;
                    console.log('  Switched to fullDescriptionEN');
                } else {
                    description = null;
                    console.log('  Fallback to null');
                }
            }

            universities.push({
                id: item.id,
                name: name,
                location: location,
                description: description
            });
        }
    }

    console.log(`Total universities extracted: ${universities.length}`);
    console.log(JSON.stringify(universities, null, 2));
}

debugLogic();
