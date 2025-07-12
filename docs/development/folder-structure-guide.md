# Unson OS フォルダ構成ガイド

## 🎯 **設計原則**

### **3大開発原則**
- **YAGNI**: 今必要でない機能は作らない
- **DRY**: 同じコードを繰り返さない  
- **KISS**: シンプルに保つ

### **追加原則**
- **機能別分離**: 関連するコードは近くに配置
- **階層の明確化**: 3階層を超えない構造
- **スケーラビリティ**: 成長に応じた拡張可能性
- **チーム開発最適化**: 誰でも迷わず見つけられる構造

## 📁 **推奨フォルダ構成**

### **ルートレベル**
```
unson_os/
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
└── .github/                        # GitHub設定
```

### **Convexバックエンド構成**
```
convex/
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
└── README.md                      # Convex設計書
```

### **フロントエンド src/ 構成**
```
src/
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
│   ├── api/                       # API Routes（将来Convex移行）
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
│   │   ├── button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── index.ts
│   │   ├── modal/
│   │   ├── accordion/
│   │   ├── tabs/
│   │   └── index.ts               # 統一エクスポート
│   ├── forms/                     # フォーム関連
│   │   ├── waitlist-form/
│   │   │   ├── WaitlistForm.tsx
│   │   │   ├── WaitlistForm.test.tsx
│   │   │   └── index.ts
│   │   ├── contact-form/
│   │   └── index.ts
│   ├── features/                  # 機能別コンポーネント
│   │   ├── products/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductFilter.tsx
│   │   │   ├── ProductStats.tsx
│   │   │   └── index.ts
│   │   ├── navigation/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── index.ts
│   │   └── analytics/
│   ├── layout/                    # レイアウトコンポーネント
│   │   ├── header/
│   │   ├── footer/
│   │   ├── sidebar/
│   │   └── index.ts
│   └── sections/                  # ページセクション
│       ├── hero/
│       ├── cta/
│       ├── stats/
│       └── index.ts
│
├── hooks/                         # カスタムフック
│   ├── use-analytics/
│   │   ├── useAnalytics.ts
│   │   ├── useAnalytics.test.ts
│   │   └── index.ts
│   ├── use-search/
│   │   ├── useSearch.ts
│   │   ├── useSearch.test.ts
│   │   └── index.ts
│   ├── use-filter/
│   └── index.ts                   # 統一エクスポート
│
├── lib/                           # ユーティリティとヘルパー
│   ├── api/                       # API関連
│   │   ├── convex-client.ts
│   │   ├── api-utils.ts
│   │   └── types.ts
│   ├── validation/                # バリデーション
│   │   ├── schemas.ts
│   │   ├── forms.ts
│   │   └── index.ts
│   ├── utils/                     # 汎用ユーティリティ
│   │   ├── cn.ts
│   │   ├── format.ts
│   │   ├── constants.ts
│   │   └── index.ts
│   └── metadata.ts                # SEOメタデータ
│
├── store/                         # 状態管理（Zustand）
│   ├── auth-store.ts
│   ├── ui-store.ts
│   ├── products-store.ts
│   └── index.ts
│
├── types/                         # TypeScript型定義
│   ├── api.ts                     # API関連型
│   ├── auth.ts                    # 認証関連型
│   ├── products.ts                # プロダクト関連型
│   ├── forms.ts                   # フォーム関連型
│   └── index.ts                   # 統一エクスポート
│
├── config/                        # 設定ファイル
│   ├── env.ts                     # 環境変数設定
│   ├── constants.ts               # アプリケーション定数
│   ├── routes.ts                  # ルート定義
│   └── database.ts                # DB設定
│
└── data/                          # 静的データとモック
    ├── static/                    # 静的マスターデータ
    │   ├── company.ts
    │   ├── faq.ts
    │   └── products.ts
    └── mocks/                     # テスト用モック
        ├── handlers.ts
        ├── server.ts
        └── fixtures/
```

### **テスト構成の統合**
```
tests/
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
    └── setup.ts
```

## 🔧 **命名規則**

### **フォルダ命名**
```
✅ 推奨: kebab-case
user-profile/
product-detail/
contact-form/

❌ 非推奨: camelCase, PascalCase
userProfile/
ProductDetail/
contactForm/
```

### **ファイル命名**
```
コンポーネント: PascalCase.tsx
  例: Button.tsx, WaitlistForm.tsx

フック: camelCase.ts  
  例: useAnalytics.ts, useProductFilter.ts

ユーティリティ: camelCase.ts
  例: formatDate.ts, apiClient.ts

型定義: camelCase.ts
  例: userTypes.ts, apiTypes.ts

テスト: [対象ファイル名].test.ts
  例: Button.test.tsx, useAnalytics.test.ts

Storybook: [対象ファイル名].stories.tsx
  例: Button.stories.tsx
```

