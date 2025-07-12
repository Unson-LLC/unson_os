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

describe('/api/contact', () => {
  // Red Phase: 成功ケースのテスト
  it('should successfully submit contact form', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        message: 'This is a test message for contact form.',
        subject: 'Test Subject'
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
    expect(data.message).toContain('Contact form submitted successfully')
  })

  // Red Phase: メール必須のテスト
  it('should return 400 for missing email', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        message: 'Test message',
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
    const mockRequest = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        message: 'Test message',
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

  // Red Phase: メッセージ必須のテスト
  it('should return 400 for missing message', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Message is required')
  })

  // Red Phase: 無効なメール形式のテスト
  it('should return 400 for invalid email format', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid-email',
        name: 'Test User',
        message: 'Test message',
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

  // Red Phase: 不正なJSONのテスト
  it('should handle malformed JSON', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/contact', {
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

  // Red Phase: 長すぎるメッセージのテスト
  it('should return 400 for message too long', async () => {
    const longMessage = 'a'.repeat(5001) // 5000文字制限を想定
    const mockRequest = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        message: longMessage,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Message too long')
  })

  // Red Phase: 長すぎる名前のテスト
  it('should return 400 for name too long', async () => {
    const longName = 'a'.repeat(101) // 100文字制限を想定
    const mockRequest = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: longName,
        message: 'Test message',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Name too long')
  })

  // Red Phase: 必須フィールドのオプショナル件名のテスト
  it('should accept optional subject field', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        message: 'Test message',
        subject: 'Optional subject'
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(201)
    expect(data).toHaveProperty('message')
    expect(data.message).toContain('Contact form submitted successfully')
  })
})
