import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'
import { DocsLayout } from '@/components/layout/DocsLayout'

export const metadata: Metadata = {
  title: 'DAO構造とガバナンス - Unson OS ドキュメント',
  description: '雲孫DAOの詳細な構造、収益分配モデル、ガバナンス構造、実装ロードマップについて解説。透明性・公平性・持続可能性を重視した分散型自律組織。',
  openGraph: {
    title: 'DAO構造とガバナンス - Unson OS ドキュメント',
    description: '雲孫DAOの詳細な構造、収益分配モデル、ガバナンス構造、実装ロードマップについて解説。透明性・公平性・持続可能性を重視した分散型自律組織。',
  },
}

const revenueDistribution = [
  {
    category: '運営・再投資',
    percentage: 45,
    description: '開発・広告・インフラなど日常OPEX',
    details: [
      '時給1,000円×Jibble実績の先払い',
      '再投資プール（新プロダクト開発）',
      '緊急対応資金'
    ],
    color: 'blue'
  },
  {
    category: 'Founding Member Bonus',
    percentage: 15,
    description: '創業締切日までに実績条件を満たしたメンバーへの長期報酬',
    details: [
      '12ヶ月線形ベスティング（代表除く）',
      '離脱で未ベスト分はDAO Fundへ戻る',
      'Stripe Webhookで自動分流'
    ],
    color: 'green'
  },
  {
    category: 'Community Dividend Fund',
    percentage: 40,
    description: 'UNFトークン保有者（社内外全コントリビューター）へ四半期ごとに自動配当',
    details: [
      'Superfluidを使用したUSDCストリーム送金',
      '活動係数による公平な配分',
      '貢献度に基づく動的分配'
    ],
    color: 'purple'
  }
]

const tokenInfo = {
  totalSupply: '1億枚',
  blockchain: 'Base（Ethereum L2）',
  standard: 'ERC-20',
  initialPrice: '1 UNSON = 0.01 USD'
}

const initialDistribution = [
  { category: '創業チーム', percentage: 25, period: '2年ベスティング', color: 'blue' },
  { category: 'コミュニティトレジャリー', percentage: 40, period: 'DAO管理', color: 'purple' },
  { category: 'エコシステム開発', percentage: 20, period: '段階的配布', color: 'green' },
  { category: '流動性提供', percentage: 10, period: 'DEX投入', color: 'yellow' },
  { category: '予備', percentage: 5, period: '緊急時対応', color: 'gray' }
]

const contributionSystem = [
  { activity: 'コードコミット', points: '+3', description: '承認されたPull Request', example: '月10PR → 30pt' },
  { activity: 'Issue解決', points: '+2', description: 'クローズされたIssue', example: '月15Issue → 30pt' },
  { activity: 'メディア確認', points: '+1', description: 'デザイン・動画の品質確認', example: '月20確認 → 20pt' },
  { activity: 'Q&A回答', points: '+1', description: 'Slackでの有用な回答', example: '月30回答 → 30pt' },
  { activity: '提案採用', points: '+2', description: '会議での提案が実装された', example: '月5提案 → 10pt' }
]

const foundingMemberDistribution = [
  { member: '代表', allocation: '40%', vesting: '即時100%', frequency: '月次' },
  { member: 'キュレーター', allocation: '20%', vesting: '12ヶ月線形', frequency: '四半期' },
  { member: 'クラフツマン', allocation: '20%', vesting: '12ヶ月線形', frequency: '四半期' },
  { member: '開発リーダー', allocation: '20%', vesting: '12ヶ月線形', frequency: '四半期' }
]

