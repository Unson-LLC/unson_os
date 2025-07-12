import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'
import { DocsLayout } from '@/components/layout/DocsLayout'

export const metadata: Metadata = {
  title: 'プロダクト開発プロセス - Unson OS ドキュメント',
  description: 'Unson OSのプロダクト開発プロセス、4段階ゲートシステム、Claude Codeを活用した自動化された開発フロー。',
  openGraph: {
    title: 'プロダクト開発プロセス - Unson OS ドキュメント',
    description: 'Unson OSのプロダクト開発プロセス、4段階ゲートシステム、Claude Codeを活用した自動化された開発フロー。',
  },
}

// 4段階ゲートシステム
const developmentPhases = [
  {
    phase: 0,
    title: '課題検知',
    description: 'SNS・検索トレンド・GitHub Issuesから課題を発見',
    automation: 'LLMによる自動クラスタリング',
    humanRole: '最終的な課題選定と優先度付け',
    duration: '継続的',
    criteria: 'スコア上位・市場ニーズ確認済み'
  },
  {
    phase: 1,
    title: 'LP作成（ゲート①）',
    description: 'ランディングページを作成し、市場反応を検証',
    automation: 'Claude Codeによるコピー生成・LP構成・Vercel自動デプロイ',
    humanRole: '画像・動画の品質チェック・ブランド整合性確認',
    duration: '3-5日',
    criteria: '1週間で訪問1,000人以上・登録率10%以上'
  },
  {
    phase: 2,
    title: 'MVP開発（ゲート②）',
    description: 'Minimum Viable Productの開発・テスト',
    automation: 'Claude Codeによるテスト駆動開発・GitHub Actions CI/CD',
    humanRole: 'UI/UX最終調整・セキュリティレビュー',
    duration: '1-2週間',
    criteria: '週次利用者200人以上・7日後残存率30%以上'
  },
  {
    phase: 3,
    title: '課金開始（ゲート③）',
    description: '有料サービス開始・収益化',
    automation: 'Stripe Product API自動設定・価格最適化',
    humanRole: 'カスタマーサポート・フィードバック分析',
    duration: '1週間',
    criteria: '無料→有料転換率7%以上・LTV/CAC比率3以上'
  }
]

// 開発プロセス詳細
const processDetails = [
  {
    category: 'アイデア発散・生成',
    methods: [
      'ブレインストーミング（15分）',
      'SCAMPER法（代用・結合・適応・修正・転用・削除・逆転）',
      '競合改良法（既存サービスの不満点解決）'
    ],
    time: '1-2日目',
    output: 'アイデア一覧（課題×20個）'
  },
  {
    category: '実現可能性チェック',
    methods: [
      '技術実現性評価（30分/案）',
      '開発工数見積もり',
      '外部API依存度チェック',
      'リスク評価（技術・事業・法的）'
    ],
    time: '3-4日目',
    output: '実現可能性評価表'
  },
  {
    category: 'ユーザー訴求方法検討',
    methods: [
      'ターゲットペルソナ明確化（30分/案）',
      'メインメッセージ設計',
      'ビジュアル訴求検討',
      'Before/Afterストーリー作成'
    ],
    time: '5日目',
    output: '訴求戦略シート'
  },
  {
    category: 'LP作成・ユーザー検証',
    methods: [
      'ノーコードLP作成（Framer/Webflow）',
      'メール登録フォーム実装',
      'ユーザーアンケート設計',
      'KPI測定・分析'
    ],
    time: '6-8日目',
    output: 'LP検証結果'
  }
]

// 技術スタック
const techStack = [
  {
    layer: '生成・開発層',
    technologies: [
      'Claude Code（コード生成）',
      '生成AI（画像・動画・コピー）',
      'GitHub（バージョン管理）'
    ],
    description: 'AI主導の自動コード生成とメディア作成'
  },
  {
    layer: '運用基盤層',
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
    technologies: [
      'PostHog（行動分析）',
      'Sentry（エラー監視）',
      'Semgrep（静的解析）',
      'Metabase（ダッシュボード）'
    ],
    description: 'リアルタイム監視と品質保証'
  }
]

