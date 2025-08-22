#!/usr/bin/env tsx
// 統合テスト実行スクリプト

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runIntegrationTests() {
  console.log('🚀 LP検証システム統合テスト開始...\n');
  
  try {
    // 1. Convexスキーマ確認
    console.log('📋 1. Convexスキーマ確認...');
    const schemaCheck = await execAsync('npx convex dev --once');
    console.log('✅ Convexスキーマ確認完了\n');
    
    // 2. 統合テスト実行
    console.log('🧪 2. 統合テスト実行...');
    const testResult = await execAsync('npx vitest run tests/integration/lp-validation/automation-flow.test.ts');
    
    console.log('テスト結果:');
    console.log(testResult.stdout);
    
    if (testResult.stderr) {
      console.error('エラー出力:');
      console.error(testResult.stderr);
    }
    
    // 3. テスト結果解析
    console.log('\n📊 3. テスト結果解析...');
    const testOutput = testResult.stdout;
    const testPassed = testOutput.includes('passed');
    const testFailed = testOutput.includes('failed');
    
    if (testPassed && !testFailed) {
      console.log('✅ 全ての統合テストが成功しました！');
      displayTestSummary(testOutput);
    } else {
      console.log('❌ 一部のテストが失敗しました');
      displayFailureSummary(testOutput);
    }
    
  } catch (error: any) {
    console.error('❌ 統合テスト実行エラー:', error.message);
    
    if (error.stdout) {
      console.log('\n標準出力:');
      console.log(error.stdout);
    }
    
    if (error.stderr) {
      console.log('\nエラー出力:');
      console.log(error.stderr);
    }
    
    process.exit(1);
  }
}

function displayTestSummary(output: string) {
  console.log('\n🎯 テストサマリー:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // テスト数抽出
  const testCountMatch = output.match(/(\d+) passed/);
  if (testCountMatch) {
    console.log(`✅ 成功: ${testCountMatch[1]} テスト`);
  }
  
  // 実行時間抽出
  const durationMatch = output.match(/(\d+\.?\d*)(ms|s)/);
  if (durationMatch) {
    console.log(`⏱️  実行時間: ${durationMatch[0]}`);
  }
  
  console.log('\n🧪 検証済み機能:');
  console.log('  • エンドツーエンド自動最適化フロー');
  console.log('  • Google Ads API統合');
  console.log('  • LP改善提案生成');
  console.log('  • フェーズ移行判定');
  console.log('  • エラーハンドリング');
  console.log('  • パフォーマンス・負荷テスト');
  console.log('  • データ整合性テスト');
  
  console.log('\n🎉 統合テスト完了！次のタスクに進む準備ができました。');
}

function displayFailureSummary(output: string) {
  console.log('\n❌ 失敗詳細:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // 失敗したテスト抽出
  const failureLines = output.split('\n').filter(line => 
    line.includes('FAIL') || line.includes('Error:') || line.includes('Expected:')
  );
  
  failureLines.slice(0, 10).forEach(line => {
    console.log(`  ${line.trim()}`);
  });
  
  if (failureLines.length > 10) {
    console.log(`  ... その他 ${failureLines.length - 10} 件のエラー`);
  }
  
  console.log('\n🔧 推奨対応:');
  console.log('  1. Convex環境設定の確認');
  console.log('  2. 環境変数の設定確認');
  console.log('  3. 依存関係の再インストール');
  console.log('  4. 個別テストファイルでの詳細確認');
}

// メイン実行
if (require.main === module) {
  runIntegrationTests().catch(error => {
    console.error('統合テスト実行失敗:', error);
    process.exit(1);
  });
}