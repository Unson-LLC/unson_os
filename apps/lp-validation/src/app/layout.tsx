// LP検証システム ルートレイアウト
import { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/Toast';
import MobileNavigation from '@/components/MobileNavigation';

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
        <ToastProvider>
          {children}
          <MobileNavigation />
        </ToastProvider>
      </body>
    </html>
  );
}