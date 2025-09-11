# Google Adsコンバージョンタグ診断レポート
**作成日**: 2025年9月10日（水）
**対象アカウント**: Unson LLC (Customer ID: 4600539562)

## 📊 診断結果サマリー

**緊急度**: 🔴 **HIGH** - タグは設定済みだが、コンバージョンが発生していない

## 🔍 コンバージョンアクション設定状況

### Google Ads側の設定

| コンバージョンアクション | ステータス | タイプ | カテゴリ | ID |
|------------------------|-----------|--------|----------|-----|
| ベータテスター登録完了 | ✅ ENABLED | WEBPAGE | SIGNUP | 7254909046 |
| ページビュー | ✅ ENABLED | WEBPAGE | PAGE_VIEW | 7248195500 |

### コンバージョンタグ詳細

**共通設定**:
- **Google Ads ID**: `AW-17431174236`
- **コンバージョンラベル**: `zINmCPbAtIMbENy46vdA`

## 🎯 ランディングページ実装状況

### 1. MyWa AI News (4-active)
- ✅ Google Ads ID設定済み
- ✅ コンバージョンラベル設定済み
- ❓ 実装ファイルの詳細確認が必要

### 2. AI世代ブリッジ (2-validation)
- ✅ Google Ads ID設定済み: `AW-17431174236`
- ✅ コンバージョンラベル設定済み: `zINmCPbAtIMbENy46vdA`
- ✅ `GoogleAdsTracking.tsx`でタグ実装
- ✅ `trackFormConversion`関数実装

### 3. わたしコンパス (2-validation)
- ✅ Google Ads ID設定済み: `AW-17431174236` 
- ✅ コンバージョンラベル設定済み: `zINmCPbAtIMbENy46vdA`
- ✅ `BetaTesterForm.tsx`でコンバージョン送信実装
- ✅ フォーム送信時に`trackFormConversion`呼び出し

## 🚨 問題の可能性

### 1. ドメイン・URL不一致
```
設定されているコンバージョンラベル: zINmCPbAtIMbENy46vdA
Google Ads APIで確認したラベル: zINmCPbAtIMbENy46vdA
→ ラベルは一致している
```

### 2. 環境変数の問題
- 開発環境では`NODE_ENV === 'development'`でタグが無効化される
- 本番環境での環境変数設定を確認する必要

### 3. タグの発火タイミング
**わたしコンパス** (最も設定が整っている):
```typescript
// フォーム送信成功時の処理
trackFormSubmission('watashi-compass', 'beta-tester')
trackFormConversion('watashi-compass')  // ← コンバージョンタグ送信
```

### 4. Global Site Tagの重複可能性
- GoogleAnalytics（GA4）とGoogle Adsの両方でgtag.jsを読み込んでいる可能性
- 重複読み込みによる競合

## 🔧 推奨対応策

### 即座に実施すべき項目

1. **本番環境の環境変数確認**
   ```bash
   # Vercel/Netlify等のデプロイ先で以下が設定されているか確認
   NEXT_PUBLIC_GOOGLE_ADS_ID=AW-17431174236
   NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL=zINmCPbAtIMbENy46vdA
   ```

2. **ブラウザ開発者ツールでの確認**
   - Network タブでgoogletagmanager.comへのリクエスト確認
   - Console でgtag関数の存在確認
   - `window.dataLayer`の内容確認

3. **Google Tag Assistantでの検証**
   - Chrome拡張機能でタグの発火を確認
   - コンバージョントラッキングの動作検証

### 中期対応

4. **統合GTMの検討**
   - Google Tag Managerで一元管理
   - タグの重複排除

5. **テストコンバージョンの実行**
   - staging環境でのテスト送信
   - Google Ads管理画面でのリアルタイム確認

## 📈 Google Ads設定で確認された情報

**コンバージョンタグスニペット例**:
```javascript
gtag('event', 'conversion', {
  'send_to': 'AW-17431174236/zINmCPbAtIMbENy46vdA'
});
```

## 💡 推定原因

1. **本番環境での環境変数未設定** (可能性: 高)
2. **GTMとの競合** (可能性: 中)
3. **タグ発火タイミングの問題** (可能性: 中)
4. **キャンペーンとコンバージョンアクションの関連付け未完了** (可能性: 低)

## 🎯 次のステップ

1. **緊急**: 本番環境の環境変数確認
2. **緊急**: ブラウザでのタグ発火確認
3. **重要**: Google Tag Assistantでの検証
4. **重要**: テストコンバージョンの実行

---

**重要**: 技術的な設定は整っているが、本番環境での実行時問題が最も疑わしい。