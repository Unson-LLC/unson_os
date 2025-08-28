#!/usr/bin/env node

/**
 * 残り3つのLPのconfig.jsonを生成画像パスに更新
 */

const fs = require('fs');
const path = require('path');

const LP_CONFIGS = [
  {
    name: 'AI Bridge',
    configPath: 'products/2-validation/2025-08-002-ai-bridge/lp/configs/config.json'
  },
  {
    name: 'AI Legacy Creator', 
    configPath: 'products/2-validation/2025-08-004-ai-legacy-creator/lp/configs/config.json'
  },
  {
    name: 'MyWA',
    configPath: 'products/4-active/2025-08-001-mywa/lp/configs/config.json'
  }
];

function updateConfigPaths(config) {
  // Hero background
  if (config.content?.hero?.backgroundImage) {
    if (config.content.hero.backgroundImage.includes('/images/hero-') || config.content.hero.backgroundImage.includes('/images/generated/hero-')) {
      config.content.hero.backgroundImage = '/images/generated/hero-bg.jpg';
    }
  }

  // Problems
  if (config.content?.problem?.problems) {
    config.content.problem.problems.forEach((problem, index) => {
      if (problem.image && (problem.image.includes('/images/problem-') || problem.image.includes('/images/generated/problem-'))) {
        problem.image = `/images/generated/problem-${index + 1}.jpg`;
      }
    });
  }

  // Solutions (if have image field)
  if (config.content?.solution?.solutions) {
    config.content.solution.solutions.forEach((solution, index) => {
      if (solution.image && (solution.image.includes('/images/solution-') || solution.image.includes('/images/generated/solution-'))) {
        solution.image = `/images/generated/solution-${index + 1}.jpg`;
      }
    });
  }

  // Services/Features
  if (config.content?.service?.services) {
    config.content.service.services.forEach((service, index) => {
      if (service.image && service.image.includes('/images/')) {
        service.image = `/images/generated/feature-${index + 1}.jpg`;
      }
    });
  }

  return config;
}

function updateLPConfig(configInfo) {
  try {
    console.log(`🔧 ${configInfo.name} - config.json更新中...`);
    
    const configPath = configInfo.configPath;
    
    if (!fs.existsSync(configPath)) {
      console.log(`   ⚠️  設定ファイルが見つかりません: ${configPath}`);
      return false;
    }

    // 現在の設定を読み込み
    const configData = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configData);
    
    // 画像パスを更新
    const updatedConfig = updateConfigPaths(config);
    
    // 設定を保存
    fs.writeFileSync(configPath, JSON.stringify(updatedConfig, null, 2));
    
    console.log(`   ✅ 完了: 画像パスを/images/generated/に更新`);
    return true;
    
  } catch (error) {
    console.error(`   ❌ ${configInfo.name}の更新でエラー: ${error.message}`);
    return false;
  }
}

function updateAllConfigs() {
  console.log('📝 LP設定ファイル一括更新開始');
  console.log('='.repeat(40));
  
  let successCount = 0;
  
  for (const configInfo of LP_CONFIGS) {
    if (updateLPConfig(configInfo)) {
      successCount++;
    }
  }
  
  console.log('\n' + '='.repeat(40));
  console.log(`🎉 設定更新完了: ${successCount}/${LP_CONFIGS.length} 成功`);
  
  if (successCount === LP_CONFIGS.length) {
    console.log('🏆 全LPの画像統合が完了しました！');
  }
}

updateAllConfigs();