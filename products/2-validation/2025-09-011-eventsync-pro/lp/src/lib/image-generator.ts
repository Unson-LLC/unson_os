import { TemplateConfig } from '@/types/template';

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent';

export interface ImageGenerationConfig {
  target: string;
  theme: string;
  colors: string;
  mood: string;
  style: string;
  consistencyPrompt?: string;
}

export interface ImageSet {
  filename: string;
  title: string;
  getPrompt: (config: ImageGenerationConfig) => string;
}

// Nano Banana（Gemini 2.5）専用の一貫性確保プロンプト
function createConsistencyPrompt(config: ImageGenerationConfig): string {
  return `【CONSISTENT CHARACTER DESIGN - 同一キャラクター設計】
STRICT PHOTOGRAPHY STYLE: Professional corporate photography, photorealistic business photos ONLY
絶対禁止: アニメ・イラスト・漫画・CG・カートゥーン・デフォルメスタイル

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
Lighting: Natural soft lighting, consistent across all images
Colors: ${config.colors} color palette, warm natural tones
Quality: High resolution, sharp professional photography
Environment: Modern Japanese office workspace, realistic business setting
※NO anime backgrounds, NO CG environments, NO illustrated elements`;
}

// 日本市場向け画像セット
export const STANDARD_IMAGE_SETS: ImageSet[] = [
  // ヒーロー画像
  {
    filename: 'hero-bg.jpg',
    title: 'ヒーロー背景',
    getPrompt: (config) => `${createConsistencyPrompt(config)}

【具体的なシーン】日本のビジネス環境で${config.theme}を表現するプロフェッショナルなヒーロー背景画像を作成してください。${config.target}が自信に満ちた表情で取り組んでいる様子を、1200x600ピクセル、テキストオーバーレイなしで描いてください。日本のオフィス環境や働き方を意識した構図にしてください。`
  },
  
  // 問題提起画像（具体的な6つの問題）
  {
    filename: 'problem-1.jpg',
    title: '締切前の焦り',
    getPrompt: (config) => `${createConsistencyPrompt(config)}

【このシーンの具体的内容】
同一人物が時間的プレッシャーで困っている様子。複数のタブが開かれたパソコン画面の前で焦った表情を見せる。時計が見える環境で、400x400ピクセル、テキストなし。
※表情は焦りを表現するが、キャラクター自体は一貫性を保つ`
  },
  {
    filename: 'problem-2.jpg',
    title: '複数媒体の管理',
    getPrompt: (config) => `日本の${config.target}が複数のイベントプラットフォーム（Peatix、connpass、Doorkeeper）で同じ作業を繰り返している様子を描いてください。複数の画面、混乱した表情の日本人、${config.colors}のカラーパレット、400x400ピクセル、疲労感のある雰囲気、テキストなし。`
  },
  {
    filename: 'problem-3.jpg',
    title: '広告費の浪費',
    getPrompt: (config) => `日本の${config.target}が効果の見えない広告費に悩んでいる様子を描いてください。グラフが下降している画面、お金のアイコン、困った表情の日本人、${config.colors}のカラーパレット、400x400ピクセル、不安な雰囲気、テキストなし。`
  },
  {
    filename: 'problem-4.jpg',
    title: '効果測定の困難',
    getPrompt: (config) => `日本の${config.target}が複雑なデータ分析に困っている様子を描いてください。複数のダッシュボード画面、混乱した表情の日本人、バラバラな数字、${config.colors}のカラーパレット、400x400ピクセル、混乱した雰囲気、テキストなし。`
  },
  {
    filename: 'problem-5.jpg',
    title: '競合との差',
    getPrompt: (config) => `日本の${config.target}が他のコミュニティの成功と自分の結果を比較して落ち込んでいる様子を描いてください。SNSの満席投稿、比較グラフ、がっかりした表情の日本人、${config.colors}のカラーパレット、400x400ピクセル、落ち込んだ雰囲気、テキストなし。`
  },
  {
    filename: 'problem-6.jpg',
    title: '深夜残業',
    getPrompt: (config) => `日本の${config.target}が深夜にイベント準備作業をしている様子を描いてください。夜景の見える窓、疲れた表情の日本人、遅い時間を示す時計、${config.colors}のカラーパレット、400x400ピクセル、疲労した雰囲気、テキストなし。`
  },
  
  // ソリューション画像（具体的な3つの解決策）
  {
    filename: 'solution-1.jpg',
    title: '一括同期の効率',
    getPrompt: (config) => `日本の${config.target}が複数のプラットフォームを1クリックで同期している様子を描いてください。統合されたダッシュボード、満足そうな表情の日本人、同期のアイコン、${config.colors}のカラーパレット、500x400ピクセル、${config.mood}な雰囲気、テキストなし。`
  },
  {
    filename: 'solution-2.jpg',
    title: 'AI自動最適化',
    getPrompt: (config) => `日本の${config.target}がAIによる自動最適化機能を使っている様子を描いてください。AIアシスタントのアイコン、上昇するグラフ、安心した表情の日本人、${config.colors}のカラーパレット、500x400ピクセル、${config.mood}な雰囲気、テキストなし。`
  },
  {
    filename: 'solution-3.jpg',
    title: '成果の可視化',
    getPrompt: (config) => `日本の${config.target}が統合されたレポートで成果を確認している様子を描いてください。明確なダッシュボード、達成感のある表情の日本人、成功指標、${config.colors}のカラーパレット、500x400ピクセル、${config.mood}な雰囲気、テキストなし。`
  },
  
  // 機能・CTA画像
  {
    filename: 'feature-1.jpg',
    title: '主要機能',
    getPrompt: (config) => `日本の${config.target}が${config.theme}のシステムを効果的に使っている様子を描いてください。直感的なユーザーインターフェース、満足した表情の日本人、${config.colors}のカラーパレット、400x400ピクセル、自信に満ちた満足した雰囲気、テキストなし。`
  },
  {
    filename: 'cta-bg.jpg',
    title: 'CTA背景',
    getPrompt: (config) => `${config.theme}による変革と成功を表現する感動的な背景画像を作成してください。日本の${config.target}が目標を達成している様子、${config.colors}のカラーパレット、600x400ピクセル、インスピレーションを与える意欲的な雰囲気、テキストなし。日本のビジネス文化を反映した成功の表現にしてください。`
  }
];

