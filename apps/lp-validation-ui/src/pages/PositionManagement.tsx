import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TrendingUp, TrendingDown, Play, Pause, Settings, BarChart3, Target, DollarSign, Users, Calendar, Filter, Search, MoreHorizontal, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
const PositionManagement = ()=>{
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const positions = [
        {
            id: 1,
            name: "ChatGPT LP - Premium",
            status: "active",
            cpl: 180,
            cplChange: -12,
            cvr: 15.2,
            cvrChange: 3.4,
            sessions: 1247,
            conversions: 189,
            spend: 33960,
            lastUpdate: "2分前",
            performance: "excellent",
            aiOptimization: true,
            keywords: [
                "ChatGPT",
                "AI chat",
                "premium AI"
            ]
        },
        {
            id: 2,
            name: "Claude LP - Enterprise",
            status: "active",
            cpl: 205,
            cplChange: 25,
            cvr: 12.8,
            cvrChange: -2.1,
            sessions: 856,
            conversions: 109,
            spend: 22345,
            lastUpdate: "5分前",
            performance: "warning",
            aiOptimization: true,
            keywords: [
                "Claude AI",
                "enterprise AI",
                "business AI"
            ]
        },
        {
            id: 3,
            name: "Gemini LP - Free Trial",
            status: "paused",
            cpl: 95,
            cplChange: -8,
            cvr: 8.9,
            cvrChange: 1.2,
            sessions: 2134,
            conversions: 190,
            spend: 18055,
            lastUpdate: "1時間前",
            performance: "good",
            aiOptimization: false,
            keywords: [
                "Gemini",
                "free AI",
                "Google AI"
            ]
        },
        {
            id: 4,
            name: "Perplexity LP - Research",
            status: "active",
            cpl: 142,
            cplChange: 5,
            cvr: 11.3,
            cvrChange: 0.8,
            sessions: 743,
            conversions: 84,
            spend: 11928,
            lastUpdate: "15分前",
            performance: "good",
            aiOptimization: true,
            keywords: [
                "research AI",
                "Perplexity",
                "AI search"
            ]
        }
    ];
    const getStatusBadge = (status: string)=>{
        const variants = {
            active: "bg-green-100 text-green-800 border-green-200",
            paused: "bg-yellow-100 text-yellow-800 border-yellow-200",
            stopped: "bg-red-100 text-red-800 border-red-200"
        };
        const labels = {
            active: "配信中",
            paused: "一時停止",
            stopped: "停止"
        };
        return (<Badge className={variants[status as keyof typeof variants]} data-spec-id="status-badge">
        {labels[status as keyof typeof labels]}
      </Badge>);
    };
    const getPerformanceIcon = (performance: string)=>{
        switch(performance){
            case 'excellent':
                return <CheckCircle className="w-4 h-4 text-green-600" data-spec-id="PrMSg2XSEsrb5z7P"/>;
            case 'warning':
                return <AlertCircle className="w-4 h-4 text-orange-600" data-spec-id="60h9uhKK7Nh5yIGK"/>;
            case 'good':
                return <Clock className="w-4 h-4 text-blue-600" data-spec-id="488NB4y6Q1uYZNoM"/>;
            default:
                return <Clock className="w-4 h-4 text-gray-600" data-spec-id="RC9HTXmaI0CFBiTB"/>;
        }
    };
    const filteredPositions = positions.filter((position)=>{
        const matchesSearch = position.name.toLowerCase().includes(searchTerm.toLowerCase()) || position.keywords.some((keyword)=>keyword.toLowerCase().includes(searchTerm.toLowerCase()));
        if (activeTab === 'all') return matchesSearch;
        if (activeTab === 'active') return matchesSearch && position.status === 'active';
        if (activeTab === 'paused') return matchesSearch && position.status === 'paused';
        return matchesSearch;
    });
    return (<div className="min-h-screen bg-gray-50" data-spec-id="position-management-page">
      {}
      <div className="bg-white border-b border-gray-200" data-spec-id="page-header">
        <div className="max-w-7xl mx-auto px-6 py-4" data-spec-id="imzC9G62IWuu825j">
          <div className="flex items-center justify-between" data-spec-id="7wrvhOz9glcPIUm7">
            <div className="flex items-center space-x-4" data-spec-id="header-left">
              <Link to="/" data-spec-id="B1Kg78RAW1npdRDl">
                <Button variant="ghost" size="sm" data-spec-id="back-btn">
                  <ArrowLeft className="w-4 h-4 mr-2" data-spec-id="Wq1lWndsyh4hGRjX"/>
                  ダッシュボードに戻る
                </Button>
              </Link>
              <div data-spec-id="EgiL4v2mEgvLk8u7">
                <h1 className="text-2xl font-semibold text-gray-900" data-spec-id="page-title">
                  ポジション管理
                </h1>
                <p className="text-sm text-gray-600 mt-1" data-spec-id="page-subtitle">
                  全てのLPキャンペーンを一括管理
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3" data-spec-id="header-actions">
              <Button variant="outline" size="sm" data-spec-id="bulk-actions-btn">
                <Settings className="w-4 h-4 mr-2" data-spec-id="viDOVSYV42I30dNd"/>
                一括操作
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" data-spec-id="new-position-btn">
                <Target className="w-4 h-4 mr-2" data-spec-id="Vvoiwy38BKbQTHxE"/>
                新規ポジション
              </Button>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="max-w-7xl mx-auto px-6 py-6" data-spec-id="VvUv3Jn4810ENjtr">
        {}
        <div className="mb-6" data-spec-id="filters-section">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between" data-spec-id="HXFpwKJ2CSY5rrDx">
            <div className="flex items-center space-x-4" data-spec-id="search-filters">
              <div className="relative" data-spec-id="oFIR1DY4nE0DCU8i">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" data-spec-id="tI7Cw1q8oqb01Nlm"/>
                <Input placeholder="ポジション名やキーワードで検索..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className="pl-10 w-80" data-spec-id="search-input"/>
              </div>
              <Select data-spec-id="filter-select">
                <SelectTrigger className="w-40" data-spec-id="0XG7Ea9KodqQQw0G">
                  <SelectValue placeholder="絞り込み" data-spec-id="Xs9bWFl4bITuqkZB"/>
                </SelectTrigger>
                <SelectContent data-spec-id="glDVIRwyf99vzzkQ">
                  <SelectItem value="all" data-spec-id="2Du8gUkmzVf6BMha">全て</SelectItem>
                  <SelectItem value="high-performance" data-spec-id="vGNrSqDEoHduktBB">高パフォーマンス</SelectItem>
                  <SelectItem value="needs-attention" data-spec-id="Rb8Rb8zRCa52NLS6">要注意</SelectItem>
                  <SelectItem value="ai-optimized" data-spec-id="870obMlJDcHWt7tY">AI最適化</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-gray-600" data-spec-id="results-count">
              {filteredPositions.length}件のポジション
            </div>
          </div>
        </div>

        {}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6" data-spec-id="position-tabs">
          <TabsList className="bg-white p-1 rounded-lg border border-gray-200" data-spec-id="tabs-list">
            <TabsTrigger value="all" className="px-4 py-2" data-spec-id="all-tab">
              全て ({positions.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="px-4 py-2" data-spec-id="active-tab">
              配信中 ({positions.filter((p)=>p.status === 'active').length})
            </TabsTrigger>
            <TabsTrigger value="paused" className="px-4 py-2" data-spec-id="paused-tab">
              一時停止 ({positions.filter((p)=>p.status === 'paused').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4" data-spec-id="positions-list">
            {filteredPositions.map((position)=>(<Card key={position.id} className="hover:shadow-md transition-shadow" data-spec-id="position-card">
                <CardContent className="p-6" data-spec-id="jc3Ci1E9suMooQnz">
                  <div className="flex items-center justify-between mb-4" data-spec-id="position-header">
                    <div className="flex items-center space-x-4" data-spec-id="position-info">
                      <div className="flex items-center space-x-2" data-spec-id="5iCl8bvs5oSLXTDT">
                        {getPerformanceIcon(position.performance)}
                        <Link to={`/position/${position.id}`} className="hover:text-blue-600 transition-colors" data-spec-id="bCb5QSfshiEzRn2s">
                          <h3 className="text-lg font-medium text-gray-900" data-spec-id="position-name">
                            {position.name}
                          </h3>
                        </Link>
                      </div>
                      {getStatusBadge(position.status)}
                      {position.aiOptimization && (<Badge className="bg-blue-100 text-blue-800 border-blue-200" data-spec-id="ai-badge">
                          AI最適化
                        </Badge>)}
                    </div>
                    
                    <div className="flex items-center space-x-2" data-spec-id="position-actions">
                      <Button variant="ghost" size="sm" data-spec-id="analytics-btn">
                        <BarChart3 className="w-4 h-4" data-spec-id="sbkrQJYPrZQ1oBA7"/>
                      </Button>
                      <Button variant="ghost" size="sm" data-spec-id="settings-btn">
                        <Settings className="w-4 h-4" data-spec-id="Kdii2wk6igSxlE2U"/>
                      </Button>
                      <Button variant="ghost" size="sm" data-spec-id="more-btn">
                        <MoreHorizontal className="w-4 h-4" data-spec-id="jWRyUrijqTDqUK6L"/>
                      </Button>
                      {position.status === 'active' ? (<Button variant="outline" size="sm" data-spec-id="pause-btn">
                          <Pause className="w-4 h-4 mr-2" data-spec-id="R6s1xRztNnTjcG6t"/>
                          一時停止
                        </Button>) : (<Button variant="outline" size="sm" data-spec-id="resume-btn">
                          <Play className="w-4 h-4 mr-2" data-spec-id="aSKNfIr87R4X5Ptw"/>
                          再開
                        </Button>)}
                    </div>
                  </div>

                  {}
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4" data-spec-id="metrics-grid">
                    <div className="bg-white p-3 rounded-lg border border-gray-100" data-spec-id="cpl-metric">
                      <div className="flex items-center justify-between" data-spec-id="0T2lUdgAh1s8lXTx">
                        <span className="text-sm text-gray-600" data-spec-id="CkM8sQekCLTvfM6Q">CPL</span>
                        <div className={`flex items-center text-sm ${position.cplChange < 0 ? 'text-green-600' : 'text-red-600'}`} data-spec-id="wht2MD2XZY0r0rgU">
                          {position.cplChange < 0 ? <TrendingDown className="w-3 h-3" data-spec-id="Ucg4XwsK7cZTvi9P"/> : <TrendingUp className="w-3 h-3" data-spec-id="WCwbwaOGiYNLS71I"/>}
                          {Math.abs(position.cplChange)}%
                        </div>
                      </div>
                      <div className="text-xl font-semibold text-gray-900 mt-1" data-spec-id="eboNHgnKN9gqDiQX">
                        ¥{position.cpl}
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-gray-100" data-spec-id="cvr-metric">
                      <div className="flex items-center justify-between" data-spec-id="L6kamGBDpUgOmTMm">
                        <span className="text-sm text-gray-600" data-spec-id="7QAS9X3oyWiCSVMa">CVR</span>
                        <div className={`flex items-center text-sm ${position.cvrChange > 0 ? 'text-green-600' : 'text-red-600'}`} data-spec-id="fac341IV0nUHUavq">
                          {position.cvrChange > 0 ? <TrendingUp className="w-3 h-3" data-spec-id="vptl4LONFcvm7Q2h"/> : <TrendingDown className="w-3 h-3" data-spec-id="qKvG00230dF8BcVU"/>}
                          {Math.abs(position.cvrChange)}%
                        </div>
                      </div>
                      <div className="text-xl font-semibold text-gray-900 mt-1" data-spec-id="5YGB7Hc5c9ZJVKDW">
                        {position.cvr}%
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-gray-100" data-spec-id="sessions-metric">
                      <div className="flex items-center justify-between" data-spec-id="FxV1ZmqW3uDSqOG8">
                        <span className="text-sm text-gray-600" data-spec-id="daKaYhyj5HEyamkj">セッション</span>
                        <Users className="w-4 h-4 text-gray-400" data-spec-id="ovBzL3YTBG0G0gGj"/>
                      </div>
                      <div className="text-xl font-semibold text-gray-900 mt-1" data-spec-id="aw26qwJ1AIszH30j">
                        {position.sessions.toLocaleString()}
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-gray-100" data-spec-id="conversions-metric">
                      <div className="flex items-center justify-between" data-spec-id="iZMXNNBpCPw9PsZT">
                        <span className="text-sm text-gray-600" data-spec-id="WzH7LsPnyO4BSsL2">コンバージョン</span>
                        <Target className="w-4 h-4 text-gray-400" data-spec-id="SdD1IxAu5hne2BUS"/>
                      </div>
                      <div className="text-xl font-semibold text-gray-900 mt-1" data-spec-id="GQZtyFU8YZJvDXL6">
                        {position.conversions}
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-gray-100" data-spec-id="spend-metric">
                      <div className="flex items-center justify-between" data-spec-id="v7YSY19ekC0irNyb">
                        <span className="text-sm text-gray-600" data-spec-id="ptThthMy7zlfcbpM">消化金額</span>
                        <DollarSign className="w-4 h-4 text-gray-400" data-spec-id="8i7bUNhIayDN5ZOp"/>
                      </div>
                      <div className="text-xl font-semibold text-gray-900 mt-1" data-spec-id="X8fhWo07VmVioe9g">
                        ¥{position.spend.toLocaleString()}
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-gray-100" data-spec-id="update-metric">
                      <div className="flex items-center justify-between" data-spec-id="Z33ixoayaS8WVo0j">
                        <span className="text-sm text-gray-600" data-spec-id="BEoSpZdzB167dmPR">最終更新</span>
                        <Calendar className="w-4 h-4 text-gray-400" data-spec-id="1uLd5MWhIXVEBtWr"/>
                      </div>
                      <div className="text-sm font-medium text-gray-700 mt-1" data-spec-id="rti3o3lQCPaKhCyY">
                        {position.lastUpdate}
                      </div>
                    </div>
                  </div>

                  {}
                  <div className="flex flex-wrap gap-2" data-spec-id="keywords-section">
                    {position.keywords.map((keyword, index)=>(<Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200" data-spec-id="keyword-badge">
                        {keyword}
                      </Badge>))}
                  </div>
                </CardContent>
              </Card>))}
          </TabsContent>
        </Tabs>

        {filteredPositions.length === 0 && (<div className="text-center py-12" data-spec-id="empty-state">
            <div className="text-gray-400 mb-4" data-spec-id="kRGJz8ht3GjdbO3Q">
              <Search className="w-12 h-12 mx-auto" data-spec-id="KRY3GN3aIVclkppI"/>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2" data-spec-id="YLd89PlSXzJOCLIM">
              該当するポジションが見つかりません
            </h3>
            <p className="text-gray-600" data-spec-id="sFQ4WGFCR5YiS7Ae">
              検索条件を変更してもう一度お試しください
            </p>
          </div>)}
      </div>
    </div>);
};
export default PositionManagement;
