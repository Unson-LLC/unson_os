/**
 * PKG高度DAGアーキテクチャ - Phase 1: 基盤DAGエンジン
 * 
 * レビューフィードバックに基づく段階的実装の第1段階
 * 現在の3層アーキテクチャ（Symbol→Guard→PKG）をDAGエンジン上で動作させる
 */

// ============================================================================
// 基本型定義
// ============================================================================

/**
 * DAGノードの基本インターフェース
 */
export interface DAGNode {
  id: string;                           // M^1-001, D^100-001 形式
  dependencies: string[];               // 依存するノードID配列
  execute: (inputs: NodeInputs) => Promise<any>; // 実行関数
  layer: number;                        // 階層番号（自動抽出）
  metadata?: {
    description?: string;               // ノードの説明
    estimatedExecutionTime?: number;    // 推定実行時間(ms)
    resourceRequirements?: ResourceRequirements;
  };
}

/**
 * ノード実行時の入力データ
 */
export interface NodeInputs {
  [dependencyId: string]: any;
}

/**
 * リソース要件定義
 */
export interface ResourceRequirements {
  cpu: number;        // CPU使用率 (0-1)
  memory: number;     // メモリ使用量 (MB)
  dbConnections: number;
}

/**
 * DAG実行結果
 */
export interface DAGExecutionResult {
  success: boolean;
  results: Map<string, any>;
  executionTime: number;
  errors: ExecutionError[];
  metadata: {
    totalNodes: number;
    executedNodes: number;
    skippedNodes: number;
  };
}

/**
 * 実行エラー情報
 */
export interface ExecutionError {
  nodeId: string;
  error: Error;
  timestamp: Date;
  inputs: NodeInputs;
}

// ============================================================================
// 基盤DAGエンジン実装
// ============================================================================

/**
 * Phase 1: 基盤DAGエンジン
 * 
 * 機能:
 * - ノード依存関係管理
 * - 階層参照バリデーション
 * - トポロジカルソート実行
 * - エラーハンドリング
 */
export class BasicDAGEngine {
  private nodes: Map<string, DAGNode> = new Map();
  private executionHistory: DAGExecutionResult[] = [];

  /**
   * DAGノードを追加
   * @param node 追加するノード
   */
  addNode(node: DAGNode): void {
    // 階層番号を自動抽出して上書き
    const extractedLayer = this.extractLayer(node.id);
    node.layer = extractedLayer;
    
    // 階層参照ルールの検証
    this.validateDependencies(node);
    
    // ノード登録
    this.nodes.set(node.id, node);
  }

  /**
   * DAG全体を実行
   * @returns 実行結果
   */
  async execute(): Promise<DAGExecutionResult> {
    const startTime = Date.now();
    const results = new Map<string, any>();
    const errors: ExecutionError[] = [];
    
    try {
      // トポロジカルソートで実行順序決定
      const sortedNodes = this.topologicalSort();
      
      // 順次実行
      for (const nodeId of sortedNodes) {
        try {
          const result = await this.executeNode(nodeId, results);
          results.set(nodeId, result);
        } catch (error) {
          const nodeError: ExecutionError = {
            nodeId,
            error: error as Error,
            timestamp: new Date(),
            inputs: this.gatherInputs(nodeId, results)
          };
          errors.push(nodeError);
        }
      }
      
      const executionTime = Date.now() - startTime;
      const executionResult: DAGExecutionResult = {
        success: errors.length === 0,
        results,
        executionTime,
        errors,
        metadata: {
          totalNodes: sortedNodes.length,
          executedNodes: results.size,
          skippedNodes: sortedNodes.length - results.size
        }
      };
      
      this.executionHistory.push(executionResult);
      
      return executionResult;
      
    } catch (error) {
      return {
        success: false,
        results,
        executionTime: Date.now() - startTime,
        errors: [{
          nodeId: 'SYSTEM',
          error: error as Error,
          timestamp: new Date(),
          inputs: {}
        }],
        metadata: {
          totalNodes: this.nodes.size,
          executedNodes: 0,
          skippedNodes: this.nodes.size
        }
      };
    }
  }

