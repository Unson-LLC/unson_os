#!/usr/bin/env tsx

import dotenv from 'dotenv';
import path from 'path';
import { VercelManager } from './lib/vercel-client';

// 環境変数を読み込み
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// プロジェクトIDとドメインのマッピング
const PROJECT_DOMAIN_MAPPING = [
  {
    projectId: 'prj_Cm1xgGsojtuSVZZPsbKtABlAOdFB',
    projectName: 'unson-lp-mywa',
    domain: 'mywa.unson.jp'
  },
  {
    projectId: 'prj_sYqhuxmqzhT79ABUaRzithrRIqc6',
    projectName: 'unson-lp-ai-bridge',
    domain: 'ai-bridge.unson.jp'
  },
  {
    projectId: 'prj_ve03kUIRNcL36UsJeyDx6oO4cpIq',
    projectName: 'unson-lp-ai-coach',
    domain: 'ai-coach.unson.jp'
  },
  {
    projectId: 'prj_u93hjRYFAEauONH9qXy3ab7SlrU8',
    projectName: 'unson-lp-ai-legacy-creator',
    domain: 'ai-legacy.unson.jp'
  },
  {
    projectId: 'prj_tdaF9gfdmVRheDr3MVHiPlC1DKSm',
    projectName: 'unson-lp-ai-stylist',
    domain: 'ai-stylist.unson.jp'
  }
];

async function addDomainsToProjects() {
  console.log('🚀 既存プロジェクトにカスタムドメインを追加します\n');
  
  const vercel = new VercelManager();
  
  const results = {
    success: [] as string[],
    failed: [] as { domain: string; error: string }[]
  };
  
  for (const mapping of PROJECT_DOMAIN_MAPPING) {
    console.log(`\n📌 処理中: ${mapping.domain}`);
    console.log(`プロジェクト: ${mapping.projectName}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      // カスタムドメインを追加
      await vercel.addDomain({
        projectId: mapping.projectId,
        domain: mapping.domain
      });
      
      console.log(`✅ ドメイン追加成功: ${mapping.domain}`);
      results.success.push(mapping.domain);
      
    } catch (error: any) {
      // 既にドメインが存在する場合はスキップ
      if (error.message.includes('already exists')) {
        console.log(`⚠️  既に設定済み: ${mapping.domain}`);
        results.success.push(mapping.domain + ' (既存)');
      } else {
        console.error(`❌ エラー: ${error.message}`);
        results.failed.push({
          domain: mapping.domain,
          error: error.message
        });
      }
    }
    
    // レート制限対策
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // 結果サマリー
  console.log('\n\n📊 ドメイン追加結果サマリー');
  console.log('════════════════════════════════════════════');
  
  console.log('\n✅ 成功:', results.success.length);
  if (results.success.length > 0) {
    results.success.forEach(domain => {
      console.log(`  • ${domain}`);
    });
  }
  
  console.log('\n❌ 失敗:', results.failed.length);
  if (results.failed.length > 0) {
    results.failed.forEach(({ domain, error }) => {
      console.log(`  • ${domain}: ${error}`);
    });
  }
  
  console.log('\n\n💡 次のステップ:');
  console.log('1. Vercelダッシュボードで確認: https://vercel.com/unson');
  console.log('2. SSL証明書の発行を待つ（通常15-30分）');
  console.log('3. 各ドメインにアクセスして動作確認');
  console.log('\n📝 動作確認URL:');
  PROJECT_DOMAIN_MAPPING.forEach(mapping => {
    console.log(`• https://${mapping.domain}`);
  });
}

addDomainsToProjects().catch(console.error);