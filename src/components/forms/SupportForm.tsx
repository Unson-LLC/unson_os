'use client'

import { useState } from 'react'
import { Button } from '../ui/Button'

interface SupportFormData {
  name: string
  email: string
  category: string
  subject: string
  message: string
  priority: string
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('お問い合わせを受け付けました。24時間以内にご連絡いたします。')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            お名前 *
          </label>
          <input
            type="text"
            name="name"
            placeholder="山田太郎"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            メールアドレス *
          </label>
          <input
            type="email"
            name="email"
            placeholder="yamada@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            お問い合わせカテゴリ *
          </label>
          <select
            name="category"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">カテゴリを選択してください</option>
            <option value="technical">技術的な問題</option>
            <option value="billing">請求・支払い</option>
            <option value="account">アカウント関連</option>
            <option value="feature">機能要望</option>
            <option value="bug">バグ報告</option>
            <option value="integration">連携・API</option>
            <option value="other">その他</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            優先度
          </label>
          <select
            name="priority"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">低</option>
            <option value="normal">通常</option>
            <option value="high">高</option>
            <option value="urgent">緊急</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          件名 *
        </label>
        <input
          type="text"
          name="subject"
          placeholder="問題の概要を簡潔にお書きください"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={formData.subject}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          詳細内容 *
        </label>
        <textarea
          name="message"
          rows={6}
          placeholder="問題の詳細、再現手順、エラーメッセージなどをできるだけ詳しくお書きください。"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          value={formData.message}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-800">
            <strong>サポートについて</strong><br />
            • 通常のお問い合わせ：24時間以内に回答<br />
            • 緊急案件：営業時間内であれば2時間以内に初回対応<br />
            • 技術的な問題の場合は、エラーログやスクリーンショットを添付していただけると迅速な対応が可能です
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <Button 
          type="submit" 
          size="lg" 
          className="px-12"
        >
          送信する
        </Button>
      </div>
    </form>
  )
}