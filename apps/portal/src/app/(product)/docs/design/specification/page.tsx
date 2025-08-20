import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'
import { DocsLayout } from '@/components/layout/DocsLayout'

export const metadata: Metadata = {
  title: 'ランディングページ設計仕様書 - Unson OS ドキュメント',
  description: 'Unson OSランディングページの包括的な技術仕様書、UIデザイン、システムアーキテクチャ、実装フェーズの詳細。',
  openGraph: {
    title: 'ランディングページ設計仕様書 - Unson OS ドキュメント',
    description: 'Unson OSランディングページの包括的な技術仕様書、UIデザイン、システムアーキテクチャ、実装フェーズの詳細。',
  },
}

// プロジェクト概要
const projectOverview = {
  name: 'Unson OS ランディングページ',
  purpose: '100個（3年目標）のマイクロSaaS自動生成プラットフォームの紹介とユーザー獲得',
  targets: ['開発者', '起業家', 'DAO参加希望者', '企業のDX担当者'],
  strategy: 'MVP検証フレームワークに基づく段階的リリース'
}

// 主要KPI
const businessKPIs = [
  { metric: 'LP登録率', target: '10%以上', description: '訪問者のメール登録率' },
  { metric: '有料転換率', target: '10%以上', description: '登録者から有料ユーザーへ' },
  { metric: '7日後継続率', target: '50%以上', description: '初回利用から1週間後の継続' },
  { metric: 'MRR成長率', target: '20%/月以上', description: '月次経常収益の成長' }
]

// システムアーキテクチャ
const systemArchitecture = {
  techStack: [
    { layer: 'フロントエンド', techs: ['Next.js 14', 'TypeScript', 'Tailwind CSS'] },
    { layer: '状態管理', techs: ['Zustand', 'React Hook Form', 'Zod'] },
    { layer: 'バックエンド', techs: ['Convex', 'リアルタイムDB', '認証システム'] },
    { layer: 'テスト', techs: ['MSW', 'Jest', 'Playwright'] }
  ],
  folderStructure: [
    'app/ - App Router（Next.js 14）',
    'components/ - 再利用可能コンポーネント',
    'hooks/ - カスタムフック',
    'data/ - モックデータ',
    'lib/ - ユーティリティ',
    'types/ - TypeScript型定義'
  ]
}

// ページ構成
const pageStructures = [
  {
    page: 'ホームページ (/)',
    sections: [
      'ヒーローセクション - タイトル、サブタイトル、CTA、ウェイトリストフォーム',
      '特徴セクション - 3つの価値提案（2週間自動生成、DAOコミュニティ、収益分配）',
      '統計セクション - プロダクト数、開発時間、ユーザー数、スケーラビリティ',
      'CTAセクション - 革新的なSaaSエコシステムに参加'
    ]
  },
  {
    page: 'プロダクトページ (/products)',
    sections: [
      'ヒーローセクション - 100個のマイクロSaaS紹介',
      '統計セクション - 動的更新される活用状況',
      'カテゴリフィルター - 7つのカテゴリ、リアルタイム統計',
      'プロダクト一覧 - 3カラムグリッド、詳細カード',
      'プロセス説明 - 4ステップの開発フロー'
    ]
  },
  {
    page: 'コミュニティページ (/community)',
    sections: [
      'ヒーローセクション - DAOコミュニティ紹介',
      '統計セクション - メンバー数、収益分配額、プロジェクト数',
      '収益分配モデル - 45-15-40の詳細説明',
      '参加プロセス - 4ステップのオンボーディング',
      'メンバータイプ - 9つの役割・専門分野'
    ]
  },
  {
    page: 'ドキュメントページ (/docs)',
    sections: [
      'ヒーローセクション - ドキュメント概要、検索機能',
      '人気ドキュメント - 4つの主要ガイド',
      'ドキュメント一覧 - 6カテゴリの階層構造',
      'SDK・ツール - 4つの開発ツール',
      '貢献セクション - GitHub編集、フィードバック'
    ]
  }
]

