// Google Ads MCP クライアントのテスト（t_wada式TDD - REDフェーズ）
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GoogleAdsMcpClient } from '../google-ads-mcp-client'

// MCPモック
const mockMcpClient = {
  execute: vi.fn()
}

vi.mock('../../config', () => ({
  mastraConfig: {
    mcp: {
      googleads: mockMcpClient
    }
  }
}))

describe('GoogleAdsMcpClient', () => {
  let client: GoogleAdsMcpClient
  
  beforeEach(() => {
    vi.clearAllMocks()
    client = new GoogleAdsMcpClient()
  })

  describe('get4HourMetrics', () => {
    it('should fetch 4-hour window metrics using GAQL query', async () => {
      // Arrange
      const customerId = 1234567890
      const loginCustomerId = 9876543210
      const expectedQuery = `
        SELECT 
          segments.hour_of_day,
          segments.date,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions
        FROM campaign_performance_report 
        WHERE segments.date >= '2025-01-27' AND segments.date <= '2025-01-28'
        ORDER BY segments.date DESC, segments.hour_of_day DESC
        LIMIT 48
      `
      
      const mockResponse = {
        results: [
          {
            segments: { date: '2025-01-28', hour_of_day: 14 },
            metrics: { impressions: 1000, clicks: 50, cost_micros: 500000, conversions: 2 }
          }
        ]
      }

      mockMcpClient.execute.mockResolvedValue(mockResponse)

      // Act
      const result = await client.get4HourMetrics(customerId, loginCustomerId, 48)

      // Assert
      expect(mockMcpClient.execute).toHaveBeenCalledWith('mcp__googleads__execute-gaql-query', {
        customerId,
        loginCustomerId,
        query: expect.stringContaining('segments.hour_of_day'),
        reportAggregation: 'HOURLY'
      })

      expect(result).toEqual([{
        timestamp: '2025-01-28T14:00:00.000Z',
        impressions: 1000,
        clicks: 50,
        cost: 0.5, // cost_micros / 1,000,000
        conversions: 2
      }])
    })

    it('should handle empty results gracefully', async () => {
      // Arrange
      mockMcpClient.execute.mockResolvedValue({ results: [] })

      // Act
      const result = await client.get4HourMetrics(1234, 5678, 24)

      // Assert
      expect(result).toEqual([])
    })

    it('should handle MCP errors properly', async () => {
      // Arrange
      mockMcpClient.execute.mockRejectedValue(new Error('Google Ads API error'))

      // Act & Assert
      await expect(client.get4HourMetrics(1234, 5678, 24))
        .rejects.toThrow('Google Ads MCP query failed: Google Ads API error')
    })
  })

  describe('getCurrentCampaigns', () => {
    it('should fetch active campaigns', async () => {
      // Arrange
      const mockResponse = {
        results: [
          {
            campaign: { id: '123', name: 'Test Campaign', status: 'ENABLED' },
            metrics: { impressions: 5000, clicks: 250 }
          }
        ]
      }
      
      mockMcpClient.execute.mockResolvedValue(mockResponse)

      // Act
      const result = await client.getCurrentCampaigns(1234, 5678)

      // Assert
      expect(mockMcpClient.execute).toHaveBeenCalledWith('mcp__googleads__execute-gaql-query', {
        customerId: 1234,
        loginCustomerId: 5678,
        query: expect.stringContaining('campaign.status = \'ENABLED\''),
        reportAggregation: 'CAMPAIGN'
      })

      expect(result).toEqual([{
        id: '123',
        name: 'Test Campaign',
        status: 'ENABLED',
        impressions: 5000,
        clicks: 250
      }])
    })
  })

  describe('getKeywordPerformance', () => {
    it('should fetch keyword performance data', async () => {
      // Arrange
      const mockResponse = {
        results: [
          {
            ad_group_criterion: { keyword: { text: 'test keyword' } },
            metrics: { impressions: 100, clicks: 5, cost_micros: 50000 }
          }
        ]
      }
      
      mockMcpClient.execute.mockResolvedValue(mockResponse)

      // Act
      const result = await client.getKeywordPerformance(1234, 5678, '456')

      // Assert
      expect(mockMcpClient.execute).toHaveBeenCalledWith('mcp__googleads__execute-gaql-query', {
        customerId: 1234,
        loginCustomerId: 5678,
        query: expect.stringContaining('campaign.id = \'456\''),
        reportAggregation: 'KEYWORD'
      })

      expect(result).toEqual([{
        keyword: 'test keyword',
        impressions: 100,
        clicks: 5,
        cost: 0.05,
        ctr: 5.0,
        cpc: 0.01
      }])
    })
  })
})