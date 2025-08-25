#!/usr/bin/env tsx

import dotenv from 'dotenv';
import path from 'path';

// 環境変数を読み込み
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const DOMAINS = [
  {
    custom: 'ai-coach.unson.jp',
    vercel: 'unson-lp-ai-coach.vercel.app',
    projectId: 'prj_ve03kUIRNcL36UsJeyDx6oO4cpIq'
  },
  {
    custom: 'ai-bridge.unson.jp',
    vercel: 'unson-lp-ai-bridge.vercel.app',
    projectId: 'prj_sYqhuxmqzhT79ABUaRzithrRIqc6'
  },
  {
    custom: 'ai-legacy.unson.jp',
    vercel: 'unson-lp-ai-legacy-creator.vercel.app',
    projectId: 'prj_u93hjRYFAEauONH9qXy3ab7SlrU8'
  },
  {
    custom: 'ai-stylist.unson.jp',
    vercel: 'unson-lp-ai-stylist.vercel.app',
    projectId: 'prj_tdaF9gfdmVRheDr3MVHiPlC1DKSm'
  }
];

async function checkDomainStatus() {
  console.log('🔍 ドメインステータスを確認\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  for (const domain of DOMAINS) {
    console.log(`\n📌 ${domain.custom}`);
    
    // 1. Vercelデフォルトドメインの確認
    try {
      const vercelResponse = await fetch(`https://${domain.vercel}`, {
        method: 'HEAD'
      });
      console.log(`✅ Vercelプロジェクト: 正常 (${vercelResponse.status})`);
    } catch (error) {
      console.log(`❌ Vercelプロジェクト: エラー`);
    }
    
    // 2. カスタムドメインの確認
    try {
      const customResponse = await fetch(`https://${domain.custom}`, {
        method: 'HEAD',
        redirect: 'manual'
      });
      
      if (customResponse.status === 404) {
        console.log(`⚠️  カスタムドメイン: 未検証 (404)`);
      } else if (customResponse.status >= 200 && customResponse.status < 400) {
        console.log(`✅ カスタムドメイン: 正常 (${customResponse.status})`);
      } else {
        console.log(`⚠️  カスタムドメイン: 問題あり (${customResponse.status})`);
      }
    } catch (error: any) {
      if (error.cause?.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
        console.log(`⚠️  カスタムドメイン: SSL証明書未発行`);
      } else {
        console.log(`❌ カスタムドメイン: 接続エラー`);
      }
    }
    
    // 3. プロジェクトリンク
    console.log(`🔗 Vercel設定: https://vercel.com/unson/${domain.vercel.replace('.vercel.app', '')}/settings/domains`);
  }
  
  console.log('\n\n💡 解決方法:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('1. 上記のVercel設定リンクから各プロジェクトにアクセス');
  console.log('2. ドメイン設定画面でTXT値を確認');
  console.log('3. TXT値をset-txt-records.tsに追加して実行');
  console.log('\n代替案:');
  console.log('• Vercelデフォルトドメイン（.vercel.app）を直接使用');
  console.log('• CloudflareやNetlifyへの移行を検討');
}

checkDomainStatus().catch(console.error);