# UnsonOS LP フォルダ構成設計

## 概要

Next.js 14 App Router + TypeScript + Tailwind CSSを使用したランディングページの推奨フォルダ構成。Phase 1から3までの段階的拡張に対応。

## プロジェクト構成

```
unson-os-lp/
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
│   ├── images/                  # 画像素材
│   │   ├── logos/              # ロゴ素材
│   │   ├── icons/              # アイコン
│   │   ├── screenshots/        # スクリーンショット
│   │   ├── illustrations/      # イラスト
│   │   └── og/                 # OGP画像
│   ├── videos/                 # 動画素材
│   ├── documents/              # PDF等のドキュメント
│   ├── favicon.ico             # ファビコン
│   ├── robots.txt              # クローラー設定
│   └── sitemap.xml             # サイトマップ
│
└── src/                        # ソースコード
    ├── app/                    # App Router (Next.js 14)
    │   ├── globals.css         # グローバルスタイル
    │   ├── layout.tsx          # ルートレイアウト
    │   ├── page.tsx            # メインLP (/)
    │   ├── loading.tsx         # ローディングUI
    │   ├── error.tsx           # エラーUI
    │   ├── not-found.tsx       # 404ページ
    │   │
    │   ├── dao/                # DAO参加者向け (/dao)
    │   │   ├── page.tsx
    │   │   ├── layout.tsx
    │   │   └── components/     # DAO固有コンポーネント
    │   │       ├── DAOSimulator.tsx
    │   │       ├── RevenueCalculator.tsx
    │   │       └── ContributionExamples.tsx
    │   │
    │   ├── investors/          # 投資家向け (/investors)
    │   │   ├── page.tsx
    │   │   ├── layout.tsx
    │   │   └── components/     # 投資家固有コンポーネント
    │   │       ├── BusinessModel.tsx
    │   │       ├── MarketSize.tsx
    │   │       └── InvestmentTerms.tsx
    │   │
    │   ├── waitlist/           # 早期アクセス登録 (/waitlist)
    │   │   ├── page.tsx
    │   │   └── components/
    │   │       └── WaitlistForm.tsx
    │   │
    │   ├── docs/               # ドキュメント (/docs)
    │   │   ├── page.tsx
    │   │   ├── layout.tsx
    │   │   └── [slug]/
    │   │       └── page.tsx    # 動的ドキュメントページ
    │   │
    │   ├── blog/               # ブログ (/blog)
    │   │   ├── page.tsx
    │   │   ├── layout.tsx
    │   │   └── [slug]/
    │   │       └── page.tsx    # 動的ブログ記事
    │   │
    │   └── api/                # API Routes
    │       ├── contact/
    │       │   └── route.ts    # お問い合わせAPI
    │       ├── waitlist/
    │       │   └── route.ts    # ウェイトリスト登録API
    │       ├── analytics/
    │       │   └── route.ts    # 分析データAPI
    │       └── notion/
    │           └── route.ts    # Notion CMS連携API
    │
    ├── components/             # 再利用可能コンポーネント
    │   ├── ui/                 # 基本UIコンポーネント
    │   │   ├── Button.tsx      # ボタンコンポーネント
    │   │   ├── Input.tsx       # 入力フィールド
    │   │   ├── Modal.tsx       # モーダル
    │   │   ├── Card.tsx        # カード
    │   │   ├── Badge.tsx       # バッジ
    │   │   ├── Avatar.tsx      # アバター
    │   │   ├── Skeleton.tsx    # スケルトンローダー
    │   │   └── index.ts        # エクスポート設定
    │   │
    │   ├── layout/             # レイアウトコンポーネント
    │   │   ├── Header.tsx      # ヘッダー
    │   │   ├── Footer.tsx      # フッター
    │   │   ├── Navigation.tsx  # ナビゲーション
    │   │   ├── Sidebar.tsx     # サイドバー
    │   │   └── Container.tsx   # コンテナ
    │   │
    │   ├── sections/           # セクションコンポーネント
    │   │   ├── Hero.tsx        # ヒーローセクション
    │   │   ├── Features.tsx    # 機能紹介
    │   │   ├── Testimonials.tsx# 体験談
    │   │   ├── Pricing.tsx     # 価格設定
    │   │   ├── FAQ.tsx         # よくある質問
    │   │   ├── CTA.tsx         # コールトゥアクション
    │   │   └── Stats.tsx       # 統計・実績
    │   │
    │   ├── forms/              # フォームコンポーネント
    │   │   ├── ContactForm.tsx # お問い合わせフォーム
    │   │   ├── WaitlistForm.tsx# ウェイトリスト登録
    │   │   ├── NewsletterForm.tsx # ニュースレター
    │   │   └── FeedbackForm.tsx# フィードバック
    │   │
    │   ├── interactive/        # インタラクティブコンポーネント
    │   │   ├── RevenueCounter.tsx    # リアルタイム収益カウンター
    │   │   ├── DAOSimulator.tsx      # DAO配当シミュレーター
    │   │   ├── ProductGenerator.tsx  # プロダクト生成プレビュー
    │   │   ├── AnimatedChart.tsx     # アニメーション付きチャート
    │   │   └── InteractiveTimeline.tsx # インタラクティブタイムライン
    │   │
    │   └── analytics/          # 分析・追跡コンポーネント
    │       ├── GoogleAnalytics.tsx   # GA4統合
    │       ├── HotjarTracking.tsx    # Hotjar統合
    │       ├── VercelAnalytics.tsx   # Vercel Analytics
    │       └── ConversionTracking.tsx # コンバージョン追跡
    │
    ├── lib/                    # ユーティリティライブラリ
    │   ├── utils.ts            # 汎用ユーティリティ
    │   ├── constants.ts        # 定数定義
    │   ├── validations.ts      # バリデーション関数
    │   ├── api.ts              # API関連ユーティリティ
    │   ├── analytics.ts        # 分析関連ユーティリティ
    │   ├── notion.ts           # Notion API関連
    │   ├── email.ts            # メール送信関連
    │   └── formatting.ts       # データフォーマット関数
    │
    ├── hooks/                  # カスタムフック
    │   ├── useLocalStorage.ts  # ローカルストレージフック
    │   ├── useAnalytics.ts     # 分析フック
    │   ├── useApiRequest.ts    # API リクエストフック
    │   ├── useIntersection.ts  # Intersection Observer
    │   ├── useScroll.ts        # スクロール検知
    │   └── useDeviceDetect.ts  # デバイス検知
    │
    ├── store/                  # 状態管理 (Zustand)
    │   ├── useGlobalStore.ts   # グローバル状態
    │   ├── useUIStore.ts       # UI状態
    │   ├── useUserStore.ts     # ユーザー状態
    │   └── useAnalyticsStore.ts# 分析データ状態
    │
    ├── types/                  # TypeScript型定義
    │   ├── index.ts            # 基本型定義
    │   ├── api.ts              # API関連型
    │   ├── components.ts       # コンポーネント型
    │   ├── notion.ts           # Notion API型
    │   └── analytics.ts        # 分析関連型
    │
    ├── styles/                 # スタイル関連
    │   ├── globals.css         # グローバルスタイル
    │   ├── components.css      # コンポーネント用スタイル
    │   └── animations.css      # アニメーション定義
    │
    ├── data/                   # 静的データ
    │   ├── navigation.ts       # ナビゲーションデータ
    │   ├── features.ts         # 機能データ
    │   ├── testimonials.ts     # 体験談データ
    │   ├── faq.ts              # FAQ データ
    │   ├── pricing.ts          # 価格データ
    │   └── team.ts             # チームデータ
    │
    └── config/                 # 設定ファイル
        ├── database.ts         # データベース設定
        ├── email.ts            # メール設定
        ├── analytics.ts        # 分析ツール設定
        ├── api.ts              # API設定
        └── constants.ts        # アプリ定数
```

