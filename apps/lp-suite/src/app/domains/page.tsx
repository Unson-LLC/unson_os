'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Globe, Plus, Settings, Activity, AlertTriangle, 
  CheckCircle, XCircle, RefreshCw, ExternalLink,
  Server, Shield, Clock, DollarSign, Trash2, ChevronLeft
} from 'lucide-react';
import { useToast } from '@/components/Toast';

interface Domain {
  id: string;
  productId: string;
  subdomain: string;
  fqdn: string;
  status: 'active' | 'pending' | 'error';
  vercelProjectId?: string;
  vercelUrl?: string;
  ssl?: {
    enabled: boolean;
    expires?: string;
  };
  health?: {
    healthy: boolean;
    issues: string[];
    lastCheck?: string;
  };
  createdAt: string;
}

export default function DomainManagementPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const toast = useToast();

  // ドメイン一覧取得
  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const response = await fetch('/api/domains');
      const data = await response.json();
      setDomains(data.domains);
    } catch (error) {
      toast.error('エラー', 'ドメイン一覧の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // ヘルスチェック実行
  const checkHealth = async (productId: string) => {
    try {
      const response = await fetch(`/api/domains/${productId}/health`);
      const health = await response.json();
      
      setDomains(prev => prev.map(d => 
        d.productId === productId 
          ? { ...d, health } 
          : d
      ));

      if (health.healthy) {
        toast.success('ヘルスチェック', 'ドメインは正常です');
      } else {
        toast.warning('ヘルスチェック', `${health.issues.length}件の問題が見つかりました`);
      }
    } catch (error) {
      toast.error('エラー', 'ヘルスチェックに失敗しました');
    }
  };

  // ドメイン削除
  const deleteDomain = async (productId: string) => {
    if (!confirm('本当にこのドメインを削除しますか？')) return;

    try {
      const response = await fetch(`/api/domains/${productId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setDomains(prev => prev.filter(d => d.productId !== productId));
        toast.success('削除完了', 'ドメインを削除しました');
      }
    } catch (error) {
      toast.error('エラー', 'ドメインの削除に失敗しました');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
            <CheckCircle className="w-3 h-3" />
            <span>稼働中</span>
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
            <Clock className="w-3 h-3" />
            <span>設定中</span>
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center space-x-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
            <XCircle className="w-3 h-3" />
            <span>エラー</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        
        {/* ヘッダー */}
        <header className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </Link>
                <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  ドメイン管理
                </h1>
              </div>
              <p className="text-gray-600 text-sm ml-12">
                Route53 & Vercel 統合管理システム・全{domains.length}ドメイン
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>新規ドメイン</span>
            </button>
          </div>
        </header>

        {/* 統計情報 */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">総ドメイン数</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {domains.length}
                </p>
              </div>
              <Server className="w-8 h-8 text-gray-400" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">稼働中</p>
                <p className="text-2xl font-semibold text-green-600 mt-1">
                  {domains.filter(d => d.status === 'active').length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">SSL有効</p>
                <p className="text-2xl font-semibold text-blue-600 mt-1">
                  {domains.filter(d => d.ssl?.enabled).length}
                </p>
              </div>
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">月額コスト</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  ¥{(domains.length * 50).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </section>

        {/* ドメインリスト */}
        <section className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              ドメイン一覧
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">
              読み込み中...
            </div>
          ) : domains.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              ドメインがありません
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ドメイン
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SSL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vercel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ヘルス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      作成日
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      アクション
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {domains.map((domain) => (
                    <tr key={domain.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {domain.fqdn}
                            </div>
                            <div className="text-xs text-gray-500">
                              {domain.subdomain}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(domain.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {domain.ssl?.enabled ? (
                          <Shield className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {domain.vercelUrl && (
                          <a
                            href={`https://${domain.vercelUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                          >
                            <span className="text-xs">{domain.vercelUrl}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {domain.health?.healthy ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : domain.health ? (
                          <div className="flex items-center space-x-1">
                            <XCircle className="w-4 h-4 text-red-500" />
                            <span className="text-xs text-red-600">
                              {domain.health.issues.length}件
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">未チェック</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(domain.createdAt).toLocaleDateString('ja-JP')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => checkHealth(domain.productId)}
                            className="text-blue-600 hover:text-blue-900"
                            title="ヘルスチェック"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedDomain(domain)}
                            className="text-gray-600 hover:text-gray-900"
                            title="設定"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteDomain(domain.productId)}
                            className="text-red-600 hover:text-red-900"
                            title="削除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}