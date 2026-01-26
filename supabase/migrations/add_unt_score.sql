-- Add UNT score to profiles table
ALTER TABLE profiles 
ADD COLUMN unt_score INTEGER CHECK (unt_score >= 0 AND unt_score <= 140);

-- Add bio and other fields for registration if they don't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS grade TEXT,
ADD COLUMN IF NOT EXISTS interests TEXT[],
ADD COLUMN IF NOT EXISTS qualities TEXT[],
ADD COLUMN IF NOT EXISTS goals TEXT[];
