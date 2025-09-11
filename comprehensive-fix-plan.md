# Google Ads ↔ PostHog データ連携 総合修正プラン
**作成日**: 2025年9月10日（水）
**目標**: 328クリック vs 0イベントの完全乖離を解決

## 🎯 修正プランの全体像

### 現在の状況
- **Google Ads**: 328クリック獲得（直近1週間）
- **PostHog**: 0実イベント（同期間）
- **乖離率**: 100% - 完全な追跡断絶

### 修正後の目標
- **データ連携率**: 95%以上
- **リアルタイム追跡**: 即座にPostHogでイベント確認可能
- **コンバージョン経路**: Google Ads → LP → コンバージョン の完全可視化

## 🚨 Phase 1: 緊急修正（今日中実施）

### 1.1 Google Ads 自動タグ設定確認・修正

#### 確認手順
```bash
1. Google Ads 管理画面 → 設定 → アカウント設定
2. 「自動タグ設定」がONになっているか確認
3. 「最終URL」が実際のLP URLと一致するか確認
4. 広告プレビューでGCLID付きURL生成を確認
```

#### 修正項目
```javascript
// 確認すべき設定
✓ 自動タグ設定: ON
✓ 最終URL: https://unson-lp-mywa.vercel.app (リダイレクトなし)
✓ トラッキングテンプレート: 設定なし（GCLIDのみ使用）
✓ クロスドメイントラッキング: 不要
```

### 1.2 PostHog 初期化方式の即座修正

#### 現在の問題コード
```typescript
// products/*/lp/src/components/Analytics/PostHogProvider.tsx
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
    capture_pageview: false, // ❌ 古い設定
    // 初期化が遅すぎる
  });
}
```

#### 修正版コード
```typescript
// 修正版: 早期初期化 + 2025年推奨設定
'use client';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';

// グローバル初期化（SSR対応）
if (typeof window !== 'undefined' && !window.__posthog_initialized) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    capture_pageview: '2025-05-24', // 最新のSPA最適化設定
    capture_pageleave: true,
    debug: process.env.NODE_ENV === 'development',
    loaded: (ph) => {
      console.log('PostHog initialized successfully', ph);
      window.__posthog_initialized = true;
    },
    on_request_error: (error) => {
      console.error('PostHog request failed:', error);
    }
  });
}
```

### 1.3 全プロダクトの環境変数統一

#### 修正対象ファイル
```bash
# 確認・修正必要
□ products/2-validation/2025-08-003-ai-coach/lp/vercel.json
□ products/2-validation/2025-08-004-ai-legacy-creator/lp/vercel.json  
□ products/2-validation/2025-08-005-ai-stylist/lp/vercel.json
```

#### 統一環境変数設定
```json
{
  "env": {
    "NEXT_PUBLIC_SERVICE_NAME": "[service-name]",
    "NEXT_PUBLIC_POSTHOG_KEY": "phc_Wae76RkdVCmtlZVdaCZ17sdj45CECqq0l3b7YftBiUG",
    "NEXT_PUBLIC_POSTHOG_HOST": "https://us.i.posthog.com",
    "NEXT_PUBLIC_GOOGLE_ADS_ID": "AW-17431174236",
    "NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL": "zINmCPbAtIMbENy46vdA"
  }
}
```

## ⚡ Phase 2: 構造的強化（今週中実施）

### 2.1 PostHog イベント追跡強化

#### GCLID自動取得の実装
```typescript
// utils/tracking.ts
export const getGCLID = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  const gclid = urlParams.get('gclid');
  
  // セッションストレージに保存（ページ遷移でも保持）
  if (gclid) {
    sessionStorage.setItem('gclid', gclid);
    return gclid;
  }
  
  return sessionStorage.getItem('gclid');
};

// 強化されたページビュー追跡
export const trackEnhancedPageview = () => {
  if (typeof window !== 'undefined' && posthog) {
    const gclid = getGCLID();
    const urlParams = new URLSearchParams(window.location.search);
    
    posthog.capture('$pageview', {
      $current_url: window.location.href,
      gclid: gclid,
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_term: urlParams.get('utm_term'),
      utm_content: urlParams.get('utm_content'),
      page_load_time: performance.now(),
      user_agent: navigator.userAgent,
      referrer: document.referrer
    });
    
    // デバッグログ
    console.log('Enhanced pageview tracked', { gclid, url: window.location.href });
  }
};
```

### 2.2 Google Ads トラッキング統合

#### UTMパラメータ併用設定
```bash
# Google Ads トラッキングテンプレート（オプション）
{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}&utm_content={creative}&gclid={gclid}
```

