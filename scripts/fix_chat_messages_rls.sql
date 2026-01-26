-- Enable RLS on chat_messages if not already enabled
alter table chat_messages enable row level security;

-- Allow users to insert their own messages
-- We assume messages are linked to a session, and the session belongs to the user.
-- However, for simplicity and to match the previous fix, we'll check if the user is authenticated.
-- A better check would be to join with chat_sessions, but let's start with basic insert permission.
create policy "Users can insert own messages"
on chat_messages for insert
with check (auth.uid() = (select user_id from chat_sessions where id = session_id));

-- Allow users to view messages from their own sessions
create policy "Users can view own messages"
on chat_messages for select
using (auth.uid() = (select user_id from chat_sessions where id = session_id));

-- Grant access to authenticated users
grant all on chat_messages to authenticated;
grant all on chat_messages to service_role;
