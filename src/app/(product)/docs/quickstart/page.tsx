import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'クイックスタートガイド - Unson OS ドキュメント',
  description: 'Unson OSを始めるための5分間クイックスタートガイド。アカウント作成からプロダクト利用開始まで簡単ステップで解説。',
  openGraph: {
    title: 'クイックスタートガイド - Unson OS ドキュメント',
    description: 'Unson OSを始めるための5分間クイックスタートガイド。アカウント作成からプロダクト利用開始まで簡単ステップで解説。',
  },
}

// ステップデータ
const quickstartSteps = [
  {
    step: 1,
    title: 'ウェイトリスト登録',
    description: 'まずはウェイトリストに登録してUnson OSの最新情報を受け取りましょう',
    duration: '30秒',
    actions: [
      'メールアドレスを入力',
      'お名前と職種を選択',
      '「登録」ボタンをクリック'
    ],
    codeExample: null,
    nextStep: 'アカウント作成の招待メールが届きます'
  },
  {
    step: 2,
    title: 'プロダクト探索',
    description: '100個のマイクロSaaSプロダクトから自分に合うものを見つけましょう',
    duration: '2分',
    actions: [
      'プロダクト一覧ページを開く',
      'カテゴリーでフィルタリング',
      '検索機能で特定の機能を探す',
      '気になるプロダクトの詳細を確認'
    ],
    codeExample: null,
    nextStep: '14日間無料トライアルが利用可能です'
  },
  {
    step: 3,
    title: 'Discordコミュニティ参加',
    description: 'DAOコミュニティに参加して最新情報と貢献機会を得ましょう',
    duration: '1分',
    actions: [
      'Discord招待リンクをクリック',
      'プロフィール設定',
      '#introductionで自己紹介',
      'ロール選択（開発者/デザイナー/マーケター等）'
    ],
    codeExample: null,
    nextStep: 'UNSONトークン獲得の機会が得られます'
  },
  {
    step: 4,
    title: 'API統合セットアップ',
    description: '選択したプロダクトをあなたのシステムに統合します',
    duration: '5-15分',
    actions: [
      'APIキーを生成',
      'ドキュメントに従ってエンドポイント設定',
      'テスト呼び出しを実行',
      '本番環境で利用開始'
    ],
    codeExample: {
      title: 'サンプルAPI呼び出し',
      code: `curl -X GET "https://api.unson-os.com/products/1/data" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"

# レスポンス例
{
  "data": {
    "product_id": 1,
    "name": "データ管理ツール",
    "status": "active",
    "usage_stats": {...}
  }
}`
    },
    nextStep: 'リアルタイムでプロダクト分析が確認できます'
  }
]

// 必要なリソース
const requiredResources = [
  {
    title: 'アカウント',
    items: [
      '有効なメールアドレス',
      'GitHub アカウント（開発者の場合）',
      'Discord アカウント（コミュニティ参加）'
    ]
  },
  {
    title: '開発環境',
    items: [
      'Node.js 18.0.0以上',
      'npm または yarn',
      'お好みのコードエディタ'
    ]
  },
  {
    title: '推奨ツール',
    items: [
      'Postman（API テスト用）',
      'VS Code（エディタ）',
      'Git（バージョン管理）'
    ]
  }
]

// よくある質問
const quickstartFAQs = [
  {
    question: 'クイックスタートにどのくらい時間がかかりますか？',
    answer: '基本的なセットアップは5分程度で完了できます。API統合を含む場合は追加で10-15分程度です。'
  },
  {
    question: '技術的なスキルが必要ですか？',
    answer: 'プロダクトの利用自体には技術スキルは不要です。API統合を行う場合は基本的なプログラミング知識があると便利です。'
  },
  {
    question: 'サポートが必要な場合はどうすればよいですか？',
    answer: 'Discordコミュニティの#supportチャンネルで質問いただくか、お問い合わせフォームからご連絡ください。'
  }
]

export default function QuickstartPage() {
  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full mb-4">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              読了時間: 5分
            </div>
            <h1 className="heading-primary text-gray-900 mb-6">
              Unson OS
              <span className="block text-green-600 mt-2">
                クイックスタートガイド
              </span>
            </h1>
            <p className="text-large text-gray-600 mb-8">
              5分で始めるUnson OS。ウェイトリスト登録からプロダクト利用開始まで、
              必要なステップを分かりやすく解説します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationLink href="/products" variant="default" size="lg">
                プロダクト一覧を見る
              </NavigationLink>
              <NavigationLink href="/docs/api" variant="outline" size="lg">
                API ドキュメント
              </NavigationLink>
            </div>
          </div>
        </div>
      </section>

      {/* 必要なもの */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              始める前に準備するもの
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              スムーズに始めるために、以下をご準備ください
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {requiredResources.map((resource, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {resource.title}
                </h3>
                <ul className="space-y-2">
                  {resource.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center gap-2 text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ステップバイステップガイド */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              ステップバイステップガイド
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              4つの簡単なステップで Unson OS を始めましょう
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {quickstartSteps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex flex-col items-center mr-6">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                    {index < quickstartSteps.length - 1 && (
                      <div className="w-0.5 h-24 bg-green-200 mt-4"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 pb-8">
                    <div className="card">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {step.title}
                        </h3>
                        <div className="text-right">
                          <div className="text-sm text-green-600 font-medium">
                            所要時間: {step.duration}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4">
                        {step.description}
                      </p>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          実行手順:
                        </h4>
                        <ol className="space-y-1">
                          {step.actions.map((action, actionIndex) => (
                            <li key={actionIndex} className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      
                      {step.codeExample && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            {step.codeExample.title}:
                          </h4>
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-xs overflow-x-auto">
                            {step.codeExample.code}
                          </pre>
                        </div>
                      )}
                      
                      <div className="text-xs text-blue-600 bg-blue-50 p-3 rounded-md">
                        <strong>次のステップ:</strong> {step.nextStep}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
              クイックスタートに関してよく寄せられる質問
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {quickstartFAQs.map((faq, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Q. {faq.question}
                </h3>
                <p className="text-gray-600">
                  A. {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 次のステップ */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              次に進むための推奨ステップ
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                API ドキュメント
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                詳細な API リファレンスとサンプルコード
              </p>
              <NavigationLink href="/docs/api" variant="outline" size="sm">
                ドキュメントを見る
              </NavigationLink>
            </div>
            
            <div className="card text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                コミュニティサポート
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Discord で質問や最新情報をキャッチアップ
              </p>
              <NavigationLink href="/community" variant="outline" size="sm">
                参加する
              </NavigationLink>
            </div>
            
            <div className="card text-center">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                サポート・FAQ
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                技術的な問題や一般的な質問の回答
              </p>
              <NavigationLink href="/docs/support" variant="outline" size="sm">
                FAQ を見る
              </NavigationLink>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="今すぐ Unson OS を始めましょう"
        subtitle="ウェイトリスト登録で最新情報をいち早くキャッチアップ"
        actions={[
          { label: 'ウェイトリスト登録', href: '/waitlist' },
          { label: 'プロダクト一覧', href: '/products', variant: 'outline' }
        ]}
        backgroundColor="bg-gradient-to-r from-green-600 to-blue-600"
      />

      {/* ナビゲーション */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/api" className="text-blue-600 hover:text-blue-800">API リファレンス</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/support" className="text-blue-600 hover:text-blue-800">サポート・FAQ</a>
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