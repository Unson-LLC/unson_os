'use client'

import React, { useState, useEffect } from 'react'
import { TemplateConfig } from '@/types/template'
import { TemplateEngine } from '@/lib/template-engine'
import { ThemeGenerator } from '@/lib/theme-generator'
import HeroSection from '@/components/sections/HeroSection'
import ProblemSection from '@/components/sections/ProblemSection'
import SolutionSection from '@/components/sections/SolutionSection'
import ServiceSection from '@/components/sections/ServiceSection'
import PricingSection from '@/components/sections/PricingSection'
import FinalCtaSection from '@/components/sections/FinalCtaSection'
import FooterSection from '@/components/sections/FooterSection'
import FaqSection from '@/components/sections/FaqSection'
import { trackCTAClick, trackFormSubmission } from '@/components/Analytics/Analytics'
import posthog from 'posthog-js'

interface LandingPageTemplateProps {
  config: TemplateConfig
}

export default function LandingPageTemplate({ config }: LandingPageTemplateProps) {
  const [prefill, setPrefill] = useState<Record<string, string>>({})
  const engine = new TemplateEngine(config)

  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = engine.generateCSSVariables()
    document.head.appendChild(style)

    const fontLink = document.createElement('link')
    fontLink.href = ThemeGenerator.getGoogleFontUrl(config.theme.fonts)
    fontLink.rel = 'stylesheet'
    document.head.appendChild(fontLink)

    return () => {
      document.head.removeChild(style)
      document.head.removeChild(fontLink)
    }
  }, [config, engine])

  const handleCta = () => {
    try {
      trackCTAClick(process.env.NEXT_PUBLIC_SERVICE_NAME || 'ai-bridge', 'primary')
      posthog.capture('lp.cta_click', { label: 'primary' })
    } catch (e) {
      // no-op
    }
    setTimeout(() => {
      document.getElementById('hero-survey')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 50)
  }

  const handleFormSubmit = async (data: Record<string, string>) => {
    console.log('Form submitted:', data)
    try {
      trackFormSubmission(process.env.NEXT_PUBLIC_SERVICE_NAME || 'ai-bridge', 'beta_signup')
      posthog.capture('lp.form_submit', { fields: Object.keys(data).length })
    } catch (e) {
      // no-op
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <HeroSection 
        config={config.content.hero}
        formConfig={config.content.form}
        onFormSubmit={handleFormSubmit}
        prefill={prefill}
        onLearnMore={() => document.getElementById('service')?.scrollIntoView({ behavior: 'smooth' })}
      />
      
      <ProblemSection 
        config={config.content.problem}
      />
      
      <SolutionSection 
        config={config.content.solution}
      />
      
      <ServiceSection 
        config={config.content.service}
      />
      
      {config.content.pricing && (
        <PricingSection 
          config={config.content.pricing}
          onCta={handleCta}
        />
      )}
      
      {config.content.faq && (
        <FaqSection config={config.content.faq} />
      )}

      <FinalCtaSection 
        config={config.content.finalCta}
        onCta={handleCta}
        formConfig={config.content.form}
        onFormSubmit={handleFormSubmit}
        prefill={prefill}
      />
      
      <FooterSection 
        config={config.content.footer}
      />
    </main>
  )
}
