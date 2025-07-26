# GitHub Actions デプロイ設定

このワークフローはGitHub ActionsとVercelを使用して自動デプロイを行います。

## 必要なGitHubシークレット

以下のシークレットをGitHubリポジトリに設定する必要があります：

1. **`VERCEL_TOKEN`** - Vercelのアクセストークン
   - [Vercel Dashboard](https://vercel.com/account/tokens) から取得
   - "Create Token" をクリックして新しいトークンを作成

2. **`VERCEL_ORG_ID`** - VercelのOrganization ID
   - Vercelプロジェクトのルートで `vercel` コマンドを実行
   - 生成される `.vercel/project.json` から取得

3. **`VERCEL_PROJECT_ID`** - VercelのProject ID
   - 同じく `.vercel/project.json` から取得

## 設定手順

### 1. Vercelプロジェクトの初期化（ローカルで実行）

```bash
# Vercel CLIをインストール
npm i -g vercel

# プロジェクトを初期化
vercel

# プロンプトに従って設定
# - GitHubと連携
# - プロジェクト名を設定
# - 環境変数を設定（必要な場合）
```

### 2. 生成されたIDを確認

```bash
cat .vercel/project.json
```

出力例：
```json
{
  "orgId": "team_xxxxxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxxxxx"
}
```

### 3. GitHubシークレットを設定

1. GitHubリポジトリの Settings → Secrets and variables → Actions へ移動
2. "New repository secret" をクリック
3. 以下のシークレットを追加：
   - Name: `VERCEL_TOKEN`, Value: Vercelで作成したトークン
   - Name: `VERCEL_ORG_ID`, Value: `team_xxxxxxxxxxxxxxxx`
   - Name: `VERCEL_PROJECT_ID`, Value: `prj_xxxxxxxxxxxxxxxx`

## ワークフローの機能

### 自動テスト
- TypeScriptの型チェック
- ESLintによるコード品質チェック
- Jestによるユニットテスト

### デプロイ
- **プルリクエスト**: プレビューデプロイ（コメントでURLを通知）
- **mainブランチへのプッシュ**: 本番デプロイ

### 環境変数

Vercelダッシュボードで以下の環境変数を設定してください：

```
NEXT_PUBLIC_APP_URL
NOTION_API_KEY
NOTION_DATABASE_ID
RESEND_API_KEY
NEXT_PUBLIC_GA_MEASUREMENT_ID
OPENAI_API_KEY
# Convex関連
CONVEX_DEPLOYMENT
NEXT_PUBLIC_CONVEX_URL
```

## トラブルシューティング

### デプロイが失敗する場合
1. シークレットが正しく設定されているか確認
2. Vercelプロジェクトが正しく初期化されているか確認
3. 環境変数がVercelダッシュボードに設定されているか確認

### プレビューURLがコメントされない場合
- Pull Requestの権限設定を確認
- GITHUB_TOKENの権限を確認