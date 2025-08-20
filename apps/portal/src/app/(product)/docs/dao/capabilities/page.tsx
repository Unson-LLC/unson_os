import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'
import { DocsLayout } from '@/components/layout/DocsLayout'

export const metadata: Metadata = {
  title: 'DAOでできること - Unson OS ドキュメント',
  description: 'Unson OS DAOでできる具体的な活動：ガバナンス参加、収益獲得、プロダクト創造、コミュニティ活動、キャリア成長、社会的インパクト創出について詳しく解説。',
  openGraph: {
    title: 'DAOでできること - Unson OS ドキュメント',
    description: 'Unson OS DAOでできる具体的な活動：ガバナンス参加、収益獲得、プロダクト創造、コミュニティ活動、キャリア成長、社会的インパクト創出について詳しく解説。',
  },
}

const governanceActivities = [
  {
    activity: '新しいSaaSプロダクトの採択・却下',
    description: 'コミュニティ投票による意思決定',
    icon: '🚀'
  },
  {
    activity: '予算配分の決定',
    description: '運営資金の効果的な配分を決定',
    icon: '💰'
  },
  {
    activity: '技術スタックの選定',
    description: '使用技術の方針決定',
    icon: '⚙️'
  },
  {
    activity: 'パートナーシップの承認',
    description: '戦略的提携の可否判断',
    icon: '🤝'
  },
  {
    activity: 'DAOルールの変更',
    description: '組織運営ルールの改善',
    icon: '📋'
  }
]

const votingProcess = {
  tokenRequirement: 'UNSONトークンを保有',
  platform: 'Snapshotで提案を確認',
  period: '投票期間内に賛成/反対を表明',
  power: '投票力 = √(保有UNSON数)（Quadratic Voting）'
}

const proposalExample = {
  title: 'AI英会話学習SaaS',
  description: '開発開始の提案例',
  requirements: {
    participation: '20%以上',
    approval: '66%以上',
    period: '7日間'
  },
  result: '可決されれば2週間以内にMVP開発開始'
}

const proposalRequirements = {
  tokenRequirement: '1,000 UNSON以上を保有',
  template: '提案テンプレートに従って作成',
  discussion: 'コミュニティでの事前議論（推奨）'
}

const earningMethods = [
  {
    activity: 'コード開発（PR作成）',
    points: '+3/PR',
    example: '10PR × 3pt = 30pt → 約$3,000',
    period: '月間総収益$100Kの場合'
  },
  {
    activity: 'バグ修正（Issue解決）',
    points: '+2/Issue',
    example: '15Issue × 2pt = 30pt → 約$3,000',
    period: '月間総収益$100Kの場合'
  },
  {
    activity: 'デザイン作成',
    points: '+2/画面',
    example: '10画面 × 2pt = 20pt → 約$2,000',
    period: '月間総収益$100Kの場合'
  },
  {
    activity: 'コンテンツ作成',
    points: '+1/記事',
    example: '20記事 × 1pt = 20pt → 約$2,000',
    period: '月間総収益$100Kの場合'
  },
  {
    activity: 'Q&A対応',
    points: '+1/解決',
    example: '30件 × 1pt = 30pt → 約$3,000',
    period: '月間総収益$100Kの場合'
  }
]

const paymentSchedule = {
  timing: '毎月15日にPROFITトークン発行',
  exchange: 'PROFITトークン → USDC交換可能',
  withdrawal: '銀行口座への出金も可能（手数料別）'
}

const unsonTokenBenefits = [
  {
    benefit: '四半期ごとの配当受取権',
    description: '安定した収益分配',
    icon: '💵'
  },
  {
    benefit: 'DAOの成長に伴う価値上昇',
    description: '長期的な資産価値の向上',
    icon: '📈'
  },
  {
    benefit: 'RageQuit（離脱）時のUSDC交換権',
    description: 'いつでも離脱可能な自由度',
    icon: '🚪'
  }
]

