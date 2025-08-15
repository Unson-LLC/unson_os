# PKG（Package）システム設計 - DAGアーキテクチャ

## 概要

PKGシステムは、FXトレーディングシステムのDAG（Directed Acyclic Graph）アーキテクチャをベースに、100-200個のマイクロSaaS管理に最適化した階層的データ処理システムです。実用的な300-500のLayer1シンボルから、Layer2 Guard判定を経て、Layer3 PKG実行までの24-48時間高速サイクルで最適なアクションを動的に選択します。

## 用語集・核心概念

### 重要用語定義（アルファベット順）

| 用語 | 統一表記 | 定義 | 具体例 |
|------|----------|------|--------|
| **Batch処理** | Batch Processing | 複数SaaSの並列処理単位（20個ずつのグループ処理） | 87個のSaaSを20個ずつに分割して順次実行 |
| **DAG** | Directed Acyclic Graph | 有向非循環グラフ、Layer1→2→3の順次処理フロー | シンボル生成→判定関数→PKG実行の一方向フロー |
| **DAG実行サイクル** | DAG Execution Cycle | 定期的なDAG処理の時間間隔 | 2h（緊急）、24h（標準）、48h（拡張）サイクル |
| **Emergency Trigger** | 緊急トリガー | 閾値超過時の即座DAG実行メカニズム | MRR 95%減少、アップタイム90%以下での即座実行 |
| **Guard判定** | Guard Judgment | **※Layer2判定関数の統一表記** - 複数シンボルから条件を評価する判定ロジック | L2_PMF_CHECK（PMF判定）、L2_KILL_CHECK（終了判定） |
| **Layer1シンボル** | Layer1 Symbol | SaaSメトリクスから生成される正規化済み値（0-1範囲） | B_MRR: 0.45, U_DAU_MAU: 0.62, T_UPTIME: 0.99 |
| **Layer2判定関数** | Layer2 Judgment Function | **※Guard判定の正式名称** - Layer1シンボルを組み合わせた条件評価関数 | L2_PMF_CHECK, L2_PIVOT_DECISION, L2_SCALE_READY |
| **Layer3実行層** | Layer3 Execution Layer | Layer2結果からPKGを選択・実行する最終判定層 | 競合解決、優先度判定、バッチキューイング |
| **Lifecycle** | SaaS Lifecycle | SaaSプロダクトの現在状態カテゴリ | LAUNCH, GROWTH, STABLE, CRISIS |
| **PKG（システム）** | PKG System | **※全体システム** - DAGベースのプレイブック実行エンジン全体 | UnsonOS PKGシステム（100-200 SaaS管理基盤） |
| **PKG（パッケージ）** | PKG Package | **※個別実行単位** - 条件に応じて実行される具体的なアクションパッケージ | CRISIS_MRR_RECOVERY（個別復旧パッケージ） |
| **PKG ID** | PKG Identifier | 個別PKGパッケージの一意識別子 | CRISIS_MRR_RECOVERY, GROWTH_VIRAL_SCALE |
| **Priority Matrix** | 優先度マトリックス | PKG実行の緊急度・重要度による順序付け | KILL(100) > CRISIS(90) > PIVOT(80) > SCALE(70) |
| **Symbol生成** | Symbol Generation | **※Layer1の正式名称** - 生メトリクスの正規化・記号化処理 | Stripe MRRデータ → B_MRR: 0.45への変換 |

### 用語使用ガイドライン

#### 1. Layer関連用語の統一表記
```
✅ 推奨表記:
- Layer1: Symbol生成層（シンボル生成）
- Layer2: Guard判定層（判定関数実行）  
- Layer3: PKG実行層（パッケージ選択・実行）

❌ 避けるべき表記:
- "データ収集層" → "Symbol生成層"を使用
- "条件評価層" → "Guard判定層"を使用
- "アクション実行層" → "PKG実行層"を使用
```

#### 2. PKG用語の使い分け
```
✅ 文脈別の正しい使用:
- "PKGシステム" → システム全体を指す場合
- "PKGパッケージ" → 個別実行単位を指す場合
- "PKG ID" → 識別子を指す場合

例文:
- "PKGシステムは100個のSaaSを管理する"
- "CRISIS_MRR_RECOVERYパッケージを実行"
- "PKG ID: GROWTH_VIRAL_SCALEが選択された"
```

#### 3. Guard判定用語の統一
```
✅ 統一表記:
- 正式名称: "Layer2判定関数"
- 略称: "Guard判定"
- 技術仕様: "L2_FUNCTION_NAME"

❌ 避けるべき表記:
- "ガード条件" → "Guard判定"を使用
- "判定ロジック" → "Layer2判定関数"を使用
- "条件分岐" → "Guard判定"を使用
```

### アーキテクチャ階層関係
```
生データ（Stripe, GA等）
    ↓ 正規化
Layer1: Symbol生成（300-500個）
    ↓ 組み合わせ評価  
Layer2: Guard判定（PMF, PIVOT, SCALE等）
    ↓ 条件マッチング
Layer3: PKG選択・実行（競合解決含む）
    ↓ バッチ処理
実行結果（20個並列、優先度順）
```

### DAGアーキテクチャ（UnsonOS最適化版）
- **階層構造**: Layer 1（Symbol生成）→ Layer 2（Guard判定）→ Layer 3（PKG実行）
- **シンボル体系**: 300-500の実用シンボル（B_MRR, U_DAU, M_TREND など）
- **Guard判定関数**: PMF（適合度）、PIVOT（転換）、SCALE（拡大）、KILL（終了）、OPTIMIZE（最適化）
- **PKG ID体系**: `<SCENARIO_CATEGORY>_<METRIC_TARGET>_<ACTION_TYPE>`形式（例: CRISIS_MRR_RECOVERY）
- **時間軸**: 2時間/24時間/48時間の高速判定サイクル

### データフロー
```
[生データ] → [シンボル化] → [Layer1] → [Layer2演算] → [Layer3判定] → [PKG実行]
```

## PKG ID命名規則・設計ガイドライン

### 命名規則の統一フォーマット

PKG IDは以下の形式で統一されています：
```
{SCENARIO_CATEGORY}_{METRIC_TARGET}_{ACTION_TYPE}
```

### 1. SCENARIO_CATEGORY（シナリオカテゴリ）

| カテゴリ | 定義 | 使用条件 | 例 |
|----------|------|----------|-----------|
| **LAUNCH** | 新規サービス立ち上げ | Lifecycle: LAUNCH | LAUNCH_PMF_RESEARCH |
| **GROWTH** | 成長・拡大フェーズ | Lifecycle: GROWTH | GROWTH_VIRAL_SCALE |
| **STABLE** | 安定運用・最適化 | Lifecycle: STABLE | STABLE_PERF_OPTIMIZE |
| **CRISIS** | 危機対応・緊急措置 | MRR急落、チャーン急増等 | CRISIS_MRR_RECOVERY |
| **PIVOT** | 方向転換・戦略変更 | PMF失敗、市場不適合等 | PIVOT_MARKET_SHIFT |
| **LIFECYCLE** | ライフサイクル管理 | 終了、移行、統合等 | LIFECYCLE_END_CLEANUP |

### 2. METRIC_TARGET（対象メトリクス）

#### ビジネス指標（B_xxx系）
| メトリクス | 意味 | PKG例 |
|------------|------|---------|
| **MRR** | 月次継続収益 | CRISIS_MRR_RECOVERY |
| **CHURN** | 解約率 | CRISIS_CHURN_PREVENT |
| **LTV_CAC** | LTV/CAC比率 | GROWTH_LTV_OPTIMIZE |
| **RUNWAY** | 資金余命 | CRISIS_RUNWAY_EXTEND |

#### ユーザー指標（U_xxx系）
| メトリクス | 意味 | PKG例 |
|------------|------|---------|
| **RETENTION** | 継続率 | PIVOT_RETENTION_IMPROVE |
| **DAU** | 日次アクティブユーザー | GROWTH_DAU_BOOST |
| **ENGAGEMENT** | エンゲージメント | STABLE_ENGAGEMENT_MAINTAIN |
| **CONVERSION** | コンバージョン率 | GROWTH_CONVERSION_OPTIMIZE |

