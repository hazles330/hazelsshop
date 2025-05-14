'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'

interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  createdAt: string
  lastLogin?: string
  status: 'active' | 'inactive' | 'banned'
}

export default function UserDetail() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', content: '' })
  const { user: currentUser } = useAuthStore()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    // 관리자가 아닌 경우 접근 제한
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/auth/login')
      return
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/admin/users/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch user')
        
        const data = await response.json()
        setUser(data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching user:', error)
        setMessage({ type: 'error', content: '사용자 정보를 불러오는데 실패했습니다.' })
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [params.id, currentUser, router])

  const handleRoleChange = async (newRole: 'user' | 'admin') => {
    try {
      const response = await fetch(`/api/admin/users/${user?.id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      })

      if (!response.ok) throw new Error('Failed to update user role')

      setUser(prev => prev ? { ...prev, role: newRole } : null)
      setMessage({ type: 'success', content: '사용자 권한이 업데이트되었습니다.' })
    } catch (error) {
      console.error('Error updating user role:', error)
      setMessage({ type: 'error', content: '사용자 권한 변경에 실패했습니다.' })
    }
  }

  const handleStatusChange = async (newStatus: User['status']) => {
    try {
      const response = await fetch(`/api/admin/users/${user?.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) throw new Error('Failed to update user status')

      setUser(prev => prev ? { ...prev, status: newStatus } : null)
      setMessage({ type: 'success', content: '사용자 상태가 업데이트되었습니다.' })
    } catch (error) {
      console.error('Error updating user status:', error)
      setMessage({ type: 'error', content: '사용자 상태 변경에 실패했습니다.' })
    }
  }

  const handlePasswordChange = async () => {
    if (newPassword.length < 8) {
      setMessage({ type: 'error', content: '비밀번호는 최소 8자 이상이어야 합니다.' })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', content: '비밀번호가 일치하지 않습니다.' })
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${user?.id}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      })

      if (!response.ok) throw new Error('Failed to update password')

      setMessage({ type: 'success', content: '비밀번호가 변경되었습니다.' })
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('Error updating password:', error)
      setMessage({ type: 'error', content: '비밀번호 변경에 실패했습니다.' })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">사용자를 찾을 수 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-900"
        >
          ← 돌아가기
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            회원 상세 정보
          </h3>
        </div>

        {message.content && (
          <div className={`px-4 py-3 ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.content}
          </div>
        )}

        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">이름</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.name}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">이메일</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.email}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">가입일</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(user.createdAt).toLocaleDateString()}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">최근 로그인</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '기록 없음'}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">권한</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(e.target.value as 'user' | 'admin')}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="user">일반 회원</option>
                  <option value="admin">관리자</option>
                </select>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">상태</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <select
                  value={user.status}
                  onChange={(e) => handleStatusChange(e.target.value as User['status'])}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="active">활성</option>
                  <option value="inactive">비활성</option>
                  <option value="banned">정지</option>
                </select>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            비밀번호 변경
          </h3>
        </div>

        {message.content && (
          <div className={`px-4 py-3 ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.content}
          </div>
        )}

        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                새 비밀번호
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="최소 8자 이상"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                비밀번호 확인
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="비밀번호 재입력"
              />
            </div>
            <div>
              <button
                onClick={handlePasswordChange}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                비밀번호 변경
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}