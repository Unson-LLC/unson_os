'use client'

import { useState } from 'react'
import { DocsLayout } from '@/components/layout/DocsLayout'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { Accordion } from '@/components/ui/Accordion'
import { StatusBadge } from '@/components/docs/StatusBadge'
import { ExpectationBanner } from '@/components/docs/ExpectationBanner'

export default function SetupGuidePage() {
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

  const prerequisitesTabs = [
    {
      id: 'software',
      label: '必要ソフトウェア',
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-2">Node.js</h4>
              <p className="text-gray-600 text-sm mb-2">v18.17.0以上</p>
              <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
                ダウンロード →
              </a>
            </div>
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-2">Git</h4>
              <p className="text-gray-600 text-sm mb-2">v2.34.0以上</p>
              <a href="https://git-scm.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
                ダウンロード →
              </a>
            </div>
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-2">npm</h4>
              <p className="text-gray-600 text-sm mb-2">v9.0.0以上（または yarn/pnpm）</p>
              <span className="text-gray-500 text-sm">Node.jsと同時にインストール</span>
            </div>
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-2">VS Code</h4>
              <p className="text-gray-600 text-sm mb-2">推奨エディタ</p>
              <a href="https://code.visualstudio.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm">
                ダウンロード →
              </a>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'accounts',
      label: '必要アカウント',
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-2">GitHub</h4>
              <p className="text-gray-600 text-sm mb-2">コード管理</p>
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">必須</span>
            </div>
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-2">Vercel</h4>
              <p className="text-gray-600 text-sm mb-2">デプロイ</p>
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">必須</span>
            </div>
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-2">Notion</h4>
              <p className="text-gray-600 text-sm mb-2">CMS</p>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">オプション</span>
            </div>
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-2">Google Analytics</h4>
              <p className="text-gray-600 text-sm mb-2">分析</p>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">オプション</span>
            </div>
          </div>
        </div>
      )
    }
  ]

  const setupSteps = [
    {
      title: 'Next.js プロジェクト作成',
      description: 'TypeScript、Tailwind CSS、ESLint付きでプロジェクトを初期化',
      code: `# プロジェクト作成
npx create-next-app@latest unson-os-lp --typescript --tailwind --eslint --app --src-dir

cd unson-os-lp

# 追加依存関係のインストール
npm install framer-motion lucide-react clsx class-variance-authority tailwind-merge zustand @notionhq/client resend zod @hookform/resolvers react-hook-form

# 開発依存関係のインストール
npm install -D prettier prettier-plugin-tailwindcss @next/bundle-analyzer autoprefixer postcss`,
      id: 'create-project'
    },
    {
      title: '環境変数設定',
      description: '.env.localファイルを作成し、必要な環境変数を設定',
      code: `# 環境変数ファイル作成
touch .env.local

# .env.localの内容例:
NEXT_PUBLIC_APP_URL=http://localhost:3000
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_database_id
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
OPENAI_API_KEY=your_openai_api_key`,
      id: 'env-setup'
    },
    {
      title: 'フォルダ構造作成',
      description: '推奨されるディレクトリ構造を作成',
      code: `# srcディレクトリ内の構造作成
mkdir -p src/{components/{ui,layout,sections,forms,interactive,analytics},lib,hooks,store,types,styles,data,config}

# componentsサブディレクトリ
mkdir -p src/components/{ui,layout,sections,forms,interactive,analytics}

# appディレクトリ構造
mkdir -p src/app/{dao,investors,waitlist,docs,blog,api/{contact,waitlist,analytics,notion}}

# publicディレクトリ構造
mkdir -p public/{images/{logos,icons,screenshots,illustrations,og},videos,documents}`,
      id: 'folder-structure'
    },
    {
      title: '基本設定ファイル',
      description: 'Prettier、ESLint、TypeScript設定を追加',
      code: `# .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "plugins": ["prettier-plugin-tailwindcss"]
}

# .eslintrc.json に追加ルール
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "prefer-const": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}`,
      id: 'config-files'
    }
  ]

  const troubleshootingItems = [
    {
      title: 'Node.js バージョンエラー',
      content: (
        <div>
          <p className="text-gray-600 mb-3">Node.jsのバージョンが古い場合の対処法：</p>
          <CodeBlock language="bash" id="node-version">
{`# Node.js バージョン確認
node --version

# nvmでバージョン管理（推奨）
nvm install 18
nvm use 18`}
          </CodeBlock>
        </div>
      )
    },
    {
      title: '依存関係エラー',
      content: (
        <div>
          <p className="text-gray-600 mb-3">package.jsonの依存関係に問題がある場合：</p>
          <CodeBlock language="bash" id="deps-error">
{`# node_modules削除
rm -rf node_modules package-lock.json

# 再インストール
npm install`}
          </CodeBlock>
        </div>
      )
    },
    {
      title: 'Tailwind CSS スタイル適用されない',
      content: (
        <div>
          <p className="text-gray-600 mb-3">スタイルが正しく読み込まれない場合：</p>
          <CodeBlock language="bash" id="tailwind-issue">
{`# Tailwind CSS設定確認
npx tailwindcss -i ./src/app/globals.css -o ./dist/output.css --watch`}
          </CodeBlock>
        </div>
      )
    },
    {
      title: 'ビルドエラー',
      content: (
        <div>
          <p className="text-gray-600 mb-3">本番ビルド時のエラー対処：</p>
          <CodeBlock language="bash" id="build-error">
{`# 型エラー確認
npm run type-check

# ESLintエラー確認
npm run lint

# 詳細ログでビルド
npm run build --verbose`}
          </CodeBlock>
        </div>
      )
    }
  ]

  return (
    <DocsLayout>
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container-custom">
          <div className="text-center animate-fade-in">
            <div className="flex justify-center items-center gap-3 mb-4">
              <StatusBadge status="available" size="lg" />
            </div>
            <h1 className="heading-primary text-gray-900 mb-6">
              UnsonOS LP 
              <span className="block text-blue-600 mt-2">
                セットアップガイド
              </span>
            </h1>
            <p className="text-large max-w-3xl mx-auto mb-8">
              Next.js 14 + TypeScript + Tailwind CSS環境の構築からデプロイまでを網羅した完全ガイド。
              開発環境のセットアップを段階的に進めましょう。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                セットアップ開始
              </Button>
              <Button variant="outline" size="lg">
                サンプルプロジェクト
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 前提条件 */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">前提条件</h2>
          <Tabs items={prerequisitesTabs} />
        </div>
      </section>

      {/* セットアップ手順 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">プロジェクト初期化</h2>
          <div className="space-y-8">
            {setupSteps.map((step, index) => (
              <div key={index} className="card">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {step.description}
                    </p>
                    <CodeBlock language="bash" id={step.id}>
                      {step.code}
                    </CodeBlock>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 開発サーバー起動 */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">開発・デプロイ</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">開発サーバー</h3>
              <p className="text-gray-600 mb-4">
                ローカル開発環境でプロジェクトを実行
              </p>
              <CodeBlock language="bash" id="dev-server">
{`# 開発サーバー起動
npm run dev

# ブラウザで確認
# http://localhost:3000`}
              </CodeBlock>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">品質チェック</h3>
              <p className="text-gray-600 mb-4">
                コード品質とタイプチェックの実行
              </p>
              <CodeBlock language="bash" id="quality-check">
{`# 型チェック
npm run type-check

# リンター実行
npm run lint

# フォーマット
npm run format`}
              </CodeBlock>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">プロダクションビルド</h3>
              <p className="text-gray-600 mb-4">
                本番環境用のビルドと確認
              </p>
              <CodeBlock language="bash" id="prod-build">
{`# プロダクションビルド
npm run build

# ビルド結果確認
npm run start`}
              </CodeBlock>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Vercelデプロイ</h3>
              <p className="text-gray-600 mb-4">
                本番環境へのデプロイメント
              </p>
              <CodeBlock language="bash" id="vercel-deploy">
{`# Vercel CLI インストール
npm i -g vercel

# プロジェクトデプロイ
vercel

# カスタムドメイン設定
vercel domains add unson-os.com`}
              </CodeBlock>
            </div>
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

      {/* 次のステップ */}
      <section className="section-padding bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container-custom text-center">
          <h2 className="heading-secondary mb-6">次のステップ</h2>
          <p className="text-large mb-8 text-blue-100">
            セットアップが完了したら、フォルダ構造の詳細設計とコンポーネント開発に進みましょう。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/docs/development/folder-structure-guide">
              <Button variant="secondary" size="lg">
                フォルダ構造ガイド
              </Button>
            </a>
            <a href="/docs/development/frontend-structure">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                フロントエンド構造
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* クイックリンク */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/development/frontend-structure" className="text-blue-600 hover:text-blue-800">フロントエンド構造</a>
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