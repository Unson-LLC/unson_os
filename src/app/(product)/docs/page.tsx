// Refactor Phase: ベタ書き・ハードコードを除去
'use client'

import { Button } from '@/components/ui/Button'
import { useSearch } from '@/hooks/useSearch'
import { SearchInput, NoResults } from '@/components/interactive'


// ドキュメントカテゴリ
const documentationSections = [
  {
    title: 'はじめに',
    description: 'Unson OSの基本概念と開始方法',
    icon: '🚀',
    items: [
      { title: 'Unson OSとは', url: '/docs/introduction', type: 'guide' },
      { title: 'クイックスタート', url: '/docs/quickstart', type: 'guide' },
      { title: 'プラットフォーム概要', url: '/docs/platform-overview', type: 'guide' },
      { title: '技術アーキテクチャ', url: '/docs/technical/architecture', type: 'technical' }
    ]
  },
  {
    title: 'プロダクト開発',
    description: '開発プロセスと戦略的アプローチ',
    icon: '⚡',
    items: [
      { title: '開発プロセス', url: '/docs/development/process', type: 'guide' },
      { title: '戦略ドキュメント', url: '/docs/strategy/micro-business', type: 'guide' },
      { title: '技術アーキテクチャ', url: '/docs/technical/architecture', type: 'technical' },
      { title: 'DAO参加方法', url: '/docs/dao/guide', type: 'guide' }
    ]
  },
  {
    title: '開発・技術',
    description: '開発環境構築とテスト・品質管理',
    icon: '🔧',
    items: [
      { title: 'セットアップガイド', url: '/docs/development/setup-guide', type: 'technical' },
      { title: 'フロントエンド構造', url: '/docs/development/frontend-structure', type: 'technical' },
      { title: 'フォルダ構造ガイド', url: '/docs/development/folder-structure-guide', type: 'technical' },
      { title: 'テストガイドライン', url: '/docs/testing-guidelines', type: 'technical' },
      { title: 'API テスト完全ガイド', url: '/docs/development/api-tests-complete', type: 'technical' },
      { title: 'Node.js バージョン管理', url: '/docs/development/node-version-management', type: 'technical' }
    ]
  },
  {
    title: '戦略・企画',
    description: 'ビジネス戦略とプロダクト企画手法',
    icon: '🎯',
    items: [
      { title: 'マイクロビジネス戦略', url: '/docs/strategy/micro-business', type: 'guide' },
      { title: 'MVP検証フレームワーク', url: '/docs/strategy/mvp-validation', type: 'guide' },
      { title: 'SaaS設計プロセス', url: '/docs/strategy/saas-design', type: 'technical' },
      { title: 'サービス生成パイプライン', url: '/docs/technical/pipeline', type: 'technical' },
      { title: '設計仕様書', url: '/docs/design/specification', type: 'technical' }
    ]
  },
  {
    title: 'DAOガバナンス',
    description: '分散型自律組織の参加と運営',
    icon: '🗳️',
    items: [
      { title: 'はじめてのDAO（超初心者向け）', url: '/docs/dao/guide', type: 'guide' },
      { title: 'DAO完全ガイド', url: '/docs/dao/overview', type: 'guide' },
      { title: 'DAOでできること', url: '/docs/dao/capabilities', type: 'guide' },
      { title: 'DAO構造とガバナンス', url: '/docs/dao/structure', type: 'technical' },
      { title: 'DAOコンセプト設計書', url: '/docs/dao/concept', type: 'technical' },
      { title: 'トークノミクス（YGG参考モデル）', url: '/docs/dao/unified-tokenomics', type: 'technical' }
    ]
  },
  {
    title: 'チーム・組織',
    description: '雲孫チームの構成と最新の組織情報',
    icon: '👥',
    items: [
      { title: 'チームメンバー', url: '/docs/team', type: 'guide' },
      { title: '最新更新情報', url: '/docs/updates', type: 'guide' },
      { title: '設計仕様書', url: '/docs/design/specification', type: 'technical' },
      { title: 'コミュニティ参加', url: '/community', type: 'guide' }
    ]
  },
  {
    title: 'サポート',
    description: 'ヘルプとコミュニティ情報',
    icon: '❓',
    items: [
      { title: 'サポート連絡先', url: '/docs/support', type: 'guide' },
      { title: 'テストガイドライン', url: '/docs/testing-guidelines', type: 'technical' },
      { title: 'DAO機能説明', url: '/docs/dao/capabilities', type: 'guide' },
      { title: 'ダウンロード', url: '/docs/downloads', type: 'guide' }
    ]
  }
]

