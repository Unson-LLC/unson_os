import React, { useRef, useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { TemplateConfig } from '@/types/template'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProblemSectionProps {
  config: TemplateConfig['content']['problem']
}

export default function ProblemSection({ config }: ProblemSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
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
    <section className="section-padding bg-gray-50">
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
        
        <div className="max-w-4xl mx-auto mb-12">
          <p className="text-lg text-gray-700 leading-relaxed text-center">
            {config.description}
          </p>
        </div>
        
        {/* デスクトップ版：グリッド表示 */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {config.problems.map((problem, index) => (
            <div 
              key={index}
              className={cn(
                "bg-white rounded-lg p-6 shadow-md",
                "hover:shadow-xl transition-shadow duration-300",
                "animate-slide-up"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {problem.image && (
                <div className="mb-4 h-48 bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={problem.image} 
                    alt={problem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {problem.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        {/* モバイル版：横スクロール */}
        <div className="md:hidden relative">
          {/* 左スクロールボタン */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg"
              aria-label="前へ"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* 右スクロールボタン */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg"
              aria-label="次へ"
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
              msOverflowStyle: 'none'
            }}
          >
            {config.problems.map((problem, index) => (
              <div 
                key={index}
                className="flex-shrink-0 w-[280px] bg-white rounded-lg p-6 shadow-md"
                style={{ scrollSnapAlign: 'start' }}
              >
                {problem.image && (
                  <div className="mb-4 h-40 bg-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={problem.image} 
                      alt={problem.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {problem.title}
                </h3>
                
                <p className="text-sm text-gray-600 leading-relaxed">
                  {problem.description}
                </p>
              </div>
            ))}
          </div>

          {/* インジケーター */}
          <div className="flex justify-center gap-1 mt-4">
            {config.problems.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-gray-300"
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