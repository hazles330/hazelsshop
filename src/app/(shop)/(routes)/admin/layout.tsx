'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChartBarIcon,
  TagIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  QuestionMarkCircleIcon,
  CurrencyDollarIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: '대시보드', href: '/admin', icon: ChartBarIcon },
  { name: '상품 관리', href: '/admin/products', icon: TagIcon },
  { name: '주문 관리', href: '/admin/orders', icon: ShoppingBagIcon },
  { name: '회원 관리', href: '/admin/users', icon: UserGroupIcon },
  { name: '문의 관리', href: '/admin/inquiries', icon: QuestionMarkCircleIcon },
  { name: '포인트 관리', href: '/admin/points', icon: CurrencyDollarIcon },
  { name: '배너 관리', href: '/admin/banners', icon: PhotoIcon },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen">
      {/* 사이드바 */}
      <div className="w-64 bg-gray-900 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">관리자 페이지</h1>
        </div>
        <nav className="mt-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm hover:bg-gray-800 transition-colors ${
                  isActive ? 'bg-gray-800 text-blue-400' : 'text-gray-300'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" aria-hidden="true" />
                {item.name}
                {item.name === '문의 관리' && pathname.includes('/admin/inquiries') && (
                  <span className="ml-auto px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                    New
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 bg-gray-100">
        {/* 상단 헤더 */}
        <header className="bg-white shadow">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-xl font-semibold text-gray-900">
              {navigation.find(item => pathname.startsWith(item.href))?.name || '대시보드'}
            </h1>
          </div>
        </header>

        {/* 페이지 컨텐츠 */}
        <main className="p-6">
          <div className="bg-white rounded-lg shadow">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}