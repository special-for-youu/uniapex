-- 1. Enable RLS on ALL tables
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ai_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS saved_universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS articles ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts (Fixes "policy already exists" error)

-- PROFILES
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- UNIVERSITIES
DROP POLICY IF EXISTS "Anyone can view universities" ON universities;
DROP POLICY IF EXISTS "Universities are viewable by everyone" ON universities;

-- PROGRAMS
DROP POLICY IF EXISTS "Programs are viewable by everyone" ON programs;

-- SAVED_UNIVERSITIES
DROP POLICY IF EXISTS "Users can view their own saved universities" ON saved_universities;
DROP POLICY IF EXISTS "Users can view own saved universities" ON saved_universities;
DROP POLICY IF EXISTS "Users can insert their own saved universities" ON saved_universities;
DROP POLICY IF EXISTS "Users can insert own saved universities" ON saved_universities;
DROP POLICY IF EXISTS "Users can delete their own saved universities" ON saved_universities;
DROP POLICY IF EXISTS "Users can delete own saved universities" ON saved_universities;

-- TEST_RESULTS
DROP POLICY IF EXISTS "Users can view their own test results" ON test_results;
DROP POLICY IF EXISTS "Users can view own test results" ON test_results;
DROP POLICY IF EXISTS "Users can insert their own test results" ON test_results;
DROP POLICY IF EXISTS "Users can insert own test results" ON test_results;

-- AI_CHATS
DROP POLICY IF EXISTS "Users can view own chats" ON ai_chats;
DROP POLICY IF EXISTS "Users can insert own chats" ON ai_chats;

-- ARTICLES
DROP POLICY IF EXISTS "Articles are viewable by everyone" ON articles;

-- 3. Create RLS Policies (Idempotent: Drops first, then Creates)

-- PROFILES
-- View: Authenticated users can view their own profile.
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- Insert: Users can insert their own profile.
CREATE POLICY "Users can insert own profile" 
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- Update: Users can update their own profile.
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- UNIVERSITIES
-- View: Public (anyone can view)
CREATE POLICY "Universities are viewable by everyone" 
ON universities FOR SELECT 
TO anon, authenticated 
USING (true);

-- PROGRAMS
-- View: Public
CREATE POLICY "Programs are viewable by everyone" 
ON programs FOR SELECT 
TO anon, authenticated 
USING (true);

-- SAVED_UNIVERSITIES
-- Select: Users can see their own saved items
CREATE POLICY "Users can view own saved universities" 
ON saved_universities FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Insert: Users can save universities for themselves
CREATE POLICY "Users can insert own saved universities" 
ON saved_universities FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Delete: Users can remove their own saved items
CREATE POLICY "Users can delete own saved universities" 
ON saved_universities FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- TEST_RESULTS
-- Select: Users can view their own results
CREATE POLICY "Users can view own test results" 
ON test_results FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Insert: Users can save their test results
CREATE POLICY "Users can insert own test results" 
ON test_results FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- AI_CHATS
-- Select: Users can view their own chats
CREATE POLICY "Users can view own chats" 
ON ai_chats FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Insert: Users can create chats
CREATE POLICY "Users can insert own chats" 
ON ai_chats FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- ARTICLES
-- View: Public
CREATE POLICY "Articles are viewable by everyone" 
ON articles FOR SELECT 
TO anon, authenticated 
USING (true);

-- No explicit policies for other operations (INSERT/UPDATE/DELETE) means they are RESTRICTED to service_role (Admin) by default when RLS is enabled.
