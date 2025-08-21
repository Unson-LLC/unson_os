import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, Clock, RefreshCw, Calendar, Users, Target, AlertTriangle, Brain, ChevronDown, ExternalLink, Sparkles, Activity } from 'lucide-react';
import { Link } from "react-router-dom";
const PositionDetail = ()=>{
    const [activeTimeRange, setActiveTimeRange] = useState('4h');
    const positionData = {
        name: "AI-COACH",
        subtitle: "個別ポジション分析・時系列管理",
        status: "active",
        overview: {
            cvr: 15.2,
            cvrPrevious: 12.6,
            cpl: 180,
            cplNote: "コスト良好",
            leads: 125,
            leadsNote: "累計リード数",
            grade: "A+",
            gradeNote: "スコア: 92/100"
        },
        aiAnalysis: {
            recommendation: "MVP移行を強く推奨、全指標が目標を上回る",
            details: "MVP移行を強く推奨、全指標が目標を上回る"
        },
        trend: {
            direction: "up",
            label: "順調↑"
        },
        currentStatus: "録画中",
        lastUpdate: "2025/8/15"
    };
    const actionLogs = [
        {
            time: "15:30",
            cvr: 15.2,
            sessions: 89,
            cpl: 180,
            optimization: "最適化: キーワード3件削除 → CPL-¥25",
            ai: "AI: 最適化改善項目登録済み、トレンド継続調査"
        },
        {
            time: "11:30",
            cvr: 12.8,
            sessions: 156,
            cpl: 205,
            optimization: "最適化: 入札調整実行",
            ai: "AI: 競合影響の可能性向、価格許容性を提案"
        }
    ];
    const userFlow = [
        {
            stage: "Google広告",
            count: 1247,
            percentage: 100,
            change: -58,
            changePercentage: -4.7
        },
        {
            stage: "ヒーロー",
            count: 1189,
            percentage: 95.3,
            change: -297,
            changePercentage: -23.8
        },
        {
            stage: "価値提案",
            count: 892,
            percentage: 71.5,
            change: -471,
            changePercentage: -37.8
        },
        {
            stage: "フォーム",
            count: 421,
            percentage: 33.7,
            change: null,
            changePercentage: null,
            isConversion: true
        }
    ];
    const performanceSummary = [
        {
            title: "本日のCVR改善",
            value: "+2.3%",
            color: "text-green-600",
            bgColor: "bg-green-50"
        },
        {
            title: "週間平均CVR",
            value: "8.5%",
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            title: "月間リード数",
            value: "12,847",
            color: "text-purple-600",
            bgColor: "bg-purple-50"
        },
        {
            title: "ROI",
            value: "247%",
            color: "text-orange-600",
            bgColor: "bg-orange-50"
        }
    ];
    return (<div className="min-h-screen bg-gray-50" data-spec-id="position-detail-page">
      {}
      <div className="bg-white border-b border-gray-200" data-spec-id="page-header">
        <div className="max-w-7xl mx-auto px-6 py-4" data-spec-id="IcUspIh9CFndJDV6">
          <div className="flex items-center justify-between" data-spec-id="j6L83jDiLGSk6r2s">
            <div className="flex items-center space-x-4" data-spec-id="header-left">
              <Link to="/position-management" data-spec-id="6kLUzumiAgy1EHXq">
                <Button variant="ghost" size="sm" data-spec-id="back-to-positions-btn">
                  <ArrowLeft className="w-4 h-4 mr-2" data-spec-id="tcJ0gMytZCGSko8C"/>
                  ダッシュボード
                </Button>
              </Link>
              <div data-spec-id="NJH0JJcty70A0bfP">
                <h1 className="text-2xl font-semibold text-gray-900" data-spec-id="position-title">
                  {positionData.name} ポジション詳細
                </h1>
                <p className="text-sm text-gray-600 mt-1" data-spec-id="position-subtitle">
                  {positionData.subtitle}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3" data-spec-id="header-actions">
              <Button variant="outline" size="sm" data-spec-id="refresh-btn">
                <RefreshCw className="w-4 h-4" data-spec-id="75UXb6HOiKQ5kJqi"/>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6" data-spec-id="EV379WUr9ZStu9PH">
        {}
        <Card className="bg-white border border-gray-200" data-spec-id="position-overview">
          <CardHeader className="bg-gray-50 border-b border-gray-200" data-spec-id="G7U7e8dko2XOgghl">
            <div className="flex items-center space-x-3" data-spec-id="RfKgfI1P2iXrfD0J">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md flex items-center justify-center" data-spec-id="nEDwfZrgCdFh22uL">
                <BarChart3 className="w-3 h-3 text-white" data-spec-id="pyseDdKZOb65lC6K"/>
              </div>
              <CardTitle className="text-lg font-semibold text-gray-900" data-spec-id="overview-title">
                ポジション概要
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6" data-spec-id="h3b6CcrUojdKSplg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6" data-spec-id="overview-metrics">
              {}
              <div className="space-y-2" data-spec-id="cvr-overview">
                <div className="flex items-center justify-between" data-spec-id="xPDYcNjltWMfUKO5">
                  <span className="text-sm text-gray-600" data-spec-id="X351m06Kk6tKVU4g">CVR</span>
                </div>
                <div className="text-3xl font-bold text-green-600" data-spec-id="FKSzAKNPXZbfFcIe">{positionData.overview.cvr}%</div>
                <div className="text-xs text-gray-500" data-spec-id="40z2gEwATcjScAmX">前日比: {positionData.overview.cvrPrevious}%</div>
              </div>

              {}
              <div className="space-y-2" data-spec-id="cpl-overview">
                <div className="flex items-center justify-between" data-spec-id="InGarMu5oBpNKVmZ">
                  <span className="text-sm text-gray-600" data-spec-id="TCBajamNiGZaKIyF">CPL</span>
                </div>
                <div className="text-3xl font-bold text-gray-900" data-spec-id="N7DQEf3d9J85Aekd">¥{positionData.overview.cpl}</div>
                <div className="text-xs text-gray-500" data-spec-id="zVJSU2BQPVTgn57v">{positionData.overview.cplNote}</div>
              </div>

              {}
              <div className="space-y-2" data-spec-id="leads-overview">
                <div className="flex items-center justify-between" data-spec-id="c9rmL560m4gwP7we">
                  <span className="text-sm text-gray-600" data-spec-id="e0cdgwAdOCprfcxl">リード数</span>
                </div>
                <div className="text-3xl font-bold text-gray-900" data-spec-id="0qRJl9v9JYpCeQSj">{positionData.overview.leads}</div>
                <div className="text-xs text-gray-500" data-spec-id="Jk0wb127z5WrXr4u">{positionData.overview.leadsNote}</div>
              </div>

              {}
              <div className="space-y-2" data-spec-id="grade-overview">
                <div className="flex items-center justify-between" data-spec-id="OBwCBwwKDF2QmqVK">
                  <span className="text-sm text-gray-600" data-spec-id="5kxcLuXTSlwRFDxy">品質</span>
                </div>
                <div className="text-3xl font-bold text-blue-600" data-spec-id="BO6UZX6gEa10ioGl">{positionData.overview.grade}</div>
                <div className="text-xs text-gray-500" data-spec-id="vepz1FLkijtVHTjf">{positionData.overview.gradeNote}</div>
              </div>
            </div>

            {}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200" data-spec-id="ai-analysis">
              <div className="flex items-start space-x-3" data-spec-id="ZGltFmY4p3v2pPCg">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mt-1" data-spec-id="QsUXfWZ5R4EDPiwg">
                  <Brain className="w-4 h-4 text-white" data-spec-id="AcROgC5mSHLeDlQF"/>
                </div>
                <div data-spec-id="fhaY1p4Ox2dvnlCV">
                  <div className="font-medium text-blue-900 mb-1" data-spec-id="bdwpqMPj7aTm1YdN">AI分析</div>
                  <div className="text-sm text-blue-800" data-spec-id="MjJZNlITcJ6537Gc">{positionData.aiAnalysis.recommendation}</div>
                </div>
              </div>
            </div>

            {}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200" data-spec-id="status-info">
              <div className="text-center" data-spec-id="nq4cmx9n5okGyQ5u">
                <div className="text-sm text-gray-600 mb-1" data-spec-id="qrByYTirXwAcyLhT">トレンド</div>
                <div className="flex items-center justify-center text-green-600 font-medium" data-spec-id="RFi2MvrnnV44TBwj">
                  <TrendingUp className="w-4 h-4 mr-1" data-spec-id="aEryEV9wVBqiX1BK"/>
                  {positionData.trend.label}
                </div>
              </div>
              <div className="text-center" data-spec-id="Gn6zf6Yzx8H28DFX">
                <div className="text-sm text-gray-600 mb-1" data-spec-id="S6UVm68erC255og9">ステータス</div>
                <Badge className="bg-green-100 text-green-800 border-green-200" data-spec-id="9ycmOq2KfytIlibw">
                  {positionData.currentStatus}
                </Badge>
              </div>
              <div className="text-center" data-spec-id="KUy577yGLfGKytIj">
                <div className="text-sm text-gray-600 mb-1" data-spec-id="4T6oIMQDkR9r9Oi3">最終更新</div>
                <div className="text-sm font-medium text-gray-900" data-spec-id="JoZ0vbfbOZ9L3CWm">{positionData.lastUpdate}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-spec-id="dl1a72dJFnK2nZNB">
          {}
          <div className="lg:col-span-2 space-y-6" data-spec-id="CW53RpEBESfwRG2H">
            {}
            <Card className="bg-white border border-gray-200" data-spec-id="time-series-events">
              <CardHeader className="bg-gray-50 border-b border-gray-200" data-spec-id="dx2E11M9GVxQcNp9">
                <div className="flex items-center justify-between" data-spec-id="BbcotNcgnc2UMtg3">
                  <div className="flex items-center space-x-3" data-spec-id="UeoIKln0n1eypO9G">
                    <div className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center" data-spec-id="kCuxW4OXTmw2xXW0">
                      <Clock className="w-3 h-3 text-white" data-spec-id="DPkRbIfVGHcTKJJf"/>
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900" data-spec-id="eNIxdaLekTEbZosg">
                      時系列イベント分析
                    </CardTitle>
                  </div>
                  <RefreshCw className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" data-spec-id="Zf7FV5MPxpAxz0cF"/>
                </div>
              </CardHeader>
              <CardContent className="p-6" data-spec-id="QwAYMEwviYKUfDDv">
                {}
                <div className="flex items-center space-x-2 mb-6" data-spec-id="time-range-tabs">
                  {[
        '4時間',
        '1日',
        '1週間'
    ].map((range, index)=>{
        const value = [
            '4h',
            '1d',
            '1w'
        ][index];
        return (<Button key={range} variant={activeTimeRange === value ? "default" : "outline"} size="sm" onClick={()=>setActiveTimeRange(value)} className={activeTimeRange === value ? "bg-blue-600 text-white" : ""} data-spec-id={`time-range-${value}`}>
                        {range}
                      </Button>);
    })}
                </div>

                {}
                <div className="space-y-4" data-spec-id="action-logs">
                  <h3 className="font-semibold text-gray-900 flex items-center" data-spec-id="ClAtg96uFZnWG7jo">
                    <Activity className="w-4 h-4 mr-2 text-blue-600" data-spec-id="0njoqfZUyAQWIATG"/>
                    AI-COACH-001 行動ログ
                    <BarChart3 className="w-4 h-4 ml-2 text-gray-400" data-spec-id="pn1zKgmUrEtsB6n7"/>
                  </h3>
                  
                  {actionLogs.map((log, index)=>(<div key={index} className="border border-gray-200 rounded-lg p-4" data-spec-id="action-log-item">
                      <div className="flex items-center justify-between mb-2" data-spec-id="RpimRmIBrZ0SkRne">
                        <div className="flex items-center space-x-4 text-sm" data-spec-id="hsZTObKq8vqzUZyX">
                          <div className="flex items-center text-gray-600" data-spec-id="epLVNHqkhEyRDZIt">
                            <Clock className="w-3 h-3 mr-1" data-spec-id="fefRhKb2L1257YaF"/>
                            {log.time}
                          </div>
                          <div className="text-green-600 font-medium" data-spec-id="3YBOphqdFTOjwkLt">CVR: {log.cvr}%</div>
                          <div className="text-gray-600" data-spec-id="sR04ETikKj06RgRa">セッション: {log.sessions}</div>
                          <div className="text-gray-600" data-spec-id="c4aWtsYekMXFxU7A">CPL: ¥{log.cpl}</div>
                        </div>
                        <Link to={`/event/${index + 1}`} data-spec-id="2LVFodNRBVlEcf3h">
                          <Button variant="ghost" size="sm" data-spec-id="log-detail-btn">
                            詳細
                            <ExternalLink className="w-3 h-3 ml-1" data-spec-id="gsQxQDH1zqI23e2v"/>
                          </Button>
                        </Link>
                      </div>
                      <div className="text-sm text-gray-800 mb-1" data-spec-id="ZKxrlJawJjRxM7r8">{log.optimization}</div>
                      <div className="flex items-start text-sm text-blue-700" data-spec-id="IEnpbkWNUVlWYhri">
                        <Brain className="w-3 h-3 mr-1 mt-0.5 text-blue-600" data-spec-id="Z9n9pdgGsXeMBEsm"/>
                        {log.ai}
                      </div>
                    </div>))}
                </div>
              </CardContent>
            </Card>
          </div>

          {}
          <div className="space-y-6" data-spec-id="MJLLcxIFW5ldZxUT">
            {}
            <Card className="bg-white border border-gray-200" data-spec-id="user-flow">
              <CardHeader className="bg-gray-50 border-b border-gray-200" data-spec-id="0ZAPFz6FH5BxYE9w">
                <div className="flex items-center space-x-3" data-spec-id="LeBX6KGdGr23sWCu">
                  <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center" data-spec-id="S2equCyAIegFNLBn">
                    <Users className="w-3 h-3 text-white" data-spec-id="LmBPxdkEFULahoDQ"/>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900" data-spec-id="vJadYqHJEy1CmN4S">
                    ユーザー行動フロー（本日）
                  </CardTitle>
                </div>
                <p className="text-sm text-gray-600 mt-1" data-spec-id="R25SllssE5qWRVXt">エントリー → 興味 → 検討 → アクション</p>
              </CardHeader>
              <CardContent className="p-6" data-spec-id="F6JpgcbXTNaet1Wc">
                <div className="space-y-4" data-spec-id="flow-stages">
                  {userFlow.map((stage, index)=>(<div key={index} className="space-y-2" data-spec-id="flow-stage">
                      <div className="flex items-center justify-between" data-spec-id="Uf1Ok7enktMocae7">
                        <div className="font-medium text-gray-900" data-spec-id="47GEMfYWRfu4CkQc">{stage.stage}</div>
                        <div className="text-right" data-spec-id="oVYP27141jvX8033">
                          <div className="font-bold text-gray-900" data-spec-id="1Yp7zvmiM8Ae8Xuh">{stage.count.toLocaleString()}</div>
                          <div className="text-xs text-gray-500" data-spec-id="zKtXr10p900TXuSw">{stage.percentage}%</div>
                        </div>
                      </div>
                      {stage.change !== null && (<div className="flex items-center text-sm text-red-600" data-spec-id="jWusnfIMqMkVmNSw">
                          <TrendingDown className="w-3 h-3 mr-1" data-spec-id="X8lSlFdyTEvVrdsp"/>
                          {stage.change} (前回比{stage.changePercentage}%)
                        </div>)}
                      {index < userFlow.length - 1 && (<div className="w-full bg-gray-200 rounded-full h-1 mt-3" data-spec-id="DoyYoJdc6YBPMDaV">
                          <div className={`h-1 rounded-full ${stage.isConversion ? 'bg-green-500' : 'bg-blue-500'}`} style={{
            width: `${stage.percentage}%`
        }} data-spec-id="lbbHf9mMqIYMJJbl"></div>
                        </div>)}
                    </div>))}
                </div>

                {}
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200" data-spec-id="flow-insights">
                  <div className="flex items-start space-x-2" data-spec-id="zDL832wxeYwVWusC">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" data-spec-id="F43UZmXRFqqiEvOv"/>
                    <div className="text-sm" data-spec-id="iIKHqfUe46eoQ2h6">
                      <div className="font-medium text-yellow-800 mb-1" data-spec-id="LhycAtDI9cy0NKNV">主要脱落ポイント</div>
                      <div className="text-yellow-700" data-spec-id="qdTIQ4SJswKIhP9y">
                        1. 価値提案セクション (297人/23.8%)<br data-spec-id="3OU1Qg6ICWfOpwix"/>
                        2. フォーム入力画面 (471人/37.8%)
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {}
            <Card className="bg-white border border-gray-200" data-spec-id="performance-summary">
              <CardHeader className="bg-gray-50 border-b border-gray-200" data-spec-id="z0fo632RHTaZy7BC">
                <div className="flex items-center space-x-3" data-spec-id="FXOga2slAzgTmSU8">
                  <div className="w-6 h-6 bg-purple-500 rounded-md flex items-center justify-center" data-spec-id="TyiyFror4aH4wRZ6">
                    <Target className="w-3 h-3 text-white" data-spec-id="uU5OK0IiHZl7oDJY"/>
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900" data-spec-id="8Ep2a8NeJirHJsdv">
                    パフォーマンスサマリー
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6" data-spec-id="f7ogt19Abr0bkv1j">
                <div className="grid grid-cols-2 gap-4" data-spec-id="performance-metrics">
                  {performanceSummary.map((metric, index)=>(<div key={index} className={`p-4 rounded-lg border ${metric.bgColor} border-gray-200`} data-spec-id="performance-metric">
                      <div className="text-sm text-gray-600 mb-1" data-spec-id="F24Qs9of3rDovSI2">{metric.title}</div>
                      <div className={`text-2xl font-bold ${metric.color}`} data-spec-id="e8KbzDhGtOt23Q9s">{metric.value}</div>
                    </div>))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>);
};
export default PositionDetail;
