'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const categories = [
  { name: 'TV/홈시어터', slug: 'tv', description: '고화질 TV와 홈시어터' },
  { name: 'PC/노트북', slug: 'pc', description: '데스크탑 PC와 주변기기' },
  { name: '모바일/태블릿', slug: 'mobile', description: '최신 모바일 기기' },
  { name: '시즌상품', slug: 'seasonal', description: '계절별 특가 상품' },
  { name: '주방가전', slug: 'kitchen', description: '주방 필수 가전' },
  { name: '생활가전', slug: 'home', description: '생활 필수 가전' },
]

export default function CategoryDropdown() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
      >
        <span className="text-sm font-medium">카테고리</span>
        <ChevronDownIcon 
          className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-64 mt-1 py-2 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${category.slug}`}
              className="flex flex-col px-4 py-2 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-sm font-medium text-gray-900">
                {category.name}
              </span>
              <span className="text-xs text-gray-500 mt-0.5">
                {category.description}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