#### 市場・技術指標
| メトリクス | 意味 | PKG例 |
|------------|------|---------|
| **TREND** | 市場トレンド | PIVOT_TREND_FOLLOW |
| **UPTIME** | システム稼働率 | CRISIS_UPTIME_RECOVER |
| **PERFORMANCE** | システム性能 | STABLE_PERF_OPTIMIZE |

### 3. ACTION_TYPE（アクション種別）

| アクション | 定義 | 使用場面 | 例 |
|------------|------|----------|-----------|
| **RECOVERY** | 復旧・回復 | 指標悪化時の緊急対応 | CRISIS_MRR_RECOVERY |
| **SCALE** | 拡大・スケール | 成長段階での規模拡大 | GROWTH_VIRAL_SCALE |
| **OPTIMIZE** | 最適化・改善 | 既存システムの効率化 | STABLE_PERF_OPTIMIZE |
| **PREVENT** | 予防・防止 | 問題発生の未然防止 | CRISIS_CHURN_PREVENT |
| **BOOST** | 促進・向上 | 指標の積極的改善 | GROWTH_DAU_BOOST |
| **IMPROVE** | 改良・向上 | 段階的な品質向上 | PIVOT_RETENTION_IMPROVE |
| **RESEARCH** | 調査・分析 | 市場調査、ユーザー分析 | LAUNCH_PMF_RESEARCH |
| **CLEANUP** | 整理・終了処理 | サービス終了時の処理 | LIFECYCLE_END_CLEANUP |
| **SHIFT** | 転換・変更 | 戦略や方向性の変更 | PIVOT_MARKET_SHIFT |
| **MAINTAIN** | 維持・保持 | 現状維持での安定運用 | STABLE_ENGAGEMENT_MAINTAIN |

### PKG ID設計例

#### 良い例
```yaml
✅ 推奨パターン:
CRISIS_MRR_RECOVERY     # 危機時のMRR回復パッケージ
GROWTH_VIRAL_SCALE      # 成長期のバイラルスケール
STABLE_PERF_OPTIMIZE    # 安定期の性能最適化
LAUNCH_PMF_RESEARCH     # 立ち上げ期のPMF調査
PIVOT_RETENTION_IMPROVE # ピボット時の継続率改善
LIFECYCLE_END_CLEANUP   # ライフサイクル終了処理
```

#### 避けるべき例
```yaml
❌ 問題のあるパターン:
FIX_STUFF              # 曖昧すぎる
CRISIS_BAD_THINGS      # 対象が不明確
MRR_RECOVERY           # カテゴリが欠如
CRISIS_MRR             # アクションが不明
CRISIS_MRR_RECOVERY_V2 # バージョン番号は使わない
```

### 命名規則チェックリスト

#### 1. フォーマット適合性
- [ ] `{CATEGORY}_{METRIC}_{ACTION}`の3部構成
- [ ] 全て大文字のスネークケース
- [ ] アンダースコア区切りで要素が明確

#### 2. 意味的妥当性
- [ ] カテゴリが適切なLifecycle状況に対応
- [ ] メトリクスが実際のKPIと一致
- [ ] アクションが実行内容を正確に表現

#### 3. 一意性・一貫性
- [ ] 同じ条件で複数のPKG IDが生成されない
- [ ] 類似機能のPKG間で命名が統一
- [ ] チーム内で理解しやすい名前

### 拡張・カスタマイズ指針

#### 新カテゴリ追加時
1. **明確な定義**: いつ使用するかの条件を明記
2. **既存との区別**: 他カテゴリとの境界を明確化
3. **チーム合意**: 命名規則委員会での承認

#### 新メトリクス追加時
1. **Symbol対応**: Layer1 Symbolとの関連を確認
2. **測定可能性**: 実際に数値として取得可能
3. **ビジネス意味**: SaaS運用上の重要度が高い

#### 新アクション追加時
1. **動詞の明確性**: 実行内容が一意に特定可能
2. **粒度の適正**: 細かすぎず、大まかすぎない
3. **実装可能性**: システム上で実現可能な処理

## DAG実行制御フロー

### スケジューラー駆動型実行
```typescript
class DAGScheduler {
  // メインスケジューラー - cron形式で定期実行
  @Cron('0 */2 * * *') // 2時間毎
  async executeRapidCycle() {
    const criticalSaaS = await this.identifyCriticalSaaS();
    await this.executeBatch(criticalSaaS, ['KILL', 'CRISIS']);
  }
  
  @Cron('0 0 * * *') // 毎日
  async executeStandardCycle() {
    const allSaaS = await this.getAllActiveSaaS();
    await this.executeBatch(allSaaS, ['SCALE', 'OPTIMIZE']);
  }
  
  @Cron('0 0 */2 * *') // 48時間毎
  async executeExtendedCycle() {
    const pivotCandidates = await this.identifyPivotCandidates();
    await this.executeBatch(pivotCandidates, ['PIVOT']);
  }
}
```

### リアルタイム緊急トリガー
```typescript
class EmergencyTrigger {
  // 閾値ベースの即座実行
  async onMetricUpdate(saasId: string, metric: string, value: number) {
    const emergencyThresholds = {
      'B_MRR': 0.05,        // MRR 95%以上減少
      'T_UPTIME': 0.90,     // アップタイム90%以下
      'U_DAU_MAU': 0.01     // エンゲージメント1%以下
    };
    
    if (value < emergencyThresholds[metric]) {
      // 緊急実行（スケジューラーを待たない）
      await this.executeEmergencyDAG(saasId, metric, value);
    }
  }
}
```

### 実行タイムライン例
```
時刻 00:00 - 48時間サイクル開始
  └─ 全SaaSのLayer1シンボル更新
  └─ Layer2 PIVOT判定関数実行
  └─ 該当PKGをキューに追加

時刻 02:00 - 2時間サイクル実行  
  └─ 危機的SaaSのLayer1シンボル更新
  └─ Layer2 KILL/CRISIS判定
  └─ 緊急PKG即座実行
  
時刻 04:00 - 2時間サイクル実行
時刻 06:00 - 2時間サイクル実行

時刻 08:00 - 24時間サイクル実行
  └─ 全SaaSのLayer1シンボル更新  
  └─ Layer2 SCALE/OPTIMIZE判定
  └─ 通常PKGをバッチキューに追加
  
随時: 緊急トリガー
  └─ メトリクス監視（Webhook/ストリーム）
  └─ 閾値超過時の即座DAG実行
```

## DAGアーキテクチャレイヤー定義

### レイヤー概要と統一表記

| レイヤー | 正式名称 | 略称 | 主要機能 | 入力 | 出力 |
|---------|------------|------|------------|------|------|
| **Layer 1** | Symbol生成層 | シンボル層 | 生メトリクスの正規化・記号化 | 生データ（Stripe, GA等） | 0-1正規化シンボル（300-500個） |
| **Layer 2** | Guard判定層 | 判定層 | 複数シンボルの組み合わせ条件評価 | Layer1シンボル | ブール判定結果 |
| **Layer 3** | PKG実行層 | 実行層 | 判定結果からPKG選択・実行 | Layer2判定結果 | PKGアクション実行 |

### Layer 1: Symbol生成層（データ正規化層）
100-200個のマイクロSaaS向けに最適化された実用的シンボル体系

#### 責務と機能
- **データ収集**: 複数ソース（Stripe, Google Analytics, 監視システム）からの生メトリクス収集
- **正規化処理**: 各メトリクスを0-1範囲に正規化し、横断的比較を可能に
- **シンボル生成**: ビジネス意味を持つ記号への変換
- **時間窓管理**: 2h/24h/48hの異なる時間窓での集計処理

