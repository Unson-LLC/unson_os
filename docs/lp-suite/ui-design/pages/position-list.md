# ポジション一覧画面

## 📍 パス
`/position` - PositionListPage

## 🎯 画面の目的
管理中の全プロダクト（ポジション）を一覧表示し、各プロダクトのパフォーマンス概要を確認、詳細画面への導線を提供する。

## 🖼️ 画面構成

### ヘッダーセクション
```
┌──────────────────────────────────────────────┐
│ ポジション管理                               │
│ 7個のアクティブなポジション                  │
│                        [+ 新規ポジション追加] │
└──────────────────────────────────────────────┘
```

### フィルター・ソートセクション
```tsx
interface FilterOptions {
  status: 'all' | 'running' | 'paused' | 'completed'
  category: string[] // ['コミュニケーション', 'ライフスタイル', etc]
  sortBy: 'name' | 'cvr' | 'ctr' | 'cost' | 'updated'
  sortOrder: 'asc' | 'desc'
}
```

**UI表示:**
```
[全て ▼] [カテゴリ ▼] [並び替え: 更新日時 ▼]
```

### ポジションカードグリッド
```
┌─────────────┬─────────────┬─────────────┐
│ AI-BRIDGE   │ MYWA        │ AI-COACH    │
│ AI世代      │ わたしｺﾝﾊﾟｽ │ ﾍﾙｽｹｱ      │
│ 🟢 運用中   │ 🟢 運用中   │ 🟢 運用中   │
│             │             │             │
│ CVR: 0%     │ CVR: 4.14%  │ CVR: 0%     │
│ CTR: 3.48%  │ CTR: 4.13%  │ CTR: 0%     │
│ 費用: ¥383  │ 費用: ¥6322 │ 費用: ¥0    │
│             │             │             │
│ [詳細を見る]│ [詳細を見る]│ [詳細を見る]│
└─────────────┴─────────────┴─────────────┘

┌─────────────┬─────────────┬─────────────┐
│ AI-STYLIST  │ Position 5  │ Position 6  │
│ ｽﾀｲﾘﾝｸﾞ     │ 準備中      │ 準備中      │
│ 🟡 準備中   │ ⚪ 未開始   │ ⚪ 未開始   │
│             │             │             │
│ CVR: --     │ CVR: --     │ CVR: --     │
│ CTR: --     │ CTR: --     │ CTR: --     │
│ 費用: --    │ 費用: --    │ 費用: --    │
│             │             │             │
│ [設定する]  │ [設定する]  │ [設定する]  │
└─────────────┴─────────────┴─────────────┘
```

## 📊 データ構造

```typescript
interface Position {
  id: string                // 'AI-BRIDGE', 'MYWA', etc
  name: string              // 表示名
  category: string          // カテゴリ
  status: PositionStatus    
  metrics: {
    cvr: number | null      // コンバージョン率
    ctr: number | null      // クリック率
    impressions: number     // インプレッション
    clicks: number          // クリック数
    cost: number           // 消化金額
    conversions: number    // コンバージョン数
  }
  lastUpdated: Date        // 最終更新
  createdAt: Date          // 作成日時
}

type PositionStatus = 
  | 'running'    // 🟢 運用中
  | 'paused'     // 🟡 一時停止
  | 'completed'  // 🔵 完了
  | 'draft'      // ⚪ 下書き
```

## 💻 実装コード

### メインコンポーネント
```tsx
'use client'

export default function PositionListPage() {
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterOptions>({
    status: 'all',
    category: [],
    sortBy: 'updated',
    sortOrder: 'desc'
  })
  
  useEffect(() => {
    fetchPositions()
  }, [filter])
  
  const fetchPositions = async () => {
    try {
      const response = await fetch('/api/positions')
      const data = await response.json()
      
      if (data.success) {
        setPositions(applyFilters(data.positions, filter))
      }
    } catch (error) {
      console.error('Failed to fetch positions:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <PositionHeader count={positions.length} />
      <FilterBar filter={filter} onChange={setFilter} />
      
      {loading ? (
        <LoadingGrid />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {positions.map(position => (
            <PositionCard key={position.id} position={position} />
          ))}
        </div>
      )}
    </div>
  )
}
```

