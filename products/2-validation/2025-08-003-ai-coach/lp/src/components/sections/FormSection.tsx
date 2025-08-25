import React, { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { TemplateConfig } from '@/types/template'
import { useAnalytics } from '@/components/Analytics/PostHogAnalytics'

interface FormSectionProps {
  config: TemplateConfig['content']['form']
  onSubmit?: (data: Record<string, string>) => void
  prefill?: Record<string, string>
}

export default function FormSection({ config, onSubmit, prefill }: FormSectionProps) {
  const [formData, setFormData] = useState<Record<string, string>>(prefill || {})
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { trackEvent } = useAnalytics()

  const mvpIntent = formData['mvp_intent'] || formData['now_feeling'] || ''
  const requiresEmail = useMemo(() => {
    return mvpIntent && mvpIntent !== '今は様子見'
  }, [mvpIntent])

  React.useEffect(() => {
    if (prefill && Object.keys(prefill).length) {
      setFormData(prev => ({ ...prefill, ...prev }))
    }
  }, [prefill])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // 条件付きメール必須: 「今は様子見」以外はメールが必要
      const intent = (formData['mvp_intent'] || formData['now_feeling'] || '').toString()
      const requiresEmail = intent && intent !== '今は様子見'
      if (requiresEmail && !formData.email) {
        setIsSubmitting(false)
        setError('先行案内にはメールが必要です。メールアドレスをご入力ください。')
        return
      }
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
      
      trackEvent('survey_submit', {
        location: 'form',
        value: formData['mvp_intent'] || formData['now_feeling'] || '',
        email: !!formData['email']
      })
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
              <p className="text-green-700 mt-2 text-sm">
                先行案内に同意いただいた方には、準備ができ次第メールでご連絡します。
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
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
                      className="block text-sm font-medium text-gray-800 mb-2"
                    >
                      {field.name === 'email' ? (
                        <>
                          {field.label}
                          <span className={cn('ml-1', requiresEmail ? 'text-red-500' : 'text-gray-400')}>
                            {requiresEmail ? '（必須）' : '（任意）'}
                          </span>
                        </>
                      ) : (
                        <>
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </>
                      )}
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
                                onClick={() => {
                                  handleChange(field.name, option)
                                  trackEvent('survey_q1_select', { field: field.name, value: option })
                                }}
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
                        {field.name === 'mvp_intent' && (
                          <p className="text-xs text-gray-700 mt-2">
                            メール{requiresEmail ? '必須（先行案内のため）' : 'は任意'}／しつこい連絡なし
                          </p>
                        )}
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.name === 'email' ? requiresEmail : field.required}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 placeholder:text-gray-400"
                      />
                    )}
                  </div>
                ))}
              </div>
              
              {config.privacyText && (
                <p className="mt-4 text-sm text-gray-700">
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
