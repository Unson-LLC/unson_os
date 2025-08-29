// レポート生成コンポーネント
'use client';

import { useState } from 'react';
import type { ReportConfig } from '@/types/metrics';

export function ReportGenerator() {
  const [config, setConfig] = useState<ReportConfig>({
    type: 'daily',
    startDate: new Date(),
    endDate: new Date(),
    sessionIds: [],
    includeCharts: true,
    format: 'json'
  });
  const [generating, setGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      // 実際の実装ではMetricsReportServiceを使用
      const mockReport = {
        id: 'report-' + Date.now(),
        type: config.type,
        period: {
          start: config.startDate.toISOString(),
          end: config.endDate.toISOString()
        },
        summary: {
          totalSessions: 15430,
          totalConversions: 1887,
          totalRevenue: 943500,
          averageCVR: 12.2,
          averageCPA: 287
        }
      };
      
      setGeneratedReport(JSON.stringify(mockReport, null, 2));
    } catch (error) {
      console.error('レポート生成エラー:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadReport = () => {
    if (!generatedReport) return;
    
    const blob = new Blob([generatedReport], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lp-report-${config.type}-${new Date().toISOString().split('T')[0]}.${config.format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        レポート生成
      </h2>

      <div className="space-y-4">
        {/* レポート種別 */}
        <div>
          <label className="form-label">レポート種別</label>
          <select 
            className="form-input"
            value={config.type}
            onChange={(e) => setConfig({...config, type: e.target.value as any})}
          >
            <option value="daily">日次レポート</option>
            <option value="weekly">週次レポート</option>
            <option value="monthly">月次レポート</option>
            <option value="custom">カスタム期間</option>
          </select>
        </div>

        {/* 期間設定 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">開始日</label>
            <input
              type="date"
              className="form-input"
              value={config.startDate.toISOString().split('T')[0]}
              onChange={(e) => setConfig({...config, startDate: new Date(e.target.value)})}
            />
          </div>
          <div>
            <label className="form-label">終了日</label>
            <input
              type="date"
              className="form-input"
              value={config.endDate.toISOString().split('T')[0]}
              onChange={(e) => setConfig({...config, endDate: new Date(e.target.value)})}
            />
          </div>
        </div>

        {/* 出力形式 */}
        <div>
          <label className="form-label">出力形式</label>
          <select 
            className="form-input"
            value={config.format}
            onChange={(e) => setConfig({...config, format: e.target.value as any})}
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="pdf">PDF</option>
          </select>
        </div>

        {/* オプション */}
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeCharts"
              className="mr-2"
              checked={config.includeCharts}
              onChange={(e) => setConfig({...config, includeCharts: e.target.checked})}
            />
            <label htmlFor="includeCharts" className="text-sm text-gray-700">
              グラフを含める
            </label>
          </div>
        </div>

        {/* 生成ボタン */}
        <div className="pt-4">
          <button
            onClick={handleGenerateReport}
            disabled={generating}
            className="btn-primary w-full"
          >
            {generating ? '生成中...' : 'レポートを生成'}
          </button>
        </div>
      </div>

      {/* 生成結果 */}
      {generatedReport && (
        <div className="mt-6 border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-900">生成結果</h3>
            <button
              onClick={handleDownloadReport}
              className="btn-secondary text-sm"
            >
              ダウンロード
            </button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-xs text-gray-600 overflow-auto max-h-60">
              {generatedReport}
            </pre>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded">
              <div className="font-medium text-blue-900">総セッション数</div>
              <div className="text-2xl font-bold text-blue-700">15,430</div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <div className="font-medium text-green-900">平均CVR</div>
              <div className="text-2xl font-bold text-green-700">12.2%</div>
            </div>
          </div>
        </div>
      )}

      {/* 最近のレポート */}
      <div className="mt-8 border-t pt-6">
        <h3 className="font-medium text-gray-900 mb-4">最近のレポート</h3>
        <div className="space-y-2">
          {[
            { id: '1', type: '日次', date: '2024-08-20', status: '完了' },
            { id: '2', type: '週次', date: '2024-08-19', status: '完了' },
            { id: '3', type: '月次', date: '2024-08-01', status: '生成中' }
          ].map((report) => (
            <div key={report.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div>
                <span className="font-medium">{report.type}レポート</span>
                <span className="text-gray-500 ml-2">{report.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  report.status === '完了' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {report.status}
                </span>
                {report.status === '完了' && (
                  <button className="text-unson-blue hover:underline text-sm">
                    表示
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}