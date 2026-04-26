// Google Ads実績をイベントログに統合するためのユーティリティ

export interface EventLog {
  time: string
  sortTime?: string // ソート用のISO日時文字列
  type: 'event' | 'ads'
  cvr?: number
  sessions?: number
  cpl?: number
  ctr?: number
  cpc?: number
  ctrRating?: 'good' | 'average' | 'poor'
  cvrRating?: 'good' | 'average' | 'poor'
  performanceEmoji?: string
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
  dateStr?: string
  timeWindow?: string
  impressions: number
  clicks: number
  cost: number
  conversions: number
  ctr?: number
  cvr?: number
  cpc?: number
  isRealData?: boolean // 実際のGoogle Adsデータかどうか
}

// ベタ書きでGoogle Ads実績をイベント形式に変換
export function formatGoogleAdsEvent(ads: AdsData): EventLog {
  // null安全性チェック
  const impressions = ads?.impressions ?? 0
  const clicks = ads?.clicks ?? 0
  const cost = ads?.cost ?? 0
  const conversions = ads?.conversions ?? 0
  const date = ads?.date ?? new Date().toISOString().split('T')[0]
  
  const ctr = ads.ctr !== undefined ? ads.ctr.toString() : (impressions > 0 ? ((clicks / impressions) * 100).toFixed(1) : '0.0')
  const cpc = ads.cpc !== undefined ? ads.cpc : (clicks > 0 ? Math.round(cost / clicks) : 0)
  const cvr = ads.cvr !== undefined ? ads.cvr.toString() : (clicks > 0 ? ((conversions / clicks) * 100).toFixed(1) : '0.0')
  
  // パフォーマンス評価（ユーザー視点の改善）
  const ctrRating = parseFloat(ctr) >= 3.0 ? 'good' : parseFloat(ctr) >= 1.5 ? 'average' : 'poor'
  const cvrRating = parseFloat(cvr) >= 8.0 ? 'good' : parseFloat(cvr) >= 4.0 ? 'average' : 'poor'
  const performanceEmoji = cvrRating === 'good' ? '🎯' : cvrRating === 'average' ? '📊' : '⚠️'
  
  // 時刻表示（4時間間隔は短縮形、それ以外はそのまま）
  const displayTime = ads.timeWindow ? `${ads.dateStr} ${ads.timeWindow.split(':')[0]}h~` : ads.dateStr || date
  
  return {
    time: displayTime,
    sortTime: date, // ソート用に元のISO日時を保持
    type: 'ads',
    impressions,
    clicks, 
    cost,
    conversions,
    ctr: parseFloat(ctr),
    cvr: parseFloat(cvr),
    cpc,
    ctrRating,
    cvrRating,
    performanceEmoji,
    // 重複を避けてシンプルに（実データかサンプルかを表示）
    optimization: ads.isRealData ? `Ads実績` : `Ads実績（サンプル）`,
    ai: `CVR ${cvr}% CTR ${ctr}% ${cvrRating === 'good' ? '好調🎯' : cvrRating === 'poor' ? '要改善⚠️' : '普通📊'}${ads.isRealData ? '' : ' ※サンプルデータ'}`
  }
}

// ベタ書きでイベントログとGoogle Ads実績を時系列マージ
export function mergeEventsAndAds(events: any[], adsData: AdsData[]): EventLog[] {
  const eventLogs: EventLog[] = events.map((e, index) => ({
    time: e.time,
    sortTime: e.sortTime || e.timestamp || e.time,
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
  
  // ベタ書きで時系列ソート（新しい順）
  allLogs.sort((a, b) => {
    const timeA = new Date(a.sortTime || a.time).getTime()
    const timeB = new Date(b.sortTime || b.time).getTime()
    return timeB - timeA // 降順に変更（新しい→古い）
  })
  
  return allLogs
}
