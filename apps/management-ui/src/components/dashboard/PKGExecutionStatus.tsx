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
  // Green Phase: ベタ書きで機能実装
  const getProgressColor = (status: string) => {
    if (status === '🔴') return 'bg-red-600'
    if (status === '🟡') return 'bg-yellow-600'
    return 'bg-green-600'
  }
  
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold">プレイブック実行状況</h2>
      </div>
      
      <div className="p-6 space-y-4">
        {data.map((item, index) => (
          <article 
            key={index}
            className="border rounded-lg p-4"
            aria-label={`${item.saasName}のPKG実行状況`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{item.status}</span>
                <span className="font-medium">{item.saasName}</span>
                <span className="text-gray-600">│</span>
                <span className="text-blue-600">{item.currentPkg}</span>
                <span className="text-gray-600">│</span>
                <span className="font-mono">{item.progress}%</span>
                <span className="text-gray-600">│</span>
                <span className="text-gray-700">次: {item.nextPkg}</span>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                  onClick={() => onDetailClick?.(item.saasName)}
                >
                  詳細
                </button>
                <button 
                  className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                  onClick={() => onPauseClick?.(item.saasName)}
                >
                  一時停止
                </button>
              </div>
            </div>
            
            {item.trigger && (
              <div className="text-sm text-gray-500 mb-2">
                └ トリガー: {item.trigger}
              </div>
            )}
            
            <div 
              className="w-full bg-gray-200 rounded-full h-2"
              role="progressbar"
              aria-valuenow={item.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div 
                className={`h-2 rounded-full ${getProgressColor(item.status)}`}
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </article>
        ))}
        
        {/* PKGフロー可視化 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-3">PKGフロー可視化:</h3>
          <div className="font-mono text-sm space-y-2">
            <div className="flex items-center space-x-2">
              <span>[pkg_mvp_standard]</span>
              <span>→</span>
              <span>[条件判定]</span>
              <span>→</span>
              <span className="text-blue-600 font-bold">[pkg_crisis_recovery]</span>
            </div>
            <div className="flex items-center space-x-8">
              <span className="text-green-600">✓完了</span>
              <span className="text-gray-500">MRR⬇️</span>
              <span className="text-blue-600">実行中(35%)</span>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <span className="ml-32">↓</span>
            </div>
            <div className="flex items-center space-x-8 ml-24">
              <span>[pivot]</span>
              <span>[improve]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}