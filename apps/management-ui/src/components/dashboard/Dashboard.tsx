'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { 
  Bell, 
  Wallet, 
  User, 
  ChevronDown,
  Target,
  ClipboardList,
  Brain,
  BarChart3,
  TrendingUp,
  DollarSign,
  Link2,
  Bot,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { KPICard } from './KPICard'
import { TimeSeriesGrid } from './TimeSeriesGrid'
import { MetricsGrid } from './MetricsGrid'
import { PKGExecutionStatus } from './PKGExecutionStatus'
import { DAORevenueDashboard } from './DAORevenueDashboard'
import { PortfolioEvolution } from './PortfolioEvolution'
import { NotificationPanel } from './NotificationPanel'
import { DetailModal, DAODetailContent, PKGDetailContent, ContributorDetailContent } from './DetailModal'
import { PlaybookIntegrated } from './PlaybookIntegrated'
import { AdCampaignMonitor } from './AdCampaignMonitor'
import { CommandCenter } from './CommandCenter'
import { FiveStageContainer } from './FiveStageContainer'
import { PatternDiscoveryDashboard } from './PatternDiscoveryDashboard'
import { GateDecisionView } from './GateDecisionView'
import { IndicatorSystem, convertToMetricsGridData, convertToTimeSeriesData, getTimeSeriesDataBySaaS } from './IndicatorSystem'
import {
  mockKPIData,
  mockPKGExecutionData,
  mockDAORevenueData,
  mockPhaseDistribution,
  mockKPISymbols
} from '@/lib/mock-data'

