#!/usr/bin/env tsx

import dotenv from 'dotenv';
import path from 'path';
import { Route53Manager } from './lib/route53-client';

// 環境変数を読み込み
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Vercelが指定した正しい値（スクリーンショットから取得）
const CORRECT_DNS_CONFIGS = [
  {
    subdomain: 'ai-coach',
    cnameValue: 'e9e67a60e7aa16c4.vercel-dns-016.com',
    txtValue: 'vc-domain-verify=ai-coach.unson.jp,cdf2990335cdaa'  // スクリーンショットから正確な値を取得
  }
];

async function updateCnameRecords() {
  console.log('🔧 DNS レコードを正しい値に更新します\n');
  
  const route53 = new Route53Manager();
  
  for (const config of CORRECT_DNS_CONFIGS) {
    console.log(`\n📌 ${config.subdomain}.unson.jp のCNAMEを更新`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      // 1. 既存のCNAMEレコードを削除
      console.log('1️⃣ 既存のCNAMEレコードを削除...');
      try {
        await route53.deleteDnsRecord({
          subdomain: config.subdomain,
          type: 'CNAME'
        });
        console.log('✅ 既存CNAMEレコード削除完了');
      } catch (error: any) {
        console.log('⚠️  既存CNAMEレコードが見つかりません');
      }
      
      // 2. 正しいCNAMEレコードを作成
      console.log(`2️⃣ 正しいCNAMEレコードを作成: ${config.cnameValue}`);
      await route53.createDnsRecord({
        subdomain: config.subdomain,
        type: 'CNAME',
        value: config.cnameValue,
        ttl: 300
      });
      console.log('✅ CNAMEレコード作成完了');
      
      // 3. TXTレコードも更新
      if (config.txtValue) {
        console.log('3️⃣ TXTレコードを更新...');
        
        // 既存のTXTレコードを削除
        try {
          await route53.deleteDnsRecord({
            subdomain: `_vercel.${config.subdomain}`,
            type: 'TXT'
          });
          console.log('✅ 既存TXTレコード削除完了');
        } catch (error: any) {
          console.log('⚠️  既存TXTレコードが見つかりません');
        }
        
        // 新しいTXTレコードを作成
        await route53.createDnsRecord({
          subdomain: `_vercel.${config.subdomain}`,
          type: 'TXT',
          value: `"${config.txtValue}"`,
          ttl: 300
        });
        console.log('✅ TXTレコード作成完了');
      }
      
      console.log(`✅ ${config.subdomain}.unson.jp の更新完了`);
      
    } catch (error: any) {
      console.error(`❌ エラー: ${error.message}`);
    }
  }
  
  console.log('\n\n✅ CNAMEレコードの更新が完了しました');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n💡 次のステップ:');
  console.log('1. Vercelダッシュボードで「Refresh」ボタンをクリック');
  console.log('2. 検証が完了するまで待つ（1-2分）');
  console.log('3. SSL証明書が自動的に発行されます');
  
  // 他のドメインのCNAME値を取得する方法を説明
  console.log('\n📝 他のドメインのCNAME値を取得:');
  console.log('1. Vercelダッシュボードで各プロジェクトのドメイン設定を確認');
  console.log('2. 表示されているCNAME値をこのスクリプトに追加');
  console.log('3. 再度このスクリプトを実行');
}

updateCnameRecords().catch(console.error);