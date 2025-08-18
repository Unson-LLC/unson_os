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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(formData)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
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
                className={cn(
                  "w-full mt-6 py-3 px-6 rounded-lg font-semibold",
                  "bg-primary text-white hover:bg-primary/90",
                  "transition-all transform hover:scale-105"
                )}
              >
                {config.submitText}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}