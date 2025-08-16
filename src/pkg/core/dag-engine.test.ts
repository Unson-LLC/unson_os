/**
 * PKG基盤DAGエンジン - テストスイート
 * 
 * Phase 1の成功指標を検証:
 * - 階層参照チェックが正常に機能
 * - Symbol→Guard→PKGフローがDAGエンジン上で動作
 * - 実行時間が目標内（50ms以下）
 */

import { BasicDAGEngine, createDAGEngine, createSampleDAG } from './dag-engine';

describe('BasicDAGEngine', () => {
  let engine: BasicDAGEngine;

  beforeEach(() => {
    engine = createDAGEngine();
  });

  describe('ノード追加と検証', () => {
    test('正常なノードが追加できる', () => {
      const node = {
        id: 'M^1-001',
        dependencies: [],
        layer: 1,
        execute: async () => ({ test: 'data' })
      };

      expect(() => engine.addNode(node)).not.toThrow();
      expect(engine.getNodes().has('M^1-001')).toBe(true);
    });

    test('階層番号が自動抽出される', () => {
      const testCases = [
        { id: 'M^1-001', expectedLayer: 1 },
        { id: 'D^100-001', expectedLayer: 100 },
        { id: 'F^900-001', expectedLayer: 900 },
        { id: 'X^950-001', expectedLayer: 950 }
      ];

      testCases.forEach(({ id, expectedLayer }) => {
        const node = {
          id,
          dependencies: [],
          layer: 0, // 自動上書きされる
          execute: async () => ({})
        };

        engine.addNode(node);
        expect(engine.getNodes().get(id)?.layer).toBe(expectedLayer);
      });
    });

    test('階層参照ルール違反でエラーが発生する', () => {
      // 正常なノードを先に追加
      engine.addNode({
        id: 'M^1-001',
        dependencies: [],
        layer: 1,
        execute: async () => ({})
      });

      // 同階層参照（違反）
      expect(() => {
        engine.addNode({
          id: 'M^1-002',
          dependencies: ['M^1-001'], // 同じ階層1を参照
          layer: 1,
          execute: async () => ({})
        });
      }).toThrow('階層参照ルール違反');

      // 上位階層参照（違反）
      expect(() => {
        engine.addNode({
          id: 'M^1-003',
          dependencies: ['D^100-001'], // 下位層(1)が上位層(100)を参照
          layer: 1,
          execute: async () => ({})
        });
      }).toThrow('階層参照ルール違反');
    });

    test('正しい階層参照は許可される', () => {
      // 階層1のノード
      engine.addNode({
        id: 'M^1-001',
        dependencies: [],
        layer: 1,
        execute: async () => ({})
      });

      // 階層100が階層1を参照（正常）
      expect(() => {
        engine.addNode({
          id: 'D^100-001',
          dependencies: ['M^1-001'],
          layer: 100,
          execute: async () => ({})
        });
      }).not.toThrow();

      // 階層950が階層100と1を参照（正常）
      expect(() => {
        engine.addNode({
          id: 'X^950-001',
          dependencies: ['D^100-001', 'M^1-001'],
          layer: 950,
          execute: async () => ({})
        });
      }).not.toThrow();
    });
  });

  describe('DAG実行', () => {
    test('サンプルDAGが正常に実行される', async () => {
      const sampleEngine = createSampleDAG();
      const result = await sampleEngine.execute();

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.results.size).toBe(3); // 3ノード実行
      expect(result.executionTime).toBeLessThan(50); // 50ms以下
    });

    test('実行順序が依存関係に従う', async () => {
      const executionOrder: string[] = [];

      // 実行順序を記録するノード群
      engine.addNode({
        id: 'M^1-001',
        dependencies: [],
        layer: 1,
        execute: async () => {
          executionOrder.push('M^1-001');
          return { data: 'layer1' };
        }
      });

      engine.addNode({
        id: 'D^100-001',
        dependencies: ['M^1-001'],
        layer: 100,
        execute: async () => {
          executionOrder.push('D^100-001');
          return { data: 'layer100' };
        }
      });

      engine.addNode({
        id: 'X^950-001',
        dependencies: ['D^100-001'],
        layer: 950,
        execute: async () => {
          executionOrder.push('X^950-001');
          return { data: 'layer950' };
        }
      });

      const result = await engine.execute();

      expect(result.success).toBe(true);
      expect(executionOrder).toEqual(['M^1-001', 'D^100-001', 'X^950-001']);
    });

    test('ノードエラー時の適切な処理', async () => {
      engine.addNode({
        id: 'M^1-001',
        dependencies: [],
        layer: 1,
        execute: async () => {
          throw new Error('テストエラー');
        }
      });

      engine.addNode({
        id: 'D^100-001',
        dependencies: ['M^1-001'],
        layer: 100,
        execute: async () => ({ test: 'success' })
      });

      const result = await engine.execute();

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].nodeId).toBe('M^1-001');
      expect(result.errors[0].error.message).toBe('テストエラー');
    });

    test('入力データが正しく渡される', async () => {
      let receivedInputs: any;

      engine.addNode({
        id: 'M^1-001',
        dependencies: [],
        layer: 1,
        execute: async () => ({ 
          symbol1: 'value1',
          symbol2: 'value2'
        })
      });

      engine.addNode({
        id: 'D^100-001',
        dependencies: ['M^1-001'],
        layer: 100,
        execute: async (inputs) => {
          receivedInputs = inputs;
          return { processed: true };
        }
      });

      await engine.execute();

      expect(receivedInputs).toHaveProperty('M^1-001');
      expect(receivedInputs['M^1-001']).toEqual({
        symbol1: 'value1',
        symbol2: 'value2'
      });
    });
  });

  describe('パフォーマンス検証', () => {
    test('Symbol→Guard→PKGフローが50ms以内で完了', async () => {
      // 現在の3層アーキテクチャを模倣
      const engine = createRealistic3LayerDAG();
      
      const startTime = Date.now();
      const result = await engine.execute();
      const executionTime = Date.now() - startTime;

      expect(result.success).toBe(true);
      expect(executionTime).toBeLessThan(50);
      expect(result.executionTime).toBeLessThan(50);
    });

    test('パフォーマンス警告が発生する', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      engine.addNode({
        id: 'M^1-001',
        dependencies: [],
        layer: 1,
        execute: async () => {
          // 意図的に遅延
          await new Promise(resolve => setTimeout(resolve, 30));
          return {};
        },
        metadata: {
          estimatedExecutionTime: 10 // 10ms想定だが30ms実行
        }
      });

      await engine.execute();

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('パフォーマンス警告: M^1-001')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('ユーティリティ機能', () => {
    test('階層別ノード取得', () => {
      engine.addNode({
        id: 'M^1-001',
        dependencies: [],
        layer: 1,
        execute: async () => ({})
      });

      engine.addNode({
        id: 'M^1-002',
        dependencies: [],
        layer: 1,
        execute: async () => ({})
      });

      engine.addNode({
        id: 'D^100-001',
        dependencies: ['M^1-001'],
        layer: 100,
        execute: async () => ({})
      });

      const layer1Nodes = engine.getNodesByLayer(1);
      const layer100Nodes = engine.getNodesByLayer(100);

      expect(layer1Nodes).toHaveLength(2);
      expect(layer100Nodes).toHaveLength(1);
      expect(layer1Nodes.map(n => n.id)).toContain('M^1-001');
      expect(layer1Nodes.map(n => n.id)).toContain('M^1-002');
    });

    test('統計情報取得', async () => {
      const sampleEngine = createSampleDAG();
      await sampleEngine.execute();

      const stats = sampleEngine.getStatistics();

      expect(stats.totalNodes).toBe(3);
      expect(stats.layerCount).toBe(3);
      expect(stats.layerDistribution).toEqual({
        '1': 1,
        '100': 1,
        '950': 1
      });
      expect(stats.lastExecution).toBeDefined();
      expect(stats.lastExecution?.success).toBe(true);
    });

    test('可視化データ生成', () => {
      const sampleEngine = createSampleDAG();
      const vizData = sampleEngine.generateVisualizationData();

      expect(vizData.nodes).toHaveLength(3);
      expect(vizData.edges).toHaveLength(2); // M→D, D→X

      expect(vizData.nodes.map(n => n.id)).toEqual([
        'M^1-001', 'D^100-001', 'X^950-001'
      ]);

      expect(vizData.edges).toEqual([
        { from: 'M^1-001', to: 'D^100-001' },
        { from: 'D^100-001', to: 'X^950-001' }
      ]);
    });
  });

  describe('エラーハンドリング', () => {
    test('存在しないノード実行でエラー', async () => {
      await expect(engine.executeNode('NONEXISTENT')).rejects.toThrow(
        'ノードが見つかりません: NONEXISTENT'
      );
    });

    test('存在しない依存ノードでエラー', async () => {
      // 存在しない依存ノードを参照するテスト
      engine.addNode({
        id: 'D^100-001',
        dependencies: ['M^1-999'], // 存在しないノード
        layer: 100,
        execute: async () => ({})
      });
      
      // 実行時にエラーが発生し、失敗結果が返されることを確認
      const result = await engine.execute();
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].error.message).toContain('依存ノードが見つかりません');
    });
  });
});