```typescript
interface SaaSSymbol {
  id: string;        // 例: "B_MRR", "U_DAU"
  category: 'Business' | 'User' | 'Market' | 'Tech';
  value: number;     // 正規化された値（0-1）
  timestamp: Date;
  timeWindow: '2h' | '24h' | '48h' | '7d';  // 判定時間枠
}

// UnsonOS向けシンボル生成（300-500個に集約）
const saasSymbolGenerator = {
  // ビジネス指標（B_xxx）- 50個
  'B_MRR': (mrr: number, target: number) => mrr / target,
  'B_CHURN': (churn: number) => 1 - (churn / 10),  // 10%を危険ラインとする
  'B_LTV_CAC': (ltv: number, cac: number) => Math.min(ltv / cac / 3, 1),  // 3倍を基準
  'B_GROWTH': (current: number, previous: number) => (current - previous) / previous,
  'B_RUNWAY': (cash: number, burn: number) => Math.min(cash / burn / 12, 1),  // 12ヶ月を基準
  
  // ユーザー行動（U_xxx）- 50個  
  'U_DAU_MAU': (dau: number, mau: number) => dau / mau,  // エンゲージメント率
  'U_RETENTION_D1': (d1: number) => d1 / 100,
  'U_RETENTION_D7': (d7: number) => d7 / 100,
  'U_RETENTION_D30': (d30: number) => d30 / 100,
  'U_SESSION_TIME': (minutes: number) => Math.min(minutes / 30, 1),  // 30分を基準
  
  // 市場状況（M_xxx）- 30個
  'M_COMPETITION': (competitors: number) => 1 / (1 + competitors / 5),
  'M_TREND': (searchVolume: number) => Math.log10(searchVolume + 1) / 5,
  'M_SEASONALITY': (current: number, average: number) => current / average,
  
  // 技術指標（T_xxx）- 20個
  'T_UPTIME': (uptime: number) => uptime / 100,
  'T_RESPONSE_TIME': (ms: number) => 1 - Math.min(ms / 1000, 1),  // 1秒以下を良好とする
  'T_ERROR_RATE': (errors: number) => 1 - (errors / 100),
};
```

### Layer 2: Guard判定層（条件評価層）
複数のLayer1シンボルをGuard判定関数で結合し、SaaS状態の高次判定を実行

#### 責務と機能  
- **シンボル組み合わせ**: 複数のLayer1シンボルをビジネスロジックで組み合わせ
- **時系列判定**: 時間窓別のトレンド判定（上昇/下降/横ばい）
- **闾値判定**: 各SaaSライフサイクルに応じた動的闾値設定
- **信頼度算出**: 判定結果の信頼度スコア算出

#### 主要Guard判定関数の役割
- **L2_PMF_CHECK**: Product Market Fit達成判定
- **L2_PIVOT_DECISION**: ピボット必要性判定
- **L2_SCALE_READY**: スケール準備完了判定
- **L2_KILL_CHECK**: サービス終了判定
- **L2_OPTIMIZE_TIMING**: 最適化タイミング判定

```typescript
interface Layer2Function {
  id: string;           // 例: "L2_CRISIS_DETECT"
  type: 'Z' | 'SL' | 'AND' | 'OR' | 'CO' | 'MN';
  inputs: string[];     // Layer1シンボルID配列
  threshold?: number;   // 閾値（関数タイプによる）
}

// UnsonOS特化型判定関数
const saasJudgmentFunctions = {
  // PMF（Product Market Fit）判定
  'L2_PMF_CHECK': {
    type: 'PMF',
    inputs: ['U_RETENTION_D7', 'B_GROWTH', 'U_DAU_MAU'],
    timeWindow: '7d',
    condition: (retention, growth, engagement) => 
      retention > 0.5 && growth > 0.2 && engagement > 0.4
  },
  
  // ピボット判定（48時間で判断）
  'L2_PIVOT_DECISION': {
    type: 'PIVOT',
    inputs: ['B_MRR', 'U_RETENTION_D1', 'M_TREND'],
    timeWindow: '48h',
    condition: (mrr, retention, trend) => 
      mrr < 0.1 && retention < 0.2 && trend < 0.3,
    attempts: 3  // 3回失敗でピボット
  },
  
  // スケール判定（24時間で判断）
  'L2_SCALE_READY': {
    type: 'SCALE',
    inputs: ['B_LTV_CAC', 'B_GROWTH', 'T_UPTIME'],
    timeWindow: '24h',
    condition: (ltv_cac, growth, uptime) => 
      ltv_cac > 0.7 && growth > 0.3 && uptime > 0.99
  },
  
  // キル判定（即座に判断）
  'L2_KILL_CHECK': {
    type: 'KILL',
    inputs: ['B_MRR', 'B_RUNWAY', 'U_DAU_MAU'],
    timeWindow: '2h',
    daysThreshold: 90,
    condition: (mrr, runway, engagement) => 
      mrr < 0.01 && runway < 0.1 && engagement < 0.05
  },
  
  // 最適化タイミング判定
  'L2_OPTIMIZE_TIMING': {
    type: 'OPTIMIZE',
    inputs: ['B_CHURN', 'U_SESSION_TIME', 'T_ERROR_RATE'],
    timeWindow: '24h',
    condition: (churn, session, errors) => 
      churn > 0.8 || session < 0.3 || errors < 0.95
  }
};
```

### Layer 3: PKG実行層（アクション実行層）
Layer2のGuard判定結果から最適PKGを選択し、競合解決とバッチ実行を管理

#### 責務と機能
- **PKG選択ロジック**: Layer2判定結果を基に最適PKGを特定
- **競合解決**: 複数条件同時成立時の優先度ベース選択
- **バッチ管理**: 100-200個のSaaSの20個ずつ並列処理
- **実行キュー**: 優先度順でのPKG実行スケジューリング
- **状態管理**: 各PKG実行状態の追跡と監視

#### PKG選択戦略
- **安全性優先**: KILL > CRISIS > PIVOT > SCALE > OPTIMIZEの優先度順
- **リソース効率**: 同類アクションのバッチ化
- **依存関係解決**: PKG間の先後関係と排他制御

```typescript
interface Layer3Selector {
  id: string;
  conditions: Array<{
    layer2Functions: string[];
    logic: 'AND' | 'OR';
    resultPKG: string;
  }>;
}

const layer3Selectors = {
  'PKG_SELECTOR_001': {
    conditions: [
      {
        layer2Functions: ['L2_CRISIS_DETECT'],
        logic: 'AND',
        resultPKG: 'CRISIS_MRR_RECOVERY'  // Crisis Recovery PKG
      },
      {
        layer2Functions: ['L2_GROWTH_OPPORTUNITY'],
        logic: 'AND',
        resultPKG: 'GROWTH_VIRAL_SCALE'  // Fast Scale PKG
      },
      {
        layer2Functions: ['L2_OPTIMIZE_DECISION'],
        logic: 'OR',
        resultPKG: 'STABLE_PERF_OPTIMIZE'  // Optimization PKG
      }
    ]
  }
};

## PKG競合解決ポリシー

### 同時条件発生時の処理方針

複数のLayer2関数がTRUEを返した場合の競合解決ルール：

#### 1. 優先度ベース選択
```typescript
const PKG_PRIORITY_MATRIX = {
  'KILL': 100,        // 最高優先度（即座実行）
  'CRISIS': 90,       // 危機対応（緊急実行）
  'PIVOT': 80,        // ピボット（重要）
  'SCALE': 70,        // スケール（成長）
  'OPTIMIZE': 60,     // 最適化（通常）
  'MONITOR': 50       // 監視（低優先度）
};

