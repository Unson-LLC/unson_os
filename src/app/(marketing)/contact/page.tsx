import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { contactMethods, offices } from '@/data/company'

export const metadata: Metadata = {
  title: 'お問い合わせ - Unson OS',
  description: 'Unson OSに関するご質問、ご相談、パートナーシップのお問い合わせは、こちらのフォームからご連絡ください。',
  openGraph: {
    title: 'お問い合わせ - Unson OS',
    description: 'Unson OSに関するご質問、ご相談、パートナーシップのお問い合わせは、こちらのフォームからご連絡ください。',
  },
}


interface ContactPageProps {
  searchParams: { type?: string }
}

export default function ContactPage({ searchParams }: ContactPageProps) {
  const defaultType = searchParams.type || ''

  return (
    <div className="min-h-screen">
      <section className="section-padding bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container-custom">
          <div className="text-center animate-fade-in">
            <h1 className="heading-primary text-gray-900 mb-6">
              お問い合わせ
              <span className="block text-indigo-600 mt-2">
                お気軽にご相談ください
              </span>
            </h1>
            <p className="text-large max-w-3xl mx-auto mb-8">
              Unson OSに関するご質問、ご相談、パートナーシップなど、
              どのようなことでもお気軽にお問い合わせください。
              24時間以内にご返信いたします。
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <div key={index} className="card text-center hover:shadow-lg transition-shadow duration-200">
                <div className="text-4xl mb-4">{method.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {method.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                  {method.description}
                </p>
                <a href={method.link} className="text-blue-600 hover:text-blue-800 font-medium">
                  {method.value}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">お問い合わせフォーム</h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              下記フォームにご記入いただければ、担当者よりご連絡いたします
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
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
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    会社名
                  </label>
                  <input
                    type="text"
                    placeholder="株式会社サンプル"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    電話番号
                  </label>
                  <input
                    type="tel"
                    placeholder="03-1234-5678"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  お問い合わせ種別 *
                </label>
                <select 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  required
                  defaultValue={defaultType}
                >
                  <option value="">選択してください</option>
                  <option value="general">一般的なお問い合わせ</option>
                  <option value="technical">技術的なご質問</option>
                  <option value="billing">料金・請求について</option>
                  <option value="custom-product">カスタムプロダクト開発</option>
                  <option value="partnership">パートナーシップ</option>
                  <option value="media">メディア・取材</option>
                  <option value="career">採用・求人</option>
                  <option value="dao">DAO・投資関連</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  お問い合わせ内容 *
                </label>
                <textarea
                  rows={6}
                  placeholder="お問い合わせ内容をできるだけ詳しくお書きください。&#10;&#10;• 現在の課題&#10;• 期待する結果&#10;• 予算・時期などの要件&#10;&#10;などをご記入いただけますと、より適切な回答をご提供できます。"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                ></textarea>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <strong>個人情報の取り扱いについて</strong><br />
                    お預かりした個人情報は、お問い合わせへの回答およびサービス向上のためにのみ使用し、第三者に提供することはありません。
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Button type="submit" size="lg" className="px-12">
                  お問い合わせを送信
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">営業時間・オフィス情報</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">営業時間</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>平日</span>
                  <span>9:00 - 18:00 (JST)</span>
                </div>
                <div className="flex justify-between">
                  <span>土日祝日</span>
                  <span>休業</span>
                </div>
                <div className="pt-2 text-sm text-gray-500">
                  ※緊急時のサポートは24時間対応しております
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">レスポンス時間</h3>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>メール</span>
                  <span>24時間以内</span>
                </div>
                <div className="flex justify-between">
                  <span>チャット</span>
                  <span>即座（営業時間内）</span>
                </div>
                <div className="flex justify-between">
                  <span>電話</span>
                  <span>即座（営業時間内）</span>
                </div>
                <div className="pt-2 text-sm text-gray-500">
                  ※複雑なお問い合わせの場合、回答に数日いただく場合があります
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {offices.map((office, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{office.name}</h3>
                <pre className="text-gray-600 whitespace-pre-line text-sm leading-relaxed">
                  {office.address}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">緊急時のサポート</h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              システム障害や緊急の技術的問題が発生した場合
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto card text-center">
            <div className="text-4xl mb-4">🚨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              24時間緊急サポート
            </h3>
            <p className="text-gray-600 mb-6">
              システム障害、セキュリティインシデント、その他緊急事態の場合は、
              以下の緊急連絡先にご連絡ください。
            </p>
            <div className="space-y-2">
              <div>
                <strong>緊急メール:</strong>
                <a href="mailto:emergency@unson.com" className="text-blue-600 hover:text-blue-800 ml-2">
                  emergency@unson.com
                </a>
              </div>
              <div>
                <strong>緊急電話:</strong>
                <a href="tel:+81-3-1234-9999" className="text-blue-600 hover:text-blue-800 ml-2">
                  +81-3-1234-9999
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container-custom text-center">
          <h2 className="heading-secondary mb-6">
            その他のサポートリソース
          </h2>
          <p className="text-large mb-8 text-indigo-100">
            お問い合わせの前に、こちらもご確認ください
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/support">
              <Button variant="secondary" size="lg">
                よくある質問を見る
              </Button>
            </a>
            <a href="/docs">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-indigo-600">
                ドキュメントを確認
              </Button>
            </a>
            <a href="/community">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-indigo-600">
                コミュニティで質問
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}