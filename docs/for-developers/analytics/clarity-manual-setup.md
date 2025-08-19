# Microsoft Clarity 手動セットアップガイド

## 🚀 クイックセットアップ（10分で完了）

### Step 1: Clarityアカウント作成/ログイン

1. [Microsoft Clarity](https://clarity.microsoft.com/)にアクセス
2. **「Get started」** → **Googleアカウント**でサインイン

### Step 2: 5つのプロジェクトを連続作成

各LPサービス用にプロジェクトを作成します。

#### プロジェクト1: MyWa LP

1. **「New project」**または**「+」**ボタンをクリック
2. 以下を入力：
   - **Project name**: `MyWa LP`
   - **Website URL**: `https://unson-lp-mywa.vercel.app`
   - **Category**: `Technology` または `Other`
3. **「Create」**をクリック
4. **Project ID**（10文字）をコピー

#### プロジェクト2: AI Bridge LP

1. 同様に作成：
   - **Project name**: `AI Bridge LP`
   - **Website URL**: `https://unson-lp-ai-bridge.vercel.app`
2. Project IDをコピー

#### プロジェクト3: AI Stylist LP

1. 同様に作成：
   - **Project name**: `AI Stylist LP`
   - **Website URL**: `https://unson-lp-ai-stylist.vercel.app`
2. Project IDをコピー

#### プロジェクト4: AI Legacy Creator LP

1. 同様に作成：
   - **Project name**: `AI Legacy Creator LP`
   - **Website URL**: `https://unson-lp-ai-legacy-creator.vercel.app`
2. Project IDをコピー

#### プロジェクト5: AI Coach LP

1. 同様に作成：
   - **Project name**: `AI Coach LP`
   - **Website URL**: `https://unson-lp-ai-coach.vercel.app`
2. Project IDをコピー

## 📝 Project ID記録表

以下にProject IDを記録してください：

| サービス | Project Name | Project ID |
|---------|-------------|------------|
| mywa | MyWa LP | __________ |
| ai-bridge | AI Bridge LP | __________ |
| ai-stylist | AI Stylist LP | __________ |
| ai-legacy-creator | AI Legacy Creator LP | __________ |
| ai-coach | AI Coach LP | __________ |

## 🔧 Step 3: 環境変数設定スクリプト実行

Project IDを取得したら、以下のスクリプトで一括設定：

```javascript
// scripts/setup-clarity-env.js
const projectIds = {
  'mywa': 'xxxxxxxxxx',  // ← ここにProject ID入力
  'ai-bridge': 'xxxxxxxxxx',
  'ai-stylist': 'xxxxxxxxxx',
  'ai-legacy-creator': 'xxxxxxxxxx',
  'ai-coach': 'xxxxxxxxxx'
};

// 実行
node scripts/setup-clarity-env.js
```

## 🚀 Step 4: Vercel環境変数設定

各サービスディレクトリで実行：

```bash
# mywa
cd services/mywa
vercel env add NEXT_PUBLIC_CLARITY_PROJECT_ID production
# プロンプトでProject IDを入力

# ai-bridge
cd ../ai-bridge
vercel env add NEXT_PUBLIC_CLARITY_PROJECT_ID production
# プロンプトでProject IDを入力

# 以下同様...
```

## ✅ 確認方法

### 1. Clarityタグの動作確認

ブラウザのコンソールで：
```javascript
// Clarityがロードされているか確認
window.clarity
```

### 2. Clarityダッシュボードで確認

- プロジェクト作成後24-48時間でデータ表示開始
- リアルタイムセッションは即座に確認可能

## 📊 Clarity + MCPの活用

プロジェクト作成後は、MCPサーバー経由で自然言語分析が可能：

```
"mywa LPの過去7日間のヒートマップデータを分析"
"全LPのスクロール深度を比較"
"モバイルユーザーの離脱ポイントを特定"
```

## ⚡ ワンライナー設定（Project ID取得後）

```bash
# 全サービスの環境変数を一括更新
for service in mywa ai-bridge ai-stylist ai-legacy-creator ai-coach; do
  echo "NEXT_PUBLIC_CLARITY_PROJECT_ID=<${service}のID>" >> services/${service}/.env.local
done
```

## 🎯 チェックリスト

- [ ] Clarityアカウント作成
- [ ] 5つのプロジェクト作成
- [ ] Project ID記録
- [ ] 環境変数設定
- [ ] Vercelデプロイ
- [ ] 動作確認

---

**作業時間**: 10分  
**難易度**: 簡単  
**自動化**: Project ID取得後は自動化可能