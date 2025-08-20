'use client'

import { useState } from 'react'
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from '@/components/ui/Button'
import { Plus, Edit, Trash2, ExternalLink, Eye } from 'lucide-react'
import type { Id } from "@/convex/_generated/dataModel"

export default function AdminProductsPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [showLPForm, setShowLPForm] = useState<Id<"products"> | null>(null)
  
  const products = useQuery(api.products.list, {})
  const createProduct = useMutation(api.products.create)
  const updateProduct = useMutation(api.products.update)
  const addAdvertisingLP = useMutation(api.products.addAdvertisingLP)
  const removeAdvertisingLP = useMutation(api.products.removeAdvertisingLP)
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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
    
    if (editingProduct) {
      await updateProduct({ id: editingProduct._id, ...productData })
    } else {
      await createProduct(productData)
    }
    
    setShowForm(false)
    setEditingProduct(null)
  }
  
  const handleAddLP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!showLPForm) return
    
    const formData = new FormData(e.currentTarget)
    
    await addAdvertisingLP({
      id: showLPForm,
      lpData: {
        url: formData.get('url') as string,
        title: formData.get('title') as string,
        channel: formData.get('channel') as string,
        conversionRate: formData.get('conversionRate') as string || undefined,
      }
    })
    
    setShowLPForm(null)
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">プロダクト管理</h1>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            新規プロダクト追加
          </Button>
        </div>
        
        {showForm && (
          <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              {editingProduct ? 'プロダクト編集' : '新規プロダクト追加'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">プロダクト名</label>
                  <input
                    name="name"
                    defaultValue={editingProduct?.name}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">カテゴリ</label>
                  <input
                    name="category"
                    defaultValue={editingProduct?.category}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">説明</label>
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
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ユーザー数</label>
                  <input
                    name="users"
                    defaultValue={editingProduct?.users}
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
                    defaultValue={editingProduct?.rating}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">ステータス</label>
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
                  placeholder="機能1&#10;機能2&#10;機能3"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">サービスURL</label>
                  <input
                    name="serviceUrl"
                    type="url"
                    defaultValue={editingProduct?.serviceUrl}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">LP URL</label>
                  <input
                    name="lpUrl"
                    type="url"
                    defaultValue={editingProduct?.lpUrl}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">
                  {editingProduct ? '更新' : '追加'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingProduct(null)
                  }}
                >
                  キャンセル
                </Button>
              </div>
            </form>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  プロダクト名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  カテゴリ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  LP数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  アクション
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products?.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.status === 'launched' ? 'bg-green-100 text-green-800' :
                      product.status === 'testing' ? 'bg-yellow-100 text-yellow-800' :
                      product.status === 'development' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status === 'launched' ? 'リリース済み' :
                       product.status === 'testing' ? 'テスト中' :
                       product.status === 'development' ? '開発中' :
                       '計画中'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.advertisingLPs?.length || 0} LP
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(product)
                          setShowForm(true)
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {product.lpUrl && (
                        <a
                          href={product.lpUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => setShowLPForm(product._id)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {showLPForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">広告用LP追加</h3>
              <form onSubmit={handleAddLP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">LP URL</label>
                  <input
                    name="url"
                    type="url"
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">LPタイトル</label>
                  <input
                    name="title"
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">チャネル</label>
                  <select
                    name="channel"
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="Google Ads">Google Ads</option>
                    <option value="Facebook Ads">Facebook Ads</option>
                    <option value="Twitter Ads">Twitter Ads</option>
                    <option value="LINE Ads">LINE Ads</option>
                    <option value="その他">その他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">コンバージョン率</label>
                  <input
                    name="conversionRate"
                    placeholder="例: 12.5%"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">追加</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowLPForm(null)}
                  >
                    キャンセル
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}