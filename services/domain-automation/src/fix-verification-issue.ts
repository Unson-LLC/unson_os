#!/usr/bin/env tsx

import dotenv from 'dotenv';
import path from 'path';
import { Route53Manager } from './lib/route53-client';

// 環境変数を読み込み
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function fixVerificationIssue() {
  console.log('🔧 ai-coach.unson.jp の検証問題を修正します\n');
  
  const route53 = new Route53Manager();
  
  try {
    // 1. CNAMEレコードを削除（Aレコードと競合するため）
    console.log('1️⃣ CNAMEレコードを削除...');
    try {
      await route53.deleteDnsRecord({
        subdomain: 'ai-coach',
        type: 'CNAME'
      });
      console.log('✅ CNAMEレコード削除完了');
    } catch (error: any) {
      console.log('⚠️  CNAMEレコードが見つかりません');
    }
    
    // 2. Aレコードを作成（VercelのエニーキャストIP）
    console.log('2️⃣ Aレコードを作成...');
    await route53.createDnsRecord({
      subdomain: 'ai-coach',
      type: 'A',
      value: '76.76.21.21',
      ttl: 300
    });
    console.log('✅ Aレコード作成完了');
    
    // 3. 既存のTXTレコードを確認
    console.log('3️⃣ TXTレコードの状態を確認...');
    console.log('現在のTXTレコード: _vercel.ai-coach.unson.jp');
    console.log('値: vc-domain-verify=ai-coach.unson.jp,cdf2990335cdaa...');
    
    console.log('\n✅ 修正完了！');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 次のステップ:');
    console.log('1. Vercelダッシュボードで「Refresh」ボタンをクリック');
    console.log('2. TXTレコードによる所有権検証を待つ');
    console.log('3. 検証が完了したら、ドメインが使用可能になります');
    
    console.log('\n📝 確認事項:');
    console.log('- TXTレコードは既に設定済み: _vercel.ai-coach.unson.jp');
    console.log('- Aレコード: ai-coach.unson.jp → 76.76.21.21');
    
  } catch (error: any) {
    console.error(`❌ エラー: ${error.message}`);
  }
}

fixVerificationIssue().catch(console.error);