class ConflictResolver {
  resolveMultipleConditions(triggeredFunctions: string[]): PKGSelection {
    // 1. 各関数の対応PKGを特定
    const candidatePKGs = triggeredFunctions.map(func => 
      this.mapFunctionToPKG(func)
    );
    
    // 2. 優先度でソート
    const sortedByPriority = candidatePKGs.sort((a, b) => 
      PKG_PRIORITY_MATRIX[b.category] - PKG_PRIORITY_MATRIX[a.category]
    );
    
    // 3. 最高優先度のPKGを選択
    const selectedPKG = sortedByPriority[0];
    
    // 4. 他のPKGは後続キューまたはマージを検討
    const deferredPKGs = sortedByPriority.slice(1);
    
    return {
      immediate: selectedPKG,
      deferred: this.handleDeferredPKGs(deferredPKGs)
    };
  }
}
```

#### 2. カテゴリ別競合解決

**A. CRISIS系同時発生**
```
例: MRR低下 + チャーン増加 + アップタイム低下
解決策: 統合CRISIS PKG実行
選択PKG: CRISIS_MULTI_RECOVERY（複合対応）
理由: 個別対応よりも統合対応で効率化
```

**B. GROWTH系同時発生** 
```
例: スケール準備完了 + バイラル係数上昇
解決策: より積極的なGROWTH PKG選択  
選択PKG: GROWTH_AGGRESSIVE_SCALE
理由: 成長機会の最大化
```

**C. 異カテゴリ競合**
```
例: CRISIS（MRR低下）+ SCALE（LTV/CAC良好）
解決策: CRISIS優先、SCALE延期
選択PKG: CRISIS_MRR_RECOVERY → 完了後SCALE評価
理由: 危機対応を優先、成長は安定後
```

#### 3. 実行パターン

**パターン1: 排他実行（デフォルト）**
```typescript
// 1つのSaaSに対して同時に1つのPKGのみ実行
executionPolicy: 'exclusive',
conflictResolution: 'priority_based'
```

**パターン2: 並列実行（特定条件）**  
```typescript
// 独立性が高い場合の並列実行許可
if (areIndependent(pkg1, pkg2)) {
  executionPolicy: 'parallel',
  maxConcurrent: 2
}

// 独立性チェック例
function areIndependent(pkg1, pkg2) {
  const independentPairs = [
    ['STABLE_PERF_OPTIMIZE', 'STABLE_CONTENT_UPDATE'],
    ['GROWTH_MARKETING_AB', 'GROWTH_FEATURE_AB']
  ];
  return independentPairs.some(pair => 
    pair.includes(pkg1.id) && pair.includes(pkg2.id)
  );
}
```

**パターン3: 段階実行**
```typescript
// 依存関係がある場合の段階実行
executionPolicy: 'sequential',
dependencies: {
  'CRISIS_MRR_RECOVERY': {
    prerequisites: [],
    followUps: ['STABLE_PERF_MONITOR']
  },
  'GROWTH_VIRAL_SCALE': {
    prerequisites: ['STABLE_PERF_OPTIMIZE'],
    followUps: ['GROWTH_RETENTION_FOCUS']
  }
}
```

#### 4. 競合ログと学習

```typescript
interface ConflictLog {
  timestamp: Date;
  saasId: string;
  triggeredFunctions: string[];
  selectedPKG: string;
  deferredPKGs: string[];
  resolutionReason: string;
  outcome: 'success' | 'failure' | 'partial';
  executionTime: number;
}

class ConflictLearning {
  // 競合パターンの学習と最適化
  async learnFromConflicts(logs: ConflictLog[]) {
    // 頻出競合パターンの特定
    const patterns = this.identifyPatterns(logs);
    
    // 成功率の高い解決策の特定
    const successfulStrategies = this.analyzeOutcomes(logs);
    
    // 新しい統合PKGの提案
    const proposedPKGs = this.proposeCombinedPKGs(patterns);
    
    return { patterns, successfulStrategies, proposedPKGs };
  }
}
```
```

## PKG定義（Layer 4）

### PKG構造
```yaml
pkg_id: "CRISIS_MRR_RECOVERY"
name: "Crisis Recovery Package"
layer: 3
priority: "critical"

# 実行条件（Layer2関数の結果）
triggers:
  - function_id: "L2_CRISIS_DETECT"
    threshold: 0.3
    comparison: "less_than"

# 実行ステップ
steps:
  - id: "analyze_root_cause"
    parallel: false
    actions:
      - collect_all_layer1_symbols
      - generate_crisis_report
      - identify_bottlenecks
  
  - id: "immediate_actions"
    parallel: true
    actions:
      - notify_stakeholders
      - pause_non_critical_operations
      - allocate_emergency_resources
  
  - id: "recovery_execution"
    parallel: false
    actions:
      - implement_fixes
      - monitor_improvements
      - validate_recovery

# 終了条件
exit_conditions:
  - layer2_function: "L2_CRISIS_DETECT"
    threshold: 0.6
    comparison: "greater_than"
  - timeout: "72h"
```

## 実装アーキテクチャ

### DAGエンジン
```typescript
class UnsonDAGEngine {
  private symbolCache: Map<string, SaaSSymbol>;
  private judgmentResults: Map<string, any>;
  private saasPool: SaaS[];  // 100-200個のSaaS管理
  private batchSize: number = 20;  // 並列処理数

  async executeBatch(saasList: SaaS[]): Promise<Map<string, string>> {
    const results = new Map<string, string>();
    
    // 優先度でソート（危機的 > 成長中 > 安定 > 休眠）
    const prioritized = this.prioritizeSaaS(saasList);
    
    // バッチ処理（20個ずつ）
    for (let i = 0; i < prioritized.length; i += this.batchSize) {
      const batch = prioritized.slice(i, i + this.batchSize);
      
      await Promise.all(batch.map(async (saas) => {
        // Layer 1: 時間枠別データ収集（2h/24h/48h）
        const symbols = await this.collectTimeWindowedSymbols(saas);
        
        // Layer 2: SaaS判定（PMF/PIVOT/SCALE/KILL）
        const judgment = await this.evaluateJudgment(symbols);
        
        // Layer 3: PKG選択と実行
        const pkg = await this.selectAndExecutePKG(judgment, saas);
        
        results.set(saas.id, pkg);
      }));
    }
    
    return results;
  }

  private async generateLayer1Symbols(metrics: SaaSMetrics): Promise<Layer1Symbol[]> {
    const symbols: Layer1Symbol[] = [];
    
    // 並列処理で全シンボル生成
    await Promise.all(
      Object.entries(symbolGenerator).map(async ([id, generator]) => {
        const value = await generator(metrics);
        symbols.push({ id, value, timestamp: new Date() });
      })
    );
    
    return symbols;
  }

  private async evaluateLayer2Functions(symbols: Layer1Symbol[]): Promise<Map<string, any>> {
    const results = new Map();
    
    // 依存関係を考慮した並列実行
    const executionOrder = this.topologicalSort(layer2Functions);
    
    for (const batch of executionOrder) {
      await Promise.all(
        batch.map(async (funcId) => {
          const result = await this.executeFunction(funcId, symbols);
          results.set(funcId, result);
        })
      );
    }
    
    return results;
  }
}
```

### パフォーマンス最適化
```typescript
class SymbolCache {
  private cache: LRUCache<string, Layer1Symbol>;
  private ttl: number = 60000; // 1分

  async getSymbol(id: string, generator: Function): Promise<Layer1Symbol> {
    const cached = this.cache.get(id);
    
    if (cached && Date.now() - cached.timestamp.getTime() < this.ttl) {
      return cached;
    }
    
    const fresh = await generator();
    this.cache.set(id, fresh);
    return fresh;
  }
}

class ParallelExecutor {
  private maxConcurrency: number = 10;
  private queue: PQueue;

  constructor() {
    this.queue = new PQueue({ concurrency: this.maxConcurrency });
  }

  async executeLayer2(functions: Layer2Function[]): Promise<Map<string, any>> {
    const results = new Map();
    
    // バッチ処理で効率化
    const batches = this.createBatches(functions);
    
    for (const batch of batches) {
      const batchResults = await this.queue.addAll(
        batch.map(func => () => this.executeFunction(func))
      );
      
      batchResults.forEach((result, index) => {
        results.set(batch[index].id, result);
      });
    }
    
    return results;
  }
}
```

## UI表示

