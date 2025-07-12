import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'ダウンロード - Unson OS ドキュメント',
  description: 'Unson OS SDK、CLI、VS Code拡張機能などの開発ツールをダウンロード。JavaScript、Python、各種プラットフォーム対応。',
  openGraph: {
    title: 'ダウンロード - Unson OS ドキュメント',
    description: 'Unson OS SDK、CLI、VS Code拡張機能などの開発ツールをダウンロード。JavaScript、Python、各種プラットフォーム対応。',
  },
}

// SDK・ツール情報
const sdkTools = [
  {
    id: 'javascript-sdk',
    name: 'Unson SDK (JavaScript)',
    description: 'Node.js/ブラウザ向けSDK。TypeScript完全対応で、型安全なAPI開発を実現。',
    version: 'v2.1.0',
    language: 'JavaScript',
    platforms: ['Node.js 16+', 'ブラウザ (ES2020+)', 'TypeScript 4.5+'],
    downloadUrl: '/downloads/unson-javascript-sdk-2.1.0.zip',
    documentationUrl: '/docs/sdk/javascript',
    githubUrl: 'https://github.com/unson/unson-js-sdk',
    features: [
      'TypeScript型定義付属',
      'Promise/async-await対応',
      'リアルタイムAPI対応',
      'エラーハンドリング強化'
    ],
    installCommand: 'npm install @unson/sdk',
    icon: '📦',
    color: 'yellow'
  },
  {
    id: 'python-sdk',
    name: 'Unson SDK (Python)',
    description: 'Python 3.8以降対応。データ分析・機械学習プロジェクトに最適化。',
    version: 'v1.8.2',
    language: 'Python',
    platforms: ['Python 3.8+', 'Django 3.2+', 'FastAPI 0.68+'],
    downloadUrl: '/downloads/unson-python-sdk-1.8.2.tar.gz',
    documentationUrl: '/docs/sdk/python',
    githubUrl: 'https://github.com/unson/unson-python-sdk',
    features: [
      'asyncio対応',
      'Pydantic統合',
      'データクラス自動生成',
      'Jupyter Notebook対応'
    ],
    installCommand: 'pip install unson-sdk',
    icon: '🐍',
    color: 'green'
  },
  {
    id: 'cli',
    name: 'Unson CLI',
    description: 'コマンドライン開発ツール。プロジェクト生成・デプロイ・管理を統合。',
    version: 'v1.5.1',
    language: 'CLI',
    platforms: ['Windows 10+', 'macOS 11+', 'Linux (Ubuntu 20.04+)'],
    downloadUrl: '/downloads/unson-cli-1.5.1',
    documentationUrl: '/docs/tools/cli',
    githubUrl: 'https://github.com/unson/unson-cli',
    features: [
      'プロジェクトスキャフォールディング',
      '自動デプロイメント',
      'ローカル開発サーバー',
      'テンプレート管理'
    ],
    installCommand: 'curl -sSL https://install.unson.com/cli | bash',
    icon: '⚡',
    color: 'blue'
  },
  {
    id: 'vscode-extension',
    name: 'VS Code拡張',
    description: 'Visual Studio Code統合拡張機能。AI支援コード生成とデバッグ機能。',
    version: 'v1.2.0',
    language: 'Extension',
    platforms: ['VS Code 1.70+', 'VS Code Insiders'],
    downloadUrl: '/downloads/unson-vscode-1.2.0.vsix',
    documentationUrl: '/docs/tools/vscode',
    githubUrl: 'https://github.com/unson/unson-vscode',
    features: [
      'AI コード生成',
      'リアルタイムプレビュー',
      'デバッグ支援',
      'テンプレートスニペット'
    ],
    installCommand: 'marketplace: Unson OS Extension',
    icon: '🔧',
    color: 'purple'
  }
]

