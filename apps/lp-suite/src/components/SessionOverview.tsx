// セッション概要コンポーネント
'use client';

import { useState } from 'react';

interface Session {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'failed';
  cvr: number;
  cpa: number;
  phase: number;
  lastOptimized: string;
}

export function SessionOverview() {
  const [sessions] = useState<Session[]>([
    {
      id: '1',
      name: 'AI Bridge MVP Test',
      status: 'active',
      cvr: 12.3,
      cpa: 287,
      phase: 1,
      lastOptimized: '2時間前'
    },
    {
      id: '2', 
      name: 'AI Coach Beta',
      status: 'active',
      cvr: 8.7,
      cpa: 342,
      phase: 1,
      lastOptimized: '4時間前'
    },
    {
      id: '3',
      name: 'AI Writer Launch',
      status: 'completed',
      cvr: 15.2,
      cpa: 245,
      phase: 3,
      lastOptimized: '1日前'
    }
  ]);

  const getStatusBadge = (status: Session['status']) => {
    switch (status) {
      case 'active':
        return <span className="badge-success">アクティブ</span>;
      case 'paused':
        return <span className="badge-warning">一時停止</span>;
      case 'completed':
        return <span className="badge-info">完了</span>;
      case 'failed':
        return <span className="badge-error">失敗</span>;
    }
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        アクティブセッション
      </h2>
      
      <div className="space-y-4">
        {sessions.map((session) => (
          <div 
            key={session.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-unson-blue transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900">{session.name}</h3>
              {getStatusBadge(session.status)}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">CVR:</span>
                <span className="ml-1 font-medium text-gray-900">{session.cvr}%</span>
              </div>
              <div>
                <span className="text-gray-500">CPA:</span>
                <span className="ml-1 font-medium text-gray-900">¥{session.cpa}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
              <span>フェーズ {session.phase}</span>
              <span>最適化: {session.lastOptimized}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <button className="btn-primary w-full">
          新しいセッションを開始
        </button>
      </div>
    </div>
  );
}