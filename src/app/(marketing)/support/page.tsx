import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { SupportForm } from '@/components/forms/SupportForm'
import { SupportSearchForm } from '@/components/forms/SupportSearchForm'
import { faqCategories } from '@/data/faq'
import { Mail, MessageCircle, Users } from 'lucide-react'

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
    Icon: Mail,
    action: 'メール送信',
    href: 'mailto:support@unson.com'
  },
  {
    title: 'チャットサポート',
    description: '平日9:00-18:00 (JST)',
    Icon: MessageCircle,
    action: 'チャット開始',
    href: '#chat'
  },
  {
    title: 'コミュニティフォーラム',
    description: 'ユーザー同士で情報交換',
    Icon: Users,
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
            <SupportSearchForm />
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
                <option.Icon className="w-12 h-12 mb-4 mx-auto text-gray-700" />
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
            <SupportForm />
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