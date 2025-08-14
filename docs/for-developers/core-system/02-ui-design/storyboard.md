# UnsonOS 中核UI ストーリーボード設計

## 概要

UnsonOSの中核UIは、100-200個のマイクロSaaSプロダクトを効率的に管理・監督するためのダッシュボードシステムです。人間とAIエージェントが協調して意思決定を行うためのインターフェースを提供します。

## 画面一覧（主要機能別）

### 1. 統合ダッシュボード画面

全100のSaaSプロダクトの全体状況を俯瞰するトップページです。

#### 主要コンポーネント
- **全体KPIサマリー**
  - 総収益、平均利益率、稼働率などの主要指標
  - 前日比・前週比での変動を記号（↑/↓/→）で表示
  - 重要指標の推移グラフ（月次収益トレンドなど）

- **プロダクトハイライト**
  - 上位/下位パフォーマンスのプロダクト表示
  - ヘルススコア平均とアラート状況
  - 承認待ちGate数の通知バッジ

- **アクションエリア**
  - 重要アラートの表示
  - Gate承認への直接リンク
  - AIからの重要メッセージフィード

### 2. SaaSプロダクト一覧画面

個々のプロダクトの状態を一覧比較できる画面です。

#### 主要コンポーネント
- **ポートフォリオテーブル**
  ```
  | プロダクト名 | スコア | 売上 | ユーザー数 | CVR | 状態 |
  |------------|-------|------|-----------|-----|------|
  | SaaS-A     | 85 🟢 | ↑15% | ↑1,234    | →7% | 正常 |
  | SaaS-B     | 45 🔴 | ↓8%  | ↓567      | ↓3% | 要注意 |
  ```

- **フィルタリング・ソート機能**
  - スコア順、売上順、成長率順でのソート
  - カテゴリ、ステータス、担当AIでのフィルタ
  - 検索バーによる名前検索

- **一括操作**
  - 複数プロダクトの選択
  - バッチでの設定変更
  - CSVエクスポート機能

### 3. SaaS詳細画面

選択した各プロダクトの詳細状況を深掘りする画面です。

#### 主要コンポーネント

##### KPIビジュアライゼーション
```javascript
// KPIチャート構成例
{
  revenue: {
    current: "¥1,234,567",
    trend: "↑",
    change: "+15%",
    chart: "line-graph"
  },
  users: {
    current: "5,432",
    trend: "→",
    change: "+1%",
    chart: "bar-chart"
  }
}
```

##### Playbook進行状況ビュー
```mermaid
graph LR
    Start[開始 ✅] --> Guard[条件判定 ✅]
    Guard --> Action[施策実行 🔄]
    Action --> Gate[承認待ち ⏸️]
    Gate --> Outcome[結果評価 ⬜]
    
    style Start fill:#90EE90
    style Guard fill:#90EE90
    style Action fill:#87CEEB
    style Gate fill:#FFD700
    style Outcome fill:#DCDCDC
```

##### Gate承認パネル
```yaml
承認リクエスト:
  title: "価格改定施策の実行"
  提案者: "AI Agent #23"
  影響:
    売上: "↑15% 予想"
    離脱率: "↓5% リスク"
  推奨: "Go"
  
アクション:
  - 承認（緑ボタン）
  - 保留（黄ボタン）
  - 却下（赤ボタン）
  - コメント入力欄
```

### 4. Gate承認画面（承認キュー）

全プロダクト横断で保留中のGate承認リクエストを一覧する専用画面です。

#### 承認カードレイアウト
```
┌─────────────────────────────────────┐
│ 🔔 プロダクトX - 価格改定          │
│                                     │
│ 提案: 20%割引キャンペーン実施      │
│ 予想効果: 売上 ↑15% / 利益率 ↓3%  │
│ AIの推奨: 承認推奨 🟢              │
│                                     │
│ [詳細] [承認✅] [保留⏸️] [却下❌]   │
└─────────────────────────────────────┘
```

## ユーザー行動ストーリー（巡回フロー）

### 朝の定期巡回フロー

```mermaid
graph TD
    A[統合ダッシュボードログイン] --> B{全体健康状態確認}
    B -->|異常あり| C[該当SaaS詳細画面へ]
    B -->|正常| D[Gate承認キュー確認]
    C --> E[問題分析・AI提案確認]
    E --> F{Gate承認判断}
    F -->|承認| G[承認操作]
    F -->|保留| H[保留理由入力]
    F -->|却下| I[却下理由入力]
    G --> J[次の案件へ]
    H --> J
    I --> J
    J --> D
    D -->|完了| K[巡回終了]
```

### 承認フロー詳細

1. **通知確認**
   - ヘッダーの通知バッジで未承認数を確認
   - クリックでGate承認画面へ遷移

2. **内容精査**
   - 提案内容と影響指標の確認
   - AIの推奨理由の詳細確認
   - 必要に応じてシミュレーション結果参照

3. **意思決定**
   - 承認/保留/却下の選択
   - 確認ダイアログでの最終確認
   - コメント入力（保留・却下時は必須）

4. **実行とフィードバック**
   - 決定の即時反映
   - AIへのフィードバック送信
   - Playbook進行状況の更新

## インジケーター（記号化KPI）の視認性

### KPI記号の定義と表示ルール

| 記号 | 意味 | 色 | 条件 |
|------|------|-----|------|
| ↑ | 上昇 | 緑 | 前期比+5%以上 |
| → | 横ばい | 灰 | 前期比±5%未満 |
| ↓ | 下降 | 赤 | 前期比-5%以下 |

