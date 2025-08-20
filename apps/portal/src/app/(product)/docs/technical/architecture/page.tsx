import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'
import { DocsLayout } from '@/components/layout/DocsLayout'
import { StatusBadge } from '@/components/docs/StatusBadge'
import { ExpectationBanner } from '@/components/docs/ExpectationBanner'

export const metadata: Metadata = {
  title: 'Unson OS 技術アーキテクチャ - Unson OS ドキュメント',
  description: 'AIエージェントによるマイクロサービス自動生成プラットフォーム、Company-as-a-Product、Zero-Sales Architectureの技術詳細。',
  openGraph: {
    title: 'Unson OS 技術アーキテクチャ - Unson OS ドキュメント',
    description: 'AIエージェントによるマイクロサービス自動生成プラットフォーム、Company-as-a-Product、Zero-Sales Architectureの技術詳細。',
  },
}

// コアコンセプト
const coreConceptsData = [
  {
    title: 'Company-as-a-Product',
    icon: '🏗️',
    description: '会社運営のすべてのプロセスをコード化',
    features: [
      'GitHubでバージョン管理',
      '継続的な改善とデプロイ',
      'プロセスの可視化と自動化'
    ]
  },
  {
    title: 'Zero-Sales Architecture',
    icon: '🤖',
    description: '営業プロセスの段階的自動化',
    features: [
      'データドリブンな顧客獲得',
      '人的介入なしの価値提供',
      '自動化されたカスタマージャーニー'
    ]
  }
]

// 技術スタック
const techStackLayers = [
  {
    layer: '生成・開発層',
    color: 'blue',
    technologies: [
      'Claude Code（コード生成）',
      '生成AI（画像・動画・コピー）',
      'GitHub（バージョン管理）'
    ],
    description: 'AI主導の自動コード生成とメディア作成'
  },
  {
    layer: '運用基盤層',
    color: 'green',
    technologies: [
      'GitHub Actions（CI/CD）',
      'Vercel（実行環境）',
      'Convex（データベース）',
      'Stripe（決済）'
    ],
    description: 'スケーラブルなインフラストラクチャ'
  },
  {
    layer: '観測・安全層',
    color: 'purple',
    technologies: [
      'PostHog（行動分析）',
      'Sentry（エラー監視）',
      'Semgrep（静的解析）',
      'Metabase（ダッシュボード）'
    ],
    description: 'リアルタイム監視と品質保証'
  },
  {
    layer: 'コスト管理層',
    color: 'orange',
    technologies: [
      'Infracost（ビルド前見積）',
      'CloudForecast（請求監視）'
    ],
    description: '予算管理と最適化'
  }
]

// 4段階ゲートシステム
const gateSystemPhases = [
  {
    phase: 0,
    title: '課題検知',
    icon: '🔍',
    input: 'SNS、検索トレンド、GitHub Issues',
    processing: 'LLMによるクラスタリング',
    output: 'スコア付き課題リスト',
    automation: '自動トレンド分析',
    human: '最終課題選定'
  },
  {
    phase: 1,
    title: 'LP作成（ゲート①）',
    icon: '🎨',
    input: '選定された課題',
    processing: 'Claude Codeによるコピー・デザイン生成',
    output: 'デプロイ済みLP',
    automation: 'LP構成自動生成、Vercel APIデプロイ',
    human: '画像・動画品質チェック、ブランド整合性確認',
    criteria: '1週間訪問1,000人以上、登録率10%以上'
  },
  {
    phase: 2,
    title: 'MVP開発（ゲート②）',
    icon: '⚡',
    input: '検証済みLP',
    processing: 'Claude Codeによるテスト駆動開発',
    output: '本番稼働MVP',
    automation: 'GitHub Actionsでの自動デプロイ、基本機能実装',
    human: 'UI/UX最終調整、セキュリティレビュー',
    criteria: '週次利用者200人以上、7日後残存率30%以上'
  },
  {
    phase: 3,
    title: '課金開始（ゲート③）',
    icon: '💰',
    input: '利用実績のあるMVP',
    processing: 'Stripe Product APIでの価格設定',
    output: '収益化サービス',
    automation: 'チェックアウトフロー生成、A/Bテスト価格最適化',
    human: 'カスタマーサポート、重要機能承認',
    criteria: '無料→有料転換率7%以上、CAC < LTV ÷ 3'
  }
]

