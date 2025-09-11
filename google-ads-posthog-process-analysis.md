# Google Ads ↔ PostHog プロセス分析と見直し提案
**作成日**: 2025年9月10日（水）
**調査範囲**: Google Ads クリック追跡 → PostHog イベント収集の全プロセス

## 🔍 現在の仕組み分析

### Google Ads クリック追跡の仕組み

#### 1. GCLID (Google Click Identifier)
- **自動生成**: Google Ads の「自動タグ設定」がONの場合、URLに `?gclid=123xyz` が自動付与
- **含まれる情報**: キャンペーン、広告グループ、キーワード、広告コンテンツ等
- **URL例**: `https://unson-lp-mywa.vercel.app/?gclid=CjwKCAiA4K-fBRA0EiwADvFBs...`

#### 2. UTM パラメータ (オプション)
- **手動設定**: トラッキングテンプレートで設定
- **パラメータ**: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
- **クロスプラットフォーム**: Google Ads 以外のチャネルでも使用可能

### PostHog 追跡の仕組み

#### 1. 自動キャプチャ機能
```typescript
// PostHog は以下を自動で収集
- gclid: Google Click ID
- fbclid: Facebook Click ID  
- msclkid: Microsoft Click ID
- UTMパラメータ (全5種)
```

#### 2. ページビューイベント
```typescript
// デフォルト設定 (2025年5月24日以降)
posthog.init(apiKey, {
  capture_pageview: 'history_change', // SPAに最適化
  autocapture: true,
  session_recording: true
});
```

## 🚨 発見された問題箇所

### 1. Google Ads 設定レベルの問題

#### A. 自動タグ設定の確認不足
```bash
# 確認必要項目
✓ Google Ads アカウント → 設定 → アカウント設定 → 自動タグ設定
✓ GCLID が実際のURLに付与されているか
✓ リダイレクト設定でGCLIDが保持されているか
```

#### B. ランディングページURL設定
```bash
# 潜在的問題
❌ 広告の「最終URL」が実際のLPと異なる
❌ トラッキングテンプレートでのリダイレクト
❌ URL短縮サービス経由での追跡断絶
```

### 2. PostHog 実装レベルの問題

#### A. Next.js SSR/CSR での初期化タイミング
```typescript
// 問題のあるパターン
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
    // 初期化が遅すぎる可能性
  });
}
```

#### B. ページビューキャプチャ設定
```typescript
// 現在の設定
capture_pageview: false, // 手動でページビュー送信
// ↓ 推奨設定 (2025年5月以降)
capture_pageview: 'history_change' // SPA最適化
```

#### C. イベント発火タイミング
```typescript
// useEffect での手動ページビュー送信
useEffect(() => {
  if (pathname && posthog) {
    posthog.capture('$pageview', {
      $current_url: url,
    });
  }
}, [pathname, searchParams]);
```

### 3. インフラ・環境レベルの問題

#### A. 環境変数の不整合
```bash
# 確認済み問題
✓ MyWa: 環境変数未設定 (修正済み)
❌ 他プロダクト: 設定済みだがデータなし
```

#### B. CDN/キャッシュ問題
```bash
# 潜在的問題
❌ Vercel Edge Functions でのPostHog初期化遅延
❌ Next.js Static Generation でのクライアントサイド実行問題  
❌ PostHog CDN への接続ブロック
```

## 📊 データフローの断絶ポイント

### 正常なフロー
```
Google Ads クリック 
→ GCLID付きURL生成
→ LP到達
→ PostHog初期化
→ GCLID自動キャプチャ
→ ページビューイベント送信
→ PostHogデータベース保存
```

### 現在の状況（推定断絶ポイント）
```
Google Ads クリック ✅ (328件記録)
→ GCLID付きURL生成 ❓ (未確認)
→ LP到達 ❓ (PostHogで0件)
→ PostHog初期化 ❓ (タイミング問題？)
→ GCLID自動キャプチャ ❌ (動作せず)
→ ページビューイベント送信 ❌ (0件)
```