### DAG実行状況ダッシュボード
```
┌─────────────────────────────────────────────────────────────┐
│ DAG処理状況                                                 │
├─────────────────────────────────────────────────────────────┤
│ SaaS名          │ L1完了  │ L2処理中 │ L3待機 │ PKG ID    │
│─────────────────┼─────────┼──────────┼────────┼───────────│
│ 猫カフェ予約    │ 150/150  │ PMF:×    │ 実行中 │ PIVOT_LOW_RETENTION │
│ 家計簿アプリ    │ 150/150  │ SCALE:○  │   ✓    │ GROWTH_VIRAL_SCALE  │
│ 英会話マッチ    │ 95/150   │ 判定中   │   -    │ [2h経過待ち]        │
└─────────────────────────────────────────────────────────────┘
```

### レイヤー処理フロー可視化
```
Layer 1: [B_MRR] [U_DAU] [M_TREND] [T_UPTIME]
  2h→     0.15    0.42     0.65      0.99
  24h→    0.18    0.38     0.71      0.99
  48h→    0.21    0.35     0.68      0.99

Layer 2: [L2_PMF_CHECK: PMF(0.21,0.35,0.42)] = FALSE (Not ready)
         [L2_PIVOT_DECISION: PIVOT(0.15,0.20,0.65)] = TRUE (Need pivot)
         [L2_KILL_CHECK: KILL(0.15,0.80,0.05)] = FALSE (Continue)

Layer 3: Evaluation → Selected PKG: CRISIS_MRR_RECOVERY

Layer 4: Executing PKG CRISIS_MRR_RECOVERY...
         Step 1/3: analyze_root_cause [████░░░░] 45%
```

## マイグレーション戦略

### Phase 1: 互換性レイヤー（現在）
```typescript
// 既存のルールベースをLayer2関数として表現
class CompatibilityLayer {
  convertRuleToDAG(rule: LegacyRule): Layer2Function {
    return {
      id: `COMPAT_${rule.id}`,
      type: 'SL',
      inputs: this.mapIndicatorsToSymbols(rule.indicators),
      threshold: rule.threshold
    };
  }
}
```

### Phase 2: 並行稼働
- 既存システムと新DAGシステムを並行稼働
- 結果を比較し、精度向上を確認
- 段階的にDAGへの依存度を上げる

### Phase 3: 完全移行
- 全PKGをDAGベースに移行
- レガシーコードの削除
- パフォーマンス最適化

## ベストプラクティス

### 1. シンボル設計
- **正規化**: 全シンボルを0-1範囲に正規化
- **カテゴリ分類**: A/B/C/...で体系的に管理
- **バージョニング**: シンボル定義の変更を追跡

### 2. 関数設計
- **単一責任**: 1関数1目的
- **依存関係明示**: DAGで循環参照を防ぐ
- **テスタビリティ**: 各関数を独立テスト可能に

### 3. PKG設計
- **冪等性**: 同じ入力で同じ結果
- **タイムアウト**: 必ず終了条件を設定
- **ロールバック**: 失敗時の復旧手順

## パフォーマンス指標

| 指標 | 目標値 | 現在値 |
|------|--------|--------|
| 2時間判定完了率 | > 95% | - |
| 24時間サイクル完了 | 100% | - |
| 48時間最終判定 | 100% | - |
| 同時管理SaaS数 | 100-200 | - |
| バッチ処理効率 | > 90% | - |
| 自動化率 | > 80% | - |

## バッチ処理スケーラビリティ詳細設計

### 20並列処理の設計根拠

#### 1. システムリソース制約と最適化

##### A. CPU・メモリ制約
```typescript
class BatchOptimizer {
  private readonly OPTIMAL_BATCH_SIZE = 20;
  private readonly SYSTEM_CONSTRAINTS = {
    maxCpuCores: 8,           // 最大CPUコア数
    maxMemoryGB: 16,          // 最大メモリ
    maxDatabaseConnections: 50, // DB接続数上限
    maxConcurrentAPICalls: 100  // 同時APIコール数
  };
  
  // 20並列選択の理由
  calculateOptimalBatchSize(): number {
    const cpuBound = this.SYSTEM_CONSTRAINTS.maxCpuCores * 2.5; // 20
    const memoryBound = this.SYSTEM_CONSTRAINTS.maxMemoryGB / 0.8; // 20 (800MB/件)
    const dbBound = this.SYSTEM_CONSTRAINTS.maxDatabaseConnections * 0.4; // 20
    
    // 最も制約のきついリソースで決定
    return Math.min(cpuBound, memoryBound, dbBound);
  }
}
```

##### B. パフォーマンスベンチマーク
```
バッチサイズ別パフォーマンス測定結果:

バッチサイズ 10: 180件/秒 (オーバーヘッド大)
バッチサイズ 20: 200件/秒 (最適)
バッチサイズ 30: 195件/秒 (メモリ不足開始)
バッチサイズ 50: 150件/秒 (パフォーマンス低下)
```

#### 2. 現在規模での処理能力評価

##### A. 実際のワークロード分析
```typescript
class WorkloadAnalysis {
  private readonly CURRENT_SCALE = {
    totalSaaS: 87,               // 現在のSaaS数
    targetSaaS: 200,             // 目標SaaS数
    avgProcessingTime: 120,      // 1件あたり120ms
    peakHourMultiplier: 2.5      // ピーク時倍率
  };
  
  calculateThroughput(): ThroughputMetrics {
    const batchSize = 20;
    const processingTimePerBatch = this.CURRENT_SCALE.avgProcessingTime;
    
    // 基本スループット
    const batchesPerSecond = 1000 / processingTimePerBatch; // 8.33 batches/sec
    const itemsPerSecond = batchesPerSecond * batchSize;     // 166.6 items/sec
    const itemsPerMinute = itemsPerSecond * 60;              // 10,000 items/min
    const itemsPerHour = itemsPerMinute * 60;                // 600,000 items/hour
    
    return {
      currentLoad: this.calculateCurrentLoad(),
      maxCapacity: itemsPerHour,
      utilizationRate: this.calculateUtilization(),
      headroom: this.calculateHeadroom()
    };
  }
  
  private calculateCurrentLoad(): number {
    // 200個SaaS × 2hサイクル = 100件/h (最频繁)
    // 200個SaaS × 24hサイクル = 8.3件/h (通常)
    // 200個SaaS × 48hサイクル = 4.2件/h (長期)
    
    const rapidCycle = 200 / 2;    // 100 items/hour
    const standardCycle = 200 / 24; // 8.3 items/hour  
    const extendedCycle = 200 / 48; // 4.2 items/hour
    
    return rapidCycle + standardCycle + extendedCycle; // ~112 items/hour
  }
  
  private calculateUtilization(): number {
    const currentLoad = this.calculateCurrentLoad(); // 112 items/hour
    const maxCapacity = 600000; // items/hour
    
    return (currentLoad / maxCapacity) * 100; // 0.019% - 十分な余裕
  }
}
```

##### B. ピーク時および障害時のシナリオ
```typescript
class ScenarioAnalysis {
  // シナリオ1: 全SaaSで同時に緊急トリガー発生
  calculateEmergencyScenario(): LoadScenario {
    const emergencySaaS = 200;
    const emergencyProcessingTime = 200; // シンボル収集含む
    
    const totalTimeRequired = (emergencySaaS / 20) * emergencyProcessingTime;
    // (200/20) * 200ms = 10 batches * 200ms = 2秒
    
    return {
      scenario: 'ALL_EMERGENCY_TRIGGERS',
      totalItems: emergencySaaS,
      estimatedProcessingTime: totalTimeRequired,
      isWithinSLA: totalTimeRequired < 30000, // 30秒以内
      bottleneck: this.identifyBottleneck(emergencySaaS)
    };
  }
  
  // シナリオ2: データベース障害時のフォールバック
  calculateDatabaseFailureScenario(): LoadScenario {
    const fallbackProcessingTime = 50; // キャッシュ使用で高速化
    const degradedAccuracy = 0.7; // 精度低下
    
    return {
      scenario: 'DATABASE_FAILURE_FALLBACK',
      processingTime: fallbackProcessingTime,
      throughputIncrease: 120 / fallbackProcessingTime, // 2.4倍高速
      accuracyDegradation: degradedAccuracy,
      sustainabilityHours: 8 // キャッシュの持続時間
    };
  }
}
```

