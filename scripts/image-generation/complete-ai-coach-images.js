#!/usr/bin/env node

/**
 * AI Coach LPの残りの画像を完成させる
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent';

// 残りの画像
const remainingImages = [
  {
    filename: 'solution-3.jpg',
    title: 'ゆるいコミュニティ',
    prompt: `Create a warm community image for mature women. Show elegant Japanese women aged 45-55 connecting gently, sharing experiences, supporting each other in a comfortable, non-pressured way. Natural lighting, peaceful community mood, warm interactions. Use purple (#E879F9) and pink (#FB7185). Lifestyle photography style, 500x400 pixels, no text overlay.`
  },
  {
    filename: 'feature-1.jpg',
    title: 'パーソナル自己分析',
    prompt: `Generate a sophisticated image representing personal analysis for mature women. Elegant Japanese woman aged 45-50 engaged in thoughtful self-reflection, perhaps journaling or in contemplation. Show the process of understanding oneself. Warm interior lighting, introspective mood. Purple (#E879F9) and pink (#FB7185) accents. 400x400 pixels, no text.`
  },
  {
    filename: 'cta-bg.jpg',
    title: 'CTA背景',
    prompt: `Create an inspiring call-to-action background image for mature women's life coaching. Show transformation and empowerment - elegant Japanese woman aged 45-50 confidently embracing new possibilities, perhaps in a beautiful garden or elegant interior. Golden hour lighting, inspiring and motivational mood. Use purple (#E879F9) and pink (#FB7185) gradient. 600x400 pixels, no text overlay.`
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

async function completeCoachImages() {
  if (!API_KEY) {
    console.error('❌ GEMINI_API_KEYが設定されていません');
    process.exit(1);
  }

  const outputDir = 'products/2-validation/2025-08-003-ai-coach/lp/public/images/generated';
  
  console.log('🎨 AI Coach残り画像の完成...');
  console.log('='.repeat(40));

  let successCount = 0;
  
  for (const imageConfig of remainingImages) {
    console.log(`\n🎯 ${imageConfig.title}の生成中...`);
    
    const result = await generateImage(imageConfig.prompt);
    
    if (result.success && result.imageData) {
      const imageBuffer = Buffer.from(result.imageData, 'base64');
      const outputPath = path.join(outputDir, imageConfig.filename);
      fs.writeFileSync(outputPath, imageBuffer);
      
      console.log(`   ✅ 完成: ${imageConfig.filename}`);
      console.log(`   📏 ${(imageBuffer.length / 1024).toFixed(2)} KB`);
      
      successCount++;
    } else {
      console.error(`   ❌ エラー: ${result.error}`);
    }
    
    // 待機
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log('\n' + '='.repeat(40));
  console.log(`🎉 完了: ${successCount}/${remainingImages.length} 成功`);
}

completeCoachImages().catch(console.error);