export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  content: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductReviews {
  productId: string;
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
}