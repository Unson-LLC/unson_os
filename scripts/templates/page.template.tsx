'use client'

import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { TemplateConfig } from '@/types/template'
import LandingPageTemplate from '@/components/templates/LandingPageTemplate'
import { RefreshCw, FileText, Folder } from 'lucide-react'
import PostHogProvider from '@/components/Analytics/PostHogProvider'
import Analytics from '@/components/Analytics/Analytics'
import ScrollTracker from '@/components/Analytics/ScrollTracker'
import posthog from 'posthog-js'

export default function HomePage() {
  const [config, setConfig] = useState<TemplateConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastModified, setLastModified] = useState<number>(0)

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

  useEffect(() => {
    loadConfig()
    const eventSource = new EventSource('/api/watch')
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'fileChanged') loadConfig()
    }
    return () => { eventSource.close() }
  }, [])

  useEffect(() => {
    if (config) {
      try { posthog.capture('lp.view', { service: process.env.NEXT_PUBLIC_SERVICE_NAME || 'lp' }) } catch {}
    }
  }, [config])

  const canonical = (process.env.NEXT_PUBLIC_APP_URL || '') ? `${process.env.NEXT_PUBLIC_APP_URL}` : undefined
  const robots = process.env.NEXT_PUBLIC_ROBOTS || 'index,follow'

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
          <p className="text-gray-600 mb-6">Please create a config.json file in the configs folder to get started.</p>
          <button onClick={() => alert('Open configs folder')} className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2 mx-auto">
            <Folder className="w-4 h-4" />
            <span>Open Configs Folder</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <PostHogProvider>
      <Head>
        <title>{config.meta?.title || 'Landing'}</title>
        {config.meta?.description && (<meta name="description" content={config.meta.description} />)}
        {canonical && <link rel="canonical" href={canonical} />}
        <meta name="robots" content={robots} />
        <meta property="og:title" content={config.meta?.title || ''} />
        <meta property="og:description" content={config.meta?.description || ''} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={config.assets?.images?.hero || config.assets?.logo || ''} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Analytics serviceName={process.env.NEXT_PUBLIC_SERVICE_NAME || 'lp'} />
      <ScrollTracker />
      <div className="min-h-screen bg-white">
        <LandingPageTemplate config={config} />
      </div>
    </PostHogProvider>
  )
}
