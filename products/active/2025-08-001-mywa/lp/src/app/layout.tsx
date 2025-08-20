import type { Metadata } from 'next'
import './globals.css'
import Analytics from '@/components/Analytics/Analytics'
import ScrollTracker from '@/components/Analytics/ScrollTracker'
import PostHogProvider from '@/components/Analytics/PostHogProvider'

export const metadata: Metadata = {
  title: 'MyWa - AI記事要約サービス',
  description: '忙しいあなたのための、パーソナライズされたニュース要約配信サービス',
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
            serviceName="mywa"
            ga4MeasurementId={process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}
          />
          <ScrollTracker />
        </PostHogProvider>
      </body>
    </html>
  )
}