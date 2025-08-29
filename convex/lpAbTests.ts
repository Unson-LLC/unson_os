import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// A/Bテスト作成
export const createAbTest = mutation({
  args: {
    workspace_id: v.string(),
    product_id: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    control_config_id: v.string(),
    variant_configs: v.array(v.object({
      config_id: v.string(),
      traffic_percentage: v.number(),
      label: v.string(),
      description: v.optional(v.string()),
    })),
    primary_metric: v.string(),
    secondary_metrics: v.optional(v.array(v.string())),
    target_sample_size: v.number(),
    planned_duration_days: v.number(),
    significance_threshold: v.optional(v.number()),
    auto_declare_winner: v.optional(v.boolean()),
    auto_stop_on_significance: v.optional(v.boolean()),
    created_by: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const test_id = `ab-${args.product_id}-${now}`;
    const posthog_flag_key = `lp_test_${args.product_id}_${now}`;
    
    // トラフィック配分の合計が100%かチェック
    const totalTraffic = args.variant_configs.reduce((sum, v) => sum + v.traffic_percentage, 0);
    if (totalTraffic !== 100) {
      throw new Error(`Traffic allocation must sum to 100%, got ${totalTraffic}%`);
    }
    
    // Control設定とVariant設定が存在することを確認
    const controlConfig = await ctx.db
      .query("lpConfigs")
      .withIndex("by_config_id", (q) => q.eq("config_id", args.control_config_id))
      .first();
    
    if (!controlConfig) {
      throw new Error(`Control config not found: ${args.control_config_id}`);
    }
    
    for (const variant of args.variant_configs) {
      const variantConfig = await ctx.db
        .query("lpConfigs")
        .withIndex("by_config_id", (q) => q.eq("config_id", variant.config_id))
        .first();
      
      if (!variantConfig) {
        throw new Error(`Variant config not found: ${variant.config_id}`);
      }
    }
    
    // A/Bテスト作成
    const testId = await ctx.db.insert("lpAbTests", {
      workspace_id: args.workspace_id,
      test_id,
      product_id: args.product_id,
      name: args.name,
      description: args.description,
      status: "draft",
      posthog_flag_key,
      control_config_id: args.control_config_id,
      variant_configs: args.variant_configs,
      primary_metric: args.primary_metric,
      secondary_metrics: args.secondary_metrics,
      target_sample_size: args.target_sample_size,
      current_sample_size: 0,
      significance_threshold: args.significance_threshold || 0.95,
      start_date: now,
      planned_duration_days: args.planned_duration_days,
      auto_declare_winner: args.auto_declare_winner || false,
      auto_stop_on_significance: args.auto_stop_on_significance || false,
      auto_traffic_allocation: false, // デフォルトは固定配分
      created_at: now,
      updated_at: now,
      created_by: args.created_by,
    });
    
    return { test_id, _id: testId, posthog_flag_key };
  },
});

// A/Bテスト開始
export const startAbTest = mutation({
  args: {
    test_id: v.string(),
    started_by: v.string(),
  },
  handler: async (ctx, args) => {
    const test = await ctx.db
      .query("lpAbTests")
      .withIndex("by_test_id", (q) => q.eq("test_id", args.test_id))
      .first();
    
    if (!test) {
      throw new Error(`A/B Test not found: ${args.test_id}`);
    }
    
    if (test.status !== "draft" && test.status !== "paused") {
      throw new Error(`Cannot start test in status: ${test.status}`);
    }
    
    const now = Date.now();
    
    await ctx.db.patch(test._id, {
      status: "running",
      start_date: test.status === "draft" ? now : test.start_date,
      updated_at: now,
    });
    
    // PostHog Feature Flag同期記録
    await ctx.db.insert("posthogFlagSync", {
      workspace_id: test.workspace_id,
      ab_test_id: args.test_id,
      flag_key: test.posthog_flag_key,
      sync_type: "create",
      before_state: null,
      after_state: {
        key: test.posthog_flag_key,
        rollout: 100,
        variants: [
          { key: "control", rollout: 100 - test.variant_configs.reduce((s, v) => s + v.traffic_percentage, 0) },
          ...test.variant_configs.map(v => ({ key: v.label, rollout: v.traffic_percentage }))
        ]
      },
      success: true, // TODO: 実際のPostHog API呼び出し後に更新
      synced_at: now,
    });
    
    return { success: true, status: "running" };
  },
});

