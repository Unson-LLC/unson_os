// Refactor Phase: ベタ書き・ハードコードを除去
'use client'

import { Button } from '@/components/ui/Button'
import { useSearch } from '@/hooks/useSearch'
import { SearchInput, NoResults } from '@/components/interactive'
import Link from 'next/link'

// ユーザータイプ別ガイド
const userTypeGuides = [
  {
    type: 'エンジニア・技術者',
    icon: '💻',
    description: 'コードで未来を作る',
    color: 'blue',
    guides: [
      { title: '開発環境構築', url: '/docs/development/setup-guide', status: 'available' },
      { title: 'GitHub Issues', url: 'https://github.com/Unson-LLC/unson_os/issues', status: 'available', external: true },
      { title: '技術アーキテクチャ', url: '/docs/technical/architecture', status: 'in-discussion' },
      { title: 'テストガイドライン', url: '/docs/testing-guidelines', status: 'available' }
    ]
  },
  {
    type: 'ビジネス・投資家',
    icon: '💼',
    description: '新しい収益モデルを理解する',
    color: 'green',
    guides: [
      { title: '収益分配システム', url: '/docs/dao/revenue-sharing', status: 'future' },
      { title: 'DAO完全ガイド', url: '/docs/dao/overview', status: 'future' },
      { title: 'マイクロビジネス戦略', url: '/docs/strategy/micro-business', status: 'future' },
      { title: 'MVP検証フレームワーク', url: '/docs/strategy/mvp-validation', status: 'future' }
    ]
  },
  {
    type: 'アーリーアダプター',
    icon: '🌟',
    description: '共に未来を創る',
    color: 'purple',
    guides: [
      { title: 'Discord参加', url: 'https://discord.gg/unsonos', status: 'available', external: true },
      { title: 'コミュニティ参加', url: '/community', status: 'available' },
      { title: 'DAO参加ガイド', url: '/docs/dao/guide', status: 'future' },
      { title: 'アイデア提案', url: 'https://github.com/Unson-LLC/unson_os/discussions', status: 'available', external: true }
    ]
  }
]

// 現在地セクション
const projectStatus = {
  available: [
    { title: 'Discord参加', description: 'コミュニティで議論に参加（約5名が活動中）', url: 'https://discord.gg/unsonos' },
    { title: 'GitHub参加', description: '設計議論やドキュメント改善に貢献', url: 'https://github.com/Unson-LLC/unson_os' },
    { title: 'アイデア共有', description: '将来のSaaSアイデアを提案', url: 'https://github.com/Unson-LLC/unson_os/discussions' }
  ],
  inProgress: [
    { title: '技術アーキテクチャ', description: 'システム設計の議論' },
    { title: 'DAO収益分配モデル', description: '詳細設計の策定' },
    { title: 'MVP検証フレームワーク', description: '2週間サイクルの確立' }
  ],
  future: [
    { title: '100個のSaaS自動生成', description: 'AI駆動の自動化システム' },
    { title: '月次収益分配', description: '40%をコミュニティへ' },
    { title: '完全自動化', description: 'ビジネス運営の自動化' }
  ]
}

// 5分で分かるUnsonOS
const quickOverview = {
  oneLiner: 'AIが100個のビジネスを自動運営し、その収益を皆で分配する仕組み',
  why: [
    'AIに仕事を奪われる恐怖 → AIに稼いでもらう希望へ',
    '個人では難しい規模のビジネス → コミュニティで実現',
    '従来の会社組織 → 完全自動化された収益システム'
  ],
  timeline: [
    { phase: '現在', description: '構想・設計段階（初期メンバー募集中）' },
    { phase: '2025年中頃', description: 'プラットフォームローンチ' },
    { phase: '2025年後半', description: '収益分配開始予定' }
  ],
  howItWorks: [
    'AIが市場分析して需要を発見',
    '2週間で自動的にSaaSを開発・公開',
    '月額課金で継続収益',
    '収益の40%をコミュニティで分配'
  ]
}

