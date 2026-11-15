/**
 * LP Environment Configurator
 * 
 * UnsonOSマイクロSaaS向けの.env.localファイル自動生成・更新システム
 * Google Ads、Google Analytics設定を統一的に管理
 * 
 * @author UnsonOS Team
 * @version 1.0.0
 */
import * as fs from 'fs';
import * as path from 'path';
import { GoogleAdsEnvConfig, ValidationResult } from '../types/conversion-settings';

/**
 * LP環境設定自動化クラス
 * 
 * 主な機能:
 * - .env.localファイルの自動生成・更新
 * - Google Ads設定の統一的な管理
 * - Google Analytics設定の自動適用
 * - 設定内容の検証
 */
export class LPEnvironmentConfigurator {
  /** UnsonOS統一設定 */
  private static readonly DEFAULT_CONFIG: Partial<GoogleAdsEnvConfig> = {
    NEXT_PUBLIC_GOOGLE_ADS_ID: 'AW-17431174236',
    NEXT_PUBLIC_API_URL: 'https://unsonos-api.vercel.app',
    NEXT_PUBLIC_DEFAULT_WORKSPACE_ID: 'unson_main',
    GOOGLE_SERVICE_ACCOUNT_KEY_PATH: './google-service-account.json'
  };

  /**
   * コンバージョン設定の自動更新
   * 
   * 既存の.env.localを読み込み、Google Ads設定を更新または新規作成
   * 
   * @param productPath プロダクトのルートディレクトリパス
   * @param conversionLabel 設定するコンバージョンラベル
   */
  async updateConversionSettings(productPath: string, conversionLabel: string): Promise<void> {
    const envPath = path.join(productPath, '.env.local');
    
    let existingConfig: Record<string, string> = {};
    if (fs.existsSync(envPath)) {
      existingConfig = this.parseEnvFile(envPath);
    }

    const updatedConfig: GoogleAdsEnvConfig = {
      ...existingConfig,
      ...LPEnvironmentConfigurator.DEFAULT_CONFIG,
      NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL: conversionLabel
    } as GoogleAdsEnvConfig;

    await this.writeEnvFile(envPath, updatedConfig as unknown as Record<string, string>);
    console.log(`✅ Updated conversion settings: ${envPath}`);
  }

  /**
   * Google Analytics設定の自動適用
   * 
   * @param productPath プロダクトディレクトリパス
   * @param gaPropertyId Google AnalyticsプロパティID
   */
  async configureAnalytics(productPath: string, gaPropertyId: string): Promise<void> {
    const envPath = path.join(productPath, '.env.local');
    
    if (!fs.existsSync(envPath)) {
      throw new Error(`Environment file not found: ${envPath}`);
    }

    const existingConfig = this.parseEnvFile(envPath);
    
    existingConfig.GOOGLE_ANALYTICS_PROPERTY_ID = gaPropertyId;
    
    if (!existingConfig.NEXT_PUBLIC_GA4_MEASUREMENT_ID) {
      existingConfig.NEXT_PUBLIC_GA4_MEASUREMENT_ID = this.generateGA4MeasurementId(productPath);
    }

    await this.writeEnvFile(envPath, existingConfig);
    console.log(`✅ Updated analytics settings: ${envPath}`);
  }

  /**
   * LP設定の包括的検証
   * 
   * 必須フィールドの存在確認、形式検証、推奨設定のチェック
   * 
   * @param productPath 検証するプロダクトディレクトリ
   * @returns Promise<ValidationResult[]> 検証結果配列
   */
  async validateLPConfiguration(productPath: string): Promise<ValidationResult[]> {
    const envPath = path.join(productPath, '.env.local');
    const results: ValidationResult[] = [];

    if (!fs.existsSync(envPath)) {
      results.push({
        isValid: false,
        field: '.env.local',
        message: 'Environment configuration file is missing',
        severity: 'error'
      });
      return results;
    }

    const config = this.parseEnvFile(envPath);

    // 必須フィールドの検証
    const requiredFields: Array<keyof GoogleAdsEnvConfig> = [
      'NEXT_PUBLIC_GOOGLE_ADS_ID',
      'NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL'
    ];

    for (const field of requiredFields) {
      if (!config[field]) {
        results.push({
          isValid: false,
          field,
          message: `Required field ${field} is missing`,
          severity: 'error'
        });
      } else if (field === 'NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL') {
        const isValidLabel = this.validateConversionLabelFormat(config[field]);
        results.push({
          isValid: isValidLabel,
          field,
          message: isValidLabel 
            ? 'Valid conversion label format' 
            : 'Invalid conversion label format (should not be placeholder)',
          severity: isValidLabel ? 'info' : 'error'
        });
      }
    }

    // 推奨フィールドの警告
    if (!config.NEXT_PUBLIC_GA4_MEASUREMENT_ID) {
      results.push({
        isValid: true,
        field: 'NEXT_PUBLIC_GA4_MEASUREMENT_ID',
        message: 'Google Analytics measurement ID is not configured',
        severity: 'warning'
      });
    }

    return results;
  }

