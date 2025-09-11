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
import Analytics from '@/components/Analytics/Analytics'
import PostHogProvider from '@/components/Analytics/PostHogProvider'
import ScrollTracker from '@/components/Analytics/ScrollTracker'
import ContextualTips from '@/components/CopywritingGuidance/ContextualTips'

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

  // 開発者モード設定
  const devSettings = config.settings?.development || {}
  const showTips = devSettings.showCopywritingTips || false
  const tipsPosition = devSettings.copywritingTipsPosition || 'bottom'

  // セクションにコンテキスト別ガイダンスを追加するヘルパー
  const withGuidance = (
    component: React.ReactNode,
    context: 'hero' | 'problem' | 'solution' | 'pricing' | 'cta' | 'form'
  ) => {
    if (!showTips) return component

    const guidance = (
      <ContextualTips 
        context={context} 
        className="mx-auto max-w-4xl mb-4" 
        maxTips={2}
      />
    )

    if (tipsPosition === 'top') {
      return (
        <>
          {guidance}
          {component}
        </>
      )
    } else {
      return (
        <>
          {component}
          {guidance}
        </>
      )
    }
  }

  return (
    <PostHogProvider
      postHogKey={config.settings?.analytics?.postHogKey}
      postHogHost={config.settings?.analytics?.postHogHost}
    >
      <main className="min-h-screen bg-white">
        <Analytics
          serviceName={serviceName || 'unknown'}
          config={config.settings?.analytics}
        />
        <ScrollTracker />
        
        {withGuidance(
          <HeroSection 
            config={config.content.hero}
            assets={config.assets}
            onCta={handleCta}
          />,
          'hero'
        )}
        
        {withGuidance(
          <ProblemSection 
            config={config.content.problem}
            assets={config.assets}
          />,
          'problem'
        )}
        
        {withGuidance(
          <SolutionSection 
            config={config.content.solution}
            assets={config.assets}
          />,
          'solution'
        )}
        
        <ServiceSection 
          config={config.content.service}
          assets={config.assets}
        />
        
        
        <div id="form-section">
          {withGuidance(
            <FormSection 
              config={config.content.form}
              serviceName="eventsync-pro"
              analyticsConfig={config.settings?.analytics}
              onSubmit={handleFormSubmit}
            />,
            'form'
          )}
        </div>
        
        {withGuidance(
          <FinalCtaSection 
            config={config.content.finalCta}
            onCta={handleCta}
          />,
          'cta'
        )}
      
      <FooterSection 
        config={config.content.footer}
      />
      </main>
    </PostHogProvider>
  )
}