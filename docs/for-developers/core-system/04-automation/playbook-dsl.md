# プレイブックDSL仕様書

## 概要

プレイブックDSL（Domain Specific Language）は、UnsonOSのデータ駆動意思決定を宣言的に記述するための言語です。YAML形式で記述し、条件分岐、アクション実行、承認フロー、結果評価を統一的に表現します。

## 基本構造

```yaml
playbookId: PLB^{service}_{scenario}
version: {semantic_version}
scope:
  tags: [list_of_tags]
windows:
  {window_name}: {duration}
nodes:
  - {node_definitions}
```

## スキーマ定義

### ルートスキーマ

```typescript
type Playbook = {
  playbookId: string        // 一意識別子（PLB^prefix）
  version: string           // セマンティックバージョニング
  scope: Scope             // 適用範囲
  windows: Windows         // 観測窓定義
  nodes: Node[]           // ノードグラフ
  metadata?: Metadata     // オプショナルメタデータ
}
```

### Scope（適用範囲）

```typescript
type Scope = {
  tags: string[]          // 適用タグ（include）
  exclude?: string[]      // 除外タグ
  priority?: number       // 優先度（デフォルト: 0）
}
```

#### タグ形式
- `saas:{name}` - 特定のSaaS
- `saas:*` - 全SaaS
- `market:{code}` - 市場（JP/EN/CN等）
- `channel:{type}` - チャネル（Web/LINE/Ads等）
- `persona:{segment}` - ペルソナ（SMB/Enterprise/Freelance等）
- `stage:{phase}` - ステージ（Idea/LP/MVP/Scale）

### Windows（観測窓）

```typescript
type Windows = {
  tiny?: string    // デフォルト: "24h"
  short?: string   // デフォルト: "7d"
  mid?: string     // デフォルト: "14d"
  long?: string    // デフォルト: "28d"
  custom?: Record<string, string>  // カスタム窓
}
```

## ノードタイプ

### 1. Start Node（開始）

```yaml
- id: start
  type: Start
  next: {next_node_id}
```

```typescript
type StartNode = {
  id: string
  type: 'Start'
  next: string
}
```

### 2. Guard Node（条件分岐）

```yaml
- id: g_{name}
  type: Guard
  any:    # OR条件
    - code: "{Stage}|{Window}|{Segment}"
      metric: "{metric_name}"
      dir: "{Up|Down|Flat}"
  all:    # AND条件
    - {...}
  then: {true_branch_node_id}
  else: {false_branch_node_id}
```

```typescript
type GuardNode = {
  id: string
  type: 'Guard'
  any?: Condition[]    // OR条件
  all?: Condition[]    // AND条件
  then: string         // 条件成立時の遷移先
  else: string         // 条件不成立時の遷移先
}

type Condition = {
  code: string         // "Stage=LP|Window=short|Segment=JP-Web-SMB"
  metric: MetricType   // CVR, A1, RET7, ARPU等
  dir: Direction       // Up, Down, Flat
  threshold?: number   // オプション：カスタム閾値
}
```

#### Code形式
```
Stage={Idea|LP|MVP|Scale}|Window={tiny|short|mid|long}|Segment={market-channel-persona}
```

### 3. Action Node（アクション実行）

```yaml
- id: a_{name}
  type: Action
  flags:
    {flag_key}: {flag_value}
  rollout:
    strategy: {canary|bandit|blue-green}
    # strategy固有のパラメータ
  next: {next_node_id}
```

```typescript
type ActionNode = {
  id: string
  type: 'Action'
  flags: Record<string, any>     // Feature Flags
  rollout: RolloutStrategy       // 展開戦略
  next: string                    // 次のノード
  riskClass?: 'low'|'medium'|'high'  // リスクレベル
}
```

#### Rollout戦略

