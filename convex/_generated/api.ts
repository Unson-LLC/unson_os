// Generated type definitions for Convex API

import { Id } from "./_generated/dataModel";

export interface LPValidationSession {
  _id: Id<"lpValidationSessions">;
  workspace_id: string;
  product_id: string;
  session_id: string;
  status: "active" | "paused" | "completed" | "failed";
  product_name: string;
  lp_url: string;
  start_date: number;
  end_date?: number;
  current_cvr: number;
  target_cvr: number;
  current_cpa: number;
  target_cpa: number;
  total_sessions: number;
  min_sessions: number;
  total_conversions: number;
  total_spend: number;
  statistical_significance: boolean;
  created_at: number;
  updated_at: number;
  confidence_interval?: [number, number];
}

export interface AutomationExecution {
  _id: Id<"automationExecutions">;
  execution_id: string;
  session_id: Id<"lpValidationSessions">;
  execution_type: "google_ads_optimization" | "lp_content_optimization" | "phase_gate_evaluation";
  status: "running" | "completed" | "failed";
  started_at: number;
  completed_at?: number;
  duration_ms?: number;
  input_data?: any;
  output_data?: any;
  error_message?: string;
  retry_count?: number;
  metrics_before?: {
    cpa: number;
    cvr: number;
  };
  metrics_after?: {
    cpa: number;
    cvr: number;
  };
  ai_reasoning?: string;
  confidence_score?: number;
}

export interface SystemAlert {
  _id: Id<"systemAlerts">;
  alert_id: string;
  session_id: Id<"lpValidationSessions">;
  execution_id?: string;
  alert_type: "performance_decline" | "budget_exceeded" | "target_not_met" | "api_error" | "phase_transition_ready";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  message: string;
  status: "active" | "acknowledged" | "resolved";
  created_at: number;
  acknowledged_at?: number;
  resolved_at?: number;
}