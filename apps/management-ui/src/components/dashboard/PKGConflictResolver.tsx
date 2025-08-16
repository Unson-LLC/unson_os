import React, { useState } from 'react'

interface PKGConflict {
  saasId: string
  saasName: string
  conflictingPKGs: Array<{
    pkgId: string
    priority: number
    reason: string
    requiredResources: string[]
  }>
  recommendedResolution: {
    execute: string
    defer: string[]
    cancel: string[]
  }
}

interface PKGConflictResolverProps {
  conflicts: PKGConflict[]
  onResolve: (resolution: any) => void
  className?: string
}

export function PKGConflictResolver({ 
  conflicts, 
  onResolve,
  className 
}: PKGConflictResolverProps) {
  const [selectedResolutions, setSelectedResolutions] = useState<Record<string, any>>({})

  if (conflicts.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <h2 className="text-lg font-semibold text-green-600">
          ✓ PKG競合なし
        </h2>
        <p className="text-gray-500 mt-2">
          現在、PKG実行における競合は発生していません
        </p>
      </div>
    )
  }

  const handleResolveConflict = (saasId: string, resolution: any) => {
    const newResolutions = {
      ...selectedResolutions,
      [saasId]: resolution
    }
    setSelectedResolutions(newResolutions)
    onResolve(newResolutions)
  }

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-red-600">
          ⚠️ PKG競合解決
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {conflicts.length}件の競合が発生しています
        </p>
      </div>

      <div className="p-6 space-y-6">
        {conflicts.map((conflict, index) => (
          <ConflictCard
            key={conflict.saasId}
            conflict={conflict}
            onResolve={(resolution) => handleResolveConflict(conflict.saasId, resolution)}
          />
        ))}

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => onResolve(selectedResolutions)}
          >
            すべて解決
          </button>
        </div>
      </div>
    </div>
  )
}

function ConflictCard({ 
  conflict, 
  onResolve 
}: { 
  conflict: PKGConflict
  onResolve: (resolution: any) => void 
}) {
  const [selectedAction, setSelectedAction] = useState<'recommended' | 'manual'>('recommended')

  return (
    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{conflict.saasName}</h3>
        <span className="text-sm text-red-600">
          {conflict.conflictingPKGs.length}個のPKGが競合
        </span>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-sm">競合PKG一覧:</h4>
        {conflict.conflictingPKGs.map((pkg, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
            <div>
              <span className="font-mono text-sm">{pkg.pkgId}</span>
              <span className="text-xs text-gray-500 ml-2">優先度: {pkg.priority}</span>
            </div>
            <div className="text-xs text-gray-600">
              {pkg.requiredResources.join(', ')}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-red-200">
        <div className="flex items-center space-x-4 mb-3">
          <label className="flex items-center">
            <input 
              type="radio" 
              name={`resolution-${conflict.saasId}`}
              value="recommended"
              checked={selectedAction === 'recommended'}
              onChange={(e) => setSelectedAction(e.target.value as any)}
              className="mr-2"
            />
            推奨解決策を使用
          </label>
          <label className="flex items-center">
            <input 
              type="radio" 
              name={`resolution-${conflict.saasId}`}
              value="manual"
              checked={selectedAction === 'manual'}
              onChange={(e) => setSelectedAction(e.target.value as any)}
              className="mr-2"
            />
            手動選択
          </label>
        </div>

        {selectedAction === 'recommended' ? (
          <RecommendedResolution 
            recommendation={conflict.recommendedResolution}
            onApply={onResolve}
          />
        ) : (
          <ManualResolution 
            pkgs={conflict.conflictingPKGs}
            onApply={onResolve}
          />
        )}
      </div>
    </div>
  )
}

function RecommendedResolution({ 
  recommendation, 
  onApply 
}: { 
  recommendation: PKGConflict['recommendedResolution']
  onApply: (resolution: any) => void
}) {
  return (
    <div className="bg-blue-50 p-3 rounded">
      <h5 className="font-medium text-blue-800 mb-2">AI推奨解決策:</h5>
      <div className="text-sm space-y-1">
        <div>
          <span className="font-medium text-green-700">実行:</span> 
          <span className="ml-2 font-mono">{recommendation.execute}</span>
        </div>
        {recommendation.defer.length > 0 && (
          <div>
            <span className="font-medium text-yellow-700">延期:</span> 
            <span className="ml-2">{recommendation.defer.join(', ')}</span>
          </div>
        )}
        {recommendation.cancel.length > 0 && (
          <div>
            <span className="font-medium text-red-700">キャンセル:</span> 
            <span className="ml-2">{recommendation.cancel.join(', ')}</span>
          </div>
        )}
      </div>
      <button 
        className="mt-3 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        onClick={() => onApply(recommendation)}
      >
        この解決策を適用
      </button>
    </div>
  )
}

function ManualResolution({ 
  pkgs, 
  onApply 
}: { 
  pkgs: PKGConflict['conflictingPKGs']
  onApply: (resolution: any) => void 
}) {
  const [selections, setSelections] = useState<Record<string, 'execute' | 'defer' | 'cancel'>>({})

  const handleSelectionChange = (pkgId: string, action: 'execute' | 'defer' | 'cancel') => {
    setSelections(prev => ({ ...prev, [pkgId]: action }))
  }

  const applyManualResolution = () => {
    const resolution = {
      execute: Object.entries(selections).find(([_, action]) => action === 'execute')?.[0] || '',
      defer: Object.entries(selections).filter(([_, action]) => action === 'defer').map(([id]) => id),
      cancel: Object.entries(selections).filter(([_, action]) => action === 'cancel').map(([id]) => id)
    }
    onApply(resolution)
  }

  return (
    <div className="bg-gray-50 p-3 rounded">
      <h5 className="font-medium mb-3">手動選択:</h5>
      <div className="space-y-2">
        {pkgs.map((pkg, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
            <span className="font-mono text-sm">{pkg.pkgId}</span>
            <div className="flex space-x-2">
              {(['execute', 'defer', 'cancel'] as const).map(action => (
                <label key={action} className="flex items-center text-xs">
                  <input 
                    type="radio"
                    name={`manual-${pkg.pkgId}`}
                    value={action}
                    checked={selections[pkg.pkgId] === action}
                    onChange={() => handleSelectionChange(pkg.pkgId, action)}
                    className="mr-1"
                  />
                  {action === 'execute' ? '実行' : action === 'defer' ? '延期' : 'キャンセル'}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button 
        className="mt-3 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
        onClick={applyManualResolution}
        disabled={Object.keys(selections).length === 0}
      >
        手動選択を適用
      </button>
    </div>
  )
}