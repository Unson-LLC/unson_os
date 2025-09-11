/**
 * Google Ads コンバージョン管理システム
 * 
 * UnsonOSの100-200マイクロSaaS向けに統一されたコンバージョンラベル管理を提供
 * Google Ads MCP経由でAPIアクセスし、フォールバック機能で安定性を確保
 * 
 * @author UnsonOS Team
 * @version 1.0.0
 */
import { ConversionLabel } from '../../apps/lp-suite/src/types/conversion-settings';

export { ConversionLabel };

/**
 * Google Ads MCP APIレスポンス形式
 */
interface GoogleAdsMcpResponse {
  result?: {
    data?: Array<Array<string | number>>;
    columns?: string[];
  };
  isSuccessful: boolean;
  notification: {
    errors: string[];
    warnings: string[];
  };
}

/**
 * Google Ads コンバージョン管理クラス
 * 
 * 主な機能:
 * - Google Ads APIからコンバージョンラベルを取得
 * - コンバージョンラベルの検証
 * - UnsonOS共通のベータテスター登録ラベルの提供
 * - エラー時のフォールバック機能
 */
export class GoogleAdsConversionManager {
  private mcpClient: any;
  private readonly customerId: number;
  private readonly loginCustomerId: number;
  
  /** UnsonOS共通のGoogle Adsアカウント設定 */
  private static readonly DEFAULT_CUSTOMER_ID = 4600539562;
  private static readonly SHARED_CONVERSION_LABEL = 'zINmCPbAtIMbENy46vdA';

  constructor(
    mcpClient?: any, 
    customerId: number = GoogleAdsConversionManager.DEFAULT_CUSTOMER_ID,
    loginCustomerId: number = GoogleAdsConversionManager.DEFAULT_CUSTOMER_ID
  ) {
    this.mcpClient = mcpClient;
    this.customerId = customerId;
    this.loginCustomerId = loginCustomerId;
  }

  /**
   * 有効なコンバージョンラベル一覧を取得
   * 
   * Google Ads MCP経由でAPIコールを実行し、エラー時はフォールバックデータを返す
   * 
   * @returns Promise<ConversionLabel[]> コンバージョンラベル配列
   * @throws Error MCPクライアントがnullの場合
   */
  async getActiveConversionLabels(): Promise<ConversionLabel[]> {
    if (this.mcpClient === null) {
      throw new Error('Google Ads MCP client is not configured');
    }

    if (!this.mcpClient) {
      return this.getFallbackConversionLabels();
    }

    try {
      const query = 'SELECT conversion_action.id, conversion_action.name, conversion_action.resource_name FROM conversion_action WHERE conversion_action.status = "ENABLED"';
      
      const response: GoogleAdsMcpResponse = await this.mcpClient.execute('mcp__googleads__execute-gaql-query', {
        query,
        customerId: this.customerId,
        loginCustomerId: this.loginCustomerId,
        reportAggregation: 'NONE'
      });

      if (!response.isSuccessful || response.notification.errors.length > 0) {
        console.warn('Google Ads MCP query failed, using fallback data:', response.notification.errors);
        return this.getFallbackConversionLabels();
      }

      return this.transformMcpResponse(response);
    } catch (error) {
      console.warn('Google Ads MCP error, using fallback data:', error);
      return this.getFallbackConversionLabels();
    }
  }

  /**
   * コンバージョンラベルの有効性を検証
   * 
   * APIからの最新データと照合し、エラー時は静的バリデーションにフォールバック
   * 
   * @param label 検証するラベル
   * @returns Promise<boolean> 有効な場合true
   */
  async validateConversionLabel(label: string | null | undefined): Promise<boolean> {
    if (!label || typeof label !== 'string') {
      return false;
    }

    try {
      const activeLabels = await this.getActiveConversionLabels();
      const isValidActive = activeLabels.some(activeLabel => activeLabel.label === label);
      
      if (isValidActive) {
        return true;
      }
    } catch (error) {
      console.warn('API validation failed, using static validation:', error);
    }

    return this.validateConversionLabelStatic(label);
  }

  /**
   * UnsonOS共通のコンバージョンラベルを取得
   * 
   * 全マイクロSaaSで使用するベータテスター登録完了ラベル
   * 
   * @returns Promise<string> 共通コンバージョンラベル
   */
  async getSharedConversionLabel(): Promise<string> {
    try {
      const activeLabels = await this.getActiveConversionLabels();
      
      const betaTesterLabel = activeLabels.find(label => 
        label.name === 'ベータテスター登録完了' || 
        label.label === GoogleAdsConversionManager.SHARED_CONVERSION_LABEL
      );
      
      if (betaTesterLabel) {
        return betaTesterLabel.label;
      }
    } catch (error) {
      console.warn('Failed to get shared label from API, using fallback:', error);
    }

    return GoogleAdsConversionManager.SHARED_CONVERSION_LABEL;
  }

  /**
   * MCP APIレスポンスをConversionLabel形式に変換
   * 
   * @private
   * @param response Google Ads MCPレスポンス
   * @returns ConversionLabel[] 変換されたラベル配列
   */
  private transformMcpResponse(response: GoogleAdsMcpResponse): ConversionLabel[] {
    if (!response.result?.data) {
      return this.getFallbackConversionLabels();
    }

    return response.result.data.map((row) => ({
      id: String(row[0]),
      name: String(row[1]),
      label: this.extractLabelFromResourceName(String(row[2]))
    }));
  }

  /**
   * Google Ads リソース名からコンバージョンラベルを抽出
   * 
   * @private
   * @param resourceName customers/{customerId}/conversionActions/{conversionActionId} 形式
   * @returns string コンバージョンラベル
   */
  private extractLabelFromResourceName(resourceName: string): string {
    const match = resourceName.match(/conversionActions\/(\d+)$/);
    if (match) {
      const conversionActionId = match[1];
      
      const knownMappings: Record<string, string> = {
        '7254909046': GoogleAdsConversionManager.SHARED_CONVERSION_LABEL,
        '7248195500': 'pageview_conversion'
      };

      return knownMappings[conversionActionId] || `conversion_${conversionActionId}`;
    }

    return 'unknown_conversion';
  }

  /**
   * フォールバック用の既知コンバージョンラベル
   * 
   * @private
   * @returns ConversionLabel[] 既知のラベル配列
   */
  private getFallbackConversionLabels(): ConversionLabel[] {
    return [
      {
        id: '7248195500',
        name: 'ページビュー',
        label: 'pageview_conversion'
      },
      {
        id: '7254909046', 
        name: 'ベータテスター登録完了',
        label: GoogleAdsConversionManager.SHARED_CONVERSION_LABEL
      }
    ];
  }

  /**
   * 静的コンバージョンラベル検証
   * 
   * API呼び出し不要の高速検証。プレースホルダーを明示的に拒否
   * 
   * @private
   * @param label 検証するラベル
   * @returns boolean 有効な場合true
   */
  private validateConversionLabelStatic(label: string): boolean {
    const validLabels = [
      GoogleAdsConversionManager.SHARED_CONVERSION_LABEL,
      'pageview_conversion'
    ];

    const invalidLabels = [
      'mywa_form_submission',
      'stylist_form_submission', 
      'compass_form_submission',
      'coach_form_submission',
      'bridge_form_submission',
      'legacy_form_submission',
      'invalid_label',
      'nonExistentLabel123'
    ];

    if (invalidLabels.includes(label)) {
      return false;
    }

    return validLabels.includes(label);
  }
}