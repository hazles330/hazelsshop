import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WishlistItem, Wishlist } from '@/types/wishlist'

interface WishlistStore {
  wishlist: Wishlist;
  addToWishlist: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlist: {
        userId: '',
        items: []
      },

      addToWishlist: (item) => set((state) => {
        if (state.wishlist.items.some(i => i.productId === item.productId)) {
          return state;
        }

        const newItem: WishlistItem = {
          ...item,
          id: Math.random().toString(36).substr(2, 9),
          addedAt: new Date().toISOString()
        };

        return {
          wishlist: {
            ...state.wishlist,
            items: [...state.wishlist.items, newItem]
          }
        };
      }),

      removeFromWishlist: (productId) => set((state) => ({
        wishlist: {
          ...state.wishlist,
          items: state.wishlist.items.filter(item => item.productId !== productId)
        }
      })),

      isInWishlist: (productId) => {
        const state = get();
        return state.wishlist.items.some(item => item.productId === productId);
      },

      clearWishlist: () => set((state) => ({
        wishlist: {
          ...state.wishlist,
          items: []
        }
      }))
    }),
    {
      name: 'wishlist-storage'
    }
  )
)