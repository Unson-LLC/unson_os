#!/usr/bin/env tsx

import dotenv from 'dotenv';
import path from 'path';
import { Route53Manager } from './lib/route53-client';

// 環境変数を読み込み
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Vercelから取得した完全な設定
const DOMAIN_CONFIGS = [
  {
    subdomain: 'ai-coach',
    cnameValue: 'e9e67a60e7aa16c4.vercel-dns-016.com',
    txtValue: 'vc-domain-verify=ai-coach.unson.jp,cdf2990335cdaa8ccabd'
  },
  {
    subdomain: 'ai-bridge',
    cnameValue: 'fbf2325c3affa5e3.vercel-dns-016.com',
    txtValue: 'vc-domain-verify=ai-bridge.unson.jp,7d2d3b8d374a66d4c83e'
  },
  {
    subdomain: 'ai-legacy',
    cnameValue: 'fb1094a88c996e49.vercel-dns-016.com',
    txtValue: 'vc-domain-verify=ai-legacy.unson.jp,589c27279397eec6e061'
  },
  {
    subdomain: 'ai-stylist',
    cnameValue: 'c920f570c0316d3f.vercel-dns-016.com',
    txtValue: 'vc-domain-verify=ai-stylist.unson.jp,453bdbffd0a9fc8d2312'
  }
];

async function setupCompleteDns() {
  console.log('🚀 完全なDNS設定を開始します\n');
  
  const route53 = new Route53Manager();
  
  for (const config of DOMAIN_CONFIGS) {
    console.log(`\n📌 ${config.subdomain}.unson.jp の設定`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      // 1. 既存のAレコードを削除（CNAMEと競合するため）
      console.log('1️⃣ 既存のAレコードを削除...');
      try {
        await route53.deleteDnsRecord({
          subdomain: config.subdomain,
          type: 'A'
        });
        console.log('✅ Aレコード削除完了');
      } catch (error: any) {
        console.log('⚠️  Aレコードなし');
      }
      
      // 2. 既存のCNAMEレコードを削除（更新のため）
      try {
        await route53.deleteDnsRecord({
          subdomain: config.subdomain,
          type: 'CNAME'
        });
        console.log('✅ 既存CNAMEレコード削除');
      } catch (error: any) {
        // 無視
      }
      
      // 3. 正しいCNAMEレコードを作成
      console.log(`2️⃣ CNAMEレコードを作成: ${config.cnameValue}`);
      await route53.createDnsRecord({
        subdomain: config.subdomain,
        type: 'CNAME',
        value: config.cnameValue,
        ttl: 300
      });
      console.log('✅ CNAMEレコード作成完了');
      
      // 4. TXTレコードを設定
      console.log('3️⃣ TXTレコードを設定...');
      
      // 既存のTXTレコードを削除
      try {
        await route53.deleteDnsRecord({
          subdomain: `_vercel.${config.subdomain}`,
          type: 'TXT'
        });
        console.log('✅ 既存TXTレコード削除');
      } catch (error: any) {
        // 無視
      }
      
      // 新しいTXTレコードを作成
      await route53.createDnsRecord({
        subdomain: `_vercel.${config.subdomain}`,
        type: 'TXT',
        value: `"${config.txtValue}"`,
        ttl: 300
      });
      console.log('✅ TXTレコード作成完了');
      
      console.log(`✅ ${config.subdomain}.unson.jp の設定完了！`);
      
    } catch (error: any) {
      console.error(`❌ エラー: ${error.message}`);
    }
    
    // レート制限対策
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n\n🎉 全ドメインの設定が完了しました！');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📊 設定内容:');
  DOMAIN_CONFIGS.forEach(config => {
    console.log(`\n${config.subdomain}.unson.jp:`);
    console.log(`  CNAME → ${config.cnameValue}`);
    console.log(`  TXT(_vercel) → ${config.txtValue.substring(0, 50)}...`);
  });
  
  console.log('\n\n💡 次のステップ:');
  console.log('1. DNS伝播を待つ（5-10分）');
  console.log('2. Vercelダッシュボードで各ドメインの「Refresh」ボタンをクリック');
  console.log('3. 検証が完了したら、SSL証明書が自動発行されます');
  console.log('4. 15-30分後に各ドメインにアクセス可能になります');
  
  console.log('\n📝 確認URL:');
  DOMAIN_CONFIGS.forEach(config => {
    console.log(`• https://${config.subdomain}.unson.jp`);
  });
}

setupCompleteDns().catch(console.error);