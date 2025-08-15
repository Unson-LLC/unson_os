# PKG（Package）システム設計 - DAGアーキテクチャ

## 概要

PKGシステムは、FXトレーディングシステムのDAG（Directed Acyclic Graph）アーキテクチャをベースに、100-200個のマイクロSaaS管理に最適化した階層的データ処理システムです。実用的な300-500のシンボルから、24-48時間の高速サイクルで最適なPKGを動的に選択します。

## 用語集・核心概念

### 重要用語定義

| 用語 | 定義 | 具体例 |
|------|------|--------|
| **Symbol** | Layer1で生成される正規化済みメトリクス（0-1値） | B_MRR: 0.45, U_DAU: 0.62 |
| **Layer2関数** | 複数シンボルから条件を評価する判定ロジック | L2_PMF_CHECK, L2_PIVOT_DECISION |
| **PKG** | 条件に応じて実行されるアクションパッケージ | CRISIS_MRR_RECOVERY, GROWTH_VIRAL_SCALE |
| **DAG実行** | Layer1→2→3の順次処理による自動判定フロー | 2h/24h/48hサイクルでの定期実行 |
| **Lifecycle** | SaaSの現在状態カテゴリ | LAUNCH, GROWTH, STABLE, CRISIS |
| **Priority** | PKG実行の緊急度レベル | KILL>CRISIS>PIVOT>SCALE>OPTIMIZE |
| **Batch処理** | 複数SaaSの並列処理単位 | 20個ずつのグループ処理 |
| **Emergency Trigger** | 閾値超過時の即座DAG実行 | MRR 95%減少時の緊急対応 |

### アーキテクチャ階層関係
```
生データ（Stripe, GA等）
    ↓ 正規化
Layer1: Symbol生成（300-500個）
    ↓ 組み合わせ評価  
Layer2: 判定関数（PMF, PIVOT, SCALE等）
    ↓ 条件マッチング
Layer3: PKG選択・実行（競合解決含む）
    ↓ バッチ処理
実行結果（20個並列、優先度順）
```

### DAGアーキテクチャ（UnsonOS最適化版）
- **階層構造**: Layer 1（データ収集）→ Layer 2（SaaS判定）→ Layer 3（PKG実行）
- **シンボル体系**: 300-500の実用シンボル（B_MRR, U_DAU, M_TREND など）
- **関数演算**: PMF（適合度）、PIVOT（転換）、SCALE（拡大）、KILL（終了）、OPTIMIZE（最適化）
- **PKG ID体系**: `<LIFECYCLE>_<CONDITION>_<ACTION>`形式（例: LAUNCH_HIGHCVR_FASTTRACK）
- **時間軸**: 2時間/24時間/48時間の高速判定サイクル

### データフロー
```
[生データ] → [シンボル化] → [Layer1] → [Layer2演算] → [Layer3判定] → [PKG実行]
```

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

## レイヤー定義

### Layer 1: SaaSメトリクス収集層
100-200個のマイクロSaaS向けに最適化された実用的シンボル体系

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

### Layer 2: 条件評価層
複数のLayer 1シンボルを関数で結合

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

### Layer 3: PKG選択層
Layer 2の結果からPKGを決定（競合解決ポリシー含む）

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