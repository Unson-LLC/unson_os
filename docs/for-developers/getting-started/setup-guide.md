# UnsonOS LP セットアップガイド

## 概要

UnsonOS ランディングページの開発環境セットアップ手順。Next.js 14 + TypeScript + Tailwind CSS環境の構築からデプロイまでを網羅。

## 前提条件

### 必要ソフトウェア
- **Node.js**: v18.17.0以上
- **npm**: v9.0.0以上（または yarn/pnpm）
- **Git**: v2.34.0以上
- **エディタ**: VS Code推奨

### 必要アカウント
- GitHub（コード管理）
- Vercel（デプロイ）
- Notion（CMS）※Optional
- Google Analytics（分析）※Optional

---

## プロジェクト初期化

### 1. Next.js プロジェクト作成

```bash
# プロジェクト作成
npx create-next-app@latest unson-os-lp --typescript --tailwind --eslint --app --src-dir

cd unson-os-lp

# 追加依存関係のインストール
npm install framer-motion lucide-react clsx class-variance-authority tailwind-merge zustand @notionhq/client resend zod @hookform/resolvers react-hook-form

# 開発依存関係のインストール
npm install -D prettier prettier-plugin-tailwindcss @next/bundle-analyzer autoprefixer postcss
```

### 2. 設定ファイルの追加

#### .env.local
```bash
# 環境変数ファイル作成
touch .env.local
```

```env
# .env.local
# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Notion CMS（オプション）
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_database_id

# メール送信（オプション）
RESEND_API_KEY=your_resend_api_key

# Analytics（オプション）
NEXT_PUBLIC_GA_MEASUREMENT_ID=your_ga_id
NEXT_PUBLIC_HOTJAR_ID=your_hotjar_id

# API Keys
OPENAI_API_KEY=your_openai_api_key
```

#### .env.example
```env
# .env.example（GitHubにコミット用）
NEXT_PUBLIC_APP_URL=http://localhost:3000
NOTION_API_KEY=
NOTION_DATABASE_ID=
RESEND_API_KEY=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_HOTJAR_ID=
OPENAI_API_KEY=
```

#### .prettierrc
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

#### .eslintrc.json
```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "prefer-const": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

---

## フォルダ構造セットアップ

### 3. 基本ディレクトリ作成

```bash
# srcディレクトリ内の構造作成
mkdir -p src/{components/{ui,layout,sections,forms,interactive,analytics},lib,hooks,store,types,styles,data,config}

# componentsサブディレクトリ
mkdir -p src/components/{ui,layout,sections,forms,interactive,analytics}

# appディレクトリ構造
mkdir -p src/app/{dao,investors,waitlist,docs,blog,api/{contact,waitlist,analytics,notion}}

# publicディレクトリ構造
mkdir -p public/{images/{logos,icons,screenshots,illustrations,og},videos,documents}
```

### 4. 基本ファイル作成

#### src/lib/utils.ts
```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

#### src/lib/constants.ts
```typescript
export const SITE_CONFIG = {
  name: 'UnsonOS',
  description: '100個のマイクロSaaSを2週間で自動生成する次世代プラットフォーム',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://unson-os.com',
  ogImage: '/og/default.png',
  links: {
    discord: 'https://discord.gg/ubDYjDVC',
    github: 'https://github.com/unson-llc/unson-os',
    twitter: 'https://twitter.com/unsonos',
  },
} as const

export const REVENUE_DISTRIBUTION = {
  OPERATIONS: 0.45,
  FOUNDERS: 0.15,
  COMMUNITY: 0.40,
} as const

export const CONTRIBUTION_POINTS = {
  CODE_COMMIT: 3,
  BUG_FIX: 2,
  DESIGN: 2,
  QA_RESPONSE: 1,
} as const

export const API_ENDPOINTS = {
  CONTACT: '/api/contact',
  WAITLIST: '/api/waitlist',
  ANALYTICS: '/api/analytics',
  NOTION: '/api/notion',
} as const
```

#### src/types/index.ts
```typescript
export interface SiteConfig {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    discord: string
    github: string
    twitter: string
  }
}

export interface ContributionMetrics {
  codeCommits: number
  bugFixes: number
  designs: number
  qaSessions: number
}

export interface RevenueData {
  totalRevenue: number
  monthlyRevenue: number
  activeProducts: number
  communityMembers: number
  lastUpdated: Date
}

export interface ProductIdea {
  name: string
  description: string
  targetPrice: number
  estimatedUsers: number
  features: string[]
  techStack: string[]
}

export interface WaitlistEntry {
  email: string
  name?: string
  role?: 'developer' | 'designer' | 'marketer' | 'investor' | 'other'
  interests?: string[]
  source?: string
}

export interface ContactForm {
  name: string
  email: string
  company?: string
  message: string
  type: 'general' | 'partnership' | 'investment' | 'press'
}
```

---

## コンポーネント実装

### 5. 基本UIコンポーネント

#### src/components/ui/Button.tsx
```typescript
import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-gray-300 hover:bg-gray-50",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "hover:bg-gray-100",
        link: "underline-offset-4 hover:underline text-blue-600",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

#### src/components/ui/Input.tsx
```typescript
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

#### src/components/ui/Card.tsx
```typescript
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Card = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

export { Card }
```

---

## アプリケーション設定

