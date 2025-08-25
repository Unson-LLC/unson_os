import { z } from 'zod';

// 環境変数スキーマ
const envSchema = z.object({
  VERCEL_TOKEN: z.string(),
  VERCEL_TEAM_ID: z.string().optional(),
});

// Vercelプロジェクト作成パラメータ
export interface CreateProjectParams {
  name: string;
  framework?: 'nextjs' | 'vite' | 'remix' | 'gatsby' | 'nuxtjs';
  publicSource?: boolean;
  gitRepository?: {
    repo: string;
    type: 'github' | 'gitlab' | 'bitbucket';
  };
  environmentVariables?: Array<{
    key: string;
    value: string;
    target?: ('production' | 'preview' | 'development')[];
  }>;
}

// ドメイン追加パラメータ
export interface AddDomainParams {
  projectId: string;
  domain: string;
}

// デプロイメント情報
export interface Deployment {
  id: string;
  url: string;
  state: 'READY' | 'BUILDING' | 'ERROR' | 'CANCELED';
  createdAt: number;
  readyAt?: number;
}

export class VercelManager {
  private token: string;
  private teamId?: string;
  private baseUrl = 'https://api.vercel.com';

  constructor() {
    const env = envSchema.parse(process.env);
    this.token = env.VERCEL_TOKEN;
    this.teamId = env.VERCEL_TEAM_ID;
  }

  /**
   * APIリクエストヘルパー
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = new URL(endpoint, this.baseUrl);
    if (this.teamId) {
      url.searchParams.append('teamId', this.teamId);
    }

    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Vercel API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * プロジェクトを作成
   */
  async createProject(params: CreateProjectParams): Promise<{ id: string; name: string }> {
    const body: any = {
      name: params.name,
      framework: params.framework || 'nextjs',
      publicSource: params.publicSource ?? false,
    };

    if (params.gitRepository) {
      body.gitRepository = params.gitRepository;
    }

    if (params.environmentVariables) {
      body.environmentVariables = params.environmentVariables;
    }

    try {
      const response = await this.request<any>('/v10/projects', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      console.log(`✅ Vercel project created: ${params.name}`);
      return {
        id: response.id,
        name: response.name,
      };
    } catch (error) {
      console.error(`❌ Failed to create Vercel project: ${error}`);
      throw error;
    }
  }

  /**
   * プロジェクトにカスタムドメインを追加
   */
  async addDomain(params: AddDomainParams): Promise<void> {
    const { projectId, domain } = params;

    try {
      await this.request(`/v10/projects/${projectId}/domains`, {
        method: 'POST',
        body: JSON.stringify({ name: domain }),
      });

      console.log(`✅ Domain added to project: ${domain}`);
    } catch (error) {
      console.error(`❌ Failed to add domain: ${error}`);
      throw error;
    }
  }

  /**
   * プロジェクトからドメインを削除
   */
  async removeDomain(projectId: string, domain: string): Promise<void> {
    try {
      await this.request(`/v9/projects/${projectId}/domains/${domain}`, {
        method: 'DELETE',
      });

      console.log(`✅ Domain removed from project: ${domain}`);
    } catch (error) {
      console.error(`❌ Failed to remove domain: ${error}`);
      throw error;
    }
  }

  /**
   * プロジェクトの環境変数を設定
   */
  async setEnvironmentVariable(
    projectId: string,
    key: string,
    value: string,
    target: ('production' | 'preview' | 'development')[] = ['production']
  ): Promise<void> {
    try {
      await this.request(`/v10/projects/${projectId}/env`, {
        method: 'POST',
        body: JSON.stringify({
          key,
          value,
          target,
          type: 'encrypted',
        }),
      });

      console.log(`✅ Environment variable set: ${key}`);
    } catch (error) {
      console.error(`❌ Failed to set environment variable: ${error}`);
      throw error;
    }
  }

  /**
   * プロジェクトの最新デプロイメントを取得
   */
  async getLatestDeployment(projectId: string): Promise<Deployment | null> {
    try {
      const response = await this.request<{ deployments: any[] }>(
        `/v6/deployments?projectId=${projectId}&limit=1`
      );

      if (response.deployments.length === 0) {
        return null;
      }

      const deployment = response.deployments[0];
      return {
        id: deployment.uid,
        url: deployment.url,
        state: deployment.state,
        createdAt: deployment.createdAt,
        readyAt: deployment.readyAt,
      };
    } catch (error) {
      console.error(`❌ Failed to get deployment: ${error}`);
      throw error;
    }
  }

  /**
   * プロジェクトを削除
   */
  async deleteProject(projectId: string): Promise<void> {
    try {
      await this.request(`/v9/projects/${projectId}`, {
        method: 'DELETE',
      });

      console.log(`✅ Project deleted: ${projectId}`);
    } catch (error) {
      console.error(`❌ Failed to delete project: ${error}`);
      throw error;
    }
  }

  /**
   * プロジェクト一覧を取得
   */
  async listProjects(): Promise<Array<{ id: string; name: string }>> {
    try {
      const response = await this.request<{ projects: any[] }>('/v9/projects');
      
      return response.projects.map(p => ({
        id: p.id,
        name: p.name,
      }));
    } catch (error) {
      console.error(`❌ Failed to list projects: ${error}`);
      throw error;
    }
  }

  /**
   * ドメインの設定を確認
   */
  async verifyDomain(domain: string): Promise<{
    configured: boolean;
    verified: boolean;
  }> {
    try {
      const response = await this.request<any>(`/v6/domains/${domain}/config`);
      
      return {
        configured: response.misconfigured === false,
        verified: response.verified === true,
      };
    } catch (error) {
      console.error(`❌ Failed to verify domain: ${error}`);
      throw error;
    }
  }

  /**
   * プロジェクトとドメインを一括セットアップ
   */
  async setupProjectWithDomain(
    projectName: string,
    domain: string,
    environmentVariables?: Array<{
      key: string;
      value: string;
    }>
  ): Promise<{
    projectId: string;
    deploymentUrl?: string;
  }> {
    // 1. プロジェクト作成
    const project = await this.createProject({
      name: projectName,
      framework: 'nextjs',
      environmentVariables: environmentVariables?.map(env => ({
        ...env,
        target: ['production', 'preview', 'development'],
      })),
    });

    // 2. カスタムドメイン追加
    await this.addDomain({
      projectId: project.id,
      domain,
    });

    // 3. 最新デプロイメント取得
    const deployment = await this.getLatestDeployment(project.id);

    console.log(`✅ Project setup complete: ${projectName} -> ${domain}`);
    
    return {
      projectId: project.id,
      deploymentUrl: deployment?.url,
    };
  }
}