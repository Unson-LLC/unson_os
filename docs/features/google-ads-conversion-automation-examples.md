# Google Ads コンバージョン自動化 - 実用例とクイックスタート

> 実際の開発シナリオに基づいた具体的な使用例

## 🚀 クイックスタート

### 1. 新規マイクロSaaSのLP作成

最も一般的なユースケース：新しいマイクロSaaSプロダクトのLP生成

```typescript
import { generateFullLP } from '@/lib/lp-generator';

// ✅ 推奨：自動設定を有効にした完全な例
const result = await generateFullLP({
  serviceName: 'TaskFlow AI',
  serviceDescription: 'AIによるタスク管理の革新的ソリューション',
  targetAudience: 'プロジェクトマネージャー・チームリーダー',
  mainBenefit: 'チーム生産性を3倍向上させる',
  
  // 自動設定を有効化
  autoSetupConversion: true,
  productPath: './products/2-validation/2025-09-001-taskflow-ai/lp'
});

console.log('📊 結果:');
console.log(`LP生成: ${result.success ? '✅ 成功' : '❌ 失敗'}`);
console.log(`自動設定: ${result.autoSetup?.success ? '✅ 完了' : '❌ 失敗'}`);
console.log(`コンバージョンラベル: ${result.autoSetup?.conversionLabel}`);
```

### 2. 既存プロダクトのコンバージョン設定修正

Phase 1で修正した6つのプロダクトのような、既存設定の更新：

```typescript
import { LPEnvironmentConfigurator } from '@/lib/env-auto-configurator';
import { GoogleAdsConversionManager } from '@/tools/google-ads-conversion-manager';

// 既存プロダクトの設定修正
async function fixExistingProduct(productPath: string) {
  console.log(`🔧 修正中: ${productPath}`);
  
  // 1. 最新の共通ラベルを取得
  const manager = new GoogleAdsConversionManager();
  const correctLabel = await manager.getSharedConversionLabel();
  
  // 2. 設定を更新
  const configurator = new LPEnvironmentConfigurator();
  await configurator.updateConversionSettings(productPath, correctLabel);
  
  // 3. 設定を検証
  const validation = await configurator.validateLPConfiguration(productPath);
  const errors = validation.filter(v => !v.isValid && v.severity === 'error');
  
  console.log(`✅ ラベル更新: ${correctLabel}`);
  console.log(`🔍 検証結果: ${errors.length === 0 ? '問題なし' : `${errors.length}件のエラー`}`);
  
  return { success: errors.length === 0, validationResults: validation };
}

// 実際の使用例
const products = [
  './products/2-validation/2025-08-005-ai-stylist/lp',
  './products/2-validation/2025-08-003-ai-coach/lp'
];

for (const productPath of products) {
  await fixExistingProduct(productPath);
}
```

## 📝 実開発シナリオ

### シナリオ1: 新規プロダクト開発

**状況**: 新しいマイクロSaaSのアイデアをLP化してMVP検証を開始したい

```typescript
// ステップ1: プロダクト情報の準備
const productInfo = {
  serviceName: 'CodeReview AI',
  serviceDescription: 'AIによる自動コードレビューで開発品質を向上',
  targetAudience: 'ソフトウェア開発チーム',
  mainBenefit: 'コードレビュー時間を80%短縮',
  pricing: 'フリーミアム（月額2980円〜）',
  brandTone: '技術的で信頼できる'
};

// ステップ2: 開発ディレクトリの準備
const productPath = './products/2-validation/2025-09-002-codereview-ai/lp';
await fs.promises.mkdir(productPath, { recursive: true });

// ステップ3: LP生成 + 自動設定
const result = await generateFullLP({
  ...productInfo,
  autoSetupConversion: true,
  productPath
});

// ステップ4: 結果の確認と次のアクション
if (result.success && result.autoSetup?.success) {
  console.log('🎉 セットアップ完了！次のステップ:');
  console.log('1. LP Suiteでプレビュー確認');
  console.log('2. Google Adsキャンペーン作成');
  console.log('3. A/Bテスト開始');
} else {
  console.error('❌ セットアップに問題があります');
  console.log('エラー:', result.errors);
}
```

### シナリオ2: 既存プロダクトの設定診断

**状況**: 既存のプロダクトでコンバージョンが計測されていない問題を調査