  /**
   * 特定ノードのみ実行（テスト用）
   * @param nodeId 実行するノードID
   * @param mockInputs モック入力データ
   */
  async executeNode(nodeId: string, existingResults?: Map<string, any>): Promise<any> {
    const node = this.nodes.get(nodeId);
    if (!node) {
      throw new Error(`ノードが見つかりません: ${nodeId}`);
    }

    const inputs = this.gatherInputs(nodeId, existingResults || new Map());
    
    // 実行時間の監視
    const startTime = Date.now();
    const result = await node.execute(inputs);
    const executionTime = Date.now() - startTime;
    
    // パフォーマンス警告
    const estimatedTime = node.metadata?.estimatedExecutionTime || 10;
    if (executionTime > estimatedTime * 2) {
      console.warn(`[DAG] パフォーマンス警告: ${nodeId} (${executionTime}ms > ${estimatedTime}ms)`);
    }
    
    return result;
  }

  // ============================================================================
  // プライベートメソッド
  // ============================================================================

  /**
   * ノードIDから階層番号を抽出
   */
  private extractLayer(nodeId: string): number {
    // M^1-001, D^100-001, F^900-001, X^950-001 形式から階層を抽出
    const match = nodeId.match(/[MDFX]\^(\d+)-/);
    return match ? parseInt(match[1]) : 0;
  }

  /**
   * 階層参照ルールの検証
   * 「階層Nは階層N-1以下のみ参照可能」
   */
  private validateDependencies(node: DAGNode): void {
    node.dependencies.forEach(depId => {
      const depLayer = this.extractLayer(depId);
      
      if (depLayer >= node.layer) {
        throw new Error(
          `階層参照ルール違反: ${node.id}(階層${node.layer}) → ${depId}(階層${depLayer})\n` +
          `階層${node.layer}は階層${depLayer}を参照できません`
        );
      }
    });
  }

  /**
   * トポロジカルソートで実行順序決定
   * Kahn's algorithm を使用
   */
  private topologicalSort(): string[] {
    const inDegree = new Map<string, number>();
    const adjList = new Map<string, string[]>();
    
    // 登録済みノードのみでグラフ構築
    const nodeEntries = Array.from(this.nodes.entries());
    
    for (const [nodeId, node] of nodeEntries) {
      inDegree.set(nodeId, 0);
      adjList.set(nodeId, []);
    }
    
    // 依存関係の構築（存在するノード間のみ）
    for (const [nodeId, node] of nodeEntries) {
      node.dependencies.forEach(depId => {
        // 依存ノードが存在する場合のみ処理
        if (this.nodes.has(depId)) {
          adjList.get(depId)!.push(nodeId);
          const currentInDegree = inDegree.get(nodeId) || 0;
          inDegree.set(nodeId, currentInDegree + 1);
        } else {
          throw new Error(`依存ノードが見つかりません: ${depId} (required by ${nodeId})`);
        }
      });
    }
    
    // トポロジカルソート実行
    const queue: string[] = [];
    const result: string[] = [];
    
    // 入次数0のノードをキューに追加
    const inDegreeEntries = Array.from(inDegree.entries());
    
    for (const [nodeId, degree] of inDegreeEntries) {
      if (degree === 0) {
        queue.push(nodeId);
      }
    }
    
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      result.push(nodeId);
      
      // 隣接ノードの入次数を減少
      adjList.get(nodeId)?.forEach(adjNodeId => {
        const newDegree = inDegree.get(adjNodeId)! - 1;
        inDegree.set(adjNodeId, newDegree);
        
        if (newDegree === 0) {
          queue.push(adjNodeId);
        }
      });
    }
    
    // 循環参照チェック
    if (result.length !== this.nodes.size) {
      throw new Error('DAGに循環参照が検出されました');
    }
    