### ポジションカードコンポーネント
```tsx
function PositionCard({ position }: { position: Position }) {
  const router = useRouter()
  const statusConfig = {
    running: { color: 'green', icon: '🟢', label: '運用中' },
    paused: { color: 'yellow', icon: '🟡', label: '一時停止' },
    completed: { color: 'blue', icon: '🔵', label: '完了' },
    draft: { color: 'gray', icon: '⚪', label: '下書き' }
  }
  
  const status = statusConfig[position.status]
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      {/* ヘッダー */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{position.id}</h3>
          <p className="text-sm text-gray-600">{position.name}</p>
        </div>
        <div className="flex items-center">
          <span className="mr-1">{status.icon}</span>
          <span className={`text-sm text-${status.color}-600`}>
            {status.label}
          </span>
        </div>
      </div>
      
      {/* メトリクス */}
      <div className="space-y-2 mb-4">
        <MetricRow 
          label="CVR" 
          value={position.metrics.cvr ? `${position.metrics.cvr}%` : '--'}
          trend={getTrend(position.metrics.cvr)}
        />
        <MetricRow 
          label="CTR" 
          value={position.metrics.ctr ? `${position.metrics.ctr}%` : '--'}
          trend={getTrend(position.metrics.ctr)}
        />
        <MetricRow 
          label="費用" 
          value={position.metrics.cost ? `¥${position.metrics.cost.toLocaleString()}` : '--'}
        />
      </div>
      
      {/* アクションボタン */}
      <button
        onClick={() => router.push(`/position/${position.id}`)}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
      >
        {position.status === 'running' ? '詳細を見る' : '設定する'}
      </button>
    </div>
  )
}
```

### フィルター実装
```tsx
function applyFilters(positions: Position[], filter: FilterOptions): Position[] {
  let filtered = [...positions]
  
  // ステータスフィルター
  if (filter.status !== 'all') {
    filtered = filtered.filter(p => p.status === filter.status)
  }
  
  // カテゴリフィルター
  if (filter.category.length > 0) {
    filtered = filtered.filter(p => 
      filter.category.includes(p.category)
    )
  }
  
  // ソート
  filtered.sort((a, b) => {
    let aVal, bVal
    
    switch (filter.sortBy) {
      case 'name':
        aVal = a.name
        bVal = b.name
        break
      case 'cvr':
        aVal = a.metrics.cvr || 0
        bVal = b.metrics.cvr || 0
        break
      case 'ctr':
        aVal = a.metrics.ctr || 0
        bVal = b.metrics.ctr || 0
        break
      case 'cost':
        aVal = a.metrics.cost
        bVal = b.metrics.cost
        break
      case 'updated':
        aVal = a.lastUpdated
        bVal = b.lastUpdated
        break
    }
    
    if (filter.sortOrder === 'asc') {
      return aVal < bVal ? -1 : 1
    } else {
      return aVal > bVal ? -1 : 1
    }
  })
  
  return filtered
}
```

## 🎨 スタイリング

### ステータスカラー
```scss
.status-running { color: #10b981; }   // Green
.status-paused { color: #f59e0b; }    // Yellow  
.status-completed { color: #3b82f6; }  // Blue
.status-draft { color: #6b7280; }     // Gray
```

### レスポンシブグリッド
```tsx
// 1カラム（モバイル） → 2カラム（タブレット） → 3カラム（デスクトップ）
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* ポジションカード */}
</div>
```

## 🔄 状態管理

```typescript
interface PositionListState {
  positions: Position[]
  filter: FilterOptions
  loading: boolean
  error: string | null
  selectedPositions: string[] // 複数選択用
}
```

## ⚡ パフォーマンス最適化

1. **仮想スクロール**（大量ポジション時）
   ```tsx
   import { FixedSizeGrid } from 'react-window'
   ```

2. **遅延ロード**
   ```tsx
   const PositionCard = lazy(() => 
     import('@/components/PositionCard')
   )
   ```

3. **フィルターのデバウンス**
   ```tsx
   const debouncedFilter = useMemo(
     () => debounce(applyFilters, 300),
     []
   )
   ```

## 🔗 画面遷移

- **新規追加**: `/position/new` - 新規ポジション作成
- **詳細表示**: `/position/[id]` - 個別ポジション詳細
- **一括操作**: 複数選択 → 一括停止/再開/削除
- **エクスポート**: CSVダウンロード機能

---

**最終更新**: 2025年9月4日  
**コンポーネントパス**: `apps/lp-suite/src/app/position/page.tsx`