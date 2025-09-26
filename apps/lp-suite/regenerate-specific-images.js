const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent';

// Nano Banana（Gemini 2.5）専用の一貫性確保プロンプト
function createConsistencyPrompt(config) {
  return `【CONSISTENT CHARACTER DESIGN - 同一キャラクター設計】
STRICT PHOTOGRAPHY STYLE: Professional corporate photography, photorealistic business photos ONLY
絶対禁止: アニメ・イラスト・漫画・CG・カートゥーン・デフォルメスタイル・ホラー・暗い雰囲気

【FIXED CHARACTER SPECIFICATION - 固定キャラクター仕様】
Same person throughout all images / 全画像で同一人物:
- Age: 35歳の日本人男性ビジネスマン
- Face: 四角い顎ライン、親しみやすい表情、現実的な日本人の顔立ち
- Hair: 短髪、黒髪、ビジネス向けの整った髪型
- Build: 標準的な体型、175cm程度
- Clothing: ネイビーブルーのビジネスジャケット、白いドレスシャツ、ダークグレーのスラックス
- Eyes: 茶色い瞳、誠実な眼差し
※Consistent character across all panels / 全パネルでキャラクター一貫性維持

【PHOTOGRAPHY SETTINGS - 撮影設定統一】
Style: ${config.style}, professional corporate photography
Lighting: Natural soft lighting, consistent across all images, 明るい自然な照明
Colors: ${config.colors} color palette, warm natural tones
Quality: High resolution, sharp professional photography
Environment: Modern Japanese office workspace, realistic business setting
※NO anime backgrounds, NO CG environments, NO illustrated elements, NO dark horror atmosphere`;
}

// 個別画像設定
const IMAGES_TO_REGENERATE = {
  'solution-3.jpg': {
    title: '成果の可視化',
    getPrompt: (config) => `${createConsistencyPrompt(config)}

【このシーンの具体的内容】
同一人物が統合されたレポートで成果を確認している様子。明確なダッシュボード、達成感のある表情の日本人、成功指標、500x400ピクセル、プロフェッショナル・効率的・革新的・信頼感な雰囲気、テキストなし。
※明るく前向きな成功シーン、自然な表情で満足している様子`
  },
  'problem-4.jpg': {
    title: '効果測定の困難（明るく）',
    getPrompt: (config) => `${createConsistencyPrompt(config)}

【このシーンの具体的内容】
同一人物が複雑なデータ分析に困っている様子を明るいオフィス環境で表現。複数のダッシュボード画面、少し困った表情の日本人、バラバラな数字、400x400ピクセル、明るい照明の中で軽い困惑を表現、テキストなし。
※ホラー要素一切なし、明るい自然光での撮影、親しみやすい表情で軽い困惑のみ表現`
  }
};

async function generateImage(prompt) {
  const requestBody = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: 0.1, // Nano Banana一貫性最大化のため極端に低減
      maxOutputTokens: 4096
    }
  };

  try {
    console.log(`📡 Sending API request...`);
    
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
    
    return { success: false, error: 'No image data found in response' };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function regenerateSpecificImages() {
  const outputDir = '/Users/ksato/Documents/GitHub/Unson-LLC/unson_os/products/2-validation/2025-09-011-eventsync-pro/lp/images';
  
  const config = {
    target: '小〜中規模イベント主催者（コミュニティ/ウェビナー担当）',
    theme: 'イベント運用効率化・媒体横断マーケティング・AI自動化',
    colors: 'Blue (#3B82F6), Purple (#8B5CF6), Pink (#EC4899)',
    mood: 'プロフェッショナル・効率的・革新的・信頼感',
    style: 'modern business photography with clean graphics and tech elements'
  };

  let successCount = 0;
  const errors = [];

  for (const [filename, imageConfig] of Object.entries(IMAGES_TO_REGENERATE)) {
    console.log(`🎯 Regenerating ${imageConfig.title} (${filename})...`);
    
    let success = false;
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries && !success; attempt++) {
      try {
        if (attempt > 1) {
          console.log(`   🔄 Retry attempt ${attempt}/${maxRetries} for ${filename}`);
        }
        
        const prompt = imageConfig.getPrompt(config);
        const result = await generateImage(prompt);
        
        if (result.success && result.imageData) {
          const imageBuffer = Buffer.from(result.imageData, 'base64');
          const imagePath = path.join(outputDir, filename);
          fs.writeFileSync(imagePath, imageBuffer);
          console.log(`   ✅ Generated: ${filename}${attempt > 1 ? ` (succeeded on attempt ${attempt})` : ''}`);
          successCount++;
          success = true;
        } else {
          const error = `Failed to generate ${filename}: ${result.error}`;
          console.error(`   ❌ Attempt ${attempt}: ${error}`);
          
          if (attempt === maxRetries) {
            errors.push(`${filename}: All ${maxRetries} attempts failed - ${result.error}`);
          }
        }
        
        // Rate limiting
        const waitTime = attempt === 1 ? 5000 : 5000 * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
      } catch (error) {
        const errorMsg = `Error generating ${filename} (attempt ${attempt}): ${error}`;
        console.error(`   ❌ ${errorMsg}`);
        
        if (attempt === maxRetries) {
          errors.push(`${filename}: All ${maxRetries} attempts failed - ${error}`);
        }
        
        const waitTime = 5000 * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  console.log(`🎉 Specific image regeneration completed: ${successCount}/${Object.keys(IMAGES_TO_REGENERATE).length} successful`);
  if (errors.length > 0) {
    console.error('Errors:', errors);
  }
  return successCount;
}

// Run the regeneration
regenerateSpecificImages().then(count => {
  console.log(`Final result: ${count} images successfully regenerated`);
  process.exit(0);
}).catch(error => {
  console.error('Regeneration failed:', error);
  process.exit(1);
});