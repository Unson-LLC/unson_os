import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'CLI ツール - Unson OS ドキュメント',
  description: 'Unson OS CLI ツールの使用方法、コマンドリファレンス、サンプルスクリプト。ターミナルから Unson OS を操作。',
  openGraph: {
    title: 'CLI ツール - Unson OS ドキュメント',
    description: 'Unson OS CLI ツールの使用方法、コマンドリファレンス、サンプルスクリプト。ターミナルから Unson OS を操作。',
  },
}

// CLI特徴
const cliFeatures = [
  {
    title: 'クロスプラットフォーム',
    description: 'Windows、macOS、Linuxで統一されたコマンド体験',
    icon: '🖥️'
  },
  {
    title: '自動補完',
    description: 'Bash、Zsh、PowerShellでのコマンド自動補完対応',
    icon: '⚡'
  },
  {
    title: 'CI/CD統合',
    description: 'GitHub Actions、GitLab CI等での自動化に最適',
    icon: '🔄'
  },
  {
    title: 'JSON出力',
    description: 'スクリプト処理に適したJSON形式での結果出力',
    icon: '📊'
  }
]

// コマンドカテゴリ
const commandCategories = [
  {
    category: 'Authentication',
    commands: [
      {
        name: 'unson auth login',
        description: 'API キーでログイン',
        syntax: 'unson auth login --api-key <key>',
        flags: ['--api-key', '--environment']
      },
      {
        name: 'unson auth status',
        description: '認証状態を確認',
        syntax: 'unson auth status',
        flags: ['--json']
      },
      {
        name: 'unson auth logout',
        description: 'ログアウト',
        syntax: 'unson auth logout',
        flags: []
      }
    ]
  },
  {
    category: 'Products',
    commands: [
      {
        name: 'unson products list',
        description: 'プロダクト一覧表示',
        syntax: 'unson products list [--limit <n>]',
        flags: ['--limit', '--format', '--filter']
      },
      {
        name: 'unson products create',
        description: '新規プロダクト作成',
        syntax: 'unson products create --name <name> --config <file>',
        flags: ['--name', '--config', '--template']
      },
      {
        name: 'unson products deploy',
        description: 'プロダクトデプロイ',
        syntax: 'unson products deploy <product-id> [--env <env>]',
        flags: ['--env', '--watch', '--force']
      }
    ]
  },
  {
    category: 'Analytics',
    commands: [
      {
        name: 'unson analytics dashboard',
        description: 'ダッシュボード表示',
        syntax: 'unson analytics dashboard [--product <id>]',
        flags: ['--product', '--period', '--format']
      },
      {
        name: 'unson analytics track',
        description: 'イベント送信',
        syntax: 'unson analytics track <event> --data <json>',
        flags: ['--data', '--user-id', '--timestamp']
      },
      {
        name: 'unson analytics export',
        description: 'データエクスポート',
        syntax: 'unson analytics export --output <file> [--format <csv|json>]',
        flags: ['--output', '--format', '--date-range']
      }
    ]
  }
]

// インストール方法
const installationMethods = [
  {
    platform: 'macOS',
    manager: 'Homebrew',
    command: 'brew install unson-os/cli/unson',
    alternative: 'curl -fsSL https://get.unson-os.com | bash'
  },
  {
    platform: 'Linux',
    manager: 'Script',
    command: 'curl -fsSL https://get.unson-os.com | bash',
    alternative: 'wget -O- https://get.unson-os.com | bash'
  },
  {
    platform: 'Windows',
    manager: 'PowerShell',
    command: 'iwr https://get.unson-os.com/install.ps1 | iex',
    alternative: 'Download from GitHub Releases'
  },
  {
    platform: 'All',
    manager: 'Node.js',
    command: 'npm install -g @unson-os/cli',
    alternative: 'yarn global add @unson-os/cli'
  }
]

// ワークフロー例
const workflows = [
  {
    title: '新規プロダクト作成フロー',
    description: 'アイデアから本番デプロイまでの完全自動化',
    steps: [
      'unson auth login --api-key $UNSON_API_KEY',
      'unson products create --name "新サービス" --template saas',
      'unson products configure --stripe-key $STRIPE_KEY',
      'unson products deploy --env production --watch'
    ]
  },
  {
    title: 'CI/CD パイプライン',
    description: 'GitHub Actionsでの自動デプロイ設定',
    steps: [
      'unson auth login --api-key ${{ secrets.UNSON_API_KEY }}',
      'unson products test --coverage --junit-output',
      'unson products deploy ${{ github.event.inputs.product_id }}',
      'unson analytics track deployment_success'
    ]
  }
]

