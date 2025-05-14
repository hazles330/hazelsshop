'use client'

import { useInquiryStore } from '@/lib/store/inquiryStore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuthStore } from '@/lib/store/authStore'

interface PageParams {
  id: string;
}

interface Props {
  params: PageParams;
}

export default function InquiryDetailPage({ params }: Props) {
  const router = useRouter()
  const { user } = useAuthStore()
  const { inquiries, updateInquiryStatus, addResponse } = useInquiryStore()
  const [response, setResponse] = useState('')

  const inquiry = inquiries.find(inq => inq.id === params.id)

  if (!inquiry) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">문의를 찾을 수 없습니다</h2>
          <button
            onClick={() => router.push('/admin/inquiries')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!response.trim()) return

    try {
      await addResponse(inquiry.id, response, user?.name || '관리자')
      alert('답변이 등록되었습니다.')
      router.push('/admin/inquiries')
    } catch (error) {
      alert('답변 등록에 실패했습니다.')
    }
  }

  const handleStatusChange = async (status: string) => {
    try {
      await updateInquiryStatus(inquiry.id, status as any)
      alert('상태가 업데이트되었습니다.')
    } catch (error) {
      alert('상태 업데이트에 실패했습니다.')
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* 문의 내용 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{inquiry.title}</h1>
              <p className="mt-1 text-sm text-gray-500">
                문의자: {inquiry.customerName} ({inquiry.customerEmail})
              </p>
            </div>
            <select
              value={inquiry.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
            >
              <option value="pending">대기중</option>
              <option value="inProgress">처리중</option>
              <option value="completed">답변완료</option>
            </select>
          </div>
          <div className="mt-4 space-y-2">
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {inquiry.content}
            </div>
            {inquiry.attachments && inquiry.attachments.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">첨부파일</h3>
                <div className="mt-2 space-y-2">
                  {inquiry.attachments.map((file, index) => (
                    <a
                      key={index}
                      href={file}
                      className="text-sm text-blue-600 hover:text-blue-800 block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      첨부파일 {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 이전 답변 */}
        {inquiry.response && (
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-sm font-medium text-gray-900">답변 내용</h2>
            <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
              {inquiry.response.content}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              답변자: {inquiry.response.adminName} ({new Date(inquiry.response.createdAt).toLocaleString()})
            </div>
          </div>
        )}

        {/* 답변 폼 */}
        <form onSubmit={handleSubmitResponse} className="p-6">
          <div className="mb-4">
            <label htmlFor="response" className="block text-sm font-medium text-gray-700">
              답변 작성
            </label>
            <textarea
              id="response"
              rows={6}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
              placeholder="답변을 작성해주세요"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin/inquiries')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              목록으로
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
            >
              답변등록
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
