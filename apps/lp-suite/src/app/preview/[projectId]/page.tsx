'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { TemplateConfig } from '@/types/template'
import LandingPageTemplate from '@/components/templates/LandingPageTemplate'
import { RefreshCw, FileText, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PreviewPage() {
  const params = useParams()
  const projectId = params.projectId as string
  const [config, setConfig] = useState<TemplateConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadConfig = async () => {
      if (!projectId) return

      try {
        setLoading(true)
        const response = await fetch(`/api/projects/${projectId}/config`)
        
        if (!response.ok) {
          throw new Error(`Failed to load config: ${response.statusText}`)
        }

        const data = await response.json()
        if (data.success && data.config) {
          setConfig(data.config)
        } else {
          throw new Error(data.error || 'Failed to load configuration')
        }
      } catch (error) {
        console.error('Failed to load config:', error)
        setError(error instanceof Error ? error.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [projectId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading landing page...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Landing Page</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2 mx-auto w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Configuration Found</h2>
          <p className="text-gray-600 mb-6">
            The landing page configuration could not be found for project: {projectId}
          </p>
          <Link
            href="/"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2 mx-auto w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    )
  }

  // Extract service name from config or use project ID
  const serviceName = config.meta?.title?.toLowerCase().replace(/[^a-z0-9]/g, '-') || projectId

  return (
    <div className="min-h-screen bg-white">
      {/* プレビューヘッダー */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 text-white p-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="text-white hover:text-blue-300 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <span className="text-gray-300">|</span>
            <span className="text-sm">Preview: {config.meta?.title || projectId}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs bg-green-600 px-2 py-1 rounded">PREVIEW MODE</span>
          </div>
        </div>
      </div>

      {/* プレビューコンテンツ */}
      <div className="pt-16">
        <LandingPageTemplate config={config} serviceName={serviceName} />
      </div>
    </div>
  )
}