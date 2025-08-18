import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

// Refactor完了: 実際のConvex連携
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

interface ServiceApplicationRequest {
  workspaceId?: string;
  serviceName: string;
  email: string;
  name: string;
  formData: Record<string, any>;
  source?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ServiceApplicationRequest = await request.json();
    const { workspaceId, serviceName, email, name, formData, source } = body;

    // バリデーション（ハードコード除去）
    const validationErrors = validateServiceApplicationRequest(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          error: validationErrors.join(', '),
          success: false 
        },
        { status: 400 }
      );
    }

    // Convex経由で申し込み作成（ハードコード除去）
    const applicationId = await convex.mutation(api.serviceApplications.createServiceApplication, {
      workspaceId: workspaceId || process.env.NEXT_PUBLIC_DEFAULT_WORKSPACE_ID || 'unson_main',
      serviceName,
      email,
      name,
      formData,
    });

    // サービス別の追加処理
    await handleServiceSpecificProcessing(serviceName, {
      email,
      name,
      formData,
      applicationId,
    });

    return NextResponse.json({
      success: true,
      applicationId,
      message: `${serviceName}への申し込みが完了しました`,
    });

  } catch (error: any) {
    console.error('Service application error:', error);
    
    // エラーメッセージの詳細化（ハードコード除去）
    const errorMessage = getErrorMessage(error);
    
    return NextResponse.json(
      {
        error: errorMessage,
        success: false,
      },
      { status: getErrorStatusCode(error) }
    );
  }
}

// バリデーション関数（ハードコード除去）
function validateServiceApplicationRequest(body: ServiceApplicationRequest): string[] {
  const errors: string[] = [];
  
  if (!body.serviceName) {
    errors.push('サービス名は必須です');
  }
  
  if (!body.email) {
    errors.push('メールアドレスは必須です');
  } else if (!isValidEmail(body.email)) {
    errors.push('有効なメールアドレスを入力してください');
  }
  
  if (!body.name) {
    errors.push('お名前は必須です');
  }
  
  return errors;
}

// メールバリデーション
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// エラーメッセージの取得
function getErrorMessage(error: any): string {
  if (error.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'サーバーエラーが発生しました';
}

// エラーステータスコードの取得
function getErrorStatusCode(error: any): number {
  if (error.message?.includes('必須') || error.message?.includes('無効')) {
    return 400;
  }
  
  if (error.message?.includes('既に') || error.message?.includes('重複')) {
    return 409; // Conflict
  }
  
  return 500;
}

// サービス別の追加処理（将来の拡張ポイント）
async function handleServiceSpecificProcessing(
  serviceName: string,
  data: { email: string; name: string; formData: any; applicationId: string }
) {
  switch (serviceName) {
    case 'mywa':
      console.log(`MyWa申し込み処理: ${data.email}`);
      // TODO: MyWa専用処理（ニュース配信開始等）
      break;
      
    case 'ai-bridge':
      console.log(`AIブリッジ申し込み処理: ${data.email}`);
      // TODO: AIブリッジ専用処理
      break;
      
    case 'ai-stylist':
      console.log(`AIスタイリスト申し込み処理: ${data.email}`);
      // TODO: AIスタイリスト専用処理
      break;
      
    case 'ai-legacy-creator':
      console.log(`AIレガシークリエイター申し込み処理: ${data.email}`);
      // TODO: AIレガシークリエイター専用処理
      break;
      
    case 'ai-coach':
      console.log(`AIコーチ申し込み処理: ${data.email}`);
      // TODO: AIコーチ専用処理
      break;
      
    default:
      console.log(`未知のサービス: ${serviceName}`);
  }
}