  /**
   * .env.localファイルの解析
   * 
   * @private
   * @param envPath 環境ファイルパス
   * @returns Record<string, string> 設定オブジェクト
   */
  private parseEnvFile(envPath: string): Record<string, string> {
    const content = fs.readFileSync(envPath, 'utf-8');
    const config: Record<string, string> = {};

    content.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          config[key.trim()] = valueParts.join('=').trim();
        }
      }
    });

    return config;
  }

  /**
   * 環境設定ファイルの書き込み
   * 
   * @private
   * @param envPath 出力ファイルパス
   * @param config 設定オブジェクト
   */
  private async writeEnvFile(envPath: string, config: Record<string, string>): Promise<void> {
    const lines: string[] = [
      '# Google Analytics 4 - フロントエンド用',
      `NEXT_PUBLIC_GA4_MEASUREMENT_ID=${config.NEXT_PUBLIC_GA4_MEASUREMENT_ID || 'G-XXXXXXXXXX'}`,
      '',
      '# Google Ads コンバージョントラッキング',
      `NEXT_PUBLIC_GOOGLE_ADS_ID=${config.NEXT_PUBLIC_GOOGLE_ADS_ID}`,
      `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=${config.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL}`,
      ''
    ];

    const optionalFields = [
      'GOOGLE_ANALYTICS_PROPERTY_ID',
      'GOOGLE_SERVICE_ACCOUNT_KEY_PATH',
      'NEXT_PUBLIC_POSTHOG_KEY',
      'NEXT_PUBLIC_POSTHOG_HOST',
      'NEXT_PUBLIC_API_URL',
      'NEXT_PUBLIC_DEFAULT_WORKSPACE_ID'
    ];

    let hasOptionalFields = false;
    for (const field of optionalFields) {
      if (config[field]) {
        if (!hasOptionalFields) {
          lines.push('# Additional Configuration');
          hasOptionalFields = true;
        }
        lines.push(`${field}=${config[field]}`);
      }
    }

    const dir = path.dirname(envPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(envPath, lines.join('\n') + '\n');
  }

  /**
   * コンバージョンラベル形式の検証
   * 
   * @private
   * @param label 検証するラベル
   * @returns boolean 有効な場合true
   */
  private validateConversionLabelFormat(label: string): boolean {
    const placeholderPatterns = [
      '_form_submission',
      'mywa_form',
      'stylist_form',
      'compass_form',
      'coach_form',
      'bridge_form',
      'legacy_form'
    ];

    return !placeholderPatterns.some(pattern => label.includes(pattern));
  }

  /**
   * プロダクト別GA4 Measurement ID生成
   * 
   * @private
   * @param productPath プロダクトパス
   * @returns string GA4 Measurement ID
   */
  private generateGA4MeasurementId(productPath: string): string {
    const knownIds: Record<string, string> = {
      'mywa': 'G-9R4YRBEQSG',
      'ai-stylist': 'G-GVRHCRS21F',
      'ai-coach': 'G-EDTJ98X5XV',
      'ai-bridge': 'G-HLS0TCPMYP',
      'ai-legacy-creator': 'G-49GSFLVEK3'
    };

    for (const [key, id] of Object.entries(knownIds)) {
      if (productPath.includes(key)) {
        return id;
      }
    }

    return 'G-XXXXXXXXXX';
  }
}
