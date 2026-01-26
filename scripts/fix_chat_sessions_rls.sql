-- Enable RLS on chat_sessions if not already enabled
alter table chat_sessions enable row level security;

-- Allow users to insert their own sessions
create policy "Users can insert own sessions"
on chat_sessions for insert
with check (auth.uid() = user_id);

-- Allow users to view their own sessions
create policy "Users can view own sessions"
on chat_sessions for select
using (auth.uid() = user_id);

-- Allow users to update their own sessions
create policy "Users can update own sessions"
on chat_sessions for update
using (auth.uid() = user_id);

-- Allow users to delete their own sessions
create policy "Users can delete own sessions"
on chat_sessions for delete
using (auth.uid() = user_id);

-- Grant access to authenticated users
grant all on chat_sessions to authenticated;
grant all on chat_sessions to service_role;
