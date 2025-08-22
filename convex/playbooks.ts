import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// プレイブック一覧取得
export const getPlaybooks = query({
  args: { 
    workspace_id: v.string(),
    category: v.optional(v.string()) 
  },
  handler: async (ctx, args) => {
    if (args.category) {
      return await ctx.db
        .query("playbooks")
        .withIndex("by_workspace_category", (q) => 
          q.eq("workspace_id", args.workspace_id).eq("category", args.category))
        .order("desc")
        .collect();
    }
    return await ctx.db
      .query("playbooks")
      .withIndex("by_workspace_id", (q) => q.eq("workspace_id", args.workspace_id))
      .order("desc")
      .collect();
  },
});

// プレイブック詳細取得
export const getPlaybook = query({
  args: { 
    workspace_id: v.string(),
    id: v.string() 
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("playbooks")
      .withIndex("by_workspace_id", (q) => 
        q.eq("workspace_id", args.workspace_id).eq("id", args.id))
      .first();
  },
});

// プレイブック実行開始
export const startPlaybookRun = mutation({
  args: {
    workspace_id: v.string(),
    productId: v.string(),
    productName: v.string(),
    playbookId: v.string(),
    phase: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    return await ctx.db.insert("playbookRuns", {
      workspace_id: args.workspace_id,
      productId: args.productId,
      productName: args.productName,
      playbookId: args.playbookId,
      phase: args.phase,
      status: "running",
      startedAt: now,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// プレイブック実行完了
export const completePlaybookRun = mutation({
  args: {
    runId: v.id("playbookRuns"),
    actualMetrics: v.array(v.object({
      name: v.string(),
      actualValue: v.string(),
      achievedAt: v.number(),
    })),
    lessons: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    return await ctx.db.patch(args.runId, {
      status: "completed",
      completedAt: now,
      actualMetrics: args.actualMetrics,
      lessons: args.lessons,
      notes: args.notes,
      updatedAt: now,
    });
  },
});

// プロダクトのプレイブック実行履歴取得
export const getProductPlaybookRuns = query({
  args: { 
    workspace_id: v.string(),
    productId: v.string() 
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("playbookRuns")
      .withIndex("by_workspace_product", (q) => 
        q.eq("workspace_id", args.workspace_id).eq("productId", args.productId))
      .order("desc")
      .collect();
  },
});

// フェーズレビュー作成
export const createPhaseReview = mutation({
  args: {
    workspace_id: v.string(),
    productId: v.string(),
    productName: v.string(),
    phase: v.number(),
    kpiResults: v.array(v.object({
      metric: v.string(),
      target: v.string(),
      actual: v.optional(v.string()),
      achieved: v.optional(v.boolean()),
    })),
    executedPlaybooks: v.array(v.string()),
    keyLearnings: v.array(v.string()),
    nextActions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    return await ctx.db.insert("phaseReviews", {
      workspace_id: args.workspace_id,
      productId: args.productId,
      productName: args.productName,
      phase: args.phase,
      status: "in_progress",
      startDate: now,
      kpiResults: args.kpiResults,
      executedPlaybooks: args.executedPlaybooks,
      keyLearnings: args.keyLearnings,
      nextActions: args.nextActions,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// フェーズゲート判定
export const makeGateDecision = mutation({
  args: {
    reviewId: v.id("phaseReviews"),
    decision: v.union(v.literal("proceed"), v.literal("retry"), v.literal("pivot"), v.literal("terminate")),
    reason: v.string(),
    decidedBy: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    return await ctx.db.patch(args.reviewId, {
      status: args.decision === "proceed" ? "gate_passed" : "gate_failed",
      endDate: now,
      gateDecision: {
        decision: args.decision,
        reason: args.reason,
        decidedAt: now,
        decidedBy: args.decidedBy,
      },
      updatedAt: now,
    });
  },
});

// プロダクトのフェーズレビュー履歴取得
export const getProductPhaseReviews = query({
  args: { 
    workspace_id: v.string(),
    productId: v.string() 
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("phaseReviews")
      .withIndex("by_workspace_product", (q) => 
        q.eq("workspace_id", args.workspace_id).eq("productId", args.productId))
      .order("desc")
      .collect();
  },
});

// プレイブック作成
export const createPlaybook = mutation({
  args: {
    workspace_id: v.string(),
    id: v.string(),
    name: v.string(),
    description: v.string(),
    version: v.string(),
    category: v.string(),
    steps: v.array(v.object({
      stepNumber: v.number(),
      title: v.string(),
      description: v.string(),
      estimatedTime: v.optional(v.string()),
      requiredTools: v.optional(v.array(v.string())),
      successCriteria: v.array(v.string()),
    })),
    successMetrics: v.array(v.object({
      name: v.string(),
      targetValue: v.string(),
      measurement: v.string(),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("playbooks", args);
  },
});