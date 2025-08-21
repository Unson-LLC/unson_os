import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, BarChart3, Brain, AlertTriangle, CheckCircle, Clock, Users, Target, TrendingUp, TrendingDown, Zap, Search, Settings, FileText, Rocket, Shield } from 'lucide-react';
import { Link, useParams } from "react-router-dom";
const EventDetail = ()=>{
    const { id } = useParams();
    const [selectedAction, setSelectedAction] = useState<string | null>(null);
    const eventData = {
        date: "2025/08/21",
        time: "20:30",
        title: "詳細分析",
        aiEvaluation: {
            grade: "C++",
            status: "改善必要",
            improvements: [
                "LP価格セクション見直し",
                "モバイルフォーム最適化",
                "競合差別化コンテンツ強化"
            ],
            actions: [
                {
                    priority: "緊急",
                    action: "競合対抗LP作成",
                    timeframe: "今すぐ実行",
                    color: "red",
                    status: "緊急"
                },
                {
                    priority: "緊急",
                    action: "モバイルフォーム修正",
                    timeframe: "3時間後",
                    color: "red",
                    status: "緊急"
                },
                {
                    priority: "中期",
                    action: "価格セクション A/Bテスト開始",
                    timeframe: "明日",
                    color: "yellow",
                    status: "中期"
                },
                {
                    priority: "長期",
                    action: "競合監視アルゴリズム強化",
                    timeframe: "1週間後",
                    color: "green",
                    status: "長期"
                }
            ],
            confidence: 89,
            reason: "競合会社の新キャンペーン開始による価格競争"
        },
        basicMetrics: {
            cvr: {
                value: 12.8,
                change: -1.7,
                status: "down"
            },
            cpl: {
                value: "N/A",
                change: null,
                status: "neutral"
            },
            visitors: {
                value: 156,
                change: 11.0,
                status: "up"
            },
            conversions: {
                value: 20,
                change: null,
                status: "neutral"
            }
        },
        actionDetails: [
            {
                time: "11:31",
                action: "LP到達",
                users: 45,
                rate: "ランディング",
                analysis: "正常"
            },
            {
                time: "11:33",
                action: "ヒーロー注視",
                users: 43,
                rate: "メインビジュアル",
                analysis: "良好な引き込み"
            },
            {
                time: "11:35",
                action: "課題セクション",
                users: 38,
                rate: "問題提起",
                analysis: "離脱多発",
                warning: true
            },
            {
                time: "11:37",
                action: "解決策確認",
                users: 32,
                rate: "ソリューション",
                analysis: "通常レベル"
            },
            {
                time: "11:39",
                action: "価格FAQ閲覧",
                users: 28,
                rate: "価格詳細",
                analysis: "価格懸念",
                critical: true
            },
            {
                time: "11:41",
                action: "フォーム到達",
                users: 25,
                rate: "アクション",
                analysis: "やや低い"
            },
            {
                time: "11:43",
                action: "フォーム完了",
                users: 20,
                rate: "コンバージョン",
                analysis: "要改善",
                critical: true
            }
        ],
        aiActions: [
            {
                title: "競合対抗LP作成",
                description: "競合の価格攻勢に対抗するLP変更",
                impact: "CVR+2.1%",
                action: "今すぐ実行",
                color: "blue"
            },
            {
                title: "モバイルフォーム修正",
                description: "iPhone13以降の表示問題修正",
                impact: "CVR+1.8%",
                action: "3時間後",
                color: "blue"
            },
            {
                title: "価格セクション A/Bテスト開始",
                description: "価格訴求方法の最適化テスト",
                impact: "CVR+1.2%",
                action: "明日",
                color: "blue"
            },
            {
                title: "競合監視アルゴリズム強化",
                description: "競合キャンペーン検知の精度向上",
                impact: "予防効果",
                action: "1週間後",
                color: "blue"
            }
        ]
    };
    const getStatusColor = (status: string)=>{
        switch(status){
            case 'up':
                return 'text-green-600';
            case 'down':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };
    const getStatusIcon = (status: string)=>{
        switch(status){
            case 'up':
                return <TrendingUp className="w-4 h-4" data-spec-id="GM1M1J7wvSQxBg3v"/>;
            case 'down':
                return <TrendingDown className="w-4 h-4" data-spec-id="a5VufL2gn5MEbzgo"/>;
            default:
                return null;
        }
    };
    const getPriorityColor = (priority: string)=>{
        switch(priority){
            case '緊急':
                return 'bg-red-100 text-red-800 border-red-200';
            case '中期':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case '長期':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
    return (<div className="min-h-screen bg-gray-50" data-spec-id="event-detail-page">
      {}
      <div className="bg-white border-b border-gray-200" data-spec-id="page-header">
        <div className="max-w-7xl mx-auto px-6 py-4" data-spec-id="kBIXJBM4EbPjlnkO">
          <div className="flex items-center space-x-4" data-spec-id="mhYXCEYBqvmrmgSo">
            <Link to="/position-management" data-spec-id="p7AD1mnFMN0Y5Yxs">
              <Button variant="ghost" size="sm" data-spec-id="back-btn">
                <ArrowLeft className="w-4 h-4 mr-2" data-spec-id="pGOv8OGIE4q20TQf"/>
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-gray-900" data-spec-id="event-title">
              {eventData.date} {eventData.time} {eventData.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6" data-spec-id="hfrw6w8T5OEYAzIq">
        {}
        <Card className="bg-white border border-gray-200" data-spec-id="ai-evaluation-card">
          <CardHeader className="bg-blue-50 border-b border-blue-200" data-spec-id="pLhkzOpOa1wMScul">
            <div className="flex items-center space-x-3" data-spec-id="3gZMnptZSqpJUIUe">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center" data-spec-id="JvS2IlpnsXjwNUZt">
                <Brain className="w-4 h-4 text-white" data-spec-id="yKOOb6lInWNzNhuc"/>
              </div>
              <CardTitle className="text-lg font-semibold text-gray-900" data-spec-id="ai-evaluation-title">
                AI総評・推奨アクション
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6" data-spec-id="8MVVVRIJXobmFYxo">
            {}
            <div className="bg-gray-50 rounded-lg p-4 mb-6" data-spec-id="performance-evaluation">
              <div className="flex items-center space-x-3 mb-4" data-spec-id="cN7bSaOsDKw4rs17">
                <BarChart3 className="w-5 h-5 text-blue-600" data-spec-id="ePtK7gC3vSYoOn9n"/>
                <h3 className="font-semibold text-lg text-gray-900" data-spec-id="fEAtRjaHDd142Ns0">
                  パフォーマンス評価: {eventData.aiEvaluation.grade} ({eventData.aiEvaluation.status})
                </h3>
              </div>
              
              <div className="space-y-3 mb-4" data-spec-id="improvement-items">
                <h4 className="font-medium text-gray-900" data-spec-id="GFqqIz5RU9dvHu9N">【改善推奨事項】</h4>
                <ul className="space-y-2" data-spec-id="jTQ3499nbUVtVzCC">
                  {eventData.aiEvaluation.improvements.map((improvement, index)=>(<li key={index} className="flex items-center text-gray-700" data-spec-id="x294ezal6FfethFz">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3" data-spec-id="ljvtfFBfE0xtbDrF"></div>
                      {improvement}
                    </li>))}
                </ul>
              </div>

              <div className="space-y-3" data-spec-id="recommended-actions">
                <h4 className="font-medium text-gray-900" data-spec-id="zihVASK4g68GFKqA">【推奨対応策】</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3" data-spec-id="jGO1b61AKSrZNjsG">
                  {eventData.aiEvaluation.actions.map((action, index)=>(<div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200" data-spec-id="J5MX5u8nDq75Nn35">
                      <div className="flex items-center space-x-3" data-spec-id="HuMVCtORGJkSqu5i">
                        <div className={`w-3 h-3 rounded-full ${action.color === 'red' ? 'bg-red-500' : action.color === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'}`} data-spec-id="2Yu16119Aj4AyY2Z"></div>
                        <span className="text-sm text-gray-700" data-spec-id="vOt93MciAVaRv1D0">{action.action}</span>
                      </div>
                      <Badge className={getPriorityColor(action.status)} data-spec-id="YwdusaJz8Ne1fZVQ">
                        {action.status}
                      </Badge>
                    </div>))}
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200" data-spec-id="confidence-section">
                <div className="flex items-center justify-between mb-2" data-spec-id="JOV1heTl9ixFuyPq">
                  <span className="text-sm font-medium text-blue-900" data-spec-id="zu40KAuznSZbWcCO">【信頼度】</span>
                  <span className="text-lg font-bold text-blue-900" data-spec-id="sDdo5tjYgmFyQe6w">{eventData.aiEvaluation.confidence}% (高い)</span>
                </div>
                <div className="text-sm text-blue-800" data-spec-id="s8ifl0QfvipSCfBn">
                  根拠: {eventData.aiEvaluation.reason}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {}
        <Card className="bg-white border border-gray-200" data-spec-id="basic-metrics-card">
          <CardHeader className="bg-gray-50 border-b border-gray-200" data-spec-id="qYX5ZY0rsXHJ2AJx">
            <div className="flex items-center space-x-3" data-spec-id="PzVSP5re8bQMQmBs">
              <div className="w-6 h-6 bg-purple-500 rounded-md flex items-center justify-center" data-spec-id="HCDkVQq4OQ0n7tti">
                <BarChart3 className="w-3 h-3 text-white" data-spec-id="JKYOmTTTEDMRu0hd"/>
              </div>
              <CardTitle className="text-lg font-semibold text-gray-900" data-spec-id="basic-metrics-title">
                基本指標（前回比較）
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6" data-spec-id="8xE84238xwfdeuUc">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6" data-spec-id="metrics-grid">
              <div className="text-center" data-spec-id="cvr-metric">
                <div className="text-sm text-gray-600 mb-2" data-spec-id="adjkv89jddFxTw13">CVR</div>
                <div className="text-2xl font-bold text-gray-900 mb-1" data-spec-id="DZeIP5U2cj5POGxl">
                  {eventData.basicMetrics.cvr.value}%
                </div>
                {eventData.basicMetrics.cvr.change && (<div className={`flex items-center justify-center text-sm ${getStatusColor(eventData.basicMetrics.cvr.status)}`} data-spec-id="DpaFgAFZWJTzlxIZ">
                    {getStatusIcon(eventData.basicMetrics.cvr.status)}
                    <span className="ml-1" data-spec-id="dTpap7xzd0VrxdwT">{eventData.basicMetrics.cvr.change}</span>
                  </div>)}
              </div>

              <div className="text-center" data-spec-id="cpl-metric">
                <div className="text-sm text-gray-600 mb-2" data-spec-id="W7xH1Xx5ocBnWO8j">CPL</div>
                <div className="text-2xl font-bold text-gray-900 mb-1" data-spec-id="qKLukxmOAsUQiFts">
                  {eventData.basicMetrics.cpl.value}
                </div>
              </div>

              <div className="text-center" data-spec-id="visitors-metric">
                <div className="text-sm text-gray-600 mb-2" data-spec-id="jEjLvAmE0SDnK3hc">訪問者</div>
                <div className="text-2xl font-bold text-gray-900 mb-1" data-spec-id="Lt2DLaSlL1iaEH9S">
                  {eventData.basicMetrics.visitors.value}人
                </div>
                {eventData.basicMetrics.visitors.change && (<div className={`flex items-center justify-center text-sm ${getStatusColor(eventData.basicMetrics.visitors.status)}`} data-spec-id="nQrsz6XOlMWDgqSf">
                    {getStatusIcon(eventData.basicMetrics.visitors.status)}
                    <span className="ml-1" data-spec-id="nxgXIVYnpxWOVRhL">▲{eventData.basicMetrics.visitors.change}</span>
                  </div>)}
              </div>

              <div className="text-center" data-spec-id="conversions-metric">
                <div className="text-sm text-gray-600 mb-2" data-spec-id="bpos2pu9tfdTIcVc">成約</div>
                <div className="text-2xl font-bold text-gray-900 mb-1" data-spec-id="K4pfqPouLchW9BB2">
                  {eventData.basicMetrics.conversions.value}人
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-spec-id="ieyRgqdYxWFqMbkj">
          {}
          <Card className="bg-white border border-gray-200" data-spec-id="action-details-card">
            <CardHeader className="bg-gray-50 border-b border-gray-200" data-spec-id="iqATUZr4JswwaqSb">
              <div className="flex items-center space-x-3" data-spec-id="PSMrUafGCe2G7IDO">
                <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center" data-spec-id="6PqbyuUbe9184dJj">
                  <Search className="w-3 h-3 text-white" data-spec-id="kUdqQ1MR5fh7EMql"/>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900" data-spec-id="action-details-title">
                  行動詳細
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6" data-spec-id="yowHN2GLIiv7vY41">
              <div className="space-y-3" data-spec-id="action-list">
                {eventData.actionDetails.map((detail, index)=>(<div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg" data-spec-id="WFMN03DUxZg7SFwG">
                    <div className="flex items-center space-x-4" data-spec-id="65EswzgYShP0X625">
                      <span className="text-sm font-medium text-gray-900" data-spec-id="CDnDAaaAbrmbXWFq">{detail.time}</span>
                      <span className="text-sm text-gray-700" data-spec-id="ruq5Fyrb3Lpawpu7">{detail.action}</span>
                      <span className="text-sm text-gray-600" data-spec-id="cuYQEwYbqdqzWLMe">{detail.users}人</span>
                      <span className="text-sm text-blue-600" data-spec-id="0XQgOsMSpB824F7Y">{detail.rate}</span>
                    </div>
                    <div className="flex items-center" data-spec-id="I3INyiONsImu6iiF">
                      {detail.warning && (<Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs mr-2" data-spec-id="WXxOyBsdmCF6xboH">
                          ⚠ 離脱多発
                        </Badge>)}
                      {detail.critical && (<Badge className="bg-red-100 text-red-800 border-red-200 text-xs mr-2" data-spec-id="u1GeTAaWl7QCYsXb">
                          🔴 要改善
                        </Badge>)}
                      <span className={`text-sm ${detail.analysis === '正常' ? 'text-green-600' : detail.analysis.includes('良好') ? 'text-blue-600' : detail.analysis.includes('要改善') || detail.analysis.includes('価格懸念') ? 'text-red-600' : 'text-gray-600'}`} data-spec-id="P1IfqwwE5cq1Ey1j">
                        {detail.analysis}
                      </span>
                    </div>
                  </div>))}
              </div>
            </CardContent>
          </Card>

          {}
          <Card className="bg-white border border-gray-200" data-spec-id="ai-analysis-card">
            <CardHeader className="bg-red-50 border-b border-red-200" data-spec-id="Q1TGcMijlySECQ6K">
              <div className="flex items-center space-x-3" data-spec-id="e8AiTGUKzGfkQRWp">
                <div className="w-6 h-6 bg-red-500 rounded-md flex items-center justify-center" data-spec-id="Q3PjzDZZiWsCoF5J">
                  <Shield className="w-3 h-3 text-white" data-spec-id="tCDBpxBPzuRQ7ieo"/>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900" data-spec-id="ai-analysis-title">
                  AI異常検知・根本原因分析
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6" data-spec-id="u8Pxh4leLbyHJt1U">
              {}
              <div className="mb-6" data-spec-id="root-cause">
                <div className="flex items-center space-x-2 mb-3" data-spec-id="uklERAfj5HJKksiD">
                  <div className="w-3 h-3 bg-red-500 rounded-full" data-spec-id="VdYyTXnneX7FbOEQ"></div>
                  <h3 className="font-semibold text-gray-900" data-spec-id="VVlNLfDQQiudT2R8">根本原因</h3>
                </div>
                <div className="pl-5 border-l-3 border-red-500 py-2" data-spec-id="yRbit40nINXKiNdx">
                  <p className="text-gray-700" data-spec-id="ORA7OcAfxRpWdS6A">{eventData.aiEvaluation.reason}</p>
                </div>
              </div>

              {}
              <div data-spec-id="actionable-recommendations">
                <div className="flex items-center space-x-2 mb-4" data-spec-id="WD1EYV67AvPAgjNf">
                  <Zap className="w-4 h-4 text-blue-600" data-spec-id="PJLbQ62tZhGYJQlX"/>
                  <h3 className="font-semibold text-gray-900" data-spec-id="cJvpPpwzcCZjJ8vJ">AI推奨アクション（実行可能）</h3>
                </div>
                <div className="space-y-4" data-spec-id="G3vlyv5iWdvDFSri">
                  {eventData.aiActions.map((action, index)=>(<div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200" data-spec-id="8Adl1NpadBPaIoIo">
                      <div className="flex items-center justify-between mb-2" data-spec-id="PkQOyfJ7Z2oBeZ4g">
                        <h4 className="font-medium text-gray-900" data-spec-id="jPeavIP0eVhHW7XX">{action.title}</h4>
                        <div className="text-right" data-spec-id="Y5cJ2ZZ4jQdfTC2Q">
                          <div className="text-sm font-medium text-green-600" data-spec-id="JZbklkelPWEaV5Bq">{action.impact}</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3" data-spec-id="wgmLrgRNemQ8Y8fI">{action.description}</p>
                      <Button size="sm" className={`${action.title.includes('今すぐ') ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`} data-spec-id={`action-btn-${index}`}>
                        <Rocket className="w-3 h-3 mr-2" data-spec-id="NdrEpgGDSUKukYuv"/>
                        {action.action}
                      </Button>
                    </div>))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {}
        <div className="bg-purple-600 text-white rounded-lg p-4" data-spec-id="bottom-action-bar">
          <div className="flex items-center justify-between" data-spec-id="JRo8qTucmal0Kd6f">
            <div className="flex items-center space-x-4" data-spec-id="Z3lYLaieVf1AmCOu">
              <Button className="bg-purple-700 hover:bg-purple-800 text-white" data-spec-id="ai-accept-btn">
                <CheckCircle className="w-4 h-4 mr-2" data-spec-id="bdqIcn4hwUtql48L"/>
                <Brain className="w-4 h-4 mr-2" data-spec-id="NLT8UKM3Y12SReQa"/>
                AI提案を承認
              </Button>
              <Button variant="outline" className="border-purple-300 text-white hover:bg-purple-700" data-spec-id="manual-optimize-btn">
                <Settings className="w-4 h-4 mr-2" data-spec-id="F3ZWBOLlMdAcJ7aK"/>
                <Target className="w-4 h-4 mr-2" data-spec-id="bYV7B4NmzGV1VjjB"/>
                手動最適化
              </Button>
              <Button variant="outline" className="border-purple-300 text-white hover:bg-purple-700" data-spec-id="record-issue-btn">
                <FileText className="w-4 h-4 mr-2" data-spec-id="ISVAZ4yarmgeGyQK"/>
                <BarChart3 className="w-4 h-4 mr-2" data-spec-id="jkkImJFxtwiw70fH"/>
                課題を記録
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>);
};
export default EventDetail;
