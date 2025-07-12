import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'トークノミクス詳細 - Unson OS ドキュメント',
  description: 'Unson OS DAOの統一トークノミクスモデル。45-15-40収益分配、UNSONトークン設計、貢献度評価システムについて詳しく解説。',
  openGraph: {
    title: 'トークノミクス詳細 - Unson OS ドキュメント',
    description: 'Unson OS DAOの統一トークノミクスモデル。45-15-40収益分配、UNSONトークン設計、貢献度評価システムについて詳しく解説。',
  },
}

// 収益分配モデル（45-15-40）
const revenueDistribution = [
  {
    category: '運営・再投資',
    percentage: 45,
    description: '人件費（Jibble打刻×¥1,000/h）、インフラコスト（サーバー・API）、マーケティング（広告・プロモーション）、開発費用（新機能・メンテナンス）',
    details: [
      'freee APIによる自動仕訳、月末精算',
      '月次でコスト内訳を公開',
      '市場変動にも対応可能な十分な運営資金'
    ],
    color: 'blue',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700'
  },
  {
    category: '創業メンバーボーナス',
    percentage: 15,
    description: '初課金ゲート突破前日までに参加し、実績条件を満たしたメンバーへの報酬',
    details: [
      '代表: 40%（即時100%受取可能）',
      'キュレーター: 20%（12ヶ月ベスティング）',
      'クラフツマン: 20%（12ヶ月ベスティング）',
      '開発リーダー: 20%（12ヶ月ベスティング）'
    ],
    color: 'green',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700'
  },
  {
    category: 'コミュニティ配当',
    percentage: 40,
    description: 'UNSONトークン保有者および活動貢献者への分配',
    details: [
      '貢献度スコアに基づく比例配分',
      '月次、USDCまたはPROFITトークンで支払',
      'DAOの本質である「コミュニティによる価値創造」を体現'
    ],
    color: 'purple',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700'
  }
]

// UNSONトークン設計
const tokenDesign = {
  totalSupply: 100000000,
  initialDistribution: [
    { category: '創業チーム（雲孫GK）', percentage: 25, vesting: '2年間のベスティング期間', color: 'blue' },
    { category: 'コミュニティトレジャリー', percentage: 40, vesting: 'DAO投票による配分決定', color: 'purple' },
    { category: 'エコシステム開発', percentage: 20, vesting: '開発助成金、パートナーシップ等', color: 'green' },
    { category: '流動性提供', percentage: 10, vesting: 'DEXでの流動性確保', color: 'yellow' },
    { category: '予備', percentage: 5, vesting: '将来の戦略的投資家、緊急時対応', color: 'gray' }
  ],
  rights: [
    'ガバナンス投票権',
    '収益分配請求権',
    'RageQuit権（トークン焼却→USDC受領）'
  ]
}

// 貢献度評価システム
const contributionEvaluation = [
  { activity: 'PR作成', points: '+3', description: 'コード貢献' },
  { activity: 'Issue解決', points: '+2', description: '問題解決' },
  { activity: 'メディア確認', points: '+1', description: '品質管理' },
  { activity: 'Q&A対応', points: '+1', description: 'コミュニティサポート' }
]

// 品質乗数（将来的に導入予定）
const qualityMultipliers = [
  { level: 'Exceptional', multiplier: '2.0x', description: '業界標準を大幅に上回る品質' },
  { level: 'High', multiplier: '1.5x', description: '期待を上回る高品質' },
  { level: 'Standard', multiplier: '1.0x', description: '基準を満たす標準品質' },
  { level: 'Low', multiplier: '0.5x', description: '最低限の要件をクリア' }
]

