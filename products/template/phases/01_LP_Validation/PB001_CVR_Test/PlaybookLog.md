---
playbookId: "PB-001"
playbookVersion: "1.0.0"
phase: 1
productId: "template"
startDate: "YYYY-MM-DD"
endDate: "YYYY-MM-DD"
status: "in_progress"  # in_progress/completed/failed
executor: "担当者名"
---

# LP CVRテスト 実行ログ

## 基本情報
- **プレイブック**: PB-001 v1.0.0 - LP CVRテスト
- **実行者**: [担当者名]
- **開始日**: YYYY-MM-DD
- **目標終了日**: YYYY-MM-DD（5日後）

## 実行記録

### Day 1: セットアップ・測定開始 (YYYY-MM-DD)

#### 準備作業完了チェック
- [ ] LP URL確認: https://example.com
- [ ] PostHog設定確認: プロジェクトID `phc_xxxxx`
- [ ] コンバージョン計測確認: フォーム送信イベント `form_submit`
- [ ] 初期トラフィック確認: 自然流入 XX sessions/day

#### 初期設定記録
```yaml
testConfig:
  lpUrl: "https://example.com"
  trackingTool: "PostHog"
  conversionEvent: "form_submit"  
  targetCVR: 0.10
  targetSessions: 1000
  testDuration: "5 days"
```

#### Day 1 結果
- **セッション数**: XX
- **コンバージョン数**: XX
- **CVR**: X.X%
- **技術的問題**: なし / あり（詳細記載）

### Day 2: データ収集継続 (YYYY-MM-DD)

#### 施策実施内容
- トラフィック獲得方法:
  - [ ] SNS投稿 (Twitter/LinkedIn)
  - [ ] Google Ads (日予算: ¥XXX)
  - [ ] 自然検索
  - [ ] その他: 

#### Day 2 結果  
- **セッション数**: XX (累計: XX)
- **コンバージョン数**: XX (累計: XX)  
- **CVR**: X.X% (累計: X.X%)
- **主要流入元**: Google XX%, SNS XX%, Direct XX%
- **デバイス別**: Desktop XX%, Mobile XX%

#### 観察・気づき
- 
- 
- 

### Day 3: 中間評価 (YYYY-MM-DD)

#### 中間結果サマリー
- **現在のCVR**: X.X%
- **目標達成見込み**: 高い / 普通 / 低い
- **必要追加セッション**: XXX sessions（目標1000まで）

#### 改善施策検討
現在のCVRが目標を下回る場合の対策:
- [ ] ヘッドライン調整: 「旧」→「新」
- [ ] CTA文言変更: 「旧」→「新」  
- [ ] フォーム簡略化: X項目 → Y項目
- [ ] 広告ターゲット調整
- [ ] その他: 

#### Day 3 結果
- **セッション数**: XX (累計: XX)
- **コンバージョン数**: XX (累計: XX)
- **CVR**: X.X% (累計: X.X%)

#### 実施した改善
- 改善内容:
- 実施時刻: XX:XX
- 期待効果:

### Day 4: 最終データ収集 (YYYY-MM-DD)

#### 最終日の施策
- 

#### Day 4 結果
- **セッション数**: XX (累計: XX)  
- **コンバージョン数**: XX (累計: XX)
- **CVR**: X.X% (累計: X.X%)

#### セグメント別分析
**流入元別**:
- Google Ads: CVR X.X% (sessions: XX)
- SNS: CVR X.X% (sessions: XX)  
- Direct: CVR X.X% (sessions: XX)

**デバイス別**:
- Desktop: CVR X.X% (sessions: XX)
- Mobile: CVR X.X% (sessions: XX)

**時間帯別**（もし明確な傾向があれば）:
- 午前: CVR X.X%
- 午後: CVR X.X%
- 夜間: CVR X.X%

### Day 5: 測定終了・結果確定 (YYYY-MM-DD)

#### 最終結果  
- **総セッション数**: XXX
- **総コンバージョン数**: XX
- **最終CVR**: X.X%
- **統計的有意性**: p = X.XXX (< 0.05 ✅ / > 0.05 ❌)

#### 統計計算詳細
```
サンプルサイズ: XXX sessions
コンバージョン: XX conversions  
CVR: XX/XXX = X.X%
信頼区間（95%）: [X.X%, X.X%]
Z値: X.XX
p値: X.XXX
```

## 技術的問題・解決履歴

### 発生した問題
1. **問題**: 
   - **発生日時**: 
   - **症状**: 
   - **原因**: 
   - **解決方法**: 
   - **解決日時**: 

## ユーザーフィードバック

### 定量フィードバック
- **フォームでの質問**:
  - Q: "このサービスについてどう思いますか？"
  - 回答集計: 興味あり XX%, 普通 XX%, 興味なし XX%

### 定性フィードバック  
- **コメント・問い合わせ内容**:
  1. "..."  
  2. "..."

### フィードバック分析
- **ポジティブな反応**: 
- **ネガティブな反応**: 
- **改善提案**: 

## 実行中の仮説・検証

### 開始前の仮説
1. **仮説1**: CVRは12-15%程度になる
   - **根拠**: 類似サービスの事例
   - **結果**: ✅検証 / ❌棄却 / 🔄部分的
   
2. **仮説2**: モバイルユーザーのCVRが高い
   - **根拠**: ターゲット層の行動パターン  
   - **結果**: ✅検証 / ❌棄却 / 🔄部分的

### 実行中に発見した新たな仮説
1. 
2. 

## 次フェーズへの示唆

### 成功要因（再現すべきポイント）
- 
- 

### 改善が必要な要因
- 
- 

### MVP開発での注意点
- 
- 

---

## 実行チェックリスト（完了前に確認）

### データ記録完了
- [ ] 5日間の全データを記録
- [ ] セグメント別分析完了
- [ ] 統計的検定実施
- [ ] ユーザーフィードバック整理

### 品質確認
- [ ] 数値の再計算確認
- [ ] スクリーンショット保存（PostHog画面など）
- [ ] 実行時の設定をバックアップ

### 引き継ぎ準備
- [ ] ResultSummary.mdの作成準備
- [ ] 学習事項の整理
- [ ] 次のプレイブック（必要時）の検討