/**
 * Google Ads コンバージョン設定関連の型定義
 * 
 * UnsonOSの自動化システムで使用される全ての型を定義
 * 
 * @author UnsonOS Team
 * @version 1.0.0
 */

/**
 * Google Ads コンバージョンラベル情報
 * 
 * Google Ads APIから取得されるコンバージョンアクション情報を表現
 */
export interface ConversionLabel {
  /** Google Ads内部のコンバージョンアクションID */
  id: string;
  /** コンバージョンアクション表示名（例: "ベータテスター登録完了"） */
  name: string;
  /** 実際のトラッキングで使用するラベル文字列 */
  label: string;
}

/**
 * コンバージョン設定情報
 * 
 * @deprecated AutoSetupResultを使用してください
 */
export interface ConversionSettings {
  /** 設定されたコンバージョンラベル */
  conversionLabel: string;
  /** Google AdsアカウントID */
  adsId: string;
  /** プロダクト名 */
  productName: string;
  /** 設定ファイルのパス */
  envConfigPath: string;
}

/**
 * 設定検証結果
 * 
 * LPEnvironmentConfiguratorのvalidateメソッドで返される個別検証結果
 */
export interface ValidationResult {
  /** 検証が成功したかどうか */
  isValid: boolean;
  /** 検証対象フィールド名 */
  field: string;
  /** 検証結果メッセージ */
  message: string;
  /** 問題の重要度レベル */
  severity: 'error' | 'warning' | 'info';
}

/**
 * 自動設定実行結果
 * 
 * LP生成時の自動コンバージョン設定処理の結果を表現
 */
export interface AutoSetupResult {
  /** 自動設定が成功したかどうか */
  success: boolean;
  /** 適用されたコンバージョンラベル */
  conversionLabel: string;
  /** 生成された.env.localファイルのパス */
  envConfigPath: string;
  /** 設定検証の詳細結果 */
  validationResults: ValidationResult[];
  /** 発生したエラーメッセージ配列 */
  errors: string[];
}

/**
 * プロダクト基本情報
 * 
 * LP生成時に使用するプロダクト情報
 */
export interface ProductInfo {
  /** プロダクト内部名 */
  name: string;
  /** プロダクトディレクトリパス */
  path: string;
  /** サービス表示名 */
  serviceName: string;
  /** ターゲットオーディエンス */
  targetAudience: string;
}

/**
 * セットアップ実行結果
 * 
 * @deprecated AutoSetupResultを使用してください
 */
export interface SetupResult {
  /** セットアップが成功したかどうか */
  success: boolean;
  /** 適用されたコンバージョンラベル */
  conversionLabel: string;
  /** 設定ファイルパス */
  configPath: string;
  /** 検証結果詳細 */
  validationResults: ValidationResult[];
}

/**
 * Google Ads 環境変数設定
 * 
 * .env.localファイルに設定される全ての環境変数を定義
 * UnsonOSの標準設定に基づく
 */
export interface GoogleAdsEnvConfig {
  // === 必須設定 ===
  
  /** Google AdsアカウントID（UnsonOS共通: AW-17431174236） */
  NEXT_PUBLIC_GOOGLE_ADS_ID: string;
  
  /** Google Adsコンバージョンラベル（UnsonOS共通: zINmCPbAtIMbENy46vdA） */
  NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL: string;
  
  // === オプション設定 ===
  
  /** Google Analytics 4 測定ID（プロダクト別） */
  NEXT_PUBLIC_GA4_MEASUREMENT_ID?: string;
  
  /** Google Analytics プロパティID（MCP API用） */
  GOOGLE_ANALYTICS_PROPERTY_ID?: string;
  
  /** Google サービスアカウントキーファイルパス */
  GOOGLE_SERVICE_ACCOUNT_KEY_PATH?: string;
  
  /** PostHog分析用公開キー */
  NEXT_PUBLIC_POSTHOG_KEY?: string;
  
  /** PostHogホストURL */
  NEXT_PUBLIC_POSTHOG_HOST?: string;
  
  /** UnsonOS API URL */
  NEXT_PUBLIC_API_URL?: string;
  
  /** デフォルトワークスペースID */
  NEXT_PUBLIC_DEFAULT_WORKSPACE_ID?: string;
}

// === ユーティリティ型 ===

/**
 * 環境変数設定の必須フィールド
 */
export type RequiredGoogleAdsFields = 'NEXT_PUBLIC_GOOGLE_ADS_ID' | 'NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL';

/**
 * 環境変数設定のオプションフィールド
 */
export type OptionalGoogleAdsFields = Exclude<keyof GoogleAdsEnvConfig, RequiredGoogleAdsFields>;

/**
 * 検証結果のエラーレベルフィルタリング用
 */
export type ValidationSeverity = ValidationResult['severity'];

// === 定数 ===

/**
 * UnsonOS標準設定値
 */
export const UNSON_OS_CONSTANTS = {
  /** UnsonOS共通Google AdsアカウントID */
  GOOGLE_ADS_ACCOUNT_ID: 'AW-17431174236',
  
  /** UnsonOS共通コンバージョンラベル（ベータテスター登録完了） */
  SHARED_CONVERSION_LABEL: 'zINmCPbAtIMbENy46vdA',
  
  /** UnsonOS API URL */
  API_URL: 'https://unsonos-api.vercel.app',
  
  /** デフォルトワークスペース */
  DEFAULT_WORKSPACE: 'unson_main'
} as const;