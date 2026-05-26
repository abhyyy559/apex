-- Seed an initial admin into public.admins using an existing auth.users entry.
-- Replace 'admin@apexdigital.studio' with the actual admin email in your Supabase Auth users.

INSERT INTO public.admins (user_id, email)
SELECT id, email FROM auth.users WHERE email = 'admin@apexdigital.studio'
ON CONFLICT (email) DO NOTHING;

-- Verify:
-- SELECT * FROM public.admins;
