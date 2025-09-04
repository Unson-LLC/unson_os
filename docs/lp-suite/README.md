# LP Suite - ランディングページ検証・管理プラットフォーム

## 📋 プロジェクト概要

**LP検証システム（LP Suite）**は、100個のマイクロSaaSプロダクトのランディングページ検証・Google Ads最適化・プロダクト管理を統合したプラットフォームです。Unson OSの短期開発サイクルにおける検証フェーズを担い、成功したLPのMVP開発への自動移行を支援します。

### 主要機能
- **Google Ads管理**: 4時間毎自動データ同期・最適化
- **時系列分析**: リアルタイムパフォーマンス監視
- **LP生成・A/Bテスト**: 自動LP生成とPostHog連携
- **プロダクト管理**: AI-BRIDGE、MYWA、AI-COACH等の統合管理
- **ドメイン自動化**: DNS・SSL証明書自動管理
- **アラート・通知**: 異常値検知とDiscord通知
- **自動化ワークフロー**: Mastra連携での24時間自動運用

## 🏗️ システム構成

### 技術スタック
```
Frontend: Next.js 14 + TypeScript + Tailwind CSS
Backend: Convex (リアルタイムDB + サーバーレス関数)
APIs: Google Ads API v19 + PostHog + OpenAI
自動化: Mastra Workflows + Cron Jobs
```

### 主要メトリクス
- **37のAPIエンドポイント**
- **4時間毎のGoogle Ads同期**
- **7つのプロダクト統合管理**
- **リアルタイム時系列データ分析**

## 🎯 現在のフェーズ状況

### Phase 2完了済み（lp-validation統合）
- ✅ Convex基盤構築・スキーマ設計完了
- ✅ Google Ads API統合・4時間毎Cron同期実装
- ✅ 時系列データUI・「※サンプルデータ」除去完了
- ✅ プロダクト別データ分離（AI-BRIDGE, MYWA等）
- ✅ アラート・異常値検知システム実装

### 現在の成果指標
- **データ同期成功率**: 99%以上達成
- **UI応答時間**: 2秒以内達成
- **4時間窓データ**: リアルタイム表示対応
- **プロダクト分離**: 各プロダクト独立データ管理

## 🚀 主要プロダクト

| プロダクト | 種別 | 状態 | 主要メトリクス |
|------------|------|------|----------------|
| AI-BRIDGE | コミュニケーション支援 | 運用中 | 低CTR・改善中 |
| MYWA | わたしコンパス | 運用中 | 高CTR・安定運用 |
| AI-COACH | 個人向けヘルスケア | 運用中 | 順調な成長 |
| AI-STYLIST | パーソナルスタイリング | 運用中 | 検証段階 |

## 💾 データベース設計

Convexスキーマで以下のテーブルを統合管理：

### 主要テーブル
- `lpValidationSessions`: LP検証セッション管理
- `products`: プロダクト情報・ステータス管理  
- `adsWindowMetrics`: 4時間窓Google Adsデータ
- `adsDailyMetrics`: 日次集計データ
- `campaigns`: キャンペーン情報管理
- `alerts`: アラート・通知管理
- `lpConfigs`: LP設定・A/Bテスト管理

### 設計原則
- **マルチテナント対応**: 全テーブルでworkspace_id分離
- **product_id統一**: 全関連テーブルで一貫したプロダクトID使用
- **リアルタイム対応**: Convexライブクエリでリアルタイム更新

## 🔄 自動化ワークフロー

### Cronジョブスケジュール
```typescript
// Google Ads 4時間毎データ同期
crons.interval("ads-sync", { hours: 4 }, api.ads.syncGoogleAdsData)

// 日次集計・レポート生成
crons.daily("daily-analytics", { hourUTC: 2 }, api.analytics.generateDailyReport)

// 異常値検知・アラート
crons.interval("anomaly-detection", { minutes: 30 }, api.alerts.detectAnomalies)
```

### Mastra統合
- **包括的Google Ads自動化**: キーワード最適化・入札調整
- **LP自動生成**: AI生成コンテンツ・A/Bテスト自動実行  
- **異常値対応**: 自動アラート・Discord通知
- **MVP移行**: 検証成功時の自動MVP開発トリガー

## 📊 監視・アラート

### リアルタイム監視
- **CVR低下検知**: 閾値を下回った場合の自動アラート
- **CPA超過検知**: 予算上限超過時の自動キャンペーン調整
- **異常トラフィック**: 想定外のスパイク・ドロップ検知

### 通知チャンネル
- **Discord**: 統合通知チャンネル（技術・ビジネス両方）
- **メール**: 緊急時エスカレーション

> **変更履歴**: プロジェクト進行中にSlack→Discordコミュニティ運用に移行したため、通知も統一

## 🔧 開発・運用

### TDD原則（t_wada方式）
- **RED**: テスト失敗→実装
- **GREEN**: ベタ書きで通す
- **REFACTOR**: ハードコード除去必須

### 主要コマンド
```bash
# 開発サーバー
npm run dev

# Google Ads手動同期
npx convex run ads:syncGoogleAdsData '{"product_id":"AI-BRIDGE"}'

# テスト実行
npm test
npx playwright test

# 本番デプロイ
npm run build
vercel deploy --prod
```

### 品質保証
- **TypeScript**: 型安全性確保
- **ESLint**: コード品質維持
- **Playwright**: E2E自動テスト
- **Convex**: リアルタイムデータ整合性

## 🔄 LP検証からMVP開発への移行プロセス

### 検証成功判定基準
- **CVR**: 目標値以上（通常10%以上）
- **CPA**: 目標値以下（通常¥300以下）
- **必要セッション数**: 統計的有意性確保（最低1000セッション）

### 自動移行フロー
1. **成功判定**: 上記基準をクリアした際に自動でphase_gate: "success"を記録
2. **通知**: Discord通知でMVP開発チームに成功LP情報を送信
3. **データ引き継ぎ**: 成功したLPの設定・メトリクス・ユーザーインサイトをMVP開発環境に転送
4. **MVPプロジェクト作成**: Convexの`products`テーブルで新プロジェクトを自動生成
5. **開発開始**: AI Coachエージェントが要件定義・設計書を自動作成

### 失敗時の処理
- **CVR低下**: 目標の50%未満で警告→自動改善施策実行
- **予算超過**: CPA上限到達で自動キャンペーン停止
- **期間満了**: 1ヶ月経過で強制終了→次のアイデア検証へ

## 📈 将来計画

### Phase 3: スケーリング
- **国際化対応**: 英語・中国語展開
- **マルチプラットフォーム**: Facebook/X Ads統合
- **AI最適化強化**: GPT-4連携による自動改善

### Phase 4: エコシステム拡張  
- **API公開**: サードパーティ連携
- **ダッシュボード拡張**: カスタムウィジェット
- **収益最適化**: 動的価格調整・A/Bテスト自動化

---

## 📚 関連ドキュメント

- [システムアーキテクチャ](./architecture.md)
- [主要機能詳細](./features.md)
- [APIリファレンス](./api-reference.md)
- [データベース設計](./database-design.md)
- [UI設計](./ui-design/README.md)
- [開発・運用ガイド](./development-guide.md)

**最終更新**: 2025年9月4日  
**ステータス**: Phase 2完了・運用開始