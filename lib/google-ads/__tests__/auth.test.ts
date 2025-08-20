import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { GoogleAdsAuthManager, GoogleAdsConfig } from '../auth';

// t_wada式TDD: REDフェーズ - Google Ads認証のテスト
describe('GoogleAdsAuthManager', () => {
  let authManager: GoogleAdsAuthManager;
  let mockConfig: GoogleAdsConfig;

  beforeEach(() => {
    mockConfig = {
      client_id: 'test-client-id',
      client_secret: 'test-client-secret',
      developer_token: 'test-developer-token',
    };

    authManager = new GoogleAdsAuthManager(mockConfig);

    // Google Auth libraryのモック
    vi.mock('google-auth-library', () => ({
      GoogleAuth: vi.fn(() => ({
        OAuth2: vi.fn(() => ({
          getToken: vi.fn(),
        })),
      })),
    }));

    // Google Ads APIのモック
    vi.mock('google-ads-api', () => ({
      GoogleAdsApi: vi.fn(() => ({
        services: {
          CustomerService: {
            listAccessibleCustomers: vi.fn(),
          },
        },
        Customer: vi.fn(() => ({
          query: vi.fn(),
        })),
      })),
    }));
  });

  describe('OAuth2認証フロー', () => {
    it('認証URLを生成できる', () => {
      // Arrange
      const redirectUri = 'http://localhost:3000/auth/callback';

      // Act
      const authUrl = authManager.generateAuthUrl(redirectUri);

      // Assert
      expect(authUrl).toContain('accounts.google.com/o/oauth2/v2/auth');
      expect(authUrl).toContain(`client_id=${mockConfig.client_id}`);
      expect(authUrl).toContain(`redirect_uri=${encodeURIComponent(redirectUri)}`);
      expect(authUrl).toContain('scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fadwords');
      expect(authUrl).toContain('response_type=code');
      expect(authUrl).toContain('access_type=offline');
    });

    it('認証コードからリフレッシュトークンを取得できる', async () => {
      // Arrange
      const authCode = 'test-auth-code';
      const redirectUri = 'http://localhost:3000/auth/callback';
      const mockRefreshToken = 'test-refresh-token';

      // OAuth2Clientのモック
      const mockGetToken = vi.fn().mockResolvedValue({
        tokens: { refresh_token: mockRefreshToken },
      });

      // Google AuthのモックをSpyで設定
      const { GoogleAuth } = await import('google-auth-library');
      const mockOAuth2 = vi.fn().mockImplementation(() => ({
        getToken: mockGetToken,
      }));
      vi.mocked(GoogleAuth).mockImplementation(() => ({
        OAuth2: mockOAuth2,
      }) as any);

      // Act
      const refreshToken = await authManager.exchangeCodeForToken(authCode, redirectUri);

      // Assert
      expect(refreshToken).toBe(mockRefreshToken);
      expect(mockGetToken).toHaveBeenCalledWith(authCode);
    });

    it('リフレッシュトークンが取得できない場合はエラーをthrowする', async () => {
      // Arrange
      const authCode = 'test-auth-code';
      const redirectUri = 'http://localhost:3000/auth/callback';

      const mockGetToken = vi.fn().mockResolvedValue({
        tokens: { access_token: 'test-access-token' }, // refresh_tokenなし
      });

      const { GoogleAuth } = await import('google-auth-library');
      const mockOAuth2 = vi.fn().mockImplementation(() => ({
        getToken: mockGetToken,
      }));
      vi.mocked(GoogleAuth).mockImplementation(() => ({
        OAuth2: mockOAuth2,
      }) as any);

      // Act & Assert
      await expect(
        authManager.exchangeCodeForToken(authCode, redirectUri)
      ).rejects.toThrow('リフレッシュトークンが取得できませんでした');
    });
  });

  describe('Google Ads APIクライアント初期化', () => {
    it('リフレッシュトークンありでクライアントを初期化できる', async () => {
      // Arrange
      mockConfig.refresh_token = 'test-refresh-token';
      authManager = new GoogleAdsAuthManager(mockConfig);

      const { GoogleAdsApi } = await import('google-ads-api');
      const mockClient = { test: 'client' };
      vi.mocked(GoogleAdsApi).mockImplementation(() => mockClient as any);

      // Act
      const client = await authManager.initializeClient('test-customer-id');

      // Assert
      expect(client).toBe(mockClient);
      expect(GoogleAdsApi).toHaveBeenCalledWith({
        client_id: mockConfig.client_id,
        client_secret: mockConfig.client_secret,
        developer_token: mockConfig.developer_token,
        refresh_token: mockConfig.refresh_token,
      });
    });

    it('リフレッシュトークンなしでは初期化エラーをthrowする', async () => {
      // Arrange - refresh_tokenなし

      // Act & Assert
      await expect(
        authManager.initializeClient('test-customer-id')
      ).rejects.toThrow('リフレッシュトークンが設定されていません');
    });
  });

  describe('接続テスト', () => {
    it('有効なカスタマーIDで接続テストが成功する', async () => {
      // Arrange
      mockConfig.refresh_token = 'test-refresh-token';
      authManager = new GoogleAdsAuthManager(mockConfig);

      const mockCustomerData = {
        id: '123456789',
        descriptive_name: 'Test Account',
        currency_code: 'JPY',
        time_zone: 'Asia/Tokyo',
        status: 'ENABLED',
      };

      const mockQuery = vi.fn().mockResolvedValue([{ customer: mockCustomerData }]);
      const mockCustomer = vi.fn().mockReturnValue({ query: mockQuery });

      const { GoogleAdsApi } = await import('google-ads-api');
      vi.mocked(GoogleAdsApi).mockImplementation(() => ({
        Customer: mockCustomer,
      }) as any);

      // Act
      const result = await authManager.testConnection('123456789');

      // Assert
      expect(result.success).toBe(true);
      expect(result.customer_info).toEqual(mockCustomerData);
      expect(result.error).toBeUndefined();
    });

    it('無効なカスタマーIDで接続テストが失敗する', async () => {
      // Arrange
      mockConfig.refresh_token = 'test-refresh-token';
      authManager = new GoogleAdsAuthManager(mockConfig);

      const mockQuery = vi.fn().mockResolvedValue([]); // 空の結果
      const mockCustomer = vi.fn().mockReturnValue({ query: mockQuery });

      const { GoogleAdsApi } = await import('google-ads-api');
      vi.mocked(GoogleAdsApi).mockImplementation(() => ({
        Customer: mockCustomer,
      }) as any);

      // Act
      const result = await authManager.testConnection('invalid-id');

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('カスタマー情報を取得できませんでした');
    });

    it('API呼び出しエラーで接続テストが失敗する', async () => {
      // Arrange
      mockConfig.refresh_token = 'test-refresh-token';
      authManager = new GoogleAdsAuthManager(mockConfig);

      const mockQuery = vi.fn().mockRejectedValue(new Error('API Error'));
      const mockCustomer = vi.fn().mockReturnValue({ query: mockQuery });

      const { GoogleAdsApi } = await import('google-ads-api');
      vi.mocked(GoogleAdsApi).mockImplementation(() => ({
        Customer: mockCustomer,
      }) as any);

      // Act
      const result = await authManager.testConnection('123456789');

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('キャンペーン取得', () => {
    it('キャンペーン一覧を取得できる', async () => {
      // Arrange
      mockConfig.refresh_token = 'test-refresh-token';
      authManager = new GoogleAdsAuthManager(mockConfig);

      const mockCampaigns = [
        {
          campaign: { id: '111', name: 'Campaign 1', status: 'ENABLED' },
          campaign_budget: { amount_micros: 10000000 }, // 10円（マイクロ単位）
          customer: { currency_code: 'JPY' },
        },
        {
          campaign: { id: '222', name: 'Campaign 2', status: 'PAUSED' },
          campaign_budget: { amount_micros: 20000000 }, // 20円
          customer: { currency_code: 'JPY' },
        },
      ];

      const mockQuery = vi.fn().mockResolvedValue(mockCampaigns);
      const mockCustomer = vi.fn().mockReturnValue({ query: mockQuery });

      const { GoogleAdsApi } = await import('google-ads-api');
      vi.mocked(GoogleAdsApi).mockImplementation(() => ({
        Customer: mockCustomer,
      }) as any);

      // Act
      const campaigns = await authManager.getCampaigns('123456789', 5);

      // Assert
      expect(campaigns).toHaveLength(2);
      expect(campaigns[0]).toMatchObject({
        id: '111',
        name: 'Campaign 1',
        status: 'ENABLED',
        budget_amount: 10, // マイクロ単位から変換された値
        currency: 'JPY',
      });
      expect(campaigns[1]).toMatchObject({
        id: '222',
        name: 'Campaign 2', 
        status: 'PAUSED',
        budget_amount: 20,
        currency: 'JPY',
      });
    });
  });

  describe('認証状態管理', () => {
    it('リフレッシュトークンとカスタマーIDがある場合は認証済み', () => {
      // Arrange
      authManager.updateRefreshToken('test-refresh-token');
      mockConfig.customer_id = 'test-customer-id';
      authManager = new GoogleAdsAuthManager(mockConfig);

      // Act & Assert
      expect(authManager.isAuthenticated()).toBe(true);
    });

    it('リフレッシュトークンがない場合は未認証', () => {
      // Arrange - refresh_tokenなし

      // Act & Assert
      expect(authManager.isAuthenticated()).toBe(false);
    });

    it('カスタマーIDがない場合は未認証', () => {
      // Arrange
      authManager.updateRefreshToken('test-refresh-token');
      // customer_idなし

      // Act & Assert
      expect(authManager.isAuthenticated()).toBe(false);
    });

    it('リフレッシュトークンを更新できる', () => {
      // Arrange
      const newRefreshToken = 'new-refresh-token';

      // Act
      authManager.updateRefreshToken(newRefreshToken);

      // Assert
      const config = authManager.getConfig();
      expect(config.refresh_token).toBe(newRefreshToken);
    });
  });
});