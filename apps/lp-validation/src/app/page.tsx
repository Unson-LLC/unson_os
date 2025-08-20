// LP検証システム メインページ
'use client';

import { SessionOverview } from '@/components/SessionOverview';
import { MetricsDashboard } from '@/components/MetricsDashboard';
import { OptimizationLog } from '@/components/OptimizationLog';

export default function LPValidationHomePage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900">LP検証ダッシュボード</h1>
          <p className="text-gray-600 mt-2">
            リアルタイムパフォーマンス監視とA/Bテスト最適化
          </p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* セッション一覧 */}
          <div className="lg:col-span-1 xl:col-span-1 animate-slide-up">
            <SessionOverview />
          </div>
          
          {/* メトリクスダッシュボード */}
          <div className="lg:col-span-1 xl:col-span-1 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <MetricsDashboard />
          </div>
          
          {/* 最適化ログ */}
          <div className="lg:col-span-2 xl:col-span-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <OptimizationLog />
          </div>
        </div>
        
        {/* 統計サマリー */}
        <div className="mt-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="metric-card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-unson-green rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">アクティブセッション</div>
                  <div className="text-2xl font-bold text-gray-900">5</div>
                </div>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-unson-blue rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">平均CVR</div>
                  <div className="text-2xl font-bold text-gray-900">12.3%</div>
                </div>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-unson-orange rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">平均CPA</div>
                  <div className="text-2xl font-bold text-gray-900">¥287</div>
                </div>
              </div>
            </div>
            
            <div className="metric-card">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-unson-purple rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm-2 9a1 1 0 100 2 1 1 0 000-2zm2 0a1 1 0 100 2 1 1 0 000-2zm2 0a1 1 0 100 2 1 1 0 000-2zm2 0a1 1 0 100 2 1 1 0 000-2zm2 0a1 1 0 100 2 1 1 0 000-2zm2 0a1 1 0 100 2 1 1 0 000-2zm-10-9V5a1 1 0 011-1h2a1 1 0 011 1v1H8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500">自動化実行</div>
                  <div className="text-2xl font-bold text-gray-900">127</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}