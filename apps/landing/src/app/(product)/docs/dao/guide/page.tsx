import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'
import { DocsLayout } from '@/components/layout/DocsLayout'

export const metadata: Metadata = {
  title: 'DAOの分かりやすいガイド - Unson OS ドキュメント',
  description: 'UnsonOS DAOを中学生でも分かるように解説。自動おこづかい箱と多数決アプリが合体した革新的な仕組みを簡単に理解できます。',
  openGraph: {
    title: 'DAOの分かりやすいガイド - Unson OS ドキュメント',
    description: 'UnsonOS DAOを中学生でも分かるように解説。自動おこづかい箱と多数決アプリが合体した革新的な仕組みを簡単に理解できます。',
  },
}

const moneyFlow = [
  {
    percentage: 45,
    purpose: '運営費',
    description: 'サーバー代や時給1,000円など',
    icon: '💻',
    color: 'blue'
  },
  {
    percentage: 15,
    purpose: '創業メンバーのボーナス',
    description: '最初から手伝った人たちのお礼',
    icon: '🏆',
    color: 'green'
  },
  {
    percentage: 40,
    purpose: 'DAOのおこづかい箱',
    description: 'みんなで山分けする部分',
    icon: '💰',
    color: 'purple'
  }
]

const tokenBenefits = [
  {
    title: '山分けでもらえるお金が増える',
    description: 'トークンが多いほど配当が増加',
    icon: '💵'
  },
  {
    title: '多数決での票が増える',
    description: '1トークン = 1票',
    icon: '🗳️'
  },
  {
    title: '貢献するともらえる',
    description: 'コードを書いたり、バグを直したりすると増える',
    icon: '⭐'
  }
]

const decisionExamples = [
  {
    example: '新しいサーバーを借りたい',
    process: [
      'Slackで「○○にいくら使おう」提案',
      'ボタンを押すと提案がDAOの多数決ページに移動',
      '5日間で投票→賛成66%以上ならOK'
    ]
  },
  {
    example: '広告費を増やしたい',
    process: [
      '同じ流れで提案',
      '数字と目標をセットで提案',
      'みんなでYES/NO'
    ]
  }
]

const preventionMethods = [
  {
    title: 'ブロックチェーンで記録',
    description: 'お金の出し入れや投票結果はブロックチェーンに書き込まれ、消したり書き換えたりできません',
    icon: '🔒'
  },
  {
    title: 'RageQuit機能',
    description: 'だれかがヘンな提案をしたら、反対票を入れたり、持っているトークンを返して脱退することもできます',
    icon: '🚪'
  }
]

const benefits = [
  {
    title: '透明',
    description: 'お金の動きがぜんぶ公開ノートみたいに見える',
    icon: '👁️'
  },
  {
    title: '公平',
    description: 'たくさん手伝った人ほどごほうび（配当&票）が増える',
    icon: '⚖️'
  },
  {
    title: '自動',
    description: '計算も配当もロボットがやるので、先生（社長）がいなくても回る',
    icon: '🤖'
  }
]

const participationSteps = [
  {
    step: 1,
    title: '基本登録',
    requirements: [
      'メールアドレスとGitHub/Slack連携',
      '利用規約に同意'
    ]
  },
  {
    step: 2,
    title: '本人確認',
    requirements: [
      'GitHubアカウントが30日以上前に作成',
      '必要に応じてKYC（身分証明）'
    ]
  },
  {
    step: 3,
    title: '最初の貢献',
    requirements: [
      'コードのPull Request 1本',
      'LP/広告デザイン 1件採用',
      '文書翻訳500文字またはドキュメント修正'
    ]
  },
  {
    step: 4,
    title: 'トークン保有',
    requirements: [
      '100 UNF以上を保有（約10〜20 USDC）',
      '貢献によるエアドロップまたは購入'
    ]
  }
]

