# Unson OS 技術アーキテクチャ

## 概要

Unson OSは、AIエージェントによってマイクロサービスを自動生成・運用するプラットフォームです。会社の運営自体をソフトウェア化し、OSSとして公開することで、誰もが自律的なビジネスを構築できる基盤を提供します。

## コアコンセプト

### Company-as-a-Product
- 会社運営のすべてのプロセスをコード化
- GitHubでバージョン管理
- 継続的な改善とデプロイ

### Zero-Sales Architecture
- 営業プロセスの段階的自動化
- データドリブンな顧客獲得
- 人的介入なしの価値提供

## システム構成

### 技術スタック

```
┌─────────────────────────────────────────────────┐
│              データ駆動コア層 [NEW]                │
│  - Resolver Engine (意思決定エンジン)              │
│  - Playbook DSL (宣言的フロー定義)                │
│  - CaseBook × RAG (学習システム)                 │
│  - Product SDK (イベント送信・フラグ取得)          │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│                  生成・開発層                      │
│  - Claude Code (コード生成)                       │
│  - 生成AI (画像・動画・コピー)                      │
│  - GitHub (バージョン管理)                        │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│                   運用基盤層                      │
│  - GitHub Actions (CI/CD)                       │
│  - Vercel (実行環境)                           │
│  - Convex (データベース)                        │
│  - Neon + pgvector (ナレッジベース)              │
│  - Stripe (決済)                               │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│                  観測・安全層                     │
│  - PostHog (行動分析)                           │
│  - Sentry (エラー監視)                          │
│  - Semgrep (静的解析)                           │
│  - Metabase (ダッシュボード)                     │
│  - Qdrant (ベクトル検索)                         │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│                  コスト管理層                     │
│  - Infracost (ビルド前見積)                      │
│  - CloudForecast (請求監視)                      │
└─────────────────────────────────────────────────┘
```

### 推奨技術構成

- **フロントエンド**: Next.js (App Router)
- **バックエンド**: Convex (AIエージェント特化)
- **データベース**: Convex (リアルタイム)
- **認証**: Clerk / Auth.js
- **決済**: Stripe
- **ホスティング**: Vercel

> **注**: アーキテクチャ選択の詳細な比較検討については、[アーキテクチャ比較ドキュメント](./architecture-comparison.md)を参照してください。このドキュメントでは、現在の「Vercel + Convex」構成と「Cloudflare Workersスタック」の詳細な比較分析を行い、将来的な移行戦略も含めて検討しています。

### マルチテナント設計

100個のマイクロSaaS運用に向けた段階的なマルチテナント戦略を採用します：

- **初期フェーズ**: Tenant-Light実装（最小限のテナンシーフック）
- **成長フェーズ**: 必要に応じてCloudflareでハード分離に移行

詳細は[マルチテナント戦略ドキュメント](./multi-tenant-strategy.md)を参照してください。

## DAGベースPKGシステム

### Layer 1: シンボル生成層
```
入力: SaaSメトリクス（Stripe, Analytics, Monitoring）
処理: 300-500シンボルへの正規化変換
出力: 時間窓別シンボル値（2h/24h/48h）

主要シンボル:
- B_MRR: 月次継続収益
- U_DAU_MAU: ユーザーエンゲージメント率
- M_TREND: 市場トレンド
- T_UPTIME: システム安定性
```

### Layer 2: 判定関数層
```
入力: Layer1シンボル組み合わせ
処理: SaaS特化判定関数
出力: PKG選択用ブール値

主要関数:
- L2_PMF_CHECK: Product Market Fit判定
- L2_PIVOT_DECISION: ピボット必要性判定
- L2_SCALE_READY: スケール準備判定
- L2_KILL_CHECK: サービス終了判定
```

