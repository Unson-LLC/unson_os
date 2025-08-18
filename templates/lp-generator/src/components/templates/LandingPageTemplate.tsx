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
import FormSection from '@/components/sections/FormSection'
import FinalCtaSection from '@/components/sections/FinalCtaSection'
import FooterSection from '@/components/sections/FooterSection'

interface LandingPageTemplateProps {
  config: TemplateConfig
  serviceName?: string // サービス名を受け取る
}

export default function LandingPageTemplate({ config, serviceName }: LandingPageTemplateProps) {
  const [showForm, setShowForm] = useState(false)
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
    setShowForm(true)
    setTimeout(() => {
      document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const handleFormSubmit = async (data: Record<string, string>) => {
    console.log('Form submitted:', data)
  }

  return (
    <main className="min-h-screen bg-white">
      <HeroSection 
        config={config.content.hero}
        onCta={handleCta}
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
      
      <div id="form-section">
        <FormSection 
          config={config.content.form}
          serviceName={serviceName}
          onSubmit={handleFormSubmit}
        />
      </div>
      
      <FinalCtaSection 
        config={config.content.finalCta}
        onCta={handleCta}
      />
      
      <FooterSection 
        config={config.content.footer}
      />
    </main>
  )
}