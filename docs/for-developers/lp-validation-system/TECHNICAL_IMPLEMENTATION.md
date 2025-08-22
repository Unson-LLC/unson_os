# LP検証システムMVP 技術実装仕様書

## システムアーキテクチャ

### 全体構成図
```
┌─────────────────────────────────────────────────────────────┐
│                    Orchestration Layer                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │  Cron Manager   │  │ Event Processor │  │   Logger    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                      Service Layer                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │ Google Ads API  │  │  PostHog API    │  │ Claude API  │  │
│  │   Connector     │  │   Connector     │  │  Connector  │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                            │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐  │
│  │    Convex DB    │  │   Redis Cache   │  │ File Storage│  │
│  │   (Primary)     │  │   (Session)     │  │   (Logs)    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 技術スタック

#### Backend
- **Runtime**: Node.js 18+
- **Database**: Convex (Primary), Redis (Cache)
- **Cron Jobs**: Convex Scheduled Functions (推奨) / Vercel Cron Functions (バックアップ)
- **API Integration**: Google Ads API v18, PostHog API v1, Claude API

#### Frontend  
- **Framework**: Next.js 14 (App Router)
- **UI Library**: TailwindCSS + HeadlessUI
- **State Management**: TanStack Query + Zustand
- **Charts**: Recharts

#### Infrastructure
- **Deployment**: Vercel
- **Monitoring**: Vercel Analytics + PostHog
- **Notifications**: Slack API
- **Error Tracking**: Sentry

## 実装詳細

### 1. Convex Schema拡張

```typescript
// convex/schema.ts に追加
export default defineSchema({
  // 既存のスキーマ...
  
  // LP検証セッション管理
  lpValidationSessions: defineTable({
    workspace_id: v.string(),
    product_id: v.string(),
    session_id: v.string(), // ULID形式
    status: v.union(
      v.literal("active"), 
      v.literal("paused"), 
      v.literal("completed"),
      v.literal("failed")
    ),
    
    // 基本情報
    product_name: v.string(),
    lp_url: v.string(),
    start_date: v.number(),
    end_date: v.optional(v.number()),
    
    // 目標設定
    target_cvr: v.number(), // 0.10 for 10%
    target_cpa: v.number(), // 300 for ¥300
    min_sessions: v.number(), // 1000
    
    // 現在の実績
    current_cvr: v.number(),
    current_cpa: v.number(),
    total_sessions: v.number(),
    total_conversions: v.number(),
    total_spend: v.number(),
    
    // 統計
    statistical_significance: v.boolean(),
    confidence_interval: v.optional(v.array(v.number())), // [lower, upper]
    
    // 外部システム連携
    google_ads: v.object({
      account_id: v.string(),
      campaign_id: v.string(),
      ad_group_ids: v.array(v.string()),
      last_sync: v.number(),
    }),
    
    posthog: v.object({
      project_id: v.string(),
      api_key: v.string(),
      last_sync: v.number(),
    }),
    
    // 自動化設定
    automation: v.object({
      google_ads_optimization: v.boolean(),
      lp_content_optimization: v.boolean(),
      auto_deployment: v.boolean(),
      notification_enabled: v.boolean(),
    }),
    
    // メタデータ
    created_by: v.string(),
    created_at: v.number(),
    updated_at: v.number(),
  })
  .index("by_workspace", ["workspace_id"])
  .index("by_product", ["product_id"])
  .index("by_status", ["status"])
  .index("by_workspace_status", ["workspace_id", "status"]),

  // 自動最適化実行履歴
  automationExecutions: defineTable({
    workspace_id: v.string(),
    session_id: v.string(),
    execution_id: v.string(),
    
    execution_type: v.union(
      v.literal("google_ads_keyword_optimization"),
      v.literal("google_ads_bidding_adjustment"),
      v.literal("google_ads_ad_text_optimization"),
      v.literal("lp_content_optimization"),
      v.literal("lp_design_optimization"),
      v.literal("phase_gate_evaluation")
    ),
    
    status: v.union(
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
    
    // 実行内容
    input_data: v.any(),
    execution_details: v.any(),
    output_data: v.any(),
    
    // 結果・効果測定
    metrics_before: v.optional(v.any()),
    metrics_after: v.optional(v.any()),
    impact_analysis: v.optional(v.string()),
    
    // AI分析
    ai_reasoning: v.optional(v.string()),
    confidence_score: v.optional(v.number()),
    
    // 実行時間
    started_at: v.number(),
    completed_at: v.optional(v.number()),
    duration_ms: v.optional(v.number()),
    
    // エラー情報
    error_message: v.optional(v.string()),
    retry_count: v.number(),
    
    created_at: v.number(),
  })
  .index("by_workspace", ["workspace_id"])
  .index("by_session", ["session_id"])
  .index("by_type", ["execution_type"])
  .index("by_status", ["status"])
  .index("by_session_type", ["session_id", "execution_type"]),

  // フェーズ移行判定
  phaseTransitionEvaluations: defineTable({
    workspace_id: v.string(),
    product_id: v.string(),
    evaluation_id: v.string(),
    
    current_phase: v.number(),
    target_phase: v.number(),
    
    // KPIスナップショット
    kpi_metrics: v.object({
      cvr: v.number(),
      cpa: v.number(),
      total_sessions: v.number(),
      total_conversions: v.number(),
      total_spend: v.number(),
      duration_days: v.number(),
      statistical_significance: v.boolean(),
    }),
    
    // 判定結果
    ai_recommendation: v.union(
      v.literal("approve"),
      v.literal("reject"),
      v.literal("needs_improvement"),
      v.literal("insufficient_data")
    ),
    
    confidence_score: v.number(),
    reasoning: v.string(),
    
    // 人間の最終判断
    human_decision: v.optional(v.union(
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("deferred")
    )),
    
    decided_by: v.optional(v.string()),
    decision_notes: v.optional(v.string()),
    decided_at: v.optional(v.number()),
    
    // 改善提案（rejectの場合）
    improvement_suggestions: v.optional(v.array(v.object({
      category: v.string(),
      suggestion: v.string(),
      priority: v.union(v.literal("high"), v.literal("medium"), v.literal("low")),
      estimated_impact: v.optional(v.string()),
    }))),
    
    created_at: v.number(),
  })
  .index("by_workspace", ["workspace_id"])
  .index("by_product", ["product_id"])
  .index("by_recommendation", ["ai_recommendation"])
  .index("by_human_decision", ["human_decision"]),

  // システム監視・アラート
  systemAlerts: defineTable({
    workspace_id: v.string(),
    alert_id: v.string(),
    
    alert_type: v.union(
      v.literal("cpa_exceeded"),
      v.literal("cvr_dropped"),
      v.literal("automation_failed"),
      v.literal("api_quota_exceeded"),
      v.literal("phase_gate_ready"),
      v.literal("budget_depleted")
    ),
    
    severity: v.union(
      v.literal("critical"),
      v.literal("warning"),
      v.literal("info")
    ),
    
    title: v.string(),
    message: v.string(),
    
    // 関連リソース
    related_session_id: v.optional(v.string()),
    related_product_id: v.optional(v.string()),
    
    // アラート状態
    status: v.union(
      v.literal("active"),
      v.literal("acknowledged"),
      v.literal("resolved"),
      v.literal("dismissed")
    ),
    
    // 通知
    notification_sent: v.boolean(),
    notification_channels: v.array(v.string()), // ["slack", "email"]
    
    // 解決情報
    resolved_by: v.optional(v.string()),
    resolved_at: v.optional(v.number()),
    resolution_notes: v.optional(v.string()),
    
    created_at: v.number(),
  })
  .index("by_workspace", ["workspace_id"])
  .index("by_status", ["status"])
  .index("by_severity", ["severity"])
  .index("by_type", ["alert_type"]),
});
```

### 2. Google Ads自動最適化エンジン

```typescript
// lib/automation/google-ads-optimizer.ts

export interface OptimizationRule {
  name: string;
  condition: (metrics: AdMetrics) => boolean;
  action: (metrics: AdMetrics) => Promise<OptimizationAction>;
  confidence: number;
  priority: number;
}

export interface AdMetrics {
  keyword_id: string;
  keyword_text: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  ctr: number;
  cvr: number;
  cpa: number;
  quality_score: number;
  avg_position: number;
  bid_amount: number;
}

export interface OptimizationAction {
  type: 'adjust_bid' | 'pause_keyword' | 'change_match_type' | 'update_ad_text';
  parameters: Record<string, any>;
  expected_impact: string;
  risk_level: 'low' | 'medium' | 'high';
}

export class GoogleAdsOptimizer {
  private rules: OptimizationRule[] = [
    // ルール1: 高CPAキーワードの入札価格調整
    {
      name: 'high_cpa_bid_reduction',
      condition: (metrics) => metrics.cpa > 300 && metrics.conversions >= 3,
      action: async (metrics) => ({
        type: 'adjust_bid',
        parameters: {
          keyword_id: metrics.keyword_id,
          new_bid: Math.max(metrics.bid_amount * 0.8, 10), // 20%削減、最低10円
          reason: `CPA ¥${metrics.cpa}が目標¥300を超過`
        },
        expected_impact: 'CPA 15-25%改善見込み',
        risk_level: 'low'
      }),
      confidence: 0.9,
      priority: 1
    },

    // ルール2: 低パフォーマンスキーワードの一時停止
    {
      name: 'low_performance_pause',
      condition: (metrics) => 
        metrics.clicks >= 50 && 
        metrics.conversions === 0 && 
        metrics.ctr < 0.01,
      action: async (metrics) => ({
        type: 'pause_keyword',
        parameters: {
          keyword_id: metrics.keyword_id,
          reason: `50クリック以上でCV0、CTR ${(metrics.ctr * 100).toFixed(2)}%`
        },
        expected_impact: '無駄な広告費削減',
        risk_level: 'medium'
      }),
      confidence: 0.85,
      priority: 2
    },

    // ルール3: 高パフォーマンスキーワードの入札強化
    {
      name: 'high_performance_bid_increase',
      condition: (metrics) => 
        metrics.cpa < 200 && 
        metrics.cvr > 0.15 && 
        metrics.avg_position > 3,
      action: async (metrics) => ({
        type: 'adjust_bid',
        parameters: {
          keyword_id: metrics.keyword_id,
          new_bid: Math.min(metrics.bid_amount * 1.3, 100), // 30%増額、最大100円
          reason: `CPA ¥${metrics.cpa}と高CVR ${(metrics.cvr * 100).toFixed(1)}%`
        },
        expected_impact: '表示回数・CV数増加見込み',
        risk_level: 'low'
      }),
      confidence: 0.8,
      priority: 3
    }
  ];

  async optimizeKeywords(sessionId: string): Promise<OptimizationExecution[]> {
    try {
      const session = await this.getValidationSession(sessionId);
      const keywords = await this.fetchKeywordPerformance(session.google_ads.campaign_id);
      
      const executions: OptimizationExecution[] = [];

      for (const keyword of keywords) {
        const applicableRules = this.rules
          .filter(rule => rule.condition(keyword))
          .sort((a, b) => b.priority - a.priority);

        if (applicableRules.length > 0) {
          const rule = applicableRules[0];
          const action = await rule.action(keyword);
          
          // 高リスクアクションは手動承認待ち
          if (action.risk_level === 'high') {
            await this.requestManualApproval(sessionId, action);
            continue;
          }

          const execution = await this.executeOptimization(sessionId, rule, action);
          executions.push(execution);
          
          // 実行間隔を空ける（API制限対策）
          await this.sleep(1000);
        }
      }

      return executions;
    } catch (error) {
      await this.logError('google_ads_optimization', error);
      throw error;
    }
  }

  private async executeOptimization(
    sessionId: string,
    rule: OptimizationRule,
    action: OptimizationAction
  ): Promise<OptimizationExecution> {
    const executionId = ulid();
    
    // 実行記録開始
    await this.logExecutionStart(executionId, sessionId, rule, action);

    try {
      let result;
      
      switch (action.type) {
        case 'adjust_bid':
          result = await this.adjustKeywordBid(action.parameters);
          break;
        case 'pause_keyword':
          result = await this.pauseKeyword(action.parameters);
          break;
        // 他のアクションタイプ...
      }

      // 実行完了記録
      await this.logExecutionComplete(executionId, result);
      
      // Slack通知
      await this.notifySlack({
        type: 'optimization_executed',
        session_id: sessionId,
        rule: rule.name,
        action: action.type,
        impact: action.expected_impact
      });

      return {
        execution_id: executionId,
        status: 'completed',
        result
      };

    } catch (error) {
      await this.logExecutionError(executionId, error);
      throw error;
    }
  }

  private async adjustKeywordBid(params: any) {
    const { keyword_id, new_bid, reason } = params;
    
    // Google Ads APIを使用して入札価格を更新
    const operation = {
      update: {
        resourceName: `customers/${this.customerId}/adGroupCriteria/${keyword_id}`,
        cpcBidMicros: new_bid * 1000000, // 円をマイクロ単位に変換
      },
      updateMask: 'cpcBidMicros',
    };

    const response = await this.googleAdsClient.adGroupCriteria.mutate([operation]);
    
    return {
      keyword_id,
      old_bid: params.old_bid,
      new_bid,
      reason,
      google_ads_response: response
    };
  }
}
```

### 3. PostHog分析エンジン

```typescript
// lib/automation/posthog-analyzer.ts

export interface UserBehaviorAnalysis {
  page_views: number;
  unique_visitors: number;
  avg_session_duration: number;
  bounce_rate: number;
  scroll_depth_avg: number;
  conversion_funnel: FunnelStep[];
  heatmap_data: HeatmapPoint[];
  drop_off_points: DropOffPoint[];
}

export interface FunnelStep {
  step_name: string;
  step_order: number;
  users_entered: number;
  users_completed: number;
  conversion_rate: number;
  avg_time_to_complete: number;
}

export interface DropOffPoint {
  element: string;
  page_section: string;
  drop_off_rate: number;
  user_count: number;
  improvement_potential: 'high' | 'medium' | 'low';
}

export class PostHogAnalyzer {
  async analyzeLPPerformance(
    sessionId: string,
    dateRange: { start: Date; end: Date }
  ): Promise<UserBehaviorAnalysis> {
    const session = await this.getValidationSession(sessionId);
    const projectId = session.posthog.project_id;
    
    // 1. 基本メトリクス取得
    const basicMetrics = await this.fetchBasicMetrics(projectId, dateRange);
    
    // 2. コンバージョンファネル分析
    const funnelData = await this.analyzeFunnel(projectId, dateRange);
    
    // 3. ヒートマップデータ取得
    const heatmapData = await this.fetchHeatmapData(projectId, dateRange);
    
    // 4. 離脱ポイント特定
    const dropOffPoints = await this.identifyDropOffPoints(projectId, dateRange);
    
    return {
      ...basicMetrics,
      conversion_funnel: funnelData,
      heatmap_data: heatmapData,
      drop_off_points: dropOffPoints
    };
  }

  private async fetchBasicMetrics(projectId: string, dateRange: any) {
    const query = `
      SELECT 
        count(*) as page_views,
        count(DISTINCT person_id) as unique_visitors,
        avg(duration) as avg_session_duration,
        countIf(events = 1) / count(*) as bounce_rate,
        avg(scroll_depth) as scroll_depth_avg
      FROM events 
      WHERE 
        project_id = '${projectId}' 
        AND timestamp >= '${dateRange.start.toISOString()}'
        AND timestamp <= '${dateRange.end.toISOString()}'
        AND event = '$pageview'
    `;
    
    return await this.executePostHogQuery(query);
  }

  private async analyzeFunnel(projectId: string, dateRange: any): Promise<FunnelStep[]> {
    // ファネルステップ定義
    const steps = [
      { name: 'LP訪問', event: '$pageview' },
      { name: 'ヒーローセクション通過', event: 'scroll_past_hero' },
      { name: '価格セクション到達', event: 'scroll_to_pricing' },
      { name: 'フォーム表示', event: 'form_viewed' },
      { name: 'フォーム開始', event: 'form_started' },
      { name: 'メール登録完了', event: 'email_signup' }
    ];

    const funnelResults: FunnelStep[] = [];
    
    for (let i = 0; i < steps.length; i++) {
      const currentStep = steps[i];
      const nextStep = steps[i + 1];
      
      const stepData = await this.calculateFunnelStep(
        projectId, 
        currentStep, 
        nextStep, 
        dateRange
      );
      
      funnelResults.push({
        step_name: currentStep.name,
        step_order: i + 1,
        ...stepData
      });
    }
    
    return funnelResults;
  }

  async generateImprovementSuggestions(
    analysis: UserBehaviorAnalysis
  ): Promise<ImprovementSuggestion[]> {
    const suggestions: ImprovementSuggestion[] = [];

    // 離脱率の高いポイントを分析
    for (const dropOff of analysis.drop_off_points) {
      if (dropOff.improvement_potential === 'high') {
        suggestions.push({
          category: 'ui_optimization',
          priority: 'high',
          suggestion: this.generateDropOffImprovement(dropOff),
          expected_impact: this.estimateImpact(dropOff),
          implementation_complexity: 'medium'
        });
      }
    }

    // スクロール深度が低い場合
    if (analysis.scroll_depth_avg < 0.6) {
      suggestions.push({
        category: 'content_optimization',
        priority: 'medium',
        suggestion: 'ページ上部のエンゲージメント向上',
        details: [
          'ヒーローセクションのCTA強化',
          '冒頭でのユーザーベネフィット明確化',
          'ビジュアル要素の改善'
        ],
        expected_impact: 'CVR 10-15%向上見込み',
        implementation_complexity: 'low'
      });
    }

    // ファネル分析による改善提案
    const bottleneckStep = this.identifyBottleneckStep(analysis.conversion_funnel);
    if (bottleneckStep) {
      suggestions.push({
        category: 'conversion_optimization',
        priority: 'high',
        suggestion: `${bottleneckStep.step_name}の最適化`,
        expected_impact: 'CVR 20-30%向上見込み',
        implementation_complexity: 'high'
      });
    }

    return suggestions;
  }
}
```

### 4. Claude Code自動実装システム

```typescript
// lib/automation/claude-code-deployer.ts

export interface CodeDeploymentRequest {
  session_id: string;
  improvement_type: 'ui_optimization' | 'content_optimization' | 'conversion_optimization';
  suggestions: ImprovementSuggestion[];
  target_lp_path: string;
  auto_deploy: boolean;
}

export class ClaudeCodeDeployer {
  async implementImprovements(request: CodeDeploymentRequest): Promise<DeploymentResult> {
    const { session_id, suggestions, target_lp_path } = request;
    
    try {
      // 1. 現在のコードベース分析
      const codeAnalysis = await this.analyzeLPCodebase(target_lp_path);
      
      // 2. 改善提案をコード変更指示に変換
      const codeInstructions = await this.convertSuggestionsToCode(
        suggestions, 
        codeAnalysis
      );
      
      // 3. Claude APIで実装コード生成
      const implementationPlan = await this.generateImplementationPlan(codeInstructions);
      
      // 4. A/Bテスト設定準備
      const abTestConfig = await this.prepareABTestConfig(implementationPlan);
      
      if (request.auto_deploy) {
        // 5. 自動デプロイ実行
        return await this.executeAutoDeployment(implementationPlan, abTestConfig);
      } else {
        // 5. PR作成（手動確認用）
        return await this.createPullRequest(implementationPlan, abTestConfig);
      }
      
    } catch (error) {
      await this.logDeploymentError(session_id, error);
      throw error;
    }
  }

  private async generateImplementationPlan(
    instructions: CodeInstruction[]
  ): Promise<ImplementationPlan> {
    const claudePrompt = `
あなたはLP最適化の専門家です。以下の改善指示に基づいて、Next.jsのReactコンポーネントの修正コードを生成してください。

改善指示:
${JSON.stringify(instructions, null, 2)}

要件:
1. TailwindCSSを使用
2. TypeScript形式
3. アクセシビリティ対応
4. モバイルレスポンシブ
5. SEO配慮
6. A/Bテスト対応（variant prop対応）

各修正について以下を含めてください:
- 変更前後のコード diff
- 変更理由
- 期待効果
- テスト観点
`;

    const response = await this.claudeClient.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      messages: [{ role: 'user', content: claudePrompt }]
    });

    return this.parseImplementationResponse(response.content);
  }

  private async executeAutoDeployment(
    plan: ImplementationPlan,
    abConfig: ABTestConfig
  ): Promise<DeploymentResult> {
    // 1. 新しいブランチ作成
    const branchName = `auto-lp-optimization-${Date.now()}`;
    await this.createBranch(branchName);
    
    // 2. コード変更適用
    for (const change of plan.changes) {
      await this.applyCodeChange(change);
    }
    
    // 3. A/Bテスト設定追加
    await this.implementABTestConfig(abConfig);
    
    // 4. テスト実行
    const testResults = await this.runAutomatedTests();
    
    if (!testResults.passed) {
      await this.rollbackChanges(branchName);
      throw new Error(`Automated tests failed: ${testResults.errors}`);
    }
    
    // 5. デプロイ実行
    await this.commitAndPush(branchName, plan.description);
    const deploymentUrl = await this.deployToVercel(branchName);
    
    // 6. A/Bテスト開始
    await this.startABTest(abConfig, deploymentUrl);
    
    return {
      status: 'deployed',
      branch: branchName,
      deployment_url: deploymentUrl,
      ab_test_id: abConfig.test_id,
      changes_applied: plan.changes.length,
      test_duration: abConfig.duration_days
    };
  }

  private async startABTest(
    config: ABTestConfig,
    deploymentUrl: string
  ): Promise<void> {
    // PostHog A/Bテスト設定
    await this.posthogClient.createFeatureFlag({
      key: config.feature_flag_key,
      name: config.test_name,
      rollout_percentage: 50, // 50/50分割
      filters: {
        groups: [
          {
            properties: [
              {
                key: 'lp_variant',
                value: ['control', 'treatment'],
                operator: 'in'
              }
            ],
            rollout_percentage: 50
          }
        ]
      }
    });

    // テスト期間後の自動評価スケジュール
    await this.scheduleABTestEvaluation(config);
  }
}
```

### 5. フロントエンド実装

```typescript
// app/lp-validation/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { useConvexAuth } from 'convex/react';
import { LPValidationDashboard } from '@/components/lp-validation/LPValidationDashboard';
import { AutomationControlPanel } from '@/components/lp-validation/AutomationControlPanel';
import { AIRecommendationPanel } from '@/components/lp-validation/AIRecommendationPanel';

