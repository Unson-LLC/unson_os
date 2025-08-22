import { config } from 'dotenv';
import { z } from 'zod';
import path from 'path';
import fs from 'fs';

/**
 * 環境変数を階層的に読み込む
 * 優先順位: ローカル > 本番 > アプリ固有 > 共通
 */
export function loadEnv(options?: { 
  appPath?: string;
  verbose?: boolean;
}) {
  const { appPath = process.cwd(), verbose = false } = options || {};
  
  // 読み込む環境変数ファイルのリスト（優先順位順）
  const envFiles = [
    // 1. アプリのローカル設定（最優先）
    path.join(appPath, '.env.local'),
    
    // 2. アプリの環境別設定
    process.env.NODE_ENV === 'production' 
      ? path.join(appPath, '.env.production')
      : path.join(appPath, '.env.development'),
    
    // 3. アプリのデフォルト設定
    path.join(appPath, '.env'),
    
    // 4. モノレポのローカル設定
    path.join(appPath, '../../.env.local'),
    
    // 5. モノレポの共通設定
    path.join(appPath, '../../.env.shared'),
  ];

  const loadedFiles: string[] = [];
  
  envFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      config({ path: filePath });
      loadedFiles.push(filePath);
      if (verbose) {
        console.log(`✅ Loaded: ${path.relative(process.cwd(), filePath)}`);
      }
    }
  });

  if (verbose) {
    console.log(`\n📁 Environment files loaded (${loadedFiles.length}):`);
    loadedFiles.forEach(file => {
      console.log(`  - ${path.relative(process.cwd(), file)}`);
    });
  }

  return loadedFiles;
}

/**
 * 共通環境変数スキーマ
 */
export const sharedEnvSchema = z.object({
  // インフラ
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  AWS_REGION: z.string().default('ap-northeast-1'),
  ROOT_DOMAIN: z.string().default('unson.jp'),
  
  // Convex
  CONVEX_URL: z.string().url(),
  NEXT_PUBLIC_CONVEX_URL: z.string().url(),
  
  // 組織
  ADMIN_EMAIL: z.string().email(),
  SUPPORT_EMAIL: z.string().email().optional(),
  
  // Discord
  DISCORD_SERVER_ID: z.string().optional(),
  DISCORD_INVITE_LINK: z.string().url().optional(),
});

/**
 * アプリ固有の環境変数スキーマを作成
 */
export function createAppEnvSchema<T extends z.ZodRawShape>(
  appSchema: T
) {
  return sharedEnvSchema.extend(appSchema);
}

/**
 * 環境変数をバリデーション
 */
export function validateEnv<T extends z.ZodObject<any>>(
  schema: T,
  options?: {
    onError?: (error: z.ZodError) => void;
    throwOnError?: boolean;
  }
): z.infer<T> | null {
  const { onError, throwOnError = true } = options || {};
  
  const parsed = schema.safeParse(process.env);
  
  if (!parsed.success) {
    const errorMessage = formatZodError(parsed.error);
    console.error('❌ Environment validation failed:\n', errorMessage);
    
    if (onError) {
      onError(parsed.error);
    }
    
    if (throwOnError) {
      throw new Error('Environment validation failed. Check the logs above.');
    }
    
    return null;
  }
  
  return parsed.data;
}

/**
 * Zodエラーを読みやすくフォーマット
 */
function formatZodError(error: z.ZodError): string {
  const issues = error.issues.map(issue => {
    const path = issue.path.join('.');
    const message = issue.message;
    
    switch (issue.code) {
      case 'invalid_type':
        return `  ❌ ${path}: Expected ${issue.expected}, got ${issue.received}`;
      case 'invalid_enum_value':
        return `  ❌ ${path}: Invalid value. Expected one of: ${issue.options.join(', ')}`;
      case 'too_small':
        return `  ❌ ${path}: Value too small (min: ${issue.minimum})`;
      case 'too_big':
        return `  ❌ ${path}: Value too big (max: ${issue.maximum})`;
      default:
        return `  ❌ ${path}: ${message}`;
    }
  });
  
  return issues.join('\n');
}

/**
 * 環境変数の使用状況を分析
 */
export function analyzeEnvUsage(options?: {
  showUnused?: boolean;
  showMissing?: boolean;
}) {
  const { showUnused = true, showMissing = true } = options || {};
  
  const defined = Object.keys(process.env).filter(key => 
    !key.startsWith('npm_') && 
    !key.startsWith('NODE_') &&
    key !== 'PATH' &&
    key !== 'HOME' &&
    key !== 'USER'
  );
  
  const analysis = {
    total: defined.length,
    public: defined.filter(k => k.startsWith('NEXT_PUBLIC_')).length,
    aws: defined.filter(k => k.startsWith('AWS_')).length,
    google: defined.filter(k => k.startsWith('GOOGLE_')).length,
    discord: defined.filter(k => k.startsWith('DISCORD_')).length,
    custom: defined.filter(k => 
      !k.startsWith('NEXT_PUBLIC_') &&
      !k.startsWith('AWS_') &&
      !k.startsWith('GOOGLE_') &&
      !k.startsWith('DISCORD_')
    ).length,
  };
  
  console.log('\n📊 Environment Variables Analysis:');
  console.log(`  Total: ${analysis.total}`);
  console.log(`  Public (NEXT_PUBLIC_*): ${analysis.public}`);
  console.log(`  AWS: ${analysis.aws}`);
  console.log(`  Google: ${analysis.google}`);
  console.log(`  Discord: ${analysis.discord}`);
  console.log(`  Custom: ${analysis.custom}`);
  
  return analysis;
}

/**
 * 開発環境用: 環境変数の設定状況を表示
 */
export function debugEnv(filter?: string) {
  console.log('\n🔍 Environment Variables Debug:');
  console.log('================================');
  
  const envVars = Object.entries(process.env)
    .filter(([key]) => {
      if (filter) {
        return key.toLowerCase().includes(filter.toLowerCase());
      }
      return !key.startsWith('npm_') && 
             !key.startsWith('NODE_') &&
             key !== 'PATH' &&
             key !== 'HOME' &&
             key !== 'USER';
    })
    .sort(([a], [b]) => a.localeCompare(b));
  
  envVars.forEach(([key, value]) => {
    const displayValue = value && value.length > 50 
      ? `${value.substring(0, 47)}...` 
      : value;
    
    // 機密情報はマスク
    const maskedValue = key.includes('SECRET') || 
                       key.includes('KEY') || 
                       key.includes('TOKEN')
      ? '***MASKED***'
      : displayValue;
    
    console.log(`${key}=${maskedValue}`);
  });
  
  console.log('================================');
  console.log(`Total: ${envVars.length} variables`);
}