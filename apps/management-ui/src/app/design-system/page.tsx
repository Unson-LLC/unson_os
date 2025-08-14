'use client'

import React from 'react'

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-secondary-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="command-header">
          <h1 className="text-3xl font-bold">UnsonOS Design System</h1>
          <p className="mt-2 opacity-90">統一されたデザイン言語のショーケース</p>
        </div>

        {/* Buttons Section */}
        <section className="card mb-6">
          <div className="card-header">
            <h2 className="card-title">ボタン</h2>
          </div>
          <div className="card-body space-y-4">
            <div className="flex flex-wrap gap-3">
              <button className="btn btn-primary">プライマリ</button>
              <button className="btn btn-secondary">セカンダリ</button>
              <button className="btn btn-accent">アクセント</button>
              <button className="btn btn-success">成功</button>
              <button className="btn btn-danger">削除</button>
              <button className="btn btn-ghost">ゴースト</button>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="btn btn-primary btn-sm">小サイズ</button>
              <button className="btn btn-primary">通常サイズ</button>
              <button className="btn btn-primary btn-lg">大サイズ</button>
              <button className="btn btn-primary" disabled>無効</button>
            </div>
          </div>
        </section>

        {/* Badges Section */}
        <section className="card mb-6">
          <div className="card-header">
            <h2 className="card-title">バッジ</h2>
          </div>
          <div className="card-body">
            <div className="flex flex-wrap gap-2">
              <span className="badge badge-primary">新規</span>
              <span className="badge badge-success">アクティブ</span>
              <span className="badge badge-warning">保留中</span>
              <span className="badge badge-error">エラー</span>
            </div>
          </div>
        </section>

        {/* Phase Indicators */}
        <section className="card mb-6">
          <div className="card-header">
            <h2 className="card-title">フェーズインジケーター</h2>
          </div>
          <div className="card-body">
            <div className="flex flex-wrap gap-2">
              <span className="phase-indicator phase-research">リサーチ</span>
              <span className="phase-indicator phase-lp">LP検証</span>
              <span className="phase-indicator phase-mvp">MVP開発</span>
              <span className="phase-indicator phase-monetization">収益化</span>
              <span className="phase-indicator phase-scale">スケール</span>
            </div>
          </div>
        </section>

        {/* KPI Cards Grid */}
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-4">KPIカード</h2>
          <div className="command-grid">
            <div className="kpi-card">
              <div className="kpi-label">総売上</div>
              <div className="kpi-value">¥1,234,567</div>
              <div className="kpi-change positive">+12.5%</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">アクティブユーザー</div>
              <div className="kpi-value">3,456</div>
              <div className="kpi-change positive">+8.2%</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">コンバージョン率</div>
              <div className="kpi-value">24.5%</div>
              <div className="kpi-change negative">-2.1%</div>
            </div>
            <div className="kpi-card">
              <div className="kpi-label">平均単価</div>
              <div className="kpi-value">¥8,900</div>
              <div className="kpi-change positive">+5.3%</div>
            </div>
          </div>
        </section>

        {/* Alerts Section */}
        <section className="card mb-6">
          <div className="card-header">
            <h2 className="card-title">アラート</h2>
          </div>
          <div className="card-body space-y-3">
            <div className="alert alert-success">
              <strong>成功!</strong> 操作が正常に完了しました。
            </div>
            <div className="alert alert-warning">
              <strong>注意:</strong> データの同期に時間がかかっています。
            </div>
            <div className="alert alert-error">
              <strong>エラー:</strong> 接続に失敗しました。
            </div>
            <div className="alert alert-info">
              <strong>お知らせ:</strong> メンテナンスを予定しています。
            </div>
          </div>
        </section>

        {/* Forms Section */}
        <section className="card mb-6">
          <div className="card-header">
            <h2 className="card-title">フォーム要素</h2>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">メールアドレス</label>
              <input type="email" className="form-input" placeholder="example@unson.os" />
            </div>
            <div className="form-group">
              <label className="form-label">プラン選択</label>
              <select className="form-select">
                <option>スタンダード</option>
                <option>プレミアム</option>
                <option>エンタープライズ</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">メッセージ</label>
              <textarea className="form-textarea" rows={3} placeholder="お問い合わせ内容を入力"></textarea>
            </div>
            <button className="btn btn-primary">送信</button>
          </div>
        </section>

        {/* Status Indicators */}
        <section className="card mb-6">
          <div className="card-header">
            <h2 className="card-title">ステータス表示</h2>
          </div>
          <div className="card-body space-y-2">
            <div className="status-indicator status-healthy">
              <span className="status-dot"></span>
              <span>正常稼働中</span>
            </div>
            <div className="status-indicator status-warning">
              <span className="status-dot"></span>
              <span>要注意</span>
            </div>
            <div className="status-indicator status-critical">
              <span className="status-dot"></span>
              <span>緊急対応必要</span>
            </div>
          </div>
        </section>

        {/* Action Cards */}
        <section className="mb-6">
          <h2 className="text-xl font-bold mb-4">アクションカード</h2>
          <div className="command-grid">
            <div className="action-card action-priority-critical">
              <h3 className="font-semibold mb-2">緊急対応</h3>
              <p className="text-sm text-secondary-600">サービス停止の可能性があります</p>
            </div>
            <div className="action-card action-priority-high">
              <h3 className="font-semibold mb-2">高優先度</h3>
              <p className="text-sm text-secondary-600">24時間以内に対応が必要です</p>
            </div>
            <div className="action-card action-priority-medium">
              <h3 className="font-semibold mb-2">中優先度</h3>
              <p className="text-sm text-secondary-600">今週中に確認してください</p>
            </div>
            <div className="action-card action-priority-low">
              <h3 className="font-semibold mb-2">低優先度</h3>
              <p className="text-sm text-secondary-600">時間があるときに対応</p>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="card mb-6">
          <div className="card-header">
            <h2 className="card-title">タイポグラフィ</h2>
          </div>
          <div className="card-body space-y-3">
            <h1 className="text-4xl font-bold">見出し1 (H1)</h1>
            <h2 className="text-3xl font-bold">見出し2 (H2)</h2>
            <h3 className="text-2xl font-bold">見出し3 (H3)</h3>
            <h4 className="text-xl font-bold">見出し4 (H4)</h4>
            <p className="text-base">
              これは本文のサンプルです。UnsonOSは100-200個のマイクロSaaSを自動運営するシステムです。
              STAY SMALL哲学に基づき、最小限のリソースで最大限の価値を創造します。
            </p>
            <p className="text-sm text-secondary-600">
              小さいテキストのサンプル
            </p>
            <p className="text-xs text-secondary-500">
              極小テキストのサンプル
            </p>
          </div>
        </section>

        {/* Colors */}
        <section className="card">
          <div className="card-header">
            <h2 className="card-title">カラーパレット</h2>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Primary Colors</h3>
                <div className="flex gap-2">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => (
                    <div key={shade} className="text-center">
                      <div className={`w-16 h-16 rounded bg-primary-${shade}`}></div>
                      <span className="text-xs">{shade}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Semantic Colors</h3>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded bg-success-600"></div>
                    <span className="text-xs">Success</span>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded bg-warning-600"></div>
                    <span className="text-xs">Warning</span>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded bg-error-600"></div>
                    <span className="text-xs">Error</span>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded bg-info-600"></div>
                    <span className="text-xs">Info</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}