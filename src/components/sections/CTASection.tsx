import { NavigationLink } from '@/components/ui/NavigationLink'

interface CTAAction {
  label: string
  href: string
  variant?: 'default' | 'outline' | 'secondary'
  external?: boolean
}

interface CTASectionProps {
  title: string
  subtitle: string
  actions: CTAAction[]
  backgroundColor?: string
  textColor?: string
  subtitleColor?: string
}

export function CTASection({
  title,
  subtitle,
  actions,
  backgroundColor = 'bg-gradient-to-r from-blue-600 to-indigo-700',
  textColor = 'text-white',
  subtitleColor = 'text-blue-100'
}: CTASectionProps) {
  return (
    <section className={`section-padding ${backgroundColor} ${textColor}`}>
      <div className="container-custom text-center">
        <h2 className="heading-secondary mb-6">
          {title}
        </h2>
        <p className={`text-large mb-8 ${subtitleColor}`}>
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {actions.map((action, index) => (
            <NavigationLink
              key={index}
              href={action.href}
              variant={action.variant || 'secondary'}
              size="lg"
              external={action.external}
              className={action.variant === 'outline' ? 'border-white text-white hover:bg-white hover:text-blue-600' : ''}
            >
              {action.label}
            </NavigationLink>
          ))}
        </div>
      </div>
    </section>
  )
}