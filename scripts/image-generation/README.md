# 画像生成スクリプト

LP用のブランド統一画像を自動生成するためのスクリプト集です。

## 環境設定

```bash
export GEMINI_API_KEY="your_api_key_here"
```

## スクリプト一覧

### 1. テスト用スクリプト
- `test-gemini-2.5-image.js` - Gemini 2.5 Flash Image Preview APIの動作確認

### 2. AI Stylist LP用スクリプト
- `generate-missing-stylist-images.js` - 不足画像の生成（持続可能ファッション向け）
- `regenerate-stylist-hero-images.js` - ヒーロー画像の再生成

### 3. AI Coach LP用スクリプト  
- `regenerate-ai-coach-all-images.js` - 全画像の一括生成（40-55歳女性向け）
- `complete-ai-coach-images.js` - 残り画像の完成

## 使用方法

```bash
cd scripts/image-generation
export GEMINI_API_KEY="your_api_key"
node [script_name].js
```

## ブランド統一仕様

### AI Stylist
- ターゲット: 20代日本人女性
- テーマ: 持続可能ファッション・環境意識
- カラー: Green (#4ADE80), Yellow (#F59E0B)

### AI Coach
- ターゲット: 40-55歳日本人女性（子育て後）
- テーマ: 人生再構築・エンパワーメント
- カラー: Purple (#E879F9), Pink (#FB7185)