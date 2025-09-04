# TimeSeriesList コンポーネント

## 📍 パス
`/components/TimeSeriesList.tsx`

## 🎯 コンポーネントの目的
Google Ads 4時間窓データを時系列イベントとして表示し、パフォーマンストレンドと最適化アクションを可視化する。

## 🖼️ UI構成

### 基本レイアウト
```
┌─────────────────────────────────────────┐
│ 時系列イベント分析                      │
│ 全48件のイベント                        │
├─────────────────────────────────────────┤
│ ━━━━ 2025年9月4日 ━━━━                │
├─────────────────────────────────────────┤
│ ┌───────────────────────────────────┐  │
│ │ 20:00~24:00    📊 1,234 sessions  │  │
│ │                                    │  │
│ │ CVR: 4.14% ↑   CTR: 3.5% →       │  │
│ │ CPL: ¥86       Cost: ¥6,322       │  │
│ │                                    │  │
│ │ 🤖 パフォーマンス良好             │  │
│ │ ✅ キーワード最適化実行済         │  │
│ └───────────────────────────────────┘  │
├─────────────────────────────────────────┤
│ ┌───────────────────────────────────┐  │
│ │ 16:00~20:00    📊 987 sessions    │  │
│ │                                    │  │
│ │ CVR: 3.8% →    CTR: 3.2% ↓       │  │
│ │ CPL: ¥92       Cost: ¥5,100       │  │
│ │                                    │  │
│ │ ⚠️ CTR低下を検知                  │  │
│ │ 🔄 広告文A/Bテスト開始           │  │
│ └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## 📊 データ構造

### Props定義
```typescript
interface TimeSeriesListProps {
  sessionId: string
  events: TimeSeriesEvent[]
  loading?: boolean
  error?: string | null
  selectedEventId?: string
  hasMore?: boolean
  onEventSelect?: (event: TimeSeriesEvent) => void
  onLoadMore?: () => void
}
```

### イベントデータ構造
```typescript
interface TimeSeriesEvent {
  id: string
  timestamp: string       // "2025-09-04 20:00"
  time: string           // "20:00~24:00"
  sessions: number       // インプレッション数
  cvr: number           // コンバージョン率
  ctr: number           // クリック率
  cpl: number           // リード単価（CPC）
  cost: number          // 総コスト
  
  // 分析結果
  optimizations: OptimizationAction[]
  anomalies: AnomalyDetection[]
  aiComment?: string    // AI分析コメント
  
  // 生データ
  rawData?: {
    impressions: number
    clicks: number
    conversions: number
  }
}

interface OptimizationAction {
  type: 'keyword' | 'bid' | 'ad_copy' | 'targeting'
  action: string
  status: 'pending' | 'executing' | 'completed'
  impact?: string
}

