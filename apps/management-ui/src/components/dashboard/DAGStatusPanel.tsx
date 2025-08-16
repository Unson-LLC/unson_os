import React from 'react'
import { DAGExecutionDetail } from '@/types/dag'

interface DAGStatusPanelProps {
  data: DAGExecutionDetail
  className?: string
}

export function DAGStatusPanel({ data, className }: DAGStatusPanelProps) {
  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">DAG処理状況</h2>
        <p className="text-sm text-gray-500 mt-1">{data.saasName}</p>
      </div>

      <div className="p-6 space-y-6">
        <DAGExecutionStatus dagStatus={data.dagStatus} />
        
        <div className="grid grid-cols-3 gap-4">
          <LayerCard
            title="Layer 1"
            subtitle="Symbol正規化"
            count={data.layer1.symbolCount}
            status="active"
            lastUpdated={data.layer1.lastUpdated}
          />
          <LayerCard
            title="Layer 2"
            subtitle="判定関数"
            count={data.layer2.functionsEvaluated}
            status="active"
            lastUpdated={data.layer2.lastEvaluated}
          />
          <LayerCard
            title="Layer 3"
            subtitle="PKG選択"
            count={1}
            status="active"
            confidence={data.layer3.selectionConfidence}
          />
        </div>

        <SelectedPKGInfo layer3={data.layer3} />
        
        {data.emergencyTriggers.active.length > 0 && (
          <EmergencyAlert triggers={data.emergencyTriggers.active} />
        )}
      </div>
    </div>
  )
}

function DAGExecutionStatus({ dagStatus }: { dagStatus: DAGExecutionDetail['dagStatus'] }) {
  const statusColors = {
    running: 'text-blue-600 bg-blue-100',
    pending: 'text-yellow-600 bg-yellow-100',
    completed: 'text-green-600 bg-green-100',
    failed: 'text-red-600 bg-red-100'
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[dagStatus.status]}`}>
          {dagStatus.status}
        </span>
        <span className="text-sm text-gray-500">
          サイクル: {dagStatus.currentCycle}
        </span>
      </div>
      <div className="text-sm text-gray-500">
        最終実行: {new Date(dagStatus.lastExecuted).toLocaleString('ja-JP')}
      </div>
    </div>
  )
}

function LayerCard({ 
  title, 
  subtitle, 
  count, 
  status, 
  lastUpdated,
  confidence 
}: {
  title: string
  subtitle: string
  count: number
  status: string
  lastUpdated?: string
  confidence?: number
}) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">{title}</h3>
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
      </div>
      <p className="text-sm text-gray-600 mb-2">{subtitle}</p>
      <p className="text-lg font-semibold">{count}</p>
      {confidence && (
        <p className="text-sm text-green-600">信頼度: {Math.round(confidence * 100)}%</p>
      )}
      {lastUpdated && (
        <p className="text-xs text-gray-400 mt-2">
          {new Date(lastUpdated).toLocaleTimeString('ja-JP')}
        </p>
      )}
    </div>
  )
}

function SelectedPKGInfo({ layer3 }: { layer3: DAGExecutionDetail['layer3'] }) {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-medium mb-2">選択されたPKG</h3>
      <div className="flex items-center space-x-4">
        <span className="text-lg font-mono text-blue-600">{layer3.selectedPKG}</span>
        <span className="text-sm text-green-600">
          信頼度: {Math.round(layer3.selectionConfidence * 100)}%
        </span>
      </div>
      {layer3.alternatives.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-sm font-medium text-gray-600 mb-2">代替候補:</p>
          <div className="space-y-1">
            {layer3.alternatives.map((alt, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="font-mono">{alt.pkgId}</span>
                <span className="text-gray-500">{Math.round(alt.confidence * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function EmergencyAlert({ triggers }: { triggers: DAGExecutionDetail['emergencyTriggers']['active'] }) {
  return (
    <div className="border-l-4 border-red-500 bg-red-50 p-4">
      <h3 className="font-medium text-red-800 mb-2">🚨 緊急アラート</h3>
      <div className="space-y-2">
        {triggers.map((trigger, index) => (
          <div key={index} className="text-sm text-red-700">
            <p className="font-medium">{trigger.metric}が閾値を下回りました</p>
            <p>現在値: {trigger.actualValue} / 閾値: {trigger.threshold}</p>
            <p>実行PKG: {trigger.pkgExecuted}</p>
          </div>
        ))}
      </div>
    </div>
  )
}