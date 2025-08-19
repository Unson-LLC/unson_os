import type { Metadata } from 'next'
import './globals.css'
import Analytics from '@/components/Analytics/Analytics'
import ScrollTracker from '@/components/Analytics/ScrollTracker'

export const metadata: Metadata = {
  title: 'AI Stylist - AIパーソナルスタイリストサービス',
  description: 'AIがあなたの魅力を最大化するパーソナルスタイリング',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        {children}
        <Analytics 
          serviceName="ai-stylist"
          ga4MeasurementId={process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}
          clarityProjectId={process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}
        />
        <ScrollTracker />
      </body>
    </html>
  )
}