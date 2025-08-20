// Refactor Phase: プロダクト関連のConvex関数
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// プロダクト一覧取得
export const list = query({
  args: { 
    category: v.optional(v.string()),
    status: v.optional(v.string()),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("products");
    
    if (args.category && args.category !== "全て") {
      q = q.filter((q) => q.eq(q.field("category"), args.category));
    }
    
    if (args.status) {
      q = q.filter((q) => q.eq(q.field("status"), args.status));
    }
    
    const products = await q
      .order("desc")
      .take(args.limit || 50);
    
    return products;
  },
});

// 個別プロダクト取得
export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    return product;
  },
});

// カテゴリ別プロダクト取得
export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    if (args.category === "全て") {
      return await ctx.db.query("products").order("desc").collect();
    }
    
    return await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .order("desc")
      .collect();
  },
});

// プロダクト統計情報
export const getStats = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let products;
    
    if (args.category && args.category !== "全て") {
      products = await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", args.category))
        .collect();
    } else {
      products = await ctx.db.query("products").collect();
    }
    
    const totalUsers = products.reduce((sum, product) => {
      if (!product.users) return sum;
      const userCount = parseInt(product.users.replace(/[^0-9]/g, ''));
      return sum + userCount;
    }, 0);
    
    const averageRating = products.length > 0 
      ? (products.reduce((sum, product) => sum + (product.rating || 0), 0) / products.length)
      : 0;
    
    const statusCounts = products.reduce((acc, product) => {
      acc[product.status] = (acc[product.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalProducts: products.length,
      totalUsers,
      averageRating: Number(averageRating.toFixed(1)),
      statusCounts,
      categories: Array.from(new Set(products.map(p => p.category))),
    };
  },
});

// 関連プロダクト取得
export const getRelated = query({
  args: { 
    productId: v.id("products"),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) return [];
    
    // 同じカテゴリの他のプロダクト
    const relatedProducts = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", product.category))
      .filter((q) => q.neq(q.field("_id"), args.productId))
      .take(args.limit || 3);
    
    return relatedProducts;
  },
});

// プロダクト検索
export const search = query({
  args: { 
    query: v.string(),
    category: v.optional(v.string()),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    let products = await ctx.db.query("products").collect();
    
    // カテゴリフィルター
    if (args.category && args.category !== "全て") {
      products = products.filter(p => p.category === args.category);
    }
    
    // テキスト検索（簡易版）
    const searchTerm = args.query.toLowerCase();
    const filteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      (product.features && product.features.some((feature: string) => feature.toLowerCase().includes(searchTerm)))
    );
    
    return filteredProducts.slice(0, args.limit || 20);
  },
});

// プロダクト作成
export const create = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    description: v.string(),
    longDescription: v.optional(v.string()),
    price: v.optional(v.string()),
    users: v.optional(v.string()),
    rating: v.optional(v.number()),
    status: v.union(
      v.literal("planning"),
      v.literal("development"),
      v.literal("testing"),
      v.literal("launched")
    ),
    features: v.optional(v.array(v.string())),
    serviceUrl: v.optional(v.string()),
    lpUrl: v.optional(v.string()),
    advertisingLPs: v.optional(v.array(v.object({
      url: v.string(),
      title: v.string(),
      channel: v.string(),
      conversionRate: v.optional(v.string()),
    }))),
    isReal: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const productId = await ctx.db.insert("products", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    
    return productId;
  },
});

// プロダクト更新
export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    category: v.optional(v.string()),
    description: v.optional(v.string()),
    longDescription: v.optional(v.string()),
    price: v.optional(v.string()),
    users: v.optional(v.string()),
    rating: v.optional(v.number()),
    status: v.optional(v.union(
      v.literal("planning"),
      v.literal("development"),
      v.literal("testing"),
      v.literal("launched")
    )),
    features: v.optional(v.array(v.string())),
    serviceUrl: v.optional(v.string()),
    lpUrl: v.optional(v.string()),
    advertisingLPs: v.optional(v.array(v.object({
      url: v.string(),
      title: v.string(),
      channel: v.string(),
      conversionRate: v.optional(v.string()),
    }))),
    isReal: v.optional(v.boolean()),
    launchDate: v.optional(v.number()),
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

// 広告用LP追加
export const addAdvertisingLP = mutation({
  args: {
    id: v.id("products"),
    lpData: v.object({
      url: v.string(),
      title: v.string(),
      channel: v.string(),
      conversionRate: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product) {
      throw new Error("Product not found");
    }
    
    const currentLPs = product.advertisingLPs || [];
    const updatedLPs = [...currentLPs, args.lpData];
    
    await ctx.db.patch(args.id, {
      advertisingLPs: updatedLPs,
      updatedAt: Date.now(),
    });
  },
});

// 広告用LP削除
export const removeAdvertisingLP = mutation({
  args: {
    id: v.id("products"),
    lpUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product) {
      throw new Error("Product not found");
    }
    
    const currentLPs = product.advertisingLPs || [];
    const updatedLPs = currentLPs.filter(lp => lp.url !== args.lpUrl);
    
    await ctx.db.patch(args.id, {
      advertisingLPs: updatedLPs,
      updatedAt: Date.now(),
    });
  },
});