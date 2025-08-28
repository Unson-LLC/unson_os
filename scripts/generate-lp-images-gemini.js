#!/usr/bin/env node

/**
 * Gemini 2.5 Flash Image Preview を使用したLP画像自動生成スクリプト
 * 各LPサービスの画像を自動生成し、既存の画像を置き換えます
 */

const fs = require('fs');
const path = require('path');

class GeminiImageGenerator {
  constructor() {
    this.API_KEY = process.env.GEMINI_API_KEY;
    this.API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent';
  }

  /**
   * サービステーマの定義
   */
  getServiceThemes() {
    return {
      'ai-bridge': {
        name: 'AIブリッジ',
        description: '世代間のAI知識ギャップを埋める',
        color: 'ブルーとパープル'
      },
      'ai-stylist': {
        name: 'AIスタイリスト',
        description: 'サステナブルファッションとパーソナルスタイリング',
        color: 'グリーンとピンク'
      },
      'ai-legacy-creator': {
        name: 'AIレガシークリエイター',
        description: 'デジタル遺産と知識継承',
        color: 'ゴールドとネイビー'
      },
      'ai-coach': {
        name: 'AIコーチ',
        description: '母親向けライフコーチング',
        color: 'オレンジとティール'
      },
      'mywa': {
        name: 'MYWA',
        description: 'パーソナライズドニュースキュレーション',
        color: 'レッドとグレー'
      },
      'watashi-compass': {
        name: 'ワタシコンパス',
        description: 'キャリア開発と自己発見',
        color: 'インディゴとイエロー'
      }
    };
  }

  /**
   * 画像プロンプトテンプレート
   */
  getImagePrompts(serviceName) {
    const theme = this.getServiceThemes()[serviceName] || {
      name: serviceName,
      description: 'AIビジネスソリューション',
      color: 'ブルーとグレー'
    };

    return [
      {
        type: 'hero',
        filename: 'hero-bg.jpg',
        prompt: `Create a professional hero background image for ${theme.name}. Modern business illustration showing ${theme.description}. Use ${theme.color} color scheme. Clean corporate design, high quality, 1200x600 pixels. No text overlay.`,
        priority: 'high'
      },
      {
        type: 'problem-1',
        filename: 'problem-1.jpg',
        prompt: `Generate a minimalist business illustration representing a problem that ${theme.name} solves. Show business challenges visually. Use ${theme.color} colors. Simple icon-style design, 400x400 pixels, professional corporate look.`,
        priority: 'medium'
      },
      {
        type: 'problem-2',
        filename: 'problem-2.jpg',
        prompt: `Create a professional diagram showing a second challenge related to ${theme.description}. Business context illustration with ${theme.color} accents. Clean design, 400x400 pixels, corporate style.`,
        priority: 'medium'
      },
      {
        type: 'solution-1',
        filename: 'solution-1.jpg',
        prompt: `Design a positive business image showing ${theme.name} solution. Illustrate AI technology and human collaboration. Use ${theme.color} to express hope and innovation. Optimistic tone, 500x400 pixels, modern corporate design.`,
        priority: 'high'
      },
      {
        type: 'solution-2',
        filename: 'solution-2.jpg',
        prompt: `Create a professional business visualization showing results of ${theme.description}. Data-driven success illustration with ${theme.color} gradient. Corporate design, 500x400 pixels, trustworthy appearance.`,
        priority: 'medium'
      },
      {
        type: 'feature-1',
        filename: 'feature-1.jpg',
        prompt: `Generate a simple icon-style image representing key features of ${theme.name}. Intuitive flat design with ${theme.color}. Clear functionality communication, 400x400 pixels, professional business style.`,
        priority: 'low'
      },
      {
        type: 'cta',
        filename: 'cta-bg.jpg',
        prompt: `Create a call-to-action background image showing success and growth for ${theme.name}. Gradient background with ${theme.color}. Energetic and attractive design, 600x400 pixels, motivational business style.`,
        priority: 'low'
      }
    ];
  }

