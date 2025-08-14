import React, { useState } from 'react'

// パターン発見ダッシュボード（第3優先実装）
export function PatternDiscoveryDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter'>('month')
  const [selectedPhase, setSelectedPhase] = useState<'all' | 'LP検証' | 'MVP開発' | '収益化' | 'スケール'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCaseBook, setShowCaseBook] = useState(false)

  // モックデータ：高精度パターン
  const highAccuracyPatterns = [
    {
      id: 'pattern-1',
      name: 'LP高CVRパターン',
      phase: 'LP検証',
      accuracy: 92.3,
      samples: 234,
      consensusRate: 0.85,
      indicators: {
        cvr: '↗️',
        traffic: '↗️',
        bounce: '↘️',
        session_time: '↗️',
        page_views: '→'
      },
      description: 'CVR15%超えの成功パターン',
      recommendation: 'このパターン検出時はMVP開発推奨'
    },
    {
      id: 'pattern-2',
      name: '収益化成功パターン',
      phase: '収益化',
      accuracy: 88.5,
      samples: 156,
      consensusRate: 0.78,
      indicators: {
        mrr: '↗️',
        ltv_cac: '↗️',
        retention: '→',
        churn: '↘️',
        dau: '↗️'
      },
      description: 'LTV/CAC > 3.0達成パターン',
      recommendation: 'スケール投資を検討'
    },
    {
      id: 'pattern-3',
      name: 'MVP継続率向上',
      phase: 'MVP開発',
      accuracy: 85.2,
      samples: 189,
      consensusRate: 0.82,
      indicators: {
        retention_d7: '↗️',
        activation: '↗️',
        feature_usage: '↗️',
        support_tickets: '↘️',
        nps: '↗️'
      },
      description: '7日継続率60%超えパターン',
      recommendation: '有料化タイミング'
    }
  ]

  // 失敗パターン
  const failurePatterns = [
    {
      id: 'fail-1',
      name: 'LP離脱パターン',
      phase: 'LP検証',
      accuracy: 15.2,  // 成功率が低い
      samples: 89,
      consensusRate: 0.45,
      indicators: {
        cvr: '↘️',
        bounce: '↗️',
        session_time: '↘️',
        page_views: '↘️',
        traffic: '→'
      },
      description: '直帰率80%超えの危険パターン',
      avoidanceStrategy: 'LPコピーの見直し、ターゲティング再検討'
    },
    {
      id: 'fail-2',
      name: 'チャーン急増パターン',
      phase: '収益化',
      accuracy: 22.4,
      samples: 67,
      consensusRate: 0.38,
      indicators: {
        churn: '↗️',
        support_tickets: '↗️',
        feature_usage: '↘️',
        nps: '↘️',
        mrr: '↘️'
      },
      description: '月次解約率20%超えの危機',
      avoidanceStrategy: 'カスタマーサクセス強化、機能改善'
    }
  ]

  // 精度推移データ
  const accuracyTrend = [
    { date: '1月', overall: 72.3, lp: 78.2, mvp: 68.5, revenue: 71.0 },
    { date: '2月', overall: 74.8, lp: 80.1, mvp: 70.2, revenue: 73.5 },
    { date: '3月', overall: 76.5, lp: 82.3, mvp: 71.8, revenue: 75.2 },
    { date: '4月', overall: 78.9, lp: 85.0, mvp: 74.5, revenue: 77.8 },
    { date: '5月', overall: 81.2, lp: 87.3, mvp: 77.0, revenue: 79.5 },
    { date: '6月', overall: 82.3, lp: 88.5, mvp: 79.2, revenue: 81.7 }
  ]

  // 改善提案
  const improvements = [
    {
      id: 'imp-1',
      title: 'CVR閾値の調整',
      currentValue: '10%',
      proposedValue: '12%',
      expectedImprovement: '+5.2%',
      impact: 'high',
      description: 'LP検証フェーズでのCVR判定基準を引き上げ'
    },
    {
      id: 'imp-2',
      title: '低一致率時のエントリー制限',
      currentValue: 'なし',
      proposedValue: '50%未満を除外',
      expectedImprovement: 'リスク-30%',
      impact: 'medium',
      description: 'インジケーター一致率が低い場合の自動判断を抑制'
    },
    {
      id: 'imp-3',
      title: '失敗パターンの自動検出',
      currentValue: '手動',
      proposedValue: '自動アラート',
      expectedImprovement: '対応速度2倍',
      impact: 'high',
      description: '危険パターン検出時に即座にアラート発報'
    }
  ]

  const PatternCard = ({ pattern, type }: { pattern: any, type: 'success' | 'failure' }) => {
    const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50'
    const borderColor = type === 'success' ? 'border-green-200' : 'border-red-200'
    const accuracyColor = type === 'success' ? 'text-green-600' : 'text-red-600'

    return (
      <div className={`${bgColor} border ${borderColor} rounded-lg p-4 mb-3`}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-semibold text-gray-900">{pattern.name}</h4>
            <p className="text-xs text-gray-600 mt-1">{pattern.description}</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${accuracyColor}`}>
              {pattern.accuracy.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">{pattern.samples}件</div>
          </div>
        </div>

        {/* インジケーター表示 */}
        <div className="flex flex-wrap gap-1 mb-3">
          {Object.entries(pattern.indicators).map(([key, value]) => (
            <span key={key} className="text-xs bg-white rounded px-2 py-1">
              {key}: <span className="text-lg">{value as string}</span>
            </span>
          ))}
        </div>

        {/* 一致率バー */}
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs text-gray-600">一致率:</span>
          <div className="flex-1 h-2 bg-gray-200 rounded">
            <div 
              className={`h-2 rounded ${
                pattern.consensusRate >= 0.75 ? 'bg-green-500' :
                pattern.consensusRate >= 0.5 ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              style={{ width: `${pattern.consensusRate * 100}%` }}
            />
          </div>
          <span className="text-xs font-bold">{(pattern.consensusRate * 100).toFixed(0)}%</span>
        </div>

        {/* 推奨アクション */}
        <div className={`text-xs ${type === 'success' ? 'text-green-700' : 'text-red-700'} font-medium`}>
          {type === 'success' ? `💡 ${pattern.recommendation}` : `⚠️ ${pattern.avoidanceStrategy}`}
        </div>

        {/* アクションボタン */}
        {type === 'success' && (
          <button className="mt-2 text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
            このパターンを適用
          </button>
        )}
      </div>
    )
  }

  const AccuracyChart = () => {
    const maxValue = 100
    
    return (
      <div className="bg-white rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-4">予測精度の推移</h3>
        
        {/* 簡易チャート */}
        <div className="h-48 flex items-end space-x-2">
          {accuracyTrend.map((month, index) => (
            <div key={month.date} className="flex-1 flex flex-col items-center">
              <div className="w-full space-y-1 flex flex-col-reverse">
                <div 
                  className="bg-blue-500 rounded-t"
                  style={{ height: `${(month.overall / maxValue) * 180}px` }}
                />
              </div>
              <span className="text-xs text-gray-600 mt-2">{month.date}</span>
              <span className="text-xs font-bold">{month.overall.toFixed(1)}%</span>
            </div>
          ))}
        </div>

        {/* 現在の精度 */}
        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="text-xs text-gray-500">全体</div>
              <div className="text-lg font-bold text-blue-600">82.3%</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">LP検証</div>
              <div className="text-lg font-bold">88.5%</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">MVP開発</div>
              <div className="text-lg font-bold">79.2%</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">収益化</div>
              <div className="text-lg font-bold">81.7%</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const ImprovementCard = ({ improvement }: { improvement: any }) => {
    const impactColor = 
      improvement.impact === 'high' ? 'bg-red-100 text-red-800' :
      improvement.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
      'bg-green-100 text-green-800'

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{improvement.title}</h4>
            <p className="text-xs text-gray-600 mt-1">{improvement.description}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded ${impactColor} font-medium`}>
            {improvement.impact.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <div>
            <span className="text-gray-500">現在:</span>
            <span className="ml-1 font-medium">{improvement.currentValue}</span>
          </div>
          <span className="text-gray-400">→</span>
          <div>
            <span className="text-gray-500">提案:</span>
            <span className="ml-1 font-medium text-blue-600">{improvement.proposedValue}</span>
          </div>
          <div className="ml-auto">
            <span className="font-bold text-green-600">{improvement.expectedImprovement}</span>
          </div>
        </div>

        <button className="mt-2 text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
          詳細を見る
        </button>
      </div>
    )
  }

  // CaseBook検索結果（モック）
  const caseBookResults = [
    {
      id: 'case-1',
      title: 'AI議事録サービスのLP検証成功事例',
      phase: 'LP検証',
      date: '2024-11-15',
      situation: 'CVR 8% → 18%への急上昇',
      action: 'LPコピー最適化 + Google広告ターゲティング調整',
      outcome: 'MVP開発決定、初月MRR 120万円達成',
      similarity: 92,
      tags: ['B2B', 'AI', '生産性向上'],
      learnings: [
        '「会議時間削減」より「意思決定の質向上」が刺さる',
        '初期ターゲットは中小企業よりスタートアップ',
        '無料トライアル14日間が最適'
      ]
    },
    {
      id: 'case-2',
      title: '家計簿アプリのチャーン率改善',
      phase: '収益化',
      date: '2024-10-22',
      situation: '月次解約率 15% → 5%',
      action: 'オンボーディング改善 + カスタマーサクセス強化',
      outcome: 'LTV 3倍改善、MRR +40%',
      similarity: 85,
      tags: ['B2C', 'フィンテック', 'リテンション'],
      learnings: [
        '最初の7日間の体験が継続率を左右',
        'プッシュ通知は週次レポート時のみ有効',
        '家族共有機能がロックイン要因'
      ]
    },
    {
      id: 'case-3',
      title: 'ペット管理アプリのピボット成功',
      phase: 'MVP開発',
      date: '2024-09-08',
      situation: '初期コンセプト「ペット健康管理」からピボット',
      action: '「ペットシッターマッチング」へ方向転換',
      outcome: 'CVR 4% → 11%、有料転換率15%',
      similarity: 78,
      tags: ['C2C', 'マーケットプレイス', 'ピボット'],
      learnings: [
        '「管理」より「つながり」が価値',
        '両面市場の立ち上げは供給側から',
        'マッチング手数料が収益源'
      ]
    }
  ]

  // CaseBook検索コンポーネント
  const CaseBookSearch = () => {
    return (
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">📚 CaseBookナレッジベース</h3>
            <p className="text-sm text-gray-600 mt-1">NEON/pgvectorを活用した類似ケース検索</p>
          </div>
          <button
            onClick={() => setShowCaseBook(!showCaseBook)}
            className="text-sm px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            {showCaseBook ? '閉じる' : '検索を開く'}
          </button>
        </div>
        
        {showCaseBook && (
          <div className="space-y-4">
            {/* 検索バー */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="状況、課題、フェーズで検索..."
                className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* 検索結果 */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {caseBookResults.map(caseItem => (
                <div key={caseItem.id} className="bg-white rounded-lg p-4 border border-indigo-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{caseItem.title}</h4>
                      <div className="flex items-center space-x-3 mt-1 text-xs text-gray-600">
                        <span className="px-2 py-0.5 bg-gray-100 rounded">{caseItem.phase}</span>
                        <span>{caseItem.date}</span>
                        <span className="text-indigo-600 font-medium">類似度: {caseItem.similarity}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="text-gray-600">状況:</span>
                      <span className="ml-2">{caseItem.situation}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">アクション:</span>
                      <span className="ml-2">{caseItem.action}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">結果:</span>
                      <span className="ml-2 font-medium text-green-600">{caseItem.outcome}</span>
                    </div>
                  </div>
                  
                  {/* 学び */}
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-xs font-medium text-gray-700 mb-1">💡 主要な学び:</div>
                    <ul className="text-xs text-gray-600 space-y-0.5">
                      {caseItem.learnings.map((learning, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-1">•</span>
                          <span>{learning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* タグ */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {caseItem.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <button className="mt-3 text-xs px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                    このケースを参考にする
                  </button>
                </div>
              ))}
            </div>
            
            {/* RAGステータス */}
            <div className="bg-indigo-100 rounded-lg p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-indigo-700">
                  🤖 RAGシステム: アクティブ
                </span>
                <span className="text-indigo-600">
                  ベクトルDB: 2,847件 | 平均類似度: 85%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🧠 学習分析ダッシュボード</h2>
          <p className="text-sm text-gray-600 mt-1">パターン発見と精度向上の可視化</p>
        </div>
        
        {/* フィルター */}
        <div className="flex space-x-2">
          <select 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="text-sm border rounded px-3 py-1"
          >
            <option value="week">過去1週間</option>
            <option value="month">過去1ヶ月</option>
            <option value="quarter">過去3ヶ月</option>
          </select>
          
          <select
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value as any)}
            className="text-sm border rounded px-3 py-1"
          >
            <option value="all">全フェーズ</option>
            <option value="LP検証">LP検証</option>
            <option value="MVP開発">MVP開発</option>
            <option value="収益化">収益化</option>
            <option value="スケール">スケール</option>
          </select>
        </div>
      </div>
      
      {/* CaseBook検索セクション */}
      <CaseBookSearch />

      {/* メイングリッド */}
      <div className="grid grid-cols-3 gap-6">
        {/* 成功パターン */}
        <div>
          <div className="bg-green-100 rounded-lg px-4 py-3 mb-4">
            <h3 className="font-bold text-green-800">✅ 高精度パターン</h3>
            <p className="text-xs text-green-700 mt-1">精度80%以上の成功パターン</p>
          </div>
          <div className="space-y-3">
            {highAccuracyPatterns.map(pattern => (
              <PatternCard key={pattern.id} pattern={pattern} type="success" />
            ))}
          </div>
        </div>

        {/* 精度推移 */}
        <div>
          <AccuracyChart />
          
          {/* バックテスト結果サマリー */}
          <div className="bg-white rounded-lg p-4 mt-4">
            <h3 className="font-semibold text-gray-900 mb-3">バックテスト結果</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">総サンプル数:</span>
                <span className="font-bold">2,847件</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">高一致率時の精度:</span>
                <span className="font-bold text-green-600">91.2%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">中一致率時の精度:</span>
                <span className="font-bold text-yellow-600">72.4%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">低一致率時の精度:</span>
                <span className="font-bold text-red-600">48.3%</span>
              </div>
              <div className="pt-2 border-t">
                <button className="w-full text-sm px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  詳細レポートを見る
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 改善提案と失敗パターン */}
        <div>
          {/* 改善提案 */}
          <div className="bg-blue-100 rounded-lg px-4 py-3 mb-4">
            <h3 className="font-bold text-blue-800">💡 改善提案</h3>
            <p className="text-xs text-blue-700 mt-1">精度向上のための推奨事項</p>
          </div>
          <div className="space-y-3 mb-6">
            {improvements.map(improvement => (
              <ImprovementCard key={improvement.id} improvement={improvement} />
            ))}
          </div>

          {/* 失敗パターン */}
          <div className="bg-red-100 rounded-lg px-4 py-3 mb-4">
            <h3 className="font-bold text-red-800">⚠️ 要注意パターン</h3>
            <p className="text-xs text-red-700 mt-1">回避すべき失敗パターン</p>
          </div>
          <div className="space-y-3">
            {failurePatterns.map(pattern => (
              <PatternCard key={pattern.id} pattern={pattern} type="failure" />
            ))}
          </div>
        </div>
      </div>

      {/* アクションバー */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">🚀 プレイブック自動チューニング</h3>
            <p className="text-sm opacity-90 mt-1">
              現在の精度: 82.3% → 提案適用後: 87.5% (期待値)
            </p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors">
              A/Bテスト開始
            </button>
            <button className="px-4 py-2 bg-white text-purple-600 rounded hover:bg-gray-100 transition-colors font-medium">
              チューニング適用
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}