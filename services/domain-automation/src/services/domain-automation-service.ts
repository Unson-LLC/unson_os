import { Route53Manager } from '../lib/route53-client';
import { VercelManager } from '../lib/vercel-client';
import { ConvexClient } from 'convex/browser';
// import { api } from '../../../convex/_generated/api';

export interface DomainConfig {
  productId: string;
  subdomain: string;
  projectName?: string;
  environmentVariables?: Array<{
    key: string;
    value: string;
  }>;
}

export interface DomainSetupResult {
  productId: string;
  subdomain: string;
  fqdn: string;
  vercelProjectId?: string;
  vercelUrl?: string;
  status: 'success' | 'partial' | 'failed';
  errors?: string[];
}

export class DomainAutomationService {
  private route53: Route53Manager;
  private vercel: VercelManager;
  private convex: ConvexClient;

  constructor() {
    this.route53 = new Route53Manager();
    this.vercel = new VercelManager();
    this.convex = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  }

  /**
   * 新規プロダクトのドメインをセットアップ
   */
  async setupProductDomain(config: DomainConfig): Promise<DomainSetupResult> {
    const { productId, subdomain, projectName, environmentVariables } = config;
    const fqdn = `${subdomain}.unson.jp`;
    const errors: string[] = [];
    let vercelProjectId: string | undefined;
    let vercelUrl: string | undefined;

    console.log(`🚀 Setting up domain for product: ${productId}`);

    try {
      // 1. サブドメインの利用可能性チェック
      const isAvailable = await this.route53.isSubdomainAvailable(subdomain);
      if (!isAvailable) {
        throw new Error(`Subdomain ${subdomain} is already in use`);
      }

      // 2. Vercelプロジェクトをセットアップ
      try {
        const vercelResult = await this.vercel.setupProjectWithDomain(
          projectName || subdomain,
          fqdn,
          environmentVariables
        );
        vercelProjectId = vercelResult.projectId;
        vercelUrl = vercelResult.deploymentUrl;
        console.log(`✅ Vercel project created: ${vercelProjectId}`);
      } catch (error) {
        errors.push(`Vercel setup failed: ${error}`);
        console.error(error);
      }

      // 3. Route53にDNSレコードを作成
      if (vercelUrl) {
        try {
          // Vercel用のCNAMEレコード
          await this.route53.createVercelDnsRecord(subdomain, `cname.vercel-dns.com`);
          
          // WWWサブドメインも追加
          await this.route53.createVercelDnsRecord(`www.${subdomain}`, `cname.vercel-dns.com`);
          
          console.log(`✅ DNS records created for ${fqdn}`);
        } catch (error) {
          errors.push(`DNS setup failed: ${error}`);
          console.error(error);
        }
      }

      // 4. Convexデータベースに記録
      try {
        await this.saveDomainToDatabase({
          productId,
          subdomain,
          fqdn,
          vercelProjectId,
          vercelUrl,
          status: errors.length === 0 ? 'active' : 'partial',
        });
        console.log(`✅ Domain saved to database`);
      } catch (error) {
        errors.push(`Database save failed: ${error}`);
        console.error(error);
      }

      // 5. 結果を返す
      const status = errors.length === 0 ? 'success' : 
                     errors.length < 3 ? 'partial' : 'failed';

      return {
        productId,
        subdomain,
        fqdn,
        vercelProjectId,
        vercelUrl,
        status,
        errors: errors.length > 0 ? errors : undefined,
      };

    } catch (error) {
      console.error(`❌ Domain setup failed: ${error}`);
      return {
        productId,
        subdomain,
        fqdn,
        status: 'failed',
        errors: [`Critical error: ${error}`],
      };
    }
  }

