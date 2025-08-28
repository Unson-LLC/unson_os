// 広告指標計算ツール（ビジネスロジック分離）
import { METRIC_PRECISION } from '../config/constants'
import { AdsWindow } from '../types'

export interface MetricCalculationResult {
  current: number
  previous: number
  change: number
}

export class MetricsCalculator {
  static calculateCTR(window: AdsWindow): number {
    if (window.impressions === 0) return 0
    return (window.clicks / window.impressions) * 100
  }

  static calculateCVR(window: AdsWindow): number {
    if (window.clicks === 0) return 0
    return (window.conversions / window.clicks) * 100
  }

  static calculateCPC(window: AdsWindow): number {
    if (window.clicks === 0) return 0
    return window.cost / window.clicks
  }

  static calculateChangeRate(current: number, previous: number): number {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  static formatMetric(value: number, decimalPlaces: number): number {
    return Number(value.toFixed(decimalPlaces))
  }

  static calculateMetricWithChange(
    currentWindow: AdsWindow,
    previousWindow: AdsWindow,
    calculator: (window: AdsWindow) => number,
    decimalPlaces: number
  ): MetricCalculationResult {
    const current = calculator(currentWindow)
    const previous = calculator(previousWindow)
    const change = this.calculateChangeRate(current, previous)

    return {
      current: this.formatMetric(current, decimalPlaces),
      previous: this.formatMetric(previous, decimalPlaces),
      change: this.formatMetric(change, METRIC_PRECISION.CHANGE_DECIMAL_PLACES)
    }
  }

  static calculateAllMetrics(currentWindow: AdsWindow, previousWindow: AdsWindow) {
    return {
      ctr: this.calculateMetricWithChange(
        currentWindow,
        previousWindow,
        this.calculateCTR,
        METRIC_PRECISION.CTR_DECIMAL_PLACES
      ),
      cvr: this.calculateMetricWithChange(
        currentWindow,
        previousWindow,
        this.calculateCVR,
        METRIC_PRECISION.CVR_DECIMAL_PLACES
      ),
      cpc: this.calculateMetricWithChange(
        currentWindow,
        previousWindow,
        this.calculateCPC,
        METRIC_PRECISION.CPC_DECIMAL_PLACES
      )
    }
  }
}