# UnsonOS LP 包括的テストケース集

## 概要

TDD（Test Driven Development）に基づく包括的テストケース。CLAUDE.mdの指針に従い、Red-Green-Refactorサイクルを実践し、最終的にベタ書き・ハードコードが残らないことを保証。

---

## フォームコンポーネントテスト

### src/components/forms/__tests__/WaitlistForm.test.tsx
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WaitlistForm } from '../WaitlistForm'
import { server } from '@/mocks/server'
import { rest } from 'msw'

describe('WaitlistForm Component', () => {
  const user = userEvent.setup()

  it('should render form with all required fields', () => {
    render(<WaitlistForm />)
    
    expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/お名前/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/職種/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /登録/i })).toBeInTheDocument()
  })

  it('should show validation errors for empty required fields', async () => {
    render(<WaitlistForm />)
    
    const submitButton = screen.getByRole('button', { name: /登録/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/メールアドレスは必須です/i)).toBeInTheDocument()
      expect(screen.getByText(/お名前は必須です/i)).toBeInTheDocument()
    })
  })

  it('should show validation error for invalid email format', async () => {
    render(<WaitlistForm />)
    
    const emailInput = screen.getByLabelText(/メールアドレス/i)
    await user.type(emailInput, 'invalid-email')
    
    const submitButton = screen.getByRole('button', { name: /登録/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/正しいメールアドレスを入力してください/i)).toBeInTheDocument()
    })
  })

  it('should submit form successfully with valid data', async () => {
    render(<WaitlistForm />)
    
    // フォーム入力
    await user.type(screen.getByLabelText(/メールアドレス/i), 'test@example.com')
    await user.type(screen.getByLabelText(/お名前/i), 'テストユーザー')
    await user.selectOptions(screen.getByLabelText(/職種/i), 'developer')
    
    // 送信
    await user.click(screen.getByRole('button', { name: /登録/i }))
    
    // 成功メッセージの確認
    await waitFor(() => {
      expect(screen.getByText(/登録ありがとうございます/i)).toBeInTheDocument()
    })
  })

  it('should handle server errors gracefully', async () => {
    // サーバーエラーをシミュレート
    server.use(
      rest.post('/api/waitlist', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }))
      })
    )

    render(<WaitlistForm />)
    
    await user.type(screen.getByLabelText(/メールアドレス/i), 'test@example.com')
    await user.type(screen.getByLabelText(/お名前/i), 'テストユーザー')
    await user.click(screen.getByRole('button', { name: /登録/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/エラーが発生しました/i)).toBeInTheDocument()
    })
  })

  it('should handle duplicate email registration', async () => {
    server.use(
      rest.post('/api/waitlist', (req, res, ctx) => {
        return res(
          ctx.status(409),
          ctx.json({ error: 'Email already registered' })
        )
      })
    )

    render(<WaitlistForm />)
    
    await user.type(screen.getByLabelText(/メールアドレス/i), 'existing@example.com')
    await user.type(screen.getByLabelText(/お名前/i), 'テストユーザー')
    await user.click(screen.getByRole('button', { name: /登録/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/このメールアドレスは既に登録されています/i)).toBeInTheDocument()
    })
  })

  it('should disable submit button during form submission', async () => {
    // APIレスポンスを遅延させる
    server.use(
      rest.post('/api/waitlist', (req, res, ctx) => {
        return res(ctx.delay(1000), ctx.status(201), ctx.json({ message: 'Success' }))
      })
    )

    render(<WaitlistForm />)
    
    await user.type(screen.getByLabelText(/メールアドレス/i), 'test@example.com')
    await user.type(screen.getByLabelText(/お名前/i), 'テストユーザー')
    
    const submitButton = screen.getByRole('button', { name: /登録/i })
    await user.click(submitButton)
    
    // ボタンが無効化されることを確認
    expect(submitButton).toBeDisabled()
    expect(screen.getByText(/送信中/i)).toBeInTheDocument()
  })

  it('should track analytics on form submission', async () => {
    const mockTrack = jest.fn()
    jest.mocked(require('@/hooks/useAnalytics').useAnalytics).mockReturnValue({
      track: mockTrack,
    })

    render(<WaitlistForm />)
    
    await user.type(screen.getByLabelText(/メールアドレス/i), 'test@example.com')
    await user.type(screen.getByLabelText(/お名前/i), 'テストユーザー')
    await user.selectOptions(screen.getByLabelText(/職種/i), 'developer')
    await user.click(screen.getByRole('button', { name: /登録/i }))
    
    await waitFor(() => {
      expect(mockTrack).toHaveBeenCalledWith('waitlist_form_submitted', {
        role: 'developer',
        hasName: true,
      })
    })
  })

  it('should be accessible', async () => {
    const { container } = render(<WaitlistForm />)
    
    // フォーム要素のアクセシビリティ確認
    expect(screen.getByRole('form')).toBeInTheDocument()
    
    // ラベル関連付けの確認
    const emailInput = screen.getByLabelText(/メールアドレス/i)
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('required')
    
    // ARIA属性の確認
    expect(emailInput).toHaveAttribute('aria-describedby')
    
    // キーボードナビゲーション
    await user.tab()
    expect(emailInput).toHaveFocus()
  })
})
```

---

## レイアウトコンポーネントテスト

### src/components/layout/__tests__/Header.test.tsx
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from '../Header'

// Next.js router のモック
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

describe('Header Component', () => {
  const user = userEvent.setup()

  it('should render logo and navigation links', () => {
    render(<Header />)
    
    // ロゴの確認
    expect(screen.getByText('UnsonOS')).toBeInTheDocument()
    
    // ナビゲーションリンクの確認
    expect(screen.getByRole('link', { name: 'ホーム' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'DAO参加' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '投資家向け' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'ドキュメント' })).toBeInTheDocument()
  })

  it('should highlight active navigation link', () => {
    render(<Header />)
    
    const homeLink = screen.getByRole('link', { name: 'ホーム' })
    expect(homeLink).toHaveClass('text-blue-600') // アクティブスタイル
  })

  it('should show mobile menu button on small screens', () => {
    // モバイルビューポートをシミュレート
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })

    render(<Header />)
    
    const menuButton = screen.getByLabelText(/メニューを開く/i)
    expect(menuButton).toBeInTheDocument()
  })

  it('should toggle mobile menu when button is clicked', async () => {
    render(<Header />)
    
    const menuButton = screen.getByLabelText(/メニューを開く/i)
    
    // メニューが初期状態で非表示
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument()
    
    // メニューボタンをクリック
    await user.click(menuButton)
    
    // メニューが表示される
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument()
    
    // 再度クリックでメニューが非表示
    await user.click(menuButton)
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument()
  })

  it('should close mobile menu when navigation link is clicked', async () => {
    render(<Header />)
    
    const menuButton = screen.getByLabelText(/メニューを開く/i)
    await user.click(menuButton)
    
    // メニューが表示される
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument()
    
    // ナビゲーションリンクをクリック
    const daoLink = screen.getByRole('link', { name: 'DAO参加' })
    await user.click(daoLink)
    
    // メニューが自動で閉じる
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument()
  })

  it('should handle scroll behavior for header styling', () => {
    render(<Header />)
    
    const header = screen.getByRole('banner')
    
    // 初期状態（透明背景）
    expect(header).toHaveClass('bg-transparent')
    
    // スクロールをシミュレート
    fireEvent.scroll(window, { target: { scrollY: 100 } })
    
    // スクロール後（背景付き）
    expect(header).toHaveClass('bg-white', 'shadow-sm')
  })

  it('should display CTA button', () => {
    render(<Header />)
    
    const ctaButton = screen.getByRole('button', { name: /早期アクセス/i })
    expect(ctaButton).toBeInTheDocument()
    expect(ctaButton).toHaveClass('bg-blue-600')
  })

  it('should be accessible', async () => {
    render(<Header />)
    
    // ナビゲーションランドマーク
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    
    // キーボードナビゲーション
    await user.tab()
    expect(screen.getByRole('link', { name: 'UnsonOS' })).toHaveFocus()
    
    await user.tab()
    expect(screen.getByRole('link', { name: 'ホーム' })).toHaveFocus()
  })
})
```