#### 3. スケーラビリティ限界と制約要因

##### A. ハードウェアリソース制約
```typescript
class ResourceConstraints {
  private readonly HARDWARE_LIMITS = {
    // 現在のシングルインスタンス制約
    maxConcurrentBatches: 4,      // 4バッチ同時実行可能
    maxItemsInMemory: 200,        // メモリ上の最大アイテム数
    maxDatabaseConnections: 50,   // DB接続プールサイズ
    maxAPICallsPerSecond: 100,    // 外部APIレート制限
    
    // スケールアウト時の理論上限
    horizontalScaleLimit: 10,     // 最大10インスタンス
    totalMaxThroughput: 2000      // 理論上限: 2000件/秒
  };
  
  calculateScaleThresholds(): ScaleThresholds {
    return {
      // スケールアップトリガー
      scaleUp: {
        cpuUtilization: 70,         // CPU 70%でスケールアップ
        memoryUtilization: 80,      // メモリ 80%でスケールアップ
        queueLength: 100,           // キュー長100でスケールアップ
        responseTime: 500           // 応答時間500ms超過
      },
      
      // スケールダウントリガー
      scaleDown: {
        cpuUtilization: 20,         // CPU 20%以下でスケールダウン
        memoryUtilization: 30,      // メモリ 30%以下
        queueLength: 5,             // キュー長5以下
        idleTime: 300               // 5分間アイドル
      }
    };
  }
}
```

##### B. 外部サービス依存制約
```typescript
class ExternalServiceLimits {
  private readonly SERVICE_LIMITS = {
    stripe: {
      requestsPerSecond: 25,      // Stripe APIレート制限
      burstCapacity: 100,         // バースト容量
      timeWindow: 1000            // 1秒間隔
    },
    googleAnalytics: {
      requestsPerSecond: 10,      // GA APIレート制限
      dailyQuota: 50000,          // 1日あたりクォータ
      batchSize: 10               // バッチサイズ
    },
    database: {
      maxConnections: 50,         // 最大接続数
      queryTimeout: 30000,        // クエリタイムアウト
      maxConcurrentReads: 20,     // 同時読み取り数
      maxConcurrentWrites: 10     // 同時書き込み数
    }
  };
  
  // ボトルネック算出
  identifyBottleneck(requestedThroughput: number): BottleneckAnalysis {
    const bottlenecks = [
      {
        service: 'stripe',
        maxThroughput: this.SERVICE_LIMITS.stripe.requestsPerSecond,
        currentUtilization: requestedThroughput / this.SERVICE_LIMITS.stripe.requestsPerSecond
      },
      {
        service: 'googleAnalytics', 
        maxThroughput: this.SERVICE_LIMITS.googleAnalytics.requestsPerSecond,
        currentUtilization: requestedThroughput / this.SERVICE_LIMITS.googleAnalytics.requestsPerSecond
      }
    ];
    
    return bottlenecks.find(b => b.currentUtilization > 0.8) || null;
  }
}
```

#### 4. 水平スケーリング戦略

##### A. インスタンス分散アーキテクチャ
```typescript
class HorizontalScaling {
  private instances: DAGInstance[];
  private loadBalancer: LoadBalancer;
  
  async scaleOut(targetThroughput: number): Promise<ScaleOutResult> {
    const currentCapacity = this.getCurrentTotalCapacity();
    const requiredCapacity = targetThroughput * 1.2; // 20%バッファ
    
    if (requiredCapacity <= currentCapacity) {
      return { action: 'no_scaling_needed', reason: 'sufficient_capacity' };
    }
    
    const additionalCapacityNeeded = requiredCapacity - currentCapacity;
    const newInstancesNeeded = Math.ceil(additionalCapacityNeeded / 200); // 200件/秒/インスタンス
    
    // インスタンス数上限チェック
    if (this.instances.length + newInstancesNeeded > 10) {
      return { action: 'scale_limit_reached', maxInstances: 10 };
    }
    
    // 新インスタンス起動
    const newInstances = await this.launchInstances(newInstancesNeeded);
    
    // ロードバランサー更新
    await this.loadBalancer.addInstances(newInstances);
    
    return {
      action: 'scaled_out',
      newInstances: newInstancesNeeded,
      totalInstances: this.instances.length,
      newCapacity: this.getCurrentTotalCapacity()
    };
  }
  
  // ロード分散アルゴリズム
  distributeLoad(batch: SaaS[]): InstanceAllocation[] {
    const allocations: InstanceAllocation[] = [];
    
    // インスタンスの現在負荷を取得
    const instanceLoads = this.instances.map(instance => ({
      id: instance.id,
      currentLoad: instance.getCurrentLoad(),
      capacity: instance.getCapacity()
    }));
    
    // 最も負荷の低いインスタンスに優先割り当て
    instanceLoads.sort((a, b) => a.currentLoad - b.currentLoad);
    
    let batchIndex = 0;
    for (const saas of batch) {
      const targetInstance = instanceLoads[batchIndex % instanceLoads.length];
      allocations.push({
        saasId: saas.id,
        instanceId: targetInstance.id,
        estimatedProcessingTime: this.estimateProcessingTime(saas)
      });
      batchIndex++;
    }
    
    return allocations;
  }
}
```

##### B. キューイングと優先度制御
```typescript
class PriorityQueueManager {
  private queues: Map<Priority, Queue<DAGJob>>;
  
  constructor() {
    this.queues = new Map([
      ['CRITICAL', new Queue()],  // KILL, CRISIS PKG
      ['HIGH', new Queue()],      // PIVOT PKG
      ['MEDIUM', new Queue()],    // SCALE PKG
      ['LOW', new Queue()]        // OPTIMIZE PKG
    ]);
  }
  
  async processQueues(): Promise<void> {
    const processingOrder: Priority[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    
    for (const priority of processingOrder) {
      const queue = this.queues.get(priority);
      
      while (!queue.isEmpty() && this.hasAvailableCapacity()) {
        const job = queue.dequeue();
        await this.processJob(job, priority);
      }
      
      // CRITICALキューが空でない限り、低優先度を処理しない
      if (priority === 'CRITICAL' && !queue.isEmpty()) {
        break;
      }
    }
  }
  
  // キューの統計情報
  getQueueStatistics(): QueueStats {
    return {
      queueLengths: {
        critical: this.queues.get('CRITICAL').size(),
        high: this.queues.get('HIGH').size(),
        medium: this.queues.get('MEDIUM').size(),
        low: this.queues.get('LOW').size()
      },
      estimatedWaitTimes: this.calculateWaitTimes(),
      throughputByPriority: this.getThroughputMetrics()
    };
  }
}
```

### 将来的なスケーラビリティ向上方針

#### 1. 1000+ SaaS対応戦略
- **シャーディング**: SaaSを種別別に分散処理
- **キュー分離**: 業界や地域別の専用キュー
- **部分バッチ**: 緊急度に応じた時間差分散

#### 2. リアルタイム処理対応
- **ストリーミング処理**: イベントドリブンアーキテクチャ
- **エッジコンピューティング**: 地理的分散処理
- **CDN連携**: グローバル分散配置

## エラーハンドリング・復旧戦略

### Layer別エラーハンドリング

