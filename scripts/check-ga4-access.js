#!/usr/bin/env node

/**
 * GA4アクセス権確認スクリプト
 * サービスアカウントの権限とアカウント状況を診断
 */

const { GoogleAuth } = require('google-auth-library');
const path = require('path');

const SCOPES = [
  'https://www.googleapis.com/auth/analytics.readonly',
  'https://www.googleapis.com/auth/analytics.edit'
];

class GA4AccessChecker {
  constructor() {
    this.auth = null;
    this.serviceAccountKeyPath = path.join(__dirname, '..', 'google-service-account.json');
  }

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

  async checkServiceAccountInfo() {
    try {
      const fs = require('fs');
      const serviceAccountData = JSON.parse(fs.readFileSync(this.serviceAccountKeyPath, 'utf8'));
      
      console.log('📋 サービスアカウント情報:');
      console.log(`   Email: ${serviceAccountData.client_email}`);
      console.log(`   Project ID: ${serviceAccountData.project_id}`);
      console.log(`   Type: ${serviceAccountData.type}`);
      
      return serviceAccountData;
    } catch (error) {
      console.error('❌ サービスアカウント情報読み取りエラー:', error.message);
      return null;
    }
  }

  async testAnalyticsAccess() {
    try {
      const authClient = await this.auth.getClient();
      
      console.log('\n🔍 GA4アカウントアクセステスト...');
      
      // アカウント一覧取得試行
      const accountResponse = await authClient.request({
        url: 'https://analyticsadmin.googleapis.com/v1alpha/accounts',
        method: 'GET'
      });

      if (accountResponse.data.accounts && accountResponse.data.accounts.length > 0) {
        console.log(`✅ ${accountResponse.data.accounts.length}個のGA4アカウントにアクセス可能`);
        
        accountResponse.data.accounts.forEach((account, index) => {
          console.log(`   ${index + 1}. ${account.displayName} (${account.name})`);
        });
        
        return accountResponse.data.accounts;
      } else {
        console.log('⚠️ アクセス可能なGA4アカウントが0個');
        return [];
      }
    } catch (error) {
      console.error('❌ GA4アクセステストエラー:', error.message);
      
      if (error.response?.data) {
        console.error('詳細:', JSON.stringify(error.response.data, null, 2));
      }
      
      return null;
    }
  }

  async checkAPIStatus() {
    try {
      const authClient = await this.auth.getClient();
      
      console.log('\n🔍 API状況確認...');
      
      // プロジェクト情報取得
      const projectResponse = await authClient.request({
        url: 'https://cloudresourcemanager.googleapis.com/v1/projects/unsonos',
        method: 'GET'
      });
      
      console.log('✅ プロジェクト情報取得成功');
      console.log(`   プロジェクト名: ${projectResponse.data.name}`);
      console.log(`   プロジェクトID: ${projectResponse.data.projectId}`);
      
    } catch (error) {
      console.error('❌ API状況確認エラー:', error.message);
    }
  }

  displayTroubleshootingGuide(accounts) {
    console.log('\n' + '='.repeat(60));
    console.log('🔧 トラブルシューティングガイド');
    console.log('='.repeat(60));
    
    if (!accounts || accounts.length === 0) {
      console.log('\n❌ 問題: GA4アカウントへのアクセス権なし');
      console.log('\n📋 解決手順:');
      console.log('1. Google Analytics (analytics.google.com) にアクセス');
      console.log('2. 管理 → アカウントアクセス管理');
      console.log('3. ユーザーを追加:');
      console.log('   メール: unson-analytics-reader@unsonos.iam.gserviceaccount.com');
      console.log('   役割: 管理者 または 編集者');
      console.log('4. 保存後、5-10分待機');
      console.log('5. スクリプト再実行');
      
      console.log('\n🔗 詳細手順:');
      console.log('https://support.google.com/analytics/answer/1009702');
      
    } else {
      console.log('\n✅ GA4アカウントアクセス権OK');
      console.log('プロパティ作成準備完了');
    }
  }
}

async function main() {
  console.log('🔍 GA4アクセス権診断スクリプト開始\n');
  
  const checker = new GA4AccessChecker();
  
  // 1. サービスアカウント情報確認
  const serviceAccountInfo = await checker.checkServiceAccountInfo();
  if (!serviceAccountInfo) return;
  
  // 2. 認証初期化
  if (!(await checker.initializeAuth())) return;
  
  // 3. API状況確認
  await checker.checkAPIStatus();
  
  // 4. GA4アクセステスト
  const accounts = await checker.testAnalyticsAccess();
  
  // 5. トラブルシューティングガイド表示
  checker.displayTroubleshootingGuide(accounts);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = GA4AccessChecker;