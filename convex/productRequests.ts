// Refactor Phase: プロダクトリクエスト関連のConvex関数
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// プロダクトリクエスト作成
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    productTitle: v.string(),
    category: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const requestId = await ctx.db.insert("productRequests", {
      ...args,
      priority: "medium", // デフォルト優先度
      status: "submitted",
      createdAt: now,
      updatedAt: now,
    });
    
    return {
      id: requestId,
      message: "プロダクトリクエストを受け付けました。検討後、ご連絡いたします。",
    };
  },
});

// プロダクトリクエスト一覧取得
export const list = query({
  args: {
    status: v.optional(v.string()),
    category: v.optional(v.string()),
    priority: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let requests;
    
    if (args.status) {
      requests = await ctx.db
        .query("productRequests")
        .withIndex("by_status", (q) => q.eq("status", args.status))
        .order("desc")
        .take(args.limit || 50);
    } else if (args.category) {
      requests = await ctx.db
        .query("productRequests")
        .withIndex("by_category", (q) => q.eq("category", args.category))
        .order("desc")
        .take(args.limit || 50);
    } else if (args.priority) {
      requests = await ctx.db
        .query("productRequests")
        .withIndex("by_priority", (q) => q.eq("priority", args.priority))
        .order("desc")
        .take(args.limit || 50);
    } else {
      requests = await ctx.db
        .query("productRequests")
        .order("desc")
        .take(args.limit || 50);
    }
    
    return requests;
  },
});

// プロダクトリクエスト詳細取得
export const getById = query({
  args: { id: v.id("productRequests") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// プロダクトリクエスト更新（一時的に無効化）
// export const update = mutation({
//   args: {
//     id: v.id("productRequests"),
//     status: v.optional(v.union(
//       v.literal("submitted"),
//       v.literal("reviewing"),
//       v.literal("approved"),
//       v.literal("rejected")
//     )),
//     priority: v.optional(v.union(
//       v.literal("low"),
//       v.literal("medium"),
//       v.literal("high")
//     )),
//     estimatedDevelopmentTime: v.optional(v.string()),
//     assignedTeam: v.optional(v.string()),
//   },
//   handler: async (ctx, args) => {
//     const { id, ...updates } = args;
    
//     const updateData: any = {
//       ...updates,
//       updatedAt: Date.now(),
//     };
    
//     await ctx.db.patch(id, updateData);
    
//     return id;
//   },
// });

// プロダクトリクエスト統計
export const getStats = query({
  handler: async (ctx) => {
    const allRequests = await ctx.db.query("productRequests").collect();
    
    // ステータス別集計
    const statusStats = allRequests.reduce((acc, request) => {
      acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // カテゴリ別集計
    const categoryStats = allRequests.reduce((acc, request) => {
      acc[request.category] = (acc[request.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // 優先度別集計
    const priorityStats = allRequests.reduce((acc, request) => {
      acc[request.priority] = (acc[request.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // 過去30日のリクエスト数
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentRequests = allRequests.filter(
      r => r.createdAt > thirtyDaysAgo
    );
    
    // 平均処理時間（完了済みのもの）
    const completedRequests = allRequests.filter(r => r.status === "completed");
    const avgProcessingTime = completedRequests.length > 0
      ? completedRequests.reduce((acc, request) => {
          return acc + (request.updatedAt - request.createdAt);
        }, 0) / completedRequests.length
      : 0;
    
    return {
      totalRequests: allRequests.length,
      recentRequests: recentRequests.length,
      statusStats,
      categoryStats,
      priorityStats,
      avgProcessingTimeDays: Math.round(avgProcessingTime / (1000 * 60 * 60 * 24)),
      completionRate: allRequests.length > 0 ? 
        Math.round((completedRequests.length / allRequests.length) * 100) : 0,
    };
  },
});

// 人気カテゴリ取得
export const getPopularCategories = query({
  handler: async (ctx) => {
    const allRequests = await ctx.db.query("productRequests").collect();
    
    const categoryCount = allRequests.reduce((acc, request) => {
      acc[request.category] = (acc[request.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categoryCount)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([category, count]) => ({ category, count: count as number }));
  },
});