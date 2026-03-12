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

export interface ImageGenerateRequest {
  hook?: string
  adText?: string
  prompt: string
  aspectRatio: string
  resolution: '1K' | '2K' | '4K'
  useContext: boolean
  references: string[] // base64 data URLs
}

export interface ImageGenerateResponse {
  image_url?: string
  error?: string
}

export interface GeneratedImage {
  id: string
  status: 'loading' | 'ready' | 'error'
  url?: string
  errorMsg?: string
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
