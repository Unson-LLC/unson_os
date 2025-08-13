#!/usr/bin/env node

/**
 * 自然言語クエリのデモンストレーション
 */

const { searchWithNaturalLanguage, formatAnswer } = require('./test-natural-language-query');

const demoQueries = [
  "なぜGoogle Adsの配信量が少なかったの？",
  "広告のクリック率は良かった？",
  "LPをどう改善すればいい？",
  "最初の1週間でいくらかかった？",
  "何人獲得できた？"
];

async function runDemo() {
  console.log('🎯 UnsonOS ナレッジベース - 自然言語クエリデモ');
  console.log('=' .repeat(70));
  console.log('DBに保存された広告運用ノウハウを自然な日本語で検索します\n');
  
  for (const query of demoQueries) {
    console.log(`\n🗣️  質問: "${query}"`);
    console.log('-' .repeat(50));
    
    try {
      const result = await searchWithNaturalLanguage(query);
      const answer = formatAnswer(query, result);
      
      console.log(`\n💡 回答:\n${answer}`);
      
      // デバッグ情報
      if (process.env.DEBUG) {
        console.log('\n📊 取得データ:');
        console.log(`サービス: ${result?.service_name}`);
        console.log(`チャネル: ${result?.channel}`);
      }
      
    } catch (error) {
      console.log(`❌ エラー: ${error.message}`);
    }
    
    console.log('\n' + '=' .repeat(70));
  }
  
  console.log('\n✨ デモ完了！');
  console.log('\n💡 ポイント:');
  console.log('  1. 日本語の自然な質問を理解');
  console.log('  2. DBから関連情報を検索');
  console.log('  3. 質問に応じた適切な回答を生成');
  console.log('\n📚 今後の拡張:');
  console.log('  - OpenAI埋め込みによる意味検索');
  console.log('  - 複数の実験結果の比較');
  console.log('  - 成功パターンの自動抽出');
}

// メイン実行
runDemo().catch(console.error);