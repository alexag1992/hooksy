-- Add is_admin flag to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

-- Give admin access to alexander.ageev1992@gmail.com
-- Run AFTER you log in once (so your profile row exists)
UPDATE public.profiles
SET is_admin = TRUE
WHERE email = 'alexander.ageev1992@gmail.com';
