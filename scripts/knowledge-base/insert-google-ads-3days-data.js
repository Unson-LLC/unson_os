#!/usr/bin/env node

/**
 * Google Ads 3日間の劇的改善データをNeonデータベースに挿入
 * 期間: 2025年8月14日-16日
 */

const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const DATABASE_URL = process.env.DATABASE_URL;

async function insertGoogleAds3DaysData() {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    console.log('🔄 データベースに接続中...');
    await client.connect();
    console.log('✅ 接続成功');

    // 1. 8/14 AIキーワード失敗期のデータ
    console.log('\n📝 8/14 AIキーワード失敗期のデータを挿入...');
    
    const day1Data = {
      service_name: 'わたしコンパス',
      channel: 'Google Ads',
      experiment_date: '2025-08-14',
      experiment_type: 'キーワード戦略転換',
      hypothesis: 'AI関連キーワードで新規ユーザー獲得を狙う',
      implementation: `
        キーワード変更:
        - "ai ツール 無料" (122回表示、6クリック)
        - "無料 ai" (64回表示、1クリック)
        - "ai 情報" (41回表示、4クリック)
        入札戦略: TARGET_SPEND
      `,
      metrics: JSON.stringify({
        impressions: 284,
        clicks: 12,
        ctr: 4.2,
        cost_jpy: 1742,
        average_cpc: 145,
        main_keywords: ['ai ツール 無料', '無料 ai', 'ai 情報']
      }),
      results: `
        - 高CPC ¥145（競合激化領域）
        - ターゲット不一致
        - 1日で月間予算の43%を消費
      `,
      learnings: [
        'トレンドキーワードへの安易な参入は危険',
        '競合が多い一般的なキーワードは高CPC',
        'ペルソナとキーワードの不一致は効率を著しく低下',
        'AIキーワードは競合激化で入札単価が高騰',
        '予算効率が極めて悪い（¥1,742/日消費）'
      ],
      next_actions: [
        'AIキーワードを停止',
        'ペルソナに寄り添ったキーワードへ転換',
        'CPC削減を最優先課題に設定',
        '競合の少ないニッチキーワード探索',
        '予算配分の見直し'
      ],
      content: `
        【失敗】AIキーワード参入の大失敗
        
        問題点：
        - CPC ¥145と異常に高額
        - ペルソナとの不一致
        - 予算の43%を1日で浪費
        
        学習：
        トレンドキーワードは競合激化で高CPC化。
        ペルソナ理解なしのキーワード選定は失敗する。
      `,
      access_level: 'shared'
    };

    // 2. 8/15 ペルソナ最適化期のデータ
    const day2Data = {
      service_name: 'わたしコンパス',
      channel: 'Google Ads',
      experiment_date: '2025-08-15',
      experiment_type: 'ペルソナ最適化',
      hypothesis: 'ペルソナに寄り添った単体キーワードで効率改善',
      implementation: `
        キーワード戦略転換:
        - "相談" (103回表示、8クリック、CTR 7.8%)
        - "自分軸" (72回表示、1クリック)
        - 3語以上のキーワードを停止
        入札戦略: TARGET_SPEND継続
      `,
      metrics: JSON.stringify({
        impressions: 224,
        clicks: 9,
        ctr: 4.0,
        cost_jpy: 162,
        average_cpc: 18,
        main_keywords: ['相談', '自分軸', '悩み', '診断']
      }),
      results: `
        - CPC 88%削減（¥145→¥18）
        - 「相談」キーワードでCTR改善
        - 予算枯渇により14時以降配信停止
      `,
      learnings: [
        'ペルソナに寄り添ったキーワードは低CPCで高効率',
        '単体キーワード＋ターゲティングが効果的',
        '3語以上の複合キーワードは検索ボリューム不足',
        '予算不足は致命的な配信制限を引き起こす',
        '「相談」キーワードが最も高パフォーマンス'
      ],
      next_actions: [
        '月間予算を¥10,000に増額',
        '配信なしキーワードの停止',
        '「相談」キーワードの入札強化',
        '新規単体キーワードの追加',
        '時間帯別配信の最適化'
      ],
      content: `
        【成功】ペルソナ最適化でCPC 88%削減
        
        改善点：
        - CPC ¥145 → ¥18（88%削減）
        - 「相談」でCTR 7.8%達成
        
        新たな課題：
        - 予算枯渇（累計¥3,890/¥4,000）
        - 14時以降配信停止
      `,
      access_level: 'shared'
    };

    // 3. 8/16 転職キーワード成功期のデータ
    const day3Data = {
      service_name: 'わたしコンパス',
      channel: 'Google Ads',
      experiment_date: '2025-08-16',
      experiment_type: '予算増額＋転職系キーワード',
      hypothesis: '十分な予算と転職系キーワードで配信量爆発',
      implementation: `
        予算対策:
        - 月間予算 ¥4,000→¥10,000に増額
        
        キーワード最適化:
        - "仕事" (450回表示、59クリック、CTR 13.1%)
        - "転職" (230回表示、39クリック、CTR 17.0%)
        - "相談" (115回表示、11クリック、CTR 9.6%)
      `,
      metrics: JSON.stringify({
        impressions: 1160,
        clicks: 113,
        ctr: 9.7,
        cost_jpy: 3676,
        average_cpc: 33,
        main_keywords: ['仕事', '転職', '相談'],
        hourly_peak: '7-9時'
      }),
      results: `
        - 表示回数5倍増（224→1,160回）
        - クリック数12倍増（9→113回）
        - CTR 2倍改善（4.0%→9.7%）
        - 朝7-9時がゴールデンタイム
      `,
      learnings: [
        '転職・キャリア系キーワードが最適',
        '朝の時間帯（7-9時）が高パフォーマンス',
        '十分な予算があれば配信は爆発的に伸びる',
        '「仕事」「転職」が新たな主力キーワードに',
        '通勤時間帯の転職検討層がメインターゲット'
      ],
      next_actions: [
        '「悩み」キーワードの入札調整または停止',
        '朝の時間帯への配信集中',
        '新規追加: 「カウンセリング」「コーチング」',
        'ランディングページのA/Bテスト開始',
        'コンバージョントラッキング設定'
      ],
      content: `
        【大成功】予算増額で配信爆発
        
        驚異的成果:
        - 表示回数5倍（1,160回/日）
        - クリック数12倍（113回/日）
        - CTR 9.7%（業界平均の2倍）
        
        勝ちパターン確立:
        - 転職系単体キーワード
        - 朝7-9時集中配信
        - 月間予算¥10,000以上
      `,
      access_level: 'shared'
    };

    // データを挿入
    const insertExperimentQuery = `
      INSERT INTO knowledge_experiments (
        service_name, channel, experiment_date, experiment_type,
        hypothesis, implementation, metrics, results,
        learnings, next_actions, content, access_level
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id;
    `;

    // 各日のデータを挿入
    for (const data of [day1Data, day2Data, day3Data]) {
      const result = await client.query(insertExperimentQuery, [
        data.service_name,
        data.channel,
        data.experiment_date,
        data.experiment_type,
        data.hypothesis,
        data.implementation,
        data.metrics,
        data.results,
        data.learnings,
        data.next_actions,
        data.content,
        data.access_level
      ]);
      console.log(`✅ ${data.experiment_date}のデータ挿入完了 (ID: ${result.rows[0].id})`);
    }

    // 4. 集計メトリクスを挿入
    console.log('\n📊 3日間の集計メトリクスを挿入...');
    
    const metricsData = {
      service_name: 'わたしコンパス',
      channel: 'Google Ads',
      campaign_name: 'わたしコンパス_ベータテスター募集_2025',
      date_range_start: '2025-08-14',
      date_range_end: '2025-08-16',
      impressions: 1668,
      clicks: 134,
      ctr: 8.03,
      cost_jpy: 5580,
      conversions: 0,
      conversion_rate: 0,
      cpa_jpy: null,
      cpc_jpy: 41.64,
      notes: '3日間の劇的改善: AIキーワード失敗→ペルソナ最適化→転職系成功'
    };

    const insertMetricsQuery = `
      INSERT INTO campaign_metrics (
        service_name, channel, campaign_name,
        date_range_start, date_range_end,
        impressions, clicks, ctr, cost_jpy,
        conversions, conversion_rate, cpa_jpy, cpc_jpy, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING id;
    `;

    const metricsResult = await client.query(insertMetricsQuery, [
      metricsData.service_name,
      metricsData.channel,
      metricsData.campaign_name,
      metricsData.date_range_start,
      metricsData.date_range_end,
      metricsData.impressions,
      metricsData.clicks,
      metricsData.ctr,
      metricsData.cost_jpy,
      metricsData.conversions,
      metricsData.conversion_rate,
      metricsData.cpa_jpy,
      metricsData.cpc_jpy,
      metricsData.notes
    ]);
    console.log(`✅ 集計メトリクス挿入完了 (ID: ${metricsResult.rows[0].id})`);

    // 5. データ確認
    console.log('\n📋 挿入されたデータの確認:');
    
    const countExperiments = await client.query(
      "SELECT COUNT(*) FROM knowledge_experiments WHERE experiment_date >= '2025-08-14'"
    );
    console.log(`   - 新規実験データ: ${countExperiments.rows[0].count}件`);
    
    const latestLearnings = await client.query(`
      SELECT experiment_date, array_length(learnings, 1) as learning_count
      FROM knowledge_experiments 
      WHERE experiment_date >= '2025-08-14'
      ORDER BY experiment_date
    `);
    
    console.log('\n📚 蓄積された学習内容:');
    for (const row of latestLearnings.rows) {
      console.log(`   - ${row.experiment_date}: ${row.learning_count}個の学び`);
    }

    console.log('\n🎉 Google Ads 3日間の劇的改善データ挿入完了！');
    console.log('\n💡 次のコマンドで検索できます:');
    console.log('   node search-knowledge.js "転職キーワード"');
    console.log('   node search-knowledge.js "CPC削減"');
    console.log('   node search-knowledge.js "予算増額"');
    
  } catch (error) {
    console.error('\n❌ エラー:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// メイン実行
console.log('📝 Google Ads 3日間の劇的改善データ挿入開始');
console.log('=' .repeat(50));
insertGoogleAds3DaysData();