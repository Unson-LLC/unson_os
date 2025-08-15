# Claude Code サブエージェント集

このディレクトリには、Claude Code用の専門サブエージェントが含まれています。

## 📦 Google Ads 管理エージェント

Google Ads APIを使用した広告運用の自動化と最適化を行うサブエージェント群です。

### 1. google-ads-api-manager
**役割**: Google Ads API v19を使用した直接的なAPI操作
- キャンペーン管理（入札戦略変更）
- キーワードの追加・削除・停止
- GAQLクエリ実行
- 認証とトークン管理

**使用例**:
```
Task tool を使って google-ads-api-manager エージェントで入札戦略をTARGET_SPENDに変更して
```

### 2. google-ads-keyword-optimizer
**役割**: データドリブンなキーワード戦略の最適化
- キーワードパフォーマンス分析
- 3語以上の複合キーワード特定と停止
- 高検索ボリュームキーワードの追加提案
- ターゲティング戦略の立案

**使用例**:
```
Task tool を使って google-ads-keyword-optimizer エージェントで現在のキーワードを分析して最適化案を出して
```

### 3. google-ads-reporter
**役割**: パフォーマンスレポート生成と分析
- 日別・週別・月別レポート作成
- キーワード別・デバイス別分析
- 異常検知とアラート
- 改善提案の自動生成

**使用例**:
```
Task tool を使って google-ads-reporter エージェントで過去7日間のパフォーマンスレポートを作成して
```

## 🚀 使用方法

### サブエージェントの呼び出し

1. **自動呼び出し**: Claude Codeが適切なタイミングで自動的にエージェントを選択
2. **明示的呼び出し**: Task toolを使用して特定のエージェントを指定

```bash
# 例: API操作を実行
"Task tool を使って google-ads-api-manager エージェントでキャンペーンID 22873791559の入札戦略を変更して"

# 例: キーワード分析
"Task tool を使って google-ads-keyword-optimizer エージェントで配信量が少ないキーワードを特定して"

# 例: レポート生成
"Task tool を使って google-ads-reporter エージェントで今月のパフォーマンスサマリーを作成して"
```

### 並列実行

複数のエージェントを同時に実行可能：
```
"Task toolで3つのタスクを並列実行:
1. api-managerでキーワード一覧取得
2. keyword-optimizerで最適化案作成
3. reporterでレポート生成"
```

## 📋 必要な設定

### 環境変数（.env.local）
```bash
GOOGLE_ADS_CLIENT_ID=your_client_id
GOOGLE_ADS_CLIENT_SECRET=your_client_secret
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token
GOOGLE_ADS_CUSTOMER_ID=your_customer_id
GOOGLE_ADS_LOGIN_CUSTOMER_ID=your_login_customer_id
```

## 🎯 ベストプラクティス

### 1. エージェントの使い分け
- **緊急対応**: api-manager（直接API操作）
- **戦略立案**: keyword-optimizer（分析と提案）
- **定期確認**: reporter（レポートと監視）

### 2. 実行順序の例
```
1. reporter → 現状把握
2. keyword-optimizer → 改善案作成
3. api-manager → 実装
4. reporter → 結果確認
```

### 3. エラーハンドリング
- 各エージェントは独立したコンテキストで動作
- エラー時は自動的にリトライまたは代替案を提示
- API制限に注意（1日のリクエスト上限あり）

## 📚 参照ドキュメント

- [Google Ads API プレイブック](../docs/business-strategy/marketing/advertising/google-ads-api-playbook.md)
- [キーワード最適化ナレッジベース](../docs/business-strategy/marketing/advertising/google-ads-keyword-optimization-learnings.md)
- [MCP セットアップマニュアル](../docs/business-strategy/marketing/advertising/googleads-mcp-setup-manual.md)

## 🔄 更新履歴

- 2025-08-15: 初期バージョン作成
  - google-ads-api-manager
  - google-ads-keyword-optimizer
  - google-ads-reporter

## 🚧 今後の追加予定

- google-ads-budget-manager: 予算配分最適化
- google-ads-creative-tester: 広告文A/Bテスト
- google-ads-audience-manager: オーディエンス管理