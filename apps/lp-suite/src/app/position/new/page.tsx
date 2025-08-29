'use client';

import React, { useState } from 'react'
import Link from 'next/link'

export default function NewPositionPage() {
  const [form, setForm] = useState({
    id: '',
    name: '',
    lpUrl: '',
    status: 'active',
    targetCvr: '5',
    targetCpa: '2000',
    minSessions: '100',
    googleAdsCampaignId: '',
    playbookId: '',
    automationEnabled: true,
    autoOptimization: true,
    autoDeployment: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onChange = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/positions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          targetCvr: form.targetCvr ? Number(form.targetCvr) : 5,
          targetCpa: form.targetCpa ? Number(form.targetCpa) : 2000,
          minSessions: form.minSessions ? Number(form.minSessions) : 100,
        })
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || '登録に失敗しました')
      }
      window.location.href = '/'
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">新規ポジション</h1>
          <Link href="/" className="text-sm text-gray-600 hover:underline">戻る</Link>
        </div>

        <form onSubmit={onSubmit} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded">{error}</div>
          )}

          <div>
            <label className="block text-sm text-gray-700 mb-1">ID（英数字・ハイフン）</label>
            <input value={form.id} onChange={e => onChange('id', e.target.value)} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">名前</label>
            <input value={form.name} onChange={e => onChange('name', e.target.value)} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">LP URL</label>
            <input type="url" value={form.lpUrl} onChange={e => onChange('lpUrl', e.target.value)} required className="w-full border rounded px-3 py-2" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">ステータス</label>
              <select value={form.status} onChange={e => onChange('status', e.target.value)} className="w-full border rounded px-3 py-2">
                <option value="active">active（稼働中）</option>
                <option value="paused">paused（一時停止）</option>
                <option value="completed">completed（完了）</option>
                <option value="failed">failed（失敗）</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">目標CVR (%)</label>
              <input value={form.targetCvr} onChange={e => onChange('targetCvr', e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">目標CPA (円)</label>
              <input value={form.targetCpa} onChange={e => onChange('targetCpa', e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">目標CVR (%)</label>
              <input value={form.targetCvr} onChange={e => onChange('targetCvr', e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">目標CPA (円)</label>
              <input value={form.targetCpa} onChange={e => onChange('targetCpa', e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">最小セッション数</label>
              <input value={form.minSessions} onChange={e => onChange('minSessions', e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">最小セッション数</label>
              <input value={form.minSessions} onChange={e => onChange('minSessions', e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Google Ads キャンペーンID（任意）</label>
              <input value={form.googleAdsCampaignId} onChange={e => onChange('googleAdsCampaignId', e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">プレイブックID（任意）</label>
              <input value={form.playbookId} onChange={e => onChange('playbookId', e.target.value)} className="w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="inline-flex items-center space-x-2">
              <input type="checkbox" checked={form.automationEnabled} onChange={e => setForm(prev => ({...prev, automationEnabled: e.target.checked}))} />
              <span className="text-sm text-gray-700">自動化ON</span>
            </label>
            <label className="inline-flex items-center space-x-2">
              <input type="checkbox" checked={form.autoOptimization} onChange={e => setForm(prev => ({...prev, autoOptimization: e.target.checked}))} />
              <span className="text-sm text-gray-700">最適化ON</span>
            </label>
            <label className="inline-flex items-center space-x-2">
              <input type="checkbox" checked={form.autoDeployment} onChange={e => setForm(prev => ({...prev, autoDeployment: e.target.checked}))} />
              <span className="text-sm text-gray-700">自動デプロイON</span>
            </label>
          </div>

          <div className="pt-2">
            <button disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {submitting ? '登録中…' : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
