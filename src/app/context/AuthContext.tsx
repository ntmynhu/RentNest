import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'tenant' | 'landlord' | 'admin' | null;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'tenant' | 'landlord') => void;
  logout: () => void;
  switchRole: (role: 'tenant' | 'landlord') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, role: 'tenant' | 'landlord') => {
    // Mock login - in production this would call an API
    setUser({
      id: role === 'tenant' ? 'tenant-001' : 'landlord-001',
      name: role === 'tenant' ? 'Nguyễn Văn Minh' : 'Trần Thị Lan',
      email,
      role
    });
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: 'tenant' | 'landlord') => {
    if (user) {
      setUser({
        ...user,
        id: role === 'tenant' ? 'tenant-001' : 'landlord-001',
        name: role === 'tenant' ? 'Nguyễn Văn Minh' : 'Trần Thị Lan',
        role
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
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
