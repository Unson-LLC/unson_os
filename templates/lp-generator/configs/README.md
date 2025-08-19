# 設定ファイルガイド

このディレクトリにはLPの設定ファイルを配置します。

## 🎯 使い方

1. **`config.json`を編集** - これがメインの設定ファイルです
2. **ファイルを保存** - ブラウザが自動的に更新されます
3. **画像を追加** - `/public/images/`フォルダに配置してJSONでパスを指定

## 📝 設定ファイル構造

### 基本構造

```json
{
  "meta": {
    "title": "ページタイトル",
    "description": "ページの説明",
    "keywords": ["キーワード1", "キーワード2"]
  },
  "theme": {
    "colors": { /* カラー設定 */ },
    "fonts": { /* フォント設定 */ },
    "gradients": { /* グラデーション設定 */ }
  },
  "content": {
    "hero": { /* ヒーローセクション */ },
    "problem": { /* 問題提起セクション */ },
    "solution": { /* 解決策セクション */ },
    "service": { /* サービス紹介 */ },
    "pricing": { /* 料金プラン */ },
    "form": { /* お問い合わせフォーム */ },
    "finalCta": { /* 最終CTA */ },
    "footer": { /* フッター */ }
  },
  "assets": {
    "images": { /* 画像パス */ }
  }
}
```

## 🎨 テーマ設定

### カラー設定

```json
"theme": {
  "colors": {
    "primary": "#3B82F6",      // メインカラー
    "secondary": "#8B5CF6",    // サブカラー
    "accent": "#EC4899",       // アクセントカラー
    "background": "#FFFFFF",   // 背景色
    "text": "#1F2937",        // テキスト色
    "textLight": "#6B7280"    // 薄いテキスト色
  }
}
```

### フォント設定

```json
"fonts": {
  "heading": "'Noto Sans JP', sans-serif",  // 見出し用フォント
  "body": "'Noto Sans JP', sans-serif"      // 本文用フォント
}
```

Google Fontsから任意のフォントを選択できます：
- 日本語: `'Noto Sans JP'`, `'M PLUS Rounded 1c'`, `'Sawarabi Gothic'`
- 英語: `'Inter'`, `'Roboto'`, `'Open Sans'`, `'Montserrat'`

### グラデーション設定

```json
"gradients": {
  "primary": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "secondary": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "accent": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
}
```

## 📄 コンテンツセクション

### ヒーローセクション

```json
"hero": {
  "title": "メインキャッチコピー",
  "subtitle": "サブタイトル・説明文",
  "cta": "CTAボタンのテキスト",
  "secondaryCta": "サブボタンのテキスト（オプション）",
  "backgroundImage": "/images/hero-bg.jpg",  // 背景画像
  "backgroundGradient": true  // グラデーションオーバーレイ
}
```

### 問題提起セクション

```json
"problem": {
  "title": "こんなお悩みありませんか？",
  "subtitle": "サブタイトル（オプション）",
  "description": "説明文",
  "problems": [
    {
      "title": "問題1のタイトル",
      "description": "問題1の詳細説明",
      "image": "/images/problem-1.jpg"  // オプション
    },
    {
      "title": "問題2のタイトル",
      "description": "問題2の詳細説明"
    }
  ]
}
```

### 解決策セクション

```json
"solution": {
  "title": "私たちの解決策",
  "subtitle": "サブタイトル（オプション）",
  "description": "説明文",
  "solutions": [
    {
      "title": "解決策1",
      "description": "詳細説明",
      "icon": "Zap"  // Lucideアイコン名
    }
  ]
}
```

### サービス紹介セクション

```json
"service": {
  "title": "サービス内容",
  "subtitle": "サブタイトル（オプション）",
  "services": [
    {
      "title": "サービス1",
      "description": "サービスの説明",
      "features": [
        "特徴1",
        "特徴2",
        "特徴3"
      ],
      "icon": "Star"  // Lucideアイコン名
    }
  ]
}
```

### 料金プランセクション（オプション）

```json
"pricing": {
  "title": "料金プラン",
  "subtitle": "サブタイトル（オプション）",
  "plans": [
    {
      "name": "ベーシック",
      "price": "¥9,800",
      "period": "月",  // オプション
      "description": "プランの説明",
      "features": [
        "機能1",
        "機能2",
        "機能3"
      ],
      "cta": "このプランを選ぶ",
      "popular": false  // 人気プランかどうか
    }
  ]
}
```

