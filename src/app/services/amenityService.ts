import api from './api';

export interface Amenity {
  id: number;
  name: string;
  icon: string | null;
}

export const amenityService = {
  async getAll(): Promise<Amenity[]> {
    const { data } = await api.get('/amenities');
    return data.metaData;
  },
};
