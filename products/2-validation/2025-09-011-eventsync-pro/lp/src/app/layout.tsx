import type { Metadata } from 'next'
import './globals.css'
import config from '../../lp-config.json'

export const metadata: Metadata = {
  title: config.meta.title,
  description: config.meta.description,
  keywords: config.meta.keywords.join(', '),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
