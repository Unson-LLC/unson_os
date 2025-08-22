# LP検証システムMVP 設計書

## プロジェクト概要

### 目的
現在手動で行っているLP検証プロセスを完全自動化し、適切なタイミングで意思決定できるシステムを構築する。

### 現状の課題
- LP検証が手動で非効率
- Google Ads運用の最適化が不十分
- PostHogデータとの連携不足
- 意思決定のタイミングが不明確
- 6個のマイクロSaaSプロダクトを効率的に管理できていない

### 解決方針
- **4時間サイクル**: Google Ads自動最適化（キーワード入札、広告文調整）
- **24時間サイクル**: LP改善提案（PostHogデータ分析、Claude Code自動デプロイ）
- **リアルタイム**: KPI監視・アラート通知
- **週次**: フェーズ移行判定支援

## 目標KPI

### CVR（コンバージョン率）
- **目標**: 10%以上（email登録数 ÷ LP訪問者数）
- **測定**: PostHog event tracking
- **判定**: 統計的有意性確認（p < 0.05）

### CPA（顧客獲得コスト） 
- **目標**: 300円以内
- **計算**: CPC 10-30円 × CVR 10% = 100-300円
- **監視**: Google Ads API経由でリアルタイム追跡

### 最小セッション数
- **基準**: 1,000セッション/週以上で判定実行
- **データソース**: PostHog session analytics

## システム設計

### アーキテクチャ概要

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Google Ads    │◄──►│  UnsonOS Core    │◄──►│    PostHog      │
│   (4hr cycle)   │    │   (Central)      │    │  (24hr cycle)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                             ▲        ▲
                             │        │
┌─────────────────┐         │        │         ┌─────────────────┐
│   Claude Code   │◄────────┘        └────────►│     Convex      │
│  (Auto Deploy)  │                            │   (Database)    │
└─────────────────┘                            └─────────────────┘
```

### データフロー設計

#### 4時間サイクル（Google Ads最適化）
1. **データ収集**
   - CPC、CTR、CV数をGoogle Ads APIで取得
   - キーワード別パフォーマンス分析
   
2. **自動調整実行**
   - 低パフォーマンスキーワードの入札価格調整
   - 高パフォーマンス広告文の予算配分増加
   - 新規キーワード候補の自動追加

3. **結果記録**
   - 調整内容をConvex DBに保存
   - 効果測定データの蓄積

#### 24時間サイクル（LP改善）
1. **ユーザー行動分析**
   - PostHogからheatmap、scroll depth取得
   - 離脱ポイント・改善箇所特定
   
2. **改善提案生成**
   - AIによるコピー改善案作成
   - A/Bテスト設計提案
   
3. **自動デプロイ**
   - Claude Codeによる実装
   - Vercel自動デプロイ

### データベース設計（Convex拡張）

```typescript
// LP検証セッション管理
lpValidationSessions: defineTable({
  workspace_id: v.string(),
  product_id: v.string(),
  session_id: v.string(),
  status: v.union(v.literal("active"), v.literal("paused"), v.literal("completed")),
  start_date: v.number(),
  target_cvr: v.number(),
  current_cvr: v.number(),
  total_sessions: v.number(),
  total_conversions: v.number(),
  current_cpa: v.number(),
  // Google Ads関連
  campaign_id: v.string(),
  ad_group_ids: v.array(v.string()),
  // PostHog関連
  posthog_project_id: v.string(),
  // 自動化設定
  auto_optimization_enabled: v.boolean(),
  auto_deployment_enabled: v.boolean(),
})

// 自動最適化履歴
optimizationHistory: defineTable({
  workspace_id: v.string(),
  session_id: v.string(),
  optimization_type: v.union(v.literal("google_ads"), v.literal("lp_content")),
  executed_at: v.number(),
  details: v.any(), // 最適化内容の詳細
  results: v.any(), // 効果測定結果
  ai_analysis: v.optional(v.string()),
})

