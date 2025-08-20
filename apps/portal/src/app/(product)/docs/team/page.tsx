'use client'

import { Button } from '@/components/ui/Button'
import { DocsLayout } from '@/components/layout/DocsLayout'

const teamMembers = [
  {
    name: '佐藤圭吾',
    nameEn: 'Sato Keigo',
    role: '創業者・代表',
    specialization: 'ビジネス戦略、AIビジョン、コンサルティング',
    responsibilities: [
      'Unson OSの戦略的方向性とビジョン策定',
      'DAO構造への移行リード',
      '自己駆動型ビジネスOSコンセプトの監督',
      '2024年9月に合同会社雲孫を設立',
      '2025年6月にUnsonOS構想を開始'
    ],
    icon: '👨‍💼',
    color: 'blue'
  },
  {
    name: '山本力弥',
    nameEn: 'Yamamoto Rikiya',
    role: 'CSO（Chief Strategy Officer）/ ハードウェア・ロボティクス専門家',
    specialization: 'ロボティクス、ハードウェア統合、物理的自動化',
    responsibilities: [
      'ロボティクスとハードウェアの機会評価',
      '物理的自動化の限界に関する洞察提供',
      'ハードウェア・ソフトウェア統合戦略のアドバイス',
      'ロボットシステムの経験から得た専門知識の提供'
    ],
    icon: '🤖',
    color: 'purple'
  },
  {
    name: '倉本',
    nameEn: 'Kuramoto',
    role: '技術プロトタイピングリード',
    specialization: 'プロトタイプ開発、問題発見、技術検証',
    responsibilities: [
      'Unson OSコンポーネントのプロトタイプ構築とテスト',
      '問題発見と検証プロセスのリード',
      'コンセプトとアイデアの技術検証',
      '実装可能性に関する洞察の提供'
    ],
    icon: '🔧',
    color: 'orange'
  }
]

const teamPhilosophy = [
  {
    title: '協働イノベーション',
    description: '個人では達成できない大きなものを共に構築',
    icon: '🤝'
  },
  {
    title: 'オープンな貢献',
    description: '誰もが貢献し、恩恵を受けられるDAOモデルの採用',
    icon: '🌐'
  },
  {
    title: '継続的学習',
    description: 'AIとテクノロジートレンドの最前線に留まる',
    icon: '📚'
  },
  {
    title: '価値創造',
    description: '真に人々を助け、価値を生み出すシステムの構築',
    icon: '💎'
  }
]

const joinAreas = [
  'AIエージェント開発',
  'マイクロサービスアーキテクチャ',
  'ビジネス自動化',
  'コミュニティ構築'
]

export default function TeamPage() {
  return (
    <DocsLayout>
      <section className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container-custom">
          <div className="text-center animate-fade-in">
            <h1 className="heading-primary text-gray-900 mb-6">
              雲孫チーム
              <span className="block text-blue-600 mt-2">
                Unson Team
              </span>
            </h1>
            <p className="text-large max-w-3xl mx-auto mb-8">
              AI時代における新しい働き方を実現する、多様な専門性を持つコアチーム。
              「良い人であること」を原則とし、協働イノベーションを追求しています。
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">
            コアチーム
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start mb-4">
                  <div className={`text-3xl mr-4 p-3 rounded-full ${
                    member.color === 'blue' ? 'bg-blue-100' :
                    member.color === 'purple' ? 'bg-purple-100' :
                    member.color === 'green' ? 'bg-green-100' :
                    'bg-orange-100'
                  }`}>
                    {member.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {member.nameEn}
                    </p>
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      member.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                      member.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                      member.color === 'green' ? 'bg-green-100 text-green-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {member.role}
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">専門分野</h4>
                  <p className="text-gray-600 text-sm">
                    {member.specialization}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">責任範囲</h4>
                  <ul className="space-y-1">
                    {member.responsibilities.map((responsibility, respIndex) => (
                      <li key={respIndex} className="flex items-start text-sm text-gray-600">
                        <div className={`w-1.5 h-1.5 rounded-full mt-2 mr-2 flex-shrink-0 ${
                          member.color === 'blue' ? 'bg-blue-400' :
                          member.color === 'purple' ? 'bg-purple-400' :
                          member.color === 'green' ? 'bg-green-400' :
                          'bg-orange-400'
                        }`}></div>
                        {responsibility}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              チーム哲学
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              「良い人であること」がAI時代における究極の差別化要因であるという原則で運営されています
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamPhilosophy.map((philosophy, index) => (
              <div key={index} className="card text-center hover:shadow-lg transition-shadow duration-200">
                <div className="text-3xl mb-4">
                  {philosophy.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {philosophy.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {philosophy.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="heading-secondary mb-6">
                チームへの参加
              </h2>
              <p className="text-large text-blue-100 mb-8">
                DAO構造への移行に伴い、自己駆動型ビジネスOSを創造するビジョンを共有する貢献者を歓迎します
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  求めている専門分野
                </h3>
                <div className="space-y-2">
                  {joinAreas.map((area, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  貢献方法
                </h3>
                <ul className="space-y-2 text-blue-100">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
                    GitHubでのコード貢献
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
                    アイデアの提案・検証
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
                    ドキュメントの改善
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
                    コミュニティ運営
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg mb-6 text-blue-100">
                雲孫エコシステムには、あなたの居場所があります。<br/>
                自動化されたビジネスオペレーションの未来を共に築きましょう。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/contact?type=join-team">
                  <Button variant="secondary" size="lg">
                    参加を検討する
                  </Button>
                </a>
                <a href="/docs/dao/overview">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                    DAO について詳しく
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DocsLayout>
  )
}