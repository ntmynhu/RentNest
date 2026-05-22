import api from './api';

export interface Tenant {
  id: number;
  landlordId: number;
  listingId: number;
  userId: number | null;
  name: string;
  email: string;
  phone: string;
  moveInDate: string;
  moveOutDate: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'MOVED_OUT';
  listing?: { id: number; title: string; address: string };
}

export const tenantService = {
  // Landlord: get all tenants
  async getAll(listingId?: number): Promise<Tenant[]> {
    const { data } = await api.get('/tenants', { params: listingId ? { listingId } : undefined });
    return data.metaData;
  },

  // Landlord: add tenant
  async create(payload: {
    name: string;
    email: string;
    phone: string;
    listingId: number;
    moveInDate: string;
    userId?: number;
  }): Promise<Tenant> {
    const { data } = await api.post('/tenants', payload);
    return data.metaData;
  },

  // Landlord: update tenant
  async update(id: number, payload: Partial<{
    name: string;
    email: string;
    phone: string;
    moveInDate: string;
    moveOutDate: string;
    listingId: number;
  }>): Promise<Tenant> {
    const { data } = await api.put(`/tenants/${id}`, payload);
    return data.metaData;
  },

  // Landlord: remove tenant (soft delete)
  async remove(id: number) {
    const { data } = await api.delete(`/tenants/${id}`);
    return data.metaData;
  },
};
