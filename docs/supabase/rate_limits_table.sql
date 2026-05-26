-- Rate limiting table for contact form abuse prevention
-- This table tracks request counts per IP address to prevent spam and abuse

CREATE TABLE IF NOT EXISTS rate_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_request TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_address ON rate_limits(ip_address);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start ON rate_limits(window_start);

-- Function to clean up old rate limit records (older than 2 hours)
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM rate_limits
  WHERE window_start < NOW() - INTERVAL '2 hours';
END;
$$ LANGUAGE plpgsql;

-- Set up automatic cleanup (run every hour)
-- Note: This requires the pg_cron extension. If not available, run cleanup manually via API.
-- SELECT cron.schedule('cleanup-rate-limits', '0 * * * *', 'SELECT cleanup_old_rate_limits()');

-- Grant necessary permissions (adjust based on your Supabase setup)
-- ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Service role can manage rate_limits" ON rate_limits
--   FOR ALL USING (auth.role() = 'service_role');
