'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, 
  FileText, 
  Settings,
  Menu,
  X,
  Zap,
  TrendingUp,
  Target
} from 'lucide-react'

const navigation = [
  {
    name: 'ダッシュボード',
    href: '/',
    icon: BarChart3,
    description: 'メイン管理画面'
  },
  {
    name: 'LP生成',
    href: '/generator',
    icon: FileText,
    description: 'AI支援LP生成システム'
  },
  {
    name: '統合ワークフロー',
    href: '/integration',
    icon: Zap,
    description: '生成→検証→最適化の統合管理'
  },
  {
    name: 'ポジション管理',
    href: '/position',
    icon: Target,
    description: '検証ポジション管理'
  },
  {
    name: 'トレーディング',
    href: '/trading',
    icon: TrendingUp,
    description: '最適化分析画面'
  },
  {
    name: '管理',
    href: '/admin',
    icon: Settings,
    description: 'システム設定'
  }
]

export function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Hydration修正：クライアントサイドでマウント後にアイコン表示
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // サーバーサイドレンダリング時は基本構造のみ表示
  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
                <span className="text-xl font-bold text-gray-900">LP Suite</span>
              </Link>
            </div>
            <div className="md:hidden flex items-center">
              <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-600">
                <div className="w-6 h-6"></div>
              </button>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <>
      {/* デスクトップナビゲーション */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* ロゴ */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">LP Suite</span>
              </Link>
            </div>

            {/* デスクトップメニュー */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname.startsWith(item.href))
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive
                        ? 'text-blue-600 bg-blue-50 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    title={item.description}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            {/* モバイルメニューボタン */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded="false"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* モバイルメニュー */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname.startsWith(item.href))
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                      isActive
                        ? 'text-blue-600 bg-blue-50 border border-blue-200'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <div>
                      <div>{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      {/* オーバーレイ */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-25 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
