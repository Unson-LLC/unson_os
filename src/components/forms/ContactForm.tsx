'use client'

import { useState } from 'react'
import { Button } from '../ui/Button'

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

export function ContactForm({ defaultType = '' }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    inquiryType: defaultType,
    message: ''
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
            会社名
          </label>
          <input
            type="text"
            name="company"
            placeholder="株式会社サンプル"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.company}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            お問い合わせ種別 *
          </label>
          <select
            name="inquiryType"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.inquiryType}
            onChange={handleChange}
            required
          >
            <option value="">選択してください</option>
            <option value="general">一般的なお問い合わせ</option>
            <option value="product">プロダクト・サービス</option>
            <option value="custom-product">カスタムプロダクト開発</option>
            <option value="partnership">パートナーシップ</option>
            <option value="media">メディア・取材</option>
            <option value="career">採用・求人</option>
            <option value="dao">DAO・投資関連</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          お問い合わせ内容 *
        </label>
        <textarea
          name="message"
          rows={6}
          placeholder="お問い合わせ内容をできるだけ詳しくお書きください。&#10;&#10;• 現在の課題&#10;• 期待する結果&#10;• 予算・時期などの要件&#10;&#10;などをご記入いただけますと、より適切な回答をご提供できます。"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          value={formData.message}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-800">
            <strong>個人情報の取り扱いについて</strong><br />
            お預かりした個人情報は、お問い合わせへの回答およびサービス向上のためにのみ使用し、第三者に提供することはありません。
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <Button 
          type="submit" 
          size="lg" 
          className="px-12"
        >
          お問い合わせを送信
        </Button>
      </div>
    </form>
  )
}