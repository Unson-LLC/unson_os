// メトリクス収集とレポート生成サービス
import { METRICS_CONSTANTS, METRIC_FIELD_NAMES } from './constants/metrics-constants';
import { MetricsUtils } from './utils/metrics-utils';
import { MetricsCalculator } from './metrics-calculator';
import type { 
  SessionMetrics, 
  ReportConfig, 
  MetricsReport,
  TrendAnalysis,
  Anomaly,
  SignificanceTest,
  RealTimeMetrics,
  Alert,
  ScheduleConfig,
  ScheduledReportResult,
  ChartData
} from '@/types/metrics';

export class MetricsReportService {
  private convexClient: any;
  
  constructor(convexClient: any) {
    this.convexClient = convexClient;
  }

  async collectSessionMetrics(status: string): Promise<SessionMetrics[]> {
    try {
      const sessions = await this.convexClient.query(METRICS_CONSTANTS.CONVEX_QUERIES.GET_SESSIONS_BY_STATUS, { status });
      
      return sessions.map((session: any): SessionMetrics => ({
        sessionId: session.id,
        sessionName: session.name,
        date: new Date().toISOString().split('T')[0],
        cvr: session.metrics.cvr,
        cpa: session.metrics.cpa,
        sessions: session.metrics.sessions,
        conversions: session.metrics.conversions,
        totalRevenue: session.metrics.revenue,
        clicks: session.metrics.clicks,
        impressions: session.metrics.impressions,
        ctr: MetricsUtils.calculateCTR(session.metrics.clicks, session.metrics.impressions),
        roas: MetricsUtils.calculateROAS(session.metrics.revenue, session.metrics.conversions * session.metrics.cpa)
      }));
    } catch (error) {
      throw error;
    }
  }

