# UnsonOS コアシステム UIコンポーネント設計書

## 概要

UnsonOSダッシュボードシステムの実装に必要なReactコンポーネントの詳細設計。
5つのSaaSフェーズ（市場調査→LP検証→MVP開発→収益化→スケール）の監視・管理に最適化。

## 設計原則

### コンポーネント設計原則
- **フェーズファースト**: 各フェーズ固有のKPIとUIに特化
- **データドリブン**: KPIの視覚化を最優先
- **安全性重視**: Gate承認に多段階確認機能
- **レスポンシブ**: モバイル最適化必須

### 技術スタック
- React 18 + TypeScript
- Tailwind CSS（デザインシステム）
- Zustand（状態管理）
- Recharts（グラフ表示）
- React Hook Form（フォーム）

## 1. レイアウトコンポーネント

### DashboardLayout
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
  currentUser: User;
  notifications: Notification[];
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  currentUser,
  notifications
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={currentUser} notifications={notifications} />
      <Sidebar />
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
};
```

**機能:**
- ヘッダー、サイドバー、メインコンテンツの配置
- 通知システムの統合
- レスポンシブ対応

### Header
```typescript
interface HeaderProps {
  user: User;
  notifications: Notification[];
}

const Header: React.FC<HeaderProps> = ({ user, notifications }) => {
  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">UnsonOS 管理ダッシュボード</h1>
        <div className="flex items-center gap-4">
          <NotificationBell notifications={notifications} />
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
};
```

## 2. KPI表示コンポーネント

### KPICard
```typescript
interface KPICardProps {
  title: string;
  value: number | string;
  trend: 'up' | 'down' | 'neutral';
  target?: number;
  format: 'number' | 'percentage' | 'currency' | 'ratio';
  phase: Phase;
  onClick?: () => void;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  trend,
  target,
  format,
  phase,
  onClick
}) => {
  const trendIcon = {
    up: '↗️',
    down: '↘️',
    neutral: '→'
  };

  const phaseColor = {
    research: 'border-blue-200 bg-blue-50',
    lp: 'border-green-200 bg-green-50',
    mvp: 'border-yellow-200 bg-yellow-50',
    monetization: 'border-purple-200 bg-purple-50',
    scale: 'border-indigo-200 bg-indigo-50'
  };

  return (
    <div 
      className={`p-6 rounded-lg border-2 cursor-pointer hover:shadow-md transition-shadow ${phaseColor[phase]}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <span className="text-lg">{trendIcon[trend]}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{formatValue(value, format)}</span>
        {target && (
          <span className="text-sm text-gray-500">
            / {formatValue(target, format)}
          </span>
        )}
      </div>
      {target && (
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${Math.min((Number(value) / target) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
```

### KPIDashboard
```typescript
interface KPIDashboardProps {
  selectedPhase: Phase | 'all';
  saasData: SaaS[];
}

const KPIDashboard: React.FC<KPIDashboardProps> = ({ selectedPhase, saasData }) => {
  const aggregatedKPIs = useMemo(() => {
    return selectedPhase === 'all' 
      ? aggregateAllPhases(saasData)
      : aggregateByPhase(saasData, selectedPhase);
  }, [selectedPhase, saasData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {aggregatedKPIs.map((kpi, index) => (
        <KPICard key={index} {...kpi} />
      ))}
    </div>
  );
};
```

## 3. フェーズ分布コンポーネント

### PhaseDistributionChart
```typescript
interface PhaseDistributionChartProps {
  data: PhaseDistribution[];
  onPhaseClick: (phase: Phase) => void;
}

const PhaseDistributionChart: React.FC<PhaseDistributionChartProps> = ({
  data,
  onPhaseClick
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">フェーズ別分布</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            dataKey="count"
            onMouseDown={(data) => onPhaseClick(data.phase)}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PHASE_COLORS[entry.phase]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name) => [`${value}個`, 'SaaS数']}
            labelFormatter={(label) => PHASE_LABELS[label]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
```

## 4. SaaS管理コンポーネント

### SaaSListTabs
```typescript
interface SaaSListTabsProps {
  saasData: SaaS[];
  activePhase: Phase | 'all';
  onPhaseChange: (phase: Phase | 'all') => void;
  onSaaSClick: (saas: SaaS) => void;
}

const SaaSListTabs: React.FC<SaaSListTabsProps> = ({
  saasData,
  activePhase,
  onPhaseChange,
  onSaaSClick
}) => {
  const phaseCount = useMemo(() => {
    return PHASES.reduce((acc, phase) => {
      acc[phase] = saasData.filter(s => s.phase === phase).length;
      return acc;
    }, {} as Record<Phase, number>);
  }, [saasData]);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            className={`px-6 py-3 font-medium text-sm ${
              activePhase === 'all' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => onPhaseChange('all')}
          >
            全て ({saasData.length})
          </button>
          {PHASES.map(phase => (
            <button
              key={phase}
              className={`px-6 py-3 font-medium text-sm ${
                activePhase === phase 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => onPhaseChange(phase)}
            >
              {PHASE_LABELS[phase]} ({phaseCount[phase]})
            </button>
          ))}
        </nav>
      </div>
      <div className="p-6">
        <SaaSList 
          saasData={saasData.filter(s => activePhase === 'all' || s.phase === activePhase)}
          onSaaSClick={onSaaSClick}
        />
      </div>
    </div>
  );
};
```

### SaaSCard
```typescript
interface SaaSCardProps {
  saas: SaaS;
  onClick: () => void;
}

const SaaSCard: React.FC<SaaSCardProps> = ({ saas, onClick }) => {
  const statusColor = {
    healthy: 'text-green-600 bg-green-100',
    warning: 'text-yellow-600 bg-yellow-100',
    critical: 'text-red-600 bg-red-100'
  };

  return (
    <div 
      className="border rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{saas.name}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[saas.status]}`}>
          {STATUS_LABELS[saas.status]}
        </span>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>{PHASE_LABELS[saas.phase]}</span>
        <span>MRR: ¥{saas.mrr?.toLocaleString() || '0'}</span>
        <span>DAU: {saas.dau || 0}</span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        {saas.needsAttention && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
            ⚠️ 要確認
          </span>
        )}
        {saas.readyForNextPhase && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
            🚀 Gate準備完了
          </span>
        )}
      </div>
    </div>
  );
};
```

## 5. Gate承認コンポーネント

### GateApprovalModal
```typescript
interface GateApprovalModalProps {
  saas: SaaS;
  currentPhase: Phase;
  nextPhase: Phase;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (confirmation: GateConfirmation) => void;
}

const GateApprovalModal: React.FC<GateApprovalModalProps> = ({
  saas,
  currentPhase,
  nextPhase,
  isOpen,
  onClose,
  onApprove
}) => {
  const [step, setStep] = useState<'review' | 'confirm' | 'final'>('review');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [reasoning, setReasoning] = useState('');

  const gateRequirements = GATE_REQUIREMENTS[currentPhase];

  const handleApprove = () => {
    if (step === 'review') {
      setStep('confirm');
    } else if (step === 'confirm') {
      setStep('final');
    } else {
      onApprove({
        saasId: saas.id,
        fromPhase: currentPhase,
        toPhase: nextPhase,
        checklist,
        reasoning,
        approvedAt: new Date(),
        approvedBy: 'current-user' // TODO: get from auth
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">
          Gate承認: {saas.name}
        </h2>
        <p className="text-gray-600 mb-6">
          {PHASE_LABELS[currentPhase]} → {PHASE_LABELS[nextPhase]}
        </p>

        {step === 'review' && (
          <GateReviewStep 
            requirements={gateRequirements}
            saas={saas}
            checklist={checklist}
            onChecklistChange={setChecklist}
          />
        )}

        {step === 'confirm' && (
          <GateConfirmStep 
            saas={saas}
            checklist={checklist}
            reasoning={reasoning}
            onReasoningChange={setReasoning}
          />
        )}

        {step === 'final' && (
          <GateFinalStep 
            saas={saas}
            fromPhase={currentPhase}
            toPhase={nextPhase}
          />
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button 
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            キャンセル
          </button>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleApprove}
            disabled={step === 'review' && !isChecklistComplete(checklist, gateRequirements)}
          >
            {step === 'review' ? '確認画面へ' : step === 'confirm' ? '最終確認へ' : '承認実行'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
```

## 6. モニタリングコンポーネント

### AITrustMeter
```typescript
interface AITrustMeterProps {
  trustLevel: number; // 0-100
  recentAccuracy: number;
  failureCount: number;
  lastFailure?: Date;
}

const AITrustMeter: React.FC<AITrustMeterProps> = ({
  trustLevel,
  recentAccuracy,
  failureCount,
  lastFailure
}) => {
  const trustColor = trustLevel >= 75 ? 'green' : trustLevel >= 50 ? 'yellow' : 'red';

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">AI信頼度</h3>
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={TRUST_COLORS[trustColor]}
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${trustLevel * 2.51} 251.2`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold">{trustLevel}%</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">直近精度:</span>
              <span className="font-semibold ml-2">{recentAccuracy}%</span>
            </div>
            <div>
              <span className="text-gray-600">失敗回数:</span>
              <span className="font-semibold ml-2">{failureCount}回</span>
            </div>
          </div>
          {lastFailure && (
            <p className="text-xs text-gray-500 mt-2">
              最終失敗: {formatDistanceToNow(lastFailure, { locale: ja })}前
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
```

### AlertPanel
```typescript
interface AlertPanelProps {
  alerts: Alert[];
  onAlertClick: (alert: Alert) => void;
  onMarkAsRead: (alertId: string) => void;
}

const AlertPanel: React.FC<AlertPanelProps> = ({
  alerts,
  onAlertClick,
  onMarkAsRead
}) => {
  const severityColors = {
    critical: 'border-l-red-500 bg-red-50',
    warning: 'border-l-yellow-500 bg-yellow-50',
    info: 'border-l-blue-500 bg-blue-50'
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">アラート</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {alerts.map(alert => (
          <div
            key={alert.id}
            className={`p-4 border-l-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${severityColors[alert.severity]}`}
            onClick={() => onAlertClick(alert)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium">{alert.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {formatDistanceToNow(alert.createdAt, { locale: ja })}前
                </p>
              </div>
              {!alert.isRead && (
                <button
                  className="text-blue-600 hover:text-blue-800 text-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(alert.id);
                  }}
                >
                  既読
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 7. 型定義

### Core Types
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
}

export type Phase = 'research' | 'lp' | 'mvp' | 'monetization' | 'scale';

export type SaaSStatus = 'healthy' | 'warning' | 'critical';

export interface SaaS {
  id: string;
  name: string;
  phase: Phase;
  status: SaaSStatus;
  kpis: PhaseKPIs;
  mrr?: number;
  dau?: number;
  needsAttention: boolean;
  readyForNextPhase: boolean;
  lastUpdated: Date;
}

export interface PhaseKPIs {
  research?: ResearchKPIs;
  lp?: LPKPIs;
  mvp?: MVPKPIs;
  monetization?: MonetizationKPIs;
  scale?: ScaleKPIs;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  saasId?: string;
  createdAt: Date;
  isRead: boolean;
}

export interface GateConfirmation {
  saasId: string;
  fromPhase: Phase;
  toPhase: Phase;
  checklist: Record<string, boolean>;
  reasoning: string;
  approvedAt: Date;
  approvedBy: string;
}
```

## 8. ユーティリティ関数

### Formatting Utils
```typescript
export const formatValue = (value: number | string, format: string): string => {
  if (typeof value === 'string') return value;
  
  switch (format) {
    case 'currency':
      return `¥${value.toLocaleString()}`;
    case 'percentage':
      return `${value}%`;
    case 'ratio':
      return `${value}:1`;
    default:
      return value.toLocaleString();
  }
};

export const isChecklistComplete = (
  checklist: Record<string, boolean>,
  requirements: string[]
): boolean => {
  return requirements.every(req => checklist[req] === true);
};
```

## 9. カスタムフック

### useKPIAggregation
```typescript
export const useKPIAggregation = (saasData: SaaS[], phase?: Phase) => {
  return useMemo(() => {
    const filtered = phase ? saasData.filter(s => s.phase === phase) : saasData;
    
    // フェーズごとのKPI集計ロジック
    return aggregateKPIs(filtered, phase);
  }, [saasData, phase]);
};
```

### useRealtimeUpdates
```typescript
export const useRealtimeUpdates = (saasIds: string[]) => {
  const [updates, setUpdates] = useState<SaaSUpdate[]>([]);
  
  useEffect(() => {
    // WebSocket接続やポーリングでリアルタイム更新
    const subscription = subscribeToSaaSUpdates(saasIds, setUpdates);
    return () => subscription.unsubscribe();
  }, [saasIds]);
  
  return updates;
};
```

## 10. スタイリングガイド

### Color Palette
```typescript
export const PHASE_COLORS = {
  research: '#3B82F6',   // Blue
  lp: '#10B981',         // Green  
  mvp: '#F59E0B',        // Yellow
  monetization: '#8B5CF6', // Purple
  scale: '#6366F1'       // Indigo
};

export const STATUS_COLORS = {
  healthy: '#10B981',
  warning: '#F59E0B', 
  critical: '#EF4444'
};
```

### Responsive Design
```css
/* モバイル最適化 */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
}
```

## 実装優先順位

1. **Phase 1**: レイアウト + KPIカード + SaaSリスト
2. **Phase 2**: フェーズ分布チャート + アラートパネル  
3. **Phase 3**: Gate承認UI + AI信頼度メーター
4. **Phase 4**: リアルタイム更新 + モバイル最適化

## パフォーマンス考慮事項

- SaaSリストの仮想化（100+アイテム対応）
- KPI計算のメモ化
- グラフコンポーネントの遅延読み込み
- WebSocketでの効率的なリアルタイム更新