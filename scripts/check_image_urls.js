
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkImageUrls() {
    const { data, error } = await supabase
        .from('universities')
        .select('name, image_url')
        .ilike('name', '%Czech%')
        .limit(10)

    if (error) {
        console.error('Error:', error)
        return
    }

    if (data && data.length > 0) {
        console.log('Found Universities:')
        data.forEach(uni => {
            console.log(`Name: ${uni.name}`)
            console.log(`Image URL: ${uni.image_url}`)
            console.log('---')
        })
    } else {
        console.log('No universities found matching "Czech"')
    }
}

checkImageUrls()