// 人気のドキュメント
const popularDocs = [
  {
    title: 'Unson OS クイックスタート',
    description: '5分でUnson OSを理解し、最初のプロダクトアイデアを投稿',
    readTime: '5分',
    category: 'ガイド',
    url: '/docs/quickstart'
  },
  {
    title: 'Unson OS 技術アーキテクチャ',
    description: 'AIエージェント主導のマイクロサービス自動生成プラットフォーム',
    readTime: '15分',
    category: '技術',
    url: '/docs/technical/architecture'
  },
  {
    title: '自動サービス生成パイプライン',
    description: 'アイデアから収益化まで自動化するパイプラインの詳細仕様',
    readTime: '18分',
    category: '技術',
    url: '/docs/technical/pipeline'
  },
  {
    title: 'プロダクト開発プロセス',
    description: 'アイデアから2週間サイクルでのSaaS生成までの完全ガイド',
    readTime: '12分',
    category: '開発',
    url: '/docs/development/process'
  },
  {
    title: 'セットアップガイド',
    description: 'Next.js 14環境の構築からデプロイまでを網羅した完全ガイド',
    readTime: '15分',
    category: '技術',
    url: '/docs/development/setup-guide'
  },
  {
    title: 'テストガイドライン',
    description: 't_wada方式のTDDによる品質保証とMVP開発戦略',
    readTime: '10分',
    category: '技術',
    url: '/docs/testing-guidelines'
  }
]

// SDKとツール
const sdksAndTools = [
  {
    name: 'Unson SDK (JavaScript)',
    description: 'Node.js/ブラウザ向けSDK',
    version: 'v2.1.0',
    language: 'JavaScript',
    url: '/docs/sdk/javascript'
  },
  {
    name: 'Unson SDK (Python)',
    description: 'Python向けSDK',
    version: 'v1.8.2',
    language: 'Python',
    url: '/docs/sdk/python'
  },
  {
    name: 'Unson CLI',
    description: 'コマンドライン開発ツール',
    version: 'v1.5.1',
    language: 'CLI',
    url: '/docs/sdk/cli'
  },
  {
    name: '開発ガイド',
    description: 'セットアップと開発手順',
    version: 'v1.0.0',
    language: 'Guide',
    url: '/docs/development/setup-guide'
  }
]

