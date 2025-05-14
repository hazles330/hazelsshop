'use client'

import { useWishlistStore } from '@/lib/store/wishlistStore'
import { useCartStore } from '@/lib/store/cartStore'
import Image from 'next/image'
import Link from 'next/link'

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlistStore()
  const { addItem } = useCartStore()

  const addToCart = (item: any) => {
    addItem({
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: 1,
      imageUrl: item.imageUrl,
    })
    alert('장바구니에 추가되었습니다.')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">위시리스트</h1>

      {wishlist.items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">위시리스트가 비어있습니다.</p>            <Link
            href="/products"
            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            쇼핑하기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {wishlist.items.map((item) => (
            <div key={item.id} className="group relative">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover object-center group-hover:opacity-75"
                  />
                ) : (
                  <div className="h-48 bg-gray-100" />
                )}
                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100"
                >
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">                    <Link href={`/products/${item.productId}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {item.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">{item.price.toLocaleString()}원</p>
              </div>
              <button
                onClick={() => addToCart(item)}
                className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                장바구니에 담기
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}