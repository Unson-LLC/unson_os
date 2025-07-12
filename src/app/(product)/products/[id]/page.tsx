import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { notFound } from 'next/navigation'
import { getProductById, getRelatedProducts } from '@/data/products'

interface ProductPageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = getProductById(parseInt(params.id))
  
  if (!product) {
    return {
      title: 'プロダクトが見つかりません - Unson OS',
      description: '指定されたプロダクトは存在しません。'
    }
  }

  return {
    title: `${product.name} - Unson OS`,
    description: product.description,
    openGraph: {
      title: `${product.name} - Unson OS`,
      description: product.description,
    },
  }
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = getProductById(parseInt(params.id))
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">プロダクトが見つかりません</h1>
          <p className="text-gray-600 mb-8">指定されたプロダクトは存在しません。</p>
          <a href="/products">
            <Button>プロダクト一覧に戻る</Button>
          </a>
        </div>
      </div>
    )
  }

  const relatedProducts = getRelatedProducts(product)

  return (
    <div className="min-h-screen">
      <nav className="py-4 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600">ホーム</a>
            <span>/</span>
            <a href="/products" className="hover:text-blue-600">プロダクト</a>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </nav>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-gray-600">{product.rating}</span>
                  <span className="text-sm text-gray-500">({product.users} ユーザー)</span>
                </div>
              </div>
              
              <h1 className="heading-primary text-gray-900 mb-6">
                {product.name}
              </h1>
              
              <p className="text-large text-gray-600 mb-6">
                {product.description}
              </p>
              
              <p className="text-gray-600 mb-8">
                {product.longDescription}
              </p>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="text-3xl font-bold text-gray-900">{product.price}</div>
                {product.status === 'active' && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                    利用可能
                  </span>
                )}
              </div>
              
              <div className="flex gap-4">
                <a href={`/trial/${product.id}`}>
                  <Button size="lg">無料トライアル開始</Button>
                </a>
                <a href="/contact">
                  <Button variant="outline" size="lg">お問い合わせ</Button>
                </a>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">主な機能</h3>
              <div className="space-y-4">
                {product.detailedFeatures?.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="text-2xl mr-4">{feature.icon}</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">料金プラン</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {product.plans?.map((plan, index) => (
              <div key={index} className={`card ${plan.popular ? 'border-blue-500 ring-2 ring-blue-200' : ''} relative`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 text-sm rounded-full">人気</span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-2xl font-bold text-gray-900 mb-4">{plan.price}</div>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button variant={plan.popular ? 'default' : 'outline'} className="w-full">
                  プランを選択
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">技術仕様</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">API & 統合</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">API仕様:</span>
                  <span className="ml-2 text-gray-600">{product.techSpecs?.api}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">稼働率:</span>
                  <span className="ml-2 text-gray-600">{product.techSpecs?.uptime}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">セキュリティ:</span>
                  <span className="ml-2 text-gray-600">{product.techSpecs?.security}</span>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">対応統合</h3>
              <div className="flex flex-wrap gap-2">
                {product.techSpecs?.integrations?.map((integration, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    {integration}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">ユーザーレビュー</h2>
          
          <div data-testid="user-reviews" className="grid md:grid-cols-2 gap-8">
            {product.reviews?.map((review, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-gray-600 mb-3">"{review.comment}"</p>
                <div className="text-sm font-medium text-gray-900">{review.user}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="section-padding">
          <div className="container-custom">
            <h2 className="heading-secondary text-center mb-12">関連プロダクト</h2>
            
            <div data-testid="related-products" className="grid md:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="card hover:shadow-lg transition-shadow duration-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {relatedProduct.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">{relatedProduct.price}</span>
                    <a href={`/products/${relatedProduct.id}`}>
                      <Button size="sm">詳細を見る</Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}