### フォームセクション

```json
"form": {
  "title": "お問い合わせ",
  "subtitle": "お気軽にご連絡ください",
  "fields": [
    {
      "type": "text",  // text, email, tel, textarea, select
      "name": "name",
      "label": "お名前",
      "placeholder": "山田 太郎",
      "required": true
    },
    {
      "type": "select",
      "name": "interest",
      "label": "興味のある分野",
      "placeholder": "選択してください",
      "required": true,
      "options": ["オプション1", "オプション2", "オプション3"]
    }
  ],
  "submitText": "送信する",
  "successMessage": "送信完了しました！",
  "privacyText": "個人情報保護方針に同意の上、送信してください。"
}
```

### 最終CTAセクション

```json
"finalCta": {
  "title": "今すぐ始めましょう",
  "subtitle": "サブタイトル（オプション）",
  "cta": "CTAボタンテキスト",
  "urgencyText": "期間限定！今なら30%OFF",  // 緊急性を訴求
  "benefitsList": [  // メリットリスト（オプション）
    "メリット1",
    "メリット2",
    "メリット3"
  ]
}
```

### フッターセクション

```json
"footer": {
  "companyName": "会社名",
  "description": "会社の説明（オプション）",
  "sections": [
    {
      "title": "サービス",
      "links": [
        { "text": "機能", "url": "/features" },
        { "text": "料金", "url": "/pricing" }
      ]
    }
  ],
  "copyright": "© 2025 会社名. All rights reserved.",
  "socialLinks": [
    { "platform": "twitter", "url": "https://twitter.com/yourcompany" },
    { "platform": "facebook", "url": "https://facebook.com/yourcompany" }
  ]
}
```

## 🖼️ 画像の使い方

1. **画像を配置**: `/public/images/`フォルダに画像ファイルを配置
2. **JSONで参照**: 
   ```json
   "backgroundImage": "/images/hero-bg.jpg"
   ```

### 推奨画像サイズ

- **ヒーロー背景**: 1920x1080px以上
- **問題提起画像**: 600x400px
- **アイコン**: SVG形式推奨

## 🎨 利用可能なアイコン

Lucide Reactのアイコンが使用できます。よく使うアイコン：

- **一般**: `Star`, `Heart`, `Check`, `X`, `Plus`, `Minus`
- **ビジネス**: `Briefcase`, `Building`, `TrendingUp`, `DollarSign`
- **テクノロジー**: `Cpu`, `Code`, `Database`, `Cloud`, `Wifi`
- **コミュニケーション**: `Mail`, `MessageCircle`, `Phone`, `Send`
- **ユーザー**: `User`, `Users`, `UserCheck`, `UserPlus`
- **ナビゲーション**: `Menu`, `ArrowRight`, `ChevronDown`, `ExternalLink`

完全なリストは https://lucide.dev/icons で確認できます。

## 💡 便利なテクニック

### 1. カラーパレットジェネレーター

オンラインツールでカラーパレットを生成：
- https://coolors.co
- https://colorhunt.co
- https://color.adobe.com

### 2. グラデーション作成

グラデーションジェネレーター：
- https://cssgradient.io
- https://uigradients.com

### 3. フォントの組み合わせ

Google Fontsでプレビュー：
- https://fonts.google.com

推奨の組み合わせ：
- 見出し: `'Montserrat'` + 本文: `'Open Sans'`
- 見出し: `'Playfair Display'` + 本文: `'Lato'`
- 日本語: `'Noto Sans JP'` または `'M PLUS Rounded 1c'`

## 🔧 トラブルシューティング

### 画像が表示されない

- パスが正しいか確認: `/images/`で始まる
- ファイル名の大文字小文字を確認
- 画像が`/public/images/`フォルダにあるか確認

### 日本語フォントが適用されない

- フォント名を引用符で囲む: `"'Noto Sans JP', sans-serif"`
- フォールバックフォントを指定: `sans-serif`

### 色が反映されない

- カラーコードが正しい形式か確認: `#RRGGBB`
- 6桁の16進数カラーコードを使用

## 📚 サンプル設定

以下のサンプルを参考にしてください：

- **authentic-life-ai.json**: AI診断サービスのLP
- **saas-startup.json**: B2B SaaSプロダクトのLP
- **fitness-coaching.json**: パーソナルコーチングのLP

サンプルをコピーして編集を始めるのがおすすめです：

```bash
cp authentic-life-ai.json config.json
```