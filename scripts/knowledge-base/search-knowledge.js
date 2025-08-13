#!/usr/bin/env node

/**
 * Neonデータベースからナレッジを検索する（RAG対応）
 * 使用例:
 * node search-knowledge.js "Google Ads 入札戦略"
 * node search-knowledge.js "LP 登録率 改善"
 */

const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const DATABASE_URL = process.env.DATABASE_URL;

async function searchKnowledge(query) {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    await client.connect();
    
    // 1. テキスト検索（learningsとnext_actions配列を検索）
    console.log('🔍 キーワード検索中...\n');
    
    const textSearchQuery = `
      SELECT 
        service_name,
        channel,
        experiment_date,
        experiment_type,
        hypothesis,
        results,
        learnings,
        next_actions,
        metrics
      FROM knowledge_experiments
      WHERE 
        content ILIKE $1
        OR array_to_string(learnings, ' ') ILIKE $1
        OR array_to_string(next_actions, ' ') ILIKE $1
        OR hypothesis ILIKE $1
        OR results ILIKE $1
      ORDER BY experiment_date DESC
      LIMIT 5;
    `;
    
    const searchPattern = `%${query}%`;
    const result = await client.query(textSearchQuery, [searchPattern]);
    
    if (result.rows.length === 0) {
      console.log('❌ 検索結果が見つかりませんでした。');
      return;
    }
    
    console.log(`✅ ${result.rows.length}件の結果が見つかりました:\n`);
    console.log('=' .repeat(70));
    
    result.rows.forEach((row, index) => {
      console.log(`\n📊 結果 ${index + 1}: ${row.service_name} - ${row.channel}`);
      console.log(`📅 実験日: ${row.experiment_date}`);
      console.log(`🔬 タイプ: ${row.experiment_type}`);
      console.log(`\n💡 仮説:`);
      console.log(`   ${row.hypothesis}`);
      
      console.log(`\n📈 結果:`);
      console.log(`   ${row.results}`);
      
      if (row.metrics) {
        const metrics = typeof row.metrics === 'string' ? JSON.parse(row.metrics) : row.metrics;
        console.log(`\n📊 メトリクス:`);
        console.log(`   - CTR: ${metrics.ctr}%`);
        console.log(`   - CPA: ¥${metrics.cpa_jpy}`);
        console.log(`   - コンバージョン率: ${metrics.conversion_rate}%`);
      }
      
      console.log(`\n🎓 学び:`);
      row.learnings.forEach(learning => {
        console.log(`   • ${learning}`);
      });
      
      console.log(`\n✅ ネクストアクション:`);
      row.next_actions.forEach(action => {
        console.log(`   • ${action}`);
      });
      
      console.log('\n' + '-'.repeat(70));
    });
    
    // 2. 関連するキャンペーンメトリクスも検索
    console.log('\n📊 関連するキャンペーンメトリクス:\n');
    
    const metricsQuery = `
      SELECT 
        campaign_name,
        date_range_start,
        date_range_end,
        impressions,
        clicks,
        ctr,
        cost_jpy,
        conversions,
        cpa_jpy,
        notes
      FROM campaign_metrics
      WHERE 
        campaign_name ILIKE $1
        OR notes ILIKE $1
      ORDER BY date_range_start DESC
      LIMIT 3;
    `;
    
    const metricsResult = await client.query(metricsQuery, [searchPattern]);
    
    if (metricsResult.rows.length > 0) {
      metricsResult.rows.forEach((row, index) => {
        console.log(`📈 キャンペーン: ${row.campaign_name}`);
        console.log(`   期間: ${row.date_range_start} ～ ${row.date_range_end}`);
        console.log(`   費用: ¥${row.cost_jpy} | クリック: ${row.clicks} | CTR: ${row.ctr}%`);
        console.log(`   コンバージョン: ${row.conversions} | CPA: ¥${row.cpa_jpy}`);
        if (row.notes) {
          console.log(`   メモ: ${row.notes}`);
        }
        console.log();
      });
    }
    
  } catch (error) {
    console.error('❌ エラー:', error.message);
  } finally {
    await client.end();
  }
}

// コマンドライン引数から検索クエリを取得
const query = process.argv.slice(2).join(' ');

if (!query) {
  console.log('使用方法: node search-knowledge.js <検索クエリ>');
  console.log('例: node search-knowledge.js "Google Ads 入札戦略"');
  process.exit(1);
}

console.log(`🔎 検索クエリ: "${query}"`);
console.log('=' .repeat(70));
searchKnowledge(query);