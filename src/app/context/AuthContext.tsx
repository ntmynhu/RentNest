import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthUser } from '../services/authService';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (payload: { fullName: string; email: string; password: string; phone: string; role?: string }) => Promise<AuthUser | null>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Tự động load lại user khi refresh trang
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      authService.getMe()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('accessToken');
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  // UC2: Đăng nhập thật
  const login = async (email: string, password: string): Promise<AuthUser> => {
    const result = await authService.login(email, password);
    setUser(result.user);
    return result.user;
  };

  // UC1: Đăng ký thật
  // Trả về AuthUser nếu BE tự động đăng nhập (có accessToken),
  // hoặc null nếu BE chỉ tạo tài khoản và yêu cầu đăng nhập lại.
  const register = async (payload: { fullName: string; email: string; password: string; phone: string; role?: string }): Promise<AuthUser | null> => {
    const result = await authService.register(payload);
    if (result.accessToken && result.user) {
      localStorage.setItem('accessToken', result.accessToken);
      setUser(result.user);
      return result.user;
    }
    // BE chỉ trả message, không auto-login → trả null để FE redirect về trang đăng nhập
    return null;
  };

  // Đăng xuất
  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  // UC3: Quên mật khẩu
  const forgotPassword = async (email: string) => {
    return authService.forgotPassword(email);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
