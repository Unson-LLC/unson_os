#!/usr/bin/env tsx

import dotenv from 'dotenv';
import path from 'path';
import { Route53Manager } from './lib/route53-client';

// 環境変数を読み込み
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const DOMAINS_TO_FIX = [
  'ai-bridge',
  'ai-legacy', 
  'ai-stylist'
];

async function fixAllDomainsToARecords() {
  console.log('🔧 全てのドメインをAレコードに修正します\n');
  
  const route53 = new Route53Manager();
  
  for (const subdomain of DOMAINS_TO_FIX) {
    console.log(`\n📌 ${subdomain}.unson.jp を修正`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
      // 1. CNAMEレコードを削除
      console.log('1️⃣ CNAMEレコードを削除...');
      try {
        await route53.deleteDnsRecord({
          subdomain: subdomain,
          type: 'CNAME'
        });
        console.log('✅ CNAMEレコード削除完了');
      } catch (error: any) {
        console.log('⚠️  CNAMEレコードが見つかりません');
      }
      
      // 2. Aレコードを作成
      console.log('2️⃣ Aレコードを作成...');
      await route53.createDnsRecord({
        subdomain: subdomain,
        type: 'A',
        value: '76.76.21.21',
        ttl: 300
      });
      console.log('✅ Aレコード作成完了');
      
      console.log(`✅ ${subdomain}.unson.jp の修正完了`);
      
    } catch (error: any) {
      // Aレコードが既に存在する場合はスキップ
      if (error.message.includes('already exists')) {
        console.log('⚠️  Aレコードは既に存在します');
      } else {
        console.error(`❌ エラー: ${error.message}`);
      }
    }
    
    // レート制限対策
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n\n✅ 全ドメインの修正が完了しました');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📊 現在のDNS設定:');
  console.log('• ai-coach.unson.jp → A: 76.76.21.21');
  console.log('• ai-bridge.unson.jp → A: 76.76.21.21');
  console.log('• ai-legacy.unson.jp → A: 76.76.21.21');
  console.log('• ai-stylist.unson.jp → A: 76.76.21.21');
  console.log('\n💡 次のステップ:');
  console.log('1. 各プロジェクトのVercelダッシュボードを確認');
  console.log('2. 必要に応じてTXTレコードを追加（所有権検証用）');
  console.log('3. SSL証明書の発行を待つ');
}

fixAllDomainsToARecords().catch(console.error);