import { POST } from '../route'
import { NextRequest } from 'next/server'

// api-utils mock
jest.mock('@/lib/api/api-utils', () => ({
  createSuccessResponse: jest.fn((message, id, status = 201) => ({
    status,
    json: async () => ({ message, id })
  })),
  createErrorResponse: jest.fn((error, status = 400) => ({
    status,
    json: async () => ({ error })
  })),
  generateId: jest.fn(() => 'mock-id'),
  handleApiError: jest.fn(() => ({
    status: 400,
    json: async () => ({ error: 'Invalid JSON' })
  })),
  safeParseJson: jest.fn(async (request) => {
    try {
      const data = await request.json()
      return { success: true, data }
    } catch (error) {
      return {
        success: false,
        response: {
          status: 400,
          json: async () => ({ error: 'Invalid JSON' })
        }
      }
    }
  })
}))

describe('/api/product-request', () => {
  // Red Phase: 成功ケースのテスト
  it('should successfully submit product request', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/product-request', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        productTitle: 'AI-powered Task Manager',
        description: 'A task management SaaS with AI suggestions and automation.',
        category: 'productivity',
        priority: 'high'
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(201)
    expect(data).toHaveProperty('message')
    expect(data).toHaveProperty('id')
    expect(data.message).toContain('Product request submitted successfully')
  })

  // Red Phase: メール必須のテスト
  it('should return 400 for missing email', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/product-request', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        productTitle: 'Test Product',
        description: 'Test description',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Email is required')
  })

  // Red Phase: 名前必須のテスト
  it('should return 400 for missing name', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/product-request', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        productTitle: 'Test Product',
        description: 'Test description',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Name is required')
  })

  // Red Phase: プロダクトタイトル必須のテスト
  it('should return 400 for missing product title', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/product-request', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        description: 'Test description',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Product title is required')
  })

  // Red Phase: 説明必須のテスト
  it('should return 400 for missing description', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/product-request', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        productTitle: 'Test Product',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Description is required')
  })

  // Red Phase: 無効なメール形式のテスト
  it('should return 400 for invalid email format', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/product-request', {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid-email',
        name: 'Test User',
        productTitle: 'Test Product',
        description: 'Test description',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Invalid email format')
  })

  // Red Phase: 長すぎるプロダクトタイトルのテスト
  it('should return 400 for product title too long', async () => {
    const longTitle = 'a'.repeat(201) // 200文字制限を想定
    const mockRequest = new NextRequest('http://localhost:3000/api/product-request', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        productTitle: longTitle,
        description: 'Test description',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Product title too long')
  })

  // Red Phase: 長すぎる説明のテスト
  it('should return 400 for description too long', async () => {
    const longDescription = 'a'.repeat(10001) // 10000文字制限を想定
    const mockRequest = new NextRequest('http://localhost:3000/api/product-request', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        productTitle: 'Test Product',
        description: longDescription,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Description too long')
  })

  // Red Phase: 不正なJSONのテスト
  it('should handle malformed JSON', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/product-request', {
      method: 'POST',
      body: 'invalid json',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Invalid JSON')
  })

  // Red Phase: オプショナルフィールドのテスト
  it('should accept optional category and priority fields', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/product-request', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        productTitle: 'Test Product',
        description: 'Test description',
        category: 'marketing',
        priority: 'medium'
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(201)
    expect(data).toHaveProperty('message')
    expect(data.message).toContain('Product request submitted successfully')
  })

  // Red Phase: カテゴリバリデーションのテスト
  it('should validate category if provided', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/product-request', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        productTitle: 'Test Product',
        description: 'Test description',
        category: 'invalid-category'
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Invalid category')
  })
})
