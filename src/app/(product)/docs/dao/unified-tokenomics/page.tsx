import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: '統一トークノミクスモデル - Unson OS ドキュメント',
  description: 'Unson OS DAOの統一トークノミクスモデル。YGG DAOの成功事例を参考にした持続可能で公平な45-15-40収益分配システムの詳細解説。',
  openGraph: {
    title: '統一トークノミクスモデル - Unson OS ドキュメント',
    description: 'Unson OS DAOの統一トークノミクスモデル。YGG DAOの成功事例を参考にした持続可能で公平な45-15-40収益分配システムの詳細解説。',
  },
}

const revenueDistributionModel = [
  {
    category: '運営・再投資',
    percentage: 45,
    purpose: 'OPEX / 広告 / インフラ',
    details: [
      '人件費: Jibble打刻×¥1,000/h',
      'インフラコスト: サーバー、API利用料',
      'マーケティング: 広告費、プロモーション',
      '開発費用: 新機能開発、メンテナンス'
    ],
    management: [
      'freee APIによる自動仕訳、月末精算',
      '月次でコスト内訳を公開',
      '透明性を重視した予算管理'
    ],
    color: 'blue'
  },
  {
    category: '創業メンバーボーナス',
    percentage: 15,
    purpose: '初期リスクテイカーへの適切な報酬',
    details: [
      '対象者: 初課金ゲート突破前日までに参加し、実績条件を満たしたメンバー',
      '代表: 40%（即時100%受取可能）',
      'キュレーター: 20%（12ヶ月ベスティング）',
      'クラフツマン: 20%（12ヶ月ベスティング）',
      '開発リーダー: 20%（12ヶ月ベスティング）'
    ],
    management: [
      'USDC、四半期ごと支払',
      '離脱時の未ベスト分はDAO Fundへ戻る',
      'YGGの15%配分を参考にした業界標準'
    ],
    color: 'green'
  },
  {
    category: 'コミュニティ配当',
    percentage: 40,
    purpose: 'コミュニティによる価値創造を体現',
    details: [
      '対象: UNSONトークン保有者および活動貢献者',
      '分配方法: 貢献度スコアに基づく比例配分',
      '支払: 月次、USDCまたはPROFITトークン'
    ],
    management: [
      'Superfluidによる自動配当',
      '活動係数による公平な分配',
      'YGGの45%に近い水準でコミュニティ重視'
    ],
    color: 'purple'
  }
]

const rationaleComparison = [
  {
    aspect: '持続可能な運営基盤（45%）',
    reasoning: 'YGGは運営の安定性を重視し、長期的な成長を実現。十分な運営資金により、市場変動にも対応可能',
    unsonApproach: '100-200個のマイクロSaaS開発に必要な開発リソースを確保'
  },
  {
    aspect: '創業者への適切な報酬（15%）',
    reasoning: 'YGGの創業者配分15%は、初期リスクテイカーへの適切な報酬として業界標準',
    unsonApproach: '過度でも過少でもない、バランスの取れた配分で初期投資家がいない分を考慮'
  },
  {
    aspect: 'コミュニティ重視（40%）',
    reasoning: 'YGGのコミュニティ配分45%に近い水準',
    unsonApproach: 'DAOの本質である「コミュニティによる価値創造」を体現'
  }
]

const daoComparison = [
  { dao: 'Unson OS', operations: '45%', founders: '15%', community: '40%', characteristics: 'バランス型' },
  { dao: 'YGG', operations: '約40%', founders: '15%', community: '45%', characteristics: 'コミュニティ重視' },
  { dao: '一般的な企業', operations: '70%+', founders: '20%+', community: '<10%', characteristics: '中央集権型' }
]

