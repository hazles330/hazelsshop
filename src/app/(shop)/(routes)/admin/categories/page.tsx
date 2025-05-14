'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '@/types/category'

export default function CategoriesPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [categories, setCategories] = useState<Category[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [selectedParentId, setSelectedParentId] = useState<string | undefined>(undefined)
  const [message, setMessage] = useState({ type: '', content: '' })
  const [formData, setFormData] = useState<CreateCategoryInput>({
    name: '',
    description: '',
  })

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/login')
    }
    loadCategories()
  }, [user, router])

  const loadCategories = async () => {
    try {
      // TODO: API 연동
      const dummyCategories: Category[] = [
        {
          id: '1',
          name: '의류',
          slug: 'clothing',
          description: '의류 카테고리',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          name: '상의',
          slug: 'tops',
          description: '상의 카테고리',
          parentId: '1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      setCategories(dummyCategories)
    } catch (error) {
      setMessage({ type: 'error', content: '카테고리 목록을 불러오는데 실패했습니다.' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        // TODO: API 연동 - 카테고리 수정
        const updatedCategory = {
          ...editingCategory,
          ...formData,
          parentId: selectedParentId,
          updatedAt: new Date()
        }
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? updatedCategory : c))
        setMessage({ type: 'success', content: '카테고리가 수정되었습니다.' })
      } else {
        // TODO: API 연동 - 카테고리 추가
        const newCategory: Category = {
          id: Date.now().toString(),
          ...formData,
          parentId: selectedParentId,
          slug: formData.name.toLowerCase().replace(/ /g, '-'),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        setCategories(prev => [...prev, newCategory])
        setMessage({ type: 'success', content: '새로운 카테고리가 추가되었습니다.' })
      }
      closeModal()
    } catch (error) {
      setMessage({ 
        type: 'error', 
        content: `카테고리 ${editingCategory ? '수정' : '추가'}에 실패했습니다.`
      })
    }
  }

  const handleDelete = async (categoryId: string) => {
    // 하위 카테고리가 있는지 확인
    const hasChildren = categories.some(cat => cat.parentId === categoryId)
    if (hasChildren) {
      setMessage({ 
        type: 'error', 
        content: '하위 카테고리가 있는 카테고리는 삭제할 수 없습니다. 먼저 하위 카테고리를 삭제해주세요.' 
      })
      return
    }

    if (!confirm('정말 이 카테고리를 삭제하시겠습니까?')) {
      return
    }

    try {
      // TODO: API 연동
      setCategories(prev => prev.filter(c => c.id !== categoryId))
      setMessage({ type: 'success', content: '카테고리가 삭제되었습니다.' })
    } catch (error) {
      setMessage({ type: 'error', content: '카테고리 삭제에 실패했습니다.' })
    }
  }

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        description: category.description || ''
      })
      setSelectedParentId(category.parentId)
    } else {
      setEditingCategory(null)
      setFormData({
        name: '',
        description: ''
      })
      setSelectedParentId(undefined)
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
    setFormData({
      name: '',
      description: ''
    })
    setSelectedParentId(undefined)
  }

  // 상위 카테고리만 필터링
  const parentCategories = categories.filter(cat => !cat.parentId)
  
  // 특정 상위 카테고리의 하위 카테고리 필터링
  const getChildCategories = (parentId: string) => {
    return categories.filter(cat => cat.parentId === parentId)
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0 mb-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">카테고리 관리</h1>
            <p className="mt-2 text-sm text-gray-700">
              상품 카테고리를 관리할 수 있습니다. 상위 카테고리와 하위 카테고리를 구분하여 관리하세요.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={() => openModal()}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              카테고리 추가
            </button>
          </div>
        </div>
      </div>

      {message.content && (
        <div className={`mb-4 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.content}
        </div>
      )}

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {parentCategories.map((parent) => (
          <div key={parent.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{parent.name}</h3>
                {parent.description && (
                  <p className="mt-1 text-sm text-gray-500">{parent.description}</p>
                )}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => openModal(parent)}
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(parent.id)}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  삭제
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">하위 카테고리</h4>
                <button
                  onClick={() => {
                    setSelectedParentId(parent.id)
                    openModal()
                  }}
                  className="text-sm text-blue-600 hover:text-blue-900"
                >
                  하위 카테고리 추가
                </button>
              </div>
              <div className="bg-gray-50 rounded-md p-4">
                {getChildCategories(parent.id).length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {getChildCategories(parent.id).map((child) => (
                      <li key={child.id} className="py-3 flex justify-between items-center">
                        <div>
                          <span className="text-sm font-medium text-gray-900">{child.name}</span>
                          {child.description && (
                            <p className="text-sm text-gray-500">{child.description}</p>
                          )}
                        </div>
                        <div className="flex space-x-4">
                          <button
                            onClick={() => openModal(child)}
                            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDelete(child.id)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            삭제
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">하위 카테고리가 없습니다.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
            <h2 className="text-lg font-medium mb-4">
              {editingCategory ? '카테고리 수정' : '새 카테고리 추가'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  카테고리 이름
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
                />
              </div>
              {!editingCategory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    상위 카테고리
                  </label>
                  <select
                    value={selectedParentId || ''}
                    onChange={(e) => setSelectedParentId(e.target.value || undefined)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">상위 카테고리로 생성</option>
                    {parentCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}의 하위 카테고리로 생성
                      </option>
                    ))}
                  </select>
                </div>
              )}
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
                  {editingCategory ? '수정' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}