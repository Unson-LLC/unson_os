// LP検証システム - ポジション詳細
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, TrendingUp, TrendingDown, BarChart3, Clock, RefreshCw, 
  Calendar, Users, Target, AlertTriangle, Brain, ChevronDown, 
  ExternalLink, Sparkles, Activity, Minus
} from 'lucide-react';
import { mergeEventsAndAds } from './utils/eventIntegration';

export default function PositionDetailPage() {
  const params = useParams();
  const [activeTimeRange, setActiveTimeRange] = useState('4h');
  const positionId = params.id as string
  const [positionData, setPositionData] = useState<any>({})
  const [logs, setLogs] = useState<any[]>([])
  const [ads, setAds] = useState<any[]>([])
  const [isClient, setIsClient] = useState(false)
  
  // クライアントサイドでのみHydrationを完了
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // 予測メトリクスを時系列データに変換するヘルパー関数
  const generateMockTimeSeries = (metrics: any, timeRange: string) => {
    const periods = timeRange === '4h' ? 6 : timeRange === '1d' ? 4 : timeRange === '1w' ? 5 : 6
    const data = []
    
    for (let i = 0; i < periods; i++) {
      const baseDate = new Date()
      let dateStr = ''
      let timeWindow = ''
      
      if (timeRange === '4h') {
        const hoursAgo = i * 4
        baseDate.setHours(baseDate.getHours() - hoursAgo)
        const hour = baseDate.getHours()
        timeWindow = `${hour}:00-${(hour + 4) % 24}:00`
        dateStr = baseDate.toLocaleDateString('ja-JP')
      } else if (timeRange === '1d') {
        baseDate.setDate(baseDate.getDate() - i)
        dateStr = baseDate.toLocaleDateString('ja-JP')
      } else {
        baseDate.setDate(baseDate.getDate() - (i * 7))
        const endDate = new Date(baseDate)
        endDate.setDate(endDate.getDate() + 6)
        dateStr = `${baseDate.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}~${endDate.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}`
      }
      
      // メトリクスを時系列に分散（ランダム要素を追加）
      const variance = 0.3 + Math.random() * 0.4 // 30-70%の幅
      const impressions = Math.floor(metrics.impressions * variance / periods)
      const clicks = Math.floor(metrics.clicks * variance / periods)
      const cost = Math.floor(metrics.cost * variance / periods)
      const conversions = Math.floor(metrics.conversions * variance / periods)
      
      data.unshift({
        date: baseDate.toISOString(),
        dateStr,
        timeWindow,
        impressions,
        clicks,
        cost,
        conversions,
        ctr: impressions > 0 ? Math.round((clicks / impressions) * 1000) / 10 : 0,
        cvr: clicks > 0 ? Math.round((conversions / clicks) * 1000) / 10 : 0,
        cpc: clicks > 0 ? Math.round(cost / clicks) : 0,
        isRealData: false // 予測データフラグ
      })
    }
    
    return data
  }
  
  // Google Adsデータを時間範囲に応じて取得
  const loadAdsData = async (timeRange: string) => {
    // プロダクトIDに基づくデータ取得戦略
    let realDataEndpoint: string
    
    if (positionId === 'watashi-compass') {
      // わたしコンパスの場合: 実データAPIを使用
      realDataEndpoint = `/api/real-ads-data?timeRange=${timeRange}`
    } else {
      // その他のプロダクト: 全サービスAPIから該当プロダクトのデータを取得
      realDataEndpoint = `/api/all-services-ads?timeRange=${timeRange}&productId=${positionId}`
    }
    const fallbackEndpoints = {
      '4h': '/api/test-ads-4h-data',
      '1d': '/api/test-ads-daily-data', 
      '1w': '/api/test-ads-weekly-data'
    }
    
    try {
      // Step 1: 実際のGoogle Ads APIを試行
      console.log(`実際のGoogle Ads API (${timeRange}) 試行中...`)
      const realRes = await fetch(realDataEndpoint, { cache: 'no-store' })
      
      if (realRes.ok) {
        const realData = await realRes.json()
        console.log(`実際のGoogle Ads API (${timeRange}) レスポンス:`, realData)
        
        // わたしコンパスの場合は既存のレスポンス形式
        if (positionId === 'watashi-compass' && realData.success && Array.isArray(realData.data.records)) {
          console.log(`実際のGoogle Adsデータ取得成功 (${timeRange}):`, realData.data.records.length, '件')
          const transformedAds = realData.data.records.map((record: any) => ({
            date: record.date,
            dateStr: record.dateStr,
            timeWindow: record.timeWindow, // 4時間データのみ
            impressions: record.impressions,
            clicks: record.clicks,
            cost: record.cost,
            conversions: record.conversions,
            ctr: record.ctr,
            cvr: record.cvr,
            cpc: record.cpc,
            isRealData: true
          }))
          setAds(transformedAds)
          return // 成功時は早期リターン
        }
        // その他のプロダクトの場合は全サービスAPIのレスポンス形式
        else if (positionId !== 'watashi-compass' && realData.success && Array.isArray(realData.services)) {
          const serviceData = realData.services.find((s: any) => s.productId === positionId)
          if (serviceData) {
            console.log(`${positionId} データ取得成功:`, serviceData)
            // 予測データを時系列形式に変換
            const mockTimeSeriesData = generateMockTimeSeries(serviceData.metrics, timeRange)
            setAds(mockTimeSeriesData)
            return
          }
        }
      }
      
      // Step 2: 実API失敗時はサンプルデータにフォールバック
      console.warn(`実際のGoogle Ads API失敗、サンプルデータにフォールバック (${timeRange})`)
      const fallbackEndpoint = fallbackEndpoints[timeRange as keyof typeof fallbackEndpoints] || fallbackEndpoints['4h']
      const fallbackRes = await fetch(fallbackEndpoint, { cache: 'no-store' })
      
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json()
        console.log(`サンプルGoogle Ads API (${timeRange}) Data:`, fallbackData)
        if (fallbackData.success && Array.isArray(fallbackData.data.records)) {
          console.log(`サンプルデータ取得成功 (${timeRange}):`, fallbackData.data.records.length, '件')
          const transformedAds = fallbackData.data.records.map((record: any) => ({
            date: record.date,
            dateStr: record.dateStr,
            timeWindow: record.timeWindow,
            impressions: record.impressions,
            clicks: record.clicks,
            cost: record.cost,
            conversions: record.conversions,
            ctr: record.ctr,
            cvr: record.cvr,
            cpc: record.cpc,
            isRealData: false
          }))
          setAds(transformedAds)
        }
      } else {
        console.error(`サンプルGoogle Ads API (${timeRange}) failed:`, fallbackRes.statusText)
      }
    } catch (error) {
      console.error(`Google Ads API (${timeRange}) error:`, error)
    }
  }
  
  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/positions/${positionId}`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        let finalPositionData = data.position
        
        // わたしコンパスの場合はMCP Google Ads実データを取得・優先
        if (positionId === 'watashi-compass') {
          try {
            const adsRes = await fetch('/api/watashi-compass-ads?timeRange=7d&sync=true', { cache: 'no-store' })
            if (adsRes.ok) {
              const adsData = await adsRes.json()
              console.log('詳細ページMCP Google Ads データ:', adsData)
              
              const ads = adsData.data
              finalPositionData = {
                ...finalPositionData,
                // Google Ads実データを優先使用
                cvr: ads.cvr || 0,
                sessions: ads.totalClicks || 0,
                leads: ads.totalConversions || 0,
                cpl: ads.cpc || 0,
                status: ads.status || 'warning'
              }
              console.log('わたしコンパス実データ統合完了:', finalPositionData)
            }
          } catch (error) {
            console.warn('MCP Google Ads取得エラー:', error)
          }
        }
        
        const cplNum = Number(String(finalPositionData?.cpl || 0).replace(/[^0-9]/g, ''))
        setPositionData({
          name: finalPositionData?.name || positionId,
          cvr: finalPositionData?.cvr || 0,
          cvrPrevious: finalPositionData?.cvr || 0,
          cpl: cplNum,
          leads: finalPositionData?.leads || 0,
          sessions: finalPositionData?.sessions || 0,
          grade: finalPositionData?.grade || '',
          gradeNote: '',
          aiRecommendation: finalPositionData?.performance || '',
          status: finalPositionData?.status || 'active',
          trend: (finalPositionData?.cvr || 0) >= 10 ? 'up' : 'down',
        })
      }
      // executions
      const ex = await fetch(`/api/positions/${positionId}/executions`, { cache: 'no-store' })
      if (ex.ok) {
        const data = await ex.json()
        console.log('Executions data:', data.executions)
        setLogs(data.executions || [])
      } else {
        console.error('Executions API failed:', ex.statusText)
      }
      
      // 初期時間範囲のGoogle Adsデータを取得
      await loadAdsData(activeTimeRange)
    }
    load()
  }, [positionId, activeTimeRange])
  
  // 時間範囲変更時にGoogle Adsデータを再読み込み
  useEffect(() => {
    loadAdsData(activeTimeRange)
  }, [activeTimeRange])
  
  // イベントログとGoogle Ads実績を統合
  console.log('Merging logs:', logs.length, 'ads:', ads.length)
  const actionLogs = mergeEventsAndAds(logs, ads)
  console.log('Merged action logs:', actionLogs.length, actionLogs)

  // Google Adsデータから実際の指標を計算
  const adsMetrics = ads.reduce((acc, ad) => ({
    totalImpressions: acc.totalImpressions + (ad.impressions || 0),
    totalClicks: acc.totalClicks + (ad.clicks || 0),
    totalCost: acc.totalCost + (ad.cost || 0),
    totalConversions: acc.totalConversions + (ad.conversions || 0)
  }), { totalImpressions: 0, totalClicks: 0, totalCost: 0, totalConversions: 0 })

  // 計算された指標 - Google Ads実データを優先して使用
  const totalSessions = adsMetrics.totalClicks || positionData.sessions || 0
  const totalLeads = adsMetrics.totalConversions || positionData.leads || 0
  const actualCVR = totalSessions > 0 ? Math.round((totalLeads / totalSessions) * 1000) / 10 : 0
  
  // CPC/CPA (Google Adsデータから算出)
  const actualCPL = totalSessions > 0 ? Math.round(adsMetrics.totalCost / totalSessions) : 0
  
  const actualCTR = adsMetrics.totalImpressions > 0 ? Math.round((adsMetrics.totalClicks / adsMetrics.totalImpressions) * 1000) / 10 : 0
  const convPct = actualCVR
  
  // 品質評価の計算
  const getQualityGrade = (ctr: number, cvr: number, cpc: number): {grade: string, score: number, note: string} => {
    let score = 0
    let notes = []
    
    // CTR評価（業界平均2-5%）
    if (ctr >= 4.0) {
      score += 40
      notes.push('CTR優秀')
    } else if (ctr >= 2.0) {
      score += 25
      notes.push('CTR良好')
    } else if (ctr >= 1.0) {
      score += 15
      notes.push('CTR平均以下')
    } else {
      score += 5
      notes.push('CTR要改善')
    }
    
    // CVR評価（目標1%以上）- 十分なトラフィックでのCVR 0%は致命的
    if (cvr >= 3.0) {
      score += 30
      notes.push('CVR優秀')
    } else if (cvr >= 1.0) {
      score += 20
      notes.push('CVR良好')
    } else if (cvr >= 0.5) {
      score += 10
      notes.push('CVR平均')
    } else if (cvr === 0) {
      // CVR 0%の場合、トラフィック量に応じて厳しく減点
      const hasTraffic = actualCTR > 0 // クリックがあることを示す
      if (hasTraffic) {
        score -= 60 // 致命的減点：トラフィックがあるのにコンバージョンなし
        notes.push('CVR致命的課題')
      } else {
        score += 0
        notes.push('CVR要改善')
      }
    } else {
      score += 0
      notes.push('CVR要改善')
    }
    
    // CPC評価（業界により異なるが、100円以下を良好とする）
    if (cpc <= 30) {
      score += 30
      notes.push('CPC優秀')
    } else if (cpc <= 50) {
      score += 20
      notes.push('CPC良好')  
    } else if (cpc <= 100) {
      score += 15
      notes.push('CPC平均')
    } else {
      score += 5
      notes.push('CPC高め')
    }
    
    // グレード判定
    let grade = 'D'
    if (score >= 85) grade = 'A+'
    else if (score >= 75) grade = 'A'
    else if (score >= 65) grade = 'B+'
    else if (score >= 55) grade = 'B'
    else if (score >= 45) grade = 'C+'
    else if (score >= 35) grade = 'C'
    else if (score >= 25) grade = 'D+'
    
    return {
      grade,
      score,
      note: notes.join('、')
    }
  }
  
  const qualityEvaluation = getQualityGrade(actualCTR, actualCVR, actualCPL)

  // 脱落ポイントの動的計算
  const calculateDropOffPoints = () => {
    const totalImpressions = adsMetrics.totalImpressions
    const totalClicks = adsMetrics.totalClicks  
    const totalConversions = adsMetrics.totalConversions
    
    if (totalImpressions === 0) {
      return [
        { stage: '価値提案セクション', count: 0, percentage: 0 },
        { stage: 'フォーム入力画面', count: 0, percentage: 0 }
      ]
    }
    
    // 1. 表示からクリックまでの脱落 (CTRの逆)
    const impressionDropOff = totalImpressions - totalClicks
    const impressionDropOffRate = totalImpressions > 0 ? (impressionDropOff / totalImpressions * 100) : 0
    
    // 2. クリックからコンバージョンまでの脱落 (CVRの逆)  
    const clickDropOff = totalClicks - totalConversions
    const clickDropOffRate = totalClicks > 0 ? (clickDropOff / totalClicks * 100) : 0
    
    return [
      { 
        stage: '価値提案セクション', 
        count: impressionDropOff, 
        percentage: Math.round(impressionDropOffRate * 10) / 10 
      },
      { 
        stage: 'フォーム入力画面', 
        count: clickDropOff, 
        percentage: Math.round(clickDropOffRate * 10) / 10 
      }
    ]
  }
  
  const dropOffPoints = calculateDropOffPoints()

  console.log('計算された指標:', {
    totalSessions,
    totalLeads,
    totalCost: adsMetrics.totalCost,
    actualCVR,
    actualCPL,
    actualCTR,
    dropOffPoints,
    rawData: adsMetrics
  })

  // 動的ステータス計算
  const calculateDynamicStatus = () => {
    // トレンド: CTRとCVRの組み合わせで判定
    let trend = 'down'
    if (actualCTR >= 4.0) trend = 'up'        // CTR優秀なら上昇
    else if (actualCTR >= 2.0) trend = 'stable' // CTR良好なら安定
    // それ以外（CTR 2%未満）は下降
    
    // ステータス: パフォーマンスに基づいて判定
    let status = 'inactive'
    if (qualityEvaluation.grade.includes('A')) status = 'active'
    else if (qualityEvaluation.grade.includes('B')) status = 'warning' 
    else if (qualityEvaluation.grade.includes('C')) status = 'paused'
    
    // 最終更新: 最新のGoogle Adsデータから取得
    const latestDataDate = ads.length > 0 ? 
      new Date(ads[0].date).toLocaleDateString('ja-JP') : 
      new Date().toLocaleDateString('ja-JP')
    
    return { trend, status, lastUpdate: latestDataDate }
  }
  
  const dynamicStatus = calculateDynamicStatus()

  // positionDataの値をGoogle Adsデータで上書き
  const calculatedPositionData = {
    ...positionData,
    cvr: actualCVR,
    cpl: actualCPL,
    leads: totalLeads,
    sessions: totalSessions,
    trend: dynamicStatus.trend,
    status: dynamicStatus.status,
    grade: qualityEvaluation.grade,
    gradeNote: qualityEvaluation.note,
    ctr: actualCTR,
    lastUpdate: dynamicStatus.lastUpdate
  }
  const userFlow = [
    { stage: '流入', count: totalSessions, percentage: 100, change: null, changePercentage: null },
    { stage: 'フォーム', count: totalLeads, percentage: convPct, change: null, changePercentage: null, isConversion: true },
  ]

  const performanceSummary = [
    { title: '現在のCVR', value: `${calculatedPositionData.cvr || 0}%`, color: 'text-green-600', bgColor: 'bg-green-50' },
    { title: '現在のCTR', value: `${calculatedPositionData.ctr || 0}%`, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { title: '累計セッション', value: String(totalSessions), color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { title: '累計リード', value: String(totalLeads), color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { title: 'CPC(実績)', value: `¥${calculatedPositionData.cpl || 0}`, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'danger': return 'bg-rose-500';
      default: return 'bg-gray-500';
    }
  };

  const getGradeStyle = (grade: string) => {
    switch(grade) {
      case 'A+': return 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200';
      case 'A': return 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200';
      case 'B': return 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200';
      case 'D': return 'bg-gradient-to-r from-rose-50 to-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Hydrationエラーを防ぐため、クライアントサイドでのみレンダリング
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:border-gray-300 text-gray-700 flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  ダッシュボード
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {positionData.name} ポジション詳細
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  個別ポジション分析・時系列管理
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 border border-gray-200 rounded-lg hover:border-gray-300">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* ポジション概要 */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="bg-gray-50 border-b border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
                <BarChart3 className="w-3 h-3 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                ポジション概要
              </h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              {/* CVR */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">CVR</span>
                </div>
                <div className="text-3xl font-bold text-green-600">{calculatedPositionData.cvr}%</div>
                <div className="text-xs text-gray-500">前日比: {positionData.cvrPrevious}%</div>
              </div>

              {/* CTR */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">CTR</span>
                </div>
                <div className="text-3xl font-bold text-indigo-600">{calculatedPositionData.ctr}%</div>
                <div className="text-xs text-gray-500">クリック率</div>
              </div>

              {/* CPC(実績) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">CPC(実績)</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">¥{calculatedPositionData.cpl}</div>
                <div className="text-xs text-gray-500">コスト良好</div>
              </div>

              {/* リード数 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">リード数</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{calculatedPositionData.leads}</div>
                <div className="text-xs text-gray-500">累計リード数</div>
              </div>

              {/* 品質 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">品質</span>
                </div>
                <div className="text-3xl font-bold text-blue-600">{calculatedPositionData.grade}</div>
                <div className="text-xs text-gray-500">{calculatedPositionData.gradeNote}</div>
              </div>
            </div>

            {/* AI分析 */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mt-1">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-blue-900 mb-1">AI分析</div>
                  <div className="text-sm text-blue-800">{positionData.aiRecommendation}</div>
                </div>
              </div>
            </div>

            {/* ステータス情報 */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">トレンド</div>
                <div className="flex items-center justify-center text-green-600 font-medium">
                  {calculatedPositionData.trend === 'up' ? (
                    <>
                      <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
                      <span className="text-green-600">上昇↑</span>
                    </>
                  ) : calculatedPositionData.trend === 'stable' ? (
                    <>
                      <Minus className="w-4 h-4 mr-1 text-blue-600" />
                      <span className="text-blue-600">安定→</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="w-4 h-4 mr-1 text-red-600" />
                      <span className="text-red-600">下降↓</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">ステータス</div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  calculatedPositionData.status === 'active' ? 'bg-green-100 text-green-800 border-green-200' :
                  calculatedPositionData.status === 'warning' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                  'bg-red-100 text-red-800 border-red-200'
                } border`}>
                  {calculatedPositionData.status === 'active' ? '稼働中' :
                   calculatedPositionData.status === 'warning' ? '要注意' : '要改善'}
                </span>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">最終更新</div>
                <div className="text-sm font-medium text-gray-900">{calculatedPositionData.lastUpdate}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 時系列イベント分析 */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="bg-gray-50 border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center">
                      <Clock className="w-3 h-3 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      時系列イベント分析
                    </h2>
                  </div>
                  <RefreshCw className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>
              </div>
              <div className="p-6">
                {/* 時間範囲タブ */}
                <div className="flex items-center space-x-2 mb-6">
                  {['4時間', '1日', '1週間'].map((range, index) => {
                    const value = ['4h', '1d', '1w'][index];
                    return (
                      <button
                        key={range}
                        onClick={() => setActiveTimeRange(value)}
                        className={`px-3 py-1.5 text-sm border rounded-lg ${
                          activeTimeRange === value 
                            ? "bg-blue-600 text-white border-blue-600" 
                            : "border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {range}
                      </button>
                    );
                  })}
                </div>

                {/* イベントログ */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <Activity className="w-4 h-4 mr-2 text-blue-600" />
                    {positionData.name}-001 統合イベントログ
                    <BarChart3 className="w-4 h-4 ml-2 text-red-400" />
                    <span className="text-xs text-gray-500 ml-2">Google Ads実績統合済み</span>
                  </h3>
                  
                  {actionLogs.map((log, index) => (
                    <div key={index} className={`border rounded-lg p-4 ${
                      log.type === 'ads' ? 'border-gray-200 bg-gradient-to-r from-gray-50 to-red-50' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            {log.type === 'ads' ? (
                              <BarChart3 className="w-3 h-3 mr-1 text-red-500" />
                            ) : (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {log.time}
                          </div>
                          {log.type === 'ads' && (
                            <>
                              <div className="text-red-600 font-medium">Google Ads</div>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div>📊 {log.impressions?.toLocaleString()}表示</div>
                                <div>👆 {log.clicks}クリック</div>
                                <div>💰 ¥{log.cost?.toLocaleString()}</div>
                                <div className={`font-medium ${
                                  log.conversions > 0 ? 'text-green-700' : 'text-gray-500'
                                }`}>
                                  🎯 {log.conversions}件成約
                                </div>
                              </div>
                            </>
                          )}
                          {log.type === 'event' && (
                            <>
                              <div className="text-green-600 font-medium">CVR: {calculatedPositionData.cvr}%</div>
                              <div className="text-indigo-600 font-medium">CTR: {calculatedPositionData.ctr}%</div>
                              <div className="text-gray-600">セッション: {calculatedPositionData.sessions}</div>
                              <div className="text-gray-600">CPC: ¥{calculatedPositionData.cpl}</div>
                            </>
                          )}
                        </div>
                        {log.type === 'ads' && (
                          <Link href={`/ads-event/${log.time}`}>
                            <button className="px-3 py-1 text-sm bg-red-50 text-red-700 hover:bg-red-100 rounded-full flex items-center font-medium">
                              AI分析詳細
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </button>
                          </Link>
                        )}
                        {log.type === 'event' && (
                          <Link href={`/event/${(log.originalIndex ?? 0) + 1}`}>
                            <button 
                              className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center"
                              onClick={() => console.log('Event link clicked:', `/event/${(log.originalIndex ?? 0) + 1}`)}
                            >
                              詳細
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </button>
                          </Link>
                        )}
                      </div>
                      <div className="text-sm text-gray-800 mb-1">{log.optimization}</div>
                      <div className="flex items-start text-sm text-blue-700">
                        <Brain className="w-3 h-3 mr-1 mt-0.5 text-blue-600" />
                        {log.ai}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* ユーザー行動フロー */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="bg-gray-50 border-b border-gray-200 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
                    <Users className="w-3 h-3 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    ユーザー行動フロー（本日）
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mt-1">エントリー → 興味 → 検討 → アクション</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {userFlow.map((stage, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-900">{stage.stage}</div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">{stage.count.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">{stage.percentage}%</div>
                        </div>
                      </div>
                      {stage.change !== null && (
                        <div className="flex items-center text-sm text-red-600">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          {stage.change} (前回比{stage.changePercentage}%)
                        </div>
                      )}
                      {index < userFlow.length - 1 && (
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-3">
                          <div 
                            className={`h-1 rounded-full ${stage.isConversion ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${stage.percentage}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* フロー分析インサイト */}
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium text-yellow-800 mb-1">主要脱落ポイント</div>
                      <div className="text-yellow-700">
                        1. {dropOffPoints[0].stage} ({dropOffPoints[0].count?.toLocaleString()}人/{dropOffPoints[0].percentage}%)<br />
                        2. {dropOffPoints[1].stage} ({dropOffPoints[1].count?.toLocaleString()}人/{dropOffPoints[1].percentage}%)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* パフォーマンスサマリー */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="bg-gray-50 border-b border-gray-200 p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-md flex items-center justify-center">
                    <Target className="w-3 h-3 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    パフォーマンスサマリー
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {performanceSummary.map((metric, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-lg border ${metric.bgColor} border-gray-200`}
                    >
                      <div className="text-sm text-gray-600 mb-1">{metric.title}</div>
                      <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
