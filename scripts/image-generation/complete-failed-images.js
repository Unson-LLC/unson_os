#!/usr/bin/env node

/**
 * 失敗した画像の個別再生成
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent';

// 失敗した画像の再生成
const FAILED_IMAGES = [
  {
    lp: 'AI Bridge',
    path: 'products/2-validation/2025-08-002-ai-bridge/lp/public/images/generated',
    filename: 'problem-3.jpg',
    prompt: 'Create an image representing workplace generation conflict. Show 40-50 year old Japanese business professional manager dealing with team conflict between different generations, modern business photography with clean graphics, concerned worried mood, using Blue (#2563EB) and Purple (#7C3AED) color scheme, 400x400 pixels, no text overlay.'
  },
  {
    lp: 'AI Bridge',
    path: 'products/2-validation/2025-08-002-ai-bridge/lp/public/images/generated',
    filename: 'solution-3.jpg',
    prompt: 'Create an inspiring solution image: multi-generation team diversity utilization. Show 40-50 year old Japanese business professional manager successfully leading diverse team, modern business photography with clean graphics, professional confident innovative trustworthy mood, using Blue (#2563EB) and Purple (#7C3AED) color scheme, 500x400 pixels, no text overlay.'
  },
  {
    lp: 'AI Legacy Creator',
    path: 'products/2-validation/2025-08-004-ai-legacy-creator/lp/public/images/generated',
    filename: 'problem-4.jpg',
    prompt: 'Create an image representing post-retirement contribution anxiety. Show mature accomplished Japanese man aged 50-60 concerned about future social contribution, classic refined photography with warm tones, concerned worried mood, using Deep Blue (#1E40AF) and Purple (#7C3AED) color scheme, 400x400 pixels, no text overlay.'
  },
  {
    lp: 'AI Legacy Creator',
    path: 'products/2-validation/2025-08-004-ai-legacy-creator/lp/public/images/generated',
    filename: 'solution-3.jpg',
    prompt: 'Create an inspiring solution image: next-generation mentoring matching system. Show mature accomplished Japanese man aged 50-60 successfully mentoring younger professionals, classic refined photography with warm tones, dignified wise accomplished legacy-focused mood, using Deep Blue (#1E40AF) and Purple (#7C3AED) color scheme, 500x400 pixels, no text overlay.'
  },
  {
    lp: 'MyWA',
    path: 'products/4-active/2025-08-001-mywa/lp/public/images/generated',
    filename: 'hero-bg.jpg',
    prompt: 'Create a professional hero background representing AI technology efficiency transparency innovation. Show tech-savvy business professionals aged 25-45 in confident engaging pose, modern digital illustration with tech elements, innovative trustworthy efficient tech-forward mood, using Tech Blue (#3B82F6) and Purple (#8B5CF6) color scheme, 1200x600 pixels, no text overlay.'
  }
];

async function generateImage(prompt) {
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
    console.log(`   📡 APIリクエスト送信中...`);
    
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      for (const part of data.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.startsWith('image/')) {
          return {
            success: true,
            imageData: part.inlineData.data,
            mimeType: part.inlineData.mimeType
          };
        }
      }
    }
    
    return { success: false, error: '画像データが見つかりませんでした' };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function completeFailedImages() {
  if (!API_KEY) {
    console.error('❌ GEMINI_API_KEYが設定されていません');
    process.exit(1);
  }

  console.log('🔄 失敗画像の個別再生成開始');
  console.log('='.repeat(50));
  
  let successCount = 0;
  
  for (const imageConfig of FAILED_IMAGES) {
    console.log(`\n🎯 ${imageConfig.lp} - ${imageConfig.filename} 再生成中...`);
    
    // リトライ機能付き生成
    let success = false;
    for (let attempt = 1; attempt <= 3 && !success; attempt++) {
      console.log(`   試行 ${attempt}/3...`);
      
      const result = await generateImage(imageConfig.prompt);
      
      if (result.success && result.imageData) {
        const imageBuffer = Buffer.from(result.imageData, 'base64');
        const outputPath = path.join(imageConfig.path, imageConfig.filename);
        
        // ディレクトリ確認・作成
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(outputPath, imageBuffer);
        
        console.log(`   ✅ 成功: ${imageConfig.filename}`);
        console.log(`   📏 ${(imageBuffer.length / 1024).toFixed(2)} KB`);
        
        successCount++;
        success = true;
      } else {
        console.error(`   ❌ 試行${attempt}失敗: ${result.error}`);
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 5000)); // 長めの待機
        }
      }
    }
    
    if (!success) {
      console.error(`   💥 ${imageConfig.filename} - 3回試行後も失敗`);
    }
    
    // 待機（API制限対応）
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log('\n' + '='.repeat(50));
  console.log(`🎉 失敗画像再生成完了: ${successCount}/${FAILED_IMAGES.length} 成功`);
  
  if (successCount === FAILED_IMAGES.length) {
    console.log('🏆 全画像生成完了！すべてのLPでブランド統一画像が完成しました');
  }
}

completeFailedImages().catch(console.error);