const governanceProcess = [
  {
    step: 1,
    title: '提案作成',
    description: 'フォーラム議論での初期提案',
    duration: '1-3日',
    details: ['コミュニティメンバーが新提案作成', 'テンプレートに従って記載', '事前議論でブラッシュアップ']
  },
  {
    step: 2,
    title: 'フォーラム議論',
    description: 'コミュニティでの詳細議論',
    duration: '7日',
    details: ['Discord・フォーラムで透明な議論', 'メリット・デメリットの検討', '改善提案の反映']
  },
  {
    step: 3,
    title: 'Snapshot投票',
    description: 'トークン保有者による正式投票',
    duration: '5日',
    details: ['1トークン = 1票のルール', '最小参加率20%必要', '可決基準66%以上の賛成']
  },
  {
    step: 4,
    title: '実行',
    description: '可決提案の実装・監視',
    duration: '48時間猶予後',
    details: ['実行猶予期間で最終確認', 'スマートコントラクト実行', '結果の透明な報告']
  }
]

const proposalCategories = [
  {
    category: '通常提案',
    description: '日常的な運営判断',
    examples: ['新機能の追加', 'プロセスの改善', 'パートナーシップ'],
    threshold: '51%賛成',
    participationRate: '10%'
  },
  {
    category: '重要提案',
    description: '戦略的な重要判断',
    examples: ['トークノミクスの変更', '大規模投資（>100万円）', '基本方針の変更'],
    threshold: '66%賛成',
    participationRate: '20%'
  },
  {
    category: '緊急提案',
    description: '即座の対応が必要',
    examples: ['セキュリティ対応', '重大バグ修正', '規制対応'],
    threshold: '75%賛成',
    participationRate: '30%'
  }
]

const implementationRoadmap = [
  {
    phase: 'Phase 1: Foundation',
    period: '0-30日',
    milestones: [
      'Safe & UNF発行',
      'Wyoming DAO LLC登記', 
      'Stripe Webhookを45/15/40に更新',
      '初期コミュニティ形成（100人）'
    ],
    tasks: [
      'Safe作成とマルチシグ設定',
      'UNSONトークン発行（総量1億枚）',
      '合同会社雲孫からWyoming DAO LLCへの法人設立',
      'Discord/Slackコミュニティ構築'
    ]
  },
  {
    phase: 'Phase 2: Infrastructure',
    period: '30-60日',
    milestones: [
      'Snapshot・SubDAOテンプレート実装',
      '自動監視Bot開発',
      'Founder Bonus Safe割当％を設定',
      '基本的なガバナンス機能'
    ],
    tasks: [
      'Snapshot統合とガバナンス投票システム',
      'GitHub APIとの連携（貢献度計算）',
      'SubDAOアーキテクチャの実装',
      '基本的なセキュリティ監査'
    ]
  },
  {
    phase: 'Phase 3: Operations',
    period: '60-90日',
    milestones: [
      '初回15%プール額を四半期末に配当',
      '投票実績公開',
      '最初のSubDAO立ち上げ',
      '外部監査実施'
    ],
    tasks: [
      'Superfluidを用いた自動配当システム',
      '透明性レポートの自動生成',
      'Ads-SubDAOまたはData-SubDAOの実装',
      'セキュリティ監査とバグ修正'
    ]
  },
  {
    phase: 'Phase 4: Growth',
    period: '90-120日',
    milestones: [
      'Quadratic Funding Round #1開催',
      '外部投資家への提案',
      '国際展開の準備',
      'エコシステムパートナーシップ'
    ],
    tasks: [
      'GitcoinスタイルのQuadratic Funding実装',
      'Token Warrant/SAFE+Tokenの法的整備',
      '多言語対応（英語、中国語等）',
      '他DAOとの連携協定'
    ]
  }
]

const kpiTargets = [
  { metric: 'トークンホルダー数', threeMonth: '100+', sixMonth: '500+', twelveMonth: '1,000+' },
  { metric: '投票参加率', threeMonth: '30%+', sixMonth: '40%+', twelveMonth: '50%+' },
  { metric: '配当総額', threeMonth: '100万円', sixMonth: '500万円', twelveMonth: '2,000万円' },
  { metric: 'RageQuit率', threeMonth: '<10%', sixMonth: '<7%', twelveMonth: '<5%' }
]