// AI自動化機能
const aiAutomationFeatures = [
  {
    title: '市場調査エンジン',
    description: 'トレンドキーワード抽出から技術的実現可能性評価まで',
    technologies: ['Python', 'LLM API', 'データ分析'],
    capabilities: [
      'トレンドキーワードの自動抽出',
      '技術的実現可能性の自動評価',
      'ニッチ市場の特定と優先順位付け'
    ]
  },
  {
    title: '自動LP生成',
    description: 'コピーライティングからデザイン、デプロイまで完全自動化',
    technologies: ['Claude Code', 'Vercel API', 'Next.js'],
    capabilities: [
      'ターゲットに合わせたコピー生成',
      'レスポンシブデザインの自動作成',
      '即座のVercelデプロイ'
    ]
  },
  {
    title: 'MVP自動開発',
    description: 'テスト駆動開発による高品質なMVP構築',
    technologies: ['TypeScript', 'Convex', 'GitHub Actions'],
    capabilities: [
      'テスト自動生成と実装',
      'CI/CDパイプライン構築',
      'パフォーマンス監視統合'
    ]
  }
]

// データフロー
const dataFlowSteps = [
  { step: 'ユーザー行動', icon: '👤', description: 'Webサイト・アプリでのユーザー操作' },
  { step: 'PostHog収集', icon: '📊', description: 'リアルタイムイベント収集' },
  { step: 'Streaming ETL', icon: '🔄', description: 'データ変換・正規化' },
  { step: '分析エンジン', icon: '🧠', description: 'ML/AI によるパターン分析' },
  { step: '自動最適化', icon: '⚙️', description: 'システム自動調整' },
  { step: 'A/Bテスト実行', icon: '🧪', description: '仮説検証・効果測定' }
]

// セキュリティ対策
const securityMeasures = [
  {
    level: 'コードレベル',
    measures: ['Semgrepによる静的解析', 'セキュアコーディング規約', '脆弱性スキャン']
  },
  {
    level: 'ランタイム',
    measures: ['Sentryによる異常検知', 'リアルタイム監視', 'インシデント自動対応']
  },
  {
    level: 'データ',
    measures: ['暗号化（送信時・保存時）', 'アクセス制御', 'GDPR準拠データ分離']
  },
  {
    level: 'ネットワーク',
    measures: ['Cloudflare WAF', 'DDoS保護', 'レート制限']
  }
]

// パフォーマンス目標
const performanceTargets = [
  { metric: 'LP生成時間', target: '< 2時間', description: 'アイデアから公開まで' },
  { metric: 'MVP開発時間', target: '< 24時間', description: '基本機能の実装とデプロイ' },
  { metric: 'レスポンスタイム', target: '< 100ms (P95)', description: 'API応答時間' },
  { metric: '可用性', target: '99.9%', description: 'サービス稼働率' }
]