// フォーム設計
const formDesigns = [
  {
    form: 'ウェイトリストフォーム',
    fields: [
      { name: 'email', type: 'string', required: true, validation: 'メール形式' },
      { name: 'name', type: 'string', required: true, validation: '100文字以内' },
      { name: 'role', type: 'string', required: false, validation: '職種・役割' }
    ],
    features: ['リアルタイムバリデーション', 'メール重複チェック', 'サンクスメッセージ']
  },
  {
    form: 'お問い合わせフォーム',
    fields: [
      { name: 'name', type: 'string', required: true, validation: '100文字以内' },
      { name: 'email', type: 'string', required: true, validation: 'メール形式' },
      { name: 'company', type: 'string', required: false, validation: '会社名' },
      { name: 'type', type: 'select', required: true, validation: '問い合わせ種別' },
      { name: 'message', type: 'textarea', required: true, validation: '5000文字以内' }
    ],
    types: ['一般的なお問い合わせ', '技術的な質問', '料金・プラン', 'カスタム開発', 'パートナーシップ']
  },
  {
    form: '採用応募フォーム',
    fields: [
      { name: 'name', type: 'string', required: true, validation: '100文字以内' },
      { name: 'email', type: 'string', required: true, validation: 'メール形式' },
      { name: 'position', type: 'select', required: true, validation: '希望ポジション' },
      { name: 'experience', type: 'textarea', required: true, validation: '経験・スキル' },
      { name: 'coverLetter', type: 'textarea', required: true, validation: '5000文字以内' },
      { name: 'portfolio', type: 'url', required: false, validation: 'ポートフォリオURL' }
    ]
  }
]

// デザインシステム
const designSystem = {
  colors: {
    primary: ['blue-50', 'blue-100', 'blue-500', 'blue-600', 'blue-700'],
    secondary: ['purple-600', 'green-600', 'orange-600'],
    neutral: ['gray-50', 'gray-100', 'gray-600', 'gray-900']
  },
  typography: {
    headings: [
      'heading-primary: 3xl md:4xl lg:5xl font-bold',
      'heading-secondary: 2xl md:3xl font-bold'
    ],
    body: [
      'text-large: lg md:xl',
      'text-base: base',
      'text-small: sm'
    ]
  },
  spacing: [
    'section-padding: py-16 md:py-24',
    'container-custom: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
  ],
  components: [
    'card: bg-white rounded-lg shadow-sm border p-6',
    'btn-primary: bg-blue-600 hover:bg-blue-700 text-white',
    'btn-secondary: bg-white border border-gray-300 hover:bg-gray-50'
  ]
}

// アナリティクス設計
const analyticsEvents = [
  {
    category: 'ページビュー',
    events: ['page_view: page + referrer']
  },
  {
    category: 'フォーム関連',
    events: ['form_start', 'form_submit', 'form_error']
  },
  {
    category: 'ナビゲーション',
    events: ['cta_click', 'external_link_click']
  },
  {
    category: 'プロダクト関連',
    events: ['product_view', 'category_filter', 'search_query']
  },
  {
    category: 'エンゲージメント',
    events: ['scroll_depth', 'time_on_page']
  }
]

// テスト戦略
const testStrategy = {
  pyramid: [
    { level: 'E2Eテスト (Playwright)', coverage: '少数、重要フロー', description: 'ユーザージャーニー全体' },
    { level: '統合テスト (Testing Library)', coverage: '中程度', description: 'コンポーネント + API' },
    { level: 'ユニットテスト (Jest)', coverage: '多数、網羅的', description: '個別関数・フック・コンポーネント' }
  ],
  targets: [
    { type: 'ユニットテスト', target: '90%以上' },
    { type: '統合テスト', target: '主要機能の80%以上' },
    { type: 'E2Eテスト', target: 'クリティカルパスの100%' }
  ],
  criticalPaths: [
    'ウェイトリスト登録フロー',
    'プロダクト検索・フィルター',
    'プロダクト詳細表示',
    'お問い合わせフロー',
    'レスポンシブ表示'
  ]
}

// パフォーマンス要件
const performanceTargets = [
  { metric: 'LCP (Largest Contentful Paint)', target: '< 2.5秒', description: '最大コンテンツペイント' },
  { metric: 'FID (First Input Delay)', target: '< 100ms', description: '初回入力遅延' },
  { metric: 'CLS (Cumulative Layout Shift)', target: '< 0.1', description: '累積レイアウトシフト' }
]