const legalStructure = [
  {
    entity: '合同会社雲孫（日本）',
    role: '親会社',
    purpose: '国内税務の一本化、日本人中心プロジェクト向け'
  },
  {
    entity: 'Wyoming DAO LLC（米国）',
    role: 'DAO運営主体',
    purpose: '収益型DAO向けに最適化、米国内での法的保護'
  },
  {
    entity: '各国子会社',
    role: '地域対応',
    purpose: '各国の規制に応じた運営'
  }
]

export default function DAOStructurePage() {
  return (
    <DocsLayout>
      <section className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-primary text-gray-900 mb-6">
              雲孫DAO構造と
              <span className="block text-blue-600 mt-2">
                ガバナンス詳細
              </span>
            </h1>
            <div className="flex justify-center items-center gap-4 text-sm text-gray-600 mb-6">
              <span>📖 読み時間: 約15分</span>
              <span>•</span>
              <span>🏷️ DAO・ガバナンス・法的構造</span>
              <span>•</span>
              <span>📅 最終更新: 2024年12月</span>
            </div>
            <p className="text-large text-gray-600 mb-8 max-w-3xl mx-auto">
              分散型自律組織として、コミュニティメンバーが公平に価値創造に参加し、
              その成果を共有できる仕組みを提供。透明性、公平性、持続可能性を重視した設計。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationLink href="#revenue-distribution" variant="default" size="lg">
                収益分配構造
              </NavigationLink>
              <NavigationLink href="#governance" variant="outline" size="lg">
                ガバナンス詳細
              </NavigationLink>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">目次</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <a href="#revenue-distribution" className="block py-2 text-blue-600 hover:text-blue-800">1. 収益分配構造（45-15-40モデル）</a>
                <a href="#token-economics" className="block py-2 text-blue-600 hover:text-blue-800">2. トークンエコノミクス</a>
                <a href="#contribution-system" className="block py-2 text-blue-600 hover:text-blue-800">3. 貢献度評価システム</a>
                <a href="#governance" className="block py-2 text-blue-600 hover:text-blue-800">4. ガバナンス構造</a>
              </div>
              <div>
                <a href="#implementation" className="block py-2 text-blue-600 hover:text-blue-800">5. 実装ロードマップ</a>
                <a href="#legal-structure" className="block py-2 text-blue-600 hover:text-blue-800">6. 法的構造</a>
                <a href="#kpi" className="block py-2 text-blue-600 hover:text-blue-800">7. KPIと目標</a>
                <a href="#risk-management" className="block py-2 text-blue-600 hover:text-blue-800">8. リスク管理</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="revenue-distribution" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              収益分配構造（45-15-40モデル）
            </h2>
            <p className="text-large text-center text-gray-600 mb-12">
              Stripe Webhookで三つのSafeへUSDC自動振替による透明な分配システム
            </p>

            <div className="grid gap-8 mb-12">
              {revenueDistribution.map((item, index) => (
                <div key={index} className={`card bg-${item.color}-50 border-l-4 border-${item.color}-500`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {item.category}
                      </h3>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-${item.color}-700 bg-white`}>
                        {item.percentage}%
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{item.description}</p>
                  <ul className="space-y-2">
                    {item.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-sm text-gray-600">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="card bg-yellow-50 border-l-4 border-yellow-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Founding Member Bonus（15%）詳細配分
              </h3>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">メンバー</th>
                      <th className="text-left py-2">割当</th>
                      <th className="text-left py-2">ベスティング</th>
                      <th className="text-left py-2">受取頻度</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foundingMemberDistribution.map((member, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{member.member}</td>
                        <td className="py-2">{member.allocation}</td>
                        <td className="py-2">{member.vesting}</td>
                        <td className="py-2">{member.frequency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-500">
                ※ 総計15%。離脱で未ベスト分はDAO Fundへ戻る
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="token-economics" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              トークンエコノミクス
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">UNSONトークン基本仕様</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">発行総量</span>
                    <span className="font-semibold">{tokenInfo.totalSupply}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ブロックチェーン</span>
                    <span className="font-semibold">{tokenInfo.blockchain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">規格</span>
                    <span className="font-semibold">{tokenInfo.standard}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">初期価格</span>
                    <span className="font-semibold">{tokenInfo.initialPrice}</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">トークンの権利</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">🗳️</span>
                    <div>
                      <span className="font-semibold">配当請求権</span>
                      <p className="text-sm text-gray-600">四半期ごとの収益分配、保有量×活動係数で計算</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">⚡</span>
                    <div>
                      <span className="font-semibold">ガバナンス投票権</span>
                      <p className="text-sm text-gray-600">重要な意思決定への参加、1トークン = 1票</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">🚪</span>
                    <div>
                      <span className="font-semibold">RageQuit権</span>
                      <p className="text-sm text-gray-600">いつでもトークンを焼却してUSDCを受領</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="card mb-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">初期配分</h3>
              <div className="grid gap-4">
                {initialDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full bg-${item.color}-500 mr-3`}></div>
                      <div>
                        <span className="font-semibold text-gray-900">{item.category}</span>
                        <p className="text-sm text-gray-600">{item.period}</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contribution-system" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              貢献度評価システム
            </h2>

            <div className="card mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">活動係数の計算</h3>
              <div className="space-y-4">
                {contributionSystem.map((item, index) => (
                  <div key={index} className="grid md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-semibold text-gray-900">{item.activity}</span>
                      <div className="text-lg font-bold text-green-600">{item.points}</div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 font-medium">{item.example}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-gradient-to-r from-blue-50 to-purple-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">配当計算式</h3>
              <div className="bg-white p-4 rounded-lg border">
                <code className="text-sm text-gray-800">
                  個人配当額 = Fund残高 × (UNSON保有比率 × 活動係数)
                  <br />
                  <br />
                  活動係数 = Σ(各活動ポイント) / 全体の活動ポイント合計
                </code>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="governance" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              ガバナンス構造
            </h2>

            <div className="max-w-4xl mx-auto mb-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">意思決定プロセス</h3>
              <div className="space-y-8">
                {governanceProcess.map((process, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex flex-col items-center mr-6">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        {process.step}
                      </div>
                      {index < governanceProcess.length - 1 && (
                        <div className="w-0.5 h-16 bg-blue-200 mt-4"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 pb-8">
                      <div className="card">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-lg font-semibold text-gray-900">
                            {process.title}
                          </h4>
                          <div className="text-right">
                            <div className="text-sm text-blue-600 font-medium">
                              {process.duration}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-3">{process.description}</p>
                        <ul className="space-y-1">
                          {process.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-start">
                              <span className="text-green-500 mr-2 text-sm">•</span>
                              <span className="text-sm text-gray-600">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {proposalCategories.map((category, index) => (
                <div key={index} className="card">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">{category.category}</h4>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="space-y-2 mb-4">
                    {category.examples.map((example, exIndex) => (
                      <div key={exIndex} className="text-sm text-gray-600 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {example}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm border-t pt-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">可決基準:</span>
                      <span className="font-semibold">{category.threshold}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">参加率:</span>
                      <span className="font-semibold">{category.participationRate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="implementation" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              実装ロードマップ（120日間）
            </h2>

            <div className="space-y-8">
              {implementationRoadmap.map((phase, index) => (
                <div key={index} className="card">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{phase.phase}</h3>
                      <p className="text-gray-600">{phase.period}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">マイルストーン</h4>
                      <ul className="space-y-2">
                        {phase.milestones.map((milestone, mIndex) => (
                          <li key={mIndex} className="flex items-start">
                            <span className="text-green-500 mr-2">🎯</span>
                            <span className="text-sm text-gray-700">{milestone}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">具体的なタスク</h4>
                      <ul className="space-y-2">
                        {phase.tasks.map((task, tIndex) => (
                          <li key={tIndex} className="flex items-start">
                            <span className="text-blue-500 mr-2">□</span>
                            <span className="text-sm text-gray-700">{task}</span>
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

      <section id="legal-structure" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              法的構造
            </h2>

            <div className="card mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">組織体制</h3>
              <div className="space-y-4">
                {legalStructure.map((entity, index) => (
                  <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{entity.entity}</h4>
                      <p className="text-sm text-blue-600 mb-2">{entity.role}</p>
                      <p className="text-sm text-gray-600">{entity.purpose}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">コンプライアンス</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <div>
                      <span className="font-semibold">ライセンス</span>
                      <p className="text-sm text-gray-600">コア: AGPL v3、拡張: BUSL 1.1、SDK: MIT/Apache 2.0</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <div>
                      <span className="font-semibold">知的財産</span>
                      <p className="text-sm text-gray-600">CLA（貢献者ライセンス契約）必須、商標の適切な管理</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <div>
                      <span className="font-semibold">税務</span>
                      <p className="text-sm text-gray-600">各国の税法に準拠、透明な会計報告</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">セキュリティ対策</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">🛡️</span>
                    <div>
                      <span className="font-semibold">マルチシグ管理</span>
                      <p className="text-sm text-gray-600">3/5署名による重要操作、タイムロック機能</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">🔍</span>
                    <div>
                      <span className="font-semibold">監査</span>
                      <p className="text-sm text-gray-600">年1回の外部監査、バグバウンティプログラム</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">⏸️</span>
                    <div>
                      <span className="font-semibold">緊急停止</span>
                      <p className="text-sm text-gray-600">Pause機能の実装、24時間以内の対応体制</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="kpi" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              KPIと目標
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">指標</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">3ヶ月</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">6ヶ月</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">12ヶ月</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {kpiTargets.map((kpi, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {kpi.metric}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {kpi.threeMonth}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {kpi.sixMonth}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {kpi.twelveMonth}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="risk-management" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              リスク管理
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="card bg-red-50 border-l-4 border-red-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">技術的リスク</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• スマートコントラクトの脆弱性</li>
                  <li>• スケーラビリティ問題</li>
                  <li>• オラクル障害</li>
                </ul>
                <div className="mt-4 p-3 bg-white rounded border">
                  <span className="font-semibold text-red-700">対策:</span>
                  <p className="text-sm text-gray-600">外部監査とバグバウンティ、L2ソリューション採用、複数オラクル使用</p>
                </div>
              </div>

              <div className="card bg-yellow-50 border-l-4 border-yellow-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">事業リスク</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• 規制強化</li>
                  <li>• 競合出現</li>
                  <li>• コミュニティ離反</li>
                </ul>
                <div className="mt-4 p-3 bg-white rounded border">
                  <span className="font-semibold text-yellow-700">対策:</span>
                  <p className="text-sm text-gray-600">複数管轄地での運営、先行者利益の最大化、透明性とインセンティブ強化</p>
                </div>
              </div>

              <div className="card bg-blue-50 border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">金融リスク</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• トークン価格暴落</li>
                  <li>• 流動性不足</li>
                  <li>• 為替リスク</li>
                </ul>
                <div className="mt-4 p-3 bg-white rounded border">
                  <span className="font-semibold text-blue-700">対策:</span>
                  <p className="text-sm text-gray-600">買い戻しプログラム、LP報酬プログラム、ステーブルコイン活用</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="雲孫DAOに参加しよう"
        subtitle="透明性・公平性・持続可能性を重視した分散型自律組織で、新しい価値創造に参加しませんか？"
        actions={[
          { label: 'コミュニティ参加', href: '/waitlist' },
          { label: 'トークノミクス詳細', href: '/docs/dao/tokenomics', variant: 'outline' }
        ]}
        backgroundColor="bg-gradient-to-r from-blue-600 to-purple-600"
      />

      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/dao/overview" className="text-blue-600 hover:text-blue-800">← DAO概要</a>
            <span className="text-gray-400">|</span>
            <a href="/docs/dao/tokenomics" className="text-blue-600 hover:text-blue-800">トークノミクス →</a>
            <span className="text-gray-400">|</span>
            <a href="/docs" className="text-blue-600 hover:text-blue-800">ドキュメント一覧</a>
          </div>
        </div>
      </section>
    </DocsLayout>
  )
}