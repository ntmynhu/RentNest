import api from './api';

export interface Review {
  id: number;
  tenantId: number;
  listingId: number;
  rating: number;
  text: string | null;
  isVerified: boolean;
  status: 'PUBLISHED' | 'HIDDEN';
  createdAt: string;
  tenant?: { name: string };
}

export const reviewService = {
  // Public: get reviews for a listing
  async getByListing(listingId: number): Promise<Review[]> {
    const { data } = await api.get(`/reviews/listing/${listingId}`);
    return data.metaData;
  },

  // Tenant: create review (requires moveOutDate in the past)
  async create(listingId: number, payload: { rating: number; text?: string }): Promise<Review> {
    const { data } = await api.post(`/reviews/listing/${listingId}`, payload);
    return data.metaData;
  },
};
