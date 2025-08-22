// メトリクス・レポートユーティリティ関数
import { METRICS_CONSTANTS, METRIC_FIELD_NAMES, SCHEDULE_TYPES } from '../constants/metrics-constants';
import type { SessionMetrics, Alert } from '@/types/metrics';

export class MetricsUtils {
  static formatDateForPeriod(date: Date, type: string): string {
    switch (type) {
      case METRICS_CONSTANTS.REPORT_TYPES.DAILY:
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
      default:
        return date.toISOString();
    }
  }

  static formatPeriodEnd(date: Date, type: string): string {
    switch (type) {
      case METRICS_CONSTANTS.REPORT_TYPES.DAILY:
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999).toISOString();
      default:
        return date.toISOString();
    }
  }

  static getScheduleStartDate(type: string): Date {
    const now = new Date();
    
    switch (type) {
      case SCHEDULE_TYPES.DAILY:
        return new Date(now.getTime() - METRICS_CONSTANTS.TIME_PERIODS.MILLISECONDS_PER_DAY);
      
      case SCHEDULE_TYPES.WEEKLY:
        return new Date(now.getTime() - (METRICS_CONSTANTS.TIME_PERIODS.DAYS_PER_WEEK * METRICS_CONSTANTS.TIME_PERIODS.MILLISECONDS_PER_DAY));
      
      case SCHEDULE_TYPES.MONTHLY:
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        return monthAgo;
      
      default:
        return new Date(now.getTime() - METRICS_CONSTANTS.TIME_PERIODS.MILLISECONDS_PER_DAY);
    }
  }

  static calculateCTR(clicks: number, impressions: number): number {
    if (impressions === 0) return 0;
    return this.roundToPrecision(
      (clicks / impressions) * 100, 
      METRICS_CONSTANTS.PRECISION.PERCENTAGE_DECIMAL_PLACES
    );
  }

  static calculateROAS(revenue: number, cost: number): number {
    if (cost === 0) return 0;
    return this.roundToPrecision(
      revenue / cost, 
      METRICS_CONSTANTS.PRECISION.CHART_VALUE_DECIMAL_PLACES
    );
  }

  static estimateClicks(sessions: number): number {
    return Math.round(sessions * METRICS_CONSTANTS.PERFORMANCE_METRICS.CLICK_TO_SESSION_RATIO);
  }

  static estimateImpressions(sessions: number): number {
    return Math.round(sessions * METRICS_CONSTANTS.PERFORMANCE_METRICS.IMPRESSION_TO_SESSION_RATIO);
  }

  static roundToPrecision(value: number, decimalPlaces: number): number {
    const multiplier = Math.pow(10, decimalPlaces);
    return Math.round(value * multiplier) / multiplier;
  }

  static calculateSummaryMetrics(metrics: SessionMetrics[]) {
    const totals = metrics.reduce((acc, metric) => ({
      sessions: acc.sessions + metric.sessions,
      conversions: acc.conversions + metric.conversions,
      revenue: acc.revenue + metric.totalRevenue
    }), { sessions: 0, conversions: 0, revenue: 0 });

    const averageCVR = totals.sessions > 0 
      ? this.roundToPrecision((totals.conversions / totals.sessions) * 100, METRICS_CONSTANTS.PRECISION.PERCENTAGE_DECIMAL_PLACES)
      : 0;
    
    const averageCPA = totals.conversions > 0 
      ? Math.round(totals.revenue / totals.conversions)
      : 0;

    return {
      totalSessions: totals.sessions,
      totalConversions: totals.conversions,
      totalRevenue: totals.revenue,
      averageCVR,
      averageCPA
    };
  }

  static detectTrendDirection(values: number[]): string {
    if (values.length < 2) {
      return METRICS_CONSTANTS.TREND_DIRECTIONS.STABLE;
    }

    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const changeRate = Math.abs((lastValue - firstValue) / firstValue) * 100;

    if (changeRate < METRICS_CONSTANTS.STATISTICAL_THRESHOLDS.TREND_CHANGE_PERCENT) {
      return METRICS_CONSTANTS.TREND_DIRECTIONS.STABLE;
    }

    return lastValue > firstValue 
      ? METRICS_CONSTANTS.TREND_DIRECTIONS.INCREASING 
      : METRICS_CONSTANTS.TREND_DIRECTIONS.DECREASING;
  }

  static calculateGrowthRate(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return this.roundToPrecision(
      ((current - previous) / previous) * 100,
      METRICS_CONSTANTS.PRECISION.PERCENTAGE_DECIMAL_PLACES
    );
  }

  static calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  static isStatisticallySignificant(pValue: number): boolean {
    return pValue < METRICS_CONSTANTS.STATISTICAL_THRESHOLDS.SIGNIFICANCE_P_VALUE;
  }

  static normalCDF(x: number): number {
    return (1 + Math.sign(x) * Math.sqrt(1 - Math.exp(-2 * x * x / Math.PI))) / 2;
  }

  static createAlertMessage(
    type: string, 
    value: number, 
    threshold: number
  ): string {
    switch (type) {
      case METRICS_CONSTANTS.ALERT_TYPES.CVR_BELOW_THRESHOLD:
        return METRICS_CONSTANTS.ALERT_MESSAGES.CVR_BELOW_THRESHOLD(value, threshold);
      
      case METRICS_CONSTANTS.ALERT_TYPES.CPA_ABOVE_THRESHOLD:
        return METRICS_CONSTANTS.ALERT_MESSAGES.CPA_ABOVE_THRESHOLD(value, threshold);
      
      default:
        return `アラート: ${type}`;
    }
  }

  static formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / METRICS_CONSTANTS.TIME_PERIODS.MILLISECONDS_PER_MINUTE);
    
    if (diffMinutes < METRICS_CONSTANTS.TIME_PERIODS.MINUTES_PER_HOUR) {
      return `${diffMinutes}分前`;
    } else if (diffMinutes < METRICS_CONSTANTS.TIME_PERIODS.MINUTES_PER_HOUR * METRICS_CONSTANTS.TIME_PERIODS.HOURS_PER_DAY) {
      return `${Math.floor(diffMinutes / METRICS_CONSTANTS.TIME_PERIODS.MINUTES_PER_HOUR)}時間前`;
    } else {
      return date.toLocaleDateString(METRICS_CONSTANTS.DATE_FORMAT.JAPANESE_LOCALE);
    }
  }

  static groupMetricsBySession(metrics: SessionMetrics[]): { [sessionId: string]: SessionMetrics[] } {
    return metrics.reduce((groups, metric) => {
      if (!groups[metric[METRIC_FIELD_NAMES.SESSION_ID]]) {
        groups[metric[METRIC_FIELD_NAMES.SESSION_ID]] = [];
      }
      groups[metric[METRIC_FIELD_NAMES.SESSION_ID]].push(metric);
      return groups;
    }, {} as { [sessionId: string]: SessionMetrics[] });
  }

  static generateCSVContent(headers: string[], rows: any[][]): string {
    const csvContent = [headers, ...rows]
      .map(row => row.join(METRICS_CONSTANTS.CSV_CONFIG.DELIMITER))
      .join(METRICS_CONSTANTS.CSV_CONFIG.LINE_ENDING);
    return csvContent;
  }

  static createChartLabels(metrics: SessionMetrics[]): string[] {
    return metrics.map(metric => metric[METRIC_FIELD_NAMES.DATE]);
  }

  static createChartDataset(
    label: string, 
    data: number[], 
    colorIndex: number = 0
  ) {
    const colors = METRICS_CONSTANTS.CHART_CONFIG.DEFAULT_COLORS;
    return {
      label,
      data,
      borderColor: colors[colorIndex % colors.length],
      backgroundColor: `${colors[colorIndex % colors.length]}1A` // 10% opacity
    };
  }

  static validateDateRange(startDate: Date, endDate: Date): boolean {
    return startDate <= endDate;
  }

  static validateSessionIds(sessionIds: string[]): boolean {
    return sessionIds.length > 0 && sessionIds.every(id => id.trim().length > 0);
  }

  static isInvalidEmailAddress(email: string): boolean {
    return email.includes(METRICS_CONSTANTS.EMAIL_CONFIG.INVALID_EMAIL_PATTERN);
  }

  static createReportId(): string {
    return `report-${Date.now()}`;
  }

  static formatCurrency(amount: number): string {
    return `¥${amount.toLocaleString()}`;
  }

  static formatPercentage(value: number): string {
    return `${this.roundToPrecision(value, METRICS_CONSTANTS.PRECISION.PERCENTAGE_DECIMAL_PLACES)}%`;
  }

  static createPDFContent(reportData: {
    title: string;
    period: { start: string; end: string };
    type: string;
    summary: any;
    sessionDetails: SessionMetrics[];
  }): string {
    return `
LP検証システム レポート

期間: ${reportData.period.start} - ${reportData.period.end}
タイプ: ${reportData.type}

サマリー:
- 総セッション数: ${reportData.summary.totalSessions.toLocaleString()}
- 総コンバージョン数: ${reportData.summary.totalConversions.toLocaleString()}
- 総収益: ${this.formatCurrency(reportData.summary.totalRevenue)}
- 平均CVR: ${this.formatPercentage(reportData.summary.averageCVR)}
- 平均CPA: ${this.formatCurrency(reportData.summary.averageCPA)}

セッション詳細:
${reportData.sessionDetails.map(session => 
  `${session[METRIC_FIELD_NAMES.SESSION_NAME]}: CVR ${this.formatPercentage(session[METRIC_FIELD_NAMES.CVR])}, CPA ${this.formatCurrency(session[METRIC_FIELD_NAMES.CPA])}`
).join(METRICS_CONSTANTS.CSV_CONFIG.LINE_ENDING)}
    `.trim();
  }

  static createAlertWithTimestamp(
    type: string,
    severity: string,
    message: string,
    sessionId?: string
  ): Alert {
    return {
      type: type as any,
      severity: severity as any,
      message,
      timestamp: new Date().toISOString(),
      sessionId
    };
  }

  static getAlertCounts(alerts: Alert[]) {
    return {
      critical: alerts.filter(a => a.severity === METRICS_CONSTANTS.ALERT_SEVERITY.CRITICAL).length,
      high: alerts.filter(a => a.severity === METRICS_CONSTANTS.ALERT_SEVERITY.HIGH).length,
      medium: alerts.filter(a => a.severity === METRICS_CONSTANTS.ALERT_SEVERITY.MEDIUM).length,
      low: alerts.filter(a => a.severity === METRICS_CONSTANTS.ALERT_SEVERITY.LOW).length,
      total: alerts.length
    };
  }

  static calculateMovingAverage(values: number[], period: number): number[] {
    if (values.length < period) return [];
    
    const result: number[] = [];
    for (let i = period - 1; i < values.length; i++) {
      const sum = values.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(this.roundToPrecision(sum / period, METRICS_CONSTANTS.PRECISION.CHART_VALUE_DECIMAL_PLACES));
    }
    return result;
  }
}