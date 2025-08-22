import { NextRequest, NextResponse } from 'next/server';
import { GoogleAdsAuthManager } from '@/lib/google-ads/auth';

// Google Ads OAuth認証開始
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'start') {
      // 認証URL生成
      const authManager = new GoogleAdsAuthManager({
        client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
        client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
        developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
      });
      
      const redirectUri = `${process.env.NEXTAUTH_URL}/api/google-ads/callback`;
      const authUrl = authManager.generateAuthUrl(redirectUri);
      
      return NextResponse.json({ authUrl });
      
    } else if (action === 'status') {
      // 認証状態確認
      const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;
      const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID;
      
      return NextResponse.json({
        authenticated: !!(refreshToken && customerId),
        hasRefreshToken: !!refreshToken,
        hasCustomerId: !!customerId,
      });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    
  } catch (error) {
    console.error('Google Ads認証エラー:', error);
    return NextResponse.json(
      { error: '認証処理でエラーが発生しました' },
      { status: 500 }
    );
  }
}

// 認証コード処理
export async function POST(request: NextRequest) {
  try {
    const { code, redirectUri } = await request.json();
    
    if (!code) {
      return NextResponse.json({ error: '認証コードが必要です' }, { status: 400 });
    }
    
    const authManager = new GoogleAdsAuthManager({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
      developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    });
    
    // リフレッシュトークン取得
    const refreshToken = await authManager.exchangeCodeForToken(
      code,
      redirectUri || `${process.env.NEXTAUTH_URL}/api/google-ads/callback`
    );
    
    // 環境変数に保存する指示を返す
    return NextResponse.json({
      success: true,
      refreshToken,
      message: 'リフレッシュトークンを取得しました。環境変数 GOOGLE_ADS_REFRESH_TOKEN に設定してください。',
    });
    
  } catch (error) {
    console.error('Google Ads認証コード処理エラー:', error);
    return NextResponse.json(
      { 
        error: '認証コード処理でエラーが発生しました',
        details: error instanceof Error ? error.message : '不明なエラー'
      },
      { status: 500 }
    );
  }
}