// フェーズ移行判定
phaseGateDecisions: defineTable({
  workspace_id: v.string(),
  product_id: v.string(),
  current_phase: v.number(),
  target_phase: v.number(),
  decision_status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
  kpi_snapshot: v.any(),
  ai_recommendation: v.string(),
  human_decision: v.optional(v.string()),
  decided_at: v.optional(v.number()),
})
```

## ユーザーインターフェース設計

### メイン画面構成

#### 1. LP検証ダッシュボード
```
┌─────────────────────────────────────────────────────────────┐
│                    LP検証センター                             │
├─────────────────────────────────────────────────────────────┤
│ 🎯 現在の検証状況                                            │
│ ┌─AI Bridge────┬─AI Coach─────┬─AI Stylist───┬─MyWa────────┐ │
│ │ CVR: 8.2%    │ CVR: 12.1% ✅│ CVR: 5.4%    │ 本番運用中   │ │
│ │ CPA: ¥280    │ CPA: ¥250    │ CPA: ¥420 ⚠ │ ARR: ¥50万  │ │
│ │ 進行中...    │ 合格！       │ 要改善       │             │ │
│ └─────────────┴─────────────┴─────────────┴─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### 2. 自動化コントロールパネル
```
┌─────────────────────────────────────────────────────────────┐
│ ⚙️ 自動化設定                                               │
├─────────────────────────────────────────────────────────────┤
│ Google Ads最適化    [●ON ]  最終実行: 2時間前               │
│ LP自動改善         [●ON ]  最終実行: 18時間前              │
│ Claude Code自動実装 [●ON ]  最終実行: 3日前                │
│                                                             │
│ 📊 今日の自動調整結果                                        │
│ • キーワード入札調整: 15件                                   │
│ • 低パフォーマンス広告停止: 3件                              │
│ • CVR改善提案: AI Bridge LP header修正                      │
└─────────────────────────────────────────────────────────────┘
```

#### 3. 意思決定支援パネル
```
┌─────────────────────────────────────────────────────────────┐
│ 🤖 AI推奨アクション                                         │
├─────────────────────────────────────────────────────────────┤
│ 🚀 AI Coach: フェーズ2移行を推奨                             │
│    理由: CVR 12.1% (目標10%達成), CPA ¥250 (目標内)        │
│    次のアクション: MVP開発開始                               │
│    [承認] [詳細確認] [保留]                                 │
│                                                             │
│ ⚠️  AI Stylist: 広告予算見直しを推奨                         │
│    理由: CPA ¥420 (目標300円超過), CVR改善必要              │
│    提案: LP主要メッセージ変更 + 入札戦略調整                │
│    [実行] [詳細確認] [無視]                                 │
└─────────────────────────────────────────────────────────────┘
```

### 詳細分析画面

#### LP検証詳細ビュー
```
┌─────────────────────────────────────────────────────────────┐
│ AI世代間ブリッジ - LP検証詳細                                │
├─────────────────────────────────────────────────────────────┤
│ 📈 KPI推移 (過去30日)                                       │
│ CVR:  [▓▓▓▓▓▓░░░░] 8.2% (目標10%)                          │
│ CPA:  [▓▓▓▓▓▓▓░░░] ¥280 (目標300円以内) ✅                  │
│ セッション: 1,247 (目標1,000以上) ✅                        │
│                                                             │
│ 🎯 PostHog分析                                              │
│ • 離脱率最高箇所: 価格セクション (45%離脱)                   │
│ • スクロール深度: 平均68% (改善余地あり)                     │
│ • フォーム到達率: 15% → CVR改善ポイント                     │
│                                                             │
│ 🤖 AI改善提案                                               │
│ • 価格提示方法の改善 (月額 → 「1日あたり」表現)              │
│ • ヒーローセクションのCTA配置調整                            │
│ • 社会的証明要素の追加                                       │
│                                                             │
│ [自動改善実行] [A/Bテスト開始] [手動調整]                    │
└─────────────────────────────────────────────────────────────┘
```

## 技術実装仕様

### Google Ads自動化 (4時間サイクル)