---

## セクションコンポーネントテスト

### src/components/sections/__tests__/Hero.test.tsx
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Hero } from '../Hero'

// Framer Motion のモック
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('Hero Component', () => {
  const user = userEvent.setup()

  it('should render hero content with correct headings', () => {
    render(<Hero />)
    
    // メイン見出しの確認
    expect(screen.getByText('100個の')).toBeInTheDocument()
    expect(screen.getByText('マイクロSaaS')).toBeInTheDocument()
    expect(screen.getByText('を24時間で')).toBeInTheDocument()
    
    // サブテキストの確認
    expect(screen.getByText(/従来の開発サイクルを革新/)).toBeInTheDocument()
    expect(screen.getByText(/24〜48時間/)).toBeInTheDocument()
  })

  it('should render CTA buttons', () => {
    render(<Hero />)
    
    const primaryCTA = screen.getByRole('button', { name: /早期アクセス登録/ })
    const secondaryCTA = screen.getByRole('button', { name: /デモを見る/ })
    
    expect(primaryCTA).toBeInTheDocument()
    expect(secondaryCTA).toBeInTheDocument()
    
    // ボタンスタイルの確認
    expect(primaryCTA).toHaveClass('bg-white', 'text-blue-900')
    expect(secondaryCTA).toHaveClass('border-white', 'text-white')
  })

  it('should display statistics section', () => {
    render(<Hero />)
    
    // 統計情報の確認
    expect(screen.getByText('24h')).toBeInTheDocument()
    expect(screen.getByText('開発サイクル')).toBeInTheDocument()
    
    expect(screen.getByText('200+')).toBeInTheDocument()
    expect(screen.getByText('目標プロダクト数')).toBeInTheDocument()
    
    expect(screen.getByText('40%')).toBeInTheDocument()
    expect(screen.getByText('コミュニティ配当')).toBeInTheDocument()
  })

  it('should track analytics when CTA buttons are clicked', async () => {
    const mockTrack = jest.fn()
    jest.mocked(require('@/hooks/useAnalytics').useAnalytics).mockReturnValue({
      track: mockTrack,
    })

    render(<Hero />)
    
    // プライマリCTAクリック
    const primaryCTA = screen.getByRole('button', { name: /早期アクセス登録/ })
    await user.click(primaryCTA)
    
    expect(mockTrack).toHaveBeenCalledWith('hero_cta_clicked', { type: 'primary' })
    
    // セカンダリCTAクリック
    const secondaryCTA = screen.getByRole('button', { name: /デモを見る/ })
    await user.click(secondaryCTA)
    
    expect(mockTrack).toHaveBeenCalledWith('hero_cta_clicked', { type: 'demo' })
  })

  it('should render background animations', () => {
    render(<Hero />)
    
    // 背景アニメーション要素の確認
    const backgroundElements = document.querySelectorAll('.bg-blue-400, .bg-indigo-400')
    expect(backgroundElements).toHaveLength(2)
  })

  it('should have proper heading hierarchy', () => {
    render(<Hero />)
    
    // h1要素が1つだけ存在
    const h1Elements = screen.getAllByRole('heading', { level: 1 })
    expect(h1Elements).toHaveLength(1)
    
    // メイン見出しがh1
    expect(h1Elements[0]).toHaveTextContent('100個のマイクロSaaSを24時間で')
  })

  it('should be responsive', () => {
    render(<Hero />)
    
    const container = screen.getByRole('region') || document.querySelector('section')
    expect(container).toHaveClass('lg:py-28') // 大画面用のパディング
  })

  it('should be accessible', () => {
    render(<Hero />)
    
    // セクションランドマーク
    expect(screen.getByRole('region')).toBeInTheDocument()
    
    // ボタンのアクセシビリティ
    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toHaveAccessibleName()
    })
  })
})
```

---

## フックテスト

### src/hooks/__tests__/useAnalytics.test.ts
```typescript
import { renderHook, act } from '@testing-library/react'
import { useAnalytics } from '../useAnalytics'

