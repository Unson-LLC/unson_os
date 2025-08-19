# Google Analytics Admin API セットアップガイド

## 🚨 エラー解決

スクリプト実行時に以下のエラーが発生した場合：

```
❌ Google Analytics Admin API has not been used in project 534395578764 before or it is disabled.
```

## ⚡ 解決手順

### Step 1: Google Cloud ConsoleでAPI有効化

1. **Google Cloud Console** にアクセス
   ```
   https://console.cloud.google.com/apis/api/analyticsadmin.googleapis.com/overview?project=534395578764
   ```

2. **「有効にする」** ボタンをクリック

3. 数分間待機（APIの有効化に時間がかかる場合があります）

### Step 2: 必要なAPI一覧確認

同じプロジェクトで以下のAPIも有効化推奨：

- ✅ **Google Analytics Admin API** (必須)
- ✅ **Google Analytics Reporting API** (データ取得用)  
- ✅ **Google Analytics Data API** (GA4データ用)

### Step 3: スクリプト再実行

```bash
npm run ga4:create
```

## 🔧 代替手順（手動有効化）

### 1. Google Cloud Console手動ナビゲーション

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. プロジェクト選択: **unsonos** (ID: 534395578764)
3. **ナビゲーションメニュー** → **APIとサービス** → **ライブラリ**
4. 検索: "Google Analytics Admin API"
5. **Google Analytics Admin API** を選択
6. **有効にする** をクリック

### 2. APIキー・認証情報確認

1. **APIとサービス** → **認証情報**
2. サービスアカウント `unson-analytics-reader@unsonos.iam.gserviceaccount.com` が存在確認
3. JSONキーファイルが正しくダウンロード済み確認

## 🚀 API有効化後の実行

```bash
# GA4プロパティ自動作成
npm run ga4:create

# 期待される出力例:
# ✅ Google認証初期化完了
# 📋 利用可能なGA4アカウント:
#    1. Unson Analytics Account (accounts/12345678)
# 🎯 使用アカウント: Unson Analytics Account
# 🚀 mywa プロパティ作成開始...
# ✅ プロパティ作成成功: MyWa LP Analytics
```

## ⚠️ トラブルシューティング

### Q1: 「権限が不足しています」エラー
**A**: GA4アカウントでサービスアカウントに「編集者」権限を付与

### Q2: 「プロジェクトが見つかりません」エラー  
**A**: `google-service-account.json`ファイルのproject_idが正しいか確認

### Q3: 「APIクォータ超過」エラー
**A**: 数分待機後に再実行、またはスクリプト内の待機時間延長

## 📋 成功時の出力

スクリプト成功時は以下のファイルが生成されます：

```
✅ 生成ファイル:
- ga4-properties-created.json     # 作成結果サマリー
- services/mywa/.env.local        # 環境変数（自動更新）
- services/ai-bridge/.env.local   # 環境変数（自動更新）
- services/ai-stylist/.env.local  # 環境変数（自動更新）
- services/ai-legacy-creator/.env.local
- services/ai-coach/.env.local
```

## 🎯 次のステップ

API有効化完了後：

1. **スクリプト再実行** → プロパティ作成
2. **Microsoft Clarity設定** → ヒートマップ分析
3. **Vercel環境変数設定** → 本番デプロイ
4. **Analytics動作確認** → データ取得テスト

---

**推定時間**: API有効化 2-3分、プロパティ作成 2-3分