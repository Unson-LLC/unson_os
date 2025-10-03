'use client'

import { DocsLayout } from '@/components/layout/DocsLayout'
import { Button } from '@/components/ui/Button'

const meetingInfo = {
  date: '2025年7月3日',
  participants: '佐藤圭吾（代表）、山本力弥（CSO）、他メンバー',
  purpose: 'AI時代における雲孫の方向性と戦略の共有・議論'
}

const keyTopics = [
  {
    title: 'AI時代の展望と人間の価値',
    icon: '🤖',
    color: 'blue',
    points: [
      'AIの発展は指数関数的で、10-20年後には人間の仕事の大部分が代替される',
      'ホワイトカラーの30%の仕事は既にAIで代替可能',
      'ロボット技術の進展により、物理的な仕事も代替されていく'
    ],
    humanValues: [
      '情報ギャップ: AIに関する手触り感・感覚値',
      '責任を取る能力: 法的にAIの責任を人間が担保する期間',
      '良い人であること: AIでは代替できない人間性',
      '人間特有のサービス: 風俗、水商売、一部の介護、高級営業など'
    ]
  },
  {
    title: '雲孫OS構想の正式決定',
    icon: '🏢',
    color: 'purple',
    concept: 'Company-as-a-Product: 会社自体をプロダクト化しOSS公開',
    goals: '3年で100個のマイクロサービスを自動生成',
    differentiation: '営業ゼロ、AIエージェント駆動、高速サイクル',
    businessModel: '月1万円の利益×100サービス = 月100万円の収益'
  },
  {
    title: '開発プロセスの自動化',
    icon: '⚡',
    color: 'green',
    process: [
      '市場調査・アイデア生成: AIによるトレンド分析',
      'LP作成: 24時間以内に自動生成・公開',
      'MVP開発: Claude Codeによる実装',
      '課金開始: 自動価格設定とA/Bテスト'
    ],
    humanInvolvement: [
      '各ゲートでのGo/No-Go判断',
      'メディア（画像・動画）の品質確認',
      '倫理的・ブランド的な最終チェック'
    ]
  }
]

const organizationStructure = {
  revenueDistribution: [
    { category: '運営・再投資', percentage: 45, color: 'blue' },
    { category: '創業者ボーナス', percentage: 15, color: 'purple' },
    { category: 'コミュニティ配当（DAO）', percentage: 40, color: 'green' }
  ],
  contributionEvaluation: [
    'GitHubのPR/Issueを自動スコア化',
    '会議提案、メディア確認も評価対象',
    '四半期ごとの自動配当'
  ]
}

const techStack = {
  frontendBackend: [
    'Next.js + Supabase/Convex',
    'Vercel/Cloudflare Workers',
    'Stripe決済統合'
  ],
  aiAutomation: [
    'Claude Code: コード生成',
    '生成AI: メディア作成',
    'PostHog/Metabase: 分析'
  ]
}

const actionItems = [
  {
    period: '即時実行',
    items: [
      { task: 'コアバリュー文書の作成', status: 'completed' },
      { task: 'ワークスタイルガイドの作成', status: 'completed' },
      { task: 'ビジョン・ミッション文書の更新', status: 'completed' },
      { task: '技術アーキテクチャ文書の作成', status: 'completed' },
      { task: 'DAO構造の詳細設計書作成', status: 'completed' }
    ]
  },
  {
    period: '30日以内',
    items: [
      { task: 'プロトタイプ開発開始（倉本担当）', status: 'in-progress' },
      { task: 'Convex検証と導入判断', status: 'pending' },
      { task: '最初のアイデア生成パイプライン構築', status: 'pending' }
    ]
  },
  {
    period: '60日以内',
    items: [
      { task: '最初のLP自動生成テスト', status: 'pending' },
      { task: 'DAO基盤の技術実装', status: 'pending' },
      { task: '貢献度自動計算システムの開発', status: 'pending' }
    ]
  },
  {
    period: '90日以内',
    items: [
      { task: '10個のサービスをパイプラインに投入', status: 'pending' },
      { task: '初回配当の実施', status: 'pending' },
      { task: 'OSSとしての初期公開', status: 'pending' }
    ]
  }
]

const keyInsights = [
  {
    title: 'AI時代の生存戦略',
    points: [
      '「いい人」になることが最重要',
      '情報格差は一時的な優位性',
      '責任を取れることが当面の差別化要因'
    ],
    icon: '🎯'
  },
  {
    title: '組織の新しい形',
    points: [
      '会社がソフトウェアになる時代',
      '人間とAIの最適な協働モデル',
      '透明性と公平性のDAO型組織'
    ],
    icon: '🏗️'
  },
  {
    title: '日本を元気にする',
    points: [
      'AI時代でも価値を生み出せる仕組み',
      '若い世代に希望を与える働き方',
      'グローバルに展開可能なモデル'
    ],
    icon: '🌟'
  }
]