export default function UnsonOSArchitecturePage() {
  const readingTime = '約15分'
  
  return (
    <DocsLayout>
      {/* 期待値管理バナー */}
      <ExpectationBanner 
        status="in-discussion" 
        className="mb-6"
      />
      
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center gap-2 text-sm text-blue-600 mb-4">
              <StatusBadge status="in-discussion" size="md" />
              <span>•</span>
              <span>📖 読み時間：{readingTime}</span>
              <span>•</span>
              <span>🔄 最終更新：2025年7月</span>
            </div>
            <h1 className="heading-primary text-gray-900 mb-6">
              Unson OS
              <span className="block text-blue-600 mt-2">
                技術アーキテクチャ
              </span>
            </h1>
            <p className="text-large text-gray-600 mb-8">
              AIエージェントによってマイクロサービスを自動生成・運用するプラットフォーム。
              会社の運営自体をソフトウェア化し、誰もが自律的なビジネスを構築できる基盤を提供します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationLink href="/docs/technical/pipeline" variant="default" size="lg">
                サービス生成パイプライン
              </NavigationLink>
              <NavigationLink href="/docs/quickstart" variant="outline" size="lg">
                クイックスタート
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
                <a href="#core-concepts" className="block text-blue-600 hover:text-blue-800 py-1">1. コアコンセプト</a>
                <a href="#system-architecture" className="block text-blue-600 hover:text-blue-800 py-1">2. システム構成</a>
                <a href="#four-gate-system" className="block text-blue-600 hover:text-blue-800 py-1">3. 4段階ゲートシステム</a>
                <a href="#ai-automation" className="block text-blue-600 hover:text-blue-800 py-1">4. AI駆動の自動化</a>
              </div>
              <div>
                <a href="#data-flow" className="block text-blue-600 hover:text-blue-800 py-1">5. データフロー</a>
                <a href="#security" className="block text-blue-600 hover:text-blue-800 py-1">6. セキュリティ設計</a>
                <a href="#scalability" className="block text-blue-600 hover:text-blue-800 py-1">7. スケーラビリティ</a>
                <a href="#developer-guide" className="block text-blue-600 hover:text-blue-800 py-1">8. 開発者向けガイド</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* コアコンセプト */}
      <section id="core-concepts" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">コアコンセプト</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {coreConceptsData.map((concept, index) => (
                <div key={index} className="card">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-4">{concept.icon}</span>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {concept.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-4">{concept.description}</p>
                  <ul className="space-y-2">
                    {concept.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-gray-600 flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🎯 基本理念
              </h3>
              <p className="text-gray-600">
                従来の企業運営を根本から再定義し、AIと人間が最適に協働する環境を構築。
                価値創造のサイクルを限りなく高速化し、アイデアが形になるまでの時間を劇的に短縮。
                真に必要とされるサービスだけが生き残る健全なエコシステムを実現します。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* システム構成 */}
      <section id="system-architecture" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="heading-secondary mb-6">システム構成</h2>
              <p className="text-large text-gray-600">
                4層アーキテクチャによる包括的なプラットフォーム設計
              </p>
            </div>
            
            <div className="space-y-6">
              {techStackLayers.map((layer, index) => (
                <div key={index} className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {layer.layer}
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      layer.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                      layer.color === 'green' ? 'bg-green-100 text-green-800' :
                      layer.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {layer.technologies.length}個のサービス
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{layer.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {layer.technologies.map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className={`px-3 py-1 text-sm rounded-full ${
                          layer.color === 'blue' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          layer.color === 'green' ? 'bg-green-50 text-green-700 border border-green-200' :
                          layer.color === 'purple' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                          'bg-orange-50 text-orange-700 border border-orange-200'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🎯 推奨技術構成
              </h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong className="text-gray-900">フロントエンド</strong>
                  <p className="text-gray-600">Next.js (App Router)</p>
                </div>
                <div>
                  <strong className="text-gray-900">バックエンド</strong>
                  <p className="text-gray-600">Convex (AIエージェント特化)</p>
                </div>
                <div>
                  <strong className="text-gray-900">ホスティング</strong>
                  <p className="text-gray-600">Vercel + Stripe</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4段階ゲートシステム */}
      <section id="four-gate-system" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="heading-secondary mb-6">4段階ゲートシステム</h2>
              <p className="text-large text-gray-600">
                データドリブンな判断基準による段階的な品質管理
              </p>
            </div>
            
            <div className="space-y-8">
              {gateSystemPhases.map((phase, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex flex-col items-center mr-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center text-2xl">
                      {phase.icon}
                    </div>
                    {index < gateSystemPhases.length - 1 && (
                      <div className="w-0.5 h-16 bg-blue-200 mt-4"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 pb-8">
                    <div className="card">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        フェーズ{phase.phase}: {phase.title}
                      </h3>
                      
                      <div className="grid md:grid-cols-3 gap-4 mb-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">📥 入力</h4>
                          <p className="text-sm text-gray-600">{phase.input}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">⚙️ 処理</h4>
                          <p className="text-sm text-gray-600">{phase.processing}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">📤 出力</h4>
                          <p className="text-sm text-gray-600">{phase.output}</p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">🤖 自動化範囲</h4>
                          <p className="text-sm text-gray-600">{phase.automation}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">👥 人間の役割</h4>
                          <p className="text-sm text-gray-600">{phase.human}</p>
                        </div>
                      </div>
                      
                      {phase.criteria && (
                        <div className="p-3 bg-green-50 rounded-lg">
                          <h4 className="font-medium text-green-900 mb-1">✅ 通過基準</h4>
                          <p className="text-sm text-green-700">{phase.criteria}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI駆動の自動化 */}
      <section id="ai-automation" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">AI駆動の自動化</h2>
            
            <div className="grid gap-8">
              {aiAutomationFeatures.map((feature, index) => (
                <div key={index} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <div className="flex gap-2">
                      {feature.technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {feature.capabilities.map((capability, capIndex) => (
                      <div key={capIndex} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">{capability}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* データフロー */}
      <section id="data-flow" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">データフロー</h2>
            
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                リアルタイムパイプライン
              </h3>
              <div className="flex flex-col space-y-4">
                {dataFlowSteps.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm mr-4">
                      <span className="text-xl">{step.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{step.step}</h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                    {index < dataFlowSteps.length - 1 && (
                      <div className="ml-4">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* セキュリティ設計 */}
      <section id="security" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">セキュリティ設計</h2>
            
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">多層防御アプローチ</h3>
              {securityMeasures.map((security, index) => (
                <div key={index} className="card">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    {index + 1}. {security.level}
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {security.measures.map((measure, measureIndex) => (
                      <div key={measureIndex} className="p-3 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-700">{measure}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-yellow-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🔒 コンプライアンス対応
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• GDPR対応のデータ分離とプライバシー保護</li>
                <li>• PII（個人識別情報）の自動マスキング</li>
                <li>• 監査ログの完全記録と長期保存</li>
                <li>• セキュリティインシデント対応体制</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* スケーラビリティ */}
      <section id="scalability" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">スケーラビリティ</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🔄 水平スケーリング
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Vercel Serverless Functionsによる自動スケール</li>
                  <li>• データベースのシャーディング</li>
                  <li>• CDNによるグローバル配信</li>
                  <li>• マイクロサービス間の疎結合</li>
                </ul>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📊 パフォーマンス目標
                </h3>
                <div className="space-y-3">
                  {performanceTargets.map((target, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium text-gray-900">{target.metric}</span>
                        <p className="text-xs text-gray-500">{target.description}</p>
                      </div>
                      <span className="text-green-600 font-semibold">{target.target}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 開発者向けガイド */}
      <section id="developer-guide" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">開発者向けガイド</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🛠️ ローカル開発環境
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  <pre>{`# リポジトリのクローン
git clone https://github.com/unson/unson-os

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env.local

# 開発サーバーの起動
npm run dev`}</pre>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🤝 コントリビューション
                </h3>
                <ol className="space-y-2 text-gray-600 list-decimal list-inside">
                  <li>Issueの作成または既存Issueの選択</li>
                  <li>フィーチャーブランチの作成</li>
                  <li>テスト駆動での実装</li>
                  <li>PRの提出</li>
                  <li>自動レビューとマージ</li>
                </ol>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                📈 モニタリングとアラート
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <strong className="text-gray-900 block mb-2">KPIダッシュボード</strong>
                  <ul className="space-y-1 text-gray-600">
                    <li>• リアルタイムの収益状況</li>
                    <li>• サービスごとの健全性</li>
                    <li>• ユーザー行動の可視化</li>
                    <li>• コスト分析</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-gray-900 block mb-2">自動アラート</strong>
                  <ul className="space-y-1 text-gray-600">
                    <li>• エラー率 &gt; 5% → 自動ロールバック</li>
                    <li>• コスト超過 &gt; 120% → サービス停止</li>
                    <li>• 転換率低下 &lt; 5% → A/Bテスト開始</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Unson OS の開発に参加しよう"
        subtitle="革新的なプラットフォームの構築に参加し、未来のビジネスモデルを共に作り上げませんか？"
        actions={[
          { label: 'GitHub で貢献', href: 'https://github.com/unson-llc/unson-os', external: true },
          { label: 'Discord に参加', href: '/community', variant: 'outline' }
        ]}
        backgroundColor="bg-gradient-to-r from-blue-600 to-indigo-600"
      />

      {/* ナビゲーション */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <NavigationLink href="/docs" variant="outline" size="sm">
                ← ドキュメント一覧
              </NavigationLink>
              <NavigationLink href="/docs/technical/pipeline" variant="outline" size="sm">
                サービス生成パイプライン →
              </NavigationLink>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="/docs/technical/pipeline" className="text-blue-600 hover:text-blue-800">サービス生成パイプライン</a>
              <span className="text-gray-300">|</span>
              <a href="/docs/design/specification" className="text-blue-600 hover:text-blue-800">設計仕様書</a>
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