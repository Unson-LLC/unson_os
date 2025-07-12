import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WaitlistForm } from '@/components/forms/WaitlistForm'

// fetch APIのモック
global.fetch = jest.fn()

// useAnalytics のモック
const mockTrackEvent = jest.fn()
const mockTrackWaitlistSignup = jest.fn()
const mockTrackContactForm = jest.fn()
const mockTrackPageView = jest.fn()

jest.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackEvent: mockTrackEvent,
    trackWaitlistSignup: mockTrackWaitlistSignup,
    trackContactForm: mockTrackContactForm,
    trackPageView: mockTrackPageView,
  }),
}))

describe('Form-API Integration Tests', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
    mockTrackEvent.mockClear()
    mockTrackWaitlistSignup.mockClear()
    mockTrackContactForm.mockClear()
    mockTrackPageView.mockClear()
  })

  describe('Successful Form Submission Flow', () => {
    it('should complete full waitlist registration flow', async () => {
      // APIレスポンスをモック
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 201,
        json: async () => ({
          message: 'Successfully added to waitlist',
          id: 'user-12345'
        }),
      })

      render(<WaitlistForm />)

      // ユーザーフォーム入力
      await user.type(screen.getByLabelText(/メールアドレス/i), 'user@example.com')
      await user.type(screen.getByLabelText(/お名前/i), '統合テストユーザー')
      await user.selectOptions(screen.getByLabelText(/職種/i), 'developer')

      // フォーム送信
      await user.click(screen.getByRole('button', { name: /登録/i }))

      // API呼び出しの確認
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/waitlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'user@example.com',
            name: '統合テストユーザー',
            role: 'developer',
          }),
        })
      })

      // 成功状態の確認
      await waitFor(() => {
        expect(screen.getByText(/登録ありがとうございます/i)).toBeInTheDocument()
      })

      // Analytics追跡の確認
      expect(mockTrackWaitlistSignup).toHaveBeenCalledWith('successful@example.com')
    })

    it('should handle form validation and API error recovery', async () => {
      render(<WaitlistForm />)

      // 最初に無効なデータで送信
      await user.click(screen.getByRole('button', { name: /登録/i }))

      // バリデーションエラーの確認
      await waitFor(() => {
        expect(screen.getByText(/メールアドレスは必須です/i)).toBeInTheDocument()
        expect(screen.getByText(/お名前は必須です/i)).toBeInTheDocument()
      })

      // APIが呼ばれていないことを確認
      expect(fetch).not.toHaveBeenCalled()

      // 正しいデータを入力
      await user.type(screen.getByLabelText(/メールアドレス/i), 'corrected@example.com')
      await user.type(screen.getByLabelText(/お名前/i), '修正ユーザー')

      // バリデーションエラーがクリアされることを確認
      await waitFor(() => {
        expect(screen.queryByText(/メールアドレスは必須です/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/お名前は必須です/i)).not.toBeInTheDocument()
      })

      // APIレスポンスをモック
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ message: 'Success', id: 'user-67890' }),
      })

      // 再度送信
      await user.click(screen.getByRole('button', { name: /登録/i }))

      // 成功を確認
      await waitFor(() => {
        expect(screen.getByText(/登録ありがとうございます/i)).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling Integration', () => {
    it('should handle API server errors gracefully', async () => {
      // サーバーエラーをシミュレート
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' }),
      })

      render(<WaitlistForm />)

      await user.type(screen.getByLabelText(/メールアドレス/i), 'error@example.com')
      await user.type(screen.getByLabelText(/お名前/i), 'エラーユーザー')
      await user.click(screen.getByRole('button', { name: /登録/i }))

      // エラーメッセージの表示を確認
      await waitFor(() => {
        expect(screen.getByText(/エラーが発生しました/i)).toBeInTheDocument()
      })

      // フォームが送信可能状態に戻ることを確認
      expect(screen.getByRole('button', { name: /登録/i })).not.toBeDisabled()
    })

    it('should handle network errors', async () => {
      // ネットワークエラーをシミュレート
      ;(fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      render(<WaitlistForm />)

      await user.type(screen.getByLabelText(/メールアドレス/i), 'network@example.com')
      await user.type(screen.getByLabelText(/お名前/i), 'ネットワークユーザー')
      await user.click(screen.getByRole('button', { name: /登録/i }))

      await waitFor(() => {
        expect(screen.getByText(/エラーが発生しました/i)).toBeInTheDocument()
      })
    })

    it('should handle duplicate email scenario', async () => {
      // 重複エラーをシミュレート
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({ error: 'Email already registered' }),
      })

      render(<WaitlistForm />)

      await user.type(screen.getByLabelText(/メールアドレス/i), 'duplicate@example.com')
      await user.type(screen.getByLabelText(/お名前/i), '重複ユーザー')
      await user.click(screen.getByRole('button', { name: /登録/i }))

      await waitFor(() => {
        expect(screen.getByText(/エラーが発生しました/i)).toBeInTheDocument()
      })
    })
  })

  describe('Loading State Integration', () => {
    it('should show loading state during API call', async () => {
      // API応答を遅延させる
      let resolvePromise: (value: any) => void
      const apiPromise = new Promise(resolve => {
        resolvePromise = resolve
      })

      ;(fetch as jest.Mock).mockReturnValue(apiPromise)

      render(<WaitlistForm />)

      await user.type(screen.getByLabelText(/メールアドレス/i), 'loading@example.com')
      await user.type(screen.getByLabelText(/お名前/i), 'ローディングユーザー')
      await user.click(screen.getByRole('button', { name: /登録/i }))

      // ローディング状態の確認
      expect(screen.getByText(/送信中/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /送信中/i })).toBeDisabled()

      // API応答を解決
      resolvePromise!({
        ok: true,
        json: async () => ({ message: 'Success', id: 'loading-test' }),
      })

      // 成功状態の確認
      await waitFor(() => {
        expect(screen.getByText(/登録ありがとうございます/i)).toBeInTheDocument()
      })
    })
  })

  describe('Data Flow Integration', () => {
    it('should pass correct data structure to API', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ message: 'Success', id: 'data-test' }),
      })

      render(<WaitlistForm />)

      // 全フィールドに入力
      await user.type(screen.getByLabelText(/メールアドレス/i), 'dataflow@example.com')
      await user.type(screen.getByLabelText(/お名前/i), 'データフローユーザー')
      await user.selectOptions(screen.getByLabelText(/職種/i), 'designer')

      await user.click(screen.getByRole('button', { name: /登録/i }))

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/waitlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'dataflow@example.com',
            name: 'データフローユーザー',
            role: 'designer',
          }),
        })
      })

      // Analytics追跡の詳細確認
      expect(mockTrackWaitlistSignup).toHaveBeenCalledWith('data-flow@example.com')
    })

    it('should handle optional fields correctly', async () => {
      ;(fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ message: 'Success', id: 'optional-test' }),
      })

      render(<WaitlistForm />)

      // 必須フィールドのみ入力（職種は選択しない）
      await user.type(screen.getByLabelText(/メールアドレス/i), 'minimal@example.com')
      await user.type(screen.getByLabelText(/お名前/i), 'ミニマルユーザー')

      await user.click(screen.getByRole('button', { name: /登録/i }))

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/waitlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'minimal@example.com',
            name: 'ミニマルユーザー',
            role: '',
          }),
        })
      })
    })
  })
})