import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { TemplateConfig } from '@/types/template'

interface FormSectionProps {
  config: TemplateConfig['content']['form']
  serviceName?: string // サービス名を受け取る
  onSubmit?: (data: Record<string, string>) => void
}

export default function FormSection({ config, serviceName, onSubmit }: FormSectionProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // バリデーション
      for (const field of config.fields) {
        if (field.required && !formData[field.name]) {
          throw new Error(`${field.label}は必須項目です`)
        }
      }

      // Convex API経由で送信
      const response = await fetch('/api/service-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId: process.env.NEXT_PUBLIC_DEFAULT_WORKSPACE_ID || 'unson_main',
          serviceName: serviceName || 'unknown',
          email: formData.email,
          name: formData.name,
          formData,
          source: `LP-${serviceName}`,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'エラーが発生しました')
      }

      // 成功処理
      setSubmitted(true)
      onSubmit?.(formData) // 既存のコールバックも呼び出し
      setFormData({}) // フォームリセット
      
      setTimeout(() => setSubmitted(false), 10000) // 10秒間表示

    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <section className="section-padding bg-gray-50">
      <div className="container-width">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {config.title}
            </h2>
            {config.subtitle && (
              <p className="text-lg text-gray-600">
                {config.subtitle}
              </p>
            )}
          </div>
          
          {submitted && config.successMessage ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center animate-fade-in">
              <div className="flex items-center justify-center mb-2">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-800 text-lg font-semibold">
                {config.successMessage}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-6">
                {config.fields.map((field, index) => (
                  <div key={index}>
                    <label 
                      htmlFor={field.name}
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.name}
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        rows={4}
                        className="input-field resize-none"
                        onChange={(e) => handleChange(field.name, e.target.value)}
                      />
                    ) : field.type === 'select' && field.options ? (
                      <select
                        id={field.name}
                        name={field.name}
                        required={field.required}
                        className="input-field"
                        onChange={(e) => handleChange(field.name, e.target.value)}
                      >
                        <option value="">{field.placeholder}</option>
                        {field.options.map((option, optionIndex) => (
                          <option key={optionIndex} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        className="input-field"
                        onChange={(e) => handleChange(field.name, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
              
              {config.privacyText && (
                <p className="text-sm text-gray-600 mt-4">
                  {config.privacyText}
                </p>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full mt-6 py-3 px-6 rounded-lg font-semibold transition-all",
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary/90 transform hover:scale-105"
                )}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    送信中...
                  </div>
                ) : (
                  config.submitText
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}