// 追加ツール
const additionalTools = [
  {
    name: 'Docker Images',
    description: '本番環境対応のDockerイメージ',
    items: [
      { name: 'unson/api', version: 'v2.1.0', size: '45MB' },
      { name: 'unson/worker', version: 'v2.1.0', size: '38MB' },
      { name: 'unson/dashboard', version: 'v2.1.0', size: '52MB' }
    ],
    icon: '🐳'
  },
  {
    name: 'Helm Charts',
    description: 'Kubernetes デプロイメント用',
    items: [
      { name: 'unson-platform', version: 'v1.3.0', size: '2.3MB' },
      { name: 'unson-monitoring', version: 'v1.3.0', size: '1.8MB' }
    ],
    icon: '☸️'
  },
  {
    name: 'Terraform Modules',
    description: 'Infrastructure as Code',
    items: [
      { name: 'aws-unson-platform', version: 'v1.1.0', size: '156KB' },
      { name: 'gcp-unson-platform', version: 'v1.1.0', size: '142KB' }
    ],
    icon: '🏗️'
  }
]

// システム要件
const systemRequirements = {
  minimum: {
    os: 'Windows 10, macOS 11, Ubuntu 20.04',
    memory: '4GB RAM',
    storage: '2GB 空き容量',
    network: 'インターネット接続必須'
  },
  recommended: {
    os: 'Windows 11, macOS 13, Ubuntu 22.04',
    memory: '8GB RAM',
    storage: '10GB 空き容量',
    network: '高速インターネット接続'
  }
}

// 読み時間の計算（概算）
const readingTime = 6

