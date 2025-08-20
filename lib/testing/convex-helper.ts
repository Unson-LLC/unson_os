// Convex統合テスト用ヘルパークラス
import { ConvexClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

export interface LPValidationSessionData {
  workspace_id: string;
  product_id: string;
  product_name: string;
  lp_url: string;
  status: 'active' | 'paused' | 'completed' | 'failed';
  target_cvr: number;
  target_cpa: number;
  min_sessions: number;
  google_ads_campaign_id?: string;
  current_cvr?: number;
  current_cpa?: number;
  total_sessions?: number;
  total_conversions?: number;
  total_spend?: number;
  statistical_significance?: boolean;
}

export interface SessionMetrics {
  total_sessions: number;
  total_conversions: number;
  total_spend: number;
  current_cvr: number;
  current_cpa: number;
  statistical_significance: boolean;
}

export interface OptimizationResult {
  success: boolean;
  execution_id?: string;
  actions_taken?: Array<{
    type: string;
    keyword_id: string;
    [key: string]: any;
  }>;
  metrics_improvement?: {
    expected_cpa_reduction: number;
    expected_cvr_increase: number;
  };
  error_type?: string;
  retry_scheduled?: boolean;
  next_retry_at?: number;
}

export interface ImprovementResult {
  success: boolean;
  execution_id?: string;
  suggestions?: Array<{
    section: string;
    current_content: string;
    suggested_content: string;
    reasoning: string;
    expected_impact: {
      cvr_increase_estimate: number;
    };
  }>;
  github_pr_created?: boolean;
  pr_url?: string;
}

export interface PhaseEvaluationResult {
  success: boolean;
  execution_id?: string;
  phase_transition_ready: boolean;
  current_phase: number;
  next_phase?: number;
  achievements: {
    cvr_achieved: boolean;
    cpa_achieved: boolean;
    statistical_significance_achieved: boolean;
    minimum_sessions_achieved: boolean;
  };
  recommendations: string[];
}

export class ConvexTestingHelper {
  private client: ConvexClient;
  private testWorkspaceId: string;
  
  constructor() {
    this.client = new ConvexClient(process.env.CONVEX_URL || 'https://test.convex.dev');
    this.testWorkspaceId = `test-ws-${Date.now()}`;
  }
  
  async setup(): Promise<void> {
    // テスト環境初期化
    await this.client.mutation(api.testing.initializeTestEnvironment, {
      workspace_id: this.testWorkspaceId,
    });
  }
  
  async cleanup(): Promise<void> {
    // テストデータクリーンアップ
    await this.client.mutation(api.testing.cleanupTestEnvironment, {
      workspace_id: this.testWorkspaceId,
    });
    await this.client.close();
  }
  
  async resetData(): Promise<void> {
    // テストデータリセット
    await this.client.mutation(api.testing.resetTestData, {
      workspace_id: this.testWorkspaceId,
    });
  }
  
  async createLPValidationSession(data: LPValidationSessionData): Promise<Id<'lpValidationSessions'>> {
    const sessionData = {
      ...data,
      workspace_id: this.testWorkspaceId,
      start_date: Date.now(),
      current_cvr: data.current_cvr || 0,
      current_cpa: data.current_cpa || 0,
      total_sessions: data.total_sessions || 0,
      total_conversions: data.total_conversions || 0,
      total_spend: data.total_spend || 0,
      statistical_significance: data.statistical_significance || false,
    };
    
    return await this.client.mutation(api.lpValidation.createSession, sessionData);
  }
  
  async getSession(sessionId: Id<'lpValidationSessions'>) {
    return await this.client.query(api.lpValidation.getSession, { session_id: sessionId });
  }
  
  async updateSessionMetrics(
    sessionId: Id<'lpValidationSessions'>, 
    metrics: SessionMetrics
  ): Promise<void> {
    await this.client.mutation(api.lpValidation.updateMetrics, {
      session_id: sessionId,
      ...metrics,
    });
  }
  
  async triggerGoogleAdsOptimization(sessionId: Id<'lpValidationSessions'>): Promise<OptimizationResult> {
    try {
      const result = await this.client.action(api.automation.optimizeGoogleAds, {
        session_id: sessionId,
      });
      
      return {
        success: true,
        execution_id: result.execution_id,
        actions_taken: result.actions || [],
        metrics_improvement: result.metrics_improvement,
      };
    } catch (error: any) {
      return {
        success: false,
        error_type: error.name || 'UNKNOWN_ERROR',
        retry_scheduled: error.retry_scheduled || false,
        next_retry_at: error.next_retry_at,
      };
    }
  }
  
  async triggerLPImprovementGeneration(sessionId: Id<'lpValidationSessions'>): Promise<ImprovementResult> {
    try {
      const result = await this.client.action(api.automation.generateLPImprovements, {
        session_id: sessionId,
      });
      
      return {
        success: true,
        execution_id: result.execution_id,
        suggestions: result.suggestions || [],
        github_pr_created: result.github_pr_created || false,
        pr_url: result.pr_url,
      };
    } catch (error: any) {
      if (error.message?.includes('TIMEOUT')) {
        throw new Error('EXECUTION_TIMEOUT');
      }
      throw error;
    }
  }
  
  async triggerPhaseGateEvaluation(sessionId: Id<'lpValidationSessions'>): Promise<PhaseEvaluationResult> {
    const result = await this.client.action(api.automation.evaluatePhaseGate, {
      session_id: sessionId,
    });
    
    return {
      success: true,
      execution_id: result.execution_id,
      phase_transition_ready: result.phase_transition_ready,
      current_phase: result.current_phase,
      next_phase: result.next_phase,
      achievements: result.achievements,
      recommendations: result.recommendations || [],
    };
  }
  
  async getExecutionLogs(sessionId: Id<'lpValidationSessions'>) {
    return await this.client.query(api.automationExecutions.getBySession, {
      session_id: sessionId,
    });
  }
  
  async getSystemAlerts(sessionId: Id<'lpValidationSessions'>) {
    return await this.client.query(api.systemAlerts.getBySession, {
      session_id: sessionId,
    });
  }
  
  // モック用メソッド群
  mockGoogleAdsResponse(campaignData: any) {
    // Google Ads APIレスポンスをモック
    return {
      id: campaignData.id || 'mock-campaign-001',
      name: campaignData.name || 'Mock Campaign',
      status: campaignData.status || 'ENABLED',
      budget: campaignData.budget || 10000,
      metrics: {
        impressions: campaignData.impressions || 10000,
        clicks: campaignData.clicks || 200,
        conversions: campaignData.conversions || 20,
        cost_micros: (campaignData.cost || 2000) * 1000000,
      },
    };
  }
  
  mockOpenAIResponse(suggestions: any[]) {
    return {
      choices: [{
        message: {
          content: JSON.stringify({
            suggestions: suggestions.map(s => ({
              section: s.section,
              reasoning: s.reasoning,
              current_content: s.current_content,
              suggested_content: s.suggested_content,
              expected_impact: s.expected_impact,
            })),
          }),
        },
      }],
    };
  }
  
  async waitForExecution(
    executionId: string, 
    timeoutMs: number = 30000
  ): Promise<any> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeoutMs) {
      const execution = await this.client.query(api.automationExecutions.getById, {
        execution_id: executionId,
      });
      
      if (execution && execution.status !== 'running') {
        return execution;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error(`Execution ${executionId} timed out after ${timeoutMs}ms`);
  }
  
  async simulateRealTimeMetricsUpdate(
    sessionId: Id<'lpValidationSessions'>,
    duration: number = 5000,
    updateInterval: number = 1000
  ): Promise<void> {
    const startTime = Date.now();
    let sessionCount = 100;
    let conversionCount = 8;
    
    const updateMetrics = async () => {
      sessionCount += Math.floor(Math.random() * 20) + 10;
      conversionCount += Math.floor(Math.random() * 3);
      
      const cvr = (conversionCount / sessionCount) * 100;
      const cpa = (sessionCount * 2.5) / conversionCount;
      
      await this.updateSessionMetrics(sessionId, {
        total_sessions: sessionCount,
        total_conversions: conversionCount,
        total_spend: sessionCount * 2.5,
        current_cvr: cvr,
        current_cpa: cpa,
        statistical_significance: sessionCount >= 1000,
      });
    };
    
    while (Date.now() - startTime < duration) {
      await updateMetrics();
      await new Promise(resolve => setTimeout(resolve, updateInterval));
    }
  }
  
  // プレイブック関連メソッド
  async getPlaybookExecution(execution_id: string) {
    return await this.client.query(api.playbook.getExecution, {
      execution_id,
    });
  }
  
  async getPhaseSteps(execution_id: string, phase_number: number) {
    return await this.client.query(api.playbook.getPhaseSteps, {
      execution_id,
      phase_number,
    });
  }
  
  async getStepExecution(step_execution_id: string) {
    return await this.client.query(api.playbook.getStepExecution, {
      step_execution_id,
    });
  }
  
  async executePlaybookStep(
    step_execution_id: string, 
    session_id: Id<'lpValidationSessions'>
  ) {
    try {
      const result = await this.client.action(api.automation.executePlaybookStep, {
        step_execution_id,
        session_id,
      });
      
      return {
        success_achieved: result.success_achieved,
        output_results: result.output_results,
        ai_analysis: result.ai_analysis,
        execution_id: result.execution_id,
      };
    } catch (error: any) {
      return {
        success_achieved: false,
        error: error.message,
      };
    }
  }
  
  async executePhaseTransition(
    execution_id: string,
    session_id: Id<'lpValidationSessions'>,
    target_phase: number
  ) {
    return await this.client.action(api.automation.executePhaseTransition, {
      execution_id,
      session_id,
      target_phase,
    });
  }
  
  async getPlaybookExecutionStats(workspace_id: string, playbook_id?: string) {
    return await this.client.query(api.playbook.getExecutionStats, {
      workspace_id: workspace_id || this.testWorkspaceId,
      playbook_id,
    });
  }
  
  async getExecutionLogs(session_id: Id<'lpValidationSessions'>, execution_type?: string) {
    const logs = await this.client.query(api.automationExecutions.getBySession, {
      session_id,
    });
    
    if (execution_type) {
      return logs.filter((log: any) => log.execution_type === execution_type);
    }
    
    return logs;
  }
}