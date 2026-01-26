-- UNINEXIA Database Setup Script
-- This script sets up the necessary tables and policies for the application.

-- 1. PROFILES TABLE
-- We use a simplified profiles table without a foreign key constraint to auth.users
-- to avoid issues during registration if the auth user isn't immediately available/visible.
-- The 'id' column will still store the auth.users.id.

DROP TABLE IF EXISTS profiles CASCADE;

CREATE TABLE profiles (
    id UUID PRIMARY KEY, -- Stores auth.users.id
    email TEXT,
    full_name TEXT,
    age INTEGER,
    grade TEXT,
    target_country TEXT,
    current_gpa NUMERIC(3,2),
    ielts_score NUMERIC(2,1),
    sat_score INTEGER,
    unt_score INTEGER,
    bio TEXT,
    interests TEXT[],
    qualities TEXT[],
    goals TEXT[],
    coins INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for development simplicity
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Create index for faster lookups by email
CREATE INDEX idx_profiles_email ON profiles(email);

-- 2. UNIVERSITIES TABLE
DROP TABLE IF EXISTS universities CASCADE;
CREATE TABLE universities (
    id TEXT PRIMARY KEY, -- Using TEXT to accommodate string IDs from JSON (e.g., "milan-university")
    name TEXT NOT NULL,
    location TEXT,
    description TEXT,
    website TEXT,
    image_url TEXT, -- Cover image
    logo_url TEXT, -- Logo image
    admissions JSONB, -- Stores fee, deadlines, acceptance rate, requirements, etc.
    programs TEXT[], -- Array of strings for filtering (e.g. ["Computer Science", "Business"])
    campus_life TEXT[], -- Array of strings (e.g. ["Athletics", "Greek Life"])
    institution_type TEXT, -- e.g. "Public", "Private"
    contact JSONB, -- Stores phone, social links, etc.
    tuition_range TEXT,
    scholarships JSONB, -- [{name, amount, description, eligibility}, ...]
    rankings JSONB, -- [{source, rank, year}, ...]
    admission_requirements JSONB, -- [{"name": "...", "nameEN": "...", "cost": "..."}]
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for development
ALTER TABLE universities DISABLE ROW LEVEL SECURITY;

-- 3. EXTRACURRICULAR ACTIVITIES
DROP TABLE IF EXISTS extracurricular_activities CASCADE;
CREATE TABLE extracurricular_activities (
    id TEXT PRIMARY KEY, -- Using TEXT to accommodate integer IDs from JSON (e.g., "879")
    title TEXT NOT NULL,
    category TEXT, -- Joined tags
    description TEXT,
    website_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for development
ALTER TABLE extracurricular_activities DISABLE ROW LEVEL SECURITY;

-- 4. CAREERS (BLS Data)
DROP TABLE IF EXISTS careers CASCADE;
CREATE TABLE careers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    salary_text TEXT,
    growth_rate TEXT,
    url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for development
ALTER TABLE careers DISABLE ROW LEVEL SECURITY;

-- 5. AI TUTOR CHAT HISTORY
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;

CREATE TABLE chat_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL, -- In production, link to auth.users
    title TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL, -- 'user' or 'assistant'
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for development
ALTER TABLE chat_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;

-- 6. SAVED UNIVERSITIES
DROP TABLE IF EXISTS saved_universities CASCADE;
CREATE TABLE saved_universities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL, -- In production, link to auth.users
    university_id TEXT REFERENCES universities(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'saved',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for development
ALTER TABLE saved_universities DISABLE ROW LEVEL SECURITY;

-- End of setup
