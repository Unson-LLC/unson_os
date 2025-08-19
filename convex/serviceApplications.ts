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

// デバッグ用: 全ての申し込みデータを取得
export const getAllApplications = query({
  args: {
    workspaceId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const db = ctx.db;
    const applications = await db
      .query("serviceApplications")
      .filter(q => 
        args.workspaceId 
          ? q.eq(q.field("workspaceId"), args.workspaceId)
          : true
      )
      .order("desc")
      .take(20);
    
    return applications;
  },
});

// テストデータ削除用関数
export const deleteTestApplications = mutation({
  args: {},
  handler: async (ctx) => {
    const db = ctx.db;
    
    // テストデータを特定（test@example.comとtest2@example.comのデータ）
    const testApplications = await db
      .query("serviceApplications")
      .filter(q => 
        q.or(
          q.eq(q.field("email"), "test@example.com"),
          q.eq(q.field("email"), "test2@example.com")
        )
      )
      .collect();
    
    // テストデータを削除
    const deletedIds = [];
    for (const app of testApplications) {
      await db.delete(app._id);
      deletedIds.push(app._id);
    }
    
    return {
      deletedCount: deletedIds.length,
      deletedIds: deletedIds
    };
  },
});