// LP Suite 統合システム ルートレイアウト
import { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/Toast';
import { Navigation } from '@/components/shared/Navigation';

export const metadata: Metadata = {
  title: 'LP Suite | Unson OS',
  description: '生成・検証・最適化の完全自動化 - LP Generator + LP Validation統合システム',
  keywords: [
    'LP Suite',
    'LP生成',
    'LP検証',
    'ランディングページ',
    'A/Bテスト',
    'Google Ads',
    'PostHog',
    '自動最適化',
    'SaaS',
    'MVP',
    '統合管理'
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
          <Navigation />
          <main className="pt-16">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}