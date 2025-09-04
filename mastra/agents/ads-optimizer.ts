// Google Ads最適化エージェント（リファクタリング済み）
import { Agent } from '@mastra/core/agent'
import { openaiModel } from '../config'
import { OPTIMIZATION_SAFETY_LIMITS, ADS_ANALYSIS_THRESHOLDS } from '../config/constants'
import { OptimizationActionGenerator } from '../tools/optimization-action-generator'
import { PerformanceAnalysis, OptimizationAction } from '../types'

const createAgentInstructions = () => `
あなたはGoogle Ads最適化のエキスパートAIエージェントです。
4時間窓でのパフォーマンス分析結果を基に、具体的な最適化アクションを提案し、実行します。

判断基準：
- CTR低下（${ADS_ANALYSIS_THRESHOLDS.CTR_DROP_THRESHOLD}%以上）: キーワード停止、広告文改善
- CVR悪化（${ADS_ANALYSIS_THRESHOLDS.CVR_DROP_THRESHOLD}%以上）: ランディングページ改善、ターゲティング調整  
- CPC急上昇（+${ADS_ANALYSIS_THRESHOLDS.CPC_SPIKE_THRESHOLD}%以上）: 入札戦略見直し、競合分析

安全性：
- 変更幅は${OPTIMIZATION_SAFETY_LIMITS.MAX_BID_CHANGE_PERCENT}%以内
- ${OPTIMIZATION_SAFETY_LIMITS.COOLDOWN_HOURS}時間のクールダウン期間
- リスクの高い変更は事前承認
`

export const adsOptimizerAgent = new Agent({
  name: 'google-ads-optimizer',
  instructions: createAgentInstructions(),
  model: openaiModel,
  tools: {
    analyze_performance: {
      description: 'パフォーマンス指標を分析して問題を特定',
      parameters: {
        type: 'object',
        properties: {
          current_window: { type: 'object' },
          previous_window: { type: 'object' }
        }
      }
    },
    generate_optimizations: {
      description: '最適化アクションを生成',
      parameters: {
        type: 'object',
        properties: {
          analysis: { type: 'object' },
          actions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string' },
                description: { type: 'string' },
                priority: { type: 'string' },
                risk_level: { type: 'string' }
              }
            }
          }
        }
      }
    },
    execute_google_ads_action: {
      description: 'Google Ads APIを使って実際の最適化を実行',
      parameters: {
        type: 'object',
        properties: {
          action_type: { type: 'string' },
          parameters: { type: 'object' },
          dry_run: { type: 'boolean', default: true }
        }
      }
    }
  }
})

export async function generateOptimizationActions(analysis: PerformanceAnalysis): Promise<OptimizationAction[]> {
  return OptimizationActionGenerator.generateOptimizationActions(analysis)
}