-- Create user_todos table
create table if not exists public.user_todos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  task text not null,
  is_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.user_todos enable row level security;

-- Create policies
create policy "Users can view their own todos"
  on public.user_todos for select
  using (auth.uid() = user_id);

create policy "Users can insert their own todos"
  on public.user_todos for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own todos"
  on public.user_todos for update
  using (auth.uid() = user_id);

create policy "Users can delete their own todos"
  on public.user_todos for delete
  using (auth.uid() = user_id);
