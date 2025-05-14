import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import SearchBar from "@/components/ui/SearchBar";
import { Toaster } from "react-hot-toast";
import { UserPlusIcon, UserIcon, ShoppingCartIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import CategoryDropdown from "@/components/ui/CategoryDropdown";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "HAZEL's",
  description: "최고의 제품을 최상의 서비스로 제공합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} ${playfair.variable} antialiased min-h-screen flex flex-col`}>
        <Toaster position="bottom-right" />
        <header className="bg-white">
          {/* 로고와 네비게이션 섹션 */}
          {/* 상단 헤더 */}
          <div className="border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col md:flex-row items-center gap-4">
                {/* 로고 */}
                <a href="/" className="inline-flex items-center group relative">
                  <span 
                    className="text-5xl font-bold tracking-tight"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    <span className="text-blue-900">HAZEL</span>
                    <span className="text-blue-700">'s</span>
                  </span>
                  <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 transition-all duration-300 absolute bottom-0 left-0"></div>
                </a>

                {/* 검색창과 네비게이션 아이콘들 */}
                <div className="flex items-center justify-end flex-1 gap-4">
                  <div className="flex-1 flex justify-center max-w-2xl">
                    <div className="w-full max-w-md">
                      <SearchBar />
                    </div>
                  </div>
                  <nav className="flex items-center gap-3">
                    <Link 
                      href="/auth/register" 
                      className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <UserPlusIcon className="w-6 h-6 mb-1" />
                      <span className="text-xs font-medium">회원가입</span>
                    </Link>
                    <Link 
                      href="/auth/login" 
                      className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <UserIcon className="w-6 h-6 mb-1" />
                      <span className="text-xs font-medium">로그인</span>
                    </Link>
                    <Link 
                      href="/orders" 
                      className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <UserCircleIcon className="w-6 h-6 mb-1" />
                      <span className="text-xs font-medium">마이페이지</span>
                    </Link>
                    <Link 
                      href="/cart" 
                      className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors relative group"
                    >
                      <div className="relative">
                        <ShoppingCartIcon className="w-6 h-6 mb-1" />
                        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transition-all scale-0 group-hover:scale-100">
                          0
                        </span>
                      </div>
                      <span className="text-xs font-medium">장바구니</span>
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          </div>
          
          {/* 카테고리 네비게이션 */}
          <nav className="bg-gray-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8 overflow-x-auto py-4 scrollbar-hide">
                  <Link href="/categories/tv" className="whitespace-nowrap text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                    TV/홈시어터
                  </Link>
                  <Link href="/categories/appliances" className="whitespace-nowrap text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                    생활가전
                  </Link>
                  <Link href="/categories/kitchen" className="whitespace-nowrap text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                    주방가전
                  </Link>
                  <Link href="/categories/seasonal" className="whitespace-nowrap text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                    계절가전
                  </Link>
                  <Link href="/categories/pc" className="whitespace-nowrap text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                    PC/노트북
                  </Link>
                  <Link href="/categories/mobile" className="whitespace-nowrap text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                    모바일/태블릿
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
