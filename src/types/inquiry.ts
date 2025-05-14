export type InquiryStatus = 'pending' | 'inProgress' | 'completed'

export interface Inquiry {
  id: string
  userId: string
  customerName: string
  customerEmail: string
  category: string
  title: string
  content: string
  status: InquiryStatus
  createdAt: string
  updatedAt: string
  attachments?: string[]
  response?: {
    content: string
    createdAt: string
    adminName: string
  }
}
