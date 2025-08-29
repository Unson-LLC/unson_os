// 共通スタイル定義
export const commonStyles = {
  // ベーススタイル
  card: "bg-white rounded-lg shadow overflow-hidden",
  cardPadding: "px-6 py-4",
  
  // ボタンスタイル
  buttonPrimary: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors",
  buttonSecondary: "px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors",
  buttonDanger: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors",
  
  // インタラクティブ要素
  focusRing: "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset",
  hoverRow: "hover:bg-gray-50 cursor-pointer transition-colors",
  selectedRow: "bg-blue-50 border-l-4 border-blue-500",
  
  // レイアウト
  flexBetween: "flex items-center justify-between",
  flexCenter: "flex items-center justify-center",
  gridCols2: "grid grid-cols-2 gap-4",
  gridCols4: "grid grid-cols-4 gap-4",
  
  // テキストスタイル
  textPrimary: "text-gray-900",
  textSecondary: "text-gray-600", 
  textMuted: "text-gray-500",
  textError: "text-red-600",
  textSuccess: "text-green-600",
  textWarning: "text-yellow-600",
  
  // フォントサイズ
  textXs: "text-xs",
  textSm: "text-sm",
  textBase: "text-base",
  textLg: "text-lg",
  textXl: "text-xl",
  text2Xl: "text-2xl",
  
  // フォントウェイト
  fontMedium: "font-medium",
  fontSemibold: "font-semibold", 
  fontBold: "font-bold",
  
  // スペーシング
  spaceY2: "space-y-2",
  spaceY3: "space-y-3",
  spaceY4: "space-y-4",
  spaceY6: "space-y-6",
  
  // ボーダー
  borderGray: "border border-gray-200",
  borderBlue: "border border-blue-200",
  borderRed: "border border-red-200",
  borderGreen: "border border-green-200",
  borderYellow: "border border-yellow-200",
  
  // 背景色
  bgGray50: "bg-gray-50",
  bgBlue50: "bg-blue-50", 
  bgRed50: "bg-red-50",
  bgGreen50: "bg-green-50",
  bgYellow50: "bg-yellow-50",
  bgPurple50: "bg-purple-50",
  
  // AIコメント専用
  aiComment: "text-sm text-purple-600 bg-purple-50 p-2 rounded font-ai",
  
  // アニメーション
  animate: {
    pulse: "animate-pulse",
    spin: "animate-spin"
  },
  
  // レスポンシブ
  responsive: {
    mobileHidden: "hidden md:block",
    desktopHidden: "block md:hidden",
    mobileLayout: "mobile-layout",
    desktopLayout: "desktop-layout",
    tabletLayout: "tablet-layout"
  },
  
  // ローディング・スケルトン
  skeleton: {
    base: "animate-pulse",
    line: "h-4 bg-gray-200 rounded",
    shortLine: "h-3 bg-gray-200 rounded w-1/2",
    longLine: "h-4 bg-gray-200 rounded w-3/4"
  }
};

// グレード別カラーマッピング
export const gradeColorMap = {
  'A+': 'text-green-600 bg-green-50',
  'A': 'text-blue-600 bg-blue-50',
  'B': 'text-yellow-600 bg-yellow-50',
  'C': 'text-orange-600 bg-orange-50', 
  'D': 'text-red-600 bg-red-50'
} as const;

// ステータス別カラーマッピング
export const statusColorMap = {
  RUNNING: '#10B981',
  OPTIMIZING: '#F59E0B',
  CLOSED: '#EF4444'
} as const;

// クラス名結合ユーティリティ
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};