export default function UpdatesPage() {
  return (
    <DocsLayout>
      <section className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container-custom">
          <div className="text-center animate-fade-in">
            <h1 className="heading-primary text-gray-900 mb-6">
              最新情報・更新
              <span className="block text-blue-600 mt-2">
                Updates & News
              </span>
            </h1>
            <p className="text-large max-w-3xl mx-auto mb-8">
              雲孫チームの最新の意思決定、戦略変更、開発進捗をお伝えします。
              組織の透明性を重視し、すべての重要な情報を共有しています。
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="card mb-8">
              <div className="flex items-center mb-6">
                <div className="text-2xl mr-3">📅</div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    2025年7月3日 雲孫メンバーミーティング サマリー
                  </h2>
                  <p className="text-gray-600 mt-1">
                    AI時代における雲孫の方向性と戦略の共有・議論
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">日時</h4>
                  <p className="text-gray-600">{meetingInfo.date}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">参加者</h4>
                  <p className="text-gray-600 text-sm">{meetingInfo.participants}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">目的</h4>
                  <p className="text-gray-600 text-sm">{meetingInfo.purpose}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">
            主要議題と決定事項
          </h2>
          <div className="space-y-8">
            {keyTopics.map((topic, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-6">
                  <div className={`text-3xl mr-4 p-3 rounded-full ${
                    topic.color === 'blue' ? 'bg-blue-100' :
                    topic.color === 'purple' ? 'bg-purple-100' :
                    'bg-green-100'
                  }`}>
                    {topic.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {topic.title}
                  </h3>
                </div>

                {topic.points && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">現状認識</h4>
                    <ul className="space-y-2">
                      {topic.points.map((point, pointIndex) => (
                        <li key={pointIndex} className="flex items-start text-gray-600">
                          <div className={`w-1.5 h-1.5 rounded-full mt-2 mr-3 flex-shrink-0 ${
                            topic.color === 'blue' ? 'bg-blue-400' :
                            topic.color === 'purple' ? 'bg-purple-400' :
                            'bg-green-400'
                          }`}></div>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {topic.humanValues && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">人間に残る価値</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {topic.humanValues.map((value, valueIndex) => (
                        <div key={valueIndex} className="bg-blue-50 p-3 rounded-lg">
                          <span className="text-sm text-gray-700">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {topic.concept && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">コンセプト</h4>
                      <p className="text-gray-600 text-sm mb-3">{topic.concept}</p>
                      <h4 className="font-medium text-gray-900 mb-2">目標</h4>
                      <p className="text-gray-600 text-sm">{topic.goals}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">差別化</h4>
                      <p className="text-gray-600 text-sm mb-3">{topic.differentiation}</p>
                      <h4 className="font-medium text-gray-900 mb-2">ビジネスモデル</h4>
                      <p className="text-gray-600 text-sm">{topic.businessModel}</p>
                    </div>
                  </div>
                )}

                {topic.process && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">4段階プロセス</h4>
                      <ul className="space-y-2">
                        {topic.process.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start text-gray-600">
                            <div className="w-6 h-6 bg-green-100 text-green-600 text-xs font-bold rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                              {stepIndex + 1}
                            </div>
                            <span className="text-sm">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">人間の関与ポイント</h4>
                      <ul className="space-y-2">
                        {topic.humanInvolvement.map((involvement, invIndex) => (
                          <li key={invIndex} className="flex items-start text-gray-600">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-sm">{involvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">
            組織構造とDAO化
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                収益分配モデル
              </h3>
              <div className="space-y-4">
                {organizationStructure.revenueDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{item.category}</span>
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-3 ${
                        item.color === 'blue' ? 'bg-blue-400' :
                        item.color === 'purple' ? 'bg-purple-400' :
                        'bg-green-400'
                      }`}></div>
                      <span className="text-lg font-semibold text-gray-900">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                貢献度評価システム
              </h3>
              <ul className="space-y-3">
                {organizationStructure.contributionEvaluation.map((evaluation, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-600">{evaluation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">
            技術スタック決定
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                フロントエンド/バックエンド
              </h3>
              <ul className="space-y-3">
                {techStack.frontendBackend.map((tech, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                    <span className="text-gray-700">{tech}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                AI/自動化
              </h3>
              <ul className="space-y-3">
                {techStack.aiAutomation.map((tech, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    <span className="text-gray-700">{tech}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">
            アクションアイテム
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {actionItems.map((period, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {period.period}
                </h3>
                <div className="space-y-3">
                  {period.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700 text-sm">{item.task}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.status === 'completed' ? 'bg-green-100 text-green-700' :
                        item.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {item.status === 'completed' ? '完了' :
                         item.status === 'in-progress' ? '進行中' : '予定'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">
            重要な示唆
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {keyInsights.map((insight, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-6">
                <div className="text-3xl mb-4 text-center">
                  {insight.icon}
                </div>
                <h3 className="text-lg font-semibold mb-4 text-center">
                  {insight.title}
                </h3>
                <ul className="space-y-2">
                  {insight.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex items-start text-blue-100">
                      <div className="w-1.5 h-1.5 bg-blue-300 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="heading-secondary mb-6">
              まとめ
            </h2>
            <p className="text-large text-gray-600 mb-8">
              このミーティングで、雲孫は従来の企業から「自律的に価値を生み出し続けるOS」へと進化することを決定しました。
              AIと人間が最適に協働し、営業なしで価値を連続的に市場に投入する。
              この革新的なモデルにより、AI時代における新しい企業の在り方を世界に示していきます。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/docs/dao/overview">
                <Button size="lg">
                  DAO について詳しく
                </Button>
              </a>
              <a href="/docs/team">
                <Button variant="outline" size="lg">
                  チーム詳細
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </DocsLayout>
  )
}