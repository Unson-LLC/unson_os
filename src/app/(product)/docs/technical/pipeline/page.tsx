import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: '自動サービス生成パイプライン - Unson OS ドキュメント',
  description: 'アイデアから収益化までを自動化するパイプライン、AIエージェント主導の開発フロー、人間の関与ポイントの詳細仕様。',
  openGraph: {
    title: '自動サービス生成パイプライン - Unson OS ドキュメント',
    description: 'アイデアから収益化までを自動化するパイプライン、AIエージェント主導の開発フロー、人間の関与ポイントの詳細仕様。',
  },
}

// パイプライン概要
const pipelineOverview = [
  { step: '市場調査', icon: '🔍', next: 'アイデア生成' },
  { step: 'アイデア生成', icon: '💡', next: 'LP作成' },
  { step: 'LP作成', icon: '🎨', next: 'ゲート①' },
  { step: 'ゲート①', icon: '🚪', next: 'MVP開発', condition: '通過基準達成' },
  { step: 'MVP開発', icon: '⚡', next: 'ゲート②' },
  { step: 'ゲート②', icon: '🚪', next: '課金実装', condition: '通過基準達成' },
  { step: '課金実装', icon: '💰', next: 'ゲート③' },
  { step: 'ゲート③', icon: '🚪', next: 'スケール', condition: '通過基準達成' },
  { step: 'スケール', icon: '📈', next: '継続改善' },
  { step: '継続改善', icon: '🔄', next: null }
]

// 市場調査・アイデア生成
const ideaGenerationData = {
  trendKeywords: [
    'AI', '自動化', 'リモートワーク',
    'サステナビリティ', 'メンタルヘルス'
  ],
  techKeywords: [
    '自動化', 'データ分析', '最適化',
    '可視化', '統合'
  ],
  evaluationCriteria: [
    { item: '市場規模', weight: '30%', threshold: '10万人以上' },
    { item: '競合数', weight: '25%', threshold: '10社以下' },
    { item: '開発容易性', weight: '25%', threshold: '1週間以内' },
    { item: '差別化可能性', weight: '20%', threshold: '明確な独自性' }
  ]
}

// LP作成プロセス
const lpCreationProcess = [
  {
    step: 'コピーライティング',
    automation: 'Claude Code による自動生成',
    output: ['問題提起型ヘッドライン', '解決策の提示', '利点リスト', '行動喚起文言'],
    timeframe: '30分'
  },
  {
    step: 'デザイン生成',
    automation: '自動レイアウト適用',
    output: ['カラースキーム選択', 'レスポンシブレイアウト', '画像・アイコン生成'],
    timeframe: '1時間'
  },
  {
    step: 'A/Bテスト設定',
    automation: 'バリエーション自動作成',
    output: ['見出しバリエーション', 'CTAボタン最適化', '価格表示テスト'],
    timeframe: '30分'
  }
]

// ゲート通過基準
const gatesCriteria = [
  {
    gate: 'ゲート①（LP段階）',
    period: '7日間',
    criteria: [
      { metric: '訪問者数', minimum: '1,000人以上' },
      { metric: 'メール登録率', minimum: '10%以上' },
      { metric: '滞在時間', minimum: '30秒以上' },
      { metric: '直帰率', maximum: '70%以下' }
    ]
  },
  {
    gate: 'ゲート②（MVP段階）',
    period: '2週間',
    criteria: [
      { metric: '週次利用者', minimum: '200人以上' },
      { metric: '7日後残存率', minimum: '30%以上' },
      { metric: 'コア機能利用率', minimum: '80%以上' },
      { metric: 'NPS', minimum: '30以上' }
    ]
  },
  {
    gate: 'ゲート③（課金段階）',
    period: '1ヶ月',
    criteria: [
      { metric: '無料→有料転換率', minimum: '7%以上' },
      { metric: 'LTV/CAC比率', minimum: '3.0以上' },
      { metric: 'チャーン率', maximum: '5%以下' },
      { metric: 'ペイバック期間', maximum: '6ヶ月以内' }
    ]
  }
]

