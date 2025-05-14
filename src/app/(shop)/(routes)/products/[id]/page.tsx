'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeftIcon, ShoppingBagIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import { useCartStore } from '@/lib/store/cartStore'
import { toast } from 'react-hot-toast'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
  isActive: boolean
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const addToCart = useCartStore(state => state.addItem)
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('description')
  const [quantity] = useState(1) // 기본 수량을 1로 설정

  useEffect(() => {
    if (params.id) {
      loadProduct()
    }
  }, [params.id])

  const loadProduct = async () => {
    try {
      setIsLoading(true)
      setError('')

      const response = await fetch(`/api/products?id=${params.id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '상품을 찾을 수 없습니다.')
      }

      setProduct(data)
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : '상품 정보를 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    try {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        imageUrl: product.image
      })
      toast.success('장바구니에 추가되었습니다.')
    } catch (error) {
      toast.error('장바구니 추가 실패')
    }
  }

  const handleBuyNow = () => {
    if (!product) return

    try {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        imageUrl: product.image
      })
      router.push('/checkout')
    } catch (error) {
      toast.error('주문 처리 실패')
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mt-4"></div>
              <div className="h-12 bg-gray-200 rounded w-full mt-8"></div>
            </div>
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
              onClick={loadProduct}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              다시 시도
            </button>
            <Link
              href="/products"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              상품 목록으로
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return null
  }
  const getTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">상품 설명</h3>
              <p className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed">
                {product.description}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">주요 특징</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  - 품질 보증: 정품 인증된 상품으로 품질을 보증합니다.
                </li>
                <li className="flex items-start">
                  - A/S 가능: 구매일로부터 1년간 무상 A/S가 가능합니다.
                </li>
                <li className="flex items-start">
                  - 제품 구성: 본품 1개, 사용 설명서
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">상품 정보</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-4 rounded">
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">제품번호</dt>
                      <dd className="font-medium text-gray-900">{product.id}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">카테고리</dt>
                      <dd className="font-medium text-gray-900">{product.category}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">재고수량</dt>
                      <dd className="font-medium text-gray-900">{product.stock}개</dd>
                    </div>
                  </dl>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-500">제조국</dt>
                      <dd className="font-medium text-gray-900">대한민국</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">품질보증기준</dt>
                      <dd className="font-medium text-gray-900">1년</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500">인증정보</dt>
                      <dd className="font-medium text-gray-900">KC인증</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )
      case 'shipping':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">배송 안내</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  - 배송 방법: 우체국 택배 / CJ대한통운
                </li>
                <li className="flex items-start">
                  - 배송 지역: 전국 (제주 및 도서산간 지역은 추가 배송비 발생)
                </li>
                <li className="flex items-start">
                  - 배송 비용: 3,000원 (3만원 이상 구매 시 무료배송)
                </li>
                <li className="flex items-start">
                  - 평균 배송 기간: 2-3일 (주말, 공휴일 제외)
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 p-4 rounded">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">배송 관련 안내사항</h4>
              <ul className="text-sm text-blue-600 space-y-1">
                <li>- 주문량이 많은 경우 배송이 지연될 수 있습니다.</li>
                <li>- 천재지변, 물량 수급 변동 등 예외적인 사유 발생 시, 배송이 지연될 수 있습니다.</li>
              </ul>
            </div>
          </div>
        )
      case 'returns':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">교환/반품 안내</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  - 교환/반품 신청: 상품 수령일로부터 7일 이내
                </li>
                <li className="flex items-start">
                  - 교환/반품 배송비: 6,000원 (왕복 배송비)
                </li>
                <li className="flex items-start">
                  - 반품 주소: 서울특별시 강남구 테헤란로 123 (반품접수센터)
                </li>
              </ul>
            </div>

            <div className="bg-red-50 p-4 rounded">
              <h4 className="text-sm font-semibold text-red-800 mb-2">교환/반품 불가 사유</h4>
              <ul className="text-sm text-red-600 space-y-1">
                <li>- 포장 개봉 후 사용한 경우</li>
                <li>- 상품 및 구성품이 훼손된 경우</li>
                <li>- 텍/라벨이 제거된 경우</li>
                <li>- 상품 수령일로부터 7일이 경과한 경우</li>
              </ul>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            상품 목록으로
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">            <div className="relative aspect-[4/3] bg-gray-50">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name || '상품 이미지'}
                  fill
                  priority
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  이미지 없음
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {product.category}
                </span>
                {product?.stock > 0 ? (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    재고 {product.stock}개
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    품절
                  </span>
                )}
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{product?.name || '상품명 없음'}</h1>
              <p className="text-sm text-gray-600 mb-6">{product?.description || '상품 설명 없음'}</p>
              
              <div className="border-t border-gray-100 pt-6 mb-6">
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-gray-900">
                    {product?.price ? `${product.price.toLocaleString()}원` : '가격 정보 없음'}
                  </p>
                  {product?.price && product.price >= 30000 && (
                    <span className="text-xs text-green-600 font-medium">무료배송</span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product || product.stock === 0}
                    className={`w-full py-3 px-4 rounded-lg text-sm font-medium flex items-center justify-center
                      ${!product || product.stock === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }
                    `}
                  >
                    <ShoppingCartIcon className="h-4 w-4 mr-2" />
                    장바구니
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={!product || product.stock === 0}
                    className={`w-full py-3 px-4 rounded-lg text-sm font-medium flex items-center justify-center
                      ${!product || product.stock === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                      }
                    `}
                  >
                    <ShoppingBagIcon className="h-4 w-4 mr-2" />
                    바로구매
                  </button>
                </div>
                {!product ? (
                  <p className="text-center text-xs text-red-600">
                    상품 정보를 불러오는 중입니다.
                  </p>
                ) : product.stock === 0 && (
                  <p className="text-center text-xs text-red-600 bg-red-50 p-2 rounded">
                    현재 품절된 상품입니다.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-100">
            <nav className="flex">
              {[
                { id: 'description', label: '상세정보' },
                { id: 'shipping', label: '배송안내' },
                { id: 'returns', label: '교환/반품' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium transition-colors
                    ${activeTab === tab.id
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-6">
            {getTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}