export default function LPValidationPage() {
  const { isAuthenticated } = useConvexAuth();
  
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['lp-validation-sessions'],
    queryFn: async () => {
      const response = await fetch('/api/lp-validation/sessions');
      return response.json();
    },
    enabled: isAuthenticated,
    refetchInterval: 30000, // 30秒毎に更新
  });

  if (!isAuthenticated) {
    return <div>Please login to access LP validation system.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          LP検証センター
        </h1>
        
        {/* メインダッシュボード */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <LPValidationDashboard 
              sessions={sessions} 
              loading={isLoading} 
            />
          </div>
          <div>
            <AutomationControlPanel />
          </div>
        </div>
        
        {/* AI推奨パネル */}
        <AIRecommendationPanel sessions={sessions} />
      </div>
    </div>
  );
}
```

```typescript
// components/lp-validation/LPValidationDashboard.tsx
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';

interface LPValidationDashboardProps {
  sessions: ValidationSession[];
  loading: boolean;
}

export function LPValidationDashboard({ sessions, loading }: LPValidationDashboardProps) {
  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  const activeSessions = sessions?.filter(s => s.status === 'active') || [];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">
          🎯 現在の検証状況
        </h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {activeSessions.map((session) => (
            <div
              key={session.session_id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900 truncate">
                  {session.product_name}
                </h3>
                <StatusBadge status={getSessionStatus(session)} />
              </div>
              
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>CVR</span>
                    <span className={
                      session.current_cvr >= session.target_cvr 
                        ? 'text-green-600 font-medium'
                        : 'text-gray-600'
                    }>
                      {(session.current_cvr * 100).toFixed(1)}%
                    </span>
                  </div>
                  <ProgressBar
                    value={(session.current_cvr / session.target_cvr) * 100}
                    max={100}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm">
                    <span>CPA</span>
                    <span className={
                      session.current_cpa <= session.target_cpa
                        ? 'text-green-600 font-medium'
                        : 'text-yellow-600'
                    }>
                      ¥{session.current_cpa}
                    </span>
                  </div>
                  <ProgressBar
                    value={Math.min((session.target_cpa / session.current_cpa) * 100, 100)}
                    max={100}
                    variant={session.current_cpa <= session.target_cpa ? 'success' : 'warning'}
                    className="mt-1"
                  />
                </div>
                
                <div className="text-xs text-gray-500 pt-2">
                  セッション: {session.total_sessions.toLocaleString()} / {session.min_sessions.toLocaleString()}
                </div>
              </div>
              
              <button
                onClick={() => openSessionDetails(session.session_id)}
                className="mt-3 w-full text-xs bg-gray-100 hover:bg-gray-200 
                         py-1 px-2 rounded transition-colors"
              >
                詳細確認
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function getSessionStatus(session: ValidationSession): 'success' | 'warning' | 'active' {
  if (session.current_cvr >= session.target_cvr && session.current_cpa <= session.target_cpa) {
    return 'success';
  }
  if (session.current_cpa > session.target_cpa * 1.4) {
    return 'warning';
  }
  return 'active';
}
```

### 6. API Routes実装

```typescript
// app/api/lp-validation/optimize/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleAdsOptimizer } from '@/lib/automation/google-ads-optimizer';
import { PostHogAnalyzer } from '@/lib/automation/posthog-analyzer';
import { ClaudeCodeDeployer } from '@/lib/automation/claude-code-deployer';

export async function POST(req: NextRequest) {
  try {
    const { session_id, optimization_type } = await req.json();
    
    if (!session_id) {
      return NextResponse.json(
        { error: 'session_id is required' },
        { status: 400 }
      );
    }

    let result;
    
    switch (optimization_type) {
      case 'google_ads':
        const adsOptimizer = new GoogleAdsOptimizer();
        result = await adsOptimizer.optimizeKeywords(session_id);
        break;
        
      case 'lp_content':
        const posthogAnalyzer = new PostHogAnalyzer();
        const analysis = await posthogAnalyzer.analyzeLPPerformance(
          session_id,
          { start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), end: new Date() }
        );
        
        const suggestions = await posthogAnalyzer.generateImprovementSuggestions(analysis);
        
        const deployer = new ClaudeCodeDeployer();
        result = await deployer.implementImprovements({
          session_id,
          improvement_type: 'content_optimization',
          suggestions,
          target_lp_path: await getLPPath(session_id),
          auto_deploy: true
        });
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid optimization_type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Optimization error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 7. Convex Cron Jobs設定（推奨）

```typescript
// app/api/cron/google-ads-optimization/route.ts
import { NextResponse } from 'next/server';
import { GoogleAdsOptimizer } from '@/lib/automation/google-ads-optimizer';
import { SlackNotifier } from '@/lib/notifications/slack';

export async function GET() {
  try {
    // Bearer token認証（Vercel Cronからの呼び出し確認）
    const authHeader = headers().get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const optimizer = new GoogleAdsOptimizer();
    const notifier = new SlackNotifier();
    
    // アクティブなセッション取得
    const activeSessions = await getActiveValidationSessions();
    
    const results = [];
    for (const session of activeSessions) {
      try {
        const optimizations = await optimizer.optimizeKeywords(session.session_id);
        results.push({
          session_id: session.session_id,
          product_name: session.product_name,
          optimizations: optimizations.length,
          status: 'success'
        });
        
        // 重要な最適化があった場合はSlack通知
        const criticalOptimizations = optimizations.filter(
          opt => opt.action.risk_level === 'high'
        );
        
        if (criticalOptimizations.length > 0) {
          await notifier.sendMessage({
            channel: '#lp-validation-alerts',
            text: `🚨 高リスク最適化が実行されました`,
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*${session.product_name}* で${criticalOptimizations.length}件の高リスク最適化が実行されました。\n確認をお願いします。`
                }
              }
            ]
          });
        }
        
      } catch (error) {
        console.error(`Optimization failed for session ${session.session_id}:`, error);
        results.push({
          session_id: session.session_id,
          product_name: session.product_name,
          status: 'error',
          error: error.message
        });
      }
    }
    
    // 実行結果をログに記録
    await logCronExecution('google_ads_optimization', results);
    
    return NextResponse.json({
      success: true,
      processed_sessions: results.length,
      timestamp: new Date().toISOString(),
      results
    });
    
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Cron job failed' },
      { status: 500 }
    );
  }
}
```

### 8. 監視・アラート設定

```typescript
// lib/monitoring/alert-system.ts

