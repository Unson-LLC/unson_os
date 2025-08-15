# PKG（Package）システム設計 - DAGアーキテクチャ

## 概要

PKGシステムは、FXトレーディングシステムのDAG（Directed Acyclic Graph）アーキテクチャをベースに、100-200個のマイクロSaaS管理に最適化した階層的データ処理システムです。実用的な300-500のシンボルから、24-48時間の高速サイクルで最適なPKGを動的に選択します。

## 核心概念

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
Layer 2の結果からPKGを決定

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