export default function DocsPage() {
  // リファクタリング: カスタムフックを使用
  const popularDocsSearch = useSearch({
    items: popularDocs,
    searchFields: ['title', 'description', 'category']
  })
  
  const sdkSearch = useSearch({
    items: sdksAndTools,
    searchFields: ['name', 'description', 'language']
  })

  // セクション検索用の特別な関数（階層構造のため）
  const filterSectionsBySearch = (sections: any[], query: string) => {
    if (!query.trim()) return sections
    const lowercaseQuery = query.toLowerCase()
    return sections.map(section => ({
      ...section,
      items: section.items.filter((item: any) =>
        item.title?.toLowerCase().includes(lowercaseQuery) ||
        section.title?.toLowerCase().includes(lowercaseQuery) ||
        section.description?.toLowerCase().includes(lowercaseQuery)
      )
    })).filter(section => 
      section.items.length > 0 || 
      section.title?.toLowerCase().includes(lowercaseQuery) ||
      section.description?.toLowerCase().includes(lowercaseQuery)
    )
  }

  const filteredSections = filterSectionsBySearch(documentationSections, popularDocsSearch.searchTerm)
  
  const hasSearchResults = popularDocsSearch.filteredItems.length > 0 || filteredSections.length > 0 || sdkSearch.filteredItems.length > 0
  const isSearching = popularDocsSearch.searchTerm.length > 0

  // 検索クエリの同期
  const handleSearchChange = (query: string) => {
    popularDocsSearch.setSearchTerm(query)
    sdkSearch.setSearchTerm(query)
  }

  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container-custom">
          <div className="text-center animate-fade-in">
            <h1 className="heading-primary text-gray-900 mb-6">
              Unson OS
              <span className="block text-blue-600 mt-2">
                ドキュメント
              </span>
            </h1>
            <p className="text-large max-w-3xl mx-auto mb-8">
              プラットフォームを最大限活用するための包括的なドキュメント。
              技術仕様からビジネス活用まで、すべてがここにあります。
            </p>
            <div className="max-w-md mx-auto">
              <SearchInput
                value={popularDocsSearch.searchTerm}
                onChange={handleSearchChange}
                placeholder="ドキュメントを検索..."
              />
            </div>
          </div>
        </div>
      </section>

      {/* 検索結果なしの表示 */}
      {isSearching && !hasSearchResults && (
        <NoResults
          query={popularDocsSearch.searchTerm}
          onClear={() => popularDocsSearch.setSearchTerm('')}
          description="一致するドキュメントはありませんでした。"
        />
      )}

      {/* 人気のドキュメント */}
      {(!isSearching || popularDocsSearch.filteredItems.length > 0) && (
        <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">
            人気のドキュメント
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDocsSearch.filteredItems.map((doc, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {doc.category}
                  </span>
                  <span className="text-xs text-gray-500">{doc.readTime}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {doc.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {doc.description}
                </p>
                <a href={doc.url}>
                  <Button variant="outline" size="sm" className="w-full">
                    読む
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ドキュメントセクション */}
      {(!isSearching || filteredSections.length > 0) && (
        <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">
            ドキュメント一覧
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredSections.map((section, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">{section.icon}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {section.description}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {section.items.map((item: any, itemIndex: number) => (
                    <a key={itemIndex} href={item.url} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-colors">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-3 ${
                          item.type === 'guide' ? 'bg-blue-400' :
                          item.type === 'technical' ? 'bg-purple-400' :
                          'bg-green-400'
                        }`}></div>
                        <span className="text-gray-700 hover:text-blue-600">
                          {item.title}
                        </span>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* SDKとツール */}
      {(!isSearching || sdkSearch.filteredItems.length > 0) && (
        <section className="section-padding">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">
            SDK & 開発ツール
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sdkSearch.filteredItems.map((tool, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    {tool.language}
                  </span>
                  <span className="text-xs text-gray-500">{tool.version}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {tool.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {tool.description}
                </p>
                <div className="flex gap-2">
                  <a href={tool.url} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      ドキュメント
                    </Button>
                  </a>
                  <a href={`/downloads/${tool.name.toLowerCase().replace(/\s/g, '-')}`} className="flex-1">
                    <Button size="sm" className="w-full">
                      ダウンロード
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* 貢献セクション */}
      <section className="section-padding bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container-custom text-center">
          <h2 className="heading-secondary mb-6">
            ドキュメント改善に貢献
          </h2>
          <p className="text-large mb-8 text-blue-100">
            オープンソースドキュメントの改善にご協力ください。
            より良いドキュメントをコミュニティで作り上げましょう。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://github.com/unson-llc/unson-os/tree/main/docs" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="lg">
                GitHub で編集
              </Button>
            </a>
            <a href="/contact?type=feedback">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                フィードバック送信
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* クイックリンク */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/quickstart" className="text-blue-600 hover:text-blue-800">クイックスタート</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/sdk/javascript" className="text-blue-600 hover:text-blue-800">SDK</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/support" className="text-blue-600 hover:text-blue-800">サポート</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/dao/guide" className="text-blue-600 hover:text-blue-800">DAO参加</a>
          </div>
        </div>
      </section>
    </div>
  )
}