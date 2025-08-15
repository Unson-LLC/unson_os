import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Discord参加申請を作成
export const create = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    reasons: v.array(v.string()),
    otherReason: v.optional(v.string()),
    skills: v.optional(v.string()),
    expectations: v.string(),
  },
  handler: async (ctx, args) => {
    // 既存の申請があるかチェック
    const existing = await ctx.db
      .query("discordApplications")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing && existing.status === "approved") {
      throw new Error("既に承認済みの申請があります");
    }

    // 新規申請を作成
    const applicationId = await ctx.db.insert("discordApplications", {
      ...args,
      status: "pending",
    });

    return applicationId;
  },
});

// 申請を承認
export const approve = mutation({
  args: {
    applicationId: v.id("discordApplications"),
    discordInviteLink: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.applicationId, {
      status: "approved",
      discordInviteLink: args.discordInviteLink,
      processedAt: Date.now(),
    });
  },
});

// 申請を却下
export const reject = mutation({
  args: {
    applicationId: v.id("discordApplications"),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.applicationId, {
      status: "rejected",
      rejectionReason: args.reason,
      processedAt: Date.now(),
    });
  },
});

// 保留中の申請を取得
export const getPending = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("discordApplications")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .order("asc")
      .collect();
  },
});

// メールアドレスで申請を検索
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("discordApplications")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// 最近の申請を取得（管理用）
export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    return await ctx.db
      .query("discordApplications")
      .withIndex("by_creation_time")
      .order("desc")
      .take(limit);
  },
});