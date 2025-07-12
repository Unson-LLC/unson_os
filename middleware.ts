import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // 開発環境では認証をスキップ
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }

  // 認証パスワードの設定（環境変数から取得）
  const SITE_PASSWORD = process.env.VERCEL_PASSWORD || 'unson2025'
  
  const basicAuth = request.headers.get('authorization')
  
  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')
    
    if (user === 'unson' && pwd === SITE_PASSWORD) {
      return NextResponse.next()
    }
  }

  return new NextResponse('認証が必要です', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Unson OS Preview"',
    },
  })
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}