import React, { useRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { TemplateConfig } from '@/types/template'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'

interface PricingSectionProps {
  config: TemplateConfig['content']['pricing']
  onCta?: (planName: string) => void
}

export default function PricingSection({ config, onCta }: PricingSectionProps) {
  if (!config) return null

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
      
      // 現在のインデックスを計算
      const cardWidth = 320
      const newIndex = Math.round(scrollLeft / cardWidth)
      setCurrentIndex(newIndex)
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollButtons)
      checkScrollButtons()
      return () => container.removeEventListener('scroll', checkScrollButtons)
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320 // カード幅 + gap
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-width">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {config.title}
          </h2>
          {config.subtitle && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {config.subtitle}
            </p>
          )}
        </div>
        
        {/* デスクトップ版：グリッド表示 */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {config.plans.map((plan, index) => (
            <div 
              key={index}
              className={cn(
                "relative bg-white rounded-2xl shadow-lg p-8",
                "hover:shadow-xl transition-all duration-300",
                "animate-slide-up",
                plan.popular && "ring-2 ring-primary transform scale-105"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                    おすすめ
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                  )}
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => onCta && onCta(plan.name)}
                className={cn(
                  "w-full py-3 px-6 rounded-lg font-semibold transition-all",
                  plan.popular
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                )}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* モバイル版：横スクロール */}
        <div className="md:hidden relative pt-2">
          {/* 左スクロールボタン */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg"
              aria-label="前のプラン"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* 右スクロールボタン */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg"
              aria-label="次のプラン"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* スクロールコンテナ */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              paddingTop: '8px'
            }}
          >
            {config.plans.map((plan, index) => (
              <div 
                key={index}
                className={cn(
                  "relative flex-shrink-0 w-[300px] bg-white rounded-2xl shadow-lg p-6",
                  plan.popular && "ring-2 ring-primary pt-8"
                )}
                style={{ scrollSnapAlign: 'center' }}
              >
                {plan.popular && (
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold inline-block">
                      おすすめ
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-gray-600 ml-1 text-sm">/{plan.period}</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{plan.description}</p>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => onCta && onCta(plan.name)}
                  className={cn(
                    "w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all",
                    plan.popular
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  )}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* インジケーター */}
          <div className="flex justify-center gap-1.5 mt-4">
            {config.plans.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  currentIndex === index 
                    ? "w-6 bg-primary" 
                    : "w-2 bg-gray-300"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* カスタムCSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}