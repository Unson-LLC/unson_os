'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getStatusIcon } from '@/components/docs/StatusBadge'
import type { DocStatus } from '@/components/docs/StatusBadge'

// ドキュメントアイテムの型定義
interface DocItem {
  title: string
  url: string
  type: 'guide' | 'technical'
  status: DocStatus
}

interface DocSection {
  title: string
  icon: string
  items: DocItem[]
  priority?: 'high' | 'normal'
}

// ドキュメント構造データ
const documentationSections: DocSection[] = [
  {
    title: '🟢 今すぐできること',
    icon: '⚡',
    priority: 'high',
    items: [
      { title: 'Discord参加', url: 'https://discord.gg/unsonos', type: 'guide', status: 'available' },
      { title: 'GitHub Issues', url: 'https://github.com/Unson-LLC/unson_os/issues', type: 'guide', status: 'available' },
      { title: 'セットアップガイド', url: '/docs/development/setup-guide', type: 'technical', status: 'available' },
      { title: 'テストガイドライン', url: '/docs/testing-guidelines', type: 'technical', status: 'available' },
      { title: 'コミュニティ参加', url: '/community', type: 'guide', status: 'available' }
    ]
  },
  {
    title: 'はじめに',
    icon: '🚀',
    items: [
      { title: 'Unson OSとは', url: '/docs/introduction', type: 'guide', status: 'future' },
      { title: 'クイックスタート', url: '/docs/quickstart', type: 'guide', status: 'available' },
      { title: 'プラットフォーム概要', url: '/docs/platform-overview', type: 'guide', status: 'in-discussion' },
      { title: '技術アーキテクチャ', url: '/docs/technical/architecture', type: 'technical', status: 'in-discussion' }
    ]
  },
  {
    title: 'プロダクト開発',
    icon: '⚡',
    items: [
      { title: '開発プロセス', url: '/docs/development/process', type: 'guide', status: 'in-discussion' },
      { title: 'セットアップガイド', url: '/docs/development/setup-guide', type: 'technical', status: 'available' },
      { title: 'API仕様書', url: '/docs/api', type: 'technical', status: 'future' },
      { title: 'SDK & ツール', url: '/docs/sdk', type: 'technical', status: 'future' }
    ]
  },
  {
    title: '開発・技術',
    icon: '🔧',
    items: [
      { title: 'セットアップガイド', url: '/docs/development/setup-guide', type: 'technical', status: 'available' },
      { title: 'フロントエンド構造', url: '/docs/development/frontend-structure', type: 'technical', status: 'available' },
      { title: 'フォルダ構造ガイド', url: '/docs/development/folder-structure-guide', type: 'technical', status: 'available' },
      { title: 'テストガイドライン', url: '/docs/testing-guidelines', type: 'technical', status: 'available' },
      { title: 'API テスト完全ガイド', url: '/docs/development/api-tests-complete', type: 'technical', status: 'available' },
      { title: 'Node.js バージョン管理', url: '/docs/development/node-version-management', type: 'technical', status: 'available' }
    ]
  },
  {
    title: '戦略・企画',
    icon: '🎯',
    items: [
      { title: 'マイクロビジネス戦略', url: '/docs/strategy/micro-business', type: 'guide', status: 'future' },
      { title: 'MVP検証フレームワーク', url: '/docs/strategy/mvp-validation', type: 'guide', status: 'future' },
      { title: 'SaaS設計プロセス', url: '/docs/strategy/saas-design', type: 'technical', status: 'future' },
      { title: 'サービス生成パイプライン', url: '/docs/technical/pipeline', type: 'technical', status: 'in-discussion' },
      { title: '設計仕様書', url: '/docs/design/specification', type: 'technical', status: 'in-discussion' }
    ]
  },
  {
    title: 'DAOガバナンス',
    icon: '🗳️',
    items: [
      { title: 'はじめてのDAO（超初心者向け）', url: '/docs/dao/guide', type: 'guide', status: 'future' },
      { title: 'DAO完全ガイド', url: '/docs/dao/overview', type: 'guide', status: 'future' },
      { title: '提案と投票', url: '/docs/dao/proposals', type: 'guide', status: 'future' },
      { title: '収益分配', url: '/docs/dao/revenue-sharing', type: 'guide', status: 'future' },
      { title: 'DAOでできること', url: '/docs/dao/capabilities', type: 'guide', status: 'future' },
      { title: 'DAO構造とガバナンス', url: '/docs/dao/structure', type: 'technical', status: 'future' },
      { title: 'DAOコンセプト設計書', url: '/docs/dao/concept', type: 'technical', status: 'future' },
      { title: 'トークノミクス（YGG参考モデル）', url: '/docs/dao/unified-tokenomics', type: 'technical', status: 'future' }
    ]
  },
  {
    title: 'チーム・組織',
    icon: '👥',
    items: [
      { title: 'チームメンバー', url: '/docs/team', type: 'guide', status: 'available' },
      { title: '最新更新情報', url: '/docs/updates', type: 'guide', status: 'available' },
      { title: '組織文化とバリュー', url: '/docs/culture', type: 'guide', status: 'in-discussion' },
      { title: '参加方法', url: '/docs/join', type: 'guide', status: 'available' }
    ]
  },
  {
    title: 'サポート',
    icon: '❓',
    items: [
      { title: 'よくある質問', url: '/docs/faq', type: 'guide', status: 'available' },
      { title: 'トラブルシューティング', url: '/docs/troubleshooting', type: 'guide', status: 'available' },
      { title: 'サポート連絡先', url: '/docs/support', type: 'guide', status: 'available' },
      { title: 'コミュニティフォーラム', url: '/docs/community-forum', type: 'guide', status: 'future' }
    ]
  }
]

