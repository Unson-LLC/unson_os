# Discord Webhook セットアップガイド

## 概要
GitHub PRの作成・マージ時にDiscordへ自動通知を送信するための設定手順です。

## 1. Discord Webhookの作成

### 手順
1. Discordサーバーで通知を受け取りたいチャンネルを選択
2. チャンネル設定（歯車アイコン）をクリック
3. 左メニューから「連携サービス」→「ウェブフック」を選択
4. 「新しいウェブフック」をクリック
5. 以下を設定：
   - **名前**: `UnsonOS GitHub Bot`
   - **アバター**: GitHubロゴなど（オプション）
   - **チャンネル**: 通知を送信したいチャンネル
6. 「ウェブフックURLをコピー」をクリック

### Webhook URLの形式
```
https://discord.com/api/webhooks/[WEBHOOK_ID]/[WEBHOOK_TOKEN]
```

## 2. GitHub Secretsの設定

### 手順
1. GitHubリポジトリの「Settings」タブを開く
2. 左メニューから「Secrets and variables」→「Actions」を選択
3. 「New repository secret」をクリック
4. 以下のシークレットを追加：

#### 必須シークレット
- **Name**: `DISCORD_WEBHOOK_URL`
- **Value**: 上記でコピーしたWebhook URL

#### オプション（AI要約を使用する場合）
- **Name**: `ANTHROPIC_API_KEY`
- **Value**: Claude APIキー

## 3. 通知のカスタマイズ

### 通知内容
デフォルトでは以下の情報が送信されます：
- PR作成時：タイトル、説明、作成者、ブランチ情報
- PRマージ時：タイトル、要約、マージ者、コミット履歴リンク

### 通知の見た目
```
🔄 新しいPRが作成されました
feat: LangChain/LangGraphベースのGoogle Ads自動最適化システム

主な変更:
- LLM×Runbookアーキテクチャ設計書追加
- キーワード自動最適化システム実装
- 技術スタック選定ドキュメント

作成者: ksato
ブランチ: feature/langchain-langraph → main

[PRを確認する]
```

## 4. 動作テスト

### テスト方法
1. テスト用のPRを作成
2. Discordチャンネルに通知が届くことを確認
3. PRをマージして、マージ通知が届くことを確認

### トラブルシューティング

#### 通知が届かない場合
1. GitHub Actions タブで実行状況を確認
2. Webhook URLが正しく設定されているか確認
3. Discordのウェブフック設定でレート制限を確認

#### エラーが発生する場合
```bash
# ローカルでWebhookテスト
curl -X POST $DISCORD_WEBHOOK_URL \
  -H "Content-Type: application/json" \
  -d '{
    "content": "テスト通知",
    "username": "Test Bot"
  }'
```

## 5. 高度な設定

### 通知条件のカスタマイズ
`.github/workflows/discord-pr-notification.yml`を編集：

```yaml
on:
  pull_request:
    types: [opened, closed, reopened]  # 通知するイベントを追加
    branches:
      - main
      - develop  # 特定ブランチのみ通知
```

### 通知フォーマットの変更
Embed形式、色、アイコンなどをカスタマイズ可能：

```yaml
embed-color: 3447003  # 青色
# 他の色コード:
# 2067276 - 緑（成功）
# 16711680 - 赤（エラー）
# 16776960 - 黄（警告）
```

### 複数チャンネルへの通知
環境別に異なるWebhookを設定：

```yaml
# 本番用
DISCORD_WEBHOOK_URL_PROD

# 開発用
DISCORD_WEBHOOK_URL_DEV
```

## 6. セキュリティ考慮事項

### ベストプラクティス
1. Webhook URLは必ずGitHub Secretsに保存
2. 公開リポジトリでもWebhook URLは露出しない
3. 定期的にWebhookの使用状況を監視
4. 不要になったWebhookは削除

### 権限管理
- GitHub Actionsの権限は最小限に設定
- Webhook作成権限は管理者のみに制限

## 7. 代替案

### 方法2: Discord GitHub Bot（簡単だが機能限定）
1. [GitHub Discord Bot](https://github.com/apps/discord) をインストール
2. `/github subscribe owner/repo` コマンドで購読

### 方法3: Zapier/IFTTT（ノーコード）
- 設定が簡単だが、無料プランでは実行回数制限あり

### 方法4: 自前のWebhookサーバー（高度）
- Node.js/Pythonでカスタムサーバーを構築
- より複雑な処理が可能

## まとめ

GitHub Actionsを使用した方法が最もバランスが良く、以下のメリットがあります：
- 無料（パブリックリポジトリ）
- カスタマイズ性が高い
- メンテナンスが容易
- セキュアな実装

設定は10分程度で完了し、即座に運用開始できます。