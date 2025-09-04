// Analytics洞察生成AIエージェント（REFACTOR フェーズ）
import { Agent } from '@mastra/core/agent'
import { openaiModel } from '../config'
import { GA4Metrics } from '../tools/ga4-client'
import { PostHogAnalytics } from '../tools/posthog-client'

export interface AnalyticsInsights {
  keyFindings: string[]
  recommendations: string[]
  performanceScore: number
  riskAlerts: string[]
  opportunityAreas: string[]
}

export interface InsightsContext {
  productId: string
  businessGoals: string[]
  previousPeriodData?: any
  industryBenchmarks?: any
}

export const analyticsInsightsAgent = new Agent({
  name: 'analytics-insights-generator',
  instructions: `
あなたはGoogle Analytics + PostHogデータの洞察生成エキスパートです。
データドリブンな改善提案を行います。

## 分析観点
### パフォーマンス評価
- CVRが目標（10%）を上回っているか
- セッション継続率は適切か
- ファネル各段階の離脱率は許容範囲内か

### ユーザー行動分析  
- 主要な流入チャネルの効果
- デバイス別パフォーマンス差
- ユーザージャーニーのボトルネック特定

### 改善機会の特定
- 高離脱率ポイントの改善提案
- 未活用機能の活性化提案
- コンテンツ最適化ポイント

## 出力形式
- keyFindings: データから読み取れる重要な発見（3-5項目）
- recommendations: 具体的な改善提案（2-3項目）
- performanceScore: 総合スコア（0-100）
- riskAlerts: 注意が必要な指標（あれば）
- opportunityAreas: 成長機会領域
`,
  model: openaiModel,
  tools: {
    analyze_performance_metrics: {
      description: 'GA4とPostHogデータの総合分析',
      parameters: {
        type: 'object',
        properties: {
          ga4Data: { type: 'object' },
          posthogData: { type: 'object' },
          context: { type: 'object' }
        }
      }
    },
    generate_insights: {
      description: '洞察とレコメンデーション生成',
      parameters: {
        type: 'object',
        properties: {
          findings: { type: 'array' },
          recommendations: { type: 'array' },
          score: { type: 'number' }
        }
      }
    }
  }
})

export async function generateAnalyticsInsights(
  ga4Data: GA4Metrics,
  posthogData: PostHogAnalytics,
  context: InsightsContext
): Promise<AnalyticsInsights> {
  
  const prompt = `
以下のアナリティクスデータから洞察を生成してください。

## GA4データ
- セッション数: ${ga4Data.sessions}
- ユーザー数: ${ga4Data.users}
- コンバージョン率: ${ga4Data.conversionRate}%
- 直帰率: ${ga4Data.bounceRate}%
- 平均セッション時間: ${ga4Data.avgSessionDuration}秒

## PostHogデータ
- ファネル変換率: ${posthogData.funnelAnalysis.conversionRates.join(' → ')}%
- 主要機能利用率: ${Object.entries(posthogData.featureUsage).map(([k,v]) => `${k}: ${v}%`).join(', ')}
- リテンション: 1週間後${posthogData.cohortAnalysis.week1 * 100}%, 1ヶ月後${posthogData.cohortAnalysis.week4 * 100}%

## プロダクト情報
- ID: ${context.productId}
- ビジネス目標: ${context.businessGoals.join(', ')}

analyze_performance_metricsとgenerate_insightsツールを使用して、具体的な改善提案を生成してください。
`

  const aiResponse = await analyticsInsightsAgent.generate(prompt)
  
  return parseInsightsFromAI(aiResponse.text, ga4Data, posthogData)
}

function parseInsightsFromAI(
  aiResponse: string,
  ga4Data: GA4Metrics,
  posthogData: PostHogAnalytics
): AnalyticsInsights {
  
  // AIレスポンス解析＋データベース計算
  const performanceScore = calculatePerformanceScore(ga4Data, posthogData)
  const riskAlerts = identifyRiskFactors(ga4Data, posthogData)
  
  return {
    keyFindings: extractKeyFindings(ga4Data, posthogData),
    recommendations: generateRecommendations(ga4Data, posthogData),
    performanceScore,
    riskAlerts,
    opportunityAreas: identifyOpportunities(ga4Data, posthogData)
  }
}

