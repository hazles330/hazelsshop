'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div className="w-full relative">
      <form onSubmit={handleSearch}>
        <div 
          className={`relative flex items-center overflow-hidden transition-all duration-200 ${
            isFocused 
              ? 'bg-white shadow-md rounded-full border border-transparent' 
              : 'bg-gray-50 rounded-full border border-gray-200'
          }`}
        >
          <div className="absolute left-4 flex items-center pointer-events-none">
            <svg 
              className={`h-5 w-5 transition-colors ${
                isFocused ? 'text-blue-500' : 'text-gray-400'
              }`}
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="찾으시는 상품을 검색해보세요"
            className="w-full pl-12 pr-20 py-3 bg-transparent text-sm focus:outline-none transition-colors"
          />
          <button
            type="submit"
            className={`absolute right-2 flex items-center px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              query.trim()
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            검색
          </button>
        </div>
      </form>
      {isFocused && query.trim() === '' && (
        <div className="absolute inset-x-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-100 p-3 z-10">
          <div className="text-xs text-gray-500 mb-2">추천 검색어</div>
          <div className="flex flex-wrap gap-2">
            {['여름이불', '쿠션', '선풍기', '조명', '주방용품'].map((keyword) => (
              <button
                key={keyword}
                onClick={() => {
                  setQuery(keyword)
                  router.push(`/products?search=${encodeURIComponent(keyword)}`)
                }}
                className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-sm text-gray-700 transition-colors"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}