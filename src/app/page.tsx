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
              AIが市場の超ニッチなニーズを発見し、特定のペルソナ専用の専門特化型SaaSを2週間サイクルで自動生成。
              営業ゼロで100-200個のマイクロビジネスを同時運営する革新的な自律企業OSです。
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
              <h3 className="text-xl font-semibold mb-3">2週間自動化サイクル</h3>
              <p className="text-gray-600">
                課題検知→LP作成→MVP開発→課金開始を2週間サイクルで実現。AIが超ニッチなニーズを発見し、特定のペルソナ専用SaaSを自動生成。
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
              <h3 className="text-xl font-semibold mb-3">営業ゼロドクトリン</h3>
              <p className="text-gray-600">
                人的な営業組織を一切持たず、マーケティングから顧客サポートまですべてを自動化・コード化。100-200個の小規模ビジネスで分散リスク。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 背景・コンセプトセクション */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-8">
              AI時代の新しい働き方への転換
            </h2>
            <div className="text-center mb-12">
              <p className="text-large mb-6">
                生成AIの圧倒的な進化により、従来の「人間が働いて収益を得る」構造から、
                「AIに働いてもらい、人間は仕組みを構築してその活動から継続的な収益を得る」
                新しいパラダイムへの転換が急務となっています。
              </p>
              <p className="text-gray-600">
                Unson OSは、AIの活動そのものが価値を創出し、その価値から継続的に収益を分配する仕組みを実現。
                AIの進化が人間の雇用を奪うのではなく、新しい形の協働と価値創造を可能にします。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 生成されるSaaS例セクション */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-8">
            生成される専門特化型SaaS例
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            AIが特定の人物像の深いニーズを発見し、その人だけが抱える課題を解決するために設計された
            超専門特化型のアプリケーションです。
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="card">
              <h3 className="text-lg font-semibold mb-3 text-blue-600">
                「週3リモートの30代エンジニア男性向け」恋愛コーチングアプリ
              </h3>
              <p className="text-gray-600 mb-4">
                内向的で技術力は高いが対人関係が苦手という極めて限定的なペルソナ専用。
                技術者の思考パターンに合わせた論理的なアプローチで恋愛スキルを体系化。
              </p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold mb-3 text-green-600">
                「小学生2人を育てる時短勤務ワーママ向け」キャリア再構築サービス
              </h3>
              <p className="text-gray-600 mb-4">
                育児と仕事の狭間で自分のキャリアに悩む特定の状況にある女性のみをターゲット。
                その人生ステージ特有の制約条件下での最適なキャリア戦略を提案。
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
              <div className="text-3xl font-bold text-green-600 mb-2">2週間</div>
              <div className="text-gray-600">自動化サイクル</div>
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
        title="次世代のSaaSエコシステムに参加"
        subtitle="営業ゼロで自動運営される100-200個のマイクロビジネス。AIと人間の新しい協働モデルを共に創造しましょう。"
        actions={[
          { label: 'コミュニティに参加', href: '/community' },
          { label: 'ウェイトリスト登録', href: '/waitlist', variant: 'outline' }
        ]}
      />
    </div>
  )
}