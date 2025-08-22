import {
  Route53Client,
  CreateHostedZoneCommand,
  DeleteHostedZoneCommand,
  ChangeResourceRecordSetsCommand,
  ListResourceRecordSetsCommand,
  GetHostedZoneCommand,
  ListHostedZonesCommand,
  ResourceRecordSet,
  Change,
} from '@aws-sdk/client-route-53';
import { z } from 'zod';

// 環境変数スキーマ
const envSchema = z.object({
  AWS_REGION: z.string().default('ap-northeast-1'),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  ROOT_DOMAIN: z.string().default('unson.jp'),
  HOSTED_ZONE_ID: z.string(), // unson.jpのホストゾーンID
});

// DNS レコードタイプ
export type DnsRecordType = 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT' | 'NS' | 'SOA';

// DNS レコード作成パラメータ
export interface CreateDnsRecordParams {
  subdomain: string;
  type: DnsRecordType;
  value: string | string[];
  ttl?: number;
}

// DNS レコード削除パラメータ
export interface DeleteDnsRecordParams {
  subdomain: string;
  type: DnsRecordType;
}

export class Route53Manager {
  private client: Route53Client;
  private hostedZoneId: string;
  private rootDomain: string;

  constructor() {
    const env = envSchema.parse(process.env);
    
    this.client = new Route53Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
    
    this.hostedZoneId = env.HOSTED_ZONE_ID;
    this.rootDomain = env.ROOT_DOMAIN;
  }

  /**
   * サブドメインのDNSレコードを作成
   */
  async createDnsRecord(params: CreateDnsRecordParams): Promise<void> {
    const { subdomain, type, value, ttl = 300 } = params;
    const fqdn = `${subdomain}.${this.rootDomain}`;
    
    const values = Array.isArray(value) ? value : [value];
    const resourceValues = values.map(v => ({ Value: v }));

    const command = new ChangeResourceRecordSetsCommand({
      HostedZoneId: this.hostedZoneId,
      ChangeBatch: {
        Changes: [
          {
            Action: 'CREATE',
            ResourceRecordSet: {
              Name: fqdn,
              Type: type,
              TTL: ttl,
              ResourceRecords: resourceValues,
            },
          },
        ],
      },
    });

    try {
      await this.client.send(command);
      console.log(`✅ DNS record created: ${fqdn} (${type})`);
    } catch (error) {
      console.error(`❌ Failed to create DNS record: ${error}`);
      throw error;
    }
  }

  /**
   * サブドメインのDNSレコードを更新
   */
  async updateDnsRecord(params: CreateDnsRecordParams): Promise<void> {
    const { subdomain, type, value, ttl = 300 } = params;
    const fqdn = `${subdomain}.${this.rootDomain}`;
    
    const values = Array.isArray(value) ? value : [value];
    const resourceValues = values.map(v => ({ Value: v }));

    const command = new ChangeResourceRecordSetsCommand({
      HostedZoneId: this.hostedZoneId,
      ChangeBatch: {
        Changes: [
          {
            Action: 'UPSERT', // CREATE or UPDATE
            ResourceRecordSet: {
              Name: fqdn,
              Type: type,
              TTL: ttl,
              ResourceRecords: resourceValues,
            },
          },
        ],
      },
    });

    try {
      await this.client.send(command);
      console.log(`✅ DNS record updated: ${fqdn} (${type})`);
    } catch (error) {
      console.error(`❌ Failed to update DNS record: ${error}`);
      throw error;
    }
  }

  /**
   * サブドメインのDNSレコードを削除
   */
  async deleteDnsRecord(params: DeleteDnsRecordParams): Promise<void> {
    const { subdomain, type } = params;
    const fqdn = `${subdomain}.${this.rootDomain}`;

    // 既存レコードを取得
    const existingRecord = await this.getDnsRecord(subdomain, type);
    if (!existingRecord) {
      console.log(`⚠️ DNS record not found: ${fqdn} (${type})`);
      return;
    }

    const command = new ChangeResourceRecordSetsCommand({
      HostedZoneId: this.hostedZoneId,
      ChangeBatch: {
        Changes: [
          {
            Action: 'DELETE',
            ResourceRecordSet: existingRecord,
          },
        ],
      },
    });

    try {
      await this.client.send(command);
      console.log(`✅ DNS record deleted: ${fqdn} (${type})`);
    } catch (error) {
      console.error(`❌ Failed to delete DNS record: ${error}`);
      throw error;
    }
  }

  /**
   * サブドメインのDNSレコードを取得
   */
  async getDnsRecord(subdomain: string, type: DnsRecordType): Promise<ResourceRecordSet | null> {
    const fqdn = `${subdomain}.${this.rootDomain}`;
    
    const command = new ListResourceRecordSetsCommand({
      HostedZoneId: this.hostedZoneId,
      StartRecordName: fqdn,
      StartRecordType: type,
      MaxItems: 1,
    });

    try {
      const response = await this.client.send(command);
      const record = response.ResourceRecordSets?.find(
        r => r.Name === `${fqdn}.` && r.Type === type
      );
      return record || null;
    } catch (error) {
      console.error(`❌ Failed to get DNS record: ${error}`);
      throw error;
    }
  }

  /**
   * ホストゾーン内の全レコードを取得
   */
  async listAllDnsRecords(): Promise<ResourceRecordSet[]> {
    const command = new ListResourceRecordSetsCommand({
      HostedZoneId: this.hostedZoneId,
    });

    try {
      const response = await this.client.send(command);
      return response.ResourceRecordSets || [];
    } catch (error) {
      console.error(`❌ Failed to list DNS records: ${error}`);
      throw error;
    }
  }

  /**
   * Vercel用のCNAMEレコードを作成
   */
  async createVercelDnsRecord(subdomain: string, vercelUrl: string): Promise<void> {
    await this.updateDnsRecord({
      subdomain,
      type: 'CNAME',
      value: vercelUrl,
      ttl: 300,
    });
  }

  /**
   * 複数のDNSレコードを一括作成
   */
  async createMultipleDnsRecords(records: CreateDnsRecordParams[]): Promise<void> {
    const changes: Change[] = records.map(record => {
      const fqdn = `${record.subdomain}.${this.rootDomain}`;
      const values = Array.isArray(record.value) ? record.value : [record.value];
      const resourceValues = values.map(v => ({ Value: v }));

      return {
        Action: 'UPSERT',
        ResourceRecordSet: {
          Name: fqdn,
          Type: record.type,
          TTL: record.ttl || 300,
          ResourceRecords: resourceValues,
        },
      };
    });

    const command = new ChangeResourceRecordSetsCommand({
      HostedZoneId: this.hostedZoneId,
      ChangeBatch: { Changes: changes },
    });

    try {
      await this.client.send(command);
      console.log(`✅ ${records.length} DNS records created`);
    } catch (error) {
      console.error(`❌ Failed to create multiple DNS records: ${error}`);
      throw error;
    }
  }

  /**
   * サブドメインが利用可能かチェック
   */
  async isSubdomainAvailable(subdomain: string): Promise<boolean> {
    const records = ['A', 'AAAA', 'CNAME'] as DnsRecordType[];
    
    for (const type of records) {
      const record = await this.getDnsRecord(subdomain, type);
      if (record) {
        return false;
      }
    }
    
    return true;
  }
}