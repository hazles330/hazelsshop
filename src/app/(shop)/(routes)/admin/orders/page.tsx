'use client'

import { useEffect, useState } from 'react'
import { useOrderStore } from '@/lib/store/orderStore'
import { useAuthStore } from '@/lib/store/authStore'
import { useRouter } from 'next/navigation'
import type { Order } from '@/types/order'

const ORDER_STATUS_MAP = {
  pending: { label: '주문 접수', color: 'yellow' },
  paid: { label: '결제 완료', color: 'blue' },
  shipping: { label: '배송 중', color: 'indigo' },
  delivered: { label: '배송 완료', color: 'green' },
  cancelled: { label: '주문 취소', color: 'red' },
}

export default function AdminOrders() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { orders, updateOrderStatus } = useOrderStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<Order['status'] | ''>('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', content: '' })

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.replace('/auth/login')
      return
    }
  }, [user, router])

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    setIsLoading(true)
    setMessage({ type: '', content: '' })

    try {
      await updateOrderStatus(orderId, newStatus)
      setMessage({
        type: 'success',
        content: '주문 상태가 업데이트되었습니다.'
      })
    } catch (error) {
      setMessage({
        type: 'error',
        content: '주문 상태 업데이트에 실패했습니다.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">주문 관리</h1>

      {message.content && (
        <div className={`mb-4 p-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.content}
        </div>
      )}

      {/* 검색 및 필터 */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            주문 검색
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="주문번호 또는 고객명으로 검색"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            주문 상태
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Order['status'] | '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">전체</option>
            {Object.entries(ORDER_STATUS_MAP).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 주문 목록 */}
      <div className="bg-white shadow overflow-hidden rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                주문 정보
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                배송 정보
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                결제 금액
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                주문 상태
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {order.id}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {order.shippingAddress.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {order.shippingAddress.address}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {order.total.toLocaleString()}원
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                    disabled={isLoading}
                    className={`text-sm rounded-md border-gray-300 
                      focus:border-${ORDER_STATUS_MAP[order.status].color}-500 
                      focus:ring-${ORDER_STATUS_MAP[order.status].color}-500`}
                  >
                    {Object.entries(ORDER_STATUS_MAP).map(([value, { label }]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    상세보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}