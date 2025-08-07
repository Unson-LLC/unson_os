# Google Ads MCP セットアップマニュアル

Google Ads API をClaude Codeで使用するためのMCP（Model Context Protocol）サーバーの設定手順です。

## 前提条件

- Claude Code がインストール済み
- Node.js/npm が利用可能な環境
- Google Ads アカウントへの適切な権限

## セットアップ手順

### 1. GAQL Token の取得

1. [GAQL.app](https://gaql.app) にアクセス
2. Google Ads 権限のあるアカウントでログイン
3. 右上の「Copy GPT Token」ボタンをクリック
4. トークンをクリップボードにコピー

### 2. MCP サーバーの追加

#### 既存のGoogle Ads MCP を削除（必要な場合）

**注意**: `claude mcp remove` コマンドは現在バグがあります。

手動削除の手順：
```bash
# ~/.claude.json を開く
code ~/.claude.json

# mcpServers セクションから "googleads" エントリを削除
```

#### 新しいMCP サーバーの追加

```bash
claude mcp add googleads -s user -- npx -y @trueclicks/google-ads-mcp-js --token=YOUR_GAQL_TOKEN
```

### 3. Claude Code の再起動

MCP 設定を反映するため、Claude Code を再起動してください。

### 4. 接続確認

新しいチャットを開始し、以下のコマンドでMCPサーバーが正常に接続されているか確認：

```
/mcp
```

### 5. 機能テスト

Google Ads MCP が正常に動作するかテスト：

```
Google広告のアカウント一覧を表示して
```

または

```
Google広告のキャンペーン一覧を表示して
```

## 利用可能な機能

- Google Ads アカウント情報の取得
- キャンペーン一覧の表示
- GAQL（Google Ads Query Language）クエリの実行
- 広告統計データの取得

## トラブルシューティング

### エラー：MCP サーバーが見つからない
- Claude Code を再起動
- ~/.claude.json に設定が正しく保存されているか確認

### エラー：認証失敗
- GAQL Token が正しいか確認
- Google Ads アカウントの権限を確認
- Token の有効期限を確認（必要に応じて再取得）

### エラー：npx コマンドが見つからない
- Node.js/npm が正しくインストールされているか確認
- パッケージマネージャーのパスを確認

## 注意事項

- GPT Token は定期的に更新が必要になる場合があります
- 本番環境での使用前に十分なテストを実施してください
- Google Ads API の利用制限に注意してください

## 参考リンク

- [GAQL.app](https://gaql.app) - Token 取得サイト
- [@trueclicks/google-ads-mcp-js](https://www.npmjs.com/package/@trueclicks/google-ads-mcp-js) - NPM パッケージ
- [Google Ads API Documentation](https://developers.google.com/google-ads/api/docs/start) - 公式ドキュメント