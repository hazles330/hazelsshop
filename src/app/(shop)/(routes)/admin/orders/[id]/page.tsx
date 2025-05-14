'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOrderStore } from '@/lib/store/orderStore'
import { useAuthStore } from '@/lib/store/authStore'
import type { Order } from '@/types/order'

type OrderDetailProps = {
  params: {
    id: string;
  };
};

export default function OrderDetail({ params }: OrderDetailProps) {
  const orderId = params?.id
  const router = useRouter()
  const { user } = useAuthStore()
  const { orders, updateOrderStatus, deleteOrder } = useOrderStore()
  const order = orders.find(order => order.id === orderId)

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.replace('/auth/login')
    }
  }, [user, router])

  useEffect(() => {
    if (!orders.length) {
      // orders가 비어있다면 데이터를 로드하는 로직을 여기에 추가
      // 예: fetchOrders()
    }
  }, [orders])

  if (!user || user.role !== 'admin') {
    return null
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">주문을 찾을 수 없습니다</h2>
          <p className="text-gray-600">해당 주문 정보가 존재하지 않습니다.</p>
          <button
            onClick={() => router.push('/admin/orders')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  const handleStatusChange = async (newStatus: Order['status']) => {
    try {
      await updateOrderStatus(order.id, newStatus)
      alert('주문 상태가 업데이트되었습니다.')
    } catch (error) {
      alert('주문 상태 업데이트에 실패했습니다.')
      console.error('Error updating order status:', error)
    }
  }

  const handleDeleteOrder = async () => {
    if (!window.confirm('정말로 이 주문을 삭제하시겠습니까?')) {
      return
    }

    try {
      await deleteOrder(order.id)
      alert('주문이 삭제되었습니다.')
      router.push('/admin/orders')
    } catch (error) {
      alert('주문 삭제에 실패했습니다.')
      console.error('Error deleting order:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">주문 상세 정보</h1>
          <div className="flex gap-4">
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value as Order['status'])}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="pending">대기중</option>
              <option value="processing">처리중</option>
              <option value="shipped">배송중</option>
              <option value="delivered">배송완료</option>
              <option value="canceled">취소됨</option>
            </select>
            <button
              onClick={handleDeleteOrder}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              주문 삭제
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* 주문 정보 */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">주문 정보</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">주문 번호</dt>
                <dd className="mt-1 text-sm text-gray-900">{order.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">주문 상태</dt>
                <dd className="mt-1 text-sm text-gray-900">{order.status}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">총 금액</dt>
                <dd className="mt-1 text-sm text-gray-900">{order.total.toLocaleString()}원</dd>
              </div>
            </dl>
          </div>

          {/* 고객 정보 */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">고객 정보</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">이름</dt>
                <dd className="mt-1 text-sm text-gray-900">{order.customer.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">이메일</dt>
                <dd className="mt-1 text-sm text-gray-900">{order.customer.email}</dd>
              </div>
            </dl>
          </div>

          {/* 배송 정보 */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">배송 정보</h2>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">받는 사람</dt>
                <dd className="mt-1 text-sm text-gray-900">{order.shippingAddress.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">연락처</dt>
                <dd className="mt-1 text-sm text-gray-900">{order.shippingAddress.phone}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">주소</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  [{order.shippingAddress.postcode}] {order.shippingAddress.address}
                </dd>
              </div>
            </dl>
          </div>

          {/* 주문 상품 */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">주문 상품</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border-b border-gray-200 pb-4">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.price.toLocaleString()}원</p>
                    <p className="text-sm text-gray-500">수량: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {(item.price * item.quantity).toLocaleString()}원
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}