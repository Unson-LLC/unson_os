'use client'

import { useState } from 'react'
import { Button } from '../ui/Button'
import { Mail, User, Tag, MessageCircle, AlertTriangle, Send, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react'

interface SupportFormData {
  name: string
  email: string
  category: string
  subject: string
  message: string
  priority: string
}

interface FormErrors {
  name?: string
  email?: string
  category?: string
  subject?: string
  message?: string
}

export function SupportForm() {
  const [formData, setFormData] = useState<SupportFormData>({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: '',
    priority: 'normal'
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'お名前は必須です'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください'
    }

    if (!formData.category) {
      newErrors.category = 'カテゴリを選択してください'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = '件名は必須です'
    }

    if (!formData.message.trim()) {
      newErrors.message = '詳細内容を入力してください'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = '10文字以上入力してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // TODO: 実際のAPI実装時に置き換え
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsSuccess(true)
      setFormData({
        name: '',
        email: '',
        category: '',
        subject: '',
        message: '',
        priority: 'normal'
      })
    } catch (error) {
      alert('送信エラーが発生しました。もう一度お試しください。')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'normal': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const getResponseTime = (priority: string) => {
    switch (priority) {
      case 'urgent': return '2時間以内（営業時間内）'
      case 'high': return '4時間以内（営業時間内）'
      case 'normal': return '24時間以内'
      case 'low': return '2-3営業日以内'
      default: return '24時間以内'
    }
  }

  if (isSuccess) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50 p-8">
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-100">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-green-900 mb-2">
            サポートリクエストを受付けました！
          </h3>
          <p className="text-green-700 mb-4">
            チケット番号が発行され、メールで詳細をお送りしました。<br />
            担当チームより迅速にご対応いたします。
          </p>
          <Button
            onClick={() => setIsSuccess(false)}
            variant="outline"
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            新しいサポートリクエストを送信
          </Button>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-green-200/30 rounded-full blur-2xl"></div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 基本情報 */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* お名前 */}
          <div className="group">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
              お名前 *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className={`h-5 w-5 transition-colors ${
                  errors.name ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'
                }`} />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="山田太郎"
                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 
                  placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20
                  ${errors.name 
                    ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500' 
                    : 'border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500'
                  }`}
              />
            </div>
            {errors.name && (
              <div className="flex items-center mt-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1.5" />
                {errors.name}
              </div>
            )}
          </div>
          
          {/* メールアドレス */}
          <div className="group">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
              メールアドレス *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className={`h-5 w-5 transition-colors ${
                  errors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'
                }`} />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="yamada@example.com"
                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 
                  placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20
                  ${errors.email 
                    ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500' 
                    : 'border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500'
                  }`}
              />
            </div>
            {errors.email && (
              <div className="flex items-center mt-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1.5" />
                {errors.email}
              </div>
            )}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* カテゴリ */}
          <div className="group">
            <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
              お問い合わせカテゴリ *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Tag className={`h-5 w-5 transition-colors ${
                  errors.category ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'
                }`} />
              </div>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 
                  focus:outline-none focus:ring-4 focus:ring-blue-500/20 appearance-none cursor-pointer
                  ${errors.category 
                    ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500' 
                    : 'border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500'
                  }`}
              >
                <option value="">カテゴリを選択してください</option>
                <option value="technical">🔧 技術的な問題</option>
                <option value="billing">💳 請求・支払い</option>
                <option value="account">👤 アカウント関連</option>
                <option value="feature">✨ 機能要望</option>
                <option value="bug">🐛 バグ報告</option>
                <option value="integration">🔗 連携・API</option>
                <option value="other">❓ その他</option>
              </select>
            </div>
            {errors.category && (
              <div className="flex items-center mt-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1.5" />
                {errors.category}
              </div>
            )}
          </div>
          
          {/* 優先度 */}
          <div className="group">
            <label htmlFor="priority" className="block text-sm font-semibold text-gray-900 mb-2">
              優先度
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <AlertTriangle className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
              </div>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 bg-white 
                  transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 
                  focus:border-blue-500 hover:border-gray-300 appearance-none cursor-pointer"
              >
                <option value="low">🟢 低 - 時間に余裕がある</option>
                <option value="normal">🔵 通常 - 標準的な対応</option>
                <option value="high">🟡 高 - 早めの対応希望</option>
                <option value="urgent">🔴 緊急 - 即座の対応が必要</option>
              </select>
            </div>
            {formData.priority && (
              <div className={`mt-2 p-2 rounded-lg border text-xs flex items-center ${getPriorityColor(formData.priority)}`}>
                <Clock className="w-4 h-4 mr-1.5" />
                予想回答時間: {getResponseTime(formData.priority)}
              </div>
            )}
          </div>
        </div>
        
        {/* 件名 */}
        <div className="group">
          <label htmlFor="subject" className="block text-sm font-semibold text-gray-900 mb-2">
            件名 *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MessageCircle className={`h-5 w-5 transition-colors ${
                errors.subject ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'
              }`} />
            </div>
            <input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              placeholder="問題の概要を簡潔にお書きください"
              className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 
                placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20
                ${errors.subject 
                  ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500' 
                  : 'border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500'
                }`}
            />
          </div>
          {errors.subject && (
            <div className="flex items-center mt-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-1.5" />
              {errors.subject}
            </div>
          )}
        </div>
        
        {/* 詳細内容 */}
        <div className="group">
          <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
            詳細内容 *
          </label>
          <div className="relative">
            <textarea
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              placeholder="問題の詳細、再現手順、エラーメッセージなどをできるだけ詳しくお書きください。

【記載いただきたい情報】
• 何をしようとしていたか
• 実際に起きた現象
• エラーメッセージ（あれば）
• 使用環境（OS、ブラウザなど）
• 再現手順

詳細な情報をいただけると、より迅速で的確なサポートが可能です。"
              className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-200 
                placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 resize-none
                ${errors.message 
                  ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500' 
                  : 'border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500'
                }`}
            />
          </div>
          {errors.message && (
            <div className="flex items-center mt-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4 mr-1.5" />
              {errors.message}
            </div>
          )}
        </div>
        
        {/* サポート情報 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 p-6 rounded-xl">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Info className="w-6 h-6 text-blue-600 mt-0.5" />
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-3">
                🚀 UnsonOSサポートについて
              </h4>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                  <span><strong>通常のお問い合わせ</strong>：24時間以内に回答</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                  <span><strong>緊急案件</strong>：営業時間内であれば2時間以内に初回対応</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span><strong>技術的な問題</strong>：エラーログやスクリーンショットがあると迅速対応可能</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 送信ボタン */}
        <div className="text-center pt-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="px-12 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 
              hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-500/20 
              disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed
              transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
              font-semibold text-white shadow-lg hover:shadow-xl disabled:shadow-md"
          >
            <div className="flex items-center justify-center">
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  送信中...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  サポートリクエストを送信
                </>
              )}
            </div>
          </Button>
        </div>
      </form>
    </div>
  )
}