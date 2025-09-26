const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDSdu48kEdL0uHTFH31-vfFB3_nP5Vbq7Q';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent';

// キャラクターと画風の一貫性を保つプロンプト
function createConsistencyPrompt(config) {
  return `【画風・トーンマナー統一】
画風: ${config.style}、現実的でプロフェッショナルな写真風
色調: ${config.colors}を基調とした統一された彩度・明度、暖かみのある自然な色合い
ライティング: 一貫した柔らかい自然光、均一な明度

【キャラクター統一】
主人公: 30-40代の日本人ビジネスパーソン（${config.target}）
- 顔立ち: 親しみやすく信頼感のある表情
- 服装: スマートカジュアル（シャツ、ジャケット等）統一されたスタイル  
- 髪型: 現代的でプロフェッショナルなスタイル
※シーンごとに表情や姿勢は変わるが、同一人物として認識できる一貫性を保つ

【環境統一】
背景: 現代的な日本のオフィス環境、統一された空間デザイン（ただし問題/解決でシーンは変化）`;
}

// 一貫性テスト用画像セット（3枚）
const TEST_IMAGE_SETS = [
  {
    filename: 'hero-test.jpg',
    title: 'ヒーロー背景（テスト）',
    getPrompt: (config) => `${createConsistencyPrompt(config)}

【具体的なシーン】日本のビジネス環境でイベント運用効率化を表現するプロフェッショナルなヒーロー背景画像。同一人物が自信に満ちた表情で取り組んでいる様子を、1200x600ピクセル、テキストオーバーレイなしで描いてください。`
  },
  {
    filename: 'problem-test.jpg', 
    title: '問題シーン（テスト）',
    getPrompt: (config) => `${createConsistencyPrompt(config)}

【このシーンの具体的内容】
同一人物が時間的プレッシャーで困っている様子。複数のタブが開かれたパソコン画面の前で焦った表情を見せる。時計が見える環境で、400x400ピクセル、テキストなし。
※表情は焦りを表現するが、キャラクター自体は一貫性を保つ`
  },
  {
    filename: 'solution-test.jpg',
    title: 'ソリューションシーン（テスト）',
    getPrompt: (config) => `${createConsistencyPrompt(config)}

【このシーンの具体的内容】
同一人物が統合されたダッシュボードを見て満足している様子。複数のプラットフォームを1クリックで同期する画面を見ながら安心した表情。500x400ピクセル、テキストなし。
※表情は安心・満足を表現するが、キャラクター自体は一貫性を保つ`
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
      temperature: 0.7, // 一貫性のため少し低めに
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

async function testConsistency() {
  const outputDir = '/Users/ksato/Documents/GitHub/Unson-LLC/unson_os/apps/lp-suite/public/generated-images/Consistency Test';
  
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

  let successCount = 0;

  for (const imageConfig of TEST_IMAGE_SETS) {
    console.log(`🎯 Testing ${imageConfig.title} (${imageConfig.filename})...`);
    
    try {
      const prompt = imageConfig.getPrompt(config);
      const result = await generateImage(prompt);
      
      if (result.success && result.imageData) {
        const imageBuffer = Buffer.from(result.imageData, 'base64');
        const imagePath = path.join(outputDir, imageConfig.filename);
        fs.writeFileSync(imagePath, imageBuffer);
        console.log(`✅ Generated: ${imageConfig.filename}`);
        successCount++;
      } else {
        console.error(`❌ Failed: ${imageConfig.filename} - ${result.error}`);
      }
      
      // Wait 5 seconds between requests
      await new Promise(resolve => setTimeout(resolve, 5000));
      
    } catch (error) {
      console.error(`❌ Error generating ${imageConfig.filename}: ${error}`);
    }
  }

  console.log(`🎉 Consistency test completed: ${successCount}/${TEST_IMAGE_SETS.length} successful`);
  return successCount;
}

// Run the test
testConsistency().then(count => {
  console.log(`Final result: ${count} images successfully generated for consistency test`);
  process.exit(0);
}).catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});