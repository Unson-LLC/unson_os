// スケルトンスクリーン - ローディング状態表示
'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width = 'w-full', 
  height = 'h-4' 
}) => (
  <div 
    className={`bg-gray-200 rounded animate-pulse ${width} ${height} ${className}`}
  />
);

// ダッシュボード用スケルトン
export const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    {/* ヘッダースケルトン */}
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="mb-2" width="w-48" height="h-6" />
          <Skeleton width="w-64" height="h-4" />
        </div>
        <div className="flex space-x-2">
          <Skeleton width="w-20" height="h-8" />
          <Skeleton width="w-10" height="h-8" />
        </div>
      </div>
    </div>

    {/* サマリー統計スケルトン */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <Skeleton width="w-16" height="h-4" />
            <Skeleton width="w-10" height="h-10" className="rounded-lg" />
          </div>
          <Skeleton width="w-20" height="h-8" className="mb-2" />
          <Skeleton width="w-24" height="h-3" />
        </div>
      ))}
    </div>

    {/* メインコンテンツスケルトン */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* ポジション管理スケルトン */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <Skeleton width="w-32" height="h-6" />
              <Skeleton width="w-40" height="h-8" className="rounded-lg" />
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <Skeleton width="w-2" height="h-16" className="rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Skeleton width="w-24" height="h-6" />
                        <Skeleton width="w-12" height="h-5" className="rounded-full" />
                        <Skeleton width="w-20" height="h-4" />
                      </div>
                      <Skeleton width="w-full" height="h-4" className="mb-3" />
                      <div className="flex items-center space-x-6">
                        <Skeleton width="w-16" height="h-4" />
                        <Skeleton width="w-16" height="h-4" />
                        <Skeleton width="w-16" height="h-4" />
                      </div>
                    </div>
                  </div>
                  <Skeleton width="w-5" height="h-5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* サイドバースケルトン */}
      <div className="space-y-6">
        {/* イベントログスケルトン */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <Skeleton width="w-24" height="h-6" />
          </div>
          <div className="divide-y divide-gray-100">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Skeleton width="w-12" height="h-4" />
                  <Skeleton width="w-16" height="h-3" />
                </div>
                <div className="space-y-2 mb-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex items-center justify-between">
                      <Skeleton width="w-12" height="h-3" />
                      <Skeleton width="w-16" height="h-3" />
                    </div>
                  ))}
                </div>
                <Skeleton width="w-full" height="h-6" className="mb-2" />
                <Skeleton width="w-full" height="h-6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ポジション詳細用スケルトン
export const PositionDetailSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    {/* ヘッダースケルトン */}
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton width="w-20" height="h-8" />
          <div>
            <Skeleton width="w-48" height="h-6" className="mb-1" />
            <Skeleton width="w-32" height="h-4" />
          </div>
        </div>
        <Skeleton width="w-10" height="h-8" />
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* ポジション概要スケルトン */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="bg-gray-50 border-b border-gray-200 p-6">
          <Skeleton width="w-32" height="h-6" />
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton width="w-12" height="h-4" />
                <Skeleton width="w-20" height="h-8" />
                <Skeleton width="w-16" height="h-3" />
              </div>
            ))}
          </div>
          <Skeleton width="w-full" height="h-16" className="mb-6" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton width="w-16" height="h-4" className="mb-1 mx-auto" />
                <Skeleton width="w-20" height="h-5" className="mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// イベント詳細用スケルトン
export const EventDetailSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton width="w-32" height="h-8" />
          <div>
            <Skeleton width="w-32" height="h-6" className="mb-1" />
            <Skeleton width="w-48" height="h-4" />
          </div>
        </div>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* イベント概要 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-lg">
              <Skeleton width="w-12" height="h-4" className="mb-2" />
              <Skeleton width="w-20" height="h-8" className="mb-1" />
              <Skeleton width="w-24" height="h-3" />
            </div>
          ))}
        </div>
        <Skeleton width="w-full" height="h-20" />
      </div>
    </div>
  </div>
);

export default Skeleton;