    return result;
  }

  /**
   * ノード実行時の入力データを収集
   */
  private gatherInputs(nodeId: string, results: Map<string, any>): NodeInputs {
    const node = this.nodes.get(nodeId);
    if (!node) {
      throw new Error(`ノードが見つかりません: ${nodeId}`);
    }

    const inputs: NodeInputs = {};
    
    node.dependencies.forEach(depId => {
      if (results.has(depId)) {
        inputs[depId] = results.get(depId);
      } else {
        console.warn(`[DAG] 依存ノードの結果が見つかりません: ${depId} (required by ${nodeId})`);
      }
    });
    
    return inputs;
  }

  // ============================================================================
  // ユーティリティメソッド
  // ============================================================================

  /**
   * 登録済みノード一覧を取得
   */
  getNodes(): Map<string, DAGNode> {
    return new Map(this.nodes);
  }

  /**
   * 特定階層のノード一覧を取得
   */
  getNodesByLayer(layer: number): DAGNode[] {
    return Array.from(this.nodes.values()).filter(node => node.layer === layer);
  }

  /**
   * DAG統計情報を取得
   */
  getStatistics() {
    const layerStats = new Map<number, number>();
    
    const nodeValues = Array.from(this.nodes.values());
    
    for (const node of nodeValues) {
      const count = layerStats.get(node.layer) || 0;
      layerStats.set(node.layer, count + 1);
    }
    
    return {
      totalNodes: this.nodes.size,
      layerCount: layerStats.size,
      layerDistribution: Object.fromEntries(layerStats),
      lastExecution: this.executionHistory[this.executionHistory.length - 1]
    };
  }

  /**
   * DAGの可視化用データを生成
   */
  generateVisualizationData() {
    const nodes = Array.from(this.nodes.values()).map(node => ({
      id: node.id,
      layer: node.layer,
      dependencies: node.dependencies,
      description: node.metadata?.description || ''
    }));

    const edges = nodes.flatMap(node => 
      node.dependencies.map(depId => ({
        from: depId,
        to: node.id
      }))
    );

    return { nodes, edges };
  }
}

// ============================================================================
// ファクトリー関数
// ============================================================================

/**
 * DAGエンジンのファクトリー関数
 */
export function createDAGEngine(): BasicDAGEngine {
  return new BasicDAGEngine();
}

/**
 * 開発用のサンプルDAGを作成
 */
export function createSampleDAG(): BasicDAGEngine {
  const engine = createDAGEngine();

  // M^1-001: Symbol生成ノード
  engine.addNode({
    id: 'M^1-001',
    dependencies: [],
    layer: 1,
    execute: async () => ({
      'B_MRR': 0.45,
      'U_DAU_MAU': 0.62,
      'T_UPTIME': 0.98
    }),
    metadata: {
      description: 'Symbol生成: ビジネス指標',
      estimatedExecutionTime: 5
    }
  });

  // D^100-001: PMF判定ノード
  engine.addNode({
    id: 'D^100-001',
    dependencies: ['M^1-001'],
    layer: 100,
    execute: async (inputs) => {
      const symbols = inputs['M^1-001'];
      return {
        pmfAchieved: symbols.B_MRR > 0.3 && symbols.U_DAU_MAU > 0.5,
        confidence: 0.89
      };
    },
    metadata: {
      description: 'PMF達成判定',
      estimatedExecutionTime: 3
    }
  });

  // X^950-001: PKG実行ノード
  engine.addNode({
    id: 'X^950-001',
    dependencies: ['D^100-001'],
    layer: 950,
    execute: async (inputs) => {
      const decision = inputs['D^100-001'];
      return {
        selectedPKG: decision.pmfAchieved ? 'GROWTH_VIRAL_SCALE' : 'CRISIS_MRR_RECOVERY',
        executionScheduled: true
      };
    },
    metadata: {
      description: 'PKG選択・実行',
      estimatedExecutionTime: 2
    }
  });

  return engine;
}