// ============================================================================
// テストヘルパー関数
// ============================================================================

/**
 * 現実的な3層DAGを作成（パフォーマンステスト用）
 */
function createRealistic3LayerDAG(): BasicDAGEngine {
  const engine = createDAGEngine();

  // Layer 1: Symbol生成（10個のSymbol）
  const symbols = ['B_MRR', 'B_CHURN', 'U_DAU_MAU', 'U_RETENTION_D7', 'T_UPTIME'];
  symbols.forEach((symbol, index) => {
    engine.addNode({
      id: `M^1-${String(index + 1).padStart(3, '0')}`,
      dependencies: [],
      layer: 1,
      execute: async () => ({
        [symbol]: Math.random()
      }),
      metadata: {
        description: `Symbol生成: ${symbol}`,
        estimatedExecutionTime: 2
      }
    });
  });

  // Layer 100: Guard判定（5個の判定関数）
  const judgments = ['PMF_CHECK', 'CRISIS_DETECT', 'SCALE_READY', 'OPTIMIZE_TIMING', 'KILL_CHECK'];
  judgments.forEach((judgment, index) => {
    engine.addNode({
      id: `D^100-${String(index + 1).padStart(3, '0')}`,
      dependencies: [`M^1-001`, `M^1-002`], // 複数Symbol依存
      layer: 100,
      execute: async (inputs) => {
        // 実際の判定ロジックを模倣
        const symbol1 = inputs['M^1-001'];
        const symbol2 = inputs['M^1-002'];
        return {
          result: Math.random() > 0.5,
          confidence: Math.random()
        };
      },
      metadata: {
        description: `Guard判定: ${judgment}`,
        estimatedExecutionTime: 5
      }
    });
  });

  // Layer 950: PKG実行（1個の最終判定）
  engine.addNode({
    id: 'X^950-001',
    dependencies: ['D^100-001', 'D^100-002', 'D^100-003'],
    layer: 950,
    execute: async (inputs) => {
      // 複数判定結果から最終PKG選択
      const decisions = Object.values(inputs);
      const positiveDecisions = decisions.filter((d: any) => d.result).length;
      
      let selectedPKG = 'STABLE_MAINTAIN';
      if (positiveDecisions >= 2) {
        selectedPKG = 'GROWTH_VIRAL_SCALE';
      } else if (positiveDecisions === 0) {
        selectedPKG = 'CRISIS_MRR_RECOVERY';
      }
      
      return {
        selectedPKG,
        confidence: Math.random(),
        executionScheduled: true
      };
    },
    metadata: {
      description: 'PKG最終選択',
      estimatedExecutionTime: 3
    }
  });

  return engine;
}