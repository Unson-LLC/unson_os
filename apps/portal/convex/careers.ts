// Refactor Phase: 採用関連のConvex関数
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 採用応募作成
export const apply = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    position: v.string(),
    experience: v.string(),
    coverLetter: v.string(),
    portfolio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const applicationId = await ctx.db.insert("careerApplications", {
      ...args,
      status: "submitted",
      createdAt: now,
      updatedAt: now,
    });
    
    return {
      id: applicationId,
      message: "応募を受け付けました。1週間以内に選考結果をご連絡いたします。",
    };
  },
});

// 採用応募一覧取得
export const list = query({
  args: {
    position: v.optional(v.string()),
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let applications;
    
    if (args.position) {
      applications = await ctx.db
        .query("careerApplications")
        .withIndex("by_position", (q) => q.eq("position", args.position!))
        .order("desc")
        .take(args.limit || 50);
    } else if (args.status) {
      applications = await ctx.db
        .query("careerApplications")
        .withIndex("by_status", (q) => q.eq("status", args.status! as "submitted" | "screening" | "interview" | "rejected" | "hired"))
        .order("desc")
        .take(args.limit || 50);
    } else {
      applications = await ctx.db
        .query("careerApplications")
        .order("desc")
        .take(args.limit || 50);
    }
    
    return applications;
  },
});

// 採用応募詳細取得
export const getById = query({
  args: { id: v.id("careerApplications") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// 採用応募ステータス更新
export const updateStatus = mutation({
  args: {
    id: v.id("careerApplications"),
    status: v.union(
      v.literal("submitted"),
      v.literal("screening"),
      v.literal("interview"),
      v.literal("rejected"),
      v.literal("hired")
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
    
    return id;
  },
});

// 採用統計
export const getStats = query({
  handler: async (ctx) => {
    const allApplications = await ctx.db.query("careerApplications").collect();
    
    // ステータス別集計
    const statusStats = allApplications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // ポジション別集計
    const positionStats = allApplications.reduce((acc, app) => {
      acc[app.position] = (acc[app.position] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // 過去30日の応募数
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentApplications = allApplications.filter(
      app => app.createdAt > thirtyDaysAgo
    );
    
    // 採用率
    const hiredCount = allApplications.filter(app => app.status === "hired").length;
    const rejectedCount = allApplications.filter(app => app.status === "rejected").length;
    const processedCount = hiredCount + rejectedCount;
    
    const hiringRate = processedCount > 0 ? 
      Math.round((hiredCount / processedCount) * 100) : 0;
    
    // 平均選考期間（完了済みのもの）
    const processedApplications = allApplications.filter(
      app => app.status === "hired" || app.status === "rejected"
    );
    const avgProcessingTime = processedApplications.length > 0
      ? processedApplications.reduce((acc, app) => {
          return acc + (app.updatedAt - app.createdAt);
        }, 0) / processedApplications.length
      : 0;
    
    return {
      totalApplications: allApplications.length,
      recentApplications: recentApplications.length,
      statusStats,
      positionStats,
      hiringRate,
      avgProcessingTimeDays: Math.round(avgProcessingTime / (1000 * 60 * 60 * 24)),
      activePositions: Object.keys(positionStats).length,
    };
  },
});

// 人気ポジション取得
export const getPopularPositions = query({
  handler: async (ctx) => {
    const allApplications = await ctx.db.query("careerApplications").collect();
    
    const positionCount = allApplications.reduce((acc, app) => {
      acc[app.position] = (acc[app.position] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(positionCount)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([position, count]) => ({ position, count: count as number }));
  },
});