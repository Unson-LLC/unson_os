// Google Ads 4時間自動化ワークフロー（MCP統合版）
import { Workflow } from '@mastra/core'
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
export const ads4hAutomationWorkflow = new Workflow({
  name: 'ads-4h-automation',
  triggerSchema: {
    customerId: Number,
    loginCustomerId: Number,
    productId: String,
    dryRun: Boolean
  }
})
.step('fetch-and-analyze', async (context) => {
  const { customerId, loginCustomerId, productId } = context.data
  const result = await fetchAndAnalyzeAds(customerId, loginCustomerId, productId)
  return { analysisResult: result }
})
.step('generate-actions', async (context) => {
  const { analysisResult } = context.data
  const actions = await generateOptimizationActions(analysisResult.analysis)
  return { ...context.data, actions }
})
.step('execute-optimizations', async (context) => {
  const { customerId, loginCustomerId, actions, dryRun } = context.data
  
  if (dryRun) {
    return {
      ...context.data,
      executionResults: actions.map((action: any) => ({
        action: action.type,
        status: 'dry_run',
        message: `[DRY RUN] ${action.description}`
      }))
    }
  }

  const executor = new AdsApiExecutor({
    customerId: String(customerId),
    loginCustomerId: String(loginCustomerId)
  })

  const executionResults = []
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
        message: error.message,
        error: error
      })
    }
  }

  return { ...context.data, executionResults }
})

export async function runAutomation(config: AutomationConfig): Promise<AutomationResult> {
  const result = await ads4hAutomationWorkflow.execute(config)
  const data = result.data
  
  const successCount = data.executionResults?.filter((r: any) => r.status === 'success').length || 0
  const totalActions = data.actions?.length || 0
  
  let status: 'success' | 'partial' | 'failed' = 'failed'
  if (successCount === totalActions && totalActions > 0) {
    status = 'success'
  } else if (successCount > 0) {
    status = 'partial'
  }

  return {
    productId: config.productId,
    timestamp: new Date().toISOString(),
    analysis: data.analysisResult?.analysis || {},
    actions: data.actions || [],
    executionResults: data.executionResults || [],
    status
  }
}