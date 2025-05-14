import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Inquiry, InquiryStatus } from '@/types/inquiry'

// 임시 데이터
const mockInquiries: Inquiry[] = [
  {
    id: 'INQ001',
    userId: '1',
    customerName: '홍길동',
    customerEmail: 'hong@example.com',
    category: 'order',
    title: '주문 취소 문의',
    content: '주문한 상품을 취소하고 싶습니다.',
    status: 'pending',
    createdAt: '2024-03-15T09:00:00Z',
    updatedAt: '2024-03-15T09:00:00Z'
  },
  {
    id: 'INQ002',
    userId: '2',
    customerName: '김철수',
    customerEmail: 'kim@example.com',
    category: 'delivery',
    title: '배송 지연 문의',
    content: '주문한 상품의 배송이 지연되고 있습니다.',
    status: 'inProgress',
    createdAt: '2024-03-14T15:30:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
    response: {
      content: '배송사에 문의 중입니다. 조금만 더 기다려주세요.',
      createdAt: '2024-03-15T10:00:00Z',
      adminName: '관리자'
    }
  }
]

interface InquiryStore {
  inquiries: Inquiry[]
  updateInquiryStatus: (inquiryId: string, status: InquiryStatus) => Promise<void>
  addResponse: (inquiryId: string, response: string, adminName: string) => Promise<void>
}

export const useInquiryStore = create<InquiryStore>()(
  persist(
    (set) => ({
      inquiries: mockInquiries,
      
      updateInquiryStatus: async (inquiryId, status) => {
        return new Promise((resolve, reject) => {
          try {
            set((state) => ({
              inquiries: state.inquiries.map((inquiry) =>
                inquiry.id === inquiryId
                  ? { ...inquiry, status, updatedAt: new Date().toISOString() }
                  : inquiry
              ),
            }))
            resolve()
          } catch (error) {
            reject(error)
          }
        })
      },

      addResponse: async (inquiryId, content, adminName) => {
        return new Promise((resolve, reject) => {
          try {
            set((state) => ({
              inquiries: state.inquiries.map((inquiry) =>
                inquiry.id === inquiryId
                  ? {
                      ...inquiry,
                      status: 'completed' as InquiryStatus,
                      response: {
                        content,
                        createdAt: new Date().toISOString(),
                        adminName
                      },
                      updatedAt: new Date().toISOString()
                    }
                  : inquiry
              ),
            }))
            resolve()
          } catch (error) {
            reject(error)
          }
        })
      }
    }),
    {
      name: 'inquiry-storage',
    }
  )
)
