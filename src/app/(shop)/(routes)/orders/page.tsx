'use client'

import { useOrderStore } from '@/lib/store/orderStore'

export default function OrdersPage() {
  const { orders } = useOrderStore()

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': '주문 접수',
      'paid': '결제 완료',
      'shipping': '배송 중',
      'delivered': '배송 완료',
      'cancelled': '주문 취소'
    }
    return statusMap[status] || status
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-8">주문 내역</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">주문 내역이 없습니다.</p>
          <a
            href="/products"
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            쇼핑하기
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-medium">주문번호: {order.id}</h2>
                  <p className="text-sm text-gray-500">
                    주문일자: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {getStatusText(order.status)}
                </span>
              </div>

              <div className="border-t border-b py-4 my-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center py-2">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.quantity}개</p>
                    </div>
                    <div className="text-sm font-medium">
                      {(item.price * item.quantity).toLocaleString()}원
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">배송 정보</p>
                  <p className="text-sm">
                    {order.shippingAddress.name} / {order.shippingAddress.phone}
                  </p>
                  <p className="text-sm">
                    {order.shippingAddress.address} ({order.shippingAddress.postcode})
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">총 결제금액</p>
                  <p className="text-lg font-bold">{order.total.toLocaleString()}원</p>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-4">
                <a
                  href={`/orders/${order.id}`}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  상세보기
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}