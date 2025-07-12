# UnsonOS LP API テスト完全ガイド

## 概要

Next.js 14 App Router のAPI Routes用の包括的テストケース。TDD アプローチに従い、Red-Green-RefactorサイクルでAPIエンドポイントの品質を保証。

---

## API テスト環境セットアップ

### テスト用依存関係
```bash
npm install -D @jest/globals node-mocks-http supertest
```

### テストヘルパー設定

#### src/test-utils/api-helpers.ts
```typescript
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
}
```

---

## Waitlist API テスト

### src/app/api/waitlist/__tests__/route.test.ts
```typescript
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

// Mock database (in real app, this would be your actual DB)
const mockDatabase: WaitlistEntry[] = []
jest.mock('@/lib/database', () => ({
  addToWaitlist: jest.fn().mockImplementation(async (entry: WaitlistEntry) => {
    // Check for duplicates
    if (mockDatabase.find(e => e.email === entry.email)) {
      throw new Error('Email already registered')
    }
    const newEntry = { ...entry, id: `mock-id-${Date.now()}` }
    mockDatabase.push(newEntry)
    return newEntry
  }),
}))

describe('/api/waitlist POST', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDatabase.length = 0 // Clear mock database
  })

  describe('Successful Registration', () => {
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
        id: expect.stringMatching(/^mock-id-\d+$/),
      })
    })

    it('should register with minimal required fields only', async () => {
      const requestBody = {
        email: 'minimal@example.com',
        name: 'Minimal User',
      }

      const request = createMockRequest('POST', '/api/waitlist', requestBody)
      const response = await POST(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(201)
      expect(data.message).toBe('Successfully added to waitlist')
    })

    it('should send welcome email after successful registration', async () => {
      const mockResend = require('resend').Resend
      const mockEmailSend = jest.fn().mockResolvedValue({ id: 'email-123' })
      mockResend.mockImplementation(() => ({
        emails: { send: mockEmailSend },
      }))

      const requestBody = {
        email: 'welcome@example.com',
        name: 'Welcome User',
      }

      const request = createMockRequest('POST', '/api/waitlist', requestBody)
      await POST(request)

      expect(mockEmailSend).toHaveBeenCalledWith({
        from: expect.stringContaining('@'),
        to: 'welcome@example.com',
        subject: expect.stringContaining('UnsonOS'),
        html: expect.stringContaining('Welcome User'),
      })
    })
  })

  describe('Validation Errors', () => {
    it('should return 400 for missing email', async () => {
      const requestBody = {
        name: 'Test User',
      }

      const request = createMockRequest('POST', '/api/waitlist', requestBody)
      const response = await POST(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(400)
      expect(data.error).toBe('Email is required')
      expect(data.field).toBe('email')
    })

    it('should return 400 for missing name', async () => {
      const requestBody = {
        email: 'test@example.com',
      }

      const request = createMockRequest('POST', '/api/waitlist', requestBody)
      const response = await POST(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(400)
      expect(data.error).toBe('Name is required')
      expect(data.field).toBe('name')
    })

    it('should return 400 for invalid email format', async () => {
      const requestBody = {
        email: 'invalid-email-format',
        name: 'Test User',
      }

      const request = createMockRequest('POST', '/api/waitlist', requestBody)
      const response = await POST(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid email format')
      expect(data.field).toBe('email')
    })

    it('should return 400 for invalid role', async () => {
      const requestBody = {
        email: 'test@example.com',
        name: 'Test User',
        role: 'invalid-role',
      }

      const request = createMockRequest('POST', '/api/waitlist', requestBody)
      const response = await POST(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid role')
      expect(data.field).toBe('role')
    })

    it('should return 400 for name too short', async () => {
      const requestBody = {
        email: 'test@example.com',
        name: 'A', // 1文字は短すぎる
      }

      const request = createMockRequest('POST', '/api/waitlist', requestBody)
      const response = await POST(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(400)
      expect(data.error).toBe('Name must be at least 2 characters')
      expect(data.field).toBe('name')
    })
  })

  describe('Duplicate Email Handling', () => {
    it('should return 409 for duplicate email registration', async () => {
      const requestBody = {
        email: 'duplicate@example.com',
        name: 'First User',
      }

      // First registration
      const request1 = createMockRequest('POST', '/api/waitlist', requestBody)
      const response1 = await POST(request1)
      expect(response1.status).toBe(201)

      // Duplicate registration
      const request2 = createMockRequest('POST', '/api/waitlist', {
        ...requestBody,
        name: 'Second User',
      })
      const response2 = await POST(request2)
      const data2 = await extractResponseData(response2)

      expect(response2.status).toBe(409)
      expect(data2.error).toBe('Email already registered')
    })
  })

  describe('Request Method Validation', () => {
    it('should return 405 for GET requests', async () => {
      const request = createMockRequest('GET', '/api/waitlist')
      
      // GET method should not be handled by POST handler
      // This test assumes we have proper method handling
      try {
        await POST(request)
        fail('Should not reach here')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
      }
    })
  })

  describe('Content-Type Validation', () => {
    it('should return 400 for non-JSON content type', async () => {
      const request = createMockRequest(
        'POST',
        '/api/waitlist',
        'email=test@example.com&name=Test',
        { 'content-type': 'application/x-www-form-urlencoded' }
      )

      const response = await POST(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(400)
      expect(data.error).toBe('Content-Type must be application/json')
    })
  })

  describe('Rate Limiting', () => {
    it('should handle rate limiting (mock implementation)', async () => {
      // This would be implementation specific
      // Example with redis-based rate limiting
      const requestBody = {
        email: 'ratelimit@example.com',
        name: 'Rate Limit User',
      }

      // Simulate multiple rapid requests from same IP
      const promises = Array.from({ length: 10 }, () => {
        const request = createMockRequest('POST', '/api/waitlist', requestBody, {
          'x-forwarded-for': '192.168.1.1',
        })
        return POST(request)
      })

      const responses = await Promise.all(promises)
      
      // At least one should be rate limited
      const rateLimitedResponses = responses.filter(r => r.status === 429)
      expect(rateLimitedResponses.length).toBeGreaterThan(0)
    })
  })

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      // Mock database error
      const mockAddToWaitlist = require('@/lib/database').addToWaitlist
      mockAddToWaitlist.mockRejectedValueOnce(new Error('Database connection failed'))

      const requestBody = {
        email: 'db-error@example.com',
        name: 'DB Error User',
      }

      const request = createMockRequest('POST', '/api/waitlist', requestBody)
      const response = await POST(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
      expect(data.details).toBeUndefined() // Don't expose internal errors
    })

    it('should handle email service errors gracefully', async () => {
      // Mock email service error
      const mockResend = require('resend').Resend
      mockResend.mockImplementation(() => ({
        emails: {
          send: jest.fn().mockRejectedValue(new Error('Email service down')),
        },
      }))

      const requestBody = {
        email: 'email-fail@example.com',
        name: 'Email Fail User',
      }

      const request = createMockRequest('POST', '/api/waitlist', requestBody)
      const response = await POST(request)
      const data = await extractResponseData(response)

      // Should still register user even if email fails
      expect(response.status).toBe(201)
      expect(data.message).toBe('Successfully added to waitlist')
      expect(data.emailSent).toBe(false)
    })
  })

  describe('CORS Headers', () => {
    it('should include proper CORS headers', async () => {
      const requestBody = {
        email: 'cors@example.com',
        name: 'CORS User',
      }

      const request = createMockRequest('POST', '/api/waitlist', requestBody, {
        'origin': 'https://unson-os.com',
      })
      const response = await POST(request)

      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST')
    })
  })
})
```