// 成功指標
const successMetrics = [
  {
    phase: 'LP段階',
    metrics: [
      '訪問者数：500人以上（1週間）',
      'メール登録率：10%以上',
      '滞在時間：2分以上',
      '直帰率：70%以下'
    ]
  },
  {
    phase: 'MVP段階',
    metrics: [
      'DAU：100人以上',
      '有料転換率：10%以上',
      '7日後継続率：50%以上',
      'NPS：30以上'
    ]
  },
  {
    phase: '課金段階',
    metrics: [
      'MRR：10万円以上',
      'CAC：LTVの1/3以下',
      'チャーン率：5%以下',
      'MRR成長率：20%/月以上'
    ]
  }
]

export default function DevelopmentProcessPage() {
  // 読み時間計算（設計書通り）
  const readingTime = '約12分'
  
  return (
    <DocsLayout>
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center gap-2 text-sm text-blue-600 mb-4">
              <span>📖 読み時間：{readingTime}</span>
              <span>•</span>
              <span>🔄 最終更新：2025年7月</span>
            </div>
            <h1 className="heading-primary text-gray-900 mb-6">
              プロダクト開発プロセス
              <span className="block text-blue-600 mt-2">
                4段階ゲートシステム
              </span>
            </h1>
            <p className="text-large text-gray-600 mb-8">
              課題発見からリリースまで、AI自動化と人間の判断を組み合わせた
              効率的な2週間開発サイクルを実現します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationLink href="/docs/development/setup" variant="default" size="lg">
                開発環境構築
              </NavigationLink>
              <NavigationLink href="/docs/sdk" variant="outline" size="lg">
                SDK ドキュメント
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
                <a href="#overview" className="block text-blue-600 hover:text-blue-800 py-1">1. 概要と哲学</a>
                <a href="#four-gate-system" className="block text-blue-600 hover:text-blue-800 py-1">2. 4段階ゲートシステム</a>
                <a href="#process-details" className="block text-blue-600 hover:text-blue-800 py-1">3. プロセス詳細</a>
              </div>
              <div>
                <a href="#tech-stack" className="block text-blue-600 hover:text-blue-800 py-1">4. 技術スタック</a>
                <a href="#success-metrics" className="block text-blue-600 hover:text-blue-800 py-1">5. 成功指標</a>
                <a href="#next-steps" className="block text-blue-600 hover:text-blue-800 py-1">6. 次のステップ</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 概要セクション */}
      <section id="overview" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">概要と哲学</h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  🎯 基本方針
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>2週間サイクル</strong>：現実的な開発期間</li>
                  <li>• <strong>段階的自動化</strong>：人間判断と AI の協調</li>
                  <li>• <strong>データドリブン</strong>：客観的指標による判定</li>
                  <li>• <strong>テックタッチ</strong>：最小限の人的介入</li>
                </ul>
              </div>
              
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  ⚡ 競争優位性
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>開発速度</strong>：個人開発者の10倍速</li>
                  <li>• <strong>品質保証</strong>：システム化された継続改善</li>
                  <li>• <strong>市場カバー</strong>：100個の並列展開</li>
                  <li>• <strong>資金力</strong>：収益再投資による持続性</li>
                </ul>
              </div>
            </div>
            
            <div className="p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🏗️ Company-as-a-Product アプローチ
              </h3>
              <p className="text-gray-600">
                会社運営自体をソフトウェア化し、開発プロセスを「モジュール」として実装。
                Issue→PR→Auto-Deploy で進化するソフトウェアのように、
                ビジネスプロセスも継続的に改善・自動化していきます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4段階ゲートシステム */}
      <section id="four-gate-system" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="heading-secondary mb-6">
                4段階ゲートシステム
              </h2>
              <p className="text-large text-gray-600">
                各段階で明確な通過基準を設定し、データに基づいた Go/No-Go 判定を実施
              </p>
            </div>
            
            <div className="space-y-8">
              {developmentPhases.map((phase, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex flex-col items-center mr-6">
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {phase.phase === 0 ? '🔍' : `${phase.phase}`}
                    </div>
                    {index < developmentPhases.length - 1 && (
                      <div className="w-0.5 h-16 bg-blue-200 mt-4"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 pb-8">
                    <div className="card">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {phase.title}
                        </h3>
                        <div className="text-right">
                          <div className="text-sm text-blue-600 font-medium">
                            {phase.duration}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">
                        {phase.description}
                      </p>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">🤖 自動化範囲</h4>
                          <p className="text-sm text-gray-600">{phase.automation}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">👥 人間の役割</h4>
                          <p className="text-sm text-gray-600">{phase.humanRole}</p>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-1">✅ 通過基準</h4>
                        <p className="text-sm text-green-700">{phase.criteria}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* プロセス詳細 */}
      <section id="process-details" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">プロセス詳細</h2>
            
            <div className="grid gap-8">
              {processDetails.map((detail, index) => (
                <div key={index} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {detail.category}
                    </h3>
                    <div className="text-right">
                      <div className="text-sm text-blue-600 font-medium">
                        {detail.time}
                      </div>
                      <div className="text-xs text-gray-500">
                        {detail.output}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">手法・ツール</h4>
                      <ul className="space-y-1">
                        {detail.methods.map((method, methodIndex) => (
                          <li key={methodIndex} className="text-sm text-gray-600">
                            • {method}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">成果物</h4>
                      <p className="text-sm text-gray-600">{detail.output}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 技術スタック */}
      <section id="tech-stack" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">技術スタック</h2>
            
            <div className="space-y-6">
              {techStack.map((stack, index) => (
                <div key={index} className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {stack.layer}
                  </h3>
                  <p className="text-gray-600 mb-4">{stack.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {stack.technologies.map((tech, techIndex) => (
                      <span 
                        key={techIndex}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🔧 推奨構成: Next.js + Convex + Vercel
              </h3>
              <p className="text-gray-600 mb-4">
                MVP開発を3-5日に短縮し、コード量を70%削減。100個のSaaS管理が現実的な技術スタック。
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong className="text-gray-900">フロントエンド</strong>
                  <p className="text-gray-600">Next.js 14, TypeScript, Tailwind CSS</p>
                </div>
                <div>
                  <strong className="text-gray-900">バックエンド</strong>
                  <p className="text-gray-600">Convex Functions, リアルタイムDB</p>
                </div>
                <div>
                  <strong className="text-gray-900">インフラ</strong>
                  <p className="text-gray-600">Vercel, Stripe, GitHub Actions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 成功指標 */}
      <section id="success-metrics" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">成功指標</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {successMetrics.map((metric, index) => (
                <div key={index} className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {metric.phase}
                  </h3>
                  <ul className="space-y-2">
                    {metric.metrics.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm text-gray-600">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-yellow-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                📊 データ収集の考慮事項
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong className="text-gray-900">最低収集期間</strong>
                  <ul className="mt-2 space-y-1 text-gray-600">
                    <li>• 初期トラフィック獲得：24-48時間</li>
                    <li>• 統計的有意性確保：72-168時間（3-7日）</li>
                    <li>• 季節性・曜日効果考慮：最低1週間</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-gray-900">品質管理</strong>
                  <ul className="mt-2 space-y-1 text-gray-600">
                    <li>• UIレビュー・フィードバック：2-4時間</li>
                    <li>• 機能テスト・不具合確認：4-6時間</li>
                    <li>• ステークホルダー承認：12-24時間</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="開発プロセスを実践しよう"
        subtitle="SDK とツールを活用して、Unson OS の開発に参加しませんか？"
        actions={[
          { label: '開発環境構築', href: '/docs/development/setup' },
          { label: 'SDK ドキュメント', href: '/docs/sdk', variant: 'outline' }
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
              <NavigationLink href="/docs/development/setup" variant="outline" size="sm">
                開発環境構築 →
              </NavigationLink>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="/docs/development/setup" className="text-blue-600 hover:text-blue-800">開発環境構築</a>
              <span className="text-gray-300">|</span>
              <a href="/docs/sdk/javascript" className="text-blue-600 hover:text-blue-800">JavaScript SDK</a>
              <span className="text-gray-300">|</span>
              <a href="/docs/sdk/python" className="text-blue-600 hover:text-blue-800">Python SDK</a>
              <span className="text-gray-300">|</span>
              <a href="/docs/sdk/cli" className="text-blue-600 hover:text-blue-800">CLI ツール</a>
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