// MVP技術テンプレート
const mvpTechStack = {
  frontend: {
    framework: 'Next.js 14',
    ui: 'shadcn/ui',
    styling: 'Tailwind CSS',
    forms: 'React Hook Form + Zod'
  },
  backend: {
    runtime: 'Convex',
    database: 'Convex',
    auth: 'Clerk',
    payments: 'Stripe'
  },
  features: {
    core: ['ユーザー認証', 'データ管理', '基本操作'],
    niceToHave: ['高度な分析', '統合機能', 'API連携']
  }
}

// 自動実装フロー
const implementationFlow = [
  {
    phase: '要件定義',
    tasks: ['LPから機能要件抽出', 'ユーザーストーリー生成', '受け入れ基準設定'],
    duration: '2-4時間',
    automation: '90%'
  },
  {
    phase: 'テスト駆動開発',
    tasks: ['テストコード生成', '実装', 'リファクタリング'],
    duration: '1-2日',
    automation: '80%'
  },
  {
    phase: 'デプロイ・監視',
    tasks: ['CI/CD設定', '本番デプロイ', 'メトリクス収集'],
    duration: '2-4時間',
    automation: '95%'
  }
]

// Stripe統合設定
const stripeIntegration = {
  pricingTiers: [
    { name: 'Free', price: 0, features: ['基本機能', '月5回まで', 'コミュニティサポート'] },
    { name: 'Pro', price: 1500, features: ['全機能', '無制限利用', 'メールサポート'] },
    { name: 'Enterprise', price: 4800, features: ['全機能', 'API連携', '専用サポート'] }
  ],
  optimization: {
    method: 'ベイジアン最適化',
    target: 'ARPU（ユーザー平均収益）',
    testDuration: '2週間',
    variants: '価格・プラン構成・割引戦略'
  }
}

// 人間の関与ポイント
const humanInvolvementPoints = [
  {
    category: 'Go/No-Go判定',
    timing: '各ゲート通過時',
    responsibility: ['最終承認', '重大な方向転換', '投資判断'],
    sla: '4-24時間以内'
  },
  {
    category: '品質管理',
    timing: '実装完了時',
    responsibility: ['デザイン・ブランド確認', '法的・倫理的レビュー', 'UX最終調整'],
    sla: '2-8時間以内'
  },
  {
    category: '例外処理',
    timing: '自動化失敗時',
    responsibility: ['技術的課題解決', '重要顧客対応', 'パートナーシップ'],
    sla: '1-48時間以内'
  }
]

// 承認プロセス
const approvalProcess = [
  {
    gate: 'ゲート①',
    approvers: ['Curator'],
    criteria: 'LP品質とメッセージング',
    sla: '4時間以内'
  },
  {
    gate: 'ゲート②',
    approvers: ['Curator', 'Craftsman'],
    criteria: 'MVP品質とUX',
    sla: '8時間以内'
  },
  {
    gate: 'ゲート③',
    approvers: ['Curator', 'CSO'],
    criteria: '収益性と持続可能性',
    sla: '24時間以内'
  }
]

// 自動介入ルール
const autoInterventionRules = [
  { condition: '48時間プロジェクト停滞', action: 'エスカレーション通知' },
  { condition: 'コスト超過20%', action: 'サービス一時停止' },
  { condition: 'エラー率5%超', action: '自動ロールバック' },
  { condition: '転換率50%低下', action: 'A/Bテスト再開' }
]

