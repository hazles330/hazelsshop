'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ProductGrid from '@/components/product/ProductGrid'
import type { Category } from '@/types/category'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  isActive: boolean
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const currentCategory = searchParams.get('category')

  useEffect(() => {
    loadCategories()
    loadProducts()
  }, [searchParams])

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (!response.ok) {
        throw new Error('카테고리를 불러오는데 실패했습니다.')
      }
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Categories Error:', error)
    }
  }

  const loadProducts = async () => {
    try {
      setIsLoading(true)
      setError('')

      const category = searchParams.get('category')
      const url = category ? `/api/products?category=${category}` : '/api/products'
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('서버 오류가 발생했습니다.')
      }

      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : '상품 목록을 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">          {/* 카테고리 메뉴 스켈레톤 */}
          <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={`category-skeleton-${i}`} className="h-10 w-24 bg-gray-200 rounded-full flex-shrink-0"></div>
            ))}
          </div>
          {/* 상품 그리드 스켈레톤 */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={`product-skeleton-${i}`} className="bg-gray-200 h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 카테고리 메뉴 */}
      <div className="mb-8">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">          <Link
            href="/products"
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium
              ${!currentCategory
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
          >
            전체
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium
                ${currentCategory === category.slug
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      {/* 상품 그리드 */}
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">상품이 없습니다.</p>
        </div>
      )}
    </div>
  )
}