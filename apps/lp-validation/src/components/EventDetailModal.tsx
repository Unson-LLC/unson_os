// 詳細分析モーダルコンポーネント
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, CheckCircle, AlertTriangle, Zap, Settings, FileText } from 'lucide-react';
import { EventDetails, EventDetailModalProps } from '@/lib/types';
import { isMobileDevice } from '@/lib/utils';
import { MOBILE_BREAKPOINT, MOCK_ACTION_DELAY } from '@/lib/constants';
import { commonStyles, cn } from '@/lib/styles';

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  isOpen,
  eventId,
  details,
  loading = false,
  error,
  onClose,
  onActionApprove
}) => {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // レスポンシブ検知
  useEffect(() => {
    const checkMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      }
    };
    checkMobile();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);

  // ESCキーでモーダルを閉じる
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // フォーカストラップ
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTab = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement?.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement?.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleTab);
      firstElement?.focus();

      return () => {
        document.removeEventListener('keydown', handleTab);
      };
    }
  }, [isOpen, details]);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'S': return 'grade-s text-green-600';
      case 'A': return 'grade-a text-blue-600';
      case 'B': return 'text-yellow-600';
      case 'C': return 'grade-c text-yellow-600';
      case 'D': return 'grade-d text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getChangeIndicator = (current: number, previous: number, isGoodWhenUp = true) => {
    const diff = current - previous;
    const isPositive = isGoodWhenUp ? diff > 0 : diff < 0;
    const color = isPositive ? 'text-green-500' : 'text-red-500';
    const symbol = diff > 0 ? '▲' : diff < 0 ? '▼' : '→';
    
    return (
      <span className={color}>
        ({symbol}{Math.abs(diff).toFixed(1)}{typeof current === 'number' && current < 10 ? '%' : ''})
      </span>
    );
  };

  const handleActionClick = async (action: any, type: string) => {
    if (!onActionApprove) return;
    
    setActionLoading(type);
    try {
      await onActionApprove({ type, ...action });
    } catch (error) {
      // エラーハンドリングは親コンポーネントで実装
    } finally {
      setActionLoading(null);
    }
  };

  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* バックドロップ */}
      <div 
        data-testid="modal-backdrop"
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* モーダル */}
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`fixed inset-0 z-50 overflow-y-auto ${
          isMobile ? 'mobile-modal' : (typeof window !== 'undefined' && window.innerWidth === 768) ? 'tablet-modal' : ''
        }`}
      >
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* ヘッダー */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  aria-label="戻る"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
                  {details ? formatTime(details.timestamp) : ''} 詳細分析
                </h2>
              </div>
            </div>

            {/* コンテンツ */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {error ? (
                <div className="text-red-600 text-center py-8">
                  <div className="mb-4">{error}</div>
                  <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                    再試行
                  </button>
                </div>
              ) : loading || !details ? (
                <div data-testid="detail-loading" className="text-center py-8">
                  <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
                  <div>詳細分析中...</div>
                </div>
              ) : (
                <>
                  {/* AI総評 */}
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🤖 AI総評・推奨アクション</h3>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-4">
                      <div data-testid="performance-grade" className={`text-lg font-semibold ${getGradeColor(details.aiSummary.grade)}`}>
                        📊 パフォーマンス評価: {details.aiSummary.grade}+ (改善必要)
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">【改善推奨事項】</h4>
                        <ul className="space-y-1">
                          {details.aiSummary.recommendations?.map((recommendation, i) => (
                            <li key={i} className="text-sm text-gray-700">• {recommendation}</li>
                          )) || []}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">【推奨対応策】</h4>
                        <div className="space-y-2">
                          {details.suggestedActions?.filter(action => action.priority === 'high').map((action, i) => (
                            <div key={i} className="text-sm">
                              <span className="text-red-600">🔴 緊急:</span> {action.title} ({action.executionTime})
                            </div>
                          )) || []}
                          {details.suggestedActions?.filter(action => action.priority === 'medium').map((action, i) => (
                            <div key={i} className="text-sm">
                              <span className="text-yellow-600">🟡 中期:</span> {action.title} ({action.executionTime})
                            </div>
                          )) || []}
                          {details.suggestedActions?.filter(action => action.priority === 'low').map((action, i) => (
                            <div key={i} className="text-sm">
                              <span className="text-green-600">🟢 長期:</span> {action.title} ({action.executionTime})
                            </div>
                          )) || []}
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <span className="font-medium">【信頼度】</span> {details.aiSummary.confidence}% (高い)
                        <br />
                        <span className="text-gray-600">根拠: {details.aiSummary.rootCause}</span>
                      </div>
                    </div>
                  </section>

                  {/* 基本指標 */}
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 基本指標（前回比較）</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">CVR</div>
                          <div className="font-semibold">
                            {details.metricsComparison?.cvr?.current || 0}% {getChangeIndicator(details.metricsComparison?.cvr?.current || 0, details.metricsComparison?.cvr?.previous || 0)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">CPL</div>
                          <div className="font-semibold">
                            N/A {/* CPLデータは存在しない */}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">訪問者</div>
                          <div className="font-semibold">
                            {details.metricsComparison?.sessions?.current || 0}人 {getChangeIndicator(details.metricsComparison?.sessions?.current || 0, details.metricsComparison?.sessions?.previous || 0)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">成約</div>
                          <div className="font-semibold">
                            {Math.round((details.metricsComparison?.sessions?.current || 0) * (details.metricsComparison?.cvr?.current || 0) / 100)}人
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* 行動詳細テーブル */}
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 行動詳細</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left">時刻</th>
                            <th className="px-4 py-2 text-left">行動</th>
                            <th className="px-4 py-2 text-left">人数</th>
                            <th className="px-4 py-2 text-left">率</th>
                            <th className="px-4 py-2 text-left">AI分析</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {details.userBehavior?.map((behavior, i) => (
                            <tr 
                              key={i}
                              data-testid={`behavior-row-${i}-${behavior.impact?.includes('⚠️') ? 'warning' : behavior.impact?.includes('🔴') ? 'error' : 'normal'}`}
                              className={
                                behavior.impact?.includes('🔴') ? 'bg-red-50' :
                                behavior.impact?.includes('⚠️') ? 'bg-yellow-50' :
                                ''
                              }
                            >
                              <td className="px-4 py-2">
                                {behavior.time}
                              </td>
                              <td className="px-4 py-2">{behavior.action}</td>
                              <td className="px-4 py-2 font-medium">{behavior.value}</td>
                              <td className="px-4 py-2">{behavior.section}</td>
                              <td className="px-4 py-2">{behavior.impact}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  {/* 異常検知 */}
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🚨 AI異常検知・根本原因分析</h3>
                    <div className="space-y-4">
                      {/* 根本原因分析 */}
                      {details.aiSummary?.rootCause && (
                        <div 
                          data-testid="anomaly-high"
                          className="border-l-4 p-4 border-red-500 bg-red-50"
                        >
                          <div className="font-semibold mb-2">
                            🔴 根本原因
                          </div>
                          <div className="text-sm">
                            {details.aiSummary.rootCause}
                          </div>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* 推奨アクション */}
                  <section>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 AI推奨アクション（実行可能）</h3>
                    <div className="space-y-3">
                      {details.suggestedActions?.map((action, i) => (
                        <div key={i} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium">{action.title}</div>
                            <span className="text-sm text-gray-600">{action.estimatedImpact}</span>
                          </div>
                          <div className="text-sm text-gray-600 mb-3">{action.description}</div>
                          <button
                            onClick={() => handleActionClick(action, action.executionTime.includes('今すぐ') ? 'urgent' : 'medium')}
                            disabled={actionLoading === action.title}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            {action.executionTime.includes('今すぐ') ? '🚀' : '🔧'} {action.executionTime}
                            {actionLoading === action.title && (
                              <div data-testid="action-loading" className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </div>

            {/* フッター */}
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => setShowConfirmModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  🤖 AI提案を承認
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                  <Settings className="w-4 h-4" />
                  🔄 手動最適化
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  <FileText className="w-4 h-4" />
                  📋 課題を記録
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 確認モーダル */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">AI提案の実行確認</h3>
            <p className="text-gray-600 mb-6">すべての推奨アクションを実行しますか？</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                キャンセル
              </button>
              <button 
                onClick={() => {
                  setShowConfirmModal(false);
                  // AI提案実行ロジック
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                実行する
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventDetailModal;