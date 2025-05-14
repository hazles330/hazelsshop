import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import type { Product } from '@/types/product'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSelect: (product: Product) => void
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: '프리미엄 헤드폰',
    price: 299000,
    description: '최고급 무선 헤드폰',
    image: '/images/products/headphone.jpg',
    stock: 10,
    categoryId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: '스마트워치',
    price: 399000,
    description: '최신형 스마트워치',
    image: '/images/products/smartwatch.jpg',
    stock: 5,
    categoryId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export default function ProductSelectModal({ isOpen, onClose, onSelect }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // 임시로 목업 데이터 사용
    setProducts(mockProducts)
  }, [])

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl rounded bg-white p-6 w-full">
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
            상품 선택
          </Dialog.Title>

          <div className="mb-4">
            <input
              type="text"
              placeholder="상품 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  onSelect(product)
                  onClose()
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover mb-2 rounded"
                />
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.description}</p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {product.price.toLocaleString()}원
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={onClose}
            >
              취소
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
