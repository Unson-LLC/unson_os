import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'JavaScript SDK - Unson OS ドキュメント',
  description: 'Unson OS JavaScript SDKの使用方法、API リファレンス、サンプルコード。Next.js、React プロジェクトでの実装方法。',
  openGraph: {
    title: 'JavaScript SDK - Unson OS ドキュメント',
    description: 'Unson OS JavaScript SDKの使用方法、API リファレンス、サンプルコード。Next.js、React プロジェクトでの実装方法。',
  },
}

// SDK特徴
const sdkFeatures = [
  {
    title: 'TypeScript完全対応',
    description: '型安全性とIntelliSenseによる開発体験の向上',
    icon: '🔷'
  },
  {
    title: 'リアルタイム対応',
    description: 'Convexとの統合によるリアルタイムデータ同期',
    icon: '⚡'
  },
  {
    title: 'フレームワーク対応',
    description: 'Next.js、React、Vue.js、Svelte などに対応',
    icon: '🛠️'
  },
  {
    title: '軽量・高速',
    description: 'Tree-shakingサポート、最小限のバンドルサイズ',
    icon: '🚀'
  }
]

// API メソッド
const apiMethods = [
  {
    category: 'Authentication',
    methods: [
      {
        name: 'auth.login()',
        description: 'ユーザーログイン',
        syntax: 'auth.login(email: string, password: string): Promise<User>'
      },
      {
        name: 'auth.logout()',
        description: 'ユーザーログアウト',
        syntax: 'auth.logout(): Promise<void>'
      },
      {
        name: 'auth.getCurrentUser()',
        description: '現在のユーザー情報取得',
        syntax: 'auth.getCurrentUser(): Promise<User | null>'
      }
    ]
  },
  {
    category: 'Products',
    methods: [
      {
        name: 'products.list()',
        description: 'プロダクト一覧取得',
        syntax: 'products.list(options?: ListOptions): Promise<Product[]>'
      },
      {
        name: 'products.create()',
        description: '新規プロダクト作成',
        syntax: 'products.create(data: CreateProductData): Promise<Product>'
      },
      {
        name: 'products.get()',
        description: '特定プロダクト取得',
        syntax: 'products.get(id: string): Promise<Product>'
      }
    ]
  },
  {
    category: 'Analytics',
    methods: [
      {
        name: 'analytics.track()',
        description: 'イベントトラッキング',
        syntax: 'analytics.track(event: string, properties?: object): Promise<void>'
      },
      {
        name: 'analytics.getMetrics()',
        description: 'メトリクス取得',
        syntax: 'analytics.getMetrics(productId: string): Promise<Metrics>'
      }
    ]
  }
]

// インストール方法
const installationMethods = [
  {
    manager: 'npm',
    command: 'npm install @unson-os/sdk'
  },
  {
    manager: 'yarn',
    command: 'yarn add @unson-os/sdk'
  },
  {
    manager: 'pnpm',
    command: 'pnpm add @unson-os/sdk'
  }
]

