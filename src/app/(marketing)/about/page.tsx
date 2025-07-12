// Refactor Phase: ベタ書き・ハードコードを除去
import type { Metadata } from 'next'
import { CTASection } from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'Unson OSについて - 革新的SaaS自動生成プラットフォーム',
  description: 'Unson OSのビジョン、ミッション、創設の背景。100-200個のマイクロSaaSを24-48時間で自動生成する革新的なプラットフォームの物語。',
  openGraph: {
    title: 'Unson OSについて - 革新的SaaS自動生成プラットフォーム',
    description: 'Unson OSのビジョン、ミッション、創設の背景。100-200個のマイクロSaaSを24-48時間で自動生成する革新的なプラットフォームの物語。',
  },
}

// チームメンバー
const teamMembers = [
  {
    name: 'Hiroshi Tanaka',
    role: 'Founder & CEO',
    bio: 'AI研究者として10年以上の経験。自動化システムとマイクロサービスアーキテクチャの専門家。',
    expertise: ['AI/ML', 'システム設計', '起業'],
    image: '/team/hiroshi.jpg'
  },
  {
    name: 'Emily Chen',
    role: 'CTO',
    bio: 'Google出身のソフトウェアエンジニア。大規模分散システムの設計・構築に豊富な経験。',
    expertise: ['分散システム', 'クラウド', 'DevOps'],
    image: '/team/emily.jpg'
  },
  {
    name: 'Yuki Yamamoto',
    role: 'Head of Product',
    bio: 'スタートアップから大企業まで、プロダクト開発を主導。UXデザインとプロダクト戦略の専門家。',
    expertise: ['プロダクト戦略', 'UX設計', 'アジャイル'],
    image: '/team/yuki.jpg'
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Head of DAO',
    bio: 'Web3とブロックチェーン技術の専門家。分散型組織の設計と運営において豊富な経験。',
    expertise: ['ブロックチェーン', 'DAO設計', 'トークノミクス'],
    image: '/team/marcus.jpg'
  }
]

// 会社の価値観
const values = [
  {
    title: '自動化による解放',
    description: '人間は創造的な仕事に集中し、反復的なタスクは自動化によって解決する',
    icon: '🤖'
  },
  {
    title: 'コミュニティ主導',
    description: 'DAOによる分散型意思決定で、より民主的で透明性のある組織を実現',
    icon: '🌐'
  },
  {
    title: '公正な価値分配',
    description: '貢献に応じた公正な収益分配で、全ての参加者が恩恵を受ける',
    icon: '⚖️'
  },
  {
    title: '持続可能な成長',
    description: '短期的な利益よりも長期的で持続可能な成長を重視',
    icon: '🌱'
  }
]

// マイルストーン
const milestones = [
  {
    date: '2024年1月',
    title: 'Unson OS構想開始',
    description: 'AIによるSaaS自動生成の可能性を探求開始'
  },
  {
    date: '2024年3月',
    title: 'プロトタイプ完成',
    description: '最初の自動生成SaaSプロトタイプが24時間で完成'
  },
  {
    date: '2024年5月',
    title: 'DAO設立',
    description: 'コミュニティ主導の分散型組織として正式にスタート'
  },
  {
    date: '2024年7月',
    title: 'βプラットフォーム公開',
    description: '限定メンバー向けにプラットフォームのβ版を公開'
  },
  {
    date: '2024年Q4',
    title: '正式ローンチ',
    description: '一般公開とエコシステムの本格運用開始（予定）'
  }
]

// 統計情報
const statistics = [
  { label: '創設年', value: '2024' },
  { label: 'チームメンバー', value: '25+' },
  { label: '対応言語', value: '12' },
  { label: '本社所在地', value: '東京' }
]

