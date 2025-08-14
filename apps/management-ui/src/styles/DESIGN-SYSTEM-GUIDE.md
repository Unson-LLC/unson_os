# UnsonOS Design System 使用ガイド

## 📚 概要

UnsonOS Design Systemは、一貫性のあるUIを構築するための包括的なCSSフレームワークです。
Tailwind CSSと併用可能で、グローバルに適用される統一されたデザイン言語を提供します。

## 🎨 デザイン原則

1. **STAY SMALL** - 最小限のコードで最大の効果
2. **一貫性** - 全体を通じて統一されたビジュアル言語
3. **アクセシビリティ** - すべてのユーザーが使いやすい
4. **パフォーマンス** - 軽量で高速

## 🚀 クイックスタート

### 基本的な使い方

```jsx
// ボタンの例
<button className="btn btn-primary">
  保存
</button>

// カードの例
<div className="card">
  <div className="card-header">
    <h3 className="card-title">タイトル</h3>
  </div>
  <div className="card-body">
    コンテンツ
  </div>
</div>

// KPIカードの例
<div className="kpi-card">
  <div className="kpi-label">総売上</div>
  <div className="kpi-value">¥1,234,567</div>
  <div className="kpi-change positive">+12.5%</div>
</div>
```

## 📖 コンポーネント一覧

### ボタン (Buttons)

```html
<!-- プライマリボタン -->
<button className="btn btn-primary">プライマリ</button>

<!-- セカンダリボタン -->
<button className="btn btn-secondary">セカンダリ</button>

<!-- アクセントボタン -->
<button className="btn btn-accent">アクセント</button>

<!-- 成功ボタン -->
<button className="btn btn-success">成功</button>

<!-- 危険ボタン -->
<button className="btn btn-danger">削除</button>

<!-- ゴーストボタン -->
<button className="btn btn-ghost">ゴースト</button>

<!-- サイズバリエーション -->
<button className="btn btn-primary btn-sm">小</button>
<button className="btn btn-primary">中</button>
<button className="btn btn-primary btn-lg">大</button>
```

### カード (Cards)

```html
<div className="card">
  <div className="card-header">
    <h3 className="card-title">カードタイトル</h3>
  </div>
  <div className="card-body">
    カードの本文がここに入ります
  </div>
</div>
```

### フォーム (Forms)

```html
<div className="form-group">
  <label className="form-label">メールアドレス</label>
  <input type="email" className="form-input" placeholder="example@unson.os">
  <span className="form-error">有効なメールアドレスを入力してください</span>
</div>

<div className="form-group">
  <label className="form-label">プラン選択</label>
  <select className="form-select">
    <option>スタンダード</option>
    <option>プレミアム</option>
  </select>
</div>
```

### バッジ (Badges)

```html
<span className="badge badge-primary">新規</span>
<span className="badge badge-success">アクティブ</span>
<span className="badge badge-warning">保留中</span>
<span className="badge badge-error">エラー</span>
```

### アラート (Alerts)

```html
<div className="alert alert-success">
  操作が正常に完了しました
</div>

<div className="alert alert-warning">
  注意が必要な項目があります
</div>

<div className="alert alert-error">
  エラーが発生しました
</div>

<div className="alert alert-info">
  お知らせ：メンテナンスを予定しています
</div>
```

### UnsonOS固有コンポーネント

#### フェーズインジケーター

```html
<span className="phase-indicator phase-research">リサーチ</span>
<span className="phase-indicator phase-lp">LP検証</span>
<span className="phase-indicator phase-mvp">MVP開発</span>
<span className="phase-indicator phase-monetization">収益化</span>
<span className="phase-indicator phase-scale">スケール</span>
```

#### KPIカード

```html
<div className="kpi-card">
  <div className="kpi-label">月間売上</div>
  <div className="kpi-value">¥450,000</div>
  <div className="kpi-change positive">+15.2%</div>
</div>
```

#### ステータスインジケーター

```html
<div className="status-indicator status-healthy">
  <span className="status-dot"></span>
  <span>正常稼働中</span>
</div>

<div className="status-indicator status-warning">
  <span className="status-dot"></span>
  <span>要注意</span>
</div>

<div className="status-indicator status-critical">
  <span className="status-dot"></span>
  <span>緊急対応必要</span>
</div>
```

## 🎨 カラーシステム

### CSS変数として使用

```css
.custom-element {
  color: var(--color-primary-600);
  background-color: var(--color-secondary-100);
}
```

### ユーティリティクラス

