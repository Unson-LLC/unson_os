import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'Python SDK - Unson OS ドキュメント',
  description: 'Unson OS Python SDKの使用方法、API リファレンス、サンプルコード。FastAPI、Django プロジェクトでの実装方法。',
  openGraph: {
    title: 'Python SDK - Unson OS ドキュメント',
    description: 'Unson OS Python SDKの使用方法、API リファレンス、サンプルコード。FastAPI、Django プロジェクトでの実装方法。',
  },
}

// SDK特徴
const sdkFeatures = [
  {
    title: 'Pythonic設計',
    description: 'Pythonらしい直感的なAPIとタイプヒンティング完全対応',
    icon: '🐍'
  },
  {
    title: '非同期対応',
    description: 'async/awaitによる高性能な非同期処理',
    icon: '⚡'
  },
  {
    title: 'フレームワーク対応',
    description: 'FastAPI、Django、Flask、Streamlit などに対応',
    icon: '🛠️'
  },
  {
    title: 'データサイエンス統合',
    description: 'Pandas、NumPy、Matplotlib との組み合わせ',
    icon: '📊'
  }
]

// API クラス
const apiClasses = [
  {
    category: 'Client',
    methods: [
      {
        name: 'UnsonClient',
        description: 'メインクライアントクラス',
        syntax: 'UnsonClient(api_key: str, environment: str = "production")'
      },
      {
        name: 'client.auth',
        description: '認証管理',
        syntax: 'client.auth.login(email: str, password: str) -> User'
      },
      {
        name: 'client.products',
        description: 'プロダクト管理',
        syntax: 'client.products.list(limit: int = 10) -> List[Product]'
      }
    ]
  },
  {
    category: 'Models',
    methods: [
      {
        name: 'Product',
        description: 'プロダクトデータモデル',
        syntax: '@dataclass\nclass Product:\n    id: str\n    name: str\n    mrr: float'
      },
      {
        name: 'User',
        description: 'ユーザーデータモデル',
        syntax: '@dataclass\nclass User:\n    id: str\n    email: str\n    created_at: datetime'
      },
      {
        name: 'Analytics',
        description: 'アナリティクスデータモデル',
        syntax: '@dataclass\nclass Analytics:\n    dau: int\n    mrr: float\n    conversion: float'
      }
    ]
  },
  {
    category: 'Async',
    methods: [
      {
        name: 'AsyncUnsonClient',
        description: '非同期クライアント',
        syntax: 'async with AsyncUnsonClient(api_key) as client:'
      },
      {
        name: 'client.products.alist',
        description: '非同期プロダクト一覧',
        syntax: 'await client.products.alist() -> List[Product]'
      },
      {
        name: 'client.analytics.atrack',
        description: '非同期イベントトラッキング',
        syntax: 'await client.analytics.atrack(event: str, **kwargs)'
      }
    ]
  }
]

// インストール方法
const installationMethods = [
  {
    manager: 'pip',
    command: 'pip install unson-os'
  },
  {
    manager: 'poetry',
    command: 'poetry add unson-os'
  },
  {
    manager: 'pipenv',
    command: 'pipenv install unson-os'
  }
]

