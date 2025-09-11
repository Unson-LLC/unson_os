// 統合テスト: LP生成とコンバージョン自動化
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { generateFullLP, LPGenerationPrompt } from '../../lib/lp-generator';
import * as fs from 'fs';
import * as path from 'path';

describe('LP Conversion Automation Integration', () => {
  const testProductPath = './test-integration-product';
  const testEnvPath = path.join(testProductPath, '.env.local');

  beforeEach(() => {
    // テスト用ディレクトリのクリーンアップ
    if (fs.existsSync(testProductPath)) {
      fs.rmSync(testProductPath, { recursive: true, force: true });
    }
    fs.mkdirSync(testProductPath, { recursive: true });
  });

  afterEach(() => {
    // テスト後のクリーンアップ
    if (fs.existsSync(testProductPath)) {
      fs.rmSync(testProductPath, { recursive: true, force: true });
    }
  });

  it('should generate LP with automatic conversion setup', async () => {
    const prompt: LPGenerationPrompt = {
      serviceName: 'テストサービス',
      serviceDescription: '革新的なAIソリューションでビジネスを変革',
      targetAudience: '中小企業経営者',
      mainBenefit: '業務効率を70%向上',
      autoSetupConversion: true,
      productPath: testProductPath
    };

    const result = await generateFullLP(prompt);

    // 基本的なLP生成の検証
    expect(result.success).toBe(true);
    expect(result.config).toBeDefined();
    expect(result.config?.meta?.title).toContain('テストサービス');

    // 自動設定の検証
    expect(result.autoSetup).toBeDefined();
    expect(result.autoSetup?.success).toBe(true);
    expect(result.autoSetup?.conversionLabel).toBe('zINmCPbAtIMbENy46vdA');
    
    // .env.localファイルの存在確認
    expect(fs.existsSync(testEnvPath)).toBe(true);
    
    // 設定内容の確認
    const envContent = fs.readFileSync(testEnvPath, 'utf-8');
    expect(envContent).toContain('NEXT_PUBLIC_GOOGLE_ADS_ID=AW-17431174236');
    expect(envContent).toContain('NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=zINmCPbAtIMbENy46vdA');
  });

  it('should handle automatic setup disabled', async () => {
    const prompt: LPGenerationPrompt = {
      serviceName: 'シンプルサービス',
      serviceDescription: 'シンプルなソリューション',
      targetAudience: 'テストユーザー',
      mainBenefit: 'テスト効果',
      autoSetupConversion: false // 自動設定無効
    };

    const result = await generateFullLP(prompt);

    expect(result.success).toBe(true);
    expect(result.autoSetup).toBeUndefined();
    expect(fs.existsSync(testEnvPath)).toBe(false); // .env.localは作成されない
  });

  it('should handle missing product path gracefully', async () => {
    const prompt: LPGenerationPrompt = {
      serviceName: 'エラーテストサービス',
      serviceDescription: 'パスなしテスト',
      targetAudience: 'テストユーザー',
      mainBenefit: 'テスト効果',
      autoSetupConversion: true
      // productPath未設定
    };

    const result = await generateFullLP(prompt);

    expect(result.success).toBe(true); // LP生成自体は成功
    expect(result.errors.length).toBeGreaterThan(0); // エラーが記録される
    expect(result.errors.some(error => error.includes('Product path'))).toBe(true);
  });

  it('should validate conversion settings correctly', async () => {
    const prompt: LPGenerationPrompt = {
      serviceName: 'バリデーションテスト',
      serviceDescription: 'バリデーション用サービス',
      targetAudience: 'テストユーザー',
      mainBenefit: 'テスト効果',
      autoSetupConversion: true,
      productPath: testProductPath
    };

    const result = await generateFullLP(prompt);

    expect(result.autoSetup?.validationResults).toBeDefined();
    
    // 必須フィールドが正しく設定されていることを確認
    const validationResults = result.autoSetup?.validationResults || [];
    const conversionLabelValidation = validationResults.find(v => 
      v.field === 'NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL'
    );
    
    expect(conversionLabelValidation?.isValid).toBe(true);
  });
});