import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { ApplicationForm } from '@/components/forms/ApplicationForm'
import { jobPositions, benefits, companyValues } from '@/data/company'
import { Rocket, Scale, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: '採用情報 - Unson OS',
  description: 'Unson OSで一緒に働く仲間を募集しています。革新的なSaaS自動生成プラットフォームのチームに参加して、未来を創造しませんか？',
  openGraph: {
    title: '採用情報 - Unson OS',
    description: 'Unson OSで一緒に働く仲間を募集しています。革新的なSaaS自動生成プラットフォームのチームに参加して、未来を創造しませんか？',
  },
}



const process = [
  {
    step: '1',
    title: '書類選考',
    description: '履歴書・職務経歴書の確認',
    duration: '3-5日'
  },
  {
    step: '2',
    title: '1次面接',
    description: 'オンライン面接（技術・カルチャーフィット）',
    duration: '1-2週間'
  },
  {
    step: '3',
    title: '技術課題',
    description: '実際の業務に近い課題への取り組み',
    duration: '1週間'
  },
  {
    step: '4',
    title: '最終面接',
    description: '創業者・チームリーダーとの面接',
    duration: '1週間'
  },
  {
    step: '5',
    title: '内定・入社',
    description: '条件確認後、入社日調整',
    duration: '2週間'
  }
]


export default function CareersPage() {
  return (
    <div className="min-h-screen">
      <section className="section-padding bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container-custom">
          <div className="text-center animate-fade-in">
            <h1 className="heading-primary text-gray-900 mb-6">
              採用情報
              <span className="block text-blue-600 mt-2">
                一緒に未来を創造しませんか？
              </span>
            </h1>
            <p className="text-large max-w-4xl mx-auto mb-8">
              Unson OSでは、SaaS開発の未来を変える革新的なプラットフォームを
              一緒に構築してくれる仲間を募集しています。
              DAOによる公正な価値分配と、最先端技術への挑戦をしませんか？
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              なぜUnson OSで働くのか
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              従来の会社とは違う、新しい働き方の実現
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="card text-center">
              <Rocket className="w-12 h-12 mb-4 mx-auto text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                革新的技術
              </h3>
              <p className="text-gray-600">
                AI、自動化、DAOなど最先端技術を実際のプロダクトで実践
              </p>
            </div>
            
            <div className="card text-center">
              <Scale className="w-12 h-12 mb-4 mx-auto text-green-600" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                公正な分配
              </h3>
              <p className="text-gray-600">
                貢献に応じたトークン分配により、成果が直接報酬に反映
              </p>
            </div>
            
            <div className="card text-center">
              <Globe className="w-12 h-12 mb-4 mx-auto text-purple-600" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                グローバル影響
              </h3>
              <p className="text-gray-600">
                100-200個のマイクロSaaSを通じて世界中のユーザーに価値提供
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              募集中のポジション
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              あなたのスキルを活かせるポジションを見つけてください
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {jobPositions.map((position, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow duration-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {position.title}
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {position.type}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{position.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">必要経験：</span>
                    <span className="text-sm text-gray-600">{position.experience}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">年収：</span>
                    <span className="text-sm text-gray-600">{position.salary}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700 block mb-2">スキル：</span>
                    <div className="flex flex-wrap gap-1">
                      {position.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              チームの価値観
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              私たちが大切にしている4つの価値観
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              福利厚生
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              働きやすさを重視した充実の福利厚生
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="card text-center">
                <div className="text-3xl mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              応募プロセス
            </h2>
            <p className="text-large max-w-2xl mx-auto text-gray-600">
              透明性の高い選考プロセスで進めます
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {process.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-6">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <span className="text-sm text-blue-600 font-medium">
                        {step.duration}
                      </span>
                    </div>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="apply" className="section-padding bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-6">
              今すぐ応募
            </h2>
            <p className="text-large mb-8 text-blue-100">
              あなたのスキルと情熱を活かして、一緒に未来を創造しませんか？
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <ApplicationForm />
          </div>
        </div>
      </section>
    </div>
  )
}