// 共通定数定義
export const TIME_RANGES = {
  FOUR_HOURS: '4h',
  ONE_DAY: '1d', 
  ONE_WEEK: '1w'
} as const;

export const TIME_RANGE_LABELS = {
  [TIME_RANGES.FOUR_HOURS]: '4時間',
  [TIME_RANGES.ONE_DAY]: '1日',
  [TIME_RANGES.ONE_WEEK]: '1週間'
} as const;

export const POSITION_STATUS = {
  RUNNING: 'RUNNING',
  OPTIMIZING: 'OPTIMIZING', 
  CLOSED: 'CLOSED'
} as const;

export const POSITION_STATUS_ICONS = {
  [POSITION_STATUS.RUNNING]: '🟢',
  [POSITION_STATUS.OPTIMIZING]: '🟡',
  [POSITION_STATUS.CLOSED]: '🔴'
} as const;

export const TREND_TYPES = {
  UP: 'up',
  DOWN: 'down',
  STABLE: 'stable'
} as const;

export const QUALITY_GRADES = {
  A_PLUS: 'A+',
  A: 'A',
  B: 'B', 
  C: 'C',
  D: 'D'
} as const;

export const SORT_OPTIONS = {
  CVR: 'cvr',
  CPL: 'cpl',
  LEADS: 'leads'
} as const;

export const FILTER_OPTIONS = {
  ALL: 'all',
  ACTIVE: 'active'
} as const;

export const MOBILE_BREAKPOINT = 768;
export const TABLET_BREAKPOINT = 1024;

export const SCROLL_THRESHOLD = 100;
export const TREND_THRESHOLD_PERCENT = 0.05;

export const MOCK_ACTION_DELAY = 1000;