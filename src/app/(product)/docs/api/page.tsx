import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'API リファレンス - Unson OS ドキュメント',
  description: 'Unson OS API の完全リファレンス。エンドポイント、認証、レスポンス形式、サンプルコードを詳しく解説。',
  openGraph: {
    title: 'API リファレンス - Unson OS ドキュメント',
    description: 'Unson OS API の完全リファレンス。エンドポイント、認証、レスポンス形式、サンプルコードを詳しく解説。',
  },
}

// 目次データ
const tableOfContents = [
  { id: 'authentication', title: '認証', level: 2 },
  { id: 'base-url', title: 'ベース URL', level: 2 },
  { id: 'rate-limiting', title: 'レート制限', level: 2 },
  { id: 'products-api', title: 'プロダクト API', level: 2 },
  { id: 'get-products', title: 'プロダクト一覧取得', level: 3 },
  { id: 'get-product-detail', title: 'プロダクト詳細取得', level: 3 },
  { id: 'analytics-api', title: 'アナリティクス API', level: 2 },
  { id: 'get-analytics', title: '分析データ取得', level: 3 },
  { id: 'dao-api', title: 'DAO API', level: 2 },
  { id: 'get-governance', title: 'ガバナンス情報取得', level: 3 },
  { id: 'error-codes', title: 'エラーコード', level: 2 },
  { id: 'sdks', title: 'SDK・ライブラリ', level: 2 }
]

// API エンドポイント定義
const apiEndpoints = [
  {
    category: 'プロダクト API',
    endpoints: [
      {
        method: 'GET',
        path: '/api/products',
        title: 'プロダクト一覧取得',
        description: '全プロダクトの一覧を取得します。フィルタリングとページネーションに対応。',
        parameters: [
          { name: 'category', type: 'string', required: false, description: 'カテゴリーでフィルタ' },
          { name: 'page', type: 'number', required: false, description: 'ページ番号（デフォルト: 1）' },
          { name: 'limit', type: 'number', required: false, description: '取得件数（最大: 100）' }
        ],
        response: {
          "products": [
            {
              "id": 1,
              "name": "データ管理ツール",
              "category": "データ管理",
              "description": "効率的なデータ管理とバックアップソリューション",
              "rating": 4.8,
              "users": 1250,
              "price": 2900,
              "status": "active"
            }
          ],
          "pagination": {
            "current_page": 1,
            "total_pages": 10,
            "total_count": 95
          }
        }
      },
      {
        method: 'GET',
        path: '/api/products/{id}',
        title: 'プロダクト詳細取得',
        description: '指定されたプロダクトの詳細情報を取得します。',
        parameters: [
          { name: 'id', type: 'number', required: true, description: 'プロダクトID' }
        ],
        response: {
          "id": 1,
          "name": "データ管理ツール",
          "category": "データ管理",
          "description": "効率的なデータ管理とバックアップソリューション",
          "detailed_description": "高度なデータ管理機能を提供...",
          "features": ["自動バックアップ", "リアルタイム同期", "暗号化"],
          "pricing": {
            "basic": 1000,
            "pro": 2900,
            "enterprise": 9900
          },
          "api_endpoint": "https://api.unson-os.com/v1/data-manager",
          "documentation_url": "https://docs.unson-os.com/data-manager"
        }
      }
    ]
  },
  {
    category: 'アナリティクス API',
    endpoints: [
      {
        method: 'GET',
        path: '/api/analytics/{product_id}',
        title: 'プロダクト分析データ取得',
        description: '指定されたプロダクトの使用統計やパフォーマンスデータを取得します。',
        parameters: [
          { name: 'product_id', type: 'number', required: true, description: 'プロダクトID' },
          { name: 'period', type: 'string', required: false, description: '期間（day, week, month）' }
        ],
        response: {
          "product_id": 1,
          "period": "month",
          "metrics": {
            "active_users": 1250,
            "api_calls": 45000,
            "uptime": 99.9,
            "response_time_avg": 120
          },
          "usage_trends": [
            { "date": "2025-01-01", "users": 1200, "calls": 42000 },
            { "date": "2025-01-02", "users": 1250, "calls": 45000 }
          ]
        }
      }
    ]
  },
  {
    category: 'DAO API',
    endpoints: [
      {
        method: 'GET',
        path: '/api/dao/governance',
        title: 'ガバナンス情報取得',
        description: 'DAO の投票情報、提案一覧、トークン分配状況を取得します。',
        parameters: [
          { name: 'status', type: 'string', required: false, description: '提案状態（active, closed, pending）' }
        ],
        response: {
          "total_supply": 100000000,
          "circulating_supply": 25000000,
          "active_proposals": 3,
          "proposals": [
            {
              "id": 15,
              "title": "新プロダクト開発予算増額",
              "description": "AI画像生成ツールの開発予算を月額50万円に増額",
              "status": "active",
              "votes_for": 1500000,
              "votes_against": 300000,
              "deadline": "2025-01-15T23:59:59Z"
            }
          ]
        }
      }
    ]
  }
]

