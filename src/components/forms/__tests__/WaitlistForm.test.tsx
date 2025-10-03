import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WaitlistForm } from '../WaitlistForm'

// useAnalytics のモック
const mockTrackEvent = jest.fn()
const mockTrackWaitlistSignup = jest.fn()
const mockTrackContactForm = jest.fn()
const mockTrackPageView = jest.fn()

jest.mock('../../../hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackEvent: mockTrackEvent,
    trackWaitlistSignup: mockTrackWaitlistSignup,
    trackContactForm: mockTrackContactForm,
    trackPageView: mockTrackPageView,
  }),
}))

// fetch のモック
global.fetch = jest.fn()

describe('WaitlistForm Component', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Success', id: 'mock-id' }),
    })
  })

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
    })
    
    await waitFor(() => {
      expect(screen.getByText(/お名前は必須です/i)).toBeInTheDocument()
    })
  })

  it('should show validation error for invalid email format', async () => {
    render(<WaitlistForm />)
    
    const emailInput = screen.getByLabelText(/メールアドレス/i)
    const nameInput = screen.getByLabelText(/お名前/i)
    
    // 名前は有効な値を入力（他のバリデーションエラーを避けるため）
    await user.type(nameInput, 'テストユーザー')
    await user.type(emailInput, 'invalid-email')
    
    const submitButton = screen.getByRole('button', { name: /登録/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/有効なメールアドレスを入力してください/i)).toBeInTheDocument()
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
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Server error' }),
    })

    render(<WaitlistForm />)
    
    await user.type(screen.getByLabelText(/メールアドレス/i), 'test@example.com')
    await user.type(screen.getByLabelText(/お名前/i), 'テストユーザー')
    await user.click(screen.getByRole('button', { name: /登録/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/エラーが発生しました/i)).toBeInTheDocument()
    })
  })

  it('should disable submit button during form submission', async () => {
    // APIレスポンスを遅延させる
    ;(fetch as jest.Mock).mockImplementation(
      () => new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ message: 'Success' })
        }), 1000)
      )
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
    mockTrackWaitlistSignup.mockClear()

    render(<WaitlistForm />)
    
    await user.type(screen.getByLabelText(/メールアドレス/i), 'test@example.com')
    await user.type(screen.getByLabelText(/お名前/i), 'テストユーザー')
    await user.selectOptions(screen.getByLabelText(/職種/i), 'developer')
    await user.click(screen.getByRole('button', { name: /登録/i }))
    
    await waitFor(() => {
      expect(mockTrackWaitlistSignup).toHaveBeenCalledWith('test@example.com')
    })
  })

  it('should clear validation errors when user corrects input', async () => {
    render(<WaitlistForm />)
    
    // まずバリデーションエラーを発生させる
    const submitButton = screen.getByRole('button', { name: /登録/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/メールアドレスは必須です/i)).toBeInTheDocument()
    })
    
    // 正しい値を入力してエラーがクリアされることを確認
    const emailInput = screen.getByLabelText(/メールアドレス/i)
    await user.type(emailInput, 'valid@example.com')
    
    await waitFor(() => {
      expect(screen.queryByText(/メールアドレスは必須です/i)).not.toBeInTheDocument()
    })
  })

  it('should handle duplicate email error from server', async () => {
    // 重複エラーをシミュレート
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 409,
      json: async () => ({ error: 'Email already registered' }),
    })

    render(<WaitlistForm />)
    
    await user.type(screen.getByLabelText(/メールアドレス/i), 'duplicate@example.com')
    await user.type(screen.getByLabelText(/お名前/i), 'テストユーザー')
    await user.click(screen.getByRole('button', { name: /登録/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/エラーが発生しました/i)).toBeInTheDocument()
    })
  })
})