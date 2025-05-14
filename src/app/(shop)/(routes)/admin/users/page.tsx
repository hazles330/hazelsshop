'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import Link from 'next/link'

interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  createdAt: string
  lastLogin?: string
  status: 'active' | 'inactive' | 'banned'
}

export default function AdminUsers() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [message, setMessage] = useState({ type: '', content: '' })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // API 호출 
        const response = await fetch('/api/admin/users')
        if (!response.ok) throw new Error('Failed to fetch users')
        
        const data = await response.json()
        setUsers(data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching users:', error)
        setMessage({ type: 'error', content: '사용자 데이터를 불러오는데 실패했습니다.' })
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === '' || user.role === roleFilter
    const matchesStatus = statusFilter === '' || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

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

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      })

      if (!response.ok) throw new Error('Failed to update user role')

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ))
      setMessage({ type: 'success', content: '사용자 권한이 업데이트되었습니다.' })
    } catch (error) {
      console.error('Error updating user role:', error)
      setMessage({ type: 'error', content: '사용자 권한 변경에 실패했습니다.' })
    }
  }

  const handleStatusChange = async (userId: string, newStatus: User['status']) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) throw new Error('Failed to update user status')

      setUsers(users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ))
      setMessage({ type: 'success', content: '사용자 상태가 업데이트되었습니다.' })
    } catch (error) {
      console.error('Error updating user status:', error)
      setMessage({ type: 'error', content: '사용자 상태 변경에 실패했습니다.' })
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-8">회원 관리</h1>

      {message.content && (
        <div className={`mb-4 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.content}
        </div>
      )}

      {/* 필터 섹션 */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              검색
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="이름 또는 이메일"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              권한
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">전체</option>
              <option value="admin">관리자</option>
              <option value="user">일반 회원</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상태
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">전체</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
              <option value="banned">정지</option>
            </select>
          </div>
        </div>
      </div>

      {/* 사용자 목록 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                회원 정보
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                가입일 / 최근 로그인
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                권한
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                관리
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  {user.lastLogin && (
                    <div className="text-sm text-gray-500">
                      최근 로그인: {new Date(user.lastLogin).toLocaleString()}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as 'user' | 'admin')}
                    className="text-sm rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="user">일반 회원</option>
                    <option value="admin">관리자</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.status}
                    onChange={(e) => handleStatusChange(user.id, e.target.value as User['status'])}
                    className={`text-sm rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                      user.status === 'active' ? 'text-green-600' :
                      user.status === 'inactive' ? 'text-gray-600' :
                      'text-red-600'
                    }`}
                  >
                    <option value="active">활성</option>
                    <option value="inactive">비활성</option>
                    <option value="banned">정지</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">                  <Link
                    href={`/admin/users/${user.id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    상세보기
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}