export function Dashboard() {
  const [selectedSaaS, setSelectedSaaS] = useState('猫カフェ予約')
  const [selectedMetric, setSelectedMetric] = useState('MRR')
  const [activeTab, setActiveTab] = useState<'command' | 'saas-list' | 'learning' | 'gate' | 'data' | 'strategy' | 'portfolio'>('command')
  const [gateContext, setGateContext] = useState<{ gateId?: string, saasName?: string, phase?: string }>({})
  const [dataViewFocus, setDataViewFocus] = useState<{ saasName?: string, metric?: string }>({})
  const [showNotifications, setShowNotifications] = useState(false)
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    type: 'dao' | 'pkg' | 'contributor' | null
    data?: any
  }>({ isOpen: false, type: null })

  // インジケーターシステムからデータ取得
  const indicatorTimeSeriesData = dataViewFocus.saasName 
    ? getTimeSeriesDataBySaaS(dataViewFocus.saasName)
    : convertToTimeSeriesData()
  const metricsGridData = convertToMetricsGridData(selectedMetric)

  const currentDate = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short'
  })

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Image 
              src="/unson-os-logo.png" 
              alt="UnsonOS Logo" 
              width={40} 
              height={40}
              className="rounded-lg"
            />
            <h1 className="text-xl font-bold text-secondary-900">UnsonOS v2.4.1</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-error-100 text-error-800 hover:bg-error-200 transition-colors duration-200"
            >
              <Bell className="w-4 h-4 mr-1" />
              <span>3件</span>
            </button>
            <button 
              onClick={() => setModalState({ isOpen: true, type: 'dao' })}
              className="flex items-center space-x-2 hover:bg-secondary-100 px-3 py-2 rounded-md transition-colors duration-200"
            >
              <Wallet className="w-4 h-4" />
              <span className="text-sm font-medium">DAO</span>
            </button>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-secondary-700" />
              <span className="text-secondary-900 text-sm font-medium">佐藤太郎</span>
              <ChevronDown className="w-4 h-4 text-secondary-600 hover:text-secondary-800 transition-colors" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - 固定位置 */}
        <nav className="w-64 bg-white shadow-sm h-screen sticky top-0 overflow-y-auto">
          <div className="p-4 space-y-1">
            <SidebarItem 
              icon={Target} 
              label="コマンドセンター" 
              active={activeTab === 'command'}
              onClick={() => setActiveTab('command')}
            />
            <SidebarItem 
              icon={ClipboardList} 
              label="SaaS一覧" 
              active={activeTab === 'saas-list'}
              onClick={() => setActiveTab('saas-list')}
            />
            <SidebarItem 
              icon={Brain} 
              label="学習分析" 
              active={activeTab === 'learning'}
              onClick={() => setActiveTab('learning')}
            />
            <div className="border-t my-2"></div>
            <SidebarItem 
              icon={BarChart3} 
              label="データ & インサイト" 
              active={activeTab === 'data'}
              onClick={() => setActiveTab('data')}
            />
            <SidebarItem 
              icon={TrendingUp} 
              label="戦略 & 実行" 
              active={activeTab === 'strategy'}
              onClick={() => setActiveTab('strategy')}
            />
            <SidebarItem 
              icon={DollarSign} 
              label="ポートフォリオ" 
              active={activeTab === 'portfolio'}
              onClick={() => setActiveTab('portfolio')}
            />
          </div>
        </nav>

        {/* Main Content - スクロール可能 */}
        <main className="flex-1 overflow-y-auto h-screen">
          {/* コマンドセンター */}
          {activeTab === 'command' && (
            <CommandCenter 
              onDrillDown={(view, context) => {
                if (view === 'data') {
                  setDataViewFocus({ saasName: context?.saas, metric: context?.metric })
                  setActiveTab('data')
                } else if (view === 'strategy') {
                  setActiveTab('strategy')
                } else if (view === 'portfolio') {
                  setActiveTab('portfolio')
                }
              }}
              onTakeAction={(saasId, action) => {
                if (action === 'detail' || action === 'deep-analysis') {
                  // SaaS一覧タブに移動
                  setActiveTab('saas-list')
                } else if (action === 'gate') {
                  // GATE判定画面へ移動
                  setGateContext({ gateId: saasId, saasName: 'AI議事録作成', phase: 'LP検証' })
                  setActiveTab('gate')
                } else {
                  alert(`${saasId}に対するアクション: ${action}`)
                }
              }}
            />
          )}

          {/* SaaS一覧 */}
          {activeTab === 'saas-list' && (
            <FiveStageContainer 
              initialLevel="unsonos"
              initialSaaS="ai-minutes"
            />
          )}
          
          {/* 学習分析 */}
          {activeTab === 'learning' && (
            <PatternDiscoveryDashboard />
          )}

          {/* データ & インサイト */}
          {activeTab === 'data' && (
            <div className="space-y-6 p-6">
              {/* コマンドセンターからの連携情報表示 */}
              {(dataViewFocus.saasName || dataViewFocus.metric) && (
                <div className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Link2 className="w-4 h-4 text-primary-600 mr-2" />
                      <span className="text-primary-700 font-medium">コマンドセンターから参照中</span>
                      {dataViewFocus.saasName && (
                        <span className="ml-2">SaaS: {dataViewFocus.saasName}</span>
                      )}
                      {dataViewFocus.metric && (
                        <span className="ml-2">メトリクス: {dataViewFocus.metric.toUpperCase()}</span>
                      )}
                    </div>
                    <button
                      onClick={() => setDataViewFocus({})}
                      className="text-primary-600 hover:text-primary-800 text-sm transition-colors"
                    >
                      フォーカス解除
                    </button>
                  </div>
                </div>
              )}
              
              <TimeSeriesGrid
                data={indicatorTimeSeriesData}
                selectedSaaS={dataViewFocus.saasName || selectedSaaS}
                onSaaSChange={setSelectedSaaS}
                onExport={() => alert('エクスポート機能は実装準備中です')}
              />
              
              <div role="region" aria-label="メトリクス分析">
                <MetricsGrid
                  data={metricsGridData}
                  metric={dataViewFocus.metric || selectedMetric}
                  onMetricChange={(metric) => {
                    setSelectedMetric(metric)
                  }}
                  onTimeFrameChange={() => {}}
                />
                
                {/* コマンドセンターに戻るボタン */}
                {(dataViewFocus.saasName || dataViewFocus.metric) && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setActiveTab('command')}
                      className="btn-primary inline-flex items-center"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      コマンドセンターに戻る
                    </button>
                  </div>
                )}
              </div>

              {/* AI判断用インジケーターシステム */}
              <div role="region" aria-label="AI判断用インジケーターシステム">
                <div className="bg-gradient-to-r from-accent-50 to-primary-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-accent-700 mb-2 flex items-center">
                    <Bot className="w-5 h-5 mr-2" />
                    AI学習データ統合層
                  </h3>
                  <p className="text-sm text-secondary-600">
                    上記の可視化データは全てこのIndicatorSystemで管理されており、
                    すべてのメトリクスがAI判断用インジケーターとして記録・学習されています。
                  </p>
                </div>
                <IndicatorSystem 
                  onGateDecision={(saasId, decision, insights) => {
                    alert(`${saasId}のGATE判断: ${decision}\n信頼度: ${(insights.gateReadiness * 100).toFixed(0)}%`)
                  }}
                />
              </div>
            </div>
          )}

          {/* 戦略 & 実行 */}
          {activeTab === 'strategy' && (
            <div className="p-6">
              <PlaybookIntegrated 
                onViewDataSeries={(saasName, metric) => {
                  setDataViewFocus({ saasName, metric })
                  setActiveTab('data')
                }}
              />
            </div>
          )}

          {/* ポートフォリオ */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6 p-6">
              <PortfolioEvolution />
              
              <DAORevenueDashboard
                data={mockDAORevenueData}
                onDetailClick={() => setModalState({ isOpen: true, type: 'dao' })}
                onContributorClick={(name) => setModalState({ isOpen: true, type: 'contributor', data: { name } })}
              />
            </div>
          )}
        </main>
      </div>
      
      {/* 通知パネル */}
      <NotificationPanel 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onNotificationClick={(id) => {
          console.log('通知クリック:', id)
          setShowNotifications(false)
        }}
      />
      
      {/* 詳細モーダル */}
      <DetailModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, type: null })}
        title={
          modalState.type === 'dao' ? '収益分配詳細' :
          modalState.type === 'pkg' ? 'PKG実行詳細' :
          modalState.type === 'contributor' ? '貢献者詳細' :
          ''
        }
      >
        {modalState.type === 'dao' && <DAODetailContent />}
        {modalState.type === 'pkg' && <PKGDetailContent saasName={modalState.data?.saasName || ''} />}
        {modalState.type === 'contributor' && <ContributorDetailContent name={modalState.data?.name || ''} />}
      </DetailModal>
    </div>
  )
}

function SidebarItem({ 
  icon: Icon, 
  label, 
  active = false,
  onClick
}: { 
  icon: React.ComponentType<{ className?: string }>
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button 
      className={`
        w-full flex items-center space-x-3 px-3 py-2 rounded-lg
        transition-colors duration-200 cursor-pointer
        ${active 
          ? 'bg-primary-50 text-primary-700 font-semibold' 
          : 'hover:bg-secondary-50 text-secondary-800 font-medium'}
      `}
      onClick={onClick}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-primary-600' : 'text-secondary-700'}`} />
      <span>{label}</span>
    </button>
  )
}