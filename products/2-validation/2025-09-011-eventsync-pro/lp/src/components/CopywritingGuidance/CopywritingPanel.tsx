'use client'

import React, { useState, useEffect } from 'react'
import { 
  copywritingTips, 
  copywritingCategories, 
  getCopywritingTipsByCategory,
  searchCopywritingTips,
  getRandomTips,
  CopywritingTip
} from '@/data/copywriting-tips'
import { Search, Lightbulb, RefreshCw, BookOpen, Target, Zap } from 'lucide-react'

interface CopywritingPanelProps {
  className?: string;
}

export default function CopywritingPanel({ className = '' }: CopywritingPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('全て');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedTips, setDisplayedTips] = useState<CopywritingTip[]>([]);
  const [randomTips, setRandomTips] = useState<CopywritingTip[]>([]);

  useEffect(() => {
    if (searchQuery) {
      setDisplayedTips(searchCopywritingTips(searchQuery));
    } else if (selectedCategory === '全て') {
      setDisplayedTips(copywritingTips.slice(0, 10)); // 最初は10個まで表示
    } else {
      setDisplayedTips(getCopywritingTipsByCategory(selectedCategory));
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    setRandomTips(getRandomTips(3));
  }, []);

  const refreshRandomTips = () => {
    setRandomTips(getRandomTips(3));
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ElementType> = {
      '基本原則': Target,
      '心理トリガー': Zap,
      'CTA': BookOpen,
      'ヘッドライン': Lightbulb,
    };
    const IconComponent = icons[category] || BookOpen;
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <div className={`bg-white border rounded-lg ${className}`}>
      {/* ヘッダー */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center space-x-2 mb-2">
          <Lightbulb className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">コピーライティング ガイダンス</h3>
        </div>
        <p className="text-sm text-gray-600">効果的なLP作成のための100のコツ</p>
      </div>

      {/* おすすめのコツ（ランダム表示） */}
      <div className="p-4 border-b bg-yellow-50">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-800 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-600" />
            <span>今日のおすすめ</span>
          </h4>
          <button
            onClick={refreshRandomTips}
            className="text-yellow-600 hover:text-yellow-700 text-sm flex items-center space-x-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>更新</span>
          </button>
        </div>
        <div className="space-y-2">
          {randomTips.map((tip) => (
            <div key={tip.id} className="p-2 bg-white rounded border-l-2 border-yellow-400">
              <div className="font-medium text-sm text-gray-800">{tip.title}</div>
              <div className="text-xs text-gray-600 mt-1">{tip.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 検索機能 */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="コツを検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* カテゴリー選択 */}
      <div className="p-4 border-b">
        <h4 className="font-medium text-gray-800 mb-3">カテゴリー</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('全て')}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              selectedCategory === '全て'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全て
          </button>
          {copywritingCategories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors flex items-center space-x-1 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getCategoryIcon(category)}
              <span>{category}</span>
            </button>
          ))}
        </div>
      </div>

      {/* コツ一覧 */}
      <div className="max-h-96 overflow-y-auto">
        {displayedTips.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>該当するコツが見つかりませんでした</p>
          </div>
        ) : (
          <div className="space-y-1">
            {displayedTips.map((tip) => (
              <div key={tip.id} className="p-4 hover:bg-gray-50 border-b border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium text-gray-800">{tip.title}</h5>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {tip.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{tip.description}</p>
                
                {tip.examples && tip.examples.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs text-gray-500 mb-1">例：</div>
                    <div className="flex flex-wrap gap-1">
                      {tip.examples.map((example, index) => (
                        <span
                          key={index}
                          className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1">
                  {tip.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* フッター */}
      <div className="p-3 border-t bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          計 {copywritingTips.length} のコピーライティングコツを収録
        </div>
      </div>
    </div>
  );
}