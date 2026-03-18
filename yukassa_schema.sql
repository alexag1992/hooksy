-- Migration: add YuKassa payment columns to subscriptions table
-- Run this in Supabase SQL Editor

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS plan         TEXT DEFAULT 'base',
  ADD COLUMN IF NOT EXISTS payment_id   TEXT,
  ADD COLUMN IF NOT EXISTS activated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS expires_at   TIMESTAMPTZ;

-- Also ensure credit_transactions has created_at (should exist, but just in case)
ALTER TABLE public.credit_transactions
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
