import React from 'react'
import { TemplateConfig } from '@/types/template'
import * as Icons from 'lucide-react'
import FormSection from '@/components/sections/FormSection'

interface FinalCtaSectionProps {
  config: TemplateConfig['content']['finalCta']
  onCta?: () => void
  formConfig?: TemplateConfig['content']['form']
  onFormSubmit?: (data: Record<string, string>) => void
  prefill?: Record<string, string>
}

export default function FinalCtaSection({ config, onCta, formConfig, onFormSubmit, prefill }: FinalCtaSectionProps) {
  return (
    <section className="section-padding gradient-primary text-white">
      <div className="container-width">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            {config.title}
          </h2>
          
          {config.subtitle && (
            <p className="text-xl mb-8 text白/90">
              {config.subtitle}
            </p>
          )}
          
          {config.benefitsList && config.benefitsList.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left max-w-2xl mx-auto">
              {config.benefitsList.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <Icons.CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex flex-col items-center gap-6">
            {config.urgencyText && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
                <p className="text-lg font-semibold">{config.urgencyText}</p>
              </div>
            )}
            <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-4 sm:p-6 text-left">
              {formConfig && (
                <FormSection compact config={formConfig} onSubmit={onFormSubmit} prefill={prefill} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
