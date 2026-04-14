import OpenAI from 'openai'

const apiKey = process.env.POLZA_AI_API_KEY || process.env.OPENAI_API_KEY
const baseURL = process.env.POLZA_AI_API_KEY
  ? 'https://api.polza.ai/v1'
  : undefined

if (!apiKey) {
  console.warn('No AI API key set. Using fallback templates.')
}

export const openai = new OpenAI({
  apiKey: apiKey || 'placeholder',
  baseURL,
})
