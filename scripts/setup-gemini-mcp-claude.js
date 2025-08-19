#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Gemini MCP Claude Desktop セットアップスクリプト
 * Claude DesktopにGemini画像生成MCPを設定します
 */

class GeminiMCPSetup {
  constructor() {
    this.configPaths = {
      darwin: path.join(os.homedir(), 'Library/Application Support/Claude/claude_desktop_config.json'),
      win32: path.join(os.homedir(), 'AppData/Roaming/Claude/claude_desktop_config.json'),
      linux: path.join(os.homedir(), '.config/Claude/claude_desktop_config.json')
    };
  }

  /**
   * Claude Desktop設定ファイルのパスを取得
   */
  getConfigPath() {
    const platform = os.platform();
    const configPath = this.configPaths[platform];
    
    if (!configPath) {
      throw new Error(`サポートされていないプラットフォーム: ${platform}`);
    }
    
    return configPath;
  }

  /**
   * 既存設定を読み込み
   */
  loadExistingConfig(configPath) {
    if (fs.existsSync(configPath)) {
      try {
        const config = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(config);
      } catch (error) {
        console.warn(`⚠️  既存設定の読み込みに失敗: ${error.message}`);
        return {};
      }
    }
    return {};
  }

  /**
   * Gemini MCP設定を作成
   */
  createGeminiMCPConfig(apiKey) {
    return {
      mcpServers: {
        "gemini-image-generator": {
          command: "npx",
          args: [
            "-y",
            "gemini-imagen-mcp-server",
            "--model", "imagen-4-ultra",
            "--batch",
            "--max-batch-size", "4"
          ],
          env: {
            GEMINI_API_KEY: apiKey
          }
        },
        "gemini-basic": {
          command: "npx", 
          args: ["-y", "github:sanxfxteam/gemini-mcp-server"],
          env: {
            GEMINI_API_KEY: apiKey
          }
        }
      }
    };
  }

  /**
   * 設定をマージ
   */
  mergeConfigs(existingConfig, newConfig) {
    const merged = { ...existingConfig };
    
    if (!merged.mcpServers) {
      merged.mcpServers = {};
    }
    
    // 既存のmcpServersとマージ
    Object.assign(merged.mcpServers, newConfig.mcpServers);
    
    return merged;
  }