// A/Bテスト停止
export const stopAbTest = mutation({
  args: {
    test_id: v.string(),
    reason: v.optional(v.string()),
    stopped_by: v.string(),
  },
  handler: async (ctx, args) => {
    const test = await ctx.db
      .query("lpAbTests")
      .withIndex("by_test_id", (q) => q.eq("test_id", args.test_id))
      .first();
    
    if (!test) {
      throw new Error(`A/B Test not found: ${args.test_id}`);
    }
    
    if (test.status !== "running" && test.status !== "paused") {
      throw new Error(`Cannot stop test in status: ${test.status}`);
    }
    
    const now = Date.now();
    
    await ctx.db.patch(test._id, {
      status: "completed",
      end_date: now,
      updated_at: now,
    });
    
    // PostHog Feature Flag無効化記録
    await ctx.db.insert("posthogFlagSync", {
      workspace_id: test.workspace_id,
      ab_test_id: args.test_id,
      flag_key: test.posthog_flag_key,
      sync_type: "delete",
      before_state: { active: true },
      after_state: { active: false },
      success: true, // TODO: 実際のPostHog API呼び出し後に更新
      synced_at: now,
    });
    
    return { success: true, status: "completed" };
  },
});

// A/Bテスト結果更新
export const updateAbTestResults = mutation({
  args: {
    test_id: v.string(),
    results: v.object({
      control: v.object({
        sessions: v.number(),
        conversions: v.number(),
        conversion_rate: v.number(),
        revenue: v.optional(v.number()),
      }),
      variants: v.array(v.object({
        label: v.string(),
        sessions: v.number(),
        conversions: v.number(),
        conversion_rate: v.number(),
        revenue: v.optional(v.number()),
      })),
      statistical_summary: v.object({
        p_value: v.number(),
        confidence_interval: v.array(v.number()),
        is_significant: v.boolean(),
        sample_ratio_mismatch: v.boolean(),
      }),
    }),
  },
  handler: async (ctx, args) => {
    const test = await ctx.db
      .query("lpAbTests")
      .withIndex("by_test_id", (q) => q.eq("test_id", args.test_id))
      .first();
    
    if (!test) {
      throw new Error(`A/B Test not found: ${args.test_id}`);
    }
    
    const totalSessions = args.results.control.sessions + 
      args.results.variants.reduce((sum, v) => sum + v.sessions, 0);
    
    const now = Date.now();
    const updateData: any = {
      current_sample_size: totalSessions,
      results: args.results,
      updated_at: now,
    };
    
    // 統計的有意性チェック
    if (args.results.statistical_summary.is_significant) {
      // 勝者決定
      let winner_config_id = test.control_config_id;
      let max_cvr = args.results.control.conversion_rate;
      
      for (let i = 0; i < args.results.variants.length; i++) {
        const variant = args.results.variants[i];
        if (variant.conversion_rate > max_cvr) {
          max_cvr = variant.conversion_rate;
          winner_config_id = test.variant_configs[i].config_id;
        }
      }
      
      updateData.winner_config_id = winner_config_id;
      updateData.statistical_confidence = 1 - args.results.statistical_summary.p_value;
      updateData.lift_percentage = ((max_cvr - args.results.control.conversion_rate) / args.results.control.conversion_rate) * 100;
      
      // 自動停止が有効な場合
      if (test.auto_stop_on_significance && test.status === "running") {
        updateData.status = "completed";
        updateData.end_date = now;
        
        // 勝者を自動的にアクティブに設定
        if (test.auto_declare_winner) {
          const winnerConfig = await ctx.db
            .query("lpConfigs")
            .withIndex("by_config_id", (q) => q.eq("config_id", winner_config_id))
            .first();
          
          if (winnerConfig) {
            // 既存のアクティブ設定を無効化
            const activeConfigs = await ctx.db
              .query("lpConfigs")
              .withIndex("by_workspace_product", (q) => 
                q.eq("workspace_id", test.workspace_id).eq("product_id", test.product_id)
              )
              .filter((q) => q.eq(q.field("is_active"), true))
              .collect();
            
            for (const config of activeConfigs) {
              await ctx.db.patch(config._id, { is_active: false, updated_at: now });
            }
            
            // 勝者をアクティブに
            await ctx.db.patch(winnerConfig._id, { is_active: true, updated_at: now });
          }
        }
      }
    }
    
    await ctx.db.patch(test._id, updateData);
    
    return { 
      success: true, 
      is_significant: args.results.statistical_summary.is_significant,
      winner_config_id: updateData.winner_config_id 
    };
  },
});

