import { TemplateConfig } from '@/types/template';

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent';

export interface ImageGenerationConfig {
  target: string;
  theme: string;
  colors: string;
  mood: string;
  style: string;
}

export interface ImageSet {
  filename: string;
  title: string;
  getPrompt: (config: ImageGenerationConfig) => string;
}

// 標準画像セット
export const STANDARD_IMAGE_SETS: ImageSet[] = [
  // ヒーロー画像
  {
    filename: 'hero-bg.jpg',
    title: 'ヒーロー背景',
    getPrompt: (config) => `Create a professional hero background representing ${config.theme}. Show ${config.target} in a confident, engaging pose, ${config.style}, ${config.mood} mood, using ${config.colors} color scheme, 1200x600 pixels, no text overlay.`
  },
  
  // 問題提起画像 (6枚)
  ...Array.from({length: 6}, (_, i) => ({
    filename: `problem-${i + 1}.jpg`,
    title: `問題${i + 1}`,
    getPrompt: (config) => `Create an image representing a common problem for ${config.target}. Show challenges and frustrations related to ${config.theme}, ${config.style}, concerned worried mood, using ${config.colors} color scheme, 400x400 pixels, no text overlay.`
  })),
  
  // ソリューション画像 (3枚)
  ...Array.from({length: 3}, (_, i) => ({
    filename: `solution-${i + 1}.jpg`,
    title: `ソリューション${i + 1}`,
    getPrompt: (config) => `Create an inspiring solution image related to ${config.theme}. Show ${config.target} successfully using technology and achieving goals, ${config.style}, ${config.mood} mood, using ${config.colors} color scheme, 500x400 pixels, no text overlay.`
  })),
  
  // 機能・CTA画像
  {
    filename: 'feature-1.jpg',
    title: '主要機能',
    getPrompt: (config) => `Create a feature showcase image for ${config.theme}. Show ${config.target} effectively using the system, ${config.style}, confident satisfied mood, using ${config.colors} color scheme, 400x400 pixels, no text overlay.`
  },
  {
    filename: 'cta-bg.jpg',
    title: 'CTA背景',
    getPrompt: (config) => `Create an inspiring call-to-action background for ${config.theme}. Show transformation and success - ${config.target} achieving their goals, ${config.style}, inspiring motivational mood, using ${config.colors} color scheme, 600x400 pixels, no text overlay.`
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
      temperature: 0.8,
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
  
  for (const imageConfig of imageSets) {
    console.log(`🎯 Generating ${imageConfig.title} (${imageConfig.filename})...`);
    
    try {
      const prompt = imageConfig.getPrompt(config);
      const result = await generateImage(prompt);
      
      if (result.success && result.imageData) {
        // In a real implementation, you would save the image to the file system
        // For now, we'll simulate success
        console.log(`   ✅ Generated: ${imageConfig.filename}`);
        successCount++;
      } else {
        const error = `Failed to generate ${imageConfig.filename}: ${result.error}`;
        console.error(`   ❌ ${error}`);
        errors.push(error);
      }
      
      // Rate limiting - wait 3 seconds between requests
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (error) {
      const errorMsg = `Error generating ${imageConfig.filename}: ${error}`;
      console.error(`   ❌ ${errorMsg}`);
      errors.push(errorMsg);
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