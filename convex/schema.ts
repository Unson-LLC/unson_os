// Refactor Phase: モックデータからリアルなDB設計に移行
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // プロダクト関連
  products: defineTable({
    name: v.string(),
    category: v.string(),
    description: v.string(),
    longDescription: v.optional(v.string()),
    price: v.string(),
    users: v.string(),
    rating: v.number(),
    status: v.union(
      v.literal("active"),
      v.literal("beta"),
      v.literal("coming-soon")
    ),
    features: v.array(v.string()),
    detailedFeatures: v.optional(v.array(v.object({
      icon: v.string(),
      title: v.string(),
      description: v.string()
    }))),
    plans: v.optional(v.array(v.object({
      name: v.string(),
      price: v.string(),
      features: v.array(v.string()),
      popular: v.optional(v.boolean())
    }))),
    techSpecs: v.optional(v.object({
      api: v.string(),
      uptime: v.string(),
      security: v.string(),
      integrations: v.array(v.string())
    })),
    reviews: v.optional(v.array(v.object({
      user: v.string(),
      rating: v.number(),
      comment: v.string(),
      date: v.string()
    }))),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_category", ["category"])
  .index("by_status", ["status"])
  .index("by_rating", ["rating"]),

  // プロダクトカテゴリ
  categories: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    order: v.number(),
    createdAt: v.number(),
  })
  .index("by_order", ["order"]),

  // ウェイトリスト
  waitlist: defineTable({
    email: v.string(),
    name: v.string(),
    role: v.optional(v.string()),
    referralSource: v.optional(v.string()),
    createdAt: v.number(),
  })
  .index("by_email", ["email"])
  .index("by_created_at", ["createdAt"]),

  // お問い合わせ
  contacts: defineTable({
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    phone: v.optional(v.string()),
    type: v.string(),
    message: v.string(),
    status: v.union(
      v.literal("new"),
      v.literal("in_progress"), 
      v.literal("resolved"),
      v.literal("closed")
    ),
    assignedTo: v.optional(v.id("team_members")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_type", ["type"])
  .index("by_status", ["status"])
  .index("by_created_at", ["createdAt"]),

  // 採用応募
  careerApplications: defineTable({
    name: v.string(),
    email: v.string(),
    position: v.string(),
    experience: v.string(),
    coverLetter: v.string(),
    portfolio: v.optional(v.string()),
    status: v.union(
      v.literal("submitted"),
      v.literal("screening"),
      v.literal("interview"),
      v.literal("rejected"),
      v.literal("hired")
    ),
    resumeFileId: v.optional(v.id("_storage")),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_position", ["position"])
  .index("by_status", ["status"])
  .index("by_created_at", ["createdAt"]),

  // プロダクトリクエスト
  productRequests: defineTable({
    name: v.string(),
    email: v.string(),
    productTitle: v.string(),
    category: v.string(),
    description: v.string(),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
    status: v.union(
      v.literal("submitted"),
      v.literal("reviewing"),
      v.literal("approved"),
      v.literal("in_development"),
      v.literal("completed"),
      v.literal("rejected")
    ),
    estimatedDevelopmentTime: v.optional(v.string()),
    assignedTeam: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_category", ["category"])
  .index("by_status", ["status"])
  .index("by_priority", ["priority"])
  .index("by_created_at", ["createdAt"]),

  // チームメンバー
  teamMembers: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.string(),
    department: v.string(),
    bio: v.optional(v.string()),
    expertise: v.array(v.string()),
    imageUrl: v.optional(v.string()),
    isActive: v.boolean(),
    joinedAt: v.number(),
  })
  .index("by_department", ["department"])
  .index("by_role", ["role"])
  .index("by_active", ["isActive"]),

  // FAQ
  faqs: defineTable({
    question: v.string(),
    answer: v.string(),
    category: v.string(),
    order: v.number(),
    isPublished: v.boolean(),
    viewCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_category", ["category"])
  .index("by_order", ["order"])
  .index("by_published", ["isPublished"]),

  // ドキュメント
  documents: defineTable({
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.optional(v.string()),
    category: v.string(),
    tags: v.array(v.string()),
    readTime: v.number(),
    isPublished: v.boolean(),
    viewCount: v.number(),
    author: v.id("team_members"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_category", ["category"])
  .index("by_slug", ["slug"])
  .index("by_published", ["isPublished"])
  .index("by_created_at", ["createdAt"]),

  // アナリティクス（基本的なイベント追跡）
  analytics: defineTable({
    event: v.string(),
    page: v.optional(v.string()),
    userId: v.optional(v.string()),
    sessionId: v.string(),
    properties: v.optional(v.object({})),
    userAgent: v.optional(v.string()),
    referrer: v.optional(v.string()),
    timestamp: v.number(),
  })
  .index("by_event", ["event"])
  .index("by_page", ["page"])
  .index("by_timestamp", ["timestamp"])
  .index("by_session", ["sessionId"]),

  // 設定・メタデータ
  settings: defineTable({
    key: v.string(),
    value: v.any(),
    description: v.optional(v.string()),
    updatedAt: v.number(),
    updatedBy: v.id("team_members"),
  })
  .index("by_key", ["key"]),
});