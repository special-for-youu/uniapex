-- Student OS (Talapker OS) - Database Schema
-- PostgreSQL Schema for Supabase with Row Level Security

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
-- Stores user profile information linked to auth.users
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    target_country TEXT, -- e.g., 'USA', 'KZ', 'Korea'
    current_gpa DECIMAL(3,2) CHECK (current_gpa >= 0 AND current_gpa <= 4.0),
    ielts_score DECIMAL(3,1) CHECK (ielts_score >= 0 AND ielts_score <= 9.0),
    sat_score INTEGER CHECK (sat_score >= 400 AND sat_score <= 1600),
    coins INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- UNIVERSITIES TABLE
-- ============================================
-- Stores university information aggregated from Unitap.org and other sources
CREATE TABLE universities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    city TEXT,
    ranking INTEGER, -- QS or local ranking
    tuition_fee INTEGER, -- Annual tuition in USD
    acceptance_rate DECIMAL(5,2), -- Percentage (e.g., 15.50 for 15.5%)
    requirements JSONB DEFAULT '{}', -- e.g., {"min_ielts": 6.5, "min_gpa": 3.5, "min_sat": 1200}
    website_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on requirements JSONB for efficient filtering
CREATE INDEX idx_universities_requirements ON universities USING GIN (requirements);
CREATE INDEX idx_universities_country ON universities(country);
CREATE INDEX idx_universities_ranking ON universities(ranking);

-- ============================================
-- PROGRAMS TABLE
-- ============================================
-- Stores specific programs offered by universities
CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    degree_level TEXT NOT NULL CHECK (degree_level IN ('bachelor', 'master', 'phd')),
    duration_years INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_programs_university_id ON programs(university_id);
CREATE INDEX idx_programs_degree_level ON programs(degree_level);

-- ============================================
-- SAVED_UNIVERSITIES TABLE
-- ============================================
-- Tracks universities saved/applied to by users
CREATE TABLE saved_universities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('saved', 'applied', 'accepted', 'rejected', 'waitlisted')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, university_id)
);

CREATE INDEX idx_saved_universities_user_id ON saved_universities(user_id);
CREATE INDEX idx_saved_universities_status ON saved_universities(status);

-- ============================================
-- AI_CHATS TABLE
-- ============================================
-- Stores AI chat interactions for IELTS checks and study plans
CREATE TABLE ai_chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('ielts_check', 'study_plan', 'general')),
    metadata JSONB DEFAULT '{}', -- e.g., {"band_score": 6.5, "feedback": {...}}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_chats_user_id ON ai_chats(user_id);
CREATE INDEX idx_ai_chats_type ON ai_chats(type);
CREATE INDEX idx_ai_chats_created_at ON ai_chats(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chats ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- UNIVERSITIES POLICIES
-- Anyone (authenticated) can view universities
CREATE POLICY "Anyone can view universities"
    ON universities FOR SELECT
    TO authenticated
    USING (true);

-- PROGRAMS POLICIES
-- Anyone (authenticated) can view programs
CREATE POLICY "Anyone can view programs"
    ON programs FOR SELECT
    TO authenticated
    USING (true);

-- SAVED_UNIVERSITIES POLICIES
-- Users can view their own saved universities
CREATE POLICY "Users can view own saved universities"
    ON saved_universities FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own saved universities
CREATE POLICY "Users can insert own saved universities"
    ON saved_universities FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own saved universities
CREATE POLICY "Users can update own saved universities"
    ON saved_universities FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own saved universities
CREATE POLICY "Users can delete own saved universities"
    ON saved_universities FOR DELETE
    USING (auth.uid() = user_id);

-- AI_CHATS POLICIES
-- Users can view their own AI chats
CREATE POLICY "Users can view own AI chats"
    ON ai_chats FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own AI chats
CREATE POLICY "Users can insert own AI chats"
    ON ai_chats FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_universities_updated_at
    BEFORE UPDATE ON universities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programs_updated_at
    BEFORE UPDATE ON programs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_universities_updated_at
    BEFORE UPDATE ON saved_universities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (OPTIONAL - for testing)
-- ============================================

-- Insert sample universities
INSERT INTO universities (name, country, city, ranking, tuition_fee, acceptance_rate, requirements, website_url) VALUES
('Nazarbayev University', 'Kazakhstan', 'Astana', 1, 0, 8.5, '{"min_ielts": 6.5, "min_gpa": 3.5, "min_sat": 1200}', 'https://nu.edu.kz'),
('KBTU', 'Kazakhstan', 'Almaty', 2, 3000, 25.0, '{"min_ielts": 6.0, "min_gpa": 3.0, "min_sat": 1100}', 'https://kbtu.kz'),
('MIT', 'USA', 'Cambridge', 1, 55000, 3.2, '{"min_ielts": 7.5, "min_gpa": 3.9, "min_sat": 1500}', 'https://mit.edu'),
('Stanford University', 'USA', 'Stanford', 3, 56000, 3.9, '{"min_ielts": 7.0, "min_gpa": 3.8, "min_sat": 1480}', 'https://stanford.edu'),
('Suleyman Demirel University', 'Kazakhstan', 'Almaty', 3, 2500, 30.0, '{"min_ielts": 5.5, "min_gpa": 2.8, "min_sat": 1000}', 'https://sdu.edu.kz');

-- Insert sample programs
INSERT INTO programs (university_id, name, degree_level, duration_years)
SELECT id, 'Computer Science', 'bachelor', 4 FROM universities WHERE name = 'KBTU'
UNION ALL
SELECT id, 'Business Administration', 'bachelor', 4 FROM universities WHERE name = 'Nazarbayev University'
UNION ALL
SELECT id, 'Artificial Intelligence', 'master', 2 FROM universities WHERE name = 'MIT';
