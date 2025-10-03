'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Mail, User, MessageSquare, Code, Target, Loader, ChevronLeft, ChevronRight, Briefcase, GraduationCap, Heart, DollarSign, Zap, Users, Lightbulb, Trophy } from 'lucide-react'

interface FormData {
  email: string
  name: string
  reasons: string[]
  otherReason: string
  skills: string
  expectations: string
  // 新しいペルソナ関連フィールド
  occupation: string
  experienceLevel: string
  currentRole: string
  interests: string[]
  motivations: string[]
  timeCommitment: string
  learningGoals: string[]
  contributionAreas: string[]
}

interface DiscordJoinFormProps {
  onClose?: () => void
}

export function DiscordJoinForm({ onClose }: DiscordJoinFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    reasons: [],
    otherReason: '',
    skills: '',
    expectations: '',
    // 新しいフィールドの初期値
    occupation: '',
    experienceLevel: '',
    currentRole: '',
    interests: [],
    motivations: [],
    timeCommitment: '',
    learningGoals: [],
    contributionAreas: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  
  const totalSteps = 4

  const reasonOptions = [
    { id: 'saas', label: 'SaaS開発に興味がある', icon: Code },
    { id: 'ai', label: 'AI活用ビジネスに興味がある', icon: Target },
    { id: 'dao', label: 'DAOコミュニティに興味がある', icon: User },
    { id: 'revenue', label: '収益分配モデルに興味がある', icon: DollarSign },
    { id: 'other', label: 'その他', icon: MessageSquare }
  ]

  const occupationOptions = [
    { id: 'engineer', label: 'エンジニア・開発者', icon: Code },
    { id: 'designer', label: 'デザイナー', icon: Lightbulb },
    { id: 'marketer', label: 'マーケター・営業', icon: Zap },
    { id: 'pm', label: 'プロダクトマネージャー', icon: Target },
    { id: 'executive', label: '経営者・起業家', icon: Trophy },
    { id: 'student', label: '学生', icon: GraduationCap },
    { id: 'other_job', label: 'その他の職業', icon: Briefcase }
  ]

  const experienceLevelOptions = [
    { id: 'student', label: '学生・未経験', color: 'bg-green-50 border-green-200 text-green-800' },
    { id: 'junior', label: '1-3年', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    { id: 'mid', label: '3-7年', color: 'bg-purple-50 border-purple-200 text-purple-800' },
    { id: 'senior', label: '7年以上', color: 'bg-orange-50 border-orange-200 text-orange-800' }
  ]

  const interestOptions = [
    { id: 'technical', label: '技術・開発', icon: Code },
    { id: 'business', label: 'ビジネス・戦略', icon: Target },
    { id: 'design', label: 'デザイン・UX', icon: Lightbulb },
    { id: 'marketing', label: 'マーケティング', icon: Zap },
    { id: 'investment', label: '投資・資金調達', icon: DollarSign },
    { id: 'community', label: 'コミュニティ運営', icon: Users },
    { id: 'education', label: '教育・メンタリング', icon: GraduationCap }
  ]

  const motivationOptions = [
    { id: 'learn', label: '新しいスキルを学びたい', icon: GraduationCap },
    { id: 'network', label: '人脈を広げたい', icon: Users },
    { id: 'contribute', label: 'プロジェクトに貢献したい', icon: Heart },
    { id: 'earn', label: '収益を得たい', icon: DollarSign },
    { id: 'challenge', label: '新しい挑戦をしたい', icon: Trophy }
  ]

  const timeCommitmentOptions = [
    { id: 'undecided', label: '未定（まずはコミュニティの様子を見たい）' },
    { id: 'casual', label: '週1-2時間（カジュアル参加）' },
    { id: 'regular', label: '週3-5時間（定期的参加）' },
    { id: 'active', label: '週6-10時間（積極的参加）' },
    { id: 'dedicated', label: '週10時間以上（本格参加）' }
  ]

  const handleReasonToggle = (reasonId: string) => {
    setFormData(prev => ({
      ...prev,
      reasons: prev.reasons.includes(reasonId)
        ? prev.reasons.filter(id => id !== reasonId)
        : [...prev.reasons, reasonId]
    }))
  }

  const handleArrayToggle = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[]
      return {
        ...prev,
        [field]: currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value]
      }
    })
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
      // フォームの上部にスクロール
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      // フォームの上部にスクロール
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.email && formData.name && formData.reasons.length > 0
      case 2:
        return formData.occupation && formData.experienceLevel
      case 3:
        return formData.interests.length > 0 && formData.motivations.length > 0
      case 4:
        return formData.timeCommitment && formData.expectations
      default:
        return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/discord-join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          email: '',
          name: '',
          reasons: [],
          otherReason: '',
          skills: '',
          expectations: '',
          occupation: '',
          experienceLevel: '',
          currentRole: '',
          interests: [],
          motivations: [],
          timeCommitment: '',
          learningGoals: [],
          contributionAreas: []
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Unson OS コミュニティ参加申請
        </h2>
        <span className="text-sm text-gray-500">
          {currentStep}/{totalSteps}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      <p className="text-gray-600 text-center">
        あなたのプロフィールを教えてください。最適なコミュニティ体験をご提供します。
      </p>
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">基本情報</h3>
        <p className="text-gray-600">まずは基本的な情報と興味を教えてください</p>
      </div>

      {/* Unson OSの魅力的な特徴（Tallyスタイル） */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3 text-center">
          🚀 Unson OSで実現する未来
        </h4>
        <div className="grid gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>100個のマイクロSaaSを自動生成・運営</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>24-48時間でアイデアから収益化まで</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>DAO型の透明な収益分配システム</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span>AIがあなたの代わりに24時間働く</span>
          </div>
        </div>
      </div>

      {/* メールアドレス */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="your@email.com"
          />
        </div>
      </div>

      {/* 名前 */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          お名前（ニックネーム可） <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="田中太郎"
          />
        </div>
      </div>

      {/* 参加理由 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          参加理由（複数選択可） <span className="text-red-500">*</span>
        </label>
        <div className="grid gap-3">
          {reasonOptions.map((reason) => {
            const Icon = reason.icon
            const isSelected = formData.reasons.includes(reason.id)
            return (
              <label
                key={reason.id}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleReasonToggle(reason.id)}
                  className="sr-only"
                />
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg mr-4 ${
                  isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`flex-1 font-medium ${isSelected ? 'text-blue-900' : 'text-gray-700'}`}>
                  {reason.label}
                </span>
                {isSelected && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </label>
            )
          })}
        </div>
        
        {formData.reasons.includes('other') && (
          <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
            <textarea
              value={formData.otherReason}
              onChange={(e) => setFormData(prev => ({ ...prev, otherReason: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              rows={3}
              placeholder="その他の理由を詳しくお聞かせください"
            />
          </div>
        )}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
          <Briefcase className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">職業・経験</h3>
        <p className="text-gray-600">あなたのバックグラウンドを教えてください</p>
      </div>

      {/* 職業 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          現在の職業 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {occupationOptions.map((occupation) => {
            const Icon = occupation.icon
            const isSelected = formData.occupation === occupation.id
            return (
              <label
                key={occupation.id}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="occupation"
                  value={occupation.id}
                  checked={isSelected}
                  onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                  className="sr-only"
                />
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg mr-3 ${
                  isSelected ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`font-medium text-sm ${isSelected ? 'text-purple-900' : 'text-gray-700'}`}>
                  {occupation.label}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* 実務経験 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          実務経験 <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          {experienceLevelOptions.map((level) => {
            const isSelected = formData.experienceLevel === level.id
            return (
              <label
                key={level.id}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? `${level.color} border-current shadow-lg`
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="experienceLevel"
                  value={level.id}
                  checked={isSelected}
                  onChange={(e) => setFormData(prev => ({ ...prev, experienceLevel: e.target.value }))}
                  className="sr-only"
                />
                <span className={`font-medium ${isSelected ? 'text-current' : 'text-gray-700'}`}>
                  {level.label}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* 現在の役割 */}
      <div>
        <label htmlFor="currentRole" className="block text-sm font-medium text-gray-700 mb-2">
          現在の役割・ポジション（任意）
        </label>
        <input
          type="text"
          id="currentRole"
          value={formData.currentRole}
          onChange={(e) => setFormData(prev => ({ ...prev, currentRole: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          placeholder="例: シニアエンジニア、プロダクトマネージャー、フリーランス"
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">興味・動機</h3>
        <p className="text-gray-600">あなたの関心事と参加動機を教えてください</p>
      </div>

      {/* 興味分野 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          興味のある分野（複数選択可） <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {interestOptions.map((interest) => {
            const Icon = interest.icon
            const isSelected = formData.interests.includes(interest.id)
            return (
              <label
                key={interest.id}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? 'border-green-500 bg-gradient-to-r from-green-50 to-teal-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleArrayToggle('interests', interest.id)}
                  className="sr-only"
                />
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg mr-3 ${
                  isSelected ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`font-medium text-sm ${isSelected ? 'text-green-900' : 'text-gray-700'}`}>
                  {interest.label}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* 参加動機 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          参加動機（複数選択可） <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          {motivationOptions.map((motivation) => {
            const Icon = motivation.icon
            const isSelected = formData.motivations.includes(motivation.id)
            return (
              <label
                key={motivation.id}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? 'border-teal-500 bg-gradient-to-r from-teal-50 to-cyan-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleArrayToggle('motivations', motivation.id)}
                  className="sr-only"
                />
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg mr-4 ${
                  isSelected ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`flex-1 font-medium ${isSelected ? 'text-teal-900' : 'text-gray-700'}`}>
                  {motivation.label}
                </span>
                {isSelected && (
                  <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full mb-4">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">参加詳細</h3>
        <p className="text-gray-600">具体的な参加方法と期待することを教えてください</p>
      </div>

      {/* 時間コミット */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          参加可能時間 <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          {timeCommitmentOptions.map((option) => {
            const isSelected = formData.timeCommitment === option.id
            return (
              <label
                key={option.id}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? 'border-orange-500 bg-gradient-to-r from-orange-50 to-red-50 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="timeCommitment"
                  value={option.id}
                  checked={isSelected}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeCommitment: e.target.value }))}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full mr-4 border-2 ${
                  isSelected ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                }`}>
                  {isSelected && <div className="w-2 h-2 bg-white rounded-full m-0.5" />}
                </div>
                <span className={`font-medium ${isSelected ? 'text-orange-900' : 'text-gray-700'}`}>
                  {option.label}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* スキル・経験 */}
      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
          スキル・経験（任意）
        </label>
        <textarea
          id="skills"
          value={formData.skills}
          onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
          rows={3}
          placeholder="例: React/TypeScript 3年、プロダクト企画経験、チームリード経験、SaaS運営経験"
        />
      </div>

      {/* 期待すること */}
      <div>
        <label htmlFor="expectations" className="block text-sm font-medium text-gray-700 mb-2">
          Unson OSに期待すること <span className="text-red-500">*</span>
        </label>
        <textarea
          id="expectations"
          required
          value={formData.expectations}
          onChange={(e) => setFormData(prev => ({ ...prev, expectations: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
          rows={4}
          placeholder="Unson OSプロジェクトに期待することや、どのように関わりたいか、何を学びたいかを具体的にお聞かせください"
        />
      </div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      {renderProgressBar()}

      <form onSubmit={handleSubmit} className="space-y-8">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

        {/* 送信ステータス */}
        {submitStatus === 'success' && (
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-green-800">申請完了！</h4>
            </div>
            <p className="text-green-700">
              申請を受け付けました！詳細なプロフィール情報をありがとうございます。<br/>
              Discord招待リンクを記載したメールをお送りしますので、しばらくお待ちください。
            </p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-red-800">送信エラー</h4>
            </div>
            <p className="text-red-700">
              送信中にエラーが発生しました。ネットワーク接続を確認して、しばらく経ってから再度お試しください。
            </p>
          </div>
        )}

        {/* ナビゲーションボタン */}
        <div className="flex items-center justify-between pt-8 border-t border-gray-200">
          {/* 左側：前へボタン */}
          <div className="flex-1">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 text-gray-600 border-gray-300 hover:bg-gray-50 whitespace-nowrap"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                前へ
              </Button>
            ) : (
              <div></div>
            )}
          </div>

          {/* 中央：キャンセルボタン */}
          <div className="flex-shrink-0 mx-4">
            {onClose && (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-500 border-gray-300 hover:bg-gray-50 text-sm"
              >
                キャンセル
              </Button>
            )}
          </div>

          {/* 右側：次へ/送信ボタン */}
          <div className="flex-1 flex justify-end">
            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!canProceedToNext() || isSubmitting}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                次へ
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!canProceedToNext() || isSubmitting}
                className="flex items-center px-4 sm:px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    <span className="hidden sm:inline">送信中...</span>
                    <span className="sm:hidden">送信中</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    参加申請
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center pt-4">
          送信された情報は、コミュニティ運営と最適なメンバーマッチングのためにのみ使用されます。<br/>
          プライバシーポリシーに基づき適切に管理いたします。
        </p>
      </form>
    </div>
  )
}