```typescript
async function diagnoseConversionIssues(productPath: string) {
  console.log(`🔍 診断開始: ${productPath}`);
  
  // 1. 現在の設定を検証
  const configurator = new LPEnvironmentConfigurator();
  const validation = await configurator.validateLPConfiguration(productPath);
  
  // 2. 問題の分類
  const critical = validation.filter(v => !v.isValid && v.severity === 'error');
  const warnings = validation.filter(v => v.severity === 'warning');
  const info = validation.filter(v => v.isValid && v.severity === 'info');
  
  console.log('📊 診断結果:');
  console.log(`❌ 重大な問題: ${critical.length}件`);
  console.log(`⚠️  警告: ${warnings.length}件`);
  console.log(`ℹ️  情報: ${info.length}件`);
  
  // 3. 具体的な問題を表示
  critical.forEach(issue => {
    console.log(`🚨 ${issue.field}: ${issue.message}`);
  });
  
  // 4. 自動修正の提案
  if (critical.length > 0) {
    console.log('\n🔧 自動修正を実行しますか？');
    
    const manager = new GoogleAdsConversionManager();
    const correctLabel = await manager.getSharedConversionLabel();
    
    console.log(`推奨アクション: ラベルを ${correctLabel} に更新`);
    
    // 実際の修正（確認後）
    // await configurator.updateConversionSettings(productPath, correctLabel);
  }
  
  return { critical, warnings, info };
}

// 使用例
await diagnoseConversionIssues('./products/4-active/2025-08-001-mywa/lp');
```

### シナリオ3: 一括設定更新

**状況**: 複数のプロダクトを一度にアップデートしたい

```typescript
async function batchUpdateConversions(productPaths: string[]) {
  const manager = new GoogleAdsConversionManager();
  const configurator = new LPEnvironmentConfigurator();
  
  // 最新の共通ラベルを1回だけ取得
  const sharedLabel = await manager.getSharedConversionLabel();
  console.log(`🎯 使用するラベル: ${sharedLabel}`);
  
  const results = [];
  
  for (const productPath of productPaths) {
    console.log(`\n📝 処理中: ${productPath}`);
    
    try {
      // 1. 現在の設定をバックアップ（オプション）
      const backupPath = `${productPath}/.env.local.backup-${Date.now()}`;
      if (fs.existsSync(`${productPath}/.env.local`)) {
        fs.copyFileSync(`${productPath}/.env.local`, backupPath);
        console.log(`📋 バックアップ作成: ${backupPath}`);
      }
      
      // 2. 設定を更新
      await configurator.updateConversionSettings(productPath, sharedLabel);
      
      // 3. 更新を検証
      const validation = await configurator.validateLPConfiguration(productPath);
      const hasErrors = validation.some(v => !v.isValid && v.severity === 'error');
      
      results.push({
        path: productPath,
        success: !hasErrors,
        issues: hasErrors ? validation.filter(v => !v.isValid) : []
      });
      
      console.log(`${!hasErrors ? '✅' : '❌'} ${productPath}`);
      
    } catch (error) {
      console.error(`❌ エラー - ${productPath}:`, error);
      results.push({
        path: productPath,
        success: false,
        error: error.message
      });
    }
  }
  
  // 4. 結果サマリー
  const successful = results.filter(r => r.success).length;
  console.log(`\n📊 更新完了: ${successful}/${productPaths.length}件成功`);
  
  return results;
}

// 使用例：既存の全プロダクトを更新
const allProducts = [
  './products/4-active/2025-08-001-mywa/lp',
  './products/2-validation/2025-08-005-ai-stylist/lp',
  './products/2-validation/2025-08-003-ai-coach/lp',
  './products/2-validation/2025-08-002-ai-bridge/lp',
  './products/2-validation/2025-08-004-ai-legacy-creator/lp'
];

const updateResults = await batchUpdateConversions(allProducts);
```

## 🔧 高度な使用例

### カスタムMCPクライアント統合

独自のGoogle Ads MCP設定がある場合：

```typescript
import { GoogleAdsConversionManager } from '@/tools/google-ads-conversion-manager';

// カスタムMCPクライアントの実装
class CustomGoogleAdsMcpClient {
  async execute(toolName: string, params: any) {
    // 独自の実装
    if (toolName === 'mcp__googleads__execute-gaql-query') {
      // カスタムAPI呼び出し
      return await this.callCustomGoogleAdsAPI(params);
    }
    throw new Error(`Unknown tool: ${toolName}`);
  }
  
  private async callCustomGoogleAdsAPI(params: any) {
    // 実装詳細...
  }
}

// カスタムクライアントを使用
const customClient = new CustomGoogleAdsMcpClient();
const manager = new GoogleAdsConversionManager(
  customClient,
  // カスタムCustomer ID (オプション)
  1234567890,
  1234567890
);

const labels = await manager.getActiveConversionLabels();
console.log('カスタム取得結果:', labels);
```