// 必読ドキュメント
const essentialDocs = [
  {
    title: 'UnsonOS構想概要',
    description: 'ビジョンとミッション、なぜ100個のSaaSなのか',
    readTime: '5分',
    url: '/docs/introduction',
    status: 'future',
    priority: 1
  },
  {
    title: 'クイックスタート',
    description: '5分で理解する参加方法',
    readTime: '5分',
    url: '/docs/quickstart',
    status: 'available',
    priority: 2
  },
  {
    title: 'コミュニティ参加',
    description: 'Discord参加と貢献の始め方',
    readTime: '3分',
    url: '/community',
    status: 'available',
    priority: 3
  }
]

// ステータスアイコンの取得
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'available':
      return '🟢'
    case 'in-discussion':
      return '🟡'
    case 'future':
      return '🔴'
    default:
      return '⚪'
  }
}

export default function DocsPage() {
  const essentialDocsSearch = useSearch({
    items: essentialDocs,
    searchFields: ['title', 'description']
  })

  const isSearching = essentialDocsSearch.searchTerm.length > 0
  const hasSearchResults = essentialDocsSearch.filteredItems.length > 0

  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container-custom">
          <div className="text-center animate-fade-in">
            <h1 className="heading-primary text-gray-900 mb-6">
              UnsonOS
              <span className="block text-blue-600 mt-2">
                ドキュメントガイド
              </span>
            </h1>
            <p className="text-large max-w-3xl mx-auto mb-8">
              AIに仕事を奪われる恐怖から、AIと共に豊かになる希望へ。<br />
              UnsonOSは、100個のSaaSビジネスをAIが自動運営する未来を作ります。
            </p>
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 max-w-2xl mx-auto mb-6">
              <p className="text-yellow-800 text-sm">
                ⚠️ UnsonOSは現在構想段階です。記載されている機能の多くは2025年以降の実装予定です。
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <SearchInput
                value={essentialDocsSearch.searchTerm}
                onChange={essentialDocsSearch.setSearchTerm}
                placeholder="ドキュメントを検索..."
              />
            </div>
          </div>
        </div>
      </section>

      {/* 検索結果なしの表示 */}
      {isSearching && !hasSearchResults && (
        <NoResults
          query={essentialDocsSearch.searchTerm}
          onClear={() => essentialDocsSearch.setSearchTerm('')}
          description="一致するドキュメントはありませんでした。"
        />
      )}

      {/* ユーザータイプ別ガイド */}
      {!isSearching && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <h2 className="heading-secondary text-center mb-4">
              あなたは、どのタイプですか？
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              あなたのバックグラウンドに合わせて、最適なドキュメントをご案内します
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {userTypeGuides.map((guide, index) => (
                <div key={index} className={`card border-2 border-${guide.color}-100 hover:border-${guide.color}-300 transition-all duration-200`}>
                  <div className="text-center mb-6">
                    <span className="text-5xl mb-4 block">{guide.icon}</span>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {guide.type}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {guide.description}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {guide.guides.map((item, itemIndex) => (
                      <Link
                        key={itemIndex}
                        href={item.url}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <div className="flex items-center">
                          <span className="text-lg mr-3">{getStatusIcon(item.status)}</span>
                          <span className="text-gray-700 font-medium">
                            {item.title}
                          </span>
                        </div>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 現在地セクション */}
      {!isSearching && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <h2 className="heading-secondary text-center mb-12">
              現在地：UnsonOSは今どこにいるのか？
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🟢</span>
                  今すぐできること
                </h3>
                <div className="space-y-3">
                  {projectStatus.available.map((item, index) => (
                    <Link
                      key={index}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      <div className="font-medium text-green-900">{item.title}</div>
                      <div className="text-sm text-green-700">{item.description}</div>
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🟡</span>
                  現在進行中
                </h3>
                <div className="space-y-3">
                  {projectStatus.inProgress.map((item, index) => (
                    <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                      <div className="font-medium text-yellow-900">{item.title}</div>
                      <div className="text-sm text-yellow-700">{item.description}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🔴</span>
                  将来の構想
                </h3>
                <div className="space-y-3">
                  {projectStatus.future.map((item, index) => (
                    <div key={index} className="p-3 bg-red-50 rounded-lg">
                      <div className="font-medium text-red-900">{item.title}</div>
                      <div className="text-sm text-red-700">{item.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5分で分かるUnsonOS */}
      {!isSearching && (
        <section className="section-padding bg-white">
          <div className="container-custom">
            <h2 className="heading-secondary text-center mb-12">
              5分で分かるUnsonOS
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="card mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">🎯</span>
                  一言で言うと？
                </h3>
                <p className="text-lg text-gray-700">
                  {quickOverview.oneLiner}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="card">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-3">🤔</span>
                    なぜ必要？
                  </h3>
                  <ul className="space-y-2">
                    {quickOverview.why.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2">→</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="card">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="text-2xl mr-3">💰</span>
                    どうやって稼ぐ？
                  </h3>
                  <ol className="space-y-2">
                    {quickOverview.howItWorks.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2">{index + 1}.</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">📅</span>
                  いつから？
                </h3>
                <div className="space-y-3">
                  {quickOverview.timeline.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-24 font-semibold text-gray-900">{item.phase}:</div>
                      <div className="text-gray-700">{item.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 必読ドキュメント */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">
            必読ドキュメント
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {(isSearching ? essentialDocsSearch.filteredItems : essentialDocs).map((doc, index) => (
              <Link
                key={index}
                href={doc.url}
                className="card hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-blue-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{getStatusIcon(doc.status)}</span>
                  <span className="text-sm text-gray-500">{doc.readTime}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {doc.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {doc.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 次のステップ */}
      <section className="section-padding bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container-custom text-center">
          <h2 className="heading-secondary mb-6">
            次のステップ
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="text-3xl mb-3">1️⃣</div>
                <h3 className="text-lg font-semibold mb-2">まず最初に（5分）</h3>
                <p className="text-gray-300 text-sm">
                  UnsonOS構想概要を読む<br />
                  自分のタイプを確認する
                </p>
              </div>
              <div>
                <div className="text-3xl mb-3">2️⃣</div>
                <h3 className="text-lg font-semibold mb-2">興味を持ったら（10分）</h3>
                <p className="text-gray-300 text-sm">
                  Discordに参加<br />
                  他のメンバーと交流
                </p>
              </div>
              <div>
                <div className="text-3xl mb-3">3️⃣</div>
                <h3 className="text-lg font-semibold mb-2">貢献を始める（随時）</h3>
                <p className="text-gray-300 text-sm">
                  GitHubでIssueを立てる<br />
                  ドキュメントの改善提案
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://discord.gg/unsonos" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="lg" className="bg-[#5865F2] hover:bg-[#4752C4] border-0">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                  </svg>
                  今すぐDiscordに参加
                </Button>
              </a>
              <a href="https://github.com/Unson-LLC/unson_os" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHubで貢献
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">
            よくある質問
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Q: 今すぐ収益は得られますか？
              </h3>
              <p className="text-gray-700">
                A: いいえ。収益分配は2025年後半以降の予定です。現在は構想・設計段階で、初期メンバーとして参加いただける方を募集しています。
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Q: プログラミングができなくても参加できますか？
              </h3>
              <p className="text-gray-700">
                A: はい！アイデア提案、ドキュメント改善、コミュニティ運営など様々な貢献方法があります。あなたのスキルを活かせる場所が必ずあります。
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Q: どのくらいの時間投資が必要ですか？
              </h3>
              <p className="text-gray-700">
                A: 自由です。週1時間の議論参加から、フルタイムの開発まで、あなたのペースで参加できます。無理のない範囲でご参加ください。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}