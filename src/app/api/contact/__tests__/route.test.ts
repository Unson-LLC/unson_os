import { POST } from '../route'

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: (data: any, init: any = {}) => ({
      status: init.status || 200,
      json: async () => data,
    }),
  },
}))

// Mock request helper
const createMockRequest = (body: any) => ({
  json: jest.fn().mockResolvedValue(body),
}) as any

describe('/api/contact', () => {
  // Red Phase: 成功ケースのテスト
  it('should successfully submit contact form', async () => {
    const mockRequest = createMockRequest({
      email: 'test@example.com',
      name: 'Test User',
      message: 'This is a test message for contact form.',
      subject: 'Test Subject'
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
    const mockRequest = createMockRequest({
      name: 'Test User',
      message: 'Test message',
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Email is required')
  })

  // Red Phase: 名前必須のテスト
  it('should return 400 for missing name', async () => {
    const mockRequest = createMockRequest({
      email: 'test@example.com',
      message: 'Test message',
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Name is required')
  })

  // Red Phase: メッセージ必須のテスト
  it('should return 400 for missing message', async () => {
    const mockRequest = createMockRequest({
      email: 'test@example.com',
      name: 'Test User',
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Message is required')
  })

  // Red Phase: 無効なメール形式のテスト
  it('should return 400 for invalid email format', async () => {
    const mockRequest = createMockRequest({
      email: 'invalid-email',
      name: 'Test User',
      message: 'Test message',
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Invalid email format')
  })

  // Red Phase: 不正なJSONのテスト
  it('should handle malformed JSON', async () => {
    const mockRequest = {
      json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
    } as any

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Invalid JSON')
  })

  // Red Phase: 長すぎるメッセージのテスト
  it('should return 400 for message too long', async () => {
    const longMessage = 'a'.repeat(5001) // 5000文字制限を想定
    const mockRequest = createMockRequest({
      email: 'test@example.com',
      name: 'Test User',
      message: longMessage,
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
    const mockRequest = createMockRequest({
      email: 'test@example.com',
      name: longName,
      message: 'Test message',
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Name too long')
  })

  // Red Phase: 必須フィールドのオプショナル件名のテスト
  it('should accept optional subject field', async () => {
    const mockRequest = createMockRequest({
      email: 'test@example.com',
      name: 'Test User',
      message: 'Test message',
      subject: 'Optional subject'
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(201)
    expect(data).toHaveProperty('message')
    expect(data.message).toContain('Contact form submitted successfully')
  })
})
