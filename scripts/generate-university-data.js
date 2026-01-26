import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { GoogleGenAI } from '@google/genai'
import fs from 'fs'
import path from 'path'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

// Progress file to track last processed university
const PROGRESS_FILE = path.join(process.cwd(), 'scripts', 'generation-progress.json')
// User requested to start from 22 (skipping first 22 items, index 0-21)
const MANUAL_START_INDEX = 22

function loadProgress() {
    try {
        if (fs.existsSync(PROGRESS_FILE)) {
            const data = fs.readFileSync(PROGRESS_FILE, 'utf8')
            return JSON.parse(data)
        }
    } catch (error) {
        console.error('Error loading progress file:', error)
    }
    return null
}

function saveProgress(lastProcessedId, processedCount, lastIndex) {
    try {
        fs.writeFileSync(PROGRESS_FILE, JSON.stringify({
            lastProcessedId,
            processedCount,
            lastIndex,
            timestamp: new Date().toISOString()
        }, null, 2))
    } catch (error) {
        console.error('Error saving progress:', error)
    }
}

async function generateUniversityData(university) {
    const prompt = `You are a precise and helpful academic data specialist. Your task is to provide admissions data for the specific university requested by the user.

CRITICAL CONTEXT: These requirements are for INTERNATIONAL STUDENTS from countries like Kazakhstan, who are seeking SCHOLARSHIPS or SIGNIFICANT FINANCIAL AID. Requirements should reflect what's needed to be COMPETITIVE for merit-based aid.

Your response must strictly adhere to the following rules:
1. **Level:** Data must be exclusively for **Undergraduate (Bachelor's) or Foundation** programs.
2. **Accuracy:** Use the most recent, single, exact numerical values available (e.g., use '65' instead of '60-70'). If a range is the only option for a 'Min' requirement, use the COMPETITIVE threshold (higher than bare minimum).
3. **Language:** The entire response, including the university name, table content, and notes, must be in **English**.
4. **Dates:** Application deadline can be approximate (e.g., "January", "Early February", "Mid-March").
5. **Data Basis:** Figures are based on the **2025/2026 academic year**, representing the best forecast for 2026.
6. **CRITICAL - Competitive Requirements:** 
   - **GPA:** NEVER below 3.4 on a 4.0 scale. For top universities (Ivy League, MIT, Stanford), use 3.8-3.95. For mid-tier, use 3.5-3.7. For accessible universities, use 3.4-3.5.
   - **IELTS:** NEVER below 6.5. For top universities, use 7.0-7.5. For others, use 6.5-7.0.
   - **SAT:** NEVER below 1250. For top universities, use 1450-1550. For mid-tier, use 1300-1400. For accessible universities, use 1250-1350.
   - These are COMPETITIVE scores for international students seeking scholarships, NOT bare minimums.

University: "${university.name}" in ${university.location}

Format the data strictly as a markdown table using the following exact metrics:

| Metric | Data | Notes |
| :--- | :--- | :--- |
| Acceptance Rate (%) | [Number] | |
| Min IELTS (Overall) | [Number - MUST BE ≥6.5 for scholarship consideration] | |
| Min GPA (4.0 scale) | [Number - MUST BE ≥3.4 for scholarship consideration] | |
| Min SAT (Composite) | [Number - MUST BE ≥1250 for scholarship consideration] | |
| Application Deadline | [Month or approximate period] | |
| UG Enrollment Size | [Number] | |
| Int'l Students (%) | [Number] | |`

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        })

        const text = response.text.trim()

        // Parse markdown table
        const lines = text.split('\n').filter(line => line.includes('|'))
        const data = {}

        for (const line of lines) {
            const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell)
            if (cells.length >= 2 && !cells[0].includes('Metric')) {
                const metric = cells[0]
                const value = cells[1]

                if (metric.includes('Acceptance Rate')) {
                    data.acceptance_rate = parseFloat(value) || 50
                } else if (metric.includes('Min IELTS')) {
                    const ielts = parseFloat(value.replace(/[^0-9.]/g, ''))
                    data.min_ielts = (ielts >= 6.5 && ielts <= 9.0) ? ielts : 6.5
                } else if (metric.includes('Min GPA')) {
                    const gpa = parseFloat(value.replace(/[^0-9.]/g, ''))
                    data.min_gpa = (gpa >= 3.4 && gpa <= 4.0) ? gpa : 3.5
                } else if (metric.includes('Min SAT')) {
                    const sat = parseInt(value.replace(/[^0-9]/g, ''))
                    data.min_sat = (sat >= 1250 && sat <= 1600) ? sat : 1300
                } else if (metric.includes('Application Deadline')) {
                    data.application_deadline = value || 'January'
                } else if (metric.includes('UG Enrollment')) {
                    data.enrollment_size = parseInt(value.replace(/,/g, '')) || 10000
                } else if (metric.includes('Int')) {
                    data.international_students_percent = parseFloat(value) || 10
                }
            }
        }

        // Ensure required fields always have scholarship-competitive values
        if (!data.min_ielts || data.min_ielts < 6.5) data.min_ielts = 6.5
        if (!data.min_gpa || data.min_gpa < 3.4) data.min_gpa = 3.5
        if (!data.min_sat || data.min_sat < 1250) data.min_sat = 1300

        return data
    } catch (error) {
        console.error(`Error generating data for ${university.name}:`, error)
        return {
            acceptance_rate: 50,
            min_ielts: 6.5,
            min_gpa: 3.5,
            min_sat: 1300,
            application_deadline: 'January',
            enrollment_size: 10000,
            international_students_percent: 10
        }
    }
}

