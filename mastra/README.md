# Unson OS Mastra 統合ライブラリ

Google Ads AI分析・最適化システムの共通ライブラリ（全100-200マイクロSaaS対応）

## 🏗️ アーキテクチャ

```
/mastra/
├── config/           # 統一設定・定数
├── types/           # TypeScript型定義  
├── tools/           # ビジネスロジック分離
├── agents/          # AIエージェント
├── workflows/       # 処理フロー
└── index.ts         # エントリーポイント
```

## 🔧 コア機能

### 1. 広告パフォーマンス分析
- CTR、CVR、CPC自動計算
- 4時間窓でのトレンド分析
- 問題検出とアラート

### 2. AI最適化エージェント
- Mastra エージェントによる自動判断
- Google Ads API連携（計画中）
- 安全性制限とクールダウン

### 3. ワークフロー自動化
- 分析 → 判断 → 実行の完全自動化
- DRY RUN対応
- 監査ログ生成

## 📊 使用例

```typescript
import { analyzeAdsPerformance, generateOptimizationActions } from '@unson-os/mastra'

// 4時間窓分析
const analysis = await analyzeAdsPerformance(currentWindow, previousWindow)

// AI最適化アクション生成
const actions = await generateOptimizationActions(analysis)

// 実行（DRY RUN）
const results = await executeOptimizations(actions)
```

## ⚙️ 設定可能パラメータ

`/config/constants.ts` で全閾値を一元管理：
- CTR低下閾値: -10%
- CVR悪化閾値: -20%  
- CPC急上昇閾値: +50%
- 最大変更幅: 30%
- クールダウン: 24時間

## 🎯 リファクタリング成果

**Before**: ベタ書き・ハードコード多数
**After**: 
- ✅ 定数外部化
- ✅ ビジネスロジック分離  
- ✅ 単一責任原則
- ✅ 型安全性向上
- ✅ テスト容易性向上

## 🚀 導入

各マイクロSaaSから以下でインポート：

```typescript
import { /* 必要な機能 */ } from '../../../../../../mastra'
```