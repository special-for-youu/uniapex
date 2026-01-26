-- Create articles table
create table if not exists public.articles (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  image_url text not null,
  link_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.articles enable row level security;

-- Create policies
-- Everyone can view articles
create policy "Everyone can view articles"
  on public.articles for select
  using (true);

-- Only authenticated users (admins in this context, though we are using a shared password for the UI, 
-- for DB security we might want to restrict this further, but for now we'll allow authenticated users 
-- or just rely on the UI protection as requested by the user. 
-- Ideally, we'd have an 'admin' role, but to keep it simple as requested:
-- We will allow insert/update/delete for now, but in a real app this should be restricted to specific users.)

create policy "Authenticated users can insert articles"
  on public.articles for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update articles"
  on public.articles for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete articles"
  on public.articles for delete
  using (auth.role() = 'authenticated');