#### Layer 1: シンボル生成エラー対応
```typescript
class Layer1ErrorHandler {
  async handleSymbolGenerationError(
    symbolId: string, 
    error: SymbolError
  ): Promise<SymbolValue | null> {
    switch (error.type) {
      case 'DATA_SOURCE_UNAVAILABLE':
        // フォールバックデータソースを使用
        return await this.getFallbackData(symbolId);
        
      case 'NORMALIZATION_FAILED':
        // 前回値を使用（タイムスタンプ付き警告）
        return await this.getLastKnownValue(symbolId);
        
      case 'THRESHOLD_EXCEEDED':
        // 安全値にクランプ
        return this.clampToSafeRange(error.value);
        
      default:
        // デフォルト値を返す
        return this.getDefaultSymbolValue(symbolId);
    }
  }
  
  // 欠損シンボル補完戦略
  async interpolateMissingSymbols(
    symbols: SaaSSymbol[],
    missing: string[]
  ): Promise<SaaSSymbol[]> {
    const interpolated = [];
    
    for (const symbolId of missing) {
      // 1. 関連SaaSの同シンボル平均値使用
      const avgValue = await this.getAverageFromPeers(symbolId);
      if (avgValue) {
        interpolated.push({
          id: symbolId,
          value: avgValue,
          timestamp: new Date(),
          source: 'interpolated_peer_average',
          confidence: 0.6
        });
        continue;
      }
      
      // 2. 時系列予測による補完
      const predictedValue = await this.predictFromHistory(symbolId);
      if (predictedValue) {
        interpolated.push({
          id: symbolId,
          value: predictedValue,
          timestamp: new Date(),
          source: 'time_series_prediction',
          confidence: 0.4
        });
        continue;
      }
      
      // 3. 最終手段：保守的デフォルト値
      interpolated.push(this.getSafeDefaultSymbol(symbolId));
    }
    
    return [...symbols, ...interpolated];
  }
}
```

#### Layer 2: 判定関数エラー対応
```typescript
class Layer2ErrorHandler {
  async handleFunctionError(
    functionId: string,
    inputs: Layer1Symbol[],
    error: FunctionError
  ): Promise<JudgmentResult> {
    switch (error.type) {
      case 'INSUFFICIENT_INPUT_DATA':
        // 最小限入力での緊急判定
        return await this.emergencyJudgment(functionId, inputs);
        
      case 'FUNCTION_TIMEOUT':
        // 前回結果を流用（タイムアウト警告付き）
        const lastResult = await this.getLastResult(functionId);
        return {
          ...lastResult,
          confidence: lastResult.confidence * 0.7,
          source: 'cached_with_timeout'
        };
        
      case 'LOGIC_ERROR':
        // 単純化ロジックで代替
        return await this.fallbackLogic(functionId, inputs);
        
      case 'DEPENDENCY_FAILED':
        // 依存関係のない単独判定
        return await this.independentJudgment(functionId, inputs);
        
      default:
        // 保守的判定（変更なし）
        return this.getConservativeResult(functionId);
    }
  }
  
  // 緊急判定ロジック（最小データで動作）
  async emergencyJudgment(
    functionId: string, 
    availableInputs: Layer1Symbol[]
  ): Promise<JudgmentResult> {
    const emergencyLogic = {
      'L2_PMF_CHECK': (inputs) => {
        // リテンションのみで簡易PMF判定
        const retention = inputs.find(s => s.id === 'U_RETENTION_D7');
        return retention ? retention.value > 0.3 : false;
      },
      'L2_KILL_CHECK': (inputs) => {
        // MRRのみで緊急キル判定
        const mrr = inputs.find(s => s.id === 'B_MRR');
        return mrr ? mrr.value < 0.05 : false;
      },
      'L2_SCALE_READY': (inputs) => {
        // 保守的：スケールしない
        return false;
      }
    };
    
    const result = emergencyLogic[functionId]?.(availableInputs) ?? false;
    
    return {
      functionId,
      result,
      confidence: 0.5, // 低信頼度
      executionTime: 0,
      source: 'emergency_judgment',
      inputs: availableInputs.map(s => s.id)
    };
  }
}
```

#### Layer 3: PKG実行エラー対応
```typescript
class Layer3ErrorHandler {
  async handlePKGExecutionError(
    pkgId: string,
    saasId: string,
    error: PKGExecutionError
  ): Promise<ExecutionResult> {
    switch (error.type) {
      case 'RESOURCE_UNAVAILABLE':
        // リソース待ちキューに追加
        return await this.queueForLater(pkgId, saasId);
        
      case 'STEP_FAILURE':
        // 失敗ステップをスキップして継続
        return await this.continueWithSkip(pkgId, error.failedStep);
        
      case 'DEPENDENCY_TIMEOUT':
        // 依存関係をスキップして実行
        return await this.executeWithoutDependencies(pkgId);
        
      case 'CONCURRENT_EXECUTION_CONFLICT':
        // 競合PKGの完了を待機
        return await this.waitAndRetry(pkgId, saasId);
        
      default:
        return this.abortWithRollback(pkgId, saasId, error);
    }
  }
  
  // 段階的PKG復旧戦略
  async recoverFailedPKG(
    pkgId: string, 
    failurePoint: string
  ): Promise<RecoveryPlan> {
    const recoveryStrategies = {
      // Critical系PKGの復旧
      'CRISIS_MRR_RECOVERY': {
        fallbackPKG: 'CRISIS_EMERGENCY_STABILIZE',
        skipableSteps: ['generate_detailed_report'],
        essentialSteps: ['immediate_actions', 'notify_stakeholders']
      },
      
      // Kill系PKGの復旧
      'LIFECYCLE_END_CLEANUP': {
        fallbackPKG: 'CRISIS_PAUSE_OPERATIONS',
        skipableSteps: ['archive_analytics'],
        essentialSteps: ['stop_billing', 'notify_users']
      },
      
      // Growth系PKGの復旧
      'GROWTH_VIRAL_SCALE': {
        fallbackPKG: 'STABLE_CONTINUE_MONITORING',
        skipableSteps: ['advanced_viral_mechanics'],
        essentialSteps: ['basic_scaling']
      }
    };
    
    const strategy = recoveryStrategies[pkgId];
    if (!strategy) {
      return { action: 'abort', reason: 'no_recovery_strategy' };
    }
    
    // 重要ステップが失敗した場合はフォールバック
    if (strategy.essentialSteps.includes(failurePoint)) {
      return {
        action: 'fallback',
        targetPKG: strategy.fallbackPKG,
        reason: 'essential_step_failed'
      };
    }
    
    // スキップ可能ステップの場合は継続
    if (strategy.skipableSteps.includes(failurePoint)) {
      return {
        action: 'skip_and_continue',
        skippedStep: failurePoint,
        reason: 'non_essential_step'
      };
    }
    
    return { action: 'retry', maxAttempts: 2 };
  }
}
```

### システムレベル復旧戦略

#### 1. Circuit Breaker パターン
```typescript
class DAGCircuitBreaker {
  private readonly thresholds = {
    failure_rate: 0.5,     // 50%失敗率でオープン
    response_time: 30000,  // 30秒応答時間でオープン
    consecutive_failures: 5 // 5回連続失敗でオープン
  };
  
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failures = 0;
  private lastFailure?: Date;
  
  async executeDAG(
    saasId: string,
    operation: () => Promise<any>
  ): Promise<DAGResult> {
    if (this.state === 'OPEN') {
      if (this.shouldTryAgain()) {
        this.state = 'HALF_OPEN';
      } else {
        return this.getFallbackResult(saasId);
      }
    }
    
    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private getFallbackResult(saasId: string): DAGResult {
    return {
      saasId,
      selectedPKG: 'STABLE_CONTINUE_MONITORING', // 安全なデフォルト
      confidence: 0.3,
      source: 'circuit_breaker_fallback',
      timestamp: new Date()
    };
  }
}
```

#### 2. Retry ポリシー
```typescript
class RetryPolicy {
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    config: RetryConfig
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        // リトライ不可能なエラー
        if (this.isNonRetryableError(error)) {
          throw error;
        }
        
        // 最後の試行
        if (attempt === config.maxAttempts) {
          throw error;
        }
        
        // 指数バックオフ待機
        const delay = this.calculateBackoff(attempt, config);
        await this.sleep(delay);
      }
    }
    
    throw lastError;
  }
  
  private isNonRetryableError(error: Error): boolean {
    return error.message.includes('INVALID_PKG_ID') ||
           error.message.includes('SAAS_NOT_FOUND') ||
           error.message.includes('AUTHENTICATION_FAILED');
  }
}
```