const tokenDesign = {
  unson: {
    totalSupply: 100000000,
    rights: [
      'ガバナンス投票権',
      '収益分配請求権',
      'RageQuit権（トークン焼却→USDC受領）'
    ]
  },
  initialDistribution: [
    {
      category: '創業チーム（雲孫GK）',
      percentage: 25,
      period: '2年間のベスティング期間',
      reasoning: '初期リスクを負う創業者への適切な報酬。YGG（15%）より多いが、初期投資家がいない分を考慮'
    },
    {
      category: 'コミュニティトレジャリー',
      percentage: 40,
      period: 'DAO投票による配分決定',
      reasoning: 'DAOの本質であるコミュニティ主導を実現する最大配分'
    },
    {
      category: 'エコシステム開発',
      percentage: 20,
      period: '段階的配布',
      reasoning: '100-200個のマイクロSaaS開発に必要な開発リソース確保'
    },
    {
      category: '流動性提供',
      percentage: 10,
      period: 'DEXでの流動性確保',
      reasoning: '健全な市場形成に必要な流動性'
    },
    {
      category: '予備',
      percentage: 5,
      period: '緊急時対応',
      reasoning: '将来の不測の事態への対応余力'
    }
  ],
  profit: {
    issuance: '月次で動的発行',
    usage: 'コミュニティ配当の40%分を分配',
    exchange: 'USDCに1:1で交換可能（月次）'
  }
}

const contributionEvaluation = [
  { activity: 'PR作成', points: '+3', description: 'コード貢献', example: '月10PR → 30pt → 約$3,000' },
  { activity: 'Issue解決', points: '+2', description: '問題解決', example: '月15Issue → 30pt → 約$3,000' },
  { activity: 'メディア確認', points: '+1', description: '品質管理', example: '月20確認 → 20pt → 約$2,000' },
  { activity: 'Q&A対応', points: '+1', description: 'コミュニティサポート', example: '月30回答 → 30pt → 約$3,000' }
]

const qualityMultipliers = [
  { level: 'Exceptional', multiplier: '2.0x', description: '業界標準を大幅に上回る品質' },
  { level: 'High', multiplier: '1.5x', description: '期待を上回る高品質' },
  { level: 'Standard', multiplier: '1.0x', description: '基準を満たす標準品質' },
  { level: 'Low', multiplier: '0.5x', description: '最低限の要件をクリア' }
]

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

const governanceSettings = {
  proposalRequirement: 'UNSONトークン1,000以上保有',
  votingPeriod: '5日間',
  passRequirements: [
    '投票率20%以上',
    '賛成率66%以上'
  ],
  transparencyMeasures: [
    '月次収益レポート公開',
    '分配計算の完全可視化',
    'スマートコントラクト監査結果の公開'
  ]
}

const riskManagement = [
  {
    risk: '収益変動リスク',
    description: '市場変動による収益の不安定性',
    mitigation: '3ヶ月分の運営資金をリザーブ',
    color: 'red'
  },
  {
    risk: '規制リスク',
    description: '各国の規制変更による影響',
    mitigation: '複数管轄地での法人設立',
    color: 'yellow'
  },
  {
    risk: '技術的リスク',
    description: 'スマートコントラクトの脆弱性',
    mitigation: '定期監査とバグバウンティプログラム',
    color: 'blue'
  }
]

const successMetrics = [
  { period: '3ヶ月', revenue: '$50K', contributors: 50, holders: 100 },
  { period: '6ヶ月', revenue: '$200K', contributors: 200, holders: 500 },
  { period: '12ヶ月', revenue: '$1M', contributors: 1000, holders: 5000 }
]

const designPrinciples = [
  {
    principle: '持続可能性',
    description: '45%の運営資金により長期的な成長を支える',
    icon: '🌱'
  },
  {
    principle: '公平性',
    description: '創業者とコミュニティのバランスの取れた配分',
    icon: '⚖️'
  },
  {
    principle: '透明性',
    description: 'すべての分配が可視化され、検証可能',
    icon: '👁️'
  },
  {
    principle: '成長性',
    description: 'コミュニティの成長とともに価値が増大',
    icon: '📈'
  }
]