  /**
   * Gemini APIで画像生成
   */
  async generateImage(prompt, retryCount = 0) {
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 4096
      }
    };

    try {
      console.log(`   📡 APIリクエスト送信中... (試行 ${retryCount + 1}/3)`);
      
      const response = await fetch(`${this.API_URL}?key=${this.API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log(`   📨 レスポンス受信: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.log(`   ⚠️  エラーレスポンス:`, errorText.substring(0, 500));
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`   🔍 レスポンス構造解析中...`);
      
      // デバッグ用: レスポンス構造をログ出力
      if (data.candidates && data.candidates[0]) {
        const candidate = data.candidates[0];
        console.log(`   📋 Candidate finishReason: ${candidate.finishReason}`);
        
        if (candidate.content && candidate.content.parts) {
          console.log(`   📦 Parts数: ${candidate.content.parts.length}`);
          
          candidate.content.parts.forEach((part, index) => {
            if (part.text) {
              console.log(`   📝 Part ${index}: テキスト (${part.text.length}文字)`);
            } else if (part.inlineData) {
              console.log(`   🖼️  Part ${index}: 画像データ (${part.inlineData.mimeType})`);
            } else {
              console.log(`   ❓ Part ${index}: 不明なタイプ`, Object.keys(part));
            }
          });
        }
      }
      
      // 画像データを探す
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        for (const part of data.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.startsWith('image/')) {
            console.log(`   ✅ 画像データ発見: ${part.inlineData.mimeType}`);
            return {
              success: true,
              imageData: part.inlineData.data,
              mimeType: part.inlineData.mimeType
            };
          }
        }
      }
      
      // 画像データが見つからない場合、テキストレスポンスを確認
      let textResponse = '';
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        textResponse = data.candidates[0].content.parts
          .filter(part => part.text)
          .map(part => part.text)
          .join(' ');
      }
      
      console.log(`   ⚠️  画像データなし。テキストレスポンス: ${textResponse.substring(0, 200)}...`);
      
      // リトライ処理
      if (retryCount < 2) {
        console.log(`   🔄 リトライします (${retryCount + 1}/2)`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        return this.generateImage(prompt, retryCount + 1);
      }
      
      return { 
        success: false, 
        error: '画像データが見つかりませんでした',
        textResponse,
        fullResponse: data
      };
      
    } catch (error) {
      console.error(`   ❌ API呼び出しエラー:`, error.message);
      
      // リトライ処理
      if (retryCount < 2 && !error.message.includes('400')) {
        console.log(`   🔄 エラーリトライします (${retryCount + 1}/2)`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        return this.generateImage(prompt, retryCount + 1);
      }
      
      return { success: false, error: error.message };
    }
  }

  /**
   * サービスのパスを取得
   */
  getServicePath(serviceName) {
    // プロダクトディレクトリ構造に対応
    const paths = [
      path.join('products/2-validation', serviceName, 'lp'),
      path.join('products/4-active', serviceName, 'lp'),
      path.join('services', serviceName),
      path.join('apps/lps', serviceName)
    ];

    for (const p of paths) {
      if (fs.existsSync(p)) {
        return p;
      }
    }

    return null;
  }

  /**
   * メイン処理
   */
  async generateImagesForService(serviceName) {
    if (!this.API_KEY) {
      console.error('❌ GEMINI_API_KEYが設定されていません');
      console.log('環境変数にGEMINI_API_KEYを設定してください');
      return false;
    }

    const servicePath = this.getServicePath(serviceName);
    
    if (!servicePath) {
      console.error(`❌ サービスディレクトリが見つかりません: ${serviceName}`);
      console.log('利用可能なサービス:');
      Object.keys(this.getServiceThemes()).forEach(name => {
        console.log(`  - ${name}`);
      });
      return false;
    }

    console.log(`📍 サービスパス: ${servicePath}`);

    // 画像保存ディレクトリ作成
    const imagesDir = path.join(servicePath, 'public/images/generated');
    const backupDir = path.join(servicePath, 'public/images/backup');
    
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    console.log(`\n🎨 ${serviceName}の画像生成を開始します...`);
    console.log(`📁 保存先: ${imagesDir}`);

    const prompts = this.getImagePrompts(serviceName);
    const results = [];
    let successCount = 0;
    let errorCount = 0;

    // 優先度順にソート
    prompts.sort((a, b) => {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    for (const promptConfig of prompts) {
      console.log(`\n🎯 ${promptConfig.type}画像を生成中...`);
      console.log(`   優先度: ${promptConfig.priority}`);
      
      const result = await this.generateImage(promptConfig.prompt);
      
      if (result.success && result.imageData) {
        // 既存画像のバックアップ
        const existingPath = path.join(servicePath, 'public/images', promptConfig.filename);
        if (fs.existsSync(existingPath)) {
          const backupPath = path.join(backupDir, `${Date.now()}-${promptConfig.filename}`);
          fs.copyFileSync(existingPath, backupPath);
          console.log(`   💾 既存画像をバックアップ: ${backupPath}`);
        }
        
        // 新しい画像を保存
        const imageBuffer = Buffer.from(result.imageData, 'base64');
        const filepath = path.join(imagesDir, promptConfig.filename);
        fs.writeFileSync(filepath, imageBuffer);
        
        console.log(`   ✅ 画像保存成功: ${filepath}`);
        console.log(`   📏 サイズ: ${(imageBuffer.length / 1024).toFixed(2)} KB`);
        
        results.push({
          type: promptConfig.type,
          filename: promptConfig.filename,
          path: filepath,
          success: true,
          size: imageBuffer.length
        });
        
        successCount++;
        
        // API制限を考慮してより長く待機
        console.log('   ⏳ 次の画像生成まで5秒待機...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
      } else {
        console.error(`   ❌ 生成エラー: ${result.error}`);
        results.push({
          type: promptConfig.type,
          filename: promptConfig.filename,
          success: false,
          error: result.error
        });
        errorCount++;
      }
    }

    // 結果サマリーを保存
    const summaryPath = path.join(servicePath, 'image-generation-summary.json');
    const summary = {
      service: serviceName,
      timestamp: new Date().toISOString(),
      totalImages: prompts.length,
      successCount,
      errorCount,
      results
    };
    
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    
    console.log('\n' + '='.repeat(60));
    console.log(`🎉 画像生成プロセス完了！`);
    console.log(`📊 結果: 成功 ${successCount}/${prompts.length} 画像`);
    console.log(`📄 サマリー保存: ${summaryPath}`);
    
    if (successCount > 0) {
      console.log(`\n✨ 次のステップ:`);
      console.log(`1. 生成された画像を確認: ${imagesDir}`);
      console.log(`2. config.jsonの画像パスを更新`);
      console.log(`3. ローカル環境でテスト: npm run dev`);
    }
    
    return successCount > 0;
  }

  /**
   * 設定ファイルの画像パスを更新
   */
  async updateConfigPaths(serviceName) {
    const servicePath = this.getServicePath(serviceName);
    if (!servicePath) return false;

    const configPath = path.join(servicePath, 'configs/config.json');
    if (!fs.existsSync(configPath)) {
      configPath = path.join(servicePath, 'config.json');
    }

    if (!fs.existsSync(configPath)) {
      console.log('⚠️  設定ファイルが見つかりません');
      return false;
    }

    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      
      // ヒーロー画像パスを更新
      if (config.content?.hero) {
        config.content.hero.backgroundImage = '/images/generated/hero-bg.jpg';
      }

      // 問題セクション画像を更新
      if (config.content?.problem?.problems) {
        config.content.problem.problems.forEach((problem, index) => {
          problem.image = `/images/generated/problem-${index + 1}.jpg`;
        });
      }

      // ソリューション画像を更新
      if (config.content?.solution?.solutions) {
        config.content.solution.solutions.forEach((solution, index) => {
          solution.image = `/images/generated/solution-${index + 1}.jpg`;
        });
      }

      // 機能画像を更新
      if (config.content?.features) {
        config.content.features.forEach((feature, index) => {
          feature.icon = `/images/generated/feature-${index + 1}.jpg`;
        });
      }

      // CTAセクション背景を更新
      if (config.content?.cta) {
        config.content.cta.backgroundImage = '/images/generated/cta-bg.jpg';
      }

      // 設定ファイルを保存
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      console.log(`✅ 設定ファイル更新完了: ${configPath}`);
      
      return true;
      
    } catch (error) {
      console.error('❌ 設定ファイル更新エラー:', error.message);
      return false;
    }
  }
}

// コマンドライン実行
async function main() {
  const generator = new GeminiImageGenerator();
  const serviceName = process.argv[2];
  const updateConfig = process.argv.includes('--update-config');
  
  if (!serviceName) {
    console.error('❌ エラー: サービス名を指定してください');
    console.log('\n使用方法:');
    console.log('  node scripts/generate-lp-images-gemini.js <service-name> [--update-config]');
    console.log('\n例:');
    console.log('  node scripts/generate-lp-images-gemini.js 2025-08-005-ai-stylist');
    console.log('  node scripts/generate-lp-images-gemini.js 2025-08-003-ai-coach --update-config');
    console.log('\n利用可能なサービス:');
    Object.entries(generator.getServiceThemes()).forEach(([key, value]) => {
      console.log(`  - ${key}: ${value.name}`);
    });
    process.exit(1);
  }

  try {
    const success = await generator.generateImagesForService(serviceName);
    
    if (success && updateConfig) {
      console.log('\n📝 設定ファイルを更新中...');
      await generator.updateConfigPaths(serviceName);
    }
    
    if (success) {
      console.log('\n✅ 全ての処理が完了しました！');
    } else {
      console.log('\n⚠️  一部エラーが発生しました');
    }
    
  } catch (error) {
    console.error('❌ 処理エラー:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = GeminiImageGenerator;