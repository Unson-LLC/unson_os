// メトリクスダッシュボードコンポーネント
'use client';

import { useState } from 'react';

interface MetricData {
  label: string;
  current: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
}

export function MetricsDashboard() {
  const [metrics] = useState<MetricData[]>([
    {
      label: 'CVR',
      current: 12.3,
      target: 10.0,
      trend: 'up',
      unit: '%'
    },
    {
      label: 'CPA',
      current: 287,
      target: 300,
      trend: 'down',
      unit: '¥'
    },
    {
      label: 'セッション数',
      current: 1247,
      target: 1000,
      trend: 'up',
      unit: ''
    },
    {
      label: '統計的有意性',
      current: 95,
      target: 95,
      trend: 'stable',
      unit: '%'
    }
  ]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return (
          <svg className="w-4 h-4 text-unson-green" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L10 4.414 4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'down':
        return (
          <svg className="w-4 h-4 text-unson-orange" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L10 15.586l5.293-5.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const isAchieved = (metric: MetricData) => {
    if (metric.label === 'CPA') {
      return metric.current <= metric.target;
    }
    return metric.current >= metric.target;
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        KPIダッシュボード
      </h2>
      
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">{metric.label}</span>
              <div className="flex items-center space-x-1">
                {getTrendIcon(metric.trend)}
                {isAchieved(metric) ? (
                  <span className="text-xs text-unson-green font-medium">達成</span>
                ) : (
                  <span className="text-xs text-unson-orange font-medium">未達成</span>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {metric.unit === '¥' ? metric.unit : ''}{metric.current.toLocaleString()}{metric.unit !== '¥' ? metric.unit : ''}
                </div>
                <div className="text-sm text-gray-500">
                  目標: {metric.unit === '¥' ? metric.unit : ''}{metric.target.toLocaleString()}{metric.unit !== '¥' ? metric.unit : ''}
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  isAchieved(metric) ? 'text-unson-green' : 'text-unson-orange'
                }`}>
                  {metric.label === 'CPA' 
                    ? `${metric.target - metric.current > 0 ? '+' : ''}¥${metric.target - metric.current}`
                    : `${metric.current - metric.target > 0 ? '+' : ''}${(metric.current - metric.target).toFixed(1)}${metric.unit}`
                  }
                </div>
                <div className="text-xs text-gray-500">vs 目標</div>
              </div>
            </div>
            
            {/* プログレスバー */}
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    isAchieved(metric) ? 'bg-unson-green' : 'bg-unson-orange'
                  }`}
                  style={{ 
                    width: `${Math.min(100, (metric.current / metric.target) * 100)}%` 
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-unson-blue mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm">
            <div className="font-medium text-unson-blue">フェーズ移行判定</div>
            <div className="text-gray-600">3/4 の目標を達成済み</div>
          </div>
        </div>
      </div>
    </div>
  );
}