export default function AboutPage() {
  
  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container-custom">
          <div className="text-center animate-fade-in">
            <h1 className="heading-primary text-gray-900 mb-6">
              Unson OSについて
              <span className="block text-indigo-600 mt-2">
                SaaS開発の未来を創造
              </span>
            </h1>
            <p className="text-large max-w-4xl mx-auto mb-8">
              私たちは「Company-as-a-Product」というビジョンのもと、
              AIとDAOの力を組み合わせて、100-200個のマイクロSaaSプロダクトを
              24-48時間で自動生成する革新的なプラットフォームを開発しています。
            </p>
          </div>
        </div>
      </section>

      {/* ミッションとビジョン */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="heading-secondary mb-6">
                私たちのミッション
              </h2>
              <p className="text-large text-gray-600 mb-6">
                <strong className="text-gray-900">「破壊すべき思い込みを発見し、自動化で解決する」</strong>
              </p>
              <p className="text-gray-600 mb-4">
                従来のSaaS開発には数ヶ月から数年の期間が必要でした。
                しかし、私たちは大部分のプロセスを自動化することで、
                アイデアからローンチまでを24-48時間に短縮できると信じています。
              </p>
              <p className="text-gray-600">
                この革新により、より多くの課題が解決され、
                より多くの人々がビジネス創造に参加できる世界を実現します。
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">ビジョン</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-blue-600 mr-3">🎯</span>
                  <div>
                    <div className="font-medium text-gray-900">2030年まで</div>
                    <div className="text-gray-600 text-sm">10,000個のマイクロSaaSを自動生成</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-600 mr-3">🌍</span>
                  <div>
                    <div className="font-medium text-gray-900">グローバル展開</div>
                    <div className="text-gray-600 text-sm">50カ国以上での利用実現</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-purple-600 mr-3">👥</span>
                  <div>
                    <div className="font-medium text-gray-900">コミュニティ拡大</div>
                    <div className="text-gray-600 text-sm">100,000人のDAOメンバー</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 価値観 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              私たちの価値観
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              Unson OSを支える4つの核となる価値観
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* チーム */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              創設チーム
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              多様なバックグラウンドを持つエキスパートが集結
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="card text-center hover:shadow-lg transition-shadow duration-200">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {member.name.split(' ').map(n => n.charAt(0)).join('')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <div className="text-blue-600 text-sm font-medium mb-3">
                  {member.role}
                </div>
                <p className="text-gray-600 text-xs mb-4">
                  {member.bio}
                </p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {member.expertise.map((skill, skillIndex) => (
                    <span key={skillIndex} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* タイムライン */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              創業ストーリー
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              Unson OSの歩みと今後の展望
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex">
                  <div className="flex flex-col items-center mr-6">
                    <div className={`w-4 h-4 rounded-full ${index < 4 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    {index < milestones.length - 1 && (
                      <div className={`w-0.5 h-16 ${index < 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="text-sm text-blue-600 font-medium mb-1">
                      {milestone.date}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 統計情報 */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {statistics.map((stat, index) => (
              <div key={index} className="animate-fade-in">
                <div className="text-3xl font-bold text-indigo-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
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
              技術スタック
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              最新技術を活用した堅牢なプラットフォーム
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-3xl mb-4">🧠</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">AI/ML</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div>OpenAI GPT-4</div>
                <div>TensorFlow</div>
                <div>PyTorch</div>
                <div>LangChain</div>
              </div>
            </div>
            
            <div className="card text-center">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">バックエンド</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Node.js</div>
                <div>Python</div>
                <div>Docker/Kubernetes</div>
                <div>AWS/GCP</div>
              </div>
            </div>
            
            <div className="card text-center">
              <div className="text-3xl mb-4">🌐</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Web3/DAO</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Ethereum</div>
                <div>Solidity</div>
                <div>IPFS</div>
                <div>Web3.js</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="一緒に未来を創造しませんか？"
        subtitle="Unson OSチームの一員として、SaaS開発の革新に参加してください。"
        actions={[
          { label: 'チームに参加', href: '/careers', variant: 'secondary' as const },
          { label: 'お問い合わせ', href: '/contact' }
        ]}
        backgroundColor="bg-gradient-to-r from-indigo-600 to-purple-600"
        subtitleColor="text-indigo-100"
      />
    </div>
  )
}