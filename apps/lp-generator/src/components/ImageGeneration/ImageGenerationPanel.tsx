'use client';

import React, { useState } from 'react';
import { TemplateConfig } from '@/types/template';
import { cn } from '@/lib/utils';

interface ImageGenerationPanelProps {
  config: TemplateConfig;
  serviceName: string;
  onConfigUpdate: (updates: Partial<TemplateConfig>) => void;
}

export default function ImageGenerationPanel({ 
  config, 
  serviceName, 
  onConfigUpdate 
}: ImageGenerationPanelProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const imageGenConfig = config.imageGeneration || {
    enabled: false,
    target: '',
    theme: '',
    colors: '',
    mood: '',
    style: ''
  };

  const handleConfigChange = (key: string, value: any) => {
    onConfigUpdate({
      imageGeneration: {
        ...imageGenConfig,
        [key]: value
      }
    });
  };

  const generateImages = async () => {
    if (!imageGenConfig.enabled) {
      setError('画像生成が無効になっています');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationResult(null);

    try {
      const response = await fetch('/api/generate-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config,
          serviceName
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setGenerationResult(result);
      } else {
        setError(result.error || '画像生成に失敗しました');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
    } finally {
      setIsGenerating(false);
    }
  };

  const checkGeminiStatus = async () => {
    try {
      const response = await fetch('/api/generate-images?action=status');
      const result = await response.json();
      
      if (!result.geminiApiConfigured) {
        setError('GEMINI_API_KEYが設定されていません');
      } else {
        setError(null);
      }
    } catch (err) {
      setError('API接続の確認に失敗しました');
    }
  };

  React.useEffect(() => {
    checkGeminiStatus();
  }, []);

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">AI画像生成</h2>
          <p className="text-sm text-gray-500 mt-1">
            Gemini 2.5 Flash Previewを使用してブランドトーンに統一された画像を自動生成
          </p>
        </div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={imageGenConfig.enabled}
            onChange={(e) => handleConfigChange('enabled', e.target.checked)}
            className="sr-only"
          />
          <div className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            imageGenConfig.enabled ? "bg-blue-600" : "bg-gray-200"
          )}>
            <span className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
              imageGenConfig.enabled ? "translate-x-6" : "translate-x-1"
            )} />
          </div>
          <span className="ml-3 text-sm font-medium text-gray-700">
            有効
          </span>
        </label>
      </div>

      {imageGenConfig.enabled && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ターゲット層
              </label>
              <input
                type="text"
                value={imageGenConfig.target}
                onChange={(e) => handleConfigChange('target', e.target.value)}
                placeholder="例: 30-40歳ビジネスパーソン"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                テーマ・コンセプト
              </label>
              <input
                type="text"
                value={imageGenConfig.theme}
                onChange={(e) => handleConfigChange('theme', e.target.value)}
                placeholder="例: ビジネス効率化・デジタル変革"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ブランドカラー
              </label>
              <input
                type="text"
                value={imageGenConfig.colors}
                onChange={(e) => handleConfigChange('colors', e.target.value)}
                placeholder="例: Blue (#3B82F6), Purple (#8B5CF6)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ムード・雰囲気
              </label>
              <input
                type="text"
                value={imageGenConfig.mood}
                onChange={(e) => handleConfigChange('mood', e.target.value)}
                placeholder="例: プロフェッショナル・革新的・信頼感"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              スタイル
            </label>
            <input
              type="text"
              value={imageGenConfig.style}
              onChange={(e) => handleConfigChange('style', e.target.value)}
              placeholder="例: modern business photography with clean graphics"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="pt-4 border-t">
            <button
              onClick={generateImages}
              disabled={isGenerating}
              className={cn(
                "w-full py-3 px-4 rounded-md font-semibold transition-colors",
                isGenerating 
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              )}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  画像生成中...
                </div>
              ) : (
                '🎨 画像を生成'
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {generationResult && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-green-800">画像生成完了</h4>
                  <div className="mt-2 text-sm text-green-700">
                    <p>サービス: {generationResult.serviceName}</p>
                    <p>成功: {generationResult.generated}/{generationResult.total} 枚</p>
                    <p>保存先: {generationResult.outputPath}</p>
                    {generationResult.errors && generationResult.errors.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium">エラー:</p>
                        <ul className="list-disc list-inside">
                          {generationResult.errors.map((error: string, index: number) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}