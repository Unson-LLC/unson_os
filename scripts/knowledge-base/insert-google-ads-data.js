#!/usr/bin/env node

/**
 * Google Ads第1週の実験データをNeonデータベースに挿入
 */

const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const DATABASE_URL = process.env.DATABASE_URL;

async function insertGoogleAdsData() {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    console.log('🔄 データベースに接続中...');
    await client.connect();
    console.log('✅ 接続成功');

    // 1. Google Ads第1週の実験データを挿入
    console.log('\n📝 knowledge_experimentsテーブルにデータを挿入...');
    
    const experimentData = {
      service_name: 'わたしコンパス',
      channel: 'Google Ads',
      experiment_date: '2025-08-12',
      experiment_type: 'MVP検証',
      hypothesis: 'ペルソナ（32歳フリーランスデザイナー）の価値観迷子問題を解決する診断ツールに需要がある',
      implementation: `
        キャンペーン設定:
        - 予算: ¥4,000/日
        - ターゲティング: 日本のみ
        - キーワード: "価値観診断", "転職 迷い", "キャリア 価値観"
        - 広告文: "AIがあなたの本当の価値観を見つけ出す"
      `,
      metrics: JSON.stringify({
        impressions: 552,
        clicks: 103,
        ctr: 18.66,
        cost_jpy: 1018,
        conversions: 1,
        conversion_rate: 0.97,
        cpa_jpy: 1018,
        cpc_jpy: 9.88
      }),
      results: `
        - CPA ¥1,018で1人のベータテスター獲得
        - CTR 18.66%（業界平均の6倍）
        - LP登録率0.97%（目標10%に未達）
      `,
      learnings: [
        '入札戦略の設定ミス：コンバージョン最大化＋トラッキング未設定で配信量激減',
        'CTR 18.66%は広告文が刺さっている証拠',
        'LP登録率0.97%が最大のボトルネック',
        '8/6の初期設定が最も効果的だった',
        'キーワード変更は学習をリセットし逆効果'
      ],
      next_actions: [
        '入札戦略を「クリック数最大化」に変更（実施済み）',
        'LP改善：思い込み破綻メッセージの強化',
        'フォーム項目をメールアドレスのみに削減',
        'コンバージョントラッキング設定',
        '2週間は設定を固定して学習を安定化'
      ],
      content: `
        【Google Ads第1週レポート】わたしコンパス MVP検証
        
        良いニュース：CPA ¥1,018で1人獲得！CTR 18.66%
        
        問題と解決策：
        1. 配信量不足 → 入札戦略変更で10-30倍改善見込み
        2. LP登録率0.97% → 思い込み破綻メッセージ強化
        
        重要な学び：
        - 設定ミスで予算の2.5%しか消化できなかった
        - 広告文は刺さっているがLPが弱い
        - 頻繁な変更は逆効果、2週間固定が重要
      `,
      access_level: 'private'
    };

    const insertExperimentQuery = `
      INSERT INTO knowledge_experiments (
        service_name, channel, experiment_date, experiment_type,
        hypothesis, implementation, metrics, results,
        learnings, next_actions, content, access_level
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id;
    `;

    const experimentResult = await client.query(insertExperimentQuery, [
      experimentData.service_name,
      experimentData.channel,
      experimentData.experiment_date,
      experimentData.experiment_type,
      experimentData.hypothesis,
      experimentData.implementation,
      experimentData.metrics,
      experimentData.results,
      experimentData.learnings,
      experimentData.next_actions,
      experimentData.content,
      experimentData.access_level
    ]);

    console.log(`✅ 実験データ挿入完了 (ID: ${experimentResult.rows[0].id})`);

    // 2. キャンペーンメトリクスを挿入
    console.log('\n📊 campaign_metricsテーブルにデータを挿入...');
    
    const metricsData = [
      {
        service_name: 'わたしコンパス',
        channel: 'Google Ads',
        campaign_name: 'わたしコンパス_ベータテスター募集_2025',
        date_range_start: '2025-08-05',
        date_range_end: '2025-08-12',
        impressions: 552,
        clicks: 103,
        ctr: 18.66,
        cost_jpy: 1018,
        conversions: 1,
        conversion_rate: 0.97,
        cpa_jpy: 1018,
        cpc_jpy: 9.88,
        notes: '第1週：設定ミスにより配信量が制限されたが、CTRは優秀'
      }
    ];

    const insertMetricsQuery = `
      INSERT INTO campaign_metrics (
        service_name, channel, campaign_name,
        date_range_start, date_range_end,
        impressions, clicks, ctr, cost_jpy,
        conversions, conversion_rate, cpa_jpy, cpc_jpy, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id;
    `;

    for (const metrics of metricsData) {
      const metricsResult = await client.query(insertMetricsQuery, [
        metrics.service_name,
        metrics.channel,
        metrics.campaign_name,
        metrics.date_range_start,
        metrics.date_range_end,
        metrics.impressions,
        metrics.clicks,
        metrics.ctr,
        metrics.cost_jpy,
        metrics.conversions,
        metrics.conversion_rate,
        metrics.cpa_jpy,
        metrics.cpc_jpy,
        metrics.notes
      ]);
      console.log(`✅ メトリクスデータ挿入完了 (ID: ${metricsResult.rows[0].id})`);
    }

    // 3. データ確認
    console.log('\n📋 挿入されたデータの確認:');
    
    const countExperiments = await client.query(
      'SELECT COUNT(*) FROM knowledge_experiments'
    );
    console.log(`   - knowledge_experiments: ${countExperiments.rows[0].count}件`);
    
    const countMetrics = await client.query(
      'SELECT COUNT(*) FROM campaign_metrics'
    );
    console.log(`   - campaign_metrics: ${countMetrics.rows[0].count}件`);

    console.log('\n🎉 Google Ads第1週のデータ挿入完了！');
    
  } catch (error) {
    console.error('\n❌ エラー:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// メイン実行
console.log('📝 Google Ads実験データ挿入開始');
console.log('=' .repeat(50));
insertGoogleAdsData();