// エラーコード定義
const errorCodes = [
  { code: 200, message: 'OK', description: 'リクエストが正常に処理されました' },
  { code: 400, message: 'Bad Request', description: 'リクエストが不正です' },
  { code: 401, message: 'Unauthorized', description: 'APIキーが無効または未指定です' },
  { code: 403, message: 'Forbidden', description: 'アクセス権限がありません' },
  { code: 404, message: 'Not Found', description: '指定されたリソースが見つかりません' },
  { code: 429, message: 'Too Many Requests', description: 'レート制限に達しました' },
  { code: 500, message: 'Internal Server Error', description: 'サーバー内部エラーが発生しました' }
]

// SDK一覧
const sdks = [
  {
    name: 'JavaScript SDK',
    description: 'Node.js・ブラウザ対応の公式 JavaScript SDK',
    install: 'npm install @unson-os/sdk-js',
    github: 'https://github.com/unson-llc/sdk-js',
    example: `import { UnsonOS } from '@unson-os/sdk-js'

const client = new UnsonOS({
  apiKey: 'your-api-key'
})

const products = await client.products.list()
console.log(products)`
  },
  {
    name: 'Python SDK',
    description: 'Python 開発者向けの公式 SDK',
    install: 'pip install unson-os',
    github: 'https://github.com/unson-llc/sdk-python',
    example: `from unson_os import UnsonOS

client = UnsonOS(api_key='your-api-key')
products = client.products.list()
print(products)`
  }
]

