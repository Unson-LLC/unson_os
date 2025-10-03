'use client'

import { useState } from 'react'
import { DocsLayout } from '@/components/layout/DocsLayout'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { Accordion } from '@/components/ui/Accordion'

export default function NodeVersionManagementPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(id)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const CodeBlock = ({ children, language = 'bash', id }: { children: string; language?: string; id: string }) => (
    <div className="relative bg-gray-900 rounded-lg p-4 my-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-400 text-sm">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(children, id)}
          className="text-gray-400 hover:text-white"
        >
          {copiedCode === id ? 'コピー済み!' : 'コピー'}
        </Button>
      </div>
      <pre className="text-green-400 text-sm overflow-x-auto">
        <code>{children}</code>
      </pre>
    </div>
  )

  const constraintData = [
    {
      phase: '実行環境',
      environment: 'ビルド/デプロイ',
      platform: 'Vercel CI',
      requirement: 'Node 20 (推奨)',
      impact: '問題なし',
      status: 'success'
    },
    {
      phase: '実行環境',
      environment: 'フロントエンド実行',
      platform: 'Vercel Edge/Functions',
      requirement: 'Node 20',
      impact: '問題なし',
      status: 'success'
    },
    {
      phase: '実行環境',
      environment: 'Node Actions実行(本番)',
      platform: 'Convex Cloud (AWS Lambda)',
      requirement: 'Node 18固定',
      impact: 'Convex側で管理',
      status: 'warning'
    },
    {
      phase: '開発環境',
      environment: 'ローカル開発',
      platform: '開発マシン',
      requirement: 'Node 18必須',
      impact: 'nvm必要',
      status: 'warning'
    }
  ]

  const setupTabs = [
    {
      id: 'nvm-install',
      label: 'nvmインストール',
      content: (
        <div className="space-y-6">
          <div className="card">
            <h4 className="font-semibold text-gray-900 mb-3">macOS/Linux でのインストール</h4>
            <CodeBlock language="bash" id="nvm-install-unix">
{`# nvm インストール
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# シェル再起動 または 設定を再読み込み
source ~/.bashrc  # または ~/.zshrc

# インストール確認
nvm --version`}
            </CodeBlock>
          </div>
          <div className="card">
            <h4 className="font-semibold text-gray-900 mb-3">Windows でのインストール</h4>
            <p className="text-gray-600 mb-3">
              WindowsではGitHubからnvm-windowsをダウンロードしてインストールします。
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>ダウンロードリンク:</strong>{' '}
                <a 
                  href="https://github.com/coreybutler/nvm-windows" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-900"
                >
                  nvm-windows GitHub
                </a>
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'node-versions',
      label: 'Node.jsバージョン',
      content: (
        <div className="space-y-6">
          <div className="card">
            <h4 className="font-semibold text-gray-900 mb-3">必要なバージョンのインストール</h4>
            <CodeBlock language="bash" id="node-install">
{`# Node 18 (Convex用)
nvm install 18.18.0

# Node 20 (Next.js用)  
nvm install 20.10.0

# デフォルトバージョン設定
nvm alias default 20.10.0

# 現在のバージョン確認
nvm current

# インストール済みバージョン一覧
nvm list`}
            </CodeBlock>
          </div>
          <div className="card">
            <h4 className="font-semibold text-gray-900 mb-3">.nvmrc ファイル</h4>
            <p className="text-gray-600 mb-3">
              プロジェクトルートに.nvmrcファイルが作成済みです。
            </p>
            <CodeBlock language="text" id="nvmrc-content">
{`# .nvmrc の内容
18.18.0`}
            </CodeBlock>
            <p className="text-gray-600 text-sm mt-3">
              このファイルにより、プロジェクトで使用するNode.jsバージョンが明確になります。
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'auto-switch',
      label: '自動切替設定',
      content: (
        <div className="space-y-6">
          <div className="card">
            <h4 className="font-semibold text-gray-900 mb-3">シェル設定による自動切替</h4>
            <p className="text-gray-600 mb-3">
              ディレクトリ移動時に自動でNode.jsバージョンを切り替える設定
            </p>
            <CodeBlock language="bash" id="auto-switch-setup">
{`# .zshrc または .bashrc に追加
autoload -U add-zsh-hook
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "$nvmrc_path")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc`}
            </CodeBlock>
          </div>
          <div className="card">
            <h4 className="font-semibold text-gray-900 mb-3">VS Code / Cursor 最適化設定</h4>
            <CodeBlock language="json" id="vscode-settings">
{`// .vscode/settings.json
{
  "terminal.integrated.defaultProfile.osx": "zsh",
  "terminal.integrated.env.osx": {
    "NVM_DIR": "$HOME/.nvm"
  },
  "eslint.nodePath": "\${workspaceFolder}/node_modules",
  "typescript.preferences.includePackageJsonAutoImports": "on"
}`}
            </CodeBlock>
          </div>
        </div>
      )
    }
  ]

  const developmentFlows = [
    {
      title: 'オプション1: npm scripts使用（推奨）',
      description: '自動バージョン切替機能付きの開発スクリプト',
      commands: [
        '# Convex開発（Node 18に自動切替）',
        'npm run dev:convex',
        '',
        '# Next.js開発（Node 20に自動切替）',
        'npm run dev:next'
      ]
    },
    {
      title: 'オプション2: 手動切替',
      description: '手動でバージョンを切り替えて開発',
      commands: [
        '# Convex開発時',
        'nvm use 18.18.0',
        'npx convex dev',
        '',
        '# Next.js開発時',
        'nvm use 20.10.0',
        'npm run dev'
      ]
    }
  ]

  const troubleshootingItems = [
    {
      id: 'convex-node-error',
      title: 'convex dev でNode バージョンエラー',
      content: (
        <div>
          <div className="bg-red-50 p-4 rounded-lg mb-4">
            <h5 className="font-semibold text-red-800 mb-2">エラー例</h5>
            <code className="text-red-700 text-sm">
              Error: Node.js v20.10.0 is not supported. Please use Node.js v18.
            </code>
          </div>
          <h5 className="font-semibold text-gray-900 mb-2">解決方法</h5>
          <CodeBlock language="bash" id="convex-error-fix">
{`nvm use 18.18.0
npx convex dev`}
          </CodeBlock>
        </div>
      )
    },
    {
      id: 'package-lock-conflict',
      title: 'package-lock.json の競合',
      content: (
        <div>
          <p className="text-gray-600 mb-3">
            Node 18 と 20 で異なるlock ファイルが生成される場合の対処法：
          </p>
          <CodeBlock language="bash" id="package-lock-conflict">
{`rm package-lock.json
nvm use 18.18.0
npm install`}
          </CodeBlock>
        </div>
      )
    },
    {
      id: 'dependency-version-issues',
      title: '依存関係のバージョン問題',
      content: (
        <div>
          <p className="text-gray-600 mb-3">
            Node バージョン固有の依存関係エラーが発生した場合：
          </p>
          <CodeBlock language="bash" id="dependency-issues">
{`npm cache clean --force
rm -rf node_modules package-lock.json
nvm use 18.18.0
npm install`}
          </CodeBlock>
        </div>
      )
    }
  ]

  const upgradeTimeline = [
    {
      date: '2025年4月30日',
      event: 'Node 18 EOL',
      type: 'warning',
      description: 'Node.js 18のサポート終了'
    },
    {
      date: '2025年Q2-Q3',
      event: 'Convex予想アップグレード',
      type: 'info',
      description: 'ConvexのNode 20対応予想時期'
    },
    {
      date: '2025年2月〜4月',
      event: '準備期間',
      type: 'info',
      description: 'アップグレード準備とテスト期間'
    },
    {
      date: '2025年8月1日',
      event: 'Vercel Node 18 廃止',
      type: 'success',
      description: 'Vercelは既にNode 20対応済み'
    }
  ]

  const alternativeOptions = [
    {
      category: 'メール送信',
      services: ['SendGrid', 'Resend', 'AWS SES'],
      description: 'Node Actionsの代替としてHTTP APIを使用'
    },
    {
      category: '決済処理',
      services: ['Stripe', 'PayPal'],
      description: 'WebhookとREST APIでの実装'
    },
    {
      category: '画像処理',
      services: ['Cloudinary', 'ImageKit'],
      description: 'クラウドベースの画像処理サービス'
    },
    {
      category: 'ファイル処理',
      services: ['AWS S3', 'Google Cloud Storage'],
      description: 'ファイルアップロード・管理API'
    },
    {
      category: '通知',
      services: ['Pusher', 'Ably', 'WebSocket'],
      description: 'リアルタイム通知サービス'
    }
  ]

  return (
    <DocsLayout>
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container-custom">
          <div className="text-center animate-fade-in">
            <h1 className="heading-primary text-gray-900 mb-6">
              Node.js
              <span className="block text-orange-600 mt-2">
                バージョン管理ガイド
              </span>
            </h1>
            <p className="text-large max-w-3xl mx-auto mb-8">
              VercelとConvexの制約を考慮したNode.jsバージョン管理戦略。
              nvmを使用して開発・本番運用の両方で安定性を確保します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                セットアップ開始
              </Button>
              <Button variant="outline" size="lg">
                制約分析確認
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 重要な制約事項 */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-6">重要な制約事項</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  Vercel Node 18 廃止 vs Convex Node Actions
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-yellow-700 mb-1">Vercel</h4>
                    <p className="text-yellow-700 text-sm">2025年8月1日にNode 18サポート廃止予定</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-700 mb-1">Convex Node Actions</h4>
                    <p className="text-yellow-700 text-sm">Node 18固定（AWS Lambda制約）</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-center text-gray-900 mb-8">影響分析</h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">フェーズ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">実行環境</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">必要バージョン</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">影響</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {constraintData.map((row, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.phase}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.environment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.requirement}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.impact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        row.status === 'success' ? 'bg-green-100 text-green-800' :
                        row.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {row.status === 'success' ? '✅ 問題なし' :
                         row.status === 'warning' ? '⚠️ 要注意' :
                         '❌ 問題あり'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
              <span className="text-lg mr-2">✅</span>
              <strong>結論: リスクはほぼない</strong>が、ローカル開発でnvm運用が必要
            </div>
          </div>
        </div>
      </section>

      {/* セットアップ手順 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">セットアップ手順</h2>
          <Tabs items={setupTabs} />
        </div>
      </section>

      {/* 開発フローガイド */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">開発フローガイド</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {developmentFlows.map((flow, index) => (
              <div key={index} className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {flow.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {flow.description}
                </p>
                <CodeBlock language="bash" id={`flow-${index}`}>
                  {flow.commands.join('\n')}
                </CodeBlock>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* トラブルシューティング */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">トラブルシューティング</h2>
          <div className="max-w-4xl mx-auto">
            <Accordion items={troubleshootingItems} />
          </div>
        </div>
      </section>

      {/* 将来のアップグレード計画 */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">将来のアップグレード計画</h2>
          <h3 className="text-xl font-semibold text-center text-gray-900 mb-8">Node 18 EOL 対応タイムライン</h3>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-0.5 bg-gray-300 h-full"></div>
            <div className="space-y-8">
              {upgradeTimeline.map((item, index) => (
                <div key={index} className="relative flex items-center">
                  <div className={`absolute left-2 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full ${
                    item.type === 'warning' ? 'bg-red-500' :
                    item.type === 'info' ? 'bg-blue-500' :
                    'bg-green-500'
                  }`}></div>
                  <div className="ml-12 md:ml-0 md:w-1/2 md:pr-8 md:text-right">
                    <div className="card">
                      <h4 className="font-semibold text-gray-900">{item.event}</h4>
                      <p className="text-sm text-gray-600 mb-1">{item.date}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 代替案 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">緊急時の代替案</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                ❌ Node Actions使用（Node 18必須）
              </h3>
              <CodeBlock language="typescript" id="node-actions-example">
{`"use node";
export const sendEmail = action({
  args: { to: v.string(), subject: v.string() },
  handler: async (ctx, args) => {
    // Node.js専用ライブラリを使用
    const nodemailer = require('nodemailer');
    // ...
  },
});`}
              </CodeBlock>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                ✅ 外部API使用（Node 20対応）
              </h3>
              <CodeBlock language="typescript" id="external-api-example">
{`export const sendEmail = mutation({
  args: { to: v.string(), subject: v.string() },
  handler: async (ctx, args) => {
    // Fetch API使用（ブラウザ互換）
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: { 'Authorization': \`Bearer \${process.env.SENDGRID_API_KEY}\` },
      body: JSON.stringify({ /* ... */ }),
    });
    // ...
  },
});`}
              </CodeBlock>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-center text-gray-900 mb-8">外部サービス移行オプション</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alternativeOptions.map((option, index) => (
              <div key={index} className="card">
                <h4 className="font-semibold text-gray-900 mb-3">
                  {option.category}
                </h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {option.services.map((service, serviceIndex) => (
                    <span 
                      key={serviceIndex}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm">
                  {option.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* まとめ */}
      <section className="section-padding bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container-custom text-center">
          <h2 className="heading-secondary mb-6">運用による効果</h2>
          <p className="text-large mb-8 text-orange-100">
            この運用により、Node.js バージョンの制約に影響されることなく、
            安定した開発・本番運用が可能になります。
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">🔄 柔軟な開発環境</h3>
              <p className="text-orange-100 text-sm">
                プロジェクトごとに適切なNode.jsバージョンを自動選択
              </p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">🛡️ 将来への対応</h3>
              <p className="text-orange-100 text-sm">
                Node.js EOLやConvexアップグレードに柔軟に対応
              </p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">⚡ 安定した運用</h3>
              <p className="text-orange-100 text-sm">
                開発・ステージング・本番環境での一貫性確保
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* クイックリンク */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/development/setup-guide" className="text-blue-600 hover:text-blue-800">セットアップガイド</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/development/folder-structure-guide" className="text-blue-600 hover:text-blue-800">フォルダ構造ガイド</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/testing-guidelines" className="text-blue-600 hover:text-blue-800">テストガイドライン</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/development/api-tests-complete" className="text-blue-600 hover:text-blue-800">API テスト</a>
          </div>
        </div>
      </section>
    </DocsLayout>
  )
}