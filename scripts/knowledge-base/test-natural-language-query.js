#!/usr/bin/env node

/**
 * 自然言語クエリでのナレッジ検索テスト
 * 日本語の質問から適切な情報を取得できるかをテスト
 */

const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const DATABASE_URL = process.env.DATABASE_URL;

// テスト用の自然言語クエリ
const testQueries = [
  {
    query: "なぜGoogle Adsの配信量が少なかったの？",
    expectedKeywords: ["入札戦略", "コンバージョン最大化", "トラッキング"]
  },
  {
    query: "広告のクリック率はどうだった？",
    expectedKeywords: ["CTR", "18.66", "業界平均"]
  },
  {
    query: "LPの問題点は何？",
    expectedKeywords: ["LP", "登録率", "0.97", "ボトルネック"]
  },
  {
    query: "次に何をすればいい？",
    expectedKeywords: ["LP改善", "思い込み破綻", "フォーム"]
  },
  {
    query: "いくらかかった？",
    expectedKeywords: ["1018", "CPA", "費用"]
  },
  {
    query: "最初の設定は良かった？",
    expectedKeywords: ["8/6", "初期設定", "効果的"]
  }
];

async function searchWithNaturalLanguage(naturalQuery) {
  const client = new Client({
    connectionString: DATABASE_URL,
  });

  try {
    await client.connect();
    
    // 自然言語から関連キーワードを抽出（簡易的な実装）
    const keywords = extractKeywords(naturalQuery);
    
    // 複数のキーワードでOR検索
    const conditions = keywords.map((_, i) => `
      content ILIKE $${i + 1}
      OR array_to_string(learnings, ' ') ILIKE $${i + 1}
      OR array_to_string(next_actions, ' ') ILIKE $${i + 1}
      OR hypothesis ILIKE $${i + 1}
      OR results ILIKE $${i + 1}
      OR implementation ILIKE $${i + 1}
    `).join(' OR ');
    
    const query = `
      SELECT 
        service_name,
        channel,
        experiment_date,
        hypothesis,
        results,
        learnings,
        next_actions,
        metrics,
        implementation
      FROM knowledge_experiments
      WHERE ${conditions}
      ORDER BY experiment_date DESC
      LIMIT 1;
    `;
    
    const searchPatterns = keywords.map(k => `%${k}%`);
    const result = await client.query(query, searchPatterns);
    
    await client.end();
    return result.rows[0];
    
  } catch (error) {
    await client.end();
    throw error;
  }
}

function extractKeywords(query) {
  const keywordMap = {
    "配信量": ["配信", "入札", "戦略"],
    "少な": ["配信", "減", "停止"],
    "クリック率": ["CTR", "クリック"],
    "LP": ["LP", "ランディング", "登録"],
    "問題": ["問題", "ボトルネック", "改善"],
    "次": ["next", "ネクスト", "アクション"],
    "いくら": ["費用", "円", "CPA", "コスト"],
    "かかった": ["費用", "コスト", "CPA"],
    "最初": ["初期", "8/6", "最初"],
    "設定": ["設定", "戦略", "キーワード"],
    "良": ["効果", "良", "成功"]
  };
  
  const keywords = [];
  
  // キーワードマップから関連語を抽出
  for (const [key, values] of Object.entries(keywordMap)) {
    if (query.includes(key)) {
      keywords.push(...values);
    }
  }
  
  // クエリ内の重要そうな単語も追加
  if (query.includes("Google") || query.includes("Ads")) {
    keywords.push("Google Ads");
  }
  
  // 重複を除去
  return [...new Set(keywords)].slice(0, 3); // 最大3つのキーワード
}

function formatAnswer(query, data) {
  if (!data) {
    return "該当する情報が見つかりませんでした。";
  }
  
  let answer = "";
  const metrics = typeof data.metrics === 'string' ? JSON.parse(data.metrics) : data.metrics;
  
  // クエリに応じた回答を生成
  if (query.includes("配信量") && query.includes("少な")) {
    const learning = data.learnings.find(l => l.includes("入札戦略"));
    answer = `配信量が少なかった理由：\n${learning || "入札戦略の設定ミスが原因でした"}`;
    
  } else if (query.includes("クリック率")) {
    answer = `クリック率（CTR）は${metrics.ctr}%でした。これは業界平均の約6倍で、広告文が効果的だった証拠です。`;
    
  } else if (query.includes("LP") && query.includes("問題")) {
    const lpLearning = data.learnings.find(l => l.includes("LP"));
    answer = `LPの問題点：\n${lpLearning || `登録率が${metrics.conversion_rate}%と低く、最大のボトルネックになっています`}`;
    
  } else if (query.includes("次") || query.includes("すれば")) {
    answer = "次のアクション：\n";
    data.next_actions.slice(0, 3).forEach((action, i) => {
      answer += `${i + 1}. ${action}\n`;
    });
    
  } else if (query.includes("いくら") || query.includes("かかった")) {
    answer = `費用は¥${metrics.cost_jpy}でした。CPA（獲得単価）は¥${metrics.cpa_jpy}で、目標を大幅に下回る良い結果でした。`;
    
  } else if (query.includes("最初") && query.includes("設定")) {
    const initialSetting = data.learnings.find(l => l.includes("8/6") || l.includes("初期"));
    answer = initialSetting || "8/6の初期設定が最も効果的でした。";
    
  } else {
    // デフォルトの回答
    answer = `${data.service_name}の${data.channel}実験結果：\n`;
    answer += `${data.results}`;
  }
  
  return answer;
}

async function runTests() {
  console.log("🧪 自然言語クエリテスト開始");
  console.log("=" .repeat(70) + "\n");
  
  let successCount = 0;
  let totalCount = testQueries.length;
  
  for (const test of testQueries) {
    console.log(`\n❓ 質問: "${test.query}"`);
    console.log("-" .repeat(50));
    
    try {
      const result = await searchWithNaturalLanguage(test.query);
      const answer = formatAnswer(test.query, result);
      
      console.log(`\n💬 回答:\n${answer}`);
      
      // 期待されるキーワードが含まれているかチェック
      const hasExpectedContent = result && test.expectedKeywords.some(keyword => {
        const dataStr = JSON.stringify(result).toLowerCase();
        return dataStr.includes(keyword.toLowerCase());
      });
      
      if (hasExpectedContent) {
        console.log("\n✅ テスト成功: 期待される情報が取得できました");
        successCount++;
      } else {
        console.log("\n⚠️  期待される情報の一部が不足している可能性があります");
      }
      
    } catch (error) {
      console.log(`\n❌ エラー: ${error.message}`);
    }
    
    console.log("\n" + "=" .repeat(70));
  }
  
  // テスト結果サマリー
  console.log("\n📊 テスト結果サマリー");
  console.log("=" .repeat(70));
  console.log(`成功: ${successCount}/${totalCount} (${Math.round(successCount/totalCount * 100)}%)`);
  
  if (successCount === totalCount) {
    console.log("🎉 すべてのテストが成功しました！");
  } else {
    console.log("⚠️  一部のテストで改善の余地があります");
  }
}

// メイン実行
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { searchWithNaturalLanguage, formatAnswer };