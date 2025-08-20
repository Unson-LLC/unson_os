'use client'

import { useState } from 'react'
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from '@/components/ui/Button'
import { X } from 'lucide-react'

interface ProductFormProps {
  onClose: () => void
  editingProduct?: any
}

export function ProductForm({ onClose, editingProduct }: ProductFormProps) {
  const createProduct = useMutation(api.products.create)
  const updateProduct = useMutation(api.products.update)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    
    const productData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      longDescription: formData.get('longDescription') as string || undefined,
      category: formData.get('category') as string,
      price: formData.get('price') as string || undefined,
      users: formData.get('users') as string || undefined,
      rating: formData.get('rating') ? parseFloat(formData.get('rating') as string) : undefined,
      status: formData.get('status') as "planning" | "development" | "testing" | "launched",
      features: formData.get('features') ? (formData.get('features') as string).split('\n').filter(f => f.trim()) : undefined,
      serviceUrl: formData.get('serviceUrl') as string || undefined,
      lpUrl: formData.get('lpUrl') as string || undefined,
      isReal: formData.get('isReal') === 'true',
    }
    
    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct._id, ...productData })
      } else {
        await createProduct(productData)
      }
      onClose()
    } catch (error) {
      console.error('Error saving product:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {editingProduct ? 'プロダクト編集' : '新規プロダクト追加'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">プロダクト名 *</label>
              <input
                name="name"
                defaultValue={editingProduct?.name}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">カテゴリ *</label>
              <select
                name="category"
                defaultValue={editingProduct?.category || 'AI・ニュース'}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="AI・ニュース">AI・ニュース</option>
                <option value="ライフスタイル">ライフスタイル</option>
                <option value="ビジネス">ビジネス</option>
                <option value="教育">教育</option>
                <option value="ヘルスケア">ヘルスケア</option>
                <option value="エンタメ">エンタメ</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">説明 *</label>
            <textarea
              name="description"
              defaultValue={editingProduct?.description}
              className="w-full px-3 py-2 border rounded-md"
              rows={2}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">詳細説明</label>
            <textarea
              name="longDescription"
              defaultValue={editingProduct?.longDescription}
              className="w-full px-3 py-2 border rounded-md"
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">価格</label>
              <input
                name="price"
                defaultValue={editingProduct?.price}
                placeholder="月額 ¥980"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ユーザー数</label>
              <input
                name="users"
                defaultValue={editingProduct?.users}
                placeholder="1000+"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">評価</label>
              <input
                name="rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                defaultValue={editingProduct?.rating || 4.5}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">ステータス *</label>
              <select
                name="status"
                defaultValue={editingProduct?.status || 'planning'}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="planning">計画中</option>
                <option value="development">開発中</option>
                <option value="testing">テスト中</option>
                <option value="launched">リリース済み</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">実在プロダクト</label>
              <select
                name="isReal"
                defaultValue={editingProduct?.isReal ? 'true' : 'false'}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="false">構想段階</option>
                <option value="true">実在</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">機能（改行区切り）</label>
            <textarea
              name="features"
              defaultValue={editingProduct?.features?.join('\n')}
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
              placeholder="1分で読める要約ニュース&#10;Why-Chip（推薦理由表示）&#10;AIパーソナライズ学習"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">サービスURL</label>
              <input
                name="serviceUrl"
                type="url"
                defaultValue={editingProduct?.serviceUrl}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">LP URL</label>
              <input
                name="lpUrl"
                type="url"
                defaultValue={editingProduct?.lpUrl}
                placeholder="https://example.com/lp"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '保存中...' : (editingProduct ? '更新' : '追加')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              キャンセル
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}