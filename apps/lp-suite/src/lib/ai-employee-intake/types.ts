export type ValidationSeverity = 'error' | 'warning';

export type ValidationIssue = {
  code: string;
  message: string;
  severity: ValidationSeverity;
  path?: string;
};

export type IntakeValidation = {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
};

export type AiEmployeeIntakeRequest = {
  submitted_at?: string;
  form_variant?: string;
  landing_page?: string;
  referrer?: string;
  attribution?: {
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
    utm_content?: string | null;
    utm_term?: string | null;
    keyword_family?: string | null;
    click_ids?: {
      xclid?: string | null;
      fbclid?: string | null;
      gclid?: string | null;
    };
  };
  company?: {
    name?: string;
    website?: string;
    size?: string;
    industry?: string;
  };
  contact?: {
    name?: string;
    email?: string;
    phone?: string;
    department?: string;
    role?: string;
  };
  diagnosis?: {
    target_function?: string;
    ai_adoption_stage?: string;
    pain?: string;
    urgency?: string;
    budget_signal?: string;
    authority_signal?: string;
    free_text?: string;
  };
  consent?: {
    privacy_policy?: boolean;
    marketing_contact?: boolean;
  };
};

export type IntakeStableIds = {
  brainbase_customer_id: string;
  brainbase_contact_id: string;
  brainbase_push_case_id: string;
  diagnosis_id: string;
};

export type DedupePlan = {
  customer: {
    key: string;
    id: string;
    action: 'upsert';
  };
  contact: {
    key: string;
    id: string;
    action: 'upsert';
  };
  push_case: {
    key: string;
    id: string;
    action: 'upsert';
  };
  diagnosis: {
    key: string;
    id: string;
    action: 'create';
  };
};

export type GraphEntity = {
  id: string;
  entityType: 'customer' | 'contact' | 'push_case' | 'diagnosis';
  projectCode: 'unson';
  projectName: 'Unson';
  roleMin: 'gm';
  sensitivity: 'restricted';
  payload: Record<string, unknown>;
};

export type GraphEdge = {
  fromId: string;
  toId: string;
  relType:
    | 'has_push_case'
    | 'participates_in'
    | 'primary_contact_for'
    | 'has_diagnosis'
    | 'belongs_to_customer'
    | 'governed_by';
};

export type PostHogCapturePlan = {
  event: 'diagnosis_form_submit';
  distinct_id: string;
  timestamp: string;
  properties: Record<string, unknown>;
};

export type NocoDbProjectionPlan = {
  baseId: 'pipf5irgs2lzuon';
  tableName: '推進案件';
  fields: Record<string, unknown>;
};

export type IntakeDryRunResponse = {
  ok: boolean;
  dry_run: true;
  validation: IntakeValidation;
  ids?: IntakeStableIds;
  dedupe?: DedupePlan;
  write_plan: string[];
  graph: {
    entities: GraphEntity[];
    edges: GraphEdge[];
  };
  posthog?: PostHogCapturePlan;
  nocodb_projection?: NocoDbProjectionPlan;
  next?: 'booking';
};
