# 📚 UnsonOS ナレッジベース管理システム

Neon + pgvectorを使用したRAG対応の広告運用ノウハウ管理システム

## 🎯 目的

100-200個のマイクロSaaSを運用する中で得られた広告・マーケティングのノウハウを体系的に蓄積・検索できるシステム

## 🛠️ 技術スタック

- **Neon**: サーバーレスPostgreSQL
- **pgvector**: ベクトル類似検索
- **Node.js**: スクリプト実行環境

## 📊 データベース構造

### knowledge_experimentsテーブル
実験の詳細と学習内容を記録

| カラム | 説明 |
|--------|------|
| service_name | サービス名（例：わたしコンパス） |
| channel | チャネル（例：Google Ads） |
| experiment_date | 実験日 |
| hypothesis | 仮説 |
| metrics | メトリクス（JSONB） |
| learnings | 学び（配列） |
| next_actions | ネクストアクション（配列） |
| content_embedding | ベクトル埋め込み（RAG用） |

### campaign_metricsテーブル
キャンペーンの定量データ

| カラム | 説明 |
|--------|------|
| campaign_name | キャンペーン名 |
| impressions | インプレッション数 |
| clicks | クリック数 |
| ctr | クリック率 |
| cost_jpy | 費用（円） |
| conversions | コンバージョン数 |
| cpa_jpy | 獲得単価 |

## 🚀 セットアップ

```bash
# 1. 依存関係インストール
npm install -w scripts/knowledge-base

# 2. 環境変数設定
cp scripts/knowledge-base/.env.example scripts/knowledge-base/.env
# .envファイルを編集して、DATABASE_URLを設定

# 3. データベース初期化
node scripts/knowledge-base/setup-database.js

# 4. 初期データ投入
node scripts/knowledge-base/insert-google-ads-data.js
```

### ⚠️ 重要：環境変数の取り扱い
- `.env`ファイルは絶対にコミットしないでください
- データベース接続情報は機密情報です
- `.env.example`を参考に、自分の`.env`を作成してください

## 🔍 使用方法

### ナレッジ検索

```bash
# キーワード検索
node scripts/knowledge-base/search-knowledge.js "入札戦略"
node scripts/knowledge-base/search-knowledge.js "LP改善"
node scripts/knowledge-base/search-knowledge.js "CTR"
```

### 検索結果例

```
🔎 検索クエリ: "入札戦略"
======================================================================
📊 結果 1: わたしコンパス - Google Ads
📅 実験日: 2025-08-12

🎓 学び:
   • 入札戦略の設定ミス：コンバージョン最大化＋トラッキング未設定で配信量激減
   
✅ ネクストアクション:
   • 入札戦略を「クリック数最大化」に変更（実施済み）
```

## 📝 蓄積されているノウハウ

### Google Ads第1週（わたしコンパス）

**重要な学び:**
1. **入札戦略のミス**: コンバージョン最大化＋トラッキング未設定で配信量が1/100に
2. **CTR 18.66%**: 広告文が刺さっている証拠
3. **LP登録率0.97%**: 最大のボトルネック
4. **設定変更は逆効果**: 2週間固定が重要

**改善アクション:**
- 入札戦略を「クリック数最大化」に変更
- LP改善：思い込み破綻メッセージ強化
- フォーム簡素化（メールのみ）

## 🔄 今後の拡張

### Phase 1（実装済み）
- ✅ 基本的なテキスト検索
- ✅ メトリクスデータ管理
- ✅ 学習内容の構造化保存

### Phase 2（計画中）
- [ ] OpenAI埋め込みによるベクトル検索
- [ ] 類似実験の自動提案
- [ ] 成功パターンの抽出

### Phase 3（将来）
- [ ] 自動レポート生成
- [ ] A/Bテスト結果の自動分析
- [ ] ROI予測モデル

## 🔐 アクセス管理

- **private**: 内部のみ（デフォルト）
- **shared**: DAOメンバー共有可能
- **public**: 一般公開可能

## 📊 活用例

### 新サービス立ち上げ時
```bash
# 過去の成功パターンを検索
node search-knowledge.js "MVP 初週 成功"

# 類似サービスの実験結果を参照
node search-knowledge.js "診断ツール 広告"
```

### 問題解決時
```bash
# CTR改善のヒントを探す
node search-knowledge.js "CTR 改善"

# LP登録率向上の施策を検索
node search-knowledge.js "登録率 改善"
```

## 🤝 貢献方法

1. 新しい実験結果は`insert-[service]-data.js`として追加
2. `learnings`配列に必ず5つ以上の学びを記録
3. `next_actions`に具体的なアクションを記載
4. メトリクスは必ず定量データを含める

## 📚 関連ドキュメント

- [MVP検証フレームワーク](/docs/business-strategy/mvp-validation-framework.md)
- [Google Ads週次レポート](/reports/google-ads-weekly-report-2025-08-12.md)
- [UnsonOS戦略](/docs/executive-strategy-report.md)