const yggLessonsLearned = [
  {
    lesson: 'スケーラブルなインフラ投資',
    description: 'YGGは早期にスケーラブルなインフラに投資し、急成長に対応。Unson OSも同様のアプローチを採用',
    application: 'L2ソリューション（Base）の採用、自動化システムの早期構築'
  },
  {
    lesson: 'コミュニティエンゲージメント',
    description: 'YGGの成功要因はアクティブなコミュニティ。教育とインセンティブの両立が重要',
    application: 'ゲーミフィケーション要素、段階的な報酬システム、メンタリング制度'
  },
  {
    lesson: 'ガバナンスの段階的分散化',
    description: 'YGGは段階的にガバナンスを分散化し、コミュニティの成熟に合わせて権限移譲',
    application: 'Gradual Decentralization戦略、権限レベルの段階的設定'
  }
]

const economicIncentives = [
  {
    stakeholder: 'エンジニア',
    incentives: ['コード貢献による高い報酬（+3pt/PR）', 'テクニカルリーダーシップ機会', 'スキルNFTによる実績証明'],
    alignment: 'プロダクト品質向上 → 収益増加 → 個人報酬増加'
  },
  {
    stakeholder: 'デザイナー',
    incentives: ['UI/UXデザインによる報酬（+2pt/画面）', 'ブランド構築への参加', 'クリエイティブな自由度'],
    alignment: 'ユーザー体験向上 → プロダクト成功 → 個人評価向上'
  },
  {
    stakeholder: 'マーケター',
    incentives: ['コンテンツ作成報酬（+1pt/記事）', 'グロース戦略の主導権', 'グローバルネットワーク構築'],
    alignment: 'ユーザー獲得 → 収益成長 → コミュニティ全体の利益'
  },
  {
    stakeholder: 'コミュニティマネージャー',
    incentives: ['Q&A対応報酬（+1pt/解決）', 'コミュニティ成長の実感', '人材ネットワーク拡大'],
    alignment: 'コミュニティ活性化 → 新規参加者増加 → エコシステム拡大'
  }
]

const tokenUtility = [
  {
    utility: 'ガバナンス参加',
    mechanism: 'トークン保有量に基づく投票権',
    benefit: 'DAOの意思決定に直接参加、自身の利益と一致する提案に投票'
  },
  {
    utility: '収益分配',
    mechanism: '貢献度とトークン保有量による配当',
    benefit: 'パッシブインカムの獲得、DAOの成長と個人利益の連動'
  },
  {
    utility: 'ステーキング報酬',
    mechanism: 'トークンロックによる追加報酬',
    benefit: '長期コミットメントへのインセンティブ、価格安定化効果'
  },
  {
    utility: 'RageQuit権',
    mechanism: 'トークン焼却によるUSDC受領',
    benefit: '出口戦略の確保、投資リスクの軽減'
  }
]

