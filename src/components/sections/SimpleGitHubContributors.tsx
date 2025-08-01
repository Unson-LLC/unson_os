'use client'

import { GitBranch, Users, Plus } from 'lucide-react'
import Image from 'next/image'

interface Contributor {
  id: string
  name: string
  avatar: string
  role: string
  description: string
  tags: string[]
  github?: string
}

const contributors: Contributor[] = [
  {
    id: '1',
    name: 'Ksato',
    avatar: 'https://github.com/ksato007.png',
    role: 'Project Creator & Lead Developer',
    description: 'UnsonOSの創設者、全体設計とアーキテクチャを担当',
    tags: ['Development', 'Architecture', 'Strategy'],
    github: 'ksato007'
  },
  {
    id: '2',
    name: 'Contributor',
    avatar: 'https://github.com/github.png',
    role: 'Open for Contribution',
    description: 'あなたの貢献をお待ちしています！',
    tags: ['Development', 'Testing', 'Documentation'],
    github: undefined
  }
]

const SimpleGitHubContributors = () => {
  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            UnsonOS <span className="text-orange-600">Contributors</span>
          </h2>
          <p className="text-gray-600 text-lg">
            UnsonOSを実現する素晴らしい開発者たち
          </p>
        </div>
        
        {/* アバター一覧 */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {contributors.map((contributor) => (
            <div key={contributor.id} className="relative group">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 ring-2 ring-white shadow-lg hover:scale-110 transition-transform cursor-pointer">
                {contributor.avatar ? (
                  <img
                    src={contributor.avatar}
                    alt={contributor.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <Users className="w-8 h-8 text-gray-600" />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* 追加のプレースホルダー */}
          {[...Array(10)].map((_, index) => (
            <div key={`placeholder-${index}`} className="w-16 h-16 rounded-full bg-gray-100 ring-2 ring-white shadow-lg" />
          ))}
        </div>
        
        <div className="text-center mb-16">
          <p className="text-gray-600">
            {contributors.length}+ contributors and counting! 
            <a href="https://github.com/Unson-LLC/unson_os/graphs/contributors" className="text-blue-600 hover:underline ml-1">
              View all contributors →
            </a>
          </p>
        </div>
        
        {/* Contributor詳細カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* メインContributorカード */}
          {contributors[0] && (
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-center mb-4">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                  <img
                    src={contributors[0].avatar}
                    alt={contributors[0].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-xl mb-1">{contributors[0].name}</h3>
                <p className="text-sm text-gray-600 mb-3">{contributors[0].role}</p>
              </div>
              <div className="space-y-2 text-sm">
                {contributors[0].tags.map((tag) => (
                  <span key={tag} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs mr-2 mb-2">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Community Membersカード */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-center mb-4">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
                <Users className="w-12 h-12 text-orange-600" />
              </div>
              <h3 className="font-bold text-xl mb-1">Contributors</h3>
              <p className="text-sm text-gray-600 mb-3">Community Members</p>
            </div>
            <div className="space-y-2 text-sm">
              <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs mr-2 mb-2">
                Docs
              </span>
              <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs mr-2 mb-2">
                Testing
              </span>
            </div>
          </div>
          
          {/* Join Usカード */}
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-dashed border-orange-300">
            <div className="text-center mb-4">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-orange-50 flex items-center justify-center">
                <Plus className="w-12 h-12 text-orange-600" />
              </div>
              <h3 className="font-bold text-xl mb-1 text-orange-600">Join Us!</h3>
              <p className="text-sm text-gray-600 mb-3">Become a Contributor</p>
            </div>
            <div className="space-y-2 text-sm text-center">
              <p className="text-gray-600">Welcome</p>
              <p className="text-gray-600">Open</p>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              UnsonOSプロジェクトに参加しよう
            </h3>
            <p className="text-gray-700 mb-6">
              あなたのスキルと情熱で、次世代のSaaS OSを一緒に作りませんか？
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/Unson-LLC/unson_os"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <GitBranch className="w-5 h-5" />
                GitHub リポジトリを見る
              </a>
              <a
                href="https://github.com/Unson-LLC/unson_os/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Issuesから始める
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SimpleGitHubContributors