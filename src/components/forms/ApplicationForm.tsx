'use client'

import { useState } from 'react'
import { Button } from '../ui/Button'

interface ApplicationFormData {
  name: string
  email: string
  position: string
  experience: string
  portfolio: string
  motivation: string
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('応募を受け付けました。ご連絡をお待ちください。')
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
          <label className="block text-sm font-medium text-blue-100 mb-2">
            お名前 *
          </label>
          <input
            type="text"
            name="name"
            placeholder="山田太郎"
            className="w-full px-4 py-3 rounded-lg border border-blue-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-blue-100 mb-2">
            メールアドレス *
          </label>
          <input
            type="email"
            name="email"
            placeholder="yamada@example.com"
            className="w-full px-4 py-3 rounded-lg border border-blue-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-blue-100 mb-2">
            応募職種 *
          </label>
          <select
            name="position"
            className="w-full px-4 py-3 rounded-lg border border-blue-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            value={formData.position}
            onChange={handleChange}
            required
          >
            <option value="">選択してください</option>
            <option value="frontend">フロントエンドエンジニア</option>
            <option value="backend">バックエンドエンジニア</option>
            <option value="fullstack">フルスタックエンジニア</option>
            <option value="ai">AI/ML エンジニア</option>
            <option value="devops">DevOps エンジニア</option>
            <option value="product">プロダクトマネージャー</option>
            <option value="design">UI/UX デザイナー</option>
            <option value="other">その他</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-blue-100 mb-2">
            経験年数 *
          </label>
          <select
            name="experience"
            className="w-full px-4 py-3 rounded-lg border border-blue-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            value={formData.experience}
            onChange={handleChange}
            required
          >
            <option value="">選択してください</option>
            <option value="0-1">0-1年</option>
            <option value="2-3">2-3年</option>
            <option value="4-5">4-5年</option>
            <option value="6-10">6-10年</option>
            <option value="10+">10年以上</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-blue-100 mb-2">
          ポートフォリオ・GitHub URL
        </label>
        <input
          type="url"
          name="portfolio"
          placeholder="https://github.com/username または https://portfolio.example.com"
          className="w-full px-4 py-3 rounded-lg border border-blue-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          value={formData.portfolio}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-blue-100 mb-2">
          志望動機・自己PR *
        </label>
        <textarea
          name="motivation"
          rows={6}
          placeholder="Unson OSに興味を持った理由、これまでの経験、今後やりたいことなどをお書きください。"
          className="w-full px-4 py-3 rounded-lg border border-blue-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
          value={formData.motivation}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="bg-blue-500 bg-opacity-20 p-4 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-200 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-100">
            <strong>応募についてのご注意</strong><br />
            ご提供いただいた情報は採用選考のためにのみ使用し、第三者に提供することはございません。
            選考プロセスや結果に関わらず、すべての応募者に対して2週間以内にご連絡いたします。
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <Button 
          type="submit" 
          size="lg" 
          className="bg-white text-blue-600 hover:bg-blue-50 px-12"
        >
          応募する
        </Button>
      </div>
    </form>
  )
}