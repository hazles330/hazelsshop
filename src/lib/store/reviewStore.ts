import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Review, ProductReviews } from '@/types/review'
import { useAuthStore } from './authStore'

interface ReviewStore {
  reviews: Record<string, ProductReviews>;
  addReview: (productId: string, review: Omit<Review, 'id' | 'userId' | 'userName' | 'createdAt' | 'updatedAt'>) => void;
  getProductReviews: (productId: string) => ProductReviews;
  deleteReview: (productId: string, reviewId: string) => void;
}

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set, get) => ({
      reviews: {},

      addReview: (productId, reviewData) => {
        const user = useAuthStore.getState().user
        if (!user) return

        const newReview: Review = {
          id: Math.random().toString(36).substr(2, 9),
          productId,
          userId: user.id,
          userName: user.name,
          rating: reviewData.rating,
          content: reviewData.content,
          images: reviewData.images,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        set((state) => {
          const productReviews = state.reviews[productId] || {
            productId,
            averageRating: 0,
            totalReviews: 0,
            reviews: [],
          }

          const updatedReviews = [...productReviews.reviews, newReview]
          const averageRating =
            updatedReviews.reduce((sum, review) => sum + review.rating, 0) /
            updatedReviews.length

          return {
            reviews: {
              ...state.reviews,
              [productId]: {
                productId,
                averageRating,
                totalReviews: updatedReviews.length,
                reviews: updatedReviews,
              },
            },
          }
        })
      },

      getProductReviews: (productId) => {
        const state = get()
        return (
          state.reviews[productId] || {
            productId,
            averageRating: 0,
            totalReviews: 0,
            reviews: [],
          }
        )
      },

      deleteReview: (productId, reviewId) => {
        set((state) => {
          const productReviews = state.reviews[productId]
          if (!productReviews) return state

          const updatedReviews = productReviews.reviews.filter(
            (review) => review.id !== reviewId
          )

          const averageRating =
            updatedReviews.length > 0
              ? updatedReviews.reduce((sum, review) => sum + review.rating, 0) /
                updatedReviews.length
              : 0

          return {
            reviews: {
              ...state.reviews,
              [productId]: {
                productId,
                averageRating,
                totalReviews: updatedReviews.length,
                reviews: updatedReviews,
              },
            },
          }
        })
      },
    }),
    {
      name: 'review-storage',
    }
  )
)