##### Canary
```yaml
rollout:
  strategy: "canary"
  steps: [0.05, 0.15, 0.30, 0.50, 1.00]
  intervalMinutes: 120
  rollbackCondition:
    metric: "CVR"
    threshold: -10
```

##### Bandit
```yaml
rollout:
  strategy: "bandit"
  algorithm: "thompson"  # or "ucb"
  maxExposure: 0.4
  explorationRate: 0.1
```

##### Blue-Green
```yaml
rollout:
  strategy: "blue-green"
  healthCheckMinutes: 30
```

### 4. Gate Node（承認ゲート）

```yaml
- id: gate_{name}
  type: Gate
  approverRole: {role_name}
  timeoutMinutes: {timeout}
  onApprove: {approve_node_id}
  onReject: {reject_node_id}
  message: "承認依頼メッセージ"
```

```typescript
type GateNode = {
  id: string
  type: 'Gate'
  approverRole: string       // 承認者ロール
  timeoutMinutes: number     // タイムアウト（分）
  onApprove: string         // 承認時の遷移先
  onReject: string          // 却下時の遷移先
  message?: string          // 承認依頼メッセージ
  escalation?: string       // エスカレーション先
}
```

> **UIでの承認操作**: Gate承認は[管理ダッシュボード](./ui-storyboard.md#gate承認操作のセーフガード)を通じて行われます。確認ダイアログ、二段階確認、操作履歴記録などのセーフガード機能により、安全な承認プロセスを実現します。

### 5. Outcome Node（結果評価）

```yaml
- id: outcome
  type: Outcome
  horizonDays: {evaluation_period}
  kpi:
    - {metric_name}
  writeBack: "casebook"
  tags:
    - "experiment:{name}"
```

```typescript
type OutcomeNode = {
  id: string
  type: 'Outcome'
  horizonDays: number       // 評価期間（日）
  kpi: string[]            // 評価指標
  writeBack: 'casebook'    // 保存先
  tags?: string[]          // タグ付け
  successCriteria?: {      // 成功条件
    metric: string
    lift: number
  }
}
```

## 完全な例

### マイクロSaaS運用最適化システム

```yaml
pkgSystemId: PKG^MICROSAAS_OPTIMIZATION
version: 3.0.0
scope:
  saasList: 
    - "saas:*"
  exclude:
    - "saas:enterprise_tools"
  lifecycleStage:
    - "LAUNCH"
    - "GROWTH"
    - "STABLE"
  priority: 10
  batchSize: 20

timeWindows:
  rapid: "2h"
  standard: "24h"
  extended: "48h"
  weekly: "7d"

layers:
  # Layer 1: SaaSシンボル生成
  - id: layer1_saas_symbols
    type: SymbolGeneration
    symbols:
      # ビジネス指標
      - id: B_MRR
        source: "stripe.monthly_recurring_revenue"
        normalization: "target_based"
        target: 100000
      - id: B_CHURN
        source: "analytics.churn_rate"
        normalization: "inverse_percentage"
        dangerLine: 10
      - id: B_LTV_CAC
        source: "calculated.ltv_cac_ratio"
        normalization: "ratio_based"
        target: 3.0
        
      # ユーザー行動指標  
      - id: U_DAU_MAU
        source: "analytics.engagement_ratio"
        normalization: "direct_ratio"
      - id: U_RETENTION_D7
        source: "analytics.retention_7day"
        normalization: "percentage"
        
      # 市場状況指標
      - id: M_TREND
        source: "google_trends.search_volume"
        normalization: "log_based"
        
      # 技術指標
      - id: T_UPTIME
        source: "monitoring.uptime_percentage"
        normalization: "percentage"
        
  # Layer 2: SaaS判定関数
  - id: layer2_saas_judgment
    type: JudgmentFunctions
    functions:
      # PMF判定
      - id: L2_PMF_CHECK
        type: PMF
        inputs: ["U_RETENTION_D7", "B_GROWTH", "U_DAU_MAU"]
        timeWindow: "7d"
        condition: |
          retention = inputs[0];
          growth = inputs[1];
          engagement = inputs[2];
          return retention > 0.5 && growth > 0.2 && engagement > 0.4;
          
      # ピボット判定
      - id: L2_PIVOT_DECISION
        type: PIVOT
        inputs: ["B_MRR", "U_RETENTION_D7", "M_TREND"]
        timeWindow: "48h"
        attempts: 3
        condition: |
          mrr = inputs[0];
          retention = inputs[1];
          trend = inputs[2];
          return mrr < 0.1 && retention < 0.2 && trend < 0.3;
          
      # スケール準備判定
      - id: L2_SCALE_READY
        type: SCALE
        inputs: ["B_LTV_CAC", "B_GROWTH", "T_UPTIME"]
        timeWindow: "24h"
        condition: |
          ltv_cac = inputs[0];
          growth = inputs[1];
          uptime = inputs[2];
          return ltv_cac > 0.7 && growth > 0.3 && uptime > 0.99;
          
      # キル判定
      - id: L2_KILL_CHECK
        type: KILL
        inputs: ["B_MRR", "B_RUNWAY", "U_DAU_MAU"]
        timeWindow: "2h"
        daysThreshold: 90
        condition: |
          mrr = inputs[0];
          runway = inputs[1];
          engagement = inputs[2];
          return mrr < 0.01 && runway < 0.1 && engagement < 0.05;
          
  # Layer 3: PKG選択・実行
  - id: layer3_pkg_execution
    type: PKGExecution
    selectors:
      - conditions:
          layer2Functions: ["L2_PMF_CHECK"]
          logic: "FALSE"
          resultPKG: "LAUNCH_LOWPMF_IMPROVE"
          priority: "high"
      - conditions:
          layer2Functions: ["L2_PIVOT_DECISION"]
          logic: "TRUE"
          resultPKG: "CRISIS_RETENTION_PIVOT"
          priority: "critical"
      - conditions:
          layer2Functions: ["L2_SCALE_READY"]
          logic: "TRUE"
          resultPKG: "GROWTH_VIRAL_SCALE"
          priority: "medium"
      - conditions:
          layer2Functions: ["L2_KILL_CHECK"]
          logic: "TRUE"
          resultPKG: "LIFECYCLE_END_CLEANUP"
          priority: "critical"
    execution:
      batchProcessing:
        enabled: true
        size: 20
        concurrency: 5
      timeout: "30m"
      retryPolicy:
        maxAttempts: 3
        backoffMultiplier: 2
        
# PKG定義
pkgDefinitions:
  LAUNCH_LOWPMF_IMPROVE:
    name: "Low PMF Improvement Package"
    steps:
      - id: "analyze_user_behavior"
        parallel: false
        timeout: "10m"
        actions:
          - collect_user_feedback
          - analyze_drop_off_points
          - identify_friction_areas
      - id: "generate_improvement_plan"
        parallel: false
        timeout: "5m"
        actions:
          - create_optimization_strategy
          - prioritize_improvements
      - id: "execute_ab_tests"
        parallel: true
        timeout: "20m"
        actions:
          - test_onboarding_flow
          - test_core_features
          - test_pricing_model
    exitConditions:
      - function: "L2_PMF_CHECK"
        threshold: "TRUE"
        timeout: "7d"
        
  CRISIS_RETENTION_PIVOT:
    name: "Crisis Retention Pivot Package"
    steps:
      - id: "emergency_analysis"
        parallel: false
        timeout: "5m"
        actions:
          - identify_critical_issues
          - analyze_churn_patterns
      - id: "pivot_strategy_generation"
        parallel: false
        timeout: "10m"
        actions:
          - generate_pivot_options
          - validate_market_fit
      - id: "rapid_implementation"
        parallel: true
        timeout: "15m"
        actions:
          - implement_core_changes
          - update_messaging
          - adjust_pricing
    exitConditions:
      - function: "L2_PIVOT_DECISION"
        threshold: "FALSE"
        timeout: "48h"
        
  GROWTH_VIRAL_SCALE:
    name: "Growth Viral Scale Package"
    steps:
      - id: "scale_infrastructure"
        parallel: false
        timeout: "10m"
      - id: "viral_mechanics"
        parallel: true
        timeout: "15m"
      - id: "marketing_automation"
        parallel: true
        timeout: "20m"
    exitConditions:
      - function: "L2_SCALE_READY"
        threshold: "SUSTAINED"
        timeout: "30d"
```

## バリデーションルール

### 必須フィールド
- `playbookId`: PLB^で始まる一意識別子
- `version`: セマンティックバージョニング（x.y.z）
- `nodes`: 最低1つのStartノードと1つのOutcomeノード

### グラフ構造
- 全てのノードは到達可能でなければならない
- 循環参照は禁止（DAGであること）
- Startノードは1つのみ
- 全パスはOutcomeノードで終了

### 命名規則
- Node ID: `{type_prefix}_{descriptive_name}`
  - Start: `start`
  - Guard: `g_{name}`
  - Action: `a_{name}`
  - Gate: `gate_{name}`
  - Outcome: `outcome` or `outcome_{name}`

### リスククラス
- `high`: Gate必須、営業時間内のみ実行
- `medium`: 承認推奨、段階的展開必須
- `low`: 自動実行可能

## 拡張機能

### カスタムメトリクス
```yaml
metrics:
  custom_nps:
    type: "survey"
    source: "typeform"
    calculation: "average"
    window: "7d"
```

### 条件式
```yaml
- id: complex_guard
  type: Guard
  expression: |
    (CVR.short.down AND A1.tiny.flat) OR
    (RET7.mid.down AND ARPU.long.up)
  then: action_a
  else: action_b
```

### テンプレート参照
```yaml
extends: "templates/standard_onboarding.yaml"
override:
  nodes:
    - id: test_hero_copy
      flags:
        "hero.headline": "カスタムヘッドライン"
```

## エラーハンドリング

### 実行時エラー
- ノード未定義: 次のノードにフォールバック
- タイムアウト: デフォルトパスを実行
- API失敗: リトライ後、エラーノードへ

### バリデーションエラー
```json
{
  "errors": [
    {
      "path": "nodes[2].rollout.steps",
      "message": "Steps must be in ascending order"
    }
  ]
}
```

## ベストプラクティス

### 1. 小さく始める
- 最初は単純なA/Bテストから
- 徐々に複雑な条件を追加

### 2. 明確な成功基準
- 各Outcomeに具体的な数値目標を設定
- 主要KPIと補助KPIを区別

### 3. 適切なリスク管理
- 高影響変更にはGateを設置
- Canaryで段階的に展開

### 4. 学習の蓄積
- 全実験をCaseBookに記録
- 失敗からも学びを抽出

### 5. 命名の一貫性
- チーム内で命名規則を統一
- 説明的な名前を使用

## ツールとサポート

### VSCode Extension
- YAML構文ハイライト
- スキーマ検証
- 自動補完
- グラフビジュアライザー

### CLI Tools
```bash
# バリデーション
playbook validate onboarding.yaml

# グラフ可視化
playbook visualize onboarding.yaml

# 実行シミュレーション
playbook simulate onboarding.yaml --events events.json

# デプロイ
playbook deploy onboarding.yaml --env staging
```

### 監視ダッシュボード
- ノード実行状況
- KPIトレンド
- ロールアウト進捗
- エラー率

## 関連ドキュメント

- [データ駆動コアシステム](./data-driven-core.md)
- [Product SDK実装ガイド](./product-sdk-guide.md)
- [CaseBook設計](./casebook-design.md)
- [運用手順書](./operation-guide.md)