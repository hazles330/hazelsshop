'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import type { Banner, CreateBannerInput } from '@/types/banner'
import Image from 'next/image'

export default function BannersPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [banners, setBanners] = useState<Banner[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [message, setMessage] = useState({ type: '', content: '' })
  const [formData, setFormData] = useState<CreateBannerInput>({
    title: '',
    imageUrl: '',
    link: '',
    isActive: true,
    startDate: new Date(),
    endDate: new Date(),
  })

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/login')
    }
    // TODO: API로 배너 목록 가져오기
    loadBanners()
  }, [user, router])

  const loadBanners = async () => {
    try {
      // TODO: API 연동
      const dummyBanners: Banner[] = [
        {
          id: '1',
          title: '메인 배너',
          imageUrl: '/images/banner1.jpg',
          link: '/products',
          isActive: true,
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      setBanners(dummyBanners)
    } catch (error) {
      setMessage({ type: 'error', content: '배너 목록을 불러오는데 실패했습니다.' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingBanner) {
        // TODO: API 연동 - 배너 수정
        const updatedBanner = {
          ...editingBanner,
          ...formData,
          updatedAt: new Date()
        }
        setBanners(prev => prev.map(b => b.id === editingBanner.id ? updatedBanner : b))
        setMessage({ type: 'success', content: '배너가 수정되었습니다.' })
      } else {
        // TODO: API 연동 - 배너 추가
        const newBanner: Banner = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        setBanners(prev => [...prev, newBanner])
        setMessage({ type: 'success', content: '새로운 배너가 추가되었습니다.' })
      }
      closeModal()
    } catch (error) {
      setMessage({ 
        type: 'error', 
        content: `배너 ${editingBanner ? '수정' : '추가'}에 실패했습니다.`
      })
    }
  }

  const handleDelete = async (bannerId: string) => {
    if (!confirm('정말 이 배너를 삭제하시겠습니까?')) {
      return
    }

    try {
      // TODO: API 연동
      setBanners(prev => prev.filter(b => b.id !== bannerId))
      setMessage({ type: 'success', content: '배너가 삭제되었습니다.' })
    } catch (error) {
      setMessage({ type: 'error', content: '배너 삭제에 실패했습니다.' })
    }
  }

  const openModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner)
      setFormData({
        title: banner.title,
        imageUrl: banner.imageUrl,
        link: banner.link,
        isActive: banner.isActive,
        startDate: new Date(banner.startDate),
        endDate: new Date(banner.endDate)
      })
    } else {
      setEditingBanner(null)
      setFormData({
        title: '',
        imageUrl: '',
        link: '',
        isActive: true,
        startDate: new Date(),
        endDate: new Date()
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingBanner(null)
    setFormData({
      title: '',
      imageUrl: '',
      link: '',
      isActive: true,
      startDate: new Date(),
      endDate: new Date()
    })
  }

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0 mb-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">배너 관리</h1>
            <p className="mt-2 text-sm text-gray-700">
              메인 페이지와 각종 프로모션 배너를 관리할 수 있습니다.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={() => openModal()}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              배너 추가
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="relative h-48">
              {banner.imageUrl && (
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">{banner.title}</h3>
              <div className="mt-1 flex justify-between items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  banner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {banner.isActive ? '활성' : '비활성'}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(banner.startDate).toLocaleDateString()} ~ {new Date(banner.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={() => openModal(banner)}
                  className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  className="text-red-600 hover:text-red-900 text-sm font-medium"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
            <h2 className="text-lg font-medium mb-4">
              {editingBanner ? '배너 수정' : '새 배너 추가'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  제목
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  이미지 URL
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  링크
                </label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  시작일
                </label>
                <input
                  type="date"
                  value={formData.startDate.toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  종료일
                </label>
                <input
                  type="date"
                  value={formData.endDate.toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, endDate: new Date(e.target.value) })}
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
                  {editingBanner ? '수정' : '추가'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}