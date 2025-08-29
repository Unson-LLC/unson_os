// 最適化ログコンポーネント
'use client';

import { useState } from 'react';

interface OptimizationLogEntry {
  id: string;
  timestamp: string;
  sessionId: string;
  type: 'optimization' | 'phase-transition' | 'pr-created';
  status: 'success' | 'error' | 'pending';
  details: string;
  metrics?: {
    cvr: number;
    cpa: number;
  };
  prUrl?: string;
}

export function OptimizationLog() {
  const [logs] = useState<OptimizationLogEntry[]>([
    {
      id: '1',
      timestamp: '2時間前',
      sessionId: 'AI Bridge MVP Test',
      type: 'optimization',
      status: 'success',
      details: 'ヘッドライン最適化により+2.5% CVR向上',
      metrics: { cvr: 12.3, cpa: 287 },
      prUrl: 'https://github.com/owner/repo/pull/123'
    },
    {
      id: '2',
      timestamp: '4時間前',
      sessionId: 'AI Coach Beta',
      type: 'pr-created',
      status: 'success',
      details: 'LP最適化PR自動作成完了',
      prUrl: 'https://github.com/owner/repo/pull/122'
    },
    {
      id: '3',
      timestamp: '6時間前',
      sessionId: 'AI Writer Launch',
      type: 'phase-transition',
      status: 'success',
      details: 'Phase1→Phase2 移行実行',
      metrics: { cvr: 15.2, cpa: 245 }
    },
    {
      id: '4',
      timestamp: '8時間前',
      sessionId: 'AI Bridge MVP Test',
      type: 'optimization',
      status: 'error',
      details: 'Google Ads API接続エラー (リトライ予定)',
    }
  ]);

  const getTypeIcon = (type: OptimizationLogEntry['type']) => {
    switch (type) {
      case 'optimization':
        return (
          <svg className="w-4 h-4 text-unson-blue" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        );
      case 'phase-transition':
        return (
          <svg className="w-4 h-4 text-unson-green" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      case 'pr-created':
        return (
          <svg className="w-4 h-4 text-unson-purple" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getStatusBadge = (status: OptimizationLogEntry['status']) => {
    switch (status) {
      case 'success':
        return <span className="badge-success">成功</span>;
      case 'error':
        return <span className="badge-error">エラー</span>;
      case 'pending':
        return <span className="badge-warning">処理中</span>;
    }
  };

  const getTypeLabel = (type: OptimizationLogEntry['type']) => {
    switch (type) {
      case 'optimization':
        return 'LP最適化';
      case 'phase-transition':
        return 'フェーズ移行';
      case 'pr-created':
        return 'PR作成';
    }
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        自動化ログ
      </h2>
      
      <div className="space-y-4">
        {logs.map((log) => (
          <div 
            key={log.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getTypeIcon(log.type)}
                <span className="text-sm font-medium text-gray-900">
                  {getTypeLabel(log.type)}
                </span>
                {getStatusBadge(log.status)}
              </div>
              <span className="text-sm text-gray-500">{log.timestamp}</span>
            </div>
            
            <div className="text-sm text-gray-700 mb-2">
              <span className="font-medium">セッション:</span> {log.sessionId}
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              {log.details}
            </p>
            
            {log.metrics && (
              <div className="flex space-x-4 text-sm text-gray-600 mb-2">
                <span>CVR: <span className="font-medium text-gray-900">{log.metrics.cvr}%</span></span>
                <span>CPA: <span className="font-medium text-gray-900">¥{log.metrics.cpa}</span></span>
              </div>
            )}
            
            {log.prUrl && (
              <div className="mt-2">
                <a 
                  href={log.prUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-unson-blue hover:underline"
                >
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2v-2a1 1 0 10-2 0v2H5V7h2a1 1 0 000-2H5z" />
                  </svg>
                  PR を確認
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-center">
        <button className="btn-secondary">
          ログをさらに表示
        </button>
      </div>
    </div>
  );
}