export default function ServiceGenerationPipelinePage() {
  const readingTime = '約18分'
  
  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center gap-2 text-sm text-green-600 mb-4">
              <span>📖 読み時間：{readingTime}</span>
              <span>•</span>
              <span>🔄 最終更新：2025年7月</span>
            </div>
            <h1 className="heading-primary text-gray-900 mb-6">
              自動サービス生成
              <span className="block text-green-600 mt-2">
                パイプライン
              </span>
            </h1>
            <p className="text-large text-gray-600 mb-8">
              アイデアから収益化まで、AIエージェントが主導し人間は重要な判断ポイントでのみ関与する
              効率的な自動化パイプラインの詳細仕様です。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationLink href="/docs/technical/architecture" variant="default" size="lg">
                技術アーキテクチャ
              </NavigationLink>
              <NavigationLink href="/docs/development/process" variant="outline" size="lg">
                開発プロセス
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
                <a href="#pipeline-overview" className="block text-blue-600 hover:text-blue-800 py-1">1. パイプライン全体像</a>
                <a href="#idea-generation" className="block text-blue-600 hover:text-blue-800 py-1">2. 市場調査・アイデア生成</a>
                <a href="#lp-creation" className="block text-blue-600 hover:text-blue-800 py-1">3. LP作成・検証</a>
                <a href="#mvp-development" className="block text-blue-600 hover:text-blue-800 py-1">4. MVP開発</a>
                <a href="#monetization" className="block text-blue-600 hover:text-blue-800 py-1">5. 課金実装</a>
              </div>
              <div>
                <a href="#scaling" className="block text-blue-600 hover:text-blue-800 py-1">6. スケーリング</a>
                <a href="#human-involvement" className="block text-blue-600 hover:text-blue-800 py-1">7. 人間の関与ポイント</a>
                <a href="#monitoring" className="block text-blue-600 hover:text-blue-800 py-1">8. モニタリング・アラート</a>
                <a href="#continuous-improvement" className="block text-blue-600 hover:text-blue-800 py-1">9. 継続的改善</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* パイプライン全体像 */}
      <section id="pipeline-overview" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">パイプライン全体像</h2>
            
            <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🎯 基本コンセプト
              </h3>
              <p className="text-gray-600 mb-4">
                月20個以上の新サービスを継続的に市場投入し、アイデアから収益化までの時間を従来の1/10以下に短縮。
                人間は創造性と判断力を発揮し、AIは実行と最適化を担当する協働モデルです。
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-white rounded">
                  <strong className="text-gray-900">開発速度</strong>
                  <p className="text-gray-600">2週間サイクル</p>
                </div>
                <div className="p-3 bg-white rounded">
                  <strong className="text-gray-900">成功率</strong>
                  <p className="text-gray-600">データ駆動判定</p>
                </div>
                <div className="p-3 bg-white rounded">
                  <strong className="text-gray-900">自動化率</strong>
                  <p className="text-gray-600">90%+ 自動実行</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {pipelineOverview.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                    {step.icon}
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{step.step}</h4>
                  {step.condition && (
                    <p className="text-xs text-gray-500">{step.condition}</p>
                  )}
                  {step.next && index < pipelineOverview.length - 1 && (
                    <div className="hidden md:block mt-2">
                      <svg className="w-6 h-6 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* アイデア生成 */}
      <section id="idea-generation" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">Phase 1: 市場調査・アイデア生成</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🔍 自動市場調査
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">トレンドキーワード</h4>
                    <div className="flex flex-wrap gap-2">
                      {ideaGenerationData.trendKeywords.map((keyword, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">技術キーワード</h4>
                    <div className="flex flex-wrap gap-2">
                      {ideaGenerationData.techKeywords.map((keyword, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📊 評価基準
                </h3>
                <div className="space-y-3">
                  {ideaGenerationData.evaluationCriteria.map((criteria, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium text-gray-900">{criteria.item}</span>
                        <p className="text-xs text-gray-500">重み: {criteria.weight}</p>
                      </div>
                      <span className="text-green-600 font-semibold text-sm">{criteria.threshold}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LP作成 */}
      <section id="lp-creation" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">Phase 2: LP作成・検証</h2>
            
            <div className="space-y-8">
              <div className="grid gap-6">
                {lpCreationProcess.map((process, index) => (
                  <div key={index} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {index + 1}. {process.step}
                      </h3>
                      <div className="text-right">
                        <span className="text-sm text-blue-600 font-medium">{process.timeframe}</span>
                        <p className="text-xs text-gray-500">{process.automation}</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-4 gap-3">
                      {process.output.map((output, outputIndex) => (
                        <div key={outputIndex} className="p-3 bg-blue-50 rounded text-sm text-blue-700">
                          {output}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  ✅ ゲート通過基準
                </h3>
                <div className="space-y-6">
                  {gatesCriteria.map((gate, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-gray-900 mb-3">
                        {gate.gate} <span className="text-sm text-gray-500">（{gate.period}）</span>
                      </h4>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                        {gate.criteria.map((criterion, criterionIndex) => (
                          <div key={criterionIndex} className="p-3 bg-green-50 rounded text-sm">
                            <div className="font-medium text-green-900">{criterion.metric}</div>
                            <div className="text-green-700">
                              {criterion.minimum && `≥ ${criterion.minimum}`}
                              {criterion.maximum && `≤ ${criterion.maximum}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MVP開発 */}
      <section id="mvp-development" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">Phase 3: MVP開発</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🛠️ 技術テンプレート
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">フロントエンド</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Framework:</span>
                        <span className="font-medium">{mvpTechStack.frontend.framework}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">UI:</span>
                        <span className="font-medium">{mvpTechStack.frontend.ui}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Styling:</span>
                        <span className="font-medium">{mvpTechStack.frontend.styling}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">バックエンド</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Runtime:</span>
                        <span className="font-medium">{mvpTechStack.backend.runtime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Database:</span>
                        <span className="font-medium">{mvpTechStack.backend.database}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Auth:</span>
                        <span className="font-medium">{mvpTechStack.backend.auth}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  ⚡ 自動実装フロー
                </h3>
                <div className="space-y-4">
                  {implementationFlow.map((flow, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{flow.phase}</h4>
                        <div className="text-right text-xs">
                          <div className="text-blue-600">{flow.duration}</div>
                          <div className="text-gray-500">自動化率: {flow.automation}</div>
                        </div>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {flow.tasks.map((task, taskIndex) => (
                          <li key={taskIndex}>• {task}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 課金実装 */}
      <section id="monetization" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">Phase 4: 課金実装</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  💳 Stripe統合
                </h3>
                <div className="space-y-4">
                  {stripeIntegration.pricingTiers.map((tier, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-900">{tier.name}</h4>
                        <span className="text-lg font-bold text-blue-600">
                          {tier.price === 0 ? '無料' : `¥${tier.price.toLocaleString()}`}
                        </span>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {tier.features.map((feature, featureIndex) => (
                          <li key={featureIndex}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📈 価格最適化
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded">
                    <h4 className="font-medium text-purple-900 mb-2">最適化手法</h4>
                    <p className="text-sm text-purple-700 mb-2">{stripeIntegration.optimization.method}</p>
                    <div className="text-xs text-purple-600">
                      <div>目標: {stripeIntegration.optimization.target}</div>
                      <div>期間: {stripeIntegration.optimization.testDuration}</div>
                    </div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded">
                    <h4 className="font-medium text-orange-900 mb-2">テスト項目</h4>
                    <p className="text-sm text-orange-700">{stripeIntegration.optimization.variants}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* スケーリング */}
      <section id="scaling" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">Phase 5: スケーリング</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📢 マーケティング自動化
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Facebook・Google・Twitter広告</li>
                  <li>• 動的予算配分</li>
                  <li>• ROAS最適化</li>
                  <li>• 自動停止・スケーリング</li>
                </ul>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🚀 機能拡張
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• ユーザーリクエスト自動分析</li>
                  <li>• 優先順位自動設定</li>
                  <li>• 実装とリリース</li>
                  <li>• 効果測定・改善</li>
                </ul>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🌍 国際展開
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• 多言語対応自動化</li>
                  <li>• 地域別価格設定</li>
                  <li>• 規制対応</li>
                  <li>• 現地化戦略</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 人間の関与ポイント */}
      <section id="human-involvement" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">人間の関与ポイント</h2>
            
            <div className="space-y-6">
              {humanInvolvementPoints.map((point, index) => (
                <div key={index} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {point.category}
                    </h3>
                    <div className="text-right">
                      <div className="text-sm text-blue-600">{point.timing}</div>
                      <div className="text-xs text-gray-500">SLA: {point.sla}</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-3">
                    {point.responsibility.map((resp, respIndex) => (
                      <div key={respIndex} className="p-3 bg-yellow-50 rounded text-sm text-yellow-700">
                        {resp}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📋 承認プロセス
              </h3>
              <div className="grid gap-4">
                {approvalProcess.map((approval, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded">
                    <div>
                      <span className="font-medium text-gray-900">{approval.gate}</span>
                      <p className="text-sm text-gray-600">{approval.criteria}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-blue-600">{approval.approvers.join(', ')}</div>
                      <div className="text-xs text-gray-500">{approval.sla}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* モニタリング・アラート */}
      <section id="monitoring" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">モニタリング・アラート</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📊 リアルタイムダッシュボード
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded">
                    <h4 className="font-medium text-blue-900">パイプライン状況</h4>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div>• アクティブなアイデア数</div>
                      <div>• テスト中のLP数</div>
                      <div>• 開発中のMVP数</div>
                      <div>• 稼働中のサービス数</div>
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <h4 className="font-medium text-green-900">パフォーマンス</h4>
                    <div className="text-sm text-green-700 space-y-1">
                      <div>• 平均収益化時間</div>
                      <div>• 成功率</div>
                      <div>• 総MRR</div>
                      <div>• 成長率</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🚨 自動介入ルール
                </h3>
                <div className="space-y-3">
                  {autoInterventionRules.map((rule, index) => (
                    <div key={index} className="p-3 border border-red-200 rounded bg-red-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-red-900 text-sm">{rule.condition}</div>
                          <div className="text-red-700 text-xs mt-1">→ {rule.action}</div>
                        </div>
                        <div className="text-red-600 text-xs">自動実行</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 継続的改善 */}
      <section id="continuous-improvement" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">継続的改善</h2>
            
            <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                🔄 学習サイクル
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                    📊
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">データ収集</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 成功/失敗要因</li>
                    <li>• ユーザー行動パターン</li>
                    <li>• 市場反応</li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                    🧠
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">パターン分析</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 成功サービス共通点</li>
                    <li>• 失敗原因分析</li>
                    <li>• 改善機会特定</li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-3">
                    ⚡
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">システム更新</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• アルゴリズム調整</li>
                    <li>• テンプレート改良</li>
                    <li>• 新機能追加</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-yellow-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🎯 期待効果
              </h3>
              <p className="text-gray-600">
                この自動サービス生成パイプラインにより、アイデアから収益化までの時間を従来の1/10以下に短縮します。
                人間は創造性と判断力を発揮し、AIは実行と最適化を担当。
                この協働により、月20個以上の新サービスを継続的に市場投入することが可能になります。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="自動化パイプラインを体験しよう"
        subtitle="革新的なサービス生成プロセスに参加し、次世代のビジネス創造を一緒に実現しませんか？"
        actions={[
          { label: 'アイデアを投稿', href: '/contact?type=idea-submission' },
          { label: 'パイプライン詳細', href: '/docs/development/process', variant: 'outline' }
        ]}
        backgroundColor="bg-gradient-to-r from-green-600 to-blue-600"
      />

      {/* ナビゲーション */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <NavigationLink href="/docs/technical/architecture" variant="outline" size="sm">
                ← 技術アーキテクチャ
              </NavigationLink>
              <NavigationLink href="/docs/design/specification" variant="outline" size="sm">
                設計仕様書 →
              </NavigationLink>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="/docs/technical/architecture" className="text-blue-600 hover:text-blue-800">技術アーキテクチャ</a>
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
    </div>
  )
}