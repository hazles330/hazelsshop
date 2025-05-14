import HeroBanner from "@/components/ui/HeroBanner";
import ProductSection from "@/components/product/ProductSection";
import Link from "next/link";

// 임시 베스트 상품 데이터
const bestProducts = [
  {
    id: '1',
    name: '프리미엄 헤드폰',
    price: 299000,
    description: '최고급 무선 헤드폰',
    imageUrl: '/images/products/headphone.jpg'
  },
  {
    id: '2',
    name: '스마트워치',
    price: 399000,
    description: '최신형 스마트워치',
    imageUrl: '/images/products/smartwatch.jpg'
  },
  {
    id: '3',
    name: '태블릿',
    price: 899000,
    description: '고성능 태블릿',
    imageUrl: '/images/products/tablet.jpg'
  },
  {
    id: '4',
    name: '블루투스 스피커',
    price: 159000,
    description: '프리미엄 블루투스 스피커',
    imageUrl: '/images/products/speaker.jpg'
  }
];

// 임시 새상품 데이터
const newProducts = [
  {
    id: '5',
    name: '무선 이어버드',
    price: 219000,
    description: '신제품 무선 이어버드',
    imageUrl: '/images/products/earbuds.jpg'
  },
  {
    id: '6',
    name: '게이밍 마우스',
    price: 129000,
    description: '고성능 게이밍 마우스',
    imageUrl: '/images/products/mouse.jpg'
  },
  {
    id: '7',
    name: '기계식 키보드',
    price: 189000,
    description: 'RGB 기계식 키보드',
    imageUrl: '/images/products/keyboard.jpg'
  },
  {
    id: '8',
    name: '웹캠',
    price: 99000,
    description: '고화질 웹캠',
    imageUrl: '/images/products/webcam.jpg'
  }
];

export default function Home() {
  return (
    <div className="space-y-12">
      <HeroBanner />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 베스트 제품 섹션 */}
        <ProductSection
          title="베스트 제품"
          products={bestProducts}
        />
        
        {/* 새상품 섹션 */}
        <ProductSection
          title="새로 나온 제품"
          products={newProducts}
        />

        {/* 혜택 섹션 */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">품질 보증</h3>
                <p className="mt-2 text-sm text-gray-500">
                  엄선된 제품만을 제공합니다
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">빠른 배송</h3>
                <p className="mt-2 text-sm text-gray-500">
                  당일 출고, 신속한 배송
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">안전한 쇼핑</h3>
                <p className="mt-2 text-sm text-gray-500">
                  안전한 결제와 보안
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
