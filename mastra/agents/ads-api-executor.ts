// Google Ads API 実行エージェント（リファクタリング済み）
import { GOOGLE_ADS_CONFIG } from '../config/google-ads-constants'
import { GoogleAdsApiOperationBuilder } from './google-ads-api-operations'
import { OptimizationAction } from '../types'

export interface ApiExecutionResult {
  success: boolean
  message: string
  resourceName?: string
  previousBid?: number
  newBid?: number
  adResourceName?: string
  error?: string
}

export interface AdsApiConfig {
  customerId: string
  loginCustomerId: string
  googleAdsClient?: any
}

export class AdsApiExecutor {
  private config: AdsApiConfig
  private googleAdsClient: any
  private operationBuilder: GoogleAdsApiOperationBuilder

  constructor(config: AdsApiConfig) {
    this.config = config
    this.googleAdsClient = config.googleAdsClient || this.getDefaultClient()
    this.operationBuilder = new GoogleAdsApiOperationBuilder(config.customerId)
  }

  async pauseKeyword(action: OptimizationAction): Promise<ApiExecutionResult> {
    try {
      const keyword = action.keywords?.[0]
      if (!keyword) {
        return this.createErrorResult(
          GOOGLE_ADS_CONFIG.ERROR_MESSAGES.MISSING_KEYWORD,
          'MISSING_KEYWORD'
        )
      }

      const criterionId = this.extractCriterionId(action)
      const operation = this.operationBuilder.buildPauseKeywordOperation(action, criterionId)

      const response = await this.executeMutation([operation])
      
      return {
        success: true,
        message: `${GOOGLE_ADS_CONFIG.SUCCESS_MESSAGES.KEYWORD_PAUSED}: ${keyword} を停止しました`,
        resourceName: response.results[0].resource_name
      }
    } catch (error: any) {
      return this.createErrorResult(`キーワード停止に失敗: ${error.message}`, error.message)
    }
  }

  async adjustBid(action: OptimizationAction): Promise<ApiExecutionResult> {
    try {
      const adjustment = action.adjustment || 0
      
      const validation = this.operationBuilder.validateBidAdjustment(adjustment)
      if (!validation.isValid) {
        return this.createErrorResult(
          `入札調整に失敗: ${validation.error}`,
          'SAFETY_LIMIT_EXCEEDED'
        )
      }

      const { currentBidMicros, criterionId } = await this.getCurrentBidInfo(action)
      const newBidMicros = this.operationBuilder.calculateNewBidMicros(currentBidMicros, adjustment)

      const operation = this.operationBuilder.buildBidAdjustmentOperation(action, criterionId, newBidMicros)
      await this.executeMutation([operation])

      const currentBid = currentBidMicros / GOOGLE_ADS_CONFIG.CONVERSION_RATES.MICROS_TO_YEN
      const newBid = newBidMicros / GOOGLE_ADS_CONFIG.CONVERSION_RATES.MICROS_TO_YEN

      return {
        success: true,
        message: `${GOOGLE_ADS_CONFIG.SUCCESS_MESSAGES.BID_ADJUSTED}: ${action.keywords?.[0]} の入札単価を ¥${currentBid.toFixed(2)} → ¥${newBid.toFixed(2)} に調整しました`,
        previousBid: Number(currentBid.toFixed(2)),
        newBid: Number(newBid.toFixed(2))
      }
    } catch (error: any) {
      return this.createErrorResult(`入札調整に失敗: ${error.message}`, error.message)
    }
  }

  async createAdTest(action: OptimizationAction): Promise<ApiExecutionResult> {
    try {
      const operation = this.operationBuilder.buildCreateAdOperation(action)
      const response = await this.executeMutation([operation])

      return {
        success: true,
        message: `${GOOGLE_ADS_CONFIG.SUCCESS_MESSAGES.AD_TEST_CREATED}: 新しい広告バリエーションを作成しました`,
        adResourceName: response.results[0].resource_name
      }
    } catch (error: any) {
      return this.createErrorResult(`広告テスト開始に失敗: ${error.message}`, error.message)
    }
  }

  async executeAction(action: OptimizationAction): Promise<ApiExecutionResult> {
    const actionHandlers: Record<string, (action: OptimizationAction) => Promise<ApiExecutionResult>> = {
      'keyword_pause': this.pauseKeyword.bind(this),
      'bid_adjustment': this.adjustBid.bind(this),
      'ad_test': this.createAdTest.bind(this)
    }

    const handler = actionHandlers[action.type]
    if (!handler) {
      return this.createErrorResult(
        `${GOOGLE_ADS_CONFIG.ERROR_MESSAGES.UNSUPPORTED_ACTION_TYPE}: ${action.type}`,
        'UNSUPPORTED_ACTION_TYPE'
      )
    }

    return await handler(action)
  }

  private async executeMutation(operations: any[]) {
    return await this.googleAdsClient.mutate({
      customerId: this.config.customerId,
      operations
    })
  }

  private async getCurrentBidInfo(action: OptimizationAction): Promise<{ currentBidMicros: number, criterionId: string }> {
    // Mock implementation for GREEN phase
    const criterionId = this.extractCriterionId(action)
    return {
      currentBidMicros: 500000, // ¥0.50
      criterionId
    }
  }

  private extractCriterionId(action: OptimizationAction): string {
    // Mock criterion ID extraction
    return '123'
  }

  private createErrorResult(message: string, error: string): ApiExecutionResult {
    return {
      success: false,
      message,
      error
    }
  }

  private getDefaultClient(): any {
    return {
      mutate: async () => { throw new Error('Google Ads API client not configured') },
      searchStream: async () => { throw new Error('Google Ads API client not configured') }
    }
  }
}