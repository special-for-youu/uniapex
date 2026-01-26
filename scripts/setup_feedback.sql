-- Create feedback table
create table if not exists feedback (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  user_email text not null,
  title text not null,
  description text not null,
  status text default 'pending' check (status in ('pending', 'replied')),
  admin_reply text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table feedback enable row level security;

-- Policies
-- Users can read their own feedback
create policy "Users can read own feedback"
  on feedback for select
  using (auth.uid() = user_id);

-- Users can insert their own feedback
create policy "Users can insert own feedback"
  on feedback for insert
  with check (auth.uid() = user_id);

-- Admins can read all feedback (assuming you have an admin check or just use service role key in API)
-- For now, we'll rely on the API using the service role key for admin actions, 
-- but if you want to use the client for admin, you'd need an admin policy.
-- Since we are using a custom admin dashboard that might use the client, let's add a policy for specific emails if needed,
-- OR just allow public read if that's not sensitive (it IS sensitive).
-- BETTER: The Admin Dashboard currently uses `localStorage` for auth, which is insecure for RLS.
-- However, the `AdminDashboard` page uses `supabase.from('articles')`.
-- We should probably stick to server-side API for admin actions to be safe, OR just enable public read for now if the user accepts the risk (as per previous security audit).
-- Given the user's previous instruction to "fix" RLS, we should be careful.
-- Let's stick to: Users read own. API (Service Role) reads all.

-- Grant access to authenticated users
grant all on feedback to authenticated;
grant all on feedback to service_role;
