-- Migration to add 'content' column to articles table
-- This allows storing full markdown content for articles

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'content') THEN
        ALTER TABLE public.articles ADD COLUMN content TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'author') THEN
        ALTER TABLE public.articles ADD COLUMN author TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'articles' AND column_name = 'published_at') THEN
        ALTER TABLE public.articles ADD COLUMN published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
    END IF;
END $$;

-- Update RLS policies to include new columns if necessary (usually not needed if policy is on table level)
