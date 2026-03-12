import { RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS } from '@/config/constants'

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Clean up expired entries periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store.entries()) {
      if (now > entry.resetAt) {
        store.delete(key)
      }
    }
  }, RATE_LIMIT_WINDOW_MS)
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
}

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || now > entry.resetAt) {
    // First request or window expired
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    }
    store.set(ip, newEntry)
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX - 1,
      resetAt: newEntry.resetAt,
    }
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    }
  }

  entry.count++
  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX - entry.count,
    resetAt: entry.resetAt,
  }
}
