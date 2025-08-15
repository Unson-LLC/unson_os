'use client'

import { useState } from 'react'
import { DocsLayout } from '@/components/layout/DocsLayout'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { Accordion } from '@/components/ui/Accordion'

export default function FolderStructureGuidePage() {
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

  const designPrinciples = [
    {
      icon: '🎯',
      title: 'YAGNI',
      subtitle: 'You Aren\'t Gonna Need It',
      description: '今必要でない機能は作らない',
      color: 'bg-red-100 text-red-700'
    },
    {
      icon: '🔄',
      title: 'DRY',
      subtitle: 'Don\'t Repeat Yourself',
      description: '同じコードを繰り返さない',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      icon: '💎',
      title: 'KISS',
      subtitle: 'Keep It Simple Stupid',
      description: 'シンプルに保つ',
      color: 'bg-green-100 text-green-700'
    },
    {
      icon: '🌳',
      title: 'Git Worktree活用',
      subtitle: 'Parallel Development',
      description: '機能別ブランチでの並列開発を最大化',
      color: 'bg-purple-100 text-purple-700'
    }
  ]

  const structureTabs = [
    {
      id: 'root',
      label: 'ルートレベル',
      content: (
        <div className="space-y-6">
          <div className="card">
            <h4 className="font-semibold text-gray-900 mb-3">プロジェクトルート構造</h4>
            <CodeBlock language="text" id="root-structure">
{`unson_os/
├── README.md                        # プロジェクト概要
├── CLAUDE.md                        # AI開発指針
├── package.json                     # 依存関係・スクリプト
├── next.config.js                   # Next.js設定
├── tailwind.config.js               # スタイル設定
├── tsconfig.json                    # TypeScript設定
├── .nvmrc                          # Node.jsバージョン指定
├── .env.local.example              # 環境変数テンプレート
│
├── convex/                         # Convexバックエンド
├── src/                            # フロントエンドソース
├── tests/                          # テストファイル統合
├── docs/                           # プロジェクトドキュメント
├── scripts/                        # 開発・運用スクリプト
└── .github/                        # GitHub設定`}
            </CodeBlock>
          </div>
        </div>
      )
    },
    {
      id: 'convex',
      label: 'Convexバックエンド',
      content: (
        <div className="space-y-6">
          <div className="card">
            <h4 className="font-semibold text-gray-900 mb-3">Convex構成</h4>
            <CodeBlock language="text" id="convex-structure">
{`convex/
├── _generated/                     # Convex自動生成ファイル
│   ├── api.d.ts
│   └── server.d.ts
├── schema.ts                       # データベーススキーマ
├── functions/                      # 機能別Convex関数
│   ├── products/
│   │   ├── products.ts
│   │   ├── categories.ts
│   │   └── index.ts
│   ├── users/
│   │   ├── waitlist.ts
│   │   ├── contacts.ts
│   │   └── careers.ts
│   └── analytics/
│       └── events.ts
├── lib/                           # Convex共通ユーティリティ
│   ├── validation.ts
│   ├── constants.ts
│   └── utils.ts
└── README.md                      # Convex設計書`}
            </CodeBlock>
          </div>
        </div>
      )
    },
    {
      id: 'frontend',
      label: 'フロントエンド',
      content: (
        <div className="space-y-6">
          <div className="card">
            <h4 className="font-semibold text-gray-900 mb-3">src/ ディレクトリ構成</h4>
            <CodeBlock language="text" id="frontend-structure">
{`src/
├── app/                           # Next.js 14 App Router
│   ├── (marketing)/               # Route Groups: マーケティングページ
│   │   ├── about/page.tsx
│   │   ├── careers/page.tsx
│   │   ├── community/page.tsx
│   │   ├── contact/page.tsx
│   │   └── support/page.tsx
│   ├── (product)/                 # Route Groups: プロダクトページ
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── docs/
│   │       ├── page.tsx
│   │       └── [...slug]/page.tsx
│   ├── api/                       # API Routes
│   │   ├── waitlist/route.ts
│   │   ├── contact/route.ts
│   │   ├── careers/route.ts
│   │   └── product-request/route.ts
│   ├── globals.css                # グローバルスタイル
│   ├── layout.tsx                 # ルートレイアウト
│   └── page.tsx                   # ホームページ
│
├── components/                    # Reactコンポーネント
│   ├── ui/                        # 基本UIコンポーネント
│   ├── forms/                     # フォーム関連
│   ├── features/                  # 機能別コンポーネント
│   ├── layout/                    # レイアウトコンポーネント
│   └── sections/                  # ページセクション
│
├── hooks/                         # カスタムフック
├── lib/                           # ユーティリティとヘルパー
├── store/                         # 状態管理（Zustand）
├── types/                         # TypeScript型定義
├── config/                        # 設定ファイル
└── data/                          # 静的データとモック`}
            </CodeBlock>
          </div>
        </div>
      )
    },
    {
      id: 'tests',
      label: 'テスト構成',
      content: (
        <div className="space-y-6">
          <div className="card">
            <h4 className="font-semibold text-gray-900 mb-3">統合テスト構成</h4>
            <CodeBlock language="text" id="tests-structure">
{`tests/
├── unit/                          # ユニットテスト
│   ├── components/
│   │   ├── ui/
│   │   ├── forms/
│   │   └── features/
│   ├── hooks/
│   ├── lib/
│   └── utils/
├── integration/                   # 統合テスト
│   ├── api/
│   ├── forms/
│   ├── user-flows/
│   └── convex/
├── e2e/                          # E2Eテスト
│   ├── critical-paths/
│   │   ├── waitlist-registration.spec.ts
│   │   ├── product-browsing.spec.ts
│   │   └── contact-form.spec.ts
│   ├── accessibility/
│   └── performance/
├── fixtures/                     # テストデータ
│   ├── products.json
│   ├── users.json
│   └── forms.json
└── utils/                        # テストヘルパー
    ├── test-utils.tsx
    ├── mock-providers.tsx
    └── setup.ts`}
            </CodeBlock>
          </div>
        </div>
      )
    }
  ]

  const namingConventions = [
    {
      title: 'フォルダ命名',
      items: [
        { label: '推奨', value: 'kebab-case', example: 'user-profile/, product-detail/', color: 'bg-green-100 text-green-700' },
        { label: '非推奨', value: 'camelCase, PascalCase', example: 'userProfile/, ProductDetail/', color: 'bg-red-100 text-red-700' }
      ]
    },
    {
      title: 'ファイル命名',
      items: [
        { label: 'コンポーネント', value: 'PascalCase.tsx', example: 'Button.tsx, WaitlistForm.tsx', color: 'bg-blue-100 text-blue-700' },
        { label: 'フック', value: 'camelCase.ts', example: 'useAnalytics.ts, useProductFilter.ts', color: 'bg-purple-100 text-purple-700' },
        { label: 'ユーティリティ', value: 'camelCase.ts', example: 'formatDate.ts, apiClient.ts', color: 'bg-indigo-100 text-indigo-700' },
        { label: '型定義', value: 'camelCase.ts', example: 'userTypes.ts, apiTypes.ts', color: 'bg-yellow-100 text-yellow-700' }
      ]
    }
  ]

  const migrationSteps = [
    {
      title: 'Phase 1: 基盤整理（即座に実行）',
      commands: [
        'mkdir -p tests/{unit,integration,e2e,fixtures,utils}',
        'mv src/components/__tests__/* tests/unit/components/',
        'mv tests/e2e/* tests/e2e/critical-paths/',
        'mkdir -p src/app/\\(marketing\\)',
        'mkdir -p src/app/\\(product\\)',
        'mv src/app/{about,careers,community,contact,support} src/app/\\(marketing\\)/',
        'mv src/app/{products,docs} src/app/\\(product\\)/',
        'mkdir -p src/components/{ui,forms,features,layout,sections}',
        'mv src/components/interactive/* src/components/ui/'
      ]
    },
    {
      title: 'Phase 2: 機能別整理（2週間以内）',
      commands: [
        'mkdir -p src/hooks/{use-analytics,use-search,use-filter}',
        'mv src/hooks/useAnalytics.ts src/hooks/use-analytics/',
        'mv src/hooks/useSearch.ts src/hooks/use-search/',
        'mv src/hooks/useFilter.ts src/hooks/use-filter/',
        'mkdir -p src/lib/{api,validation,utils}',
        'mv src/lib/api-utils.ts src/lib/api/',
        'mv src/lib/validation.ts src/lib/validation/',
        'mkdir -p src/config',
        'mv src/lib/constants.ts src/config/'
      ]
    },
    {
      title: 'Phase 3: 高度な機能（1ヶ月以内）',
      commands: [
        'mkdir -p src/features/{products,analytics,navigation}',
        'mkdir -p src/types',
        '# 機能別型定義ファイルの作成',
        '# Storybook導入',
        '# コンポーネントカタログの作成'
      ]
    }
  ]

  const developmentRules = [
    {
      id: 'new-component',
      title: '新しいコンポーネント作成時',
      content: (
        <div>
          <p className="text-gray-600 mb-3">新しいコンポーネントを作成する際の手順：</p>
          <CodeBlock language="bash" id="new-component">
{`# 1. 適切なフォルダに配置
src/components/ui/新コンポーネント/

# 2. 必要ファイルを作成
ComponentName.tsx      # メイン実装
ComponentName.test.tsx # テスト
ComponentName.stories.tsx # Storybook（UI コンポーネントのみ）
index.ts              # エクスポート
types.ts              # 型定義（必要時）

# 3. 親フォルダのindex.tsに追加
echo "export { ComponentName } from './新コンポーネント'" >> ../index.ts`}
          </CodeBlock>
        </div>
      )
    },
    {
      id: 'new-feature',
      title: '新機能追加時',
      content: (
        <div>
          <p className="text-gray-600 mb-3">新しい機能を追加する際の構造：</p>
          <CodeBlock language="bash" id="new-feature">
{`# 1. 機能別フォルダ作成
src/features/新機能名/

# 2. 必要なサブフォルダ作成
components/  # 機能専用コンポーネント
hooks/      # 機能専用フック
lib/        # 機能専用ユーティリティ
types/      # 機能専用型定義

# 3. テストフォルダも同時作成
tests/unit/features/新機能名/
tests/integration/features/新機能名/`}
          </CodeBlock>
        </div>
      )
    },
    {
      id: 'import-rules',
      title: 'Import順序ルール',
      content: (
        <div>
          <p className="text-gray-600 mb-3">一貫したインポート順序：</p>
          <CodeBlock language="typescript" id="import-rules">
{`// 1. React・Next.js
import React from 'react'
import Link from 'next/link'

// 2. 外部ライブラリ
import { useQuery } from 'convex/react'
import clsx from 'clsx'

// 3. 内部モジュール（絶対パス）
import { Button } from '@/components/ui'
import { useAnalytics } from '@/hooks'
import { formatDate } from '@/lib/utils'

// 4. 相対パス
import './Component.css'`}
          </CodeBlock>
        </div>
      )
    }
  ]

  const antiPatterns = [
    {
      type: '避けるべきパターン',
      color: 'bg-red-50 border-red-200',
      items: [
        {
          title: '深すぎる階層',
          example: 'src/components/ui/forms/inputs/text/variants/primary/',
          description: '3階層を超える深いネスト'
        },
        {
          title: '機能横断的な配置',
          example: 'src/utils/productUtils.ts, src/utils/userUtils.ts',
          description: '機能が分散した配置'
        },
        {
          title: '曖昧な命名',
          example: 'src/components/misc/, src/lib/helpers/',
          description: '意図が不明な命名'
        }
      ]
    },
    {
      type: '推奨パターン',
      color: 'bg-green-50 border-green-200',
      items: [
        {
          title: '機能別まとめ',
          example: 'src/features/products/ { components/, hooks/, lib/, types/ }',
          description: '関連するコードを機能単位でグループ化'
        },
        {
          title: '明確な責任',
          example: 'src/components/ui/ (再利用可能UI), src/components/features/ (機能特化)',
          description: '明確な責任分離'
        },
        {
          title: '専用ディレクトリ',
          example: 'src/lib/api/ (API通信専用), src/lib/validation/ (バリデーション専用)',
          description: '単一責任の原則に従った配置'
        }
      ]
    }
  ]

  const goalState = [
    {
      icon: '🔍',
      title: '発見しやすさ',
      description: '欲しいファイルが3秒で見つかる',
      metrics: 'ファイル発見時間 < 3秒'
    },
    {
      icon: '🔧',
      title: '保守しやすさ',
      description: '影響範囲が明確で安全な変更',
      metrics: '変更時の影響範囲予測可能'
    },
    {
      icon: '🚀',
      title: '拡張しやすさ',
      description: '新機能追加時の配置指針が明確',
      metrics: '新機能追加時の迷い解消'
    },
    {
      icon: '👥',
      title: 'チーム開発',
      description: '誰でも迷わない一貫した構造',
      metrics: 'オンボーディング時間短縮'
    },
    {
      icon: '⚡',
      title: '開発効率',
      description: 'import文が短く、自動補完が効く',
      metrics: 'コーディング速度向上'
    },
    {
      icon: '🧪',
      title: 'テスト容易性',
      description: 'テスト対象とテストファイルの対応が明確',
      metrics: 'テストカバレッジ向上'
    }
  ]

  return (
    <DocsLayout>
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container-custom">
          <div className="text-center animate-fade-in">
            <h1 className="heading-primary text-gray-900 mb-6">
              フォルダ構造
              <span className="block text-blue-600 mt-2">
                設計ガイド
              </span>
            </h1>
            <p className="text-large max-w-3xl mx-auto mb-8">
              Unson OSプロジェクトの保守性と拡張性を最大化するフォルダ構造設計。
              開発効率とコード品質の大幅向上を実現します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                構造を確認
              </Button>
              <Button variant="outline" size="lg">
                移行ガイド
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 設計原則 */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">設計原則</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {designPrinciples.map((principle, index) => (
              <div key={index} className="card text-center">
                <div className="text-3xl mb-4">{principle.icon}</div>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 ${principle.color}`}>
                  {principle.title}
                </div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">
                  {principle.subtitle}
                </h3>
                <p className="text-gray-600 text-sm">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 推奨フォルダ構成 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">推奨フォルダ構成</h2>
          <Tabs items={structureTabs} />
        </div>
      </section>

      {/* 命名規則 */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">命名規則</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {namingConventions.map((section, index) => (
              <div key={index} className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {section.title}
                </h3>
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="border-l-4 border-gray-200 pl-4">
                      <div className="flex items-center mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium mr-2 ${item.color}`}>
                          {item.label}
                        </span>
                        <span className="font-mono text-sm">{item.value}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{item.example}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 段階的移行戦略 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">段階的移行戦略</h2>
          <div className="space-y-8">
            {migrationSteps.map((phase, index) => (
              <div key={index} className="card">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {phase.title}
                    </h3>
                    <CodeBlock language="bash" id={`migration-${index}`}>
                      {phase.commands.join('\n')}
                    </CodeBlock>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 開発ルール */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">開発ルール</h2>
          <div className="max-w-4xl mx-auto">
            <Accordion items={developmentRules} />
          </div>
        </div>
      </section>

      {/* パターン比較 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">パターン比較</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {antiPatterns.map((patternGroup, index) => (
              <div key={index} className={`border-2 rounded-lg p-6 ${patternGroup.color}`}>
                <h3 className="text-xl font-semibold mb-4">
                  {patternGroup.type}
                </h3>
                <div className="space-y-4">
                  {patternGroup.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="bg-white p-4 rounded">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {item.title}
                      </h4>
                      <div className="font-mono text-sm text-gray-700 mb-2 bg-gray-100 p-2 rounded">
                        {item.example}
                      </div>
                      <p className="text-gray-600 text-sm">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 目標状態 */}
      <section className="section-padding bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">目標状態</h2>
          <p className="text-center text-blue-100 mb-12 text-lg">
            この構成により以下を実現します
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goalState.map((goal, index) => (
              <div key={index} className="bg-white/10 p-6 rounded-lg">
                <div className="text-3xl mb-4">{goal.icon}</div>
                <h3 className="text-lg font-semibold mb-2">
                  {goal.title}
                </h3>
                <p className="text-blue-100 text-sm mb-3">
                  {goal.description}
                </p>
                <div className="bg-white/20 p-2 rounded text-xs">
                  {goal.metrics}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* まとめ */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="heading-secondary mb-6">まとめ</h2>
          <p className="text-large max-w-3xl mx-auto mb-8">
            このフォルダ構造ガイドを段階的に適用することで、
            Unson OSプロジェクトの開発効率とコード品質が大幅に向上します。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/docs/development/setup-guide">
              <Button size="lg">
                セットアップガイド
              </Button>
            </a>
            <a href="/docs/testing-guidelines">
              <Button variant="outline" size="lg">
                テストガイドライン
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* クイックリンク */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/development/setup-guide" className="text-blue-600 hover:text-blue-800">セットアップガイド</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/development/frontend-structure" className="text-blue-600 hover:text-blue-800">フロントエンド構造</a>
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