const optimizationStrategies = [
  'Next.js最適化: App Router、Image最適化、フォント最適化',
  'コード分割: 動的インポート、ページ単位の分割',
  'キャッシュ戦略: 静的生成、ISR（将来実装）',
  '画像最適化: WebP、responsive images',
  'CSS最適化: critical CSS、未使用CSS除去'
]

// セキュリティ設計
const securityMeasures = [
  { level: 'コードレベル', measures: ['CSRF保護', 'XSS対策', '入力バリデーション'] },
  { level: 'ランタイム', measures: ['レート制限', 'HTTPS強制', '異常検知'] },
  { level: 'データ保護', measures: ['GDPR準拠', 'データ暗号化', 'アクセスログ'] }
]

// 実装フェーズ
const implementationPhases = [
  {
    phase: 'Phase 1: 基盤構築',
    status: '完了',
    items: ['基本ページ構造', 'デザインシステム', 'モックデータ', 'フォーム機能', 'レスポンシブ対応']
  },
  {
    phase: 'Phase 2: バックエンド統合',
    status: '次のステップ',
    items: ['Convex環境構築', 'データベース設計', 'API実装', '認証システム', 'リアルタイム機能']
  },
  {
    phase: 'Phase 3: 高度な機能',
    status: '計画中',
    items: ['検索エンジン', '支払い処理', 'メール配信', 'アナリティクス詳細', 'A/Bテスト基盤']
  },
  {
    phase: 'Phase 4: スケーリング',
    status: '将来',
    items: ['CDN最適化', 'キャッシュ戦略', '国際化', 'PWA機能', 'マイクロサービス化']
  }
]

