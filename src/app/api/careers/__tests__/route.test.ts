import { POST } from '../route'
import { NextRequest } from 'next/server'

describe('/api/careers', () => {
  // Red Phase: 成功ケースのテスト
  it('should successfully submit career application', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/careers', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        position: 'Frontend Developer',
        experience: '3-5 years',
        coverLetter: 'I am very interested in this position because...',
        portfolio: 'https://github.com/testuser',
        availability: '2024-02-01'
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
    expect(data.message).toContain('Career application submitted successfully')
  })

  // Red Phase: メール必須のテスト
  it('should return 400 for missing email', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/careers', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        position: 'Frontend Developer',
        experience: '3-5 years',
        coverLetter: 'Test cover letter',
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
    const mockRequest = new NextRequest('http://localhost:3000/api/careers', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        position: 'Frontend Developer',
        experience: '3-5 years',
        coverLetter: 'Test cover letter',
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

  // Red Phase: ポジション必須のテスト
  it('should return 400 for missing position', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/careers', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        experience: '3-5 years',
        coverLetter: 'Test cover letter',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Position is required')
  })

  // Red Phase: 経験必須のテスト
  it('should return 400 for missing experience', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/careers', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        position: 'Frontend Developer',
        coverLetter: 'Test cover letter',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Experience is required')
  })

  // Red Phase: カバーレター必須のテスト
  it('should return 400 for missing cover letter', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/careers', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        position: 'Frontend Developer',
        experience: '3-5 years',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Cover letter is required')
  })

  // Red Phase: 無効なメール形式のテスト
  it('should return 400 for invalid email format', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/careers', {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid-email',
        name: 'Test User',
        position: 'Frontend Developer',
        experience: '3-5 years',
        coverLetter: 'Test cover letter',
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

  // Red Phase: 長すぎるカバーレターのテスト
  it('should return 400 for cover letter too long', async () => {
    const longCoverLetter = 'a'.repeat(5001) // 5000文字制限を想定
    const mockRequest = new NextRequest('http://localhost:3000/api/careers', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        position: 'Frontend Developer',
        experience: '3-5 years',
        coverLetter: longCoverLetter,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Cover letter too long')
  })

  // Red Phase: 無効なポートフォリオURLのテスト
  it('should return 400 for invalid portfolio URL', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/careers', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        position: 'Frontend Developer',
        experience: '3-5 years',
        coverLetter: 'Test cover letter',
        portfolio: 'not-a-url',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Invalid portfolio URL')
  })

  // Red Phase: 不正なJSONのテスト
  it('should handle malformed JSON', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/careers', {
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

  // Red Phase: ポジションバリデーションのテスト
  it('should validate position against available positions', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/careers', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        position: 'Invalid Position',
        experience: '3-5 years',
        coverLetter: 'Test cover letter',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(400)
    expect(data).toHaveProperty('error')
    expect(data.error).toContain('Invalid position')
  })

  // Red Phase: オプショナルフィールドのテスト
  it('should accept optional portfolio and availability fields', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/careers', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        position: 'Frontend Developer',
        experience: '3-5 years',
        coverLetter: 'Test cover letter',
        portfolio: 'https://github.com/testuser',
        availability: '2024-02-01'
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(201)
    expect(data).toHaveProperty('message')
    expect(data.message).toContain('Career application submitted successfully')
  })
})
