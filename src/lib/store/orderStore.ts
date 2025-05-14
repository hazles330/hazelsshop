import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Order } from '@/types/order'
import { useCartStore } from './cartStore'

// 임시 주문 데이터
const mockOrders: Order[] = [
  {
    id: 'ORD001',
    userId: '1',
    customer: {
      name: '홍길동',
      email: 'hong@example.com'
    },
    items: [
      {
        id: '1',
        productId: '1',
        name: '스마트 TV',
        price: 899000,
        quantity: 1,
        imageUrl: '/images/products/tv.jpg'
      }
    ],
    total: 899000,
    status: 'pending' as const,
    shippingAddress: {
      name: '홍길동',
      phone: '010-1234-5678',
      address: '서울시 강남구 역삼동 123-456',
      postcode: '06123'
    },
    paymentMethod: '신용카드',
    createdAt: '2024-05-08T10:00:00.000Z',
    updatedAt: '2024-05-08T10:00:00.000Z'
  },
  {
    id: 'ORD002',
    userId: '2',
    customer: {
      name: '김철수',
      email: 'kim@example.com'
    },
    items: [
      {
        id: '2',
        productId: '2',
        name: '노트북',
        price: 1299000,
        quantity: 1,
        imageUrl: '/images/products/laptop.jpg'
      }
    ],
    total: 1299000,
    status: 'paid' as const,
    shippingAddress: {
      name: '김철수',
      phone: '010-9876-5432',
      address: '서울시 서초구 서초동 789-012',
      postcode: '06789'
    },
    paymentMethod: '계좌이체',
    createdAt: '2024-05-08T11:00:00.000Z',
    updatedAt: '2024-05-08T11:00:00.000Z'
  }
]

interface OrderStore {
  orders: Order[]
  currentOrder: Order | null
  createOrder: (shippingAddress: Order['shippingAddress'], paymentMethod: string) => Promise<Order>
  getOrders: () => Order[]
  updateOrderStatus: (orderId: string, status: Order['status']) => void
  deleteOrder: (orderId: string) => Promise<void>
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: mockOrders,
      currentOrder: null,

      createOrder: async (shippingAddress, paymentMethod) => {
        const cartStore = useCartStore.getState()
        const { cart } = cartStore

        const newOrder: Order = {
          id: Math.random().toString(36).substr(2, 9),
          userId: '1', // TODO: 실제 사용자 ID로 대체
          customer: {
            name: shippingAddress.name,
            email: 'user@example.com', // TODO: 실제 사용자 이메일로 대체
          },
          items: cart.items.map(item => ({
            id: Math.random().toString(36).substr(2, 9),
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
          })),
          total: cart.total,
          status: 'pending',
          shippingAddress,
          paymentMethod,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set(state => ({
          orders: [...state.orders, newOrder],
          currentOrder: newOrder,
        }))

        // 주문 완료 후 장바구니 비우기
        cartStore.clearCart()

        return newOrder
      },

      getOrders: () => {
        return get().orders
      },

      updateOrderStatus: (orderId, status) => {
        set(state => ({
          orders: state.orders.map(order =>
            order.id === orderId
              ? {
                  ...order,
                  status,
                  updatedAt: new Date().toISOString(),
                }
              : order
          ),
        }))
      },

      deleteOrder: async (orderId) => {
        return new Promise((resolve, reject) => {
          try {
            set((state) => ({
              orders: state.orders.filter((order) => order.id !== orderId),
            }))
            resolve()
          } catch (error) {
            reject(error)
          }
        })
      },
    }),
    {
      name: 'order-storage',
    }
  )
)