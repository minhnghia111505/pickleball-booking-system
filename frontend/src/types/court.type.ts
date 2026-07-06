export interface Court {
  id: number;
  name: string;
  address?: string;
  description: string;
  pricePerHour: number;
  status: "ACTIVE" | "MAINTENANCE" | "INACTIVE";
  imageUrl: string | null;
  clubId?: number;
  clubName?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  reviewsCount?: number;
  googleMapUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
