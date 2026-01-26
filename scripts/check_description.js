
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkDescription() {
    const { data, error } = await supabase
        .from('universities')
        .select('name, description')
        .ilike('name', '%American College of Thessaloniki%')
        .limit(1)

    if (error) {
        console.error('Error:', error)
        return
    }

    if (data && data.length > 0) {
        console.log('Found University:')
        console.log(`Name: ${data[0].name}`)
        console.log('Description Start:')
        console.log(data[0].description.substring(0, 500)) // Print first 500 chars
        console.log('...')
    } else {
        console.log('University not found')
    }
}

checkDescription()
