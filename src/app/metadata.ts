import { Metadata } from 'next'

export const defaultMetadata: Metadata = {
  title: {
    default: 'Unson OS - AIが100個のSaaSビジネスを自動運営',
    template: '%s | Unson OS'
  },
  description: 'AIに仕事を奪われる恐怖から、AIと共に豊かになる希望へ。Unson OSは100個のマイクロSaaSを自動生成・運営し、収益を分配する革新的なプラットフォームです。',
  keywords: ['AI', 'SaaS', '自動化', 'DAO', 'マイクロビジネス', '収益分配', 'Unson OS'],
  authors: [{ name: 'Unson LLC' }],
  creator: 'Unson LLC',
  publisher: 'Unson LLC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://os.unson.jp'),
  openGraph: {
    title: 'Unson OS - AIが100個のSaaSビジネスを自動運営',
    description: 'AIに仕事を奪われる恐怖から、AIと共に豊かになる希望へ。100個のマイクロSaaSを自動生成・運営する革新的プラットフォーム。',
    url: 'https://os.unson.jp',
    siteName: 'Unson OS',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Unson OS - AIと共に豊かになる未来',
      }
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unson OS - AIが100個のSaaSビジネスを自動運営',
    description: 'AIに仕事を奪われる恐怖から、AIと共に豊かになる希望へ。収益分配型の革新的プラットフォーム。',
    images: ['/twitter-image.png'],
    creator: '@unson_os',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification=xxx', // Google Search Console verification
    yandex: 'yandex-verification=xxx',
    yahoo: 'yahoo-site-verification=xxx',
  },
}