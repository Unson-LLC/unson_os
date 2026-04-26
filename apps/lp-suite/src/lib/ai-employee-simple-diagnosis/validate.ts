import type { SimpleDiagnosisRequest, SimpleDiagnosisValidation, ValidationIssue } from './types';

const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^0\./,
  /^169\.254\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^\[?::1\]?$/i,
];

function isBlank(value: unknown): boolean {
  return typeof value !== 'string' || value.trim().length === 0;
}

export function error(code: string, message: string, path: string): ValidationIssue {
  return { code, message, severity: 'error', path };
}

export function warning(code: string, message: string, path: string): ValidationIssue {
  return { code, message, severity: 'warning', path };
}

function isBlockedHostname(hostname: string): boolean {
  const normalized = hostname.toLowerCase();
  return PRIVATE_HOST_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function normalizeWebsite(rawWebsite?: string): string {
  const trimmed = rawWebsite?.trim() || '';
  if (!trimmed) return '';
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function validateCompanyWebsite(rawWebsite?: string): ValidationIssue | null {
  const website = normalizeWebsite(rawWebsite);

  if (!website) {
    return error('missing_company_website', '会社ホームページURLを入力してください', 'company.website');
  }

  try {
    const parsed = new URL(website);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return error('invalid_company_website', 'URLの形式を確認してください', 'company.website');
    }
    if (!parsed.hostname.includes('.')) {
      return error('invalid_company_website', 'URLの形式を確認してください', 'company.website');
    }
    if (isBlockedHostname(parsed.hostname)) {
      return error('invalid_company_website', 'URLの形式を確認してください', 'company.website');
    }
  } catch {
    return error('invalid_company_website', 'URLの形式を確認してください', 'company.website');
  }

  return null;
}

export function validateSimpleDiagnosis(input: SimpleDiagnosisRequest): SimpleDiagnosisValidation {
  const errors: ValidationIssue[] = [];
  const websiteError = validateCompanyWebsite(input.company?.website);

  if (websiteError) {
    errors.push(websiteError);
  }

  if (isBlank(input.diagnosis_seed?.pain_category) && isBlank(input.diagnosis_seed?.pain_text)) {
    errors.push(error('missing_pain_signal', '近い課題を1つ選んでください', 'diagnosis_seed.pain_category'));
  }

  if (!isBlank(input.submitted_at) && Number.isNaN(Date.parse(input.submitted_at || ''))) {
    errors.push(error('invalid_submitted_at', 'submitted_at must be an ISO datetime.', 'submitted_at'));
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: [],
  };
}
