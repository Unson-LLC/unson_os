import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// LP検証セッション作成
export const createSession = mutation({
  args: {
    workspace_id: v.string(),
    product_id: v.string(),
    product_name: v.string(),
    lp_url: v.optional(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("paused"),
      v.literal("completed"),
      v.literal("failed")
    ),
    target_cvr: v.number(),
    target_cpa: v.number(),
    min_sessions: v.optional(v.number()),
    google_ads_campaign_id: v.optional(v.string()),
    automation_enabled: v.optional(v.boolean()),
    auto_optimization: v.optional(v.boolean()),
    auto_deployment: v.optional(v.boolean()),
    current_playbook_id: v.optional(v.string()),
    created_by: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // セッションIDを生成
    const session_id = `session-${args.product_id}-${now}`;
    
    const sessionData = {
      workspace_id: args.workspace_id,
      product_id: args.product_id,
      session_id,
      status: args.status,
      product_name: args.product_name,
      lp_url: args.lp_url || '',
      start_date: now,
      end_date: undefined,
      target_cvr: args.target_cvr,
      target_cpa: args.target_cpa,
      min_sessions: args.min_sessions || 1000,
      current_cvr: 0,
      current_cpa: 0,
      total_sessions: 0,
      total_conversions: 0,
      total_spend: 0,
      statistical_significance: false,
      confidence_interval: undefined,
      google_ads_campaign_id: args.google_ads_campaign_id,
      posthog_project_id: undefined,
      automation_enabled: args.automation_enabled ?? true,
      auto_optimization: args.auto_optimization ?? true,
      auto_deployment: args.auto_deployment ?? false,
      current_playbook_id: args.current_playbook_id,
      current_playbook_status: undefined,
      created_by: args.created_by || 'system',
      created_at: now,
      updated_at: now,
    };
    
    return await ctx.db.insert("lpValidationSessions", sessionData);
  },
});

// セッション取得
export const getSession = query({
  args: {
    sessionId: v.id("lpValidationSessions"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sessionId);
  },
});

// セッション状態更新
export const updateSessionStatus = mutation({
  args: {
    sessionId: v.id("lpValidationSessions"),
    status: v.union(
      v.literal("active"),
      v.literal("paused"),
      v.literal("completed"),
      v.literal("failed")
    ),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const updateData: any = {
      status: args.status,
      updated_at: now,
    };
    
    // 完了・失敗時は終了日を設定
    if (args.status === 'completed' || args.status === 'failed') {
      updateData.end_date = now;
    }
    
    if (args.reason) {
      updateData.current_playbook_status = args.reason;
    }
    
    await ctx.db.patch(args.sessionId, updateData);
  },
});

// ワークスペース別アクティブセッション取得
export const getActiveSessionsByWorkspace = query({
  args: {
    workspaceId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lpValidationSessions")
      .withIndex("by_workspace_status", (q) => 
        q.eq("workspace_id", args.workspaceId).eq("status", "active")
      )
      .collect();
  },
});

// セッションメトリクス更新
export const updateSessionMetrics = mutation({
  args: {
    sessionId: v.id("lpValidationSessions"),
    metrics: v.object({
      impressions: v.optional(v.number()),
      clicks: v.optional(v.number()),
      conversions: v.optional(v.number()),
      cost: v.optional(v.number()),
      cvr: v.number(),
      cpa: v.number(),
      sessions: v.number(),
      bounce_rate: v.optional(v.number()),
      avg_session_duration: v.optional(v.number()),
    }),
    statistical_significance: v.optional(v.boolean()),
    confidence_interval: v.optional(v.array(v.number())),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }
    
    const updateData = {
      current_cvr: args.metrics.cvr,
      current_cpa: args.metrics.cpa,
      total_sessions: args.metrics.sessions,
      total_conversions: args.metrics.conversions || 0,
      total_spend: args.metrics.cost || session.total_spend,
      statistical_significance: args.statistical_significance ?? false,
      confidence_interval: args.confidence_interval,
      updated_at: Date.now(),
    };
    
    await ctx.db.patch(args.sessionId, updateData);
  },
});

// プロダクト別セッション一覧取得
export const getSessionsByProduct = query({
  args: {
    productId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lpValidationSessions")
      .withIndex("by_product", (q) => q.eq("product_id", args.productId))
      .order("desc")
      .take(args.limit ?? 10);
  },
});

// フェーズ移行判定
export const evaluatePhaseTransition = query({
  args: {
    sessionId: v.id("lpValidationSessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }
    
    // フェーズ移行基準
    const criteria = {
      cvr_achieved: session.current_cvr >= session.target_cvr,
      cpa_achieved: session.current_cpa <= session.target_cpa,
      min_sessions_achieved: session.total_sessions >= session.min_sessions,
      statistical_significance: session.statistical_significance,
    };
    
    const all_criteria_met = Object.values(criteria).every(Boolean);
    
    return {
      session_id: session.session_id,
      current_phase: session.current_playbook_id?.includes('PB-001') ? 1 : 0,
      ready_for_transition: all_criteria_met,
      criteria,
      recommendation: all_criteria_met 
        ? "フェーズ2（MVP開発）への移行を推奨"
        : "現在のフェーズを継続",
      metrics: {
        cvr: session.current_cvr,
        cpa: session.current_cpa,
        sessions: session.total_sessions,
        conversions: session.total_conversions,
      },
    };
  },
});

// セッション削除（テスト用）
export const deleteSession = mutation({
  args: {
    sessionId: v.id("lpValidationSessions"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.sessionId);
  },
});