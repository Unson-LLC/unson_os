// メトリクス計算ユーティリティ
export class MetricsCalculator {
  static calculateCVR(conversions: number, sessions: number): number {
    if (sessions === 0) return 0;
    return Math.round((conversions / sessions) * 1000) / 10; // 小数点1位まで
  }

  static calculateCPA(totalCost: number, conversions: number): number {
    if (conversions === 0) return 0;
    return Math.round(totalCost / conversions);
  }

  static calculateCTR(clicks: number, impressions: number): number {
    if (impressions === 0) return 0;
    return Math.round((clicks / impressions) * 1000) / 10;
  }

  static calculateROAS(revenue: number, cost: number): number {
    if (cost === 0) return 0;
    return Math.round((revenue / cost) * 10) / 10;
  }

  static calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 1000) / 10;
  }

  static calculateMovingAverage(values: number[], period: number): number[] {
    if (values.length < period) return [];
    
    const result: number[] = [];
    for (let i = period - 1; i < values.length; i++) {
      const sum = values.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(Math.round((sum / period) * 10) / 10);
    }
    return result;
  }

  static calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  static detectTrend(values: number[]): 'increasing' | 'decreasing' | 'stable' {
    if (values.length < 2) return 'stable';
    
    const first = values[0];
    const last = values[values.length - 1];
    const changeRate = Math.abs((last - first) / first) * 100;
    
    if (changeRate < 5) return 'stable';
    return last > first ? 'increasing' : 'decreasing';
  }

  static calculatePercentile(values: number[], percentile: number): number {
    const sorted = [...values].sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);
    
    if (Math.floor(index) === index) {
      return sorted[index];
    }
    
    const lower = sorted[Math.floor(index)];
    const upper = sorted[Math.ceil(index)];
    const weight = index - Math.floor(index);
    
    return lower + weight * (upper - lower);
  }

  static aggregateMetrics(metrics: Array<{
    sessions: number;
    conversions: number;
    revenue: number;
    cost: number;
  }>) {
    const totals = metrics.reduce((acc, metric) => ({
      sessions: acc.sessions + metric.sessions,
      conversions: acc.conversions + metric.conversions,
      revenue: acc.revenue + metric.revenue,
      cost: acc.cost + metric.cost
    }), { sessions: 0, conversions: 0, revenue: 0, cost: 0 });

    return {
      totalSessions: totals.sessions,
      totalConversions: totals.conversions,
      totalRevenue: totals.revenue,
      totalCost: totals.cost,
      averageCVR: this.calculateCVR(totals.conversions, totals.sessions),
      averageCPA: this.calculateCPA(totals.cost, totals.conversions),
      totalROAS: this.calculateROAS(totals.revenue, totals.cost)
    };
  }
}