export default function DesignSpecificationPage() {
  const readingTime = '約25分'
  
  return (
    <DocsLayout>
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center gap-2 text-sm text-purple-600 mb-4">
              <span>📖 読み時間：{readingTime}</span>
              <span>•</span>
              <span>🔄 最終更新：2025年7月</span>
            </div>
            <h1 className="heading-primary text-gray-900 mb-6">
              ランディングページ
              <span className="block text-purple-600 mt-2">
                設計仕様書
              </span>
            </h1>
            <p className="text-large text-gray-600 mb-8">
              Unson OSランディングページの包括的な技術仕様書として、
              開発・デザイン・マーケティングチーム全体で共有する設計ドキュメントです。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationLink href="/docs/technical/architecture" variant="default" size="lg">
                技術アーキテクチャ
              </NavigationLink>
              <NavigationLink href="/docs/technical/pipeline" variant="outline" size="lg">
                開発パイプライン
              </NavigationLink>
            </div>
          </div>
        </div>
      </section>

      {/* 目次 */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">目次</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <a href="#project-overview" className="block text-blue-600 hover:text-blue-800 py-1">1. プロジェクト概要</a>
                <a href="#system-architecture" className="block text-blue-600 hover:text-blue-800 py-1">2. システムアーキテクチャ</a>
                <a href="#page-structures" className="block text-blue-600 hover:text-blue-800 py-1">3. ページ構成・UIデザイン</a>
                <a href="#form-design" className="block text-blue-600 hover:text-blue-800 py-1">4. フォーム設計</a>
                <a href="#design-system" className="block text-blue-600 hover:text-blue-800 py-1">5. デザインシステム</a>
                <a href="#analytics" className="block text-blue-600 hover:text-blue-800 py-1">6. アナリティクス設計</a>
                <a href="#testing" className="block text-blue-600 hover:text-blue-800 py-1">7. テスト戦略</a>
              </div>
              <div>
                <a href="#performance" className="block text-blue-600 hover:text-blue-800 py-1">8. パフォーマンス要件</a>
                <a href="#security" className="block text-blue-600 hover:text-blue-800 py-1">9. セキュリティ設計</a>
                <a href="#responsive" className="block text-blue-600 hover:text-blue-800 py-1">10. レスポンシブ設計</a>
                <a href="#seo-accessibility" className="block text-blue-600 hover:text-blue-800 py-1">11. SEO・アクセシビリティ</a>
                <a href="#growth-strategy" className="block text-blue-600 hover:text-blue-800 py-1">12. 成長戦略</a>
                <a href="#implementation" className="block text-blue-600 hover:text-blue-800 py-1">13. 実装フェーズ</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* プロジェクト概要 */}
      <section id="project-overview" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">プロジェクト概要</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📋 基本情報
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">プロジェクト名:</span>
                    <p className="text-gray-600">{projectOverview.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">目的:</span>
                    <p className="text-gray-600">{projectOverview.purpose}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">戦略:</span>
                    <p className="text-gray-600">{projectOverview.strategy}</p>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🎯 ターゲット
                </h3>
                <div className="space-y-2">
                  {projectOverview.targets.map((target, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <span className="text-gray-600">{target}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📊 主要KPI
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {businessKPIs.map((kpi, index) => (
                  <div key={index} className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-900 mb-1">{kpi.metric}</h4>
                    <div className="text-lg font-bold text-purple-600 mb-1">{kpi.target}</div>
                    <p className="text-xs text-purple-700">{kpi.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* システムアーキテクチャ */}
      <section id="system-architecture" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">システムアーキテクチャ</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🛠️ 技術スタック
                </h3>
                <div className="space-y-4">
                  {systemArchitecture.techStack.map((stack, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-gray-900 mb-2">{stack.layer}</h4>
                      <div className="flex flex-wrap gap-2">
                        {stack.techs.map((tech, techIndex) => (
                          <span key={techIndex} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📁 フォルダ構成
                </h3>
                <div className="space-y-2 text-sm font-mono">
                  {systemArchitecture.folderStructure.map((folder, index) => (
                    <div key={index} className="text-gray-600">
                      {folder}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ページ構成 */}
      <section id="page-structures" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">ページ構成・UIデザイン</h2>
            
            <div className="space-y-8">
              {pageStructures.map((page, index) => (
                <div key={index} className="card">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {page.page}
                  </h3>
                  <div className="space-y-3">
                    {page.sections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="p-3 bg-gray-50 rounded border-l-4 border-purple-500">
                        <p className="text-gray-700 text-sm">{section}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* フォーム設計 */}
      <section id="form-design" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">フォーム設計</h2>
            
            <div className="space-y-8">
              {formDesigns.map((form, index) => (
                <div key={index} className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    📝 {form.form}
                  </h3>
                  
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">フィールド構成</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">フィールド名</th>
                            <th className="text-left p-2">タイプ</th>
                            <th className="text-left p-2">必須</th>
                            <th className="text-left p-2">バリデーション</th>
                          </tr>
                        </thead>
                        <tbody>
                          {form.fields.map((field, fieldIndex) => (
                            <tr key={fieldIndex} className="border-b">
                              <td className="p-2 font-medium">{field.name}</td>
                              <td className="p-2">{field.type}</td>
                              <td className="p-2">
                                <span className={`px-2 py-1 text-xs rounded ${
                                  field.required ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {field.required ? '必須' : '任意'}
                                </span>
                              </td>
                              <td className="p-2 text-gray-600">{field.validation}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {form.features && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">機能</h4>
                      <div className="flex flex-wrap gap-2">
                        {form.features.map((feature, featureIndex) => (
                          <span key={featureIndex} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {form.types && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900 mb-3">問い合わせ種別</h4>
                      <div className="grid md:grid-cols-3 gap-2">
                        {form.types.map((type, typeIndex) => (
                          <div key={typeIndex} className="p-2 bg-blue-50 text-blue-700 text-sm rounded">
                            {type}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* デザインシステム */}
      <section id="design-system" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">デザインシステム</h2>
            
            <div className="space-y-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🎨 カラーパレット
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">プライマリカラー</h4>
                    <div className="flex gap-2">
                      {designSystem.colors.primary.map((color, index) => (
                        <div key={index} className={`w-12 h-12 rounded bg-${color} border border-gray-200`}>
                          <div className="text-xs text-center mt-3 text-white">{color}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">セカンダリカラー</h4>
                    <div className="flex gap-2">
                      {designSystem.colors.secondary.map((color, index) => (
                        <div key={index} className={`w-12 h-12 rounded bg-${color} border border-gray-200`}>
                          <div className="text-xs text-center mt-3 text-white">{color}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    ✏️ タイポグラフィ
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">見出し</h4>
                      <div className="space-y-1 text-sm font-mono text-gray-600">
                        {designSystem.typography.headings.map((heading, index) => (
                          <div key={index}>{heading}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">本文</h4>
                      <div className="space-y-1 text-sm font-mono text-gray-600">
                        {designSystem.typography.body.map((body, index) => (
                          <div key={index}>{body}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    📐 スペーシング・コンポーネント
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">スペーシング</h4>
                      <div className="space-y-1 text-sm font-mono text-gray-600">
                        {designSystem.spacing.map((spacing, index) => (
                          <div key={index}>{spacing}</div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">コンポーネント</h4>
                      <div className="space-y-1 text-sm font-mono text-gray-600">
                        {designSystem.components.map((component, index) => (
                          <div key={index}>{component}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* アナリティクス設計 */}
      <section id="analytics" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">アナリティクス設計</h2>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📊 追跡イベント
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {analyticsEvents.map((category, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">{category.category}</h4>
                    <div className="space-y-1">
                      {category.events.map((event, eventIndex) => (
                        <div key={eventIndex} className="text-sm text-blue-700 font-mono">
                          {event}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* テスト戦略 */}
      <section id="testing" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">テスト戦略</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🔺 テストピラミッド
                </h3>
                <div className="space-y-4">
                  {testStrategy.pyramid.map((level, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded">
                      <h4 className="font-medium text-gray-900 mb-1">{level.level}</h4>
                      <p className="text-sm text-gray-600 mb-1">{level.coverage}</p>
                      <p className="text-xs text-gray-500">{level.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🎯 カバレッジ目標
                </h3>
                <div className="space-y-3">
                  {testStrategy.targets.map((target, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="font-medium text-green-900">{target.type}</span>
                      <span className="text-green-600 font-semibold">{target.target}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">主要テストケース</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    {testStrategy.criticalPaths.map((path, index) => (
                      <div key={index}>• {path}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* パフォーマンス要件 */}
      <section id="performance" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">パフォーマンス要件</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🚀 Core Web Vitals 目標
                </h3>
                <div className="space-y-3">
                  {performanceTargets.map((target, index) => (
                    <div key={index} className="p-3 bg-green-50 rounded">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-green-900">{target.metric}</span>
                        <span className="text-green-600 font-semibold">{target.target}</span>
                      </div>
                      <p className="text-sm text-green-700">{target.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  ⚡ 最適化戦略
                </h3>
                <div className="space-y-2">
                  {optimizationStrategies.map((strategy, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded text-sm text-blue-700">
                      {strategy}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* セキュリティ設計 */}
      <section id="security" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">セキュリティ設計</h2>
            
            <div className="space-y-6">
              {securityMeasures.map((security, index) => (
                <div key={index} className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    🔒 {security.level}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-3">
                    {security.measures.map((measure, measureIndex) => (
                      <div key={measureIndex} className="p-3 bg-red-50 rounded text-sm text-red-700">
                        {measure}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* レスポンシブ設計 */}
      <section id="responsive" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">レスポンシブ設計</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📱 ブレークポイント
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded">
                    <span className="font-medium text-blue-900">Mobile: </span>
                    <span className="text-blue-700">320px - 768px</span>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <span className="font-medium text-green-900">Tablet: </span>
                    <span className="text-green-700">768px - 1024px</span>
                  </div>
                  <div className="p-3 bg-purple-50 rounded">
                    <span className="font-medium text-purple-900">Desktop: </span>
                    <span className="text-purple-700">1024px+</span>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🎯 レスポンシブ戦略
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• モバイルファースト: 小画面から大画面へ</div>
                  <div>• フレキシブルグリッド: CSS Grid + Flexbox</div>
                  <div>• タッチフレンドリー: 44px以上のタップターゲット</div>
                  <div>• 読みやすさ: 適切な行間・文字サイズ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO・アクセシビリティ */}
      <section id="seo-accessibility" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">SEO・アクセシビリティ</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🔍 SEO要件
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">タイトル: </span>
                    <span className="text-gray-600">60文字以内</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">説明: </span>
                    <span className="text-gray-600">160文字以内</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">キーワード: </span>
                    <span className="text-gray-600">関連キーワード配置</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">OGP画像: </span>
                    <span className="text-gray-600">SNSシェア対応</span>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  ♿ アクセシビリティ要件
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• WCAG 2.1 AA準拠</div>
                  <div>• キーボードナビゲーション</div>
                  <div>• スクリーンリーダー対応</div>
                  <div>• 高コントラスト対応</div>
                  <div>• 動画・アニメーション制御</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 成長戦略 */}
      <section id="growth-strategy" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">成長戦略</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🧪 A/Bテスト候補
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 rounded">
                    <h4 className="font-medium text-yellow-900">ヒーローセクション</h4>
                    <p className="text-sm text-yellow-700">CTAボタンの文言・色</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded">
                    <h4 className="font-medium text-blue-900">フォーム最適化</h4>
                    <p className="text-sm text-blue-700">入力項目数・位置</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <h4 className="font-medium text-green-900">価格表示</h4>
                    <p className="text-sm text-green-700">表示形式・強調方法</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded">
                    <h4 className="font-medium text-purple-900">プロダクト一覧</h4>
                    <p className="text-sm text-purple-700">表示形式・並び順</p>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🚀 将来的な機能拡張
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>• 国際化: 多言語対応（英語・中国語）</div>
                  <div>• ダークモード: ユーザー設定保存</div>
                  <div>• PWA化: オフライン対応、プッシュ通知</div>
                  <div>• AI チャットボット: 自動サポート</div>
                  <div>• ダッシュボード: ユーザー専用管理画面</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 実装フェーズ */}
      <section id="implementation" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">実装フェーズ</h2>
            
            <div className="space-y-6">
              {implementationPhases.map((phase, index) => (
                <div key={index} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {phase.phase}
                    </h3>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      phase.status === '完了' ? 'bg-green-100 text-green-700' :
                      phase.status === '次のステップ' ? 'bg-blue-100 text-blue-700' :
                      phase.status === '計画中' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {phase.status}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {phase.items.map((item, itemIndex) => (
                      <div key={itemIndex} className={`p-3 rounded text-sm ${
                        phase.status === '完了' ? 'bg-green-50 text-green-700' :
                        phase.status === '次のステップ' ? 'bg-blue-50 text-blue-700' :
                        phase.status === '計画中' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-gray-50 text-gray-700'
                      }`}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                📋 まとめ
              </h3>
              <p className="text-gray-600">
                この設計書は、Unson OSランディングページの包括的な技術仕様書として、
                開発・デザイン・マーケティングチーム全体で共有し、継続的に更新していくドキュメントです。
                段階的な実装アプローチにより、最小限のリスクで最大の価値を提供することを目指します。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="設計仕様に基づく開発を始めよう"
        subtitle="詳細な設計書に基づいて、高品質なランディングページの開発に参加しませんか？"
        actions={[
          { label: '開発に参加', href: '/community' },
          { label: '技術ドキュメント', href: '/docs/technical/architecture', variant: 'outline' }
        ]}
        backgroundColor="bg-gradient-to-r from-purple-600 to-pink-600"
      />

      {/* ナビゲーション */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <NavigationLink href="/docs/technical/pipeline" variant="outline" size="sm">
                ← サービス生成パイプライン
              </NavigationLink>
              <NavigationLink href="/docs" variant="outline" size="sm">
                ドキュメント一覧 →
              </NavigationLink>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="/docs/technical/architecture" className="text-blue-600 hover:text-blue-800">技術アーキテクチャ</a>
              <span className="text-gray-300">|</span>
              <a href="/docs/technical/pipeline" className="text-blue-600 hover:text-blue-800">サービス生成パイプライン</a>
              <span className="text-gray-300">|</span>
              <a href="/docs/development/process" className="text-blue-600 hover:text-blue-800">開発プロセス</a>
              <span className="text-gray-300">|</span>
              <a href="/docs" className="text-blue-600 hover:text-blue-800">ドキュメント一覧</a>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                📝 このページを編集
              </a>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                💬 フィードバック
              </a>
            </div>
          </div>
        </div>
      </section>
    </DocsLayout>
  )
}