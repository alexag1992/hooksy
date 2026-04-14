// Shared constants — no server-only imports, safe for Client Components
export const CREDIT_COSTS = {
  hooks: 1,
  ad_text: 2,
  image: 15,
} as const

export const DEMO_LIMITS = {
  hooks: 3,
  ads: 3,
  images: 3,
} as const

export type CreditAction = keyof typeof CREDIT_COSTS
