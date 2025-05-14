'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { useProductHighlightStore } from '@/lib/store/productHighlightStore'
import Image from 'next/image'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon, 
  ArrowUpIcon, 
  ArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhotoIcon,
  TagIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  PlusCircleIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  StarIcon,
  SparklesIcon,
  BarsArrowUpIcon,
  BarsArrowDownIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid, SparklesIcon as SparklesIconSolid } from '@heroicons/react/24/solid'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  stock: number
  isActive: boolean
  category: string
  createdAt: Date
  updatedAt: Date
}

// SortableItem 컴포넌트
function SortableHighlightItem({ id, product, type }: { 
  id: string
  product: Product
  type: 'best' | 'new' 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow mb-2 cursor-move"
      {...attributes}
      {...listeners}
    >
      <div className="text-gray-400">
        <BarsArrowUpIcon className="w-5 h-5" />
      </div>
      {product.image ? (
        <Image
          src={product.image}
          alt={product.name}
          width={48}
          height={48}
          className="rounded-md object-cover"
        />
      ) : (
        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
          <PhotoIcon className="w-6 h-6 text-gray-400" />
        </div>
      )}
      <div className="flex-1">
        <p className="font-medium">{product.name}</p>
        <p className="text-sm text-gray-500">{product.price.toLocaleString()}원</p>
      </div>
      {type === 'best' ? (
        <StarIconSolid className="w-5 h-5 text-yellow-500" />
      ) : (
        <SparklesIconSolid className="w-5 h-5 text-blue-500" />
      )}
    </div>
  )
}

