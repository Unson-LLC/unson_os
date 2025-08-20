// LP検証システム ルートレイアウト
import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LP検証システム | Unson OS',
  description: 'ランディングページのパフォーマンス分析とA/Bテスト管理システム',
  keywords: [
    'LP検証',
    'ランディングページ',
    'A/Bテスト',
    'Google Ads',
    '自動最適化',
    'SaaS',
    'MVP'
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        {/* グローバルナビゲーション */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-unson-blue">
                  LP検証システム
                </h1>
                
                {/* タブナビゲーション */}
                <div className="hidden md:flex space-x-8">
                  <a
                    href="/"
                    className="text-gray-500 hover:text-unson-blue px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    ダッシュボード
                  </a>
                  <a
                    href="/sessions"
                    className="text-gray-500 hover:text-unson-blue px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    セッション管理
                  </a>
                  <a
                    href="/analytics"
                    className="text-gray-500 hover:text-unson-blue px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    分析レポート
                  </a>
                  <a
                    href="/settings"
                    className="text-gray-500 hover:text-unson-blue px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    設定
                  </a>
                </div>
              </div>
              
              {/* ステータス表示 */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-unson-green rounded-full animate-pulse-slow"></div>
                  <span className="text-sm text-gray-600">システム正常</span>
                </div>
              </div>
            </div>
          </div>
        </nav>
        
        {/* メインコンテンツ */}
        <main className="flex-1">
          {children}
        </main>
        
        {/* フッター */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                © 2024 Unson LLC - LP検証システム v1.0.0
              </p>
              <div className="flex space-x-4 text-sm text-gray-500">
                <a href="/docs" className="hover:text-unson-blue transition-colors">
                  ドキュメント
                </a>
                <a href="/support" className="hover:text-unson-blue transition-colors">
                  サポート
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}