### 環境別設定管理

開発・ステージング・本番環境での使い分け：

```typescript
interface EnvironmentConfig {
  googleAdsId: string;
  conversionLabel: string;
  apiUrl: string;
}

const environments: Record<string, EnvironmentConfig> = {
  development: {
    googleAdsId: 'AW-DEV-12345',
    conversionLabel: 'dev_test_conversion',
    apiUrl: 'http://localhost:3000'
  },
  staging: {
    googleAdsId: 'AW-STAGE-67890',
    conversionLabel: 'staging_conversion_label',
    apiUrl: 'https://staging.unsonos.com'
  },
  production: {
    googleAdsId: 'AW-17431174236',
    conversionLabel: 'zINmCPbAtIMbENy46vdA',
    apiUrl: 'https://unsonos-api.vercel.app'
  }
};

async function setupEnvironmentSpecificConfig(
  productPath: string, 
  environment: keyof typeof environments = 'production'
) {
  const config = environments[environment];
  const configurator = new LPEnvironmentConfigurator();
  
  // 環境固有の設定を適用
  await configurator.updateConversionSettings(productPath, config.conversionLabel);
  
  console.log(`🌍 ${environment}環境用設定を適用完了`);
}
```

## ❓ FAQ・トラブルシューティング

### Q1: 自動設定が失敗する場合は？

```typescript
const result = await generateFullLP({
  // ... 基本設定
  autoSetupConversion: true,
  productPath: './my-product/lp'
});

if (!result.autoSetup?.success) {
  console.log('❌ 自動設定失敗の理由:');
  result.autoSetup?.errors.forEach(error => {
    console.log(`- ${error}`);
  });
  
  // 手動で設定を適用
  const configurator = new LPEnvironmentConfigurator();
  await configurator.updateConversionSettings(
    './my-product/lp',
    'zINmCPbAtIMbENy46vdA' // フォールバック値
  );
}
```

### Q2: 既存の.env.localを保護したい場合は？

```typescript
// バックアップを作成してから更新
const backupAndUpdate = async (productPath: string, newLabel: string) => {
  const envPath = `${productPath}/.env.local`;
  const backupPath = `${envPath}.backup-${Date.now()}`;
  
  if (fs.existsSync(envPath)) {
    // バックアップ作成
    fs.copyFileSync(envPath, backupPath);
    console.log(`📋 バックアップ: ${backupPath}`);
  }
  
  // 更新実行
  const configurator = new LPEnvironmentConfigurator();
  await configurator.updateConversionSettings(productPath, newLabel);
  
  console.log('✅ 更新完了（バックアップ保存済み）');
};
```

### Q3: 設定を段階的にロールアウトしたい場合は？

```typescript
// 段階的ロールアウト
const phaseRollout = async (productGroups: string[][]) => {
  for (let phase = 0; phase < productGroups.length; phase++) {
    console.log(`\n📈 Phase ${phase + 1} 開始 (${productGroups[phase].length}件)`);
    
    for (const productPath of productGroups[phase]) {
      await fixExistingProduct(productPath);
      
      // フェーズ間で少し待機
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`✅ Phase ${phase + 1} 完了`);
    
    // 次フェーズ前に確認
    if (phase < productGroups.length - 1) {
      console.log('⏸️  次のフェーズまで30秒待機中...');
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
  }
};

// 使用例：リスクの低いものから段階的に
const rolloutPhases = [
  // Phase 1: 検証中プロダクト
  ['./products/2-validation/2025-08-005-ai-stylist/lp'],
  
  // Phase 2: その他の検証中プロダクト
  [
    './products/2-validation/2025-08-003-ai-coach/lp',
    './products/2-validation/2025-08-002-ai-bridge/lp'
  ],
  
  // Phase 3: アクティブプロダクト
  ['./products/4-active/2025-08-001-mywa/lp']
];

await phaseRollout(rolloutPhases);
```

---

**💡 ヒント**: 本番環境での使用前は必ずステージング環境でテストし、設定のバックアップを取ることをお勧めします。

**🔗 関連ドキュメント**: [Google Ads コンバージョン自動化システム](./google-ads-conversion-automation.md)