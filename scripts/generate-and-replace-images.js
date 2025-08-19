#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * MCP Gemini画像生成とLP自動置換システム
 * 生成された画像をLPサービスに自動統合します
 */

class ImageGenerationOrchestrator {
  constructor() {
    this.generatedImagesDir = 'generated-images';
    this.supportedServices = ['ai-bridge', 'ai-stylist', 'ai-legacy-creator', 'ai-coach', 'mywa'];
  }

  /**
   * サービス用画像ディレクトリ作成
   */
  createImageDirectories(serviceName) {
    const servicePath = path.join('services', serviceName);
    const directories = [
      path.join(servicePath, 'public/images/generated'),
      path.join(servicePath, 'public/images/backup')
    ];

    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 ディレクトリ作成: ${dir}`);
      }
    });
  }

  /**
   * 画像生成プロンプトリストを生成
   */
  generateImagePrompts(serviceName) {
    const reportPath = path.join('services', serviceName, 'image-analysis-report.json');
    
    if (!fs.existsSync(reportPath)) {
      throw new Error(`画像分析レポートが見つかりません: ${reportPath}`);
    }

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    const prompts = [];

    report.detailedRequirements.forEach((req, index) => {
      const prompt = this.createDetailedPrompt(req, serviceName);
      prompts.push({
        id: `${serviceName}_${req.category}_${index + 1}`,
        category: req.category,
        filename: req.filename,
        prompt: prompt,
        outputPath: path.join('services', serviceName, 'public/images/generated', req.filename.replace('.svg', '.jpg')),
        priority: req.priority
      });
    });

    return prompts.sort((a, b) => {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * 詳細な画像生成プロンプトを作成
   */
  createDetailedPrompt(requirement, serviceName) {
    const basePrompts = {
      hero: `Create a professional hero background image (1200x600px) that represents ${requirement.theme}. The image should convey trust, innovation, and business professionalism. Use a corporate color palette with blues (#2563EB) and purples (#7C3AED). Include subtle elements suggesting intergenerational collaboration and AI technology. Style: clean, modern, business-focused, high-quality corporate imagery.`,
      
      problem: `Generate a clean, minimalist illustration (400x400px) representing the business challenge: "${requirement.theme}". The image should be simple, easily understandable, and convey the frustration or difficulty of this workplace issue. Use a professional color scheme with subtle blues and grays. Style: simplified business illustration, icon-like, clear visual metaphor.`,
      
      solution: `Create a positive, forward-looking image (500x400px) that represents the innovative solution: "${requirement.theme}". Show the benefits and transformation this solution brings. Use bright, optimistic colors while maintaining professionalism. Include subtle AI/technology elements. Style: modern, solution-oriented, inspiring, high-tech business imagery.`
    };

    const categoryPrompt = basePrompts[requirement.category] || basePrompts.hero;
    
    return `${categoryPrompt}

Context: ${requirement.context}
Service: ${serviceName} (AI-powered business solution)
Quality: Professional business use, web-optimized
Format: JPEG or PNG, suitable for web display
No text overlays or embedded text in the image.`;
  }

  /**
   * 画像生成ガイドを作成
   */
  createGenerationGuide(serviceName, prompts) {
    const guidePath = path.join('services', serviceName, 'image-generation-guide.md');
    
    let guide = `# ${serviceName} 画像生成ガイド

このガイドは、Claude DesktopのGemini MCPを使用して${serviceName}サービス用の画像を生成するためのものです。

## 生成手順

Claude Desktopを再起動後、以下のプロンプトを順番に実行してください：

`;

    prompts.forEach((promptConfig, index) => {
      guide += `### ${index + 1}. ${promptConfig.category}画像: ${path.basename(promptConfig.filename, '.svg')}

**優先度**: ${promptConfig.priority}
**出力ファイル名**: ${promptConfig.filename.replace('.svg', '.jpg')}
**保存先**: \`services/${serviceName}/public/images/generated/\`

**Claude Desktopでのプロンプト**:
\`\`\`
${promptConfig.prompt}

生成後、画像を services/${serviceName}/public/images/generated/${promptConfig.filename.replace('.svg', '.jpg')} として保存してください。
\`\`\`

---

`;
    });

    guide += `## 生成後の作業

1. **画像最適化**: 生成された画像のファイルサイズを確認し、必要に応じて最適化
2. **設定更新**: config.jsonの画像パスを新しい生成画像に更新
3. **バックアップ**: 既存のプレースホルダー画像をbackupディレクトリに移動
4. **テスト**: ローカル環境で画像表示を確認

## 生成完了チェックリスト

`;

    prompts.forEach((promptConfig, index) => {
      guide += `- [ ] ${promptConfig.category}: ${path.basename(promptConfig.filename, '.svg')}\n`;
    });

    guide += `
## トラブルシューティング

- **MCPが表示されない**: Claude Desktopを再起動
- **画像生成エラー**: Gemini APIキーが正しく設定されているか確認
- **画像サイズ**: 生成された画像のサイズが要件に合わない場合は、プロンプトでサイズを再指定

## 完了後

全ての画像が生成されたら、以下のコマンドで統合を完了：

\`\`\`bash
node scripts/integrate-generated-images.js ${serviceName}
\`\`\`
`;

    fs.writeFileSync(guidePath, guide);
    console.log(`📖 生成ガイド作成: ${guidePath}`);
    
    return guidePath;
  }

