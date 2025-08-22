import { GoogleAuth } from 'google-auth-library';
import { GoogleAdsApi } from 'google-ads-api';

export interface GoogleAdsConfig {
  client_id: string;
  client_secret: string;
  developer_token: string;
  refresh_token?: string;
  customer_id?: string;
}

export class GoogleAdsAuthManager {
  private config: GoogleAdsConfig;
  private client: GoogleAdsApi | null = null;

  constructor(config: GoogleAdsConfig) {
    this.config = config;
  }

  // OAuth2認証URL生成
  generateAuthUrl(redirectUri: string): string {
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    
    authUrl.searchParams.append('client_id', this.config.client_id);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('scope', 'https://www.googleapis.com/auth/adwords');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('access_type', 'offline');
    authUrl.searchParams.append('prompt', 'consent');
    
    return authUrl.toString();
  }

  // 認証コードからリフレッシュトークン取得
  async exchangeCodeForToken(code: string, redirectUri: string): Promise<string> {
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/adwords'],
    });

    const oauth2Client = new auth.OAuth2(
      this.config.client_id,
      this.config.client_secret,
      redirectUri
    );

    try {
      const { tokens } = await oauth2Client.getToken(code);
      
      if (!tokens.refresh_token) {
        throw new Error('リフレッシュトークンが取得できませんでした');
      }

      this.config.refresh_token = tokens.refresh_token;
      return tokens.refresh_token;
      
    } catch (error) {
      console.error('トークン交換エラー:', error);
      throw new Error(`認証に失敗しました: ${error}`);
    }
  }

  // Google Ads APIクライアント初期化
  async initializeClient(customerId?: string): Promise<GoogleAdsApi> {
    if (!this.config.refresh_token) {
      throw new Error('リフレッシュトークンが設定されていません');
    }

    try {
      this.client = new GoogleAdsApi({
        client_id: this.config.client_id,
        client_secret: this.config.client_secret,
        developer_token: this.config.developer_token,
        refresh_token: this.config.refresh_token,
      });

      if (customerId) {
        this.config.customer_id = customerId;
      }

      return this.client;
      
    } catch (error) {
      console.error('Google Ads API初期化エラー:', error);
      throw new Error(`API初期化に失敗しました: ${error}`);
    }
  }

  // アクセス可能なアカウント一覧取得
  async getAccessibleCustomers(): Promise<Array<{
    customer_id: string;
    descriptive_name: string;
    currency_code: string;
    time_zone: string;
  }>> {
    if (!this.client) {
      throw new Error('Google Ads APIクライアントが初期化されていません');
    }

    try {
      // Customer Service経由でアクセス可能な顧客を取得
      const customerService = this.client.services.CustomerService;
      const accessibleCustomers = await customerService.listAccessibleCustomers();
      
      const customers = [];
      
      for (const customerId of accessibleCustomers.resource_names) {
        const customer = this.client.Customer({ customer_id: customerId });
        
        const query = `
          SELECT
            customer.id,
            customer.descriptive_name,
            customer.currency_code,
            customer.time_zone
          FROM customer
          LIMIT 1
        `;
        
        const result = await customer.query(query);
        if (result.length > 0) {
          customers.push({
            customer_id: result[0].customer.id.toString(),
            descriptive_name: result[0].customer.descriptive_name,
            currency_code: result[0].customer.currency_code,
            time_zone: result[0].customer.time_zone,
          });
        }
      }
      
      return customers;
      
    } catch (error) {
      console.error('アカウント一覧取得エラー:', error);
      throw new Error(`アカウント取得に失敗しました: ${error}`);
    }
  }

  // 接続テスト
  async testConnection(customerId: string): Promise<{
    success: boolean;
    customer_info?: any;
    error?: string;
  }> {
    try {
      if (!this.client) {
        await this.initializeClient(customerId);
      }

      const customer = this.client!.Customer({ customer_id: customerId });
      
      const query = `
        SELECT
          customer.id,
          customer.descriptive_name,
          customer.currency_code,
          customer.time_zone,
          customer.status
        FROM customer
        LIMIT 1
      `;
      
      const result = await customer.query(query);
      
      if (result.length === 0) {
        return {
          success: false,
          error: 'カスタマー情報を取得できませんでした',
        };
      }
      
      return {
        success: true,
        customer_info: result[0].customer,
      };
      
    } catch (error) {
      console.error('接続テストエラー:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '不明なエラー',
      };
    }
  }

  // キャンペーン一覧取得（接続確認用）
  async getCampaigns(customerId: string, limit: number = 10): Promise<Array<{
    id: string;
    name: string;
    status: string;
    budget_amount: number;
    currency: string;
  }>> {
    if (!this.client) {
      await this.initializeClient(customerId);
    }

    try {
      const customer = this.client!.Customer({ customer_id: customerId });
      
      const query = `
        SELECT
          campaign.id,
          campaign.name,
          campaign.status,
          campaign_budget.amount_micros,
          customer.currency_code
        FROM campaign
        WHERE campaign.status != 'REMOVED'
        LIMIT ${limit}
      `;
      
      const result = await customer.query(query);
      
      return result.map((row: any) => ({
        id: row.campaign.id.toString(),
        name: row.campaign.name,
        status: row.campaign.status,
        budget_amount: row.campaign_budget.amount_micros / 1000000, // マイクロ単位から通常単位に変換
        currency: row.customer.currency_code,
      }));
      
    } catch (error) {
      console.error('キャンペーン取得エラー:', error);
      throw new Error(`キャンペーン取得に失敗しました: ${error}`);
    }
  }

  // 設定取得
  getConfig(): GoogleAdsConfig {
    return { ...this.config };
  }

  // リフレッシュトークン更新
  updateRefreshToken(refreshToken: string): void {
    this.config.refresh_token = refreshToken;
  }

  // 認証状態確認
  isAuthenticated(): boolean {
    return !!(this.config.refresh_token && this.config.customer_id);
  }
}