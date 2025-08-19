# Microsoft Clarity MCP Server Setup

## 概要

unson_osリポジトリで Microsoft Clarity データを自然言語で分析するためのMCPサーバー設定ガイド。

## 🚀 セットアップ手順

### 1. 依存関係のインストール

```bash
npm install
```

Microsoft Clarity MCPサーバーは package.json に含まれているため、自動的にインストールされます。

### 2. Clarity API Tokenの取得

1. [Microsoft Clarity](https://clarity.microsoft.com/) にアクセス
2. プロジェクトを作成（まだの場合）
3. Settings → API → Generate API Token
4. トークンをコピー

### 3. 環境変数の設定

プロジェクトルートに `.env.local` を作成：

```bash
# Microsoft Clarity API Token
CLARITY_API_TOKEN=your_clarity_api_token_here
```

### 4. MCPサーバーの確認

MCPサーバー設定は `.mcp/config.json` に定義されています：

```json
{
  "mcpServers": {
    "clarity": {
      "command": "npx",
      "args": ["@microsoft/clarity-mcp-server"],
      "env": {
        "CLARITY_API_TOKEN": ""
      }
    }
  }
}
```

## 🔍 使用方法

### 自然言語でのデータ分析

Claude Code経由で自然言語クエリが可能：

```
"過去7日間のmywa LPで：
- フォーム送信率をデバイス別で分析
- 離脱率が高いセクションを特定
- コンバージョンに至るユーザーの行動パターンを抽出"
```

### 利用可能な分析項目

- **スクロール深度**: どこまで読まれたか
- **エンゲージメント時間**: 各セクションの滞在時間
- **デバイス別分析**: PC vs スマホの行動差
- **トラフィック分析**: 流入元と行動パターン
- **ヒートマップデータ**: クリック・タップ分布

### フィルタリング機能

最大3次元でのフィルタリングが可能：

- **Browser**: Chrome, Safari, Firefox など
- **Device**: Desktop, Mobile, Tablet
- **Country/Region**: 地域別分析
- **OS**: Windows, macOS, iOS, Android

## 📊 分析例

### コンバージョン率改善分析

```
"ai-bridge LPの過去14日間で：
1. フォーム到達率をブラウザ別で分析
2. 途中離脱が多いセクションを特定
3. モバイルユーザーの課題を抽出
4. 改善提案を3つ提示"
```

### A/Bテスト効果測定

```
"mywa LPの新デザインと旧デザインで：
- エンゲージメント時間を比較
- スクロール深度の違いを分析
- コンバージョン率への影響を評価"
```

## 🛠️ トラブルシューティング

### APIトークンエラー

```
Error: Clarity API Token not found
```

**解決方法**:
1. `.env.local` にトークンが正しく設定されているか確認
2. トークンの有効期限をチェック
3. プロジェクトのアクセス権限を確認

### データが表示されない

**確認項目**:
1. Clarityタグが各LPに正しく実装されているか
2. データ収集開始から24-48時間経過しているか
3. プロジェクトIDが正しく設定されているか

## 🔗 関連リソース

- [Microsoft Clarity公式ドキュメント](https://docs.microsoft.com/clarity/)
- [MCP公式仕様](https://spec.modelcontextprotocol.io/)
- [Analytics実装戦略](../../business-strategy/marketing/analytics-implementation-strategy.md)

## 🚨 注意事項

### プライバシー対応
- GDPR・CCPA準拠の確認
- ユーザー同意の適切な実装
- データ保持期間の設定

### セキュリティ
- API トークンをGitにコミットしない
- 本番環境では環境変数で管理
- アクセス権限の最小化

---

**最終更新**: 2025年8月19日  
**担当**: Analytics Team