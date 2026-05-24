import api from './api';

export interface ListingImage {
  id: number;
  url: string;
  isPrimary: boolean;
}

export interface Listing {
  id: number;
  landlordId: number;
  title: string;
  description: string;
  price: number;
  address: string;
  district: string | null;
  city: string | null;
  area: number;
  roomType: 'SINGLE_ROOM' | 'SHARED_ROOM' | 'APARTMENT' | 'MINI_APARTMENT' | 'DORMITORY';
  status: 'PENDING_APPROVAL' | 'PUBLISHED' | 'REJECTED' | 'UNAVAILABLE' | 'ARCHIVED';
  viewCount: number;
  images: ListingImage[];
  amenities: { amenity: { id: number; name: string } }[];
  avgRating: number | null;
  reviewCount: number;
  landlord?: { id: number; fullName: string; avatar: string | null };
  createdAt: string;
}

export interface SearchParams {
  keyword?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  roomType?: string;
  areaMin?: number;
  areaMax?: number;
  sortBy?: 'NEWEST' | 'LOWEST_PRICE' | 'HIGHEST_PRICE' | 'LARGEST_AREA';
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const listingService = {
  // UC4: Tìm kiếm & lọc phòng
  async search(params: SearchParams = {}): Promise<PaginatedResult<Listing>> {
    const { data } = await api.get('/listings', { params });
    return data.metaData;
  },

  // UC5: Gợi ý cá nhân hoá
  async getRecommendations(): Promise<Listing[]> {
    const { data } = await api.get('/listings/recommendations');
    return data.metaData;
  },

  // Xem chi tiết 1 phòng
  async getById(id: number): Promise<Listing> {
    const { data } = await api.get(`/listings/${id}`);
    return data.metaData;
  },

  // UC7: Chủ nhà đăng phòng
  async create(payload: {
    title: string;
    description: string;
    price: number;
    address: string;
    district?: string;
    city?: string;
    area: number;
    roomType: string;
    amenityIds?: number[];
    imageUrls?: string[];
  }): Promise<Listing> {
    const { data } = await api.post('/listings', payload);
    return data.metaData;
  },

  // Chủ nhà xem danh sách phòng của mình
  async getMyListings(): Promise<Listing[]> {
    const { data } = await api.get('/listings/my/listings');
    return data.metaData;
  },

  // Chủ nhà chỉnh sửa phòng (→ PENDING_APPROVAL)
  async update(id: number, payload: {
    title?: string;
    description?: string;
    price?: number;
    address?: string;
    district?: string;
    city?: string;
    area?: number;
    roomType?: string;
    amenityIds?: number[];
    imageUrls?: string[];
  }): Promise<Listing> {
    const { data } = await api.put(`/listings/${id}`, payload);
    return data.metaData;
  },

  // Admin duyệt phòng
  async approve(id: number) {
    const { data } = await api.patch(`/listings/${id}/approve`);
    return data.metaData;
  },

  async reject(id: number, rejectionReason: string) {
    const { data } = await api.patch(`/listings/${id}/reject`, { rejectionReason });
    return data.metaData;
  },

  async getPending(page = 1): Promise<PaginatedResult<Listing>> {
    const { data } = await api.get('/listings/admin/pending', { params: { page } });
    return data.metaData;
  },
};
