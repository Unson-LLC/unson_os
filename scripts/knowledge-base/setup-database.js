#!/usr/bin/env node

/**
 * Neonデータベースセットアップスクリプト
 * pgvectorとナレッジ管理テーブルを作成
 */

const { Client } = require('pg');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

async function setupDatabase() {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    console.log('🔄 Neonデータベースに接続中...');
    await client.connect();
    console.log('✅ 接続成功');

    // pgvector拡張を有効化
    console.log('\n📦 pgvector拡張を有効化...');
    await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
    console.log('✅ pgvector有効化完了');

    // knowledge_experimentsテーブル作成
    console.log('\n📊 knowledge_experimentsテーブルを作成...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS knowledge_experiments (
        id SERIAL PRIMARY KEY,
        service_name VARCHAR(100) NOT NULL,
        channel VARCHAR(50) NOT NULL,
        experiment_date DATE NOT NULL,
        experiment_type VARCHAR(50),
        hypothesis TEXT,
        implementation TEXT,
        metrics JSONB,
        results TEXT,
        learnings TEXT[],
        next_actions TEXT[],
        content TEXT,
        content_embedding vector(1536),
        access_level VARCHAR(20) DEFAULT 'private',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ knowledge_experimentsテーブル作成完了');

    // campaign_metricsテーブル作成
    console.log('\n📈 campaign_metricsテーブルを作成...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS campaign_metrics (
        id SERIAL PRIMARY KEY,
        service_name VARCHAR(100) NOT NULL,
        channel VARCHAR(50) NOT NULL,
        campaign_name VARCHAR(200),
        date_range_start DATE NOT NULL,
        date_range_end DATE NOT NULL,
        impressions INTEGER,
        clicks INTEGER,
        ctr DECIMAL(5,2),
        cost_jpy DECIMAL(10,2),
        conversions INTEGER,
        conversion_rate DECIMAL(5,2),
        cpa_jpy DECIMAL(10,2),
        cpc_jpy DECIMAL(10,2),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ campaign_metricsテーブル作成完了');

    // インデックス作成
    console.log('\n🔍 インデックスを作成...');
    
    // ベクトル検索用インデックス（コサイン類似度）
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_content_embedding 
      ON knowledge_experiments 
      USING ivfflat (content_embedding vector_cosine_ops)
      WITH (lists = 100);
    `);
    
    // サービス名とチャネルの複合インデックス
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_service_channel 
      ON knowledge_experiments(service_name, channel);
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_campaign_metrics_service 
      ON campaign_metrics(service_name, channel, date_range_start);
    `);
    
    console.log('✅ インデックス作成完了');

    // テーブル情報を表示
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE';
    `);
    
    console.log('\n📋 作成されたテーブル:');
    result.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

    console.log('\n🎉 データベースセットアップ完了！');
    
  } catch (error) {
    console.error('\n❌ エラー:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// メイン実行
console.log('🚀 Neonデータベースセットアップ開始');
console.log('=' .repeat(50));
setupDatabase();