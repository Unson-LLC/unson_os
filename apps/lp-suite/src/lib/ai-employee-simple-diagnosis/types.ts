export type ValidationSeverity = 'error' | 'warning';

export type ValidationIssue = {
  code: string;
  message: string;
  severity: ValidationSeverity;
  path?: string;
};

export type SimpleDiagnosisValidation = {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
};

export type SimpleDiagnosisRequest = {
  submitted_at?: string;
  form_variant?: string;
  landing_page?: string;
  referrer?: string;
  company?: {
    website?: string;
  };
  diagnosis_seed?: {
    pain_category?: PainCategory | string;
    pain_text?: string;
    current_tools?: string[];
    team_size?: string;
    urgency?: string;
  };
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
};

export type PainCategory =
  | 'sales_ops'
  | 'pm_dev'
  | 'research_docs'
  | 'management_ops'
  | 'support_backoffice'
  | 'unknown';

export type PrimaryUseCase =
  | 'sales_ai_employee'
  | 'pm_dev_ai_employee'
  | 'research_ai_employee'
  | 'management_ai_employee'
  | 'ops_ai_employee'
  | 'workflow_discovery';

export type HomepageSnapshot = {
  website: string;
  hostname: string;
  inferred_company_name: string;
  homepage_title: string;
  homepage_summary: string;
  confidence: 'low' | 'medium' | 'high';
  source: 'homepage' | 'input_only';
};

export type HomepageReadResult = {
  snapshot?: HomepageSnapshot;
  warnings?: ValidationIssue[];
};

export type UseCaseDefinition = {
  pain_category: PainCategory;
  primary_use_case: PrimaryUseCase;
  target_function: string;
  title: string;
  target_workflow: string;
  reason: string;
  first_poc_scope: string;
  claude_code_use_cases: string[];
  likely_bottlenecks: string[];
};

export type SimpleDiagnosisResult = {
  headline: string;
  primary_candidate: {
    use_case_id: PrimaryUseCase;
    title: string;
    target_workflow: string;
    reason: string;
    first_poc_scope: string;
  };
  claude_code_use_cases: string[];
  expected_change: string;
  likely_bottlenecks: string[];
  detail_diagnosis_agenda: string[];
  cta: {
    label: string;
    next_step: 'detailed_diagnosis';
  };
};

export type SimpleDiagnosisPostHogPlan = {
  event: 'simple_diagnosis_completed';
  properties: Record<string, unknown>;
};

export type IntakePrefill = {
  company: {
    website: string;
    name: string;
  };
  diagnosis: {
    target_function: string;
    pain: string;
    urgency: string;
    free_text: string;
  };
  attribution: {
    utm_source?: string | null;
    utm_medium?: string | null;
    utm_campaign?: string | null;
    utm_content?: string | null;
    keyword_family?: string | null;
  };
};

export type SimpleDiagnosisResponse = {
  ok: boolean;
  simple_diagnosis_id?: string;
  validation: SimpleDiagnosisValidation;
  company_snapshot?: HomepageSnapshot;
  result?: SimpleDiagnosisResult;
  handoff?: {
    intake_prefill: IntakePrefill;
  };
  posthog?: SimpleDiagnosisPostHogPlan;
};
