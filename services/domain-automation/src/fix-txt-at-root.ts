#!/usr/bin/env tsx

import dotenv from 'dotenv';
import path from 'path';
import { Route53Manager } from './lib/route53-client';

// 環境変数を読み込み
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// ルートレベルに追加するTXTレコード
const ROOT_TXT_RECORDS = [
  'vc-domain-verify=ai-coach.unson.jp,cdf2990335cdaa8ccabd',
  'vc-domain-verify=ai-bridge.unson.jp,7d2d3b8d374a66d4c83e',
  'vc-domain-verify=ai-legacy.unson.jp,589c27279397eec6e061',
  'vc-domain-verify=ai-stylist.unson.jp,453bdbffd0a9fc8d2312'
];

async function fixTxtAtRoot() {
  console.log('🔧 TXTレコードをルートレベル（_vercel.unson.jp）に追加します\n');
  
  const route53 = new Route53Manager();
  
  try {
    // 既存のTXTレコードを取得（保持する必要があるため）
    console.log('1️⃣ 既存のTXTレコードを確認...');
    const existingRecords = [
      'vc-domain-verify=mywa.unson.jp,0f14fdaf0c717e1eaa43',
      'vc-domain-verify=os.unson.jp,4a0da986272868d726fe'
    ];
    
    // 全てのTXTレコードを結合
    const allTxtValues = [...existingRecords, ...ROOT_TXT_RECORDS];
    
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
    // Route53では複数のTXT値を1つのレコードに設定可能
    const txtValue = allTxtValues.map(v => `"${v}"`).join(' ');
    
    await route53.createDnsRecord({
      subdomain: '_vercel',
      type: 'TXT',
      value: txtValue,
      ttl: 300
    });
    
    console.log('✅ TXTレコード作成完了');
    
    console.log('\n📊 設定されたTXT値:');
    allTxtValues.forEach(v => {
      console.log(`  • ${v.substring(0, 60)}...`);
    });
    
    console.log('\n✅ 設定完了！');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 次のステップ:');
    console.log('1. DNS伝播を待つ（1-2分）');
    console.log('2. Vercelダッシュボードで「Refresh」ボタンをクリック');
    console.log('3. 検証が完了するはずです');
    
  } catch (error: any) {
    console.error(`❌ エラー: ${error.message}`);
  }
}

fixTxtAtRoot().catch(console.error);