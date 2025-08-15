# Vercel デプロイメントガイド

## 🏗️ プロジェクト構成

UnsonOSは2つの独立したVercelプロジェクトとしてデプロイされます：

1. **unson-os-landing** - 公開ランディングページ
2. **unson-os-management** - 内部管理UI

## 🚀 初回デプロイ手順

### 1. Landing Page（公開サイト）

#### Vercel CLIを使用する場合：
```bash
cd apps/landing
npx vercel --name unson-os-landing
```

#### Vercel Dashboardを使用する場合：
1. [Vercel Dashboard](https://vercel.com/new)にアクセス
2. GitHubリポジトリ `Unson-LLC/unson_os` を選択
3. **Root Directory**: `apps/landing` を指定
4. **Project Name**: `unson-os-landing`
5. 環境変数を設定：

```env
RESEND_API_KEY=re_xxxxxxxx
NEXT_PUBLIC_CONVEX_URL=https://ceaseless-bison-200.convex.cloud
NEXT_PUBLIC_APP_URL=https://unson.jp
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. Management UI（管理画面）

#### Vercel CLIを使用する場合：
```bash
cd apps/management-ui
npx vercel --name unson-os-management
```

#### Vercel Dashboardを使用する場合：
1. [Vercel Dashboard](https://vercel.com/new)にアクセス
2. GitHubリポジトリ `Unson-LLC/unson_os` を選択
3. **Root Directory**: `apps/management-ui` を指定
4. **Project Name**: `unson-os-management`
5. 環境変数を設定：

```env
NEXT_PUBLIC_CONVEX_URL=https://ceaseless-bison-200.convex.cloud
NEXT_PUBLIC_APP_URL=https://admin.unson.jp
GOOGLE_ADS_DEVELOPER_TOKEN=xxxxxxxx
GOOGLE_ADS_CLIENT_ID=xxxxxxxx
GOOGLE_ADS_CLIENT_SECRET=xxxxxxxx
GOOGLE_ADS_REFRESH_TOKEN=xxxxxxxx
```

## 🔒 セキュリティ設定

### Management UI のアクセス制限

#### オプション1: Vercel認証（推奨）
Vercel Dashboardで：
1. Settings → General → Password Protection
2. パスワードを設定

#### オプション2: Basic認証
`apps/management-ui/middleware.ts` を作成：
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const basicAuth = request.headers.get('authorization')
  
  if (basicAuth) {
    const auth = basicAuth.split(' ')[1]
    const [user, pwd] = Buffer.from(auth, 'base64').toString().split(':')
    
    if (user === process.env.BASIC_AUTH_USER && pwd === process.env.BASIC_AUTH_PASSWORD) {
      return NextResponse.next()
    }
  }
  
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
```

環境変数追加：
```env
BASIC_AUTH_USER=admin
BASIC_AUTH_PASSWORD=secure_password_here
```

## 🌐 ドメイン設定

### Landing Page
```
Domain: unson.jp (または www.unson.jp)
```

### Management UI  
```
Domain: admin.unson.jp (または manage.unson.jp)
```

Vercel Dashboard → Settings → Domains で設定

## 📊 環境別設定

### Development（開発）
- apps/landing/.env.local
- apps/management-ui/.env.local

### Staging（ステージング）
Vercel Preview環境を使用

### Production（本番）
- apps/landing/.env.production
- apps/management-ui/.env.production

## 🔄 継続的デプロイ

### 自動デプロイ設定
- **main**ブランチへのマージ → Production環境に自動デプロイ
- **PR作成** → Preview環境に自動デプロイ

### 手動デプロイ
```bash
# Landing Page
cd apps/landing && vercel --prod

# Management UI  
cd apps/management-ui && vercel --prod
```

## 🐛 トラブルシューティング

### ビルドエラー
1. Node.jsバージョン確認（18以上）
2. 環境変数が正しく設定されているか確認
3. `npm install` を実行してから再度デプロイ

### 404エラー
- Root Directoryが正しく設定されているか確認
- `apps/landing` or `apps/management-ui`

### 環境変数が読み込まれない
- NEXT_PUBLIC_プレフィックスが必要な変数に付いているか確認
- Vercel Dashboardで環境変数を再設定

## 📝 チェックリスト

### Landing Page
- [ ] Vercelプロジェクト作成
- [ ] Root Directory: `apps/landing`
- [ ] RESEND_API_KEY設定
- [ ] ドメイン設定（unson.jp）
- [ ] デプロイ成功確認

### Management UI
- [ ] Vercelプロジェクト作成
- [ ] Root Directory: `apps/management-ui`
- [ ] Google Ads API環境変数設定
- [ ] アクセス制限設定
- [ ] ドメイン設定（admin.unson.jp）
- [ ] デプロイ成功確認

## 🔗 リンク

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)