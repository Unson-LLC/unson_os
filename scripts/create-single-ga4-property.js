#!/usr/bin/env node

/**
 * 単一GA4プロパティ作成スクリプト
 * 新規LPサービス用にGA4プロパティとデータストリームを作成
 */

const { GoogleAuth } = require('google-auth-library');
const path = require('path');
const fs = require('fs');

// 必要なスコープ
const SCOPES = ['https://www.googleapis.com/auth/analytics.edit'];

// コマンドライン引数から設定を取得
const args = process.argv.slice(2);
if (args.length < 3) {
  console.log(`
使用方法:
  node create-single-ga4-property.js <サービス名> <表示名> <URL>

例:
  node create-single-ga4-property.js my-new-service "My New Service Analytics" "https://my-new-service.vercel.app"
`);
  process.exit(1);
}

const [serviceName, displayName, websiteUrl] = args;

class GA4PropertyCreator {
  constructor() {
    this.auth = null;
    this.serviceAccountKeyPath = path.join(__dirname, '..', 'google-service-account.json');
  }

  /**
   * Google認証初期化
   */
  async initializeAuth() {
    try {
      this.auth = new GoogleAuth({
        keyFile: this.serviceAccountKeyPath,
        scopes: SCOPES,
      });
      
      console.log('✅ Google認証初期化完了');
      return true;
    } catch (error) {
      console.error('❌ Google認証エラー:', error.message);
      return false;
    }
  }

  /**
   * アカウント一覧取得
   */
  async getAccounts() {
    try {
      const authClient = await this.auth.getClient();
      const response = await authClient.request({
        url: 'https://analyticsadmin.googleapis.com/v1alpha/accounts',
        method: 'GET'
      });

      if (response.data.accounts && response.data.accounts.length > 0) {
        return response.data.accounts;
      }
      return [];
    } catch (error) {
      console.error('❌ アカウント取得エラー:', error.message);
      return [];
    }
  }

  /**
   * GA4プロパティ作成
   */
  async createProperty(accountId) {
    try {
      const authClient = await this.auth.getClient();
      
      const propertyData = {
        displayName: displayName,
        timeZone: 'Asia/Tokyo',
        currencyCode: 'JPY',
        industryCategory: 'INDUSTRY_CATEGORY_UNSPECIFIED',
        parent: accountId
      };

      const response = await authClient.request({
        url: `https://analyticsadmin.googleapis.com/v1alpha/properties`,
        method: 'POST',
        data: propertyData
      });

      console.log(`✅ プロパティ作成成功: ${displayName}`);
      return response.data;
    } catch (error) {
      console.error(`❌ プロパティ作成エラー:`, error.message);
      if (error.response?.data) {
        console.error('詳細:', JSON.stringify(error.response.data, null, 2));
      }
      return null;
    }
  }

  /**
   * Webデータストリーム作成
   */
  async createWebDataStream(propertyId) {
    try {
      const authClient = await this.auth.getClient();
      
      const streamData = {
        type: 'WEB_DATA_STREAM',
        displayName: `${serviceName} Stream`,
        webStreamData: {
          defaultUri: websiteUrl
        }
      };

      const response = await authClient.request({
        url: `https://analyticsadmin.googleapis.com/v1alpha/${propertyId}/dataStreams`,
        method: 'POST',
        data: streamData
      });

      console.log(`✅ データストリーム作成成功`);
      return response.data;
    } catch (error) {
      console.error(`❌ データストリーム作成エラー:`, error.message);
      return null;
    }
  }

  /**
   * 環境変数ファイル作成
   */
  createEnvFile(propertyId, measurementId) {
    const envContent = `# Google Analytics 4
NEXT_PUBLIC_GA4_MEASUREMENT_ID=${measurementId}
GOOGLE_ANALYTICS_PROPERTY_ID=${propertyId}
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./google-service-account.json

# Microsoft Clarity (後で設定)
NEXT_PUBLIC_CLARITY_PROJECT_ID=
CLARITY_API_TOKEN=

# API Endpoint
NEXT_PUBLIC_API_URL=https://unsonos-api.vercel.app
NEXT_PUBLIC_DEFAULT_WORKSPACE_ID=unson_main
`;

    const envPath = path.join(__dirname, '..', 'services', serviceName, '.env.local');
    
    try {
      // サービスディレクトリ確認
      const serviceDir = path.join(__dirname, '..', 'services', serviceName);
      if (!fs.existsSync(serviceDir)) {
        console.log(`⚠️ サービスディレクトリが存在しません: ${serviceDir}`);
        console.log('📝 .env.local の内容を手動で設定してください:');
        console.log('─'.repeat(50));
        console.log(envContent);
        console.log('─'.repeat(50));
        return false;
      }

      fs.writeFileSync(envPath, envContent);
      console.log(`✅ .env.local作成完了: ${envPath}`);
      return true;
    } catch (error) {
      console.error(`❌ .env.local作成エラー:`, error.message);
      console.log('📝 手動で以下を設定してください:');
      console.log('─'.repeat(50));
      console.log(envContent);
      console.log('─'.repeat(50));
      return false;
    }
  }

  /**
   * 結果サマリー表示
   */
  displaySummary(propertyId, measurementId) {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 GA4プロパティ作成完了');
    console.log('='.repeat(60));
    console.log(`サービス名: ${serviceName}`);
    console.log(`表示名: ${displayName}`);
    console.log(`URL: ${websiteUrl}`);
    console.log(`プロパティID: ${propertyId}`);
    console.log(`測定ID: ${measurementId}`);
    console.log('='.repeat(60));

    console.log('\n📋 次のステップ:');
    console.log('1. Vercel環境変数設定:');
    console.log(`   vercel env add NEXT_PUBLIC_GA4_MEASUREMENT_ID production`);
    console.log(`   値: ${measurementId}`);
    console.log('\n2. デプロイ:');
    console.log(`   cd services/${serviceName} && vercel --prod`);
  }
}

/**
 * メイン実行関数
 */
async function main() {
  console.log(`\n🚀 GA4プロパティ作成: ${serviceName}\n`);
  
  const creator = new GA4PropertyCreator();
  
  // 認証初期化
  if (!(await creator.initializeAuth())) {
    process.exit(1);
  }

  // アカウント取得
  const accounts = await creator.getAccounts();
  if (accounts.length === 0) {
    console.log('❌ 利用可能なGA4アカウントがありません');
    process.exit(1);
  }

  const mainAccount = accounts[0];
  console.log(`使用アカウント: ${mainAccount.displayName}\n`);

  // プロパティ作成
  const property = await creator.createProperty(mainAccount.name);
  if (!property) {
    process.exit(1);
  }

  // データストリーム作成
  const dataStream = await creator.createWebDataStream(property.name);
  if (!dataStream) {
    process.exit(1);
  }

  const propertyId = property.name.split('/')[1];
  const measurementId = dataStream.webStreamData?.measurementId;

  // 環境変数ファイル作成
  creator.createEnvFile(propertyId, measurementId);

  // サマリー表示
  creator.displaySummary(propertyId, measurementId);
}

// スクリプト実行
if (require.main === module) {
  main().catch(console.error);
}

module.exports = GA4PropertyCreator;