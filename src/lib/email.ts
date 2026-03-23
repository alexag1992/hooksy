// Email sender using Resend REST API
// Requires RESEND_API_KEY env var

const FROM = 'Хукси <noreply@hooksy.ru>'
const RESEND_API = 'https://api.resend.com/emails'

async function send(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[email] RESEND_API_KEY not set, skipping email to', to)
    return
  }
  try {
    const res = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM, to: [to], subject, html }),
    })
    if (!res.ok) {
      const err = await res.text()
      console.error('[email] Resend error:', err)
    }
  } catch (e) {
    console.error('[email] Failed to send email:', e)
  }
}

function baseTemplate(content: string) {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Хукси</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#00D4FF,#8B5CF6);padding:32px 40px;text-align:center;">
              <span style="font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">⚡ Хукси</span>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #f0f0f0;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                © 2026 Хукси · ООО «ЛАЙФ МЕДИА»<br/>
                <a href="https://hooksy.ru" style="color:#00D4FF;text-decoration:none;">hooksy.ru</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function sendWelcomeEmail(to: string, name?: string) {
  const greeting = name ? `Привет, ${name.split(' ')[0]}!` : 'Привет!'
  const html = baseTemplate(`
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827;">${greeting}</h1>
    <p style="margin:0 0 24px;font-size:16px;color:#6b7280;">Добро пожаловать в Хукси — генератор вирусных хуков для соцсетей.</p>

    <p style="margin:0 0 16px;font-size:15px;color:#374151;">Вам доступно <strong>3 бесплатные цепочки</strong>:</p>
    <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;width:100%;">
      <tr>
        <td style="padding:10px 16px;background:#f9fafb;border-radius:8px;margin-bottom:8px;font-size:14px;color:#374151;">
          ⚡ До 3 хуков для любой платформы
        </td>
      </tr>
      <tr><td style="height:8px;"></td></tr>
      <tr>
        <td style="padding:10px 16px;background:#f9fafb;border-radius:8px;margin-bottom:8px;font-size:14px;color:#374151;">
          📝 До 3 рекламных текстов объявлений
        </td>
      </tr>
      <tr><td style="height:8px;"></td></tr>
      <tr>
        <td style="padding:10px 16px;background:#f9fafb;border-radius:8px;font-size:14px;color:#374151;">
          🎨 До 3 изображений-креативов
        </td>
      </tr>
    </table>

    <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;width:100%;">
      <tr>
        <td align="center">
          <a href="https://hooksy.ru" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#00D4FF,#8B5CF6);color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:10px;">
            Начать генерацию →
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0;font-size:13px;color:#9ca3af;">
      Если у вас есть вопросы — пишите на
      <a href="mailto:lifemediasmm@gmail.com" style="color:#00D4FF;text-decoration:none;">lifemediasmm@gmail.com</a>
    </p>
  `)
  await send(to, 'Добро пожаловать в Хукси! ⚡', html)
}

export async function sendSubscriptionEmail(to: string, credits: number = 300) {
  const html = baseTemplate(`
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827;">Подписка активирована! 🎉</h1>
    <p style="margin:0 0 24px;font-size:16px;color:#6b7280;">Ваша подписка Хукси База успешно активирована на 30 дней.</p>

    <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;width:100%;background:#f0fdf4;border-radius:12px;border:1px solid #bbf7d0;">
      <tr>
        <td style="padding:20px;text-align:center;">
          <p style="margin:0 0 4px;font-size:36px;font-weight:800;color:#059669;">${credits}</p>
          <p style="margin:0;font-size:14px;color:#6b7280;">кредитов зачислено на счёт</p>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 16px;font-size:15px;color:#374151;">На что хватит кредитов:</p>
    <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;width:100%;">
      <tr>
        <td style="padding:10px 16px;background:#f9fafb;border-radius:8px;font-size:14px;color:#374151;">
          ⚡ До 300 хуков (1 кр/шт)
        </td>
      </tr>
      <tr><td style="height:8px;"></td></tr>
      <tr>
        <td style="padding:10px 16px;background:#f9fafb;border-radius:8px;font-size:14px;color:#374151;">
          📝 До 150 текстов объявлений (2 кр/шт)
        </td>
      </tr>
      <tr><td style="height:8px;"></td></tr>
      <tr>
        <td style="padding:10px 16px;background:#f9fafb;border-radius:8px;font-size:14px;color:#374151;">
          🎨 До 20 изображений-креативов (15 кр/шт)
        </td>
      </tr>
    </table>

    <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;width:100%;">
      <tr>
        <td align="center">
          <a href="https://hooksy.ru" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#00D4FF,#8B5CF6);color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:10px;">
            Начать генерацию →
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:0;font-size:13px;color:#9ca3af;">
      Вопросы? Пишите на
      <a href="mailto:lifemediasmm@gmail.com" style="color:#00D4FF;text-decoration:none;">lifemediasmm@gmail.com</a>
    </p>
  `)
  await send(to, 'Подписка Хукси активирована ✅', html)
}

export async function sendCreditsEmail(to: string, credits: number = 100) {
  const html = baseTemplate(`
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827;">Кредиты зачислены! ⚡</h1>
    <p style="margin:0 0 24px;font-size:16px;color:#6b7280;">Дополнительные кредиты успешно добавлены на ваш счёт.</p>

    <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;width:100%;background:#eff6ff;border-radius:12px;border:1px solid #bfdbfe;">
      <tr>
        <td style="padding:20px;text-align:center;">
          <p style="margin:0 0 4px;font-size:36px;font-weight:800;color:#2563eb;">+${credits}</p>
          <p style="margin:0;font-size:14px;color:#6b7280;">кредитов добавлено</p>
        </td>
      </tr>
    </table>

    <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;width:100%;">
      <tr>
        <td align="center">
          <a href="https://hooksy.ru" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#00D4FF,#8B5CF6);color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:10px;">
            Начать генерацию →
          </a>
        </td>
      </tr>
    </table>
  `)
  await send(to, `+${credits} кредитов на счёт Хукси`, html)
}
