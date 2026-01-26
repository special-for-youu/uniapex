-- Create Extracurricular Activities table
CREATE TABLE IF NOT EXISTS extracurricular_activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- 'Internship', 'Volunteering', 'Olympiad', 'Hackathon', 'Course'
    organization TEXT,
    location TEXT, -- 'Online', 'Almaty', 'Astana', etc.
    start_date DATE,
    end_date DATE,
    application_deadline DATE,
    website_url TEXT,
    tags TEXT[], -- ['Grade 10', 'Grade 11', 'Math', 'CS']
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE extracurricular_activities ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view activities
CREATE POLICY "Everyone can view activities" ON extracurricular_activities
    FOR SELECT USING (true);

-- Policy: Only service role can insert/update (for now)
-- (Implicitly denied for anon/authenticated unless policy exists)
