# PostHog統合確認手順

## ✅ 完了した設定

1. **PostHog SDK導入**
   - posthog-js, posthog-node インストール済み
   - APIキー設定済み: `phc_Wae76RkdVCmtlZVdaCZ17sdj45CECqq0l3b7YftBiUG`

2. **5つのLPサービスに統合**
   - mywa
   - ai-bridge  
   - ai-stylist
   - ai-legacy-creator
   - ai-coach

3. **Google Ads連携**
   - Data Pipeline設定済み
   - 同期テーブル:
     - campaign
     - campaign_stats
     - keyword
     - keyword_stats
     - ad_group_stats

## 🔍 確認方法

### 1. PostHogダッシュボードで確認

1. [PostHog](https://us.posthog.com) にログイン
2. 左メニュー「Activity」→「Live events」
3. イベントが表示されているか確認：
   - `$pageview` - ページビュー
   - `$autocapture` - 自動収集イベント
   - カスタムイベント（form_submitted等）

### 2. テストページでの確認

```bash
# テストHTMLを開く
open test-posthog.html
```

このページを開くと自動的に以下のイベントが送信されます：
- `$pageview` イベント
- `test_event` カスタムイベント

### 3. 実際のLPでの確認

```bash
# mywaサービスにアクセス
open http://localhost:3001
```

ページを開いてから、PostHogダッシュボードで：
- **Filter by**: `service_name = 'mywa'`

## 📊 Google Ads データ確認

### Data Pipelineステータス

1. PostHog → Data pipeline → Sources
2. Google Ads sourceの「LAST SUCCESSFUL RUN」を確認
3. 「TOTAL ROWS SYNCED」でデータ量確認

### SQLでデータ確認

PostHog → SQL editor で以下のクエリ実行：

```sql
-- キャンペーンデータ確認
SELECT * FROM googleads_campaign LIMIT 10;

-- キーワードパフォーマンス確認
SELECT 
  keyword,
  clicks,
  impressions,
  cost_micros / 1000000.0 as cost_jpy
FROM googleads_keyword_stats
WHERE date >= '2025-08-01'
ORDER BY clicks DESC
LIMIT 20;
```

## ⚠️ トラブルシューティング

### イベントが表示されない場合

1. **ブラウザの広告ブロッカー**を無効化
2. **開発者ツール**のConsoleで確認：
   ```javascript
   console.log(typeof posthog); // 'object'が表示されるべき
   posthog.capture('test_from_console');
   ```

3. **環境変数**の確認：
   ```bash
   grep POSTHOG services/mywa/.env.local
   ```

### Google Adsデータが同期されない場合

1. Data Pipeline → Sources → Google Ads → 「Sync now」
2. エラーがある場合は「View logs」で確認
3. 権限不足の場合はGoogle Adsアカウントで権限確認

## 🎯 次のステップ

1. **ダッシュボード作成**
   - LP別パフォーマンス
   - コンバージョンファネル
   - ヒートマップ分析

2. **アラート設定**
   - コンバージョン率低下
   - エラー発生
   - トラフィック異常

3. **A/Bテスト実装**
   - Feature Flags設定
   - 実験グループ作成

---

**PostHogダッシュボード**: https://us.posthog.com/project/phc_Wae76RkdVCmtlZVdaCZ17sdj45CECqq0l3b7YftBiUG