const productCreationProcess = [
  {
    phase: 'アイデア提案',
    period: 'Day 1-7',
    activities: [
      '思い込みを破壊する課題を発見',
      '提案フォームに記入',
      'コミュニティ投票'
    ]
  },
  {
    phase: 'MVP開発参加',
    period: 'Day 8-21',
    activities: [
      '開発チームへの参加',
      'UI/UXデザイン',
      'コピーライティング',
      'テスト実施'
    ]
  },
  {
    phase: '運用・改善',
    period: 'Day 22以降',
    activities: [
      'ユーザーフィードバック収集',
      '機能改善提案',
      'マーケティング施策'
    ]
  }
]

const successExample = {
  productName: 'プロンプト変換君',
  proposer: '田中さん（デザイナー）',
  developmentPeriod: '14日',
  firstMonthRevenue: '$5,000',
  proposerBonus: '$500/月（成功ボーナス）'
}

const communityActivities = [
  {
    activity: '技術勉強会の開催・参加',
    description: 'スキルアップと知識共有',
    icon: '📚'
  },
  {
    activity: 'メンタリング（新規メンバー支援）',
    description: '新規参加者のサポート',
    icon: '🎯'
  },
  {
    activity: 'ナレッジ共有（ブログ、動画）',
    description: '知識の体系化と共有',
    icon: '📝'
  },
  {
    activity: 'コラボレーションプロジェクト',
    description: 'メンバー間の協力プロジェクト',
    icon: '🤝'
  }
]

const rewardedActivities = [
  '公式ドキュメントの作成・翻訳',
  'チュートリアル動画の制作',
  'コミュニティイベントの企画・運営',
  '新規メンバーのオンボーディング支援'
]

const communityChannels = [
  { channel: '#dev-general', description: '開発全般の議論' },
  { channel: '#design-ui-ux', description: 'デザイン関連' },
  { channel: '#marketing-growth', description: 'マーケティング戦略' },
  { channel: '#ideas-brainstorm', description: '新規アイデア' },
  { channel: '#help-qa', description: '質問・サポート' }
]

const languageSupport = {
  main: '日本語メインチャンネル',
  global: '英語グローバルチャンネル',
  translation: '自動翻訳Bot完備'
}

const skillAcquisition = [
  '最新のノーコード/ローコード技術',
  'AIを活用した開発手法',
  'DAOガバナンスの実践',
  'グローバルチームでの協働',
  '起業家精神とビジネス感覚'
]

const blockchainRecords = [
  'すべての貢献が永続的に記録',
  'スキルNFTの発行（予定）',
  'ポートフォリオとして活用可能'
]

const careerPath = [
  {
    level: '初級メンバー',
    period: '3ヶ月',
    income: '月収$500'
  },
  {
    level: 'アクティブ貢献者',
    period: '6ヶ月',
    income: '月収$2,000'
  },
  {
    level: 'プロダクトリード',
    period: '12ヶ月',
    income: '月収$5,000'
  },
  {
    level: 'DAO理事',
    period: '24ヶ月',
    income: '月収$10,000+'
  }
]

const socialImpacts = [
  {
    impact: '100-200個のマイクロビジネス創出',
    description: '多様なビジネス機会の創造',
    icon: '🏪'
  },
  {
    impact: '世界中のユーザーの課題解決',
    description: 'グローバルな社会課題への対応',
    icon: '🌍'
  },
  {
    impact: '新しい働き方のモデル提示',
    description: '分散型組織の実践例',
    icon: '💼'
  },
  {
    impact: '分散型組織の成功事例',
    description: '未来の組織形態のパイオニア',
    icon: '🚀'
  }
]

const openSourceContributions = [
  '開発したコードの一部を公開',
  'ナレッジベースの構築',
  '教育コンテンツの提供'
]

const gettingStarted = [
  {
    step: 1,
    title: '準備',
    tasks: [
      'Discordに参加',
      'ウォレット（MetaMask等）を準備',
      '自己紹介を投稿'
    ]
  },
  {
    step: 2,
    title: '最初の貢献',
    tasks: [
      '既存Issueから選んで着手',
      '質問に回答してポイント獲得',
      'ドキュメント改善を提案'
    ]
  },
  {
    step: 3,
    title: '本格参加',
    tasks: [
      'UNSONトークンを取得',
      '得意分野でチームに参加',
      '新規プロダクト提案'
    ]
  }
]

