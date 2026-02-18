-- Create a table to track API usage for rate limiting
CREATE TABLE IF NOT EXISTS api_rate_limits (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    request_count INT DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, endpoint)
);

-- Enable RLS
ALTER TABLE api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow users to view and update their own rate limit data (used by API)
CREATE POLICY "Users can manage own rate limits"
ON api_rate_limits
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_api_rate_limits_user_endpoint ON api_rate_limits(user_id, endpoint);