### Layer 3: PKG実行層
```
入力: Layer2判定結果
処理: 最適PKG選択とバッチ実行
出力: 100-200個のSaaSへの同時アクション

主要PKG:
- LAUNCH_LOWPMF_IMPROVE: PMF改善パッケージ
- CRISIS_RETENTION_PIVOT: 緊急ピボット
- GROWTH_VIRAL_SCALE: バイラルスケール
- LIFECYCLE_END_CLEANUP: サービス終了処理
```

### 高速サイクル実行
```
2時間サイクル: 緊急判定（KILL, CRISIS）
24時間サイクル: 標準判定（SCALE, OPTIMIZE）
48時間サイクル: 最終判定（PIVOT）
バッチ処理: 20個ずつ並列実行
```

## AI駆動の自動化

### 市場調査エンジン
```python
# 概念的な実装例
class MarketResearchEngine:
    def discover_opportunities(self):
        # トレンドキーワードの抽出
        trends = self.extract_trends()
        
        # 技術的実現可能性の評価
        feasibility = self.assess_feasibility(trends)
        
        # ニッチ市場の特定
        niches = self.identify_niches(feasibility)
        
        return self.rank_opportunities(niches)
```

### 自動LP生成
```javascript
// LP生成フロー
async function generateLP(opportunity) {
  // コピーライティング
  const copy = await claudeCode.generateCopy(opportunity);
  
  // デザイン生成
  const design = await generateDesign(opportunity.keywords);
  
  // 人間レビュー待ち
  await humanReview.queue(design);
  
  // デプロイ
  return await vercel.deploy(copy, design);
}
```

### MVP自動開発
```typescript
// MVP開発パイプライン
interface MVPPipeline {
  generateTests(): TestSuite;
  implementFeatures(): CodeBase;
  deployToProduction(): DeploymentResult;
  monitorMetrics(): KPIReport;
}
```

## データフロー

### リアルタイムパイプライン
```
ユーザー行動
    ↓
PostHog (収集)
    ↓
Streaming ETL
    ↓
分析エンジン
    ↓
自動最適化
    ↓
A/Bテスト実行
```

### フィードバックループ
```
顧客フィードバック
    ↓
感情分析・要約
    ↓
改善提案生成
    ↓
優先順位付け
    ↓
自動実装
    ↓
効果測定
```

## セキュリティ設計

### 多層防御
1. **コードレベル**: Semgrepによる静的解析
2. **ランタイム**: Sentryによる異常検知
3. **データ**: 暗号化とアクセス制御
4. **ネットワーク**: WAF（初期はVercelの保護機能、将来的にCloudflare WAF）

### コンプライアンス
- GDPR対応のデータ分離
- PII自動マスキング
- 監査ログの完全記録

## スケーラビリティ

### 水平スケーリング
- Vercel Serverless Functionsによる自動スケール
- データベースのシャーディング
- CDNによるグローバル配信

### パフォーマンス目標
- LP生成: < 2時間
- MVP開発: < 24時間
- レスポンスタイム: < 100ms (P95)
- 可用性: 99.9%

## 開発者向けガイド

### ローカル開発環境
```bash
# リポジトリのクローン
git clone https://github.com/unson/unson-os

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env.local

# 開発サーバーの起動
npm run dev
```

### コントリビューション
1. Issueの作成または既存Issueの選択
2. フィーチャーブランチの作成
3. テスト駆動での実装
4. PRの提出
5. 自動レビューとマージ

## モニタリングとアラート

### KPIダッシュボード
- リアルタイムの収益状況
- サービスごとの健全性
- ユーザー行動の可視化
- コスト分析

### アラート設定
| メトリクス | 閾値 | アクション |
|---------|------|----------|
| エラー率 | > 5% | 自動ロールバック |
| コスト超過 | > 120% | サービス停止 |
| 転換率低下 | < 5% | A/Bテスト開始 |

## まとめ

Unson OSは、従来の企業運営を根本から再定義します。AIと人間が最適に協働し、価値創造のサイクルを限りなく高速化。これにより、アイデアが形になるまでの時間を劇的に短縮し、真に必要とされるサービスだけが生き残る健全なエコシステムを実現します。