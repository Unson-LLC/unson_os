'use client';

import React, { useState, useEffect } from 'react';
import { LPGenerationPrompt } from '@/lib/lp-generator';
import { Wand2, Loader2, CheckCircle, XCircle, Lightbulb, Target, DollarSign, Users, AlertCircle, RefreshCw } from 'lucide-react';
import ImageGenerationPanel from '@/components/ImageGenerationPanel';
import { TemplateConfig } from '@/types/template';

interface LPGeneratorFormProps {
  onGenerated?: (config: any) => void;
  className?: string;
}

export function LPGeneratorForm({ onGenerated, className = '' }: LPGeneratorFormProps) {
  const [mounted, setMounted] = useState(false);
  const [prompt, setPrompt] = useState<LPGenerationPrompt>({
    serviceName: '',
    serviceDescription: '',
    targetAudience: '',
    mainBenefit: '',
    pricing: '',
    competitorAnalysis: '',
    brandTone: 'プロフェッショナル'
  });

  const [postHogEnabled, setPostHogEnabled] = useState(true);
  const [postHogConfig, setPostHogConfig] = useState({
    googleAdsId: 'AW-17431174236',
    googleAdsConversionLabel: 'zINmCPbAtIMbENy46vdA',
    ga4MeasurementId: ''
  });

  const [templateConfig, setTemplateConfig] = useState<Partial<TemplateConfig>>({
    imageGeneration: {
      enabled: false,
      target: '',
      theme: '',
      colors: '',
      mood: '',
      style: ''
    }
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<{
    currentSection: string;
    completedSections: number;
    totalSections: number;
  } | null>(null);
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    errors?: string[];
    stats?: any;
  } | null>(null);

  const [apiStatus, setApiStatus] = useState<{
    checked: boolean;
    configured: boolean;
    working: boolean;
    error?: string;
  }>({ checked: false, configured: false, working: false });

  const handleInputChange = (field: keyof LPGenerationPrompt, value: string) => {
    setPrompt(prev => ({ ...prev, [field]: value }));
  };

  // OpenAI API状態チェック
  const checkOpenAIStatus = async () => {
    try {
      const response = await fetch('/api/test-openai');
      const data = await response.json();
      
      setApiStatus({
        checked: true,
        configured: data.configured,
        working: data.working,
        error: data.error
      });
    } catch (error) {
      setApiStatus({
        checked: true,
        configured: false,
        working: false,
        error: 'API接続テストに失敗しました'
      });
    }
  };

  // コンポーネント初期化時にAPI状態チェック
  React.useEffect(() => {
    setMounted(true);
    checkOpenAIStatus();
  }, []);

  // Hydration修正：マウント前はローディング表示
  if (!mounted) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const isFormValid = () => {
    return prompt.serviceName && 
           prompt.serviceDescription && 
           prompt.targetAudience && 
           prompt.mainBenefit;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      alert('必須項目を入力してください');
      return;
    }

    setIsGenerating(true);
    setResult(null);
    setGenerationProgress({ currentSection: 'hero', completedSections: 0, totalSections: 5 });

    try {
      console.log('🚀 Sending LP generation request...');
      
      // 進捗シミュレーション（実際の進捗はサーバーサイドで発生）
      const progressSections = ['hero', 'problem', 'solution', 'pricing', 'cta'];
      const progressTimer = setInterval(() => {
        setGenerationProgress(prev => {
          if (!prev || prev.completedSections >= 4) return prev;
          const nextSection = progressSections[prev.completedSections + 1] || 'finalizing';
          return {
            currentSection: nextSection,
            completedSections: prev.completedSections + 1,
            totalSections: 5
          };
        });
      }, 10000); // 10秒ごとに進捗更新

      // PostHog設定付きプロンプトを準備
      const enhancedPrompt = {
        ...prompt,
        postHogEnabled,
        posthogConfig: postHogEnabled ? postHogConfig : undefined
      };

      const response = await fetch('/api/generate-lp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enhancedPrompt)
      });

      clearInterval(progressTimer);

      const data = await response.json();
      
      setResult({
        success: data.success,
        message: data.message || (data.success ? 'LP生成完了！' : 'LP生成に失敗しました'),
        errors: data.errors,
        stats: data.stats
      });

      if (data.success && onGenerated) {
        onGenerated(data.config);
      }

    } catch (error) {
      console.error('LP generation error:', error);
      setResult({
        success: false,
        message: 'ネットワークエラーが発生しました',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
    } finally {
      setIsGenerating(false);
      setGenerationProgress(null);
    }
  };

  const brandToneOptions = [
    'プロフェッショナル',
    'フレンドリー',
    '革新的',
    '信頼感重視',
    'エネルギッシュ',
    'エレガント',
    'カジュアル',
    '専門的'
  ];

  return (
    <div className={`bg-white border rounded-lg shadow-sm ${className}`}>
      {/* ヘッダー */}
      <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center space-x-3 mb-2">
          <Wand2 className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">AI LP ジェネレーター</h2>
        </div>
        <p className="text-gray-600">
          コピーライティング100のコツを活用して、効果的なランディングページを自動生成
        </p>
      </div>

      {/* API状態表示 */}
      {apiStatus.checked && (
        <div className={`p-4 border-b ${
          apiStatus.working ? 'bg-green-50' : 
          apiStatus.configured ? 'bg-yellow-50' : 'bg-red-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {apiStatus.working ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : apiStatus.configured ? (
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-medium ${
                apiStatus.working ? 'text-green-900' :
                apiStatus.configured ? 'text-yellow-900' : 'text-red-900'
              }`}>
                OpenAI API: {apiStatus.working ? '接続成功' : 
                           apiStatus.configured ? '設定済み（接続エラー）' : '未設定'}
              </span>
            </div>
            <button
              onClick={checkOpenAIStatus}
              className="text-gray-600 hover:text-gray-800 p-1"
              title="再テスト"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          {apiStatus.error && (
            <p className={`text-sm mt-1 ${
              apiStatus.working ? 'text-green-700' :
              apiStatus.configured ? 'text-yellow-700' : 'text-red-700'
            }`}>
              {apiStatus.error}
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* 基本情報 */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-3">
            <Target className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">基本情報</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                サービス名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={prompt.serviceName}
                onChange={(e) => handleInputChange('serviceName', e.target.value)}
                placeholder="例: MyWa"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ターゲット層 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={prompt.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                placeholder="例: 30-40代のITエンジニア"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              サービス説明 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={prompt.serviceDescription}
              onChange={(e) => handleInputChange('serviceDescription', e.target.value)}
              placeholder="例: AIが個人に最適化されたニュースを毎日配信し、Why-Chip機能で推薦理由を透明化するサービス"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              主要ベネフィット <span className="text-red-500">*</span>
            </label>
            <textarea
              value={prompt.mainBenefit}
              onChange={(e) => handleInputChange('mainBenefit', e.target.value)}
              placeholder="例: 1分でキャッチアップできる最適な情報量、推薦理由の透明性、完全パーソナライズ"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* オプション設定 */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-3">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-800">オプション設定</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                価格情報
              </label>
              <input
                type="text"
                value={prompt.pricing}
                onChange={(e) => handleInputChange('pricing', e.target.value)}
                placeholder="例: 月額980円、年額9,800円"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ブランドトーン
              </label>
              <select
                value={prompt.brandTone}
                onChange={(e) => handleInputChange('brandTone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {brandToneOptions.map(tone => (
                  <option key={tone} value={tone}>{tone}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              競合分析情報
            </label>
            <textarea
              value={prompt.competitorAnalysis}
              onChange={(e) => handleInputChange('competitorAnalysis', e.target.value)}
              placeholder="例: 一般的なニュースアプリと異なり、推薦理由の透明化とAI分野特化が差別化ポイント"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* コピーライティング情報 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900 mb-2">活用するコピーライティングコツ</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• ヒーロー: 感情を動かすヘッドライン、具体的数字、五感表現</li>
                <li>• 課題: 心理トリガー、ストーリーテリング、損失回避</li>
                <li>• ソリューション: ベネフィット重視、Before/After、権威性</li>
                <li>• 価格: アンカリング効果、バンドル価格、希少性</li>
                <li>• CTA: 行動喚起動詞、リスク除去、即座の満足感</li>
              </ul>
            </div>
          </div>
        </div>

        {/* PostHog Analytics設定 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 text-blue-600">📊</div>
              <h3 className="font-semibold text-blue-900">Analytics & Tracking設定</h3>
            </div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={postHogEnabled}
                onChange={(e) => setPostHogEnabled(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-blue-700">有効化</span>
            </label>
          </div>

          {postHogEnabled && (
            <div className="space-y-4">
              <div className="text-sm text-blue-700 mb-3">
                PostHog、Google Ads、GA4連携を自動設定します。GCLID追跡とコンバージョン計測が含まれます。
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    Google Ads ID
                  </label>
                  <input
                    type="text"
                    value={postHogConfig.googleAdsId}
                    onChange={(e) => setPostHogConfig(prev => ({ ...prev, googleAdsId: e.target.value }))}
                    placeholder="AW-17431174236"
                    className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    コンバージョンラベル
                  </label>
                  <input
                    type="text"
                    value={postHogConfig.googleAdsConversionLabel}
                    onChange={(e) => setPostHogConfig(prev => ({ ...prev, googleAdsConversionLabel: e.target.value }))}
                    placeholder="zINmCPbAtIMbENy46vdA"
                    className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-700 mb-1">
                    GA4測定ID（オプション）
                  </label>
                  <input
                    type="text"
                    value={postHogConfig.ga4MeasurementId}
                    onChange={(e) => setPostHogConfig(prev => ({ ...prev, ga4MeasurementId: e.target.value }))}
                    placeholder="G-XXXXXXXXXX"
                    className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-blue-100 rounded p-3">
                <div className="text-xs text-blue-600">
                  <strong>自動生成される機能:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• PostHog CDN版（Arc対応）</li>
                    <li>• GCLID自動収集・セッション保持</li>
                    <li>• Google Ads コンバージョントラッキング</li>
                    <li>• Vercel環境変数設定</li>
                    <li>• TypeScript完全対応</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 画像生成設定 */}
        <ImageGenerationPanel 
          config={templateConfig as TemplateConfig}
          serviceName={prompt.serviceName}
          onConfigUpdate={(updates) => setTemplateConfig(prev => ({ ...prev, ...updates }))}
        />

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={!isFormValid() || isGenerating || !apiStatus.working}
          className={`w-full py-3 px-4 rounded-md font-semibold transition-colors flex items-center justify-center space-x-2 ${
            isFormValid() && !isGenerating && apiStatus.working
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-400 cursor-not-allowed text-gray-200'
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>
                {generationProgress
                  ? `${generationProgress.currentSection} セクション生成中... (${generationProgress.completedSections}/${generationProgress.totalSections})`
                  : 'LP生成中...'}
              </span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>GPT-5でLP生成</span>
            </>
          )}
        </button>
      </form>

      {/* 結果表示 */}
      {result && (
        <div className={`p-4 border-t ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-start space-x-2">
            {result.success ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
            )}
            <div>
              <p className={`font-medium ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                {result.message}
              </p>
              
              {result.success && result.stats && (
                <div className="mt-2 text-sm text-green-700">
                  <p>生成統計: {result.stats.successfulSections}/{result.stats.totalSections} セクション成功 ({Math.round(result.stats.totalTime / 1000)}秒)</p>
                </div>
              )}

              {result.errors && result.errors.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-red-700">
                    {result.success ? '警告:' : 'エラー詳細:'}
                  </p>
                  <ul className="text-sm text-red-600 list-disc list-inside">
                    {result.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                  {result.success && (
                    <p className="text-xs text-yellow-700 mt-1">
                      ※ 一部エラーがありましたが、LP生成は正常に完了しました
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LPGeneratorForm;