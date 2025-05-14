'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const bannerData = [
  {
    id: 1,
    title: '최고의 제품을 만나보세요',
    description: '품질 좋은 제품을 합리적인 가격으로 제공합니다.',
    bgColor: 'from-blue-600 to-blue-400',
    link: '/products'
  },
  {
    id: 2,
    title: '특별한 할인 혜택',
    description: '신규 회원을 위한 특별 할인 이벤트',
    bgColor: 'from-purple-600 to-purple-400',
    link: '/products'
  },
  {
    id: 3,
    title: '새로운 컬렉션 출시',
    description: '2025 봄/여름 신상품을 만나보세요',
    bgColor: 'from-indigo-600 to-indigo-400',
    link: '/products'
  }
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerData.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      {bannerData.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 
            bg-gradient-to-r ${banner.bgColor}
            ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="text-white max-w-lg">
              <h1 className="text-4xl font-bold mb-4">{banner.title}</h1>
              <p className="text-lg mb-8">{banner.description}</p>              <Link
                href={banner.link}
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                쇼핑하기
              </Link>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {bannerData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentSlide === index ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}