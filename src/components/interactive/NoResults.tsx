// Refactor Phase: 検索結果なし表示を再利用可能なコンポーネントに抽出
import React from 'react'

interface NoResultsProps {
  query: string
  onClear: () => void
  title?: string
  description?: string
  icon?: React.ReactNode
}

export function NoResults({
  query,
  onClear,
  title = '検索結果が見つかりません',
  description,
  icon
}: NoResultsProps) {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom text-center">
        <div className="max-w-md mx-auto">
          {icon || (
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0z" />
            </svg>
          )}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 mb-4">
            {description || `「${query}」に一致する結果はありませんでした。`}
          </p>
          <button
            onClick={onClear}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            検索をクリア
          </button>
        </div>
      </div>
    </section>
  )
}