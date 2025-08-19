import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LP Template Generator',
  description: 'Generate beautiful landing pages from configuration files',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <PostHogProvider>{children}        </PostHogProvider>
</body>
    </html>
  )
}