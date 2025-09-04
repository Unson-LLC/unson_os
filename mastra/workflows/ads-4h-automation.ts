// Google Ads 4時間自動化ワークフロー（MCP統合版）
import { createWorkflow } from '@mastra/core/workflows'
import { z } from 'zod'
import { fetchAndAnalyzeAds } from './ads-data-fetcher'
import { generateOptimizationActions } from '../agents/ads-optimizer'
import { AdsApiExecutor } from '../agents/ads-api-executor'

export interface AutomationConfig {
  customerId: number
  loginCustomerId: number
  productId: string
  dryRun: boolean
}

export interface AutomationResult {
  productId: string
  timestamp: string
  analysis: any
  actions: any[]
  executionResults: any[]
  status: 'success' | 'partial' | 'failed'
}

// 完全自動化ワークフロー（MCP + API統合）
export const ads4hAutomationWorkflow = createWorkflow({
  id: 'ads-4h-automation',
  inputSchema: z.object({
    customerId: z.number(),
    loginCustomerId: z.number(),
    productId: z.string(),
    dryRun: z.boolean()
  }),
  outputSchema: z.object({
    productId: z.string(),
    timestamp: z.string(),
    analysis: z.any(),
    actions: z.array(z.any()),
    executionResults: z.array(z.any()),
    status: z.enum(['success', 'partial', 'failed'])
  })
})

export async function runAutomation(config: AutomationConfig): Promise<AutomationResult> {
  const { customerId, loginCustomerId, productId, dryRun } = config
  
  // Step 1: Fetch and analyze
  const analysisResult = await fetchAndAnalyzeAds(customerId, loginCustomerId, productId)
  
  // Step 2: Generate actions
  const actions = await generateOptimizationActions(analysisResult.analysis)
  
  // Step 3: Execute optimizations
  let executionResults: any[]
  
  if (dryRun) {
    executionResults = actions.map((action: any) => ({
      action: action.type,
      status: 'dry_run_success',
      message: `Dry run: ${action.description}`
    }))
  } else {
    const executor = new AdsApiExecutor({
      customerId: String(customerId),
      loginCustomerId: String(loginCustomerId)
    })
    
    executionResults = []
    for (const action of actions) {
      try {
        const result = await executor.executeAction(action)
        executionResults.push({
          action: action.type,
          status: result.success ? 'success' : 'failed',
          message: result.message,
          details: result
        })
      } catch (error: any) {
        executionResults.push({
          action: action.type,
          status: 'error',
          message: error.message
        })
      }
    }
  }
  
  const successCount = executionResults.filter(r => r.status === 'success').length
  const totalActions = actions.length
  
  let status: 'success' | 'partial' | 'failed' = 'failed'
  if (successCount === totalActions && totalActions > 0) {
    status = 'success'
  } else if (successCount > 0) {
    status = 'partial'
  }

  return {
    productId,
    timestamp: new Date().toISOString(),
    analysis: analysisResult.analysis,
    actions,
    executionResults,
    status
  }
}