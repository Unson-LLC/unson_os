import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'
import { faqCategories } from '@/data/faq'

export const metadata: Metadata = {
  title: 'サポート・FAQ - Unson OS ドキュメント',
  description: 'Unson OS に関するよくある質問と技術サポート情報。トラブルシューティング、DAO参加方法、技術的問題の解決方法を詳しく解説。',
  openGraph: {
    title: 'サポート・FAQ - Unson OS ドキュメント',
    description: 'Unson OS に関するよくある質問と技術サポート情報。トラブルシューティング、DAO参加方法、技術的問題の解決方法を詳しく解説。',
  },
}

// サポートチャンネル情報
const supportChannels = [
  {
    type: 'Discord',
    name: 'コミュニティサポート',
    description: 'リアルタイムでコミュニティメンバーと相談',
    icon: '💬',
    action: {
      label: 'Discord に参加',
      href: '/community'
    },
    features: [
      '24時間コミュニティサポート',
      '日本語・英語対応',
      '#help-qa チャンネル',
      'エキスパートメンバーが回答'
    ]
  },
  {
    type: 'GitHub Issues',
    name: '技術的問題の報告',
    description: 'バグ報告や機能リクエスト',
    icon: '🐛',
    action: {
      label: 'Issue を作成',
      href: 'https://github.com/unson-llc/unson-os/issues/new'
    },
    features: [
      'バグ報告テンプレート',
      '開発チームが直接対応',
      '進捗を GitHub で追跡',
      'コントリビューション歓迎'
    ]
  },
  {
    type: 'Email',
    name: 'ビジネス・投資相談',
    description: '機密性の高い相談やパートナーシップ',
    icon: '📧',
    action: {
      label: 'メール送信',
      href: '/contact?type=business'
    },
    features: [
      '48時間以内に返信',
      'NDA対応可能',
      'パートナーシップ相談',
      '投資・ビジネス提案'
    ]
  }
]

// セルフサービスリソース
const selfServiceResources = [
  {
    title: 'API ドキュメント',
    description: '完全なAPI リファレンスとサンプルコード',
    icon: '📚',
    href: '/docs/api',
    tags: ['API', 'Developer', 'Integration']
  },
  {
    title: 'クイックスタートガイド',
    description: '5分で始める Unson OS の基本的な使い方',
    icon: '🚀',
    href: '/docs/quickstart',
    tags: ['Getting Started', 'Beginner']
  },
  {
    title: 'DAO ガバナンスガイド',
    description: 'DAO参加、投票、収益分配の詳細',
    icon: '🏛️',
    href: '/docs/dao/overview',
    tags: ['DAO', 'Governance', 'Token']
  },
  {
    title: 'システム稼働状況',
    description: 'リアルタイムのサービス稼働状況',
    icon: '📊',
    href: 'https://status.unson-os.com',
    tags: ['Status', 'Uptime', 'Monitoring']
  }
]

// トラブルシューティングガイド
const troubleshootingGuides = [
  {
    problem: 'API キーが認証されない',
    solution: [
      'APIキーが正しく設定されているか確認',
      'Authorization ヘッダーの形式を確認（Bearer YOUR_API_KEY）',
      'APIキーの有効期限をダッシュボードで確認',
      '新しいAPIキーを生成して再試行'
    ],
    code: `curl -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     https://api.unson-os.com/v1/products`
  },
  {
    problem: 'プロダクトが起動しない',
    solution: [
      '必要な環境変数が設定されているか確認',
      'Node.js のバージョンが 18.0.0 以上か確認',
      'ファイアウォール設定でポートが開放されているか確認',
      'ログファイルでエラーメッセージを確認'
    ],
    code: `# 環境確認
node --version
npm --version

# 依存関係の再インストール
rm -rf node_modules package-lock.json
npm install`
  },
  {
    problem: 'ウェイトリスト登録ができない',
    solution: [
      'メールアドレスの形式が正しいか確認',
      '既に登録済みでないか確認',
      'ブラウザのCookieとJavaScriptが有効か確認',
      '別のブラウザまたはシークレットモードで試行'
    ]
  }
]