export async function generateImage(prompt: string): Promise<{
  success: boolean;
  imageData?: string;
  mimeType?: string;
  error?: string;
}> {
  if (!API_KEY) {
    return { success: false, error: 'GEMINI_API_KEY is not configured' };
  }

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
    console.log(`   📡 Sending API request...`);
    
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
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function generateLPImages(
  config: ImageGenerationConfig,
  outputDir: string,
  imageSets: ImageSet[] = STANDARD_IMAGE_SETS
): Promise<{
  success: number;
  total: number;
  errors: string[];
}> {
  console.log(`🎨 Image generation started for ${config.theme}...`);
  console.log(`   Target: ${config.target}`);
  console.log(`   Theme: ${config.theme}`);
  console.log(`   Colors: ${config.colors}`);
  
  let successCount = 0;
  const errors: string[] = [];
  const fs = require('fs');
  const path = require('path');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  for (const imageConfig of imageSets) {
    console.log(`🎯 Generating ${imageConfig.title} (${imageConfig.filename})...`);
    
    let success = false;
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries && !success; attempt++) {
      try {
        if (attempt > 1) {
          console.log(`   🔄 Retry attempt ${attempt}/${maxRetries} for ${imageConfig.filename}`);
        }
        
        const prompt = imageConfig.getPrompt(config);
        const result = await generateImage(prompt);
        
        if (result.success && result.imageData) {
          const imageBuffer = Buffer.from(result.imageData, 'base64');
          const imagePath = path.join(outputDir, imageConfig.filename);
          fs.writeFileSync(imagePath, imageBuffer);
          console.log(`   ✅ Generated: ${imageConfig.filename}${attempt > 1 ? ` (succeeded on attempt ${attempt})` : ''}`);
          successCount++;
          success = true;
        } else {
          const error = `Failed to generate ${imageConfig.filename}: ${result.error}`;
          console.error(`   ❌ Attempt ${attempt}: ${error}`);
          
          if (attempt === maxRetries) {
            errors.push(`${imageConfig.filename}: All ${maxRetries} attempts failed - ${result.error}`);
          }
        }
        
        // Rate limiting with exponential backoff for retries
        const waitTime = attempt === 1 ? 3000 : 3000 * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
      } catch (error) {
        const errorMsg = `Error generating ${imageConfig.filename} (attempt ${attempt}): ${error}`;
        console.error(`   ❌ ${errorMsg}`);
        
        if (attempt === maxRetries) {
          errors.push(`${imageConfig.filename}: All ${maxRetries} attempts failed - ${error}`);
        }
        
        // Wait before retry
        const waitTime = 3000 * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  console.log(`🎉 Image generation completed: ${successCount}/${imageSets.length} successful`);
  return {
    success: successCount,
    total: imageSets.length,
    errors
  };
}

export function createImageGenerationConfigFromTemplate(config: TemplateConfig): ImageGenerationConfig | null {
  if (!config.imageGeneration?.enabled) {
    return null;
  }

  return {
    target: config.imageGeneration.target || 'business professional',
    theme: config.imageGeneration.theme || 'business innovation',
    colors: config.imageGeneration.colors || config.theme.colors.primary,
    mood: config.imageGeneration.mood || 'professional confident',
    style: config.imageGeneration.style || 'modern business photography'
  };
}