import React from 'react'

interface PKGExecutionData {
  saasName: string
  status: '🟢' | '🟡' | '🔴'
  currentPkg: string
  progress: number
  trigger?: string
  nextPkg: string
}

interface PKGExecutionStatusProps {
  data: PKGExecutionData[]
  onDetailClick?: (saasName: string) => void
  onPauseClick?: (saasName: string) => void
}

export function PKGExecutionStatus({ 
  data,
  onDetailClick,
  onPauseClick
}: PKGExecutionStatusProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">PKG実行状況</h2>
      </div>
      
      <div className="p-6 space-y-4">
        {data.map((item, index) => (
          <PKGCard
            key={index}
            item={item}
            onDetailClick={() => onDetailClick?.(item.saasName)}
            onPauseClick={() => onPauseClick?.(item.saasName)}
          />
        ))}
        
        <PKGFlowVisualization />
      </div>
    </div>
  )
}

// 分離したコンポーネント
function PKGCard({ 
  item,
  onDetailClick,
  onPauseClick
}: {
  item: PKGExecutionData
  onDetailClick: () => void
  onPauseClick: () => void
}) {
  return (
    <article 
      className="border rounded-lg p-4"
      aria-label={`${item.saasName}のPKG実行状況`}
    >
      <div className="flex items-center justify-between mb-2">
        <PKGInfo item={item} />
        <PKGActions 
          onDetailClick={onDetailClick}
          onPauseClick={onPauseClick}
        />
      </div>
      
      {item.trigger && <PKGTrigger trigger={item.trigger} />}
      
      <PKGProgressBar 
        progress={item.progress}
        status={item.status}
      />
    </article>
  )
}

function PKGInfo({ item }: { item: PKGExecutionData }) {
  return (
    <div className="flex items-center space-x-3">
      <StatusIndicator status={item.status} />
      <span className="font-medium">{item.saasName}</span>
      <Separator />
      <span className="text-blue-600">{item.currentPkg}</span>
      <Separator />
      <ProgressText progress={item.progress} />
      <Separator />
      <NextPKG name={item.nextPkg} />
    </div>
  )
}

function StatusIndicator({ status }: { status: '🟢' | '🟡' | '🔴' }) {
  return <span className="text-lg">{status}</span>
}

function Separator() {
  return <span className="text-gray-600">│</span>
}

function ProgressText({ progress }: { progress: number }) {
  return <span className="font-mono">{progress}%</span>
}

function NextPKG({ name }: { name: string }) {
  return <span className="text-gray-700">次: {name}</span>
}

function PKGActions({ 
  onDetailClick,
  onPauseClick
}: {
  onDetailClick: () => void
  onPauseClick: () => void
}) {
  return (
    <div className="flex space-x-2">
      <ActionButton onClick={onDetailClick} label="詳細" />
      <ActionButton onClick={onPauseClick} label="一時停止" />
    </div>
  )
}

function ActionButton({ 
  onClick,
  label
}: {
  onClick: () => void
  label: string
}) {
  return (
    <button 
      className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
      onClick={onClick}
    >
      {label}
    </button>
  )
}

function PKGTrigger({ trigger }: { trigger: string }) {
  return (
    <div className="text-sm text-gray-500 mb-2">
      └ トリガー: {trigger}
    </div>
  )
}

function PKGProgressBar({ 
  progress,
  status
}: {
  progress: number
  status: '🟢' | '🟡' | '🔴'
}) {
  const colorClass = getProgressBarColor(status)
  
  return (
    <div 
      className="w-full bg-gray-200 rounded-full h-2"
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div 
        className={`h-2 rounded-full ${colorClass}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

function getProgressBarColor(status: '🟢' | '🟡' | '🔴'): string {
  const colorMap = {
    '🟢': 'bg-green-600',
    '🟡': 'bg-yellow-600',
    '🔴': 'bg-red-600'
  }
  return colorMap[status]
}

function PKGFlowVisualization() {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium mb-3">PKGフロー可視化:</h3>
      <PKGFlowDiagram />
    </div>
  )
}

function PKGFlowDiagram() {
  return (
    <div className="font-mono text-sm space-y-2">
      <FlowLine>
        <FlowNode name="[LAUNCH_MVP_STANDARD]" />
        <FlowArrow />
        <FlowNode name="[Layer2判定]" />
        <FlowArrow />
        <FlowNode name="[CRISIS_MRR_RECOVERY]" isCurrent />
      </FlowLine>
      
      <FlowStatusLine>
        <FlowStatus status="✓完了" isComplete />
        <FlowStatus status="MRR↓" />
        <FlowStatus status="実行中(35%)" isCurrent />
      </FlowStatusLine>
      
      <FlowBranch />
      
      <div className="mt-4 text-xs text-gray-600">
        <div>Layer1: Symbol正規化 (148シンボル)</div>
        <div>Layer2: 判定関数 (12関数実行)</div>
        <div>Layer3: PKG選択 (信頼度: 91%)</div>
      </div>
    </div>
  )
}

function FlowLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center space-x-2">
      {children}
    </div>
  )
}

function FlowNode({ 
  name,
  isCurrent = false
}: {
  name: string
  isCurrent?: boolean
}) {
  const className = isCurrent 
    ? "text-blue-600 font-bold" 
    : ""
  
  return <span className={className}>{name}</span>
}

function FlowArrow() {
  return <span>→</span>
}

function FlowStatusLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center space-x-8">
      {children}
    </div>
  )
}

function FlowStatus({ 
  status,
  isComplete = false,
  isCurrent = false
}: {
  status: string
  isComplete?: boolean
  isCurrent?: boolean
}) {
  const className = isComplete 
    ? "text-green-600"
    : isCurrent 
      ? "text-blue-600"
      : "text-gray-500"
  
  return <span className={className}>{status}</span>
}

function FlowBranch() {
  return (
    <>
      <div className="flex items-center space-x-2 mt-2">
        <span className="ml-32">↓</span>
      </div>
      <div className="flex items-center space-x-8 ml-24">
        <span>[CRISIS_PRODUCT_PIVOT]</span>
        <span>[CRISIS_UX_IMPROVE]</span>
      </div>
    </>
  )
}