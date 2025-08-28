#!/usr/bin/env node

/**
 * 残り3つのLP（AI Bridge, AI Legacy Creator, MyWA）の
 * ブランドトーンに合わせた画像一括生成スクリプト
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent';

// LP設定: ブランドトーン別画像仕様
const LP_CONFIGS = [
  {
    id: 'ai-bridge',
    name: 'AI世代間ブリッジ',
    path: 'products/2-validation/2025-08-002-ai-bridge/lp/public/images/generated',
    target: '40-50歳日本人管理職男性',
    theme: '世代間コミュニケーション・ビジネス革新',
    colors: 'Blue (#2563EB), Purple (#7C3AED)',
    mood: 'プロフェッショナル・自信・革新・信頼',
    style: 'modern business photography with clean graphics'
  },
  {
    id: 'ai-legacy-creator', 
    name: 'AIレガシー・クリエーター',
    path: 'products/2-validation/2025-08-004-ai-legacy-creator/lp/public/images/generated',
    target: '50-60歳日本人男性（経験豊富）',
    theme: '知識継承・レガシー・威厳・智慧',
    colors: 'Deep Blue (#1E40AF), Purple (#7C3AED)',
    mood: '威厳・智慧・達成感・レガシー志向',
    style: 'classic refined photography with warm tones'
  },
  {
    id: 'mywa',
    name: 'MyWA',
    path: 'products/4-active/2025-08-001-mywa/lp/public/images/generated', 
    target: '25-45歳テック系ビジネスパーソン',
    theme: 'AI技術・効率性・透明性・イノベーション',
    colors: 'Tech Blue (#3B82F6), Purple (#8B5CF6)',
    mood: '革新・効率・信頼・テックフォワード',
    style: 'modern digital illustration with tech elements'
  }
];

// 共通画像セット（各LPに必要な画像）
const IMAGE_SETS = [
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
    getPrompt: (config) => {
      const problemThemes = {
        'ai-bridge': [
          'Z世代部下との理解困難を表現',
          '指導方法の不効果を表現', 
          'チーム内世代間対立を表現',
          '評価面談での困惑を表現',
          '会議での発言偏りを表現',
          '組織変革への抵抗を表現'
        ],
        'ai-legacy-creator': [
          '知識消失への危機感を表現',
          '経験整理の困難を表現',
          '若手指導機会不足を表現', 
          '退職後貢献への不安を表現',
          'デジタル化の困難を表現',
          '知識価値の過小評価を表現'
        ],
        'mywa': [
          '情報過多による選別困難を表現',
          '推薦理由不明による不信を表現',
          'パーソナライズ不十分を表現',
          '学習効果実感不足を表現', 
          '更新頻度のバラつきを表現',
          'AI進歩への追従困難を表現'
        ]
      };
      const theme = problemThemes[config.id][i];
      return `Create an image representing a problem: ${theme}. Show ${config.target} facing challenges, ${config.style}, concerned worried mood, using ${config.colors} color scheme, 400x400 pixels, no text overlay.`;
    }
  })),
  
  // ソリューション画像 (3枚)
  ...Array.from({length: 3}, (_, i) => ({
    filename: `solution-${i + 1}.jpg`,
    title: `ソリューション${i + 1}`,
    getPrompt: (config) => {
      const solutionThemes = {
        'ai-bridge': [
          '世代特性AI分析による科学的理解',
          'リアルタイム・コミュニケーション支援',
          '多様性活用チーム設計'
        ],
        'ai-legacy-creator': [
          'AI知識抽出・構造化システム',
          '個人版ウィキペディア作成プラットフォーム', 
          '次世代継承マッチングシステム'
        ],
        'mywa': [
          'Why-Chip透明性機能によるAI推薦',
          '完全パーソナライズ配信システム',
          '効率的学習サイクル最適化'
        ]
      };
      const theme = solutionThemes[config.id][i];
      return `Create an inspiring solution image: ${theme}. Show ${config.target} successfully using technology, ${config.style}, ${config.mood} mood, using ${config.colors} color scheme, 500x400 pixels, no text overlay.`;
    }
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
    console.log(`   📡 APIリクエスト送信中...`);
    
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
    
    return { success: false, error: '画像データが見つかりませんでした' };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function generateLPImages(config) {
  console.log(`\n🎨 ${config.name} 画像生成開始...`);
  console.log(`   ターゲット: ${config.target}`);
  console.log(`   テーマ: ${config.theme}`); 
  console.log(`   カラー: ${config.colors}`);
  console.log('='.repeat(50));

  let successCount = 0;
  const outputDir = config.path;
  
  // 出力ディレクトリ作成
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const imageConfig of IMAGE_SETS) {
    console.log(`\n🎯 ${imageConfig.title}（${imageConfig.filename}）生成中...`);
    
    const prompt = imageConfig.getPrompt(config);
    const result = await generateImage(prompt);
    
    if (result.success && result.imageData) {
      const imageBuffer = Buffer.from(result.imageData, 'base64');
      const outputPath = path.join(outputDir, imageConfig.filename);
      fs.writeFileSync(outputPath, imageBuffer);
      
      console.log(`   ✅ 完成: ${imageConfig.filename}`);
      console.log(`   📏 ${(imageBuffer.length / 1024).toFixed(2)} KB`);
      
      successCount++;
    } else {
      console.error(`   ❌ エラー: ${result.error}`);
    }
    
    // 待機（API制限対応）
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log(`\n🎉 ${config.name} 完了: ${successCount}/${IMAGE_SETS.length} 成功`);
  return { lpName: config.name, success: successCount, total: IMAGE_SETS.length };
}

async function regenerateAllLPs() {
  if (!API_KEY) {
    console.error('❌ GEMINI_API_KEYが設定されていません');
    process.exit(1);
  }

  console.log('🚀 残り3つのLP画像一括生成開始');
  console.log('='.repeat(60));
  
  const results = [];
  
  for (const config of LP_CONFIGS) {
    const result = await generateLPImages(config);
    results.push(result);
  }

  console.log('\n' + '='.repeat(60));
  console.log('🏁 全LP画像生成完了サマリー');
  console.log('='.repeat(60));
  
  let totalSuccess = 0;
  let totalImages = 0;
  
  results.forEach(result => {
    console.log(`📊 ${result.lpName}: ${result.success}/${result.total} 成功`);
    totalSuccess += result.success;
    totalImages += result.total;
  });
  
  console.log(`\n🎯 合計: ${totalSuccess}/${totalImages} 成功 (${((totalSuccess/totalImages)*100).toFixed(1)}%)`);
}

regenerateAllLPs().catch(console.error);