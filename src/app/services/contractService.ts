import api from './api';

export interface Contract {
  id: number;
  landlordId: number;
  tenantId: number;
  listingId: number;
  startDate: string;
  endDate: string;
  rentAmount: number;
  depositAmount: number;
  terms: string | null;
  status: 'DRAFT' | 'ACTIVE' | 'ENDED' | 'EXPIRED' | 'ARCHIVED';
  tenant?: { id: number; name: string; email: string; phone: string };
  listing?: { id: number; title: string; address: string };
}

export const contractService = {
  // Landlord: get all contracts
  async getAll(): Promise<Contract[]> {
    const { data } = await api.get('/contracts');
    return data.metaData;
  },

  // Tenant: get own contracts
  async getMine(): Promise<Contract[]> {
    const { data } = await api.get('/contracts/mine');
    return data.metaData;
  },

  // Landlord: create contract
  async create(payload: {
    tenantId: number;
    listingId: number;
    startDate: string;
    endDate: string;
    rentAmount: number;
    depositAmount: number;
    terms?: string;
  }): Promise<Contract> {
    const { data } = await api.post('/contracts', payload);
    return data.metaData;
  },

  // Landlord: update contract
  async update(id: number, payload: Partial<{
    startDate: string;
    endDate: string;
    rentAmount: number;
    depositAmount: number;
    terms: string;
    status: string;
  }>): Promise<Contract> {
    const { data } = await api.put(`/contracts/${id}`, payload);
    return data.metaData;
  },

  // Landlord: archive contract
  async archive(id: number): Promise<Contract> {
    const { data } = await api.patch(`/contracts/${id}/archive`);
    return data.metaData;
  },
};
