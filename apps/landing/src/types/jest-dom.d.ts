import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveClass(...classNames: string[]): R
      toBeDisabled(): R
      toBeVisible(): R
      toHaveTextContent(text: string | RegExp): R
      toHaveAttribute(attr: string, value?: string): R
      toHaveValue(value: string | number): R
      toBeChecked(): R
      toHaveFocus(): R
      toBeRequired(): R
      toBeValid(): R
      toBeInvalid(): R
    }
  }

  interface Window {
    trackAnalytics?: (event: any) => void
  }
}