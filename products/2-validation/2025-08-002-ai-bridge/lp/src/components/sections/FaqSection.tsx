import React from 'react'

interface FaqItem { question: string; answer: string }

interface FaqSectionProps {
  config: {
    title?: string
    subtitle?: string
    items: FaqItem[]
  }
}

export default function FaqSection({ config }: FaqSectionProps) {
  return (
    <section className="section-padding bg-white">
      <div className="container-width">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{config.title || 'よくある質問'}</h2>
          {config.subtitle && (
            <p className="text-gray-600 max-w-2xl mx-auto">{config.subtitle}</p>
          )}
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-gray-200">
          {config.items.map((item, idx) => (
            <div key={idx} className="py-5">
              <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
              <p className="text-gray-700 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

