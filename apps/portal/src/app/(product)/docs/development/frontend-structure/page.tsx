'use client'

import { useState } from 'react'
import { DocsLayout } from '@/components/layout/DocsLayout'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { Accordion } from '@/components/ui/Accordion'

export default function FrontendStructurePage() {
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

  const CodeBlock = ({ children, language = 'typescript', id }: { children: string; language?: string; id: string }) => (
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

  const structureTabs = [
    {
      id: 'overview',
      label: '全体構成',
      content: (
        <div className="space-y-6">
          <div className="card">
            <h4 className="font-semibold text-gray-900 mb-3">プロジェクト概要</h4>
            <p className="text-gray-600 mb-4">
              Next.js 14 App Router + TypeScript + Tailwind CSSを使用したランディングページの推奨フォルダ構成。
              Phase 1から3までの段階的拡張に対応します。
            </p>
            <CodeBlock language="text" id="project-overview">
{`unson-os-lp/
├── .env.local                    # 環境変数
├── .env.example                  # 環境変数テンプレート
├── .gitignore                    # Git除外設定
├── .eslintrc.json               # ESLint設定
├── .prettierrc                  # Prettier設定
├── next.config.js               # Next.js設定
├── tailwind.config.js           # Tailwind設定
├── tsconfig.json                # TypeScript設定
├── package.json                 # 依存関係
├── README.md                    # プロジェクト説明
├── vercel.json                  # Vercel設定
│
├── public/                      # 静的ファイル
├── src/                         # ソースコード
└── tests/                       # テストファイル`}
            </CodeBlock>
          </div>
        </div>
      )
    },
    {
      id: 'app-router',
      label: 'App Router',
      content: (
        <div className="space-y-6">
          <div className="card">
            <h4 className="font-semibold text-gray-900 mb-3">App Routerディレクトリ構成</h4>
            <p className="text-gray-600 mb-4">
              Next.js 14のApp Routerを使用したページとAPIルートの構成
            </p>
            <CodeBlock language="text" id="app-structure">
{`src/app/
├── globals.css         # グローバルスタイル
├── layout.tsx          # ルートレイアウト
├── page.tsx            # メインLP (/)
├── loading.tsx         # ローディングUI
├── error.tsx           # エラーUI
├── not-found.tsx       # 404ページ
│
├── dao/                # DAO参加者向け (/dao)
│   ├── page.tsx
│   ├── layout.tsx
│   └── components/     # DAO固有コンポーネント
│       ├── DAOSimulator.tsx
│       ├── RevenueCalculator.tsx
│       └── ContributionExamples.tsx
│
├── investors/          # 投資家向け (/investors)
│   ├── page.tsx
│   ├── layout.tsx
│   └── components/     # 投資家固有コンポーネント
│
├── docs/               # ドキュメント (/docs)
│   ├── page.tsx
│   ├── layout.tsx
│   └── [slug]/
│       └── page.tsx    # 動的ドキュメントページ
│
└── api/                # API Routes
    ├── contact/
    │   └── route.ts    # お問い合わせAPI
    ├── waitlist/
    │   └── route.ts    # ウェイトリスト登録API
    └── analytics/
        └── route.ts    # 分析データAPI`}
            </CodeBlock>
          </div>
        </div>
      )
    },
    {
      id: 'components',
      label: 'コンポーネント',
      content: (
        <div className="space-y-6">
          <div className="card">
            <h4 className="font-semibold text-gray-900 mb-3">コンポーネント階層</h4>
            <p className="text-gray-600 mb-4">
              再利用可能なReactコンポーネントの分類と配置
            </p>
            <CodeBlock language="text" id="components-structure">
{`src/components/
├── ui/                 # 基本UIコンポーネント
│   ├── Button.tsx      # ボタンコンポーネント
│   ├── Input.tsx       # 入力フィールド
│   ├── Modal.tsx       # モーダル
│   ├── Card.tsx        # カード
│   ├── Badge.tsx       # バッジ
│   ├── Avatar.tsx      # アバター
│   ├── Skeleton.tsx    # スケルトンローダー
│   └── index.ts        # エクスポート設定
│
├── layout/             # レイアウトコンポーネント
│   ├── Header.tsx      # ヘッダー
│   ├── Footer.tsx      # フッター
│   ├── Navigation.tsx  # ナビゲーション
│   ├── Sidebar.tsx     # サイドバー
│   └── Container.tsx   # コンテナ
│
├── sections/           # セクションコンポーネント
│   ├── Hero.tsx        # ヒーローセクション
│   ├── Features.tsx    # 機能紹介
│   ├── Testimonials.tsx# 体験談
│   ├── Pricing.tsx     # 価格設定
│   ├── FAQ.tsx         # よくある質問
│   ├── CTA.tsx         # コールトゥアクション
│   └── Stats.tsx       # 統計・実績
│
├── forms/              # フォームコンポーネント
│   ├── ContactForm.tsx # お問い合わせフォーム
│   ├── WaitlistForm.tsx# ウェイトリスト登録
│   ├── NewsletterForm.tsx # ニュースレター
│   └── FeedbackForm.tsx# フィードバック
│
├── interactive/        # インタラクティブコンポーネント
│   ├── RevenueCounter.tsx    # リアルタイム収益カウンター
│   ├── DAOSimulator.tsx      # DAO配当シミュレーター
│   ├── ProductGenerator.tsx  # プロダクト生成プレビュー
│   ├── AnimatedChart.tsx     # アニメーション付きチャート
│   └── InteractiveTimeline.tsx # インタラクティブタイムライン
│
└── analytics/          # 分析・追跡コンポーネント
    ├── GoogleAnalytics.tsx   # GA4統合
    ├── HotjarTracking.tsx    # Hotjar統合
    ├── VercelAnalytics.tsx   # Vercel Analytics
    └── ConversionTracking.tsx # コンバージョン追跡`}
            </CodeBlock>
          </div>
        </div>
      )
    },
    {
      id: 'lib-hooks',
      label: 'Lib & Hooks',
      content: (
        <div className="space-y-6">
          <div className="card">
            <h4 className="font-semibold text-gray-900 mb-3">ライブラリとフック</h4>
            <p className="text-gray-600 mb-4">
              ユーティリティライブラリとカスタムフックの構成
            </p>
            <CodeBlock language="text" id="lib-hooks-structure">
{`src/lib/                    # ユーティリティライブラリ
├── utils.ts            # 汎用ユーティリティ
├── constants.ts        # 定数定義
├── validations.ts      # バリデーション関数
├── api.ts              # API関連ユーティリティ
├── analytics.ts        # 分析関連ユーティリティ
├── notion.ts           # Notion API関連
├── email.ts            # メール送信関連
└── formatting.ts       # データフォーマット関数

src/hooks/                  # カスタムフック
├── useLocalStorage.ts  # ローカルストレージフック
├── useAnalytics.ts     # 分析フック
├── useApiRequest.ts    # API リクエストフック
├── useIntersection.ts  # Intersection Observer
├── useScroll.ts        # スクロール検知
└── useDeviceDetect.ts  # デバイス検知

src/store/                  # 状態管理 (Zustand)
├── useGlobalStore.ts   # グローバル状態
├── useUIStore.ts       # UI状態
├── useUserStore.ts     # ユーザー状態
└── useAnalyticsStore.ts# 分析データ状態

src/types/                  # TypeScript型定義
├── index.ts            # 基本型定義
├── api.ts              # API関連型
├── components.ts       # コンポーネント型
├── notion.ts           # Notion API型
└── analytics.ts        # 分析関連型`}
            </CodeBlock>
          </div>
        </div>
      )
    }
  ]

  const configurationItems = [
    {
      id: 'package-json',
      title: 'package.json設定',
      content: (
        <div>
          <p className="text-gray-600 mb-3">プロジェクトの依存関係とスクリプト設定：</p>
          <CodeBlock language="json" id="package-json">
{`{
  "name": "unson-os-lp",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write .",
    "analyze": "ANALYZE=true next build"
  },
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.320.0",
    "clsx": "^2.1.0",
    "class-variance-authority": "^0.7.0",
    "tailwind-merge": "^2.2.0",
    "zustand": "^4.5.0"
  }
}`}
          </CodeBlock>
        </div>
      )
    },
    {
      id: 'nextjs-config',
      title: 'Next.js設定',
      content: (
        <div>
          <p className="text-gray-600 mb-3">next.config.jsの推奨設定：</p>
          <CodeBlock language="javascript" id="next-config">
{`/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['images.unsplash.com', 'notion.so'],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}

module.exports = nextConfig`}
          </CodeBlock>
        </div>
      )
    },
    {
      id: 'tailwind-config',
      title: 'Tailwind CSS設定',
      content: (
        <div>
          <p className="text-gray-600 mb-3">tailwind.config.jsのカスタム設定：</p>
          <CodeBlock language="javascript" id="tailwind-config">
{`/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#fffbeb',
          500: '#f59e0b',
          600: '#d97706',
        },
        accent: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}`}
          </CodeBlock>
        </div>
      )
    }
  ]

  const designPrinciples = [
    {
      icon: '🎯',
      title: 'Single Responsibility',
      description: '各コンポーネントは単一の責任を持つ',
      example: 'Buttonコンポーネントはボタン表示のみを担当'
    },
    {
      icon: '🔧',
      title: 'Props Interface',
      description: '明確なProps型定義',
      example: 'ButtonProps interfaceで型安全性を確保'
    },
    {
      icon: '🧩',
      title: 'Composition Pattern',
      description: '合成パターンの活用',
      example: 'Modal + ModalHeader + ModalContent'
    },
    {
      icon: '♿',
      title: 'Accessibility',
      description: 'WCAG 2.1 AA準拠',
      example: 'aria-label、role属性の適切な使用'
    }
  ]

  const namingConventions = [
    {
      type: 'コンポーネント',
      convention: 'PascalCase',
      example: 'HeroSection.tsx',
      description: 'Reactコンポーネントファイル'
    },
    {
      type: 'フック',
      convention: 'camelCase with "use" prefix',
      example: 'useAnalytics.ts',
      description: 'カスタムフック'
    },
    {
      type: 'ユーティリティ',
      convention: 'camelCase',
      example: 'formatCurrency.ts',
      description: '汎用関数'
    },
    {
      type: '定数',
      convention: 'UPPER_SNAKE_CASE',
      example: 'API_ENDPOINTS.ts',
      description: '設定値・定数'
    }
  ]

  return (
    <DocsLayout>
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container-custom">
          <div className="text-center animate-fade-in">
            <h1 className="heading-primary text-gray-900 mb-6">
              フロントエンド
              <span className="block text-blue-600 mt-2">
                構造設計
              </span>
            </h1>
            <p className="text-large max-w-3xl mx-auto mb-8">
              Next.js 14 App Routerを使用したランディングページの推奨フォルダ構成。
              段階的拡張に対応した保守性の高い設計です。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                構造を確認
              </Button>
              <Button variant="outline" size="lg">
                サンプルコード
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 構造詳細 */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">ディレクトリ構造</h2>
          <Tabs items={structureTabs} />
        </div>
      </section>

      {/* 設計原則 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">コンポーネント設計原則</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {designPrinciples.map((principle, index) => (
              <div key={index} className="card text-center">
                <div className="text-3xl mb-4">{principle.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {principle.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {principle.description}
                </p>
                <div className="bg-blue-50 p-2 rounded text-xs text-blue-700">
                  例: {principle.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 命名規則 */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">ファイル命名規則</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {namingConventions.map((convention, index) => (
              <div key={index} className="card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {convention.type}
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    {convention.convention}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {convention.description}
                </p>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                  {convention.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 設定ファイル */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">主要設定ファイル</h2>
          <div className="max-w-4xl mx-auto">
            <Accordion items={configurationItems} />
          </div>
        </div>
      </section>

      {/* Import順序の例 */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">インポート順序</h2>
          <div className="max-w-4xl mx-auto">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">推奨インポート順序</h3>
              <p className="text-gray-600 mb-4">
                一貫性のあるインポート順序でコードの可読性を向上
              </p>
              <CodeBlock language="typescript" id="import-order">
{`// 1. React/Next.js関連
import React from 'react'
import { NextPage } from 'next'
import Link from 'next/link'

// 2. 外部ライブラリ
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

// 3. 内部コンポーネント
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/layout/Container'

// 4. フック・ユーティリティ
import { useAnalytics } from '@/hooks/useAnalytics'
import { formatCurrency } from '@/lib/utils'

// 5. 型定義
import type { ComponentProps } from '@/types'`}
              </CodeBlock>
            </div>
          </div>
        </div>
      </section>

      {/* 拡張性への配慮 */}
      <section className="section-padding bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container-custom text-center">
          <h2 className="heading-secondary mb-6">拡張性への配慮</h2>
          <p className="text-large mb-8 text-blue-100">
            Phase 2以降の機能追加や国際化対応を見据えた柔軟な設計構造
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Phase 2対応準備</h3>
              <ul className="text-blue-100 text-sm space-y-1">
                <li>• 認証システム用ディレクトリ準備</li>
                <li>• ダッシュボード用コンポーネント設計</li>
                <li>• API統合用ヘルパー準備</li>
              </ul>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">国際化対応</h3>
              <ul className="text-blue-100 text-sm space-y-1">
                <li>• 多言語対応用の構造準備</li>
                <li>• 地域別設定の考慮</li>
                <li>• RTL言語対応の準備</li>
              </ul>
            </div>
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">分析・追跡</h3>
              <ul className="text-blue-100 text-sm space-y-1">
                <li>• イベント追跡の体系化</li>
                <li>• ユーザー行動分析の実装</li>
                <li>• A/Bテスト基盤の準備</li>
              </ul>
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