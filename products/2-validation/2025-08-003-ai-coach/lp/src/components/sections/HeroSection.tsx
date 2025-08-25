import React from 'react'
import { cn } from '@/lib/utils'
import { TemplateConfig } from '@/types/template'
import { useAnalytics } from '@/components/Analytics/PostHogAnalytics'
import FormSection from '@/components/sections/FormSection'

interface HeroSectionProps {
  config: TemplateConfig['content']['hero']
  formConfig: TemplateConfig['content']['form']
  onFormSubmit?: (data: Record<string, string>) => void
  prefill?: Record<string, string>
  onLearnMore?: () => void
}

export default function HeroSection({ config, formConfig, onFormSubmit, prefill, onLearnMore }: HeroSectionProps) {
  const { trackEvent } = useAnalytics()

  React.useEffect(() => {
    trackEvent('hero_view', { location: 'hero' })
    if (config.quickPoints && config.quickPoints.length) {
      trackEvent('quickpoints_view', { count: config.quickPoints.length })
    }
  }, [trackEvent, config.quickPoints])
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: config.backgroundImage ? `url(${config.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {config.backgroundGradient && (
        <div className="absolute inset-0 gradient-primary opacity-80" />
      )}
      {config.backgroundImage && (
        <div className="absolute inset-0 bg-black/50" />
      )}
      
      <div className="relative z-10 container-width text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-snug max-w-3xl mx-auto [text-wrap:balance]" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.5)' }}>
            {config.title}
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto text-left sm:text-center leading-relaxed [text-wrap:pretty]" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.45)' }}>
            {config.subtitle}
          </p>

          {config.quickPoints && config.quickPoints.length > 0 && (
            <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 sm:p-5 max-w-3xl mx-auto text-left shadow-lg mb-6">
              <p className="text-sm font-semibold text-gray-800 mb-2">10秒でわかる要約</p>
              <ul className="list-disc pl-5 text-gray-800 space-y-1 [text-wrap:pretty]">
                {config.quickPoints.map((pt, i) => (
                  <li key={i} className="text-sm">{pt}</li>
                ))}
              </ul>
              <div className="mt-3">
                <button
                  onClick={onLearnMore}
                  className={cn(
                    "px-4 py-2 text-sm font-semibold rounded-lg",
                    "bg-white text-primary hover:bg-gray-100 border border-gray-300"
                  )}
                >
                  くわしく見る（1分）
                </button>
              </div>
            </div>
          )}
          
          <div id="hero-survey" className="max-w-2xl mx-auto">
            <FormSection config={formConfig} onSubmit={onFormSubmit} prefill={prefill} />
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg 
          className="w-6 h-6 text-white opacity-70" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 14l-7 7m0 0l-7-7m7 7V3" 
          />
        </svg>
      </div>
    </section>
  )
}
