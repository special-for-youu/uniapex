import dotenv from 'dotenv'
import fs from 'fs/promises'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function importAdmissionRequirements() {
    try {
        console.log('Loading data_rich.json...')
        const jsonPath = path.join(__dirname, '../informations/unitap_final/data_rich.json')
        const jsonData = await fs.readFile(jsonPath, 'utf-8')
        const universities = JSON.parse(jsonData)

        console.log(`Found ${universities.length} universities`)

        let updated = 0
        let errors = 0

        for (const uni of universities) {
            try {
                const universityId = uni.id

                // Extract ALL admission requirements from ALL scholarships/discounts
                let admissionRequirements = []

                if (uni.api_data?.discount && Array.isArray(uni.api_data.discount) && uni.api_data.discount.length > 0) {
                    // Get requirements from ALL discounts
                    const allRequirements = []

                    for (const discount of uni.api_data.discount) {
                        if (discount.requirements && Array.isArray(discount.requirements)) {
                            allRequirements.push(...discount.requirements)
                        }
                    }

                    // De-duplicate by nameEN and keep only English versions
                    const uniqueRequirements = new Map()

                    for (const req of allRequirements) {
                        const key = req.nameEN || req.name
                        if (key && !uniqueRequirements.has(key)) {
                            uniqueRequirements.set(key, {
                                name: req.nameEN || req.name,
                                cost: req.cost || null
                            })
                        }
                    }

                    admissionRequirements = Array.from(uniqueRequirements.values())
                }

                // Update university with admission requirements
                if (admissionRequirements.length > 0) {
                    const { error } = await supabase
                        .from('universities')
                        .update({ admission_requirements: admissionRequirements })
                        .eq('id', universityId)

                    if (error) {
                        console.error(`Error updating ${universityId}:`, error.message)
                        errors++
                    } else {
                        updated++
                        if (updated % 10 === 0) {
                            console.log(`Progress: ${updated} universities updated...`)
                        }
                    }
                }
            } catch (err) {
                console.error(`Error processing university ${uni.id}:`, err.message)
                errors++
            }
        }

        console.log('\n=== Import Complete ===')
        console.log(`Updated: ${updated} universities`)
        console.log(`Errors: ${errors}`)

    } catch (error) {
        console.error('Failed to import admission requirements:', error)
        process.exit(1)
    }
}

importAdmissionRequirements()