export default function PythonSDKPage() {
  const readingTime = '約10分'
  
  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-yellow-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center gap-2 text-sm text-blue-600 mb-4">
              <span>📖 読み時間：{readingTime}</span>
              <span>•</span>
              <span>🔄 最終更新：2025年7月</span>
              <span>•</span>
              <span>📦 バージョン：v1.0.0</span>
            </div>
            <h1 className="heading-primary text-gray-900 mb-6">
              Python SDK
              <span className="block text-blue-600 mt-2">
                unson-os
              </span>
            </h1>
            <p className="text-large text-gray-600 mb-8">
              Unson OS の機能を Python プロジェクトで簡単に利用できる
              公式SDKです。FastAPI、Django、データサイエンス プロジェクトで活用できます。
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
                <a href="#data-science" className="block text-blue-600 hover:text-blue-800 py-1">6. データサイエンス</a>
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
                <li>• <strong>Python</strong>: 3.8以上</li>
                <li>• <strong>依存関係</strong>: httpx, pydantic, typing-extensions</li>
                <li>• <strong>オプション</strong>: aiohttp (非同期サポート)</li>
                <li>• <strong>フレームワーク</strong>: FastAPI, Django 3.2+, Flask 2.0+</li>
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
                  1. 基本的な使用方法
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre><code>{`# Python基本例
import os
from unson_os import UnsonClient

# クライアントの初期化
client = UnsonClient(
    api_key=os.getenv("UNSON_API_KEY"),
    environment="production"  # or "development"
)

# プロダクト一覧の取得
products = client.products.list()
for product in products:
    print(f"{product.name}: MRR ${product.mrr}")

# 新規プロダクト作成
new_product = client.products.create(
    name="新サービス",
    description="革新的なSaaSプロダクト",
    pricing_model="subscription"
)`}</code></pre>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  2. FastAPI での使用例
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre><code>{`# FastAPI統合例
from fastapi import FastAPI, Depends
from unson_os import AsyncUnsonClient
import os

app = FastAPI()

async def get_unson_client():
    async with AsyncUnsonClient(
        api_key=os.getenv("UNSON_API_KEY")
    ) as client:
        yield client

@app.get("/products")
async def get_products(
    client: AsyncUnsonClient = Depends(get_unson_client)
):
    products = await client.products.alist()
    return {"products": products}

@app.post("/analytics/track")
async def track_event(
    event_data: dict,
    client: AsyncUnsonClient = Depends(get_unson_client)
):
    await client.analytics.atrack(
        event="user_action",
        **event_data
    )
    return {"status": "tracked"}`}</code></pre>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  3. 環境変数設定
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre><code>{`# .env ファイル
UNSON_API_KEY=your_api_key_here
UNSON_ENVIRONMENT=production
UNSON_BASE_URL=https://api.unson-os.com

# Python-dotenv使用例
from dotenv import load_dotenv
load_dotenv()

client = UnsonClient(
    api_key=os.getenv("UNSON_API_KEY"),
    environment=os.getenv("UNSON_ENVIRONMENT", "production")
)`}</code></pre>
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
              {apiClasses.map((category, index) => (
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
                          <code className="whitespace-pre-line">{method.syntax}</code>
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
                  🔐 Django 統合
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre><code>{`# Django settings.py
UNSON_CONFIG = {
    'API_KEY': os.environ.get('UNSON_API_KEY'),
    'ENVIRONMENT': 'production'
}

# views.py
from django.http import JsonResponse
from unson_os import UnsonClient
from django.conf import settings

def analytics_view(request):
    client = UnsonClient(**settings.UNSON_CONFIG)
    
    # イベント追跡
    client.analytics.track(
        event="page_view",
        user_id=request.user.id,
        path=request.path
    )
    
    # メトリクス取得
    metrics = client.analytics.get_metrics("product_123")
    
    return JsonResponse({
        'dau': metrics.dau,
        'mrr': metrics.mrr,
        'conversion': metrics.conversion
    })`}</code></pre>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  ⚡ 非同期処理
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre><code>{`# 非同期バッチ処理
import asyncio
from unson_os import AsyncUnsonClient

async def batch_product_update():
    async with AsyncUnsonClient(api_key="...") as client:
        
        # 並列でプロダクト情報を取得
        tasks = []
        product_ids = ["prod_1", "prod_2", "prod_3"]
        
        for product_id in product_ids:
            task = client.products.aget(product_id)
            tasks.append(task)
        
        products = await asyncio.gather(*tasks)
        
        # 並列でメトリクス更新
        update_tasks = []
        for product in products:
            task = client.analytics.atrack(
                event="daily_metrics_update",
                product_id=product.id
            )
            update_tasks.append(task)
        
        await asyncio.gather(*update_tasks)
        print(f"Updated {len(products)} products")

# 実行
asyncio.run(batch_product_update())`}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* データサイエンス */}
      <section id="data-science" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">データサイエンス統合</h2>
            
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📊 Pandas/Matplotlib 連携
              </h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre><code>{`# データ分析例
import pandas as pd
import matplotlib.pyplot as plt
from unson_os import UnsonClient

client = UnsonClient(api_key="...")

# 全プロダクトのメトリクス取得
products = client.products.list()
data = []

for product in products:
    metrics = client.analytics.get_metrics(product.id)
    data.append({
        'name': product.name,
        'mrr': metrics.mrr,
        'dau': metrics.dau,
        'conversion': metrics.conversion,
        'created_at': product.created_at
    })

# DataFrameに変換
df = pd.DataFrame(data)

# 基本統計
print(df.describe())

# MRR分析
df_sorted = df.sort_values('mrr', ascending=False)
top_10 = df_sorted.head(10)

# 可視化
plt.figure(figsize=(12, 6))
plt.bar(top_10['name'], top_10['mrr'])
plt.xticks(rotation=45)
plt.title('Top 10 Products by MRR')
plt.ylabel('MRR ($)')
plt.tight_layout()
plt.show()

# 相関分析
correlation = df[['mrr', 'dau', 'conversion']].corr()
print("相関マトリクス:")
print(correlation)`}</code></pre>
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
                  📦 PyPI パッケージ
                </h3>
                <p className="text-gray-600 mb-4">
                  最新バージョンをpipでインストール
                </p>
                <NavigationLink 
                  href="https://pypi.org/project/unson-os/" 
                  variant="default" 
                  external
                >
                  PyPI で見る
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
                  href="https://github.com/unson-llc/unson-os-sdk-python" 
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
                <NavigationLink href="/docs/sdk/javascript" variant="outline" fullWidth>
                  JavaScript SDK
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
        title="Python で Unson OS を活用しよう"
        subtitle="データサイエンスから Webアプリまで、Python の力で革新的なプロダクトを構築しませんか？"
        actions={[
          { label: '開発を始める', href: '/docs/development/setup' },
          { label: 'API ドキュメント', href: '/docs/api', variant: 'outline' as const }
        ]}
        backgroundColor="bg-gradient-to-r from-blue-600 to-yellow-600"
      />

      {/* ナビゲーション */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <NavigationLink href="/docs/sdk/javascript" variant="outline" size="sm">
                ← JavaScript SDK
              </NavigationLink>
              <NavigationLink href="/docs/sdk/cli" variant="outline" size="sm">
                CLI ツール →
              </NavigationLink>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="/docs/sdk/javascript" className="text-blue-600 hover:text-blue-800">JavaScript SDK</a>
              <span className="text-gray-300">|</span>
              <a href="/docs/sdk/cli" className="text-blue-600 hover:text-blue-800">CLI ツール</a>
              <span className="text-gray-300">|</span>
              <a href="/docs/development/process" className="text-blue-600 hover:text-blue-800">開発プロセス</a>
              <span className="text-gray-300">|</span>
              <a href="/docs" className="text-blue-600 hover:text-blue-800">ドキュメント一覧</a>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <a href="https://github.com/unson-llc/unson-os-sdk-python/edit/main/README.md" className="text-sm text-blue-600 hover:text-blue-800">
                📝 このページを編集
              </a>
              <a href="https://github.com/unson-llc/unson-os-sdk-python/issues/new" className="text-sm text-blue-600 hover:text-blue-800">
                💬 フィードバック
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}