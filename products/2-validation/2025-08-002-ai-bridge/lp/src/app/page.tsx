'use client'

import React, { useState, useEffect } from 'react'
import { TemplateConfig } from '@/types/template'
import LandingPageTemplate from '@/components/templates/LandingPageTemplate'
import { RefreshCw, FileText, Folder } from 'lucide-react'

export default function HomePage() {
  const [config, setConfig] = useState<TemplateConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastModified, setLastModified] = useState<number>(0)

  // Load config from API
  const loadConfig = async () => {
    try {
      const response = await fetch('/api/config')
      if (response.ok) {
        const data = await response.json()
        setConfig(data.config)
        setLastModified(data.lastModified)
      }
    } catch (error) {
      console.error('Failed to load config:', error)
    } finally {
      setLoading(false)
    }
  }

  // Setup file watching
  useEffect(() => {
    loadConfig()

    const eventSource = new EventSource('/api/watch')
    
    eventSource.onopen = () => {
      console.log('Connected to file watcher')
    }
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'fileChanged') {
        console.log('Config file changed, reloading...')
        loadConfig()
      }
    }
    
    eventSource.onerror = () => {
      console.log('File watcher disconnected')
    }

    return () => {
      eventSource.close()
    }
  }, [])

  const openConfigFolder = () => {
    alert('Open the "configs" folder in your project directory and edit config.json with any text editor!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading configuration...</p>
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
            Please create a config.json file in the configs folder to get started.
          </p>
          <button
            onClick={openConfigFolder}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2 mx-auto"
          >
            <Folder className="w-4 h-4" />
            <span>Open Configs Folder</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <LandingPageTemplate config={config} />
    </div>
  )
}