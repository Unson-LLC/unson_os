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
    category: v.string(),
    status: v.union(v.literal("planning"), v.literal("development"), v.literal("testing"), v.literal("launched")),
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
});