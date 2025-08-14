import React, { useState } from 'react'
import { PlaybookSystemV2 } from './PlaybookSystemV2'
import { PlaybookTemplates } from './PlaybookTemplates'

interface PlaybookIntegratedProps {
  onViewDataSeries?: (saasName: string, metric: string) => void
}

export function PlaybookIntegrated({ onViewDataSeries }: PlaybookIntegratedProps) {
  const [activeView, setActiveView] = useState<'templates' | 'execution'>('templates')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [selectedSaaS, setSelectedSaaS] = useState<string | null>(null)

  const handleTemplateSelect = (templateId: string, saasName: string) => {
    setSelectedTemplate(templateId)
    setSelectedSaaS(saasName)
    setActiveView('execution')
  }

  const handleViewDetails = (templateId: string) => {
    setSelectedTemplate(templateId)
    // テンプレート詳細を見るためにtemplatesビューのままにする
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">📝 プレイブックシステム</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveView('templates')}
            className={`px-4 py-2 rounded ${activeView === 'templates' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            📚 テンプレート
          </button>
          <button
            onClick={() => setActiveView('execution')}
            className={`px-4 py-2 rounded ${activeView === 'execution' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            🔄 実行・判定システム
          </button>
        </div>
      </div>

      {/* ナビゲーション情報 */}
      {activeView === 'execution' && selectedTemplate && selectedSaaS && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-blue-700 font-medium">🎯 アクティブ:</span>
              <span className="ml-2">{selectedSaaS}</span>
              <span className="mx-2">→</span>
              <span className="text-blue-600">テンプレート: {selectedTemplate}</span>
            </div>
            <button
              onClick={() => setActiveView('templates')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              📚 テンプレートに戻る
            </button>
          </div>
        </div>
      )}

      {/* テンプレートビュー */}
      {activeView === 'templates' && (
        <div>
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">📚 プレイブックテンプレートとは</h3>
            <p className="text-sm text-gray-600">
              業界・業種別のSaaS構築・運用ノウハウをテンプレート化したもの。
              調査・開発・運用の各段階で「何をすべきか」「何に注意すべきか」を体系化し、
              過去の成功/失敗事例から学べるナレッジベースです。
            </p>
          </div>
          
          <PlaybookTemplates 
            onSelectTemplate={handleTemplateSelect}
            onViewDetails={handleViewDetails}
          />
        </div>
      )}

      {/* 実行・判定システムビュー */}
      {activeView === 'execution' && (
        <div>
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">🔄 実行・判定システムとは</h3>
            <p className="text-sm text-gray-600">
              インジケーター（⬆️↗️→↘️⬇️）に基づく自動判断システム。
              テンプレートの知見を活用して、リアルタイムの指標変化に応じた
              最適なアクション（PKG）を自動実行します。
            </p>
          </div>

          <PlaybookSystemV2 onViewDataSeries={onViewDataSeries} />
        </div>
      )}

      {/* プレイブックの概念説明 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="font-semibold mb-3">🧭 プレイブックシステムの全体像</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-700 mb-2">📚 テンプレート（静的知見）</h4>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• 業界別の調査・開発・運用ノウハウ</li>
              <li>• 成功/失敗パターンの蓄積</li>
              <li>• ベストプラクティスの体系化</li>
              <li>• 新規SaaS立ち上げ時の指針</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-purple-700 mb-2">🔄 実行システム（動的判断）</h4>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• インジケーターによる自動判断</li>
              <li>• PKGを使った処理のカプセル化</li>
              <li>• リアルタイムでの最適化実行</li>
              <li>• 100-200個のSaaS同時管理</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
            <span>📚 テンプレート選択</span>
            <span>→</span>
            <span>🔄 インジケーター監視</span>
            <span>→</span>
            <span>📦 PKG自動実行</span>
            <span>→</span>
            <span>📊 結果測定</span>
            <span>→</span>
            <span>🔄 継続改善</span>
          </div>
        </div>
      </div>
    </div>
  )
}