## 🔧 見直し必要箇所の優先順位

### Phase 1: 緊急対応 (今日中)

#### 1.1 Google Ads 設定確認
```bash
# 確認項目
□ 自動タグ設定がONか
□ 実際の広告URLにGCLIDが付与されるか
□ 最終URLとLP URLが一致するか
□ リダイレクト設定の有無
```

#### 1.2 PostHog 初期化方式の変更
```typescript
// 現在の問題のある初期化
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
    capture_pageview: false, // 古い設定
    // ...
  });
}

// 推奨修正版 (Next.js 15.3+ & PostHog 2025年defaults)
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        capture_pageview: 'history_change', // 2025年推奨設定
        debug: process.env.NODE_ENV === 'development', // デバッグ有効化
        loaded: (posthog) => {
          console.log('PostHog initialized', posthog); // 初期化確認
        }
      });
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
```

### Phase 2: 構造的修正 (今週中)

#### 2.1 環境変数の統一管理
```bash
# 全プロダクトのvercel.json統一
□ MyWa: 修正済み
□ AI-Bridge: 再確認必要
□ AI-Coach: 確認必要  
□ AI-Stylist: 確認必要
□ AI-Legacy-Creator: 確認必要
```

#### 2.2 Google Ads トラッキング強化
```typescript
// UTMパラメータ併用でのトラッキング強化
const trackingTemplate = `{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}&utm_content={creative}`;
```

#### 2.3 PostHog イベント送信の信頼性向上
```typescript
// リトライ機能付きイベント送信
const trackPageView = (url: string, retries = 3) => {
  try {
    if (posthog && posthog.capture) {
      posthog.capture('$pageview', {
        $current_url: url,
        gclid: getUrlParameter('gclid'),
        utm_source: getUrlParameter('utm_source'),
        // ... 追加パラメータ
      });
    }
  } catch (error) {
    if (retries > 0) {
      setTimeout(() => trackPageView(url, retries - 1), 1000);
    }
  }
};
```

### Phase 3: 監視・最適化 (継続)

#### 3.1 リアルタイム監視
```typescript
// PostHog デバッグモードでの常時監視
posthog.init(apiKey, {
  debug: true, // 本番環境でも一時的に有効化
  on_request_error: (error) => {
    console.error('PostHog request failed:', error);
    // エラーログをDiscordに通知
  }
});
```

#### 3.2 A/B テストによる改善
```bash
# テストケース
□ PostHog初期化タイミングの最適化
□ イベント送信頻度の調整
□ UTMパラメータ vs GCLID の追跡精度比較
```

## 💡 根本原因の仮説

### 主要仮説: PostHog初期化タイミング問題
```typescript
// 問題: Next.js SSRで初期化が遅い
// ユーザーがページビューを完了してから初期化
// → イベント送信前にユーザーが離脱

// 解決案: より早期の初期化
// instrumentation.ts での初期化
// _app.tsx での同期初期化
```

### 副次仮説: Google Ads URL設定問題
```bash
# 確認必要: 実際の広告クリック時のURL
# Google Ads プレビュー機能での動作確認
# GCLID付きURLでの直接アクセステスト
```

## 🎯 成功指標

### Phase 1 完了指標
- [ ] PostHog Live Events でリアルタイムイベント確認
- [ ] Google Ads クリック後のGCLID付きURL確認
- [ ] 少なくとも1つのプロダクトでデータ連携成功

### 最終成功指標
- [ ] Google Ads クリック数 = PostHog ページビュー数 (誤差5%以内)
- [ ] GCLID → PostHog 属性情報の正確な取得
- [ ] コンバージョン経路の可視化

---

**緊急アクション**: Google Ads 自動タグ設定確認 + PostHog初期化方式の修正