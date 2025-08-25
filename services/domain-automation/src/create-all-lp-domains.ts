#!/usr/bin/env tsx

import dotenv from 'dotenv';
import path from 'path';
import { Route53Manager } from './lib/route53-client';
import { VercelManager } from './lib/vercel-client';

// 環境変数を読み込み
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// LP一覧とそれぞれのサブドメイン名
const LP_DOMAINS = [
  {
    id: '2025-08-001-mywa',
    subdomain: 'mywa',
    name: 'MyWa - AIニュースコンシェルジュ',
    status: 'active'
  },
  {
    id: '2025-08-002-ai-bridge',
    subdomain: 'ai-bridge',
    name: 'AI世代間ブリッジ',
    status: 'validation'
  },
  {
    id: '2025-08-003-ai-coach',
    subdomain: 'ai-coach',
    name: 'AI自分時間コーチ',
    status: 'validation'
  },
  {
    id: '2025-08-004-ai-legacy-creator',
    subdomain: 'ai-legacy',
    name: 'AIレガシー・クリエーター',
    status: 'validation'
  },
  {
    id: '2025-08-005-ai-stylist',
    subdomain: 'ai-stylist',
    name: 'AIパーソナルスタイリスト',
    status: 'validation'
  }
];

async function createAllDomains() {
  console.log('🚀 LP用ドメインの一括作成を開始します\n');
  
  const route53 = new Route53Manager();
  const vercel = new VercelManager();
  
  const results = {
    success: [] as string[],
    failed: [] as { domain: string; error: string }[],
    skipped: [] as string[]
  };
  
  for (const lp of LP_DOMAINS) {
    const fullDomain = `${lp.subdomain}.${process.env.ROOT_DOMAIN}`;
    console.log(`\n📌 処理中: ${fullDomain} (${lp.name})`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      // 1. サブドメインの利用可能性チェック
      console.log('1️⃣ 利用可能性チェック...');
      const isAvailable = await route53.isSubdomainAvailable(lp.subdomain);
      
      if (!isAvailable) {
        console.log(`⚠️  既に存在: ${fullDomain}`);
        results.skipped.push(fullDomain);
        continue;
      }
      
      // 2. DNSレコード作成
      console.log('2️⃣ DNSレコード作成...');
      await route53.createDnsRecord({
        subdomain: lp.subdomain,
        type: 'A',
        value: '76.76.21.21', // VercelのエニーキャストIP
        ttl: 300
      });
      console.log('✅ DNSレコード作成完了');
      
      // 3. Vercelプロジェクト作成（既存プロジェクトがない場合）
      console.log('3️⃣ Vercelプロジェクト設定...');
      try {
        const projectName = `lp-${lp.subdomain}`;
        const project = await vercel.createProject({
          name: projectName,
          framework: 'nextjs',
          environmentVariables: [
            {
              key: 'NEXT_PUBLIC_LP_ID',
              value: lp.id,
              target: ['production', 'preview', 'development']
            },
            {
              key: 'NEXT_PUBLIC_DOMAIN',
              value: fullDomain,
              target: ['production', 'preview', 'development']
            }
          ]
        });
        
        // 4. カスタムドメイン追加
        await vercel.addDomain({
          projectId: project.id,
          domain: fullDomain
        });
        
        console.log('✅ Vercelプロジェクト設定完了');
        results.success.push(fullDomain);
        
      } catch (vercelError: any) {
        console.log('⚠️  Vercel設定エラー:', vercelError.message);
        // DNSは成功したが、Vercelは失敗
        results.success.push(fullDomain + ' (DNS only)');
      }
      
    } catch (error: any) {
      console.error(`❌ エラー: ${error.message}`);
      results.failed.push({
        domain: fullDomain,
        error: error.message
      });
    }
    
    // レート制限対策
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // 結果サマリー
  console.log('\n\n📊 ドメイン作成結果サマリー');
  console.log('════════════════════════════════════════════');
  
  console.log('\n✅ 成功:', results.success.length);
  if (results.success.length > 0) {
    results.success.forEach(domain => {
      console.log(`  • https://${domain}`);
    });
  }
  
  console.log('\n⚠️  スキップ（既存）:', results.skipped.length);
  if (results.skipped.length > 0) {
    results.skipped.forEach(domain => {
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
  console.log('1. DNS伝播を待つ（通常5-10分）');
  console.log('2. 各LPのVercelデプロイを設定');
  console.log('3. SSL証明書の発行を確認（自動）');
  console.log('4. 各ドメインにアクセスして動作確認');
}

createAllDomains().catch(console.error);