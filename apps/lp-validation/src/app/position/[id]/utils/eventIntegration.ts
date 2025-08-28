// Google Ads実績をイベントログに統合するためのユーティリティ

export interface EventLog {
  time: string
  type: 'event' | 'ads'
  cvr?: number
  sessions?: number
  cpl?: number
  optimization: string
  ai: string
  // Google Ads specific
  impressions?: number
  clicks?: number
  cost?: number
  conversions?: number
  // Event specific
  originalIndex?: number
}

export interface AdsData {
  date: string
  impressions: number
  clicks: number
  cost: number
  conversions: number
}

// ベタ書きでGoogle Ads実績をイベント形式に変換
export function formatGoogleAdsEvent(ads: AdsData): EventLog {
  const ctr = ads.impressions > 0 ? ((ads.clicks / ads.impressions) * 100).toFixed(1) : '0.0'
  const cpc = ads.clicks > 0 ? Math.round(ads.cost / ads.clicks) : 0
  const cvr = ads.clicks > 0 ? ((ads.conversions / ads.clicks) * 100).toFixed(1) : '0.0'
  
  return {
    time: ads.date,
    type: 'ads',
    impressions: ads.impressions,
    clicks: ads.clicks, 
    cost: ads.cost,
    conversions: ads.conversions,
    optimization: `Imp: ${ads.impressions.toLocaleString()} | Clk: ${ads.clicks} (CTR ${ctr}%) | Cost: ¥${ads.cost.toLocaleString()} (CPC ¥${cpc}) | CV: ${ads.conversions}`,
    ai: `Google Ads実績 - CVR ${cvr}%、4時間での広告パフォーマンス`
  }
}

// ベタ書きでイベントログとGoogle Ads実績を時系列マージ
export function mergeEventsAndAds(events: any[], adsData: AdsData[]): EventLog[] {
  const eventLogs = events.map((e, index) => ({
    time: e.time,
    type: 'event' as const,
    cvr: 0,
    sessions: 0, 
    cpl: 0,
    optimization: e.summary || `フェーズ${e.phase} 進捗 ${e.progress}%`,
    ai: e.nextActions?.join(' / ') || `状態: ${e.status}`,
    originalIndex: index // 元のインデックスを保持
  }))
  
  const adsLogs = adsData.map(formatGoogleAdsEvent)
  
  const allLogs = [...eventLogs, ...adsLogs]
  
  // ベタ書きで時系列ソート
  allLogs.sort((a, b) => {
    const timeA = new Date(a.time).getTime()
    const timeB = new Date(b.time).getTime()
    return timeA - timeB
  })
  
  return allLogs
}