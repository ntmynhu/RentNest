import api from './api';

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  phone: string | null;
  role: 'TENANT' | 'LANDLORD' | 'ADMIN';
  status: string;
  emailVerified: boolean;
  avatar: string | null;
}

export const authService = {
  // UC2: Đăng nhập
  async login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', data.metaData.accessToken);
    return data.metaData as { user: AuthUser; accessToken: string };
  },

  // UC1: Đăng ký
  async register(payload: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    role?: string;
  }) {
    const { data } = await api.post('/auth/register', payload);
    return data.metaData as { message: string; user: AuthUser; accessToken: string; refreshToken: string };
  },

  // UC3: Quên mật khẩu
  async forgotPassword(email: string) {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data as { message: string };
  },

  async resetPassword(token: string, newPassword: string) {
    const { data } = await api.post('/auth/reset-password', { token, newPassword });
    return data as { message: string };
  },

  // Lấy profile hiện tại
  async getMe() {
    const { data } = await api.get('/auth/me');
    return data.metaData as AuthUser;
  },

  // Đăng xuất
  async logout() {
    await api.post('/auth/logout').catch(() => {});
    localStorage.removeItem('accessToken');
  },
};