  /**
   * 画像統合スクリプトを作成
   */
  createIntegrationScript() {
    const integrationScript = `#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 生成画像をLPサービスに統合
 */
async function integrateGeneratedImages(serviceName) {
  const servicePath = path.join('services', serviceName);
  const generatedDir = path.join(servicePath, 'public/images/generated');
  const backupDir = path.join(servicePath, 'public/images/backup');
  const configPath = path.join(servicePath, 'configs/config.json');

  console.log(\`🔄 \${serviceName}の画像統合を開始...\`);

  // 設定ファイル読み込み
  if (!fs.existsSync(configPath)) {
    console.error('❌ 設定ファイルが見つかりません:', configPath);
    return false;
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  let updated = false;

  // 生成済み画像を確認
  if (fs.existsSync(generatedDir)) {
    const generatedImages = fs.readdirSync(generatedDir);
    console.log(\`📷 生成済み画像: \${generatedImages.length}枚\`);

    // config.jsonの画像パスを更新
    if (config.content?.hero?.backgroundImage && generatedImages.includes('hero-bridge.jpg')) {
      // 既存画像をバックアップ
      const originalPath = path.join(servicePath, 'public', config.content.hero.backgroundImage);
      if (fs.existsSync(originalPath)) {
        const backupPath = path.join(backupDir, 'original-hero-bridge.svg');
        fs.copyFileSync(originalPath, backupPath);
        console.log('💾 ヒーロー画像をバックアップ');
      }
      
      config.content.hero.backgroundImage = '/images/generated/hero-bridge.jpg';
      updated = true;
      console.log('✅ ヒーロー画像パス更新');
    }

    // 問題セクション画像更新
    if (config.content?.problem?.problems) {
      config.content.problem.problems.forEach((problem, index) => {
        const generatedFile = \`problem-\${index + 1}.jpg\`;
        if (generatedImages.includes(generatedFile)) {
          problem.image = \`/images/generated/\${generatedFile}\`;
          updated = true;
          console.log(\`✅ 問題画像\${index + 1}更新\`);
        }
      });
    }

    // 設定ファイル保存
    if (updated) {
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      console.log('💾 設定ファイル更新完了');
    }
  }

  console.log(\`🎉 \${serviceName}の画像統合完了!\`);
  return true;
}

// コマンドライン実行
const serviceName = process.argv[2];
if (!serviceName) {
  console.error('❌ サービス名を指定してください');
  console.log('使用方法: node integrate-generated-images.js <service-name>');
  process.exit(1);
}

integrateGeneratedImages(serviceName).catch(console.error);
`;

    const scriptPath = path.join('scripts', 'integrate-generated-images.js');
    fs.writeFileSync(scriptPath, integrationScript);
    console.log(`🔧 統合スクリプト作成: ${scriptPath}`);
    
    return scriptPath;
  }

  /**
   * メイン処理
   */
  async generate(serviceName) {
    try {
      console.log(`🎨 ${serviceName}の画像生成準備開始...`);
      
      // ディレクトリ作成
      this.createImageDirectories(serviceName);
      
      // プロンプト生成
      const prompts = this.generateImagePrompts(serviceName);
      console.log(`📋 ${prompts.length}個の画像生成プロンプトを準備`);
      
      // 生成ガイド作成
      const guidePath = this.createGenerationGuide(serviceName, prompts);
      
      // 統合スクリプト作成
      const integrationPath = this.createIntegrationScript();
      
      console.log(`\n🎉 ${serviceName}の画像生成準備完了！\n`);
      console.log(`📖 生成ガイド: ${guidePath}`);
      console.log(`🔧 統合スクリプト: ${integrationPath}`);
      console.log(`\n次の手順:`);
      console.log(`1. Claude Desktopで生成ガイドに従って画像を生成`);
      console.log(`2. 生成後: node scripts/integrate-generated-images.js ${serviceName}`);
      
      return {
        success: true,
        guidePath,
        integrationPath,
        promptCount: prompts.length
      };
      
    } catch (error) {
      console.error('❌ 画像生成準備エラー:', error.message);
      return { success: false, error: error.message };
    }
  }
}

// コマンドライン実行
async function main() {
  const orchestrator = new ImageGenerationOrchestrator();
  const serviceName = process.argv[2];
  
  if (!serviceName) {
    console.error('❌ エラー: サービス名を指定してください');
    console.log('使用方法: node generate-and-replace-images.js <service-name>');
    console.log('例: node generate-and-replace-images.js ai-bridge');
    process.exit(1);
  }

  const result = await orchestrator.generate(serviceName);
  
  if (!result.success) {
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ImageGenerationOrchestrator;