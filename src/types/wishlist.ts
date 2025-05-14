export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  addedAt: string;
}

export interface Wishlist {
  userId: string;
  items: WishlistItem[];
}