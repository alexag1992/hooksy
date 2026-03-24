import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Хукси — Генератор вирусных хуков',
    template: '%s | Хукси',
  },
  description: 'Создавайте цепляющие первые строки для YouTube, TikTok, Instagram и Telegram с помощью ИИ.',
  metadataBase: new URL('https://hooksy.ru'),
  openGraph: {
    siteName: 'Хукси',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  )
}
