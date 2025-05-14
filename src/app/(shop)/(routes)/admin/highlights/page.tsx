'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/product/ProductCard'
import { useProductHighlightStore } from '@/lib/store/productHighlightStore'
import type { Product } from '@/types/product'
import ProductSelectModal from '@/components/modals/ProductSelectModal'

// 임시 데이터
const mockProducts = [
  {
    id: '1',
    name: '프리미엄 헤드폰',
    price: 299000,
    description: '최고급 무선 헤드폰',
    image: '/images/products/headphone.jpg'
  },
  {
    id: '2',
    name: '스마트워치',
    price: 399000,
    description: '최신형 스마트워치',
    image: '/images/products/smartwatch.jpg'
  },
]

export default function HighlightsPage() {
  const [bestProducts, setBestProducts] = useState(mockProducts)
  const [newProducts, setNewProducts] = useState(mockProducts)
  const [draggedProduct, setDraggedProduct] = useState<null | { id: string, type: 'best' | 'new' }>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'best' | 'new'>('best')

  const highlightStore = useProductHighlightStore()

  // 초기 데이터 로드
  useEffect(() => {
    // 실제 데이터와 연결될 때는 아래 주석을 해제
    // setBestProducts(highlightStore.bestProducts.sort((a, b) => a.order - b.order))
    // setNewProducts(highlightStore.newProducts.sort((a, b) => a.order - b.order))
  }, [])

  const handleDragStart = (e: React.DragEvent, productId: string, type: 'best' | 'new') => {
    setDraggedProduct({ id: productId, type })
    e.currentTarget.classList.add('opacity-50')
  }

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50')
    setDraggedProduct(null)
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number, targetType: 'best' | 'new') => {
    e.preventDefault()
    
    if (!draggedProduct) return

    const sourceProducts = draggedProduct.type === 'best' ? bestProducts : newProducts
    const targetProducts = targetType === 'best' ? bestProducts : newProducts

    const sourceIndex = sourceProducts.findIndex(p => p.id === draggedProduct.id)
    const [movedProduct] = sourceProducts.splice(sourceIndex, 1)
    
    if (draggedProduct.type === targetType) {
      // 같은 리스트 내에서 이동
      targetProducts.splice(targetIndex, 0, movedProduct)
      
      // 스토어에 순서 업데이트
      if (targetType === 'best') {
        highlightStore.reorderBestProducts(targetProducts.map(p => p.id))
      } else {
        highlightStore.reorderNewProducts(targetProducts.map(p => p.id))
      }
    } else {
      // 다른 리스트로 이동
      targetProducts.splice(targetIndex, 0, movedProduct)

      // 기존 리스트에서 제거
      if (draggedProduct.type === 'best') {
        highlightStore.removeFromBest(draggedProduct.id)
      } else {
        highlightStore.removeFromNew(draggedProduct.id)
      }

      // 새 리스트에 추가
      if (targetType === 'best') {
        highlightStore.addToBest(movedProduct.id)
        highlightStore.reorderBestProducts(targetProducts.map(p => p.id))
      } else {
        highlightStore.addToNew(movedProduct.id)
        highlightStore.reorderNewProducts(targetProducts.map(p => p.id))
      }
    }

    setBestProducts([...bestProducts])
    setNewProducts([...newProducts])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const removeProduct = (productId: string, listType: 'best' | 'new') => {
    if (listType === 'best') {
      setBestProducts(prev => prev.filter(p => p.id !== productId))
      highlightStore.removeFromBest(productId)
    } else {
      setNewProducts(prev => prev.filter(p => p.id !== productId))
      highlightStore.removeFromNew(productId)
    }
  }

  const openModal = (type: 'best' | 'new') => {
    setModalType(type)
    setIsModalOpen(true)
  }

  const handleProductSelect = (product: Product) => {
    if (modalType === 'best') {
      if (!bestProducts.find(p => p.id === product.id)) {
        setBestProducts(prev => [...prev, product])
        highlightStore.addToBest(product.id)
      }
    } else {
      if (!newProducts.find(p => p.id === product.id)) {
        setNewProducts(prev => [...prev, product])
        highlightStore.addToNew(product.id)
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">상품 하이라이트 관리</h1>
        <p className="mt-2 text-sm text-gray-600">
          베스트 상품과 새상품을 드래그 앤 드롭으로 순서를 변경하거나 관리할 수 있습니다.
        </p>
      </div>

      {/* 베스트 상품 섹션 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">베스트 상품</h2>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={() => openModal('best')}
          >
            상품 추가
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {bestProducts.map((product, index) => (
            <div
              key={product.id}
              draggable
              onDragStart={(e) => handleDragStart(e, product.id, 'best')}
              onDragEnd={handleDragEnd}
              onDrop={(e) => handleDrop(e, index, 'best')}
              onDragOver={handleDragOver}
              className="relative group cursor-move"
            >
              <ProductCard
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                image={product.image}
              />
              <button
                onClick={() => removeProduct(product.id, 'best')}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 새상품 섹션 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">새상품</h2>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={() => openModal('new')}
          >
            상품 추가
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {newProducts.map((product, index) => (
            <div
              key={product.id}
              draggable
              onDragStart={(e) => handleDragStart(e, product.id, 'new')}
              onDragEnd={handleDragEnd}
              onDrop={(e) => handleDrop(e, index, 'new')}
              onDragOver={handleDragOver}
              className="relative group cursor-move"
            >
              <ProductCard
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                image={product.image}
              />
              <button
                onClick={() => removeProduct(product.id, 'new')}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <ProductSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleProductSelect}
      />
    </div>
  )
}
