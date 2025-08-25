#!/usr/bin/env tsx

import dotenv from 'dotenv';
import path from 'path';
import { VercelManager } from './lib/vercel-client';

// 環境変数を読み込み
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const DOMAINS_TO_CHECK = [
  'mywa.unson.jp',
  'ai-bridge.unson.jp',
  'ai-coach.unson.jp',
  'ai-legacy.unson.jp',
  'ai-stylist.unson.jp'
];

async function verifyDomains() {
  console.log('🔍 ドメインの検証状況を確認します\n');
  
  const vercel = new VercelManager();
  
  for (const domain of DOMAINS_TO_CHECK) {
    console.log(`\n📌 ${domain}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      const status = await vercel.verifyDomain(domain);
      
      console.log(`設定済み: ${status.configured ? '✅' : '❌'}`);
      console.log(`検証済み: ${status.verified ? '✅' : '❌'}`);
      
      if (!status.configured) {
        console.log('⚠️  DNS設定が正しくありません');
        console.log('💡 DNSレコードの伝播を待つか、設定を確認してください');
      }
      
      if (!status.verified) {
        console.log('⚠️  ドメインの検証が完了していません');
        console.log('💡 Vercelダッシュボードで確認してください');
      }
      
      if (status.configured && status.verified) {
        console.log('🎉 ドメインは正常に動作しています！');
        console.log(`🌐 URL: https://${domain}`);
      }
      
    } catch (error: any) {
      console.error(`❌ エラー: ${error.message}`);
    }
  }
  
  console.log('\n\n📝 トラブルシューティング:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('1. DNS伝播を待つ（通常5-30分）');
  console.log('2. Vercelダッシュボードでドメイン設定を確認');
  console.log('   https://vercel.com/unson/domains');
  console.log('3. 各プロジェクトの最新デプロイメントを確認');
  console.log('4. 必要に応じて再デプロイを実行');
}

verifyDomains().catch(console.error);