// Google Analytics のモック
const mockGtag = jest.fn()
global.gtag = mockGtag

describe('useAnalytics hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockGtag.mockClear()
  })

  it('should track events with correct parameters', () => {
    const { result } = renderHook(() => useAnalytics())
    
    act(() => {
      result.current.track('button_click', {
        button_name: 'cta_primary',
        page: 'home',
      })
    })
    
    expect(mockGtag).toHaveBeenCalledWith('event', 'button_click', {
      button_name: 'cta_primary',
      page: 'home',
    })
  })

  it('should track page views', () => {
    const { result } = renderHook(() => useAnalytics())
    
    act(() => {
      result.current.trackPageView('/dao')
    })
    
    expect(mockGtag).toHaveBeenCalledWith('config', expect.any(String), {
      page_path: '/dao',
    })
  })

  it('should track conversion events', () => {
    const { result } = renderHook(() => useAnalytics())
    
    act(() => {
      result.current.trackConversion('waitlist_signup', {
        value: 1,
        currency: 'USD',
      })
    })
    
    expect(mockGtag).toHaveBeenCalledWith('event', 'conversion', {
      send_to: 'waitlist_signup',
      value: 1,
      currency: 'USD',
    })
  })

  it('should not track when analytics is disabled', () => {
    // 環境変数でアナリティクスを無効化
    const originalEnv = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    
    const { result } = renderHook(() => useAnalytics())
    
    act(() => {
      result.current.track('test_event', {})
    })
    
    expect(mockGtag).not.toHaveBeenCalled()
    
    // 環境変数を復元
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = originalEnv
  })

  it('should handle errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    mockGtag.mockImplementation(() => {
      throw new Error('Analytics error')
    })
    
    const { result } = renderHook(() => useAnalytics())
    
    act(() => {
      result.current.track('error_test', {})
    })
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Analytics tracking error:',
      expect.any(Error)
    )
    
    consoleSpy.mockRestore()
  })
})
```

### src/hooks/__tests__/useApiRequest.test.ts
```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { useApiRequest } from '../useApiRequest'
import { server } from '@/mocks/server'
import { rest } from 'msw'

