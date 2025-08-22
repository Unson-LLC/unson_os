import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { ConvexTestingHelper } from 'convex/testing';
import { api } from '../_generated/api';
import { Id } from '../_generated/dataModel';

// t_wada式TDD: REDフェーズ - まず失敗するテストから
describe('LP Validation CRUD Functions', () => {
  let t: ConvexTestingHelper;

  beforeEach(async () => {
    t = new ConvexTestingHelper();
    await t.run(async (ctx) => {
      // テストデータクリーンアップ
      await ctx.db.delete(ctx.db.query('lpValidationSessions').collect());
      await ctx.db.delete(ctx.db.query('automationExecutions').collect());
      await ctx.db.delete(ctx.db.query('systemAlerts').collect());
    });
  });

  describe('LP検証セッション管理', () => {
    it('新しいLP検証セッションを作成できる', async () => {
      // Arrange
      const sessionData = {
        workspace_id: 'ws-001',
        product_id: 'prod-001',
        product_name: 'AI Bridge',
        status: 'active' as const,
        google_ads_campaign_id: 'campaign-123',
        target_cvr: 10.0,
        target_cpa: 300,
        daily_budget_limit: 5000,
        automation_settings: {
          auto_bid_adjustment: true,
          auto_keyword_pause: true,
          auto_lp_improvement: false,
        },
        playbook_id: 'PB-001',
        current_phase: 1,
      };

      // Act
      const sessionId = await t.mutation(api.lpValidation.createSession, sessionData);

      // Assert
      expect(sessionId).toBeDefined();
      
      const session = await t.query(api.lpValidation.getSession, { 
        sessionId 
      });
      
      expect(session).toMatchObject({
        workspace_id: 'ws-001',
        product_id: 'prod-001',
        product_name: 'AI Bridge',
        status: 'active',
        target_cvr: 10.0,
        target_cpa: 300,
        current_phase: 1,
      });
      expect(session.created_at).toBeDefined();
      expect(session.updated_at).toBeDefined();
    });

    it('セッションのステータスを更新できる', async () => {
      // Arrange
      const sessionId = await t.mutation(api.lpValidation.createSession, {
        workspace_id: 'ws-001',
        product_id: 'prod-001',
        product_name: 'Test Product',
        status: 'active' as const,
        target_cvr: 10.0,
        target_cpa: 300,
        daily_budget_limit: 5000,
        automation_settings: {
          auto_bid_adjustment: true,
          auto_keyword_pause: true,
          auto_lp_improvement: false,
        },
      });

      // Act
      await t.mutation(api.lpValidation.updateSessionStatus, {
        sessionId,
        status: 'paused',
        reason: 'Budget limit reached',
      });

      // Assert
      const session = await t.query(api.lpValidation.getSession, { sessionId });
      expect(session.status).toBe('paused');
      expect(session.status_reason).toBe('Budget limit reached');
      expect(session.updated_at).toBeDefined();
    });

    it('ワークスペース内の全アクティブセッションを取得できる', async () => {
      // Arrange
      await t.mutation(api.lpValidation.createSession, {
        workspace_id: 'ws-001',
        product_id: 'prod-001',
        product_name: 'Product 1',
        status: 'active' as const,
        target_cvr: 10.0,
        target_cpa: 300,
        daily_budget_limit: 5000,
        automation_settings: { auto_bid_adjustment: true, auto_keyword_pause: false, auto_lp_improvement: false },
      });
      
      await t.mutation(api.lpValidation.createSession, {
        workspace_id: 'ws-001',
        product_id: 'prod-002',
        product_name: 'Product 2',
        status: 'completed' as const,
        target_cvr: 10.0,
        target_cpa: 300,
        daily_budget_limit: 5000,
        automation_settings: { auto_bid_adjustment: true, auto_keyword_pause: false, auto_lp_improvement: false },
      });

      await t.mutation(api.lpValidation.createSession, {
        workspace_id: 'ws-002',
        product_id: 'prod-003',
        product_name: 'Product 3',
        status: 'active' as const,
        target_cvr: 10.0,
        target_cpa: 300,
        daily_budget_limit: 5000,
        automation_settings: { auto_bid_adjustment: true, auto_keyword_pause: false, auto_lp_improvement: false },
      });

      // Act
      const activeSessions = await t.query(api.lpValidation.getActiveSessionsByWorkspace, {
        workspaceId: 'ws-001',
      });

      // Assert
      expect(activeSessions).toHaveLength(1);
      expect(activeSessions[0].product_name).toBe('Product 1');
    });

    it('セッションメトリクスを更新できる', async () => {
      // Arrange
      const sessionId = await t.mutation(api.lpValidation.createSession, {
        workspace_id: 'ws-001',
        product_id: 'prod-001',
        product_name: 'Test Product',
        status: 'active' as const,
        target_cvr: 10.0,
        target_cpa: 300,
        daily_budget_limit: 5000,
        automation_settings: { auto_bid_adjustment: true, auto_keyword_pause: false, auto_lp_improvement: false },
      });

      const metrics = {
        impressions: 10000,
        clicks: 500,
        conversions: 50,
        cost: 15000,
        cvr: 10.0,
        cpa: 300,
        sessions: 450,
        bounce_rate: 35.5,
        avg_session_duration: 180,
      };

      // Act
      await t.mutation(api.lpValidation.updateSessionMetrics, {
        sessionId,
        metrics,
      });

      // Assert
      const session = await t.query(api.lpValidation.getSession, { sessionId });
      expect(session.current_metrics).toMatchObject(metrics);
      expect(session.updated_at).toBeDefined();
    });
  });

  describe('自動化実行ログ管理', () => {
    it('自動化実行ログを記録できる', async () => {
      // Arrange
      const sessionId = await t.mutation(api.lpValidation.createSession, {
        workspace_id: 'ws-001',
        product_id: 'prod-001',
        product_name: 'Test Product',
        status: 'active' as const,
        target_cvr: 10.0,
        target_cpa: 300,
        daily_budget_limit: 5000,
        automation_settings: { auto_bid_adjustment: true, auto_keyword_pause: false, auto_lp_improvement: false },
      });

      const executionData = {
        session_id: sessionId,
        automation_type: 'google_ads_optimization' as const,
        trigger: 'scheduled' as const,
        status: 'success' as const,
        actions_taken: [
          {
            type: 'adjust_bid',
            keyword_id: 'kw-001',
            old_bid: 50,
            new_bid: 40,
            reason: 'High CPA reduction',
          },
        ],
        metrics_before: {
          cpa: 450,
          cvr: 8.5,
          cost: 12000,
        },
        duration_ms: 2340,
      };

      // Act
      const executionId = await t.mutation(api.automationExecutions.logExecution, executionData);

      // Assert
      expect(executionId).toBeDefined();
      
      const execution = await t.query(api.automationExecutions.getExecution, { 
        executionId 
      });
      
      expect(execution).toMatchObject({
        session_id: sessionId,
        automation_type: 'google_ads_optimization',
        status: 'success',
        actions_taken: executionData.actions_taken,
        duration_ms: 2340,
      });
      expect(execution.executed_at).toBeDefined();
    });

    it('セッション別の実行履歴を取得できる', async () => {
      // Arrange
      const sessionId = await t.mutation(api.lpValidation.createSession, {
        workspace_id: 'ws-001',
        product_id: 'prod-001',
        product_name: 'Test Product',
        status: 'active' as const,
        target_cvr: 10.0,
        target_cpa: 300,
        daily_budget_limit: 5000,
        automation_settings: { auto_bid_adjustment: true, auto_keyword_pause: false, auto_lp_improvement: false },
      });

      // 複数の実行ログを作成
      await t.mutation(api.automationExecutions.logExecution, {
        session_id: sessionId,
        automation_type: 'google_ads_optimization' as const,
        trigger: 'scheduled' as const,
        status: 'success' as const,
        actions_taken: [],
        duration_ms: 1000,
      });

      await t.mutation(api.automationExecutions.logExecution, {
        session_id: sessionId,
        automation_type: 'lp_improvement' as const,
        trigger: 'manual' as const,
        status: 'failed' as const,
        actions_taken: [],
        error_message: 'OpenAI API rate limit',
        duration_ms: 500,
      });

      // Act
      const executions = await t.query(api.automationExecutions.getExecutionHistory, {
        sessionId,
        limit: 10,
      });

      // Assert
      expect(executions).toHaveLength(2);
      expect(executions[0].automation_type).toBe('lp_improvement'); // 新しい順
      expect(executions[1].automation_type).toBe('google_ads_optimization');
    });

    it('実行統計を取得できる', async () => {
      // Arrange
      const sessionId = await t.mutation(api.lpValidation.createSession, {
        workspace_id: 'ws-001',
        product_id: 'prod-001',
        product_name: 'Test Product',
        status: 'active' as const,
        target_cvr: 10.0,
        target_cpa: 300,
        daily_budget_limit: 5000,
        automation_settings: { auto_bid_adjustment: true, auto_keyword_pause: false, auto_lp_improvement: false },
      });

      // 成功・失敗の実行ログを作成
      for (let i = 0; i < 5; i++) {
        await t.mutation(api.automationExecutions.logExecution, {
          session_id: sessionId,
          automation_type: 'google_ads_optimization' as const,
          trigger: 'scheduled' as const,
          status: 'success' as const,
          actions_taken: [],
          duration_ms: 1000 + i * 100,
        });
      }

      for (let i = 0; i < 2; i++) {
        await t.mutation(api.automationExecutions.logExecution, {
          session_id: sessionId,
          automation_type: 'google_ads_optimization' as const,
          trigger: 'scheduled' as const,
          status: 'failed' as const,
          actions_taken: [],
          error_message: 'Test error',
          duration_ms: 500,
        });
      }

      // Act
      const stats = await t.query(api.automationExecutions.getExecutionStats, {
        sessionId,
        automationType: 'google_ads_optimization',
      });

      // Assert
      expect(stats).toMatchObject({
        total_executions: 7,
        successful_executions: 5,
        failed_executions: 2,
        success_rate: 5/7,
        avg_duration_ms: expect.any(Number),
      });
    });
  });

  describe('システムアラート管理', () => {
    it('新しいアラートを作成できる', async () => {
      // Arrange
      const sessionId = await t.mutation(api.lpValidation.createSession, {
        workspace_id: 'ws-001',
        product_id: 'prod-001',
        product_name: 'Test Product',
        status: 'active' as const,
        target_cvr: 10.0,
        target_cpa: 300,
        daily_budget_limit: 5000,
        automation_settings: { auto_bid_adjustment: true, auto_keyword_pause: false, auto_lp_improvement: false },
      });

      const alertData = {
        session_id: sessionId,
        alert_type: 'budget_exceeded' as const,
        severity: 'critical' as const,
        message: '日次予算上限¥5,000を超過しました',
        metadata: {
          current_spend: 5500,
          budget_limit: 5000,
          overage_amount: 500,
        },
      };

      // Act
      const alertId = await t.mutation(api.systemAlerts.createAlert, alertData);

      // Assert
      expect(alertId).toBeDefined();
      
      const alert = await t.query(api.systemAlerts.getAlert, { alertId });
      expect(alert).toMatchObject({
        session_id: sessionId,
        alert_type: 'budget_exceeded',
        severity: 'critical',
        message: '日次予算上限¥5,000を超過しました',
        status: 'active',
      });
      expect(alert.created_at).toBeDefined();
    });

    it('アラートを解決済みにマークできる', async () => {
      // Arrange
      const sessionId = await t.mutation(api.lpValidation.createSession, {
        workspace_id: 'ws-001',
        product_id: 'prod-001',
        product_name: 'Test Product',
        status: 'active' as const,
        target_cvr: 10.0,
        target_cpa: 300,
        daily_budget_limit: 5000,
        automation_settings: { auto_bid_adjustment: true, auto_keyword_pause: false, auto_lp_improvement: false },
      });

      const alertId = await t.mutation(api.systemAlerts.createAlert, {
        session_id: sessionId,
        alert_type: 'low_performance' as const,
        severity: 'warning' as const,
        message: 'CVRが目標値を下回っています',
        metadata: { current_cvr: 7.5, target_cvr: 10.0 },
      });

      // Act
      await t.mutation(api.systemAlerts.resolveAlert, {
        alertId,
        resolution_note: 'LP改善により解決',
      });

      // Assert
      const alert = await t.query(api.systemAlerts.getAlert, { alertId });
      expect(alert.status).toBe('resolved');
      expect(alert.resolution_note).toBe('LP改善により解決');
      expect(alert.resolved_at).toBeDefined();
    });

    it('アクティブなアラート一覧を取得できる', async () => {
      // Arrange
      const sessionId = await t.mutation(api.lpValidation.createSession, {
        workspace_id: 'ws-001',
        product_id: 'prod-001',
        product_name: 'Test Product',
        status: 'active' as const,
        target_cvr: 10.0,
        target_cpa: 300,
        daily_budget_limit: 5000,
        automation_settings: { auto_bid_adjustment: true, auto_keyword_pause: false, auto_lp_improvement: false },
      });

      // アクティブなアラート
      await t.mutation(api.systemAlerts.createAlert, {
        session_id: sessionId,
        alert_type: 'high_cpa' as const,
        severity: 'warning' as const,
        message: 'CPAが目標値を上回っています',
        metadata: { current_cpa: 450, target_cpa: 300 },
      });

      // 解決済みアラート
      const resolvedAlertId = await t.mutation(api.systemAlerts.createAlert, {
        session_id: sessionId,
        alert_type: 'low_performance' as const,
        severity: 'info' as const,
        message: 'パフォーマンス低下',
        metadata: {},
      });

      await t.mutation(api.systemAlerts.resolveAlert, {
        alertId: resolvedAlertId,
        resolution_note: 'Resolved',
      });

      // Act
      const activeAlerts = await t.query(api.systemAlerts.getActiveAlerts, {
        sessionId,
      });

      // Assert
      expect(activeAlerts).toHaveLength(1);
      expect(activeAlerts[0].alert_type).toBe('high_cpa');
      expect(activeAlerts[0].status).toBe('active');
    });
  });
});