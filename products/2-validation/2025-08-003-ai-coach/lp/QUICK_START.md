# 🚀 2分で始めるLP作成

## ステップ1: セットアップ（初回のみ）

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

✅ ブラウザで http://localhost:3000 が開きます

## ステップ2: テンプレートを選ぶ

以下の3つから好きなものをコピー：

```bash
# AI診断サービス風
cp configs/authentic-life-ai.json configs/config.json

# または、SaaSプロダクト風
cp configs/saas-startup.json configs/config.json

# または、フィットネスコーチング風
cp configs/fitness-coaching.json configs/config.json
```

## ステップ3: 編集する

`configs/config.json` をVSCodeなどで開いて編集：

```json
{
  "content": {
    "hero": {
      "title": "あなたのサービス名",
      "subtitle": "魅力的なキャッチコピーをここに"
    }
  }
}
```

💡 **保存すると自動的にブラウザが更新されます！**

## 🎯 最速カスタマイズ

### 色を変える

```json
"theme": {
  "colors": {
    "primary": "#FF6B6B",     // メインカラー
    "secondary": "#4ECDC4",   // サブカラー
    "accent": "#FFE66D"       // アクセントカラー
  }
}
```

### テキストを変える

`【】`で囲まれた部分を置き換えるだけ：

```json
"hero": {
  "title": "【メインキャッチコピーを入力】",
  "subtitle": "【サブタイトル・説明文を入力】"
}
```

↓

```json
"hero": {
  "title": "革新的なAIソリューション",
  "subtitle": "ビジネスを次のレベルへ"
}
```

### 画像を変える

1. 画像を `public/images/` に入れる
2. JSONでパスを指定：

```json
"backgroundImage": "/images/my-hero.jpg"
```

## 📱 モバイル確認

ブラウザの開発者ツールでスマホ表示を確認：
- Windows/Linux: `F12` → モバイルアイコン
- Mac: `Cmd + Option + I` → モバイルアイコン

## ✨ 便利なテクニック

### 画面分割で効率UP

1. エディタを左半分に配置
2. ブラウザを右半分に配置
3. 編集 → 保存 → 即確認！

### 複数バージョン管理

```bash
# バージョンA
cp configs/config.json configs/version-a.json

# バージョンB
cp configs/config.json configs/version-b.json

# 切り替え
cp configs/version-a.json configs/config.json
```

## 🎨 カラーパレット例

### モダン＆プロフェッショナル
```json
"primary": "#2563EB",   // 青
"secondary": "#7C3AED", // 紫
"accent": "#EC4899"     // ピンク
```

### ナチュラル＆エコ
```json
"primary": "#10B981",   // 緑
"secondary": "#059669", // 深緑
"accent": "#F59E0B"     // オレンジ
```

### ミニマル＆シック
```json
"primary": "#000000",   // 黒
"secondary": "#6B7280", // グレー
"accent": "#EF4444"     // 赤
```

## 🚨 困ったときは

### 画像が表示されない
→ パスが `/images/` で始まっているか確認

### 日本語が変
→ フォントを `'Noto Sans JP'` に設定

### 変更が反映されない
→ ブラウザを手動でリロード（Ctrl+R / Cmd+R）

## 📦 完成したら

### ローカルで確認
```bash
npm run build
npm start
```

## 🎉 完成！

たった2分でオリジナルLPの完成です！

---

💡 **ヒント**: まずはサンプルをベースに、少しずつカスタマイズしていくのがおすすめです。