import React from 'react'
import { cn } from '@/lib/utils'
import { TemplateConfig } from '@/types/template'
import * as Icons from 'lucide-react'

interface SolutionSectionProps {
  config: TemplateConfig['content']['solution']
}

export default function SolutionSection({ config }: SolutionSectionProps) {
  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.Star
    return <IconComponent className="w-6 h-6" />
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
        
        <div className="max-w-4xl mx-auto mb-12">
          <p className="text-lg text-gray-700 leading-relaxed text-center">
            {config.description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {config.solutions.map((solution, index) => (
            <div 
              key={index}
              className={cn(
                "text-center p-6",
                "animate-slide-up"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {solution.icon && (
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary">
                  {getIcon(solution.icon)}
                </div>
              )}
              
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {solution.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {solution.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}