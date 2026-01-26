-- Add new columns to articles table
alter table public.articles 
add column if not exists content text,
add column if not exists tags text[],
add column if not exists difficulty text check (difficulty in ('Easy', 'Medium', 'Hard', 'Not Specified')),
add column if not exists is_translation boolean default false,
add column if not exists read_more_text text default 'Read more';

-- Update existing rows to have default values if needed
update public.articles set difficulty = 'Not Specified' where difficulty is null;
update public.articles set read_more_text = 'Read more' where read_more_text is null;
