#!/usr/bin/env tsx

import dotenv from 'dotenv';
import path from 'path';
import { Route53Manager } from './lib/route53-client';
import { VercelManager } from './lib/vercel-client';

// 環境変数を読み込み
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function testCreateDomain() {
  console.log('🚀 テストドメイン作成を開始します\n');

  // 環境変数チェック
  const requiredEnvVars = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'HOSTED_ZONE_ID',
    'ROOT_DOMAIN',
    'VERCEL_TOKEN'
  ];

  const missingVars = requiredEnvVars.filter(key => !process.env[key]);
  if (missingVars.length > 0) {
    console.error('❌ 必要な環境変数が設定されていません:', missingVars);
    console.log('\n💡 先に以下のコマンドを実行してください:');
    console.log('npx tsx scripts/setup-domain-automation.ts');
    process.exit(1);
  }

  try {
    // 1. Route53マネージャーの初期化
    console.log('📌 Route53に接続中...');
    const route53 = new Route53Manager();
    
    // 2. テストサブドメインの作成
    const testSubdomain = `test-${Date.now()}`;
    console.log(`\n📝 サブドメインを作成: ${testSubdomain}.${process.env.ROOT_DOMAIN}`);
    
    // 利用可能性チェック
    const isAvailable = await route53.isSubdomainAvailable(testSubdomain);
    if (!isAvailable) {
      console.log('⚠️  このサブドメインは既に使用されています');
      return;
    }
    
    // 3. DNSレコード作成（仮のIPアドレス）
    await route53.createDnsRecord({
      subdomain: testSubdomain,
      type: 'A',
      value: '76.76.21.21', // Vercelの仮IPアドレス
      ttl: 300
    });
    
    console.log('✅ DNSレコードを作成しました');
    
    // 4. Vercel連携（オプション）
    if (process.env.VERCEL_TOKEN) {
      console.log('\n📌 Vercelプロジェクトを作成中...');
      const vercel = new VercelManager();
      
      try {
        const project = await vercel.createProject({
          name: `test-${testSubdomain}`,
          framework: 'nextjs',
        });
        
        console.log(`✅ Vercelプロジェクトを作成: ${project.name}`);
        
        // カスタムドメイン追加
        await vercel.addDomain({
          projectId: project.id,
          domain: `${testSubdomain}.${process.env.ROOT_DOMAIN}`
        });
        
        console.log('✅ カスタムドメインを設定しました');
      } catch (vercelError) {
        console.log('⚠️  Vercel設定はスキップされました:', vercelError);
      }
    }
    
    // 5. 結果表示
    console.log('\n🎉 テストドメインの作成が完了しました！');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`URL: https://${testSubdomain}.${process.env.ROOT_DOMAIN}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    console.log('\n📊 確認方法:');
    console.log('1. Route53コンソール: https://console.aws.amazon.com/route53/');
    console.log('2. DNSの反映確認（数分かかる場合があります）:');
    console.log(`   nslookup ${testSubdomain}.${process.env.ROOT_DOMAIN}`);
    
    // 6. クリーンアップの提案
    console.log('\n🧹 テスト後のクリーンアップ:');
    console.log('以下のコマンドでDNSレコードを削除できます:');
    console.log(`npm run test:delete-domain -- ${testSubdomain}`);
    
  } catch (error) {
    console.error('\n❌ エラーが発生しました:', error);
    console.log('\n💡 トラブルシューティング:');
    console.log('1. AWS認証情報が正しいか確認');
    console.log('2. Route53の権限があるか確認');
    console.log('3. ホストゾーンIDが正しいか確認');
  }
}

// 実行
testCreateDomain().catch(console.error);