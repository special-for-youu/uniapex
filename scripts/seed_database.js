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

function extractRequirements(text) {
    if (!text) return {};
    const reqs = {};

    // Simple regex patterns to extract scores
    const gpaMatch = text.match(/GPA\s*(?:of|:)?\s*(\d+(?:\.\d+)?)/i);
    if (gpaMatch) reqs.min_gpa = parseFloat(gpaMatch[1]);

    const ieltsMatch = text.match(/IELTS\s*(?:score|of|:)?\s*(\d+(?:\.\d+)?)/i);
    if (ieltsMatch) reqs.min_ielts = parseFloat(ieltsMatch[1]);

    const satMatch = text.match(/SAT\s*(?:score|of|:)?\s*(\d{3,4})/i);
    if (satMatch) reqs.min_sat = parseInt(satMatch[1]);

    const toeflMatch = text.match(/TOEFL\s*(?:score|of|:)?\s*(\d{2,3})/i);
    if (toeflMatch) reqs.min_toefl = parseInt(toeflMatch[1]);

    return reqs;
}

// Helper to ensure we don't have Cyrillic if possible, or at least prioritize English
function isCyrillic(text) {
    return /[а-яА-ЯЁё]/.test(text);
}

async function seedUniversities() {
    console.log('Starting Universities seed...');
    const universities = [];

    // 1. Process Unitap Data
    try {
        const unitapPath = path.join(__dirname, '../informations/unitap_final/data.json');
        if (fs.existsSync(unitapPath)) {
            const unitapData = JSON.parse(fs.readFileSync(unitapPath, 'utf8'));
            console.log(`Found ${unitapData.length} universities in Unitap data.`);

            for (const item of unitapData) {
                // Prioritize English fields
                const api = item.api_data || {};

                // Name
                const name = api.universityName || item.name;

                // Location: CityEN + CountryEN
                let location = null;
                if (api.cityEN && api.country?.nameEN) {
                    location = `${api.cityEN}, ${api.country.nameEN}`;
                } else if (api.cityEN) {
                    location = api.cityEN;
                } else if (item.city && !isCyrillic(item.city)) {
                    location = item.city;
                }

                // Description: Prioritize EN
                let description = api.descriptionEN || api.fullDescriptionEN || item.description;

                if (isCyrillic(description)) {
                    if (api.descriptionEN) description = api.descriptionEN;
                    else if (api.fullDescriptionEN) description = api.fullDescriptionEN;
                    else {
                        // Fallback: if description is Russian, set it to null or a generic placeholder
                        description = null;
                    }
                }

                // Requirements
                const reqText = api.admission?.genDescriptionEN || description || "";
                const extractedReqs = extractRequirements(reqText);

                // Tuition
                const tuition = api.tuition || api.tuitionCost?.tuitionCost;

                // Image: Check local public folder first
                let imageUrl = item.image;
                const localImageName = path.basename(item.image || '');
                const localImagePath = path.join(__dirname, '../public/university_images', localImageName);

                if (localImageName && fs.existsSync(localImagePath)) {
                    imageUrl = `/university_images/${localImageName}`;
                }

                universities.push({
                    id: item.id,
                    name: name,
                    location: location,
                    description: description, // HTML
                    website: item.website || api.universityLink,
                    image_url: imageUrl, // Use local path if available
                    logo_url: null, // Removed unitap.org logo
                    admissions: {
                        tuition: tuition,
                        acceptance_rate: api.admissionPercent,
                        important_dates: api.importantDates,
                        requirements: extractedReqs,
                        requirements_text: api.admission?.genDescriptionEN || null
                    },
                });
            }
        } else {
            console.warn('Unitap data file not found:', unitapPath);
        }
    } catch (e) {
        console.error('Error processing Unitap data:', e);
    }

    // 2. Process CommonApp Data
    try {
        const commonAppPath = path.join(__dirname, '../informations/commonapp_data/commonapp_complete.json');
        if (fs.existsSync(commonAppPath)) {
            const commonAppData = JSON.parse(fs.readFileSync(commonAppPath, 'utf8'));
            console.log(`Found ${commonAppData.length} universities in CommonApp data.`);

            for (const item of commonAppData) {
                // Check for duplicates by ID
                if (!universities.find(u => u.id === item.id)) {
                    const extractedReqs = extractRequirements(item.admissions?.requirements_text || item.description);

                    universities.push({
                        id: item.id,
                        name: item.name,
                        location: item.location,
                        description: item.description,
                        website: item.contact?.website,
                        image_url: item.images?.cover,
                        logo_url: item.images?.logo,
                        admissions: {
                            acceptance_rate: item.admissions?.acceptance_rate,
                            requirements: extractedReqs,
                            requirements_text: item.admissions?.requirements_text || null
                        },
                        programs: item.tags?.programs || [],
                        campus_life: item.tags?.campus_life || [],
                        institution_type: item.meta?.institution_type || null,
                        contact: item.contact || null
                    });
                }
            }
        } else {
            console.warn('CommonApp data file not found:', commonAppPath);
        }
    } catch (e) {
        console.error('Error processing CommonApp data:', e);
    }

    console.log(`Total universities to insert: ${universities.length}`);

    // Insert in batches
    const BATCH_SIZE = 10; // Reduced batch size
    for (let i = 0; i < universities.length; i += BATCH_SIZE) {
        const batch = universities.slice(i, i + BATCH_SIZE);
        const { error } = await supabase.from('universities').upsert(batch, { onConflict: 'id' });
        if (error) {
            console.error(`Error inserting universities batch ${i}:`, JSON.stringify(error, null, 2));
        } else {
            // console.log(`Inserted universities batch ${i} - ${i + batch.length}`);
        }
        // Log progress every 100 items
        if (i % 100 === 0) console.log(`Processed ${i} items...`);
    }
    console.log('Universities seed completed.');

    // Verify count
    const { count, error } = await supabase.from('universities').select('*', { count: 'exact', head: true });
    console.log(`Final Universities Count: ${count}`);
}

