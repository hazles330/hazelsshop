'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { Category } from '@/types/category'
import ProductGrid from '@/components/product/ProductGrid'
import Link from 'next/link'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isActive: boolean
}

interface CategoryResponse {
  category: Category
  products: Product[]
  error?: string
}

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.slug) {
      loadCategoryAndProducts()
    }
  }, [params.slug])

  const loadCategoryAndProducts = async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await fetch(`/api/categories?slug=${params.slug}`)
      const data: CategoryResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '카테고리를 찾을 수 없습니다.')
      }

      setCategory(data.category)
      setProducts(data.products)
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : '카테고리 정보를 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="rounded-lg overflow-hidden shadow-md">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-center">
          <p className="text-red-700 mb-4">{error}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={loadCategoryAndProducts}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              다시 시도
            </button>
            <Link
              href="/categories"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              카테고리 목록으로
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!category) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href="/categories"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          카테고리 목록으로
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-lg text-gray-500">{category.description}</p>
        )}
      </div>
      
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">아직 상품이 없습니다.</p>
        </div>
      )}
    </div>
  )
}