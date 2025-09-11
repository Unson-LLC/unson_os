'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ExternalLink, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle,
  Settings,
  BarChart3
} from 'lucide-react'
import { ClientOnlyIcon } from '@/components/shared/ClientOnlyIcon'

interface ProjectInfo {
  id: string
  name: string
  description: string
  targetAudience: string
  mainBenefit: string
  status: string
  createdDate: string
  lpGenerated: boolean
  posthogEnabled: boolean
  configExists: boolean
  lastModified: string
}

export default function ProjectList() {
  const [projects, setProjects] = useState<ProjectInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        const data = await response.json()

        if (data.success) {
          setProjects(data.projects)
        } else {
          setError(data.error || 'Failed to load projects')
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error)
        setError('Failed to fetch projects')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const formatDate = (dateString: string) => {
    if (dateString === 'Unknown') return 'Unknown'
    try {
      return new Date(dateString).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-2">
          <ClientOnlyIcon icon={XCircle} className="w-8 h-8 mx-auto" />
        </div>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  if (projects.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-400 mb-4">
          <ClientOnlyIcon icon={BarChart3} className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          まだプロジェクトがありません
        </h3>
        <p className="text-gray-600 mb-4">
          新しいランディングページを生成してプロジェクトを開始しましょう。
        </p>
        <Link
          href="/generator"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          最初のLP生成
        </Link>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-200">
      {projects.map((project) => (
        <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {project.name}
                </h3>
                <div className="flex items-center space-x-2">
                  {project.lpGenerated && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <ClientOnlyIcon icon={CheckCircle} className="w-3 h-3 mr-1" />
                      LP生成済み
                    </span>
                  )}
                  {project.posthogEnabled && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      📊 PostHog統合
                    </span>
                  )}
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    project.status === 'validation' ? 'bg-yellow-100 text-yellow-800' :
                    project.status === 'active' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-1">{project.description}</p>
              <p className="text-xs text-gray-500 mb-2">
                <strong>ターゲット:</strong> {project.targetAudience}
              </p>
              <p className="text-xs text-gray-500 mb-2">
                <strong>メインベネフィット:</strong> {project.mainBenefit}
              </p>
              
              <div className="flex items-center text-xs text-gray-500 space-x-4">
                <span className="flex items-center">
                  <ClientOnlyIcon icon={Clock} className="w-3 h-3 mr-1" />
                  作成: {formatDate(project.createdDate)}
                </span>
                {project.configExists && (
                  <span className="flex items-center">
                    最終更新: {formatDate(project.lastModified)}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              {project.configExists && (
                <Link
                  href={`/preview/${project.id}`}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <ClientOnlyIcon icon={Eye} className="w-4 h-4 mr-2" />
                  プレビュー
                </Link>
              )}
              
              <Link
                href={`/generator?edit=${project.id}`}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <ClientOnlyIcon icon={Settings} className="w-4 h-4 mr-2" />
                編集
              </Link>
            </div>
          </div>
        </div>
      ))}
      
      {projects.length > 5 && (
        <div className="px-6 py-3 bg-gray-50 text-center">
          <Link
            href="/projects"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            すべてのプロジェクトを表示 ({projects.length}件)
          </Link>
        </div>
      )}
    </div>
  )
}