  /**
   * 複数プロダクトのドメインを一括セットアップ
   */
  async setupMultipleProductDomains(
    configs: DomainConfig[]
  ): Promise<DomainSetupResult[]> {
    console.log(`🚀 Setting up ${configs.length} domains...`);
    
    const results: DomainSetupResult[] = [];
    
    // 並列処理（最大5個同時）
    const batchSize = 5;
    for (let i = 0; i < configs.length; i += batchSize) {
      const batch = configs.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(config => this.setupProductDomain(config))
      );
      results.push(...batchResults);
      
      // レート制限対策
      if (i + batchSize < configs.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // サマリー出力
    const successful = results.filter(r => r.status === 'success').length;
    const partial = results.filter(r => r.status === 'partial').length;
    const failed = results.filter(r => r.status === 'failed').length;

    console.log(`
✅ Domain Setup Summary:
- Successful: ${successful}
- Partial: ${partial}
- Failed: ${failed}
- Total: ${results.length}
    `);

    return results;
  }

  /**
   * ドメインを削除
   */
  async removeProductDomain(productId: string): Promise<void> {
    console.log(`🗑️ Removing domain for product: ${productId}`);

    try {
      // 1. データベースから情報取得
      const domainInfo = await this.getDomainFromDatabase(productId);
      if (!domainInfo) {
        throw new Error(`Domain info not found for product: ${productId}`);
      }

      // 2. Vercelプロジェクトを削除
      if (domainInfo.vercelProjectId) {
        try {
          await this.vercel.deleteProject(domainInfo.vercelProjectId);
          console.log(`✅ Vercel project deleted`);
        } catch (error) {
          console.error(`Failed to delete Vercel project: ${error}`);
        }
      }

      // 3. DNSレコードを削除
      try {
        await this.route53.deleteDnsRecord({
          subdomain: domainInfo.subdomain,
          type: 'CNAME',
        });
        await this.route53.deleteDnsRecord({
          subdomain: `www.${domainInfo.subdomain}`,
          type: 'CNAME',
        });
        console.log(`✅ DNS records deleted`);
      } catch (error) {
        console.error(`Failed to delete DNS records: ${error}`);
      }

      // 4. データベースから削除
      await this.deleteDomainFromDatabase(productId);
      console.log(`✅ Domain removed from database`);

    } catch (error) {
      console.error(`❌ Failed to remove domain: ${error}`);
      throw error;
    }
  }

  /**
   * ドメインのヘルスチェック
   */
  async checkDomainHealth(productId: string): Promise<{
    healthy: boolean;
    issues: string[];
  }> {
    const issues: string[] = [];

    try {
      // 1. データベースから情報取得
      const domainInfo = await this.getDomainFromDatabase(productId);
      if (!domainInfo) {
        return { healthy: false, issues: ['Domain not found in database'] };
      }

      // 2. DNS解決チェック
      const dnsRecord = await this.route53.getDnsRecord(domainInfo.subdomain, 'CNAME');
      if (!dnsRecord) {
        issues.push('DNS record not found');
      }

      // 3. Vercelドメイン検証
      if (domainInfo.vercelProjectId) {
        const verification = await this.vercel.verifyDomain(domainInfo.fqdn);
        if (!verification.configured) {
          issues.push('Vercel domain not configured');
        }
        if (!verification.verified) {
          issues.push('Vercel domain not verified');
        }
      }

      // 4. HTTP/HTTPSアクセスチェック
      try {
        const response = await fetch(`https://${domainInfo.fqdn}`, {
          method: 'HEAD',
          signal: AbortSignal.timeout(5000),
        });
        if (!response.ok) {
          issues.push(`HTTP check failed: ${response.status}`);
        }
      } catch (error) {
        issues.push('Site not accessible via HTTPS');
      }

      return {
        healthy: issues.length === 0,
        issues,
      };

    } catch (error) {
      return {
        healthy: false,
        issues: [`Health check error: ${error}`],
      };
    }
  }

  /**
   * 全ドメインのヘルスチェック
   */
  async checkAllDomainsHealth(): Promise<Map<string, { healthy: boolean; issues: string[] }>> {
    const domains = await this.getAllDomainsFromDatabase();
    const results = new Map<string, { healthy: boolean; issues: string[] }>();

    for (const domain of domains) {
      const health = await this.checkDomainHealth(domain.productId);
      results.set(domain.productId, health);
      
      // レート制限対策
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return results;
  }

  // データベース操作（Convex）
  private async saveDomainToDatabase(data: any): Promise<void> {
    // Convex mutation実装
    // await this.convex.mutation(api.domains.create, data);
  }

  private async getDomainFromDatabase(productId: string): Promise<any> {
    // Convex query実装
    // return await this.convex.query(api.domains.getByProductId, { productId });
    return null; // 仮実装
  }

  private async deleteDomainFromDatabase(productId: string): Promise<void> {
    // Convex mutation実装
    // await this.convex.mutation(api.domains.delete, { productId });
  }

  private async getAllDomainsFromDatabase(): Promise<any[]> {
    // Convex query実装
    // return await this.convex.query(api.domains.list);
    return []; // 仮実装
  }
}