interface DocsSidebarProps {
  className?: string
}

export function DocsSidebar({ className = '' }: DocsSidebarProps) {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<number[]>(() => {
    // 現在のパスに基づいて関連セクションを自動展開
    const expanded: number[] = []
    documentationSections.forEach((section, sectionIndex) => {
      // 高優先度セクション（今すぐできること）は常に展開
      if (section.priority === 'high') {
        expanded.push(sectionIndex)
      }
      // 現在のパスに該当するセクションも展開
      if (section.items.some(item => pathname === item.url)) {
        expanded.push(sectionIndex)
      }
    })
    return expanded
  })

  const toggleSection = (index: number) => {
    setExpandedSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <div className={`bg-white border-r border-gray-200 overflow-y-auto ${className}`}>
      <div className="p-4">
        <Link href="/docs" className="flex items-center space-x-2 mb-6">
          <span className="text-2xl">📚</span>
          <h2 className="text-lg font-semibold text-gray-900">ドキュメント</h2>
        </Link>
        
        <nav className="space-y-2">
          {documentationSections.map((section, sectionIndex) => {
            const isExpanded = expandedSections.includes(sectionIndex)
            const hasActiveItem = section.items.some(item => pathname === item.url)
            
            return (
              <div key={sectionIndex}>
                <button
                  onClick={() => toggleSection(sectionIndex)}
                  className={`w-full flex items-center justify-between p-2 text-left rounded-md transition-colors ${
                    section.priority === 'high'
                      ? 'bg-green-50 text-green-900 font-medium border border-green-200'
                      : hasActiveItem 
                        ? 'bg-blue-50 text-blue-900' 
                        : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{section.icon}</span>
                    <span className="text-sm font-medium">{section.title}</span>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isExpanded ? 'rotate-90' : 'rotate-0'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {isExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {section.items.map((item, itemIndex) => {
                      const isActive = pathname === item.url
                      const isExternal = item.url.startsWith('http')
                      
                      const linkContent = (
                        <>
                          <span className="text-base mr-2">{getStatusIcon(item.status)}</span>
                          <span className="flex-1">{item.title}</span>
                          {isExternal && (
                            <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          )}
                        </>
                      )
                      
                      if (isExternal) {
                        return (
                          <a
                            key={itemIndex}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center p-2 text-sm rounded-md transition-colors ${
                              isActive
                                ? 'bg-blue-100 text-blue-800 font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            {linkContent}
                          </a>
                        )
                      }
                      
                      return (
                        <Link
                          key={itemIndex}
                          href={item.url}
                          className={`flex items-center p-2 text-sm rounded-md transition-colors ${
                            isActive
                              ? 'bg-blue-100 text-blue-800 font-medium'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          {linkContent}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
        
        {/* フッター */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-1">
            <Link href="/docs/quickstart" className="block hover:text-blue-600">
              🚀 クイックスタート
            </Link>
            <Link href="/docs/dao/guide" className="block hover:text-blue-600">
              🏛️ DAO参加ガイド
            </Link>
            <Link href="/docs/support" className="block hover:text-blue-600">
              💬 サポート
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}