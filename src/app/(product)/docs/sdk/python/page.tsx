import type { Metadata } from 'next'
import { NavigationLink } from '@/components/ui/NavigationLink'
import { CTASection } from '@/components/sections/CTASection'
import { DocsLayout } from '@/components/layout/DocsLayout'

export const metadata: Metadata = {
  title: 'Python SDK - Unson OS ドキュメント',
  description: 'Unson OS Python SDKの使用方法、API リファレンス、サンプルコード。FastAPI、Django プロジェクトでの実装方法。',
  openGraph: {
    title: 'Python SDK - Unson OS ドキュメント',
    description: 'Unson OS Python SDKの使用方法、API リファレンス、サンプルコード。FastAPI、Django プロジェクトでの実装方法。',
  },
}

export default function PythonSDKPage() {
  const readingTime = '約10分'
  
  return (
    <DocsLayout>
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-blue-50 to-yellow-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Python SDK
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Unson OS Python SDKの使用方法、API リファレンス、サンプルコード。FastAPI、Django プロジェクトでの実装方法。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavigationLink 
                href="#installation" 
                variant="default"
                size="lg"
              >
                インストールガイド
              </NavigationLink>
              <NavigationLink 
                href="#examples" 
                variant="outline"
                size="lg"
              >
                サンプルコード
              </NavigationLink>
            </div>
          </div>
        </div>
      </section>

      {/* インストールセクション */}
      <section id="installation" className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">インストール</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <pre className="text-sm"><code>pip install unson-os</code></pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection
        title="Python SDKで開発を始めましょう"
        subtitle="Unson OS Python SDKで効率的なSaaS開発を実現してください。"
        actions={[
          { label: 'SDKダウンロード', href: '/downloads' },
          { label: 'チュートリアル', href: '/docs/quickstart', variant: 'outline' }
        ]}
        backgroundColor="bg-gradient-to-r from-green-600 to-blue-600"
      />
    </DocsLayout>
  )
}