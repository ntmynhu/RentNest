import api from './api';

export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  phone: string | null;
  role: 'TENANT' | 'LANDLORD' | 'ADMIN' | 'GUEST';
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  emailVerified: boolean;
  createdAt: string;
}

export const userService = {
  // Admin: get all users
  async getAll(params?: {
    role?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: AdminUser[]; pagination: { total: number; page: number; limit: number; totalPages: number } }> {
    const { data } = await api.get('/users', { params });
    return data.metaData;
  },

  // Admin: warn user
  async warn(id: number, reason: string) {
    const { data } = await api.post(`/users/${id}/warn`, { reason });
    return data.metaData;
  },

  // Admin: ban user
  async ban(id: number, reason: string) {
    const { data } = await api.post(`/users/${id}/ban`, { reason });
    return data.metaData;
  },
};
