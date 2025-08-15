'use client'

import { useState } from 'react'
import { Button } from '../ui/Button'
import { Mail, User, Building, MessageSquare, Send, CheckCircle, AlertCircle, Info } from 'lucide-react'

interface ContactFormData {
  name: string
  email: string
  company: string
  inquiryType: string
  message: string
}

interface ContactFormProps {
  defaultType?: string
}

interface FormErrors {
  name?: string
  email?: string
  inquiryType?: string
  message?: string
}

export function ContactForm({ defaultType = '' }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    inquiryType: defaultType,
    message: ''
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

    if (!formData.inquiryType) {
      newErrors.inquiryType = 'お問い合わせ種別を選択してください'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'お問い合わせ内容を入力してください'
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
        company: '',
        inquiryType: defaultType,
        message: ''
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

  if (isSuccess) {
    return (
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200/50 p-8">
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-100">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-green-900 mb-2">
            お問い合わせを受付けました！
          </h3>
          <p className="text-green-700 mb-4">
            24時間以内にご連絡いたします。<br />
            お急ぎの場合は、お電話でもお気軽にお問い合わせください。
          </p>
          <Button
            onClick={() => setIsSuccess(false)}
            variant="outline"
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            新しいお問い合わせを送信
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
          {/* 会社名 */}
          <div className="group">
            <label htmlFor="company" className="block text-sm font-semibold text-gray-900 mb-2">
              会社名・組織名
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Building className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
              </div>
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                placeholder="株式会社サンプル"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 bg-white 
                  transition-all duration-200 placeholder:text-gray-400 focus:outline-none 
                  focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-gray-300"
              />
            </div>
          </div>

          {/* お問い合わせ種別 */}
          <div className="group">
            <label htmlFor="inquiryType" className="block text-sm font-semibold text-gray-900 mb-2">
              お問い合わせ種別 *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MessageSquare className={`h-5 w-5 transition-colors ${
                  errors.inquiryType ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-500'
                }`} />
              </div>
              <select
                id="inquiryType"
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 
                  focus:outline-none focus:ring-4 focus:ring-blue-500/20 appearance-none cursor-pointer
                  ${errors.inquiryType 
                    ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500' 
                    : 'border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500'
                  }`}
              >
                <option value="">選択してください</option>
                <option value="general">一般的なお問い合わせ</option>
                <option value="product">プロダクト・サービス</option>
                <option value="custom-product">カスタムプロダクト開発</option>
                <option value="partnership">パートナーシップ・提携</option>
                <option value="media">メディア・取材</option>
                <option value="career">採用・求人</option>
                <option value="dao">DAO・投資関連</option>
                <option value="support">技術サポート</option>
              </select>
            </div>
            {errors.inquiryType && (
              <div className="flex items-center mt-2 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 mr-1.5" />
                {errors.inquiryType}
              </div>
            )}
          </div>
        </div>
        
        {/* お問い合わせ内容 */}
        <div className="group">
          <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
            お問い合わせ内容 *
          </label>
          <div className="relative">
            <textarea
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              placeholder="お問い合わせ内容をできるだけ詳しくお書きください。

• 現在の課題やお困りのこと
• 期待する結果や目標
• 予算・時期などの要件
• その他ご質問やご要望

などをご記入いただけますと、より適切な回答をご提供できます。"
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
        
        {/* プライバシー情報 */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 p-6 rounded-xl">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Info className="w-6 h-6 text-blue-600 mt-0.5" />
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                個人情報の取り扱いについて
              </h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                お預かりした個人情報は、お問い合わせへの回答およびサービス向上のためにのみ使用し、
                適切に管理いたします。第三者への提供は一切行いません。
                詳細は<a href="/privacy" className="underline hover:no-underline">プライバシーポリシー</a>をご確認ください。
              </p>
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
                  お問い合わせを送信
                </>
              )}
            </div>
          </Button>
        </div>
      </form>
    </div>
  )
}