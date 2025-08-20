'use client'

import { useState } from 'react'
import { DocsLayout } from '@/components/layout/DocsLayout'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { Accordion } from '@/components/ui/Accordion'

export default function ApiTestsCompletePage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(id)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const CodeBlock = ({ children, language = 'typescript', id }: { children: string; language?: string; id: string }) => (
    <div className="relative bg-gray-900 rounded-lg p-4 my-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-400 text-sm">{language}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(children, id)}
          className="text-gray-400 hover:text-white"
        >
          {copiedCode === id ? 'コピー済み!' : 'コピー'}
        </Button>
      </div>
      <pre className="text-green-400 text-sm overflow-x-auto">
        <code>{children}</code>
      </pre>
    </div>
  )

  const setupTabs = [
    {
      id: 'dependencies',
      label: 'テスト依存関係',
      content: (
        <div className="space-y-6">
          <div className="card">
            <h4 className="font-semibold text-gray-900 mb-3">必要なパッケージのインストール</h4>
            <CodeBlock language="bash" id="install-deps">
{`npm install -D @jest/globals node-mocks-http supertest`}
            </CodeBlock>
          </div>
          <div className="card">
            <h4 className="font-semibold text-gray-900 mb-3">テストヘルパー設定</h4>
            <CodeBlock language="typescript" id="test-helpers">
{`// src/test-utils/api-helpers.ts
import { NextRequest, NextResponse } from 'next/server'
import { createMocks } from 'node-mocks-http'

export function createMockRequest(
  method: string,
  url: string,
  body?: any,
  headers?: Record<string, string>
): NextRequest {
  const mockReq = createMocks({
    method,
    url,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
  })

  return new NextRequest(url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: new Headers({
      'content-type': 'application/json',
      ...headers,
    }),
  })
}

export async function extractResponseData(response: Response) {
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export function expectApiError(
  response: Response,
  status: number,
  errorMessage?: string
) {
  expect(response.status).toBe(status)
  if (errorMessage) {
    expect(response.statusText).toContain(errorMessage)
  }
}`}
            </CodeBlock>
          </div>
        </div>
      )
    },
    {
      id: 'jest-config',
      label: 'Jest設定',
      content: (
        <div className="space-y-6">
          <div className="card">
            <h4 className="font-semibold text-gray-900 mb-3">API専用Jest設定</h4>
            <CodeBlock language="javascript" id="jest-config-api">
{`// jest.config.api.js
const baseConfig = require('./jest.config.js')

module.exports = {
  ...baseConfig,
  testMatch: [
    '<rootDir>/src/app/api/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/app/api/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
  testEnvironment: 'node', // API tests run in Node environment
  setupFilesAfterEnv: ['<rootDir>/jest.setup.api.js'],
}`}
            </CodeBlock>
          </div>
          <div className="card">
            <h4 className="font-semibold text-gray-900 mb-3">セットアップファイル</h4>
            <CodeBlock language="javascript" id="jest-setup">
{`// jest.setup.api.js
import { TextEncoder, TextDecoder } from 'util'

// Global polyfills for Node.js environment
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock Next.js runtime
process.env.NODE_ENV = 'test'
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'

// Mock environment variables
process.env.NOTION_API_KEY = 'test-notion-key'
process.env.RESEND_API_KEY = 'test-resend-key'
process.env.STRIPE_SECRET_KEY = 'test-stripe-key'

// Custom matchers for API testing
expect.extend({
  toBeValidApiResponse(received) {
    const pass = received.status >= 200 && received.status < 300
    return {
      message: () => \`expected \${received.status} to be a valid API response status\`,
      pass,
    }
  },
  
  toHaveRequiredHeaders(received, headers) {
    const missing = headers.filter(header => !received.headers.get(header))
    const pass = missing.length === 0
    return {
      message: () => \`expected response to have headers: \${missing.join(', ')}\`,
      pass,
    }
  },
})`}
            </CodeBlock>
          </div>
        </div>
      )
    },
    {
      id: 'package-scripts',
      label: 'NPMスクリプト',
      content: (
        <div className="space-y-6">
          <div className="card">
            <h4 className="font-semibold text-gray-900 mb-3">package.json スクリプト追加</h4>
            <CodeBlock language="json" id="npm-scripts">
{`{
  "scripts": {
    "test:api": "jest --config jest.config.api.js",
    "test:api:watch": "jest --config jest.config.api.js --watch",
    "test:api:coverage": "jest --config jest.config.api.js --coverage"
  }
}`}
            </CodeBlock>
          </div>
        </div>
      )
    }
  ]

  const apiTestTabs = [
    {
      id: 'waitlist-api',
      label: 'Waitlist API',
      content: (
        <div className="space-y-6">
          <div className="card">
            <h4 className="font-semibold text-gray-900 mb-3">基本的なテスト構造</h4>
            <CodeBlock language="typescript" id="waitlist-basic">
{`// src/app/api/waitlist/__tests__/route.test.ts
import { POST } from '../route'
import { createMockRequest, extractResponseData } from '@/test-utils/api-helpers'
import type { WaitlistEntry } from '@/types'

// External dependencies mocks
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn().mockResolvedValue({ id: 'mock-email-id' }),
    },
  })),
}))

// Mock database
const mockDatabase: WaitlistEntry[] = []
jest.mock('@/lib/database', () => ({
  addToWaitlist: jest.fn().mockImplementation(async (entry: WaitlistEntry) => {
    if (mockDatabase.find(e => e.email === entry.email)) {
      throw new Error('Email already registered')
    }
    const newEntry = { ...entry, id: \`mock-id-\${Date.now()}\` }
    mockDatabase.push(newEntry)
    return newEntry
  }),
}))

describe('/api/waitlist POST', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDatabase.length = 0
  })

  it('should successfully register a new user with all fields', async () => {
    const requestBody = {
      email: 'test@example.com',
      name: 'Test User',
      role: 'developer',
      interests: ['dao', 'saas'],
      source: 'homepage',
    }

    const request = createMockRequest('POST', '/api/waitlist', requestBody)
    const response = await POST(request)
    const data = await extractResponseData(response)

    expect(response.status).toBe(201)
    expect(data).toEqual({
      message: 'Successfully added to waitlist',
      id: expect.stringMatching(/^mock-id-\\d+$/),
    })
  })
})`}
            </CodeBlock>
          </div>
        </div>
      )
    },
    {
      id: 'contact-api',
      label: 'Contact API',
      content: (
        <div className="space-y-6">
          <div className="card">
            <h4 className="font-semibold text-gray-900 mb-3">Contact APIテスト例</h4>
            <CodeBlock language="typescript" id="contact-test">
{`// src/app/api/contact/__tests__/route.test.ts
import { POST } from '../route'
import { createMockRequest, extractResponseData } from '@/test-utils/api-helpers'
import type { ContactForm } from '@/types'

describe('/api/contact POST', () => {
  it('should handle general inquiry contact form', async () => {
    const requestBody: ContactForm = {
      name: 'John Doe',
      email: 'john@example.com',
      company: 'Example Corp',
      message: 'I am interested in learning more about UnsonOS.',
      type: 'general',
    }

    const request = createMockRequest('POST', '/api/contact', requestBody)
    const response = await POST(request)
    const data = await extractResponseData(response)

    expect(response.status).toBe(201)
    expect(data.message).toBe('Contact form submitted successfully')
    expect(data.id).toBeDefined()
  })

  it('should handle investment inquiry with high priority', async () => {
    const requestBody: ContactForm = {
      name: 'Jane Investor',
      email: 'jane@vc-fund.com',
      company: 'VC Fund',
      message: 'We are interested in investing in UnsonOS.',
      type: 'investment',
    }

    const request = createMockRequest('POST', '/api/contact', requestBody)
    const response = await POST(request)
    const data = await extractResponseData(response)

    expect(response.status).toBe(201)
    expect(data.priority).toBe('high') // Investment inquiries are high priority
  })
})`}
            </CodeBlock>
          </div>
        </div>
      )
    },
    {
      id: 'analytics-api',
      label: 'Analytics API',
      content: (
        <div className="space-y-6">
          <div className="card">
            <h4 className="font-semibold text-gray-900 mb-3">Analytics APIテスト例</h4>
            <CodeBlock language="typescript" id="analytics-test">
{`// src/app/api/analytics/__tests__/revenue/route.test.ts
import { GET } from '../../revenue/route'
import { createMockRequest, extractResponseData } from '@/test-utils/api-helpers'

// Mock external services
jest.mock('@/lib/stripe', () => ({
  getRevenueData: jest.fn(),
}))

describe('/api/analytics/revenue GET', () => {
  it('should return current revenue analytics', async () => {
    const mockStripe = require('@/lib/stripe')
    
    mockStripe.getRevenueData.mockResolvedValue({
      totalRevenue: 250000,
      monthlyRevenue: 50000,
    })

    const request = createMockRequest('GET', '/api/analytics/revenue')
    const response = await GET(request)
    const data = await extractResponseData(response)

    expect(response.status).toBe(200)
    expect(data).toEqual({
      totalRevenue: 250000,
      monthlyRevenue: 50000,
      activeProducts: expect.any(Number),
      communityMembers: expect.any(Number),
      lastUpdated: expect.any(String),
    })
  })

  it('should require valid API key for detailed analytics', async () => {
    const request = createMockRequest(
      'GET',
      '/api/analytics/revenue?detailed=true'
    )

    const response = await GET(request)
    const data = await extractResponseData(response)

    expect(response.status).toBe(401)
    expect(data.error).toBe('API key required for detailed analytics')
  })
})`}
            </CodeBlock>
          </div>
        </div>
      )
    },
    {
      id: 'notion-api',
      label: 'Notion CMS API',
      content: (
        <div className="space-y-6">
          <div className="card">
            <h4 className="font-semibold text-gray-900 mb-3">Notion APIテスト例</h4>
            <CodeBlock language="typescript" id="notion-test">
{`// src/app/api/notion/__tests__/route.test.ts
import { GET, POST } from '../route'
import { createMockRequest, extractResponseData } from '@/test-utils/api-helpers'

// Mock Notion client
jest.mock('@notionhq/client', () => ({
  Client: jest.fn().mockImplementation(() => ({
    databases: {
      query: jest.fn(),
    },
    pages: {
      create: jest.fn(),
      retrieve: jest.fn(),
    },
  })),
}))

describe('/api/notion GET (Blog Posts)', () => {
  it('should fetch published blog posts', async () => {
    const mockNotionClient = require('@notionhq/client').Client()
    
    mockNotionClient.databases.query.mockResolvedValue({
      results: [
        {
          id: 'post-1',
          properties: {
            Title: {
              title: [{ plain_text: 'First Blog Post' }],
            },
            Status: {
              select: { name: 'Published' },
            },
            Date: {
              date: { start: '2024-01-01' },
            },
          },
          last_edited_time: '2024-01-01T10:00:00.000Z',
        },
      ],
    })

    const request = createMockRequest('GET', '/api/notion')
    const response = await GET(request)
    const data = await extractResponseData(response)

    expect(response.status).toBe(200)
    expect(data.posts).toHaveLength(1)
    expect(data.posts[0]).toEqual({
      id: 'post-1',
      title: 'First Blog Post',
      status: 'Published',
      publishedAt: '2024-01-01',
      lastEditedTime: '2024-01-01T10:00:00.000Z',
    })
  })
})`}
            </CodeBlock>
          </div>
        </div>
      )
    }
  ]

  const testScenarios = [
    {
      title: 'バリデーションエラーテスト',
      description: 'フォームの必須フィールドやデータ形式の検証',
      examples: [
        'メールアドレス形式の検証',
        '必須フィールドの存在確認',
        '文字数制限の検証',
        '不正な値の拒否'
      ]
    },
    {
      title: 'エラーハンドリング',
      description: '外部サービスエラーや例外的な状況への対応',
      examples: [
        'データベース接続エラー',
        '外部API呼び出し失敗',
        'メール送信エラー',
        'レート制限超過'
      ]
    },
    {
      title: 'セキュリティテスト',
      description: 'セキュリティ脆弱性の検証',
      examples: [
        'SQL インジェクション防止',
        'XSS 攻撃防止',
        '認証・認可の検証',
        'CORS ヘッダーの確認'
      ]
    },
    {
      title: 'パフォーマンステスト',
      description: 'レスポンス時間と負荷処理の検証',
      examples: [
        'レスポンス時間の測定',
        '大量データ処理の検証',
        'メモリ使用量の監視',
        '並行処理の検証'
      ]
    }
  ]

  const tddWorkflowItems = [
    {
      id: 'red-phase',
      title: 'Red Phase: 失敗するテストを書く',
      content: (
        <div>
          <p className="text-gray-600 mb-3">実装前にテストを書き、期待される動作を定義</p>
          <CodeBlock language="typescript" id="red-phase">
{`it('should validate email format in waitlist API', async () => {
  const request = createMockRequest('POST', '/api/waitlist', {
    email: 'invalid-email',
    name: 'Test User',
  })
  
  const response = await POST(request)
  const data = await extractResponseData(response)
  
  expect(response.status).toBe(400)
  expect(data.error).toBe('Invalid email format')
})`}
          </CodeBlock>
        </div>
      )
    },
    {
      id: 'green-phase',
      title: 'Green Phase: ベタ書き実装',
      content: (
        <div>
          <p className="text-gray-600 mb-3">テストを通すための最小限の実装（ハードコード許可）</p>
          <CodeBlock language="typescript" id="green-phase">
{`export async function POST(request: NextRequest) {
  const body = await request.json()
  
  // ベタ書き検証（Green Phase）
  if (!body.email || !body.email.includes('@')) {
    return Response.json(
      { error: 'Invalid email format' },
      { status: 400 }
    )
  }
  
  // 処理続行...
}`}
          </CodeBlock>
        </div>
      )
    },
    {
      id: 'refactor-phase',
      title: 'Refactor Phase: 保守性向上',
      content: (
        <div>
          <p className="text-gray-600 mb-3">ハードコードを除去し、適切な実装に置き換え</p>
          <CodeBlock language="typescript" id="refactor-phase">
{`import { z } from 'zod'

const waitlistSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['developer', 'designer', 'marketer', 'investor', 'other']).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = waitlistSchema.parse(body)
    
    // 処理続行...
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { errors: error.flatten().fieldErrors },
        { status: 400 }
      )
    }
    throw error
  }
}`}
          </CodeBlock>
        </div>
      )
    }
  ]

  const bestPractices = [
    {
      icon: '🎯',
      title: 'テストの独立性',
      description: '各テストは他のテストに依存せず、独立して実行可能',
      tips: ['beforeEach/afterEachでクリーンアップ', 'グローバル状態への依存を避ける', 'テストデータの初期化']
    },
    {
      icon: '🔧',
      title: '適切なモック',
      description: '外部依存のみをモック化し、ビジネスロジックはテスト',
      tips: ['外部API（OpenAI、Stripe等）のみモック化', 'ビジネスロジックはモックしない', 'モックの過度な使用を避ける']
    },
    {
      icon: '📊',
      title: '実用的なテストデータ',
      description: '実際のユースケースに基づいたテストデータを使用',
      tips: ['ユーザーペルソナから導出', '思い込み破壊シナリオの反映', 'エッジケースの考慮']
    },
    {
      icon: '⚡',
      title: '高速なテスト実行',
      description: 'CI/CDパイプラインでの迅速なフィードバック',
      tips: ['テスト並列実行', '必要最小限のセットアップ', 'ヘビーテストの分離']
    }
  ]

  return (
    <DocsLayout>
      {/* ヒーローセクション */}
      <section className="section-padding bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container-custom">
          <div className="text-center animate-fade-in">
            <h1 className="heading-primary text-gray-900 mb-6">
              API テスト
              <span className="block text-purple-600 mt-2">
                完全ガイド
              </span>
            </h1>
            <p className="text-large max-w-3xl mx-auto mb-8">
              Next.js 14 App Router のAPI Routes用の包括的テストケース。
              TDD アプローチに従い、Red-Green-RefactorサイクルでAPIエンドポイントの品質を保証します。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                テスト環境セットアップ
              </Button>
              <Button variant="outline" size="lg">
                サンプルテスト確認
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* テスト環境セットアップ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">API テスト環境セットアップ</h2>
          <Tabs items={setupTabs} />
        </div>
      </section>

      {/* API別テストケース */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">API別テストケース</h2>
          <Tabs items={apiTestTabs} />
        </div>
      </section>

      {/* テストシナリオ */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">重要なテストシナリオ</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {testScenarios.map((scenario, index) => (
              <div key={index} className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {scenario.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {scenario.description}
                </p>
                <ul className="space-y-2">
                  {scenario.examples.map((example, exampleIndex) => (
                    <li key={exampleIndex} className="flex items-start text-sm text-gray-600">
                      <span className="mr-2 text-blue-500">•</span>
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TDD ワークフロー */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">TDD ワークフロー例（API編）</h2>
          <div className="max-w-4xl mx-auto">
            <Accordion items={tddWorkflowItems} />
          </div>
        </div>
      </section>

      {/* ベストプラクティス */}
      <section className="section-padding bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">APIテストのベストプラクティス</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {bestPractices.map((practice, index) => (
              <div key={index} className="bg-white/10 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">{practice.icon}</span>
                  <h3 className="text-lg font-semibold">{practice.title}</h3>
                </div>
                <p className="text-purple-100 mb-4 text-sm">
                  {practice.description}
                </p>
                <ul className="space-y-1">
                  {practice.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-purple-100 text-sm flex items-start">
                      <span className="mr-2">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 実行コマンド */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="heading-secondary text-center mb-12">テスト実行コマンド</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                API テスト実行
              </h3>
              <CodeBlock language="bash" id="api-test-run">
{`# API専用テスト実行
npm run test:api

# 監視モード
npm run test:api:watch

# カバレッジ付き
npm run test:api:coverage`}
              </CodeBlock>
            </div>
            <div className="card text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                特定APIテスト
              </h3>
              <CodeBlock language="bash" id="specific-api-test">
{`# 特定のAPIテストのみ
npm run test:api -- waitlist

# 詳細モード
npm run test:api -- --verbose

# デバッグモード
npm run test:api -- --detectOpenHandles`}
              </CodeBlock>
            </div>
            <div className="card text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                CI/CDテスト
              </h3>
              <CodeBlock language="bash" id="cicd-test">
{`# CI環境でのテスト
CI=true npm run test:api

# テスト結果の出力
npm run test:api -- --outputFile=test-results.json

# 並列実行
npm run test:api -- --maxWorkers=4`}
              </CodeBlock>
            </div>
          </div>
        </div>
      </section>

      {/* 結論 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="heading-secondary mb-6">まとめ</h2>
          <p className="text-large max-w-3xl mx-auto mb-8">
            この包括的なAPIテストにより、Next.js 14のAPI Routesの品質を保証し、
            TDDアプローチでの安全な開発が可能になります。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/docs/testing-guidelines">
              <Button size="lg">
                テストガイドライン
              </Button>
            </a>
            <a href="/docs/development/setup-guide">
              <Button variant="outline" size="lg">
                セットアップガイド
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* クイックリンク */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <a href="/docs/testing-guidelines" className="text-blue-600 hover:text-blue-800">テストガイドライン</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/development/setup-guide" className="text-blue-600 hover:text-blue-800">セットアップガイド</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/development/folder-structure-guide" className="text-blue-600 hover:text-blue-800">フォルダ構造ガイド</a>
            <span className="text-gray-300">|</span>
            <a href="/docs/development/node-version-management" className="text-blue-600 hover:text-blue-800">Node.js管理</a>
          </div>
        </div>
      </section>
    </DocsLayout>
  )
}