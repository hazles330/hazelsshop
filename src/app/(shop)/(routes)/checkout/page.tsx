'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cartStore'
import { useOrderStore } from '@/lib/store/orderStore'
import Image from 'next/image'
import { CreditCardIcon, BanknotesIcon } from '@heroicons/react/24/outline'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart } = useCartStore()
  const { createOrder } = useOrderStore()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    addressDetail: '',
    postcode: '',
    paymentMethod: 'card'
  })

  const paymentMethods = [
    {
      id: 'card',
      name: '카드결제',
      icon: CreditCardIcon,
      description: '신용카드/체크카드로 결제'
    },
    {
      id: 'transfer',
      name: '계좌이체',
      icon: BanknotesIcon,
      description: '무통장입금'
    }
  ]

  const bankInfo = {
    bankName: '하나은행',
    accountNumber: '123-456789-01234',
    accountHolder: '헤이즐'
  }

  const defaultImage = '/images/products/default.jpg'

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">장바구니가 비어있습니다</h2>
          <p className="mt-2 text-gray-600">상품을 먼저 장바구니에 담아주세요.</p>
          <a
            href="/products"
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            쇼핑 계속하기
          </a>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const order = await createOrder(
        {
          name: formData.name,
          phone: formData.phone,
          address: `${formData.address} ${formData.addressDetail}`.trim(),
          postcode: formData.postcode
        },
        formData.paymentMethod
      )

      router.push(`/orders/${order.id}`)
    } catch (error) {
      alert('주문 처리 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-x-8 gap-y-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 배송 정보 섹션 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-6">배송 정보</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    받는 분
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    연락처
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="postcode" className="block text-sm font-medium text-gray-700">
                    우편번호
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="postcode"
                      name="postcode"
                      value={formData.postcode}
                      onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <button
                      type="button"
                      className="mt-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                      주소 찾기
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    주소
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="addressDetail" className="block text-sm font-medium text-gray-700">
                    상세주소
                  </label>
                  <input
                    type="text"
                    id="addressDetail"
                    name="addressDetail"
                    value={formData.addressDetail}
                    onChange={(e) => setFormData({ ...formData, addressDetail: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 결제 방법 섹션 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-6">결제 방법</h2>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="relative">
                    <input
                      type="radio"
                      name="paymentMethod"
                      id={method.id}
                      value={method.id}
                      checked={formData.paymentMethod === method.id}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor={method.id}
                      className="flex items-center p-4 border rounded-lg cursor-pointer
                        peer-checked:border-blue-600 peer-checked:ring-1 peer-checked:ring-blue-600
                        hover:bg-gray-50"
                    >
                      <method.icon className="h-6 w-6 text-gray-400 mr-4" />
                      <div>
                        <p className="font-medium text-gray-900">{method.name}</p>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              {/* 계좌이체 정보 */}
              {formData.paymentMethod === 'transfer' && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">입금 계좌 정보</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>은행명: {bankInfo.bankName}</p>
                    <p>계좌번호: {bankInfo.accountNumber}</p>
                    <p>예금주: {bankInfo.accountHolder}</p>
                    <p className="text-red-600 mt-4">
                      * 주문 후 24시간 이내에 입금해 주시기 바랍니다.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 주문 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md
                disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? '처리중...' : 
                `${cart.total.toLocaleString()}원 결제하기`}
            </button>
          </form>
        </div>

        {/* 주문 요약 */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-6">주문 요약</h2>
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0">
                    <Image
                      src={item.imageUrl || defaultImage}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.quantity}개
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {(item.price * item.quantity).toLocaleString()}원
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>총 결제금액</p>
                <p>{cart.total.toLocaleString()}원</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}