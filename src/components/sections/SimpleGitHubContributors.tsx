'use client'

import { GitBranch, Users } from 'lucide-react'

const SimpleGitHubContributors = () => {
  return (
    <section className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-secondary mb-6">
            プロジェクトコントリビューター
          </h2>
          <p className="text-large max-w-2xl mx-auto text-gray-600 mb-4">
            実際にUnsonOSプロジェクトに貢献している開発者の皆さんです
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <GitBranch className="w-4 h-4" />
              <span>GitHub Contributors</span>
            </div>
          </div>
        </div>
        
        {/* contrib.rocksを使用した簡単な表示 */}
        <div className="max-w-3xl mx-auto mb-12">
          <a 
            href="https://github.com/Unson-LLC/unson_os/graphs/contributors"
            target="_blank"
            rel="noopener noreferrer"
            className="block hover:opacity-90 transition-opacity"
          >
            <img 
              src="https://contrib.rocks/image?repo=Unson-LLC/unson_os" 
              alt="Contributors"
              className="w-full rounded-lg shadow-md"
            />
          </a>
        </div>
        
        {/* GitHub統計バッジ */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <img 
            src="https://img.shields.io/github/contributors/Unson-LLC/unson_os?style=for-the-badge&color=blue" 
            alt="Contributors Count"
          />
          <img 
            src="https://img.shields.io/github/stars/Unson-LLC/unson_os?style=for-the-badge&color=yellow" 
            alt="Stars"
          />
          <img 
            src="https://img.shields.io/github/forks/Unson-LLC/unson_os?style=for-the-badge&color=green" 
            alt="Forks"
          />
          <img 
            src="https://img.shields.io/github/issues/Unson-LLC/unson_os?style=for-the-badge&color=red" 
            alt="Issues"
          />
        </div>
        
        <div className="mt-12 text-center">
          <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              あなたも参加しませんか？
            </h3>
            <p className="text-blue-700 text-sm mb-4">
              GitHubでプロジェクトに貢献すると、自動的にこのリストに表示されます
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <a
                href="https://github.com/Unson-LLC/unson_os"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm"
              >
                <GitBranch className="w-4 h-4" />
                GitHub リポジトリ
              </a>
              <a
                href="https://github.com/Unson-LLC/unson_os/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Issues を見る
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SimpleGitHubContributors