export default function JavaScriptSDKPage() {
  const readingTime = '約8分'
  
  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center gap-2 text-sm text-green-600 mb-4">
              <span>📖 読み時間：{readingTime}</span>
              <span>•</span>
              <span>🔄 最終更新：2025年7月</span>
              <span>•</span>
              <span>📦 バージョン：v1.0.0</span>
            </div>
            <h1 className="heading-primary text-gray-900 mb-6">
              JavaScript SDK
              <span className="block text-green-600 mt-2">
                @unson-os/sdk
              </span>
            </h1>
            <p className="text-large text-gray-600 mb-8">
              Unson OS の機能を JavaScript/TypeScript プロジェクトで簡単に利用できる
              公式SDKです。Next.js、React、Vue.js などのフレームワークで活用できます。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationLink href="#installation" variant="default" size="lg">
                インストール
              </NavigationLink>
              <NavigationLink href="#quick-start" variant="outline" size="lg">
                クイックスタート
              </NavigationLink>
            </div>
          </div>
        </div>
      </section>

      {/* 目次 */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">目次</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <a href="#features" className="block text-blue-600 hover:text-blue-800 py-1">1. 主な機能</a>
                <a href="#installation" className="block text-blue-600 hover:text-blue-800 py-1">2. インストール</a>
                <a href="#quick-start" className="block text-blue-600 hover:text-blue-800 py-1">3. クイックスタート</a>
                <a href="#api-reference" className="block text-blue-600 hover:text-blue-800 py-1">4. API リファレンス</a>
              </div>
              <div>
                <a href="#examples" className="block text-blue-600 hover:text-blue-800 py-1">5. 実装例</a>
                <a href="#configuration" className="block text-blue-600 hover:text-blue-800 py-1">6. 設定</a>
                <a href="#troubleshooting" className="block text-blue-600 hover:text-blue-800 py-1">7. トラブルシューティング</a>
                <a href="#download" className="block text-blue-600 hover:text-blue-800 py-1">8. ダウンロード</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 主な機能 */}
      <section id="features" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">主な機能</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {sdkFeatures.map((feature, index) => (
                <div key={index} className="card">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* インストール */}
      <section id="installation" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">インストール</h2>
            
            <div className="card mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                パッケージマネージャー
              </h3>
              <div className="space-y-4">
                {installationMethods.map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">{method.manager}</span>
                      <code className="text-sm bg-gray-200 px-2 py-1 rounded">
                        {method.command}
                      </code>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      📋 コピー
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                システム要件
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Node.js</strong>: 18.17.0 以上</li>
                <li>• <strong>TypeScript</strong>: 4.9.0 以上（オプション）</li>
                <li>• <strong>ブラウザ</strong>: ES2020 対応ブラウザ</li>
                <li>• <strong>フレームワーク</strong>: Next.js 14+, React 18+, Vue 3+, Svelte 4+</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* クイックスタート */}
      <section id="quick-start" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">クイックスタート</h2>
            
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  1. SDK の初期化
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre><code>{`// TypeScript/JavaScript
import { UnsonSDK } from '@unson-os/sdk'

const unson = new UnsonSDK({
  apiKey: process.env.NEXT_PUBLIC_UNSON_API_KEY,
  environment: 'production', // or 'development'
  region: 'us-east-1' // optional
})

export default unson`}</code></pre>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  2. Next.js での使用例
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre><code>{`// app/layout.tsx
import { UnsonProvider } from '@unson-os/sdk/react'
import unson from '@/lib/unson'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <UnsonProvider client={unson}>
          {children}
        </UnsonProvider>
      </body>
    </html>
  )
}`}</code></pre>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  3. コンポーネントでの使用
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre><code>{`// components/ProductList.tsx
import { useUnson } from '@unson-os/sdk/react'
import { useEffect, useState } from 'react'

export function ProductList() {
  const { products } = useUnson()
  const [productList, setProductList] = useState([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await products.list()
        setProductList(data)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      }
    }

    fetchProducts()
  }, [products])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {productList.map((product) => (
        <div key={product.id} className="card">
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-gray-600">{product.description}</p>
          <div className="mt-4">
            <span className="text-sm text-blue-600">
              MRR: ${product.mrr}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API リファレンス */}
      <section id="api-reference" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">API リファレンス</h2>
            
            <div className="space-y-8">
              {apiMethods.map((category, index) => (
                <div key={index} className="card">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    {category.category}
                  </h3>
                  <div className="space-y-4">
                    {category.methods.map((method, methodIndex) => (
                      <div key={methodIndex} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {method.name}
                        </h4>
                        <p className="text-gray-600 text-sm mb-2">
                          {method.description}
                        </p>
                        <div className="bg-gray-100 p-3 rounded text-sm">
                          <code>{method.syntax}</code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 実装例 */}
      <section id="examples" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">実装例</h2>
            
            <div className="space-y-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🔐 ユーザー認証
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre><code>{`// hooks/useAuth.ts
import { useUnson } from '@unson-os/sdk/react'
import { useState, useEffect } from 'react'

export function useAuth() {
  const { auth } = useUnson()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await auth.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [auth])

  const login = async (email: string, password: string) => {
    try {
      const user = await auth.login(email, password)
      setUser(user)
      return user
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await auth.logout()
      setUser(null)
    } catch (error) {
      throw error
    }
  }

  return { user, loading, login, logout }
}`}</code></pre>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📊 アナリティクス
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre><code>{`// components/AnalyticsDashboard.tsx
import { useUnson } from '@unson-os/sdk/react'
import { useEffect, useState } from 'react'

