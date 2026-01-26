-- Add admission_requirements column to existing universities table
ALTER TABLE universities 
ADD COLUMN IF NOT EXISTS admission_requirements JSONB;

-- Update timestamp column
ALTER TABLE universities 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
