-- ============================================================
-- 1. ADMINS TABLE (single source of truth)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.admins (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email      text        NOT NULL,
  role       text        NOT NULL DEFAULT 'admin'
               CHECK (role IN ('superadmin', 'admin', 'moderator')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for RLS subquery performance (critical)
CREATE INDEX IF NOT EXISTS idx_admins_user_id
  ON public.admins (user_id);

-- Case-insensitive unique email enforcement
CREATE UNIQUE INDEX IF NOT EXISTS idx_admins_email_lower
  ON public.admins (LOWER(email));

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_admins_updated_at ON public.admins;
CREATE TRIGGER set_admins_updated_at
  BEFORE UPDATE ON public.admins
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- 2. RLS ON ADMINS TABLE (plugs the data leak)
-- ============================================================
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read own record" ON public.admins;
DROP POLICY IF EXISTS "Service role full access on admins" ON public.admins;

-- Admins can only see their own row
CREATE POLICY "Admins read own record"
  ON public.admins FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Service role bypasses RLS (used for login verification server-side)
CREATE POLICY "Service role full access on admins"
  ON public.admins FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 3. CONTACT_REQUESTS RLS
-- ============================================================
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read contact_requests"   ON contact_requests;
DROP POLICY IF EXISTS "Admins can delete contact_requests" ON contact_requests;
DROP POLICY IF EXISTS "Admins can update contact_requests" ON contact_requests;
DROP POLICY IF EXISTS "Service role full access on contact_requests" ON contact_requests;

-- Admins can read
CREATE POLICY "Admins can read contact_requests"
  ON contact_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE public.admins.user_id = auth.uid()
    )
  );

-- Admins can delete
CREATE POLICY "Admins can delete contact_requests"
  ON contact_requests FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE public.admins.user_id = auth.uid()
    )
  );

-- Admins can update (e.g. mark as read/resolved)
CREATE POLICY "Admins can update contact_requests"
  ON contact_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE public.admins.user_id = auth.uid()
    )
  );

-- Service role can do everything (used by server routes for inserts)
CREATE POLICY "Service role full access on contact_requests"
  ON contact_requests FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
