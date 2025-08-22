import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// 自動化実行ログ記録
export const logExecution = mutation({
  args: {
    workspace_id: v.optional(v.string()),
    session_id: v.id("lpValidationSessions"),
    execution_type: v.union(
      v.literal("google_ads_optimization"),
      v.literal("lp_content_optimization"),
      v.literal("phase_gate_evaluation")
    ),
    status: v.union(
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
    input_data: v.optional(v.any()),
    execution_details: v.optional(v.any()),
    output_data: v.optional(v.any()),
    metrics_before: v.optional(v.any()),
    metrics_after: v.optional(v.any()),
    ai_reasoning: v.optional(v.string()),
    confidence_score: v.optional(v.number()),
    error_message: v.optional(v.string()),
    duration_ms: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.session_id);
    if (!session) {
      throw new Error("Session not found");
    }
    
    const now = Date.now();
    const execution_id = `exec-${args.execution_type}-${now}`;
    
    const executionData = {
      workspace_id: args.workspace_id || session.workspace_id,
      session_id: args.session_id,
      execution_id,
      execution_type: args.execution_type,
      status: args.status,
      input_data: args.input_data,
      execution_details: args.execution_details,
      output_data: args.output_data,
      metrics_before: args.metrics_before,
      metrics_after: args.metrics_after,
      impact_analysis: undefined,
      ai_reasoning: args.ai_reasoning,
      confidence_score: args.confidence_score,
      started_at: now,
      completed_at: args.status === 'completed' || args.status === 'failed' ? now : undefined,
      duration_ms: args.duration_ms,
      error_message: args.error_message,
      retry_count: 0,
      created_at: now,
    };
    
    return await ctx.db.insert("automationExecutions", executionData);
  },
});

// 実行ログ取得
export const getExecution = query({
  args: {
    executionId: v.id("automationExecutions"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.executionId);
  },
});

// セッション別実行履歴取得
export const getExecutionHistory = query({
  args: {
    sessionId: v.id("lpValidationSessions"),
    limit: v.optional(v.number()),
    execution_type: v.optional(v.union(
      v.literal("google_ads_optimization"),
      v.literal("lp_content_optimization"),
      v.literal("phase_gate_evaluation")
    )),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("automationExecutions")
      .withIndex("by_session", (q) => q.eq("session_id", args.sessionId));
    
    const executions = await query.collect();
    
    // フィルタリング
    let filtered = executions;
    if (args.execution_type) {
      filtered = executions.filter(e => e.execution_type === args.execution_type);
    }
    
    // 新しい順でソート
    filtered.sort((a, b) => b.created_at - a.created_at);
    
    return filtered.slice(0, args.limit ?? 50);
  },
});

// 実行統計取得
export const getExecutionStats = query({
  args: {
    sessionId: v.id("lpValidationSessions"),
    execution_type: v.optional(v.union(
      v.literal("google_ads_optimization"),
      v.literal("lp_content_optimization"),
      v.literal("phase_gate_evaluation")
    )),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const executions = await ctx.db
      .query("automationExecutions")
      .withIndex("by_session", (q) => q.eq("session_id", args.sessionId))
      .collect();
    
    // フィルタリング
    let filtered = executions;
    
    if (args.execution_type) {
      filtered = executions.filter(e => e.execution_type === args.execution_type);
    }
    
    if (args.days) {
      const cutoffTime = Date.now() - (args.days * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(e => e.created_at >= cutoffTime);
    }
    
    const total = filtered.length;
    const successful = filtered.filter(e => e.status === 'completed').length;
    const failed = filtered.filter(e => e.status === 'failed').length;
    const running = filtered.filter(e => e.status === 'running').length;
    
    const durations = filtered
      .filter(e => e.duration_ms !== undefined)
      .map(e => e.duration_ms!);
    
    const avgDuration = durations.length > 0 
      ? durations.reduce((a, b) => a + b, 0) / durations.length
      : 0;
    
    return {
      total_executions: total,
      successful_executions: successful,
      failed_executions: failed,
      running_executions: running,
      success_rate: total > 0 ? successful / total : 0,
      avg_duration_ms: Math.round(avgDuration),
      last_execution_at: filtered.length > 0 
        ? Math.max(...filtered.map(e => e.created_at)) 
        : undefined,
    };
  },
});

// 実行更新（ステータス変更等）
export const updateExecution = mutation({
  args: {
    executionId: v.id("automationExecutions"),
    status: v.optional(v.union(
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    )),
    output_data: v.optional(v.any()),
    metrics_after: v.optional(v.any()),
    error_message: v.optional(v.string()),
    duration_ms: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const updateData: any = {};
    
    if (args.status) {
      updateData.status = args.status;
      if (args.status === 'completed' || args.status === 'failed') {
        updateData.completed_at = Date.now();
      }
    }
    
    if (args.output_data) updateData.output_data = args.output_data;
    if (args.metrics_after) updateData.metrics_after = args.metrics_after;
    if (args.error_message) updateData.error_message = args.error_message;
    if (args.duration_ms) updateData.duration_ms = args.duration_ms;
    
    await ctx.db.patch(args.executionId, updateData);
  },
});

// 実行失敗時のリトライカウント増加
export const incrementRetryCount = mutation({
  args: {
    executionId: v.id("automationExecutions"),
  },
  handler: async (ctx, args) => {
    const execution = await ctx.db.get(args.executionId);
    if (!execution) {
      throw new Error("Execution not found");
    }
    
    await ctx.db.patch(args.executionId, {
      retry_count: execution.retry_count + 1,
    });
  },
});

// 古い実行ログのクリーンアップ（30日以上前）
export const cleanupOldExecutions = mutation({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const cutoffDays = args.days ?? 30;
    const cutoffTime = Date.now() - (cutoffDays * 24 * 60 * 60 * 1000);
    
    const oldExecutions = await ctx.db
      .query("automationExecutions")
      .filter((q) => q.lt(q.field("created_at"), cutoffTime))
      .collect();
    
    for (const execution of oldExecutions) {
      await ctx.db.delete(execution._id);
    }
    
    return { deleted_count: oldExecutions.length };
  },
});