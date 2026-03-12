export const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini'
export const HOOKS_COUNT = 10
export const MAX_TOPIC_LENGTH = 500
export const RATE_LIMIT_MAX = 10
export const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minute

export const LIMITS = {
  FREE_GENERATIONS_PER_DAY: 5,
  PRO_PRICE_MONTHLY: 9,
}
