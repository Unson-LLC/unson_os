# UnsonOS LP 主要コンポーネント設計例

## 概要

UnsonOS LPの核となるインタラクティブコンポーネントの設計例と実装指針。Phase 1で実装すべき主要コンポーネントを詳細化。

---

## 1. DAO配当シミュレーター

### 仕様
- 貢献度別の収益シミュレーション
- リアルタイムな計算結果表示
- インタラクティブなパラメータ調整

### 実装例

```typescript
// src/components/interactive/DAOSimulator.tsx
'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Slider } from '@/components/ui/Slider'

interface ContributionMetrics {
  codeCommits: number
  bugFixes: number
  designs: number
  qaSessions: number
}

export function DAOSimulator() {
  const [metrics, setMetrics] = useState<ContributionMetrics>({
    codeCommits: 10,
    bugFixes: 5,
    designs: 3,
    qaSessions: 15
  })

  const [monthlyRevenue, setMonthlyRevenue] = useState(100000) // $100K

  const totalPoints = useMemo(() => {
    return (
      metrics.codeCommits * 3 +
      metrics.bugFixes * 2 +
      metrics.designs * 2 +
      metrics.qaSessions * 1
    )
  }, [metrics])

  const estimatedEarnings = useMemo(() => {
    const communityShare = monthlyRevenue * 0.4 // 40%のコミュニティ配当
    const assumedTotalPoints = 1000 // 全体の想定ポイント
    return (communityShare * totalPoints) / assumedTotalPoints
  }, [monthlyRevenue, totalPoints])

  return (
    <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          🧮 DAO配当シミュレーター
        </h3>
        <p className="text-gray-600">
          あなたの貢献度に基づいて月収を計算してみましょう
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 入力セクション */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              月間収益総額: ${monthlyRevenue.toLocaleString()}
            </label>
            <Slider
              value={[monthlyRevenue]}
              onValueChange={([value]) => setMonthlyRevenue(value)}
              min={10000}
              max={1000000}
              step={10000}
              className="w-full"
            />
          </div>

          <div className="space-y-4">
            <ContributionSlider
              label="コード貢献 (PR)"
              value={metrics.codeCommits}
              onChange={(value) => setMetrics(prev => ({ ...prev, codeCommits: value }))}
              max={50}
              points={3}
            />
            
            <ContributionSlider
              label="バグ修正 (Issue)"
              value={metrics.bugFixes}
              onChange={(value) => setMetrics(prev => ({ ...prev, bugFixes: value }))}
              max={30}
              points={2}
            />
            
            <ContributionSlider
              label="デザイン作成"
              value={metrics.designs}
              onChange={(value) => setMetrics(prev => ({ ...prev, designs: value }))}
              max={20}
              points={2}
            />
            
            <ContributionSlider
              label="Q&A対応"
              value={metrics.qaSessions}
              onChange={(value) => setMetrics(prev => ({ ...prev, qaSessions: value }))}
              max={100}
              points={1}
            />
          </div>
        </div>

        {/* 結果セクション */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            📊 予想収益
          </h4>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">合計ポイント:</span>
              <span className="font-mono text-lg">{totalPoints} pt</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">配当プール:</span>
              <span className="font-mono text-lg">
                ${(monthlyRevenue * 0.4).toLocaleString()}
              </span>
            </div>
            
            <hr className="border-gray-200" />
            
            <motion.div
              key={estimatedEarnings}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg"
            >
              <div className="text-sm text-gray-600 mb-1">月収予想</div>
              <div className="text-3xl font-bold text-green-600">
                ${estimatedEarnings.toFixed(0)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                年収: ${(estimatedEarnings * 12).toLocaleString()}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Button 
          size="lg"
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            // 分析イベント送信
            // analytics.track('dao_simulator_cta_clicked', { estimatedEarnings })
          }}
        >
          今すぐDAO参加 →
        </Button>
      </div>
    </Card>
  )
}

interface ContributionSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  max: number
  points: number
}

function ContributionSlider({ label, value, onChange, max, points }: ContributionSliderProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <span className="text-xs text-gray-500">
          {value} × {points}pt = {value * points}pt
        </span>
      </div>
      <Slider
        value={[value]}
        onValueChange={([newValue]) => onChange(newValue)}
        min={0}
        max={max}
        step={1}
        className="w-full"
      />
    </div>
  )
}
```

