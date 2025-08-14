import React from 'react'

interface DetailModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function DetailModal({ isOpen, onClose, title, children }: DetailModalProps) {
  if (!isOpen) return null

  return (
    <>
      {/* オーバーレイ */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* モーダル */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          {/* ヘッダー */}
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* コンテンツ */}
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>

          {/* フッター */}
          <div className="p-6 border-t flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

// DAOの詳細モーダルコンテンツ
export function DAODetailContent() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">月次収益分配詳細</h3>
        <table className="w-full border">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-4 py-2 text-left">項目</th>
              <th className="border px-4 py-2 text-right">金額</th>
              <th className="border px-4 py-2 text-right">割合</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">総売上</td>
              <td className="border px-4 py-2 text-right">¥12,345,678</td>
              <td className="border px-4 py-2 text-right">100%</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">運営費</td>
              <td className="border px-4 py-2 text-right">¥7,407,407</td>
              <td className="border px-4 py-2 text-right">60%</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">DAOプール</td>
              <td className="border px-4 py-2 text-right">¥4,938,271</td>
              <td className="border px-4 py-2 text-right">40%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="font-semibold mb-3">トレジャリー履歴</h3>
        <div className="space-y-2">
          {[
            { month: '2025年1月', amount: 25432100, change: 18.5 },
            { month: '2024年12月', amount: 21480000, change: 15.2 },
            { month: '2024年11月', amount: 18650000, change: 12.8 },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span>{item.month}</span>
              <div className="text-right">
                <div>¥{item.amount.toLocaleString()}</div>
                <div className="text-sm text-green-600">+{item.change}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// PKGの詳細モーダルコンテンツ
export function PKGDetailContent({ saasName }: { saasName: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">{saasName} - PKG実行詳細</h3>
        <div className="bg-blue-50 p-4 rounded">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">現在のPKG</div>
              <div className="font-medium">pkg_crisis_recovery</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">進捗</div>
              <div className="font-medium">35%</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">開始時刻</div>
              <div className="font-medium">2025-01-15 14:30</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">予想完了</div>
              <div className="font-medium">2025-01-15 18:00</div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">実行ステップ</h3>
        <div className="space-y-3">
          {[
            { step: '1. 異常検知', status: '完了', time: '14:30' },
            { step: '2. 原因分析', status: '完了', time: '14:45' },
            { step: '3. 対策立案', status: '実行中', time: '15:00' },
            { step: '4. 実装', status: '待機中', time: '-' },
            { step: '5. 検証', status: '待機中', time: '-' },
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 border rounded">
              <span className={`w-2 h-2 rounded-full ${
                item.status === '完了' ? 'bg-green-500' :
                item.status === '実行中' ? 'bg-blue-500' :
                'bg-gray-300'
              }`} />
              <div className="flex-1">
                <div className="font-medium">{item.step}</div>
                <div className="text-sm text-gray-500">{item.status}</div>
              </div>
              <div className="text-sm text-gray-500">{item.time}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">ログ</h3>
        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs">
          <div>[14:30:00] 異常検知: MRR急降下を検出</div>
          <div>[14:30:15] 分析開始: 過去24時間のデータを取得</div>
          <div>[14:45:00] 原因特定: CVR低下が主要因</div>
          <div>[15:00:00] 対策立案中: A/Bテスト準備...</div>
        </div>
      </div>
    </div>
  )
}

// コントリビューター詳細モーダルコンテンツ
export function ContributorDetailContent({ name }: { name: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">{name}の貢献詳細</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded text-center">
            <div className="text-2xl font-bold">2,847</div>
            <div className="text-sm text-gray-600">総ポイント</div>
          </div>
          <div className="bg-gray-50 p-4 rounded text-center">
            <div className="text-2xl font-bold">¥487,234</div>
            <div className="text-sm text-gray-600">今月の報酬</div>
          </div>
          <div className="bg-gray-50 p-4 rounded text-center">
            <div className="text-2xl font-bold">15</div>
            <div className="text-sm text-gray-600">貢献プロジェクト</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">貢献履歴</h3>
        <div className="space-y-2">
          {[
            { project: 'AI議事録作成', points: 500, type: '機能開発' },
            { project: '家計簿アプリ', points: 350, type: 'バグ修正' },
            { project: '猫カフェ予約', points: 280, type: 'UI改善' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium">{item.project}</div>
                <div className="text-sm text-gray-500">{item.type}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{item.points} pts</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}