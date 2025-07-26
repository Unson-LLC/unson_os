'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Mail, User, MessageSquare, Code, Target, Loader } from 'lucide-react'

interface FormData {
  email: string
  name: string
  reasons: string[]
  otherReason: string
  skills: string
  expectations: string
}

interface DiscordJoinFormProps {
  onClose?: () => void
}

export function DiscordJoinForm({ onClose }: DiscordJoinFormProps) {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    name: '',
    reasons: [],
    otherReason: '',
    skills: '',
    expectations: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const reasonOptions = [
    { id: 'saas', label: 'SaaS開発に興味がある', icon: Code },
    { id: 'ai', label: 'AI活用ビジネスに興味がある', icon: Target },
    { id: 'dao', label: 'DAOコミュニティに興味がある', icon: User },
    { id: 'revenue', label: '収益分配モデルに興味がある', icon: Mail },
    { id: 'other', label: 'その他', icon: MessageSquare }
  ]

  const handleReasonToggle = (reasonId: string) => {
    setFormData(prev => ({
      ...prev,
      reasons: prev.reasons.includes(reasonId)
        ? prev.reasons.filter(id => id !== reasonId)
        : [...prev.reasons, reasonId]
    }))
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
          expectations: ''
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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Unson OS Discordコミュニティ参加申請
        </h2>
        <p className="text-gray-600">
          コミュニティ参加に関する情報をお聞かせください。
          承認後、Discord招待リンクをメールでお送りします。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="田中太郎"
            />
          </div>
        </div>

        {/* 参加理由 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            参加理由（複数選択可） <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {reasonOptions.map((reason) => {
              const Icon = reason.icon
              return (
                <label
                  key={reason.id}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    formData.reasons.includes(reason.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.reasons.includes(reason.id)}
                    onChange={() => handleReasonToggle(reason.id)}
                    className="sr-only"
                  />
                  <Icon className="w-5 h-5 mr-3 text-gray-600" />
                  <span className="flex-1">{reason.label}</span>
                  {formData.reasons.includes(reason.id) && (
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </label>
              )
            })}
          </div>
          
          {formData.reasons.includes('other') && (
            <div className="mt-3">
              <textarea
                value={formData.otherReason}
                onChange={(e) => setFormData(prev => ({ ...prev, otherReason: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="その他の理由を詳しくお聞かせください"
              />
            </div>
          )}
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="例: フロントエンド開発3年、React/TypeScript、SaaS立ち上げ経験あり"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Unson OSプロジェクトに期待することや、どのように関わりたいかをお聞かせください"
          />
        </div>

        {/* 送信ステータス */}
        {submitStatus === 'success' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">
              申請を受け付けました！Discord招待リンクを記載したメールをお送りしますので、しばらくお待ちください。
            </p>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">
              送信中にエラーが発生しました。しばらく経ってから再度お試しください。
            </p>
          </div>
        )}

        {/* 送信ボタン */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting || formData.reasons.length === 0}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                送信中...
              </>
            ) : (
              '参加申請を送信'
            )}
          </Button>
          {onClose && (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
          )}
        </div>

        <p className="text-xs text-gray-500 text-center">
          送信された情報は、コミュニティ運営のためにのみ使用されます。
        </p>
      </form>
    </div>
  )
}