export class AlertSystem {
  private alertRules: AlertRule[] = [
    {
      name: 'CPA_EXCEEDED',
      condition: (session) => session.current_cpa > session.target_cpa * 1.5,
      severity: 'critical',
      message: (session) => 
        `${session.product_name}のCPAが目標の150%を超過しました (¥${session.current_cpa} > ¥${session.target_cpa})`
    },
    {
      name: 'CVR_DROPPED',
      condition: (session) => 
        session.current_cvr < session.target_cvr * 0.5 && session.total_sessions > 500,
      severity: 'warning',
      message: (session) =>
        `${session.product_name}のCVRが大幅に低下しています (${(session.current_cvr * 100).toFixed(1)}%)`
    },
    {
      name: 'AUTOMATION_FAILED',
      condition: (execution) => execution.status === 'failed' && execution.retry_count >= 3,
      severity: 'critical',
      message: (execution) =>
        `自動化処理が3回連続で失敗しました: ${execution.execution_type}`
    }
  ];

  async checkAndCreateAlerts(): Promise<void> {
    // アクティブなセッションをチェック
    const sessions = await getActiveValidationSessions();
    
    for (const session of sessions) {
      for (const rule of this.alertRules) {
        if (rule.condition(session)) {
          await this.createAlert({
            workspace_id: session.workspace_id,
            alert_type: rule.name,
            severity: rule.severity,
            title: rule.name.replace('_', ' '),
            message: rule.message(session),
            related_session_id: session.session_id,
            related_product_id: session.product_id,
          });
        }
      }
    }
  }