// 実装ロードマップ
const implementationRoadmap = [
  {
    phase: 'Phase 1: 基盤構築',
    period: '0-3ヶ月',
    tasks: [
      'スマートコントラクト開発',
      '基本的な収益分配システム実装',
      '初期メンバー10名でテスト運用'
    ]
  },
  {
    phase: 'Phase 2: 本格始動',
    period: '3-6ヶ月',
    tasks: [
      '月次分配の自動化',
      'ダッシュボード公開',
      'コミュニティ100名達成'
    ]
  },
  {
    phase: 'Phase 3: 拡張',
    period: '6-12ヶ月',
    tasks: [
      '品質乗数システム導入',
      '他DAOとの連携',
      'グローバル展開'
    ]
  }
]

// ガバナンス設定
const governanceSettings = {
  proposalRequirement: '1,000 UNSON以上保有',
  votingPeriod: '5日間',
  passRequirements: [
    '投票率20%以上',
    '賛成率66%以上'
  ]
}

// 成功指標
const successMetrics = [
  { period: '3ヶ月', revenue: '$50K', contributors: 50, holders: 100 },
  { period: '6ヶ月', revenue: '$200K', contributors: 200, holders: 500 },
  { period: '12ヶ月', revenue: '$1M', contributors: 1000, holders: 5000 }
]

// 読み時間の計算（概算）
const readingTime = 12

