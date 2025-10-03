import { http, HttpResponse } from 'msw'

export const handlers = [
  // Revenue analytics API
  http.get('/api/analytics/revenue', () => {
    return HttpResponse.json({
      totalRevenue: 250000,
      monthlyRevenue: 50000,
      activeProducts: 12,
      communityMembers: 1250,
      lastUpdated: new Date(),
    })
  }),

  // Waitlist registration API
  http.post('/api/waitlist', async ({ request }) => {
    const body = await request.json() as any
    
    if (!body?.email) {
      return HttpResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    return HttpResponse.json(
      { 
        message: 'Successfully added to waitlist',
        id: 'mock-id-123'
      },
      { status: 201 }
    )
  }),

  // Contact form API  
  http.post('/api/contact', async ({ request }) => {
    const body = await request.json() as any
    
    if (!body?.email || !body?.name || !body?.message) {
      return HttpResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      )
    }

    return HttpResponse.json(
      { 
        message: 'Contact form submitted successfully',
        id: 'contact-mock-id-456'
      },
      { status: 201 }
    )
  }),

  // Product request API
  http.post('/api/product-request', async ({ request }) => {
    const body = await request.json() as any
    
    if (!body?.email || !body?.name || !body?.productTitle || !body?.description) {
      return HttpResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      )
    }

    return HttpResponse.json(
      { 
        message: 'Product request submitted successfully',
        id: 'product-request-mock-id-789'
      },
      { status: 201 }
    )
  }),

  // Careers API
  http.post('/api/careers', async ({ request }) => {
    const body = await request.json() as any
    
    if (!body?.email || !body?.name || !body?.position || !body?.experience || !body?.coverLetter) {
      return HttpResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      )
    }

    return HttpResponse.json(
      { 
        message: 'Career application submitted successfully',
        id: 'career-mock-id-012'
      },
      { status: 201 }
    )
  }),

  // Error case for testing
  http.get('/api/analytics/error', () => {
    return HttpResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }),
]