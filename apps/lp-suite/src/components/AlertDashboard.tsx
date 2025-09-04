// アラートダッシュボードコンポーネント
'use client';

import { useState, useEffect } from 'react';
import type { Alert } from '@/types/metrics';

export function AlertDashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  
  // Convexからアラートデータを取得
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/alerts?status=active', { cache: 'no-store' })
        
        if (response.ok) {
          const alertData = await response.json()
          console.log('アラートデータ取得成功:', alertData)
          
          if (alertData.success && alertData.alerts) {
            // ConvexアラートデータをAlert型に変換
            const convertedAlerts = alertData.alerts.map((alert: any) => ({
              type: alert.alert_type,
              severity: alert.severity,
              message: alert.message,
              timestamp: new Date(alert.created_at).toISOString(),
              sessionId: alert.session_id,
              alertId: alert.alert_id
            }))
            setAlerts(convertedAlerts)
          }
        } else {
          console.warn('アラート取得失敗、フォールバックデータ使用')
          // フォールバック: デモ用のアラートデータ
          setAlerts([
            {
              type: 'cvr_below_threshold',
              severity: 'medium',
              message: 'わたしコンパスで CVR 0% が改善が必要です',
              timestamp: new Date().toISOString(),
              sessionId: 'watashi-compass'
            }
          ])
        }
      } catch (error) {
        console.error('アラート取得エラー:', error)
        setAlerts([]) // エラー時は空配列
      } finally {
        setLoading(false)
      }
    }
    
    fetchAlerts()
  }, [])

  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getSeverityIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'high':
        return (
          <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'medium':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      case 'low':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getTypeLabel = (type: Alert['type']) => {
    switch (type) {
      case 'cvr_below_threshold':
        return 'CVR低下';
      case 'cpa_above_threshold':
        return 'CPA上昇';
      case 'revenue_drop':
        return '収益減少';
      case 'anomaly_detected':
        return '異常検出';
      default:
        return 'アラート';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}分前`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)}時間前`;
    } else {
      return date.toLocaleDateString('ja-JP');
    }
  };

  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.severity === filter);

  const alertCounts = {
    critical: alerts.filter(a => a.severity === 'critical').length,
    high: alerts.filter(a => a.severity === 'high').length,
    medium: alerts.filter(a => a.severity === 'medium').length,
    low: alerts.filter(a => a.severity === 'low').length,
    total: alerts.length
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          アラートダッシュボード
        </h2>
        <button className="btn-secondary text-sm">
          全て既読にする
        </button>
      </div>

      {/* サマリー統計 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">総アラート数</div>
          <div className="text-xl font-bold text-gray-900">{alertCounts.total}</div>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <div className="text-sm text-red-600">Critical</div>
          <div className="text-xl font-bold text-red-700">{alertCounts.critical}</div>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg">
          <div className="text-sm text-orange-600">High</div>
          <div className="text-xl font-bold text-orange-700">{alertCounts.high}</div>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="text-sm text-yellow-600">Medium</div>
          <div className="text-xl font-bold text-yellow-700">{alertCounts.medium}</div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-blue-600">Low</div>
          <div className="text-xl font-bold text-blue-700">{alertCounts.low}</div>
        </div>
      </div>

      {/* フィルター */}
      <div className="flex space-x-2 mb-4">
        {['all', 'critical', 'high', 'medium', 'low'].map((severity) => (
          <button
            key={severity}
            onClick={() => setFilter(severity as any)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === severity
                ? 'bg-unson-blue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {severity === 'all' ? '全て' : severity.charAt(0).toUpperCase() + severity.slice(1)}
          </button>
        ))}
      </div>

      {/* アラート一覧 */}
      <div className="space-y-3">
        {filteredAlerts.map((alert, index) => (
          <div 
            key={index}
            className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex items-start space-x-3">
              {getSeverityIcon(alert.severity)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {getTypeLabel(alert.type)}
                    </span>
                    {alert.sessionId && (
                      <span className="text-xs px-2 py-1 bg-white rounded text-gray-600">
                        {alert.sessionId}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatTimestamp(alert.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  {alert.message}
                </p>
                <div className="flex space-x-2">
                  <button className="text-xs px-3 py-1 bg-white rounded border border-current hover:bg-gray-50">
                    詳細を確認
                  </button>
                  <button className="text-xs px-3 py-1 bg-white rounded border border-current hover:bg-gray-50">
                    既読にする
                  </button>
                  {alert.sessionId && (
                    <button className="text-xs px-3 py-1 bg-white rounded border border-current hover:bg-gray-50">
                      セッションを表示
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500">
            {filter === 'all' ? 'アラートはありません' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} レベルのアラートはありません`}
          </p>
        </div>
      )}

      {/* 設定リンク */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <button className="text-unson-blue hover:underline text-sm">
          アラート設定を管理
        </button>
      </div>
    </div>
  );
}