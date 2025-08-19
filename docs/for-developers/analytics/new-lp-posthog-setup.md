# 新規LP作成時のPostHog接続マニュアル

## 概要
新しいLPサービスを作成する際に、PostHogアナリティクスを自動設定するためのガイドです。
すべてCLI経由で完結できます。

## 前提条件

- PostHogアカウント作成済み
- Project API Key取得済み: `phc_Wae76RkdVCmtlZVdaCZ17sdj45CECqq0l3b7YftBiUG`
- Node.js環境セットアップ済み

## 🚀 自動セットアップスクリプト

### ステップ1: セットアップスクリプトを作成

`scripts/setup-posthog-for-new-lp.js`として保存：

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 設定
const POSTHOG_KEY = 'phc_Wae76RkdVCmtlZVdaCZ17sdj45CECqq0l3b7YftBiUG';
const POSTHOG_HOST = 'https://us.i.posthog.com';

// コマンドライン引数からサービス名を取得
const serviceName = process.argv[2];
if (!serviceName) {
  console.error('❌ エラー: サービス名を指定してください');
  console.log('使用方法: node setup-posthog-for-new-lp.js <service-name>');
  console.log('例: node setup-posthog-for-new-lp.js ai-writer');
  process.exit(1);
}

const servicePath = path.join('services', serviceName);

// サービスディレクトリの存在確認
if (!fs.existsSync(servicePath)) {
  console.error(`❌ エラー: サービスディレクトリが見つかりません: ${servicePath}`);
  process.exit(1);
}

console.log(`📊 PostHog設定を ${serviceName} に追加します...`);

// 1. PostHog SDKをインストール
console.log('1️⃣ PostHog SDKをインストール中...');
try {
  execSync('npm install posthog-js posthog-node', { 
    cwd: servicePath,
    stdio: 'inherit' 
  });
  console.log('✅ SDKインストール完了');
} catch (error) {
  console.error('❌ SDKインストール失敗:', error.message);
  process.exit(1);
}

// 2. PostHogProviderコンポーネントを作成
const providerContent = `'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false,
    capture_pageleave: true,
    enable_heatmaps: true,
    enable_recording_console_log: true,
    session_recording: {
      maskAllInputs: false,
      maskInputOptions: {
        password: true,
      },
    },
    autocapture: {
      dom_event_allowlist: ['click', 'change', 'submit'],
      element_allowlist: ['button', 'input', 'select', 'textarea', 'a'],
    },
  });
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + '?' + searchParams.toString();
      }
      posthog.capture('$pageview', {
        $current_url: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}`;

const analyticsDir = path.join(servicePath, 'src/components/Analytics');
if (!fs.existsSync(analyticsDir)) {
  fs.mkdirSync(analyticsDir, { recursive: true });
}

fs.writeFileSync(
  path.join(analyticsDir, 'PostHogProvider.tsx'),
  providerContent
);
console.log('✅ PostHogProvider作成完了');

// 3. PostHogAnalyticsコンポーネントを作成
const analyticsContent = `'use client';

import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';

interface PostHogAnalyticsProps {
  serviceName: string;
}

export default function PostHogAnalytics({ serviceName }: PostHogAnalyticsProps) {
  const posthog = usePostHog();

  useEffect(() => {
    if (posthog) {
      posthog.register({
        service_name: serviceName,
      });
    }
  }, [posthog, serviceName]);

  return null;
}

export const useAnalytics = () => {
  const posthog = usePostHog();

  return {
    trackEvent: (eventName: string, properties?: Record<string, any>) => {
      posthog?.capture(eventName, properties);
    },
    trackFormSubmission: (formType: string = 'contact') => {
      posthog?.capture('form_submitted', {
        form_type: formType,
        timestamp: new Date().toISOString(),
      });
    },
    trackCTAClick: (ctaLabel: string) => {
      posthog?.capture('cta_clicked', {
        cta_label: ctaLabel,
        timestamp: new Date().toISOString(),
      });
    },
    trackScrollDepth: (depth: number) => {
      posthog?.capture('scroll_depth', {
        depth_percentage: depth,
        timestamp: new Date().toISOString(),
      });
    },
    identifyUser: (userId: string, properties?: Record<string, any>) => {
      posthog?.identify(userId, properties);
    },
    setUserProperties: (properties: Record<string, any>) => {
      posthog?.setPersonProperties(properties);
    },
  };
};`;

fs.writeFileSync(
  path.join(analyticsDir, 'PostHogAnalytics.tsx'),
  analyticsContent
);
console.log('✅ PostHogAnalytics作成完了');

// 4. 環境変数を設定
const envPath = path.join(servicePath, '.env.local');
const envContent = `
# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=${POSTHOG_KEY}
NEXT_PUBLIC_POSTHOG_HOST=${POSTHOG_HOST}
`;

