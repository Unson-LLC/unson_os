'use client'

import React, { useMemo } from 'react'
import { 
  copywritingTips, 
  getCopywritingTipsByCategory,
  CopywritingTip
} from '@/data/copywriting-tips'
import { Lightbulb, ArrowRight, Target } from 'lucide-react'

interface ContextualTipsProps {
  context: 'hero' | 'problem' | 'solution' | 'pricing' | 'cta' | 'form' | 'general';
  className?: string;
  maxTips?: number;
}

// コンテキスト別の関連カテゴリマッピング
const contextCategoryMap: Record<string, string[]> = {
  'hero': ['ヘッドライン', '基本原則', 'ストーリー'],
  'problem': ['心理トリガー', 'ストーリー', '基本原則'],
  'solution': ['基本原則', '心理トリガー', '信頼性'],
  'pricing': ['価格戦略', '心理トリガー'],
  'cta': ['CTA', '心理トリガー'],
  'form': ['CTA', '信頼性'],
  'general': ['基本原則', 'ヘッドライン']
};

// コンテキスト別の日本語ラベル
const contextLabels: Record<string, string> = {
  'hero': 'ヒーローセクション',
  'problem': '課題・問題提起',
  'solution': 'ソリューション提案', 
  'pricing': '価格・料金',
  'cta': 'Call to Action',
  'form': 'フォーム・問い合わせ',
  'general': '全般'
};

export default function ContextualTips({ 
  context, 
  className = '',
  maxTips = 3
}: ContextualTipsProps) {
  // コンテキストに関連するコツを取得
  const contextualTips = useMemo(() => {
    const relevantCategories = contextCategoryMap[context] || ['基本原則'];
    const tips: CopywritingTip[] = [];
    
    // 各カテゴリから関連するコツを収集
    relevantCategories.forEach(category => {
      const categoryTips = getCopywritingTipsByCategory(category);
      tips.push(...categoryTips);
    });
    
    // 重複を除去し、maxTipsまでに制限
    const uniqueTips = tips.filter((tip, index, self) => 
      index === self.findIndex(t => t.id === tip.id)
    );
    
    return uniqueTips.slice(0, maxTips);
  }, [context, maxTips]);

  const contextLabel = contextLabels[context] || '一般';

  if (contextualTips.length === 0) {
    return null;
  }

  return (
    <div className={`bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
      {/* ヘッダー */}
      <div className="flex items-center space-x-2 mb-3">
        <Lightbulb className="w-4 h-4 text-yellow-600" />
        <h4 className="font-medium text-gray-800">
          {contextLabel}に最適化されたコツ
        </h4>
        <Target className="w-3 h-3 text-yellow-500" />
      </div>

      {/* コツリスト */}
      <div className="space-y-3">
        {contextualTips.map((tip, index) => (
          <div key={tip.id} className="bg-white rounded-lg p-3 border border-yellow-100 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <h5 className="font-medium text-gray-800 text-sm flex items-center">
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mr-2">
                  {index + 1}
                </span>
                {tip.title}
              </h5>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {tip.category}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{tip.description}</p>
            
            {tip.examples && tip.examples.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tip.examples.slice(0, 2).map((example, exampleIndex) => (
                  <span
                    key={exampleIndex}
                    className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded border border-yellow-200"
                  >
                    {example}
                  </span>
                ))}
                {tip.examples.length > 2 && (
                  <span className="text-xs text-gray-500 px-2 py-1">
                    +{tip.examples.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* フッター */}
      <div className="mt-3 pt-2 border-t border-yellow-200">
        <div className="flex items-center justify-between text-xs text-yellow-700">
          <span>コピーライティングガイダンス</span>
          <div className="flex items-center space-x-1">
            <span>詳細は設定パネルで</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

// 使いやすいプリセットコンポーネント
export function HeroTips({ className, maxTips }: { className?: string, maxTips?: number }) {
  return <ContextualTips context="hero" className={className} maxTips={maxTips} />;
}

export function ProblemTips({ className, maxTips }: { className?: string, maxTips?: number }) {
  return <ContextualTips context="problem" className={className} maxTips={maxTips} />;
}

export function SolutionTips({ className, maxTips }: { className?: string, maxTips?: number }) {
  return <ContextualTips context="solution" className={className} maxTips={maxTips} />;
}

export function PricingTips({ className, maxTips }: { className?: string, maxTips?: number }) {
  return <ContextualTips context="pricing" className={className} maxTips={maxTips} />;
}

export function CTATips({ className, maxTips }: { className?: string, maxTips?: number }) {
  return <ContextualTips context="cta" className={className} maxTips={maxTips} />;
}

export function FormTips({ className, maxTips }: { className?: string, maxTips?: number }) {
  return <ContextualTips context="form" className={className} maxTips={maxTips} />;
}