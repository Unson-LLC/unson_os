'use client'

import { useState } from 'react'
import { Button } from '../ui/Button'
import { useAnalytics } from '../../hooks/useAnalytics'

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

  // Green Phase: ベタ書きバリデーション
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
      
      // Analytics tracking
      trackWaitlistSignup(formData.email)

      setIsSuccess(true)
      
      // フォームをリセット
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
      <div className="p-6 bg-green-50 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800">
          登録ありがとうございます！
        </h3>
        <p className="text-green-600">
          UnsonOSの最新情報をお送りします。
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" role="form" noValidate>
      {/* メールアドレス */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          メールアドレス *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          aria-label="メールアドレス"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* お名前 */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          お名前 *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          aria-label="お名前"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* 職種 */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          職種
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={(e) => handleInputChange('role', e.target.value)}
          aria-label="職種"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">選択してください</option>
          <option value="developer">開発者</option>
          <option value="designer">デザイナー</option>
          <option value="marketer">マーケター</option>
          <option value="investor">投資家</option>
          <option value="other">その他</option>
        </select>
      </div>

      {/* エラーメッセージ */}
      {apiError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md" role="alert">
          <p className="text-sm text-red-600">{apiError}</p>
        </div>
      )}

      {/* 送信ボタン */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? '送信中...' : '登録'}
      </Button>
    </form>
  )
}