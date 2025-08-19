import React from 'react'
import { cn } from '@/lib/utils'
import { TemplateConfig } from '@/types/template'
import * as Icons from 'lucide-react'

interface ServiceSectionProps {
  config: TemplateConfig['content']['service']
}

export default function ServiceSection({ config }: ServiceSectionProps) {
  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.Star
    return <IconComponent className="w-8 h-8" />
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {config.services.map((service, index) => (
            <div 
              key={index}
              className={cn(
                "bg-white rounded-xl p-8 shadow-lg",
                "hover:shadow-xl transition-all duration-300",
                "animate-slide-up"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start space-x-4">
                {service.icon && (
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    {getIcon(service.icon)}
                  </div>
                )}
                
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-3 text-gray-800">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Icons.Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}