### **Export/Import パターン**
```typescript
// 各フォルダのindex.tsで集約エクスポート
// src/components/ui/index.ts
export { Button } from './button/Button'
export { Modal } from './modal/Modal'  
export { Accordion } from './accordion/Accordion'
export type { ButtonProps, ModalProps } from './types'

// 使用側でのクリーンな Import
import { Button, Modal } from '@/components/ui'
import { useAnalytics, useSearch } from '@/hooks'
import { formatDate, cn } from '@/lib/utils'
```

## 🚀 **段階的移行戦略**

### **Phase 1: 基盤整理（即座に実行）**
```bash
# 1. テストファイル統合
mkdir -p tests/{unit,integration,e2e,fixtures,utils}
mv src/components/__tests__/* tests/unit/components/
mv tests/e2e/* tests/e2e/critical-paths/

# 2. Route Groups導入
mkdir -p src/app/\(marketing\)
mkdir -p src/app/\(product\)
mv src/app/{about,careers,community,contact,support} src/app/\(marketing\)/
mv src/app/{products,docs} src/app/\(product\)/

# 3. コンポーネント再編成
mkdir -p src/components/{ui,forms,features,layout,sections}
mv src/components/interactive/* src/components/ui/
```

### **Phase 2: 機能別整理（2週間以内）**
```bash
# 4. フック統合
mkdir -p src/hooks/{use-analytics,use-search,use-filter}
mv src/hooks/useAnalytics.ts src/hooks/use-analytics/
mv src/hooks/useSearch.ts src/hooks/use-search/
mv src/hooks/useFilter.ts src/hooks/use-filter/

# 5. ライブラリ整理
mkdir -p src/lib/{api,validation,utils}
mv src/lib/api-utils.ts src/lib/api/
mv src/lib/validation.ts src/lib/validation/

# 6. 設定ファイル集約
mkdir -p src/config
mv src/lib/constants.ts src/config/
```

### **Phase 3: 高度な機能（1ヶ月以内）**
```bash
# 7. 機能別モジュール化
mkdir -p src/features/{products,analytics,navigation}

# 8. 型定義体系化
mkdir -p src/types
# 機能別型定義ファイルの作成

# 9. Storybook導入
# コンポーネントカタログの作成
```

## 📋 **開発ルール**

### **新しいコンポーネント作成時**
```bash
# 1. 適切なフォルダに配置
src/components/ui/新コンポーネント/

# 2. 必要ファイルを作成
ComponentName.tsx      # メイン実装
ComponentName.test.tsx # テスト
ComponentName.stories.tsx # Storybook（UI コンポーネントのみ）
index.ts              # エクスポート
types.ts              # 型定義（必要時）

# 3. 親フォルダのindex.tsに追加
echo "export { ComponentName } from './新コンポーネント'" >> ../index.ts
```

### **新機能追加時**
```bash
# 1. 機能別フォルダ作成
src/features/新機能名/

# 2. 必要なサブフォルダ作成
components/  # 機能専用コンポーネント
hooks/      # 機能専用フック
lib/        # 機能専用ユーティリティ
types/      # 機能専用型定義

# 3. テストフォルダも同時作成
tests/unit/features/新機能名/
tests/integration/features/新機能名/
```

### **Import順序ルール**
```typescript
// 1. React・Next.js
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
import './Component.css'
```

## ⚠️ **注意事項**

### **避けるべきパターン**
```
❌ 深すぎる階層
src/components/ui/forms/inputs/text/variants/primary/

❌ 機能横断的な配置
src/utils/productUtils.ts
src/utils/userUtils.ts
src/utils/analyticsUtils.ts

❌ 曖昧な命名
src/components/misc/
src/lib/helpers/
src/utils/stuff/
```

### **推奨パターン**
```
✅ 機能別まとめ
src/features/products/
  ├── components/
  ├── hooks/
  ├── lib/
  └── types/

✅ 明確な責任
src/components/ui/       # 再利用可能UIコンポーネント
src/components/features/ # 機能特化コンポーネント
src/lib/api/            # API通信専用
src/lib/validation/     # バリデーション専用
```

## 🎯 **目標状態**

この構成により以下を実現：

- **🔍 発見しやすさ**: 欲しいファイルが3秒で見つかる
- **🔧 保守しやすさ**: 影響範囲が明確で安全な変更
- **🚀 拡張しやすさ**: 新機能追加時の配置指針が明確
- **👥 チーム開発**: 誰でも迷わない一貫した構造
- **⚡ 開発効率**: import 文が短く、自動補完が効く
- **🧪 テスト容易性**: テスト対象とテストファイルの対応が明確

---

この構成ガイドを段階的に適用することで、Unson OSプロジェクトの開発効率とコード品質が大幅に向上します。