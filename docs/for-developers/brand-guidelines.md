# UnsonOS ブランドガイドライン

**Version**: 1.0  
**Last Updated**: 2025-01-15  
**Status**: ACTIVE

---

## 📋 目次

1. [ブランドオーバービュー](#-ブランドオーバービュー)
2. [ロゴ・ビジュアルアイデンティティ](#-ロゴビジュアルアイデンティティ)
3. [カラーパレット](#-カラーパレット)
4. [タイポグラフィ](#-タイポグラフィ)
5. [トーン&ボイス](#-トーンボイス)
6. [UIコンポーネント規約](#-uiコンポーネント規約)
7. [アニメーション・インタラクション](#-アニメーションインタラクション)
8. [ブランドアプリケーション](#-ブランドアプリケーション)

---

## 🎯 ブランドオーバービュー

### ブランドミッション
> 営業ゼロで価値を連続出荷する自律企業OSになる

### コアコンセプト

| コンセプト | 説明 | デザインへの反映 |
|------------|------|------------------|
| **STAY SMALL** | 最小限のリソースで最大限の価値創造 | シンプルで効率的なUI |
| **Company-as-a-Product** | 会社自体をプロダクトとして設計・運用 | モジュラー設計、バージョン管理 |
| **Zero-Sales Doctrine** | 営業行為を介在させない完全自動化 | 直感的UX、説明不要のインターフェース |
| **Self-Evolving Portfolio** | データ駆動での自動進化 | リアルタイム反映、インジケーター中心 |

### ブランドパーソナリティ

- **効率的** (Efficient): 無駄のない、洗練された
- **自律的** (Autonomous): 自動化された、独立した
- **革新的** (Innovative): 先進的、破壊的
- **透明** (Transparent): オープン、誠実
- **データ駆動** (Data-Driven): 数値基準、客観的

---

## 🎨 ロゴ・ビジュアルアイデンティティ

### プライマリロゴ

```tsx
// Logo Component Usage
<Logo 
  width={40} 
  height={40} 
  showText={true}
  className="text-gray-900"
/>
```

**ファイルパス**: `/public/unson-os-logo.png`

### ロゴ使用規則

#### ✅ 適切な使用例
- 最小サイズ: 24px × 24px
- 余白: ロゴ高さの1/2以上確保
- 背景: 白、グレー50-100推奨

#### ❌ 禁止事項
- ロゴの変形・回転
- 指定外カラーでの使用
- 余白不足での配置
- 低解像度での使用

### アイコンファミリー

```css
/* システムアイコン規約 */
.icon-system {
  font-size: 16px-24px;
  line-height: 1;
  vertical-align: middle;
}

/* 状態別カラーリング */
.icon-success { color: #10b981; }
.icon-warning { color: #f59e0b; }
.icon-error   { color: #ef4444; }
.icon-info    { color: #3b82f6; }
```

---

## 🎨 カラーパレット

### プライマリカラー（Blue系）

```css
:root {
  --primary-50:  #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6; /* メインブランドカラー */
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;
}
```

**用途**: 
- CTA、リンク、アクション要素
- アクティブ状態、選択状態
- プログレスバー、ローディング

### セカンダリカラー（Slate/Gray系）

```css
:root {
  --secondary-50:  #f8fafc;
  --secondary-100: #f1f5f9;
  --secondary-200: #e2e8f0;
  --secondary-300: #cbd5e1;
  --secondary-400: #94a3b8;
  --secondary-500: #64748b; /* デフォルトテキスト */
  --secondary-600: #475569;
  --secondary-700: #334155;
  --secondary-800: #1e293b;
  --secondary-900: #0f172a;
}
```

**用途**:
- ベースレイアウト、ボーダー
- セカンダリテキスト
- 非アクティブ状態

### アクセントカラー（Purple系）

```css
:root {
  --accent-50:  #fef7ff;
  --accent-100: #fceeff;
  --accent-200: #f8d5ff;
  --accent-300: #f0abfc;
  --accent-400: #e879f9;
  --accent-500: #d946ef; /* アクセント */
  --accent-600: #c026d3;
  --accent-700: #a21caf;
  --accent-800: #86198f;
  --accent-900: #701a75;
}
```

**用途**:
- ハイライト、強調
- プレミアム機能表示
- グラデーション要素

### ステータスカラー

```css
:root {
  /* Success (Green) */
  --success-100: #dcfce7;
  --success-500: #22c55e;
  --success-800: #166534;
  
  /* Warning (Yellow/Orange) */
  --warning-100: #fef3c7;
  --warning-500: #f59e0b;
  --warning-800: #92400e;
  
  /* Error (Red) */
  --error-100: #fee2e2;
  --error-500: #ef4444;
  --error-800: #991b1b;
  
  /* Info (Cyan) */
  --info-100: #cffafe;
  --info-500: #06b6d4;
  --info-800: #155e75;
}
```

### SaaSフェーズカラー

```css
/* フェーズ別カラーリング（管理UI専用） */
.phase-research     { @apply bg-blue-100 text-blue-800 border-blue-200; }
.phase-lp           { @apply bg-green-100 text-green-800 border-green-200; }
.phase-mvp          { @apply bg-yellow-100 text-yellow-800 border-yellow-200; }
.phase-monetization { @apply bg-purple-100 text-purple-800 border-purple-200; }
.phase-scale        { @apply bg-indigo-100 text-indigo-800 border-indigo-200; }
```

---

## ✍️ タイポグラフィ

### フォントファミリー

```css
:root {
  /* サンセリフ（メイン） */
  --font-sans: 'Inter var', 'Inter', system-ui, sans-serif;
  
  /* モノスペース（コード・数値） */
  --font-mono: 'JetBrains Mono', 'Fira Code', Monaco, monospace;
}
```

### タイポグラフィスケール

```css
/* ヘッダー */
.heading-primary   { @apply text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight; }
.heading-secondary { @apply text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight; }
.heading-tertiary  { @apply text-xl sm:text-2xl font-semibold; }

/* ボディテキスト */
.text-large   { @apply text-lg sm:text-xl text-gray-600; }
.text-body    { @apply text-base text-gray-700; }
.text-small   { @apply text-sm text-gray-600; }
.text-caption { @apply text-xs text-gray-500; }

/* 特殊用途 */
.text-mono    { @apply font-mono text-sm; }
.text-code    { @apply font-mono text-xs bg-gray-100 px-1 py-0.5 rounded; }
```

### 文章スタイリング規約

#### 見出し
- **H1**: ページタイトル、主要セクション
- **H2**: サブセクション
- **H3**: コンポーネントタイトル

#### 数値・データ表示
- **通貨**: `¥1,234,567`形式、右揃え
- **パーセンテージ**: `12.5%`形式、小数点1位まで
- **日時**: `2025-01-15 14:30`形式（ISO準拠）

---

## 🗣️ トーン&ボイス

### 基本的なトーン

| 属性 | 説明 | 実装例 |
|------|------|--------|
| **簡潔** | 必要最小限の言葉で伝える | 「保存」「削除」「実行」 |
| **客観的** | データに基づく表現 | 「CVR 15.2%」「MRR ¥450K」 |
| **アクション指向** | 行動を促す表現 | 「今すぐ開始」「詳細を確認」 |
| **状態明示** | 現在の状況を明確化 | 「実行中（78%完了）」 |

### 文言規約

#### UI要素
```javascript
// ボタン
const buttonLabels = {
  save: '保存',
  cancel: 'キャンセル',
  delete: '削除',
  execute: '実行',
  confirm: '確定',
  detail: '詳細',
}

// ステータス
const statusLabels = {
  processing: '処理中',
  completed: '完了',
  failed: '失敗',
  waiting: '待機中',
  approved: '承認済み',
}
```

#### エラーメッセージ
- **形式**: 「[原因] + [解決方法]」
- **例**: 「接続に失敗しました。しばらく待ってから再試行してください。」

#### 成功メッセージ
- **形式**: 「[アクション]が完了しました」
- **例**: 「設定の保存が完了しました」

---

## 🧩 UIコンポーネント規約

### ボタン

```css
/* プライマリボタン */
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700 text-white font-medium 
         py-2 px-4 rounded-md transition-colors duration-200 
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

/* セカンダリボタン */
.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium 
         py-2 px-4 rounded-md transition-colors duration-200 
         focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
}

/* 危険アクション */
.btn-danger {
  @apply bg-red-600 hover:bg-red-700 text-white font-medium 
         py-2 px-4 rounded-md transition-colors duration-200;
}
```

### カード

```css
.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 p-6 
         hover:shadow-md transition-shadow;
}

.card-header {
  @apply border-b border-gray-200 pb-4 mb-4;
}

.card-title {
  @apply text-lg font-semibold text-gray-900;
}
```

### フォーム要素

```css
.form-input {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md 
         shadow-sm placeholder-gray-400 
         focus:outline-none focus:ring-blue-500 focus:border-blue-500;
}

.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-error {
  @apply mt-1 text-sm text-red-600;
}
```

### 通知・アラート

```css
.alert-success {
  @apply bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md;
}

.alert-warning {
  @apply bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md;
}

.alert-error {
  @apply bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md;
}
```

---

## ⚡ アニメーション・インタラクション

### 基本原則
1. **STAY SMALL準拠**: 必要最小限のアニメーション
2. **パフォーマンス重視**: 60fps維持
3. **アクセシビリティ**: `prefers-reduced-motion`対応

### トランジション設定

```css
:root {
  --transition-fast: 0.15s ease-out;
  --transition-normal: 0.3s ease-out;
  --transition-slow: 0.5s ease-out;
}

/* 標準トランジション */
.transition-standard {
  transition: all var(--transition-normal);
}

/* ホバー効果 */
.hover-lift {
  @apply transform hover:scale-105 transition-transform duration-200;
}

.hover-glow {
  @apply hover:shadow-lg transition-shadow duration-200;
}
```

### キーフレームアニメーション

```css
/* フェードイン */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* スライドアップ */
@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

/* パルス（読み込み中） */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}
```

### インタラクション状態

```css
/* フォーカス */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
}

/* ローディング */
.loading {
  @apply opacity-50 pointer-events-none animate-pulse;
}

/* 無効化 */
.disabled {
  @apply opacity-40 cursor-not-allowed;
}
```

---

## 📱 ブランドアプリケーション

### Webアプリケーション

#### ヘッダー
- ロゴ: 左上固定、40×40px
- ナビゲーション: 水平配置、アクティブ状態明示
- ユーザーメニュー: 右上配置

#### メインコンテンツ
- 最大幅: 1280px (max-w-7xl)
- パディング: 24px (p-6)
- グリッドシステム: CSS Grid / Flexbox併用

#### サイドバー
- 幅: 256px (w-64)
- 背景: white / gray-50
- 固定位置: sticky top-0

### 管理UI（UnsonOS専用）

#### ダッシュボード
- **KPI表示**: 数値中心、トレンド矢印使用
- **ステータス**: 色分け+絵文字（🟢🟡🔴）
- **データ表**: モノスペースフォント、右揃え

#### フェーズ表示
```html
<!-- フェーズバッジ -->
<span class="phase-lp">LP検証</span>
<span class="phase-mvp">MVP開発</span>
<span class="phase-monetization">収益化</span>
```

#### メトリクス表示
```html
<!-- KPIカード -->
<div class="card">
  <div class="text-2xl font-bold text-green-600">¥450K</div>
  <div class="text-sm text-gray-600">MRR ↗️ +12%</div>
</div>
```

### ドキュメンテーション

#### Markdownスタイル
```css
.markdown h1 { @apply text-3xl font-bold text-gray-900 mb-6; }
.markdown h2 { @apply text-2xl font-semibold text-gray-800 mb-4 mt-8; }
.markdown h3 { @apply text-xl font-medium text-gray-700 mb-3 mt-6; }
.markdown p  { @apply text-gray-600 leading-relaxed mb-4; }
.markdown code { @apply font-mono text-sm bg-gray-100 px-1 py-0.5 rounded; }
```

### ファビコン・OGPアセット

```html
<!-- ファビコン -->
<link rel="icon" href="/favicon.ico" />
<link rel="apple-touch-icon" href="/apple-icon.png" />

<!-- OGP -->
<meta property="og:image" content="/og-image.png" />
<meta name="twitter:image" content="/twitter-image.png" />
```

---

## 📋 実装チェックリスト

### デザイナー向け
- [ ] カラーパレット使用確認
- [ ] タイポグラフィスケール適用
- [ ] コンポーネント規約準拠
- [ ] アクセシビリティ配慮
- [ ] レスポンシブ対応

### エンジニア向け
- [ ] CSS変数使用
- [ ] Tailwind設定準拠
- [ ] パフォーマンス最適化
- [ ] SEO設定完了
- [ ] アニメーション動作確認

### QA向け
- [ ] ブランド一貫性確認
- [ ] 多言語対応チェック
- [ ] ダークモード動作確認
- [ ] プリント用スタイル確認
- [ ] 高コントラストモード確認

---

## 🔄 改訂履歴

| バージョン | 日付 | 変更内容 | 担当者 |
|------------|------|----------|--------|
| 1.0 | 2025-01-15 | 初回作成 | Claude Code |

---

## 📝 関連ドキュメント

- [STAY SMALL哲学](../business-strategy/stay-small-philosophy.md)
- [企業戦略レポート](../business-strategy/executive-strategy-report.md)
- [UI設計完全版](./core-system/02-ui-design/complete-design.md)
- [Tailwind設定](../../tailwind.config.js)

---

**Note**: このドキュメントはUnsonOSの「Company-as-a-Product」思想に基づき、バージョン管理されています。変更時は必ず改訂履歴を更新してください。