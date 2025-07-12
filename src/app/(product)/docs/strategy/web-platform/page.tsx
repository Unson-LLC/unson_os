import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'
import { DocsLayout } from '@/components/layout/DocsLayout'

export const metadata: Metadata = {
  title: 'Webプラットフォーム戦略 - Unson OS ドキュメント',
  description: 'UnsonOSプロジェクトの段階的なWeb展開戦略。コンセプト訴求期から段階的自動化プラットフォームまでの3フェーズアプローチ。',
  openGraph: {
    title: 'Webプラットフォーム戦略 - Unson OS ドキュメント',
    description: 'UnsonOSプロジェクトの段階的なWeb展開戦略。コンセプト訴求期から段階的自動化プラットフォームまでの3フェーズアプローチ。',
  },
}

// 3フェーズ戦略
const threePhases = [
  {
    phase: 1,
    title: 'コンセプト訴求期',
    period: '現在〜3ヶ月',
    description: 'UnsonOSコンセプトの理解促進と初期コミュニティ形成',
    objectives: [
      'UnsonOSコンセプトの理解促進',
      '初期コミュニティ（100-1,000人）形成',
      '投資家・パートナーとの初期関係構築'
    ],
    siteStructure: {
      'unson-os.com/': 'メインLP（一般向け）',
      'unson-os.com/dao': 'DAO参加者向け',
      'unson-os.com/investors': '投資家向け',
      'unson-os.com/waitlist': '早期アクセス登録',
      'unson-os.com/docs': 'プロジェクト文書',
      'unson-os.com/blog': '進捗・思考プロセス共有'
    },
    kpis: [
      { metric: 'LP登録率', target: '10%以上', method: 'GA4/Hotjar' },
      { metric: 'DAO参加申込', target: '100人', method: '登録フォーム' },
      { metric: '投資家問い合わせ', target: '10件', method: '問い合わせフォーム' },
      { metric: 'メディア露出', target: '5媒体', method: '手動集計' },
      { metric: '滞在時間', target: '3分以上', method: 'GA4' }
    ]
  },
  {
    phase: 2,
    title: '実証段階ハブ',
    period: '3〜6ヶ月',
    description: '実際のSaaS生成・運用実績の展示と収益分配システム稼働',
    objectives: [
      '実際のSaaS生成・運用実績の展示',
      'コミュニティ主導開発の実証',
      '収益分配システムの稼働実績公開'
    ],
    siteStructure: {
      'unson-os.com/': '更新されたメインLP',
      'unson-os.com/products': '実稼働SaaS一覧・実績',
      'unson-os.com/playground': 'MVP試用エリア',
      'unson-os.com/dashboard': '貢献者ダッシュボード',
      'unson-os.com/governance': 'DAO投票・提案インターフェース',
      'unson-os.com/analytics': 'リアルタイム収益・KPI表示'
    },
    kpis: [
      { metric: 'MAU', target: '1,000人', method: 'GA4' },
      { metric: 'DAO参加者', target: '500人', method: 'ウォレット接続数' },
      { metric: '稼働プロダクト数', target: '10個', method: '手動集計' },
      { metric: '月間収益', target: '$10,000', method: 'Stripe Analytics' },
      { metric: '投票参加率', target: '30%', method: 'Snapshot' }
    ]
  },
  {
    phase: 3,
    title: '段階的自動化プラットフォーム',
    period: '6ヶ月〜',
    description: '完全自律型SaaS生成システムとグローバルコミュニティハブ',
    objectives: [
      '完全自律型SaaS生成システムの提供',
      'グローバルコミュニティのハブ機能',
      '新規事業領域への展開基盤'
    ],
    siteStructure: {
      'app.unson-os.com/generator': 'AI SaaS生成インターフェース',
      'app.unson-os.com/portfolio': '個人プロダクトポートフォリオ',
      'app.unson-os.com/marketplace': 'プロダクト・サービス取引',
      'app.unson-os.com/governance': '高度なDAO機能',
      'unson-os.com/': '企業情報・ニュース',
      'unson-os.com/ecosystem': 'パートナー・統合情報'
    },
    kpis: [
      { metric: 'MAU', target: '10,000人', method: 'GA4' },
      { metric: '稼働プロダクト数', target: '100個（3年目標）', method: '自動集計' },
      { metric: '月間収益', target: '$1,000,000', method: 'Stripe Analytics' },
      { metric: 'DAO参加者', target: '5,000人', method: 'オンチェーン分析' },
      { metric: 'API利用数', target: '100,000/月', method: 'API Gateway' }
    ]
  }
]

