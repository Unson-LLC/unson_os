import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { TemplateConfig } from '@/types/template'
import { trackFormSubmission, trackCTAClick } from '@/components/Analytics/Analytics'

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
      // Honeypot check (bot likely)
      if (formData.website) {
        throw new Error('送信に失敗しました')
      }

      const response = await fetch('https://unsonos-api.vercel.app/api/service-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId: process.env.NEXT_PUBLIC_DEFAULT_WORKSPACE_ID || 'unson_main',
          serviceName: 'ai-bridge',
          email: formData.email || '',
          name: formData.name || '',
          formData,
          source: 'LP-ai-bridge',
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || '送信に失敗しました')
      }
      
      // フォーム送信成功イベントを追跡
      trackFormSubmission('ai-bridge', 'contact')
      
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
          <div className="text-center mb-6 bg-white/95 backdrop-blur rounded-xl p-5 shadow">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">
              {config.title}
            </h2>
            {config.subtitle && (
              <p className="text-base sm:text-lg text-gray-700">
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
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8" noValidate>
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
                      <div role="radiogroup" aria-labelledby={`${field.name}-label`}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {field.options.map((option, optIndex) => {
                            const selected = (formData[field.name] || '') === option
                            return (
                              <button
                                key={optIndex}
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                onClick={() => handleChange(field.name, option)}
                                className={cn(
                                  'text-left px-4 py-3 rounded-lg border',
                                  selected ? 'bg-primary text-white border-primary' : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
                                )}
                              >
                                {option}
                              </button>
                            )
                          })}
                        </div>
                      </div>
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
                {/* Honeypot field */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    autoComplete="off"
                    tabIndex={-1}
                    value={formData.website || ''}
                    onChange={(e) => handleChange('website', e.target.value)}
                  />
                </div>
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
