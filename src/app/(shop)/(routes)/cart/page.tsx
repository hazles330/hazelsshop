'use client'

import { useCartStore } from '@/lib/store/cartStore'
import Image from 'next/image';

export default function CartPage() {
  const { cart, removeItem, updateQuantity } = useCartStore()

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">장바구니</h1>
      
      {cart.items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">장바구니가 비어있습니다.</p>
          <a
            href="/products"
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            쇼핑 계속하기
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {cart.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow">
              <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md overflow-hidden">                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium">{item.name}</h3>
                <p className="text-gray-500">{item.price.toLocaleString()}원</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="px-2 py-1 border rounded-md"
                  >
                    -
                  </button>
                  <span className="mx-2">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="px-2 py-1 border rounded-md"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-600 hover:text-red-700"
              >
                삭제
              </button>
            </div>
          ))}
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">총 금액</span>
              <span className="text-xl font-bold">{cart.total.toLocaleString()}원</span>
            </div>
            <button
              onClick={() => {
                alert('주문 기능은 준비 중입니다.')
              }}
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              주문하기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}