#### Google Ads コンバージョン連携
```typescript
// components/Analytics/GoogleAdsTracking.tsx 強化版
export const trackGoogleAdsConversion = (
  conversionLabel?: string, 
  value?: number, 
  gclid?: string
) => {
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const label = conversionLabel || process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL;
  
  if (typeof window !== 'undefined' && (window as any).gtag && adsId && label) {
    (window as any).gtag('event', 'conversion', {
      'send_to': `${adsId}/${label}`,
      'value': value || 0,
      'currency': 'JPY',
      'gclid': gclid || getGCLID() // GCLID自動取得
    });
    
    // PostHogにも同じコンバージョンを記録
    if (posthog) {
      posthog.capture('conversion', {
        conversion_type: 'google_ads',
        conversion_label: label,
        value: value || 0,
        gclid: gclid || getGCLID()
      });
    }
  }
};
```

### 2.3 リアルタイム監視システム

#### エラー検知・通知システム
```typescript
// utils/monitoring.ts
class TrackingMonitor {
  private static instance: TrackingMonitor;
  private errors: Array<{ type: string; message: string; timestamp: Date }> = [];
  
  static getInstance() {
    if (!TrackingMonitor.instance) {
      TrackingMonitor.instance = new TrackingMonitor();
    }
    return TrackingMonitor.instance;
  }
  
  logError(type: 'posthog' | 'google_ads', message: string, error?: Error) {
    const errorLog = { type, message, timestamp: new Date() };
    this.errors.push(errorLog);
    
    console.error(`[Tracking Error - ${type}]`, message, error);
    
    // 本番環境でのエラー通知（Discord webhook等）
    if (process.env.NODE_ENV === 'production') {
      this.notifyError(errorLog);
    }
  }
  
  private async notifyError(error: any) {
    // Discord webhook通知実装
    // または PostHog error capture
  }
  
  getHealthStatus() {
    return {
      posthog_initialized: !!window.posthog,
      google_ads_loaded: !!(window as any).gtag,
      recent_errors: this.errors.slice(-5)
    };
  }
}

// 使用例
const monitor = TrackingMonitor.getInstance();
```

## 🔄 Phase 3: 継続監視・最適化（継続実施）

### 3.1 データ品質チェック

#### 日次チェック項目
```bash
# 自動チェックスクリプト
□ PostHog Live Events でのリアルタイムデータ確認
□ Google Ads クリック数 vs PostHog ページビュー数の照合
□ GCLID パラメータの取得率
□ コンバージョン経路の完全性
```

#### 週次分析レポート
```typescript
// scripts/weekly-tracking-report.ts
const generateTrackingReport = async () => {
  const googleAdsData = await getGoogleAdsData();
  const posthogData = await getPostHogData();
  
  return {
    period: 'last_7_days',
    google_ads: {
      clicks: googleAdsData.clicks,
      impressions: googleAdsData.impressions,
      cost: googleAdsData.cost
    },
    posthog: {
      pageviews: posthogData.pageviews,
      unique_users: posthogData.unique_users,
      gclid_capture_rate: posthogData.gclid_capture_rate
    },
    data_quality: {
      tracking_coverage: (posthogData.pageviews / googleAdsData.clicks) * 100,
      attribution_accuracy: posthogData.gclid_capture_rate
    }
  };
};
```

### 3.2 A/Bテストによる最適化

#### テストケース
```bash
# 実施予定のテスト
□ PostHog初期化タイミング（即座 vs 遅延）
□ イベント送信頻度（リアルタイム vs バッチ）
□ GCLID保存方法（SessionStorage vs LocalStorage vs Cookie）
□ エラー処理方法（リトライ vs ログのみ）
```

## 📊 成功指標・KPI

### 短期指標（Phase 1完了時）
- [ ] PostHog Live Eventsでリアルタイムイベント確認
- [ ] 少なくとも1プロダクトでGoogle Ads → PostHogデータ流入
- [ ] GCLIDパラメータの自動取得成功

### 中期指標（Phase 2完了時）  
- [ ] 全5プロダクトでデータ連携成功
- [ ] Google Ads クリック → PostHog ページビュー 誤差10%以内
- [ ] コンバージョン経路の可視化完了

### 長期指標（Phase 3運用時）
- [ ] データ連携率 95%以上維持
- [ ] 自動エラー検知・復旧システム稼働
- [ ] ROI最適化のための分析基盤完成

## 🚀 実装順序

### 今日（2025/9/10）
1. Google Ads自動タグ設定確認
2. MyWa PostHog初期化修正
3. PostHog Live Events でテスト確認

### 明日（2025/9/11）
1. 残り4プロダクトの環境変数統一
2. 強化版PostHogProvider全展開
3. GCLID自動取得機能実装

### 今週末（2025/9/14）
1. 全プロダクトでのデータ連携確認
2. コンバージョン追跡の動作確認
3. 監視システムの基本実装

---

**最優先アクション**: Google Ads自動タグ設定確認 + PostHog初期化の即座修正