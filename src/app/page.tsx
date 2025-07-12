// Refactor Phase: ベタ書き・ハードコードを除去
import { WaitlistForm } from '@/components/forms/WaitlistForm'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container-custom">
          <div className="text-center animate-fade-in">
            <h1 className="heading-primary text-gray-900 mb-6">
              Unson OS
              <span className="block text-blue-600 mt-2">
                自動SaaS生成プラットフォーム
              </span>
            </h1>
            <p className="text-large max-w-3xl mx-auto mb-8">
              100-200個のマイクロSaaSプロダクトを自動生成・管理する革新的なシステム。
              DAOコミュニティ主導で24-48時間のプロダクトライフサイクル自動化を実現します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {[
                { label: '無料で始める', href: '/waitlist', variant: 'default' },
                { label: 'デモを見る', href: '/products', variant: 'outline' }
              ].map((action, index) => (
                <NavigationLink
                  key={index}
                  href={action.href}
                  variant={(action.variant as "default" | "outline" | "secondary") || 'default'}
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

      {/* 特徴セクション */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">
            Unson OSの特徴
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card animate-slide-up">
              <div className="text-blue-600 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">高速自動生成</h3>
              <p className="text-gray-600">
                24-48時間でマイクロSaaSプロダクトを自動生成。アイデアから収益化まで最短経路を実現。
              </p>
            </div>
            
            <div className="card animate-slide-up">
              <div className="text-green-600 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">DAOコミュニティ</h3>
              <p className="text-gray-600">
                分散型自律組織による共創。メンバーが収益を共有し、プラットフォームの成長に参加。
              </p>
            </div>
            
            <div className="card animate-slide-up">
              <div className="text-purple-600 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">スケーラブル収益</h3>
              <p className="text-gray-600">
                100-200個の小規模ビジネスで分散リスク。多様な収益源による安定した成長モデル。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ウェイトリストセクション */}
      <section className="section-padding bg-gray-100">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="heading-secondary mb-6">
              ウェイトリストに参加
            </h2>
            <p className="text-large mb-8">
              Unson OSの初期メンバーとして、プラットフォームの構築に参加しませんか？
              限定アルファ版へのアクセスと特別特典をご用意しています。
            </p>
            <div className="max-w-md mx-auto">
              <WaitlistForm />
            </div>
          </div>
        </div>
      </section>

      {/* 統計セクション */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-blue-600 mb-2">100-200</div>
              <div className="text-gray-600">マイクロSaaSプロダクト</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-green-600 mb-2">24-48h</div>
              <div className="text-gray-600">プロダクト生成時間</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-purple-600 mb-2">45-15-40</div>
              <div className="text-gray-600">収益分配モデル (%)</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-orange-600 mb-2">∞</div>
              <div className="text-gray-600">スケーラビリティ</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <CTASection
        title="革新的なSaaSエコシステムに参加"
        subtitle="「Company-as-a-Product」アプローチで、新しいビジネスの未来を共に創造しましょう。"
        actions={[
          { label: '無料で始める', href: '/waitlist' },
          { label: '料金プラン', href: '/pricing', variant: 'outline' }
        ]}
      />
    </div>
  )
}