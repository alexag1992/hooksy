-- ============================================================
-- Hooksy Database Schema
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email      TEXT NOT NULL,
  name       TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User credits (balance for paid subscribers)
CREATE TABLE IF NOT EXISTS public.user_credits (
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  balance    INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Demo usage tracking
CREATE TABLE IF NOT EXISTS public.demo_usage (
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  hooks_used  INTEGER NOT NULL DEFAULT 0,   -- max 3
  ads_used    INTEGER NOT NULL DEFAULT 0,   -- max 3
  images_used INTEGER NOT NULL DEFAULT 0,   -- max 1
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                     UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status                 TEXT NOT NULL DEFAULT 'inactive', -- active | cancelled | expired
  credits_per_month      INTEGER DEFAULT 300,
  current_period_end     TIMESTAMPTZ,
  yokassa_subscription_id TEXT,
  created_at             TIMESTAMPTZ DEFAULT NOW()
);

-- Credit transaction log
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount     INTEGER NOT NULL,  -- negative = spend, positive = top-up
  action     TEXT NOT NULL,     -- 'hooks' | 'ad_text' | 'image' | 'subscription'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE public.profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_usage          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Credits (read-only for users; writes done server-side via service_role)
CREATE POLICY "Users can view own credits"
  ON public.user_credits FOR SELECT USING (auth.uid() = user_id);

-- Demo usage (read-only for users)
CREATE POLICY "Users can view own demo usage"
  ON public.demo_usage FOR SELECT USING (auth.uid() = user_id);

-- Subscriptions (read-only for users)
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Credit transactions (read-only for users)
CREATE POLICY "Users can view own transactions"
  ON public.credit_transactions FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- Trigger: auto-create profile + demo_usage on new sign-up
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.demo_usage (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
