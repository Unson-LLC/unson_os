#!/usr/bin/env node

/**
 * Neon PostgreSQL with pgvectorを使った洞察データベースのセットアップ
 * Usage: node scripts/setup-neon-insights.js
 */

const { Client } = require('pg');

// Neon接続設定（環境変数から取得）
const connectionString = process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.error('❌ NEON_DATABASE_URL環境変数が設定されていません');
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// テーブル作成SQL
const createTablesSQL = `
-- pgvector拡張機能を有効化
CREATE EXTENSION IF NOT EXISTS vector;

-- 洞察データテーブル
CREATE TABLE IF NOT EXISTS insights (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(50) NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  phase INTEGER NOT NULL, -- 0=planning, 1=validation, 2=development, 3=active
  playbook_id VARCHAR(20) NOT NULL,
  insight_type VARCHAR(50) NOT NULL, -- success, failure, improvement, pivot
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  metrics JSONB, -- 関連するKPIデータ
  tags TEXT[], -- 検索用タグ
  embedding vector(1536), -- OpenAI embedding
  confidence_score FLOAT DEFAULT 0.0, -- 洞察の信頼度
  impact_level VARCHAR(20) DEFAULT 'medium', -- low, medium, high
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- プレイブック実行履歴テーブル
CREATE TABLE IF NOT EXISTS playbook_executions (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(50) NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  playbook_id VARCHAR(20) NOT NULL,
  phase INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL, -- running, completed, failed
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  duration_hours FLOAT,
  success_metrics JSONB,
  failure_reasons TEXT[],
  lessons_learned TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 成功パターンテーブル
CREATE TABLE IF NOT EXISTS success_patterns (
  id SERIAL PRIMARY KEY,
  pattern_name VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  conditions JSONB, -- 成功条件
  indicators JSONB, -- 成功指標
  confidence_score FLOAT DEFAULT 0.0,
  usage_count INTEGER DEFAULT 0,
  embedding vector(1536),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_insights_product_phase ON insights(product_id, phase);
CREATE INDEX IF NOT EXISTS idx_insights_playbook ON insights(playbook_id);
CREATE INDEX IF NOT EXISTS idx_insights_type ON insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_insights_tags ON insights USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_insights_embedding ON insights USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_executions_product ON playbook_executions(product_id);
CREATE INDEX IF NOT EXISTS idx_executions_playbook ON playbook_executions(playbook_id);
CREATE INDEX IF NOT EXISTS idx_executions_status ON playbook_executions(status);

CREATE INDEX IF NOT EXISTS idx_patterns_category ON success_patterns(category);
CREATE INDEX IF NOT EXISTS idx_patterns_embedding ON success_patterns USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- トリガー関数（更新日時の自動更新）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- トリガー設定
DROP TRIGGER IF EXISTS update_insights_updated_at ON insights;
CREATE TRIGGER update_insights_updated_at BEFORE UPDATE ON insights FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_patterns_updated_at ON success_patterns;
CREATE TRIGGER update_patterns_updated_at BEFORE UPDATE ON success_patterns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

// サンプルデータSQL
const sampleDataSQL = `
-- サンプル洞察データ
INSERT INTO insights (product_id, product_name, phase, playbook_id, insight_type, title, content, metrics, tags, confidence_score, impact_level) 
VALUES 
('2025-08-001-mywa', 'MyWa', 1, 'pb-001', 'success', 'LP最適化によるCVR向上', 'ヘッダーのCTAボタンを大きくし、ファーストビューに価値提案を明確に表示することで、CVRが8%から15%に向上した。', '{"cvr": 0.15, "sessions": 1250}', ARRAY['cvr-optimization', 'lp-design', 'cta'], 0.9, 'high'),
('2025-08-002-ai-bridge', 'AI世代間ブリッジ', 1, 'pb-001', 'improvement', '広告文言の改善が必要', 'ターゲット世代の言語感覚に合わせた広告文言への変更が必要。現在のCVRは6%で目標の10%に届いていない。', '{"cvr": 0.06, "sessions": 800}', ARRAY['ad-copy', 'target-audience'], 0.8, 'medium')
ON CONFLICT DO NOTHING;

-- サンプル成功パターン
INSERT INTO success_patterns (pattern_name, description, category, conditions, indicators, confidence_score)
VALUES 
('LP CVR 10%超達成パターン', 'ランディングページで高いコンバージョン率を達成するためのパターン', 'lp-validation', 
'{"clear_value_prop": true, "above_fold_cta": true, "social_proof": true}',
'{"cvr": ">0.10", "bounce_rate": "<0.50", "time_on_page": ">120"}', 0.85),
('広告最適化成功パターン', 'Google Ads等での効果的な広告配信パターン', 'ad-optimization',
'{"keyword_match": "exact", "negative_keywords": ">50", "landing_page_relevance": ">8"}',
'{"ctr": ">0.02", "cpa": "<3000", "quality_score": ">7"}', 0.78)
ON CONFLICT DO NOTHING;
`;

async function setupNeonInsights() {
  try {
    console.log('🔗 Neonデータベースに接続中...');
    await client.connect();
    
    console.log('📊 テーブルとインデックスを作成中...');
    await client.query(createTablesSQL);
    
    console.log('🌱 サンプルデータを投入中...');
    await client.query(sampleDataSQL);
    
    console.log('✅ Neon Insights データベースのセットアップ完了！');
    console.log('\n📋 作成されたテーブル:');
    console.log('  - insights (洞察データ + pgvector埋め込み)');
    console.log('  - playbook_executions (プレイブック実行履歴)');
    console.log('  - success_patterns (成功パターン + pgvector埋め込み)');
    
  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// スクリプト実行
if (require.main === module) {
  setupNeonInsights();
}

module.exports = { setupNeonInsights };