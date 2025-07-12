// Refactor Phase: ベタ書き・ハードコードを除去
import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { WaitlistForm } from '@/components/forms/WaitlistForm'

export const metadata: Metadata = {
  title: 'コミュニティ - Unson OS',
  description: 'Unson OS DAOコミュニティに参加して、SaaS開発の未来を共に創造しましょう。分散型自律組織による革新的な収益分配モデル。',
  openGraph: {
    title: 'コミュニティ - Unson OS',
    description: 'Unson OS DAOコミュニティに参加して、SaaS開発の未来を共に創造しましょう。分散型自律組織による革新的な収益分配モデル。',
  },
}

// サンプルメンバーデータ
const communityMembers = [
  {
    id: 1,
    name: '田中 健太',
    role: 'Core Developer',
    avatar: '/avatars/tanaka.jpg',
    contribution: 'Platform Architecture',
    joinedDate: '2024年3月',
    projects: 12,
    tokens: '2,450 UNS'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    role: 'Product Designer',
    avatar: '/avatars/sarah.jpg',
    contribution: 'UX/UI Design',
    joinedDate: '2024年4月',
    projects: 8,
    tokens: '1,890 UNS'
  },
  {
    id: 3,
    name: '山田 美咲',
    role: 'Growth Marketer',
    avatar: '/avatars/yamada.jpg',
    contribution: 'Community Growth',
    joinedDate: '2024年2月',
    projects: 15,
    tokens: '3,210 UNS'
  },
  {
    id: 4,
    name: 'Alex Chen',
    role: 'AI Engineer',
    avatar: '/avatars/alex.jpg',
    contribution: 'Auto-generation System',
    joinedDate: '2024年1月',
    projects: 6,
    tokens: '1,650 UNS'
  }
]

const daoCapabilities = [
  {
    title: 'プロダクト提案',
    description: '新しいSaaSアイデアを提案し、コミュニティの投票で開発決定',
    icon: '💡',
    privilege: 'All Members'
  },
  {
    title: '開発参加',
    description: 'スキルに応じて実際のプロダクト開発に参加',
    icon: '⚡',
    privilege: 'Developers'
  },
  {
    title: '収益分配',
    description: 'プロダクトの成功に応じて自動的に収益を受け取る',
    icon: '💰',
    privilege: 'All Contributors'
  },
  {
    title: 'ガバナンス投票',
    description: 'プラットフォームの重要な決定に投票で参加',
    icon: '🗳️',
    privilege: 'Token Holders'
  },
  {
    title: 'メンタリング',
    description: '新しいメンバーのサポートとスキルシェア',
    icon: '🎓',
    privilege: 'Senior Members'
  },
  {
    title: 'リーダーシップ',
    description: 'プロジェクトチームのリードとマネジメント',
    icon: '👑',
    privilege: 'Core Team'
  }
]

const revenueSharing = [
  {
    category: 'プロダクト開発者',
    percentage: 45,
    description: 'アイデア提案、設計、実装を行ったメンバー',
    color: 'blue'
  },
  {
    category: 'プラットフォーム維持',
    percentage: 15,
    description: 'Unson OSインフラとシステムの維持・改善',
    color: 'green'
  },
  {
    category: 'コミュニティ貢献',
    percentage: 40,
    description: 'マーケティング、サポート、成長促進活動',
    color: 'purple'
  }
]

export default function CommunityPage() {
  
  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container-custom">
          <div className="text-center animate-fade-in">
            <h1 className="heading-primary text-gray-900 mb-6">
              Unson OS
              <span className="block text-green-600 mt-2">
                DAOコミュニティ
              </span>
            </h1>
            <p className="text-large max-w-3xl mx-auto mb-8">
              分散型自律組織（DAO）として運営されるUnson OSコミュニティ。
              共に創造し、共に成長し、共に収益を分かち合う新しい働き方を実現します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {[
                { label: 'コミュニティ参加', href: '/waitlist', variant: 'default' as const },
                { label: 'DAO詳細', href: '/docs/dao/overview', variant: 'outline' as const }
              ].map((action, index) => (
                <NavigationLink
                  key={index}
                  href={action.href}
                  variant={action.variant}
                  size="lg"
                  external={(action as any).external || false}
                >
                  {action.label}
                </NavigationLink>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 統計セクション */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-green-600 mb-2">1,250</div>
              <div className="text-gray-600">アクティブメンバー</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-blue-600 mb-2">127</div>
              <div className="text-gray-600">開発プロジェクト</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-purple-600 mb-2">¥2.5M</div>
              <div className="text-gray-600">月間分配収益</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-orange-600 mb-2">45</div>
              <div className="text-gray-600">国・地域</div>
            </div>
          </div>
        </div>
      </section>

      {/* DAOの機能 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              DAOメンバーができること
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              スキルと貢献度に応じて、様々な権限と特典を得ることができます
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {daoCapabilities.map((capability, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="text-3xl mb-4">{capability.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {capability.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {capability.description}
                </p>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {capability.privilege}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 収益分配モデル */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              45-15-40 収益分配モデル
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              透明性のある自動分配システムで公正な収益シェア
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {revenueSharing.map((model, index) => (
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
                <p className="text-gray-600">
                  {model.description}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
              自動分配の仕組み
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="text-center">
                <div className="font-medium text-blue-600 mb-1">リアルタイム計算</div>
                <div>プロダクトの収益を即座に分配対象者に計算</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-green-600 mb-1">スマートコントラクト</div>
                <div>ブロックチェーンによる自動実行と透明性</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-purple-600 mb-1">月次分配</div>
                <div>毎月自動的にウォレットに収益が分配</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* コミュニティメンバー */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              コアメンバー紹介
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              Unson OSを支える多様なバックグラウンドのメンバーたち
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communityMembers.map((member) => (
              <div key={member.id} className="card text-center hover:shadow-lg transition-shadow duration-200">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <div className="text-blue-600 text-sm font-medium mb-2">
                  {member.role}
                </div>
                <div className="text-gray-600 text-xs mb-3">
                  {member.contribution}
                </div>
                <div className="space-y-1 text-xs text-gray-500">
                  <div>参加: {member.joinedDate}</div>
                  <div>プロジェクト: {member.projects}件</div>
                  <div className="font-medium text-green-600">{member.tokens}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 参加方法 */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              コミュニティ参加の流れ
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              簡単3ステップでUnson OSコミュニティの一員になろう
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-3">ウェイトリスト登録</h3>
              <p className="text-gray-600 text-sm">
                まずはウェイトリストに登録してコミュニティ情報をキャッチアップ
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-3">Discord参加</h3>
              <p className="text-gray-600 text-sm">
                Discordコミュニティに参加してメンバーと交流、プロジェクトを知る
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-3">貢献開始</h3>
              <p className="text-gray-600 text-sm">
                スキルに合わせてプロジェクトに貢献し、トークンを獲得
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ウェイトリスト */}
      <section className="section-padding bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="heading-secondary mb-6">
              コミュニティに参加する
            </h2>
            <p className="text-large mb-8 text-green-100">
              一緒にSaaS開発の未来を創造し、新しい働き方を実現しませんか？
            </p>
            <div className="max-w-md mx-auto">
              <WaitlistForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}