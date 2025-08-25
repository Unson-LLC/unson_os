#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// 実際の画像ファイルと設定の対応マッピング
const IMAGE_MAPPINGS = {
  "/images/generated/problem-confusion.jpg": "/images/generated/imagen-4_2025-08-19T16-40-20-154Z_Create_a_minimalist_lifestyle_illustration_showing_1.png",
  "/images/generated/problem-loneliness.jpg": "/images/generated/imagen-4_2025-08-19T16-40-41-677Z_Generate_a_lifestyle_illustration_representing_soc_1.png",
  "/images/generated/problem-disconnect.jpg": "/images/generated/imagen-4_2025-08-19T16-41-07-773Z_Create_a_lifestyle_illustration_showing_lack_of_co_1.png",
  "/images/generated/problem-confidence.jpg": "/images/generated/imagen-4_2025-08-19T16-41-29-909Z_Generate_a_lifestyle_illustration_representing_los_1.png",
  "/images/generated/problem-direction.jpg": "/images/generated/imagen-4_2025-08-19T16-41-54-588Z_Create_a_lifestyle_illustration_showing_the_challe_1.png",
  "/images/generated/problem-guidance.jpg": "/images/generated/imagen-4_2025-08-19T16-42-39-727Z_Generate_a_lifestyle_illustration_representing_gui_1.png",
  "/images/generated/solution-coaching.jpg": "/images/generated/imagen-4_2025-08-19T16-43-04-110Z_Create_an_inspiring_lifestyle_image_representing_A_1.png",
  "/images/generated/solution-growth.jpg": "/images/generated/imagen-4_2025-08-19T16-43-26-197Z_Generate_an_empowering_lifestyle_image_showing_gra_1.png",
  "/images/generated/solution-connection.jpg": "/images/generated/solution-community-matching.jpg",
  // 追加修正（スクリーンショットで確認された問題）
  "/images/generated/problem-identity.jpg": "/images/generated/imagen-4_2025-08-19T16-41-07-773Z_Create_a_lifestyle_illustration_showing_lack_of_co_1.png",
  "/images/generated/problem-continuation.jpg": "/images/generated/imagen-4_2025-08-19T16-41-54-588Z_Create_a_lifestyle_illustration_showing_the_challe_1.png",
  "/images/generated/problem-guilt.jpg": "/images/generated/imagen-4_2025-08-19T16-42-39-727Z_Generate_a_lifestyle_illustration_representing_gui_1.png"
};

async function fixImagePaths() {
  const configPath = path.join(__dirname, '../configs/config.json');
  
  try {
    console.log('🔧 画像パスを修正します...');
    
    // config.json を読み込み
    const configData = await fs.readFile(configPath, 'utf8');
    let config = JSON.parse(configData);
    
    let fixed = 0;
    
    // 画像パスを再帰的に検索・置換
    function replaceImagePaths(obj) {
      if (typeof obj === 'string' && obj.startsWith('/images/generated/')) {
        if (IMAGE_MAPPINGS[obj]) {
          console.log(`✅ 修正: ${obj} → ${IMAGE_MAPPINGS[obj]}`);
          fixed++;
          return IMAGE_MAPPINGS[obj];
        }
      } else if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
          obj[key] = replaceImagePaths(obj[key]);
        }
      } else if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          obj[i] = replaceImagePaths(obj[i]);
        }
      }
      return obj;
    }
    
    // 画像パスを修正
    config = replaceImagePaths(config);
    
    // config.json に書き戻し
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    
    console.log(`\n✅ 修正完了！${fixed}個の画像パスを修正しました`);
    console.log('\n💡 次のステップ:');
    console.log('1. vercel --prod --yes で再デプロイ');
    console.log('2. https://ai-coach.unson.jp で画像が表示されることを確認');
    
  } catch (error) {
    console.error('❌ エラー:', error.message);
  }
}

fixImagePaths();