const faqData = [
  {
    question: 'プログラミングができなくても参加できますか？',
    answer: 'はい！デザイン、マーケティング、コンテンツ作成、コミュニティ管理など、様々な貢献方法があります。'
  },
  {
    question: 'どれくらいの時間コミットが必要ですか？',
    answer: '自由です。週末だけの参加でも、フルタイムでも、自分のペースで貢献できます。'
  },
  {
    question: '収益はどれくらい期待できますか？',
    answer: '貢献度次第です。アクティブなメンバーは月$1,000-5,000、トップ貢献者は$10,000以上も可能です。'
  },
  {
    question: '失敗したプロダクトの責任は？',
    answer: '個人に責任は問われません。失敗も学習機会として共有され、次のプロダクトに活かされます。'
  },
  {
    question: '離脱したい場合は？',
    answer: 'いつでも可能です。RageQuit機能により、保有トークンをUSDCに交換して離脱できます。'
  }
]

const testimonials = [
  {
    quote: '副業として始めましたが、今では本業以上の収入があります。何より、世界中の仲間と一緒に新しいものを作る楽しさは格別です。',
    author: '佐藤さん（エンジニア、参加6ヶ月）'
  },
  {
    quote: 'デザイナーとしてのスキルを活かしながら、ビジネス感覚も身につきました。提案したプロダクトが実際に収益を生むのを見るのは感動的です。',
    author: '田中さん（デザイナー、参加4ヶ月）'
  },
  {
    quote: '英語が苦手でしたが、日本語チャンネルがあるので安心して参加できました。グローバルなネットワークも広がりました。',
    author: '鈴木さん（マーケター、参加3ヶ月）'
  }
]

