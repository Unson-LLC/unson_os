const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDSdu48kEdL0uHTFH31-vfFB3_nP5Vbq7Q';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent';

// 画風統一のための厳密なプロンプト
function createConsistencyPrompt(config) {
  return `【厳密な画風統一指定】
画風: 高品質なビジネス写真、フォトリアルな実写スタイル（アニメ・イラスト・漫画風は厳禁）
撮影スタイル: プロフェッショナルなコーポレート写真、${config.style}
色調: ${config.colors}を基調とした統一されたカラーグレーディング、暖かみのある自然な色合い
ライティング: ソフトな自然光、プロフェッショナルな商業写真の照明
画質: 高解像度、シャープで鮮明な写真品質

【人物統一（実写のみ）】
キャラクター: 30-40代の日本人男性ビジネスパーソン（${config.target}として）
- 顔立ち: 親しみやすく信頼感のある現実的な日本人の顔
- 服装: 統一されたスマートビジネスカジュアル（ネイビーのジャケット、白いシャツ）
- 髪型: 短髪でプロフェッショナル、一貫したスタイル
- 体型: 標準的なビジネスパーソン
※全ての画像で同一人物として認識できる一貫性を保つ

【環境統一（実写のみ）】
背景: モダンな日本のオフィス環境、実際のワークスペース
※実写風景のみ、CG・アニメ背景は使用禁止`;
}

// 画風統一テスト用画像（1枚）
const STYLE_TEST_IMAGE = {
  filename: 'style-test.jpg',
  title: '実写画風テスト',
  getPrompt: (config) => `${createConsistencyPrompt(config)}

【具体的なシーン】
同一人物がデスクでパソコンを見ながら集中して作業している様子。
プロフェッショナルなコーポレート写真として撮影された実写画像。
400x400ピクセル、テキストなし。

【重要な注意事項】
- 必ず実写写真風で生成すること
- アニメ、イラスト、漫画風は絶対に避けること
- プロの写真家が撮影したビジネス写真のクオリティを目指すこと`
};

async function generateImage(prompt) {
  const requestBody = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: 0.4, // 一貫性のため大幅に下げる
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

async function testStyleConsistency() {
  const outputDir = '/Users/ksato/Documents/GitHub/Unson-LLC/unson_os/apps/lp-suite/public/generated-images/Style Test';
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const config = {
    target: '小〜中規模イベント主催者（コミュニティ/ウェビナー担当）',
    theme: 'イベント運用効率化・媒体横断マーケティング・AI自動化',
    colors: 'Blue (#3B82F6), Purple (#8B5CF6), Pink (#EC4899)',
    mood: 'プロフェッショナル・効率的・革新的・信頼感',
    style: 'modern business photography with clean graphics and tech elements'
  };

  console.log(`🎯 Testing ${STYLE_TEST_IMAGE.title} (${STYLE_TEST_IMAGE.filename})...`);
  
  try {
    const prompt = STYLE_TEST_IMAGE.getPrompt(config);
    console.log(`📋 Using prompt: ${prompt.substring(0, 200)}...`);
    
    const result = await generateImage(prompt);
    
    if (result.success && result.imageData) {
      const imageBuffer = Buffer.from(result.imageData, 'base64');
      const imagePath = path.join(outputDir, STYLE_TEST_IMAGE.filename);
      fs.writeFileSync(imagePath, imageBuffer);
      console.log(`✅ Generated: ${STYLE_TEST_IMAGE.filename}`);
      console.log(`📍 Saved to: ${imagePath}`);
      return 1;
    } else {
      console.error(`❌ Failed: ${STYLE_TEST_IMAGE.filename} - ${result.error}`);
      return 0;
    }
    
  } catch (error) {
    console.error(`❌ Error generating ${STYLE_TEST_IMAGE.filename}: ${error}`);
    return 0;
  }
}

// Run the test
testStyleConsistency().then(count => {
  console.log(`🎉 Style consistency test completed: ${count}/1 successful`);
  process.exit(0);
}).catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});