export default function UnifiedTokenomicsPage() {
  return (
    <div className="min-h-screen">
      <section className="section-padding bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-primary text-gray-900 mb-6">
              Unson OS 
              <span className="block text-emerald-600 mt-2">
                統一トークノミクスモデル 🎯
              </span>
            </h1>
            <div className="flex justify-center items-center gap-4 text-sm text-gray-600 mb-6">
              <span>📖 読み時間: 約18分</span>
              <span>•</span>
              <span>🏷️ トークノミクス・経済モデル・YGG参考</span>
              <span>•</span>
              <span>📅 最終更新: 2024年12月</span>
            </div>
            <p className="text-large text-gray-600 mb-8 max-w-3xl mx-auto">
              YGG DAOの成功事例を参考にした、持続可能で公平な45-15-40収益分配モデル。
              UNSONトークン設計と貢献度評価システムによる革新的な価値分配システムの詳細解説。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationLink href="#revenue-model" variant="default" size="lg">
                💰 収益分配モデル
              </NavigationLink>
              <NavigationLink href="#ygg-comparison" variant="outline" size="lg">
                📊 YGG比較分析
              </NavigationLink>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">目次</h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <a href="#revenue-model" className="block py-2 text-blue-600 hover:text-blue-800">1. 収益分配モデル（45-15-40）</a>
                <a href="#ygg-comparison" className="block py-2 text-blue-600 hover:text-blue-800">2. YGG DAOとの比較</a>
                <a href="#token-design" className="block py-2 text-blue-600 hover:text-blue-800">3. トークン設計</a>
                <a href="#contribution-system" className="block py-2 text-blue-600 hover:text-blue-800">4. 貢献度評価システム</a>
              </div>
              <div>
                <a href="#governance" className="block py-2 text-blue-600 hover:text-blue-800">5. ガバナンス</a>
                <a href="#implementation" className="block py-2 text-blue-600 hover:text-blue-800">6. 実装ロードマップ</a>
                <a href="#risk-management" className="block py-2 text-blue-600 hover:text-blue-800">7. リスクと対策</a>
                <a href="#success-metrics" className="block py-2 text-blue-600 hover:text-blue-800">8. 成功指標</a>
              </div>
              <div>
                <a href="#ygg-lessons" className="block py-2 text-blue-600 hover:text-blue-800">9. YGGからの学び</a>
                <a href="#economic-incentives" className="block py-2 text-blue-600 hover:text-blue-800">10. 経済的インセンティブ</a>
                <a href="#token-utility" className="block py-2 text-blue-600 hover:text-blue-800">11. トークンユーティリティ</a>
                <a href="#conclusion" className="block py-2 text-blue-600 hover:text-blue-800">12. まとめ</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="revenue-model" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              45-15-40 収益分配モデル
            </h2>
            
            <div className="card bg-gradient-to-r from-emerald-50 to-teal-50 mb-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                基本分配比率
              </h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-6xl font-bold text-blue-600 mb-2">45%</div>
                  <div className="text-lg font-semibold text-gray-900">運営・再投資</div>
                  <div className="text-sm text-gray-600">OPEX / 広告 / インフラ</div>
                </div>
                <div>
                  <div className="text-6xl font-bold text-green-600 mb-2">15%</div>
                  <div className="text-lg font-semibold text-gray-900">創業メンバーボーナス</div>
                  <div className="text-sm text-gray-600">初期リスクテイカーへの報酬</div>
                </div>
                <div>
                  <div className="text-6xl font-bold text-purple-600 mb-2">40%</div>
                  <div className="text-lg font-semibold text-gray-900">コミュニティ配当</div>
                  <div className="text-sm text-gray-600">価値創造の共有</div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {revenueDistributionModel.map((item, index) => (
                <div key={index} className={`card bg-${item.color}-50 border-l-4 border-${item.color}-500`}>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.category}</h3>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-${item.color}-700 bg-white`}>
                        {item.percentage}% - {item.purpose}
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">詳細内容</h4>
                      <ul className="space-y-2">
                        {item.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            <span className="text-sm text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">管理方法</h4>
                      <ul className="space-y-2">
                        {item.management.map((mgmt, mgmtIndex) => (
                          <li key={mgmtIndex} className="flex items-start">
                            <span className="text-blue-500 mr-2">✓</span>
                            <span className="text-sm text-gray-700">{mgmt}</span>
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

      <section id="ygg-comparison" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              なぜ45-15-40の比率なのか
            </h2>
            <p className="text-large text-center text-gray-600 mb-12">
              YGG DAOの成功事例を参考にした理由
            </p>

            <div className="space-y-8 mb-12">
              {rationaleComparison.map((item, index) => (
                <div key={index} className="card bg-yellow-50 border-l-4 border-yellow-500">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.aspect}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">YGGの実績</h4>
                      <p className="text-gray-700">{item.reasoning}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Unson OSの適用</h4>
                      <p className="text-gray-700">{item.unsonApproach}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">他DAOモデルとの比較</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">DAO</th>
                      <th className="px-4 py-3 text-center font-semibold">運営</th>
                      <th className="px-4 py-3 text-center font-semibold">創業者</th>
                      <th className="px-4 py-3 text-center font-semibold">コミュニティ</th>
                      <th className="px-4 py-3 text-left font-semibold">特徴</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {daoComparison.map((dao, index) => (
                      <tr key={index} className={dao.dao === 'Unson OS' ? 'bg-emerald-50' : ''}>
                        <td className="px-4 py-3 font-medium text-gray-900">{dao.dao}</td>
                        <td className="px-4 py-3 text-center text-blue-600 font-semibold">{dao.operations}</td>
                        <td className="px-4 py-3 text-center text-green-600 font-semibold">{dao.founders}</td>
                        <td className="px-4 py-3 text-center text-purple-600 font-semibold">{dao.community}</td>
                        <td className="px-4 py-3 text-gray-700">{dao.characteristics}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="token-design" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              トークン設計
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">UNSONトークン（ガバナンストークン）</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">総供給量:</span>
                    <span className="font-semibold">{tokenDesign.unson.totalSupply.toLocaleString()} UNSON</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">トークンの権利:</h4>
                    <ul className="space-y-2">
                      {tokenDesign.unson.rights.map((right, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-emerald-500 mr-2">🔹</span>
                          <span className="text-gray-700">{right}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="card bg-green-50">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">PROFITトークン（収益分配トークン）</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">発行</h4>
                    <p className="text-gray-700">{tokenDesign.profit.issuance}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">用途</h4>
                    <p className="text-gray-700">{tokenDesign.profit.usage}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">交換</h4>
                    <p className="text-gray-700">{tokenDesign.profit.exchange}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-r from-blue-50 to-purple-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">初期配分</h3>
              <div className="space-y-6">
                {tokenDesign.initialDistribution.map((dist, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg border">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{dist.category}</h4>
                        <p className="text-sm text-gray-600">{dist.period}</p>
                      </div>
                      <span className="text-2xl font-bold text-emerald-600">{dist.percentage}%</span>
                    </div>
                    <p className="text-sm text-gray-700">{dist.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contribution-system" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              貢献度評価システム
            </h2>

            <div className="card mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">基本評価項目</h3>
              <div className="space-y-4">
                {contributionEvaluation.map((item, index) => (
                  <div key={index} className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.activity}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{item.points}</div>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-700">{item.example}</p>
                      <p className="text-xs text-gray-500">月間総収益$100Kの場合</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-purple-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">品質乗数（将来的に導入を検討）</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {qualityMultipliers.map((multiplier, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white rounded">
                    <div>
                      <span className="font-semibold text-gray-900">{multiplier.level}</span>
                      <p className="text-xs text-gray-600">{multiplier.description}</p>
                    </div>
                    <span className="text-lg font-bold text-purple-600">{multiplier.multiplier}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="governance" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              ガバナンス
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">収益分配比率の変更</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">提案要件</h4>
                    <p className="text-gray-700">{governanceSettings.proposalRequirement}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">投票期間</h4>
                    <p className="text-gray-700">{governanceSettings.votingPeriod}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">可決条件</h4>
                    <ul className="space-y-1">
                      {governanceSettings.passRequirements.map((req, index) => (
                        <li key={index} className="text-gray-700">• {req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="card bg-blue-50">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">透明性の確保</h3>
                <ul className="space-y-3">
                  {governanceSettings.transparencyMeasures.map((measure, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">✓</span>
                      <span className="text-gray-700">{measure}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="implementation" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              実装ロードマップ
            </h2>

            <div className="space-y-8">
              {implementationRoadmap.map((phase, index) => (
                <div key={index} className="card">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{phase.phase}</h3>
                      <p className="text-gray-600">{phase.period}</p>
                    </div>
                  </div>
                  <ul className="space-y-2 ml-14">
                    {phase.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="flex items-start">
                        <span className="text-emerald-500 mr-2">□</span>
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

      <section id="risk-management" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              リスクと対策
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {riskManagement.map((risk, index) => (
                <div key={index} className={`card bg-${risk.color}-50 border-l-4 border-${risk.color}-500`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{risk.risk}</h3>
                  <p className="text-gray-700 mb-4">{risk.description}</p>
                  <div className="p-3 bg-white rounded border">
                    <span className={`font-semibold text-${risk.color}-700`}>対策:</span>
                    <p className="text-sm text-gray-600 mt-1">{risk.mitigation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-600 font-semibold">
                        {metric.revenue}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">
                        {metric.contributors}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-semibold">
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

      <section id="ygg-lessons" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              YGG DAOからの学び
            </h2>

            <div className="space-y-8">
              {yggLessonsLearned.map((lesson, index) => (
                <div key={index} className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-500">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{lesson.lesson}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">YGGの実績</h4>
                      <p className="text-gray-700">{lesson.description}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Unson OSでの適用</h4>
                      <p className="text-gray-700">{lesson.application}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="economic-incentives" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              経済的インセンティブ設計
            </h2>

            <div className="space-y-8">
              {economicIncentives.map((stakeholder, index) => (
                <div key={index} className="card">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{stakeholder.stakeholder}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">インセンティブ</h4>
                      <ul className="space-y-2">
                        {stakeholder.incentives.map((incentive, incentiveIndex) => (
                          <li key={incentiveIndex} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            <span className="text-gray-700">{incentive}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">利益アライメント</h4>
                      <p className="text-gray-700">{stakeholder.alignment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="token-utility" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              トークンユーティリティ
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {tokenUtility.map((utility, index) => (
                <div key={index} className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{utility.utility}</h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">メカニズム</h4>
                      <p className="text-gray-700 text-sm">{utility.mechanism}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">ベネフィット</h4>
                      <p className="text-gray-700 text-sm">{utility.benefit}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="conclusion" className="section-padding bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              まとめ
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {designPrinciples.map((principle, index) => (
                <div key={index} className="card text-center bg-white">
                  <div className="text-4xl mb-4">{principle.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{principle.principle}</h3>
                  <p className="text-sm text-gray-600">{principle.description}</p>
                </div>
              ))}
            </div>

            <div className="card bg-white text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">統一トークノミクスモデルの特徴</h3>
              <p className="text-large text-gray-700 mb-6 max-w-3xl mx-auto">
                このトークノミクスモデルは、YGG DAOの成功事例を参考にしながら、
                Unson OS独自の「100-200個のマイクロSaaS自動生成」というビジョンに最適化されたモデルです。
              </p>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">実績に基づく設計</h4>
                  <p className="text-gray-700">YGG DAOの成功パターンを分析し、実証済みの配分比率を採用</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Unson OS特化</h4>
                  <p className="text-gray-700">マイクロSaaS大量生成に必要なリソース配分を考慮した独自調整</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">コミュニティファースト</h4>
                  <p className="text-gray-700">40%のコミュニティ配当で、価値創造への参加意欲を最大化</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">持続可能な成長</h4>
                  <p className="text-gray-700">45%の運営資金で市場変動に対応し、長期的な安定性を確保</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="統一トークノミクスモデルで価値創造に参加しよう"
        subtitle="YGG DAOの成功事例を参考にした公平で透明性のある収益分配モデルで、あなたの貢献が適切に評価される新しい経済システムに参加しませんか？"
        actions={[
          { label: 'DAOに参加する', href: '/waitlist' },
          { label: 'DAO概要を見る', href: '/docs/dao/overview', variant: 'outline' }
        ]}
        backgroundColor="bg-gradient-to-r from-emerald-600 to-teal-600"
      />

      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/dao/concept" className="text-blue-600 hover:text-blue-800">← DAO設計思想</a>
            <span className="text-gray-400">|</span>
            <a href="/docs/dao/tokenomics" className="text-blue-600 hover:text-blue-800">トークノミクス詳細 →</a>
            <span className="text-gray-400">|</span>
            <a href="/docs" className="text-blue-600 hover:text-blue-800">ドキュメント一覧</a>
          </div>
        </div>
      </section>

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
                href="/contact?type=feedback&page=unified-tokenomics" 
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