// サポート統計
const supportStats = [
  { label: '平均回答時間', value: '2時間', description: 'Discord での質問' },
  { label: '解決率', value: '98%', description: '24時間以内' },
  { label: 'コミュニティサポーター', value: '50+', description: 'アクティブメンバー' },
  { label: 'ナレッジベース記事', value: '200+', description: '随時更新' }
]

export default function SupportPage() {
  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full mb-4">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              読了時間: 10分
            </div>
            <h1 className="heading-primary text-gray-900 mb-6">
              Unson OS
              <span className="block text-purple-600 mt-2">
                サポート・FAQ
              </span>
            </h1>
            <p className="text-large text-gray-600 mb-8">
              よくある質問の回答とトラブルシューティングガイド。
              コミュニティサポートで迅速な問題解決をサポートします。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationLink href="/community" variant="default" size="lg">
                Discord で質問する
              </NavigationLink>
              <NavigationLink href="/contact" variant="outline" size="lg">
                お問い合わせ
              </NavigationLink>
            </div>
          </div>
        </div>
      </section>

      {/* サポート統計 */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              サポート実績
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              コミュニティ主導のサポート体制で高い解決率を実現
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {supportStats.map((stat, index) => (
              <div key={index} className="card text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-medium text-gray-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* サポートチャンネル */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              サポートチャンネル
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              問題の種類に応じて最適なサポートチャンネルを選択してください
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {supportChannels.map((channel, index) => (
              <div key={index} className="card">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">{channel.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {channel.name}
                  </h3>
                  <p className="text-gray-600">
                    {channel.description}
                  </p>
                </div>
                
                <div className="space-y-3 mb-6">
                  {channel.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <NavigationLink 
                  href={channel.action.href} 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                >
                  {channel.action.label}
                </NavigationLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* セルフサービスリソース */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              セルフサービスリソース
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              よくある問題は下記のリソースで自己解決できます
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {selfServiceResources.map((resource, index) => (
              <div key={index} className="card">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{resource.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {resource.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {resource.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <NavigationLink href={resource.href} variant="outline" size="sm">
                      詳細を見る
                    </NavigationLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* トラブルシューティングガイド */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              トラブルシューティングガイド
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              よくある技術的問題とその解決方法
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {troubleshootingGuides.map((guide, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🔧 {guide.problem}
                </h3>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    解決手順:
                  </h4>
                  <ol className="space-y-2">
                    {guide.solution.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="w-5 h-5 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                          {stepIndex + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                
                {guide.code && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      コマンド例:
                    </h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-xs overflow-x-auto">
                      {guide.code}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              よくある質問
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              カテゴリ別によくある質問と回答
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {category.title}
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => (
                    <div key={faqIndex} className="card">
                      <h4 className="text-lg font-medium text-gray-900 mb-3">
                        Q. {faq.question}
                      </h4>
                      <p className="text-gray-600">
                        A. {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* まだ解決しない場合 */}
      <section className="section-padding bg-purple-50">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="heading-secondary mb-6">
              まだ解決しませんか？
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600 mb-8">
              お困りの問題が解決しない場合は、コミュニティメンバーや開発チームが直接サポートいたします
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationLink href="/community" variant="default" size="lg">
                Discord でサポートを受ける
              </NavigationLink>
              <NavigationLink href="/contact?type=support" variant="outline" size="lg">
                個別にお問い合わせ
              </NavigationLink>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="コミュニティに参加してサポートを受けよう"
        subtitle="活発なコミュニティで質問・回答を通じて一緒に成長しましょう"
        actions={[
          { label: 'Discord 参加', href: '/community' },
          { label: 'ドキュメント一覧', href: '/docs', variant: 'outline' }
        ]}
        backgroundColor="bg-gradient-to-r from-purple-600 to-blue-600"
      />

      {/* ナビゲーション */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/quickstart" className="text-blue-600 hover:text-blue-800">クイックスタート</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/api" className="text-blue-600 hover:text-blue-800">API リファレンス</a>
            <span className="text-gray-300">|</span>
            <a href="/community" className="text-blue-600 hover:text-blue-800">コミュニティ</a>
            <span className="text-gray-300">|</span>
            <a href="/docs" className="text-blue-600 hover:text-blue-800">ドキュメント一覧</a>
          </div>
        </div>
      </section>
    </div>
  )
}