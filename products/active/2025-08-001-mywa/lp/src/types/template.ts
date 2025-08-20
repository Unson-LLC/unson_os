export interface TemplateConfig {
  meta: {
    title: string
    description: string
    keywords: string[]
    ogImage?: string
  }
  
  theme: {
    colors: {
      primary: string
      secondary: string  
      accent: string
      background: string
      text: string
      textLight: string
    }
    fonts: {
      heading: string
      body: string
    }
    gradients: {
      primary?: string
      secondary?: string
      accent?: string
    }
  }
  
  content: {
    hero: {
      title: string
      subtitle: string
      cta: string
      secondaryCta?: string
      backgroundImage?: string
      backgroundGradient?: boolean
    }
    features: Array<{
      icon: string
      title: string
      description: string
      color?: string
    }>
    problem: {
      title: string
      subtitle?: string
      description: string
      problems: Array<{
        title: string
        description: string
        image?: string
      }>
    }
    solution: {
      title: string
      subtitle?: string
      description: string
      solutions: Array<{
        title: string
        description: string
        icon?: string
      }>
    }
    service: {
      title: string
      subtitle?: string
      services: Array<{
        title: string
        description: string
        features: string[]
        icon?: string
      }>
    }
    pricing?: {
      title: string
      subtitle?: string
      plans: Array<{
        name: string
        price: string
        period?: string
        description: string
        features: string[]
        cta: string
        popular?: boolean
      }>
    }
    testimonials?: {
      title: string
      subtitle?: string
      items: Array<{
        name: string
        role?: string
        content: string
        avatar?: string
        rating?: number
      }>
    }
    faq?: {
      title: string
      subtitle?: string
      items: Array<{
        question: string
        answer: string
      }>
    }
    form: {
      title: string
      subtitle?: string
      fields: Array<{
        type: 'text' | 'email' | 'tel' | 'textarea' | 'select'
        name: string
        label: string
        placeholder: string
        required: boolean
        options?: string[]
      }>
      submitText: string
      successMessage?: string
      privacyText?: string
    }
    finalCta: {
      title: string
      subtitle?: string
      cta: string
      urgencyText?: string
      benefitsList?: string[]
    }
    footer: {
      companyName: string
      description?: string
      sections?: Array<{
        title: string
        links: Array<{
          text: string
          url: string
          external?: boolean
        }>
      }>
      copyright?: string
      socialLinks?: Array<{
        platform: string
        url: string
        icon?: string
      }>
    }
  }
  
  assets: {
    logo?: string
    favicon?: string
    images: Record<string, string>
  }
  
  settings?: {
    animations?: boolean
    analytics?: {
      googleAnalytics?: string
      facebookPixel?: string
    }
    seo?: {
      canonicalUrl?: string
      locale?: string
      twitterHandle?: string
    }
  }
}