// PostHog API統合ライブラリ
// Feature Flagsの自動管理とA/Bテスト連携

interface PostHogFeatureFlag {
  key: string;
  name?: string;
  active: boolean;
  filters: {
    groups: Array<{
      properties: any[];
      rollout_percentage: number;
    }>;
    multivariate?: {
      variants: Array<{
        key: string;
        name?: string;
        rollout_percentage: number;
      }>;
    };
  };
  deleted?: boolean;
  created_at?: string;
  created_by?: any;
  is_simple_flag?: boolean;
  rollout_percentage?: number;
}

interface PostHogExperiment {
  id: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  feature_flag_key: string;
  parameters?: any;
  secondary_metrics?: any[];
  filters?: any;
  archived?: boolean;
  created_at: string;
  updated_at: string;
}

class PostHogClient {
  private apiKey: string;
  private projectId: string;
  private baseUrl: string;

  constructor(apiKey: string, projectId: string, baseUrl = 'https://us.i.posthog.com') {
    this.apiKey = apiKey;
    this.projectId = projectId;
    this.baseUrl = baseUrl;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}/api/projects/${this.projectId}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`PostHog API error: ${response.status} ${error}`);
    }

    return response.json();
  }

  // Feature Flag作成
  async createFeatureFlag(flagData: Partial<PostHogFeatureFlag>): Promise<PostHogFeatureFlag> {
    return this.request('/feature_flags/', {
      method: 'POST',
      body: JSON.stringify(flagData),
    });
  }

  // Feature Flag取得
  async getFeatureFlag(key: string): Promise<PostHogFeatureFlag | null> {
    try {
      return await this.request(`/feature_flags/${key}/`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  // Feature Flag更新
  async updateFeatureFlag(key: string, updates: Partial<PostHogFeatureFlag>): Promise<PostHogFeatureFlag> {
    return this.request(`/feature_flags/${key}/`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Feature Flag削除
  async deleteFeatureFlag(key: string): Promise<void> {
    await this.request(`/feature_flags/${key}/`, {
      method: 'DELETE',
    });
  }

  // A/Bテスト用Feature Flag作成
  async createAbTestFlag(testConfig: {
    key: string;
    name: string;
    controlPercentage: number;
    variants: Array<{
      key: string;
      name: string;
      percentage: number;
    }>;
  }): Promise<PostHogFeatureFlag> {
    const flagData: Partial<PostHogFeatureFlag> = {
      key: testConfig.key,
      name: testConfig.name,
      active: true,
      filters: {
        groups: [{
          properties: [],
          rollout_percentage: 100,
        }],
        multivariate: {
          variants: [
            {
              key: 'control',
              name: 'Control',
              rollout_percentage: testConfig.controlPercentage,
            },
            ...testConfig.variants.map(v => ({
              key: v.key,
              name: v.name,
              rollout_percentage: v.percentage,
            })),
          ],
        },
      },
    };

    return this.createFeatureFlag(flagData);
  }

  // トラフィック配分更新
  async updateTrafficAllocation(key: string, allocation: Record<string, number>): Promise<PostHogFeatureFlag> {
    const flag = await this.getFeatureFlag(key);
    if (!flag || !flag.filters.multivariate) {
      throw new Error(`Multivariate flag not found: ${key}`);
    }

    const updatedVariants = flag.filters.multivariate.variants.map(variant => ({
      ...variant,
      rollout_percentage: allocation[variant.key] || variant.rollout_percentage,
    }));

    return this.updateFeatureFlag(key, {
      filters: {
        ...flag.filters,
        multivariate: {
          ...flag.filters.multivariate,
          variants: updatedVariants,
        },
      },
    });
  }

  // Experiment作成
  async createExperiment(experimentData: {
    name: string;
    description?: string;
    feature_flag_key: string;
    parameters?: any;
    secondary_metrics?: string[];
  }): Promise<PostHogExperiment> {
    return this.request('/experiments/', {
      method: 'POST',
      body: JSON.stringify(experimentData),
    });
  }

  // Experiment結果取得
  async getExperimentResults(experimentId: number): Promise<any> {
    return this.request(`/experiments/${experimentId}/results/`);
  }

  // イベントデータ取得（CVR計算用）
  async getEvents(params: {
    event?: string;
    properties?: any;
    date_from?: string;
    date_to?: string;
    breakdown?: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, typeof value === 'string' ? value : JSON.stringify(value));
      }
    });

    return this.request(`/events/?${queryParams.toString()}`);
  }

  // インサイト取得（統計分析用）
  async getInsight(params: {
    events?: any[];
    breakdown?: string;
    date_from?: string;
    date_to?: string;
    properties?: any;
  }): Promise<any> {
    return this.request('/insights/', {
      method: 'POST',
      body: JSON.stringify({
        insight: 'TRENDS',
        ...params,
      }),
    });
  }
}

// PostHogクライアントのシングルトン
let posthogClient: PostHogClient | null = null;

export function getPostHogClient(): PostHogClient {
  if (!posthogClient) {
    const apiKey = process.env.POSTHOG_PERSONAL_API_KEY;
    const projectId = process.env.POSTHOG_PROJECT_ID;
    
    if (!apiKey || !projectId) {
      throw new Error('PostHog credentials not configured. Set POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID');
    }
    
    posthogClient = new PostHogClient(apiKey, projectId);
  }
  
  return posthogClient;
}

// A/Bテスト作成のヘルパー関数
export async function createAbTestFeatureFlag(testConfig: {
  testId: string;
  productId: string;
  controlPercentage: number;
  variants: Array<{
    label: string;
    percentage: number;
  }>;
}): Promise<{ flagKey: string; success: boolean; error?: string }> {
  try {
    const client = getPostHogClient();
    const flagKey = `lp_test_${testConfig.productId}_${testConfig.testId}`;
    
    await client.createAbTestFlag({
      key: flagKey,
      name: `LP A/B Test - ${testConfig.productId}`,
      controlPercentage: testConfig.controlPercentage,
      variants: testConfig.variants.map(v => ({
        key: v.label.toLowerCase().replace(/\s+/g, '_'),
        name: v.label,
        percentage: v.percentage,
      })),
    });
    
    return { flagKey, success: true };
  } catch (error) {
    console.error('Failed to create PostHog feature flag:', error);
    return { 
      flagKey: `lp_test_${testConfig.productId}_${testConfig.testId}`,
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// A/Bテスト結果取得のヘルパー関数
export async function getAbTestResults(flagKey: string, dateFrom?: string, dateTo?: string): Promise<{
  success: boolean;
  results?: {
    control: {
      sessions: number;
      conversions: number;
      conversionRate: number;
    };
    variants: Array<{
      label: string;
      sessions: number;
      conversions: number;
      conversionRate: number;
    }>;
  };
  error?: string;
}> {
  try {
    const client = getPostHogClient();
    
    // ページビューデータ取得
    const pageviewData = await client.getInsight({
      events: [{
        id: '$pageview',
        properties: [{
          key: `$feature/${flagKey}`,
          operator: 'is_set',
          value: ['is_set'],
        }],
      }],
      breakdown: `$feature/${flagKey}`,
      date_from: dateFrom || '-30d',
      date_to: dateTo,
    });
    
    // コンバージョンデータ取得
    const conversionData = await client.getInsight({
      events: [{
        id: 'form_submission', // LP Generatorのコンバージョンイベント
        properties: [{
          key: `$feature/${flagKey}`,
          operator: 'is_set',
          value: ['is_set'],
        }],
      }],
      breakdown: `$feature/${flagKey}`,
      date_from: dateFrom || '-30d',
      date_to: dateTo,
    });
    
    // データを集計して返す
    const results = processAbTestResults(pageviewData, conversionData);
    
    return { success: true, results };
  } catch (error) {
    console.error('Failed to get A/B test results:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// データ処理用のヘルパー関数
function processAbTestResults(pageviewData: any, conversionData: any) {
  // PostHogのInsight結果を処理してA/Bテスト結果形式に変換
  const variants: any[] = [];
  let control: any = { sessions: 0, conversions: 0, conversionRate: 0 };
  
  // 実際のPostHogレスポンス構造に合わせて実装
  // これは簡略化された例
  if (pageviewData?.result) {
    pageviewData.result.forEach((item: any, index: number) => {
      const variantKey = item.breakdown_value;
      const sessions = item.count || 0;
      const conversions = conversionData?.result?.[index]?.count || 0;
      const conversionRate = sessions > 0 ? (conversions / sessions) * 100 : 0;
      
      if (variantKey === 'control') {
        control = { sessions, conversions, conversionRate };
      } else {
        variants.push({
          label: variantKey,
          sessions,
          conversions,
          conversionRate,
        });
      }
    });
  }
  
  return { control, variants };
}

// Feature Flag停止
export async function stopFeatureFlag(flagKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    const client = getPostHogClient();
    await client.updateFeatureFlag(flagKey, { active: false });
    return { success: true };
  } catch (error) {
    console.error('Failed to stop feature flag:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export { PostHogClient };