export default function CLIPage() {
  const readingTime = '約8分'
  
  return (
    <div className="min-h-screen">
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center items-center gap-2 text-sm text-gray-600 mb-4">
              <span>📖 読み時間：{readingTime}</span>
              <span>•</span>
              <span>🔄 最終更新：2025年7月</span>
              <span>•</span>
              <span>📦 バージョン：v1.0.0</span>
            </div>
            <h1 className="heading-primary text-gray-900 mb-6">
              CLI ツール
              <span className="block text-gray-600 mt-2">
                unson
              </span>
            </h1>
            <p className="text-large text-gray-600 mb-8">
              Unson OS をターミナルから操作できる公式CLIツールです。
              プロダクト管理からデプロイまで、すべてをコマンドラインで実行できます。
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
                <a href="#commands" className="block text-blue-600 hover:text-blue-800 py-1">4. コマンドリファレンス</a>
              </div>
              <div>
                <a href="#workflows" className="block text-blue-600 hover:text-blue-800 py-1">5. ワークフロー例</a>
                <a href="#cicd" className="block text-blue-600 hover:text-blue-800 py-1">6. CI/CD統合</a>
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
              {cliFeatures.map((feature, index) => (
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
            
            <div className="space-y-6">
              {installationMethods.map((method, index) => (
                <div key={index} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {method.platform}
                    </h3>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {method.manager}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">推奨方法</h4>
                      <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                        <code className="text-sm">{method.command}</code>
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                          📋 コピー
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">代替方法</h4>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <code className="text-sm text-gray-600">{method.alternative}</code>
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                          📋 コピー
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                インストール確認
              </h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                <pre><code>{`# バージョン確認
unson --version

# ヘルプ表示
unson --help

# 自動補完設定（Bash）
unson completion bash >> ~/.bashrc

# 自動補完設定（Zsh）
unson completion zsh >> ~/.zshrc`}</code></pre>
              </div>
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
                  1. 認証設定
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre><code>{`# API キーでログイン
unson auth login --api-key YOUR_API_KEY

# 認証状態確認
unson auth status

# 環境変数で設定（推奨）
export UNSON_API_KEY="your_api_key_here"
export UNSON_ENVIRONMENT="production"
unson auth login`}</code></pre>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  2. 基本操作
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre><code>{`# プロダクト一覧表示
unson products list

# 新規プロダクト作成
unson products create \\
  --name "マイアプリ" \\
  --template saas \\
  --config ./app-config.json

# プロダクト詳細表示
unson products show <product-id>

# アナリティクス確認
unson analytics dashboard --product <product-id>`}</code></pre>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  3. 設定ファイル例
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre><code>{`# ~/.unson/config.json
{
  "default_environment": "production",
  "api_key": "your_api_key",
  "output_format": "table",
  "auto_update": true,
  "projects": {
    "default": {
      "product_id": "prod_123",
      "stripe_key": "sk_test_..."
    }
  }
}

# プロジェクト設定例
# ./unson.config.json
{
  "name": "マイSaaS",
  "template": "saas",
  "features": ["auth", "payments", "analytics"],
  "deployment": {
    "platform": "vercel",
    "auto_deploy": true
  }
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* コマンドリファレンス */}
      <section id="commands" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">コマンドリファレンス</h2>
            
            <div className="space-y-8">
              {commandCategories.map((category, index) => (
                <div key={index} className="card">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    {category.category}
                  </h3>
                  <div className="space-y-6">
                    {category.commands.map((command, commandIndex) => (
                      <div key={commandIndex} className="border-l-4 border-gray-500 pl-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {command.name}
                          </h4>
                          <div className="flex gap-1">
                            {command.flags.map((flag, flagIndex) => (
                              <span 
                                key={flagIndex}
                                className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded"
                              >
                                {flag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {command.description}
                        </p>
                        <div className="bg-gray-100 p-3 rounded text-sm">
                          <code>{command.syntax}</code>
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

      {/* ワークフロー例 */}
      <section id="workflows" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">ワークフロー例</h2>
            
            <div className="space-y-8">
              {workflows.map((workflow, index) => (
                <div key={index} className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {workflow.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {workflow.description}
                  </p>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre><code>{workflow.steps.join('\n\n')}</code></pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CI/CD統合 */}
      <section id="cicd" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-secondary mb-8">CI/CD 統合</h2>
            
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  GitHub Actions
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre><code>{`# .github/workflows/deploy.yml
name: Deploy to Unson OS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Unson CLI
        run: |
          curl -fsSL https://get.unson-os.com | bash
          echo "$HOME/.local/bin" >> $GITHUB_PATH
      
      - name: Deploy Product
        env:
          UNSON_API_KEY: \${{ secrets.UNSON_API_KEY }}
        run: |
          unson auth login
          unson products deploy \${{ vars.PRODUCT_ID }} \\
            --env production \\
            --wait-for-deploy`}</code></pre>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Docker 統合
                </h3>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre><code>{`# Dockerfile
FROM node:18-alpine

# Unson CLI インストール
RUN curl -fsSL https://get.unson-os.com | bash

# アプリケーションのセットアップ
COPY . /app
WORKDIR /app

# デプロイスクリプト
RUN echo "#!/bin/sh" > /deploy.sh && \\
    echo "unson auth login" >> /deploy.sh && \\
    echo "unson products deploy \\$PRODUCT_ID" >> /deploy.sh && \\
    chmod +x /deploy.sh

CMD ["/deploy.sh"]`}</code></pre>
                </div>
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
                  📦 パッケージマネージャー
                </h3>
                <p className="text-gray-600 mb-4">
                  お使いのプラットフォームに最適化されたインストール
                </p>
                <NavigationLink 
                  href="https://get.unson-os.com" 
                  variant="default" 
                  external
                >
                  インストールスクリプト
                </NavigationLink>
              </div>
              
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🐙 GitHub Releases
                </h3>
                <p className="text-gray-600 mb-4">
                  バイナリファイル直接ダウンロード、リリースノート
                </p>
                <NavigationLink 
                  href="https://github.com/unson-llc/unson-cli/releases" 
                  variant="outline" 
                  external
                >
                  Releases で見る
                </NavigationLink>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                📚 その他のツール
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <NavigationLink href="/docs/sdk/javascript" variant="outline" fullWidth>
                  JavaScript SDK
                </NavigationLink>
                <NavigationLink href="/docs/sdk/python" variant="outline" fullWidth>
                  Python SDK
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
        title="CLI で開発を効率化しよう"
        subtitle="ターミナルから Unson OS のすべての機能にアクセスして、開発ワークフローを最適化しませんか？"
        actions={[
          { label: '開発を始める', href: '/docs/development/setup' },
          { label: 'API ドキュメント', href: '/docs/api', variant: 'outline' }
        ]}
        backgroundColor="bg-gradient-to-r from-gray-600 to-blue-600"
      />

      {/* ナビゲーション */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <NavigationLink href="/docs/sdk/python" variant="outline" size="sm">
                ← Python SDK
              </NavigationLink>
              <NavigationLink href="/docs/development/process" variant="outline" size="sm">
                開発プロセス →
              </NavigationLink>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="/docs/sdk/javascript" className="text-blue-600 hover:text-blue-800">JavaScript SDK</a>
              <span className="text-gray-300">|</span>
              <a href="/docs/sdk/python" className="text-blue-600 hover:text-blue-800">Python SDK</a>
              <span className="text-gray-300">|</span>
              <a href="/docs/development/process" className="text-blue-600 hover:text-blue-800">開発プロセス</a>
              <span className="text-gray-300">|</span>
              <a href="/docs" className="text-blue-600 hover:text-blue-800">ドキュメント一覧</a>
            </div>
            <div className="mt-6 flex justify-center gap-4">
              <a href="https://github.com/unson-llc/unson-cli/edit/main/README.md" className="text-sm text-blue-600 hover:text-blue-800">
                📝 このページを編集
              </a>
              <a href="https://github.com/unson-llc/unson-cli/issues/new" className="text-sm text-blue-600 hover:text-blue-800">
                💬 フィードバック
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}