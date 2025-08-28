// Google Ads API 実行エージェントのテスト（t_wada式TDD - REDフェーズ）
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AdsApiExecutor } from '../ads-api-executor'
import { OptimizationAction } from '../../types'

// Google Ads API クライアントモック
const mockGoogleAdsClient = {
  searchStream: vi.fn(),
  mutate: vi.fn()
}

vi.mock('google-ads-api', () => ({
  GoogleAdsApi: vi.fn().mockImplementation(() => ({
    Client: vi.fn().mockImplementation(() => mockGoogleAdsClient)
  }))
}))

describe('AdsApiExecutor', () => {
  let executor: AdsApiExecutor
  
  beforeEach(() => {
    vi.clearAllMocks()
    executor = new AdsApiExecutor({
      customerId: '1234567890',
      loginCustomerId: '9876543210'
    })
  })

  describe('pauseKeyword', () => {
    it('should pause keyword by setting status to PAUSED', async () => {
      // Arrange
      const action: OptimizationAction = {
        type: 'keyword_pause',
        description: 'Pause low-performing keyword',
        keywords: ['low performing keyword'],
        adGroupId: 'ad_group_123'
      }

      mockGoogleAdsClient.mutate.mockResolvedValue({
        results: [{ resource_name: 'customers/1234567890/adGroupCriteria/123~456' }]
      })

      // Act
      const result = await executor.pauseKeyword(action)

      // Assert
      expect(mockGoogleAdsClient.mutate).toHaveBeenCalledWith({
        customerId: '1234567890',
        operations: [{
          entity: 'ad_group_criterion',
          operation: 'update',
          resource: {
            resource_name: expect.stringContaining('adGroupCriteria'),
            status: 'PAUSED'
          },
          update_mask: 'status'
        }]
      })

      expect(result).toEqual({
        success: true,
        message: 'キーワード停止完了: low performing keyword を停止しました',
        resourceName: 'customers/1234567890/adGroupCriteria/123~456'
      })
    })

    it('should handle API errors gracefully', async () => {
      // Arrange
      const action: OptimizationAction = {
        type: 'keyword_pause',
        description: 'Test pause',
        keywords: ['test keyword']
      }

      mockGoogleAdsClient.mutate.mockRejectedValue(
        new Error('PERMISSION_DENIED: User does not have permission')
      )

      // Act
      const result = await executor.pauseKeyword(action)

      // Assert
      expect(result).toEqual({
        success: false,
        message: 'キーワード停止に失敗: PERMISSION_DENIED: User does not have permission',
        error: 'PERMISSION_DENIED: User does not have permission'
      })
    })
  })

  describe('adjustBid', () => {
    it('should adjust keyword bid within safety limits', async () => {
      // Arrange
      const action: OptimizationAction = {
        type: 'bid_adjustment',
        description: 'Reduce bid by 15%',
        keywords: ['high cost keyword'],
        adGroupId: 'ad_group_456',
        adjustment: -0.15
      }

      // Mock current bid retrieval
      mockGoogleAdsClient.searchStream.mockResolvedValue([{
        ad_group_criterion: {
          resource_name: 'customers/1234567890/adGroupCriteria/456~789',
          cpc_bid_micros: 500000 // ¥0.50
        }
      }])

      mockGoogleAdsClient.mutate.mockResolvedValue({
        results: [{ resource_name: 'customers/1234567890/adGroupCriteria/456~789' }]
      })

      // Act
      const result = await executor.adjustBid(action)

      // Assert
      expect(mockGoogleAdsClient.mutate).toHaveBeenCalledWith({
        customerId: '1234567890',
        operations: [{
          entity: 'ad_group_criterion',
          operation: 'update',
          resource: {
            resource_name: 'customers/1234567890/adGroupCriteria/456~789',
            cpc_bid_micros: 425000 // 0.50 * (1 - 0.15) = 0.425
          },
          update_mask: 'cpc_bid_micros'
        }]
      })

      expect(result).toEqual({
        success: true,
        message: '入札調整完了: high cost keyword の入札単価を ¥0.50 → ¥0.43 に調整しました',
        previousBid: 0.50,
        newBid: 0.43
      })
    })

    it('should reject bid adjustments exceeding safety limits', async () => {
      // Arrange
      const action: OptimizationAction = {
        type: 'bid_adjustment',
        description: 'Extreme bid reduction',
        keywords: ['test keyword'],
        adjustment: -0.50 // 50% reduction exceeds 30% limit
      }

      // Act
      const result = await executor.adjustBid(action)

      // Assert
      expect(result).toEqual({
        success: false,
        message: '入札調整に失敗: 変更幅 -50% が安全制限 ±30% を超えています',
        error: 'SAFETY_LIMIT_EXCEEDED'
      })
    })
  })

  describe('createAdTest', () => {
    it('should create new ad variation for A/B testing', async () => {
      // Arrange
      const action: OptimizationAction = {
        type: 'ad_test',
        description: 'Create new ad variation',
        adGroupId: 'ad_group_789'
      }

      mockGoogleAdsClient.mutate.mockResolvedValue({
        results: [{ resource_name: 'customers/1234567890/ads/new_ad_123' }]
      })

      // Act
      const result = await executor.createAdTest(action)

      // Assert
      expect(mockGoogleAdsClient.mutate).toHaveBeenCalledWith({
        customerId: '1234567890',
        operations: [{
          entity: 'ad_group_ad',
          operation: 'create',
          resource: {
            ad_group: 'customers/1234567890/adGroups/ad_group_789',
            ad: {
              type: 'RESPONSIVE_SEARCH_AD',
              responsive_search_ad: {
                headlines: expect.any(Array),
                descriptions: expect.any(Array)
              }
            },
            status: 'ENABLED'
          }
        }]
      })

      expect(result).toEqual({
        success: true,
        message: '広告テスト開始完了: 新しい広告バリエーションを作成しました',
        adResourceName: 'customers/1234567890/ads/new_ad_123'
      })
    })
  })

  describe('executeAction', () => {
    it('should route actions to appropriate execution methods', async () => {
      // Arrange
      const pauseAction: OptimizationAction = {
        type: 'keyword_pause',
        description: 'Test pause action',
        keywords: ['test']
      }

      const executor = new AdsApiExecutor({ customerId: '123', loginCustomerId: '456' })
      executor.pauseKeyword = vi.fn().mockResolvedValue({ success: true })

      // Act
      const result = await executor.executeAction(pauseAction)

      // Assert
      expect(executor.pauseKeyword).toHaveBeenCalledWith(pauseAction)
      expect(result).toEqual({ success: true })
    })

    it('should handle unknown action types', async () => {
      // Arrange
      const unknownAction: OptimizationAction = {
        type: 'unknown_action',
        description: 'Unknown action type'
      }

      // Act
      const result = await executor.executeAction(unknownAction)

      // Assert
      expect(result).toEqual({
        success: false,
        message: '未対応のアクションタイプ: unknown_action',
        error: 'UNSUPPORTED_ACTION_TYPE'
      })
    })
  })
})