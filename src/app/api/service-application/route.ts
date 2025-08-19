import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';

// 動的レンダリングを強制（キャッシュ問題を回避）
export const dynamic = 'force-dynamic';

// APIは文字列で直接指定
const api = {
  serviceApplications: {
    createServiceApplication: 'serviceApplications:createServiceApplication'
  }
};

// Refactor完了: 実際のConvex連携
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// CORS設定
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// OPTIONSリクエスト（プリフライト）対応
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

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
        { 
          status: 400,
          headers: corsHeaders 
        }
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
    }, { headers: corsHeaders });

  } catch (error: any) {
    console.error('Service application error:', error);
    
    // エラーメッセージの詳細化（ハードコード除去）
    const errorMessage = getErrorMessage(error);
    
    return NextResponse.json(
      {
        error: errorMessage,
        success: false,
      },
      { 
        status: getErrorStatusCode(error),
        headers: corsHeaders 
      }
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
  
  return '送信中にエラーが発生しました';
}

// エラーステータスコードの取得
function getErrorStatusCode(error: any): number {
  if (error.message && error.message.includes('既に')) {
    return 409; // Conflict
  }
  
  return 500; // Internal Server Error
}

// サービス別の追加処理
async function handleServiceSpecificProcessing(
  serviceName: string,
  data: {
    email: string;
    name: string;
    formData: Record<string, any>;
    applicationId: string;
  }
) {
  // 各サービス特有の処理をここに追加
  switch (serviceName) {
    case 'mywa':
      // mywa固有の処理
      console.log(`mywa application created: ${data.applicationId}`);
      break;
    case 'ai-bridge':
      // ai-bridge固有の処理
      console.log(`ai-bridge application created: ${data.applicationId}`);
      break;
    case 'ai-stylist':
      // ai-stylist固有の処理
      console.log(`ai-stylist application created: ${data.applicationId}`);
      break;
    case 'ai-legacy-creator':
      // ai-legacy-creator固有の処理
      console.log(`ai-legacy-creator application created: ${data.applicationId}`);
      break;
    case 'ai-coach':
      // ai-coach固有の処理
      console.log(`ai-coach application created: ${data.applicationId}`);
      break;
    default:
      console.log(`Unknown service: ${serviceName}`);
  }
}