#### 3. 障害検知・自動復旧
```typescript
class HealthMonitor {
  async monitorSystemHealth(): Promise<void> {
    const healthChecks = {
      'layer1_symbol_generation': this.checkLayer1Health,
      'layer2_function_execution': this.checkLayer2Health,
      'layer3_pkg_execution': this.checkLayer3Health,
      'batch_processing': this.checkBatchHealth
    };
    
    for (const [component, checker] of Object.entries(healthChecks)) {
      try {
        const health = await checker();
        
        if (health.status === 'UNHEALTHY') {
          await this.triggerRecovery(component, health.issues);
        }
      } catch (error) {
        await this.handleMonitoringError(component, error);
      }
    }
  }
  
  private async triggerRecovery(
    component: string, 
    issues: HealthIssue[]
  ): Promise<void> {
    const recoveryActions = {
      'layer1_symbol_generation': async () => {
        // データソースの再接続
        await this.reconnectDataSources();
        // キャッシュのクリア
        await this.clearCorruptedCache();
      },
      
      'layer2_function_execution': async () => {
        // 関数プールの再初期化
        await this.reinitializeFunctionPool();
        // メモリ不足の場合はGC強制実行
        if (issues.some(i => i.type === 'MEMORY_PRESSURE')) {
          global.gc?.();
        }
      },
      
      'layer3_pkg_execution': async () => {
        // 実行キューのリセット
        await this.resetExecutionQueue();
        // 失敗PKGの再スケジューリング
        await this.rescheduleFailedPKGs();
      }
    };
    
    await recoveryActions[component]?.();
  }
}
```

### ログ・監視統合

```typescript
class ErrorLogger {
  async logDAGError(
    saasId: string,
    layer: 'Layer1' | 'Layer2' | 'Layer3',
    error: DAGError
  ): Promise<void> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      saasId,
      layer,
      errorType: error.type,
      errorMessage: error.message,
      context: error.context,
      recovery: error.recovery,
      impact: this.assessErrorImpact(error),
      correlationId: error.correlationId
    };
    
    // 重要度に応じた通知
    if (logEntry.impact === 'CRITICAL') {
      await this.sendSlackAlert(logEntry);
      await this.createPagerDutyIncident(logEntry);
    }
    
    // 構造化ログ出力
    console.error('DAG_ERROR', JSON.stringify(logEntry));
    
    // メトリクス更新
    await this.updateErrorMetrics(layer, error.type);
  }
  
  private assessErrorImpact(error: DAGError): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (error.type.includes('KILL') || error.type.includes('CRISIS')) {
      return 'CRITICAL';
    }
    
    if (error.affectedSaasCount > 10) {
      return 'HIGH';
    }
    
    if (error.hasRecovery) {
      return 'MEDIUM';
    }
    
    return 'LOW';
  }
}
```

## 単一障害点（SPOF）対策とシステム健全性

### 単一障害点リスクの評価

DAGアーキテクチャの導入により、以下の単一障害点リスクが生じます：

#### 1. 中央集権的エンジン障害
```
危険度: 高
影響範囲: 全SaaS（100-200個）
障害内容: DAGエンジン全体停止、新規判定不可
```

#### 2. Layer間依存関係障害
```
危険度: 中
影響範囲: 特定レイヤー以降の処理
障害内容: Layer1障害→Layer2/3停止、Layer2障害→Layer3停止
```

#### 3. 共通データソース障害
```
危険度: 中高
影響範囲: シンボルキャッシュ、PKG結果保存
障害内容: メトリクス取得不可、実行結果消失
```

### 対策戦略と実装

#### 1. エンジンレベルの復旧機能

##### A. DAGエンジンのマルチインスタンス構成
```typescript
class DAGCluster {
  private instances: DAGEngine[];
  private loadBalancer: LoadBalancer;
  private healthChecker: HealthChecker;
  
  constructor() {
    // 3個のDAGエンジンインスタンスでクラスタ構成
    this.instances = [
      new DAGEngine({ role: 'primary', instanceId: 'dag-01' }),
      new DAGEngine({ role: 'secondary', instanceId: 'dag-02' }),
      new DAGEngine({ role: 'tertiary', instanceId: 'dag-03' })
    ];
  }
  
  async executeBatch(saasList: SaaS[]): Promise<Map<string, string>> {
    // ヘルスチェックでアクティブインスタンスを特定
    const activeEngine = await this.getHealthyEngine();
    
    if (!activeEngine) {
      // 全インスタンスが障害時のフォールバック
      return this.executeEmergencyFallback(saasList);
    }
    
    try {
      return await activeEngine.executeBatch(saasList);
    } catch (error) {
      // 実行中障害発生時のフェイルオーバー
      return this.failoverToBackup(saasList, activeEngine);
    }
  }
  
  private async executeEmergencyFallback(
    saasList: SaaS[]
  ): Promise<Map<string, string>> {
    // 緊急時の簡略PKG選択ロジック
    const results = new Map<string, string>();
    
    for (const saas of saasList) {
      const emergencyPKG = this.selectEmergencyPKG(saas);
      results.set(saas.id, emergencyPKG);
    }
    
    // アラート通知
    await this.alertSystemFailure('ALL_DAG_ENGINES_DOWN');
    
    return results;
  }
  
  private selectEmergencyPKG(saas: SaaS): string {
    // 最小限のDAGロジック（Layer1シンボルのみ使用）
    const criticalSymbols = {
      'B_MRR': saas.lastKnownSymbols?.B_MRR || 0.5,
      'T_UPTIME': saas.lastKnownSymbols?.T_UPTIME || 0.9
    };
    
    // 簡素なルールベース判定
    if (criticalSymbols.B_MRR < 0.1) return 'CRISIS_MRR_RECOVERY';
    if (criticalSymbols.T_UPTIME < 0.9) return 'CRISIS_UPTIME_RECOVER';
    
    return 'STABLE_CONTINUE_MONITORING'; // デフォルト安全選択
  }
}
```

##### B. グレースフルデグリデーション
```typescript
class GracefulDegradation {
  async handleLayerFailure(
    failedLayer: 'Layer1' | 'Layer2' | 'Layer3',
    saasList: SaaS[]
  ): Promise<Map<string, string>> {
    switch (failedLayer) {
      case 'Layer1':
        // Symbol生成障害時は前回値を使用
        return this.useLastKnownSymbols(saasList);
        
      case 'Layer2':
        // Guard判定障害時は簡素ルールで代替
        return this.useSimpleRules(saasList);
        
      case 'Layer3':
        // PKG実行障害時は手動操作に切替
        return this.switchToManualMode(saasList);
        
      default:
        throw new Error(`Unknown layer: ${failedLayer}`);
    }
  }
}
```

#### 2. 定期的な障害訓練とテスト

##### 月次障害訓練シナリオ
1. **DAGエンジン全停止訓練**: 緊急フォールバック機能の検証
2. **データソース障害訓練**: キャッシュフォールバックの検証
3. **ネットワーク分断訓練**: マルチインスタンス間のフェイルオーバー検証
4. **部分障害訓練**: 特定レイヤー障害時のグレースフルデグリデーション

### 障害発生時の対応フロー

```
障害検知 (自動監視)
    ↓
自動復旧試行 (Circuit Breaker)
    ↓ (失敗時)
グレースフルデグリデーション開始
    ↓
アラート送信 (Slack + PagerDuty)
    ↓
手動介入 (必要時)
    ↓
復旧確認とポストモーテム
```

#### 障害影響範囲の最小化
- **時間分割**: 緊急度に応じたバッチ実行（CRISIS優先）
- **地理分散**: 複数リージョンでのDAGエンジン分散配置
- **機能分離**: 重要度別のSaaSグループ化

## 今後の拡張

### 機械学習統合
- Layer2関数の自動生成
- 閾値の動的最適化
- パターン認識による新PKG提案

### リアルタイム処理
- ストリーミングDAG処理
- インクリメンタル更新
- エッジコンピューティング対応

### 可視化強化
- 3Dグラフ表示
- リアルタイムフロー可視化
- 異常検知アラート