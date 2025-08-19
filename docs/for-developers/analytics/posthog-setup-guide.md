# PostHog セットアップガイド

## 概要
UnsonOSのLP分析システムをMicrosoft ClarityからPostHogに移行しました。PostHogは強力なAPI、ヒートマップ、セッション録画、A/Bテスト機能を提供します。

## 🚀 セットアップ手順

### 1. PostHogアカウント作成

1. [PostHog](https://posthog.com/)にアクセス
2. 無料アカウントを作成
3. プロジェクトを作成（リージョン：US推奨）

### 2. プロジェクトキー取得

1. PostHogダッシュボード → Project Settings
2. API Keysセクションから`Project API Key`をコピー
3. 形式：`phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 3. 環境変数設定

各サービスの`.env.local`に以下を設定：

```bash
# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_YOUR_PROJECT_API_KEY
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### 4. 機能設定

PostHogダッシュボードで以下を有効化：

- ✅ **Session Recording**: ユーザーセッション録画
- ✅ **Heatmaps**: クリック・スクロールヒートマップ
- ✅ **Feature Flags**: A/Bテスト用フラグ管理
- ✅ **Autocapture**: 自動イベント収集

## 📊 主要機能

### ヒートマップ
- クリックマップ
- スクロールマップ
- レイジクリック検出

### セッション録画
- コンソールログ記録
- ネットワーク監視
- エラートラッキング

### カスタムイベント
```typescript
import { useAnalytics } from '@/components/Analytics/PostHogAnalytics';

const { trackFormSubmission, trackCTAClick } = useAnalytics();

// フォーム送信追跡
trackFormSubmission('contact');

// CTAクリック追跡
trackCTAClick('header_cta');
```

### SQL API アクセス
```javascript
// PostHog APIでデータ取得
const query = `
  SELECT 
    properties.utm_term as keyword,
    COUNT(*) as visitors,
    SUM(CASE WHEN event = 'form_submitted' THEN 1 ELSE 0 END) as conversions
  FROM events
  WHERE timestamp > now() - interval 7 day
  GROUP BY keyword
`;

const results = await posthog.query(query);
```

## 🔄 Google Ads連携

### コンバージョンイベント設定
1. PostHogでカスタムイベント`form_submitted`を定義
2. Google Ads APIでコンバージョンとして設定
3. 自動最適化のためのデータパイプライン構築

### UTMパラメータ自動収集
PostHogは以下のUTMパラメータを自動収集：
- utm_source
- utm_medium
- utm_campaign
- utm_term
- utm_content

## 📈 分析ダッシュボード

### 主要メトリクス
- セッション数・ユニークユーザー数
- 直帰率・平均セッション時間
- コンバージョン率
- ページビュー

### カスタムダッシュボード作成
1. PostHog → Dashboards → New Dashboard
2. 必要なウィジェットを追加
3. フィルター設定（サービス別、期間別）

## 🔧 トラブルシューティング

### データが表示されない場合
1. 環境変数が正しく設定されているか確認
2. ブラウザの広告ブロッカーを無効化
3. PostHogダッシュボードでLive Eventsを確認

### セッション録画が機能しない場合
1. Project Settings → Session Recording を確認
2. 録画上限（月5,000セッション）に達していないか確認

## 📚 関連ドキュメント

- [PostHog公式ドキュメント](https://posthog.com/docs)
- [PostHog API リファレンス](https://posthog.com/docs/api)
- [Google Ads API プレイブック](../marketing/advertising/google-ads-api-playbook.md)

## 💰 料金

### 無料ティア（推奨）
- 月間100万イベント
- 5,000セッション録画
- 無制限のチームメンバー
- API無制限アクセス

5つのLPサービスなら無料ティアで十分対応可能です。

---

**最終更新**: 2025年8月19日  
**次のステップ**: PostHogアカウントを作成してProject API Keyを取得してください。