async function updateUniversities() {
    console.log('📚 Fetching ALL universities from database...')

    // Fetch all data
    const { count } = await supabase
        .from('universities')
        .select('*', { count: 'exact', head: true })

    console.log(`📊 Total universities in database: ${count}`)

    const { data: universities, error } = await supabase
        .from('universities')
        .select('id, name, location')
        .order('id')
        .range(0, 5000)

    if (error) {
        console.error('Error fetching universities:', error)
        return
    }

    // Determine start index
    let startIndex = 0
    const progress = loadProgress()

    if (progress && progress.lastIndex !== undefined) {
        startIndex = progress.lastIndex + 1
        console.log(`📌 Resuming from progress file (Index: ${startIndex}, ID: ${progress.lastProcessedId})`)
    } else {
        startIndex = MANUAL_START_INDEX
        console.log(`📌 Starting from manual index: ${startIndex} (Skipping first ${startIndex} universities)`)
    }

    const totalToProcess = universities.length - startIndex

    if (totalToProcess <= 0) {
        console.log('✅ All universities have been processed!')
        return
    }

    console.log(`Found ${universities.length} total. Processing ${totalToProcess} universities starting from index ${startIndex}.`)
    console.log(`⏱️  Estimated time: ~${Math.ceil(totalToProcess * 6 / 60)} minutes`)

    let processed = 0
    let failed = 0

    for (let i = startIndex; i < universities.length; i++) {
        const uni = universities[i]
        try {
            console.log(`\n[${i + 1}/${universities.length}] Processing: ${uni.name}`)

            const generatedData = await generateUniversityData(uni)

            console.log('  Generated data:', generatedData)

            const { error: updateError } = await supabase
                .from('universities')
                .update(generatedData)
                .eq('id', uni.id)

            if (updateError) {
                console.error('  ❌ Update failed:', updateError.message)
                failed++
            } else {
                console.log('  ✅ Updated successfully')
                processed++
                // Save progress
                saveProgress(uni.id, processed, i)
            }

            // Rate limiting - wait 6 seconds to stay under 10 RPM limit
            await new Promise(resolve => setTimeout(resolve, 6000))

        } catch (error) {
            console.error(`  ❌ Error processing ${uni.name}:`, error.message)
            failed++
        }
    }

    console.log('\n' + '='.repeat(50))
    console.log(`✅ Session Processed: ${processed}`)
    console.log(`❌ Failed: ${failed}`)
    console.log('='.repeat(50))
}

// Run the script
updateUniversities()
    .then(() => {
        console.log('\n🎉 All done!')
        process.exit(0)
    })
    .catch(error => {
        console.error('Fatal error:', error)
        process.exit(1)
    })
