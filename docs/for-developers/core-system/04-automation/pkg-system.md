# PKG（Package）システム設計

## 概要

PKGシステムは、プレイブックをインジケーターベースで動的に分岐・グルーピングする仕組みです。従来のフェーズ別管理ではなく、条件に応じた柔軟なフロー制御を実現します。

## 核心概念

### PKGとは
- **Package**: 条件付きで実行されるステップの集合
- **インジケーター駆動**: 記号（⬆️↗️→↘️⬇️）やメトリクスで分岐
- **動的ルーティング**: 実行時に次のPKGを決定

### フェーズとの関係
- フェーズは「運用上の便宜的なグルーピング」
- PKGは実際の実行単位
- 1つのフェーズに複数のPKGが存在可能

## PKG定義構造

```yaml
playbook: SAAS_LIFECYCLE
packages:
  pkg_crisis_recovery:
    # 実行条件
    when: "mrr_symbol == '⬇️' OR dau_symbol == '⬇️'"
    
    # 監視指標
    indicators:
      - churn_rate
      - customer_sentiment
      - competitor_activity
    
    # 実行ステップ
    steps:
      - analyze_churn_reasons
      - notify_customer_success
      - generate_emergency_measures
      - execute_ab_test
    
    # 次のPKGへの分岐
    transitions:
      - condition: "churn_rate < 5%"
        target: "pkg_recovery_success"
      - condition: "churn_rate >= 10%"
        target: "pkg_pivot_consideration"
      - condition: "no_improvement_3days"
        target: "pkg_kill_decision"
```

## PKGの種類

### 1. 標準フローPKG
通常の進行で使用される基本的なパッケージ

```yaml
pkg_standard_mvp:
  when: "lp.cvr > 0.10 AND lp.cvr < 0.15"
  steps:
    - setup_infrastructure
    - implement_core_features
    - setup_analytics
    - launch_beta
```

### 2. 高速トラックPKG
優秀な指標を示すSaaS用の加速パス

```yaml
pkg_fast_track:
  when: "lp.cvr > 0.15 AND market.competition < 3"
  steps:
    - rapid_mvp_generation
    - immediate_monetization
    - scale_preparation
```

### 3. 危機対応PKG
問題発生時の緊急対応パッケージ

```yaml
pkg_crisis_management:
  when: "any_metric.symbol == '⬇️' FOR 3_consecutive_periods"
  steps:
    - root_cause_analysis
    - emergency_measures
    - stakeholder_notification
```

### 4. 最適化PKG
継続的改善のためのパッケージ

```yaml
pkg_optimization:
  when: "status == 'stable' AND days_since_last_optimization > 30"
  steps:
    - performance_audit
    - ab_test_generation
    - incremental_improvements
```

## PKGトリガーシステム

### 記号ベーストリガー
```typescript
const symbolTriggers = {
  'mrr:⬇️': 'pkg_revenue_crisis',
  'dau:⬇️': 'pkg_user_crisis',
  'cvr:⬆️': 'pkg_fast_scale',
  'nps:↘️': 'pkg_satisfaction_improvement'
};
```

### パターンベーストリガー
```typescript
const patternTriggers = [
  {
    pattern: ['→', '↘️', '⬇️', '⬇️'],
    pkg: 'pkg_emergency_pivot',
    confidence: 0.95
  },
  {
    pattern: ['↗️', '↗️', '⬆️'],
    pkg: 'pkg_aggressive_scale',
    confidence: 0.85
  }
];
```

## PKG実行エンジン

### 選択アルゴリズム
```typescript
class PKGSelector {
  select(saasState: SaaSState): string {
    // 1. 緊急条件チェック
    if (this.checkEmergencyConditions(saasState)) {
      return this.getEmergencyPKG(saasState);
    }
    
    // 2. パターンマッチング
    const patternMatch = this.matchPatterns(saasState.symbolHistory);
    if (patternMatch) {
      return patternMatch.pkg;
    }
    
    // 3. 標準条件評価
    return this.evaluateStandardConditions(saasState);
  }
}
```

### 並列実行管理
```typescript
class PKGExecutor {
  async execute(pkg: PKG, saas: SaaS): Promise<ExecutionResult> {
    // 並列実行可能なステップを識別
    const parallelGroups = this.identifyParallelSteps(pkg.steps);
    
    // グループごとに実行
    for (const group of parallelGroups) {
      await Promise.all(
        group.map(step => this.executeStep(step, saas))
      );
    }
    
    // 次のPKG決定
    const nextPKG = this.evaluateTransitions(pkg.transitions, saas);
    return { success: true, nextPKG };
  }
}
```

## UI表示

### PKG実行状況ダッシュボード
```
┌─────────────────────────────────────────────────────────────┐
│ PKG実行状況                                                 │
├─────────────────────────────────────────────────────────────┤
│ SaaS名          │ 現在PKG              │ 進捗 │ 次の候補   │
│─────────────────┼─────────────────────┼──────┼────────────│
│ 猫カフェ予約    │ pkg_crisis_recovery  │ 35%  │ pkg_pivot  │
│ 家計簿アプリ    │ pkg_fast_mvp        │ 78%  │ pkg_scale  │
│ 英会話マッチ    │ pkg_optimization    │ 45%  │ [分岐待ち] │
└─────────────────────────────────────────────────────────────┘
```

### PKGフロー可視化
```
[pkg_mvp_standard]
       ✓
       ↓
   条件判定
   MRR: ⬇️
       ↓
[pkg_crisis_recovery] ← 現在
    35%完了
       ↓
   ┌───┴───┐
   ↓       ↓
[pivot] [improve]
```

## ベストプラクティス

### 1. PKG設計原則
- **単一責任**: 1つのPKGは1つの目的
- **明確な終了条件**: 完了基準を定義
- **失敗許容**: エラー処理を含める

### 2. 条件設計
- **測定可能**: 定量的な条件を使用
- **時間考慮**: タイムアウトを設定
- **優先順位**: 緊急度で順序付け

### 3. 移行設計
- **明示的**: 全ての出口を定義
- **デフォルト**: else条件を必ず設定
- **ループ防止**: 無限ループを回避

## PKG vs フェーズ比較

| 観点 | フェーズ管理 | PKG管理 |
|------|------------|---------|
| 柔軟性 | 固定的 | 動的 |
| 分岐 | 単純 | 複雑な条件対応 |
| 再利用 | 困難 | 容易 |
| 学習 | 個別 | パターン化可能 |
| スケール | 限定的 | 100+ SaaS対応 |

## 今後の拡張

### AIによる自動PKG生成
- 成功パターンの学習
- 新規PKGの自動提案
- A/Bテストによる最適化

### PKGマーケットプレイス
- 成功PKGの共有
- コミュニティ貢献
- ベストプラクティス蓄積