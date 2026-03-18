-- Promo codes table
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code             TEXT UNIQUE NOT NULL,
  discount_percent INTEGER NOT NULL DEFAULT 20,
  is_single_use    BOOLEAN NOT NULL DEFAULT false,   -- true = one use per user
  max_uses         INTEGER,                           -- NULL = unlimited
  uses_count       INTEGER NOT NULL DEFAULT 0,
  expires_at       TIMESTAMPTZ,                       -- NULL = no expiry
  is_active        BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Tracks which users used which codes (prevents double-use per user)
CREATE TABLE IF NOT EXISTS public.promo_code_uses (
  id        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code_id   UUID REFERENCES public.promo_codes(id) ON DELETE CASCADE NOT NULL,
  user_id   UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  used_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(code_id, user_id)
);

-- RLS: only service role can access (admin client bypasses)
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_code_uses ENABLE ROW LEVEL SECURITY;