export default function ProductsPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { 
    bestProducts, 
    newProducts, 
    addToBest, 
    addToNew, 
    removeFromBest, 
    removeFromNew,
    reorderBestProducts,
    reorderNewProducts 
  } = useProductHighlightStore()
  const [products, setProducts] = useState<Product[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [message, setMessage] = useState({ type: '', content: '' })
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Product
    direction: 'asc' | 'desc'
  }>({ key: 'createdAt', direction: 'desc' })
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    stock: 0,
    isActive: true,
    category: ''
  })
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [showHighlightManager, setShowHighlightManager] = useState(false)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/login')
      return
    }
    loadProducts()
  }, [user, router])

  const loadProducts = async () => {
    try {
      // TODO: API 연동
      const dummyProducts: Product[] = [
        {
          id: '1',
          name: '기본 상품',
          description: '기본 상품 설명',
          price: 10000,
          image: '/images/product1.jpg',
          stock: 100,
          isActive: true,
          category: '의류',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      setProducts(dummyProducts)
    } catch (error) {
      setMessage({ type: 'error', content: '상품 목록을 불러오는데 실패했습니다.' })
    }
  }

  const handleSort = (key: keyof Product) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const sortedProducts = [...products].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        // TODO: API 연동 - 상품 수정
        const updatedProduct = {
          ...editingProduct,
          ...formData,
          updatedAt: new Date()
        }
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p))
        setMessage({ type: 'success', content: '상품이 수정되었습니다.' })
      } else {
        // TODO: API 연동 - 상품 추가
        const newProduct: Product = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        setProducts(prev => [...prev, newProduct])
        setMessage({ type: 'success', content: '새로운 상품이 추가되었습니다.' })
      }
      closeModal()
    } catch (error) {
      setMessage({ 
        type: 'error', 
        content: `상품 ${editingProduct ? '수정' : '추가'}에 실패했습니다.` 
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('정말 이 상품을 삭제하시겠습니까?')) return
    
    try {
      // TODO: API 연동
      setProducts(products.filter(p => p.id !== id))
      setMessage({ type: 'success', content: '상품이 삭제되었습니다.' })
    } catch (error) {
      setMessage({ type: 'error', content: '상품 삭제에 실패했습니다.' })
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      stock: product.stock,
      isActive: product.isActive,
      category: product.category
    })
    setIsModalOpen(true)
  }

  const handleToggleActive = async (product: Product) => {
    try {
      // TODO: API 연동
      const updatedProduct = {
        ...product,
        isActive: !product.isActive,
        updatedAt: new Date()
      }
      setProducts(prev => prev.map(p => p.id === product.id ? updatedProduct : p))
      setMessage({ 
        type: 'success', 
        content: `상품이 ${updatedProduct.isActive ? '활성화' : '비활성화'} 되었습니다.` 
      })
    } catch (error) {
      setMessage({ type: 'error', content: '상품 상태 변경에 실패했습니다.' })
    }
  }

  const handleExcelDownload = () => {
    try {
      // TODO: API 연동 - 엑셀 다운로드
      const header = ['상품명', '설명', '가격', '재고', '카테고리', '상태']
      const data = products.map(product => [
        product.name,
        product.description,
        product.price,
        product.stock,
        product.category,
        product.isActive ? '활성' : '비활성'
      ])

      const csvContent = [
        header.join(','),
        ...data.map(row => row.join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `products_${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      
      setMessage({ type: 'success', content: '상품 목록이 다운로드되었습니다.' })
    } catch (error) {
      setMessage({ type: 'error', content: '엑셀 다운로드에 실패했습니다.' })
    }
  }

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const text = e.target?.result as string
        const rows = text.split('\n')
        const header = rows[0].split(',')
        const data = rows.slice(1).map(row => {
          const values = row.split(',')
          return {
            name: values[0],
            description: values[1],
            price: Number(values[2]),
            stock: Number(values[3]),
            category: values[4],
            isActive: values[5] === '활성',
            image: '/images/default-product.jpg', // 기본 이미지
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        })

        // TODO: API 연동 - 엑셀 업로드
        setProducts(prev => [...prev, ...data])
        setMessage({ type: 'success', content: '상품이 일괄 등록되었습니다.' })
      }
      reader.readAsText(file)
    } catch (error) {
      setMessage({ type: 'error', content: '엑셀 업로드에 실패했습니다.' })
    }
    
    // 파일 입력 초기화
    event.target.value = ''
  }

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        stock: product.stock,
        isActive: product.isActive,
        category: product.category
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        description: '',
        price: 0,
        image: '',
        stock: 0,
        isActive: true,
        category: ''
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      price: 0,
      image: '',
      stock: 0,
      isActive: true,
      category: ''
    })
  }

  const handlePreview = (product: Product) => {
    setPreviewProduct(product)
    setIsPreviewModalOpen(true)
  }

  const handlePreviewClose = () => {
    setPreviewProduct(null)
    setIsPreviewModalOpen(false)
  }

  const handleToggleBest = (productId: string) => {
    const isBest = bestProducts.some(p => p.productId === productId)
    if (isBest) {
      removeFromBest(productId)
      setMessage({ type: 'success', content: '베스트 상품에서 제거되었습니다.' })
    } else {
      addToBest(productId)
      setMessage({ type: 'success', content: '베스트 상품으로 등록되었습니다.' })
    }
  }

  const handleToggleNew = (productId: string) => {
    const isNew = newProducts.some(p => p.productId === productId)
    if (isNew) {
      removeFromNew(productId)
      setMessage({ type: 'success', content: '신상품에서 제거되었습니다.' })
    } else {
      addToNew(productId)
      setMessage({ type: 'success', content: '신상품으로 등록되었습니다.' })
    }
  }

  const handleDragEnd = (event: DragEndEvent, type: 'best' | 'new') => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      const oldIndex = type === 'best'
        ? bestProducts.findIndex(p => p.productId === active.id)
        : newProducts.findIndex(p => p.productId === active.id)
      const newIndex = type === 'best'
        ? bestProducts.findIndex(p => p.productId === over.id)
        : newProducts.findIndex(p => p.productId === over.id)
      
      if (type === 'best') {
        const newOrder = arrayMove(bestProducts.map(p => p.productId), oldIndex, newIndex)
        reorderBestProducts(newOrder)
      } else {
        const newOrder = arrayMove(newProducts.map(p => p.productId), oldIndex, newIndex)
        reorderNewProducts(newOrder)
      }
    }
  }

  const renderHighlightButtons = (product: Product) => {
    const isBest = bestProducts.some(p => p.productId === product.id)
    const isNew = newProducts.some(p => p.productId === product.id)
    
    return (
      <div className="flex space-x-2">
        <button
          onClick={() => handleToggleBest(product.id)}
          className={`p-1 rounded ${isBest ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-600`}
          title={isBest ? '베스트 상품 해제' : '베스트 상품으로 등록'}
        >
          {isBest ? <StarIconSolid className="w-5 h-5" /> : <StarIcon className="w-5 h-5" />}
        </button>
        <button
          onClick={() => handleToggleNew(product.id)}
          className={`p-1 rounded ${isNew ? 'text-blue-500' : 'text-gray-400'} hover:text-blue-600`}
          title={isNew ? '신상품 해제' : '신상품으로 등록'}
        >
          {isNew ? <SparklesIconSolid className="w-5 h-5" /> : <SparklesIcon className="w-5 h-5" />}
        </button>
      </div>
    )
  }

  const renderHighlightManager = () => {
    if (!showHighlightManager) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-4xl mx-4 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">베스트/신상품 관리</h2>
            <button
              onClick={() => setShowHighlightManager(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <StarIconSolid className="w-5 h-5 text-yellow-500 mr-2" />
                베스트 상품
              </h3>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => handleDragEnd(event, 'best')}
              >
                <SortableContext
                  items={bestProducts.map(p => p.productId)}
                  strategy={verticalListSortingStrategy}
                >
                  {bestProducts.map((highlight) => {
                    const product = products.find(p => p.id === highlight.productId)
                    if (!product) return null
                    return (
                      <SortableHighlightItem
                        key={highlight.productId}
                        id={highlight.productId}
                        product={product}
                        type="best"
                      />
                    )
                  })}
                </SortableContext>
              </DndContext>
              {bestProducts.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  등록된 베스트 상품이 없습니다.
                </p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <SparklesIconSolid className="w-5 h-5 text-blue-500 mr-2" />
                신상품
              </h3>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(event) => handleDragEnd(event, 'new')}
              >
                <SortableContext
                  items={newProducts.map(p => p.productId)}
                  strategy={verticalListSortingStrategy}
                >
                  {newProducts.map((highlight) => {
                    const product = products.find(p => p.id === highlight.productId)
                    if (!product) return null
                    return (
                      <SortableHighlightItem
                        key={highlight.productId}
                        id={highlight.productId}
                        product={product}
                        type="new"
                      />
                    )
                  })}
                </SortableContext>
              </DndContext>
              {newProducts.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  등록된 신상품이 없습니다.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderPreviewModal = () => {
    if (!previewProduct) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full mx-4 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">상품 미리보기</h2>
              <button
                onClick={handlePreviewClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="relative aspect-square">
                {previewProduct.image ? (
                  <Image
                    src={previewProduct.image}
                    alt={previewProduct.name}
                    fill
                    className="object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                    <PhotoIcon className="w-20 h-20 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold">{previewProduct.name}</h3>
                  <p className="text-gray-600 mt-2">{previewProduct.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">가격</p>
                    <p className="font-bold">{previewProduct.price.toLocaleString()}원</p>
                  </div>
                  <div>
                    <p className="text-gray-600">재고</p>
                    <p className="font-bold">{previewProduct.stock}개</p>
                  </div>
                  <div>
                    <p className="text-gray-600">카테고리</p>
                    <p className="font-bold">{previewProduct.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">상태</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      previewProduct.isActive 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {previewProduct.isActive ? '판매중' : '판매중지'}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-gray-600">구분</p>
                  <div className="flex items-center space-x-4 mt-2">
                    {bestProducts.some(p => p.productId === previewProduct.id) && (
                      <span className="inline-flex items-center text-yellow-500">
                        <StarIconSolid className="w-5 h-5 mr-1" />
                        베스트
                      </span>
                    )}
                    {newProducts.some(p => p.productId === previewProduct.id) && (
                      <span className="inline-flex items-center text-blue-500">
                        <SparklesIconSolid className="w-5 h-5 mr-1" />
                        신상품
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">상품 관리</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowHighlightManager(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            베스트/신상품 관리
          </button>
          <button
            onClick={() => {
              setEditingProduct(null)
              setIsModalOpen(true)
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            상품 등록
          </button>
        </div>
      </div>

      {/* Message display */}
      {message.content && (
        <div className={`mb-4 p-4 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.content}
        </div>
      )}

      {/* Products table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">이미지</th>
              <th className="p-4 text-left cursor-pointer" onClick={() => handleSort('name')}>
                <div className="flex items-center">
                  상품명
                  {sortConfig.key === 'name' && (
                    sortConfig.direction === 'asc' ? <ArrowUpIcon className="w-4 h-4 ml-1" /> : <ArrowDownIcon className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
              <th className="p-4 text-left cursor-pointer" onClick={() => handleSort('price')}>
                <div className="flex items-center">
                  가격
                  {sortConfig.key === 'price' && (
                    sortConfig.direction === 'asc' ? <ArrowUpIcon className="w-4 h-4 ml-1" /> : <ArrowDownIcon className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
              <th className="p-4 text-left cursor-pointer" onClick={() => handleSort('stock')}>
                <div className="flex items-center">
                  재고
                  {sortConfig.key === 'stock' && (
                    sortConfig.direction === 'asc' ? <ArrowUpIcon className="w-4 h-4 ml-1" /> : <ArrowDownIcon className="w-4 h-4 ml-1" />
                  )}
                </div>
              </th>
              <th className="p-4 text-left">상태</th>
              <th className="p-4 text-left">구분</th>
              <th className="p-4 text-left">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="relative w-16 h-16">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="64px"
                        className="object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                        <PhotoIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">{product.name}</td>
                <td className="p-4">{product.price.toLocaleString()}원</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4">
                  {product.isActive ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircleIcon className="w-4 h-4 mr-1" />
                      판매중
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <XCircleIcon className="w-4 h-4 mr-1" />
                      판매중지
                    </span>
                  )}
                </td>
                <td className="p-4">
                  {renderHighlightButtons(product)}
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePreview(product)}
                      className="text-gray-400 hover:text-gray-600"
                      title="미리보기"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => openModal(product)}
                      className="text-blue-400 hover:text-blue-600"
                      title="수정"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-400 hover:text-red-600"
                      title="삭제"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
            <h2 className="text-lg font-medium mb-4">
              {editingProduct ? '상품 수정' : '새 상품 추가'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  상품명
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  설명
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  가격
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  이미지 URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  재고
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  카테고리
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  활성화
                </label>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {editingProduct ? '수정' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPreviewModalOpen && renderPreviewModal()}
      {showHighlightManager && renderHighlightManager()}
    </div>
  )
}