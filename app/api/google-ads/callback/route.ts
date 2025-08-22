import { NextRequest, NextResponse } from 'next/server';
import { GoogleAdsAuthManager } from '@/lib/google-ads/auth';

// Google Ads OAuth認証コールバック
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    
    if (error) {
      const errorDescription = searchParams.get('error_description');
      console.error('Google Ads認証エラー:', error, errorDescription);
      
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/portal/settings/integrations?error=${encodeURIComponent(error)}&description=${encodeURIComponent(errorDescription || '')}`
      );
    }
    
    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/portal/settings/integrations?error=no_code`
      );
    }
    
    const authManager = new GoogleAdsAuthManager({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
      developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    });
    
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/google-ads/callback`;
    
    try {
      // リフレッシュトークン取得
      const refreshToken = await authManager.exchangeCodeForToken(code, redirectUri);
      
      // 成功時はトークンをクエリパラメータで返す（本番では別の方法を推奨）
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/portal/settings/integrations?success=true&refresh_token=${encodeURIComponent(refreshToken)}`
      );
      
    } catch (tokenError) {
      console.error('トークン取得エラー:', tokenError);
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/portal/settings/integrations?error=token_exchange&details=${encodeURIComponent(tokenError instanceof Error ? tokenError.message : 'Unknown error')}`
      );
    }
    
  } catch (error) {
    console.error('Google Ads コールバックエラー:', error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/portal/settings/integrations?error=callback_error`
    );
  }
}