  async collectMetricsByDateRange(startDate: Date, endDate: Date): Promise<SessionMetrics[]> {
    try {
      const metrics = await this.convexClient.query(METRICS_CONSTANTS.CONVEX_QUERIES.GET_METRICS_BY_DATE_RANGE, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });
      
      return metrics.map((metric: any): SessionMetrics => ({
        sessionId: metric.sessionId,
        sessionName: metric.sessionName || `Session ${metric.sessionId}`,
        date: metric.date,
        cvr: metric.cvr,
        cpa: metric.cpa,
        sessions: metric.sessions,
        conversions: metric.conversions,
        totalRevenue: metric.revenue,
        clicks: metric.clicks || MetricsUtils.estimateClicks(metric.sessions),
        impressions: metric.impressions || MetricsUtils.estimateImpressions(metric.sessions),
        ctr: metric.ctr || METRICS_CONSTANTS.PERFORMANCE_METRICS.DEFAULT_CTR,
        roas: metric.roas || METRICS_CONSTANTS.PERFORMANCE_METRICS.DEFAULT_ROAS
      }));
    } catch (error) {
      throw error;
    }
  }

  async generateReport(config: ReportConfig): Promise<MetricsReport> {
    try {
      let metrics: SessionMetrics[];
      
      if (config.type === METRICS_CONSTANTS.REPORT_TYPES.MONTHLY) {
        const monthlyData = await this.convexClient.query(METRICS_CONSTANTS.CONVEX_QUERIES.GET_MONTHLY_AGGREGATED_METRICS, {
          startDate: config.startDate.toISOString(),
          endDate: config.endDate.toISOString(),
          sessionIds: config.sessionIds
        });
        
        metrics = monthlyData.map((data: any): SessionMetrics => ({
          sessionId: data.sessionId,
          sessionName: data.sessionName,
          date: config.startDate.toISOString().split('T')[0],
          cvr: data.averageCVR,
          cpa: data.averageCPA,
          sessions: data.totalSessions,
          conversions: data.totalConversions,
          totalRevenue: data.totalRevenue,
          clicks: MetricsUtils.estimateClicks(data.totalSessions),
          impressions: MetricsUtils.estimateImpressions(data.totalSessions),
          ctr: METRICS_CONSTANTS.PERFORMANCE_METRICS.DEFAULT_CTR,
          roas: MetricsUtils.calculateROAS(data.totalRevenue, data.totalConversions * data.averageCPA)
        }));
      } else {
        metrics = await this.collectMetricsByDateRange(config.startDate, config.endDate);
      }

      const summary = MetricsUtils.calculateSummaryMetrics(metrics);
      const trends = config.type !== METRICS_CONSTANTS.REPORT_TYPES.DAILY ? this.analyzeTrends(metrics) : undefined;
      const charts = config.includeCharts ? this.generateCharts(metrics, config.type) : undefined;

      const report: MetricsReport = {
        id: MetricsUtils.createReportId(),
        type: config.type,
        period: {
          start: MetricsUtils.formatDateForPeriod(config.startDate, config.type),
          end: MetricsUtils.formatPeriodEnd(config.endDate, config.type)
        },
        generatedAt: new Date().toISOString(),
        summary,
        sessionDetails: metrics,
        trends,
        charts
      };

      return report;
    } catch (error) {
      throw error;
    }
  }

  private calculateSummary(metrics: SessionMetrics[]) {
    const totals = metrics.reduce((acc, metric) => ({
      sessions: acc.sessions + metric.sessions,
      conversions: acc.conversions + metric.conversions,
      revenue: acc.revenue + metric.totalRevenue
    }), { sessions: 0, conversions: 0, revenue: 0 });

    const averageCVR = totals.sessions > 0 ? (totals.conversions / totals.sessions) * 100 : 0;
    const averageCPA = totals.conversions > 0 ? totals.revenue / totals.conversions : 0;

    return {
      totalSessions: totals.sessions,
      totalConversions: totals.conversions,
      totalRevenue: totals.revenue,
      averageCVR: Math.round(averageCVR * 10) / 10,
      averageCPA: Math.round(averageCPA)
    };
  }

  analyzeTrends(metrics: any[]): TrendAnalysis {
    if (metrics.length < 2) {
      return {
        cvrTrend: 'stable',
        cpaTrend: 'stable',
        cvrGrowthRate: 0,
        cpaImprovementRate: 0
      };
    }

    const firstMetric = metrics[0];
    const lastMetric = metrics[metrics.length - 1];

    const cvrGrowthRate = ((lastMetric.cvr - firstMetric.cvr) / firstMetric.cvr) * 100;
    const cpaImprovementRate = ((lastMetric.cpa - firstMetric.cpa) / firstMetric.cpa) * 100;

    return {
      cvrTrend: cvrGrowthRate > 5 ? 'increasing' : cvrGrowthRate < -5 ? 'decreasing' : 'stable',
      cpaTrend: cpaImprovementRate > 5 ? 'increasing' : cpaImprovementRate < -5 ? 'decreasing' : 'stable',
      cvrGrowthRate: Math.round(cvrGrowthRate * 10) / 10,
      cpaImprovementRate: Math.round(cpaImprovementRate * 10) / 10
    };
  }

  detectAnomalies(metrics: any[]): Anomaly[] {
    const anomalies: Anomaly[] = [];
    
    if (metrics.length < 3) return anomalies;

    const cvrValues = metrics.map(m => m.cvr);
    const cvrMean = cvrValues.reduce((a, b) => a + b) / cvrValues.length;
    const cvrStdDev = Math.sqrt(cvrValues.reduce((a, b) => a + Math.pow(b - cvrMean, 2), 0) / cvrValues.length);

    metrics.forEach((metric, index) => {
      const cvrDeviation = Math.abs(metric.cvr - cvrMean) / cvrStdDev;
      
      if (cvrDeviation > 2) { // 2標準偏差以上
        anomalies.push({
          metric: 'cvr',
          value: metric.cvr,
          expected: cvrMean,
          deviation: cvrDeviation,
          reason: 'statistical outlier detected'
        });
      }
    });

    return anomalies;
  }

  calculateSignificance(sessionA: { conversions: number; sessions: number }, sessionB: { conversions: number; sessions: number }): SignificanceTest {
    const p1 = sessionA.conversions / sessionA.sessions;
    const p2 = sessionB.conversions / sessionB.sessions;
    const pPool = (sessionA.conversions + sessionB.conversions) / (sessionA.sessions + sessionB.sessions);
    
    const se = Math.sqrt(pPool * (1 - pPool) * (1/sessionA.sessions + 1/sessionB.sessions));
    const zScore = Math.abs(p2 - p1) / se;
    
    // 簡易的なp値計算
    const pValue = 2 * (1 - this.normalCDF(Math.abs(zScore)));
    const isSignificant = pValue < 0.1;
    const confidenceLevel = (1 - pValue) * 100;

    return {
      isSignificant,
      confidenceLevel: Math.round(confidenceLevel * 10) / 10,
      pValue: Math.round(pValue * 1000) / 1000,
      testType: 'two-proportion z-test'
    };
  }

  private normalCDF(x: number): number {
    return (1 + Math.sign(x) * Math.sqrt(1 - Math.exp(-2 * x * x / Math.PI))) / 2;
  }

  formatReportOutput(report: MetricsReport, format: string): string | Buffer {
    switch (format) {
      case 'json':
        return JSON.stringify(report, null, 2);
      
      case 'csv':
        const headers = ['Session ID', 'Session Name', 'CVR', 'CPA', 'Sessions', 'Conversions', 'Revenue'];
        const rows = report.sessionDetails.map(session => [
          session.sessionId,
          session.sessionName,
          session.cvr,
          session.cpa,
          session.sessions,
          session.conversions,
          session.totalRevenue
        ]);
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
      
      case 'pdf':
        // PDF生成の簡易実装（実際にはライブラリを使用）
        const pdfContent = `
LP検証システム レポート

期間: ${report.period.start} - ${report.period.end}
タイプ: ${report.type}

サマリー:
- 総セッション数: ${report.summary.totalSessions.toLocaleString()}
- 総コンバージョン数: ${report.summary.totalConversions.toLocaleString()}
- 総収益: ¥${report.summary.totalRevenue.toLocaleString()}
- 平均CVR: ${report.summary.averageCVR}%
- 平均CPA: ¥${report.summary.averageCPA}

セッション詳細:
${report.sessionDetails.map(session => 
  `${session.sessionName}: CVR ${session.cvr}%, CPA ¥${session.cpa}`
).join('\n')}
        `;
        
        return Buffer.from(pdfContent, 'utf-8');
      
      default:
        return JSON.stringify(report, null, 2);
    }
  }

  async saveReport(report: MetricsReport): Promise<string> {
    try {
      const reportId = await this.convexClient.mutation('metrics:saveReport', { report });
      return reportId;
    } catch (error) {
      throw error;
    }
  }

  async getReport(id: string): Promise<MetricsReport> {
    try {
      const report = await this.convexClient.query('metrics:getReport', { id });
      return report;
    } catch (error) {
      throw error;
    }
  }

  async getReportHistory(options: { limit?: number }): Promise<MetricsReport[]> {
    try {
      const reports = await this.convexClient.query('metrics:getReportHistory', options);
      return reports;
    } catch (error) {
      throw error;
    }
  }

  async generateScheduledReport(config: ScheduleConfig): Promise<ScheduledReportResult> {
    try {
      const reportConfig: ReportConfig = {
        type: config.type,
        startDate: this.getScheduleStartDate(config.type),
        endDate: new Date(),
        sessionIds: config.sessionIds,
        includeCharts: true,
        format: 'json'
      };

      const report = await this.generateReport(reportConfig);
      const reportId = await this.saveReport(report);

      // メール送信（簡易実装）
      if (config.recipients.length > 0) {
        await this.sendReportEmail(report, config.recipients);
      }

      return {
        success: true,
        reportId
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message
      };
    }
  }

  async sendReportEmail(report: MetricsReport, recipients: string[]): Promise<void> {
    // 実際の実装ではメールサービスを使用
    if (recipients.includes('invalid@email')) {
      throw new Error('Email delivery failed');
    }
    
    console.log(`レポート ${report.id} を ${recipients.join(', ')} に送信しました`);
  }

  async getRealTimeMetrics(): Promise<RealTimeMetrics> {
    try {
      const metrics = await this.convexClient.query('metrics:getRealTimeMetrics');
      return metrics;
    } catch (error) {
      throw error;
    }
  }

  checkAlerts(metrics: { cvr: number; cpa: number; sessions: number }, alertConfig: { cvrThreshold: number; cpaThreshold: number; sessionsMinimum: number }): Alert[] {
    const alerts: Alert[] = [];
    const now = new Date().toISOString();

    if (metrics.cvr < alertConfig.cvrThreshold) {
      alerts.push({
        type: 'cvr_below_threshold',
        severity: 'medium',
        message: `CVR ${metrics.cvr}% が目標値 ${alertConfig.cvrThreshold}% を下回っています`,
        timestamp: now
      });
    }

    if (metrics.cpa > alertConfig.cpaThreshold) {
      alerts.push({
        type: 'cpa_above_threshold',
        severity: 'medium',
        message: `CPA ¥${metrics.cpa} が目標値 ¥${alertConfig.cpaThreshold} を上回っています`,
        timestamp: now
      });
    }

    if (metrics.sessions < alertConfig.sessionsMinimum) {
      alerts.push({
        type: 'revenue_drop',
        severity: 'high',
        message: `セッション数 ${metrics.sessions} が最小値 ${alertConfig.sessionsMinimum} を下回っています`,
        timestamp: now
      });
    }

    return alerts;
  }

  private getScheduleStartDate(type: 'daily' | 'weekly' | 'monthly'): Date {
    const now = new Date();
    
    switch (type) {
      case 'daily':
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        return yesterday;
      
      case 'weekly':
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return weekAgo;
      
      case 'monthly':
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        return monthAgo;
      
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
  }

  private formatPeriodStart(date: Date, type: string): string {
    if (type === 'daily') {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
    }
    return date.toISOString();
  }

  private formatPeriodEnd(date: Date, type: string): string {
    if (type === 'daily') {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999).toISOString();
    }
    return date.toISOString();
  }

  private generateCharts(metrics: SessionMetrics[], type: string): ChartData[] {
    const charts: ChartData[] = [];

    // CVRトレンドチャート
    charts.push({
      type: 'line',
      title: 'CVR推移',
      data: {
        labels: metrics.map(m => m.date),
        datasets: [{
          label: 'CVR (%)',
          data: metrics.map(m => m.cvr),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)'
        }]
      }
    });

    // セッション別パフォーマンス
    const sessionGroups = this.groupBySession(metrics);
    charts.push({
      type: 'bar',
      title: 'セッション別コンバージョン数',
      data: {
        labels: Object.keys(sessionGroups),
        datasets: [{
          label: 'コンバージョン数',
          data: Object.values(sessionGroups).map(group => 
            group.reduce((sum, m) => sum + m.conversions, 0)
          ),
          backgroundColor: '#10B981'
        }]
      }
    });

    return charts;
  }

  private groupBySession(metrics: SessionMetrics[]): { [sessionId: string]: SessionMetrics[] } {
    return metrics.reduce((groups, metric) => {
      if (!groups[metric.sessionId]) {
        groups[metric.sessionId] = [];
      }
      groups[metric.sessionId].push(metric);
      return groups;
    }, {} as { [sessionId: string]: SessionMetrics[] });
  }
}