### 6. Tailwind CSS設定

#### tailwind.config.js
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
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
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
  ],
}
```

### 7. Next.js設定

#### next.config.js
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

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
```

---

## 基本ページ実装

### 8. レイアウト設定

#### src/app/layout.tsx
```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SITE_CONFIG } from '@/lib/constants'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: ['SaaS', 'AI', 'DAO', 'マイクロSaaS', 'スタートアップ'],
  authors: [{ name: 'Unson LLC' }],
  creator: 'Unson LLC',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
    creator: '@unsonos',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
```

#### src/app/page.tsx
```typescript
import { Hero } from '@/components/sections/Hero'
import { Features } from '@/components/sections/Features'
import { RevenueCounter } from '@/components/interactive/RevenueCounter'
import { DAOSimulator } from '@/components/interactive/DAOSimulator'
import { ProductGenerator } from '@/components/interactive/ProductGenerator'
import { Testimonials } from '@/components/sections/Testimonials'
import { FAQ } from '@/components/sections/FAQ'
import { CTA } from '@/components/sections/CTA'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <RevenueCounter />
      <Features />
      <DAOSimulator />
      <ProductGenerator />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}
```

---

## 開発・デプロイ

### 9. 開発サーバー起動

```bash
# 開発サーバー起動
npm run dev

# ブラウザで確認
# http://localhost:3000
```

### 10. ビルド・テスト

```bash
# 型チェック
npm run type-check

# リンター実行
npm run lint

# フォーマット
npm run format

# プロダクションビルド
npm run build

# ビルド結果確認
npm run start
```

### 11. Vercelデプロイ

```bash
# Vercel CLI インストール
npm i -g vercel

# Vercelにログイン
vercel login

# プロジェクトデプロイ
vercel

# 環境変数設定（Vercelダッシュボードで設定）
# または CLI で設定
vercel env add NOTION_API_KEY
vercel env add RESEND_API_KEY
# など...

# カスタムドメイン設定
vercel domains add unson-os.com
```

---

## 外部サービス連携

### 12. Notion CMS設定

1. **Notion Integration作成**
   - https://www.notion.com/my-integrations
   - 新しいIntegration作成
   - API Key取得

2. **データベース作成**
   - Notionでブログ用データベース作成
   - IntegrationをDBに招待
   - Database ID取得

3. **環境変数設定**
   ```env
   NOTION_API_KEY=secret_xxx...
   NOTION_DATABASE_ID=xxx-xxx-xxx...
   ```

### 13. メール送信設定（Resend）

1. **Resendアカウント作成**
   - https://resend.com/
   - API Key取得

2. **環境変数設定**
   ```env
   RESEND_API_KEY=re_xxx...
   ```

### 14. Analytics設定

1. **Google Analytics**
   - GA4プロパティ作成
   - Measurement ID取得
   ```env
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

2. **Hotjar**（オプション）
   - Hotjarアカウント作成
   - Site ID取得
   ```env
   NEXT_PUBLIC_HOTJAR_ID=12345
   ```

---

## トラブルシューティング

### よくある問題と解決方法

#### Node.js バージョンエラー
```bash
# Node.js バージョン確認
node --version

# nvmでバージョン管理（推奨）
nvm install 18
nvm use 18
```

#### 依存関係エラー
```bash
# node_modules削除
rm -rf node_modules package-lock.json

# 再インストール
npm install
```

#### Tailwind CSS スタイル適用されない
```bash
# Tailwind CSS設定確認
npx tailwindcss -i ./src/app/globals.css -o ./dist/output.css --watch
```

#### ビルドエラー
```bash
# 型エラー確認
npm run type-check

# ESLintエラー確認
npm run lint

# 詳細ログでビルド
npm run build --verbose
```

---

## 次のステップ

### Phase 1完了後のタスク
1. **パフォーマンス最適化**
   - Lighthouse スコア改善
   - 画像最適化
   - バンドルサイズ削減

2. **SEO対策**
   - サイトマップ生成
   - 構造化データ追加
   - メタデータ最適化

3. **分析基盤強化**
   - イベント追跡実装
   - コンバージョンファネル分析
   - A/Bテスト準備

4. **Phase 2準備**
   - 認証システム検討
   - ダッシュボード設計
   - API設計・実装

### おすすめ追加ツール
- **Storybook**: コンポーネント開発
- **Jest + Testing Library**: テスト
- **Chromatic**: ビジュアルテスト
- **Sentry**: エラー監視
- **Plausible**: プライバシー重視Analytics

### UnsonOS Web テンプレート
最新の技術スタックを統合したテンプレートも利用可能です：
- **[UnsonOS Web Template](https://github.com/Unson-LLC/unson-os-web-template)**
  - 上記セットアップが完了済み
  - Convex、Bun、Moonなど最新スタック統合
  - すぐに開発を開始可能

---

## リソース

### 公式ドキュメント
- [Next.js 14](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Vercel](https://vercel.com/docs)

### 参考リポジトリ
- [shadcn/ui](https://github.com/shadcn-ui/ui)
- [tailwindui](https://tailwindui.com/)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)

### コミュニティ
- [Next.js Discord](https://discord.gg/nextjs)
- [Tailwind CSS Discord](https://discord.gg/tailwindcss)
- [Unson OS Discord](https://discord.gg/ubDYjDVC)（準備中）