// LP検証システム - モダンダッシュボード
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/Toast';
import { DashboardSkeleton } from '@/components/SkeletonScreen';
import { 
  TrendingUp, TrendingDown, BarChart3, Activity, Zap, Filter, 
  ArrowUpRight, ArrowDownRight, Bell, Settings, Download, 
  ChevronRight, Sparkles, Clock, Target, RefreshCw, AlertTriangle, 
  Eye, Search, Calendar, Users, DollarSign, ExternalLink, Globe 
} from 'lucide-react';

export default function DashboardPage() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [unresolvedAlerts, setUnresolvedAlerts] = useState(3);
  const toast = useToast();

  // フックは早期returnより前に宣言する必要がある
  const [positions, setPositions] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/positions', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setPositions(data.positions || [])
        }
      } catch {}
    }
    load()
  }, [])

  // アクティブアラート（Convexから取得）
  const [alerts, setAlerts] = useState<any[]>([])
  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const res = await fetch('/api/alerts', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          setAlerts(data.alerts || [])
        }
      } catch {}
    }
    loadAlerts()
  }, [])

  useEffect(() => {
    // データ読み込みシミュレーション
    setTimeout(() => {
      setIsLoading(false);
      // 初回アクセス時のウェルカム通知
      toast.success('ダッシュボード更新完了', '最新データを取得しました');
    }, 1500);
  }, []); // 空の依存配列で初回のみ実行

  // ローディング中はスケルトンスクリーンを表示
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const actionLogs: any[] = []

  const summaryStats = {
    totalCvr: positions.length ? Math.round((positions.reduce((a, p) => a + (p.cvr || 0), 0) / positions.length) * 10) / 10 : 0,
    totalLeads: positions.reduce((a, p) => a + (p.leads || 0), 0),
    totalCpl: '—',
    totalRevenue: '—'
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'danger': return 'bg-rose-500';
      default: return 'bg-gray-500';
    }
  };

  const getGradeStyle = (grade: string) => {
    switch(grade) {
      case 'A+': return 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200';
      case 'A': return 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200';
      case 'B': return 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200';
      case 'D': return 'bg-gradient-to-r from-rose-50 to-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <main className="min-h-screen bg-gray-50" role="main">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        
        {/* ヘッダー */}
        <header className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center" aria-hidden="true">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    LP検証システム
                  </h1>
                </div>
                <p className="text-gray-600 text-sm" role="doc-subtitle">全ポジション統合管理・リアルタイム分析</p>
              </div>
              <div className="flex items-center space-x-2">
                <Link
                  href="/domains"
                  className="px-3 py-1.5 text-sm border border-purple-200 bg-purple-50 rounded-lg hover:bg-purple-100 text-purple-700 flex items-center transition-colors"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  ドメイン管理
                </Link>
                <Link
                  href="/position/new"
                  className="px-3 py-1.5 text-sm border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 text-blue-700 flex items-center transition-colors"
                >
                  新規ポジション
                </Link>
                <button 
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:border-gray-300 text-gray-700 flex items-center"
                  aria-label="今日の日付でフィルタ"
                >
                  <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
                  今日
                </button>
                <button 
                  className="relative p-1.5 border border-gray-200 rounded-lg hover:border-gray-300 text-gray-700"
                  onClick={() => toast.info('通知機能', '開発中の機能です')}
                  aria-label={`通知 ${unresolvedAlerts > 0 ? `${unresolvedAlerts}件の未読あり` : ''}`}
                >
                  <Bell className="w-4 h-4" aria-hidden="true" />
                  {unresolvedAlerts > 0 && (
                    <span 
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
                      aria-label={`${unresolvedAlerts}件の未読通知`}
                    >
                      {unresolvedAlerts}
                    </span>
                  )}
                </button>
                {/* 未解決アラート表示 */}
                {unresolvedAlerts > 0 && (
                  <div className="flex items-center space-x-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-sm font-medium">要対応 {unresolvedAlerts}件</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* サマリー統計 */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6" aria-label="パフォーマンス統計">
          <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">総CVR</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{summaryStats.totalCvr}%</p>
                <p className="text-green-600 text-xs font-medium mt-1">前日比: +0.3%</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">総リード数</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{summaryStats.totalLeads}</p>
                <p className="text-blue-600 text-xs font-medium mt-1">前日比: +127</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">平均CPL</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{summaryStats.totalCpl}</p>
                <p className="text-orange-600 text-xs font-medium mt-1">前日比: -¥56</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">総広告費</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{summaryStats.totalRevenue}</p>
                <p className="text-gray-500 text-xs font-medium mt-1">予算進捗: 68%</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>
        </section>

        {/* メインコンテンツ */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ポジション管理 */}
          <section className="lg:col-span-2" aria-labelledby="positions-heading">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-gray-700" aria-hidden="true" />
                    <h2 id="positions-heading" className="text-lg font-semibold text-gray-900">ポジション管理</h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button 
                        onClick={() => setSelectedTab('all')}
                        className={`px-3 py-1 text-sm rounded ${selectedTab === 'all' ? 'bg-white shadow-sm' : ''}`}
                      >
                        全て
                      </button>
                      <button 
                        onClick={() => setSelectedTab('active')}
                        className={`px-3 py-1 text-sm rounded ${selectedTab === 'active' ? 'bg-white shadow-sm' : ''}`}
                      >
                        稼働中
                      </button>
                      <button 
                        onClick={() => setSelectedTab('warning')}
                        className={`px-3 py-1 text-sm rounded ${selectedTab === 'warning' ? 'bg-white shadow-sm' : ''}`}
                      >
                        要注意
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {positions
                  .filter(p => selectedTab === 'all' || p.status === selectedTab)
                  .map((position) => (
                  <div key={position.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <Link 
                        href={`/position/${position.id}`}
                        className="flex-1 flex items-start space-x-4 cursor-pointer"
                      >
                        <div className={`w-2 h-2 mt-2 rounded-full ${getStatusColor(position.status)}`} />
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{position.name}</h3>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getGradeStyle(position.grade)}`}>
                              {position.grade}
                            </span>
                            <span className="text-xs text-gray-500">{position.performance}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{position.description}</p>
                          
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-500">CVR:</span>
                              <span className="font-medium text-gray-900">{position.cvr}%</span>
                            {(position.cvr ?? 0) >= 10 ? (
                                <TrendingUp className="w-3 h-3 text-green-500" />
                              ) : (
                                <TrendingDown className="w-3 h-3 text-red-500" />
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-500">CPL:</span>
                              <span className="font-medium text-gray-900">{position.cpl || '—'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-gray-500">リード:</span>
                              <span className="font-medium text-gray-900">{position.leads}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <div className="flex items-start space-x-2 ml-4">
                        <a
                          href={position.lpUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 text-sm border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center space-x-1 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>LP表示</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <Link 
                          href={`/position/${position.id}`}
                          className="p-1.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* イベントログ */}
          <section className="space-y-6" aria-labelledby="events-heading">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-700" />
                  <h2 id="events-heading" className="text-lg font-semibold text-gray-900">イベントログ</h2>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {actionLogs.map((log, index) => (
                  <Link key={index} href={`/event/${index + 1}`}>
                    <div 
                      className="p-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-all duration-150 transform active:scale-[0.99]"
                      style={{ minHeight: '48px' }} // フィッツの法則対応
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{log.time}</span>
                        <span className="text-xs text-gray-500">4時間</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">CVR</span>
                          <span className="font-medium">{log.cvr}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">セッション</span>
                          <span className="font-medium">{log.sessions}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">CPL</span>
                          <span className="font-medium">{log.cpl}</span>
                        </div>
                      </div>
                      <div className="mt-3 p-2 bg-blue-50 rounded text-xs text-blue-700">
                        {log.optimization}
                      </div>
                      <div className="mt-2 p-2 bg-purple-50 rounded text-xs text-purple-700">
                        🤖 {log.ai}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* アラート（Convexのアクティブアラートを表示） */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h2 className="text-lg font-semibold text-gray-900">アクティブアラート</h2>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {alerts.length === 0 ? (
                  <p className="text-sm text-gray-500">アクティブなアラートはありません</p>
                ) : (
                  alerts.map((a, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border ${a.severity === 'critical' ? 'bg-red-50 border-red-200' : a.severity === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`}
                    >
                      <div className="flex items-start space-x-2">
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${a.severity === 'critical' ? 'bg-red-500' : a.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{a.title || a.alert_type}</p>
                          {a.message && <p className="text-xs text-gray-700 mt-1">{a.message}</p>}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
