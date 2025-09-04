import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// LP設定作成
export const createLPConfig = mutation({
  args: {
    workspace_id: v.string(),
    product_id: v.string(),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    is_control: v.optional(v.boolean()),
    is_active: v.optional(v.boolean()),
    created_by: v.string(),
    config: v.object({
      meta: v.object({
        title: v.string(),
        description: v.string(),
        keywords: v.array(v.string()),
      }),
      theme: v.object({
        colors: v.any(),
        fonts: v.any(),
        gradients: v.any(),
      }),
      content: v.object({
        hero: v.any(),
        problem: v.any(),
        solution: v.any(),
        service: v.any(),
        pricing: v.optional(v.any()),
        form: v.any(),
        finalCta: v.any(),
        footer: v.any(),
      }),
      settings: v.object({
        analytics: v.any(),
        imageGeneration: v.optional(v.any()),
        seo: v.any(),
        development: v.optional(v.any()),
      }),
      assets: v.optional(v.object({
        logo: v.optional(v.string()),
        favicon: v.optional(v.string()),
        images: v.optional(v.any()),
      })),
    }),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const config_id = `lp-${args.product_id}-${now}`;
    
    // 新しい設定がアクティブの場合、既存のアクティブ設定を無効化
    if (args.is_active) {
      const existingActiveConfigs = await ctx.db
        .query("lpConfigs")
        .withIndex("by_workspace_product", (q) => 
          q.eq("workspace_id", args.workspace_id).eq("product_id", args.product_id)
        )
        .filter((q) => q.eq(q.field("is_active"), true))
        .collect();
      
      for (const config of existingActiveConfigs) {
        await ctx.db.patch(config._id, { is_active: false, updated_at: now });
      }
    }
    
    // 新しい設定を作成
    const lpConfigId = await ctx.db.insert("lpConfigs", {
      workspace_id: args.workspace_id,
      config_id,
      product_id: args.product_id,
      name: args.name || `Config ${config_id}`,
      description: args.description,
      content: args.config,
      version: "1",
      is_control: args.is_control || false,
      is_active: args.is_active || false,
      created_at: now,
      updated_at: now,
    });
    
    // productsテーブルのactive_lp_config_idを更新（アクティブな場合）
    if (args.is_active) {
      const product = await ctx.db
        .query("products")
        .filter((q) => q.eq(q.field("name"), args.product_id))
        .first();
      
      if (product) {
        await ctx.db.patch(product._id, {
          // active_lp_config_id: config_id, // TODO: productsテーブルにフィールド追加後
          updatedAt: now,
        });
      }
    }
    
    return { config_id, _id: lpConfigId };
  },
});

// アクティブなLP設定取得
export const getActiveLPConfig = query({
  args: {
    workspace_id: v.string(),
    product_id: v.string(),
  },
  handler: async (ctx, args) => {
    const config = await ctx.db
      .query("lpConfigs")
      .withIndex("by_workspace_product", (q) => 
        q.eq("workspace_id", args.workspace_id).eq("product_id", args.product_id)
      )
      .filter((q) => q.eq(q.field("is_active"), true))
      .first();
    
    return config;
  },
});

// 特定のLP設定取得
export const getLPConfig = query({
  args: {
    config_id: v.string(),
  },
  handler: async (ctx, args) => {
    const config = await ctx.db
      .query("lpConfigs")
      .withIndex("by_config_id", (q) => q.eq("config_id", args.config_id))
      .first();
    
    return config;
  },
});

// プロダクトの全LP設定一覧取得
export const getProductLPConfigs = query({
  args: {
    workspace_id: v.string(),
    product_id: v.string(),
  },
  handler: async (ctx, args) => {
    const configs = await ctx.db
      .query("lpConfigs")
      .withIndex("by_workspace_product", (q) => 
        q.eq("workspace_id", args.workspace_id).eq("product_id", args.product_id)
      )
      .order("desc")
      .collect();
    
    return configs;
  },
});

