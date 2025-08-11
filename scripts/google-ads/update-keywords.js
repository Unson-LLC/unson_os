#!/usr/bin/env node

/**
 * Google Ads キーワード更新スクリプト
 * 高パフォーマンスキーワード（AI系）を再有効化し、
 * 低パフォーマンスキーワード（女性向け）を一時停止
 */

const { GoogleAdsApi } = require('google-ads-api');
const dotenv = require('dotenv');
const path = require('path');

// .env.localを読み込み
dotenv.config({ path: path.join(__dirname, '../../.env.local') });

const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
});

const customer = client.Customer({
  customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID,
  login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
});

async function updateKeywords() {
  const adGroupId = '183083066586';
  
  // 再追加するキーワード（高パフォーマンスAI系）
  const keywordsToAdd = [
    { text: '無料 ai', cpcBidMicros: 15000000 },
    { text: 'ai 無料', cpcBidMicros: 15000000 },
    { text: 'ai ツール 無料', cpcBidMicros: 12000000 },
    { text: 'ai コンサル', cpcBidMicros: 10000000 },
    { text: 'ai 情報', cpcBidMicros: 10000000 },
  ];
  
  // 一時停止するキーワードID
  const keywordsToPause = [
    '1620479705755',  // 自分軸 作り方
    '2434297411093',  // 自己分析 女性
    '2434297411333',  // 価値観診断 アプリ
    '2435292655193',  // 自分らしく生きる 方法
    '2435292655353',  // 女性 価値観 見つける
    '2435292655393',  // 本当の自分 探す
    '2435292655433',  // 人生の選択 相談
    '2435292655593',  // 女性向け 自己分析
    '2435292655913',  // 価値観 明確にする
    '2435292656073',  // 結婚 仕事 選択
    '2324086873428',  // 女性 ライフデザイン
    '302569558508',   // 女性 キャリア 相談
    '357498403178',   // ワークライフバランス 悩み
    '391053625322',   // 自己理解 深める
  ];
  
  try {
    console.log('🔄 キーワード更新を開始します...');
    
    // 1. 高パフォーマンスキーワードを追加
    const addOperations = keywordsToAdd.map(keyword => ({
      create: {
        ad_group: `customers/${process.env.GOOGLE_ADS_CUSTOMER_ID}/adGroups/${adGroupId}`,
        status: 'ENABLED',
        keyword: {
          text: keyword.text,
          match_type: 'BROAD',
        },
        cpc_bid_micros: keyword.cpcBidMicros,
      },
    }));
    
    // 2. 低パフォーマンスキーワードを一時停止
    const pauseOperations = keywordsToPause.map(criterionId => ({
      update: {
        resource_name: `customers/${process.env.GOOGLE_ADS_CUSTOMER_ID}/adGroupCriteria/${adGroupId}~${criterionId}`,
        status: 'PAUSED',
      },
      update_mask: {
        paths: ['status'],
      },
    }));
    
    const operations = [...addOperations, ...pauseOperations];
    
    // キーワードを追加
    if (addOperations.length > 0) {
      const addResponse = await customer.adGroupCriteria.create(addOperations.map(op => op.create));
      console.log(`✅ ${addOperations.length}件の高パフォーマンスキーワードを追加しました`);
    }
    
    // キーワードを一時停止
    if (pauseOperations.length > 0) {
      const pauseResponse = await customer.adGroupCriteria.update(pauseOperations.map(op => ({
        ...op.update,
        update_mask: op.update_mask
      })));
      console.log(`✅ ${pauseOperations.length}件の低パフォーマンスキーワードを一時停止しました`);
    }
    console.log('\n📊 実行内容:');
    console.log('  1. 高パフォーマンスAI系キーワードを再追加');
    console.log('  2. 低パフォーマンス女性向けキーワードを一時停止');
    console.log('  3. 入札単価を最適化（10-15円）');
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
    if (error.errors) {
      error.errors.forEach(err => {
        console.error(`  - ${err.message}`);
      });
    }
  }
}

updateKeywords();