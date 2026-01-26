import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For client components
export const createSupabaseClient = () => createClientComponentClient()

// Auth helper functions
export async function getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
}

export async function signInWithEmail(email: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
        },
    })
    if (error) throw error
    return data
}

export async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

export async function getProfile(userId: string, supabaseClient = supabase): Promise<Profile | null> {
    const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    if (error) {
        if (error.code === 'PGRST116') return null // Profile doesn't exist
        throw error
    }
    return data
}

export async function createProfile(userId: string, email: string, supabaseClient = supabase) {
    const { data, error } = await supabaseClient
        .from('profiles')
        .insert({
            id: userId,
            email,
        })
        .select()
        .single()

    if (error) throw error
    return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>, supabaseClient = supabase) {
    const { data, error } = await supabaseClient
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

    if (error) throw error
    return data
}

// Types for database tables
export interface Profile {
    id: string
    email: string
    full_name: string | null
    target_country: string | null
    current_gpa: number | null
    ielts_score: number | null
    sat_score: number | null
    unt_score?: number
    bio?: string
    age?: number
    grade?: string
    interests?: string[]
    qualities?: string[]
    goals?: string[]
    coins: number
    created_at: string
    updated_at: string
}

export interface University {
    id: string
    name: string
    country: string
    city: string | null
    ranking: number | null
    tuition_fee: number | null
    acceptance_rate: number | null
    requirements: {
        min_ielts?: number
        min_gpa?: number
        min_sat?: number
        min_unt?: number
    }
    website_url: string | null
    created_at: string
    updated_at: string
}

export interface Program {
    id: string
    university_id: string
    name: string
    degree_level: 'bachelor' | 'master' | 'phd'
    duration_years: number | null
    created_at: string
    updated_at: string
}

export interface SavedUniversity {
    id: string
    user_id: string
    university_id: string
    status: 'saved' | 'applied' | 'accepted' | 'rejected' | 'waitlisted'
    notes: string | null
    created_at: string
    updated_at: string
}

export interface AIChat {
    id: string
    user_id: string
    message: string
    response: string
    type: 'ielts_check' | 'study_plan' | 'general'
    metadata: any
    created_at: string
}
