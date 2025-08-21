// /tradingルートから/にリダイレクト
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TradingRedirect() {
  const router = useRouter();

  useEffect(() => {
    // メインページにリダイレクト
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">リダイレクト中...</h1>
        <p className="text-gray-600">FXトレーディング風UIはメインページに移動されました</p>
      </div>
    </div>
  );
}