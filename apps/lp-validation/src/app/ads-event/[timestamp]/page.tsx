// Google Ads 4時間窓イベント詳細ページ
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ArrowLeft, TrendingUp, TrendingDown, BarChart3, Clock, 
  Brain, Target, Zap, AlertTriangle, CheckCircle
} from 'lucide-react';
import { analyzeAdsPerformance, generateOptimizationActions } from '../utils/aiOptimizer';

export default function AdsEventDetailPage() {
  const params = useParams();
  const timestamp = params.timestamp as string;
  const [adsData, setAdsData] = useState<any>({});
  const [optimization, setOptimization] = useState<any>({});
  
  useEffect(() => {
    // ベタ書きモックデータ
    const mockCurrentWindow = {
      timestamp: timestamp,
      impressions: 2285,
      clicks: 108,
      cost: 4083,
      conversions: 7,
      keywords: [
        { keyword: 'AI コーチ 無料', impressions: 850, clicks: 42, cost: 1580, cvr: 9.5 },
        { keyword: 'キャリア 相談', impressions: 720, clicks: 38, cost: 1420, cvr: 7.9 },
        { keyword: 'AI 転職', impressions: 450, clicks: 18, cost: 680, cvr: 5.6 },
        { keyword: 'コーチング 安い', impressions: 265, clicks: 10, cost: 403, cvr: 3.0 }
      ]
    };
    
    const mockPreviousWindow = {
      timestamp: '2025-08-28 00:00',
      impressions: 2040, 
      clicks: 98,
      cost: 3706,
      conversions: 4
    };
    
    setAdsData(mockCurrentWindow);
    
    // AI分析実行
    const analysis = analyzeAdsPerformance(mockCurrentWindow, mockPreviousWindow);
    const actions = generateOptimizationActions(analysis);
    
    setOptimization({
      analysis,
      actions,
      executedAt: '2025-08-28 16:15',
      status: 'completed',
      results: [
        { action: 'キーワード停止', target: 'コーチング 安い', impact: 'CPC -12%' },
        { action: '入札調整', target: 'AI コーチ 無料', impact: 'CTR +5%' },
        { action: '広告文テスト', target: 'キャリア相談向け', impact: 'CVR +8%' }
      ]
    });
  }, [timestamp]);
  
  const ctr = adsData.clicks ? ((adsData.clicks / adsData.impressions) * 100).toFixed(1) : '0.0';
  const cvr = adsData.clicks ? ((adsData.conversions / adsData.clicks) * 100).toFixed(1) : '0.0';
  const cpc = adsData.clicks ? Math.round(adsData.cost / adsData.clicks) : 0;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/position/WATASHI-COMPASS">
                <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:border-gray-300 text-gray-700 flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  ポジション詳細へ戻る
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Google Ads 4時間窓詳細
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  WATASHI-COMPASS - {timestamp}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* 4時間窓パフォーマンス */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="bg-gray-50 border-b border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-red-500 rounded-md flex items-center justify-center">
                <BarChart3 className="w-3 h-3 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                4時間窓パフォーマンス
              </h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">インプレッション</span>
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold">{adsData.impressions?.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">前窓比: +12%</div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">クリック数</span>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold">{adsData.clicks}</div>
                <div className="text-xs text-gray-500 mt-1">CTR: {ctr}%</div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">コスト</span>
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-2xl font-bold">¥{adsData.cost?.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">CPC: ¥{cpc}</div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">コンバージョン</span>
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-2xl font-bold">{adsData.conversions}</div>
                <div className="text-xs text-gray-500 mt-1">CVR: {cvr}%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI分析結果 */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="bg-gray-50 border-b border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-md flex items-center justify-center">
                  <Brain className="w-3 h-3 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  AI分析・自動最適化
                </h2>
              </div>
            </div>
            <div className="p-6">
              {optimization.analysis && (
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">パフォーマンス変化</h4>
                    <div className="text-xs space-y-1">
                      <div>CTR: {optimization.analysis.ctr.current}% ({optimization.analysis.ctr.change > 0 ? '+' : ''}{optimization.analysis.ctr.change}%)</div>
                      <div>CVR: {optimization.analysis.cvr.current}% ({optimization.analysis.cvr.change > 0 ? '+' : ''}{optimization.analysis.cvr.change}%)</div>
                      <div>CPC: ¥{optimization.analysis.cpc.current} ({optimization.analysis.cpc.change > 0 ? '+' : ''}{optimization.analysis.cpc.change}%)</div>
                    </div>
                  </div>
                  
                  {optimization.analysis.issues.length > 0 && (
                    <div className="bg-yellow-50 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-yellow-900 mb-2">検出された問題</h4>
                      <ul className="text-xs text-yellow-800 space-y-1">
                        {optimization.analysis.issues.map((issue: string, index: number) => (
                          <li key={index} className="flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="bg-green-50 rounded-lg p-3">
                    <h4 className="text-sm font-medium text-green-900 mb-2 flex items-center">
                      <Zap className="w-3 h-3 mr-1" />
                      実行された最適化
                    </h4>
                    <div className="text-xs text-green-800 space-y-2">
                      {optimization.results.map((result: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded border border-green-200">
                          <div className="flex items-center">
                            <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                            <span>{result.action}</span>
                          </div>
                          <div className="text-xs text-gray-600">
                            {result.target} → {result.impact}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* キーワードパフォーマンス */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="bg-gray-50 border-b border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center">
                  <Target className="w-3 h-3 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  キーワード詳細
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {adsData.keywords?.map((kw: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{kw.keyword}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        kw.cvr > 8 ? 'bg-green-100 text-green-800' :
                        kw.cvr > 5 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        CVR {kw.cvr}%
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs text-gray-600">
                      <div>Imp: {kw.impressions}</div>
                      <div>Clk: {kw.clicks}</div>
                      <div>Cost: ¥{kw.cost}</div>
                      <div>CPC: ¥{Math.round(kw.cost / kw.clicks)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}