// A/Bテスト一覧取得
export const getAbTests = query({
  args: {
    workspace_id: v.string(),
    product_id: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("draft"),
      v.literal("running"),
      v.literal("paused"),
      v.literal("completed"),
      v.literal("terminated")
    )),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("lpAbTests");
    
    if (args.product_id) {
      query = query.withIndex("by_workspace_product", (q) => 
        q.eq("workspace_id", args.workspace_id).eq("product_id", args.product_id)
      );
    } else {
      query = query.filter((q) => q.eq(q.field("workspace_id"), args.workspace_id));
    }
    
    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }
    
    const tests = await query.order("desc").collect();
    
    return tests;
  },
});

// 特定のA/Bテスト取得
export const getAbTest = query({
  args: {
    test_id: v.string(),
  },
  handler: async (ctx, args) => {
    const test = await ctx.db
      .query("lpAbTests")
      .withIndex("by_test_id", (q) => q.eq("test_id", args.test_id))
      .first();
    
    if (!test) {
      return null;
    }
    
    // 関連するLP設定も取得
    const controlConfig = await ctx.db
      .query("lpConfigs")
      .withIndex("by_config_id", (q) => q.eq("config_id", test.control_config_id))
      .first();
    
    const variantConfigs = await Promise.all(
      test.variant_configs.map(async (variant) => {
        const config = await ctx.db
          .query("lpConfigs")
          .withIndex("by_config_id", (q) => q.eq("config_id", variant.config_id))
          .first();
        return { ...variant, config };
      })
    );
    
    return {
      ...test,
      control_config: controlConfig,
      variant_configs_with_data: variantConfigs,
    };
  },
});

// PostHog Feature Flag同期履歴取得
export const getPostHogSyncHistory = query({
  args: {
    ab_test_id: v.string(),
  },
  handler: async (ctx, args) => {
    const syncHistory = await ctx.db
      .query("posthogFlagSync")
      .withIndex("by_ab_test", (q) => q.eq("ab_test_id", args.ab_test_id))
      .order("desc")
      .collect();
    
    return syncHistory;
  },
});

// アクティブなA/Bテスト取得（プロダクト別）
export const getActiveAbTest = query({
  args: {
    workspace_id: v.string(),
    product_id: v.string(),
  },
  handler: async (ctx, args) => {
    const activeTest = await ctx.db
      .query("lpAbTests")
      .withIndex("by_workspace_product", (q) => 
        q.eq("workspace_id", args.workspace_id).eq("product_id", args.product_id)
      )
      .filter((q) => q.eq(q.field("status"), "running"))
      .first();
    
    return activeTest;
  },
});