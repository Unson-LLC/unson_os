// LP検証システム型定義
export interface OptimizationResult {
  sessionId: string;
  optimizedLP: {
    headline: string;
    description: string;
    ctaText: string;
    keywords: string[];
    bidAdjustment: number;
  };
  metrics: {
    cvr: number;
    cpa: number;
    sessions: number;
    conversions: number;
    confidence: number;
  };
  improvements: string[];
  timestamp: Date;
}

export interface PhaseTransitionResult {
  sessionId: string;
  currentPhase: number;
  nextPhase: number;
  transitionDecision: {
    shouldTransition: boolean;
    confidence: number;
    reasons: string[];
  };
  phaseConfig: {
    phase: number;
    duration: string;
    budget: number;
    targetCVR: number;
    targetCPA: number;
  };
  metrics: {
    currentCVR: number;
    currentCPA: number;
    sessions: number;
    conversions: number;
    significance: number;
  };
  timestamp: Date;
}

export interface PRAutomationConfig {
  owner: string;
  repo: string;
  token: string;
  githubApi?: any;
}

export interface PRCreationResult {
  success: boolean;
  prUrl?: string;
  prNumber?: number;
  error?: string;
}

export interface PRContent {
  title: string;
  body: string;
  base: string;
  head: string;
}