---

## Contact API テスト

### src/app/api/contact/__tests__/route.test.ts
```typescript
import { POST } from '../route'
import { createMockRequest, extractResponseData } from '@/test-utils/api-helpers'
import type { ContactForm } from '@/types'

// Mock external dependencies
jest.mock('resend')
jest.mock('@/lib/notion', () => ({
  addContactToNotion: jest.fn(),
}))

describe('/api/contact POST', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Successful Submissions', () => {
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

    it('should handle investment inquiry with different email template', async () => {
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
      expect(data.message).toBe('Contact form submitted successfully')
      expect(data.priority).toBe('high') // Investment inquiries are high priority
    })

    it('should handle partnership inquiry', async () => {
      const requestBody: ContactForm = {
        name: 'Partner Company',
        email: 'partnerships@company.com',
        message: 'We want to discuss partnership opportunities.',
        type: 'partnership',
      }

      const request = createMockRequest('POST', '/api/contact', requestBody)
      const response = await POST(request)

      expect(response.status).toBe(201)
    })

    it('should handle press inquiry', async () => {
      const requestBody: ContactForm = {
        name: 'Reporter Name',
        email: 'reporter@media.com',
        company: 'Media Company',
        message: 'I would like to write about UnsonOS.',
        type: 'press',
      }

      const request = createMockRequest('POST', '/api/contact', requestBody)
      const response = await POST(request)

      expect(response.status).toBe(201)
    })
  })

  describe('Validation Errors', () => {
    it('should require name, email, and message', async () => {
      const requestBody = {
        // Missing required fields
        type: 'general',
      }

      const request = createMockRequest('POST', '/api/contact', requestBody)
      const response = await POST(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(400)
      expect(data.errors).toEqual({
        name: 'Name is required',
        email: 'Email is required',
        message: 'Message is required',
      })
    })

    it('should validate email format', async () => {
      const requestBody = {
        name: 'Test User',
        email: 'invalid-email',
        message: 'Test message',
        type: 'general',
      }

      const request = createMockRequest('POST', '/api/contact', requestBody)
      const response = await POST(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(400)
      expect(data.errors.email).toBe('Invalid email format')
    })

    it('should validate message length', async () => {
      const requestBody = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Hi', // Too short
        type: 'general',
      }

      const request = createMockRequest('POST', '/api/contact', requestBody)
      const response = await POST(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(400)
      expect(data.errors.message).toBe('Message must be at least 10 characters')
    })

    it('should validate inquiry type', async () => {
      const requestBody = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message',
        type: 'invalid-type',
      }

      const request = createMockRequest('POST', '/api/contact', requestBody)
      const response = await POST(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(400)
      expect(data.errors.type).toBe('Invalid inquiry type')
    })
  })

  describe('Spam Protection', () => {
    it('should detect and reject potential spam', async () => {
      const spamMessage = 'BUY NOW!!! AMAZING DEAL!!! CLICK HERE!!! ' +
                         'FREE MONEY!!! URGENT!!! IMMEDIATE ACTION REQUIRED!!!'

      const requestBody = {
        name: 'Spammer',
        email: 'spam@spam.com',
        message: spamMessage,
        type: 'general',
      }

      const request = createMockRequest('POST', '/api/contact', requestBody)
      const response = await POST(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(400)
      expect(data.error).toBe('Message appears to be spam')
    })

    it('should detect honeypot field submissions', async () => {
      const requestBody = {
        name: 'Real User',
        email: 'real@example.com',
        message: 'This is a legitimate message',
        type: 'general',
        honeypot: 'bot-filled-this', // Honeypot field
      }

      const request = createMockRequest('POST', '/api/contact', requestBody)
      const response = await POST(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(400)
      expect(data.error).toBe('Bot submission detected')
    })
  })

  describe('Email Notifications', () => {
    it('should send notification email to internal team', async () => {
      const mockResend = require('resend').Resend
      const mockEmailSend = jest.fn().mockResolvedValue({ id: 'notification-123' })
      mockResend.mockImplementation(() => ({
        emails: { send: mockEmailSend },
      }))

      const requestBody: ContactForm = {
        name: 'Important Client',
        email: 'client@bigcompany.com',
        company: 'Big Company',
        message: 'We have a large project proposal.',
        type: 'partnership',
      }

      const request = createMockRequest('POST', '/api/contact', requestBody)
      await POST(request)

      expect(mockEmailSend).toHaveBeenCalledWith({
        from: expect.any(String),
        to: expect.arrayContaining(['team@unson-os.com']),
        subject: expect.stringContaining('New Partnership Inquiry'),
        html: expect.stringContaining('Important Client'),
      })
    })

    it('should send auto-reply to user', async () => {
      const mockResend = require('resend').Resend
      const mockEmailSend = jest.fn().mockResolvedValue({ id: 'auto-reply-123' })
      mockResend.mockImplementation(() => ({
        emails: { send: mockEmailSend },
      }))

      const requestBody: ContactForm = {
        name: 'User Name',
        email: 'user@example.com',
        message: 'Test inquiry',
        type: 'general',
      }

      const request = createMockRequest('POST', '/api/contact', requestBody)
      await POST(request)

      // Check auto-reply email was sent
      expect(mockEmailSend).toHaveBeenCalledWith({
        from: expect.any(String),
        to: 'user@example.com',
        subject: expect.stringContaining('お問い合わせありがとうございます'),
        html: expect.stringContaining('User Name'),
      })
    })
  })

  describe('Notion Integration', () => {
    it('should save contact form data to Notion database', async () => {
      const mockAddContactToNotion = require('@/lib/notion').addContactToNotion
      mockAddContactToNotion.mockResolvedValue({ id: 'notion-page-123' })

      const requestBody: ContactForm = {
        name: 'Notion User',
        email: 'notion@example.com',
        company: 'Notion Corp',
        message: 'Save this to Notion',
        type: 'general',
      }

      const request = createMockRequest('POST', '/api/contact', requestBody)
      await POST(request)

      expect(mockAddContactToNotion).toHaveBeenCalledWith({
        name: 'Notion User',
        email: 'notion@example.com',
        company: 'Notion Corp',
        message: 'Save this to Notion',
        type: 'general',
        submittedAt: expect.any(Date),
      })
    })

    it('should handle Notion API errors gracefully', async () => {
      const mockAddContactToNotion = require('@/lib/notion').addContactToNotion
      mockAddContactToNotion.mockRejectedValue(new Error('Notion API error'))

      const requestBody: ContactForm = {
        name: 'Error User',
        email: 'error@example.com',
        message: 'This should still work',
        type: 'general',
      }

      const request = createMockRequest('POST', '/api/contact', requestBody)
      const response = await POST(request)

      // Should still succeed even if Notion fails
      expect(response.status).toBe(201)
    })
  })

  describe('Security Headers', () => {
    it('should include security headers in response', async () => {
      const requestBody: ContactForm = {
        name: 'Security User',
        email: 'security@example.com',
        message: 'Test security headers',
        type: 'general',
      }

      const request = createMockRequest('POST', '/api/contact', requestBody)
      const response = await POST(request)

      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
      expect(response.headers.get('X-Frame-Options')).toBe('DENY')
      expect(response.headers.get('X-XSS-Protection')).toBe('1; mode=block')
    })
  })
})
```