  /**
   * 設定ファイルを保存
   */
  saveConfig(configPath, config) {
    // ディレクトリが存在しない場合は作成
    const configDir = path.dirname(configPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
      console.log(`📁 設定ディレクトリを作成: ${configDir}`);
    }

    // 設定をJSONファイルに保存
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`✅ 設定を保存: ${configPath}`);
  }

  /**
   * Claude Desktopの再起動を促す
   */
  promptRestart() {
    console.log('\n🔄 重要: 設定を有効にするには Claude Desktop を再起動してください');
    console.log('   1. Claude Desktop を完全に終了');
    console.log('   2. Claude Desktop を再起動');
    console.log('   3. 画像生成ツールが利用可能になります');
  }

  /**
   * 使用方法を表示
   */
  showUsageGuide() {
    console.log('\n📖 使用方法:');
    console.log('Claude Desktop再起動後、以下のように画像生成を依頼できます:');
    console.log('');
    console.log('例: "AI世代間ブリッジのヒーロー画像を生成してください。プロフェッショナルで信頼感があり、世代間コラボレーションを表現した1200x600のビジネス向け画像をお願いします。"');
    console.log('');
    console.log('🎯 利用可能な機能:');
    console.log('- 複数画像の同時生成（バッチ処理）');
    console.log('- 高品質Imagen 4 Ultraモデル'); 
    console.log('- カスタムスタイルと構成指定');
    console.log('- ネガティブプロンプト対応');
  }

  /**
   * APIキー検証
   */
  validateApiKey(apiKey) {
    if (!apiKey || apiKey.length < 10) {
      throw new Error('有効なGemini APIキーが必要です');
    }
    
    if (!apiKey.startsWith('AI')) {
      console.warn('⚠️  Gemini APIキーは通常"AI"で始まります。正しいキーであることを確認してください。');
    }
  }

  /**
   * メイン設定処理
   */
  async setup(apiKey) {
    try {
      console.log('🚀 Gemini MCP Claude Desktop セットアップ開始...');
      
      // APIキー検証
      this.validateApiKey(apiKey);
      
      // 設定パス取得
      const configPath = this.getConfigPath();
      console.log(`📍 設定ファイル: ${configPath}`);
      
      // 既存設定読み込み
      const existingConfig = this.loadExistingConfig(configPath);
      console.log('📂 既存設定を読み込み');
      
      // 新しい設定作成
      const newConfig = this.createGeminiMCPConfig(apiKey);
      
      // 設定マージ
      const mergedConfig = this.mergeConfigs(existingConfig, newConfig);
      
      // 設定保存
      this.saveConfig(configPath, mergedConfig);
      
      // 完了メッセージ
      console.log('\n🎉 Gemini MCP設定が完了しました！');
      
      // 再起動プロンプト
      this.promptRestart();
      
      // 使用方法
      this.showUsageGuide();
      
      return true;
      
    } catch (error) {
      console.error('❌ セットアップエラー:', error.message);
      return false;
    }
  }

  /**
   * 設定確認
   */
  checkConfig() {
    try {
      const configPath = this.getConfigPath();
      
      if (!fs.existsSync(configPath)) {
        console.log('❌ Claude Desktop設定ファイルが見つかりません');
        return false;
      }
      
      const config = this.loadExistingConfig(configPath);
      
      if (config.mcpServers && (config.mcpServers['gemini-image-generator'] || config.mcpServers['gemini-basic'])) {
        console.log('✅ Gemini MCP設定が見つかりました');
        console.log('📋 設定されているサーバー:');
        
        Object.keys(config.mcpServers).forEach(serverName => {
          if (serverName.includes('gemini')) {
            console.log(`   - ${serverName}`);
          }
        });
        
        return true;
      } else {
        console.log('❌ Gemini MCP設定が見つかりません');
        return false;
      }
      
    } catch (error) {
      console.error('❌ 設定確認エラー:', error.message);
      return false;
    }
  }

  /**
   * 設定削除
   */
  removeConfig() {
    try {
      const configPath = this.getConfigPath();
      const config = this.loadExistingConfig(configPath);
      
      if (config.mcpServers) {
        delete config.mcpServers['gemini-image-generator'];
        delete config.mcpServers['gemini-basic'];
        
        this.saveConfig(configPath, config);
        console.log('✅ Gemini MCP設定を削除しました');
        this.promptRestart();
        
        return true;
      } else {
        console.log('⚠️  削除する設定が見つかりません');
        return false;
      }
      
    } catch (error) {
      console.error('❌ 設定削除エラー:', error.message);
      return false;
    }
  }
}

// コマンドライン実行
async function main() {
  const setup = new GeminiMCPSetup();
  const command = process.argv[2];
  const apiKey = process.argv[3];
  
  switch (command) {
    case 'setup':
      if (!apiKey) {
        console.error('❌ エラー: Gemini APIキーが必要です');
        console.log('使用方法: node setup-gemini-mcp-claude.js setup YOUR_GEMINI_API_KEY');
        process.exit(1);
      }
      await setup.setup(apiKey);
      break;
      
    case 'check':
      setup.checkConfig();
      break;
      
    case 'remove':
      setup.removeConfig();
      break;
      
    default:
      console.log('🔧 Gemini MCP Claude Desktop セットアップツール\n');
      console.log('使用方法:');
      console.log('  setup <api-key>  - Gemini MCPを設定');
      console.log('  check            - 現在の設定を確認');
      console.log('  remove           - Gemini MCP設定を削除');
      console.log('\n例:');
      console.log('  node setup-gemini-mcp-claude.js setup AIza...');
      console.log('  node setup-gemini-mcp-claude.js check');
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = GeminiMCPSetup;