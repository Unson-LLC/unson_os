import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { TemplateConfig } from '@/types/template'
import { trackFormSubmission, trackCTAClick } from '@/components/Analytics/Analytics'
import { trackFormConversion } from '@/components/Analytics/GoogleAdsTracking'

interface FormSectionProps {
  config: TemplateConfig['content']['form']
  onSubmit?: (data: Record<string, string>) => void
  compact?: boolean
}

export default function FormSection({ config, onSubmit, compact = false }: FormSectionProps) {
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
          serviceName: 'mywa',
          email: formData.email || '',
          name: formData.name || '',
          formData,
          source: 'LP-mywa',
        }),
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || '送信に失敗しました')
      }
      
      // フォーム送信成功イベントを追跡
      trackFormSubmission('mywa', 'contact')
      
      // Google Ads コンバージョン送信
      trackFormConversion('mywa')
      
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

  const Wrapper = compact ? ("div" as any) : ("section" as any);
  const wrapperProps = compact ? { className: "" } : { className: "section-padding bg-gray-50" };
  return (
    <Wrapper {...wrapperProps}>
      <div className={compact ? "" : "container-width"} >
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
                        className="input-field resize-none"
                        onChange={(e) => handleChange(field.name, e.target.value)}
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
    </Wrapper>
  )
}