#### 実装ファイル構成
```
/scripts/lp-validation-automation/
├── google-ads-optimizer.js
├── keyword-bidding-strategy.js  
├── ad-performance-analyzer.js
└── config/
    └── optimization-rules.yaml
```

#### コアロジック
```javascript
// 4時間毎実行のcronジョブ
async function optimizeGoogleAds(productId) {
  // 1. パフォーマンスデータ取得
  const adData = await fetchAdPerformance(productId);
  
  // 2. 最適化ルール適用
  const optimizations = analyzeAndSuggest(adData);
  
  // 3. 自動調整実行
  for (const opt of optimizations) {
    if (opt.confidence > 0.8) {
      await executeOptimization(opt);
      await logToConvex(opt);
    }
  }
  
  // 4. 結果通知
  await sendSlackNotification(optimizations);
}
```

### PostHog分析 (24時間サイクル)

#### LP改善分析エンジン
```javascript
async function analyzeLPPerformance(productId) {
  // 1. PostHogからユーザー行動データ取得
  const userBehavior = await posthog.query({
    kind: "HogQLQuery",
    query: `
      SELECT 
        url, 
        avg(scroll_depth) as avg_scroll,
        count() as sessions,
        countIf(event = 'email_signup') / count() as cvr
      FROM events 
      WHERE product_id = '${productId}'
      GROUP BY url
    `
  });
  
  // 2. AIによる改善提案生成
  const improvements = await generateImprovements(userBehavior);
  
  // 3. Claude Codeによる自動実装
  if (improvements.auto_implementable) {
    await claudeCodeDeploy(improvements);
  }
  
  return improvements;
}
```

### フェーズ移行判定システム

#### 自動判定ロジック
```typescript
interface PhaseGateDecision {
  productId: string;
  currentPhase: number;
  targetPhase: number;
  kpiMetrics: {
    cvr: number;
    cpa: number;
    sessions: number;
    statisticalSignificance: boolean;
  };
  aiRecommendation: 'approve' | 'reject' | 'wait';
  confidence: number;
}

async function evaluatePhaseTransition(productId: string): Promise<PhaseGateDecision> {
  const metrics = await getCurrentKPIs(productId);
  
  // フェーズ1→2の判定基準
  if (metrics.cvr >= 0.10 && 
      metrics.cpa <= 300 && 
      metrics.sessions >= 1000 &&
      metrics.statisticalSignificance) {
    
    return {
      productId,
      currentPhase: 1,
      targetPhase: 2,
      kpiMetrics: metrics,
      aiRecommendation: 'approve',
      confidence: 0.95
    };
  }
  
  // 改善提案と再評価時期の算出
  return generateImprovementPlan(metrics);
}
```

## 開発・運用フェーズ

### Phase 1: 基盤構築 (2週間)
- [ ] Convex schema拡張
- [ ] Google Ads API連携
- [ ] PostHog API連携  
- [ ] 基本UI作成

### Phase 2: 自動化実装 (3週間)
- [ ] 4時間サイクル最適化
- [ ] 24時間サイクル改善
- [ ] Claude Code連携
- [ ] テスト・デバッグ

### Phase 3: AI判定システム (2週間)  
- [ ] フェーズ移行判定
- [ ] AIレコメンデーション
- [ ] 通知・アラート
- [ ] 本番デプロイ

### Phase 4: 監視・改善 (継続)
- [ ] パフォーマンス監視
- [ ] ユーザーフィードバック収集
- [ ] システム改善
- [ ] 新プロダクト対応

## 期待効果

### 短期効果 (1ヶ月)
- LP検証作業時間 90%削減
- CPA平均 15%改善
- CVR判定精度向上

### 中期効果 (3ヶ月)
- 新プロダクト立ち上げ速度 3倍向上
- フェーズ移行成功率 80%以上
- 運用コスト 50%削減

### 長期効果 (6ヶ月以降)
- 100-200プロダクト同時管理実現
- AI主導の意思決定システム確立
- 「Company-as-a-Product」モデル完成

---

この設計書に基づいて、LP検証システムMVPの実装を開始し、UnsonOSの本格的なスケーリングを実現します。