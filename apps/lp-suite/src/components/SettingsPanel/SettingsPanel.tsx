'use client';

import React, { useState } from 'react';
import { TemplateConfig } from '@/types/template';
import ImageGenerationPanel from '@/components/ImageGeneration/ImageGenerationPanel';
import CopywritingPanel from '@/components/CopywritingGuidance/CopywritingPanel';
import LPGeneratorForm from '@/components/LPGenerator/LPGeneratorForm';
import { Settings, Lightbulb, Image, BarChart, Wand2 } from 'lucide-react';

interface SettingsPanelProps {
  config: TemplateConfig;
  serviceName: string;
  onConfigUpdate: (updates: Partial<TemplateConfig>) => void;
}

type TabType = 'generator' | 'copywriting' | 'images' | 'analytics' | 'development';

export default function SettingsPanel({ 
  config, 
  serviceName, 
  onConfigUpdate 
}: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('generator');

  const tabs = [
    {
      id: 'generator' as TabType,
      label: 'LP生成',
      icon: Wand2,
      description: 'AIによるLP自動生成'
    },
    {
      id: 'copywriting' as TabType,
      label: 'コピーライティング',
      icon: Lightbulb,
      description: 'コピー作成のコツとガイダンス'
    },
    {
      id: 'images' as TabType,
      label: '画像生成',
      icon: Image,
      description: 'AI画像生成設定'
    },
    {
      id: 'analytics' as TabType,
      label: 'アナリティクス',
      icon: BarChart,
      description: 'トラッキング設定'
    },
    {
      id: 'development' as TabType,
      label: '開発者設定',
      icon: Settings,
      description: 'ガイダンス表示とデバッグ'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'generator':
        return <LPGeneratorForm onGenerated={onConfigUpdate} />;
      case 'copywriting':
        return <CopywritingPanel />;
      case 'images':
        return (
          <ImageGenerationPanel
            config={config}
            serviceName={serviceName}
            onConfigUpdate={onConfigUpdate}
          />
        );
      case 'analytics':
        return <AnalyticsPanel config={config} onConfigUpdate={onConfigUpdate} />;
      case 'development':
        return <DevelopmentPanel config={config} onConfigUpdate={onConfigUpdate} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* ヘッダー */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2 mb-2">
          <Settings className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">設定パネル</h2>
        </div>
        <p className="text-sm text-gray-600">LP最適化のための総合ツールセット</p>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b">
        <nav className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* タブコンテンツ */}
      <div className="flex-1 overflow-y-auto">
        {renderTabContent()}
      </div>

      {/* フッター */}
      <div className="p-3 border-t bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          {tabs.find(tab => tab.id === activeTab)?.description}
        </div>
      </div>
    </div>
  );
}

