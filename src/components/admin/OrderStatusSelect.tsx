'use client'

import { type Order } from '@/types/order'

interface OrderStatusSelectProps {
  orderId: string
  currentStatus: Order['status']
  onStatusChange: (orderId: string, newStatus: Order['status']) => Promise<void>
}

export default function OrderStatusSelect({ orderId, currentStatus, onStatusChange }: OrderStatusSelectProps) {
  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      await onStatusChange(orderId, e.target.value as Order['status'])
      alert('주문 상태가 업데이트되었습니다.')
    } catch (error) {
      alert('주문 상태 업데이트에 실패했습니다.')
    }
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
    >
      <option value="pending">주문 접수</option>
      <option value="paid">결제 완료</option>
      <option value="shipping">배송 중</option>
      <option value="delivered">배송 완료</option>
      <option value="cancelled">주문 취소</option>
    </select>
  )
}
