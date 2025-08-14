export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          🚀 UnsonOS Landing Page
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          100個のマイクロSaaS自動生成システム
        </p>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">🎯 システム概要</h2>
            <p className="text-sm text-gray-700">
              100-200個のマイクロSaaSプロダクトを最小限のリソースで効率的に管理
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">⚙️ 管理UI</h2>
            <a 
              href="http://localhost:3001" 
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank" 
              rel="noopener noreferrer"
            >
              管理ダッシュボードを開く (Port 3001)
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}