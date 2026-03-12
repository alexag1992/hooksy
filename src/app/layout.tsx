import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Хукси — Генератор вирусных хуков',
  description: 'Создайте цепляющую первую строку для вашего контента с помощью AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
