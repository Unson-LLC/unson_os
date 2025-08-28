import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getDailyMetricsByProduct = query({
  args: {
    product_id: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 30;
    return await ctx.db
      .query("adsDailyMetrics")
      .withIndex("by_product_date", (q) => q.eq("product_id", args.product_id))
      .order("desc")
      .take(limit);
  },
});

export const importDailyMetrics = mutation({
  args: {
    workspace_id: v.string(),
    product_id: v.string(),
    items: v.array(v.object({
      date: v.string(),
      impressions: v.number(),
      clicks: v.number(),
      cost: v.number(),
      conversions: v.number(),
      platform: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    for (const it of args.items) {
      // upsert by (product_id, date)
      const existing = await ctx.db
        .query("adsDailyMetrics")
        .withIndex("by_product_date", (q) => q.eq("product_id", args.product_id).eq("date", it.date))
        .first();
      if (existing) {
        await ctx.db.patch(existing._id, {
          impressions: it.impressions,
          clicks: it.clicks,
          cost: it.cost,
          conversions: it.conversions,
          platform: it.platform || existing.platform,
          updated_at: now,
        });
      } else {
        await ctx.db.insert("adsDailyMetrics", {
          workspace_id: args.workspace_id,
          product_id: args.product_id,
          platform: it.platform || 'Google Ads',
          date: it.date,
          impressions: it.impressions,
          clicks: it.clicks,
          cost: it.cost,
          conversions: it.conversions,
          created_at: now,
          updated_at: now,
        });
      }
    }
    return { success: true, count: args.items.length };
  },
});