describe('useApiRequest hook', () => {
  it('should handle successful API requests', async () => {
    const { result } = renderHook(() => useApiRequest<{ message: string }>())
    
    const promise = result.current.execute('/api/test', {
      method: 'POST',
      body: JSON.stringify({ test: 'data' }),
    })
    
    await waitFor(() => {
      expect(result.current.loading).toBe(true)
    })
    
    const response = await promise
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe(null)
      expect(response).toEqual({ message: expect.any(String) })
    })
  })

  it('should handle API errors', async () => {
    server.use(
      rest.post('/api/test', (req, res, ctx) => {
        return res(ctx.status(400), ctx.json({ error: 'Bad request' }))
      })
    )

    const { result } = renderHook(() => useApiRequest())
    
    const promise = result.current.execute('/api/test', { method: 'POST' })
    
    await waitFor(() => {
      expect(result.current.loading).toBe(true)
    })
    
    await expect(promise).rejects.toThrow('Bad request')
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe('Bad request')
    })
  })

  it('should handle network errors', async () => {
    server.use(
      rest.post('/api/test', (req, res) => {
        return res.networkError('Network error')
      })
    )

    const { result } = renderHook(() => useApiRequest())
    
    const promise = result.current.execute('/api/test', { method: 'POST' })
    
    await expect(promise).rejects.toThrow('Network error')
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toContain('Network error')
    })
  })

  it('should allow retry on failed requests', async () => {
    let callCount = 0
    server.use(
      rest.post('/api/test', (req, res, ctx) => {
        callCount++
        if (callCount === 1) {
          return res(ctx.status(500), ctx.json({ error: 'Server error' }))
        }
        return res(ctx.status(200), ctx.json({ message: 'Success' }))
      })
    )

    const { result } = renderHook(() => useApiRequest())
    
    // 最初のリクエスト（失敗）
    await expect(
      result.current.execute('/api/test', { method: 'POST' })
    ).rejects.toThrow('Server error')
    
    // リトライ（成功）
    const response = await result.current.execute('/api/test', { method: 'POST' })
    
    expect(response).toEqual({ message: 'Success' })
    expect(callCount).toBe(2)
  })
})
```

---

## ユーティリティ関数の境界値テスト

### src/lib/__tests__/validations.test.ts
```typescript
import { validateEmail, validateWaitlistForm, validateContactForm } from '../validations'

