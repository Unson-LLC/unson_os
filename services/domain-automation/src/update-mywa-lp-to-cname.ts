#!/usr/bin/env tsx

import dotenv from 'dotenv';
import path from 'path';
import { Route53Manager } from './lib/route53-client';

// 環境変数を読み込み
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function updateMywaLpToCname() {
  console.log('🔧 lp-mywa.unson.jp をCNAMEレコードに更新します\n');
  
  const route53 = new Route53Manager();
  const cnameValue = 'df6cf6e227f9ad3e.vercel-dns-016.com'; // スクリーンショットから
  
  try {
    // 1. 既存のAレコードを削除
    console.log('1️⃣ 既存のAレコードを削除...');
    try {
      await route53.deleteDnsRecord({
        subdomain: 'lp-mywa',
        type: 'A'
      });
      console.log('✅ Aレコード削除完了');
    } catch (error: any) {
      console.log('⚠️  Aレコードなし');
    }
    
    // 2. CNAMEレコードを作成
    console.log(`2️⃣ CNAMEレコードを作成: ${cnameValue}`);
    await route53.createDnsRecord({
      subdomain: 'lp-mywa',
      type: 'CNAME',
      value: cnameValue,
      ttl: 300
    });
    console.log('✅ CNAMEレコード作成完了');
    
    console.log('\n✅ lp-mywa.unson.jp のDNS設定更新完了！');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n📊 設定内容:');
    console.log(`CNAME: lp-mywa.unson.jp → ${cnameValue}`);
    console.log('TXT: _vercel.unson.jp に既に設定済み');
    
    console.log('\n💡 次のステップ:');
    console.log('1. DNS伝播を待つ（1-2分）');
    console.log('2. Vercelダッシュボードで「Refresh」ボタンをクリック');
    console.log('3. 「Valid Configuration」に変わるまで待つ');
    console.log('4. SSL証明書が自動発行されます');
    console.log('5. https://lp-mywa.unson.jp でアクセス可能になります');
    
  } catch (error: any) {
    console.error(`❌ エラー: ${error.message}`);
  }
}

updateMywaLpToCname().catch(console.error);