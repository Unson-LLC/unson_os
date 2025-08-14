import React, { useState } from 'react'
import { DoorOpen, BarChart3, Bot, AlertTriangle, Lightbulb, FileText, CheckCircle, Pause, X, BookOpen, Search } from 'lucide-react'

interface GateDecisionViewProps {
  gateId: string
  saasName: string
  phase: string
  onDecision?: (decision: 'approve' | 'reject' | 'hold') => void
}

export function GateDecisionView({ gateId, saasName, phase, onDecision }: GateDecisionViewProps) {
  const [selectedDecision, setSelectedDecision] = useState<'approve' | 'reject' | 'hold' | null>(null)
  const [reasoning, setReasoning] = useState('')
  
  // モックデータ：現在の状況
  const currentSituation = {
    saasName: saasName || 'AI議事録作成',
    phase: phase || 'LP検証',
    metrics: {
      cvr: 18.3,
      dau: 45,
      signups: 156,
      trials: 45,
      conversions: 8,
      trend: '↗️'
    },
    playbookProgress: 78,
    condition: 'CVR >= 10% AND サンプル >= 100',
    nextAction: 'MVP開発開始'
  }
  
  // システム推奨（AI判定）
  const systemRecommendation = {
    decision: 'approve' as const,
    confidence: 88,
    consensusRate: 0.85,
    reasoning: 'CVR 18.3%は目標値10%を大幅に超過。LP検証フェーズとしては十分な成果。',
    risks: [
      'サンプル数が156件とまだ少ない',
      '競合サービスが2社存在'
    ],
    opportunities: [
      'B2B市場でのニーズが高い',
      '初期ユーザーのNPSが高い（8.5/10）'
    ]
  }
  
  // 類似ケース（CaseBookから）
  const similarCases = [
    {
      id: 'case-1',
      title: 'AI翻訳サービスのLP検証→MVP成功事例',
      date: '2024-10-15',
      similarity: 92,
      situation: 'CVR 17.5%、DAU 38',
      decision: 'MVP開発承認',
      outcome: '3ヶ月後MRR 150万円達成',
      keyLearning: 'B2B向けAIツールは早期MVP化が有効'
    },
    {
      id: 'case-2',
      title: 'タスク管理ツールのLP検証事例',
      date: '2024-09-22',
      similarity: 85,
      situation: 'CVR 19.2%、DAU 52',
      decision: 'MVP開発承認',
      outcome: 'MVP開発後、有料転換率12%',
      keyLearning: '生産性ツールは無料トライアル期間が重要'
    },
    {
      id: 'case-3',
      title: 'チャットボットサービスの失敗事例',
      date: '2024-08-10',
      similarity: 78,
      situation: 'CVR 15.8%、DAU 41',
      decision: 'MVP開発承認',
      outcome: 'MVP後の継続率が20%で撤退',
      keyLearning: '技術的優位性だけでは継続率は上がらない'
    }
  ]
  
  // インジケーター詳細
  const indicatorDetails = {
    consensus: {
      cvr: '↗️',
      traffic: '↗️',
      bounce: '↘️',
      session_time: '↗️',
      page_views: '→'
    },
    confidence: {
      cvr: 95,
      traffic: 88,
      bounce: 82,
      session_time: 78,
      page_views: 70
    }
  }
  
  const handleDecision = () => {
    if (selectedDecision && onDecision) {
      onDecision(selectedDecision)
    }
  }
  
  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <DoorOpen className="w-6 h-6" />
              GATE判定
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {currentSituation.saasName} - {currentSituation.phase}フェーズ完了判定
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">プレイブック進捗</div>
            <div className="text-2xl font-bold text-blue-600">{currentSituation.playbookProgress}%</div>
          </div>
        </div>
        
        {/* 判定条件 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-700 mb-2">判定条件:</div>
          <div className="font-mono text-sm bg-white p-3 rounded border">
            {currentSituation.condition}
          </div>
          <div className="mt-2 text-sm">
            <span className="text-gray-600">次のアクション:</span>
            <span className="ml-2 font-medium">{currentSituation.nextAction}</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左側：現在の状況とシステム推奨 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 現在のメトリクス */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              現在のメトリクス
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{currentSituation.metrics.cvr}%</div>
                <div className="text-xs text-gray-600">CVR</div>
                <div className="text-lg mt-1">{currentSituation.metrics.trend}</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{currentSituation.metrics.dau}</div>
                <div className="text-xs text-gray-600">DAU</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{currentSituation.metrics.signups}</div>
                <div className="text-xs text-gray-600">サインアップ</div>
              </div>
            </div>
            
            {/* インジケーター詳細 */}
            <div className="mt-4 pt-4 border-t">
              <div className="text-sm font-medium text-gray-700 mb-2">インジケーター一致率</div>
              <div className="flex space-x-4">
                {Object.entries(indicatorDetails.consensus).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-xs text-gray-500 capitalize">{key}</div>
                    <div className="text-xl">{value}</div>
                    <div className="text-xs text-gray-600">{indicatorDetails.confidence[key as keyof typeof indicatorDetails.confidence]}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* システム推奨 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Bot className="w-5 h-5" />
                システム推奨
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">信頼度:</span>
                <span className="text-xl font-bold text-blue-600">{systemRecommendation.confidence}%</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className={`px-4 py-2 rounded-lg font-medium ${
                systemRecommendation.decision === 'approve' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <span className="flex items-center gap-2">
                  {systemRecommendation.decision === 'approve' ? (
                    <><CheckCircle className="w-4 h-4" /> 承認推奨</>
                  ) : (
                    <><X className="w-4 h-4" /> 却下推奨</>
                  )}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">一致率:</span>
                <span className="ml-1 font-medium">{(systemRecommendation.consensusRate * 100).toFixed(0)}%</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-700 mb-4">
              {systemRecommendation.reasoning}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium text-red-700 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  リスク
                </div>
                <ul className="text-xs text-gray-600 space-y-1">
                  {systemRecommendation.risks.map((risk, idx) => (
                    <li key={idx}>• {risk}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs font-medium text-green-700 mb-1 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  機会
                </div>
                <ul className="text-xs text-gray-600 space-y-1">
                  {systemRecommendation.opportunities.map((opp, idx) => (
                    <li key={idx}>• {opp}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* 判定入力 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              判定入力
            </h3>
            
            <div className="flex space-x-3 mb-4">
              <button
                onClick={() => setSelectedDecision('approve')}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  selectedDecision === 'approve'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  承認
                </span>
              </button>
              <button
                onClick={() => setSelectedDecision('hold')}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  selectedDecision === 'hold'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Pause className="w-4 h-4" />
                  保留
                </span>
              </button>
              <button
                onClick={() => setSelectedDecision('reject')}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  selectedDecision === 'reject'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <X className="w-4 h-4" />
                  却下
                </span>
              </button>
            </div>
            
            <textarea
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              placeholder="判定理由を入力..."
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            
            <button
              onClick={handleDecision}
              disabled={!selectedDecision}
              className={`mt-4 w-full py-3 rounded-lg font-medium transition-colors ${
                selectedDecision
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              判定を確定する
            </button>
          </div>
        </div>
        
        {/* 右側：類似ケース */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              類似ケース（CaseBook）
            </h3>
            
            <div className="space-y-3">
              {similarCases.map(caseItem => (
                <div key={caseItem.id} className="border rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{caseItem.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{caseItem.date}</div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {caseItem.similarity}%
                    </span>
                  </div>
                  
                  <div className="text-xs space-y-1">
                    <div>
                      <span className="text-gray-600">状況:</span>
                      <span className="ml-1">{caseItem.situation}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">判定:</span>
                      <span className="ml-1 font-medium text-green-600">{caseItem.decision}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">結果:</span>
                      <span className="ml-1">{caseItem.outcome}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 pt-2 border-t">
                    <div className="text-xs text-gray-700 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" />
                      {caseItem.keyLearning}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="mt-4 w-full text-xs px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2">
              <Search className="w-3 h-3" />
              更に類似ケースを検索
            </button>
          </div>
          
          {/* CaseBookステータス */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
            <div className="text-sm font-medium text-indigo-800 mb-2">
              <span className="flex items-center gap-1">
                <Search className="w-3 h-3" />
                CaseBook分析
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">類似ケース数:</span>
                <span className="font-medium">23件</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">承認率:</span>
                <span className="font-medium text-green-600">87%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">平均成功率:</span>
                <span className="font-medium">72%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ベクトルDB:</span>
                <span className="font-medium">pgvector</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}