#!/usr/bin/env node

/**
 * AI Coach LP用の全画像をブランドトーンに合わせて生成
 * ペルソナ: 40-55歳の日本人女性、子育て卒業後の自分時間探し
 * テーマ: 温かい支援、優雅な生活、新しい挑戦への勇気
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent';

// AI Coach専用の全画像プロンプト
const aiCoachImages = [
  {
    filename: 'hero-bg.jpg',
    title: 'ヒーロー背景',
    prompt: `Create a warm, elegant hero background image for an AI life coach service targeting mature Japanese women aged 40-55 who have finished child-rearing. Show a serene, sophisticated Japanese woman in a beautiful home setting, enjoying peaceful "me-time" - perhaps reading, having tea, or looking out a window with soft natural lighting. Use elegant purple (#E879F9) and soft pink (#FB7185) colors. Warm lifestyle photography style with golden hour lighting, peaceful and empowering mood. 1200x600 pixels, no text overlay.`
  },
  {
    filename: 'problem-1.jpg',
    title: '時間はあるのに、最初の一歩が出ない',
    prompt: `Create a lifestyle photograph showing a mature elegant Japanese woman aged 45-50 sitting in a beautiful home, looking thoughtful but hesitant about starting something new. She has free time but feels uncertain about taking the first step. Warm natural lighting, cozy home interior, contemplative mood. Use purple (#E879F9) and pink (#FB7185) accents. 400x400 pixels, no text overlay.`
  },
  {
    filename: 'problem-2.jpg',
    title: '話せる相手が少なく、一人で続かない',
    prompt: `Generate a warm lifestyle image depicting social isolation challenges for mature women. Show an elegant Japanese woman aged 45-50 at home, looking at her phone with mostly family contacts, feeling the lack of peers to share new interests with. Soft natural lighting, nurturing but lonely mood. Purple (#E879F9) and pink (#FB7185) color scheme. 400x400 pixels, no text.`
  },
  {
    filename: 'problem-3.jpg',
    title: '私にできること、あるのかな？',
    prompt: `Create a lifestyle photograph showing self-doubt about personal abilities. Elegant mature Japanese woman aged 45-50 looking uncertain about her skills beyond homemaking, sitting in a comfortable home environment. Gentle lighting, reflective mood, warm but uncertain atmosphere. Use purple (#E879F9) and pink (#FB7185) tones. 400x400 pixels, no text overlay.`
  },
  {
    filename: 'problem-4.jpg',
    title: '"母親"の次のわたしが、ぼんやり',
    prompt: `Design a warm lifestyle image about identity transition after motherhood. Mature elegant Japanese woman aged 45-50 in a quiet moment, reflecting on who she is beyond being a mother. Soft home interior, golden hour lighting, contemplative and gentle mood. Purple (#E879F9) and pink (#FB7185) color palette. 400x400 pixels, no text.`
  },
  {
    filename: 'problem-5.jpg',
    title: '始めても、三日目で止まる',
    prompt: `Create a lifestyle photograph about difficulty maintaining new habits alone. Show a mature Japanese woman aged 45-50 with abandoned hobby materials or books, expressing the challenge of continuing activities without support. Warm home lighting, gentle frustration mood. Use purple (#E879F9) and pink (#FB7185) colors. 400x400 pixels, no text overlay.`
  },
  {
    filename: 'problem-6.jpg',
    title: '自分の時間をとると、少し罪悪感',
    prompt: `Generate a warm lifestyle image about guilt over personal time. Elegant mature Japanese woman aged 45-50 enjoying a personal moment but showing slight hesitation or guilt about focusing on herself. Cozy home setting, soft natural lighting, conflicted but gentle mood. Purple (#E879F9) and pink (#FB7185) tones. 400x400 pixels, no text.`
  },
  {
    filename: 'solution-1.jpg',
    title: 'AI自己分析で"いま"を見える化',
    prompt: `Create a positive solution image showing AI-powered self-discovery for mature women. Elegant Japanese woman aged 45-50 having a warm conversation with AI technology, discovering her interests and current state. Bright natural lighting, hopeful and empowering mood. Use vibrant purple (#E879F9) and pink (#FB7185). Modern lifestyle photography, 500x400 pixels, no text overlay.`
  },
  {
    filename: 'solution-2.jpg',
    title: '小さな一歩を積み重ねる設計',
    prompt: `Design a lifestyle image showing gradual progress and small steps for mature women. Show an elegant Japanese woman aged 45-50 confidently taking small actions, perhaps trying a new activity or skill. Progressive steps visual metaphor. Warm encouraging lighting, optimistic mood. Purple (#E879F9) and pink (#FB7185) colors. 500x400 pixels, no text.`
  },
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

async function regenerateAllCoachImages() {
  if (!API_KEY) {
    console.error('❌ GEMINI_API_KEYが設定されていません');
    process.exit(1);
  }

  const outputDir = 'products/2-validation/2025-08-003-ai-coach/lp/public/images/generated';
  const backupDir = 'products/2-validation/2025-08-003-ai-coach/lp/public/images/backup';
  
  // バックアップディレクトリ作成
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  console.log('🎨 AI Coach全画像のブランド統一生成...');
  console.log('👥 ターゲット: 40-55歳の日本人女性（子育て卒業後）');
  console.log('🌸 テーマ: 温かい支援、優雅な生活、新しい挑戦への勇気');
  console.log('🎨 ブランドカラー: パープル(#E879F9) & ピンク(#FB7185)');
  console.log('✨ スタイル: 温かいライフスタイル写真、自然な黄金時間の照明');
  console.log('='.repeat(60));

  let successCount = 0;
  
  for (const imageConfig of aiCoachImages) {
    console.log(`\n🎯 ${imageConfig.title}の生成中...`);
    console.log(`   ファイル名: ${imageConfig.filename}`);
    
    // 既存ファイルをバックアップ
    const outputPath = path.join(outputDir, imageConfig.filename);
    if (fs.existsSync(outputPath)) {
      const backupPath = path.join(backupDir, `${Date.now()}-${imageConfig.filename}`);
      fs.copyFileSync(outputPath, backupPath);
      console.log(`   💾 既存画像をバックアップ`);
    }
    
    const result = await generateImage(imageConfig.prompt);
    
    if (result.success && result.imageData) {
      const imageBuffer = Buffer.from(result.imageData, 'base64');
      fs.writeFileSync(outputPath, imageBuffer);
      
      console.log(`   ✅ ブランド統一画像で更新完了`);
      console.log(`   📏 サイズ: ${(imageBuffer.length / 1024).toFixed(2)} KB`);
      
      successCount++;
    } else {
      console.error(`   ❌ 生成エラー: ${result.error}`);
    }
    
    // API制限回避のため5秒待機
    if (imageConfig !== aiCoachImages[aiCoachImages.length - 1]) {
      console.log('   ⏳ 次の画像生成まで5秒待機...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`🎉 AI Coach全画像生成完了！`);
  console.log(`📊 結果: ${successCount}/${aiCoachImages.length} 画像生成成功`);
  
  if (successCount === aiCoachImages.length) {
    console.log('✅ すべての画像がブランドに統一されました！');
    console.log('🌸 温かく上品な40-55歳女性向けデザインに最適化');
    console.log('🔄 ブラウザをリロードして確認してください');
  } else {
    console.log('⚠️  一部の画像生成に失敗しました');
  }
}

regenerateAllCoachImages().catch(console.error);