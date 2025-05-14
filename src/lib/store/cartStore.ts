import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Cart, CartItem } from '@/types/cart'

interface CartStore {
  cart: Cart
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: { items: [], total: 0 },
      
      addItem: (item) => set((state) => {
        const existingItem = state.cart.items.find(
          (i) => i.productId === item.productId
        )

        if (existingItem) {
          const updatedItems = state.cart.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          )
          return {
            cart: {
              items: updatedItems,
              total: calculateTotal(updatedItems),
            },
          }
        }

        const newItem = {
          ...item,
          id: Math.random().toString(36).substr(2, 9),
        }
        const updatedItems = [...state.cart.items, newItem]
        
        return {
          cart: {
            items: updatedItems,
            total: calculateTotal(updatedItems),
          },
        }
      }),

      removeItem: (id) => set((state) => {
        const updatedItems = state.cart.items.filter((item) => item.id !== id)
        return {
          cart: {
            items: updatedItems,
            total: calculateTotal(updatedItems),
          },
        }
      }),

      updateQuantity: (id, quantity) => set((state) => {
        const updatedItems = state.cart.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
        return {
          cart: {
            items: updatedItems,
            total: calculateTotal(updatedItems),
          },
        }
      }),

      clearCart: () => set({ cart: { items: [], total: 0 } }),
    }),
    {
      name: 'cart-storage',
    }
  )
)

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}