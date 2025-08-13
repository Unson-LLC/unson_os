#!/usr/bin/env node

/**
 * インタラクティブな自然言語チャット
 * 日本語で質問すると、DBから適切な情報を取得して回答
 */

const readline = require('readline');
const { searchWithNaturalLanguage, formatAnswer } = require('./test-natural-language-query');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '\n💭 質問> '
});

console.log('🤖 UnsonOS ナレッジベースチャット');
console.log('=' .repeat(50));
console.log('広告運用について自然な日本語で質問してください。');
console.log('（終了: exit または quit）\n');

console.log('📝 質問例:');
console.log('  - なぜ配信量が少なかった？');
console.log('  - クリック率はどうだった？');
console.log('  - LPの改善点は？');
console.log('  - いくらかかった？');

rl.prompt();

rl.on('line', async (line) => {
  const input = line.trim();
  
  if (input === 'exit' || input === 'quit' || input === '終了') {
    console.log('\n👋 さようなら！');
    process.exit(0);
  }
  
  if (!input) {
    rl.prompt();
    return;
  }
  
  console.log('\n🔍 検索中...\n');
  
  try {
    const result = await searchWithNaturalLanguage(input);
    const answer = formatAnswer(input, result);
    
    console.log('💬 回答:');
    console.log('-' .repeat(50));
    console.log(answer);
    
    if (result && result.learnings && input.includes('詳細')) {
      console.log('\n📚 関連する学び:');
      result.learnings.forEach((learning, i) => {
        console.log(`  ${i + 1}. ${learning}`);
      });
    }
    
  } catch (error) {
    console.log(`❌ エラー: ${error.message}`);
  }
  
  rl.prompt();
});

rl.on('close', () => {
  console.log('\n👋 さようなら！');
  process.exit(0);
});