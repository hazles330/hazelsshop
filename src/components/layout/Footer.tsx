export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 회사 정보 */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900">HAZEL's</h3>
            <p className="mt-4 text-sm text-gray-600">
              최고의 제품을 최상의 서비스로 제공하는 HAZEL's입니다.<br />
              고객님의 편안한 쇼핑을 위해 항상 노력하겠습니다.
            </p>
            <div className="mt-4">
              <p className="text-sm text-gray-600">고객센터: 1234-5678</p>
              <p className="text-sm text-gray-600">운영시간: 평일 09:00 - 18:00</p>
              <p className="text-sm text-gray-600">이메일: support@hazels.com</p>
            </div>
          </div>

          {/* 쇼핑 안내 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">쇼핑 안내</h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="/guide/shipping" className="text-sm text-gray-600 hover:text-gray-900">
                  배송안내
                </a>
              </li>
              <li>
                <a href="/guide/returns" className="text-sm text-gray-600 hover:text-gray-900">
                  교환/반품 안내
                </a>
              </li>
              <li>
                <a href="/guide/order" className="text-sm text-gray-600 hover:text-gray-900">
                  주문/결제 안내
                </a>
              </li>
              <li>
                <a href="/faq" className="text-sm text-gray-600 hover:text-gray-900">
                  자주 묻는 질문
                </a>
              </li>
            </ul>
          </div>

          {/* 고객 지원 */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">고객 지원</h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="/support/notice" className="text-sm text-gray-600 hover:text-gray-900">
                  공지사항
                </a>
              </li>
              <li>
                <a href="/support/inquiry" className="text-sm text-gray-600 hover:text-gray-900">
                  1:1 문의
                </a>
              </li>
              <li>
                <a href="/support/terms" className="text-sm text-gray-600 hover:text-gray-900">
                  이용약관
                </a>
              </li>
              <li>
                <a href="/support/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                  개인정보처리방침
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 저작권 */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            © 2024 HAZEL's. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
