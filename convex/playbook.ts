// プレイブック管理 Convex関数
// PB-001連携用のCRUD操作

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// プレイブック実行作成
export const createExecution = mutation({
  args: {
    workspace_id: v.string(),
    session_id: v.string(),
    execution_id: v.string(),
    playbook_id: v.string(),
    playbook_name: v.string(),
    playbook_version: v.string(),
    status: v.union(
      v.literal("initialized"),
      v.literal("in_progress"),
      v.literal("phase_gate_pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
    current_phase: v.number(),
    total_phases: v.number(),
    phase_completion_percentage: v.number(),
    configuration: v.any(),
    next_actions: v.array(v.string()),
    kpi_targets: v.any(),
    kpi_current: v.any(),
    success_criteria_met: v.boolean(),
    started_at: v.number(),
    estimated_completion: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const executionData = {
      workspace_id: args.workspace_id,
      session_id: args.session_id,
      execution_id: args.execution_id,
      playbook_id: args.playbook_id,
      playbook_name: args.playbook_name,
      playbook_version: args.playbook_version,
      status: args.status,
      current_phase: args.current_phase,
      total_phases: args.total_phases,
      phase_completion_percentage: args.phase_completion_percentage,
      configuration: args.configuration,
      next_actions: args.next_actions,
      kpi_targets: args.kpi_targets,
      kpi_current: args.kpi_current,
      success_criteria_met: args.success_criteria_met,
      started_at: args.started_at,
      estimated_completion: args.estimated_completion,
      created_at: now,
      updated_at: now,
    };
    
    return await ctx.db.insert("playbookExecutions", executionData);
  },
});

// プレイブック実行取得
export const getExecution = query({
  args: {
    execution_id: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("playbookExecutions")
      .filter((q) => q.eq(q.field("execution_id"), args.execution_id))
      .first();
  },
});

// ワークスペースのプレイブック実行一覧
export const getWorkspaceExecutions = query({
  args: {
    workspace_id: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    
    return await ctx.db
      .query("playbookExecutions")
      .withIndex("by_workspace", (q) => q.eq("workspace_id", args.workspace_id))
      .order("desc")
      .take(limit);
  },
});

// プレイブック実行状態更新
export const updateExecutionStatus = mutation({
  args: {
    execution_id: v.string(),
    status: v.union(
      v.literal("initialized"),
      v.literal("in_progress"), 
      v.literal("phase_gate_pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
    execution_summary: v.optional(v.string()),
    lessons_learned: v.optional(v.array(v.string())),
    completed_at: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const execution = await ctx.db
      .query("playbookExecutions")
      .filter((q) => q.eq(q.field("execution_id"), args.execution_id))
      .first();
    
    if (!execution) {
      throw new Error(`プレイブック実行が見つかりません: ${args.execution_id}`);
    }
    
    const updateData: any = {
      status: args.status,
      updated_at: Date.now(),
    };
    
    if (args.execution_summary) updateData.execution_summary = args.execution_summary;
    if (args.lessons_learned) updateData.lessons_learned = args.lessons_learned;
    if (args.completed_at) updateData.completed_at = args.completed_at;
    
    await ctx.db.patch(execution._id, updateData);
    
    return { success: true };
  },
});

// プレイブック実行進捗更新
export const updateExecutionProgress = mutation({
  args: {
    execution_id: v.string(),
    phase_completion_percentage: v.number(),
    kpi_current: v.optional(v.any()),
    success_criteria_met: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const execution = await ctx.db
      .query("playbookExecutions")
      .filter((q) => q.eq(q.field("execution_id"), args.execution_id))
      .first();
    
    if (!execution) {
      throw new Error(`プレイブック実行が見つかりません: ${args.execution_id}`);
    }
    
    const updateData: any = {
      phase_completion_percentage: args.phase_completion_percentage,
      updated_at: Date.now(),
    };
    
    if (args.kpi_current) updateData.kpi_current = args.kpi_current;
    if (args.success_criteria_met !== undefined) {
      updateData.success_criteria_met = args.success_criteria_met;
    }
    
    await ctx.db.patch(execution._id, updateData);
    
    return { success: true };
  },
});

// フェーズ移行
export const updateExecutionPhase = mutation({
  args: {
    execution_id: v.string(),
    current_phase: v.number(),
    status: v.union(
      v.literal("initialized"),
      v.literal("in_progress"),
      v.literal("phase_gate_pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
    phase_completion_percentage: v.number(),
    next_actions: v.array(v.string()),
    estimated_completion: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const execution = await ctx.db
      .query("playbookExecutions")
      .filter((q) => q.eq(q.field("execution_id"), args.execution_id))
      .first();
    
    if (!execution) {
      throw new Error(`プレイブック実行が見つかりません: ${args.execution_id}`);
    }
    
    await ctx.db.patch(execution._id, {
      current_phase: args.current_phase,
      status: args.status,
      phase_completion_percentage: args.phase_completion_percentage,
      next_actions: args.next_actions,
      estimated_completion: args.estimated_completion,
      updated_at: Date.now(),
    });
    
    return { success: true };
  },
});

// ステップ実行作成
export const createStepExecution = mutation({
  args: {
    workspace_id: v.string(),
    execution_id: v.string(),
    step_execution_id: v.string(),
    phase_number: v.number(),
    step_number: v.number(),
    step_name: v.string(),
    step_type: v.union(
      v.literal("validation"),
      v.literal("optimization"),
      v.literal("content_creation"),
      v.literal("deployment"),
      v.literal("measurement"),
      v.literal("phase_gate")
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("skipped")
    ),
    input_parameters: v.any(),
    success_criteria: v.any(),
    success_achieved: v.boolean(),
    retry_count: v.number(),
    started_at: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const stepData = {
      workspace_id: args.workspace_id,
      execution_id: args.execution_id,
      step_execution_id: args.step_execution_id,
      phase_number: args.phase_number,
      step_number: args.step_number,
      step_name: args.step_name,
      step_type: args.step_type,
      status: args.status,
      input_parameters: args.input_parameters,
      success_criteria: args.success_criteria,
      success_achieved: args.success_achieved,
      retry_count: args.retry_count,
      started_at: args.started_at,
      created_at: now,
      updated_at: now,
    };
    
    return await ctx.db.insert("playbookStepExecutions", stepData);
  },
});

// ステップ実行取得
export const getStepExecution = query({
  args: {
    step_execution_id: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("playbookStepExecutions")
      .filter((q) => q.eq(q.field("step_execution_id"), args.step_execution_id))
      .first();
  },
});

// フェーズのステップ一覧取得
export const getPhaseSteps = query({
  args: {
    execution_id: v.string(),
    phase_number: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("playbookStepExecutions")
      .filter((q) => q.eq(q.field("execution_id"), args.execution_id))
      .filter((q) => q.eq(q.field("phase_number"), args.phase_number))
      .order("asc")
      .collect();
  },
});

// ステップ実行更新
export const updateStepExecution = mutation({
  args: {
    step_execution_id: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("skipped")
    ),
    output_results: v.optional(v.any()),
    success_achieved: v.optional(v.boolean()),
    ai_analysis: v.optional(v.string()),
    recommendations: v.optional(v.array(v.string())),
    completed_at: v.optional(v.number()),
    duration_ms: v.optional(v.number()),
    error_message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const stepExecution = await ctx.db
      .query("playbookStepExecutions")
      .filter((q) => q.eq(q.field("step_execution_id"), args.step_execution_id))
      .first();
    
    if (!stepExecution) {
      throw new Error(`ステップ実行が見つかりません: ${args.step_execution_id}`);
    }
    
    const updateData: any = {
      status: args.status,
      updated_at: Date.now(),
    };
    
    if (args.output_results) updateData.output_results = args.output_results;
    if (args.success_achieved !== undefined) updateData.success_achieved = args.success_achieved;
    if (args.ai_analysis) updateData.ai_analysis = args.ai_analysis;
    if (args.recommendations) updateData.recommendations = args.recommendations;
    if (args.completed_at) updateData.completed_at = args.completed_at;
    if (args.duration_ms) updateData.duration_ms = args.duration_ms;
    if (args.error_message) updateData.error_message = args.error_message;
    
    await ctx.db.patch(stepExecution._id, updateData);
    
    return { success: true };
  },
});

// アクティブなプレイブック実行一覧
export const getActiveExecutions = query({
  args: {
    workspace_id: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("playbookExecutions")
      .withIndex("by_workspace", (q) => q.eq("workspace_id", args.workspace_id))
      .filter((q) => 
        q.or(
          q.eq(q.field("status"), "initialized"),
          q.eq(q.field("status"), "in_progress"),
          q.eq(q.field("status"), "phase_gate_pending")
        )
      )
      .order("desc")
      .collect();
  },
});

// プレイブック実行統計
export const getExecutionStats = query({
  args: {
    workspace_id: v.string(),
    playbook_id: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("playbookExecutions")
      .withIndex("by_workspace", (q) => q.eq("workspace_id", args.workspace_id));
    
    if (args.playbook_id) {
      query = query.filter((q) => q.eq(q.field("playbook_id"), args.playbook_id));
    }
    
    const executions = await query.collect();
    
    const stats = {
      total_executions: executions.length,
      active_executions: executions.filter(e => 
        ['initialized', 'in_progress', 'phase_gate_pending'].includes(e.status)
      ).length,
      completed_executions: executions.filter(e => e.status === 'completed').length,
      failed_executions: executions.filter(e => e.status === 'failed').length,
      success_rate: 0,
      average_completion_time_days: 0,
      phase_distribution: {
        phase_1: executions.filter(e => e.current_phase === 1).length,
        phase_2: executions.filter(e => e.current_phase === 2).length,
        phase_3: executions.filter(e => e.current_phase === 3).length,
      },
    };
    
    if (stats.completed_executions > 0) {
      stats.success_rate = (stats.completed_executions / executions.length) * 100;
      
      const completedExecutions = executions.filter(e => e.status === 'completed' && e.completed_at);
      if (completedExecutions.length > 0) {
        const totalDuration = completedExecutions.reduce((sum, e) => {
          return sum + ((e.completed_at || 0) - e.started_at);
        }, 0);
        stats.average_completion_time_days = (totalDuration / completedExecutions.length) / (1000 * 60 * 60 * 24);
      }
    }
    
    return stats;
  },
});