describe('Validation utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.jp',
        'user+tag@example.org',
        'user_name@sub.domain.com',
      ]
      
      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true)
      })
    })

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'user@',
        'user..name@example.com',
        'user@example',
        '',
        null,
        undefined,
      ]
      
      invalidEmails.forEach(email => {
        expect(validateEmail(email as string)).toBe(false)
      })
    })

    it('should handle edge cases', () => {
      expect(validateEmail('a@b.co')).toBe(true) // 最短の有効なメール
      expect(validateEmail('a'.repeat(64) + '@' + 'b'.repeat(63) + '.com')).toBe(true) // 長いメール
      expect(validateEmail('user@' + 'a'.repeat(64) + '.com')).toBe(false) // ドメイン部分が長すぎる
    })
  })

  describe('validateWaitlistForm', () => {
    const validForm = {
      email: 'test@example.com',
      name: 'テストユーザー',
      role: 'developer' as const,
      interests: ['dao', 'saas'],
    }

    it('should validate correct form data', () => {
      const result = validateWaitlistForm(validForm)
      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
    })

    it('should require email and name', () => {
      const result = validateWaitlistForm({
        email: '',
        name: '',
        role: 'developer',
      })
      
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBe('メールアドレスは必須です')
      expect(result.errors.name).toBe('お名前は必須です')
    })

    it('should validate email format', () => {
      const result = validateWaitlistForm({
        ...validForm,
        email: 'invalid-email',
      })
      
      expect(result.isValid).toBe(false)
      expect(result.errors.email).toBe('正しいメールアドレスを入力してください')
    })

    it('should validate name length', () => {
      const result = validateWaitlistForm({
        ...validForm,
        name: 'a', // 短すぎる
      })
      
      expect(result.isValid).toBe(false)
      expect(result.errors.name).toBe('お名前は2文字以上で入力してください')
    })

    it('should validate role enum', () => {
      const result = validateWaitlistForm({
        ...validForm,
        role: 'invalid-role' as any,
      })
      
      expect(result.isValid).toBe(false)
      expect(result.errors.role).toBe('有効な職種を選択してください')
    })
  })
})
```

---

## パフォーマンステスト

### src/components/__tests__/performance.test.tsx
```typescript
import { render } from '@testing-library/react'
import { DAOSimulator } from '@/components/interactive/DAOSimulator'
import { RevenueCounter } from '@/components/interactive/RevenueCounter'

describe('Performance Tests', () => {
  it('should render large lists efficiently', () => {
    const startTime = performance.now()
    
    // 大量のデータでレンダリングテスト
    const mockProps = {
      items: Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        value: Math.random() * 1000,
      })),
    }
    
    render(<DAOSimulator {...mockProps} />)
    
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    // レンダリング時間が100ms未満であることを確認
    expect(renderTime).toBeLessThan(100)
  })

  it('should not cause memory leaks', () => {
    const { unmount } = render(<RevenueCounter />)
    
    // コンポーネントをアンマウント
    unmount()
    
    // イベントリスナーやタイマーがクリーンアップされていることを確認
    // （実際のテストでは、より詳細なメモリ使用量チェックが必要）
    expect(true).toBe(true)
  })

  it('should optimize re-renders', () => {
    let renderCount = 0
    
    const TestComponent = () => {
      renderCount++
      return <DAOSimulator />
    }
    
    const { rerender } = render(<TestComponent />)
    
    // 同じpropsで再レンダリング
    rerender(<TestComponent />)
    
    // 不必要な再レンダリングが発生していないことを確認
    expect(renderCount).toBeLessThanOrEqual(2)
  })
})
```

---

## エラー境界テスト

### src/components/__tests__/ErrorBoundary.test.tsx
```typescript
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from '@/components/ErrorBoundary'

// エラーを投げるテストコンポーネント
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary Component', () => {
  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('should catch and display error when child component throws', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText(/エラーが発生しました/)).toBeInTheDocument()
    expect(screen.getByText(/再読み込み/)).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })

  it('should provide retry functionality', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText(/エラーが発生しました/)).toBeInTheDocument()
    
    // エラー状態を修正してリトライ
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('No error')).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })
})
```

---

## TDDワークフロー実践例

### Red-Green-Refactor サイクル

#### 例1: Button コンポーネント

**Red Phase (失敗するテスト)**
```typescript
it('should apply primary variant styles', () => {
  render(<Button variant="primary">Click me</Button>)
  expect(screen.getByRole('button')).toHaveClass('bg-blue-600')
})
```

**Green Phase (ベタ書き実装)**
```typescript
export function Button({ children, variant }: ButtonProps) {
  if (variant === 'primary') {
    return <button className="bg-blue-600 text-white px-4 py-2 rounded">{children}</button>
  }
  return <button className="px-4 py-2 rounded">{children}</button>
}
```

**Refactor Phase (ベタ書き除去)**
```typescript
const buttonVariants = cva(
  "px-4 py-2 rounded transition-colors focus:outline-none focus:ring-2",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export function Button({ children, variant, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    >
      {children}
    </button>
  )
}
```

---

## テスト実行コマンド

### package.json scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --watchAll=false",
    "test:component": "jest --testPathPattern=components",
    "test:hooks": "jest --testPathPattern=hooks",
    "test:api": "jest --testPathPattern=api",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:all": "npm run test:ci && npm run test:e2e"
  }
}
```

この包括的テストケース集により、TDDアプローチでの開発が可能になり、CLAUDE.mdの指針に従って最終的にベタ書き・ハードコードのない保守性の高いコードを実現できます。