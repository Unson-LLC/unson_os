import type { AiEmployeeIntakeRequest, IntakeValidation, ValidationIssue } from './types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isBlank(value: unknown): boolean {
  return typeof value !== 'string' || value.trim().length === 0;
}

function error(code: string, message: string, path: string): ValidationIssue {
  return { code, message, severity: 'error', path };
}

function warning(code: string, message: string, path: string): ValidationIssue {
  return { code, message, severity: 'warning', path };
}

export function validateIntake(input: AiEmployeeIntakeRequest): IntakeValidation {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const email = input.contact?.email?.trim();

  if (isBlank(input.company?.name)) {
    errors.push(error('missing_company_name', 'company.name is required.', 'company.name'));
  }

  if (isBlank(input.contact?.name)) {
    errors.push(error('missing_contact_name', 'contact.name is required.', 'contact.name'));
  }

  if (isBlank(email)) {
    errors.push(error('missing_contact_email', 'contact.email is required.', 'contact.email'));
  } else if (!EMAIL_PATTERN.test(email || '')) {
    errors.push(error('invalid_contact_email', 'contact.email must be a valid email address.', 'contact.email'));
  }

  if (input.consent?.privacy_policy !== true) {
    errors.push(error('missing_privacy_consent', 'consent.privacy_policy must be true.', 'consent.privacy_policy'));
  }

  if (isBlank(input.diagnosis?.target_function)) {
    errors.push(error('missing_target_function', 'diagnosis.target_function is required.', 'diagnosis.target_function'));
  }

  if (isBlank(input.diagnosis?.pain)) {
    errors.push(error('missing_pain', 'diagnosis.pain is required.', 'diagnosis.pain'));
  }

  if (isBlank(input.diagnosis?.urgency)) {
    errors.push(error('missing_urgency', 'diagnosis.urgency is required.', 'diagnosis.urgency'));
  }

  if (isBlank(input.submitted_at)) {
    errors.push(error('missing_submitted_at', 'submitted_at is required.', 'submitted_at'));
  } else if (Number.isNaN(Date.parse(input.submitted_at || ''))) {
    errors.push(error('invalid_submitted_at', 'submitted_at must be an ISO datetime.', 'submitted_at'));
  }

  if (isBlank(input.diagnosis?.budget_signal) || input.diagnosis?.budget_signal === 'unknown') {
    warnings.push(warning('budget_unknown', 'budget_signal is unknown.', 'diagnosis.budget_signal'));
  }

  if (isBlank(input.diagnosis?.authority_signal) || input.diagnosis?.authority_signal === 'unknown') {
    warnings.push(warning('authority_unknown', 'authority_signal is unknown.', 'diagnosis.authority_signal'));
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
