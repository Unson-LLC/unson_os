'use client'

import { useState } from 'react'
import { Button } from '../ui/Button'
import { Mail, User, Briefcase, Clock, Link, FileText, Send, CheckCircle, AlertCircle, Star, Users } from 'lucide-react'

interface ApplicationFormData {
  name: string
  email: string
  position: string
  experience: string
  portfolio: string
  motivation: string
}

interface FormErrors {
  name?: string
  email?: string
  position?: string
  experience?: string
  motivation?: string
}

export function ApplicationForm() {
  const [formData, setFormData] = useState<ApplicationFormData>({
    name: '',
    email: '',
    position: '',
    experience: '',
    portfolio: '',
    motivation: ''
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

    if (!formData.position) {
      newErrors.position = '応募職種を選択してください'
    }

    if (!formData.experience) {
      newErrors.experience = '経験年数を選択してください'
    }

    if (!formData.motivation.trim()) {
      newErrors.motivation = '志望動機・自己PRを入力してください'
    } else if (formData.motivation.trim().length < 50) {
      newErrors.motivation = '50文字以上入力してください'
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
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSuccess(true)
      setFormData({
        name: '',
        email: '',
        position: '',
        experience: '',
        portfolio: '',
        motivation: ''
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
            応募を受付けました！
          </h3>
          <p className="text-green-700 mb-4">
            採用チームにて内容を確認し、2週間以内にご連絡いたします。<br />
            すべての応募に対して必ずお返事させていただきます。
          </p>
          <div className="bg-green-100 rounded-lg p-4 mt-6">
            <p className="text-sm text-green-800">
              <span className="font-semibold">次のステップ：</span><br />
              書類選考 → 技術面接 → チーム面接 → 最終面接
            </p>
          </div>
          <Button
            onClick={() => setIsSuccess(false)}
            variant="outline"
            className="border-green-200 text-green-700 hover:bg-green-50 mt-4"
          >
            新しい応募を送信
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
            <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
              お名前 *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className={`h-5 w-5 transition-colors ${
                  errors.name ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-400'
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
                  placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400/20
                  ${errors.name 
                    ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-400' 
                    : 'border-blue-300 bg-white text-gray-900 hover:border-blue-400 focus:border-blue-400'
                  }`}
              />
            </div>
            {errors.name && (
              <div className="flex items-center mt-2 text-sm text-red-300">
                <AlertCircle className="w-4 h-4 mr-1.5" />
                {errors.name}
              </div>
            )}
          </div>
          
          {/* メールアドレス */}
          <div className="group">
            <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
              メールアドレス *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className={`h-5 w-5 transition-colors ${
                  errors.email ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-400'
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
                  placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400/20
                  ${errors.email 
                    ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-400' 
                    : 'border-blue-300 bg-white text-gray-900 hover:border-blue-400 focus:border-blue-400'
                  }`}
              />
            </div>
            {errors.email && (
              <div className="flex items-center mt-2 text-sm text-red-300">
                <AlertCircle className="w-4 h-4 mr-1.5" />
                {errors.email}
              </div>
            )}
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* 応募職種 */}
          <div className="group">
            <label htmlFor="position" className="block text-sm font-semibold text-white mb-2">
              応募職種 *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Briefcase className={`h-5 w-5 transition-colors ${
                  errors.position ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-400'
                }`} />
              </div>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 
                  focus:outline-none focus:ring-4 focus:ring-blue-400/20 appearance-none cursor-pointer
                  ${errors.position 
                    ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-400' 
                    : 'border-blue-300 bg-white text-gray-900 hover:border-blue-400 focus:border-blue-400'
                  }`}
              >
                <option value="">選択してください</option>
                <option value="frontend">💻 フロントエンドエンジニア</option>
                <option value="backend">⚙️ バックエンドエンジニア</option>
                <option value="fullstack">🌐 フルスタックエンジニア</option>
                <option value="ai">🤖 AI/ML エンジニア</option>
                <option value="devops">🔧 DevOps エンジニア</option>
                <option value="product">📊 プロダクトマネージャー</option>
                <option value="design">🎨 UI/UX デザイナー</option>
                <option value="business">💼 ビジネス開発</option>
                <option value="other">❓ その他</option>
              </select>
            </div>
            {errors.position && (
              <div className="flex items-center mt-2 text-sm text-red-300">
                <AlertCircle className="w-4 h-4 mr-1.5" />
                {errors.position}
              </div>
            )}
          </div>
          
          {/* 経験年数 */}
          <div className="group">
            <label htmlFor="experience" className="block text-sm font-semibold text-white mb-2">
              経験年数 *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Clock className={`h-5 w-5 transition-colors ${
                  errors.experience ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-400'
                }`} />
              </div>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 
                  focus:outline-none focus:ring-4 focus:ring-blue-400/20 appearance-none cursor-pointer
                  ${errors.experience 
                    ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-400' 
                    : 'border-blue-300 bg-white text-gray-900 hover:border-blue-400 focus:border-blue-400'
                  }`}
              >
                <option value="">選択してください</option>
                <option value="0-1">🌱 0-1年（新卒・未経験歓迎）</option>
                <option value="2-3">📈 2-3年（基礎を身につけた段階）</option>
                <option value="4-5">🚀 4-5年（チームリーダー経験）</option>
                <option value="6-10">⭐ 6-10年（シニアレベル）</option>
                <option value="10+">👑 10年以上（エキスパート）</option>
              </select>
            </div>
            {errors.experience && (
              <div className="flex items-center mt-2 text-sm text-red-300">
                <AlertCircle className="w-4 h-4 mr-1.5" />
                {errors.experience}
              </div>
            )}
          </div>
        </div>
        
        {/* ポートフォリオ */}
        <div className="group">
          <label htmlFor="portfolio" className="block text-sm font-semibold text-white mb-2">
            ポートフォリオ・GitHub URL
            <span className="text-blue-300 text-xs ml-2">（任意）</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Link className="h-5 w-5 text-gray-400 group-focus-within:text-blue-400" />
            </div>
            <input
              id="portfolio"
              name="portfolio"
              type="url"
              value={formData.portfolio}
              onChange={handleChange}
              placeholder="https://github.com/username または https://portfolio.example.com"
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-blue-300 bg-white text-gray-900 
                transition-all duration-200 placeholder:text-gray-400 focus:outline-none 
                focus:ring-4 focus:ring-blue-400/20 focus:border-blue-400 hover:border-blue-400"
            />
          </div>
          <p className="mt-2 text-xs text-blue-300">
            💡 GitHub、個人サイト、Behance、Dribbbleなど、あなたの作品がわかるURLをお教えください
          </p>
        </div>
        
        {/* 志望動機 */}
        <div className="group">
          <label htmlFor="motivation" className="block text-sm font-semibold text-white mb-2">
            志望動機・自己PR *
          </label>
          <div className="relative">
            <div className="absolute top-4 left-4 pointer-events-none">
              <FileText className={`h-5 w-5 transition-colors ${
                errors.motivation ? 'text-red-400' : 'text-gray-400 group-focus-within:text-blue-400'
              }`} />
            </div>
            <textarea
              id="motivation"
              name="motivation"
              rows={6}
              value={formData.motivation}
              onChange={handleChange}
              placeholder="UnsonOSに興味を持った理由、これまでの経験、今後やりたいことなどをお書きください。

【記載をお願いしたい内容】
• UnsonOSに興味を持った理由
• これまでの技術経験や実績
• チームでの協働経験
• 今後挑戦したいこと
• その他アピールポイント

あなたの想いやビジョンを、ぜひお聞かせください！"
              className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-200 
                placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400/20 resize-none
                ${errors.motivation 
                  ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-400' 
                  : 'border-blue-300 bg-white text-gray-900 hover:border-blue-400 focus:border-blue-400'
                }`}
            />
          </div>
          {errors.motivation && (
            <div className="flex items-center mt-2 text-sm text-red-300">
              <AlertCircle className="w-4 h-4 mr-1.5" />
              {errors.motivation}
            </div>
          )}
          <div className="mt-2 text-xs text-blue-300 flex items-center">
            <FileText className="w-3 h-3 mr-1" />
            {formData.motivation.length}/1000文字 (最低50文字)
          </div>
        </div>
        
        {/* 応募情報 */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 bg-opacity-20 border border-blue-400/30 p-6 rounded-xl">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Users className="w-6 h-6 text-blue-200 mt-0.5" />
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-semibold text-blue-100 mb-3 flex items-center">
                <Star className="w-4 h-4 mr-2" />
                UnsonOSで一緒に働きませんか？
              </h4>
              <div className="space-y-2 text-sm text-blue-100">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
                  <span><strong>選考プロセス</strong>：書類選考 → 技術面接 → チーム面接 → 最終面接</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
                  <span><strong>結果連絡</strong>：すべての応募者に2週間以内にご連絡</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
                  <span><strong>個人情報</strong>：採用選考のためにのみ使用、第三者提供なし</span>
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
            className="px-12 py-4 rounded-xl bg-white text-blue-600 hover:bg-blue-50 focus:ring-4 
              focus:ring-white/20 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed
              transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
              font-semibold shadow-lg hover:shadow-xl disabled:shadow-md"
          >
            <div className="flex items-center justify-center">
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mr-2"></div>
                  送信中...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  応募する
                </>
              )}
            </div>
          </Button>
        </div>
      </form>
    </div>
  )
}