---

## Analytics API テスト

### src/app/api/analytics/__tests__/revenue/route.test.ts
```typescript
import { GET } from '../../revenue/route'
import { createMockRequest, extractResponseData } from '@/test-utils/api-helpers'

// Mock external services
jest.mock('@/lib/stripe', () => ({
  getRevenueData: jest.fn(),
}))

jest.mock('@/lib/database', () => ({
  getActiveProductsCount: jest.fn(),
  getCommunityMembersCount: jest.fn(),
}))

describe('/api/analytics/revenue GET', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Successful Data Retrieval', () => {
    it('should return current revenue analytics', async () => {
      // Mock successful API responses
      const mockStripe = require('@/lib/stripe')
      const mockDatabase = require('@/lib/database')
      
      mockStripe.getRevenueData.mockResolvedValue({
        totalRevenue: 250000,
        monthlyRevenue: 50000,
      })
      
      mockDatabase.getActiveProductsCount.mockResolvedValue(12)
      mockDatabase.getCommunityMembersCount.mockResolvedValue(1250)

      const request = createMockRequest('GET', '/api/analytics/revenue')
      const response = await GET(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(200)
      expect(data).toEqual({
        totalRevenue: 250000,
        monthlyRevenue: 50000,
        activeProducts: 12,
        communityMembers: 1250,
        lastUpdated: expect.any(String),
      })
    })

    it('should cache results for subsequent requests', async () => {
      const mockStripe = require('@/lib/stripe')
      mockStripe.getRevenueData.mockResolvedValue({
        totalRevenue: 250000,
        monthlyRevenue: 50000,
      })

      // First request
      const request1 = createMockRequest('GET', '/api/analytics/revenue')
      await GET(request1)

      // Second request (should use cache)
      const request2 = createMockRequest('GET', '/api/analytics/revenue')
      const response2 = await GET(request2)
      const data2 = await extractResponseData(response2)

      expect(response2.status).toBe(200)
      expect(response2.headers.get('X-Cache')).toBe('HIT')
      
      // Stripe should only be called once due to caching
      expect(mockStripe.getRevenueData).toHaveBeenCalledTimes(1)
    })
  })

  describe('Authentication & Authorization', () => {
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

    it('should accept valid API key', async () => {
      const request = createMockRequest(
        'GET',
        '/api/analytics/revenue?detailed=true',
        null,
        { 'x-api-key': 'valid-api-key-123' }
      )

      const response = await GET(request)

      expect(response.status).not.toBe(401)
    })

    it('should reject invalid API key', async () => {
      const request = createMockRequest(
        'GET',
        '/api/analytics/revenue?detailed=true',
        null,
        { 'x-api-key': 'invalid-key' }
      )

      const response = await GET(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(403)
      expect(data.error).toBe('Invalid API key')
    })
  })

  describe('Query Parameters', () => {
    it('should filter by date range when provided', async () => {
      const mockStripe = require('@/lib/stripe')
      mockStripe.getRevenueData.mockResolvedValue({
        totalRevenue: 100000,
        monthlyRevenue: 25000,
      })

      const request = createMockRequest(
        'GET',
        '/api/analytics/revenue?from=2024-01-01&to=2024-01-31'
      )
      const response = await GET(request)

      expect(response.status).toBe(200)
      expect(mockStripe.getRevenueData).toHaveBeenCalledWith({
        from: new Date('2024-01-01'),
        to: new Date('2024-01-31'),
      })
    })

    it('should validate date format', async () => {
      const request = createMockRequest(
        'GET',
        '/api/analytics/revenue?from=invalid-date'
      )
      const response = await GET(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid date format')
    })

    it('should return detailed breakdown when requested', async () => {
      const mockStripe = require('@/lib/stripe')
      mockStripe.getRevenueData.mockResolvedValue({
        totalRevenue: 250000,
        monthlyRevenue: 50000,
        breakdown: {
          operations: 22500, // 45%
          founders: 7500,    // 15%
          community: 20000,  // 40%
        },
      })

      const request = createMockRequest(
        'GET',
        '/api/analytics/revenue?detailed=true',
        null,
        { 'x-api-key': 'valid-api-key-123' }
      )
      const response = await GET(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(200)
      expect(data.breakdown).toBeDefined()
      expect(data.breakdown.operations).toBe(22500)
    })
  })

  describe('Error Handling', () => {
    it('should handle Stripe API errors', async () => {
      const mockStripe = require('@/lib/stripe')
      mockStripe.getRevenueData.mockRejectedValue(
        new Error('Stripe API unavailable')
      )

      const request = createMockRequest('GET', '/api/analytics/revenue')
      const response = await GET(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(503)
      expect(data.error).toBe('Revenue data temporarily unavailable')
    })

    it('should handle database connection errors', async () => {
      const mockDatabase = require('@/lib/database')
      mockDatabase.getActiveProductsCount.mockRejectedValue(
        new Error('Database connection failed')
      )

      const request = createMockRequest('GET', '/api/analytics/revenue')
      const response = await GET(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(500)
      expect(data.error).toBe('Internal server error')
    })

    it('should return partial data when some services fail', async () => {
      const mockStripe = require('@/lib/stripe')
      const mockDatabase = require('@/lib/database')
      
      mockStripe.getRevenueData.mockResolvedValue({
        totalRevenue: 250000,
        monthlyRevenue: 50000,
      })
      
      // Database calls fail
      mockDatabase.getActiveProductsCount.mockRejectedValue(new Error('DB error'))
      mockDatabase.getCommunityMembersCount.mockRejectedValue(new Error('DB error'))

      const request = createMockRequest('GET', '/api/analytics/revenue')
      const response = await GET(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(200)
      expect(data.totalRevenue).toBe(250000)
      expect(data.monthlyRevenue).toBe(50000)
      expect(data.activeProducts).toBe(0) // Default value
      expect(data.communityMembers).toBe(0) // Default value
      expect(data.warnings).toContain('Some data unavailable')
    })
  })

  describe('Rate Limiting', () => {
    it('should enforce rate limits on public endpoint', async () => {
      const requests = Array.from({ length: 15 }, () =>
        createMockRequest('GET', '/api/analytics/revenue', null, {
          'x-forwarded-for': '192.168.1.1',
        })
      )

      const responses = await Promise.all(
        requests.map(request => GET(request))
      )

      const rateLimitedResponses = responses.filter(r => r.status === 429)
      expect(rateLimitedResponses.length).toBeGreaterThan(0)
    })

    it('should have higher rate limits for authenticated requests', async () => {
      const requests = Array.from({ length: 50 }, () =>
        createMockRequest('GET', '/api/analytics/revenue', null, {
          'x-api-key': 'valid-api-key-123',
          'x-forwarded-for': '192.168.1.2',
        })
      )

      const responses = await Promise.all(
        requests.map(request => GET(request))
      )

      const successfulResponses = responses.filter(r => r.status === 200)
      expect(successfulResponses.length).toBeGreaterThan(40) // Higher limit
    })
  })

  describe('Performance', () => {
    it('should respond within acceptable time limits', async () => {
      const mockStripe = require('@/lib/stripe')
      mockStripe.getRevenueData.mockImplementation(
        () => new Promise(resolve => 
          setTimeout(() => resolve({
            totalRevenue: 250000,
            monthlyRevenue: 50000,
          }), 50) // 50ms delay
        )
      )

      const start = Date.now()
      const request = createMockRequest('GET', '/api/analytics/revenue')
      const response = await GET(request)
      const duration = Date.now() - start

      expect(response.status).toBe(200)
      expect(duration).toBeLessThan(1000) // Should respond within 1 second
    })
  })
})
```