---

## 2. リアルタイム収益カウンター

### 仕様
- WebSocketまたはポーリングによる収益データ更新
- アニメーション付きの数値表示
- 複数メトリクスの同時表示

### 実装例

```typescript
// src/components/interactive/RevenueCounter.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAnalytics } from '@/hooks/useAnalytics'

interface RevenueData {
  totalRevenue: number
  monthlyRevenue: number
  activeProducts: number
  communityMembers: number
  lastUpdated: Date
}

export function RevenueCounter() {
  const [data, setData] = useState<RevenueData>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    activeProducts: 0,
    communityMembers: 0,
    lastUpdated: new Date()
  })
  
  const [isLoading, setIsLoading] = useState(true)
  const { track } = useAnalytics()

  useEffect(() => {
    // 初期データ取得
    fetchRevenueData()
    
    // 30秒ごとに更新
    const interval = setInterval(fetchRevenueData, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const fetchRevenueData = async () => {
    try {
      const response = await fetch('/api/analytics/revenue')
      const newData = await response.json()
      setData(newData)
      setIsLoading(false)
    } catch (error) {
      console.error('Revenue data fetch failed:', error)
    }
  }

  const handleCounterClick = (metric: string) => {
    track('revenue_counter_clicked', { metric })
  }

  if (isLoading) {
    return <RevenueCounterSkeleton />
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">
            📈 リアルタイム実績
          </h2>
          <p className="text-blue-100">
            UnsonOSプラットフォームの現在の状況
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <CounterCard
            title="総収益"
            value={data.totalRevenue}
            format="currency"
            icon="💰"
            onClick={() => handleCounterClick('total_revenue')}
          />
          
          <CounterCard
            title="月間収益"
            value={data.monthlyRevenue}
            format="currency"
            icon="📊"
            trend={"+15%"}
            onClick={() => handleCounterClick('monthly_revenue')}
          />
          
          <CounterCard
            title="稼働プロダクト"
            value={data.activeProducts}
            format="number"
            icon="🚀"
            onClick={() => handleCounterClick('active_products')}
          />
          
          <CounterCard
            title="コミュニティ"
            value={data.communityMembers}
            format="number"
            icon="👥"
            trend="+12%"
            onClick={() => handleCounterClick('community_members')}
          />
        </div>

        <div className="text-center mt-8">
          <p className="text-blue-100 text-sm">
            最終更新: {data.lastUpdated.toLocaleTimeString('ja-JP')}
          </p>
        </div>
      </div>
    </div>
  )
}

interface CounterCardProps {
  title: string
  value: number
  format: 'currency' | 'number'
  icon: string
  trend?: string
  onClick: () => void
}

function CounterCard({ title, value, format, icon, trend, onClick }: CounterCardProps) {
  const formatValue = (num: number) => {
    if (format === 'currency') {
      return `$${num.toLocaleString()}`
    }
    return num.toLocaleString()
  }

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-sm rounded-lg p-6 cursor-pointer hover:bg-white/20 transition-colors"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="text-center">
        <div className="text-3xl mb-2">{icon}</div>
        <h3 className="text-sm font-medium text-blue-100 mb-2">
          {title}
        </h3>
        <AnimatePresence mode="wait">
          <motion.div
            key={value}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="text-2xl font-bold mb-1"
          >
            {formatValue(value)}
          </motion.div>
        </AnimatePresence>
        {trend && (
          <div className="text-green-300 text-sm font-medium">
            {trend}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function RevenueCounterSkeleton() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/10 rounded-lg p-6">
              <div className="animate-pulse">
                <div className="h-8 w-8 bg-white/20 rounded mx-auto mb-4"></div>
                <div className="h-4 bg-white/20 rounded w-20 mx-auto mb-2"></div>
                <div className="h-6 bg-white/20 rounded w-16 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

---

## 3. プロダクト生成プレビュー

### 仕様
- ユーザー入力に基づくSaaS案生成デモ
- ステップ形式のインタラクティブ体験
- 結果の視覚的表示

### 実装例

```typescript
// src/components/interactive/ProductGenerator.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Sparkles, Target, DollarSign, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