export default function DownloadsPage() {
  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-primary text-gray-900 mb-6">
              Unson OS 
              <span className="block text-gradient bg-gradient-to-r from-blue-600 to-indigo-600">
                開発ツール ダウンロード
              </span>
            </h1>
            <div className="flex justify-center items-center gap-4 text-sm text-gray-600 mb-6">
              <span>📖 読み時間: 約{readingTime}分</span>
              <span>•</span>
              <span>🏷️ SDK・開発ツール</span>
              <span>•</span>
              <span>📅 最終更新: 2024年12月</span>
            </div>
            <p className="text-large max-w-3xl mx-auto mb-8">
              JavaScript・Python SDK、CLI、VS Code拡張機能など、Unson OS開発に必要なツールを提供。
              型安全で高性能な開発環境を構築できます。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationLink 
                href="#sdk-tools" 
                variant="default"
                size="lg"
              >
                SDK・ツール一覧
              </NavigationLink>
              <NavigationLink 
                href="#quick-start" 
                variant="outline"
                size="lg"
              >
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4">目次</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <a href="#sdk-tools" className="block py-2 text-blue-600 hover:text-blue-800">1. SDK・開発ツール</a>
                <a href="#additional-tools" className="block py-2 text-blue-600 hover:text-blue-800">2. 追加ツール・リソース</a>
                <a href="#system-requirements" className="block py-2 text-blue-600 hover:text-blue-800">3. システム要件</a>
                <a href="#quick-start" className="block py-2 text-blue-600 hover:text-blue-800">4. クイックスタートガイド</a>
              </div>
              <div>
                <a href="#installation" className="block py-2 text-blue-600 hover:text-blue-800">5. インストール手順</a>
                <a href="#migration" className="block py-2 text-blue-600 hover:text-blue-800">6. マイグレーションガイド</a>
                <a href="#troubleshooting" className="block py-2 text-blue-600 hover:text-blue-800">7. トラブルシューティング</a>
                <a href="#support" className="block py-2 text-blue-600 hover:text-blue-800">8. サポート・コミュニティ</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SDK・開発ツール */}
      <section id="sdk-tools" className="section-padding">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              SDK・開発ツール
            </h2>
            
            <div className="grid gap-8">
              {sdkTools.map((tool, index) => (
                <div key={index} className={`card border-l-4 border-${tool.color}-500`}>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <span className="text-3xl mr-4">{tool.icon}</span>
                        <div>
                          <h3 className="text-2xl font-semibold text-gray-900">{tool.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className={`px-2 py-1 bg-${tool.color}-100 text-${tool.color}-700 rounded-full`}>
                              {tool.version}
                            </span>
                            <span>{tool.language}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{tool.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">対応プラットフォーム</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {tool.platforms.map((platform, platformIndex) => (
                              <li key={platformIndex} className="flex items-center">
                                <span className="text-green-500 mr-2">✓</span>
                                {platform}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">主な機能</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {tool.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-center">
                                <span className="text-blue-500 mr-2">•</span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">インストールコマンド</h4>
                        <code className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">
                          {tool.installCommand}
                        </code>
                      </div>
                    </div>
                    
                    <div className="lg:ml-8 lg:w-64">
                      <div className="space-y-3">
                        <a 
                          href={tool.downloadUrl}
                          className={`block w-full px-6 py-3 bg-${tool.color}-600 text-white text-center rounded-lg hover:bg-${tool.color}-700 transition-colors font-semibold`}
                        >
                          📥 ダウンロード
                        </a>
                        <a 
                          href={tool.documentationUrl}
                          className="block w-full px-6 py-3 bg-gray-100 text-gray-700 text-center rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          📚 ドキュメント
                        </a>
                        <a 
                          href={tool.githubUrl}
                          className="block w-full px-6 py-3 bg-gray-800 text-white text-center rounded-lg hover:bg-gray-900 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          🔗 GitHub
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 追加ツール・リソース */}
      <section id="additional-tools" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              追加ツール・リソース
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {additionalTools.map((toolGroup, index) => (
                <div key={index} className="card">
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{toolGroup.icon}</span>
                    <h3 className="text-xl font-semibold text-gray-900">{toolGroup.name}</h3>
                  </div>
                  <p className="text-gray-700 mb-4">{toolGroup.description}</p>
                  <div className="space-y-3">
                    {toolGroup.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-900">{item.name}</span>
                          <p className="text-sm text-gray-600">{item.version}</p>
                        </div>
                        <span className="text-sm text-gray-500">{item.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* システム要件 */}
      <section id="system-requirements" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              システム要件
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">最小要件</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">OS</span>
                    <span className="font-medium text-gray-900">{systemRequirements.minimum.os}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">メモリ</span>
                    <span className="font-medium text-gray-900">{systemRequirements.minimum.memory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ストレージ</span>
                    <span className="font-medium text-gray-900">{systemRequirements.minimum.storage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ネットワーク</span>
                    <span className="font-medium text-gray-900">{systemRequirements.minimum.network}</span>
                  </div>
                </div>
              </div>
              
              <div className="card bg-green-50 border-l-4 border-green-500">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">推奨要件</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">OS</span>
                    <span className="font-medium text-gray-900">{systemRequirements.recommended.os}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">メモリ</span>
                    <span className="font-medium text-gray-900">{systemRequirements.recommended.memory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ストレージ</span>
                    <span className="font-medium text-gray-900">{systemRequirements.recommended.storage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ネットワーク</span>
                    <span className="font-medium text-gray-900">{systemRequirements.recommended.network}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* クイックスタートガイド */}
      <section id="quick-start" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              クイックスタートガイド
            </h2>
            
            <div className="space-y-8">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1. 環境準備</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm text-gray-700 overflow-x-auto">
{`# Node.js プロジェクトの場合
npm init -y
npm install @unson/sdk

# Python プロジェクトの場合
pip install unson-sdk

# CLI インストール
curl -sSL https://install.unson.com/cli | bash`}
                  </pre>
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">2. 認証設定</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm text-gray-700 overflow-x-auto">
{`# 環境変数設定
export UNSON_API_KEY="your-api-key"
export UNSON_PROJECT_ID="your-project-id"

# または .env ファイル
UNSON_API_KEY=your-api-key
UNSON_PROJECT_ID=your-project-id`}
                  </pre>
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">3. 最初のプロジェクト作成</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm text-gray-700 overflow-x-auto">
{`# CLI でプロジェクト作成
unson create my-saas-app
cd my-saas-app

# 開発サーバー起動
unson dev

# デプロイ
unson deploy`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* インストール手順 */}
      <section id="installation" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              詳細インストール手順
            </h2>
            
            <div className="grid gap-8">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">JavaScript SDK</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">npm経由（推奨）</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      <code className="text-sm">npm install @unson/sdk</code>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">yarn経由</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      <code className="text-sm">yarn add @unson/sdk</code>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">CDN経由（ブラウザ）</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      <code className="text-sm">{'<script src="https://cdn.unson.com/sdk/v2.1.0/unson.min.js"></script>'}</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">CLI インストール</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Linux/macOS</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      <code className="text-sm">curl -sSL https://install.unson.com/cli | bash</code>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Windows（PowerShell）</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      <code className="text-sm">iwr https://install.unson.com/cli.ps1 | iex</code>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">手動インストール</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      <a href="/downloads/unson-cli-1.5.1" className="text-blue-600 hover:text-blue-800">
                        バイナリをダウンロード
                      </a>
                      してPATHに追加
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* トラブルシューティング */}
      <section id="troubleshooting" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary text-center mb-12">
              トラブルシューティング
            </h2>
            
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  よくある問題と解決方法
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h4 className="font-semibold text-gray-900">インストールエラー</h4>
                    <p className="text-gray-700 text-sm">Node.js/Pythonのバージョンを確認してください。推奨バージョン以上が必要です。</p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-semibold text-gray-900">認証エラー</h4>
                    <p className="text-gray-700 text-sm">API キーが正しく設定されているか、有効期限が切れていないか確認してください。</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-900">接続エラー</h4>
                    <p className="text-gray-700 text-sm">ファイアウォール設定やプロキシ設定をご確認ください。</p>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  サポートリソース
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">ドキュメント</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li><a href="/docs/troubleshooting" className="text-blue-600 hover:text-blue-800">トラブルシューティングガイド</a></li>
                      <li><a href="/docs/faq" className="text-blue-600 hover:text-blue-800">よくある質問（FAQ）</a></li>
                      <li><a href="/docs/api" className="text-blue-600 hover:text-blue-800">API リファレンス</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">コミュニティ</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li><a href="https://discord.gg/unson" className="text-blue-600 hover:text-blue-800">Discord コミュニティ</a></li>
                      <li><a href="https://github.com/unson/discussions" className="text-blue-600 hover:text-blue-800">GitHub Discussions</a></li>
                      <li><a href="/support" className="text-blue-600 hover:text-blue-800">サポートチケット</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="開発を始めましょう"
        subtitle="必要なツールをダウンロードして、Unson OSでマイクロSaaS開発を体験してください。"
        actions={[
          { label: 'CLI をダウンロード', href: '/downloads/unson-cli-1.5.1' },
          { label: 'チュートリアルを見る', href: '/docs/quickstart', variant: 'outline' }
        ]}
        backgroundColor="bg-gradient-to-r from-blue-600 to-indigo-600"
      />

      {/* ナビゲーション */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/security" className="text-blue-600 hover:text-blue-800">← セキュリティガイド</a>
            <span className="text-gray-400">|</span>
            <a href="/docs/quickstart" className="text-blue-600 hover:text-blue-800">クイックスタート →</a>
            <span className="text-gray-400">|</span>
            <a href="/docs" className="text-blue-600 hover:text-blue-800">ドキュメント一覧</a>
          </div>
        </div>
      </section>

      {/* フィードバック・編集 */}
      <section className="py-6 bg-white border-t">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <p className="text-sm text-gray-600">このページは役に立ちましたか？</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors">
                👍 役に立った
              </button>
              <button className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors">
                👎 改善が必要
              </button>
            </div>
            <div className="flex gap-2">
              <a 
                href="https://github.com/unson/unson-os/edit/main/docs/downloads/index.md" 
                className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                📝 編集
              </a>
              <a 
                href="/contact?type=feedback&page=downloads" 
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                💬 フィードバック
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}