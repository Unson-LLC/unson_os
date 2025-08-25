#!/usr/bin/env tsx

import dotenv from 'dotenv';
import path from 'path';
import { Route53Manager } from './lib/route53-client';
import { VercelManager } from './lib/vercel-client';

// 環境変数を読み込み
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// MyWa LP用のサブドメイン候補
const MYWA_LP_DOMAINS = [
  { subdomain: 'lp-mywa', description: 'MyWa LPページ' },
  { subdomain: 'mywa-lp', description: 'MyWa LPページ (代替)' },
  { subdomain: 'news-ai', description: 'AIニュースサービスLP' }
];

async function createMywaLpDomain() {
  console.log('🚀 MyWa LP用のサブドメインを作成します\n');
  
  const route53 = new Route53Manager();
  const vercel = new VercelManager();
  
  let selectedDomain = null;
  
  // 利用可能なサブドメインを探す
  for (const domain of MYWA_LP_DOMAINS) {
    console.log(`\n📌 ${domain.subdomain}.unson.jp の利用可能性をチェック...`);
    
    try {
      const isAvailable = await route53.isSubdomainAvailable(domain.subdomain);
      
      if (isAvailable) {
        console.log(`✅ ${domain.subdomain}.unson.jp は利用可能です`);
        selectedDomain = domain;
        break;
      } else {
        console.log(`⚠️  ${domain.subdomain}.unson.jp は既に使用中`);
      }
    } catch (error: any) {
      console.error(`❌ エラー: ${error.message}`);
    }
  }
  
  if (!selectedDomain) {
    console.log('\n❌ 利用可能なサブドメインが見つかりません');
    return;
  }
  
  const fullDomain = `${selectedDomain.subdomain}.${process.env.ROOT_DOMAIN}`;
  
  console.log(`\n✨ ${fullDomain} を作成します`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    // 1. DNSレコード作成（Aレコード）
    console.log('\n1️⃣ Aレコードを作成...');
    await route53.createDnsRecord({
      subdomain: selectedDomain.subdomain,
      type: 'A',
      value: '76.76.21.21', // VercelのエニーキャストIP
      ttl: 300
    });
    console.log('✅ Aレコード作成完了');
    
    // 2. Vercelプロジェクトにドメインを追加
    console.log('\n2️⃣ Vercelプロジェクトにドメインを追加...');
    console.log('プロジェクトID: prj_Cm1xgGsojtuSVZZPsbKtABlAOdFB (unson-lp-mywa)');
    
    try {
      await vercel.addDomain({
        projectId: 'prj_Cm1xgGsojtuSVZZPsbKtABlAOdFB',
        domain: fullDomain
      });
      console.log('✅ Vercelプロジェクトにドメイン追加完了');
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        console.log('⚠️  ドメインは既にプロジェクトに追加されています');
      } else {
        console.log(`⚠️  Vercel設定エラー: ${error.message}`);
        console.log('手動でVercelダッシュボードから追加してください');
      }
    }
    
    console.log('\n\n🎉 MyWa LP用ドメイン作成完了！');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📊 作成されたドメイン:');
    console.log(`• URL: https://${fullDomain}`);
    console.log(`• 説明: ${selectedDomain.description}`);
    console.log(`• Vercelプロジェクト: unson-lp-mywa`);
    
    console.log('\n💡 次のステップ:');
    console.log('1. Vercelダッシュボードで確認');
    console.log('   https://vercel.com/unson/unson-lp-mywa/settings/domains');
    console.log('2. TXT検証レコードを追加（必要な場合）');
    console.log('3. SSL証明書の発行を待つ（15-30分）');
    console.log(`4. https://${fullDomain} にアクセスして確認`);
    
  } catch (error: any) {
    console.error(`\n❌ エラー: ${error.message}`);
  }
}

createMywaLpDomain().catch(console.error);