---

## 主要設定ファイル

### package.json
```json
{
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
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.320.0",
    "clsx": "^2.1.0",
    "class-variance-authority": "^0.7.0",
    "tailwind-merge": "^2.2.0",
    "zustand": "^4.5.0",
    "@notionhq/client": "^2.2.0",
    "resend": "^3.2.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "react-hook-form": "^7.49.0"
  },
  "devDependencies": {
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.1.0",
    "prettier": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.5.0",
    "@next/bundle-analyzer": "^14.1.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
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

module.exports = nextConfig
```

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
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
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
```

---

## 開発ガイドライン

### コンポーネント設計原則

1. **Single Responsibility**: 各コンポーネントは単一の責任を持つ
2. **Props Interface**: 明確なProps型定義
3. **Composition Pattern**: 合成パターンの活用
4. **Accessibility**: WCAG 2.1 AA準拠

### ファイル命名規則

- **コンポーネント**: PascalCase (例: `HeroSection.tsx`)
- **フック**: camelCase with "use" prefix (例: `useAnalytics.ts`)
- **ユーティリティ**: camelCase (例: `formatCurrency.ts`)
- **定数**: UPPER_SNAKE_CASE (例: `API_ENDPOINTS.ts`)

### インポート順序

```typescript
// 1. React/Next.js関連
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
import type { ComponentProps } from '@/types'
```

---

## セキュリティ・パフォーマンス対策

### セキュリティ
- 環境変数の適切な管理
- CSP (Content Security Policy) の設定
- API Routeの認証・認可
- XSS対策の実装

### パフォーマンス
- 画像最適化 (next/image)
- バンドルサイズ最適化
- 遅延ローディング
- キャッシュ戦略

### SEO対策
- メタデータの適切な設定
- 構造化データの実装
- サイトマップ自動生成
- Open Graph対応

---

## 拡張性への配慮

### Phase 2対応準備
- 認証システム用ディレクトリ準備
- ダッシュボード用コンポーネント設計
- API統合用ヘルパー準備

### 国際化対応
- 多言語対応用の構造準備
- 地域別設定の考慮
- RTL言語対応の準備

### 分析・追跡
- イベント追跡の体系化
- ユーザー行動分析の実装
- A/Bテスト基盤の準備