interface AnomalyDetection {
  type: 'ctr_drop' | 'cpc_spike' | 'conversion_stop'
  severity: 'low' | 'medium' | 'high'
  message: string
}
```

## 💻 実装コード

### メインコンポーネント
```tsx
const TimeSeriesList: React.FC<TimeSeriesListProps> = ({
  sessionId,
  events,
  loading = false,
  error,
  selectedEventId,
  hasMore = false,
  onEventSelect,
  onLoadMore
}) => {
  const [timeRange, setTimeRange] = useState<string>('4h')
  const listRef = useRef<HTMLDivElement>(null)
  
  // 無限スクロール
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const nearBottom = scrollTop + clientHeight >= scrollHeight - 100
    
    if (nearBottom && hasMore && !loading && onLoadMore) {
      onLoadMore()
    }
  }, [hasMore, loading, onLoadMore])
  
  // キーボードナビゲーション
  const handleKeyDown = useCallback((e: React.KeyboardEvent, event: TimeSeriesEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onEventSelect?.(event)
    }
  }, [onEventSelect])
  
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">時系列イベント分析</h3>
        <p className="text-sm text-gray-600">
          全{events.length}件のイベント
        </p>
      </div>
      
      <div 
        ref={listRef}
        className="max-h-[600px] overflow-y-auto"
        onScroll={handleScroll}
      >
        {events.map((event, index) => {
          const showDateSeparator = shouldShowDateSeparator(
            event, 
            events[index - 1]
          )
          
          return (
            <React.Fragment key={event.id}>
              {showDateSeparator && (
                <DateSeparator date={event.timestamp} />
              )}
              <EventCard 
                event={event}
                isSelected={selectedEventId === event.id}
                onClick={() => onEventSelect?.(event)}
                onKeyDown={(e) => handleKeyDown(e, event)}
              />
            </React.Fragment>
          )
        })}
        
        {loading && <LoadingSpinner />}
        {hasMore && !loading && (
          <LoadMoreButton onClick={onLoadMore} />
        )}
      </div>
    </div>
  )
}
```

### イベントカードコンポーネント
```tsx
function EventCard({ 
  event, 
  isSelected, 
  onClick, 
  onKeyDown 
}: EventCardProps) {
  const trendIcon = getTrendIcon(event)
  const trendColor = getTrendColor(event)
  
  return (
    <div
      className={cn(
        "p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors",
        isSelected && "bg-blue-50 border-blue-200"
      )}
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="button"
      aria-selected={isSelected}
    >
      {/* ヘッダー */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{event.time}</span>
          <span className="text-sm text-gray-600">
            📊 {event.sessions.toLocaleString()} sessions
          </span>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>
      
      {/* メトリクス */}
      <div className="grid grid-cols-4 gap-4 mb-3">
        <MetricBadge 
          label="CVR" 
          value={`${event.cvr}%`}
          trend={getTrend(event.cvr)}
          color={event.cvr > 3 ? 'green' : 'yellow'}
        />
        <MetricBadge 
          label="CTR" 
          value={`${event.ctr}%`}
          trend={getTrend(event.ctr)}
          color={event.ctr > 3 ? 'green' : 'yellow'}
        />
        <MetricBadge 
          label="CPL" 
          value={`¥${event.cpl}`}
          trend={getTrend(event.cpl, true)} // 逆転（低い方が良い）
          color={event.cpl < 100 ? 'green' : 'yellow'}
        />
        <MetricBadge 
          label="Cost" 
          value={`¥${event.cost.toLocaleString()}`}
        />
      </div>
      
      {/* AI分析・アクション */}
      {event.aiComment && (
        <div className="bg-gray-50 rounded p-2 mb-2">
          <span className="text-sm">🤖 {event.aiComment}</span>
        </div>
      )}
      
      {/* 最適化アクション */}
      {event.optimizations.length > 0 && (
        <div className="space-y-1">
          {event.optimizations.map((opt, idx) => (
            <OptimizationBadge key={idx} optimization={opt} />
          ))}
        </div>
      )}
      
      {/* 異常検知 */}
      {event.anomalies.length > 0 && (
        <div className="space-y-1 mt-2">
          {event.anomalies.map((anomaly, idx) => (
            <AnomalyAlert key={idx} anomaly={anomaly} />
          ))}
        </div>
      )}
    </div>
  )
}
```

### ユーティリティ関数
```tsx
// 日付セパレーター表示判定
function shouldShowDateSeparator(
  current: TimeSeriesEvent, 
  previous?: TimeSeriesEvent
): boolean {
  if (!previous) return true
  
  const currentDate = new Date(current.timestamp).toDateString()
  const previousDate = new Date(previous.timestamp).toDateString()
  
  return currentDate !== previousDate
}

// トレンド判定
function getTrend(value: number, inverse = false): 'up' | 'down' | 'neutral' {
  // 実装: 前回値との比較ロジック
  return 'neutral'
}

// トレンドカラー取得
function getTrendColor(event: TimeSeriesEvent): string {
  if (event.cvr > 4) return 'text-green-600'
  if (event.cvr > 2) return 'text-yellow-600'
  return 'text-gray-600'
}
```

## 🎨 スタイリング

### カラーテーマ
```scss
// メトリクスバッジ
.metric-green { 
  background: #10b98120;
  color: #10b981;
}

.metric-yellow {
  background: #f59e0b20;
  color: #f59e0b;
}

.metric-red {
  background: #ef444420;
  color: #ef4444;
}

// トレンドアイコン
.trend-up { color: #10b981; }
.trend-down { color: #ef4444; }
.trend-neutral { color: #6b7280; }
```

### アニメーション
```css
/* スクロール時のフェード */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.event-card {
  animation: fadeIn 0.3s ease-out;
}
```

## ⚡ パフォーマンス最適化

1. **仮想スクロール**（大量イベント時）
   ```tsx
   import { VariableSizeList } from 'react-window'
   ```

2. **メモ化**
   ```tsx
   const memoizedEvents = useMemo(() => 
     processEvents(events), [events]
   )
   ```

3. **遅延レンダリング**
   ```tsx
   const [visibleEvents, setVisibleEvents] = useState(20)
   // 段階的に表示数を増やす
   ```

## 🔗 関連コンポーネント

- [MetricsChart](./metrics-chart.md) - グラフ表示
- [EventDetailModal](./event-detail-modal.md) - イベント詳細モーダル
- [AlertDashboard](./alert-dashboard.md) - アラート管理

---

**最終更新**: 2025年9月4日  
**コンポーネントパス**: `apps/lp-suite/src/components/TimeSeriesList.tsx`