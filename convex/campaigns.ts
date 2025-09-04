import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * キャンペーン管理
 */

// プロダクト別キャンペーン数を取得
export const getCampaignCountByProduct = query({
  args: { 
    workspace_id: v.string(),
    product_id: v.string() 
  },
  handler: async (ctx, args) => {
    const campaigns = await ctx.db
      .query("campaigns")
      .withIndex("by_workspace_product", (q) =>
        q.eq("workspace_id", args.workspace_id).eq("product_id", args.product_id)
      )
      .filter((q) => q.neq(q.field("status"), "ended"))
      .collect();
    
    return {
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter(c => c.status === "active").length,
      pausedCampaigns: campaigns.filter(c => c.status === "paused").length
    };
  },
});

// 全プロダクトのキャンペーン数を取得
export const getAllCampaignCounts = query({
  args: { workspace_id: v.string() },
  handler: async (ctx, args) => {
    const campaigns = await ctx.db
      .query("campaigns")
      .filter((q) => 
        q.and(
          q.eq(q.field("workspace_id"), args.workspace_id),
          q.neq(q.field("status"), "ended")
        )
      )
      .collect();
    
    // プロダクト別に集計
    const campaignsByProduct: Record<string, { total: number; active: number; paused: number }> = {};
    
    campaigns.forEach(campaign => {
      if (!campaignsByProduct[campaign.product_id]) {
        campaignsByProduct[campaign.product_id] = { total: 0, active: 0, paused: 0 };
      }
      
      campaignsByProduct[campaign.product_id].total++;
      if (campaign.status === "active") {
        campaignsByProduct[campaign.product_id].active++;
      } else if (campaign.status === "paused") {
        campaignsByProduct[campaign.product_id].paused++;
      }
    });
    
    return campaignsByProduct;
  },
});

// キャンペーンを作成
export const createCampaign = mutation({
  args: {
    workspace_id: v.string(),
    product_id: v.string(),
    campaign_id: v.string(),
    campaign_name: v.string(),
    platform: v.string(),
    status: v.union(v.literal("active"), v.literal("paused"), v.literal("ended"), v.literal("draft")),
    campaign_type: v.optional(v.string()),
    budget_daily: v.optional(v.number()),
    target_cpa: v.optional(v.number()),
    target_roas: v.optional(v.number()),
    start_date: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const campaignId = await ctx.db.insert("campaigns", {
      workspace_id: args.workspace_id,
      product_id: args.product_id,
      campaign_id: args.campaign_id,
      campaign_name: args.campaign_name,
      platform: args.platform,
      status: args.status,
      campaign_type: args.campaign_type,
      budget_daily: args.budget_daily,
      target_cpa: args.target_cpa,
      target_roas: args.target_roas,
      start_date: args.start_date || now,
      created_at: now,
      updated_at: now,
    });
    
    return campaignId;
  },
});

// キャンペーンステータス更新
export const updateCampaignStatus = mutation({
  args: {
    campaign_id: v.string(),
    status: v.union(v.literal("active"), v.literal("paused"), v.literal("ended"), v.literal("draft"))
  },
  handler: async (ctx, args) => {
    const campaign = await ctx.db
      .query("campaigns")
      .withIndex("by_campaign_id", (q) => q.eq("campaign_id", args.campaign_id))
      .first();
    
    if (!campaign) {
      throw new Error(`Campaign ${args.campaign_id} not found`);
    }
    
    await ctx.db.patch(campaign._id, {
      status: args.status,
      updated_at: Date.now(),
    });
    
    return { success: true, updated: campaign._id };
  },
});

// プロダクトのキャンペーン一覧取得
export const getCampaignsByProduct = query({
  args: {
    workspace_id: v.string(),
    product_id: v.string()
  },
  handler: async (ctx, args) => {
    const campaigns = await ctx.db
      .query("campaigns")
      .withIndex("by_workspace_product", (q) =>
        q.eq("workspace_id", args.workspace_id).eq("product_id", args.product_id)
      )
      .collect();
    
    return campaigns;
  },
});