function calculatePerformanceScore(ga4Data: GA4Metrics, posthogData: PostHogAnalytics): number {
  let score = 50 // ベースライン
  
  // CVR評価（30点満点）
  if (ga4Data.conversionRate >= 0.15) score += 30
  else if (ga4Data.conversionRate >= 0.10) score += 20
  else if (ga4Data.conversionRate >= 0.05) score += 10
  
  // 直帰率評価（20点満点）
  if (ga4Data.bounceRate <= 0.3) score += 20
  else if (ga4Data.bounceRate <= 0.5) score += 15
  else if (ga4Data.bounceRate <= 0.7) score += 5
  
  // リテンション評価（20点満点）
  if (posthogData.cohortAnalysis.week4 >= 0.5) score += 20
  else if (posthogData.cohortAnalysis.week4 >= 0.3) score += 15
  else if (posthogData.cohortAnalysis.week4 >= 0.2) score += 10
  
  return Math.min(score, 100)
}

function identifyRiskFactors(ga4Data: GA4Metrics, posthogData: PostHogAnalytics): string[] {
  const risks: string[] = []
  
  if (ga4Data.bounceRate > 0.7) {
    risks.push('直帰率が70%を超えており、ランディングページの改善が急務')
  }
  
  if (posthogData.cohortAnalysis.week1 < 0.5) {
    risks.push('1週間後のリテンション率が50%未満で、オンボーディング強化が必要')
  }
  
  if (ga4Data.conversionRate < 0.05) {
    risks.push('コンバージョン率が5%未満で、ファネル全体の見直しが必要')
  }
  
  return risks
}

function extractKeyFindings(ga4Data: GA4Metrics, posthogData: PostHogAnalytics): string[] {
  const findings: string[] = []
  
  const cvr = ga4Data.conversionRate * 100
  if (cvr >= 10) {
    findings.push(`コンバージョン率が${cvr.toFixed(1)}%で目標（10%）を${(cvr - 10).toFixed(1)}ポイント上回っている`)
  } else {
    findings.push(`コンバージョン率が${cvr.toFixed(1)}%で目標（10%）を${(10 - cvr).toFixed(1)}ポイント下回っている`)
  }
  
  const topTrafficSource = Object.entries(ga4Data.trafficSources)
    .sort(([,a], [,b]) => b - a)[0]
  findings.push(`${topTrafficSource[0]}からの流入が${topTrafficSource[1]}%で最も効果的`)
  
  const funnelDropoff = 100 - posthogData.funnelAnalysis.conversionRates[1]
  findings.push(`サインアップ段階での離脱率が${funnelDropoff}%と${funnelDropoff > 75 ? '高い' : '標準的'}`)
  
  return findings.slice(0, 5)
}

function generateRecommendations(ga4Data: GA4Metrics, posthogData: PostHogAnalytics): string[] {
  const recommendations: string[] = []
  
  if (ga4Data.bounceRate > 0.5) {
    recommendations.push('ランディングページの読み込み速度最適化とファーストビューの改善')
  }
  
  const paymentConversion = posthogData.funnelAnalysis.conversionRates[2]
  if (paymentConversion < 50) {
    recommendations.push('決済フローの簡素化と信頼性向上施策の実装')
  }
  
  const lowUsageFeatures = Object.entries(posthogData.featureUsage)
    .filter(([, usage]) => usage < 30)
    .map(([feature]) => feature)
  
  if (lowUsageFeatures.length > 0) {
    recommendations.push(`未活用機能（${lowUsageFeatures.join(', ')}）のユーザー導線とヘルプ改善`)
  }
  
  return recommendations.slice(0, 3)
}

function identifyOpportunities(ga4Data: GA4Metrics, posthogData: PostHogAnalytics): string[] {
  const opportunities: string[] = []
  
  if (ga4Data.trafficSources.organic > 40) {
    opportunities.push('SEO/オーガニック流入の強化によるユーザー獲得拡大')
  }
  
  if (posthogData.cohortAnalysis.week1 > 0.8) {
    opportunities.push('高いリテンション率を活かしたリファラル機能の実装')
  }
  
  const avgUsage = Object.values(posthogData.featureUsage).reduce((a, b) => a + b, 0) / 
                   Object.keys(posthogData.featureUsage).length
  if (avgUsage > 50) {
    opportunities.push('高機能利用率を活かしたプレミアム機能の提案')
  }
  
  return opportunities
}