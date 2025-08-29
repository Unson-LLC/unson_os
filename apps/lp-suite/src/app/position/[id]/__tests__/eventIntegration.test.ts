import { describe, it, expect } from '@jest/globals'
import { mergeEventsAndAds, formatGoogleAdsEvent } from '../utils/eventIntegration'

describe('Google Ads Event Integration', () => {
  it('should merge events and Google Ads data chronologically', () => {
    const events = [
      { time: '2025-08-28 10:30', phase: 1, progress: 50, status: 'running' },
      { time: '2025-08-28 18:15', phase: 2, progress: 75, status: 'completed' }
    ]
    
    const adsData = [
      { date: '2025-08-28 20:00', impressions: 1860, clicks: 81, cost: 3033, conversions: 4 },
      { date: '2025-08-28 16:00', impressions: 2230, clicks: 105, cost: 3977, conversions: 6 },
      { date: '2025-08-28 12:00', impressions: 2115, clicks: 99, cost: 3735, conversions: 5 }
    ]
    
    const merged = mergeEventsAndAds(events, adsData)
    
    expect(merged).toHaveLength(5) // 2 events + 3 ads
    expect(merged[0].type).toBe('event')
    expect(merged[1].type).toBe('ads')
    expect(merged[1].time).toBe('2025-08-28 12:00')
    expect(merged[4].time).toBe('2025-08-28 20:00')
  })
  
  it('should format Google Ads data as event with performance metrics', () => {
    const adsData = { date: '2025-08-28 16:00', impressions: 2230, clicks: 105, cost: 3977, conversions: 6 }
    
    const formatted = formatGoogleAdsEvent(adsData)
    
    expect(formatted.type).toBe('ads')
    expect(formatted.time).toBe('2025-08-28 16:00')
    expect(formatted.optimization).toContain('Imp: 2,230')
    expect(formatted.optimization).toContain('CTR: 4.7%')
    expect(formatted.optimization).toContain('CPC: ¥38')
    expect(formatted.ai).toContain('Google Ads実績')
  })
  
  it('should calculate performance trends between ad windows', () => {
    const current = { impressions: 2230, clicks: 105, conversions: 6 }
    const previous = { impressions: 2115, clicks: 99, conversions: 5 }
    
    const trend = calculateAdsTrend(current, previous)
    
    expect(trend.impressions).toBe('+5.4%')
    expect(trend.clicks).toBe('+6.1%') 
    expect(trend.conversions).toBe('+20.0%')
  })
})