```html
<!-- テキストカラー -->
<p className="text-primary">プライマリテキスト</p>
<p className="text-secondary">セカンダリテキスト</p>
<p className="text-muted">ミューテッドテキスト</p>
<p className="text-success">成功テキスト</p>
<p className="text-warning">警告テキスト</p>
<p className="text-error">エラーテキスト</p>

<!-- 背景色 -->
<div className="bg-primary-light">プライマリ背景</div>
<div className="bg-secondary">セカンダリ背景</div>
<div className="bg-success">成功背景</div>
<div className="bg-warning">警告背景</div>
<div className="bg-error">エラー背景</div>
```

## 📏 スペーシング

```html
<!-- パディング -->
<div className="p-0">パディング0</div>
<div className="p-1">パディング1 (4px)</div>
<div className="p-2">パディング2 (8px)</div>
<div className="p-3">パディング3 (12px)</div>
<div className="p-4">パディング4 (16px)</div>
<div className="p-6">パディング6 (24px)</div>
<div className="p-8">パディング8 (32px)</div>

<!-- マージン -->
<div className="m-0">マージン0</div>
<div className="m-1">マージン1 (4px)</div>
<div className="m-2">マージン2 (8px)</div>
<!-- ... 以下同様 ... -->
```

## 🔤 タイポグラフィ

```html
<!-- テキストサイズ -->
<p className="text-xs">極小テキスト (12px)</p>
<p className="text-sm">小テキスト (14px)</p>
<p className="text-base">基本テキスト (16px)</p>
<p className="text-lg">大テキスト (18px)</p>
<p className="text-xl">特大テキスト (20px)</p>
<p className="text-2xl">2倍テキスト (24px)</p>
<p className="text-3xl">3倍テキスト (30px)</p>

<!-- フォントウェイト -->
<p className="font-normal">通常</p>
<p className="font-medium">ミディアム</p>
<p className="font-semibold">セミボールド</p>
<p className="font-bold">ボールド</p>
```

## 🔄 Tailwind CSSとの併用

デザインシステムはTailwind CSSと完全に互換性があります：

```jsx
// デザインシステムとTailwindの組み合わせ
<button className="btn btn-primary flex items-center gap-2">
  <Icon className="w-4 h-4" />
  <span>アイコン付きボタン</span>
</button>

// カスタムスタイルの追加
<div className="card hover:scale-105 transition-transform">
  ホバーで拡大するカード
</div>
```

## 📱 レスポンシブデザイン

```html
<!-- モバイルファースト -->
<h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
  レスポンシブなタイトル
</h1>

<div className="p-4 sm:p-6 md:p-8 lg:p-10">
  レスポンシブなパディング
</div>
```

## ♿ アクセシビリティ

```html
<!-- スクリーンリーダー専用 -->
<span className="sr-only">スクリーンリーダーのみ</span>

<!-- フォーカススタイル -->
<button className="btn btn-primary">
  自動的にフォーカススタイルが適用されます
</button>

<!-- 動きを減らす設定に対応 -->
<div className="animate-slideUp">
  prefers-reduced-motionに自動対応
</div>
```

## 🚀 パフォーマンス最適化

1. **CSS変数の活用** - 動的なテーマ切り替えが可能
2. **レイヤー化** - CSSカスケードの最適化
3. **最小限のアニメーション** - STAY SMALL哲学に基づく
4. **PurgeCSS対応** - 使用されないスタイルの自動削除

## 🔧 カスタマイズ

CSS変数を上書きすることで簡単にカスタマイズ可能：

```css
/* カスタムテーマの例 */
:root {
  --color-primary-600: #your-color;
  --font-sans: 'Your Font', sans-serif;
  --radius-md: 8px;
}
```

## 📝 ベストプラクティス

1. **セマンティックなクラス名を使用**
   - ✅ `btn btn-primary`
   - ❌ `blue-button`

2. **コンポーネントクラスを優先**
   - ✅ `card`
   - ❌ `bg-white rounded-lg shadow-sm border p-6`

3. **一貫性を保つ**
   - 同じ目的には同じコンポーネントを使用
   - カスタムスタイルは最小限に

4. **アクセシビリティを考慮**
   - 適切なコントラスト比を維持
   - フォーカススタイルを削除しない
   - セマンティックなHTMLを使用

## 🐛 トラブルシューティング

### スタイルが適用されない

```jsx
// globals.cssでインポートを確認
@import '../styles/design-system.css';
```

### Tailwindとの競合

```jsx
// !importantは使用しない
// レイヤーの順序で解決
@layer base { /* ... */ }
@layer components { /* ... */ }
@layer utilities { /* ... */ }
```

### カスタマイズが反映されない

```css
/* CSS変数は:rootで定義 */
:root {
  --color-primary-600: #新しい色;
}
```

## 📚 リファレンス

- [UnsonOS ブランドガイドライン](../../docs/for-developers/brand-guidelines.md)
- [Tailwind CSS ドキュメント](https://tailwindcss.com/docs)
- [CSS カスケードレイヤー](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)