// 主要機能（フェーズ別）
const phaseFeatures = [
  {
    phase: 1,
    title: 'コンセプト訴求期の主要機能',
    features: [
      {
        category: 'インタラクティブ説明',
        items: ['DAO配当シミュレーター', 'SaaS自動生成プレビュー', '収益分配可視化ツール']
      },
      {
        category: 'コミュニティ機能',
        items: ['Discord/Slack統合', '早期参加者登録', '貢献者募集フォーム']
      },
      {
        category: '透明性ツール',
        items: ['プロジェクト進捗公開', '意思決定プロセス可視化', '資金調達状況表示']
      }
    ]
  },
  {
    phase: 2,
    title: '実証段階ハブの追加機能',
    features: [
      {
        category: 'プロダクトショーケース',
        items: ['稼働中SaaSの実績表示', 'ユーザー数・収益のリアルタイム更新', '成功・失敗プロダクトの透明な公開']
      },
      {
        category: '参加型機能',
        items: ['アイデア投稿・投票システム', '貢献実績の可視化', '収益分配の履歴表示']
      },
      {
        category: '開発者ツール',
        items: ['API仕様書', 'SDK・ライブラリ', 'コントリビューションガイド']
      }
    ]
  },
  {
    phase: 3,
    title: '段階的自動化プラットフォームの高度機能',
    features: [
      {
        category: 'AI SaaS生成エンジン',
        items: ['自然言語での要求→SaaS自動生成', 'リアルタイム市場分析・競合チェック', '自動価格設定・マーケティング戦略']
      },
      {
        category: '分散型ガバナンス',
        items: ['SubDAO管理インターフェース', '複雑な投票メカニズム', 'スマートコントラクト統合']
      },
      {
        category: 'エコシステム機能',
        items: ['他社API統合マーケットプレイス', 'プロダクト間シナジー分析', '自動M&A・パートナーシップ提案']
      }
    ]
  }
]

// 技術スタック
const techStack = [
  {
    phase: 'Phase 1',
    stack: {
      'フレームワーク': 'Next.js 14 + TypeScript',
      'スタイリング': 'Tailwind CSS + Framer Motion',
      'CMS': 'Notion API（進捗レポート管理）',
      '分析': 'Vercel Analytics + Hotjar',
      'ホスティング': 'Vercel'
    }
  },
  {
    phase: 'Phase 2',
    stack: {
      'フレームワーク': 'Next.js 14 + TypeScript',
      'データベース': 'Convex（リアルタイムDB）',
      '認証': 'NextAuth.js + Web3Modal',
      '決済': 'Stripe + 暗号通貨ウォレット',
      'ブロックチェーン': 'Base（Ethereum L2）'
    }
  },
  {
    phase: 'Phase 3',
    stack: {
      'AI/ML': 'OpenAI GPT-4, Claude, Custom Models',
      'インフラ': 'AWS/GCP + Kubernetes',
      'API Gateway': 'Kong + Rate Limiting',
      'モニタリング': 'Datadog + Sentry',
      'セキュリティ': 'SOC2 Type II + WAF'
    }
  }
]

// リスク管理
const riskManagement = [
  {
    category: '技術的リスク',
    risks: [
      { risk: 'スケーラビリティ問題', impact: '高', mitigation: 'Vercel Pro + CDN活用' },
      { risk: 'セキュリティ脆弱性', impact: '高', mitigation: '定期的セキュリティ監査' },
      { risk: 'API制限・障害', impact: '中', mitigation: '複数プロバイダー併用' }
    ]
  },
  {
    category: 'ビジネスリスク',
    risks: [
      { risk: '概念理解困難', impact: '高', mitigation: 'シンプル化・デモ充実' },
      { risk: '競合コピー', impact: '中', mitigation: '先行者利益最大化' },
      { risk: '規制変更', impact: '中', mitigation: '法務アドバイザー連携' }
    ]
  },
  {
    category: '運用リスク',
    risks: [
      { risk: 'コンテンツ管理負荷', impact: '中', mitigation: '自動化・外部委託' },
      { risk: 'コミュニティ運営', impact: '高', mitigation: 'モデレーション体制' },
      { risk: '多言語対応遅れ', impact: '低', mitigation: '段階的展開' }
    ]
  }
]

