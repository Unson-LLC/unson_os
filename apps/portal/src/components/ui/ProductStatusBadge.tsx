import { Product } from '@/data/products'

interface ProductStatusBadgeProps {
  product: Product
  testId?: string
  size?: 'xs' | 'sm'
}

export function ProductStatusBadge({ product, testId, size = 'xs' }: ProductStatusBadgeProps) {
  const sizeClass = size === 'xs' ? 'text-xs' : 'text-sm'
  const paddingClass = size === 'xs' ? 'px-2 py-1' : 'px-3 py-1'
  if (product.isReal) {
    return (
      <span 
        className={`${paddingClass} bg-green-100 text-green-700 ${sizeClass} rounded-full`} 
        data-testid={testId || "real-service-badge"}
      >
        運用中
      </span>
    )
  }

  switch (product.status) {
    case 'active':
      return (
        <span className={`${paddingClass} bg-green-100 text-green-700 ${sizeClass} rounded-full`}>
          利用可能
        </span>
      )
    case 'development':
      return (
        <span
          className={`${paddingClass} bg-yellow-100 text-yellow-700 ${sizeClass} rounded-full`}
          data-testid={testId || "concept-badge"}
        >
          開発中
        </span>
      )
    case 'validation':
      return (
        <span
          className={`${paddingClass} bg-purple-100 text-purple-700 ${sizeClass} rounded-full`}
          data-testid={testId || "concept-badge"}
        >
          検証中
        </span>
      )
    case 'discovery':
      return (
        <span
          className={`${paddingClass} bg-blue-100 text-blue-700 ${sizeClass} rounded-full`}
          data-testid={testId || "concept-badge"}
        >
          構想段階
        </span>
      )
    case 'terminated':
      return (
        <span
          className={`${paddingClass} bg-gray-100 text-gray-700 ${sizeClass} rounded-full`}
          data-testid={testId || "concept-badge"}
        >
          終了
        </span>
      )
    default:
      return (
        <span
          className={`${paddingClass} bg-blue-100 text-blue-700 ${sizeClass} rounded-full`}
          data-testid={testId || "concept-badge"}
        >
          構想段階
        </span>
      )
  }
}