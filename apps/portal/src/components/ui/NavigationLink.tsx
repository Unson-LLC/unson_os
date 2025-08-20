import { Button } from './Button'

interface NavigationLinkProps {
  href: string
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  external?: boolean
  fullWidth?: boolean
}

export function NavigationLink({ 
  href, 
  children, 
  variant = 'default', 
  size = 'default',
  className = '',
  external = false,
  fullWidth = false
}: NavigationLinkProps) {
  const linkProps = external ? {
    target: '_blank',
    rel: 'noopener noreferrer'
  } : {}

  const buttonClassName = fullWidth ? 'w-full' : ''

  return (
    <a href={href} {...linkProps} className={fullWidth ? 'w-full' : ''}>
      <Button 
        variant={variant} 
        size={size} 
        className={`${buttonClassName} ${className}`}
      >
        {children}
      </Button>
    </a>
  )
}