export default function TokenomicsPage() {
  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-primary text-gray-900 mb-6">
              Unson OS 
              <span className="block text-gradient bg-gradient-to-r from-indigo-600 to-purple-600">
                統一トークノミクスモデル
              </span>
            </h1>
            <div className="flex justify-center items-center gap-4 text-sm text-gray-600 mb-6">
              <span>📖 読み時間: 約{readingTime}分</span>
              <span>•</span>
              <span>🏷️ DAO・経済モデル</span>
              <span>•</span>
              <span>📅 最終更新: 2024年12月</span>
            </div>
            <p className="text-large max-w-3xl mx-auto mb-8">
              YGG DAOの成功事例を参考にした、持続可能で公平な45-15-40収益分配モデル。
              UNSONトークン設計と貢献度評価システムによる革新的な価値分配。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationLink 
                href="#revenue-model" 
                variant="default" as const
                size="lg"
              >
                収益分配モデル
              </NavigationLink>
              <NavigationLink 
                href="#token-design" 
                variant="outline" as const
                size="lg"
              >
                トークン設計
              </NavigationLink>
            </div>
          </div>
        </div>
      </section>

      {/* 目次 */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">目次</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <a href="#revenue-model" className="block py-2 text-blue-600 hover:text-blue-800">1. 収益分配モデル（45-15-40）</a>
                <a href="#token-design" className="block py-2 text-blue-600 hover:text-blue-800">2. UNSONトークン設計</a>
                <a href="#contribution-system" className="block py-2 text-blue-600 hover:text-blue-800">3. 貢献度評価システム</a>
                <a href="#governance" className="block py-2 text-blue-600 hover:text-blue-800">4. ガバナンス設定</a>
              </div>
              <div>
                <a href="#roadmap" className="block py-2 text-blue-600 hover:text-blue-800">5. 実装ロードマップ</a>
                <a href="#success-metrics" className="block py-2 text-blue-600 hover:text-blue-800">6. 成功指標</a>
                <a href="#risks" className="block py-2 text-blue-600 hover:text-blue-800">7. リスクと対策</a>
                <a href="#comparison" className="block py-2 text-blue-600 hover:text-blue-800">8. 他DAOとの比較</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 収益分配モデル */}
      <section id="revenue-model" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              45-15-40 収益分配モデル
            </h2>
            <p className="text-large text-center text-gray-600 mb-12">
              YGG DAOの成功事例を参考に、持続可能性・公平性・透明性を重視した配分設計
            </p>
            
            <div className="grid gap-8 mb-12">
              {revenueDistribution.map((item, index) => (
                <div key={index} className={`card ${item.bgColor} border-l-4 border-${item.color}-500`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {item.category}
                      </h3>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${item.textColor} bg-white`}>
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

            {/* なぜこの比率なのか */}
            <div className="card bg-yellow-50 border-l-4 border-yellow-500">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                💡 なぜ45-15-40の比率なのか
              </h3>
              <div className="space-y-4 text-gray-700">
                <div>
                  <h4 className="font-semibold text-gray-900">1. 持続可能な運営基盤（45%）</h4>
                  <p>YGGは運営の安定性を重視し、長期的な成長を実現。十分な運営資金により、市場変動にも対応可能</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">2. 創業者への適切な報酬（15%）</h4>
                  <p>YGGの創業者配分15%は、初期リスクテイカーへの適切な報酬として業界標準</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">3. コミュニティ重視（40%）</h4>
                  <p>YGGのコミュニティ配分45%に近い水準で、DAOの本質である「コミュニティによる価値創造」を体現</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UNSONトークン設計 */}
      <section id="token-design" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              UNSONトークン設計
            </h2>
            
            {/* 基本情報 */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">基本仕様</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">総供給量</span>
                    <span className="font-semibold">{tokenDesign.totalSupply.toLocaleString()} UNSON</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ブロックチェーン</span>
                    <span className="font-semibold">Base（Ethereum L2）</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">標準</span>
                    <span className="font-semibold">ERC-20</span>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">トークン権利</h3>
                <ul className="space-y-3">
                  {tokenDesign.rights.map((right, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">🔹</span>
                      <span className="text-gray-700">{right}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 初期配分 */}
            <div className="card mb-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">初期配分</h3>
              <div className="grid gap-4">
                {tokenDesign.initialDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full bg-${item.color}-500 mr-3`}></div>
                      <div>
                        <span className="font-semibold text-gray-900">{item.category}</span>
                        <p className="text-sm text-gray-600">{item.vesting}</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{item.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* PROFITトークン */}
            <div className="card bg-gradient-to-r from-green-50 to-blue-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                PROFITトークン（収益分配トークン）
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">発行</h4>
                  <p className="text-gray-700">月次で動的発行</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">用途</h4>
                  <p className="text-gray-700">コミュニティ配当の40%分を分配</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">交換</h4>
                  <p className="text-gray-700">USDCに1:1で交換可能（月次）</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 貢献度評価システム */}
      <section id="contribution-system" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              貢献度評価システム
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* 基本評価項目 */}
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">基本評価項目</h3>
                <div className="space-y-4">
                  {contributionEvaluation.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-semibold text-gray-900">{item.activity}</span>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                      <span className="text-lg font-bold text-green-600">{item.points}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 品質乗数（将来予定） */}
              <div className="card bg-blue-50">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">品質乗数（将来導入予定）</h3>
                <div className="space-y-3">
                  {qualityMultipliers.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-gray-900">{item.level}</span>
                        <p className="text-xs text-gray-600">{item.description}</p>
                      </div>
                      <span className="text-lg font-bold text-blue-600">{item.multiplier}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 報酬計算例 */}
            <div className="card bg-gradient-to-r from-purple-50 to-pink-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">💰 報酬計算例</h3>
              <p className="text-gray-700 mb-4">月間総収益 $100,000 の場合（コミュニティ配当 $40,000）</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">アクティブ開発者</h4>
                  <p className="text-sm text-gray-600">10PR × 3pt + 15Issue × 2pt = 60pt → 約 $6,000</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">コミュニティサポーター</h4>
                  <p className="text-sm text-gray-600">30回答 × 1pt + 10確認 × 1pt = 40pt → 約 $4,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ガバナンス */}
      <section id="governance" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              ガバナンス設定
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">提案・投票ルール</h3>
                <div className="space-y-4">
                  <div>
                    <span className="font-semibold text-gray-900">提案要件</span>
                    <p className="text-gray-700">{governanceSettings.proposalRequirement}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">投票期間</span>
                    <p className="text-gray-700">{governanceSettings.votingPeriod}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">可決条件</span>
                    <ul className="list-disc list-inside text-gray-700">
                      {governanceSettings.passRequirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">透明性の確保</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">月次収益レポート公開</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">分配計算の完全可視化</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">スマートコントラクト監査結果の公開</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 実装ロードマップ */}
      <section id="roadmap" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              実装ロードマップ
            </h2>
            
            <div className="space-y-8">
              {implementationRoadmap.map((phase, index) => (
                <div key={index} className="card">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{phase.phase}</h3>
                      <p className="text-gray-600">{phase.period}</p>
                    </div>
                  </div>
                  <ul className="space-y-2 ml-12">
                    {phase.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="flex items-start">
                        <span className="text-blue-500 mr-2">□</span>
                        <span className="text-gray-700">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 成功指標 */}
      <section id="success-metrics" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              成功指標
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">期間</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">月間収益</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">アクティブ貢献者</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">トークン保有者</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {successMetrics.map((metric, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {metric.period}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {metric.revenue}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {metric.contributors}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {metric.holders}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* リスクと対策 */}
      <section id="risks" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              リスクと対策
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card bg-red-50 border-l-4 border-red-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">収益変動リスク</h3>
                <p className="text-gray-700 mb-3">市場変動による収益の不安定性</p>
                <div className="text-sm text-gray-600">
                  <strong>対策:</strong> 3ヶ月分の運営資金をリザーブ
                </div>
              </div>
              
              <div className="card bg-yellow-50 border-l-4 border-yellow-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">規制リスク</h3>
                <p className="text-gray-700 mb-3">各国の規制変更による影響</p>
                <div className="text-sm text-gray-600">
                  <strong>対策:</strong> 複数管轄地での法人設立
                </div>
              </div>
              
              <div className="card bg-blue-50 border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">技術的リスク</h3>
                <p className="text-gray-700 mb-3">スマートコントラクトの脆弱性</p>
                <div className="text-sm text-gray-600">
                  <strong>対策:</strong> 定期監査とバグバウンティプログラム
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 他DAOとの比較 */}
      <section id="comparison" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              他DAOとの比較
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DAO</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">運営</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">創業者</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">コミュニティ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">特徴</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-blue-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Unson OS</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">45%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">15%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">40%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">バランス型</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">YGG</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">約40%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">15%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">45%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">コミュニティ重視</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">一般的な企業</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">70%+</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">20%+</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">&lt;10%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">中央集権型</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="トークノミクスシステムに参加しよう"
        subtitle="公平で透明性のある収益分配モデルで、あなたの貢献が適切に評価される新しい組織に参加しませんか？"
        actions={[
          { label: 'コミュニティ参加', href: '/waitlist' },
          { label: 'DAO概要を見る', href: '/docs/dao/overview', variant: 'outline' as const }
        ]}
        backgroundColor="bg-gradient-to-r from-indigo-600 to-purple-600"
      />

      {/* ナビゲーション */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/dao/overview" className="text-blue-600 hover:text-blue-800">← DAO概要</a>
            <span className="text-gray-400">|</span>
            <a href="/docs/dao/governance" className="text-blue-600 hover:text-blue-800">ガバナンス詳細 →</a>
            <span className="text-gray-400">|</span>
            <a href="/docs" className="text-blue-600 hover:text-blue-800">ドキュメント一覧</a>
          </div>
        </div>
      </section>

      {/* フィードバック・編集 */}
      <section className="py-6 bg-white border-t">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <p className="text-sm text-gray-600">このページは役に立ちましたか？</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors">
                👍 役に立った
              </button>
              <button className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors">
                👎 改善が必要
              </button>
            </div>
            <div className="flex gap-2">
              <a 
                href="https://github.com/unson/unson-os/edit/main/docs/strategy/tokenomics-unified.md" 
                className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                📝 編集
              </a>
              <a 
                href="/contact?type=feedback&page=tokenomics" 
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                💬 フィードバック
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}