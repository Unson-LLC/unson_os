import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { TenantAwareDatabase } from "./lib/tenantUtils";

// Refactor完了: テナント対応データアクセス層使用
export const createServiceApplication = mutation({
  args: {
    workspaceId: v.string(),
    serviceName: v.string(),
    email: v.string(),
    name: v.string(),
    formData: v.any(),
  },
  handler: async (ctx, args) => {
    const tenantDb = new TenantAwareDatabase(ctx);
    
    return await tenantDb.createServiceApplication(
      args.workspaceId,
      args.serviceName,
      args.email,
      args.name,
      args.formData
    );
  },
});

// Refactor完了: テナント対応データアクセス層使用
export const getApplicationsByService = query({
  args: {
    workspaceId: v.string(),
    serviceName: v.string(),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const tenantDb = new TenantAwareDatabase(ctx);
    
    return await tenantDb.getApplicationsByService(
      args.workspaceId,
      args.serviceName,
      args.status
    );
  },
});

// Refactor完了: テナント対応データアクセス層使用
export const updateApplicationStatus = mutation({
  args: {
    applicationId: v.id("serviceApplications"),
    status: v.union(
      v.literal("submitted"),
      v.literal("processing"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("trial_started")
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const tenantDb = new TenantAwareDatabase(ctx);
    
    return await tenantDb.updateApplicationStatus(
      args.applicationId,
      args.status,
      args.notes
    );
  },
});

// 追加: ユーザー申し込み履歴取得
export const getUserApplications = query({
  args: {
    workspaceId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const tenantDb = new TenantAwareDatabase(ctx);
    
    return await tenantDb.getUserApplications(
      args.workspaceId,
      args.email
    );
  },
});