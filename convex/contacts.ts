// Refactor Phase: お問い合わせ関連のConvex関数
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// お問い合わせ送信
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    phone: v.optional(v.string()),
    type: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const contactId = await ctx.db.insert("contacts", {
      ...args,
      status: "new",
      createdAt: now,
      updatedAt: now,
    });
    
    return {
      id: contactId,
      message: "お問い合わせを受け付けました。24時間以内にご連絡いたします。",
    };
  },
});

// お問い合わせ一覧取得（管理者用）
export const list = query({
  args: {
    status: v.optional(v.string()),
    type: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let contacts;
    
    if (args.status && args.type) {
      contacts = await ctx.db
        .query("contacts")
        .withIndex("by_status", (q) => q.eq("status", args.status))
        .filter((q) => q.eq(q.field("type"), args.type))
        .order("desc")
        .take(args.limit || 50);
    } else if (args.status) {
      contacts = await ctx.db
        .query("contacts")
        .withIndex("by_status", (q) => q.eq("status", args.status))
        .order("desc")
        .take(args.limit || 50);
    } else if (args.type) {
      contacts = await ctx.db
        .query("contacts")
        .withIndex("by_type", (q) => q.eq("type", args.type))
        .order("desc")
        .take(args.limit || 50);
    } else {
      contacts = await ctx.db
        .query("contacts")
        .order("desc")
        .take(args.limit || 50);
    }
    
    return contacts;
  },
});

// お問い合わせ詳細取得
export const getById = query({
  args: { id: v.id("contacts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// お問い合わせステータス更新
export const updateStatus = mutation({
  args: {
    id: v.id("contacts"),
    status: v.union(
      v.literal("new"),
      v.literal("in_progress"),
      v.literal("resolved"),
      v.literal("closed")
    ),
    assignedTo: v.optional(v.id("team_members")),
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

// お問い合わせ統計
export const getStats = query({
  handler: async (ctx) => {
    const allContacts = await ctx.db.query("contacts").collect();
    
    // ステータス別集計
    const statusStats = allContacts.reduce((acc, contact) => {
      acc[contact.status] = (acc[contact.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // 種別別集計
    const typeStats = allContacts.reduce((acc, contact) => {
      acc[contact.type] = (acc[contact.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // 過去30日の問い合わせ数
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentContacts = allContacts.filter(
      c => c.createdAt > thirtyDaysAgo
    );
    
    // 平均対応時間（解決済みのもの）
    const resolvedContacts = allContacts.filter(c => c.status === "resolved");
    const avgResponseTime = resolvedContacts.length > 0
      ? resolvedContacts.reduce((acc, contact) => {
          return acc + (contact.updatedAt - contact.createdAt);
        }, 0) / resolvedContacts.length
      : 0;
    
    return {
      totalContacts: allContacts.length,
      recentContacts: recentContacts.length,
      statusStats,
      typeStats,
      avgResponseTimeHours: Math.round(avgResponseTime / (1000 * 60 * 60)),
    };
  },
});