---

## Notion CMS API テスト

### src/app/api/notion/__tests__/route.test.ts
```typescript
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

describe('/api/notion', () => {
  let mockNotionClient: any

  beforeEach(() => {
    jest.clearAllMocks()
    const { Client } = require('@notionhq/client')
    mockNotionClient = new Client()
  })

  describe('GET /api/notion (Blog Posts)', () => {
    it('should fetch published blog posts', async () => {
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
          {
            id: 'post-2',
            properties: {
              Title: {
                title: [{ plain_text: 'Second Blog Post' }],
              },
              Status: {
                select: { name: 'Published' },
              },
              Date: {
                date: { start: '2024-01-02' },
              },
            },
            last_edited_time: '2024-01-02T10:00:00.000Z',
          },
        ],
      })

      const request = createMockRequest('GET', '/api/notion')
      const response = await GET(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(200)
      expect(data.posts).toHaveLength(2)
      expect(data.posts[0]).toEqual({
        id: 'post-1',
        title: 'First Blog Post',
        status: 'Published',
        publishedAt: '2024-01-01',
        lastEditedTime: '2024-01-01T10:00:00.000Z',
      })
    })

    it('should filter by status when provided', async () => {
      const request = createMockRequest('GET', '/api/notion?status=Draft')
      await GET(request)

      expect(mockNotionClient.databases.query).toHaveBeenCalledWith({
        database_id: expect.any(String),
        filter: {
          property: 'Status',
          select: {
            equals: 'Draft',
          },
        },
        sorts: [
          {
            property: 'Date',
            direction: 'descending',
          },
        ],
      })
    })

    it('should handle pagination', async () => {
      const request = createMockRequest('GET', '/api/notion?page=2&limit=5')
      await GET(request)

      expect(mockNotionClient.databases.query).toHaveBeenCalledWith({
        database_id: expect.any(String),
        page_size: 5,
        start_cursor: expect.any(String),
        sorts: [
          {
            property: 'Date',
            direction: 'descending',
          },
        ],
      })
    })
  })

  describe('POST /api/notion (Create Content)', () => {
    it('should create a new blog post draft', async () => {
      mockNotionClient.pages.create.mockResolvedValue({
        id: 'new-post-123',
        url: 'https://notion.so/new-post-123',
      })

      const requestBody = {
        title: 'New Blog Post',
        content: 'This is the content of the new blog post.',
        author: 'John Doe',
        tags: ['development', 'dao'],
        status: 'Draft',
      }

      const request = createMockRequest('POST', '/api/notion', requestBody, {
        'authorization': 'Bearer valid-api-key',
      })
      const response = await POST(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(201)
      expect(data.id).toBe('new-post-123')
      expect(data.url).toBeDefined()

      expect(mockNotionClient.pages.create).toHaveBeenCalledWith({
        parent: {
          database_id: expect.any(String),
        },
        properties: {
          Title: {
            title: [
              {
                text: {
                  content: 'New Blog Post',
                },
              },
            ],
          },
          Status: {
            select: {
              name: 'Draft',
            },
          },
          Author: {
            rich_text: [
              {
                text: {
                  content: 'John Doe',
                },
              },
            ],
          },
          Tags: {
            multi_select: [
              { name: 'development' },
              { name: 'dao' },
            ],
          },
          Date: {
            date: {
              start: expect.any(String),
            },
          },
        },
        children: expect.any(Array),
      })
    })

    it('should require authentication for content creation', async () => {
      const requestBody = {
        title: 'Unauthorized Post',
        content: 'This should not be created.',
      }

      const request = createMockRequest('POST', '/api/notion', requestBody)
      const response = await POST(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(401)
      expect(data.error).toBe('Authentication required')
    })

    it('should validate required fields', async () => {
      const requestBody = {
        // Missing title and content
        author: 'John Doe',
      }

      const request = createMockRequest('POST', '/api/notion', requestBody, {
        'authorization': 'Bearer valid-api-key',
      })
      const response = await POST(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(400)
      expect(data.errors).toEqual({
        title: 'Title is required',
        content: 'Content is required',
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle Notion API rate limits', async () => {
      mockNotionClient.databases.query.mockRejectedValue({
        code: 'rate_limited',
        message: 'Rate limited',
      })

      const request = createMockRequest('GET', '/api/notion')
      const response = await GET(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(429)
      expect(data.error).toBe('Rate limited')
      expect(response.headers.get('Retry-After')).toBeDefined()
    })

    it('should handle Notion API errors', async () => {
      mockNotionClient.databases.query.mockRejectedValue({
        code: 'unauthorized',
        message: 'Invalid token',
      })

      const request = createMockRequest('GET', '/api/notion')
      const response = await GET(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch content')
    })

    it('should handle malformed Notion responses', async () => {
      mockNotionClient.databases.query.mockResolvedValue({
        results: [
          {
            // Missing required properties
            id: 'malformed-post',
          },
        ],
      })

      const request = createMockRequest('GET', '/api/notion')
      const response = await GET(request)
      const data = await extractResponseData(response)

      expect(response.status).toBe(200)
      expect(data.posts).toHaveLength(0) // Malformed posts filtered out
      expect(data.warnings).toContain('Some posts could not be processed')
    })
  })

  describe('Caching', () => {
    it('should cache blog posts for performance', async () => {
      mockNotionClient.databases.query.mockResolvedValue({
        results: [],
      })

      // First request
      const request1 = createMockRequest('GET', '/api/notion')
      await GET(request1)

      // Second request (should use cache)
      const request2 = createMockRequest('GET', '/api/notion')
      const response2 = await GET(request2)

      expect(response2.headers.get('X-Cache')).toBe('HIT')
      expect(mockNotionClient.databases.query).toHaveBeenCalledTimes(1)
    })

    it('should invalidate cache after content updates', async () => {
      // Create content
      mockNotionClient.pages.create.mockResolvedValue({
        id: 'new-post',
      })

      const createRequest = createMockRequest('POST', '/api/notion', {
        title: 'New Post',
        content: 'Content',
      }, {
        'authorization': 'Bearer valid-api-key',
      })
      await POST(createRequest)

      // Subsequent GET should not use cache
      const getRequest = createMockRequest('GET', '/api/notion')
      const response = await GET(getRequest)

      expect(response.headers.get('X-Cache')).toBe('MISS')
    })
  })
})
```

