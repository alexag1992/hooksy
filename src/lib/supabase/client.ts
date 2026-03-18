import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Fallback to placeholder during SSG build — real values are injected at runtime
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key'
  )
}
