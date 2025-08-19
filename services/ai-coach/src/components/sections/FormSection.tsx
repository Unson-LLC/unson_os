import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { TemplateConfig } from '@/types/template'

interface FormSectionProps {
  config: TemplateConfig['content']['form']
  onSubmit?: (data: Record<string, string>) => void
}

export default function FormSection({ config, onSubmit }: FormSectionProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Convex API経由で送信
      const response = await fetch('https://unsonos-api.vercel.app/api/service-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId: process.env.NEXT_PUBLIC_DEFAULT_WORKSPACE_ID || 'unson_main',
          serviceName: 'ai-coach',
          email: formData.email || '',
          name: formData.name || '',
          formData,
          source: 'LP-ai-coach',
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || '送信に失敗しました')
      }
      
      onSubmit?.(formData)
      setSubmitted(true)
      setFormData({})
      setTimeout(() => setSubmitted(false), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : '送信中にエラーが発生しました')
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
              <p className="text-green-800 text-lg font-semibold">
                {config.successMessage}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{error}</p>
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
                        value={formData[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      />
                    ) : field.type === 'select' && field.options ? (
                      <select
                        id={field.name}
                        name={field.name}
                        required={field.required}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">選択してください</option>
                        {field.options.map((option, optIndex) => (
                          <option key={optIndex} value={option}>
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
                        value={formData[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    )}
                  </div>
                ))}
              </div>
              
              {config.privacyText && (
                <p className="mt-4 text-sm text-gray-600">
                  {config.privacyText}
                </p>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full mt-6 py-3 px-6 rounded-lg font-semibold",
                  "bg-primary text-white hover:bg-primary/90",
                  "transition-all transform hover:scale-105"
                )}
              >
                {isSubmitting ? '送信中...' : config.submitText}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