---

## API テスト実行設定

### jest.config.api.js (API専用設定)
```javascript
const baseConfig = require('./jest.config.js')

module.exports = {
  ...baseConfig,
  testMatch: [
    '<rootDir>/src/app/api/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/app/api/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
  testEnvironment: 'node', // API tests run in Node environment
  setupFilesAfterEnv: ['<rootDir>/jest.setup.api.js'],
}
```

### jest.setup.api.js
```javascript
// API tests specific setup
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
      message: () => `expected ${received.status} to be a valid API response status`,
      pass,
    }
  },
  
  toHaveRequiredHeaders(received, headers) {
    const missing = headers.filter(header => !received.headers.get(header))
    const pass = missing.length === 0
    return {
      message: () => `expected response to have headers: ${missing.join(', ')}`,
      pass,
    }
  },
})
```

### package.json scripts 追加
```json
{
  "scripts": {
    "test:api": "jest --config jest.config.api.js",
    "test:api:watch": "jest --config jest.config.api.js --watch",
    "test:api:coverage": "jest --config jest.config.api.js --coverage"
  }
}
```

---

## TDD ワークフロー例（API編）

### Red-Green-Refactor for API Endpoints

#### Red Phase: 失敗するテストを書く
```typescript
it('should validate email format in waitlist API', async () => {
  const request = createMockRequest('POST', '/api/waitlist', {
    email: 'invalid-email',
    name: 'Test User',
  })
  
  const response = await POST(request)
  const data = await extractResponseData(response)
  
  expect(response.status).toBe(400)
  expect(data.error).toBe('Invalid email format')
})
```

#### Green Phase: ベタ書き実装
```typescript
export async function POST(request: NextRequest) {
  const body = await request.json()
  
  // ベタ書き検証（Green Phase）
  if (!body.email || !body.email.includes('@')) {
    return Response.json(
      { error: 'Invalid email format' },
      { status: 400 }
    )
  }
  
  // 処理続行...
}
```

#### Refactor Phase: 保守性向上
```typescript
import { z } from 'zod'

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
}
```

この包括的なAPIテストにより、Next.js 14のAPI Routesの品質を保証し、TDDアプローチでの安全な開発が可能になります。