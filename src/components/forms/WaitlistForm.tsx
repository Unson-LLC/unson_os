'use client'

import { useState } from 'react'
import { Button } from '../ui/Button'
import { useAnalytics } from '../../hooks/useAnalytics'
import { CheckCircle, Mail, User, Briefcase, ArrowRight, AlertCircle } from 'lucide-react'

interface FormData {
  email: string
  name: string
  role: string
}

interface FormErrors {
  email?: string
  name?: string
  role?: string
}

export function WaitlistForm() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    role: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [apiError, setApiError] = useState('')

  const { trackWaitlistSignup } = useAnalytics()

  const validateForm = () => {
    const newErrors: FormErrors = {}

    if (!formData.email) {
      newErrors.email = 'メールアドレスは必須です'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください'
    }

    if (!formData.name) {
      newErrors.name = 'お名前は必須です'
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
    setApiError('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Server error')
      }

      const result = await response.json()
      
      trackWaitlistSignup(formData.email)
      setIsSuccess(true)
      
      setFormData({
        email: '',
        name: '',
        role: '',
      })
    } catch (error) {
      setApiError('エラーが発生しました。もう一度お試しください。')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (isSuccess) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50 p-8">
        <div className="relative z-10">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-100">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-center text-green-900 mb-2">
            登録ありがとうございます！
          </h3>
          <p className="text-center text-green-700">
            UnsonOSの最新情報をお送りします。楽しみにお待ちください。
          </p>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-green-200/30 rounded-full blur-2xl"></div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6" role="form" noValidate>
        <div className="space-y-5">
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
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
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
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="田中太郎"
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

          {/* 職種 */}
          <div className="group">
            <label htmlFor="role" className="block text-sm font-semibold text-gray-900 mb-2">
              職種・関心領域
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
              </div>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 bg-white 
                  transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 
                  focus:border-blue-500 hover:border-gray-300 appearance-none cursor-pointer"
              >
                <option value="">選択してください</option>
                <option value="developer">開発者・エンジニア</option>
                <option value="designer">デザイナー</option>
                <option value="marketer">マーケター</option>
                <option value="investor">投資家・VCファンド</option>
                <option value="entrepreneur">起業家・事業主</option>
                <option value="student">学生・研究者</option>
                <option value="other">その他</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ArrowRight className="h-4 w-4 text-gray-400 rotate-90" />
              </div>
            </div>
          </div>
        </div>

        {/* エラーメッセージ */}
        {apiError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl" role="alert">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-sm font-medium text-red-800">{apiError}</p>
            </div>
          </div>
        )}

        {/* 送信ボタン */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 
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
                今すぐ登録する
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </div>
        </Button>

        <p className="text-xs text-gray-500 text-center">
          登録により、UnsonOSの最新情報とアップデートをお受け取りいただけます。
        </p>
      </form>
    </div>
  )
}