### ステータスインジケーター

```javascript
const statusIndicators = {
  completed: { icon: "✅", color: "green", label: "完了" },
  inProgress: { icon: "🔄", color: "blue", label: "進行中" },
  pending: { icon: "⏸️", color: "yellow", label: "保留" },
  error: { icon: "⚠️", color: "red", label: "エラー" },
  waiting: { icon: "⏰", color: "orange", label: "待機中" }
};
```

### スコアリング表示

```javascript
const scoreDisplay = {
  excellent: { range: [80, 100], color: "🟢", badge: "優良" },
  good: { range: [60, 79], color: "🟡", badge: "良好" },
  warning: { range: [40, 59], color: "🟠", badge: "要注意" },
  critical: { range: [0, 39], color: "🔴", badge: "危険" }
};
```

## Gate承認操作のセーフガード

### 多段階確認プロセス

```typescript
interface GateApprovalFlow {
  // Step 1: 初期選択
  initialAction: 'approve' | 'hold' | 'reject';
  
  // Step 2: 確認ダイアログ
  confirmationDialog: {
    title: string;
    impacts: Array<{metric: string, change: string}>;
    requireComment: boolean;
  };
  
  // Step 3: 最終確認（重要Gate時）
  finalConfirmation?: {
    requireSecondApprover: boolean;
    cooldownPeriod: number; // seconds
  };
  
  // Step 4: Undo機能
  undoWindow: {
    duration: 300; // 5分間
    enabled: boolean;
  };
}
```

### セキュリティ機能

1. **誤操作防止**
   - ボタンの色分けと配置の工夫
   - ダブルクリック防止
   - 確認ダイアログの必須化

2. **権限管理**
   - ロールベースのアクセス制御
   - 重要Gateの複数承認要求
   - 承認履歴の完全記録

3. **監査証跡**
   ```javascript
   {
     timestamp: "2025-01-13T10:30:00Z",
     user: "代表者A",
     action: "approved",
     gate: "PLB^pricing_change",
     comment: "市場状況を考慮し承認",
     ipAddress: "192.168.1.1"
   }
   ```

## UIトーン設計

### デザイン原則

#### 1. 安心感（Trust）
- **カラーパレット**: ブルー・グレー基調の落ち着いた配色
- **透明性**: AIの判断根拠を常に表示
- **言語**: 専門用語を避けた平易な表現

#### 2. 決定感（Decisiveness）
- **フィードバック**: 即座の視覚的確認
- **演出**: 承認時のアニメーション効果
- **確認**: 意図的な間合い（Mindful Friction）

#### 3. 信頼感（Partnership）
- **AI表現**: 控えめだが認識可能なAIプレゼンス
- **対話性**: 双方向のフィードバックループ
- **学習表示**: AI改善の可視化

### メッセージトーン例

```javascript
const messageTemplates = {
  aiProposal: "分析の結果、{action}を提案します。ご判断をお願いします。",
  approvalThanks: "承認ありがとうございます。引き続き対応いたします。",
  rejectionAck: "却下を承知しました。代替案を検討します。",
  learningFeedback: "フィードバックを学習し、提案精度を改善しました。"
};
```

## レスポンシブデザイン考慮事項

### デバイス別最適化

| デバイス | 画面サイズ | 主な用途 | UI調整 |
|---------|-----------|---------|--------|
| デスクトップ | 1920x1080+ | 詳細分析・承認作業 | フル機能 |
| タブレット | 768-1024px | 外出先での確認・承認 | 簡略表示 |
| モバイル | 〜767px | 緊急承認・通知確認 | 最小限機能 |

### アクセシビリティ

- **キーボード操作**: Tab順序の最適化
- **スクリーンリーダー**: ARIA属性の適切な設定
- **色覚異常対応**: 色だけに依存しない情報伝達
- **文字サイズ**: 可変対応（最小14px）

## パフォーマンス目標

| 指標 | 目標値 | 測定方法 |
|------|--------|----------|
| 初期表示 | < 2秒 | First Contentful Paint |
| インタラクティブ | < 3秒 | Time to Interactive |
| API応答 | < 500ms | 95パーセンタイル |
| リアルタイム更新 | < 100ms | WebSocket遅延 |

## 実装技術スタック

```javascript
const techStack = {
  frontend: {
    framework: "Next.js 14",
    ui: "Tailwind CSS + shadcn/ui",
    charts: "Recharts / D3.js",
    state: "Zustand / TanStack Query"
  },
  realtime: {
    protocol: "WebSocket",
    library: "Socket.io",
    fallback: "Server-Sent Events"
  },
  monitoring: {
    analytics: "PostHog",
    errors: "Sentry",
    performance: "Web Vitals"
  }
};
```

## 今後の拡張計画

1. **AI対話機能の強化**
   - 自然言語での指示入力
   - 音声コマンド対応
   - ChatGPT統合

2. **予測ダッシュボード**
   - What-ifシナリオ分析
   - 将来予測の可視化
   - リスクアラート

3. **協調機能**
   - チームメンバー間の共有
   - コメント・議論機能
   - 承認ワークフロー拡張

## 関連ドキュメント

- [データ駆動コアシステム](./data-driven-core.md)
- [Playbook DSL仕様](./playbook-dsl-spec.md)
- [Gate承認設計](./playbook-dsl-spec.md#gate-node)
- [Product SDK実装ガイド](./product-sdk-guide.md)