// Refactor Phase: ベタ書き・ハードコードを除去
import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { Lightbulb, Zap, DollarSign, Vote, GraduationCap, Crown, AlertTriangle } from 'lucide-react'

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

// アイコンマッピング
const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
  'プロダクト提案': Lightbulb,
  '開発参加': Zap,
  '収益分配': DollarSign,
  'ガバナンス投票': Vote,
  'メンタリング': GraduationCap,
  'リーダーシップ': Crown
}

const daoCapabilities = [
  {
    title: 'プロダクト提案',
    description: '新しいSaaSアイデアを提案し、コミュニティの投票で開発決定',
    privilege: 'All Members'
  },
  {
    title: '開発参加',
    description: 'スキルに応じて実際のプロダクト開発に参加',
    privilege: 'Developers'
  },
  {
    title: '収益分配',
    description: 'プロダクトの成功に応じて自動的に収益を受け取る',
    privilege: 'All Contributors'
  },
  {
    title: 'ガバナンス投票',
    description: 'プラットフォームの重要な決定に投票で参加',
    privilege: 'Token Holders'
  },
  {
    title: 'メンタリング',
    description: '新しいメンバーのサポートとスキルシェア',
    privilege: 'Senior Members'
  },
  {
    title: 'リーダーシップ',
    description: 'プロジェクトチームのリードとマネジメント',
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
      <section className="section-padding bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container-custom">
          <div className="text-center animate-fade-in">
            <h1 className="heading-primary text-white mb-6">
              一緒にUnsonOSを
              <span className="block text-blue-400 mt-2">
                作り上げませんか？
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              このプロジェクトはまだ構想段階です。でも、だからこそ一緒に作り上げる仲間を探しています。
              <br />AIと共に豊かになる未来を、一緒に実現しませんか？
            </p>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 max-w-2xl mx-auto mb-8">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-200 flex-shrink-0 mt-0.5" />
                <p className="text-yellow-200 text-sm">
                  現在は初期メンバー募集段階です。実際の収益分配やDAO機能は2025年後半以降の予定です。
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationLink
                href="https://discord.gg/unsonos"
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-4 text-lg inline-flex items-center"
                size="lg"
                external
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                </svg>
                Discordコミュニティに参加 →
              </NavigationLink>
              <NavigationLink
                href="/docs/dao/overview"
                variant="outline"
                size="lg"
                className="border-gray-300 text-white"
              >
                将来のDAO計画を見る
              </NavigationLink>
            </div>
          </div>
        </div>
      </section>

      {/* 現在の状況セクション */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">現在のプロジェクト状況（構想段階）</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
              <div className="text-gray-600">初期メンバー</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-green-600 mb-2">1</div>
              <div className="text-gray-600">コアプロジェクト</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-purple-600 mb-2">0円</div>
              <div className="text-gray-600">現在の収益（未発生）</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-orange-600 mb-2">2025年</div>
              <div className="text-gray-600">本格稼働目標</div>
            </div>
          </div>
        </div>
      </section>

      {/* DAOの機能 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              将来のDAOメンバーができること（予定）
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              UnsonOS完成後に実現予定の機能です。現在はこれらの仕組みを一緒に設計しています。
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {daoCapabilities.map((capability, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow duration-200">
                {(() => {
                  const Icon = iconMap[capability.title] || Lightbulb
                  return <Icon className="w-12 h-12 mb-4 mx-auto text-blue-600" />
                })()}
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
              将来の45-15-40 収益分配モデル（構想）
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              UnsonOSが実際に収益を生むようになった時の分配モデル構想です。
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
              仮想コアメンバー例
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              将来のUnsonOSで活躍するようなメンバーのイメージ例です。あなたもこの中の一人になれるかもしれません。
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
              現在の参加方法
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              構想段階の今だからこそ、一緒にUnsonOSを作り上げる共創メンバーを募集中
            </p>
          </div>
          
          <div className="grid md:grid-cols-1 max-w-lg mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#5865F2] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Discordコミュニティ参加</h3>
              <p className="text-gray-600 mb-6">
                現在はDiscordでの情報共有とディスカッションが中心。プロダクト設計、技術選定、ビジネスモデル検討などに参加いただけます。
              </p>
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-800 mb-2">参加できること</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• コンセプト設計への意見・提案</li>
                  <li>• 技術アーキテクチャの議論</li>
                  <li>• UI/UXデザインのフィードバック</li>
                  <li>• ビジネスモデルの検討</li>
                  <li>• プロトタイプのテスト参加</li>
                </ul>
              </div>
              <NavigationLink
                href="https://discord.gg/unsonos"
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-3 inline-flex items-center"
                external
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                </svg>
                Discordに参加する →
              </NavigationLink>
            </div>
          </div>
        </div>
      </section>

      {/* 最終CTA */}
      <section className="section-padding bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-secondary mb-6">
              AIの進化を恐れる必要はありません
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              UnsonOSが完成すれば、AIがあなたの代わりに100個のビジネスを運営します。<br />
              一緒にその未来を作り上げませんか？
            </p>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 max-w-2xl mx-auto mb-8">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-200 flex-shrink-0 mt-0.5" />
                <p className="text-yellow-200 text-sm">
                  現在は構想・設計段階です。実際の収益分配は2025年後半以降を予定しています。
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationLink
                href="https://discord.gg/unsonos"
                className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-4 text-lg inline-flex items-center"
                size="lg"
                external
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                </svg>
                共創メンバーとして参加 →
              </NavigationLink>
              <NavigationLink
                href="/docs/dao/overview"
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-gray-900"
              >
                DAOコンセプトを見る
              </NavigationLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}