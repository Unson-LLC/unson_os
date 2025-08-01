# 📋 ドキュメントページ改善ロードマップ

DOCUMENTS_OVERVIEW.mdのユーザー中心設計を実際のドキュメントページに反映させるための実装計画です。

---

## 🎯 改善の目的

1. **ユーザータイプ別の導線を明確化**
2. **現在のステータス（🟢🟡🔴）を全ページで統一**
3. **「今できること」を最優先で表示**
4. **期待値管理の徹底**

---

## 📅 実装フェーズ

### Phase 1: ドキュメントトップページの改修（優先度：最高）

#### 1-1. `/docs/page.tsx` の再構成
**実装内容：**
- ユーザータイプ別セクションの追加
- 現在地表示（🟢今すぐ・🟡設計中・🔴将来）
- 「5分で分かるUnsonOS」セクションの追加

**変更箇所：**
```typescript
// 現在：プロダクト中心の構成
const documentationSections = [
  { title: 'はじめに', ... },
  { title: '技術・アーキテクチャ', ... },
  ...
]

// 改善後：ユーザータイプ別構成
const userTypeGuides = [
  { type: 'エンジニア', icon: '💻', ... },
  { type: 'ビジネス', icon: '💼', ... },
  { type: 'アーリーアダプター', icon: '🌟', ... }
]
```

**実装時間：** 2-3時間

---

### Phase 2: 各ドキュメントへのステータス追加（優先度：高）

#### 2-1. ステータスコンポーネントの作成
**ファイル：** `/components/docs/StatusBadge.tsx`
```typescript
type Status = 'available' | 'in-discussion' | 'future'

const StatusBadge = ({ status }: { status: Status }) => {
  const config = {
    available: { color: 'green', icon: '🟢', text: '利用可能' },
    'in-discussion': { color: 'yellow', icon: '🟡', text: '議論中' },
    future: { color: 'red', icon: '🔴', text: '構想段階' }
  }
  // ... 実装
}
```

#### 2-2. 各ドキュメントページへの適用
**対象ファイル：**
- `/docs/introduction/page.tsx` - 🔴 構想段階
- `/docs/development/setup-guide/page.tsx` - 🟢 利用可能
- `/docs/technical/architecture/page.tsx` - 🟡 設計中
- 他、全ドキュメントページ

**実装時間：** 3-4時間

---

### Phase 3: ナビゲーション改善（優先度：中）

#### 3-1. DocsLayoutの改修
**ファイル：** `/components/layout/DocsLayout.tsx`

**実装内容：**
- サイドバーにステータスアイコン追加
- 「今すぐできること」セクションを最上部に
- ユーザータイプ別フィルター機能

**実装時間：** 2-3時間

---

### Phase 4: クイックスタートの強化（優先度：高）

#### 4-1. インタラクティブなユーザータイプ診断
**新規ファイル：** `/components/docs/UserTypeQuiz.tsx`

**機能：**
- 3-4問の簡単な質問
- 結果に応じて最適なドキュメントを提案
- ローカルストレージに保存

**実装時間：** 3-4時間

---

### Phase 5: 期待値管理の強化（優先度：最高）

#### 5-1. 全ドキュメントへの警告バナー追加
**コンポーネント：** `/components/docs/ExpectationBanner.tsx`

**表示内容：**
- 構想段階のドキュメントには明確な警告
- 実装予定時期の表示
- 現在参加できる活動への誘導

**実装時間：** 1-2時間

---

## 🛠️ 技術的実装詳細

### 共通コンポーネント

#### 1. ステータス管理
```typescript
// /types/documentation.ts
export interface DocMetadata {
  title: string
  status: 'available' | 'in-discussion' | 'future'
  estimatedLaunch?: string
  lastUpdated: string
  readTime: string
}
```

