import { Metadata } from 'next'

const defaultMetadata = {
  siteName: 'Unson OS',
  defaultTitle: 'Unson OS - 自動SaaS生成プラットフォーム',
  defaultDescription: '2週間サイクルで100-200個のマイクロSaaSを自動生成する革新的なプラットフォーム。DAOコミュニティと共に新しい価値を創造します。',
  url: 'https://unson.com',
  image: '/og-image.png'
}

export interface MetadataOptions {
  title?: string
  description?: string
  keywords?: string[]
  noIndex?: boolean
  canonical?: string
  openGraph?: {
    title?: string
    description?: string
    type?: 'website' | 'article'
    images?: string[]
  }
}

export const generateMetadata = (options: MetadataOptions = {}): Metadata => {
  const {
    title,
    description = defaultMetadata.defaultDescription,
    keywords = [],
    noIndex = false,
    canonical,
    openGraph = {}
  } = options

  const fullTitle = title 
    ? `${title} - ${defaultMetadata.siteName}`
    : defaultMetadata.defaultTitle

  const ogTitle = openGraph.title || title || defaultMetadata.defaultTitle
  const ogDescription = openGraph.description || description
  const ogType = openGraph.type || 'website'
  const ogImages = openGraph.images || [defaultMetadata.image]

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: ogType,
      siteName: defaultMetadata.siteName,
      url: defaultMetadata.url,
      images: ogImages.map(image => ({
        url: image.startsWith('http') ? image : `${defaultMetadata.url}${image}`,
        width: 1200,
        height: 630,
        alt: ogTitle
      }))
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: ogImages
    }
  }
}

export const generateProductMetadata = (productName: string, description: string): Metadata => {
  return generateMetadata({
    title: productName,
    description,
    keywords: ['SaaS', 'プロダクト', productName, 'Unson OS'],
    openGraph: {
      type: 'website',
      title: productName,
      description
    }
  })
}

export const generatePageMetadata = (
  pageName: string, 
  description: string, 
  keywords: string[] = []
): Metadata => {
  return generateMetadata({
    title: pageName,
    description,
    keywords: ['Unson OS', ...keywords],
    canonical: `/${pageName.toLowerCase().replace(/\s+/g, '-')}`
  })
}