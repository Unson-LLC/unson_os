#!/usr/bin/env tsx

import dotenv from 'dotenv';
import path from 'path';
import { Route53Manager } from './lib/route53-client';

// 環境変数を読み込み
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function addMywaLpTxt() {
  console.log('🔧 lp-mywa.unson.jp のTXT検証レコードを追加します\n');
  
  const route53 = new Route53Manager();
  const txtValue = 'vc-domain-verify=lp-mywa.unson.jp,88c8a5c7c0ce7c3c53ac';
  
  try {
    // 1. 現在のTXTレコードを取得
    console.log('1️⃣ 既存のTXTレコードを確認...');
    const existingRecords = [
      'vc-domain-verify=mywa.unson.jp,0f14fdaf0c717e1eaa43',
      'vc-domain-verify=os.unson.jp,4a0da986272868d726fe',
      'vc-domain-verify=ai-coach.unson.jp,cdf2990335cdaa8ccabd',
      'vc-domain-verify=ai-bridge.unson.jp,7d2d3b8d374a66d4c83e',
      'vc-domain-verify=ai-legacy.unson.jp,589c27279397eec6e061',
      'vc-domain-verify=ai-stylist.unson.jp,453bdbffd0a9fc8d2312'
    ];
    
    // lp-mywaのTXTレコードを追加
    const allTxtValues = [...existingRecords, txtValue];
    
    console.log('2️⃣ TXTレコードを更新...');
    console.log(`合計 ${allTxtValues.length} 個のTXTレコードを設定`);
    
    // 既存のTXTレコードを削除
    try {
      await route53.deleteDnsRecord({
        subdomain: '_vercel',
        type: 'TXT'
      });
      console.log('✅ 既存TXTレコード削除');
    } catch (error: any) {
      console.log('⚠️  既存TXTレコードなし');
    }
    
    // 新しいTXTレコードを作成（複数値）
    const combinedTxtValue = allTxtValues.map(v => `"${v}"`).join(' ');
    
    await route53.createDnsRecord({
      subdomain: '_vercel',
      type: 'TXT',
      value: combinedTxtValue,
      ttl: 300
    });
    
    console.log('✅ TXTレコード作成完了');
    
    console.log('\n📊 設定されたTXT値:');
    console.log(`新規追加: ${txtValue}`);
    
    console.log('\n✅ lp-mywa.unson.jp のTXT検証レコード追加完了！');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n💡 次のステップ:');
    console.log('1. DNS伝播を待つ（1-2分）');
    console.log('2. Vercelダッシュボードで「Refresh」ボタンをクリック');
    console.log('   https://vercel.com/unson/unson-lp-mywa/settings/domains');
    console.log('3. 検証が完了したらSSL証明書が自動発行されます');
    console.log('4. https://lp-mywa.unson.jp でアクセス可能になります');
    
  } catch (error: any) {
    console.error(`❌ エラー: ${error.message}`);
  }
}

addMywaLpTxt().catch(console.error);