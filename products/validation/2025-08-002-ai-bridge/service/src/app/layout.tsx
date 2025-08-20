import type { Metadata } from 'next'
import './globals.css'
import Analytics from '@/components/Analytics/Analytics'
import PostHogProvider from '@/components/Analytics/PostHogProvider'
import ScrollTracker from '@/components/Analytics/ScrollTracker'

export const metadata: Metadata = {
  title: 'AI Bridge - AI翻訳サービス',
  description: '高精度AI翻訳で、言語の壁を越えたコミュニケーションを実現',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <PostHogProvider>
          {children}
          <Analytics 
            serviceName="ai-bridge"
            ga4MeasurementId={process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}
          />
          <ScrollTracker />
        </PostHogProvider>
      </body>
    </html>
  )
}