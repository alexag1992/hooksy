export type Platform = 'youtube' | 'tiktok' | 'instagram' | 'telegram' | 'vk'
export type Locale = 'ru' | 'en'
export type GenerateStatus = 'idle' | 'loading' | 'success' | 'error'

export interface GenerateRequest {
  topic: string
  platform: Platform
  audience?: string
  locale: Locale
}

export interface GenerateResponse {
  hooks: string[]
  generationId: string
}

export interface AdGenerateRequest {
  hook: string
  topic: string
  platform: Platform
  audience?: string
  context?: string
  locale: Locale
  variants?: boolean
}

export interface AdGenerateResponse {
  ad_text?: string
  variants?: [string, string, string]
}

export interface PlatformConfig {
  id: Platform
  label: string
  emoji: string
}

export interface HookTemplate {
  id: string
  category: string
  categoryLabel: { ru: string; en: string }
  templates: {
    ru: string[]
    en: string[]
  }
}
