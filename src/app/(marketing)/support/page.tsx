import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { faqCategories } from '@/data/faq'

export const metadata: Metadata = {
  title: 'サポート・FAQ - Unson OS',
  description: 'Unson OSに関するよくある質問、サポート情報、お問い合わせ方法をご確認いただけます。',
  openGraph: {
    title: 'サポート・FAQ - Unson OS',
    description: 'Unson OSに関するよくある質問、サポート情報、お問い合わせ方法をご確認いただけます。',
  },
}


const supportOptions = [
  {
    title: 'メールサポート',
    description: '24時間以内に返信します',
    icon: '📧',
    action: 'メール送信',
    href: 'mailto:support@unson.com'
  },
  {
    title: 'チャットサポート',
    description: '平日9:00-18:00 (JST)',
    icon: '💬',
    action: 'チャット開始',
    href: '#chat'
  },
  {
    title: 'コミュニティフォーラム',
    description: 'ユーザー同士で情報交換',
    icon: '👥',
    action: 'フォーラムへ',
    href: '/community'
  }
]

export default function SupportPage() {
  return (
    <div className="min-h-screen">
      <section className="section-padding bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container-custom">
          <div className="text-center animate-fade-in">
            <h1 className="heading-primary text-gray-900 mb-6">
              サポート・FAQ
              <span className="block text-green-600 mt-2">
                お困りのことがあればお気軽にお問い合わせください
              </span>
            </h1>
            <p className="text-large max-w-3xl mx-auto mb-8">
              よくある質問への回答、サポート情報、お問い合わせ方法をまとめています。
              必要な情報が見つからない場合は、お気軽にお問い合わせください。
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <form className="flex gap-2" onSubmit={(e) => {
              e.preventDefault()
              alert('検索機能は近日実装予定です')
            }}>
              <input
                type="text"
                placeholder="FAQを検索..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button type="submit">検索</Button>
            </form>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">よくある質問</h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              カテゴリ別に整理されたFAQをご確認ください
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="card">
                <div className="flex items-center mb-6">
                  <span className="text-2xl mr-3">{category.icon}</span>
                  <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
                </div>
                
                <div className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => (
                    <details key={faqIndex} className="group" data-testid="faq-item">
                      <summary className="flex items-center justify-between cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        <svg className="w-5 h-5 text-gray-500 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="mt-3 p-3 text-gray-600" data-testid="faq-answer">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">サポートオプション</h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              お客様に最適なサポート方法をお選びください
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {supportOptions.map((option, index) => (
              <div key={index} className="card text-center hover:shadow-lg transition-shadow duration-200">
                <div className="text-4xl mb-4">{option.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {option.title}
                </h3>
                <p className="text-gray-600 mb-6 text-sm">
                  {option.description}
                </p>
                <a href={option.href}>
                  <Button variant="outline" size="sm">
                    {option.action}
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">お問い合わせ</h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              FAQで解決しない場合は、以下のフォームからお問い合わせください
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault()
              alert('お問い合わせを受け付けました。24時間以内にご連絡いたします。')
            }}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    お名前 *
                  </label>
                  <input
                    type="text"
                    placeholder="山田太郎"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    メールアドレス *
                  </label>
                  <input
                    type="email"
                    placeholder="yamada@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  お問い合わせ種別 *
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                  <option value="">選択してください</option>
                  <option value="general">一般的な質問</option>
                  <option value="technical">技術的な問題</option>
                  <option value="billing">料金・請求について</option>
                  <option value="feature">機能要望</option>
                  <option value="dao">DAO・トークンについて</option>
                  <option value="partnership">パートナーシップ</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  お問い合わせ内容 *
                </label>
                <textarea
                  rows={6}
                  placeholder="お問い合わせ内容をできるだけ詳しくお書きください。"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                ></textarea>
              </div>
              
              <div className="text-center">
                <Button type="submit" size="lg">
                  お問い合わせを送信
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="container-custom text-center">
          <h2 className="heading-secondary mb-6">その他のリソース</h2>
          <p className="text-large mb-8 text-blue-100">
            より詳しい情報は以下のリソースをご活用ください
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/docs">
              <Button variant="secondary" size="lg">
                ナレッジベースを見る
              </Button>
            </a>
            <a href="/community">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                コミュニティに参加
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}