// LP設定更新
export const updateLPConfig = mutation({
  args: {
    config_id: v.string(),
    updates: v.object({
      config: v.optional(v.object({
        meta: v.optional(v.object({
          title: v.optional(v.string()),
          description: v.optional(v.string()),
          keywords: v.optional(v.array(v.string())),
        })),
        theme: v.optional(v.object({
          colors: v.optional(v.any()),
          fonts: v.optional(v.any()),
          gradients: v.optional(v.any()),
        })),
        content: v.optional(v.object({
          hero: v.optional(v.any()),
          problem: v.optional(v.any()),
          solution: v.optional(v.any()),
          service: v.optional(v.any()),
          pricing: v.optional(v.any()),
          form: v.optional(v.any()),
          finalCta: v.optional(v.any()),
          footer: v.optional(v.any()),
        })),
        settings: v.optional(v.object({
          analytics: v.optional(v.any()),
          imageGeneration: v.optional(v.any()),
          seo: v.optional(v.any()),
          development: v.optional(v.any()),
        })),
        assets: v.optional(v.object({
          logo: v.optional(v.string()),
          favicon: v.optional(v.string()),
          images: v.optional(v.any()),
        })),
      })),
      is_active: v.optional(v.boolean()),
      performance_metrics: v.optional(v.object({
        load_time_ms: v.number(),
        lighthouse_score: v.number(),
        accessibility_score: v.number(),
      })),
    }),
    updated_by: v.string(),
  },
  handler: async (ctx, args) => {
    const config = await ctx.db
      .query("lpConfigs")
      .withIndex("by_config_id", (q) => q.eq("config_id", args.config_id))
      .first();
    
    if (!config) {
      throw new Error(`LP Config not found: ${args.config_id}`);
    }
    
    const now = Date.now();
    const updateData: any = {
      updated_at: now,
    };
    
    // 設定更新
    if (args.updates.config) {
      const newContent = { ...config.content };
      if (args.updates.config.meta) {
        newContent.meta = { ...newContent.meta, ...args.updates.config.meta };
      }
      if (args.updates.config.theme) {
        newContent.theme = { ...newContent.theme, ...args.updates.config.theme };
      }
      if (args.updates.config.content) {
        newContent.content = { ...newContent.content, ...args.updates.config.content };
      }
      if (args.updates.config.settings) {
        newContent.settings = { ...newContent.settings, ...args.updates.config.settings };
      }
      if (args.updates.config.assets) {
        newContent.assets = { ...newContent.assets, ...args.updates.config.assets };
      }
      updateData.content = newContent;
    }
    
    // アクティブ状態変更
    if (args.updates.is_active !== undefined) {
      if (args.updates.is_active) {
        // 他のアクティブ設定を無効化
        const activeConfigs = await ctx.db
          .query("lpConfigs")
          .withIndex("by_workspace_product", (q) => 
            q.eq("workspace_id", config.workspace_id).eq("product_id", config.product_id)
          )
          .filter((q) => q.eq(q.field("is_active"), true))
          .collect();
        
        for (const activeConfig of activeConfigs) {
          if (activeConfig._id !== config._id) {
            await ctx.db.patch(activeConfig._id, { is_active: false, updated_at: now });
          }
        }
      }
      updateData.is_active = args.updates.is_active;
    }
    
    // パフォーマンスメトリクス更新
    if (args.updates.performance_metrics) {
      updateData.performance_metrics = args.updates.performance_metrics;
    }
    
    await ctx.db.patch(config._id, updateData);
    
    return { success: true, config_id: args.config_id };
  },
});

// LP設定削除
export const deleteLPConfig = mutation({
  args: {
    config_id: v.string(),
  },
  handler: async (ctx, args) => {
    const config = await ctx.db
      .query("lpConfigs")
      .withIndex("by_config_id", (q) => q.eq("config_id", args.config_id))
      .first();
    
    if (!config) {
      throw new Error(`LP Config not found: ${args.config_id}`);
    }
    
    // A/Bテストで使用中の場合は削除不可
    const activeTest = await ctx.db
      .query("lpAbTests")
      .withIndex("by_workspace_product", (q) => 
        q.eq("workspace_id", config.workspace_id).eq("product_id", config.product_id)
      )
      .filter((q) => 
        q.or(
          q.eq(q.field("control_config_id"), args.config_id),
          q.neq(q.field("variant_configs"), null) // variant_configsが存在するかチェック
        )
      )
      .filter((q) => 
        q.or(
          q.eq(q.field("status"), "running"),
          q.eq(q.field("status"), "paused")
        )
      )
      .first();
    
    if (activeTest) {
      throw new Error(`Cannot delete config: currently used in A/B test ${activeTest.name}`);
    }
    
    await ctx.db.delete(config._id);
    
    return { success: true };
  },
});

// 最適化履歴追加
export const addOptimizationHistory = mutation({
  args: {
    config_id: v.string(),
    changes: v.array(v.string()),
    impact: v.string(),
    cvr_before: v.optional(v.number()),
    cvr_after: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const config = await ctx.db
      .query("lpConfigs")
      .withIndex("by_config_id", (q) => q.eq("config_id", args.config_id))
      .first();
    
    if (!config) {
      throw new Error(`LP Config not found: ${args.config_id}`);
    }
    
    const optimizationEntry = {
      timestamp: Date.now(),
      changes: args.changes,
      impact: args.impact,
      cvr_before: args.cvr_before,
      cvr_after: args.cvr_after,
    };
    
    const updatedHistory = [...(config.content.optimization_history || []), optimizationEntry];
    const updatedContent = {
      ...config.content,
      optimization_history: updatedHistory
    };
    
    await ctx.db.patch(config._id, {
      content: updatedContent,
      updated_at: Date.now(),
    });
    
    return { success: true, history_length: updatedHistory.length };
  },
});