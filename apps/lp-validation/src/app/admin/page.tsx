'use client';

import React, { useState } from 'react';

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const seedSampleData = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/seed-sample-data', {
        method: 'POST',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage(`✅ ${result.message}`);
      } else {
        setMessage(`❌ エラー: ${result.message}`);
      }
    } catch (error) {
      setMessage(`❌ 通信エラー: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAllData = async () => {
    if (!confirm('全てのセッションデータを削除しますか？この操作は取り消せません。')) {
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/seed-sample-data', {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage(`✅ ${result.message}`);
      } else {
        setMessage(`❌ エラー: ${result.message}`);
      }
    } catch (error) {
      setMessage(`❌ 通信エラー: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">管理者ページ</h1>
        
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">データ管理</h2>
          
          <div className="space-y-4">
            <div>
              <button
                onClick={seedSampleData}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed mr-4"
              >
                {isLoading ? '作成中...' : '正式サービス名でサンプルデータ作成'}
              </button>
              
              <button
                onClick={deleteAllData}
                disabled={isLoading}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {isLoading ? '削除中...' : '全セッションデータ削除'}
              </button>
            </div>
            
            {message && (
              <div className="p-4 rounded-lg bg-gray-100 text-gray-800 font-mono text-sm">
                {message}
              </div>
            )}
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-900 mb-2">操作手順</h3>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
              <li>まず「全セッションデータ削除」で古いデータを削除</li>
              <li>「正式サービス名でサンプルデータ作成」で新しいデータを作成</li>
              <li>ダッシュボードに戻って表示を確認</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}