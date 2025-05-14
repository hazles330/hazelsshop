export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  link: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBannerInput {
  title: string;
  imageUrl: string;
  link: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
}

export interface UpdateBannerInput extends Partial<CreateBannerInput> {
  id: string;
}