export default function DAOCapabilitiesPage() {
  return (
    <DocsLayout>
      <section className="section-padding bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-primary text-gray-900 mb-6">
              Unson OS DAO で
              <span className="block text-purple-600 mt-2">
                できること 🌟
              </span>
            </h1>
            <div className="flex justify-center items-center gap-4 text-sm text-gray-600 mb-6">
              <span>📖 読み時間: 約12分</span>
              <span>•</span>
              <span>🏷️ DAO・活動・収益</span>
              <span>•</span>
              <span>📅 最終更新: 2024年12月</span>
            </div>
            <p className="text-large text-gray-600 mb-8 max-w-3xl mx-auto">
              メンバーが主体的に参加し、価値を創造し、その成果を共有できる分散型自律組織。
              ガバナンス参加から収益獲得、プロダクト創造まで、具体的にできることを解説します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationLink href="#governance" variant="default" size="lg">
                🗳️ ガバナンス参加
              </NavigationLink>
              <NavigationLink href="#earning" variant="outline" size="lg">
                💰 収益獲得
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
                <a href="#governance" className="block py-2 text-blue-600 hover:text-blue-800">1. 🗳️ ガバナンス参加</a>
                <a href="#earning" className="block py-2 text-blue-600 hover:text-blue-800">2. 💰 収益獲得</a>
                <a href="#product-creation" className="block py-2 text-blue-600 hover:text-blue-800">3. 🚀 プロダクト創造</a>
                <a href="#community" className="block py-2 text-blue-600 hover:text-blue-800">4. 🤝 コミュニティ活動</a>
              </div>
              <div>
                <a href="#career-growth" className="block py-2 text-blue-600 hover:text-blue-800">5. 🎯 キャリア成長</a>
                <a href="#social-impact" className="block py-2 text-blue-600 hover:text-blue-800">6. 🌍 社会的インパクト</a>
                <a href="#getting-started" className="block py-2 text-blue-600 hover:text-blue-800">7. 💡 始め方</a>
                <a href="#faq" className="block py-2 text-blue-600 hover:text-blue-800">8. ❓ よくある質問</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="governance" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              🗳️ ガバナンス参加
            </h2>

            <div className="card bg-gradient-to-r from-blue-50 to-purple-50 mb-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">投票による意思決定</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {governanceActivities.map((activity, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl mb-3">{activity.icon}</div>
                    <h4 className="font-semibold text-gray-900 mb-2">{activity.activity}</h4>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">参加方法</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-2">1.</span>
                    <span className="text-gray-700">{votingProcess.tokenRequirement}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-2">2.</span>
                    <span className="text-gray-700">{votingProcess.platform}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-2">3.</span>
                    <span className="text-gray-700">{votingProcess.period}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-2">4.</span>
                    <span className="text-gray-700">{votingProcess.power}</span>
                  </div>
                </div>
              </div>

              <div className="card bg-green-50">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">提案例: {proposalExample.title}</h3>
                <p className="text-gray-700 mb-4">{proposalExample.description}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">必要投票率:</span>
                    <span className="font-semibold">{proposalExample.requirements.participation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">必要賛成率:</span>
                    <span className="font-semibold">{proposalExample.requirements.approval}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">投票期間:</span>
                    <span className="font-semibold">{proposalExample.requirements.period}</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded border">
                  <p className="text-sm text-green-700">→ {proposalExample.result}</p>
                </div>
              </div>
            </div>

            <div className="card bg-yellow-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">提案の作成</h3>
              <p className="text-gray-700 mb-4">新規プロダクトアイデア、既存プロダクトの改善案、収益分配比率の変更提案、新機能の追加提案など</p>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">必要条件</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• {proposalRequirements.tokenRequirement}</li>
                    <li>• {proposalRequirements.template}</li>
                    <li>• {proposalRequirements.discussion}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="earning" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              💰 収益獲得
            </h2>

            <div className="card mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">貢献に応じた報酬</h3>
              <div className="space-y-4">
                {earningMethods.map((method, index) => (
                  <div key={index} className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">{method.activity}</h4>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{method.points}</div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">{method.example}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{method.period}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">支払いタイミング</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">📅</span>
                    <span className="text-gray-700">{paymentSchedule.timing}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">💱</span>
                    <span className="text-gray-700">{paymentSchedule.exchange}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">🏦</span>
                    <span className="text-gray-700">{paymentSchedule.withdrawal}</span>
                  </li>
                </ul>
              </div>

              <div className="card bg-purple-50">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">長期的な価値共有</h3>
                <div className="space-y-3">
                  {unsonTokenBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-2xl mr-3">{benefit.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{benefit.benefit}</h4>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="product-creation" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              🚀 プロダクト創造
            </h2>

            <div className="card mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">アイデアから収益化まで</h3>
              <div className="space-y-8">
                {productCreationProcess.map((phase, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex flex-col items-center mr-6">
                      <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      {index < productCreationProcess.length - 1 && (
                        <div className="w-0.5 h-16 bg-purple-200 mt-4"></div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="card bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-lg font-semibold text-gray-900">{phase.phase}</h4>
                          <span className="text-sm text-purple-600 font-medium">{phase.period}</span>
                        </div>
                        <ul className="space-y-2">
                          {phase.activities.map((activity, actIndex) => (
                            <li key={actIndex} className="flex items-start">
                              <span className="text-purple-500 mr-2">•</span>
                              <span className="text-gray-700">{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-gradient-to-r from-green-50 to-blue-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">成功事例: {successExample.productName}</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <ul className="space-y-2 text-sm">
                    <li><strong>提案者:</strong> {successExample.proposer}</li>
                    <li><strong>開発期間:</strong> {successExample.developmentPeriod}</li>
                    <li><strong>初月売上:</strong> {successExample.firstMonthRevenue}</li>
                  </ul>
                </div>
                <div>
                  <div className="p-3 bg-white rounded border">
                    <strong className="text-green-600">提案者への追加報酬:</strong>
                    <p className="text-green-700">{successExample.proposerBonus}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="community" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              🤝 コミュニティ活動
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">スキルシェアと協働</h3>
                <div className="space-y-4">
                  {communityActivities.map((activity, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-2xl mr-3">{activity.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{activity.activity}</h4>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card bg-blue-50">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">報酬対象となる活動</h3>
                <ul className="space-y-3">
                  {rewardedActivities.map((activity, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">✓</span>
                      <span className="text-gray-700">{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">参加できるチャンネル</h3>
                <div className="space-y-3">
                  {communityChannels.map((channel, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-mono text-sm text-blue-600">{channel.channel}</span>
                      <span className="text-sm text-gray-600">{channel.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card bg-green-50">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">多言語対応</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">🇯🇵</span>
                    <span className="text-gray-700">{languageSupport.main}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">🌍</span>
                    <span className="text-gray-700">{languageSupport.global}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">🤖</span>
                    <span className="text-gray-700">{languageSupport.translation}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="career-growth" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              🎯 キャリア成長
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">スキル獲得機会</h3>
                <ul className="space-y-3">
                  {skillAcquisition.map((skill, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-purple-500 mr-2">⭐</span>
                      <span className="text-gray-700">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card bg-purple-50">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">実績の可視化</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">ブロックチェーン記録</h4>
                    <ul className="space-y-2">
                      {blockchainRecords.map((record, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-purple-500 mr-2">•</span>
                          <span className="text-sm text-gray-700">{record}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-r from-blue-50 to-purple-50">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">キャリアパス例</h3>
              <div className="flex justify-center">
                <div className="space-y-4 max-w-2xl">
                  {careerPath.map((path, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{path.level}</h4>
                          <p className="text-sm text-gray-600">（{path.period}）</p>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-green-600">{path.income}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="social-impact" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              🌍 社会的インパクト
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">価値創造への参加</h3>
                <div className="space-y-4">
                  {socialImpacts.map((impact, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-3xl mr-3">{impact.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{impact.impact}</h4>
                        <p className="text-sm text-gray-600">{impact.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card bg-green-50">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">公共財への貢献</h3>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">オープンソース</h4>
                  <ul className="space-y-2">
                    {openSourceContributions.map((contribution, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">📖</span>
                        <span className="text-gray-700">{contribution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="getting-started" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              💡 始め方
            </h2>

            <div className="space-y-8">
              {gettingStarted.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex flex-col items-center mr-6">
                    <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                    {index < gettingStarted.length - 1 && (
                      <div className="w-0.5 h-16 bg-green-200 mt-4"></div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="card">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Step {step.step}: {step.title}
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        {step.tasks.map((task, taskIndex) => (
                          <div key={taskIndex} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-green-500 mr-2">□</span>
                            <span className="text-gray-700">{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              ❓ よくある質問
            </h2>

            <div className="space-y-6">
              {faqData.map((faq, index) => (
                <div key={index} className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Q: {faq.question}
                  </h3>
                  <p className="text-gray-700">
                    A: {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              参加者の声 💬
            </h2>

            <div className="grid gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="card bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="text-4xl mb-4">💭</div>
                  <blockquote className="text-gray-700 mb-4 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="text-sm text-gray-600 font-medium">
                    — {testimonial.author}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Unson OS DAOで価値創造を始めよう"
        subtitle="あなたのスキルと情熱を、世界を変えるプロダクトに変えませんか？多様な貢献方法であなたの強みを活かせます。"
        actions={[
          { label: 'Discord参加', href: '/waitlist' },
          { label: 'DAO構造詳細', href: '/docs/dao/structure', variant: 'outline' }
        ]}
        backgroundColor="bg-gradient-to-r from-purple-600 to-blue-600"
      />

      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/dao/guide" className="text-blue-600 hover:text-blue-800">← DAOガイド</a>
            <span className="text-gray-400">|</span>
            <a href="/docs/dao/concept" className="text-blue-600 hover:text-blue-800">DAO設計思想 →</a>
            <span className="text-gray-400">|</span>
            <a href="/docs" className="text-blue-600 hover:text-blue-800">ドキュメント一覧</a>
          </div>
        </div>
      </section>
    </DocsLayout>
  )
}