interface ProductIdea {
  name: string
  description: string
  targetPrice: number
  estimatedUsers: number
  features: string[]
  techStack: string[]
}

const DEMO_RESPONSES: Record<string, ProductIdea> = {
  'プロンプト作成': {
    name: 'プロンプト変換君',
    description: '日本語での指示を最適化された英語プロンプトに自動変換',
    targetPrice: 9.99,
    estimatedUsers: 5000,
    features: ['ワンクリック変換', 'テンプレート機能', '履歴管理', 'API統合'],
    techStack: ['Next.js', 'OpenAI API', 'Vercel', 'Supabase']
  },
  'スケジュール管理': {
    name: 'スマートカレンダー',
    description: 'AIが最適な時間配分を提案するインテリジェントスケジューラー',
    targetPrice: 14.99,
    estimatedUsers: 3000,
    features: ['AI時間提案', 'チーム共有', '自動調整', 'モバイル同期'],
    techStack: ['React Native', 'TensorFlow', 'Firebase', 'Google Calendar API']
  }
}

export function ProductGenerator() {
  const [step, setStep] = useState(1)
  const [problem, setProblem] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedIdea, setGeneratedIdea] = useState<ProductIdea | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    
    // デモ用の遅延
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 簡単なキーワードマッチングでデモレスポンス選択
    const matchedKey = Object.keys(DEMO_RESPONSES).find(key => 
      problem.includes(key.split(' ')[0])
    )
    
    const selectedIdea = DEMO_RESPONSES[matchedKey || 'プロンプト作成']
    setGeneratedIdea(selectedIdea)
    setIsGenerating(false)
    setStep(3)
  }

  const resetDemo = () => {
    setStep(1)
    setProblem('')
    setGeneratedIdea(null)
    setIsGenerating(false)
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ✨ プロダクト生成デモ
          </h2>
          <p className="text-gray-600">
            課題を入力すると、AIがSaaSアイデアを自動生成します
          </p>
        </div>

        {/* プログレスバー */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                ${step >= stepNum 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
                }
              `}>
                {stepNum}
              </div>
              {stepNum < 3 && (
                <ChevronRight className={`w-5 h-5 mx-2 ${
                  step > stepNum ? 'text-blue-600' : 'text-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <Step1 
              problem={problem}
              setProblem={setProblem}
              onNext={() => setStep(2)}
            />
          )}
          
          {step === 2 && (
            <Step2 
              problem={problem}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
              onBack={() => setStep(1)}
            />
          )}
          
          {step === 3 && generatedIdea && (
            <Step3 
              idea={generatedIdea}
              onReset={resetDemo}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Step 1: 問題入力
function Step1({ problem, setProblem, onNext }: {
  problem: string
  setProblem: (value: string) => void
  onNext: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Card className="p-8">
        <div className="text-center mb-6">
          <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            解決したい課題を教えてください
          </h3>
          <p className="text-gray-600">
            日常業務や生活で感じている困りごとを入力してください
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Input
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="例: プロンプト作成が難しい、スケジュール管理が大変..."
            className="mb-4"
          />
          
          <Button 
            onClick={onNext}
            disabled={!problem.trim()}
            className="w-full"
            size="lg"
          >
            次へ →
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl mb-2">🤖</div>
            <div className="text-sm text-gray-600">AI分析</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-sm text-gray-600">即座に生成</div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// Step 2: 生成中
function Step2({ problem, isGenerating, onGenerate, onBack }: {
  problem: string
  isGenerating: boolean
  onGenerate: () => void
  onBack: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Card className="p-8">
        <div className="text-center mb-6">
          <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            課題を確認しています
          </h3>
          <div className="bg-gray-100 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-gray-700 font-medium">"{problem}"</p>
          </div>
        </div>

        {isGenerating ? (
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600">AIがSaaSアイデアを生成中...</p>
          </div>
        ) : (
          <div className="text-center">
            <Button onClick={onGenerate} size="lg" className="mr-4">
              SaaSアイデアを生成
            </Button>
            <Button onClick={onBack} variant="outline" size="lg">
              戻る
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

// Step 3: 結果表示
function Step3({ idea, onReset }: {
  idea: ProductIdea
  onReset: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="p-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {idea.name}
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {idea.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              ${idea.targetPrice}
            </div>
            <div className="text-sm text-gray-600">月額料金</div>
          </div>
          
          <div className="text-center">
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">
              {idea.estimatedUsers.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">想定ユーザー数</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              ${(idea.targetPrice * idea.estimatedUsers).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">月間収益予想</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h4 className="font-bold text-gray-900 mb-3">主要機能</h4>
            <ul className="space-y-2">
              {idea.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-3">技術スタック</h4>
            <div className="flex flex-wrap gap-2">
              {idea.techStack.map((tech, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button size="lg" className="mr-4">
            このアイデアでMVP作成
          </Button>
          <Button onClick={onReset} variant="outline" size="lg">
            別の課題で試す
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}
```

---

## 4. ヒーローセクション

### 仕様
- インパクトのあるビジュアル
- 明確な価値提案
- 効果的なCTA配置

### 実装例

```typescript
// src/components/sections/Hero.tsx
'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAnalytics } from '@/hooks/useAnalytics'

export function Hero() {
  const { track } = useAnalytics()

  const handleCTAClick = (type: string) => {
    track('hero_cta_clicked', { type })
  }

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 text-white overflow-hidden">
      {/* 背景アニメーション */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="relative container mx-auto px-4 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* テキストコンテンツ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="block">100個の</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                マイクロSaaS
              </span>
              <span className="block">を24時間で</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed">
              従来の開発サイクルを革新。<br />
              アイデア→収益化まで<strong className="text-white">24〜48時間</strong>で実現する<br />
              次世代プラットフォーム
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                size="lg"
                className="bg-white text-blue-900 hover:bg-gray-100 font-semibold"
                onClick={() => handleCTAClick('primary')}
              >
                早期アクセス登録
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-900"
                onClick={() => handleCTAClick('demo')}
              >
                <Play className="w-5 h-5 mr-2" />
                デモを見る
              </Button>
            </div>

            {/* 統計情報 */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-blue-600">
              <div className="text-center">
                <div className="text-2xl font-bold">24h</div>
                <div className="text-sm text-blue-200">開発サイクル</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">200+</div>
                <div className="text-sm text-blue-200">目標プロダクト数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">40%</div>
                <div className="text-sm text-blue-200">コミュニティ配当</div>
              </div>
            </div>
          </motion.div>

          {/* ビジュアルコンテンツ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10">
              {/* メインビジュアル（プレースホルダー） */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="h-4 bg-white/20 rounded w-3/4"></div>
                    <div className="h-4 bg-white/20 rounded w-1/2"></div>
                    <div className="h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded w-2/3"></div>
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <div className="h-2 bg-white/10 rounded w-full"></div>
                    <div className="h-2 bg-white/10 rounded w-4/5"></div>
                    <div className="h-2 bg-white/10 rounded w-3/5"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 装飾要素 */}
            <motion.div
              className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute -bottom-8 -left-8 w-32 h-32 bg-purple-400 rounded-full opacity-20"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
```

---

## 5. 共通UIコンポーネント

### Button コンポーネント

```typescript
// src/components/ui/Button.tsx
import { forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

---

## 実装指針

### パフォーマンス最適化
- React.memo()の適切な使用
- useMemo/useCallbackの効果的な活用
- 画像遅延読み込み
- コンポーネント分割による再レンダリング最小化

### アクセシビリティ
- セマンティックなHTML使用
- キーボードナビゲーション対応
- スクリーンリーダー対応
- カラーコントラスト確保

### 分析・追跡
- ユーザー行動の詳細追跡
- コンバージョンファネル分析
- A/Bテスト対応
- パフォーマンス指標計測

### エラーハンドリング
- Suspense境界の適切な配置
- Error Boundaryの実装
- ユーザーフレンドリーなエラー表示
- ネットワークエラー対応