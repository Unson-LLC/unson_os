# カラーパレット

## 🎨 LP Suite カラーシステム

LP Suiteは、Tailwind CSSのカラーパレットをベースに、データ可視化とユーザビリティを重視したカラーシステムを採用しています。

## 🔵 Primary Colors（メインカラー）

### Blue - アクション・情報
```scss
// Primary Blue
$blue-50:  #eff6ff;   // 背景・ハイライト
$blue-100: #dbeafe;   // ホバー背景
$blue-500: #3b82f6;   // メインアクション
$blue-600: #2563eb;   // デフォルトボタン
$blue-700: #1d4ed8;   // アクティブ状態
$blue-900: #1e3a8a;   // 見出し・強調テキスト
```

**使用例:**
- メインボタン: `bg-blue-600 hover:bg-blue-700`
- リンク: `text-blue-600`
- 選択状態: `bg-blue-50 border-blue-200`

## 🟢 Success Colors（成功・上昇）

### Green - ポジティブ指標
```scss
// Success Green
$green-50:  #f0fdf4;   // 成功メッセージ背景
$green-100: #dcfce7;   // バッジ背景
$green-500: #22c55e;   // アイコン
$green-600: #16a34a;   // 成功ボタン
$green-700: #15803d;   // ホバー状態
```

**使用例:**
- CVR上昇: `text-green-600`
- 成功アラート: `bg-green-50 border-green-200`
- 上昇トレンド: `TrendingUp` アイコン + `text-green-600`

## 🔴 Danger Colors（エラー・下降）

### Red - 警告・ネガティブ指標
```scss
// Danger Red
$red-50:  #fef2f2;     // エラー背景
$red-100: #fee2e2;     // バッジ背景
$red-500: #ef4444;     // アイコン・エラーテキスト
$red-600: #dc2626;     // エラーボタン
$red-700: #b91c1c;     // ホバー状態
```

**使用例:**
- CTR下降: `text-red-600`
- エラーアラート: `bg-red-50 border-red-200`
- 削除ボタン: `bg-red-600 hover:bg-red-700`

## 🟡 Warning Colors（警告・注意）

### Yellow/Amber - 中間状態・警告
```scss
// Warning Amber
$amber-50:  #fffbeb;   // 警告背景
$amber-100: #fef3c7;   // バッジ背景
$amber-500: #f59e0b;   // 警告アイコン
$amber-600: #d97706;   // 警告ボタン
$amber-700: #b45309;   // ホバー状態
```

**使用例:**
- CPA警告: `text-amber-600`
- 一時停止ステータス: `bg-amber-100 text-amber-800`
- 注意アラート: `bg-amber-50 border-amber-200`

## ⚫ Neutral Colors（基本・グレー）

### Gray - 基本テキスト・UI要素
```scss
// Neutral Gray
$gray-50:  #f9fafb;    // 背景・セクション区切り
$gray-100: #f3f4f6;    // 無効状態背景
$gray-200: #e5e7eb;    // ボーダー・区切り線
$gray-300: #d1d5db;    // プレースホルダー
$gray-400: #9ca3af;    // 無効状態テキスト・アイコン
$gray-500: #6b7280;    // 補足テキスト
$gray-600: #4b5563;    // 本文テキスト
$gray-700: #374151;    // 見出し（小）
$gray-800: #1f2937;    // 見出し（大）
$gray-900: #111827;    // 最重要テキスト
```

**使用例:**
- ページ背景: `bg-gray-50`
- カード背景: `bg-white border border-gray-200`
- 本文: `text-gray-700`
- 補足情報: `text-gray-500`

## 📊 Data Visualization Colors

### グラフ・チャート専用パレット
```scss
// Chart Colors
$chart-blue:    #3b82f6;  // Impressions（インプレッション）
$chart-green:   #10b981;  // Clicks（クリック）
$chart-red:     #ef4444;  // Cost（コスト）
$chart-amber:   #f59e0b;  // Conversions（コンバージョン）
$chart-purple:  #8b5cf6;  // CTR
$chart-pink:    #ec4899;  // CVR
$chart-cyan:    #06b6d4;  // CPC
$chart-orange:  #f97316;  // CPA
```