export function AnalyticsDashboard({ productId }: { productId: string }) {
  const { analytics } = useUnson()
  const [metrics, setMetrics] = useState(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await analytics.getMetrics(productId)
        setMetrics(data)
      } catch (error) {
        console.error('Failed to fetch metrics:', error)
      }
    }

    fetchMetrics()
    
    // リアルタイム更新
    const interval = setInterval(fetchMetrics, 30000)
    return () => clearInterval(interval)
  }, [analytics, productId])

  const trackEvent = async (eventName: string, properties = {}) => {
    try {
      await analytics.track(eventName, {
        productId,
        timestamp: Date.now(),
        ...properties
      })
    } catch (error) {
      console.error('Event tracking failed:', error)
    }
  }

  if (!metrics) return <div>Loading...</div>

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="card text-center">
        <div className="text-2xl font-bold text-blue-600">
          {metrics.dau}
        </div>
        <div className="text-sm text-gray-600">DAU</div>
      </div>
      <div className="card text-center">
        <div className="text-2xl font-bold text-green-600">
          {metrics.mrr}
        </div>
        <div className="text-sm text-gray-600">MRR</div>
      </div>
      <div className="card text-center">
        <div className="text-2xl font-bold text-purple-600">
          {metrics.retention}%
        </div>
        <div className="text-sm text-gray-600">継続率</div>
      </div>
      <div className="card text-center">
        <div className="text-2xl font-bold text-orange-600">
          {metrics.conversion}%
        </div>
        <div className="text-sm text-gray-600">転換率</div>
      </div>
    </div>
  )
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 設定 */}
      <section id="configuration" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">設定</h2>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                環境変数
              </h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                <pre><code>{`# .env.local
NEXT_PUBLIC_UNSON_API_KEY=your_api_key_here
NEXT_PUBLIC_UNSON_ENVIRONMENT=production
NEXT_PUBLIC_UNSON_REGION=us-east-1`}</code></pre>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                設定オプション
              </h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre><code>{`interface UnsonSDKConfig {
  apiKey: string
  environment?: 'production' | 'development' | 'staging'
  region?: 'us-east-1' | 'eu-west-1' | 'ap-northeast-1'
  timeout?: number // デフォルト: 30000ms
  retries?: number // デフォルト: 3
  debug?: boolean // デフォルト: false
  baseURL?: string // カスタムエンドポイント
}`}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ダウンロード */}
      <section id="download" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">ダウンロード</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📦 NPM パッケージ
                </h3>
                <p className="text-gray-600 mb-4">
                  最新バージョンをパッケージマネージャーでインストール
                </p>
                <NavigationLink 
                  href="https://www.npmjs.com/package/@unson-os/sdk" 
                  variant="default" 
                  external
                >
                  NPM で見る
                </NavigationLink>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🐙 GitHub リポジトリ
                </h3>
                <p className="text-gray-600 mb-4">
                  ソースコード、イシュー報告、コントリビューション
                </p>
                <NavigationLink 
                  href="https://github.com/unson-llc/unson-os-sdk-js" 
                  variant="outline" 
                  external
                >
                  GitHub で見る
                </NavigationLink>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                📚 その他のSDK
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <NavigationLink href="/docs/sdk/python" variant="outline" fullWidth>
                  Python SDK
                </NavigationLink>
                <NavigationLink href="/docs/sdk/cli" variant="outline" fullWidth>
                  CLI ツール
                </NavigationLink>
                <NavigationLink href="/docs/development/process" variant="outline" fullWidth>
                  開発プロセス
                </NavigationLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="SDK を使ってアプリを構築しよう"
        subtitle="Unson OS の機能を活用して、革新的なプロダクトを作成しませんか？"
        actions={[
          { label: '開発を始める', href: '/docs/development/setup' },
          { label: 'API ドキュメント', href: '/docs/api', variant: 'outline' as const }
        ]}
        backgroundColor="bg-gradient-to-r from-green-600 to-blue-600"
      />

      {/* ナビゲーション */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <NavigationLink href="/docs/sdk" variant="outline" size="sm">
                ← SDK 一覧
              </NavigationLink>
              <NavigationLink href="/docs/sdk/python" variant="outline" size="sm">
                Python SDK →
              </NavigationLink>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="/docs/sdk/python" className="text-blue-600 hover:text-blue-800">Python SDK</a>
              <span className="text-gray-300">|</span>
              <a href="/docs/sdk/cli" className="text-blue-600 hover:text-blue-800">CLI ツール</a>
              <span className="text-gray-300">|</span>
              <a href="/docs/development/process" className="text-blue-600 hover:text-blue-800">開発プロセス</a>
              <span className="text-gray-300">|</span>
              <a href="/docs" className="text-blue-600 hover:text-blue-800">ドキュメント一覧</a>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <a href="https://github.com/unson-llc/unson-os-sdk-js/edit/main/README.md" className="text-sm text-blue-600 hover:text-blue-800">
                📝 このページを編集
              </a>
              <a href="https://github.com/unson-llc/unson-os-sdk-js/issues/new" className="text-sm text-blue-600 hover:text-blue-800">
                💬 フィードバック
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}