// 実装ロードマップ
const implementationRoadmap = [
  {
    period: 'Phase 1実装（0-30日）',
    tasks: [
      'Next.js基盤構築',
      'メインLP設計・実装',
      '3ターゲット向けページ作成',
      'Notion CMS統合',
      '分析ツール設定'
    ]
  },
  {
    period: 'Phase 1改善（30-90日）',
    tasks: [
      'A/Bテスト実施・最適化',
      'ユーザーフィードバック収集・反映',
      'SEO最適化',
      'ソーシャルメディア統合',
      'プレスキット準備'
    ]
  },
  {
    period: 'Phase 2準備（60-120日）',
    tasks: [
      '実プロダクト統合準備',
      'ダッシュボード設計',
      'API設計・実装',
      '認証システム構築',
      '決済システム統合'
    ]
  },
  {
    period: 'Phase 3設計（150-210日）',
    tasks: [
      'スケーラビリティ検証',
      'AI統合アーキテクチャ設計',
      'セキュリティ監査',
      '国際化準備',
      'エンタープライズ機能設計'
    ]
  }
]

export default function WebPlatformStrategyPage() {
  const readingTime = '約22分'
  
  return (
    <DocsLayout>
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center gap-2 text-sm text-cyan-600 mb-4">
              <span>📖 読み時間：{readingTime}</span>
              <span>•</span>
              <span>🔄 最終更新：2025年7月</span>
            </div>
            <h1 className="heading-primary text-gray-900 mb-6">
              Webプラットフォーム戦略
              <span className="block text-cyan-600 mt-2">
                3フェーズで進化する段階的展開
              </span>
            </h1>
            <p className="text-large text-gray-600 mb-8">
              UnsonOSプロジェクトの段階的なWeb展開戦略。
              現在の戦略策定段階から段階的自動化プラットフォームまでの進化的アプローチです。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationLink href="/docs/strategy/micro-business" variant="default" size="lg">
                マイクロビジネス戦略
              </NavigationLink>
              <NavigationLink href="/docs/strategy/saas-design" variant="outline" size="lg">
                SaaS設計プロセス
              </NavigationLink>
            </div>
          </div>
        </div>
      </section>

      {/* 戦略的背景 */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-secondary mb-6">
              戦略的背景
            </h2>
            <p className="text-large text-gray-600 mb-8">
              複雑な概念の理解促進と段階的実証による信頼性構築
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                現在の状況
              </h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>• 戦略立案・概念検証段階</li>
                <li>• 複雑な概念の理解促進が課題</li>
                <li>• MVP検証フレームワーク準備中</li>
              </ul>
            </div>
            
            <div className="card text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                基本方針
              </h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>• 段階的アプローチ（概念→実証→自動化）</li>
                <li>• マルチターゲット（一般・DAO・投資家）</li>
                <li>• 実績連動での次段階移行</li>
              </ul>
            </div>
            
            <div className="card text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                目標
              </h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>• 初期コミュニティ形成</li>
                <li>• 実際の収益実績構築</li>
                <li>• 自動化プラットフォーム実現</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3フェーズ戦略 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              3フェーズ進化戦略
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              段階的な機能拡張とKPI達成による確実な成長
            </p>
          </div>
          
          <div className="space-y-12">
            {threePhases.map((phase, index) => (
              <div key={index} className="max-w-6xl mx-auto">
                <div className="flex items-start">
                  <div className="flex flex-col items-center mr-8">
                    <div className="w-20 h-20 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                      {phase.phase}
                    </div>
                    {index < threePhases.length - 1 && (
                      <div className="w-0.5 h-24 bg-cyan-200 mt-6"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 pb-12">
                    <div className="card">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                            {phase.title}
                          </h3>
                          <div className="text-cyan-600 font-medium">{phase.period}</div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-6">{phase.description}</p>
                      
                      <div className="grid lg:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">主要目標</h4>
                          <ul className="space-y-2">
                            {phase.objectives.map((objective, objIndex) => (
                              <li key={objIndex} className="text-sm text-gray-600 flex items-start">
                                <span className="text-cyan-500 mr-2">•</span>
                                {objective}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">サイト構造</h4>
                          <div className="space-y-2">
                            {Object.entries(phase.siteStructure).map(([path, description], pathIndex) => (
                              <div key={pathIndex} className="text-sm">
                                <div className="font-mono text-cyan-600">{path}</div>
                                <div className="text-gray-600 ml-4">{description}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">KPI目標</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2">指標</th>
                                <th className="text-left py-2">目標値</th>
                                <th className="text-left py-2">測定方法</th>
                              </tr>
                            </thead>
                            <tbody>
                              {phase.kpis.map((kpi, kpiIndex) => (
                                <tr key={kpiIndex} className="border-b">
                                  <td className="py-2 font-medium">{kpi.metric}</td>
                                  <td className="py-2 text-cyan-600 font-semibold">{kpi.target}</td>
                                  <td className="py-2 text-gray-600">{kpi.method}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* フェーズ別主要機能 */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              フェーズ別主要機能
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              段階的な機能拡張による価値提供の進化
            </p>
          </div>
          
          <div className="space-y-8">
            {phaseFeatures.map((phaseFeature, index) => (
              <div key={index} className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Phase {phaseFeature.phase}: {phaseFeature.title}
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {phaseFeature.features.map((feature, featureIndex) => (
                    <div key={featureIndex}>
                      <h4 className="font-medium text-gray-900 mb-3">{feature.category}</h4>
                      <ul className="space-y-2">
                        {feature.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm text-gray-600">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 技術スタック */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              段階的技術スタック
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              各フェーズに適した技術選択と段階的複雑化
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {techStack.map((tech, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  {tech.phase}
                </h3>
                <div className="space-y-4">
                  {Object.entries(tech.stack).map(([category, technologies], stackIndex) => (
                    <div key={stackIndex}>
                      <h4 className="font-medium text-gray-800 mb-2">{category}</h4>
                      <p className="text-sm text-gray-600">{technologies}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-6 bg-cyan-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🏗️ 技術選択の原則
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong className="text-gray-900">Phase 1</strong>
                <p className="text-gray-600">シンプル・高速・低コスト</p>
              </div>
              <div>
                <strong className="text-gray-900">Phase 2</strong>
                <p className="text-gray-600">リアルタイム・インタラクティブ</p>
              </div>
              <div>
                <strong className="text-gray-900">Phase 3</strong>
                <p className="text-gray-600">エンタープライズ・グローバル</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* リスク管理・対策 */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              リスク管理・対策
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              各カテゴリーのリスクに対する予防的対策
            </p>
          </div>
          
          <div className="space-y-8">
            {riskManagement.map((category, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  {category.category}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3">リスク</th>
                        <th className="text-left py-3">影響度</th>
                        <th className="text-left py-3">対策</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.risks.map((risk, riskIndex) => (
                        <tr key={riskIndex} className="border-b">
                          <td className="py-3">{risk.risk}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              risk.impact === '高' ? 'bg-red-100 text-red-800' :
                              risk.impact === '中' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {risk.impact}
                            </span>
                          </td>
                          <td className="py-3 text-gray-600">{risk.mitigation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 実装ロードマップ */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              実装ロードマップ
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              段階的実装による確実な価値提供
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {implementationRoadmap.map((roadmap, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex flex-col items-center mr-6">
                    <div className="w-12 h-12 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    {index < implementationRoadmap.length - 1 && (
                      <div className="w-0.5 h-16 bg-cyan-200 mt-4"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 pb-8">
                    <div className="card">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {roadmap.period}
                      </h3>
                      <ul className="grid md:grid-cols-2 gap-2">
                        {roadmap.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="text-sm text-gray-600 flex items-start">
                            <span className="text-cyan-500 mr-2">□</span>
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 成功指標・評価基準 */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              成功指標・評価基準
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              各フェーズでの明確な達成目標
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                短期指標（Phase 1）
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  LP登録率10%達成
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  メディア露出5媒体以上
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  DAO参加希望者100人突破
                </li>
              </ul>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                中期指標（Phase 2）
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="text-yellow-500 mr-2">○</span>
                  MAU 1,000人達成
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-500 mr-2">○</span>
                  月間収益$10,000達成
                </li>
                <li className="flex items-center">
                  <span className="text-yellow-500 mr-2">○</span>
                  実稼働プロダクト10個
                </li>
              </ul>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                長期指標（Phase 3）
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">◯</span>
                  MAU 10,000人達成
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">◯</span>
                  月間収益$1,000,000達成
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">◯</span>
                  稼働プロダクト100個（3年目標）
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Webプラットフォーム戦略を実践しよう"
        subtitle="段階的アプローチで、UnsonOSのWebプラットフォームを一緒に構築しませんか？"
        actions={[
          { label: 'マイクロビジネス戦略', href: '/docs/strategy/micro-business' },
          { label: 'SaaS設計プロセス', href: '/docs/strategy/saas-design', variant: 'outline' }
        ]}
        backgroundColor="bg-gradient-to-r from-cyan-600 to-blue-600"
      />

      {/* ナビゲーション */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/strategy/micro-business" className="text-blue-600 hover:text-blue-800">マイクロビジネス戦略</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/strategy/mvp-validation" className="text-blue-600 hover:text-blue-800">MVP検証フレームワーク</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/strategy/saas-design" className="text-blue-600 hover:text-blue-800">SaaS設計プロセス</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/strategy/user-research" className="text-blue-600 hover:text-blue-800">ユーザー調査手法</a>
            <span className="text-gray-300">|</span>
            <a href="/docs" className="text-blue-600 hover:text-blue-800">ドキュメント一覧</a>
          </div>
        </div>
      </section>
    </DocsLayout>
  )
}