#!/usr/bin/env tsx

import dotenv from 'dotenv';
import path from 'path';
import { Route53Manager } from './lib/route53-client';

// 環境変数を読み込み
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function testDeleteDomain() {
  const subdomain = process.argv[2];
  
  if (!subdomain) {
    console.error('❌ サブドメインを指定してください');
    console.log('使用方法: npm run test:delete-domain -- <subdomain>');
    process.exit(1);
  }
  
  console.log(`🗑️ ドメインを削除します: ${subdomain}.${process.env.ROOT_DOMAIN}\n`);
  
  try {
    const route53 = new Route53Manager();
    
    // DNSレコードを削除
    await route53.deleteDnsRecord({
      subdomain: subdomain,
      type: 'A'
    });
    
    console.log('✅ DNSレコードを削除しました');
    
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

testDeleteDomain().catch(console.error);