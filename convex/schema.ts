import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // LP検証システム関連
  lpValidationSessions: defineTable({
    workspace_id: v.string(),
    product_id: v.string(),
    session_id: v.string(),
    status: v.union(
      v.literal("active"), 
      v.literal("paused"), 
      v.literal("completed"),
      v.literal("failed")
    ),
    
    // 基本情報
    product_name: v.string(),
    lp_url: v.string(),
    start_date: v.number(),
    end_date: v.optional(v.number()),
    
    // 目標設定
    target_cvr: v.number(),
    target_cpa: v.number(),
    min_sessions: v.number(),
    
    // 現在の実績
    current_cvr: v.number(),
    current_cpa: v.number(),
    total_sessions: v.number(),
    total_conversions: v.number(),
    total_spend: v.number(),
    
    // 統計
    statistical_significance: v.boolean(),
    confidence_interval: v.optional(v.array(v.number())),
    
    // 外部システム連携
    google_ads_campaign_id: v.optional(v.string()),
    posthog_project_id: v.optional(v.string()),
    
    // 自動化設定
    automation_enabled: v.boolean(),
    auto_optimization: v.boolean(),
    auto_deployment: v.boolean(),
    
    // プレイブック連携
    current_playbook_id: v.optional(v.string()),
    current_playbook_status: v.optional(v.string()),
    
    // メタデータ
    created_by: v.string(),
    created_at: v.number(),
    updated_at: v.number(),
  })
  .index("by_workspace", ["workspace_id"])
  .index("by_product", ["product_id"])
  .index("by_status", ["status"])
  .index("by_workspace_status", ["workspace_id", "status"]),

  automationExecutions: defineTable({
    workspace_id: v.string(),
    session_id: v.string(),
    execution_id: v.string(),
    
    execution_type: v.union(
      v.literal("google_ads_optimization"),
      v.literal("lp_content_optimization"),
      v.literal("phase_gate_evaluation"),
      v.literal("playbook_step_execution"),
      v.literal("playbook_phase_transition")
    ),
    
    status: v.union(
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
    
    // 実行内容
    input_data: v.any(),
    execution_details: v.any(),
    output_data: v.any(),
    
    // 結果・効果測定
    metrics_before: v.optional(v.any()),
    metrics_after: v.optional(v.any()),
    impact_analysis: v.optional(v.string()),
    
    // AI分析
    ai_reasoning: v.optional(v.string()),
    confidence_score: v.optional(v.number()),
    
    // 実行時間
    started_at: v.number(),
    completed_at: v.optional(v.number()),
    duration_ms: v.optional(v.number()),
    
    // エラー情報
    error_message: v.optional(v.string()),
    retry_count: v.number(),
    
    created_at: v.number(),
  })
  .index("by_workspace", ["workspace_id"])
  .index("by_session", ["session_id"])
  .index("by_type", ["execution_type"])
  .index("by_status", ["status"]),

  // プレイブック実行管理
  playbookExecutions: defineTable({
    workspace_id: v.string(),
    session_id: v.string(),
    execution_id: v.string(),
    
    // プレイブック情報
    playbook_id: v.string(),
    playbook_name: v.string(),
    playbook_version: v.string(),
    
    // 実行状態
    status: v.union(
      v.literal("initialized"),
      v.literal("in_progress"),
      v.literal("phase_gate_pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("cancelled")
    ),
    
    // フェーズ管理
    current_phase: v.number(),
    total_phases: v.number(),
    phase_completion_percentage: v.number(),
    
    // 実行設定
    configuration: v.any(),
    next_actions: v.array(v.string()),
    
    // KPI管理
    kpi_targets: v.any(),
    kpi_current: v.any(),
    success_criteria_met: v.boolean(),
    
    // 実行時間
    started_at: v.number(),
    completed_at: v.optional(v.number()),
    estimated_completion: v.optional(v.number()),
    
    // 結果
    execution_summary: v.optional(v.string()),
    lessons_learned: v.optional(v.array(v.string())),
    
    created_at: v.number(),
    updated_at: v.number(),
  })
  .index("by_workspace", ["workspace_id"])
  .index("by_session", ["session_id"])
  .index("by_playbook", ["playbook_id"])
  .index("by_status", ["status"])
  .index("by_workspace_playbook", ["workspace_id", "playbook_id"]),

  playbookStepExecutions: defineTable({
    workspace_id: v.string(),
    execution_id: v.string(),
    step_execution_id: v.string(),
    
    // ステップ情報
    phase_number: v.number(),
    step_number: v.number(),
    step_name: v.string(),
    step_type: v.union(
      v.literal("validation"),
      v.literal("optimization"),
      v.literal("content_creation"),
      v.literal("deployment"),
      v.literal("measurement"),
      v.literal("phase_gate")
    ),
    
    // 実行状態
    status: v.union(
      v.literal("pending"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("skipped")
    ),
    
    // 実行内容
    input_parameters: v.any(),
    execution_details: v.any(),
    output_results: v.any(),
    
    // 成功条件
    success_criteria: v.any(),
    success_achieved: v.boolean(),
    
    // AI分析
    ai_analysis: v.optional(v.string()),
    recommendations: v.optional(v.array(v.string())),
    
    // 実行時間
    started_at: v.optional(v.number()),
    completed_at: v.optional(v.number()),
    duration_ms: v.optional(v.number()),
    
    // エラー情報
    error_message: v.optional(v.string()),
    retry_count: v.number(),
    
    created_at: v.number(),
    updated_at: v.number(),
  })
  .index("by_workspace", ["workspace_id"])
  .index("by_execution", ["execution_id"])
  .index("by_phase_step", ["phase_number", "step_number"])
  .index("by_status", ["status"]),

  systemAlerts: defineTable({
    workspace_id: v.string(),
    alert_id: v.string(),
    
    alert_type: v.union(
      v.literal("cpa_exceeded"),
      v.literal("cvr_dropped"),
      v.literal("automation_failed"),
      v.literal("phase_gate_ready"),
      v.literal("phase_transition_ready"),
      v.literal("playbook_step_failed"),
      v.literal("budget_depleted")
    ),
    
    severity: v.union(
      v.literal("critical"),
      v.literal("warning"),
      v.literal("info")
    ),
    
    title: v.string(),
    message: v.string(),
    
    // 関連リソース
    related_session_id: v.optional(v.string()),
    related_product_id: v.optional(v.string()),
    
    // アラート状態
    status: v.union(
      v.literal("active"),
      v.literal("acknowledged"),
      v.literal("resolved"),
      v.literal("dismissed")
    ),
    
    // 通知
    notification_sent: v.boolean(),
    notification_channels: v.array(v.string()),
    
    // 解決情報
    resolved_by: v.optional(v.string()),
    resolved_at: v.optional(v.number()),
    resolution_notes: v.optional(v.string()),
    
    created_at: v.number(),
  })
  .index("by_workspace", ["workspace_id"])
  .index("by_status", ["status"])
  .index("by_severity", ["severity"])
  .index("by_type", ["alert_type"]),

  // 既存テーブル
  discordApplications: defineTable({
    workspace_id: v.optional(v.string()), // 既存データに合わせて一時的にオプション
    application_id: v.optional(v.string()), // 既存データに合わせてオプション
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
    .index("by_workspace_application", ["workspace_id", "application_id"])
    .index("by_workspace_email", ["workspace_id", "email"])
    .index("by_status", ["status"])
    .index("by_workspace", ["workspace_id"]),
    
  careerApplications: defineTable({
    workspace_id: v.optional(v.string()), // 既存データに合わせてオプション
    application_id: v.optional(v.string()), // 既存データに合わせてオプション
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
    .index("by_workspace_application", ["workspace_id", "application_id"])
    .index("by_workspace_email", ["workspace_id", "email"])
    .index("by_position", ["position"])
    .index("by_status", ["status"])
    .index("by_workspace", ["workspace_id"]),
    
  contacts: defineTable({
    workspace_id: v.optional(v.string()), // 既存データに合わせてオプション
    contact_id: v.optional(v.string()), // 既存データに合わせてオプション
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    phone: v.optional(v.string()),
    type: v.string(),
    message: v.string(),
    status: v.union(v.literal("new"), v.literal("in_progress"), v.literal("resolved"), v.literal("closed")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace_contact", ["workspace_id", "contact_id"])
    .index("by_workspace_email", ["workspace_id", "email"])
    .index("by_status", ["status"])
    .index("by_type", ["type"])
    .index("by_workspace", ["workspace_id"]),
    
  productRequests: defineTable({
    workspace_id: v.optional(v.string()), // 既存データに合わせてオプション
    request_id: v.optional(v.string()), // 既存データに合わせてオプション
    name: v.string(),
    email: v.string(),
    productType: v.string(),
    description: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    status: v.union(v.literal("submitted"), v.literal("reviewing"), v.literal("approved"), v.literal("rejected")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_workspace_request", ["workspace_id", "request_id"])
    .index("by_workspace_email", ["workspace_id", "email"])
    .index("by_status", ["status"])
    .index("by_priority", ["priority"])
    .index("by_productType", ["productType"])
    .index("by_workspace", ["workspace_id"]),
    
  products: defineTable({
    workspace_id: v.string(),
    product_id: v.string(),
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
    .index("by_workspace_product", ["workspace_id", "product_id"])
    .index("by_status", ["status"])
    .index("by_category", ["category"])
    .index("by_workspace", ["workspace_id"]),
    
  waitlist: defineTable({
    workspace_id: v.optional(v.string()), // 既存データに合わせてオプション
    waitlist_id: v.optional(v.string()), // 既存データに合わせてオプション
    email: v.string(),
    name: v.optional(v.string()),
    company: v.optional(v.string()),
    interests: v.array(v.string()),
    source: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("invited"), v.literal("joined")),
    createdAt: v.number(),
    invitedAt: v.optional(v.number()),
  })
    .index("by_workspace_waitlist", ["workspace_id", "waitlist_id"])
    .index("by_workspace_email", ["workspace_id", "email"])
    .index("by_status", ["status"])
    .index("by_workspace", ["workspace_id"]),
    
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
    product_id: v.string(), // AI-BRIDGE, MYWA, AI-COACH, etc.
    productName: v.string(), // 設計書では productName を使用
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
    .index("by_workspace_product", ["workspace_id", "product_id"])
    .index("by_workspace_playbook", ["workspace_id", "playbookId"])
    .index("by_workspace_product_phase", ["workspace_id", "product_id", "phase"])
    .index("by_workspace_status", ["workspace_id", "status"]),

  // Google Ads 日次メトリクス（プロダクト別）
  adsDailyMetrics: defineTable({
    workspace_id: v.string(),
    product_id: v.string(),
    platform: v.optional(v.string()), // 'Google Ads'
    date: v.string(), // 'YYYY-MM-DD'
    impressions: v.number(),
    clicks: v.number(),
    cost: v.number(), // JPY
    conversions: v.number(),
    created_at: v.number(),
    updated_at: v.number(),
  })
    .index("by_product_date", ["product_id", "date"]) 
    .index("by_workspace_product", ["workspace_id", "product_id"]),

  // Google Ads 時間窓メトリクス（例: 4時間）
  adsWindowMetrics: defineTable({
    workspace_id: v.string(),
    product_id: v.string(),
    platform: v.optional(v.string()), // 'Google Ads'
    ts_start: v.number(), // window start timestamp (ms)
    window_hours: v.number(), // e.g., 4
    impressions: v.number(),
    clicks: v.number(),
    cost: v.number(), // JPY
    conversions: v.number(),
    created_at: v.number(),
    updated_at: v.number(),
  })
    .index("by_product_ts", ["product_id", "ts_start"]) 
    .index("by_workspace_product", ["workspace_id", "product_id"]),

  phaseReviews: defineTable({
    workspace_id: v.string(),
    product_id: v.string(), // 設計書: productId → product_id
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
    .index("by_workspace_product", ["workspace_id", "product_id"])
    .index("by_workspace_product_phase", ["workspace_id", "product_id", "phase"])
    .index("by_workspace_status", ["workspace_id", "status"]),

  // PostHog Feature Flag同期履歴
  posthogFlagSync: defineTable({
    workspace_id: v.string(),
    ab_test_id: v.string(),
    flag_key: v.string(),
    sync_type: v.union(
      v.literal("create"),
      v.literal("update"), 
      v.literal("delete")
    ),
    before_state: v.union(v.null(), v.any()),
    after_state: v.union(v.null(), v.any()),
    success: v.boolean(),
    error_message: v.optional(v.string()),
    synced_at: v.number(),
  })
  .index("by_ab_test", ["ab_test_id"])
  .index("by_workspace", ["workspace_id"])
  .index("by_sync_type", ["sync_type"])
  .index("by_timestamp", ["synced_at"]),

  // キャンペーン管理テーブル
  campaigns: defineTable({
    workspace_id: v.string(),
    product_id: v.string(),
    campaign_id: v.string(), // Google Ads Campaign ID
    campaign_name: v.string(),
    platform: v.string(), // 'Google Ads', 'Facebook', etc.
    status: v.union(
      v.literal("active"), 
      v.literal("paused"), 
      v.literal("ended"),
      v.literal("draft")
    ),
    campaign_type: v.optional(v.string()), // 'Search', 'Display', 'Shopping'
    budget_daily: v.optional(v.number()), // 日予算 (JPY)
    target_cpa: v.optional(v.number()), // 目標CPA (JPY)
    target_roas: v.optional(v.number()), // 目標ROAS
    start_date: v.number(), // キャンペーン開始日
    end_date: v.optional(v.number()), // キャンペーン終了日
    created_at: v.number(),
    updated_at: v.number(),
  })
    .index("by_workspace_product", ["workspace_id", "product_id"])
    .index("by_product_status", ["product_id", "status"])
    .index("by_campaign_id", ["campaign_id"]),

  // アラート管理テーブル（設計書準拠版）
  alerts: defineTable({
    workspace_id: v.string(),
    alert_id: v.string(),
    product_id: v.string(), // 設計書に合わせて必須に変更
    alert_type: v.union(
      v.literal("cvr_below_threshold"),
      v.literal("cpa_above_threshold"), 
      v.literal("budget_depleted"),
      v.literal("anomaly_detected"),
      v.literal("revenue_drop"),
      v.literal("campaign_paused")
    ),
    severity: v.union(
      v.literal("critical"),
      v.literal("high"),
      v.literal("medium"),
      v.literal("low")
    ),
    title: v.string(),
    message: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("acknowledged"), 
      v.literal("resolved"),
      v.literal("dismissed")
    ),
    // 設計書追加フィールド
    threshold_value: v.optional(v.number()),
    current_value: v.optional(v.number()),
    session_id: v.optional(v.string()),
    campaign_id: v.optional(v.string()),
    // 解決情報
    resolved_by: v.optional(v.string()),
    resolved_at: v.optional(v.number()),
    resolution_notes: v.optional(v.string()),
    created_at: v.number(),
    updated_at: v.number(),
  })
    .index("by_workspace", ["workspace_id"])
    .index("by_workspace_product", ["workspace_id", "product_id"])
    .index("by_status", ["status"])
    .index("by_severity", ["severity"])
    .index("by_type", ["alert_type"]),

  // LP A/Bテスト設定
  lpConfigs: defineTable({
    workspace_id: v.string(),
    config_id: v.string(),
    product_id: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    content: v.any(), // LP configuration content
    version: v.optional(v.string()),
    is_control: v.boolean(),
    is_active: v.boolean(),
    created_at: v.number(),
    updated_at: v.number(),
  })
    .index("by_workspace", ["workspace_id"])
    .index("by_config_id", ["config_id"])
    .index("by_product", ["product_id"])
    .index("by_workspace_product", ["workspace_id", "product_id"]),

  // A/Bテスト管理
  lpAbTests: defineTable({
    workspace_id: v.string(),
    test_id: v.string(),
    product_id: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("draft"),
      v.literal("running"),
      v.literal("paused"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    posthog_flag_key: v.optional(v.string()),
    control_config_id: v.string(),
    variant_configs: v.array(v.object({
      config_id: v.string(),
      traffic_percentage: v.number(),
      name: v.string(),
    })),
    primary_metric: v.string(),
    secondary_metrics: v.optional(v.array(v.string())),
    target_sample_size: v.optional(v.number()),
    current_sample_size: v.number(),
    significance_threshold: v.number(),
    start_date: v.optional(v.number()),
    end_date: v.optional(v.number()),
    planned_duration_days: v.optional(v.number()),
    auto_declare_winner: v.boolean(),
    auto_stop_on_significance: v.boolean(),
    auto_traffic_allocation: v.boolean(),
    created_at: v.number(),
    updated_at: v.number(),
    created_by: v.string(),
  })
    .index("by_workspace", ["workspace_id"])
    .index("by_test_id", ["test_id"])
    .index("by_product", ["product_id"])
    .index("by_status", ["status"])
    .index("by_workspace_product", ["workspace_id", "product_id"]),
});
