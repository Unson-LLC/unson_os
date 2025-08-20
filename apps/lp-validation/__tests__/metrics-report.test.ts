// メトリクス収集とレポート生成テスト
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MetricsReportService } from '@/lib/metrics-report-service';
import type { SessionMetrics, ReportConfig, MetricsReport } from '@/types/metrics';

describe('メトリクス収集とレポート生成', () => {
  let metricsService: MetricsReportService;
  let mockConvexClient: any;

  beforeEach(() => {
    mockConvexClient = {
      query: vi.fn(),
      mutation: vi.fn()
    };
    
    metricsService = new MetricsReportService(mockConvexClient);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('セッションメトリクス収集', () => {
    it('アクティブセッションのメトリクスを正常に収集できる', async () => {
      const mockSessions = [
        {
          id: 'session1',
          name: 'AI Bridge MVP Test',
          status: 'active',
          phase: 1,
          createdAt: Date.now() - 86400000, // 1日前
          metrics: {
            cvr: 12.3,
            cpa: 287,
            sessions: 1500,
            conversions: 185,
            revenue: 92500,
            clicks: 3200,
            impressions: 28500
          }
        },
        {
          id: 'session2',
          name: 'AI Coach Beta',
          status: 'active',
          phase: 1,
          createdAt: Date.now() - 172800000, // 2日前
          metrics: {
            cvr: 8.7,
            cpa: 342,
            sessions: 980,
            conversions: 85,
            revenue: 42500,
            clicks: 2100,
            impressions: 18200
          }
        }
      ];

      mockConvexClient.query.mockResolvedValue(mockSessions);

      const metrics = await metricsService.collectSessionMetrics('active');

      expect(mockConvexClient.query).toHaveBeenCalledWith('lpValidation:getSessionsByStatus', { status: 'active' });
      expect(metrics).toHaveLength(2);
      expect(metrics[0].sessionId).toBe('session1');
      expect(metrics[0].cvr).toBe(12.3);
      expect(metrics[0].totalRevenue).toBe(92500);
    });

    it('指定期間のメトリクスを正常に収集できる', async () => {
      const startDate = new Date('2024-08-15');
      const endDate = new Date('2024-08-20');
      
      const mockMetrics = [
        {
          sessionId: 'session1',
          date: '2024-08-16',
          cvr: 11.5,
          cpa: 295,
          sessions: 850,
          conversions: 98,
          revenue: 49000
        },
        {
          sessionId: 'session1',
          date: '2024-08-17',
          cvr: 12.8,
          cpa: 278,
          sessions: 920,
          conversions: 118,
          revenue: 59000
        }
      ];

      mockConvexClient.query.mockResolvedValue(mockMetrics);

      const metrics = await metricsService.collectMetricsByDateRange(startDate, endDate);

      expect(mockConvexClient.query).toHaveBeenCalledWith(
        'lpValidation:getMetricsByDateRange',
        { 
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      );
      expect(metrics).toHaveLength(2);
      expect(metrics[0].date).toBe('2024-08-16');
    });

    it('エラーが発生した場合適切にハンドリングする', async () => {
      mockConvexClient.query.mockRejectedValue(new Error('Database connection failed'));

      await expect(metricsService.collectSessionMetrics('active')).rejects.toThrow('Database connection failed');
    });
  });

  describe('レポート生成', () => {
    it('日次レポートを正常に生成できる', async () => {
      const reportConfig: ReportConfig = {
        type: 'daily',
        startDate: new Date('2024-08-20'),
        endDate: new Date('2024-08-20'),
        sessionIds: ['session1', 'session2'],
        includeCharts: true,
        format: 'json'
      };

      const mockMetrics: SessionMetrics[] = [
        {
          sessionId: 'session1',
          sessionName: 'AI Bridge MVP Test',
          date: '2024-08-20',
          cvr: 12.3,
          cpa: 287,
          sessions: 1500,
          conversions: 185,
          totalRevenue: 92500,
          clicks: 3200,
          impressions: 28500,
          ctr: 11.2,
          roas: 3.2
        }
      ];

      mockConvexClient.query.mockResolvedValue(mockMetrics);

      const report = await metricsService.generateReport(reportConfig);

      expect(report.type).toBe('daily');
      expect(report.period).toEqual({
        start: '2024-08-20T00:00:00.000Z',
        end: '2024-08-20T23:59:59.999Z'
      });
      expect(report.summary.totalSessions).toBe(1500);
      expect(report.summary.totalConversions).toBe(185);
      expect(report.summary.averageCVR).toBe(12.3);
      expect(report.sessionDetails).toHaveLength(1);
    });

    it('週次レポートを正常に生成できる', async () => {
      const reportConfig: ReportConfig = {
        type: 'weekly',
        startDate: new Date('2024-08-14'), // 月曜日
        endDate: new Date('2024-08-20'),   // 日曜日
        sessionIds: ['session1'],
        includeCharts: false,
        format: 'json'
      };

      const mockWeeklyMetrics = Array.from({ length: 7 }, (_, i) => ({
        sessionId: 'session1',
        sessionName: 'AI Bridge MVP Test',
        date: new Date(2024, 7, 14 + i).toISOString().split('T')[0],
        cvr: 10 + i * 0.5,
        cpa: 300 - i * 5,
        sessions: 200 + i * 10,
        conversions: 20 + i * 2,
        totalRevenue: 10000 + i * 1000,
        clicks: 400 + i * 20,
        impressions: 3000 + i * 200,
        ctr: 13.3,
        roas: 3.0
      }));

      mockConvexClient.query.mockResolvedValue(mockWeeklyMetrics);

      const report = await metricsService.generateReport(reportConfig);

      expect(report.type).toBe('weekly');
      expect(report.sessionDetails).toHaveLength(7);
      expect(report.summary.totalSessions).toBe(1610); // 200+210+...+260
      expect(report.trends).toBeDefined();
      expect(report.trends.cvrTrend).toBe('increasing');
    });

    it('月次レポートを正常に生成できる', async () => {
      const reportConfig: ReportConfig = {
        type: 'monthly',
        startDate: new Date('2024-08-01'),
        endDate: new Date('2024-08-31'),
        sessionIds: ['session1', 'session2'],
        includeCharts: true,
        format: 'json'
      };

      const mockMonthlyData = [
        {
          sessionId: 'session1',
          sessionName: 'AI Bridge MVP Test',
          totalSessions: 45000,
          totalConversions: 5540,
          totalRevenue: 2770000,
          averageCVR: 12.3,
          averageCPA: 287
        },
        {
          sessionId: 'session2', 
          sessionName: 'AI Coach Beta',
          totalSessions: 28000,
          totalConversions: 2436,
          totalRevenue: 1218000,
          averageCVR: 8.7,
          averageCPA: 342
        }
      ];

      mockConvexClient.query.mockResolvedValue(mockMonthlyData);

      const report = await metricsService.generateReport(reportConfig);

      expect(report.type).toBe('monthly');
      expect(report.summary.totalSessions).toBe(73000);
      expect(report.summary.totalRevenue).toBe(3988000);
      expect(report.charts).toBeDefined();
    });

    it('カスタム期間のレポートを生成できる', async () => {
      const reportConfig: ReportConfig = {
        type: 'custom',
        startDate: new Date('2024-08-15'),
        endDate: new Date('2024-08-18'),
        sessionIds: ['session1'],
        includeCharts: false,
        format: 'csv'
      };

      const mockCustomMetrics = [
        {
          sessionId: 'session1',
          sessionName: 'AI Bridge MVP Test',
          date: '2024-08-15',
          cvr: 11.8,
          cpa: 290,
          sessions: 800,
          conversions: 94,
          totalRevenue: 47000
        }
      ];

      mockConvexClient.query.mockResolvedValue(mockCustomMetrics);

      const report = await metricsService.generateReport(reportConfig);

      expect(report.type).toBe('custom');
      expect(report.period.start).toBe('2024-08-15T00:00:00.000Z');
      expect(report.period.end).toBe('2024-08-18T23:59:59.999Z');
    });
  });

  describe('メトリクス分析', () => {
    it('パフォーマンストレンドを正確に分析できる', () => {
      const metrics = [
        { cvr: 10.0, cpa: 300, date: '2024-08-15' },
        { cvr: 10.5, cpa: 295, date: '2024-08-16' },
        { cvr: 11.2, cpa: 285, date: '2024-08-17' },
        { cvr: 12.0, cpa: 280, date: '2024-08-18' }
      ];

      const trends = metricsService.analyzeTrends(metrics);

      expect(trends.cvrTrend).toBe('increasing');
      expect(trends.cpaTrend).toBe('decreasing');
      expect(trends.cvrGrowthRate).toBeCloseTo(20.0, 1); // (12.0-10.0)/10.0 * 100
      expect(trends.cpaImprovementRate).toBeCloseTo(-6.67, 1); // (280-300)/300 * 100
    });

    it('異常値を検出できる', () => {
      const metrics = [
        { cvr: 10.0, cpa: 300, sessions: 1000 },
        { cvr: 10.2, cpa: 298, sessions: 1050 },
        { cvr: 25.0, cpa: 150, sessions: 500 }, // 異常値
        { cvr: 10.1, cpa: 302, sessions: 980 }
      ];

      const anomalies = metricsService.detectAnomalies(metrics);

      expect(anomalies).toHaveLength(1);
      expect(anomalies[0].metric).toBe('cvr');
      expect(anomalies[0].value).toBe(25.0);
      expect(anomalies[0].reason).toContain('statistical outlier');
    });

    it('統計的有意性を計算できる', () => {
      const sessionA = { conversions: 120, sessions: 1000 }; // 12% CVR
      const sessionB = { conversions: 140, sessions: 1000 }; // 14% CVR

      const significance = metricsService.calculateSignificance(sessionA, sessionB);

      expect(significance.isSignificant).toBe(true);
      expect(significance.confidenceLevel).toBeGreaterThan(90);
      expect(significance.pValue).toBeLessThan(0.1);
    });
  });

  describe('レポート出力形式', () => {
    it('JSONフォーマットでレポートを出力できる', async () => {
      const reportConfig: ReportConfig = {
        type: 'daily',
        startDate: new Date('2024-08-20'),
        endDate: new Date('2024-08-20'),
        sessionIds: ['session1'],
        format: 'json'
      };

      mockConvexClient.query.mockResolvedValue([
        {
          sessionId: 'session1',
          sessionName: 'Test Session',
          cvr: 12.0,
          cpa: 290
        }
      ]);

      const report = await metricsService.generateReport(reportConfig);
      const jsonOutput = metricsService.formatReportOutput(report, 'json');

      expect(() => JSON.parse(jsonOutput)).not.toThrow();
      const parsed = JSON.parse(jsonOutput);
      expect(parsed.type).toBe('daily');
    });

    it('CSVフォーマットでレポートを出力できる', async () => {
      const reportConfig: ReportConfig = {
        type: 'daily',
        startDate: new Date('2024-08-20'),
        endDate: new Date('2024-08-20'),
        sessionIds: ['session1'],
        format: 'csv'
      };

      mockConvexClient.query.mockResolvedValue([
        {
          sessionId: 'session1',
          sessionName: 'Test Session',
          cvr: 12.0,
          cpa: 290,
          sessions: 1000,
          conversions: 120
        }
      ]);

      const report = await metricsService.generateReport(reportConfig);
      const csvOutput = metricsService.formatReportOutput(report, 'csv');

      expect(csvOutput).toContain('Session ID,Session Name,CVR,CPA');
      expect(csvOutput).toContain('session1,Test Session,12,290');
    });

    it('PDFフォーマットでレポートを出力できる', async () => {
      const reportConfig: ReportConfig = {
        type: 'weekly',
        startDate: new Date('2024-08-14'),
        endDate: new Date('2024-08-20'),
        sessionIds: ['session1'],
        format: 'pdf',
        includeCharts: true
      };

      mockConvexClient.query.mockResolvedValue([
        {
          sessionId: 'session1',
          sessionName: 'Test Session',
          cvr: 12.0,
          cpa: 290
        }
      ]);

      const report = await metricsService.generateReport(reportConfig);
      const pdfBuffer = await metricsService.formatReportOutput(report, 'pdf');

      expect(pdfBuffer).toBeInstanceOf(Buffer);
      expect(pdfBuffer.length).toBeGreaterThan(0);
    });
  });

  describe('レポート保存と取得', () => {
    it('生成されたレポートをDBに保存できる', async () => {
      const report: MetricsReport = {
        id: 'report-123',
        type: 'daily',
        period: { start: '2024-08-20T00:00:00Z', end: '2024-08-20T23:59:59Z' },
        generatedAt: new Date().toISOString(),
        summary: {
          totalSessions: 1500,
          totalConversions: 185,
          totalRevenue: 92500,
          averageCVR: 12.3,
          averageCPA: 287
        },
        sessionDetails: [],
        trends: { cvrTrend: 'stable', cpaTrend: 'stable' }
      };

      mockConvexClient.mutation.mockResolvedValue('report-123');

      const savedId = await metricsService.saveReport(report);

      expect(mockConvexClient.mutation).toHaveBeenCalledWith('metrics:saveReport', { report });
      expect(savedId).toBe('report-123');
    });

    it('保存されたレポートを取得できる', async () => {
      const mockSavedReport = {
        id: 'report-123',
        type: 'daily',
        generatedAt: new Date().toISOString(),
        summary: { totalSessions: 1500 }
      };

      mockConvexClient.query.mockResolvedValue(mockSavedReport);

      const report = await metricsService.getReport('report-123');

      expect(mockConvexClient.query).toHaveBeenCalledWith('metrics:getReport', { id: 'report-123' });
      expect(report.id).toBe('report-123');
    });

    it('レポート履歴を取得できる', async () => {
      const mockReports = [
        { id: 'report-1', type: 'daily', generatedAt: '2024-08-20T00:00:00Z' },
        { id: 'report-2', type: 'weekly', generatedAt: '2024-08-19T00:00:00Z' }
      ];

      mockConvexClient.query.mockResolvedValue(mockReports);

      const reports = await metricsService.getReportHistory({ limit: 10 });

      expect(mockConvexClient.query).toHaveBeenCalledWith('metrics:getReportHistory', { limit: 10 });
      expect(reports).toHaveLength(2);
    });
  });

  describe('自動レポート生成', () => {
    it('スケジュールに基づいて自動レポートを生成できる', async () => {
      const scheduleConfig = {
        type: 'daily',
        time: '09:00',
        timezone: 'Asia/Tokyo',
        recipients: ['manager@example.com'],
        sessionIds: ['session1', 'session2']
      };

      mockConvexClient.query.mockResolvedValue([
        { sessionId: 'session1', cvr: 12.0, cpa: 290 }
      ]);
      mockConvexClient.mutation.mockResolvedValue('report-auto-123');

      const result = await metricsService.generateScheduledReport(scheduleConfig);

      expect(result.success).toBe(true);
      expect(result.reportId).toBe('report-auto-123');
      expect(mockConvexClient.mutation).toHaveBeenCalledWith('metrics:saveReport', expect.any(Object));
    });

    it('レポート配信に失敗した場合適切にエラーハンドリングする', async () => {
      const scheduleConfig = {
        type: 'daily',
        recipients: ['invalid@email'],
        sessionIds: ['session1']
      };

      mockConvexClient.query.mockResolvedValue([{ sessionId: 'session1' }]);
      vi.spyOn(metricsService, 'sendReportEmail').mockRejectedValue(new Error('Email delivery failed'));

      const result = await metricsService.generateScheduledReport(scheduleConfig);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Email delivery failed');
    });
  });

  describe('リアルタイムメトリクス', () => {
    it('リアルタイムメトリクスを取得できる', async () => {
      const mockRealTimeMetrics = {
        currentSessions: 5,
        activeCampaigns: 12,
        totalRevenue24h: 58000,
        averageCVR24h: 11.8,
        topPerformingSession: {
          id: 'session1',
          name: 'AI Bridge MVP Test',
          cvr: 14.2
        }
      };

      mockConvexClient.query.mockResolvedValue(mockRealTimeMetrics);

      const metrics = await metricsService.getRealTimeMetrics();

      expect(mockConvexClient.query).toHaveBeenCalledWith('metrics:getRealTimeMetrics');
      expect(metrics.currentSessions).toBe(5);
      expect(metrics.topPerformingSession.cvr).toBe(14.2);
    });

    it('アラート条件をチェックできる', () => {
      const metrics = {
        cvr: 8.5,  // 目標10%を下回る
        cpa: 350,  // 目標300を上回る
        sessions: 500
      };

      const alertConfig = {
        cvrThreshold: 10.0,
        cpaThreshold: 300,
        sessionsMinimum: 100
      };

      const alerts = metricsService.checkAlerts(metrics, alertConfig);

      expect(alerts).toHaveLength(2);
      expect(alerts[0].type).toBe('cvr_below_threshold');
      expect(alerts[1].type).toBe('cpa_above_threshold');
    });
  });
});