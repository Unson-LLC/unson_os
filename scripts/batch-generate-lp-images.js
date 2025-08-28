#!/usr/bin/env node

/**
 * 複数のLPサービスの画像を一括生成するバッチ処理スクリプト
 * Gemini 2.5 Flash Image Previewを使用
 */

const GeminiImageGenerator = require('./generate-lp-images-gemini');
const fs = require('fs');
const path = require('path');

async function batchGenerate() {
  const generator = new GeminiImageGenerator();
  
  // 処理対象サービス（優先度順）
  const services = [
    '2025-08-005-ai-stylist',
    '2025-08-003-ai-coach',
    '2025-08-004-ai-legacy-creator',
    '2025-08-002-ai-bridge',
    '2025-08-001-mywa',
    '2025-08-006-watashi-compass'
  ];

  console.log('🚀 バッチ画像生成開始');
  console.log(`📋 対象サービス数: ${services.length}`);
  console.log('='.repeat(60));

  const results = [];
  
  for (const serviceName of services) {
    console.log(`\n📦 サービス: ${serviceName}`);
    console.log('-'.repeat(40));
    
    try {
      const success = await generator.generateImagesForService(serviceName);
      
      if (success) {
        // 設定ファイルも自動更新
        await generator.updateConfigPaths(serviceName);
        results.push({ service: serviceName, status: 'success' });
      } else {
        results.push({ service: serviceName, status: 'partial' });
      }
      
      // API制限を考慮して待機
      console.log('\n⏳ 次のサービスまで5秒待機...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
    } catch (error) {
      console.error(`❌ ${serviceName}でエラー発生:`, error.message);
      results.push({ service: serviceName, status: 'error', error: error.message });
    }
  }

  // バッチ処理結果のサマリー
  console.log('\n' + '='.repeat(60));
  console.log('📊 バッチ処理完了サマリー');
  console.log('='.repeat(60));
  
  results.forEach(result => {
    const icon = result.status === 'success' ? '✅' : 
                 result.status === 'partial' ? '⚠️' : '❌';
    console.log(`${icon} ${result.service}: ${result.status}`);
    if (result.error) {
      console.log(`   エラー: ${result.error}`);
    }
  });

  const successCount = results.filter(r => r.status === 'success').length;
  const partialCount = results.filter(r => r.status === 'partial').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  console.log('\n統計:');
  console.log(`  成功: ${successCount}/${services.length}`);
  console.log(`  部分的成功: ${partialCount}/${services.length}`);
  console.log(`  エラー: ${errorCount}/${services.length}`);

  // 結果をJSONファイルに保存
  const summaryPath = path.join(process.cwd(), 'batch-generation-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalServices: services.length,
    successCount,
    partialCount,
    errorCount,
    results
  }, null, 2));

  console.log(`\n📄 バッチ処理サマリー保存: ${summaryPath}`);
}

// エラーハンドリング
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise拒否:', reason);
  process.exit(1);
});

// API キーチェック
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEYが設定されていません');
  console.log('\n設定方法:');
  console.log('export GEMINI_API_KEY="your-api-key"');
  process.exit(1);
}

// メイン実行
batchGenerate()
  .then(() => {
    console.log('\n🎉 全バッチ処理完了！');
  })
  .catch(error => {
    console.error('❌ バッチ処理エラー:', error);
    process.exit(1);
  });