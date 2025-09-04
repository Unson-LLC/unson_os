import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * アラート管理
 */

// アラート一覧取得（ワークスペース別）
export const getAlerts = query({
  args: { 
    workspace_id: v.string(),
    status: v.optional(v.union(v.literal("active"), v.literal("acknowledged"), v.literal("resolved"), v.literal("dismissed")))
  },
  handler: async (ctx, args) => {
    let alertsQuery = ctx.db
      .query("alerts")
      .withIndex("by_workspace", (q) => q.eq("workspace_id", args.workspace_id));
    
    if (args.status) {
      alertsQuery = alertsQuery.filter((q) => q.eq(q.field("status"), args.status));
    }
    
    const alerts = await alertsQuery
      .order("desc")
      .take(50); // 最新50件
    
    return alerts;
  },
});

// プロダクト別アラート取得
export const getAlertsByProduct = query({
  args: { 
    workspace_id: v.string(),
    product_id: v.string(),
    status: v.optional(v.union(v.literal("active"), v.literal("acknowledged"), v.literal("resolved"), v.literal("dismissed")))
  },
  handler: async (ctx, args) => {
    let alertsQuery = ctx.db
      .query("alerts")
      .withIndex("by_workspace_product", (q) =>
        q.eq("workspace_id", args.workspace_id).eq("product_id", args.product_id)
      );
    
    if (args.status) {
      alertsQuery = alertsQuery.filter((q) => q.eq(q.field("status"), args.status));
    }
    
    const alerts = await alertsQuery
      .order("desc")
      .take(20);
    
    return alerts;
  },
});

// アラート作成
export const createAlert = mutation({
  args: {
    workspace_id: v.string(),
    product_id: v.optional(v.string()),
    alert_type: v.union(
      v.literal("cvr_below_threshold"),
      v.literal("cpa_above_threshold"),
      v.literal("budget_depleted"),
      v.literal("anomaly_detected"),
      v.literal("revenue_drop"),
      v.literal("campaign_paused")
    ),
    severity: v.union(v.literal("critical"), v.literal("high"), v.literal("medium"), v.literal("low")),
    title: v.string(),
    message: v.string(),
    threshold_value: v.optional(v.number()),
    current_value: v.optional(v.number()),
    session_id: v.optional(v.string()),
    campaign_id: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const alert_id = `alert_${now}_${Math.random().toString(36).substring(2, 9)}`;
    
    const alertId = await ctx.db.insert("alerts", {
      workspace_id: args.workspace_id,
      alert_id,
      product_id: args.product_id,
      alert_type: args.alert_type,
      severity: args.severity,
      title: args.title,
      message: args.message,
      status: "active",
      threshold_value: args.threshold_value,
      current_value: args.current_value,
      session_id: args.session_id,
      campaign_id: args.campaign_id,
      created_at: now,
      updated_at: now,
    });
    
    return { alertId, alert_id };
  },
});

// アラートステータス更新
export const updateAlertStatus = mutation({
  args: {
    alert_id: v.string(),
    status: v.union(v.literal("active"), v.literal("acknowledged"), v.literal("resolved"), v.literal("dismissed")),
    resolved_by: v.optional(v.string()),
    resolution_notes: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const alert = await ctx.db
      .query("alerts")
      .filter((q) => q.eq(q.field("alert_id"), args.alert_id))
      .first();
    
    if (!alert) {
      throw new Error(`Alert ${args.alert_id} not found`);
    }
    
    const updateData: any = {
      status: args.status,
      updated_at: Date.now(),
    };
    
    if (args.status === "resolved" && args.resolved_by) {
      updateData.resolved_by = args.resolved_by;
      updateData.resolved_at = Date.now();
      updateData.resolution_notes = args.resolution_notes;
    }
    
    await ctx.db.patch(alert._id, updateData);
    
    return { success: true, updated: alert._id };
  },
});

// アラートサマリー取得
export const getAlertSummary = query({
  args: { workspace_id: v.string() },
  handler: async (ctx, args) => {
    const alerts = await ctx.db
      .query("alerts")
      .withIndex("by_workspace", (q) => q.eq("workspace_id", args.workspace_id))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();
    
    const summary = {
      total: alerts.length,
      critical: alerts.filter(a => a.severity === "critical").length,
      high: alerts.filter(a => a.severity === "high").length,
      medium: alerts.filter(a => a.severity === "medium").length,
      low: alerts.filter(a => a.severity === "low").length,
      byType: {} as Record<string, number>
    };
    
    // タイプ別集計
    alerts.forEach(alert => {
      summary.byType[alert.alert_type] = (summary.byType[alert.alert_type] || 0) + 1;
    });
    
    return summary;
  },
});

// 自動アラート生成（メトリクスベース）
export const generateMetricsAlert = mutation({
  args: {
    workspace_id: v.string(),
    product_id: v.string(),
    metric_type: v.string(),
    current_value: v.number(),
    threshold_value: v.number(),
    campaign_id: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    // 既存の類似アラートをチェック（重複防止）
    const existingAlert = await ctx.db
      .query("alerts")
      .withIndex("by_workspace_product", (q) =>
        q.eq("workspace_id", args.workspace_id).eq("product_id", args.product_id)
      )
      .filter((q) => 
        q.and(
          q.eq(q.field("status"), "active"),
          q.eq(q.field("alert_type"), args.metric_type === "cvr" ? "cvr_below_threshold" : "cpa_above_threshold")
        )
      )
      .first();
    
    if (existingAlert) {
      // 既存アラートを更新
      await ctx.db.patch(existingAlert._id, {
        current_value: args.current_value,
        updated_at: Date.now(),
      });
      
      return { alertId: existingAlert._id, updated: true };
    }
    
    // 新しいアラートを作成
    let alert_type: "cvr_below_threshold" | "cpa_above_threshold";
    let severity: "critical" | "high" | "medium" | "low";
    let title: string;
    let message: string;
    
    if (args.metric_type === "cvr") {
      alert_type = "cvr_below_threshold";
      const deviation = ((args.threshold_value - args.current_value) / args.threshold_value) * 100;
      
      if (deviation > 50) {
        severity = "critical";
      } else if (deviation > 30) {
        severity = "high";
      } else if (deviation > 15) {
        severity = "medium";
      } else {
        severity = "low";
      }
      
      title = `CVR低下アラート: ${args.current_value}%`;
      message = `${args.product_id}のCVR ${args.current_value}%が目標値 ${args.threshold_value}%を下回っています。`;
      
    } else {
      alert_type = "cpa_above_threshold";
      const deviation = ((args.current_value - args.threshold_value) / args.threshold_value) * 100;
      
      if (deviation > 50) {
        severity = "critical";
      } else if (deviation > 30) {
        severity = "high";
      } else if (deviation > 15) {
        severity = "medium";
      } else {
        severity = "low";
      }
      
      title = `CPA上昇アラート: ¥${args.current_value}`;
      message = `${args.product_id}のCPA ¥${args.current_value}が目標値 ¥${args.threshold_value}を上回っています。`;
    }
    
    const now = Date.now();
    const alert_id = `alert_${now}_${Math.random().toString(36).substring(2, 9)}`;
    
    const alertId = await ctx.db.insert("alerts", {
      workspace_id: args.workspace_id,
      alert_id,
      product_id: args.product_id,
      alert_type,
      severity,
      title,
      message,
      status: "active",
      threshold_value: args.threshold_value,
      current_value: args.current_value,
      campaign_id: args.campaign_id,
      created_at: now,
      updated_at: now,
    });
    
    return { alertId, alert_id, created: true };
  },
});