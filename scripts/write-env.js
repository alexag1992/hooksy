const fs = require('fs')

const vars = [
  'OPENAI_API_KEY',
  'OPENAI_MODEL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'POLZA_AI_API_KEY',
  'YUKASSA_SHOP_ID',
  'YUKASSA_SECRET_KEY',
  'YUKASSA_WEBHOOK_SECRET',
]

const lines = vars
  .filter(v => process.env[v])
  .map(v => `${v}=${process.env[v]}`)

fs.writeFileSync('.env.local', lines.join('\n'))
console.log('Written .env.local with', lines.length, 'vars')
