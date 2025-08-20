import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { ContactForm } from '@/components/forms/ContactForm'
import { contactMethods, offices } from '@/data/company'

export const metadata: Metadata = {
  title: 'お問い合わせ - Unson OS',
  description: 'Unson OSに関するご質問、ご相談、パートナーシップのお問い合わせは、こちらのフォームからご連絡ください。',
  openGraph: {
    title: 'お問い合わせ - Unson OS',
    description: 'Unson OSに関するご質問、ご相談、パートナーシップのお問い合わせは、こちらのフォームからご連絡ください。',
  },
}


interface ContactPageProps {
  searchParams: { type?: string }
}

export default function ContactPage({ searchParams }: ContactPageProps) {
  const defaultType = searchParams.type || ''

  return (
    <div className="min-h-screen">
      <section className="section-padding bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container-custom">
          <div className="text-center animate-fade-in">
            <h1 className="heading-primary text-gray-900 mb-6">
              お問い合わせ
              <span className="block text-indigo-600 mt-2">
                お気軽にご相談ください
              </span>
            </h1>
            <p className="text-large max-w-3xl mx-auto text-gray-600 mb-8">
              Unson OSに関するご質問、パートナーシップのご相談、カスタムソリューション開発など、
              どのようなお問い合わせでもお気軽にご連絡ください。
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {contactMethods.map((method, index) => (
                <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-indigo-600 text-2xl">{method.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
                  <p className="text-gray-600 text-sm">{method.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">お問い合わせフォーム</h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              下記フォームにご記入いただければ、担当者よりご連絡いたします
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <ContactForm defaultType={defaultType} />
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">営業時間・オフィス情報</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">営業時間</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">平日</span>
                  <span>9:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">土曜日</span>
                  <span>10:00 - 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">日曜・祝日</span>
                  <span className="text-gray-500">休業</span>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  緊急のご相談は、メールにて24時間受け付けております。
                  可能な限り迅速に対応いたします。
                </p>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">オフィス</h3>
              <div className="space-y-6">
                {offices.map((office, index) => (
                  <div key={index}>
                    <h4 className="font-semibold text-lg">{office.name}</h4>
                    <p className="text-gray-600 mt-1">{office.address}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">迅速対応をお約束</h3>
                <p className="text-sm text-gray-600">お問い合わせいただいてから24時間以内にご連絡いたします</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}