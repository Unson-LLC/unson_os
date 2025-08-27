#!/usr/bin/env node

// Gemini 2.5 Flash Image Preview テストスクリプト

async function testGeminiImageGeneration() {
  const API_KEY = process.env.GEMINI_API_KEY || 'test-key';
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent';
  
  const prompt = 'Create a professional business illustration showing AI technology and human collaboration. Modern, clean design with blue and purple corporate colors.';
  
  const requestBody = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 2048
    }
  };
  
  console.log('🎨 Gemini 2.5 Flash Image Preview テスト開始...');
  console.log('プロンプト:', prompt);
  
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log('レスポンスステータス:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('エラー詳細:', errorText);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ APIレスポンス受信');
    
    // レスポンス構造を確認
    console.log('レスポンス構造:', JSON.stringify(data, null, 2));
    
    // 画像データをチェック
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      for (const part of data.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.startsWith('image/')) {
          console.log('🎉 画像生成成功!');
          console.log('画像タイプ:', part.inlineData.mimeType);
          console.log('画像サイズ(Base64):', part.inlineData.data.length, 'characters');
          
          // 画像を保存
          const fs = require('fs');
          const imageBuffer = Buffer.from(part.inlineData.data, 'base64');
          const filename = 'gemini-2.5-test-image.png';
          fs.writeFileSync(filename, imageBuffer);
          console.log('💾 画像保存:', filename);
          
          return true;
        }
        
        if (part.text) {
          console.log('テキストレスポンス:', part.text);
        }
      }
    }
    
    console.log('❌ 画像データが見つかりませんでした');
    return false;
    
  } catch (error) {
    console.error('❌ テストエラー:', error.message);
    
    if (error.message.includes('400')) {
      console.log('💡 400エラーの原因:');
      console.log('- APIキーが無効');
      console.log('- リクエスト形式が不正');
      console.log('- モデルが画像生成に対応していない');
    }
    
    return false;
  }
}

// テスト実行
if (require.main === module) {
  testGeminiImageGeneration()
    .then(success => {
      if (success) {
        console.log('🎉 Gemini 2.5 Flash Image Preview テスト成功！');
      } else {
        console.log('❌ Gemini 2.5 Flash Image Preview テスト失敗');
      }
    })
    .catch(console.error);
}

module.exports = { testGeminiImageGeneration };