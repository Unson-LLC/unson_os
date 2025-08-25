#!/usr/bin/env tsx

import { Route53Client, ListHostedZonesCommand } from '@aws-sdk/client-route-53';
import dotenv from 'dotenv';
import path from 'path';

// 環境変数を読み込み
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function checkHostedZones() {
  console.log('🔍 Route53 ホストゾーンを確認します...\n');
  
  const client = new Route53Client({
    region: process.env.AWS_REGION || 'ap-northeast-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
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
        console.log(`タイプ: ${zone.Config?.PrivateZone ? 'プライベート' : 'パブリック'}`);
        console.log('---');
      });
      
      // unson.jpのホストゾーンを探す
      const unsonZone = response.HostedZones.find(z => z.Name === 'unson.jp.' || z.Name === 'unson.jp');
      if (unsonZone) {
        const zoneId = unsonZone.Id?.replace('/hostedzone/', '') || '';
        console.log('\n✅ unson.jpのホストゾーンID:', zoneId);
        console.log('\n次のステップ: .env.localを更新してテストドメインを作成します');
      }
    } else {
      console.log('❌ ホストゾーンが見つかりません');
      console.log('Route53コンソールでunson.jpのホストゾーンを作成してください');
    }
  } catch (error: any) {
    console.error('❌ エラー:', error.message);
    if (error.name === 'UnauthorizedException' || error.name === 'InvalidUserCredentials') {
      console.log('\n💡 認証エラー: AWS認証情報を確認してください');
    }
  }
}

checkHostedZones();