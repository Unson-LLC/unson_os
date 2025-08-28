import { describe, it, expect } from '@jest/globals'
import { analyzeAdsPerformance, generateOptimizationActions, executeOptimizations, createOptimizationRecord } from '../utils/aiOptimizer'

describe('Google Ads 4時間窓 AI最適化', () => {
  it('should analyze 4h window performance and detect issues', () => {
    const currentWindow = {
      timestamp: '2025-08-28 16:00',
      impressions: 1200,
      clicks: 30,
      cost: 1500,
      conversions: 2
    }
    
    const previousWindow = {
      timestamp: '2025-08-28 12:00', 
      impressions: 1500,
      clicks: 45,
      cost: 1200,
      conversions: 4
    }
    
    const analysis = analyzeAdsPerformance(currentWindow, previousWindow)
    
    expect(analysis.ctr).toEqual({ current: 2.5, previous: 3.0, change: -16.7 })
    expect(analysis.cvr).toEqual({ current: 6.7, previous: 8.9, change: -24.7 })
    expect(analysis.cpc).toEqual({ current: 50, previous: 26.7, change: 87.3 })
    expect(analysis.issues).toContain('CTR大幅低下')
    expect(analysis.issues).toContain('CVR悪化')
    expect(analysis.issues).toContain('CPC急上昇')
  })
  
  it('should generate optimization actions based on performance issues', () => {
    const performanceIssues = {
      ctr: { current: 2.5, previous: 3.0, change: -16.7 },
      cvr: { current: 6.7, previous: 8.9, change: -24.7 },
      cpc: { current: 50, previous: 26.7, change: 87.3 },
      issues: ['CTR大幅低下', 'CVR悪化', 'CPC急上昇']
    }
    
    const actions = generateOptimizationActions(performanceIssues)
    
    expect(actions).toHaveLength(3)
    expect(actions[0].type).toBe('keyword_pause')
    expect(actions[0].description).toContain('低パフォーマンスキーワード')
    expect(actions[1].type).toBe('bid_adjustment')
    expect(actions[1].description).toContain('入札単価')
    expect(actions[2].type).toBe('ad_test')
    expect(actions[2].description).toContain('広告文A/Bテスト')
  })
  
  it('should execute optimizations via Google Ads API', async () => {
    const optimizations = [
      { type: 'keyword_pause', keywords: ['expensive keyword'], campaignId: '12345' },
      { type: 'bid_adjustment', adjustment: -20, adGroupId: '67890' }
    ]
    
    const results = await executeOptimizations(optimizations)
    
    expect(results).toHaveLength(2)
    expect(results[0].status).toBe('success')
    expect(results[0].message).toContain('キーワード停止完了')
    expect(results[1].status).toBe('success') 
    expect(results[1].message).toContain('入札調整完了')
  })
  
  it('should create optimization execution record', () => {
    const windowData = { timestamp: '2025-08-28 16:00', impressions: 1200 }
    const actions = [{ type: 'keyword_pause', description: 'キーワード停止' }]
    const results = [{ status: 'success', message: '実行完了' }]
    
    const record = createOptimizationRecord(windowData, actions, results)
    
    expect(record.id).toMatch(/^ads-opt-/)
    expect(record.timestamp).toBe('2025-08-28 16:00')
    expect(record.type).toBe('ads_optimization')
    expect(record.status).toBe('completed')
    expect(record.actions).toHaveLength(1)
    expect(record.impact.estimated).toContain('CPC')
  })
})