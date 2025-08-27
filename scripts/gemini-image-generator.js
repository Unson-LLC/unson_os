#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Gemini API設定
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent';

// 画像生成プロンプトテンプレート
const IMAGE_PROMPTS = {
  hero: {
    prompt: 'プロフェッショナルで現代的なヒーローセクション背景画像を生成してください。{service}をテーマとし、クリーンでミニマルなデザイン、企業向けの信頼感のある色調（ブルー系、グレー系）を使用してください。解像度：1200x600px',
    filename: 'hero-bg.jpg',
    alt: 'サービスのヒーロー背景画像'
  },
  feature1: {
    prompt: '{service}の核心機能を表現するアイコン的な画像を生成してください。シンプルで理解しやすく、ビジネス向けのクリーンなデザインにしてください。解像度：400x400px',
    filename: 'feature-1.jpg',
    alt: 'メイン機能説明画像'
  },
  feature2: {
    prompt: '{service}の効率性や生産性を表現する画像を生成してください。データ分析、自動化、効率化をイメージしたビジネス向けデザインにしてください。解像度：400x400px',
    filename: 'feature-2.jpg',
    alt: '効率化機能説明画像'
  },
  feature3: {
    prompt: '{service}のセキュリティや信頼性を表現する画像を生成してください。安全性、保護、信頼をイメージしたプロフェッショナルなデザインにしてください。解像度：400x400px',
    filename: 'feature-3.jpg',
    alt: 'セキュリティ機能説明画像'
  },
  cta: {
    prompt: '{service}の成果や成功を表現するCTA用画像を生成してください。成長、達成、目標実現をイメージした前向きでエネルギッシュなデザインにしてください。解像度：600x400px',
    filename: 'cta-bg.jpg',
    alt: 'CTA背景画像'
  }
};

// サービス名からテーマを生成
function getServiceTheme(serviceName) {
  const themes = {
    'ai-bridge': 'AI統合プラットフォーム',
    'ai-stylist': 'AIスタイリングサービス',
    'ai-legacy-creator': 'AI遺産作成サービス',
    'ai-coach': 'AIコーチングサービス',
    'mywa': 'パーソナルアシスタント'
  };
  return themes[serviceName] || 'AIビジネスサービス';
}

// Gemini APIに画像生成リクエスト
async function generateImage(prompt, serviceName) {
  const theme = getServiceTheme(serviceName);
  const finalPrompt = prompt.replace('{service}', theme);
  
  const requestBody = {
    contents: [{
      parts: [{
        text: `${finalPrompt}. Style: professional, modern, business-focused, high quality, corporate branding suitable.`
      }]
    }],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 4096
    }
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // 画像データを探す
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
      for (const part of data.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.startsWith('image/')) {
          console.log('✅ 画像データを受信:', part.inlineData.mimeType);
          return {
            success: true,
            imageData: part.inlineData.data,
            mimeType: part.inlineData.mimeType,
            textResponse: data.candidates[0].content.parts.find(p => p.text)?.text
          };
        }
      }
    }
    
    return { success: false, data };
  } catch (error) {
    console.error('❌ Gemini API呼び出しエラー:', error);
    throw error;
  }
}

// 画像をダウンロードして保存
async function downloadAndSaveImage(imageUrl, filepath) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
    
    return filepath;
  } catch (error) {
    console.error('❌ 画像ダウンロードエラー:', error);
    throw error;
  }
}

// メイン処理
async function generateImagesForService(serviceName) {
  if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEYが設定されていません');
    console.log('環境変数にGEMINI_API_KEYを設定してください');
    process.exit(1);
  }

  const servicePath = path.join('products/2-validation', serviceName, 'lp');
  
  if (!fs.existsSync(servicePath)) {
    console.error(`❌ サービスディレクトリが見つかりません: ${servicePath}`);
    process.exit(1);
  }

  // 画像保存ディレクトリ作成
  const imagesDir = path.join(servicePath, 'public', 'images', 'generated');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  console.log(`🎨 ${serviceName}の画像生成を開始します...`);

  const results = [];
  
  for (const [type, config] of Object.entries(IMAGE_PROMPTS)) {
    console.log(`🎯 ${type}画像を生成中...`);
    
    try {
      // Gemini 2.5 Flash Image Previewで画像生成
      const imageResponse = await generateImage(config.prompt, serviceName);
      
      if (imageResponse.success && imageResponse.imageData) {
        // Base64画像データを保存
        const imageBuffer = Buffer.from(imageResponse.imageData, 'base64');
        const filepath = path.join(imagesDir, config.filename);
        fs.writeFileSync(filepath, imageBuffer);
        
        console.log(`✅ ${type}画像を保存: ${filepath}`);
        
        const imageInfo = {
          type,
          prompt: config.prompt.replace('{service}', getServiceTheme(serviceName)),
          filename: config.filename,
          alt: config.alt,
          generated: true,
          filepath: filepath,
          mimeType: imageResponse.mimeType,
          textResponse: imageResponse.textResponse
        };
        
        results.push(imageInfo);
      } else {
        throw new Error('画像データが受信されませんでした');
      }
      
    } catch (error) {
      console.error(`❌ ${type}画像生成エラー:`, error);
      results.push({
        type,
        error: error.message,
        generated: false
      });
    }
  }

  // 結果をJSONファイルに保存
  const resultsPath = path.join(imagesDir, 'generation-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  
  console.log(`📄 生成結果を保存: ${resultsPath}`);
  
  return results;
}

