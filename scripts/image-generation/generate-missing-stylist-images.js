#!/usr/bin/env node

/**
 * AI Stylist LP用の不足画像を生成
 * ペルソナ: 環境意識の高い20代日本人女性
 * テーマ: サステナブルファッション、エシカル消費
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent';

// AI Stylist専用の不足画像プロンプト
const missingImages = [
  {
    filename: 'problem-3.jpg',
    title: '手持ち服を活かしきれない',
    prompt: `Create a lifestyle illustration showing a young Japanese woman in her 20s looking frustrated in front of an overflowing closet full of clothes but feeling like she has "nothing to wear". Show sustainable fashion elements like organic cotton, eco-friendly fabrics. Use soft green (#4ADE80) and warm yellow (#F59E0B) colors. Clean minimalist Japanese aesthetic, warm trustworthy mood. 400x400 pixels, no text overlay.`
  },
  {
    filename: 'problem-4.jpg', 
    title: '長期的なスタイル戦略がない',
    prompt: `Generate a clean illustration depicting the lack of long-term wardrobe strategy for sustainable fashion. Show a young Japanese woman surrounded by impulse purchases vs. a planned sustainable wardrobe. Use green (#4ADE80) and yellow (#F59E0B) color scheme. Modern flat design with Japanese aesthetic, professional and trustworthy mood. 400x400 pixels, no text.`
  },
  {
    filename: 'problem-5.jpg',
    title: 'エシカルブランドの情報不足', 
    prompt: `Create a modern illustration showing information gap about ethical fashion brands. Young Japanese woman looking confused while researching sustainable fashion brands online. Show elements of transparency, eco-labels, ethical certifications. Use sustainable color palette with green (#4ADE80) and yellow (#F59E0B). Clean Japanese design style, optimistic mood. 400x400 pixels, no text overlay.`
  },
  {
    filename: 'problem-6.jpg',
    title: '自分に似合うスタイルがわからない',
    prompt: `Design an illustration showing personal style confusion for sustainable fashion. Young Japanese woman trying different ethical fashion styles but looking uncertain. Show sustainable fashion elements, eco-friendly materials, personal style exploration. Use warm green (#4ADE80) and yellow (#F59E0B) colors. Modern Japanese lifestyle illustration, approachable mood. 400x400 pixels, no text.`
  },
  {
    filename: 'solution-3.jpg',
    title: '透明性の高いブランド情報',
    prompt: `Create a positive solution illustration showing transparent ethical brand information for sustainable fashion. Young Japanese woman confidently choosing eco-friendly brands with clear sustainability data. Show trust, transparency, environmental impact information. Use bright green (#4ADE80) and yellow (#F59E0B). Optimistic modern Japanese design, 500x400 pixels, no text overlay.`
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
    
    // リトライ処理
    if (retryCount < 2) {
      console.log(`   🔄 リトライします (${retryCount + 1}/2)`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      return generateImage(prompt, retryCount + 1);
    }
    
    return { success: false, error: '画像データが見つかりませんでした' };
    
  } catch (error) {
    console.error(`   ❌ API呼び出しエラー:`, error.message);
    
    if (retryCount < 2 && !error.message.includes('400')) {
      console.log(`   🔄 エラーリトライします (${retryCount + 1}/2)`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return generateImage(prompt, retryCount + 1);
    }
    
    return { success: false, error: error.message };
  }
}

async function generateMissingImages() {
  if (!API_KEY) {
    console.error('❌ GEMINI_API_KEYが設定されていません');
    process.exit(1);
  }

  const outputDir = 'products/2-validation/2025-08-005-ai-stylist/lp/public/images/generated';
  
  console.log('🎨 AI Stylist用不足画像の生成開始...');
  console.log('👥 ペルソナ: 環境意識の高い20代日本人女性');
  console.log('🌱 テーマ: サステナブルファッション、エシカル消費');
  console.log('🎨 ブランドカラー: グリーン(#4ADE80) & イエロー(#F59E0B)');
  console.log('='.repeat(60));

  let successCount = 0;
  
  for (const imageConfig of missingImages) {
    console.log(`\n🎯 ${imageConfig.title}の画像生成中...`);
    console.log(`   ファイル名: ${imageConfig.filename}`);
    
    const result = await generateImage(imageConfig.prompt);
    
    if (result.success && result.imageData) {
      const imageBuffer = Buffer.from(result.imageData, 'base64');
      const filepath = path.join(outputDir, imageConfig.filename);
      fs.writeFileSync(filepath, imageBuffer);
      
      console.log(`   ✅ 保存成功: ${filepath}`);
      console.log(`   📏 サイズ: ${(imageBuffer.length / 1024).toFixed(2)} KB`);
      
      successCount++;
    } else {
      console.error(`   ❌ 生成エラー: ${result.error}`);
    }
    
    // API制限回避のため5秒待機
    if (imageConfig !== missingImages[missingImages.length - 1]) {
      console.log('   ⏳ 次の画像生成まで5秒待機...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`🎉 不足画像生成完了！`);
  console.log(`📊 結果: ${successCount}/${missingImages.length} 画像生成成功`);
  
  if (successCount === missingImages.length) {
    console.log('✅ すべての不足画像が正常に生成されました！');
    console.log('🔄 ブラウザをリロードして確認してください');
  } else {
    console.log('⚠️  一部の画像生成に失敗しました');
  }
}

generateMissingImages().catch(console.error);