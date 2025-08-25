import React from 'react'
import { TemplateConfig } from '@/types/template'
import { useAnalytics } from '@/components/Analytics/PostHogAnalytics'

interface FaqSectionProps {
  config: TemplateConfig['content']['faq']
}

export default function FaqSection({ config }: FaqSectionProps) {
  if (!config) return null
  const { trackEvent } = useAnalytics()
  return (
    <section id="faq" className="section-padding bg-white">
      <div className="container-width">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">{config.title}</h2>
          {config.subtitle && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{config.subtitle}</p>
          )}
        </div>
        <div className="max-w-4xl mx-auto divide-y divide-gray-200 bg-gray-50 rounded-xl">
          {config.items.map((item, i) => (
            <details key={i} className="group p-6" onToggle={(e) => {
              const el = e.currentTarget as HTMLDetailsElement
              if (el.open) trackEvent('faq_open', { index: i, question: item.question })
            }}>
              <summary className="flex cursor-pointer list-none items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 pr-4">{item.question}</h3>
                <span className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-600 group-open:rotate-45 transition-transform">＋</span>
              </summary>
              <div className="mt-3 text-gray-700 leading-relaxed">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
