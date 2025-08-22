import { NextRequest, NextResponse } from 'next/server';
import { GoogleAdsAuthManager } from '@/lib/google-ads/auth';

// Google Ads接続テスト
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const customerId = searchParams.get('customer_id');
    
    const authManager = new GoogleAdsAuthManager({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
      developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
      customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID || customerId || undefined,
    });
    
    if (action === 'connection') {
      // 接続テスト
      if (!customerId) {
        return NextResponse.json({ 
          error: 'customer_id パラメータが必要です' 
        }, { status: 400 });
      }
      
      const result = await authManager.testConnection(customerId);
      return NextResponse.json(result);
      
    } else if (action === 'customers') {
      // アクセス可能なアカウント一覧取得
      try {
        await authManager.initializeClient();
        const customers = await authManager.getAccessibleCustomers();
        
        return NextResponse.json({
          success: true,
          customers,
        });
        
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: error instanceof Error ? error.message : '不明なエラー',
        });
      }
      
    } else if (action === 'campaigns') {
      // キャンペーン一覧取得
      if (!customerId) {
        return NextResponse.json({ 
          error: 'customer_id パラメータが必要です' 
        }, { status: 400 });
      }
      
      try {
        const campaigns = await authManager.getCampaigns(customerId, 10);
        
        return NextResponse.json({
          success: true,
          customer_id: customerId,
          campaigns,
        });
        
      } catch (error) {
        return NextResponse.json({
          success: false,
          error: error instanceof Error ? error.message : '不明なエラー',
        });
      }
    }
    
    return NextResponse.json({ 
      error: 'サポートされていないアクション', 
      supported_actions: ['connection', 'customers', 'campaigns']
    }, { status: 400 });
    
  } catch (error) {
    console.error('Google Ads テストエラー:', error);
    return NextResponse.json(
      { 
        error: 'テスト実行でエラーが発生しました',
        details: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    );
  }
}

// Google Ads認証情報更新
export async function POST(request: NextRequest) {
  try {
    const { refresh_token, customer_id, action } = await request.json();
    
    if (action === 'update_credentials') {
      // 認証情報の妥当性チェック
      if (!refresh_token) {
        return NextResponse.json({ 
          error: 'refresh_token が必要です' 
        }, { status: 400 });
      }
      
      const authManager = new GoogleAdsAuthManager({
        client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
        client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
        developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
        refresh_token,
        customer_id,
      });
      
      // 接続テスト
      const testResult = await authManager.testConnection(customer_id);
      
      if (testResult.success) {
        return NextResponse.json({
          success: true,
          message: '認証情報が正常に検証されました',
          customer_info: testResult.customer_info,
          next_steps: [
            `環境変数 GOOGLE_ADS_REFRESH_TOKEN に ${refresh_token} を設定`,
            customer_id ? `環境変数 GOOGLE_ADS_CUSTOMER_ID に ${customer_id} を設定` : '環境変数 GOOGLE_ADS_CUSTOMER_ID を設定',
            '設定後、アプリケーションを再起動',
          ],
        });
      } else {
        return NextResponse.json({
          success: false,
          error: '認証情報の検証に失敗しました',
          details: testResult.error,
        }, { status: 400 });
      }
    }
    
    return NextResponse.json({ 
      error: 'サポートされていないアクション' 
    }, { status: 400 });
    
  } catch (error) {
    console.error('Google Ads 認証情報更新エラー:', error);
    return NextResponse.json(
      { 
        error: '認証情報更新でエラーが発生しました',
        details: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    );
  }
}