export default function APIReferencePage() {
  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-4">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              読了時間: 15分
            </div>
            <h1 className="heading-primary text-gray-900 mb-6">
              Unson OS
              <span className="block text-blue-600 mt-2">
                API リファレンス
              </span>
            </h1>
            <p className="text-large text-gray-600 mb-8">
              プロダクト管理、アナリティクス、DAO機能への完全なAPIアクセス。
              RESTful設計で開発者フレンドリーな統合を提供します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationLink href="/docs/quickstart" variant="default" size="lg">
                クイックスタート
              </NavigationLink>
              <NavigationLink href="https://api.unson-os.com" variant="outline" size="lg">
                API エクスプローラー
              </NavigationLink>
            </div>
          </div>
        </div>
      </section>

      <div className="container-custom py-8">
        <div className="flex gap-8">
          {/* サイドバー目次 */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              <div className="card p-4">
                <h3 className="font-semibold text-gray-900 mb-3">目次</h3>
                <nav className="space-y-1">
                  {tableOfContents.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block text-sm text-gray-600 hover:text-blue-600 transition-colors ${
                        item.level === 3 ? 'ml-4' : ''
                      }`}
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* メインコンテンツ */}
          <main className="flex-1 max-w-4xl">
            {/* 基本情報 */}
            <section id="authentication" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">認証</h2>
              <div className="card p-6 mb-6">
                <p className="text-gray-600 mb-4">
                  全てのAPIエンドポイントは認証が必要です。APIキーをHTTPヘッダーに含めてリクエストしてください。
                </p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-md">
                  <pre className="text-sm">
{`curl -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     https://api.unson-os.com/v1/products`}
                  </pre>
                </div>
              </div>

              <div id="base-url" className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">ベース URL</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <code className="text-blue-600">https://api.unson-os.com/v1</code>
                </div>
              </div>

              <div id="rate-limiting" className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">レート制限</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="card p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">1,000</div>
                    <div className="text-sm text-gray-600">リクエスト/時間</div>
                  </div>
                  <div className="card p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">10,000</div>
                    <div className="text-sm text-gray-600">リクエスト/日</div>
                  </div>
                  <div className="card p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">100MB</div>
                    <div className="text-sm text-gray-600">データ転送/月</div>
                  </div>
                </div>
              </div>
            </section>

            {/* API エンドポイント */}
            {apiEndpoints.map((category, categoryIndex) => (
              <section key={categoryIndex} className="mb-12">
                <h2 
                  id={category.category.toLowerCase().replace(/\s+/g, '-') + '-api'}
                  className="text-2xl font-bold text-gray-900 mb-6"
                >
                  {category.category}
                </h2>
                
                {category.endpoints.map((endpoint, endpointIndex) => (
                  <div key={endpointIndex} className="mb-8">
                    <h3 
                      id={endpoint.path.replace(/[{}]/g, '').replace(/\//g, '-').slice(1)}
                      className="text-xl font-semibold text-gray-900 mb-4"
                    >
                      {endpoint.title}
                    </h3>
                    
                    <div className="card p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${
                          endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                          endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                          endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {endpoint.method}
                        </span>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {endpoint.path}
                        </code>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{endpoint.description}</p>
                      
                      {endpoint.parameters.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">パラメータ</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-2">名前</th>
                                  <th className="text-left py-2">型</th>
                                  <th className="text-left py-2">必須</th>
                                  <th className="text-left py-2">説明</th>
                                </tr>
                              </thead>
                              <tbody>
                                {endpoint.parameters.map((param, paramIndex) => (
                                  <tr key={paramIndex} className="border-b">
                                    <td className="py-2">
                                      <code className="text-blue-600">{param.name}</code>
                                    </td>
                                    <td className="py-2 text-gray-600">{param.type}</td>
                                    <td className="py-2">
                                      <span className={`text-xs px-2 py-1 rounded ${
                                        param.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
                                      }`}>
                                        {param.required ? '必須' : '任意'}
                                      </span>
                                    </td>
                                    <td className="py-2 text-gray-600">{param.description}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">レスポンス例</h4>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-xs overflow-x-auto">
                          {JSON.stringify(endpoint.response, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </section>
            ))}

            {/* エラーコード */}
            <section id="error-codes" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">エラーコード</h2>
              <div className="card p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3">コード</th>
                        <th className="text-left py-3">メッセージ</th>
                        <th className="text-left py-3">説明</th>
                      </tr>
                    </thead>
                    <tbody>
                      {errorCodes.map((error, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3">
                            <code className={`text-sm px-2 py-1 rounded ${
                              error.code >= 200 && error.code < 300 ? 'bg-green-100 text-green-800' :
                              error.code >= 400 && error.code < 500 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {error.code}
                            </code>
                          </td>
                          <td className="py-3 font-medium">{error.message}</td>
                          <td className="py-3 text-gray-600">{error.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* SDK・ライブラリ */}
            <section id="sdks" className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">SDK・ライブラリ</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {sdks.map((sdk, index) => (
                  <div key={index} className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {sdk.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{sdk.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">インストール</h4>
                      <code className="bg-gray-100 text-sm px-2 py-1 rounded block">
                        {sdk.install}
                      </code>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">使用例</h4>
                      <pre className="bg-gray-900 text-gray-100 p-3 rounded-md text-xs overflow-x-auto">
                        {sdk.example}
                      </pre>
                    </div>
                    
                    <div className="flex gap-2">
                      <NavigationLink href={sdk.github} variant="outline" size="sm">
                        GitHub
                      </NavigationLink>
                      <NavigationLink href="/docs/quickstart" variant="outline" size="sm">
                        ドキュメント
                      </NavigationLink>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* フィードバック・編集 */}
            <section className="card p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">このページを改善</h3>
              <div className="flex flex-wrap gap-4">
                <NavigationLink 
                  href="https://github.com/unson-llc/unson-os/edit/main/docs/api-reference.md" 
                  variant="outline" 
                  size="sm"
                >
                  📝 このページを編集
                </NavigationLink>
                <NavigationLink 
                  href="/contact?type=feedback&page=api-docs" 
                  variant="outline" 
                  size="sm"
                >
                  💬 フィードバック送信
                </NavigationLink>
                <NavigationLink 
                  href="https://github.com/unson-llc/unson-os/issues/new" 
                  variant="outline" 
                  size="sm"
                >
                  🐛 問題を報告
                </NavigationLink>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* CTA */}
      <CTASection
        title="API を今すぐ試してみましょう"
        subtitle="無料のAPIキーを取得して、Unson OS の強力な機能を体験"
        actions={[
          { label: 'APIキー取得', href: '/waitlist' },
          { label: 'クイックスタート', href: '/docs/quickstart', variant: 'outline' as const }
        ]}
        backgroundColor="bg-gradient-to-r from-blue-600 to-indigo-600"
      />

      {/* ナビゲーション */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/quickstart" className="text-blue-600 hover:text-blue-800">クイックスタート</a>
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