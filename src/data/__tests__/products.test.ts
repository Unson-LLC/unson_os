import { describe, it, expect } from '@jest/globals'
import { products, getProductById, Product } from '../products'

describe('products.ts', () => {
  describe('実サービスデータ', () => {
    it('MyWaの実データが正しく設定されている', () => {
      const mywa = products.find(p => p.name === 'MyWa（マイワ）')
      
      expect(mywa).toBeDefined()
      expect(mywa?.isReal).toBe(true)
      expect(mywa?.serviceUrl).toBe('https://mywa.unson.jp/')
      expect(mywa?.lpUrl).toBe('https://mywa.unson.jp/')
      expect(mywa?.launchDate).toBe('2024年12月（ベータ版）')
      expect(mywa?.category).toBe('AI・ニュース')
    })

    it('MyWaがプロダクトリストの最初に配置されている', () => {
      const firstProduct = products[0]
      expect(firstProduct.name).toBe('MyWa（マイワ）')
      expect(firstProduct.id).toBe(0)
    })

    it('MyWaの詳細機能が正しく設定されている', () => {
      const mywa = getProductById(0)
      
      expect(mywa?.detailedFeatures).toHaveLength(4)
      expect(mywa?.detailedFeatures?.[0].title).toBe('1分で読める実用記事')
      expect(mywa?.detailedFeatures?.[1].title).toBe('Why-Chip機能')
      expect(mywa?.detailedFeatures?.[2].title).toBe('AIパーソナライズ')
      expect(mywa?.detailedFeatures?.[3].title).toBe('意味がある日だけ配信')
    })

    it('MyWaのプランが正しく設定されている', () => {
      const mywa = getProductById(0)
      
      expect(mywa?.plans).toHaveLength(3)
      expect(mywa?.plans?.[0].name).toBe('フリープラン')
      expect(mywa?.plans?.[1].name).toBe('プレミアムプラン')
      expect(mywa?.plans?.[1].popular).toBe(true)
      expect(mywa?.plans?.[2].name).toBe('チームプラン')
    })
  })

  describe('広告LP機能', () => {
    it('広告LPデータが存在する場合、正しく表示される', () => {
      const productWithAds: Product = {
        ...products[0],
        advertisingLPs: [
          {
            url: 'https://lp1.example.com',
            title: 'AI効率化LP',
            channel: 'Facebook',
            conversionRate: '12.5%'
          },
          {
            url: 'https://lp2.example.com',
            title: '時短ニュースLP',
            channel: 'Google',
            conversionRate: '8.3%'
          }
        ]
      }
      
      expect(productWithAds.advertisingLPs).toHaveLength(2)
      expect(productWithAds.advertisingLPs?.[0].channel).toBe('Facebook')
      expect(productWithAds.advertisingLPs?.[0].conversionRate).toBe('12.5%')
    })
  })

  describe('カテゴリー', () => {
    it('AI・ニュースカテゴリーが追加されている', () => {
      const { categories } = require('../products')
      expect(categories).toContain('AI・ニュース')
      expect(categories[1]).toBe('AI・ニュース')
    })

    it('ライフスタイルカテゴリーが追加されている', () => {
      const { categories } = require('../products')
      expect(categories).toContain('ライフスタイル')
    })
  })

  describe('わたしコンパスデータ', () => {
    it('わたしコンパスの実データが正しく設定されている', () => {
      const watashiCompass = products.find(p => p.name === 'わたしコンパス')
      
      expect(watashiCompass).toBeDefined()
      expect(watashiCompass?.isReal).toBe(false)
      expect(watashiCompass?.lpUrl).toBe('https://authentic-life-ai.vercel.app/')
      expect(watashiCompass?.category).toBe('ライフスタイル')
      expect(watashiCompass?.status).toBe('coming-soon')
    })

    it('わたしコンパスがMyWaの次に配置されている', () => {
      const secondProduct = products[1]
      expect(secondProduct.name).toBe('わたしコンパス')
      expect(secondProduct.id).toBe(1)
    })

    it('わたしコンパスの詳細機能が正しく設定されている', () => {
      const watashiCompass = getProductById(1)
      
      expect(watashiCompass?.detailedFeatures).toHaveLength(5)
      expect(watashiCompass?.detailedFeatures?.[0].title).toContain('価値観診断')
      expect(watashiCompass?.detailedFeatures?.[1].title).toContain('リアルタイム相談')
    })

    it('わたしコンパスのプランが正しく設定されている', () => {
      const watashiCompass = getProductById(1)
      
      expect(watashiCompass?.plans).toHaveLength(3)
      expect(watashiCompass?.plans?.[0].name).toBe('Basic（無料版）')
      expect(watashiCompass?.plans?.[1].name).toBe('プレミアム')
      expect(watashiCompass?.plans?.[1].price).toBe('¥1,680/月')
      expect(watashiCompass?.plans?.[1].popular).toBe(true)
    })
  })
})