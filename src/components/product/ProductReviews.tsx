import { useState } from 'react'
import { useAuthStore } from '@/lib/store/authStore'
import type { Review } from '@/types/review'
import Image from 'next/image'

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  onAddReview?: (review: Omit<Review, 'id' | 'userId' | 'userName' | 'createdAt' | 'updatedAt'>) => void;
}

export default function ProductReviews({ productId, reviews, onAddReview }: ProductReviewsProps) {
  const { user } = useAuthStore()
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [isWriting, setIsWriting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onAddReview) {
      onAddReview({
        productId,
        rating,
        content,
      })
      setContent('')
      setRating(5)
      setIsWriting(false)
    }
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">상품 리뷰</h2>
        {user && !isWriting && (
          <button
            onClick={() => setIsWriting(true)}
            className="text-blue-600 hover:text-blue-700"
          >
            리뷰 작성
          </button>
        )}
      </div>

      {isWriting && (
        <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-4 rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              평점
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              리뷰 내용
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsWriting(false)}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              작성
            </button>
          </div>
        </form>
      )}

      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`text-2xl ${
                  star <= Math.round(averageRating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-xl font-bold">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-gray-500">
            ({reviews.length}개의 리뷰)
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-lg ${
                        star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="font-medium">{review.userName}</span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700">{review.content}</p>
            {review.images && review.images.length > 0 && (
              <div className="mt-4 flex space-x-4">
                {review.images.map((image, index) => (
                  <div key={index} className="w-20 h-20">                  <Image
                    src={image}
                    alt={`리뷰 이미지 ${index + 1}`}
                    fill
                    className="object-cover rounded-md"
                  />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}