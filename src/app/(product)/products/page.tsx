// Refactor Phase: ベタ書き・ハードコードを除去
'use client'

import { Button } from '@/components/ui/Button'
import { products, categories, getProductsByCategory } from '@/data/products'
import { useFilter } from '@/hooks/useFilter'
import { FilterButtons, StatsGrid } from '@/components/interactive'

export default function ProductsPage() {
  // 統計計算関数
  const computeProductStats = (products: any[]) => {
    const totalUsers = products.reduce((sum, product) => {
      const userCount = parseInt(product.users.replace(/[^0-9]/g, ''))
      return sum + userCount
    }, 0)

    const averageRating = products.length > 0 
      ? (products.reduce((sum, product) => sum + product.rating, 0) / products.length).toFixed(1)
      : '0.0'

    return { totalUsers, averageRating }
  }

  // リファクタリング: カスタムフックを使用
  const productFilter = useFilter({
    items: products,
    filterField: 'category',
    defaultFilter: '全て'
  })

  const { filteredItems: filteredProducts, filters, selectedFilter: selectedCategory, setSelectedFilter: setSelectedCategory } = productFilter
  const { totalUsers, averageRating } = computeProductStats(filteredProducts)

  // 統計表示用のデータ
  const statsData = [
    {
      label: selectedCategory === '全て' ? 'アクティブプロダクト' : `${selectedCategory}プロダクト`,
      value: filteredProducts.length,
      color: 'purple' as const
    },
    {
      label: '平均開発時間',
      value: '2週間',
      color: 'blue' as const
    },
    {
      label: '総ユーザー数',
      value: totalUsers > 1000 ? `${Math.floor(totalUsers/1000)}k+` : `${totalUsers}+`,
      color: 'green' as const
    },
    {
      label: '平均レーティング',
      value: `${averageRating}★`,
      color: 'orange' as const
    }
  ]

  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container-custom">
          <div className="text-center animate-fade-in">
            <h1 className="heading-primary text-white mb-6">
              AIが生み出す
              <span className="block text-blue-400 mt-2">
                100個のSaaSビジネス
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              これらは構想段階のプロダクト例です。UnsonOSが完成すれば、
              AIが市場の超ニッチなニーズを発見し、24時間でこのようなSaaSを自動生成します。
            </p>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 max-w-2xl mx-auto mb-8">
              <p className="text-yellow-200 text-sm">
                ⚠️ 注意：以下は将来生成予定のプロダクト例です。現在は構想・設計段階のため、実際には利用できません。
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://discord.gg/unsonos">
                <Button className="bg-[#5865F2] hover:bg-[#4752C4] text-white">
                  💬 Discordで開発状況を確認
                </Button>
              </a>
              <a href="#products-list">
                <Button variant="outline" className="border-gray-300 text-white">
                  プロダクト例を見る
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 統計セクション */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <StatsGrid stats={statsData} />
        </div>
      </section>

      {/* カテゴリフィルター */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <FilterButtons
            filters={filters}
            selectedFilter={selectedCategory}
            onFilterChange={setSelectedCategory}
          />
        </div>
      </section>

      {/* プロダクト一覧 */}
      <section id="products-list" className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {product.name}
                    </h3>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600">{product.rating}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm">
                  {product.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-500">
                      <svg className="w-3 h-3 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">予定価格: {product.price}</div>
                    <div className="text-xs text-gray-500">想定ユーザー: {product.users}</div>
                  </div>
                  <div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      構想段階
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <a href={`/products/${product.id}`} className="flex-1">
                    <Button size="sm" className="w-full">
                      コンセプト詳細
                    </Button>
                  </a>
                  <Button variant="outline" size="sm" className="w-full flex-1" disabled>
                    開発予定
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* プロダクト生成プロセス */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              将来の自動プロダクト生成プロセス（構想）
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              UnsonOS完成後に実現予定の革新的な開発プロセス
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">課題識別</h3>
              <p className="text-sm text-gray-600">
                AIが市場データを分析し、未解決の課題を自動識別
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">設計生成</h3>
              <p className="text-sm text-gray-600">
                自動化システムがソリューション設計とプロトタイプを生成
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">開発実行</h3>
              <p className="text-sm text-gray-600">
                2週間サイクルでフル機能のSaaSプロダクトを自動構築
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">展開・運用</h3>
              <p className="text-sm text-gray-600">
                自動デプロイ、監視、最適化で即座に市場投入
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container-custom text-center">
          <h2 className="heading-secondary mb-6">
            一緒にUnsonOSを作りませんか？
          </h2>
          <p className="text-large mb-8 text-gray-300">
            これらのプロダクトを実現するため、初期メンバーとして開発に参加しませんか？
            アイデア出し、設計、開発、テストなど様々な形で貢献いただけます。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://discord.gg/unsonos">
              <Button className="bg-[#5865F2] hover:bg-[#4752C4] text-white" size="lg">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                </svg>
                共創メンバーとして参加
              </Button>
            </a>
            <a href="/">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
                UnsonOSについて詳しく
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}