if (fs.existsSync(envPath)) {
  // 既存の.env.localに追加
  const currentEnv = fs.readFileSync(envPath, 'utf8');
  if (!currentEnv.includes('POSTHOG')) {
    fs.appendFileSync(envPath, envContent);
    console.log('✅ 環境変数追加完了');
  } else {
    console.log('⚠️ PostHog環境変数は既に設定されています');
  }
} else {
  // 新規作成
  fs.writeFileSync(envPath, envContent.trim());
  console.log('✅ 環境変数ファイル作成完了');
}

// 5. layout.tsxの更新手順を表示
console.log(`
📝 最後の手動ステップ:

${servicePath}/src/app/layout.tsx を以下のように更新してください:

1. importを追加:
   import PostHogProvider from '@/components/Analytics/PostHogProvider'
   import PostHogAnalytics from '@/components/Analytics/PostHogAnalytics'

2. bodyタグ内をPostHogProviderでラップ:
   <body>
     <PostHogProvider>
       {children}
       <PostHogAnalytics serviceName="${serviceName}" />
     </PostHogProvider>
   </body>

✨ 設定完了後、以下のコマンドでテスト:
   cd ${servicePath} && npm run dev
`);

// 6. Vercel環境変数設定コマンドを生成
console.log(`
🚀 Vercelへのデプロイ時は以下のコマンドを実行:

printf "${POSTHOG_KEY}" | vercel env add NEXT_PUBLIC_POSTHOG_KEY production
printf "${POSTHOG_HOST}" | vercel env add NEXT_PUBLIC_POSTHOG_HOST production
`);

console.log('✅ PostHog設定が完了しました！');
```

### ステップ2: 実行権限を付与

```bash
chmod +x scripts/setup-posthog-for-new-lp.js
```

## 📋 使用方法

### 1. 新規LPサービス作成後に実行

```bash
# 新しいLPサービスを作成（例: ai-writer）
npx create-next-app services/ai-writer --typescript --tailwind --app

# PostHog設定を自動追加
node scripts/setup-posthog-for-new-lp.js ai-writer
```

### 2. layout.tsxを手動更新

自動生成されたコードを参考に、`services/[service-name]/src/app/layout.tsx`を更新：

```typescript
import type { Metadata } from 'next'
import './globals.css'
import PostHogProvider from '@/components/Analytics/PostHogProvider'
import PostHogAnalytics from '@/components/Analytics/PostHogAnalytics'

export const metadata: Metadata = {
  title: 'Your Service Name',
  description: 'Your service description',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <PostHogProvider>
          {children}
          <PostHogAnalytics serviceName="your-service-name" />
        </PostHogProvider>
      </body>
    </html>
  )
}
```

### 3. Vercel環境変数設定

```bash
# Production環境
printf "phc_Wae76RkdVCmtlZVdaCZ17sdj45CECqq0l3b7YftBiUG" | vercel env add NEXT_PUBLIC_POSTHOG_KEY production
printf "https://us.i.posthog.com" | vercel env add NEXT_PUBLIC_POSTHOG_HOST production

# Preview環境
printf "phc_Wae76RkdVCmtlZVdaCZ17sdj45CECqq0l3b7YftBiUG" | vercel env add NEXT_PUBLIC_POSTHOG_KEY preview
printf "https://us.i.posthog.com" | vercel env add NEXT_PUBLIC_POSTHOG_HOST preview
```

## 🔧 カスタムイベントの実装

コンポーネント内でPostHogイベントを使用：

```typescript
import { useAnalytics } from '@/components/Analytics/PostHogAnalytics';

export default function ContactForm() {
  const { trackFormSubmission, trackCTAClick } = useAnalytics();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // フォーム処理
    trackFormSubmission('contact');
  };

  const handleCTAClick = () => {
    trackCTAClick('header_cta');
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* フォーム内容 */}
    </form>
  );
}
```

## 📊 PostHogダッシュボードでの確認

1. [PostHog Live Events](https://us.posthog.com/project/phc_Wae76RkdVCmtlZVdaCZ17sdj45CECqq0l3b7YftBiUG/activity/live_events)にアクセス
2. フィルター: `service_name = 'your-service-name'`
3. イベントが正しく記録されているか確認

## ✅ チェックリスト

- [ ] PostHog SDKインストール
- [ ] PostHogProvider作成
- [ ] PostHogAnalytics作成  
- [ ] 環境変数設定（.env.local）
- [ ] layout.tsx更新
- [ ] Vercel環境変数設定
- [ ] 本番デプロイ
- [ ] Live Eventsで動作確認

## 🚨 トラブルシューティング

### イベントが表示されない場合

1. ブラウザの広告ブロッカーを無効化
2. 開発者ツールのConsoleでエラー確認
3. 環境変数が正しく設定されているか確認

```bash
# 環境変数確認
grep POSTHOG services/[service-name]/.env.local

# Vercel環境変数確認
vercel env ls | grep POSTHOG
```

### よくある問題

- **Problem**: `posthog is not defined`
  - **Solution**: PostHogProviderがlayout.tsxで正しくラップされているか確認

- **Problem**: イベントが重複して送信される
  - **Solution**: `capture_pageview: false`が設定されているか確認

---

**最終更新**: 2025年8月19日  
**関連ドキュメント**: [PostHog Setup Guide](./posthog-setup-guide.md)