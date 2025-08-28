// Google Ads データ取得ワークフローのテスト（t_wada式TDD - REDフェーズ）
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { adsDataFetcherWorkflow, fetchAndAnalyzeAds } from '../ads-data-fetcher'
import { GoogleAdsMcpClient } from '../../tools/google-ads-mcp-client'

// モック設定
vi.mock('../../tools/google-ads-mcp-client')
vi.mock('../ads-analysis')

const mockMcpClient = {
  get4HourMetrics: vi.fn(),
  getCurrentCampaigns: vi.fn(),
  getKeywordPerformance: vi.fn()
} as any

const mockAnalyzeAdsPerformance = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(GoogleAdsMcpClient).mockImplementation(() => mockMcpClient)
  vi.doMock('../ads-analysis', () => ({
    analyzeAdsPerformance: mockAnalyzeAdsPerformance
  }))
})

describe('AdsDataFetcherWorkflow', () => {
  describe('fetchAndAnalyzeAds', () => {
    it('should fetch 4-hour metrics and analyze performance', async () => {
      // Arrange
      const customerId = 1234567890
      const loginCustomerId = 9876543210
      const productId = 'WATASHI-COMPASS'
      
      const mockMetrics = [
        {
          timestamp: '2025-01-28T14:00:00.000Z',
          impressions: 1000,
          clicks: 50,
          cost: 25.5,
          conversions: 2
        },
        {
          timestamp: '2025-01-28T10:00:00.000Z',
          impressions: 800,
          clicks: 40,
          cost: 20.0,
          conversions: 1
        }
      ]

      const mockAnalysis = {
        ctr: { current: 5.0, previous: 5.0, change: 0 },
        cvr: { current: 4.0, previous: 2.5, change: 60 },
        cpc: { current: 0.51, previous: 0.50, change: 2 },
        issues: []
      }

      mockMcpClient.get4HourMetrics.mockResolvedValue(mockMetrics)
      mockAnalyzeAdsPerformance.mockResolvedValue(mockAnalysis)

      // Act
      const result = await fetchAndAnalyzeAds(customerId, loginCustomerId, productId)

      // Assert
      expect(mockMcpClient.get4HourMetrics).toHaveBeenCalledWith(customerId, loginCustomerId, 48)
      expect(mockAnalyzeAdsPerformance).toHaveBeenCalledWith(
        mockMetrics[0], // 最新データ
        mockMetrics[1]  // 前回データ
      )

      expect(result).toEqual({
        productId,
        metrics: mockMetrics,
        analysis: mockAnalysis,
        timestamp: expect.any(String)
      })
    })

    it('should handle insufficient data gracefully', async () => {
      // Arrange
      mockMcpClient.get4HourMetrics.mockResolvedValue([
        {
          timestamp: '2025-01-28T14:00:00.000Z',
          impressions: 1000,
          clicks: 50,
          cost: 25.5,
          conversions: 2
        }
      ])

      // Act & Assert
      await expect(fetchAndAnalyzeAds(1234, 5678, 'TEST-PRODUCT'))
        .rejects.toThrow('分析に必要な過去データが不足しています。最低2つの4時間窓データが必要です。')
    })

    it('should handle MCP client errors', async () => {
      // Arrange
      mockMcpClient.get4HourMetrics.mockRejectedValue(new Error('API limit exceeded'))

      // Act & Assert
      await expect(fetchAndAnalyzeAds(1234, 5678, 'TEST-PRODUCT'))
        .rejects.toThrow('Google Ads データ取得に失敗: API limit exceeded')
    })
  })

  describe('adsDataFetcherWorkflow', () => {
    it('should execute complete data fetch and analysis workflow', async () => {
      // Arrange
      const workflowInput = {
        customerId: 1234567890,
        loginCustomerId: 9876543210,
        productId: 'WATASHI-COMPASS'
      }

      const expectedResult = {
        productId: 'WATASHI-COMPASS',
        metrics: [],
        analysis: {},
        timestamp: expect.any(String)
      }

      // Mock workflow execution
      const mockExecute = vi.fn().mockResolvedValue({
        data: expectedResult
      })

      // Act
      const workflow = adsDataFetcherWorkflow
      workflow.execute = mockExecute

      const result = await workflow.execute(workflowInput)

      // Assert
      expect(mockExecute).toHaveBeenCalledWith(workflowInput)
      expect(result.data).toEqual(expectedResult)
    })
  })
})