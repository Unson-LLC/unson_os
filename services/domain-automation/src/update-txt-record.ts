#!/usr/bin/env tsx

import dotenv from 'dotenv';
import path from 'path';
import { Route53Manager } from './lib/route53-client';

// 環境変数を読み込み
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function updateTxtRecord() {
  console.log('🔧 TXTレコードを正しい値に更新します\n');
  
  const route53 = new Route53Manager();
  
  // Vercelコンソールから取得した正しいTXT値
  const correctTxtValue = 'vc-domain-verify=ai-coach.unson.jp,cdf2990335cdaa8ccabd';
  
  try {
    // 1. 既存のTXTレコードを削除
    console.log('1️⃣ 既存のTXTレコードを削除...');
    try {
      await route53.deleteDnsRecord({
        subdomain: '_vercel.ai-coach',
        type: 'TXT'
      });
      console.log('✅ 既存TXTレコード削除完了');
    } catch (error: any) {
      console.log('⚠️  既存TXTレコードが見つかりません');
    }
    
    // 2. 正しいTXTレコードを作成
    console.log('2️⃣ 正しいTXTレコードを作成...');
    console.log(`値: ${correctTxtValue}`);
    
    await route53.createDnsRecord({
      subdomain: '_vercel.ai-coach',
      type: 'TXT',
      value: `"${correctTxtValue}"`,
      ttl: 300
    });
    console.log('✅ TXTレコード作成完了');
    
    console.log('\n✅ TXTレコードの更新が完了しました！');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📊 現在のDNS設定:');
    console.log('• ai-coach.unson.jp → A: 76.76.21.21');
    console.log(`• _vercel.ai-coach.unson.jp → TXT: "${correctTxtValue}"`);
    
    console.log('\n💡 次のステップ:');
    console.log('1. DNS伝播を待つ（1-2分）');
    console.log('2. Vercelダッシュボードで「Refresh」ボタンをクリック');
    console.log('3. 検証が完了したら自動的にSSL証明書が発行されます');
    
  } catch (error: any) {
    console.error(`❌ エラー: ${error.message}`);
  }
}

updateTxtRecord().catch(console.error);