async function seedExtracurriculars() {
    console.log('Starting Extracurriculars seed...');
    const activities = [];

    try {
        const illuminatePath = path.join(__dirname, '../informations/illuminate/extracurriculars.json');
        if (fs.existsSync(illuminatePath)) {
            const illuminateData = JSON.parse(fs.readFileSync(illuminatePath, 'utf8'));
            console.log(`Found ${illuminateData.length} extracurriculars.`);

            for (const item of illuminateData) {
                activities.push({
                    id: String(item.id), // Ensure ID is string
                    title: item.name,
                    category: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags,
                    description: item.description,
                    website_url: item.website
                });
            }
        } else {
            console.warn('Extracurriculars data file not found:', illuminatePath);
        }
    } catch (e) {
        console.error('Error processing Extracurriculars data:', e);
    }

    // Insert in batches
    const BATCH_SIZE = 50;
    for (let i = 0; i < activities.length; i += BATCH_SIZE) {
        const batch = activities.slice(i, i + BATCH_SIZE);
        const { error } = await supabase.from('extracurricular_activities').upsert(batch, { onConflict: 'id' });
        if (error) {
            console.error(`Error inserting extracurriculars batch ${i}:`, error);
        }
    }
    console.log('Extracurriculars seed completed.');
}

async function main() {
    // Clear existing data
    console.log('Clearing existing data...');
    const { error: delUniError } = await supabase.from('universities').delete().neq('id', 'placeholder');
    if (delUniError) console.error('Error clearing universities:', delUniError);

    const { error: delExtError } = await supabase.from('extracurricular_activities').delete().neq('id', 'placeholder');
    if (delExtError) console.error('Error clearing extracurriculars:', delExtError);

    await seedUniversities();
    await seedExtracurriculars();
}

main().catch(console.error);
