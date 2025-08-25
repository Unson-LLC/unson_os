#!/usr/bin/env tsx

import dotenv from 'dotenv';
import path from 'path';
import { Route53Manager } from './lib/route53-client';

// 環境変数を読み込み
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// VercelダッシュボードからTXT値を取得して、ここに追加
const TXT_RECORDS = [
  {
    subdomain: 'ai-coach',
    txtValue: 'vc-domain-verify=ai-coach.unson.jp,cdf2990335cdaa8ccabd'
  },
  {
    subdomain: 'ai-bridge',
    txtValue: 'vc-domain-verify=ai-bridge.unson.jp,7d2d3b8d374a66d4c83e'
  },
  {
    subdomain: 'ai-legacy',
    txtValue: 'vc-domain-verify=ai-legacy.unson.jp,589c27279397eec6e061'
  },
  {
    subdomain: 'ai-stylist',
    txtValue: 'vc-domain-verify=ai-stylist.unson.jp,453bdbffd0a9fc8d2312'
  }
];

async function setTxtRecords() {
  if (TXT_RECORDS.length === 0) {
    console.log('⚠️  TXT_RECORDSが設定されていません');
    console.log('VercelダッシュボードからTXT値を取得して、このファイルのTXT_RECORDS配列に追加してください');
    return;
  }
  
  console.log('🔧 TXTレコードを設定します\n');
  
  const route53 = new Route53Manager();
  
  for (const record of TXT_RECORDS) {
    console.log(`\n📌 ${record.subdomain}.unson.jp のTXTレコードを設定`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      // 1. 既存のTXTレコードを削除（あれば）
      console.log('1️⃣ 既存のTXTレコードをチェック...');
      try {
        await route53.deleteDnsRecord({
          subdomain: `_vercel.${record.subdomain}`,
          type: 'TXT'
        });
        console.log('✅ 既存TXTレコード削除完了');
      } catch (error: any) {
        console.log('⚠️  既存TXTレコードなし');
      }
      
      // 2. 新しいTXTレコードを作成
      console.log('2️⃣ TXTレコードを作成...');
      await route53.createDnsRecord({
        subdomain: `_vercel.${record.subdomain}`,
        type: 'TXT',
        value: `"${record.txtValue}"`,
        ttl: 300
      });
      console.log('✅ TXTレコード作成完了');
      console.log(`値: ${record.txtValue}`);
      
    } catch (error: any) {
      console.error(`❌ エラー: ${error.message}`);
    }
    
    // レート制限対策
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n\n✅ 全てのTXTレコード設定完了！');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n💡 次のステップ:');
  console.log('1. DNS伝播を待つ（1-2分）');
  console.log('2. 各プロジェクトのVercelダッシュボードで「Refresh」ボタンをクリック');
  console.log('3. 検証が完了したらSSL証明書が自動発行されます');
  console.log('\n📝 確認URL:');
  TXT_RECORDS.forEach(record => {
    console.log(`• https://${record.subdomain}.unson.jp`);
  });
}

setTxtRecords().catch(console.error);