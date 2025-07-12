import { POST } from '../route'
import { NextRequest } from 'next/server'

describe('/api/waitlist', () => {
  it('should successfully add email to waitlist', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        role: 'developer',
        interests: ['dao', 'saas'],
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
    expect(data.message).toContain('Successfully')
  })

  it('should return 400 for missing email', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({
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
    expect(data.error).toContain('Email is required')
  })

  it('should return 400 for invalid email format', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid-email',
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
    expect(data.error).toContain('Invalid email format')
  })

  it('should return 400 for missing name', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
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

  it('should handle malformed JSON', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/waitlist', {
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

  it('should handle very long email addresses', async () => {
    const longEmail = 'a'.repeat(100) + '@' + 'b'.repeat(100) + '.com'
    const mockRequest = new NextRequest('http://localhost:3000/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({
        email: longEmail,
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
    expect(data.error).toContain('Email too long')
  })

  it('should sanitize and validate role field', async () => {
    const mockRequest = new NextRequest('http://localhost:3000/api/waitlist', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        role: 'designer',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(mockRequest)
    const data = await response.json()
    
    expect(response.status).toBe(201)
    expect(data).toHaveProperty('message')
  })
})