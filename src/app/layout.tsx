'use client'

import './globals.css'
import { useEffect } from 'react'
import Logo from '@/components/ui/Logo'
import { GitHubStarButton } from '@/components/ui/GitHubStarButton'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    document.title = 'Unson OS - 自動SaaS生成プラットフォーム'
  }, [])

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Unson OSは100-200個のマイクロSaaSプロダクトを自動生成・管理する革新的なシステムです。DAOコミュニティ主導で2週間サイクルのプロダクトライフサイクル自動化を実現します。" />
        <meta name="keywords" content="SaaS,自動生成,マイクロビジネス,DAO,プラットフォーム,Unson OS" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              'name': 'Unson OS',
              'description': 'Unson OSは100-200個のマイクロSaaSプロダクトを自動生成・管理する革新的なシステムです。',
              'applicationCategory': 'BusinessApplication',
              'operatingSystem': 'Web',
              'offers': {
                '@type': 'Offer',
                'price': '0',
                'priceCurrency': 'JPY'
              }
            })
          }}
        />
      </head>
      <body className="min-h-screen bg-gray-50 antialiased">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Logo />
                </div>
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  <a href="/" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                    ホーム
                  </a>
                  <a href="/products" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                    プロダクト
                  </a>
                  <a href="/community" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                    コミュニティ
                  </a>
                  <a href="/docs" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                    ドキュメント
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:block">
                  <GitHubStarButton />
                </div>
                <div className="md:hidden flex items-center">
                  <button 
                    type="button" 
                    className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    data-testid="mobile-menu-button"
                    aria-label="メニューを開く"
                    onClick={() => {
                      const menu = document.getElementById('mobile-menu');
                      if (menu) {
                        menu.classList.toggle('hidden');
                        menu.setAttribute('aria-expanded', menu.classList.contains('hidden') ? 'false' : 'true');
                      }
                    }}
                  >
                    <span className="sr-only">メニューを開く</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* モバイルメニュー */}
          <div 
            id="mobile-menu" 
            className="md:hidden hidden bg-white border-t border-gray-200"
            data-testid="mobile-menu"
            aria-expanded="false"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="/" className="block px-3 py-2 text-gray-900 hover:bg-gray-50 hover:text-blue-600">
                ホーム
              </a>
              <a href="/products" className="block px-3 py-2 text-gray-500 hover:bg-gray-50 hover:text-blue-600">
                プロダクト
              </a>
              <a href="/community" className="block px-3 py-2 text-gray-500 hover:bg-gray-50 hover:text-blue-600">
                コミュニティ
              </a>
              <a href="/docs" className="block px-3 py-2 text-gray-500 hover:bg-gray-50 hover:text-blue-600">
                ドキュメント
              </a>
            </div>
          </div>
        </nav>
        <main role="main">
          {children}
        </main>
        <footer className="bg-gray-900 text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p>&copy; 2025 Unson LLC. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}