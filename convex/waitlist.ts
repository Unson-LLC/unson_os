// Refactor Phase: ウェイトリスト関連のConvex関数
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ウェイトリスト登録
export const register = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    role: v.optional(v.string()),
    referralSource: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 重複チェック
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existing) {
      throw new Error("このメールアドレスは既に登録されています");
    }
    
    // 新規登録
    const waitlistId = await ctx.db.insert("waitlist", {
      ...args,
      createdAt: Date.now(),
    });
    
    return {
      id: waitlistId,
      message: "ウェイトリストに登録されました",
    };
  },
});

// ウェイトリスト一覧取得（管理者用）
export const list = query({
  args: {
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const waitlist = await ctx.db
      .query("waitlist")
      .withIndex("by_created_at")
      .order("desc")
      .take(args.limit || 50);
    
    return waitlist;
  },
});

// ウェイトリスト統計
export const getStats = query({
  handler: async (ctx) => {
    const allRegistrations = await ctx.db.query("waitlist").collect();
    
    const totalRegistrations = allRegistrations.length;
    
    // 役割別集計
    const roleStats = allRegistrations.reduce((acc, registration) => {
      const role = registration.role || "未指定";
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // 日別登録数（過去30日）
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentRegistrations = allRegistrations.filter(
      r => r.createdAt > thirtyDaysAgo
    );
    
    // リファラー別集計
    const referralStats = allRegistrations.reduce((acc, registration) => {
      const source = registration.referralSource || "直接アクセス";
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalRegistrations,
      recentRegistrations: recentRegistrations.length,
      roleStats,
      referralStats,
      averagePerDay: Math.round(recentRegistrations.length / 30),
    };
  },
});

// メール存在チェック
export const checkEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    return { exists: !!existing };
  },
});