  private async createAlert(alert: CreateAlertInput): Promise<void> {
    // 重複アラート防止
    const existingAlert = await this.findExistingAlert(alert);
    if (existingAlert) return;
    
    // アラート作成
    const alertId = await this.saveAlert(alert);
    
    // 通知送信
    await this.sendNotifications(alertId, alert);
  }
}
```

## デプロイメント設定

### Vercel設定
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/google-ads-optimization",
      "schedule": "0 */4 * * *"
    },
    {
      "path": "/api/cron/lp-content-optimization",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/phase-gate-evaluation",
      "schedule": "0 10 * * 1"
    },
    {
      "path": "/api/cron/alert-monitoring",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

### 環境変数
```bash
# .env.local
GOOGLE_ADS_CUSTOMER_ID=123456789
GOOGLE_ADS_DEVELOPER_TOKEN=your_dev_token
GOOGLE_ADS_CLIENT_ID=your_client_id
GOOGLE_ADS_CLIENT_SECRET=your_client_secret
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token

POSTHOG_PROJECT_ID=your_project_id
POSTHOG_API_KEY=your_api_key

CLAUDE_API_KEY=your_claude_api_key

SLACK_WEBHOOK_URL=your_slack_webhook

CONVEX_DEPLOYMENT=your_convex_deployment
CONVEX_DEPLOY_KEY=your_deploy_key

CRON_SECRET=your_random_secret_for_cron_auth
```

このシステムにより、LP検証プロセスが完全に自動化され、適切なタイミングでの意思決定支援が実現されます。