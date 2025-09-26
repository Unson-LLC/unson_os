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
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .collect();
    } else {
      products = await ctx.db.query("products").collect();
    }
    
    // スキーマにusersとratingフィールドが存在しないため、仮の値を使用
    const totalUsers = 0;
    const averageRating = 0;
    
    const statusCounts = products.reduce((acc, product) => {
      acc[product.status] = (acc[product.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalProducts: products.length,
      totalUsers,
      averageRating: Number(averageRating),
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
      product.description.toLowerCase().includes(searchTerm)
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
    status: v.union(
      v.literal("planning"),
      v.literal("development"),
      v.literal("testing"),
      v.literal("launched")
    ),
    launchDate: v.optional(v.number()),
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
    status: v.optional(v.union(
      v.literal("planning"),
      v.literal("development"),
      v.literal("testing"),
      v.literal("launched")
    )),
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