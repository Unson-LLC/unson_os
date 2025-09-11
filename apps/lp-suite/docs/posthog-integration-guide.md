# 🚀 LP Suite PostHog統合 - 完全ガイド

> LP生成時に自動でPostHog分析を設定する新機能の使い方

## 📋 概要

LP Suiteで生成されるランディングページには、PostHog分析機能が自動的に統合されます。この機能により以下が可能になります：

- **リアルタイム行動分析**: ユーザーのページ内行動を詳細追跡
- **Google Ads連携**: 自動コンバージョン追跡
- **Arc ブラウザ対応**: 最新ブラウザでも確実に動作
- **GCLID保存**: Google広告からの流入を正確にアトリビューション

---

## 🎯 LP生成時のPostHog設定

### 1. LP生成フォームでの設定

LP生成ページ（`/generator`）で以下の項目を設定できます：

#### PostHog有効化
```
☑ PostHog分析を有効にする
```

#### Google Ads設定
```
Google Ads ID: AW-17431174236
コンバージョンラベル: zINmCPbAtIMbENy46vdA
GA4測定ID: G-XXXXXXXXXX（オプション）
```

### 2. 自動生成されるコンポーネント

LP生成時に以下のファイルが自動作成されます：

```
components/analytics/
├── PostHogScript.tsx      # PostHog初期化スクリプト
├── PostHogProvider.tsx    # React Provider
├── Analytics.tsx          # ページビュー追跡
├── GoogleAdsTracking.tsx  # Google Ads コンバージョン追跡
└── layout.tsx (修正)      # レイアウトファイルへの統合
```

### 3. 環境変数の自動設定

生成時に `vercel.json` に以下の環境変数が追加されます：

```json
{
  "env": {
    "NEXT_PUBLIC_POSTHOG_KEY": "your-posthog-key",
    "NEXT_PUBLIC_POSTHOG_HOST": "https://us.posthog.com",
    "NEXT_PUBLIC_GOOGLE_ADS_ID": "AW-17431174236",
    "NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL": "your-conversion-label"
  }
}
```

---

## 📊 追跡される分析データ

### ページビュー分析
```javascript
// 自動追跡項目
- ページURL
- リファラー
- 滞在時間  
- スクロール深度
- 離脱ポイント
```

### ユーザー行動分析
```javascript
// 詳細行動データ
- CTAボタンクリック
- フォーム入力開始/完了
- セクション別滞在時間
- デバイス・ブラウザ情報
```

### Google Ads連携
```javascript
// 自動コンバージョン追跡
- GCLID自動保存（sessionStorage）
- Google Ads コンバージョン送信
- キャンペーン別効果測定
- PostHog内でのGoogle Ads データ紐付け
```

---

## 🔧 技術詳細

### PostHogScript.tsx
```tsx
// CDNベースの軽量読み込み
// Arc ブラウザ互換性確保
// GCLID自動検出・保存
// person_profiles: 'always' 設定
```

### PostHogProvider.tsx  
```tsx
// Next.js SSR対応
// クライアントサイドのみで初期化
// session_recording: true
// capture_pageview: false（手動制御）
```

### Analytics.tsx
```tsx
// 手動ページビュー送信
// GCLID連携イベント送信
// カスタムプロパティ付与
```

### GoogleAdsTracking.tsx
```tsx
// Google Tag Manager統合
// コンバージョンイベント送信
// PostHogとの重複イベント防止
```

---

## 🚀 使用開始手順

### 1. LP生成
1. `/generator` にアクセス
2. サービス情報を入力
3. **PostHog分析を有効にする** をチェック
4. Google Ads設定を入力
5. 「LP生成」をクリック

### 2. 確認
生成完了後、以下を確認：
```
✅ PostHog components が生成されている
✅ vercel.json に環境変数が追加されている  
✅ layout.tsx にProvider が統合されている
```

### 3. デプロイ
```bash
# 環境変数をVercelに設定
vercel env add NEXT_PUBLIC_POSTHOG_KEY
vercel env add NEXT_PUBLIC_GOOGLE_ADS_ID

# デプロイ実行
vercel --prod
```

### 4. 動作確認
1. デプロイ後のLPにアクセス
2. ブラウザの開発者ツールでPostHog初期化を確認
3. PostHogダッシュボードでイベント受信を確認

---

## 📈 分析ダッシュボードの活用

### PostHogで確認できる項目

#### 1. ページパフォーマンス
```
- ページビュー数
- セッション継続時間
- 離脱率
- スクロール深度分布
```

#### 2. コンバージョン分析
```  
- フォーム送信率
- CTAクリック率
- 流入元別CV率
- Google Ads効果測定
```

#### 3. ユーザー行動
```
- ヒートマップ（Proプラン）
- セッション録画（Proプラン）
- ファネル分析
- リテンション分析
```

### Google Adsでの確認
```
- PostHog経由のコンバージョン
- 自動入札最適化
- ROAS改善
- キャンペーン別効果測定
```

---

## 🔍 トラブルシューティング

### よくある問題と解決法

#### 1. PostHogが初期化されない
```javascript
// 確認項目
□ NEXT_PUBLIC_POSTHOG_KEY が設定されているか
□ PostHogScript.tsx が読み込まれているか
□ ブラウザのアドブロッカーが影響していないか
```

#### 2. Google Ads コンバージョンが送信されない
```javascript
// 確認項目  
□ NEXT_PUBLIC_GOOGLE_ADS_ID が正しいか
□ コンバージョンラベルが正確か
□ GoogleAdsTracking.tsx が適切に配置されているか
```

#### 3. Arc ブラウザで動作しない
```javascript
// 自動対応済み
// PostHogScript.tsx にArc対応コードが含まれています
if (navigator.userAgent.includes('Arc')) {
  console.log('Arc browser detected - PostHog initialized');
}
```

#### 4. GCLID が保存されない
```javascript
// 確認項目
□ URLにgclidパラメータが含まれているか
□ sessionStorageが有効か
□ PostHog初期化後にGCLID検出コードが実行されているか
```

---

## 🎯 ベストプラクティス

### 1. A/Bテスト設計
```javascript
// PostHog Feature Flagsを活用
posthog.isFeatureEnabled('new-headline') 
  ? 'Version A' 
  : 'Version B'
```

### 2. カスタムイベント追加
```javascript
// 重要なアクションを個別追跡
posthog.capture('pricing_clicked', {
  plan: 'premium',
  position: 'header'
})
```

### 3. ユーザー属性設定
```javascript
// ユーザープロパティで詳細分析
posthog.people.set({
  company_size: '10-50',
  industry: 'tech'
})
```

### 4. コンバージョンファネル
```javascript
// 段階的な転換率を測定
1. ページ訪問 → 2. 資料請求 → 3. 商談申込 → 4. 成約
```

---

## 📞 サポート

### 技術的な質問
- LP Suite GitHub Issues
- Discord: #lp-suite-support

### PostHog関連
- [PostHog公式ドキュメント](https://posthog.com/docs)
- [PostHog Community](https://posthog.com/community)

### Google Ads連携
- [Google Ads ヘルプセンター](https://support.google.com/google-ads)

---

*このガイドはLP Suite v3.0の機能に基づいています。最新情報は [リリースノート] を確認してください。*