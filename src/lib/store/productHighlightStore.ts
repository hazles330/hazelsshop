import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProductHighlight {
  id: string
  type: 'best' | 'new'
  productId: string
  order: number
  createdAt: string
}

interface ProductHighlightStore {
  bestProducts: ProductHighlight[]
  newProducts: ProductHighlight[]
  updateBestProducts: (productIds: string[]) => void
  updateNewProducts: (productIds: string[]) => void
  addToBest: (productId: string) => void
  addToNew: (productId: string) => void
  removeFromBest: (productId: string) => void
  removeFromNew: (productId: string) => void
  reorderBestProducts: (productIds: string[]) => void
  reorderNewProducts: (productIds: string[]) => void
}

export const useProductHighlightStore = create<ProductHighlightStore>()(
  persist(
    (set) => ({
      bestProducts: [],
      newProducts: [],

      updateBestProducts: (productIds) => {
        set((state) => ({
          bestProducts: productIds.map((id, index) => ({
            id: `best-${id}`,
            type: 'best' as const,
            productId: id,
            order: index,
            createdAt: new Date().toISOString(),
          })),
        }))
      },

      updateNewProducts: (productIds) => {
        set((state) => ({
          newProducts: productIds.map((id, index) => ({
            id: `new-${id}`,
            type: 'new' as const,
            productId: id,
            order: index,
            createdAt: new Date().toISOString(),
          })),
        }))
      },

      addToBest: (productId) => {
        set((state) => ({
          bestProducts: [
            ...state.bestProducts,
            {
              id: `best-${productId}`,
              type: 'best',
              productId,
              order: state.bestProducts.length,
              createdAt: new Date().toISOString(),
            },
          ],
        }))
      },

      addToNew: (productId) => {
        set((state) => ({
          newProducts: [
            ...state.newProducts,
            {
              id: `new-${productId}`,
              type: 'new',
              productId,
              order: state.newProducts.length,
              createdAt: new Date().toISOString(),
            },
          ],
        }))
      },

      removeFromBest: (productId) => {
        set((state) => ({
          bestProducts: state.bestProducts.filter((p) => p.productId !== productId),
        }))
      },

      removeFromNew: (productId) => {
        set((state) => ({
          newProducts: state.newProducts.filter((p) => p.productId !== productId),
        }))
      },

      reorderBestProducts: (productIds) => {
        set((state) => ({
          bestProducts: productIds.map((id, index) => {
            const existing = state.bestProducts.find((p) => p.productId === id)
            return {
              ...(existing || {
                id: `best-${id}`,
                type: 'best' as const,
                productId: id,
                createdAt: new Date().toISOString(),
              }),
              order: index,
            }
          }),
        }))
      },

      reorderNewProducts: (productIds) => {
        set((state) => ({
          newProducts: productIds.map((id, index) => {
            const existing = state.newProducts.find((p) => p.productId === id)
            return {
              ...(existing || {
                id: `new-${id}`,
                type: 'new' as const,
                productId: id,
                createdAt: new Date().toISOString(),
              }),
              order: index,
            }
          }),
        }))
      },
    }),
    {
      name: 'product-highlight-storage',
    }
  )
)
