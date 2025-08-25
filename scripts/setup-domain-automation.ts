#!/usr/bin/env tsx

import { Route53Client, ListHostedZonesCommand } from '@aws-sdk/client-route-53';
import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

async function setupDomainAutomation() {
  console.log('🚀 ドメイン自動化システムのセットアップを開始します\n');

  // 1. AWS認証情報の入力
  console.log('📋 ステップ1: AWS認証情報の設定');
  console.log('AWS IAMコンソールからアクセスキーを取得してください:');
  console.log('https://console.aws.amazon.com/iam/\n');

  const awsAccessKey = await question('AWS Access Key ID: ');
  const awsSecretKey = await question('AWS Secret Access Key: ');
  
  // 2. Route53のホストゾーンを確認
  console.log('\n📋 ステップ2: Route53ホストゾーンの確認');
  
  const client = new Route53Client({
    region: 'ap-northeast-1',
    credentials: {
      accessKeyId: awsAccessKey,
      secretAccessKey: awsSecretKey,
    },
  });

  try {
    const command = new ListHostedZonesCommand({});
    const response = await client.send(command);
    
    if (response.HostedZones && response.HostedZones.length > 0) {
      console.log('\n✅ 利用可能なホストゾーン:');
      response.HostedZones.forEach((zone, index) => {
        console.log(`${index + 1}. ${zone.Name} (ID: ${zone.Id})`);
      });
      
      const zoneIndex = await question('\nどのホストゾーンを使用しますか？ (番号を入力): ');
      const selectedZone = response.HostedZones[parseInt(zoneIndex) - 1];
      
      if (selectedZone) {
        const hostedZoneId = selectedZone.Id?.replace('/hostedzone/', '') || '';
        
        // 3. Vercel設定
        console.log('\n📋 ステップ3: Vercel API設定');
        console.log('Vercelダッシュボードからトークンを取得:');
        console.log('https://vercel.com/account/tokens\n');
        
        const vercelToken = await question('Vercel API Token: ');
        const vercelTeamId = await question('Vercel Team ID (オプション - Enterでスキップ): ');
        
        // 4. 環境変数ファイルの作成
        const envContent = `# AWS Route53設定
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=${awsAccessKey}
AWS_SECRET_ACCESS_KEY=${awsSecretKey}
ROOT_DOMAIN=${selectedZone.Name?.replace('.', '')}
HOSTED_ZONE_ID=${hostedZoneId}

# Vercel設定
VERCEL_TOKEN=${vercelToken}
VERCEL_TEAM_ID=${vercelTeamId}

# Convex設定
NEXT_PUBLIC_CONVEX_URL=https://ceaseless-bison-200.convex.cloud
`;
        
        const envPath = path.join(process.cwd(), 'services/domain-automation/.env.local');
        fs.writeFileSync(envPath, envContent);
        
        console.log('\n✅ 設定完了！');
        console.log(`環境変数を ${envPath} に保存しました\n`);
        
        // 5. テスト実行の提案
        console.log('🧪 テストドメインを作成してみますか？');
        const testConfirm = await question('test-domain.unson.jp を作成しますか？ (y/n): ');
        
        if (testConfirm.toLowerCase() === 'y') {
          console.log('\n📌 以下のコマンドでテストできます:');
          console.log('cd services/domain-automation');
          console.log('npm install');
          console.log('npm run test:create-domain\n');
        }
      }
    } else {
      console.log('❌ ホストゾーンが見つかりません');
      console.log('Route53コンソールでホストゾーンを作成してください:');
      console.log('https://console.aws.amazon.com/route53/');
    }
  } catch (error) {
    console.error('❌ エラー:', error);
    console.log('\n💡 ヒント:');
    console.log('1. AWSアクセスキーが正しいか確認してください');
    console.log('2. Route53の権限があることを確認してください');
    console.log('3. IAMポリシー: AmazonRoute53FullAccess が必要です');
  }
  
  rl.close();
}

// 実行
setupDomainAutomation().catch(console.error);