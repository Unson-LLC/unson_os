import React from 'react'
import { cn } from '@/lib/utils'
import { TemplateConfig } from '@/types/template'

interface HeroSectionProps {
  config: TemplateConfig['content']['hero']
  onCta?: () => void
}

export default function HeroSection({ config, onCta }: HeroSectionProps) {
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
      
      <div className="relative z-10 container-width text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
            {config.title}
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            {config.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onCta}
              className={cn(
                "px-8 py-4 text-lg font-semibold rounded-lg",
                "bg-white text-primary hover:bg-gray-100 transition-all",
                "transform hover:scale-105 shadow-xl"
              )}
            >
              {config.cta}
            </button>
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