// アナリティクス設定パネル
function AnalyticsPanel({ 
  config, 
  onConfigUpdate 
}: { 
  config: TemplateConfig, 
  onConfigUpdate: (updates: Partial<TemplateConfig>) => void 
}) {
  const analytics = config.settings?.analytics || {
    googleAnalytics: '',
    googleAdsId: '',
    googleAdsConversionLabel: '',
    postHogKey: '',
    postHogHost: '',
    facebookPixel: ''
  };

  const handleAnalyticsChange = (key: string, value: string) => {
    onConfigUpdate({
      settings: {
        ...config.settings,
        analytics: {
          ...analytics,
          [key]: value
        }
      }
    });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <BarChart className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">アナリティクス設定</h3>
            <p className="text-sm text-blue-700 mt-1">
              各種トラッキングツールの設定を管理します。設定後、LP生成時に自動で組み込まれます。
            </p>
          </div>
        </div>
      </div>

      {/* Google Analytics */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Google Analytics 測定ID
        </label>
        <input
          type="text"
          value={analytics.googleAnalytics || ''}
          onChange={(e) => handleAnalyticsChange('googleAnalytics', e.target.value)}
          placeholder="G-XXXXXXXXXX"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500">例: G-9R4YRBEQSG</p>
      </div>

      {/* Google Ads */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800">Google Ads設定</h4>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Google Ads ID
          </label>
          <input
            type="text"
            value={analytics.googleAdsId || ''}
            onChange={(e) => handleAnalyticsChange('googleAdsId', e.target.value)}
            placeholder="AW-XXXXXXXXXX"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            コンバージョンラベル
          </label>
          <input
            type="text"
            value={analytics.googleAdsConversionLabel || ''}
            onChange={(e) => handleAnalyticsChange('googleAdsConversionLabel', e.target.value)}
            placeholder="form_submission"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* PostHog */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800">PostHog設定</h4>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            PostHog API Key
          </label>
          <input
            type="text"
            value={analytics.postHogKey || ''}
            onChange={(e) => handleAnalyticsChange('postHogKey', e.target.value)}
            placeholder="phc_..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            PostHog Host
          </label>
          <input
            type="text"
            value={analytics.postHogHost || ''}
            onChange={(e) => handleAnalyticsChange('postHogHost', e.target.value)}
            placeholder="https://us.i.posthog.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Facebook Pixel */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Facebook Pixel ID
        </label>
        <input
          type="text"
          value={analytics.facebookPixel || ''}
          onChange={(e) => handleAnalyticsChange('facebookPixel', e.target.value)}
          placeholder="123456789012345"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500">Facebook広告用のピクセルID（オプション）</p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-yellow-800">注意事項</h4>
            <div className="text-sm text-yellow-700 mt-1">
              <p>• 設定値は即座にconfig.jsonに反映されます</p>
              <p>• Google Adsのコンバージョン追跡にはコンバージョンラベルが必要です</p>
              <p>• PostHogは無料枠でも高機能な分析が可能です</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 開発者設定パネル
function DevelopmentPanel({ 
  config, 
  onConfigUpdate 
}: { 
  config: TemplateConfig, 
  onConfigUpdate: (updates: Partial<TemplateConfig>) => void 
}) {
  const development = config.settings?.development || {
    showCopywritingTips: false,
    copywritingTipsPosition: 'bottom' as const,
    showSectionGuides: false
  };

  const handleDevelopmentChange = (key: string, value: any) => {
    onConfigUpdate({
      settings: {
        ...config.settings,
        development: {
          ...development,
          [key]: value
        }
      }
    });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start">
          <Settings className="w-5 h-5 text-purple-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-medium text-purple-900">開発者設定</h3>
            <p className="text-sm text-purple-700 mt-1">
              LP作成時のガイダンス表示とデバッグ機能を制御します。
            </p>
          </div>
        </div>
      </div>

      {/* コピーライティングガイダンス設定 */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-800">コピーライティングガイダンス</h4>
            <p className="text-sm text-gray-600">各セクションでコンテキスト別のコピーコツを表示</p>
          </div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={development.showCopywritingTips}
              onChange={(e) => handleDevelopmentChange('showCopywritingTips', e.target.checked)}
              className="sr-only"
            />
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              development.showCopywritingTips ? "bg-blue-600" : "bg-gray-200"
            }`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                development.showCopywritingTips ? "translate-x-6" : "translate-x-1"
              }`} />
            </div>
          </label>
        </div>

        {development.showCopywritingTips && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              ガイダンス表示位置
            </label>
            <select
              value={development.copywritingTipsPosition}
              onChange={(e) => handleDevelopmentChange('copywritingTipsPosition', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="top">セクション上部</option>
              <option value="bottom">セクション下部</option>
              <option value="sidebar">サイドバー</option>
            </select>
            <p className="text-xs text-gray-500">
              各セクションに対するコピーライティングコツの表示位置を選択
            </p>
          </div>
        )}
      </div>

      {/* セクションガイド設定 */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-800">セクションガイド</h4>
            <p className="text-sm text-gray-600">各セクションの編集ガイドを表示</p>
          </div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={development.showSectionGuides}
              onChange={(e) => handleDevelopmentChange('showSectionGuides', e.target.checked)}
              className="sr-only"
            />
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              development.showSectionGuides ? "bg-blue-600" : "bg-gray-200"
            }`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                development.showSectionGuides ? "translate-x-6" : "translate-x-1"
              }`} />
            </div>
          </label>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">開発者モードについて</h4>
            <div className="text-sm text-blue-700 mt-1">
              <p>• この設定は開発・編集時にのみ有効です</p>
              <p>• 公開時にはガイダンスは表示されません</p>
              <p>• config.jsonに即座に反映されます</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}