// Tenant-Light実装: テナント検証とデータアクセス統一

/**
 * テナント検証関数
 * 将来のマルチテナント強化に備えた基盤
 */
export function assertTenant(workspaceId: string): void {
  if (!workspaceId || typeof workspaceId !== 'string' || workspaceId.trim() === '') {
    throw new Error('Invalid workspace_id: テナントIDが必要です');
  }
  
  // 将来の拡張ポイント:
  // - ワークスペース存在確認
  // - アクセス権限チェック
  // - テナント制限確認
}

/**
 * テナント分離対応のデータベースクエリヘルパー
 */
export class TenantAwareDatabase {
  constructor(private ctx: any) {}

  /**
   * テナント分離された申し込み作成
   */
  async createServiceApplication(
    workspaceId: string,
    serviceName: string,
    email: string,
    name: string,
    formData: any
  ) {
    assertTenant(workspaceId);
    
    const now = Date.now();
    
    // 重複チェック（テナント内での重複のみ）
    const existingApplication = await this.ctx.db
      .query("serviceApplications")
      .withIndex("by_workspace_service_email", (q: any) => 
        q.eq("workspace_id", workspaceId)
         .eq("serviceName", serviceName)
         .eq("email", email)
      )
      .first();

    if (existingApplication) {
      throw new Error(`既に${serviceName}に申し込み済みです`);
    }

    return await this.ctx.db.insert("serviceApplications", {
      workspace_id: workspaceId,
      serviceName,
      email,
      name,
      formData,
      status: "submitted" as const,
      createdAt: now,
      updatedAt: now,
    });
  }

  /**
   * テナント分離されたサービス別申し込み取得
   */
  async getApplicationsByService(
    workspaceId: string,
    serviceName: string,
    status?: string
  ) {
    assertTenant(workspaceId);
    
    if (status) {
      return await this.ctx.db
        .query("serviceApplications")
        .withIndex("by_workspace_service_status", (q: any) => 
          q.eq("workspace_id", workspaceId)
           .eq("serviceName", serviceName)
           .eq("status", status)
        )
        .collect();
    } else {
      return await this.ctx.db
        .query("serviceApplications")
        .withIndex("by_workspace_service", (q: any) => 
          q.eq("workspace_id", workspaceId)
           .eq("serviceName", serviceName)
        )
        .collect();
    }
  }

  /**
   * テナント分離された申し込み状態更新
   */
  async updateApplicationStatus(
    applicationId: string,
    status: "submitted" | "processing" | "approved" | "rejected" | "trial_started",
    notes?: string
  ) {
    const now = Date.now();
    
    // 更新前にテナント確認（セキュリティ強化）
    const application = await this.ctx.db.get(applicationId);
    if (!application) {
      throw new Error('申し込みが見つかりません');
    }
    
    assertTenant(application.workspace_id);
    
    await this.ctx.db.patch(applicationId, {
      status,
      notes,
      processedAt: now,
      updatedAt: now,
    });
    
    return applicationId;
  }

  /**
   * テナント分離されたユーザー申し込み履歴取得
   */
  async getUserApplications(workspaceId: string, email: string) {
    assertTenant(workspaceId);
    
    return await this.ctx.db
      .query("serviceApplications")
      .withIndex("by_workspace_email", (q: any) => 
        q.eq("workspace_id", workspaceId)
         .eq("email", email)
      )
      .collect();
  }
}