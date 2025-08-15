// Refactor Phase: ベタ書き・ハードコードを除去
import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'
import { DocsLayout } from '@/components/layout/DocsLayout'

export const metadata: Metadata = {
  title: 'DAOの仕組み - Unson OS ドキュメント',
  description: 'Unson OS DAOの仕組み、ガバナンス、参加方法について詳しく解説。分散型自律組織による革新的な運営モデル。',
  openGraph: {
    title: 'DAOの仕組み - Unson OS ドキュメント',
    description: 'Unson OS DAOの仕組み、ガバナンス、参加方法について詳しく解説。分散型自律組織による革新的な運営モデル。',
  },
}

// 収益分配構造（45-15-40モデル）
const revenueDistribution = [
  {
    category: '運営・再投資',
    percentage: 45,
    description: '開発・広告・インフラなど日常OPEX、時給1,000円×Jibble実績の先払い、再投資プール、緊急対応資金',
    color: 'blue'
  },
  {
    category: 'Founding Member Bonus',
    percentage: 15,
    description: '創業締切日までに実績条件を満たしたメンバーへの長期報酬（12ヶ月線形ベスティング）',
    color: 'green'
  },
  {
    category: 'Community Dividend Fund',
    percentage: 40,
    description: 'UNFトークン保有者（社内外全コントリビューター）へ四半期ごとに自動配当',
    color: 'purple'
  }
]

// UNSONトークン情報
const tokenInfo = {
  totalSupply: '1億枚',
  blockchain: 'Base（Ethereum L2）',
  standard: 'ERC-20',
  initialPrice: '1 UNSON = 0.01 USD'
}

// 貢献度評価システム
const contributionSystem = [
  { activity: 'コードコミット', points: '+3', description: '承認されたPull Request' },
  { activity: 'Issue解決', points: '+2', description: 'クローズされたIssue' },
  { activity: 'メディア確認', points: '+1', description: 'デザイン・動画の品質確認' },
  { activity: 'Q&A回答', points: '+1', description: 'Slackでの有用な回答' },
  { activity: '提案採用', points: '+2', description: '会議での提案が実装された' }
]

// 創業メンバー配分
const foundingMemberDistribution = [
  { member: '代表', allocation: '40%', vesting: '即時100%', frequency: '月次' },
  { member: 'キュレーター', allocation: '20%', vesting: '12ヶ月線形', frequency: '四半期' },
  { member: 'クラフツマン', allocation: '20%', vesting: '12ヶ月線形', frequency: '四半期' },
  { member: '開発リーダー', allocation: '20%', vesting: '12ヶ月線形', frequency: '四半期' }
]

// ガバナンスプロセス
const governanceProcess = [
  {
    step: 1,
    title: '提案作成',
    description: 'コミュニティメンバーが新しい提案を作成',
    duration: '1-3日',
    participants: 'All Members'
  },
  {
    step: 2,
    title: '討議期間',
    description: 'Discord・フォーラムでコミュニティが議論',
    duration: '7日',
    participants: 'All Members'
  },
  {
    step: 3,
    title: '予備審査',
    description: 'Senior Membersが技術的・戦略的妥当性を審査',
    duration: '3日',
    participants: 'Senior Members'
  },
  {
    step: 4,
    title: '正式投票',
    description: 'トークン保有者による重み付き投票',
    duration: '5日',
    participants: 'Token Holders'
  },
  {
    step: 5,
    title: '実装',
    description: '可決された提案の実装・監視',
    duration: '1-4週間',
    participants: 'Development Team'
  }
]

// 投票権重
const votingWeights = [
  { role: 'Core Team', weight: '10x', description: '戦略的決定に強い影響力' },
  { role: 'Senior Members', weight: '5x', description: '専門知識に基づく重み付け' },
  { role: 'Active Contributors', weight: '2x', description: '貢献度による加重' },
  { role: 'Community Members', weight: '1x', description: '基本的な発言権' }
]

