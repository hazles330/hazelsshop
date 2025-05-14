'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface ProductCardProps {
  id: string
  name: string
  description: string
  price: number
  image: string
}

export default function ProductCard({ id, name, description, price, image }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const defaultImage = '/images/default-product.jpg'

  return (
    <Link
      href={`/products/${id}`}
      className="group block rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white"
    >
      <div className="relative aspect-w-1 aspect-h-1 bg-gray-100">
        <div className="w-full h-full">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          <Image
            src={imageError ? defaultImage : (image || defaultImage)}
            alt={name}
            fill
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`
              object-cover
              group-hover:opacity-90
              transition-all
              duration-300
              ${imageLoading ? 'opacity-0' : 'opacity-100'}
            `}
            onError={() => {
              setImageError(true)
              setImageLoading(false)
            }}
            onLoad={() => setImageLoading(false)}
          />
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 truncate">
          {name}
        </h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2 h-10">
          {description}
        </p>
        <p className="mt-2 text-lg font-bold text-blue-600">
          {price.toLocaleString()}원
        </p>
      </div>
    </Link>
  )
}