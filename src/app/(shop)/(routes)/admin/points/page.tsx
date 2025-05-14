'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'

interface Point {
  id: string
  userId: string
  username: string
  amount: number
  reason: string
  createdAt: string
  balance: number
}

interface ExchangeRequest {
  id: string
  userId: string
  username: string
  amount: number
  bankName: string
  accountNumber: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export default function PointsPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [message, setMessage] = useState({ type: '', content: '' })
  const [points, setPoints] = useState<Point[]>([])
  const [selectedPoints, setSelectedPoints] = useState<string[]>([])
  const [exchangeRequests, setExchangeRequests] = useState<ExchangeRequest[]>([])
  const [selectedExchanges, setSelectedExchanges] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'history' | 'exchange'>('history')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/auth/login')
    }
    // TODO: 환전 요청 데이터 불러오기
    setExchangeRequests([
      {
        id: 'ex1',
        userId: 'user1',
        username: '홍길동',
        amount: 50000,
        bankName: '신한은행',
        accountNumber: '110-123-456789',
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    ])
  }, [user, router])

  if (!user || user.role !== 'admin') {
    return null
  }

  const handleDelete = async () => {
    if (selectedPoints.length === 0) {
      setMessage({ type: 'error', content: '삭제할 포인트 내역을 선택해주세요.' })
      return
    }

    if (!confirm('선택한 포인트 내역을 삭제하시겠습니까?')) {
      return
    }

    try {
      // TODO: API 호출로 변경 필요
      setPoints(points.filter(point => !selectedPoints.includes(point.id)))
      setSelectedPoints([])
      setMessage({ type: 'success', content: '선택한 포인트 내역이 삭제되었습니다.' })
    } catch (error) {
      setMessage({ type: 'error', content: '포인트 내역 삭제에 실패했습니다.' })
    }
  }

  const togglePointSelect = (pointId: string) => {
    setSelectedPoints(prev => 
      prev.includes(pointId)
        ? prev.filter(id => id !== pointId)
        : [...prev, pointId]
    )
  }

  const handleDeleteExchanges = async () => {
    if (selectedExchanges.length === 0) {
      setMessage({ type: 'error', content: '삭제할 환전 요청을 선택해주세요.' })
      return
    }

    if (!confirm('선택한 환전 요청을 삭제하시겠습니까?')) {
      return
    }

    try {
      // TODO: API 호출로 변경 필요
      setExchangeRequests(prev => prev.filter(req => !selectedExchanges.includes(req.id)))
      setSelectedExchanges([])
      setMessage({ type: 'success', content: '선택한 환전 요청이 삭제되었습니다.' })
    } catch (error) {
      setMessage({ type: 'error', content: '환전 요청 삭제에 실패했습니다.' })
    }
  }

  const toggleExchangeSelect = (exchangeId: string) => {
    setSelectedExchanges(prev =>
      prev.includes(exchangeId)
        ? prev.filter(id => id !== exchangeId)
        : [...prev, exchangeId]
    )
  }

  const handleExchangeAction = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      // TODO: API 호출로 변경 필요
      setExchangeRequests(prev => prev.map(req => 
        req.id === requestId
          ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' }
          : req
      ))
      setMessage({ 
        type: 'success', 
        content: `환전 요청이 ${action === 'approve' ? '승인' : '거절'}되었습니다.` 
      })
    } catch (error) {
      setMessage({ 
        type: 'error', 
        content: `환전 요청 ${action === 'approve' ? '승인' : '거절'}에 실패했습니다.` 
      })
    }
  }

  return (
    <div className="p-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">포인트 관리</h1>
          <p className="mt-2 text-sm text-gray-700">
            회원들의 포인트 적립, 사용 내역 및 환전 요청을 관리할 수 있습니다.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-4">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            포인트 지급
          </button>
          {activeTab === 'history' ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={selectedPoints.length === 0}
              className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                selectedPoints.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              선택 삭제 ({selectedPoints.length}개)
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDeleteExchanges}
              disabled={selectedExchanges.length === 0}
              className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                selectedExchanges.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              선택 삭제 ({selectedExchanges.length}개)
            </button>
          )}
        </div>
      </div>

      {message.content && (
        <div className={`mt-4 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.content}
        </div>
      )}

      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('history')}
            className={`${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            포인트 내역
          </button>
          <button
            onClick={() => setActiveTab('exchange')}
            className={`${
              activeTab === 'exchange'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm relative`}
          >
            환전 요청
            {exchangeRequests.some(req => req.status === 'pending') && (
              <span className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
                {exchangeRequests.filter(req => req.status === 'pending').length}
              </span>
            )}
          </button>
        </nav>
      </div>

      <div className="mt-8 flex flex-col">
        {activeTab === 'history' ? (
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="relative py-3.5 pl-4 pr-3 sm:pl-6 lg:pl-8">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedPoints.length === points.length && points.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPoints(points.map(p => p.id))
                            } else {
                              setSelectedPoints([])
                            }
                          }}
                        />
                      </th>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">
                        회원명
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        포인트 내역
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        변동 포인트
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        잔여 포인트
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        날짜
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {points.map((point) => (
                      <tr key={point.id}>
                        <td className="relative py-4 pl-4 pr-3 sm:pl-6 lg:pl-8">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={selectedPoints.includes(point.id)}
                            onChange={() => togglePointSelect(point.id)}
                          />
                        </td>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                          {point.username}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {point.reason}
                        </td>
                        <td className={`whitespace-nowrap px-3 py-4 text-sm ${
                          point.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {point.amount > 0 ? '+' : ''}{point.amount.toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {point.balance.toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(point.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="relative py-3.5 pl-4 pr-3 sm:pl-6 lg:pl-8">
                        <input
                          type="checkbox"
                          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedExchanges.length === exchangeRequests.length && exchangeRequests.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedExchanges(exchangeRequests.map(er => er.id))
                            } else {
                              setSelectedExchanges([])
                            }
                          }}
                        />
                      </th>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">
                        회원명
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        환전 금액
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        은행명
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        계좌번호
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        요청일
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        상태
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                        <span className="sr-only">작업</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {exchangeRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="relative py-4 pl-4 pr-3 sm:pl-6 lg:pl-8">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            checked={selectedExchanges.includes(request.id)}
                            onChange={() => toggleExchangeSelect(request.id)}
                          />
                        </td>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                          {request.username}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {request.amount.toLocaleString()}원
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {request.bankName}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            request.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : request.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {request.status === 'pending' ? '대기중' : 
                             request.status === 'approved' ? '승인됨' : '거절됨'}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                          {request.status === 'pending' && (
                            <div className="flex space-x-2 justify-end">
                              <button
                                onClick={() => handleExchangeAction(request.id, 'approve')}
                                className="text-green-600 hover:text-green-900"
                              >
                                승인
                              </button>
                              <button
                                onClick={() => handleExchangeAction(request.id, 'reject')}
                                className="text-red-600 hover:text-red-900"
                              >
                                거절
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}