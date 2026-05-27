-- ============================================================
-- Supabase Migration: Enhance contact_requests table schema
-- Purpose: Add column constraints and improve data integrity
-- ============================================================

-- Step 1: Add NOT NULL constraints and VARCHAR limits to contact_requests table
-- (Alter existing columns to add constraints)

-- Note: These alterations assume the contact_requests table exists.
-- If column types need to be changed, they must be done carefully to avoid data loss.

-- Add constraints to existing columns (idempotent with CHECK constraint names)
ALTER TABLE IF EXISTS contact_requests
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN email SET NOT NULL,
  ALTER COLUMN message SET NOT NULL,
  ALTER COLUMN created_at SET NOT NULL;

-- Add CHECK constraints for field lengths
-- (These prevent inserts/updates that violate the length requirements)
ALTER TABLE IF EXISTS contact_requests
  ADD CONSTRAINT check_name_length CHECK (name IS NULL OR (length(name) >= 2 AND length(name) <= 202)),
  ADD CONSTRAINT check_email_length CHECK (email IS NULL OR length(email) <= 254),
  ADD CONSTRAINT check_message_length CHECK (message IS NULL OR (length(message) >= 10 AND length(message) <= 5000)),
  ADD CONSTRAINT check_phone_length CHECK (phone IS NULL OR length(phone) <= 30),
  ADD CONSTRAINT check_company_length CHECK (company IS NULL OR length(company) <= 100),
  ADD CONSTRAINT check_service_length CHECK (service IS NULL OR length(service) <= 100);

-- Step 2: Create or update indexes for optimal query performance

-- Index for pagination and filtering by created_at (critical for admin dashboard)
CREATE INDEX IF NOT EXISTS idx_contact_requests_created_at_desc 
  ON contact_requests (created_at DESC);

-- Index for email lookups (helps with spam detection, analytics)
CREATE INDEX IF NOT EXISTS idx_contact_requests_email 
  ON contact_requests (email);

-- Composite index for filtering by date range and status (future enhancement)
CREATE INDEX IF NOT EXISTS idx_contact_requests_created_status 
  ON contact_requests (created_at DESC, status) 
  WHERE status IS NOT NULL;

-- Step 3: Enable RLS (Row Level Security)
-- Service role bypasses RLS and is used only for server-side operations
-- Authenticated users cannot directly access contact_requests table

ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Service role full access on contact_requests" ON contact_requests;
DROP POLICY IF EXISTS "Admins can read contact_requests" ON contact_requests;
DROP POLICY IF EXISTS "Admins can delete contact_requests" ON contact_requests;
DROP POLICY IF EXISTS "Admins can update contact_requests" ON contact_requests;

-- Only service role (server-side) can insert contact submissions
-- This prevents direct client-side inserts and ensures validation
CREATE POLICY "Service role insert contact_requests"
  ON contact_requests FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Admins can read contact_requests via authenticated role
CREATE POLICY "Admins can read contact_requests"
  ON contact_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE public.admins.user_id = auth.uid()
    )
  );

-- Admins can delete contact_requests
CREATE POLICY "Admins can delete contact_requests"
  ON contact_requests FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE public.admins.user_id = auth.uid()
    )
  );

-- Admins can update contact_requests (e.g., mark as read/resolved)
CREATE POLICY "Admins can update contact_requests"
  ON contact_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE public.admins.user_id = auth.uid()
    )
  );

-- Service role has full access (used by server-side API routes)
CREATE POLICY "Service role full access on contact_requests"
  ON contact_requests FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Step 4: Add trigger to auto-update timestamps (if not exists)
-- This ensures updated_at is always current when a record changes

CREATE OR REPLACE FUNCTION update_contact_requests_timestamp()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_contact_requests_timestamp ON contact_requests;
CREATE TRIGGER update_contact_requests_timestamp
  BEFORE UPDATE ON contact_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_contact_requests_timestamp();

-- Step 5: Cleanup (remove orphaned rate limit records periodically)
-- Note: This should be a scheduled function call, not a trigger

-- Create a cleanup function for rate limit records older than 2 hours
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  DELETE FROM rate_limits 
  WHERE window_start < NOW() - INTERVAL '2 hours';
END;
$$;

-- Verify table constraints
-- SELECT constraint_name, table_name, constraint_type 
-- FROM information_schema.table_constraints 
-- WHERE table_name = 'contact_requests';