**使用マッピング:**
```typescript
const CHART_COLORS = {
  impressions: '#3b82f6',   // Blue
  clicks: '#10b981',        // Green
  cost: '#ef4444',          // Red
  conversions: '#f59e0b',   // Amber
  ctr: '#8b5cf6',          // Purple
  cvr: '#ec4899',          // Pink
  cpc: '#06b6d4',          // Cyan
  cpa: '#f97316'           // Orange
} as const
```

## 🏷️ Status Indicator Colors

### ステータス表示用カラー
```scss
// Status Colors
$status-running:   #10b981;  // 🟢 運用中
$status-paused:    #f59e0b;   // 🟡 一時停止
$status-completed: #3b82f6;   // 🔵 完了
$status-draft:     #6b7280;   // ⚪ 下書き
$status-error:     #ef4444;   // 🔴 エラー
```

**実装例:**
```tsx
const statusConfig = {
  running: { 
    color: 'green', 
    bg: 'bg-green-100', 
    text: 'text-green-800',
    icon: '🟢' 
  },
  paused: { 
    color: 'amber', 
    bg: 'bg-amber-100', 
    text: 'text-amber-800',
    icon: '🟡' 
  },
  completed: { 
    color: 'blue', 
    bg: 'bg-blue-100', 
    text: 'text-blue-800',
    icon: '🔵' 
  },
  draft: { 
    color: 'gray', 
    bg: 'bg-gray-100', 
    text: 'text-gray-800',
    icon: '⚪' 
  }
}
```

## ⚡ Interactive Colors

### ホバー・フォーカス状態
```scss
// Interactive States
.hover-blue { @apply hover:bg-blue-50; }
.hover-green { @apply hover:bg-green-50; }
.hover-red { @apply hover:bg-red-50; }
.hover-gray { @apply hover:bg-gray-100; }

// Focus States
.focus-blue { @apply focus:ring-2 focus:ring-blue-500 focus:ring-offset-2; }
.focus-green { @apply focus:ring-2 focus:ring-green-500 focus:ring-offset-2; }
```

## 🌓 Dark Mode Support（将来実装）

### ダークテーマ対応カラー
```scss
// Dark Mode Colors
$dark-bg-primary:   #1f2937;   // メイン背景
$dark-bg-secondary: #374151;   // カード背景
$dark-text-primary: #f9fafb;   // メインテキスト
$dark-text-secondary: #d1d5db; // 補足テキスト
$dark-border: #4b5563;         // ボーダー
```

## 📏 Usage Guidelines

### ✅ 推奨パターン
```tsx
// メトリクスカード - 成功状態
<div className="bg-white border border-gray-200 rounded-lg p-4">
  <span className="text-green-600">↑ 4.14%</span>
</div>

// アラート - 警告
<div className="bg-amber-50 border border-amber-200 rounded p-3">
  <span className="text-amber-800">⚠️ CTR低下を検知</span>
</div>

// ボタン - メインアクション
<button className="bg-blue-600 hover:bg-blue-700 text-white">
  詳細を見る
</button>
```

### ❌ 避けるべきパターン
```tsx
// カラーの混在（統一性の欠如）
<span className="text-red-500">成功</span> // 意味と色が不一致

// 低コントラスト
<span className="text-gray-400 bg-gray-300">テキスト</span> // 読みにくい

// 過度な色使用
<div className="bg-red-100 border-2 border-blue-500 text-green-800"> // カラフル過ぎ
```

## 🎨 Design Tokens

### CSS Custom Properties
```css
:root {
  /* Primary */
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  
  /* Success */
  --color-success-50: #f0fdf4;
  --color-success-500: #22c55e;
  --color-success-600: #16a34a;
  
  /* Warning */
  --color-warning-50: #fffbeb;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  
  /* Danger */
  --color-danger-50: #fef2f2;
  --color-danger-500: #ef4444;
  --color-danger-600: #dc2626;
}
```

### TypeScript型定義
```typescript
export type ColorVariant = 
  | 'primary' 
  | 'success' 
  | 'warning' 
  | 'danger' 
  | 'neutral'

export type ColorShade = 
  | '50' | '100' | '200' | '300' | '400' 
  | '500' | '600' | '700' | '800' | '900'

export interface ColorConfig {
  variant: ColorVariant
  shade: ColorShade
  className: string
}
```

---

**最終更新**: 2025年9月4日  
**カラーシステムバージョン**: v1.0  
**ベース**: Tailwind CSS v3.x