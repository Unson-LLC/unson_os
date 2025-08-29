import { LPGeneratorForm } from '@/components/LPGenerator/LPGeneratorForm'

export default function GeneratorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            LP Generator
          </h1>
          <p className="text-gray-600">
            AI支援による高速ランディングページ生成システム
          </p>
        </div>
        
        <LPGeneratorForm />
      </div>
    </div>
  )
}