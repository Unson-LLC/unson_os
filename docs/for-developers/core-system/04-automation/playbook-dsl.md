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

### オンボーディング最適化プレイブック

```yaml
playbookId: PLB^onboarding_optimization
version: 2.1.0
scope:
  tags: 
    - "saas:*"
    - "market:JP"
    - "channel:Web"
  exclude:
    - "persona:Enterprise"
  priority: 10

windows:
  tiny: "24h"
  short: "7d"
  mid: "14d"
  long: "28d"

nodes:
  # 開始
  - id: start
    type: Start
    next: check_cvr_trend

  # CVRトレンドチェック
  - id: check_cvr_trend
    type: Guard
    any:
      - code: "Stage=LP|Window=short|Segment=JP-Web-SMB"
        metric: "CVR"
        dir: "Down"
        threshold: -10
    then: test_hero_copy
    else: check_retention

  # リテンションチェック
  - id: check_retention
    type: Guard
    all:
      - code: "Stage=MVP|Window=short|Segment=JP-Web-SMB"
        metric: "RET7"
        dir: "Down"
      - code: "Stage=MVP|Window=tiny|Segment=JP-Web-SMB"
        metric: "A1"
        dir: "Flat"
    then: improve_onboarding
    else: monitor_only

  # ヒーローコピーテスト
  - id: test_hero_copy
    type: Action
    flags:
      "hero.headline": "価値観の迷子から、自分らしい選択へ"
      "hero.subtext": "AIがあなたの本当の価値観を発見"
      "cta.text": "無料で診断を始める"
    rollout:
      strategy: "canary"
      steps: [0.05, 0.15, 0.30, 0.50, 1.00]
      intervalMinutes: 240
      rollbackCondition:
        metric: "CVR"
        threshold: -15
    riskClass: "medium"
    next: gate_marketing_review

  # オンボーディング改善
  - id: improve_onboarding
    type: Action
    flags:
      "onboarding.steps": 3
      "onboarding.skipEnabled": true
      "onboarding.progressBar": true
    rollout:
      strategy: "bandit"
      algorithm: "thompson"
      maxExposure: 0.4
      explorationRate: 0.15
    riskClass: "low"
    next: evaluate_impact

  # 監視のみ
  - id: monitor_only
    type: Action
    flags: {}
    rollout:
      strategy: "blue-green"
    next: evaluate_impact

  # マーケティングレビュー
  - id: gate_marketing_review
    type: Gate
    approverRole: "growth-lead"
    timeoutMinutes: 180
    message: "ヒーローコピーの変更承認をお願いします"
    onApprove: evaluate_impact
    onReject: monitor_only

  # 影響評価
  - id: evaluate_impact
    type: Outcome
    horizonDays: 14
    kpi:
      - "CVR"
      - "A1"
      - "RET7"
      - "ARPU"
    successCriteria:
      metric: "CVR"
      lift: 5
    writeBack: "casebook"
    tags:
      - "experiment:onboarding_v2"
      - "quarter:2025Q1"
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