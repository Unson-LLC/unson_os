#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 生成画像をLPサービスに統合
 */
async function integrateGeneratedImages(serviceName) {
  const servicePath = path.join('services', serviceName);
  const generatedDir = path.join(servicePath, 'public/images/generated');
  const backupDir = path.join(servicePath, 'public/images/backup');
  const configPath = path.join(servicePath, 'configs/config.json');

  console.log(`🔄 ${serviceName}の画像統合を開始...`);

  // 設定ファイル読み込み
  if (!fs.existsSync(configPath)) {
    console.error('❌ 設定ファイルが見つかりません:', configPath);
    return false;
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  let updated = false;

  // 生成済み画像を確認
  if (fs.existsSync(generatedDir)) {
    const generatedImages = fs.readdirSync(generatedDir);
    console.log(`📷 生成済み画像: ${generatedImages.length}枚`);

    // config.jsonの画像パスを更新
    if (config.content?.hero?.backgroundImage && generatedImages.includes('hero-bridge.jpg')) {
      // 既存画像をバックアップ
      const originalPath = path.join(servicePath, 'public', config.content.hero.backgroundImage);
      if (fs.existsSync(originalPath)) {
        const backupPath = path.join(backupDir, 'original-hero-bridge.svg');
        fs.copyFileSync(originalPath, backupPath);
        console.log('💾 ヒーロー画像をバックアップ');
      }
      
      config.content.hero.backgroundImage = '/images/generated/hero-bridge.jpg';
      updated = true;
      console.log('✅ ヒーロー画像パス更新');
    }

    // 問題セクション画像更新
    if (config.content?.problem?.problems) {
      config.content.problem.problems.forEach((problem, index) => {
        const generatedFile = `problem-${index + 1}.jpg`;
        if (generatedImages.includes(generatedFile)) {
          problem.image = `/images/generated/${generatedFile}`;
          updated = true;
          console.log(`✅ 問題画像${index + 1}更新`);
        }
      });
    }

    // 設定ファイル保存
    if (updated) {
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      console.log('💾 設定ファイル更新完了');
    }
  }

  console.log(`🎉 ${serviceName}の画像統合完了!`);
  return true;
}

// コマンドライン実行
const serviceName = process.argv[2];
if (!serviceName) {
  console.error('❌ サービス名を指定してください');
  console.log('使用方法: node integrate-generated-images.js <service-name>');
  process.exit(1);
}

integrateGeneratedImages(serviceName).catch(console.error);