export default function DAOOverviewPage() {
  
  return (
    <DocsLayout>
      {/* ヒーローセクション */}
      <section className="relative min-h-[600px] py-20 flex items-center justify-center overflow-hidden">
        {/* 背景動画 */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero-dao-community.mp4" type="video/mp4" />
        </video>
        
        {/* オーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-purple-900/80"></div>
        
        {/* コンテンツ */}
        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-primary text-white mb-6 drop-shadow-lg">
              Unson OS DAO
              <span className="block text-blue-300 mt-2">
                分散型自律組織の仕組み
              </span>
            </h1>
            <p className="text-xl text-gray-100 mb-8 drop-shadow-md">
              従来の企業組織とは異なる、分散型で民主的な組織運営を実現。
              コミュニティメンバーが直接ガバナンスに参加し、透明性のある意思決定を行います。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationLink href="/community" variant="default" size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                DAOに参加する
              </NavigationLink>
              <NavigationLink href="/docs/dao/tokenomics" variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-900">
                トークノミクスを見る
              </NavigationLink>
            </div>
          </div>
        </div>
      </section>

      {/* 概要セクション */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-secondary mb-6">
              雲孫DAO = 自動おこづかい箱 + 多数決アプリ
            </h2>
            <p className="text-large text-gray-600 mb-8">
              みんなで使う自動おこづかい箱と多数決アプリが合体したもの。
              ルールはコンピューター（ブロックチェーン）が守ってくれるから、ズルできません。
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                透明な収益分配
              </h3>
              <p className="text-gray-600 text-sm">
                売上は自動で45%（運営）・15%（創業ボーナス）・40%（コミュニティ配当）に分配。
                Stripe Webhookで3つのSafeへUSDC自動振替。
              </p>
            </div>
            
            <div className="card text-center">
              <div className="text-4xl mb-4">🗳️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                民主的ガバナンス
              </h3>
              <p className="text-gray-600 text-sm">
                重要な決定は投票で決定。最小参加率20%、可決基準66%以上。
                1トークン = 1票で透明性のある意思決定。
              </p>
            </div>
            
            <div className="card text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                貢献度評価
              </h3>
              <p className="text-gray-600 text-sm">
                コードコミット、Issue解決、Q&A回答など具体的な貢献にポイント付与。
                活動係数により公平な配当計算。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 収益分配構造 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              45-15-40 収益分配モデル
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              Stripe Webhookで自動分流される透明な収益分配システム
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {revenueDistribution.map((model, index) => (
              <div key={index} className="text-center">
                <div className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center bg-${model.color}-100`}>
                  <div className="text-center">
                    <div className={`text-3xl font-bold text-${model.color}-600`}>{model.percentage}%</div>
                    <div className={`text-sm text-${model.color}-700`}>分配率</div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {model.category}
                </h3>
                <p className="text-gray-600 text-sm">
                  {model.description}
                </p>
              </div>
            ))}
          </div>

          {/* 創業メンバー配分詳細 */}
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Founding Member Bonus（15%）詳細配分
            </h3>
            <div className="overflow-x-auto">
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
            <p className="text-xs text-gray-500 mt-2">
              ※ 離脱で未ベスト分はDAO Fundへ戻る
            </p>
          </div>
        </div>
      </section>

      {/* ガバナンスプロセス */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              ガバナンスプロセス
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              提案から実装まで、透明性のある5段階プロセス
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
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
                        <h3 className="text-lg font-semibold text-gray-900">
                          {process.title}
                        </h3>
                        <div className="text-right">
                          <div className="text-sm text-blue-600 font-medium">
                            {process.duration}
                          </div>
                          <div className="text-xs text-gray-500">
                            {process.participants}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600">
                        {process.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 投票権重 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              投票権重システム
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              貢献度と専門性に基づく公正な投票権重付け
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {votingWeights.map((weight, index) => (
              <div key={index} className="card text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {weight.weight}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {weight.role}
                </h3>
                <p className="text-gray-600 text-sm">
                  {weight.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
              投票権重の計算方法
            </h3>
            <div className="text-sm text-gray-600 text-center max-w-2xl mx-auto">
              最終的な投票力 = 基本投票権 × 役割重み × トークン保有量 × 貢献度スコア
              <br />
              すべての計算は透明性のためブロックチェーン上で実行されます。
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="DAOガバナンスに参加しよう"
        subtitle="あなたのスキルと情熱でUnson OSの未来を一緒に作りませんか？"
        actions={[
          { label: 'コミュニティ参加', href: '/waitlist' },
          { label: 'ガバナンス詳細', href: '/docs/governance', variant: 'outline' }
        ]}
        backgroundColor="bg-gradient-to-r from-blue-600 to-purple-600"
      />

      {/* ナビゲーション */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/dao/tokenomics" className="text-blue-600 hover:text-blue-800">トークノミクス</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/dao/proposals" className="text-blue-600 hover:text-blue-800">提案と投票</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/dao/revenue-sharing" className="text-blue-600 hover:text-blue-800">収益分配</a>
            <span className="text-gray-300">|</span>
            <a href="/docs" className="text-blue-600 hover:text-blue-800">ドキュメント一覧</a>
          </div>
        </div>
      </section>
    </DocsLayout>
  )
}