// Imagen APIを使用した代替実装（Google Cloud Vision API）
async function generateWithImagen(prompt, outputPath) {
  console.log('🎨 Imagen APIを使用した画像生成（未実装）');
  console.log(`プロンプト: ${prompt}`);
  console.log(`出力先: ${outputPath}`);
  
  // TODO: Imagen API実装
  // const vision = require('@google-cloud/vision');
  // const client = new vision.ImageAnnotatorClient();
  
  return false;
}

// コマンドライン実行
async function main() {
  const serviceName = process.argv[2];
  
  if (!serviceName) {
    console.error('❌ エラー: サービス名を指定してください');
    console.log('使用方法: node scripts/gemini-image-generator.js <service-name>');
    console.log('例: node scripts/gemini-image-generator.js ai-writer');
    process.exit(1);
  }

  try {
    const results = await generateImagesForService(serviceName);
    
    console.log('\n🎉 画像生成プロセス完了！');
    console.log('\n📋 次のステップ:');
    console.log('1. 生成されたプロンプトをDALL-E、Midjourney等で画像生成');
    console.log('2. 生成された画像をservices/' + serviceName + '/public/images/generated/に配置');
    console.log('3. コンポーネント内の画像パスを更新');
    
    // 画像置換用のヘルパー関数を生成
    generateImageReplacementHelper(serviceName, results);
    
  } catch (error) {
    console.error('❌ 処理エラー:', error);
    process.exit(1);
  }
}

// 画像置換ヘルパー関数を生成
function generateImageReplacementHelper(serviceName, imageResults) {
  const servicePath = path.join('products/2-validation', serviceName, 'lp');
  const helperPath = path.join(servicePath, 'src', 'utils', 'imageReplacer.ts');
  
  // utils ディレクトリ作成
  const utilsDir = path.dirname(helperPath);
  if (!fs.existsSync(utilsDir)) {
    fs.mkdirSync(utilsDir, { recursive: true });
  }
  
  const helperContent = `// 自動生成された画像置換ヘルパー
// 生成日: ${new Date().toISOString()}

export const generatedImages = {
${imageResults.map(result => {
  if (result.generated === false) {
    return `  ${result.type}: {
    src: '/images/generated/${result.filename}',
    alt: '${result.alt}',
    placeholder: '/images/placeholder-${result.type}.jpg'
  }`;
  }
  return null;
}).filter(Boolean).join(',\n')}
} as const;

// 画像の存在確認
export function getImageSrc(type: keyof typeof generatedImages): string {
  const config = generatedImages[type];
  if (!config) return '/images/placeholder.jpg';
  
  // 実際のアプリでは画像の存在確認ロジックを実装
  return config.src;
}

// プレースホルダー置換
export function replaceImageInComponent(componentPath: string, imageType: keyof typeof generatedImages) {
  // TODO: コンポーネント内の画像パスを自動置換
  console.log(\`置換対象: \${componentPath}, タイプ: \${imageType}\`);
}
`;

  fs.writeFileSync(helperPath, helperContent);
  console.log(`📄 画像置換ヘルパー生成: ${helperPath}`);
}

// スクリプト実行時のエラーハンドリング
process.on('uncaughtException', (error) => {
  console.error('❌ 予期しないエラー:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise拒否:', reason);
  process.exit(1);
});

if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  generateImagesForService,
  generateImage,
  IMAGE_PROMPTS,
  getServiceTheme
};