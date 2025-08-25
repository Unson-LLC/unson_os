#!/usr/bin/env tsx

import dotenv from 'dotenv';
import path from 'path';
import { Route53Manager } from './lib/route53-client';

// 環境変数を読み込み
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// 各ドメインの設定
const DOMAIN_CONFIGS = [
  {
    subdomain: 'ai-coach',
    records: [
      {
        type: 'CNAME',
        value: 'cname.vercel-dns.com'
      },
      {
        type: 'TXT',
        name: '_vercel',
        value: 'vc-domain-verify=ai-coach.unson.jp,cdf2990338cdaa5ee9e67a60e7aa16c4'
      }
    ]
  },
  {
    subdomain: 'ai-bridge',
    records: [
      {
        type: 'CNAME',
        value: 'cname.vercel-dns.com'
      }
    ]
  },
  {
    subdomain: 'ai-legacy',
    records: [
      {
        type: 'CNAME',
        value: 'cname.vercel-dns.com'
      }
    ]
  },
  {
    subdomain: 'ai-stylist',
    records: [
      {
        type: 'CNAME',
        value: 'cname.vercel-dns.com'
      }
    ]
  }
];

async function fixDnsRecords() {
  console.log('🔧 DNS設定を修正します\n');
  
  const route53 = new Route53Manager();
  
  for (const config of DOMAIN_CONFIGS) {
    console.log(`\n📌 ${config.subdomain}.unson.jp の設定を更新`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      // 1. 既存のAレコードを削除
      console.log('1️⃣ 既存のAレコードを削除...');
      try {
        await route53.deleteDnsRecord({
          subdomain: config.subdomain,
          type: 'A'
        });
        console.log('✅ Aレコード削除完了');
      } catch (error: any) {
        if (error.message.includes('not found')) {
          console.log('⚠️ Aレコードは既に削除されています');
        } else {
          throw error;
        }
      }
      
      // 2. CNAMEレコードを作成
      console.log('2️⃣ CNAMEレコードを作成...');
      await route53.createDnsRecord({
        subdomain: config.subdomain,
        type: 'CNAME',
        value: 'cname.vercel-dns.com',
        ttl: 300
      });
      console.log('✅ CNAMEレコード作成完了');
      
      // 3. TXTレコードがある場合は作成
      for (const record of config.records) {
        if (record.type === 'TXT' && record.name && record.value) {
          console.log(`3️⃣ TXTレコード（検証用）を作成...`);
          const txtSubdomain = record.name === '_vercel' 
            ? `_vercel.${config.subdomain}` 
            : `${record.name}.${config.subdomain}`;
          
          await route53.createDnsRecord({
            subdomain: txtSubdomain,
            type: 'TXT',
            value: `"${record.value}"`,
            ttl: 300
          });
          console.log('✅ TXTレコード作成完了');
        }
      }
      
      console.log(`✅ ${config.subdomain}.unson.jp の設定完了`);
      
    } catch (error: any) {
      console.error(`❌ エラー: ${error.message}`);
      
      // CNAMEが既に存在する場合はスキップ
      if (error.message.includes('already exists')) {
        console.log('⚠️ CNAMEレコードは既に存在します');
      }
    }
    
    // レート制限対策
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n\n✅ DNS設定の修正が完了しました');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n💡 次のステップ:');
  console.log('1. DNS伝播を待つ（5-10分）');
  console.log('2. Vercelダッシュボードで検証状態を確認');
  console.log('3. 各ドメインにアクセスして動作確認');
  console.log('\n📝 確認URL:');
  DOMAIN_CONFIGS.forEach(config => {
    console.log(`• https://${config.subdomain}.unson.jp`);
  });
}

fixDnsRecords().catch(console.error);