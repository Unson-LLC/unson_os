import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, BarChart3, Activity, Zap, Filter, ArrowUpRight, ArrowDownRight, Bell, Settings, Download, ChevronRight, Sparkles, Clock, Target, RefreshCw, AlertTriangle, Eye, Search, Calendar, Users, DollarSign, TrendingUpIcon } from "lucide-react";
import { Link } from "react-router-dom";
const Index = ()=>{
    const positions = [
        {
            id: 1,
            name: "AI-COACH",
            status: "active",
            cvr: 15.2,
            cvrTrend: "up",
            cpl: "¥180",
            leads: 125,
            grade: "A+",
            performance: "MVP移行準備",
            description: "MVP移行を強く推薦、全指標が目標を上回る"
        },
        {
            id: 2,
            name: "AI-WRITER",
            status: "active",
            cvr: 12.8,
            cvrTrend: "down",
            cpl: "¥220",
            leads: 89,
            grade: "A",
            performance: "継続提案",
            description: "ユーザーインタビュー実施タイミング、安定成長中"
        },
        {
            id: 3,
            name: "AI-BRIDGE",
            status: "warning",
            cvr: 8.2,
            cvrTrend: "up",
            cpl: "¥380",
            leads: 45,
            grade: "B",
            performance: "改善必要",
            description: "価値提案の見直し必要、総合分析継続"
        },
        {
            id: 4,
            name: "AI-STYLIST",
            status: "danger",
            cvr: 3.4,
            cvrTrend: "down",
            cpl: "¥850",
            leads: 12,
            grade: "D",
            performance: "緊急措置",
            description: "ピボット or 終了検討、市場適合性低い"
        }
    ];
    const actionLogs = [
        {
            time: "15:30",
            cvr: 15.2,
            sessions: 89,
            cpl: "¥180",
            optimization: "キーワード3件削除 → CPL-¥25",
            ai: "最適化改善項目登録済み、トレンド継続調査"
        },
        {
            time: "11:30",
            cvr: 12.8,
            sessions: 156,
            cpl: "¥205",
            optimization: "入札調整実行",
            ai: "競合分析の可能性向、価格許容性を提案"
        }
    ];
    const summaryStats = {
        totalCvr: 7.8,
        totalLeads: 2847,
        totalCpl: "¥1,234",
        totalRevenue: "¥3.5M"
    };
    const getStatusGradient = (status: string)=>{
        switch(status){
            case "active":
                return "from-emerald-500 to-teal-600";
            case "warning":
                return "from-amber-500 to-orange-500";
            case "danger":
                return "from-rose-500 to-red-600";
            default:
                return "from-slate-500 to-gray-600";
        }
    };
    const getGradeStyle = (grade: string)=>{
        switch(grade){
            case "A+":
                return "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200";
            case "A":
                return "bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200";
            case "B":
                return "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200";
            case "D":
                return "bg-gradient-to-r from-rose-50 to-red-50 text-red-700 border-red-200";
            default:
                return "bg-gradient-to-r from-slate-50 to-gray-50 text-slate-700 border-slate-200";
        }
    };
    return (<div className="min-h-screen bg-gray-50" data-spec-id="dashboard-root">
      <div className="max-w-7xl mx-auto p-8 space-y-8" data-spec-id="EF3rRh9vBiaBais8">
        
        {}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm" data-spec-id="dashboard-header">
          <div className="p-6" data-spec-id="0ZzyY1e2LAEWkOWh">
            <div className="flex items-center justify-between" data-spec-id="xPjSyWAYQuqGhrzq">
              <div data-spec-id="jcAxQTWy1nu4ucIW">
                <div className="flex items-center space-x-3 mb-2" data-spec-id="rvJ0LWnTsCVeHcH8">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center" data-spec-id="dCSOt6tHiOzSquPs">
                    <Sparkles className="w-5 h-5 text-white" data-spec-id="nxWbzkU8bdYVZFp4"/>
                  </div>
                  <h1 className="text-2xl font-semibold text-gray-900" data-spec-id="ZuA4Zye5XVzCNOBG">
                    LP検証システム
                  </h1>
                </div>
                <p className="text-gray-600 text-sm" data-spec-id="1ToEpFJ6uH2Tp32L">全ポジション総合管理・リアルタイム分析</p>
              </div>
              <div className="flex items-center space-x-2" data-spec-id="AN1E74OZpURa6ZUS">
                <Button variant="outline" size="sm" className="border-gray-200 hover:border-gray-300 text-gray-700" data-spec-id="sZDhntyb8d6EM0Lr">
                  <Calendar className="w-4 h-4 mr-2" data-spec-id="6yLEywthGUrh51XL"/>
                  今日
                </Button>
                <Button variant="outline" size="sm" className="border-gray-200 hover:border-gray-300 text-gray-700" data-spec-id="5fmrp6nnwZj27VWq">
                  <Bell className="w-4 h-4" data-spec-id="97gIkP6ck71O5HFy"/>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6" data-spec-id="quick-stats">
          <Card className="bg-white border border-gray-200 hover:shadow-sm transition-shadow" data-spec-id="jlsd77Ts6270bW7u">
            <CardContent className="p-5" data-spec-id="F7OO5bnyCngYGQuA">
              <div className="flex items-center justify-between" data-spec-id="7KkkypxobGL7ReW6">
                <div data-spec-id="IxFLrjSWhpSuXBry">
                  <p className="text-gray-600 text-sm font-medium" data-spec-id="pnnSAKCJbiIxIJpU">総CVR</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1" data-spec-id="JvQ3NdustrUJBGRO">{summaryStats.totalCvr}%</p>
                  <p className="text-green-600 text-xs font-medium mt-1" data-spec-id="57KD1dFBUxaVxI7o">前日比: +0.3%</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center" data-spec-id="G7EIMDga1Eqquoz0">
                  <TrendingUp className="w-5 h-5 text-green-600" data-spec-id="3RBLY29cQpolXcmi"/>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 hover:shadow-sm transition-shadow" data-spec-id="WidF3mdUYHYEmxpC">
            <CardContent className="p-5" data-spec-id="dYUz5fsUWHFlUN6D">
              <div className="flex items-center justify-between" data-spec-id="1ZmJ7NCkI7V9n6jU">
                <div data-spec-id="G9uD4CSGHlqBpyR8">
                  <p className="text-gray-600 text-sm font-medium" data-spec-id="WMDlNW1WthMkVFa0">総リード数</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1" data-spec-id="H8kWM4Mly6Qj9aIG">{summaryStats.totalLeads}</p>
                  <p className="text-blue-600 text-xs font-medium mt-1" data-spec-id="hnFHcYGjk5eFFnxi">前日比: +127</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center" data-spec-id="eYfpucSTieo6GKK0">
                  <Users className="w-5 h-5 text-blue-600" data-spec-id="HAlq9lVPMQ2LSbsg"/>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 hover:shadow-sm transition-shadow" data-spec-id="mOLDmFXCx3VT2g99">
            <CardContent className="p-5" data-spec-id="lbSu4mCfFIBrOVo7">
              <div className="flex items-center justify-between" data-spec-id="mqeLZzhCc90bljwd">
                <div data-spec-id="IBY4LgOTtY27SkK7">
                  <p className="text-gray-600 text-sm font-medium" data-spec-id="IEPdvIIf1XbJ3Gdq">平均CPL</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1" data-spec-id="MvdyUsBtMNTbm6Wh">{summaryStats.totalCpl}</p>
                  <p className="text-orange-600 text-xs font-medium mt-1" data-spec-id="GjwxvjLbwa7bvy26">前日比: -¥56</p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center" data-spec-id="nDXHK2GdCmzpLvRE">
                  <DollarSign className="w-5 h-5 text-orange-600" data-spec-id="NFFywWhAVfZego3P"/>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 hover:shadow-sm transition-shadow" data-spec-id="OAHJZwdiZR3DsGcP">
            <CardContent className="p-5" data-spec-id="uc1yW2mTTwRnwawh">
              <div className="flex items-center justify-between" data-spec-id="ZTEtFvPDrLbOjpWZ">
                <div data-spec-id="CHBjh7y6DIyb4ddo">
                  <p className="text-gray-600 text-sm font-medium" data-spec-id="1SpO9yresW5UqIAa">総収益</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1" data-spec-id="qIGm4ZYO14p3upkE">{summaryStats.totalRevenue}</p>
                  <p className="text-gray-500 text-xs font-medium mt-1" data-spec-id="81CBIxv3PCArXdvR">予算達成: 68%</p>
                </div>
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center" data-spec-id="y65sEgbNKJBEOUtN">
                  <BarChart3 className="w-5 h-5 text-gray-600" data-spec-id="Zf6VjsagqZTAPXeA"/>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {}
        <Card className="bg-white border border-gray-200" data-spec-id="position-management">
          <CardHeader className="bg-gray-50 border-b border-gray-200" data-spec-id="x2He2CtebU8YIc2T">
            <div className="flex items-center justify-between" data-spec-id="0986mQ1Fp5ULTLuT">
              <div className="flex items-center space-x-3" data-spec-id="nX0LH7TYJJ02xYlH">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center" data-spec-id="krTYqr1FdKxM5zTY">
                  <Activity className="w-4 h-4 text-blue-600" data-spec-id="nK4UEhJFnUNwHBrh"/>
                </div>
                <div data-spec-id="JTWacSWcFiQkhneA">
                  <CardTitle className="text-lg font-semibold text-gray-900" data-spec-id="jAZUlk9CsZUIH7rT">
                    ポジション管理
                  </CardTitle>
                  <p className="text-gray-600 text-sm" data-spec-id="TA8IgfjJEFZukTmH">ポジションをクリックすると、個別の詳細ページに移動します</p>
                </div>
              </div>
              <Link to="/position-management" data-spec-id="EQcrPwASiaV7WLx4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm" data-spec-id="position-detail-btn">
                  <Eye className="w-4 h-4 mr-2" data-spec-id="ixBwFs1H0s1Sf07c"/>
                  詳細ページへ移動
                  <ChevronRight className="w-4 h-4 ml-2" data-spec-id="oqLCyHrZIAtUgEQe"/>
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6" data-spec-id="GACpnM8eDxLX0vsr">
            
            {}
            <div className="flex items-center justify-between mb-8" data-spec-id="PwwX0gMFqe9LBInI">
              <div className="flex items-center space-x-3" data-spec-id="position-filters">
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer" data-spec-id="ZSQyXwGUQcOLtxbd">
                  CVR%
                </Badge>
                <Badge variant="outline" className="border-gray-300 hover:border-gray-400 cursor-pointer" data-spec-id="d7WYF7yzPR9Fw6NV">
                  CPL↑
                </Badge>
                <Badge variant="outline" className="border-gray-300 hover:border-gray-400 cursor-pointer" data-spec-id="GugKJr6Zjwo8ftVv">
                  <Filter className="w-3 h-3 mr-1" data-spec-id="tIofWsTgfoSgQcsG"/>
                  フィルター
                </Badge>
                <Badge variant="outline" className="border-gray-300 hover:border-gray-400 cursor-pointer" data-spec-id="882xM2XMEa0UwZ0t">
                  実行中のみ
                </Badge>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200" data-spec-id="leads-summary">
                <div className="flex items-center space-x-3" data-spec-id="KTIe6mfdipuw3vZp">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" data-spec-id="nZ5JUKaiVAIXeD9b"></div>
                  <span className="text-gray-900 font-semibold" data-spec-id="g9Z0kljVDVxH0HfY">総リード: 342</span>
                  <Badge className="bg-green-100 text-green-700 text-xs" data-spec-id="zzg0ttV23YljMJUZ">+45今日</Badge>
                  <RefreshCw className="w-4 h-4 text-gray-600 cursor-pointer hover:animate-spin" data-spec-id="kSphu0H2CtC61sxC"/>
                </div>
              </div>
            </div>

            {}
            <div className="space-y-4" data-spec-id="position-table">
              {positions.map((position)=>(<Link key={position.id} to={`/position/${position.id}`} className="group relative overflow-hidden bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 cursor-pointer block" data-spec-id={`position-row-${position.id}`}>
                  <div className={`absolute inset-0 bg-gradient-to-r ${getStatusGradient(position.status)} opacity-0 group-hover:opacity-5 transition-opacity`} data-spec-id="R488IkfHtYV7wHKm"></div>
                  
                  <div className="relative p-6 grid grid-cols-7 gap-6 items-center" data-spec-id="zX5e9nIeyFUKIzSL">
                    <div className="flex items-center space-x-4" data-spec-id="wJ0TsjXiRlgQ2D7J">
                      <span className="text-gray-500 font-mono text-sm" data-spec-id="Sm757SLG0l2wLsaz">#{position.id}</span>
                      <div className={`w-3 h-3 rounded-full ${position.status === 'active' ? 'bg-green-500' : position.status === 'warning' ? 'bg-orange-500' : 'bg-red-500'}`} data-spec-id="0kdy798TovNjjcWV"></div>
                    </div>
                    
                    <div className="space-y-1" data-spec-id="kQ5vbaQvFuks2Rhc">
                      <div className="font-semibold text-gray-900" data-spec-id="SUJUrW4C7A6tjm46">{position.name}</div>
                      <div className="text-xs text-gray-500" data-spec-id="3GivBHgW1mflmIax">{position.description}</div>
                    </div>
                    
                    <div className="flex items-center space-x-3" data-spec-id="pASTUkSwhHP2C2yp">
                      <span className="text-xl font-semibold text-gray-900" data-spec-id="aqLJCuKfBsTbAY1q">
                        {position.cvr}%
                      </span>
                      {position.cvrTrend === "up" ? (<ArrowUpRight className="w-4 h-4 text-green-500" data-spec-id="ZBAqVNQWROOfuOdT"/>) : (<ArrowDownRight className="w-4 h-4 text-red-500" data-spec-id="zCZFoEbkmlMFWwUX"/>)}
                    </div>
                    
                    <div className="text-sm font-medium text-gray-900" data-spec-id="h1edF0jKPI0UuPNR">{position.cpl}</div>
                    
                    <div className="text-sm font-medium text-gray-900" data-spec-id="RjhinGJsBjp9FFWC">{position.leads}</div>
                    
                    <div data-spec-id="zwm7ITP2v3HpcHaD">
                      <Badge className={`${getGradeStyle(position.grade)} border font-bold px-3 py-1`} data-spec-id="NFP1CYQck73JID31">
                        {position.grade}
                      </Badge>
                    </div>
                    
                    <div data-spec-id="GxRC6BFmqOZCgCfi">
                      <Badge className={position.status === "active" ? "bg-green-100 text-green-700 border-green-200" : position.status === "warning" ? "bg-orange-100 text-orange-700 border-orange-200" : "bg-red-100 text-red-700 border-red-200"} data-spec-id="Xv1VlInNbcOeDoic">
                        {position.performance}
                      </Badge>
                    </div>
                  </div>
                </Link>))}
            </div>
          </CardContent>
        </Card>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" data-spec-id="fp4uQHrJUlIEz3dr">
          
          {}
          <Card className="lg:col-span-2 bg-white border border-gray-200" data-spec-id="action-logs">
            <CardHeader className="bg-gray-50 border-b border-gray-200" data-spec-id="9eIvebwUSqQ0W2rK">
              <div className="flex items-center space-x-3" data-spec-id="xCs2dn14JgUAEL2B">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center" data-spec-id="7WD8Akvq2PMzjat8">
                  <Zap className="w-4 h-4 text-orange-600" data-spec-id="AdDy36qgs19MJJ6Y"/>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900" data-spec-id="lFrZzWivpGOUDau8">
                  全ポジション時系列イベント
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6" data-spec-id="yIHV2fPIXP0ZUoZG">
              <p className="text-gray-600 mb-6" data-spec-id="w9zrO0aebtoaL2X9">全ポジションのイベントを時系列で表示しています</p>
              
              <Tabs defaultValue="4h" className="mb-8" data-spec-id="sn6jvcJzgZfafvyV">
                <TabsList className="bg-gray-100 p-1 rounded-lg" data-spec-id="jdyCAXW8sxcM29We">
                  <TabsTrigger value="4h" className="rounded font-medium data-[state=active]:bg-white data-[state=active]:text-gray-900" data-spec-id="jQtcmNdOdvoAOHlb">
                    4時間
                  </TabsTrigger>
                  <TabsTrigger value="1d" className="rounded font-medium data-[state=active]:bg-white data-[state=active]:text-gray-900" data-spec-id="Lz6qIuBPtpnRB9t6">
                    1日
                  </TabsTrigger>
                  <TabsTrigger value="1w" className="rounded font-medium data-[state=active]:bg-white data-[state=active]:text-gray-900" data-spec-id="KSKEWUQ2HZc2nEMl">
                    1週間
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="space-y-6" data-spec-id="all-action-logs">
                <div className="flex items-center justify-between" data-spec-id="KfqmI7TmQdI4XzpP">
                  <h3 className="font-semibold text-lg text-gray-900 flex items-center" data-spec-id="DPiQqN5J6HCQF9Le">
                    <Activity className="w-4 h-4 mr-2 text-gray-600" data-spec-id="tn7wYV8h5ti9Qy2o"/>
                    ALL行動ログ
                  </h3>
                  <Button variant="outline" size="sm" className="border-gray-200 hover:border-gray-300" data-spec-id="2PsbGf56PHWEC8Bb">
                    <RefreshCw className="w-4 h-4 mr-2" data-spec-id="UUmOUuPNjkqLWq4N"/>
                    更新
                  </Button>
                </div>
                
                {actionLogs.map((log, index)=>(<div key={index} className="relative" data-spec-id={`action-log-${index}`}>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors" data-spec-id="3r21Gh3Gmg4Gt0lM">
                      <div className="flex items-center justify-between mb-4" data-spec-id="Jlfq283EEejJ0K6L">
                        <div className="flex items-center space-x-6 text-sm font-medium" data-spec-id="h4wK2mQsr1Pbjnm0">
                          <span className="flex items-center bg-white rounded-lg px-3 py-1 shadow-sm" data-spec-id="6U6pJoN1LMpmFHYV">
                            <Clock className="w-3 h-3 mr-2 text-gray-600" data-spec-id="EJmGWpCA2s5EO2VN"/>
                            {log.time}
                          </span>
                          <span className="text-gray-700" data-spec-id="Na0dX1xzwxBWNFul">CVR: {log.cvr}%</span>
                          <span className="text-gray-700" data-spec-id="lVLbY7kqE4onH7Yi">セッション: {log.sessions}</span>
                          <span className="text-gray-700" data-spec-id="CNcEypEDXRcNCOKn">CPL: {log.cpl}</span>
                        </div>
                        <Link to={`/event/${index + 1}`} data-spec-id="JljB9YoXNsfJzJ9R">
                          <Button variant="outline" size="sm" className="border-gray-200 hover:border-gray-300" data-spec-id={`log-detail-${index}`}>
                            詳細
                          </Button>
                        </Link>
                      </div>
                      <div className="space-y-2" data-spec-id="VYcB12loYVdQKchu">
                        <div className="text-gray-700 font-medium" data-spec-id="EIa0vXZXX85QG9p7">最適化: {log.optimization}</div>
                        <div className="flex items-center text-gray-600 font-medium" data-spec-id="yVnKIO8AJg5uxEZm">
                          <Target className="w-4 h-4 mr-2" data-spec-id="D9CAoS0g9dsZkoaz"/>
                          AI: {log.ai}
                        </div>
                      </div>
                    </div>
                  </div>))}
              </div>
            </CardContent>
          </Card>

          {}
          <Card className="bg-white border border-gray-200" data-spec-id="summary-stats">
            <CardHeader className="bg-gray-50 border-b border-gray-200" data-spec-id="dfwQRnwwqRE3VIBX">
              <div className="flex items-center space-x-3" data-spec-id="oxfzvfQIvLiacU8G">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center" data-spec-id="YLvfJyY6g6aJHB6p">
                  <BarChart3 className="w-4 h-4 text-purple-600" data-spec-id="xasSd0x1JcFwhYuh"/>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900" data-spec-id="wHKAvz40mPM3Icjc">
                  全体統計サマリー
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6" data-spec-id="qCvhvuZgPv9fyVNh">
              
              {}
              <div data-spec-id="event-breakdown">
                <h3 className="font-semibold text-base text-gray-900 mb-4" data-spec-id="6GsltCGZhUuRRiyX">イベント種別内訳（24時間）</h3>
                <div className="space-y-4" data-spec-id="4mxucB7yh0M8SndY">
                  {[
        {
            label: "CVR改善",
            count: "45件",
            color: "red"
        },
        {
            label: "異常検知",
            count: "12件",
            color: "yellow"
        },
        {
            label: "ユーザー行動",
            count: "89件",
            color: "blue"
        },
        {
            label: "コスト最適化",
            count: "23件",
            color: "gray"
        },
        {
            label: "アクティブなアラート",
            count: "-",
            color: "red-dark"
        }
    ].map((item, index)=>(<div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors" data-spec-id="TQcE3yeUBqjfy58m">
                      <div className="flex items-center space-x-3" data-spec-id="a4W9wB6FtKhVrP4v">
                        <div className={`w-3 h-3 rounded-full ${item.color === 'red' ? 'bg-red-500' : item.color === 'yellow' ? 'bg-yellow-500' : item.color === 'blue' ? 'bg-blue-500' : item.color === 'gray' ? 'bg-gray-400' : 'bg-red-600'}`} data-spec-id="n95sBz6zKjfXc03e"></div>
                        <span className="text-gray-700 font-medium" data-spec-id="GAowEV1fdeL5QB09">{item.label}</span>
                      </div>
                      <span className="text-gray-900 font-medium" data-spec-id="7KHHJ3mRgYVJNWdD">{item.count}</span>
                    </div>))}
                </div>
              </div>

              <Separator data-spec-id="SSs9ydWXdCZLIlUR"/>

              {}
              <div className="space-y-4" data-spec-id="alerts">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4" data-spec-id="JN7KmPM4Y1tzXFUL">
                  <div className="flex items-start space-x-3" data-spec-id="P4RgWnf8czHRML5N">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" data-spec-id="TcQEcouo7r04aKMc"/>
                    <div className="text-red-800" data-spec-id="UD4y5mDEglUtK6N8">
                      <div className="font-semibold text-sm" data-spec-id="AB3eRt7vLfaIi87G">重要</div>
                      <div className="text-sm" data-spec-id="G67mtJj6E6jJPiqf">Gemini AI CVRが3%以下に低下</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4" data-spec-id="AiEw4vIpFOZnwPA7">
                  <div className="flex items-start space-x-3" data-spec-id="mwOqYtKDvOrZvZGS">
                    <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" data-spec-id="pQHpRf3hGvOcvG3g"/>
                    <div className="text-orange-800" data-spec-id="LvRLGkCmC48uOXsd">
                      <div className="font-semibold text-sm" data-spec-id="INnmOqvw52nri4kk">警告</div>
                      <div className="text-sm" data-spec-id="fqYBkI7XyjTQGfNP">Claude LPのCPLが目標を20%超過</div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator data-spec-id="FFT3guyTPivm3AnV"/>

              {}
              <div data-spec-id="quick-actions">
                <h3 className="font-semibold text-base text-gray-900 mb-4 flex items-center" data-spec-id="3dHrIOdchXS0Ra1F">
                  <Sparkles className="w-4 h-4 mr-2 text-gray-600" data-spec-id="atEtd6LKrXwfsH7X"/>
                  クイックアクション
                </h3>
                <div className="space-y-3" data-spec-id="ZO2tTjcfXa8777in">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg" data-spec-id="generate-report-btn">
                    <Download className="w-4 h-4 mr-2" data-spec-id="AKBMxIulfSaXF7ai"/>
                    全ポジションの日次レポート生成
                  </Button>
                  <Button variant="outline" className="w-full border-gray-200 hover:border-gray-300 rounded-lg" data-spec-id="alert-settings-btn">
                    <Settings className="w-4 h-4 mr-2" data-spec-id="l48BPYTA0Sew5wGo"/>
                    アラート設定を確認
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>);
};
export default Index;
