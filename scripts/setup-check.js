#!/usr/bin/env node

console.log('🔍 Unson OS セットアップチェック\n');

// 環境変数チェック
const requiredEnvVars = [
  'NEXT_PUBLIC_CONVEX_URL',
  'RESEND_API_KEY',
  'ADMIN_EMAIL',
  'DISCORD_INVITE_LINK'
];

console.log('📋 環境変数チェック:');
let allEnvVarsSet = true;

requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar}: 設定済み`);
  } else {
    console.log(`❌ ${envVar}: 未設定`);
    allEnvVarsSet = false;
  }
});

console.log('\n📦 パッケージチェック:');
try {
  require('convex/server');
  console.log('✅ Convex: インストール済み');
} catch {
  console.log('❌ Convex: 未インストール');
}

try {
  require('resend');
  console.log('✅ Resend: インストール済み');
} catch {
  console.log('❌ Resend: 未インストール');
}

console.log('\n📁 必要なファイルチェック:');
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'convex/schema.ts',
  'convex/discordApplications.ts',
  '.env.local'
];

requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}: 存在`);
  } else {
    console.log(`❌ ${file}: 不足`);
  }
});

if (!allEnvVarsSet) {
  console.log('\n⚠️  .env.localファイルに必要な環境変数を設定してください。');
  console.log('.env.local.exampleを参考にしてください。');
}

console.log('\n🚀 セットアップ手順:');
console.log('1. npx convex dev でConvexプロジェクトを作成');
console.log('2. Resendでアカウント作成とAPIキー取得');
console.log('3. .env.localに環境変数を設定');
console.log('4. npm run dev で開発サーバーを起動');