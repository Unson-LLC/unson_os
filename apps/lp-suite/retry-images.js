const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDSdu48kEdL0uHTFH31-vfFB3_nP5Vbq7Q';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent';

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

async function retryFailedImages() {
  const outputDir = '/Users/ksato/Documents/GitHub/Unson-LLC/unson_os/apps/lp-suite/public/generated-images/EventSync Pro';
  
  const config = {
    target: '小〜中規模イベント主催者（コミュニティ/ウェビナー担当）',
    theme: 'イベント運用効率化・媒体横断マーケティング・AI自動化',
    colors: 'Blue (#3B82F6), Purple (#8B5CF6), Pink (#EC4899)',
    mood: 'プロフェッショナル・効率的・革新的・信頼感',
    style: 'modern business photography with clean graphics and tech elements'
  };

  const failedImages = [
    {
      filename: 'solution-2.jpg',
      title: 'ソリューション2',
      getPrompt: (config) => `Create an inspiring solution image related to ${config.theme}. Show ${config.target} successfully using technology and achieving goals, ${config.style}, ${config.mood} mood, using ${config.colors} color scheme, 500x400 pixels, no text overlay.`
    },
    {
      filename: 'solution-3.jpg', 
      title: 'ソリューション3',
      getPrompt: (config) => `Create an inspiring solution image related to ${config.theme}. Show ${config.target} successfully using technology and achieving goals, ${config.style}, ${config.mood} mood, using ${config.colors} color scheme, 500x400 pixels, no text overlay.`
    }
  ];

  let successCount = 0;

  for (const imageConfig of failedImages) {
    console.log(`🎯 Retrying ${imageConfig.title} (${imageConfig.filename})...`);
    
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
        console.error(`❌ Failed to generate ${imageConfig.filename}: ${result.error}`);
      }
      
      // Rate limiting - wait 3 seconds between requests
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (error) {
      console.error(`❌ Error generating ${imageConfig.filename}: ${error}`);
    }
  }

  console.log(`🎉 Retry completed: ${successCount}/${failedImages.length} successful`);
  return successCount;
}

// Run the retry
retryFailedImages().then(count => {
  console.log(`Final result: ${count} images successfully generated`);
  process.exit(0);
}).catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});