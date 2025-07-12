'use client'

import { useState } from 'react'
import { DocsSidebar } from './DocsSidebar'

interface DocsLayoutProps {
  children: React.ReactNode
}

export function DocsLayout({ children }: DocsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* モバイル用サイドバーオーバーレイ */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* サイドバー */}
        <DocsSidebar 
          className={`fixed left-0 top-0 h-screen w-80 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:z-auto ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        />

        {/* メインコンテンツエリア */}
        <div className="flex-1 flex flex-col lg:ml-80">
          {/* ヘッダー（モバイルメニューボタン） */}
          <header className="bg-white border-b border-gray-200 lg:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-900">📚 ドキュメント</h1>
              <div className="w-10" /> {/* スペーサー */}
            </div>
          </header>

          {/* メインコンテンツ */}
          <main className="flex-1">
            <div className="max-w-5xl mx-auto">
              {children}
            </div>
          </main>

          {/* フッター（ドキュメント間のナビゲーション） */}
          <footer className="bg-white border-t border-gray-200 mt-16">
            <div className="max-w-5xl mx-auto px-4 py-8">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="text-center sm:text-left">
                  <p className="text-sm text-gray-600">
                    ドキュメントで問題を見つけましたか？
                  </p>
                  <a 
                    href="https://github.com/unson-llc/unson-os/issues" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    GitHubで報告 →
                  </a>
                </div>
                
                <div className="flex space-x-4 text-sm">
                  <a href="/docs" className="text-gray-600 hover:text-blue-600">
                    📚 ドキュメント一覧
                  </a>
                  <a href="/docs/quickstart" className="text-gray-600 hover:text-blue-600">
                    🚀 クイックスタート
                  </a>
                  <a href="/docs/support" className="text-gray-600 hover:text-blue-600">
                    💬 サポート
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}