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
      value: '24h',
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
      <section className="section-padding bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container-custom">
          <div className="text-center animate-fade-in">
            <h1 className="heading-primary text-gray-900 mb-6">
              自動生成プロダクト
              <span className="block text-purple-600 mt-2">
                100-200のマイクロSaaS
              </span>
            </h1>
            <p className="text-large max-w-3xl mx-auto mb-8">
              Unson OSが24-48時間で自動生成する革新的なマイクロSaaSプロダクト。
              あらゆる業界の課題を解決する多様なソリューションをご覧ください。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#products-list">
                <Button variant="default" size="lg">
                  プロダクトを探索
                </Button>
              </a>
              <a href="/contact?type=custom-product">
                <Button variant="outline" size="lg">
                  カスタムプロダクト依頼
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
                    <div className="text-lg font-semibold text-gray-900">{product.price}</div>
                    <div className="text-xs text-gray-500">{product.users} ユーザー</div>
                  </div>
                  <div>
                    {product.status === 'active' && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        利用可能
                      </span>
                    )}
                    {product.status === 'beta' && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        ベータ版
                      </span>
                    )}
                    {product.status === 'coming-soon' && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        準備中
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <a href={`/products/${product.id}`} className="flex-1">
                    <Button size="sm" className="w-full">
                      詳細を見る
                    </Button>
                  </a>
                  <a href={`/trial/${product.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      試用開始
                    </Button>
                  </a>
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
              自動プロダクト生成プロセス
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              AIとDAOコミュニティの力を組み合わせた革新的な開発プロセス
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
                24-48時間でフル機能のSaaSプロダクトを自動構築
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
      <section className="section-padding bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container-custom text-center">
          <h2 className="heading-secondary mb-6">
            あなたのアイデアをプロダクトに
          </h2>
          <p className="text-large mb-8 text-purple-100">
            Unson OSでカスタムSaaSプロダクトの開発をリクエストできます
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/contact?type=product-request">
              <Button variant="secondary" size="lg">
                プロダクト開発をリクエスト
              </Button>
            </a>
            <a href="/contact?type=partnership">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600">
                パートナーシップを相談
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}