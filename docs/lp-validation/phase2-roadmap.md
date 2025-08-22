# LP検証システム フェーズ2 実装ロードマップ

## 🎯 フェーズ2の目標
LP検証システムを実稼働可能な状態まで完成させ、最初のプロダクトで実証実験を開始する

## 📅 実装スケジュール（2週間）

### Week 1: バックエンド統合とAPI連携

#### Day 1-2: Convexデータベース層実装
```typescript
// 実装タスク
- [ ] lpValidationSessionsテーブルCRUD関数
- [ ] automationExecutionsログ記録関数
- [ ] systemAlertsテーブル管理関数
- [ ] メトリクス集計クエリ実装
```

**成果物:**
- `/convex/lpValidation.ts` - メイン関数
- `/convex/metrics.ts` - メトリクス集計
- `/convex/alerts.ts` - アラート管理

#### Day 3-4: Convex Cron Jobs設定
```typescript
// 4時間サイクル: Google Ads最適化
crons.interval(
  "google-ads-optimization",
  { hours: 4 },
  api.lpValidation.optimizeGoogleAds
)

// 24時間サイクル: LP改善提案
crons.daily(
  "lp-improvement-suggestions",
  { hourUTC: 2, minuteUTC: 0 }, // JST 11:00
  api.lpValidation.generateImprovements
)
```

**成果物:**
- `/convex/crons.ts` - Cronジョブ定義
- `/convex/automation.ts` - 自動化ロジック

#### Day 5: Google Ads API統合
```typescript
// 実装項目
- [ ] OAuth2.0認証フロー実装
- [ ] Customer IDセレクター
- [ ] キャンペーン一覧取得
- [ ] メトリクス取得API
- [ ] 最適化アクション実行API
```

**成果物:**
- `/lib/google-ads/auth.ts` - 認証
- `/lib/google-ads/client.ts` - APIクライアント
- `/app/api/google-ads/` - APIエンドポイント

### Week 2: フロントエンドとシステム統合

#### Day 6-7: LP検証ダッシュボードUI
```tsx
// 主要コンポーネント
- SessionOverview: アクティブセッション一覧
- MetricsDashboard: KPIリアルタイム表示
- OptimizationLog: 実行履歴タイムライン
- AlertsPanel: アラート＆通知
- PhaseTransitionModal: フェーズ移行承認
```

**成果物:**
- `/app/(portal)/lp-validation/page.tsx` - メインページ
- `/components/lp-validation/` - UIコンポーネント群

#### Day 8: プレイブック連携
```typescript
// PB-001: LP CVRテスト＆MVP開発
interface PlaybookIntegration {
  playbookId: "PB-001"
  currentPhase: 1 | 2 | 3
  phaseCompletion: number // 0-100%
  nextActions: string[]
  kpiStatus: {
    cvr: { current: number; target: 10 }
    cpa: { current: number; target: 300 }
    sessions: { current: number; target: 1000 }
  }
}
```

**成果物:**
- `/lib/playbook/pb-001.ts` - プレイブック定義
- `/lib/playbook/phase-manager.ts` - フェーズ管理

#### Day 9: GitHub PR自動作成
```typescript
// PR作成フロー
1. LP改善提案生成（OpenAI）
2. コード変更差分作成
3. 新ブランチ作成
4. コミット＆プッシュ
5. PR作成（expected improvement含む）
6. Discord通知送信
```

**成果物:**
- `/lib/github/pr-creator.ts` - PR作成
- `/lib/github/code-modifier.ts` - コード変更

#### Day 10: 統合テストとデバッグ
```typescript
// E2Eテストシナリオ
- [ ] 新規セッション開始→メトリクス収集
- [ ] CPA閾値超過→自動最適化実行
- [ ] CVR目標達成→フェーズ移行提案
- [ ] LP改善→PR作成→レビュー依頼
```

**成果物:**
- `/e2e/lp-validation.spec.ts` - E2Eテスト
- `/lib/lp-validation/integration.test.ts` - 統合テスト

## 🚀 デプロイ準備チェックリスト

### 環境変数設定
```env
# 必須API Keys
GOOGLE_ADS_CLIENT_ID=
GOOGLE_ADS_CLIENT_SECRET=
GOOGLE_ADS_DEVELOPER_TOKEN=
GOOGLE_ADS_REFRESH_TOKEN=
OPENAI_API_KEY=
DISCORD_BOT_TOKEN=
GITHUB_TOKEN=

# Convex
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# 設定値
LP_VALIDATION_ENABLED=true
GOOGLE_ADS_DAILY_BUDGET_LIMIT=10000
GOOGLE_ADS_MAX_CPA_THRESHOLD=1000
```

### セキュリティ確認
- [ ] API Keyの暗号化保存
- [ ] Rate Limiting実装
- [ ] エラーハンドリング強化
- [ ] ログ記録とモニタリング

### パフォーマンス最適化
- [ ] Convexクエリ最適化
- [ ] キャッシュ戦略実装
- [ ] バッチ処理の並列化
- [ ] フロントエンド遅延読み込み

## 📊 成功指標

### 技術指標
- Cronジョブ成功率: 99%以上
- API応答時間: 500ms以内
- エラー率: 1%未満
- 自動化カバレッジ: 80%以上

### ビジネス指標
- LP登録率: 10%達成
- CPA: ¥300以内
- 7日後継続率: 50%以上
- フェーズ1→2移行: 2週間以内

## 🔄 次のアクション

### 即座に開始すべきタスク
1. **Convexスキーマ実装** - 既存のschema.tsを拡張
2. **Google Ads認証テスト** - サンドボックス環境で検証
3. **Discord Bot登録** - 本番サーバー設定

### 並行して進められるタスク
- UIモックアップ作成（Figma）
- APIドキュメント整備（OpenAPI）
- テストデータ準備

### ブロッカーと対策
| リスク | 影響度 | 対策 |
|--------|--------|------|
| Google Ads API承認遅延 | 高 | テストアカウントで先行開発 |
| OpenAI Rate Limit | 中 | バッチ処理とキューイング実装 |
| Convex料金超過 | 低 | 使用量モニタリング設定 |

## 💡 実装のコツ

### 開発効率を上げるために
```bash
# Git Worktree活用
git worktree add ../lp-validation-ui -b feature/lp-validation-ui
git worktree add ../lp-validation-api -b feature/lp-validation-api

# 並行開発で時間短縮
```

### テスト駆動を維持
```typescript
// 各機能実装前に必ずテストから
describe('新機能', () => {
  it('期待される動作', () => {
    // RED: テスト作成
    // GREEN: 最小実装
    // REFACTOR: 改善
  })
})
```

### 段階的リリース
1. **Alpha**: 内部テスト（開発チームのみ）
2. **Beta**: 限定公開（選定した1プロダクト）
3. **GA**: 全プロダクト展開

---

## 📝 備考

このロードマップは柔軟に調整可能です。
実装中に発見した課題や新しいアイデアは、随時取り込んでいきましょう。

**重要**: YAGNI原則を守り、必要最小限の機能から始める。
過度な最適化は避け、動くものを早く作ることを優先する。