import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  discordApplications: defineTable({
    email: v.string(),
    name: v.string(),
    reasons: v.array(v.string()),
    otherReason: v.optional(v.string()),
    skills: v.optional(v.string()),
    expectations: v.string(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    discordInviteLink: v.optional(v.string()),
    processedAt: v.optional(v.number()),
    rejectionReason: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"]),
    
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
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_position", ["position"])
    .index("by_status", ["status"])
    .index("by_email", ["email"]),
    
  contacts: defineTable({
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    phone: v.optional(v.string()),
    type: v.string(),
    message: v.string(),
    status: v.union(v.literal("new"), v.literal("in_progress"), v.literal("resolved")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_type", ["type"])
    .index("by_email", ["email"]),
    
  productRequests: defineTable({
    name: v.string(),
    email: v.string(),
    productType: v.string(),
    description: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    status: v.union(v.literal("submitted"), v.literal("reviewing"), v.literal("approved"), v.literal("rejected")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_priority", ["priority"])
    .index("by_email", ["email"]),
    
  products: defineTable({
    name: v.string(),
    description: v.string(),
    longDescription: v.optional(v.string()),
    category: v.string(),
    price: v.optional(v.string()),
    users: v.optional(v.string()),
    rating: v.optional(v.number()),
    status: v.union(v.literal("discovery"), v.literal("validation"), v.literal("development"), v.literal("active"), v.literal("terminated")),
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_category", ["category"]),
    
  waitlist: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    company: v.optional(v.string()),
    interests: v.array(v.string()),
    source: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("invited"), v.literal("joined")),
    createdAt: v.number(),
    invitedAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"]),
    
  serviceApplications: defineTable({
    workspace_id: v.string(),
    serviceName: v.string(),
    email: v.string(),
    name: v.string(),
    formData: v.any(),
    status: v.union(
      v.literal("submitted"),
      v.literal("processing"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("trial_started")
    ),
    notes: v.optional(v.string()),
    processedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace_service", ["workspace_id", "serviceName"])
    .index("by_workspace_email", ["workspace_id", "email"])
    .index("by_workspace_service_email", ["workspace_id", "serviceName", "email"])
    .index("by_workspace_service_status", ["workspace_id", "serviceName", "status"]),

  // プレイブック駆動型管理システム
  playbooks: defineTable({
    workspace_id: v.string(),
    id: v.string(), // pb-001, pb-002, etc.
    name: v.string(),
    description: v.string(),
    version: v.string(),
    category: v.string(), // lp-validation, mvp-development, etc.
    steps: v.array(v.object({
      stepNumber: v.number(),
      title: v.string(),
      description: v.string(),
      estimatedTime: v.optional(v.string()),
      requiredTools: v.optional(v.array(v.string())),
      successCriteria: v.array(v.string()),
    })),
    successMetrics: v.array(v.object({
      name: v.string(),
      targetValue: v.string(),
      measurement: v.string(),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace_id", ["workspace_id", "id"])
    .index("by_workspace_category", ["workspace_id", "category"]),

  playbookRuns: defineTable({
    workspace_id: v.string(),
    productId: v.string(), // 2025-08-001-mywa
    productName: v.string(),
    playbookId: v.string(), // pb-001
    phase: v.number(), // 0=planning, 1=validation, 2=development, 3=active
    status: v.union(v.literal("planned"), v.literal("running"), v.literal("completed"), v.literal("failed")),
    startedAt: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    actualMetrics: v.optional(v.array(v.object({
      name: v.string(),
      actualValue: v.string(),
      achievedAt: v.number(),
    }))),
    lessons: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    failureReason: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace_product", ["workspace_id", "productId"])
    .index("by_workspace_playbook", ["workspace_id", "playbookId"])
    .index("by_workspace_product_phase", ["workspace_id", "productId", "phase"])
    .index("by_workspace_status", ["workspace_id", "status"]),

  phaseReviews: defineTable({
    workspace_id: v.string(),
    productId: v.string(),
    productName: v.string(),
    phase: v.number(),
    status: v.union(v.literal("in_progress"), v.literal("completed"), v.literal("gate_passed"), v.literal("gate_failed")),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    kpiResults: v.array(v.object({
      metric: v.string(),
      target: v.string(),
      actual: v.optional(v.string()),
      achieved: v.optional(v.boolean()),
    })),
    executedPlaybooks: v.array(v.string()), // playbook IDs
    keyLearnings: v.array(v.string()),
    nextActions: v.array(v.string()),
    gateDecision: v.optional(v.object({
      decision: v.union(v.literal("proceed"), v.literal("retry"), v.literal("pivot"), v.literal("terminate")),
      reason: v.string(),
      decidedAt: v.number(),
      decidedBy: v.string(),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace_product", ["workspace_id", "productId"])
    .index("by_workspace_product_phase", ["workspace_id", "productId", "phase"])
    .index("by_workspace_status", ["workspace_id", "status"]),
});