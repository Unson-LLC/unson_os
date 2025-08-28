# わたしコンパス Google Ads 実績インポーター

## 概要

わたしコンパス（productId: 2025-08-006-watashi-compass）のGoogle Ads実績を4時間ごとに集計し、Convexデータベースに投入するスクリプトです。

## 機能

- **CSV読み込み**: Google Ads管理画面からエクスポートしたCSVファイルを解析
- **4時間窓集計**: 時間別データを4時間窓（00:00, 04:00, 08:00, 12:00, 16:00, 20:00）に集計
- **JST対応**: 日本標準時（JST）でタイムスタンプを正確に計算
- **自動投入**: ConvexのAPIエンドポイントに自動投入（重複は上書き）
- **投入検証**: 投入後に自動検証でデータ整合性を確認

## 使用方法

### 基本実行

```bash
node watashi-compass-ads-importer.js --csv sample-watashi-compass-ads.csv --base-url http://localhost:3005
```

### オプション

- `--csv <file>`: CSVファイルのパス（必須）
- `--base-url <url>`: APIベースURL（デフォルト: http://localhost:3000）
- `--help`: ヘルプ表示

## CSVファイル形式

Google Ads管理画面からエクスポートする際は、以下の列を含むCSVファイルを作成してください：

```csv
日付,時間,インプレッション,クリック,費用,コンバージョン
2025-08-28,0,520,25,945,1
2025-08-28,1,480,23,874,2
...
```

### サポートする列名

- **日付**: `日付`, `Date`, `date`
- **時間**: `時間`, `Hour`, `hour`
- **インプレッション**: `インプレッション`, `Impressions`, `impressions`
- **クリック**: `クリック`, `Clicks`, `clicks`
- **費用**: `費用`, `Cost`, `cost`
- **コンバージョン**: `コンバージョン`, `Conversions`, `conversions`

## 4時間窓の仕様

| 窓番号 | 時間範囲 | JST開始時刻 |
|--------|---------|-------------|
| 1 | 00:00-03:59 | 00:00 |
| 2 | 04:00-07:59 | 04:00 |
| 3 | 08:00-11:59 | 08:00 |
| 4 | 12:00-15:59 | 12:00 |
| 5 | 16:00-19:59 | 16:00 |
| 6 | 20:00-23:59 | 20:00 |

## APIエンドポイント

### 投入API
```
POST /api/positions/2025-08-006-watashi-compass/ads
```

**ペイロード例:**
```json
{
  "mode": "4h",
  "windowHours": 4,
  "items": [
    {
      "ts_start": 1756334400000,
      "impressions": 2040,
      "clicks": 98,
      "cost": 3706,
      "conversions": 4
    }
  ]
}
```

### 検証API
```
GET /api/positions/2025-08-006-watashi-compass/ads?granularity=4h
```

## 実行例

### 成功時の出力

```
🎯 わたしコンパス Google Ads 実績インポーター
==================================================
モード: csv
ベースURL: http://localhost:3005
プロダクトID: 2025-08-006-watashi-compass
📁 CSVファイル読み込み: sample-watashi-compass-ads.csv
📊 CSVデータを解析中...
   ヘッダー: 日付, 時間, インプレッション, クリック, 費用, コンバージョン
   24件のレコードを解析
🔄 4時間窓に集計中...
   6個の4時間窓に集計完了
   2025/8/28 0:00:00: Imp=2040, Clk=98, Cost=¥3706, Conv=4
   2025/8/28 4:00:00: Imp=2285, Clk=108, Cost=¥4083, Conv=7
   2025/8/28 8:00:00: Imp=2380, Clk=113, Cost=¥4296, Conv=7
   2025/8/28 12:00:00: Imp=2115, Clk=99, Cost=¥3735, Conv=5
   2025/8/28 16:00:00: Imp=2230, Clk=105, Cost=¥3977, Conv=6
   2025/8/28 20:00:00: Imp=1860, Clk=81, Cost=¥3033, Conv=4
🚀 Convexに6個の窓データを投入中...
✅ 投入成功: 6件
🔍 投入データを検証中...
✅ 検証成功: 6件の4時間窓データが確認されました
   2025-08-28 20:00: Imp=1860, Clk=81, Cost=¥3033, Conv=4
   2025-08-28 16:00: Imp=2230, Clk=105, Cost=¥3977, Conv=6
   2025-08-28 12:00: Imp=2115, Clk=99, Cost=¥3735, Conv=5
   2025-08-28 08:00: Imp=2380, Clk=113, Cost=¥4296, Conv=7
   2025-08-28 04:00: Imp=2285, Clk=108, Cost=¥4083, Conv=7
   ... その他 1件

🎉 完了！わたしコンパスのGoogle Ads実績がConvexに正常投入されました
```

## 前提条件

- Node.js 18+
- lp-validation開発サーバーが起動していること（ポート3005など）
- Convexデータベースが稼働していること
- 対象プロダクト（2025-08-006-watashi-compass）がConvexに登録済みであること

## トラブルシューティング

### よくあるエラー

1. **HTTP 404**: サーバーが起動していない、またはエンドポイントが存在しない
2. **HTTP 500**: サーバー側でエラー（ログを確認）
3. **CSV解析エラー**: ファイル形式や文字エンコードを確認
4. **タイムスタンプエラー**: 日付形式を確認（YYYY-MM-DD）

### デバッグ方法

- サーバーログを確認: `npm run dev` の出力を確認
- Convexダッシュボードでデータを確認
- ブラウザで手動API確認: `http://localhost:3005/api/positions/2025-08-006-watashi-compass/ads?granularity=4h`

## 技術仕様

- **タイムゾーン**: JST（UTC+9）
- **データ形式**: JSON
- **重複処理**: 同一(product_id, ts_start)は上書き（UPSERT）
- **コスト単位**: 円（整数）
- **集計方式**: SUM（インプレッション、クリック、費用、コンバージョン）

## ファイル構成

- `watashi-compass-ads-importer.js` - メインスクリプト
- `sample-watashi-compass-ads.csv` - サンプルデータ
- `README-watashi-compass.md` - このドキュメント