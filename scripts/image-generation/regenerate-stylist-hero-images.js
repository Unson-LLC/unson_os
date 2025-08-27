#!/usr/bin/env node

/**
 * AI Stylist LP用のヒーロー・主要画像をブランドに合わせて再生成
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent';

const brandAlignedImages = [
  {
    filename: 'hero-bg.jpg',
    title: 'ヒーロー背景',
    prompt: `Create a beautiful hero background image for a sustainable fashion AI stylist service. Show a modern Japanese woman in her 20s confidently choosing eco-friendly clothes in a minimalist, sustainable wardrobe. Emphasize natural materials, organic cotton, ethical fashion. Use soft green (#4ADE80) and warm yellow (#F59E0B) brand colors. Clean Japanese lifestyle aesthetic, warm and trustworthy mood. 1200x600 pixels, no text overlay. Modern flat design with natural lighting.`
  },
  {
    filename: 'problem-1.jpg',
    title: '衝動買いして後悔してしまう',
    prompt: `Create a lifestyle illustration showing a young Japanese woman surrounded by impulsive fashion purchases she regrets. Show fast fashion items vs sustainable alternatives. Convey the frustration of buying clothes that don't align with values. Use sustainable color palette green (#4ADE80) and yellow (#F59E0B). Japanese minimalist design style, relatable mood. 400x400 pixels, no text overlay.`
  },
  {
    filename: 'problem-2.jpg', 
    title: 'おしゃれと価値観が両立できない',
    prompt: `Generate an illustration depicting the conflict between fashion desires and environmental values. Young Japanese woman torn between trendy fast fashion and limited ethical fashion options. Show sustainable fashion elements, eco-friendly materials, ethical choices. Use green (#4ADE80) and yellow (#F59E0B) colors. Modern Japanese aesthetic, thoughtful mood. 400x400 pixels, no text.`
  },
  {
    filename: 'solution-1.jpg',
    title: '価値観×スタイルの完璧な融合', 
    prompt: `Create a positive solution illustration showing the perfect fusion of personal values and style through AI analysis. Young Japanese woman confidently wearing sustainable fashion that reflects her values. Show AI technology helping with ethical fashion choices. Use bright green (#4ADE80) and yellow (#F59E0B). Optimistic Japanese design, 500x400 pixels, no text overlay.`
  },
  {
    filename: 'solution-2.jpg',
    title: '科学的ワードローブ最適化',
    prompt: `Design an illustration showing scientific wardrobe optimization for sustainable fashion. AI analyzing clothing efficiency, outfit combinations, sustainable materials. Young Japanese woman with an optimized eco-friendly wardrobe. Use green (#4ADE80) and yellow (#F59E0B) colors. Tech-forward Japanese design style, efficient mood. 500x400 pixels, no text.`
  }
];

async function generateImage(prompt, retryCount = 0) {
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
    
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log(`   📨 レスポンス受信: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // 画像データを探す
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
    console.error(`   ❌ API呼び出しエラー:`, error.message);
    return { success: false, error: error.message };
  }
}

async function regenerateBrandImages() {
  if (!API_KEY) {
    console.error('❌ GEMINI_API_KEYが設定されていません');
    process.exit(1);
  }

  const outputDir = 'products/2-validation/2025-08-005-ai-stylist/lp/public/images/generated';
  const backupDir = 'products/2-validation/2025-08-005-ai-stylist/lp/public/images/backup';
  
  // バックアップディレクトリ作成
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  console.log('🎨 AI Stylist主要画像のブランド統一再生成...');
  console.log('👥 ターゲット: 環境意識の高い20代日本人女性');
  console.log('🌱 コンセプト: サステナブルファッション、価値観とスタイルの両立');
  console.log('🎨 ブランドカラー: グリーン(#4ADE80) & イエロー(#F59E0B)');
  console.log('='.repeat(60));

  let successCount = 0;
  
  for (const imageConfig of brandAlignedImages) {
    console.log(`\n🎯 ${imageConfig.title}の再生成中...`);
    console.log(`   ファイル名: ${imageConfig.filename}`);
    
    // 既存ファイルをバックアップ
    const existingPath = path.join(outputDir, imageConfig.filename);
    if (fs.existsSync(existingPath)) {
      const backupPath = path.join(backupDir, `${Date.now()}-${imageConfig.filename}`);
      fs.copyFileSync(existingPath, backupPath);
      console.log(`   💾 既存画像をバックアップ`);
    }
    
    const result = await generateImage(imageConfig.prompt);
    
    if (result.success && result.imageData) {
      const imageBuffer = Buffer.from(result.imageData, 'base64');
      fs.writeFileSync(existingPath, imageBuffer);
      
      console.log(`   ✅ ブランド統一画像で更新完了`);
      console.log(`   📏 サイズ: ${(imageBuffer.length / 1024).toFixed(2)} KB`);
      
      successCount++;
    } else {
      console.error(`   ❌ 生成エラー: ${result.error}`);
    }
    
    // API制限回避のため5秒待機
    if (imageConfig !== brandAlignedImages[brandAlignedImages.length - 1]) {
      console.log('   ⏳ 次の画像生成まで5秒待機...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`🎉 ブランド統一画像再生成完了！`);
  console.log(`📊 結果: ${successCount}/${brandAlignedImages.length} 画像更新成功`);
  
  if (successCount === brandAlignedImages.length) {
    console.log('✅ すべての主要画像がブランドに統一されました！');
    console.log('🔄 ブラウザをリロードして確認してください');
  }
}

regenerateBrandImages().catch(console.error);