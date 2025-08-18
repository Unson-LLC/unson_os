import React from 'react'
import { cn } from '@/lib/utils'
import { TemplateConfig } from '@/types/template'
import { ArrowRight, CheckCircle } from 'lucide-react'

interface FinalCtaSectionProps {
  config: TemplateConfig['content']['finalCta']
  onCta?: () => void
}

export default function FinalCtaSection({ config, onCta }: FinalCtaSectionProps) {
  return (
    <section className="section-padding gradient-primary text-white">
      <div className="container-width">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            {config.title}
          </h2>
          
          {config.subtitle && (
            <p className="text-xl mb-8 text-white/90">
              {config.subtitle}
            </p>
          )}
          
          {config.benefitsList && config.benefitsList.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-left max-w-2xl mx-auto">
              {config.benefitsList.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
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
            
            <button
              onClick={onCta}
              className={cn(
                "px-8 py-4 text-lg font-bold rounded-lg",
                "bg-white text-primary hover:bg-gray-100",
                "transition-all transform hover:scale-105 shadow-xl"
              )}
            >
              {config.cta}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}