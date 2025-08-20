import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// アラート作成
export const createAlert = mutation({
  args: {
    workspace_id: v.optional(v.string()),
    alert_type: v.union(
      v.literal("cpa_exceeded"),
      v.literal("cvr_dropped"),
      v.literal("automation_failed"),
      v.literal("phase_gate_ready"),
      v.literal("budget_depleted"),
      v.literal("budget_exceeded"),
      v.literal("high_cpa"),
      v.literal("low_performance")
    ),
    severity: v.union(
      v.literal("critical"),
      v.literal("warning"),
      v.literal("info")
    ),
    title: v.optional(v.string()),
    message: v.string(),
    related_session_id: v.optional(v.id("lpValidationSessions")),
    related_product_id: v.optional(v.string()),
    metadata: v.optional(v.any()),
    notification_channels: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    let workspace_id = args.workspace_id;
    
    // セッションIDから workspace_id を取得
    if (args.related_session_id && !workspace_id) {
      const session = await ctx.db.get(args.related_session_id);
      if (session) {
        workspace_id = session.workspace_id;
      }
    }
    
    if (!workspace_id) {
      throw new Error("workspace_id is required");
    }
    
    const now = Date.now();
    const alert_id = `alert-${args.alert_type}-${now}`;
    
    // タイトル自動生成
    const defaultTitles = {
      cpa_exceeded: "CPA上限超過アラート",
      cvr_dropped: "CVR低下アラート", 
      automation_failed: "自動化実行エラー",
      phase_gate_ready: "フェーズ移行準備完了",
      budget_depleted: "予算枯渇アラート",
      budget_exceeded: "予算超過アラート",
      high_cpa: "高CPA警告",
      low_performance: "パフォーマンス低下",
    };
    
    const alertData = {
      workspace_id,
      alert_id,
      alert_type: args.alert_type,
      severity: args.severity,
      title: args.title || defaultTitles[args.alert_type],
      message: args.message,
      related_session_id: args.related_session_id,
      related_product_id: args.related_product_id,
      status: "active" as const,
      notification_sent: false,
      notification_channels: args.notification_channels || ["discord"],
      resolved_by: undefined,
      resolved_at: undefined,
      resolution_notes: undefined,
      created_at: now,
    };
    
    return await ctx.db.insert("systemAlerts", alertData);
  },
});

// アラート取得
export const getAlert = query({
  args: {
    alertId: v.id("systemAlerts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.alertId);
  },
});

// アラート解決
export const resolveAlert = mutation({
  args: {
    alertId: v.id("systemAlerts"),
    resolved_by: v.optional(v.string()),
    resolution_note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const updateData = {
      status: "resolved" as const,
      resolved_by: args.resolved_by || "system",
      resolved_at: now,
      resolution_notes: args.resolution_note,
    };
    
    await ctx.db.patch(args.alertId, updateData);
  },
});

// アクティブアラート取得
export const getActiveAlerts = query({
  args: {
    workspaceId: v.optional(v.string()),
    sessionId: v.optional(v.id("lpValidationSessions")),
    severity: v.optional(v.union(
      v.literal("critical"),
      v.literal("warning"),
      v.literal("info")
    )),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("systemAlerts");
    
    if (args.workspaceId) {
      query = query.withIndex("by_workspace", (q) => q.eq("workspace_id", args.workspaceId));
    }
    
    const alerts = await query.collect();
    
    // フィルタリング
    let filtered = alerts.filter(alert => alert.status === "active");
    
    if (args.sessionId) {
      filtered = filtered.filter(alert => alert.related_session_id === args.sessionId);
    }
    
    if (args.severity) {
      filtered = filtered.filter(alert => alert.severity === args.severity);
    }
    
    // 重要度と作成日時でソート（Critical → Warning → Info、新しい順）
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    filtered.sort((a, b) => {
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
      if (severityDiff !== 0) return severityDiff;
      return b.created_at - a.created_at;
    });
    
    return filtered.slice(0, args.limit ?? 50);
  },
});

// セッション別アラート履歴
export const getAlertHistory = query({
  args: {
    sessionId: v.id("lpValidationSessions"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const alerts = await ctx.db
      .query("systemAlerts")
      .collect();
    
    const sessionAlerts = alerts
      .filter(alert => alert.related_session_id === args.sessionId)
      .sort((a, b) => b.created_at - a.created_at);
    
    return sessionAlerts.slice(0, args.limit ?? 20);
  },
});

// アラート統計
export const getAlertStats = query({
  args: {
    workspaceId: v.string(),
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const alerts = await ctx.db
      .query("systemAlerts")
      .withIndex("by_workspace", (q) => q.eq("workspace_id", args.workspaceId))
      .collect();
    
    // 期間フィルタリング
    let filtered = alerts;
    if (args.days) {
      const cutoffTime = Date.now() - (args.days * 24 * 60 * 60 * 1000);
      filtered = alerts.filter(alert => alert.created_at >= cutoffTime);
    }
    
    const total = filtered.length;
    const active = filtered.filter(a => a.status === "active").length;
    const resolved = filtered.filter(a => a.status === "resolved").length;
    const critical = filtered.filter(a => a.severity === "critical").length;
    const warning = filtered.filter(a => a.severity === "warning").length;
    const info = filtered.filter(a => a.severity === "info").length;
    
    // タイプ別集計
    const byType: Record<string, number> = {};
    filtered.forEach(alert => {
      byType[alert.alert_type] = (byType[alert.alert_type] || 0) + 1;
    });
    
    return {
      total_alerts: total,
      active_alerts: active,
      resolved_alerts: resolved,
      resolution_rate: total > 0 ? resolved / total : 0,
      by_severity: {
        critical,
        warning,
        info,
      },
      by_type: byType,
      last_alert_at: filtered.length > 0 
        ? Math.max(...filtered.map(a => a.created_at))
        : undefined,
    };
  },
});

// アラート確認（acknowledge）
export const acknowledgeAlert = mutation({
  args: {
    alertId: v.id("systemAlerts"),
    acknowledged_by: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.alertId, {
      status: "acknowledged" as const,
      resolved_by: args.acknowledged_by || "system",
      resolved_at: Date.now(),
    });
  },
});

// アラート却下
export const dismissAlert = mutation({
  args: {
    alertId: v.id("systemAlerts"),
    dismissed_by: v.optional(v.string()),
    dismissal_reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.alertId, {
      status: "dismissed" as const,
      resolved_by: args.dismissed_by || "system",
      resolved_at: Date.now(),
      resolution_notes: args.dismissal_reason || "Dismissed by user",
    });
  },
});

// 通知送信フラグ更新
export const markNotificationSent = mutation({
  args: {
    alertId: v.id("systemAlerts"),
    channels: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.alertId, {
      notification_sent: true,
      notification_channels: args.channels || ["discord"],
    });
  },
});

// 古いアラートのクリーンアップ
export const cleanupOldAlerts = mutation({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const cutoffDays = args.days ?? 90; // デフォルト90日
    const cutoffTime = Date.now() - (cutoffDays * 24 * 60 * 60 * 1000);
    
    const oldAlerts = await ctx.db
      .query("systemAlerts")
      .filter((q) => 
        q.and(
          q.lt(q.field("created_at"), cutoffTime),
          q.neq(q.field("status"), "active") // アクティブは除外
        )
      )
      .collect();
    
    for (const alert of oldAlerts) {
      await ctx.db.delete(alert._id);
    }
    
    return { deleted_count: oldAlerts.length };
  },
});