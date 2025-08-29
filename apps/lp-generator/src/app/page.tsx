'use client'

import React, { useState, useEffect } from 'react'
import { TemplateConfig } from '@/types/template'
import LandingPageTemplate from '@/components/templates/LandingPageTemplate'
import SettingsPanel from '@/components/SettingsPanel/SettingsPanel'
import { RefreshCw, FileText, Folder, Settings } from 'lucide-react'

export default function HomePage() {
  const [config, setConfig] = useState<TemplateConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastModified, setLastModified] = useState<number>(0)
  const [showSettingsPanel, setShowSettingsPanel] = useState(false)

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

  const handleConfigUpdate = (updates: Partial<TemplateConfig>) => {
    if (config) {
      setConfig({
        ...config,
        ...updates
      });
    }
  }

  const serviceName = config?.meta.title?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'lp-service';

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
      {/* フローティングボタン */}
      <button
        onClick={() => setShowSettingsPanel(!showSettingsPanel)}
        className="fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
        title="設定パネル"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* 設定パネル */}
      {showSettingsPanel && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-start justify-end">
          <div className="bg-white h-full w-96 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">設定</h2>
              <button
                onClick={() => setShowSettingsPanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="h-[calc(100%-73px)]">
              <SettingsPanel
                config={config}
                serviceName={serviceName}
                onConfigUpdate={handleConfigUpdate}
              />
            </div>
          </div>
        </div>
      )}
      
      <LandingPageTemplate config={config} serviceName={serviceName} />
    </div>
  )
}