const earningExamples = [
  {
    activity: 'コード開発（PR作成）',
    points: '+3/PR',
    example: '10PR × 3pt = 30pt → 約$3,000',
    monthlyRevenue: '月間総収益$100Kの場合'
  },
  {
    activity: 'バグ修正（Issue解決）',
    points: '+2/Issue',
    example: '15Issue × 2pt = 30pt → 約$3,000',
    monthlyRevenue: '月間総収益$100Kの場合'
  },
  {
    activity: 'デザイン作成',
    points: '+2/画面',
    example: '10画面 × 2pt = 20pt → 約$2,000',
    monthlyRevenue: '月間総収益$100Kの場合'
  },
  {
    activity: 'コンテンツ作成',
    points: '+1/記事',
    example: '20記事 × 1pt = 20pt → 約$2,000',
    monthlyRevenue: '月間総収益$100Kの場合'
  },
  {
    activity: 'Q&A対応',
    points: '+1/解決',
    example: '30件 × 1pt = 30pt → 約$3,000',
    monthlyRevenue: '月間総収益$100Kの場合'
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

const gettingStarted = {
  requirements: [
    'インターネット接続',
    '基本的なPCスキル',
    '学習意欲と協調性',
    '週数時間の時間'
  ],
  firstSteps: [
    'Discordに参加',
    '#introductionで自己紹介',
    '#help-qaで質問に答えてみる',
    '初めての貢献で報酬獲得！'
  ]
}

export default function DAOGuidePage() {
  return (
    <DocsLayout>
      <section className="section-padding bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-primary text-gray-900 mb-6">
              UnsonOS DAO
              <span className="block text-green-600 mt-2">
                分かりやすいガイド 🎯
              </span>
            </h1>
            <div className="text-6xl mb-6">🤝💰🗳️</div>
            <p className="text-large text-gray-600 mb-8 max-w-3xl mx-auto">
              中学生でも分かる！みんなで使う<strong>自動おこづかい箱</strong>と<strong>多数決アプリ</strong>が合体したもの。
              ルールはコンピューター（ブロックチェーン）が守ってくれるから、ズルできません。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationLink href="#money-flow" variant="default" size="lg">
                💰 お金の流れを見る
              </NavigationLink>
              <NavigationLink href="#how-to-join" variant="outline" size="lg">
                🚀 参加方法を知る
              </NavigationLink>
            </div>
          </div>
        </div>
      </section>

      <section id="dao-explained" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="heading-secondary mb-8">
              DAOを一言で 🎈
            </h2>
            <div className="text-8xl mb-6">🏪</div>
            <p className="text-2xl text-gray-700 mb-8 font-medium">
              みんなで使う<span className="text-green-600 font-bold">自動おこづかい箱</span>と<span className="text-blue-600 font-bold">多数決アプリ</span>が合体したもの
            </p>
            <p className="text-large text-gray-600 max-w-2xl mx-auto">
              しかもルールはコンピューター（ブロックチェーン）が守ってくれるから、ズルできません。
            </p>
          </div>
        </div>
      </section>

      <section id="money-flow" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              どうやってお金が入る？ 💸
            </h2>
            <p className="text-large text-center text-gray-600 mb-12">
              UnsonOSが作ったアプリやサービスが<strong>おこづかい（売上）</strong>を稼ぎます。
              <br />
              お金は自動で３つに分かれます：
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {moneyFlow.map((flow, index) => (
                <div key={index} className="text-center">
                  <div className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center bg-${flow.color}-100`}>
                    <div className="text-center">
                      <div className="text-4xl mb-2">{flow.icon}</div>
                      <div className={`text-2xl font-bold text-${flow.color}-600`}>{flow.percentage}%</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {flow.purpose}
                  </h3>
                  <p className="text-gray-600">
                    {flow.description}
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
              トークン = 投票券 & ポイント 🎫
            </h2>
            <p className="text-large text-center text-gray-600 mb-12">
              DAOに参加した人は<strong className="text-purple-600">UNFトークン</strong>というコインをもらいます。
            </p>

            <div className="card bg-gradient-to-r from-purple-50 to-pink-50 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                トークンが多いほど：
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {tokenBenefits.map((benefit, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl mb-3">{benefit.icon}</div>
                    <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center p-6 bg-yellow-50 rounded-lg">
              <p className="text-lg text-gray-700">
                トークンは「たくさんコードを書いた」「バグを直した」など<strong>貢献すると増えます</strong>。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              何か決めるときは？ 🤔
            </h2>

            <div className="space-y-8">
              {decisionExamples.map((example, index) => (
                <div key={index} className="card">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    📝 {example.example}
                  </h3>
                  <div className="space-y-3">
                    {example.process.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-start">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                          {stepIndex + 1}
                        </div>
                        <p className="text-gray-700">{step}</p>
                      </div>
                    ))}
                  </div>
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
              ズルはどう防ぐ？ 🛡️
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {preventionMethods.map((method, index) => (
                <div key={index} className="card text-center">
                  <div className="text-6xl mb-4">{method.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {method.title}
                  </h3>
                  <p className="text-gray-600">
                    {method.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              いいことまとめ ✨
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="card text-center bg-white">
                  <div className="text-6xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="how-to-join" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              参加するには？ 🚀
            </h2>

            <div className="space-y-8">
              {participationSteps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex flex-col items-center mr-6">
                    <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                    {index < participationSteps.length - 1 && (
                      <div className="w-0.5 h-16 bg-green-200 mt-4"></div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="card">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        STEP {step.step}: {step.title}
                      </h3>
                      <ul className="space-y-2">
                        {step.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            <span className="text-gray-700">{req}</span>
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

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              貢献で稼げるお金 💰
            </h2>

            <div className="space-y-4">
              {earningExamples.map((earning, index) => (
                <div key={index} className="card">
                  <div className="grid md:grid-cols-4 gap-4 items-center">
                    <div>
                      <h4 className="font-semibold text-gray-900">{earning.activity}</h4>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{earning.points}</div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">{earning.example}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{earning.monthlyRevenue}</p>
                    </div>
                  </div>
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
              よくある質問 ❓
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

      <section className="section-padding bg-blue-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              つまり 🎯
            </h2>
            <div className="text-center">
              <div className="text-6xl mb-6">🏫📱💰</div>
              <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
                UnsonOSのDAOは、みんなでルールを決めながら、自動販売機のように勝手にお金を集めて分ける仕組み。
              </p>
              <p className="text-large text-gray-600 max-w-2xl mx-auto">
                中学生がクラスの学級費をアプリで管理して、使い道も投票で決める──それをもっと大きく、世界中の人とやるイメージです。
              </p>
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

            <div className="grid md:grid-cols-1 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="card bg-gradient-to-r from-green-50 to-blue-50">
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

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              今すぐ始める 🌟
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  📋 必要なもの
                </h3>
                <ul className="space-y-3">
                  {gettingStarted.requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  🚀 最初の一歩
                </h3>
                <ol className="space-y-3">
                  {gettingStarted.firstSteps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2 font-bold">{index + 1}.</span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Unson OS DAOで新しい冒険を始めよう！ 🎊"
        subtitle="誰もが価値を創造し、その成果を公平に分配される新しい組織形態です。あなたのスキルと情熱を、世界を変えるプロダクトに変えてみませんか？"
        actions={[
          { label: 'コミュニティ参加', href: '/waitlist' },
          { label: '詳細なDAO構造', href: '/docs/dao/structure', variant: 'outline' }
        ]}
        backgroundColor="bg-gradient-to-r from-green-500 to-blue-500"
      />

      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/dao/overview" className="text-blue-600 hover:text-blue-800">← DAO概要</a>
            <span className="text-gray-400">|</span>
            <a href="/docs/dao/capabilities" className="text-blue-600 hover:text-blue-800">DAOでできること →</a>
            <span className="text-gray-400">|</span>
            <a href="/docs" className="text-blue-600 hover:text-blue-800">ドキュメント一覧</a>
          </div>
        </div>
      </section>
    </DocsLayout>
  )
}