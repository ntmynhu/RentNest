import { useState } from 'react';
import { Home, Mail, Lock, User, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [userType, setUserType] = useState<'tenant' | 'landlord'>('tenant');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password, userType);
    if (userType === 'tenant') {
      navigate('/tenant/dashboard');
    } else {
      navigate('/landlord/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-background to-accent/50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-semibold text-2xl text-foreground">RentNest</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">
            {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </h1>
          <p className="text-muted-foreground">
            {mode === 'login'
              ? 'Chào mừng bạn trở lại!'
              : 'Tạo tài khoản để bắt đầu'}
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
          {mode === 'register' && (
            <div className="mb-6">
              <label className="block text-sm mb-3">Loại tài khoản</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('tenant')}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    userType === 'tenant'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium">Người thuê</div>
                  <div className="text-xs text-muted-foreground mt-1">Tìm phòng trọ</div>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('landlord')}
                  className={`px-4 py-3 rounded-lg border-2 transition-all ${
                    userType === 'landlord'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium">Chủ nhà</div>
                  <div className="text-xs text-muted-foreground mt-1">Cho thuê phòng</div>
                </button>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div>
                <label className="block text-sm mb-2">Họ và tên</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm mb-2">Số điện thoại</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    placeholder="0901234567"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm mb-2">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm mb-2">Xác nhận mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-muted-foreground">Ghi nhớ đăng nhập</span>
                </label>
                <a href="#" className="text-primary hover:underline">
                  Quên mật khẩu?
                </a>
              </div>
            )}

            {mode === 'login' && (
              <div className="mb-4">
                <label className="block text-sm mb-2">Vai trò demo</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUserType('tenant')}
                    className={`px-3 py-2 rounded-lg border transition-all text-sm ${
                      userType === 'tenant'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    Người thuê
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('landlord')}
                    className={`px-3 py-2 rounded-lg border transition-all text-sm ${
                      userType === 'landlord'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    Chủ nhà
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-secondary transition-colors"
            >
              {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
              <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-primary font-medium hover:underline"
              >
                {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </p>
          </div>

          {mode === 'register' && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-center text-muted-foreground">
                Bằng việc đăng ký, bạn đồng ý với{' '}
                <a href="#" className="text-primary hover:underline">Điều khoản sử dụng</a>
                {' '}và{' '}
                <a href="#" className="text-primary hover:underline">Chính sách bảo mật</a>
                {' '}của RentNest
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
