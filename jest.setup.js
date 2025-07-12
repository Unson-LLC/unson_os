import '@testing-library/jest-dom'
import 'jest-axe/extend-expect'

// Next.js Web API polyfills for test environment
import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Web Streams API polyfill
const { ReadableStream, WritableStream, TransformStream } = require('node:stream/web')
global.ReadableStream = ReadableStream
global.WritableStream = WritableStream  
global.TransformStream = TransformStream

// Simple Request/Response polyfills for API testing
if (!global.Request) {
  global.Request = class Request {
    constructor(input, init = {}) {
      this.url = typeof input === 'string' ? input : input.url
      this.method = init.method || 'GET'
      this.headers = new Headers(init.headers || {})
      this._body = init.body || null
    }
    
    async json() {
      if (typeof this._body === 'string') {
        return JSON.parse(this._body)
      }
      return this._body
    }
    
    async text() {
      return this._body || ''
    }
  }
}

if (!global.Response) {
  global.Response = class Response {
    constructor(body, init = {}) {
      this.body = body
      this.status = init.status || 200
      this.statusText = init.statusText || 'OK'
      this.headers = new Headers(init.headers || {})
      this.ok = this.status >= 200 && this.status < 300
    }
    
    async json() {
      if (typeof this.body === 'string') {
        return JSON.parse(this.body)
      }
      return this.body
    }
    
    async text() {
      return this.body || ''
    }
  }
}

if (!global.Headers) {
  global.Headers = class Headers extends Map {
    constructor(init = {}) {
      super()
      if (init) {
        Object.entries(init).forEach(([key, value]) => {
          this.set(key, value)
        })
      }
    }
    
    append(name, value) {
      this.set(name, value)
    }
    
    get(name) {
      return super.get(name.toLowerCase())
    }
    
    set(name, value) {
      super.set(name.toLowerCase(), value)
    }
  }
}

// NextResponse mock
global.NextResponse = {
  json: (data, init = {}) => {
    return new global.Response(JSON.stringify(data), {
      status: init.status || 200,
      statusText: init.statusText || 'OK',
      headers: {
        'Content-Type': 'application/json',
        ...init.headers
      }
    })
  }
}

// React 18のact警告を抑制（テスト環境では正常な動作）
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: An update to') &&
      args[0].includes('was not wrapped in act(...)')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

// MSW設定（一時的に無効化）
// import { server } from './src/mocks/server'

// テスト開始前にMSWサーバー起動
// beforeAll(() => server.listen())

// 各テスト後にハンドラーリセット
// afterEach(() => server.resetHandlers())

// テスト終了後にMSWサーバー停止
// afterAll(() => server.close())

// IntersectionObserver のモック
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// matchMedia のモック
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// ResizeObserver のモック
global.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}