#### 2. ユーザータイプ管理
```typescript
// /hooks/useUserType.ts
export const useUserType = () => {
  const [userType, setUserType] = useState<UserType | null>(null)
  // localStorage から取得・保存
  return { userType, setUserType }
}
```

### データ構造の改善

#### 現在の構造（プロダクト中心）
```
docs/
├── introduction/
├── technical/
├── strategy/
└── dao/
```

#### 改善案（ユーザー中心）
```
docs/
├── getting-started/     # 🟢 今すぐ始める
├── contributing/        # 🟢 貢献方法
├── in-development/      # 🟡 開発中
└── future-vision/       # 🔴 将来構想
```

---

## 📊 実装優先順位

### 🔥 即実装（1-2日）
1. ドキュメントトップページのユーザータイプ別導線
2. 各ページへのステータスバッジ追加
3. 期待値管理バナーの実装

### 📅 短期実装（1週間）
1. DocsLayoutの改修
2. ユーザータイプ診断機能
3. ナビゲーションの改善

### 🎯 中期実装（2-3週間）
1. ドキュメント構造の再編成
2. インタラクティブなチュートリアル
3. 貢献度トラッキングシステム

---

## 🚀 実装開始の手順

### Step 1: ブランチ作成
```bash
git checkout -b feature/user-centric-docs
```

### Step 2: ステータスコンポーネントの実装
1. `StatusBadge.tsx` の作成
2. 型定義の追加
3. スタイリングの実装

### Step 3: ドキュメントトップページの改修
1. ユーザータイプセクションの追加
2. 現在地表示の実装
3. レスポンシブ対応

### Step 4: 各ドキュメントへの適用
1. メタデータの追加
2. ステータスバッジの表示
3. 期待値管理バナーの追加

---

## 📈 成功指標

### 定量的指標
- ドキュメントページの滞在時間 +20%
- Discord参加率 +50%
- GitHub Issue/PR作成数 +30%

### 定性的指標
- 「今何ができるか分かりやすい」というフィードバック
- 期待値のミスマッチに関する苦情の減少
- 各ユーザータイプからの満足度向上

---

## 🎨 デザインガイドライン

### カラーコード
- 🟢 利用可能: `#10B981` (green-500)
- 🟡 議論中: `#F59E0B` (yellow-500)
- 🔴 構想段階: `#EF4444` (red-500)

### アイコン使用
- エンジニア: 💻
- ビジネス: 💼
- アーリーアダプター: 🌟
- 一般: 🤔

### レイアウト原則
1. モバイルファースト
2. スキャナビリティ重視
3. CTAの明確化

---

## 🤝 チーム連携

### 担当者割り当て案
- **フロントエンド**: ステータスコンポーネント、UI改善
- **バックエンド**: メタデータ管理システム
- **デザイン**: ユーザータイプ別アイコン、ビジュアル改善
- **コンテンツ**: 各ドキュメントのステータス確認・更新

### レビュープロセス
1. 機能ブランチでの実装
2. ステージング環境でのテスト
3. ユーザビリティテスト（5名程度）
4. フィードバック反映
5. 本番デプロイ

---

## 📝 実装チェックリスト

### Phase 1
- [ ] ユーザータイプ別セクションの設計
- [ ] ドキュメントトップページの実装
- [ ] レスポンシブ対応の確認

### Phase 2
- [ ] StatusBadgeコンポーネントの作成
- [ ] 全ドキュメントへのステータス追加
- [ ] 型定義の整備

### Phase 3
- [ ] DocsLayoutの改修設計
- [ ] サイドバーへのステータス表示
- [ ] フィルター機能の実装

### Phase 4
- [ ] ユーザータイプ診断の設計
- [ ] インタラクティブUIの実装
- [ ] 結果保存機能

### Phase 5
- [ ] 期待値管理バナーの作成
- [ ] 全ページへの適用
- [ ] 文言の最適化

---

*作成日: 2025年7月25日*
*最終更新: 2025年7月25日*