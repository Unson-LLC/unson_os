// ユーティリティ関数集約
import { 
  TREND_TYPES, 
  QUALITY_GRADES, 
  TREND_THRESHOLD_PERCENT,
  POSITION_STATUS_ICONS,
  MOBILE_BREAKPOINT
} from './constants';

export type TrendType = typeof TREND_TYPES[keyof typeof TREND_TYPES];
export type QualityGrade = typeof QUALITY_GRADES[keyof typeof QUALITY_GRADES]; 
export type PositionStatus = 'RUNNING' | 'OPTIMIZING' | 'CLOSED';

// トレンドアイコンクラス取得
export const getTrendIconClass = (trend: TrendType): string => {
  switch (trend) {
    case TREND_TYPES.UP: 
      return "w-4 h-4 text-green-500";
    case TREND_TYPES.DOWN: 
      return "w-4 h-4 text-red-500";
    case TREND_TYPES.STABLE: 
      return "w-4 h-4 text-gray-500";
    default:
      return "w-4 h-4 text-gray-500";
  }
};

// トレンド方向文字列取得
export const getTrendDirection = (current: number, previous: number): TrendType => {
  const diff = current - previous;
  const threshold = previous * TREND_THRESHOLD_PERCENT;
  
  if (diff > threshold) return TREND_TYPES.UP;
  if (diff < -threshold) return TREND_TYPES.DOWN;
  return TREND_TYPES.STABLE;
};

// トレンド矢印アイコン取得
export const getTrendArrow = (current: number, previous: number): string => {
  const diff = current - previous;
  const threshold = previous * TREND_THRESHOLD_PERCENT;
  
  if (diff > threshold) return '↗';
  if (diff < -threshold) return '↘';
  return '→';
};

// トレンドカラー取得
export const getTrendColor = (current: number, previous: number): string => {
  const diff = current - previous;
  const threshold = previous * TREND_THRESHOLD_PERCENT;
  
  if (diff > threshold) return 'text-green-500';
  if (diff < -threshold) return 'text-red-500';
  return 'text-gray-500';
};

// ステータスアイコン取得
export const getStatusIcon = (status: PositionStatus): string => {
  return POSITION_STATUS_ICONS[status] || '⚪';
};

// 品質グレードカラー取得
export const getGradeColor = (grade: QualityGrade): string => {
  switch (grade) {
    case QUALITY_GRADES.A_PLUS: 
      return 'text-green-600 bg-green-50';
    case QUALITY_GRADES.A: 
      return 'text-blue-600 bg-blue-50';
    case QUALITY_GRADES.B: 
      return 'text-yellow-600 bg-yellow-50';
    case QUALITY_GRADES.C: 
      return 'text-orange-600 bg-orange-50';
    case QUALITY_GRADES.D: 
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

// アクション種別カラー取得
export const getActionColor = (action: string): string => {
  if (action.includes('MVP') || action.includes('移行')) {
    return 'text-green-600 bg-green-50';
  }
  if (action.includes('改善') || action.includes('継続')) {
    return 'text-yellow-600 bg-yellow-50';
  }
  if (action.includes('撤退') || action.includes('終了')) {
    return 'text-red-600 bg-red-50';
  }
  return 'text-gray-600 bg-gray-50';
};

// 日付フォーマット（JST）
export const formatDateSeparator = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// 日付区切り判定
export const shouldShowDateSeparator = (
  currentTimestamp: string, 
  previousTimestamp?: string
): boolean => {
  if (!previousTimestamp) return false;
  
  const currentDate = new Date(currentTimestamp).toDateString();
  const previousDate = new Date(previousTimestamp).toDateString();
  
  return currentDate !== previousDate;
};

// レスポンシブ判定
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < MOBILE_BREAKPOINT;
};

export const isTabletDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < 1024;
};

// 無限スクロール判定
export const isNearBottom = (
  scrollTop: number, 
  scrollHeight: number, 
  clientHeight: number, 
  threshold: number = 100
): boolean => {
  return scrollTop + clientHeight >= scrollHeight - threshold;
};