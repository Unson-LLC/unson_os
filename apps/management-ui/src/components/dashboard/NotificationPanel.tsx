import React from 'react'

interface Notification {
  id: string
  type: 'alert' | 'warning' | 'info' | 'success'
  title: string
  message: string
  time: string
  isRead: boolean
  actionLabel?: string
  actionLink?: string
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'alert',
    title: '🔴 猫カフェ予約がクライシス状態',
    message: 'MRRが¥38,000まで低下。CRISIS_MRR_RECOVERYを実行中',
    time: '5分前',
    isRead: false,
    actionLabel: '詳細を確認',
    actionLink: '#'
  },
  {
    id: '2',
    type: 'warning',
    title: '⚠️ 在庫管理Proのサンセット予定',
    message: '7日後にサンセット予定。データ移行の準備を開始してください',
    time: '1時間前',
    isRead: false,
    actionLabel: '延命検討',
    actionLink: '#'
  },
  {
    id: '3',
    type: 'success',
    title: '✅ AI議事録作成のCVRが18%突破',
    message: 'LP検証が成功。MVP開発フェーズへの移行を推奨',
    time: '3時間前',
    isRead: false,
    actionLabel: 'Gate承認',
    actionLink: '#'
  },
  {
    id: '4',
    type: 'info',
    title: '📊 週次レポートが利用可能',
    message: '先週のパフォーマンスサマリーを確認できます',
    time: '昨日',
    isRead: true,
    actionLabel: 'レポートを見る',
    actionLink: '#'
  },
  {
    id: '5',
    type: 'warning',
    title: '⚠️ DAU低下アラート',
    message: '日報アプリのDAUが10を下回りました',
    time: '昨日',
    isRead: true,
    actionLabel: '対策を検討',
    actionLink: '#'
  }
]

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
  onNotificationClick?: (id: string) => void
}

export function NotificationPanel({ isOpen, onClose, onNotificationClick }: NotificationPanelProps) {
  if (!isOpen) return null

  const unreadCount = mockNotifications.filter(n => !n.isRead).length

  const getTypeStyles = (type: Notification['type']) => {
    switch (type) {
      case 'alert':
        return 'border-red-200 bg-red-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'info':
        return 'border-blue-200 bg-blue-50'
    }
  }

  return (
    <>
      {/* オーバーレイ */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 z-40"
        onClick={onClose}
      />
      
      {/* パネル */}
      <div className="fixed right-4 top-16 w-96 max-h-[600px] bg-white rounded-lg shadow-xl z-50 flex flex-col">
        {/* ヘッダー */}
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h3 className="font-semibold">通知</h3>
            <p className="text-sm text-gray-500">{unreadCount}件の未読</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* 通知リスト */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            {mockNotifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  getTypeStyles(notification.type)
                } ${notification.isRead ? 'opacity-75' : ''}`}
                onClick={() => onNotificationClick?.(notification.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      {!notification.isRead && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full" />
                      )}
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    {notification.actionLabel && (
                      <button className="text-xs text-blue-600 hover:text-blue-800 mt-2">
                        {notification.actionLabel} →
                      </button>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 ml-2">
                    {notification.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* フッター */}
        <div className="p-4 border-t">
          <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800">
            すべての通知を見る
          </button>
        </div>
      </div>
    </>
  )
}