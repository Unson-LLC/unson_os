#!/usr/bin/env tsx

import { Route53Client, ListHostedZonesCommand } from '@aws-sdk/client-route-53';

async function checkHostedZones() {
  console.log('🔍 Route53 ホストゾーンを確認します...\n');
  
  // 環境変数から認証情報を読み込み
  // 手動で.env.localに設定した後に実行してください
  const client = new Route53Client({
    region: 'ap-northeast-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  });

  try {
    const command = new ListHostedZonesCommand({});
    const response = await client.send(command);
    
    if (response.HostedZones && response.HostedZones.length > 0) {
      console.log('✅ 利用可能なホストゾーン:\n');
      response.HostedZones.forEach((zone) => {
        const zoneId = zone.Id?.replace('/hostedzone/', '') || '';
        console.log(`ドメイン: ${zone.Name}`);
        console.log(`ホストゾーンID: ${zoneId}`);
        console.log(`リソース数: ${zone.ResourceRecordSetCount}`);
        console.log('---');
      });
      
      console.log('\n💡 .env.localファイルに以下を設定してください:');
      console.log(`HOSTED_ZONE_ID=<上記のホストゾーンID>`);
    } else {
      console.log('❌ ホストゾーンが見つかりません');
    }
  } catch (error: any) {
    console.error('❌ エラー:', error.message);
    console.log('\n💡 .env.localファイルに認証情報を設定してから実行してください');
  }
}

checkHostedZones();