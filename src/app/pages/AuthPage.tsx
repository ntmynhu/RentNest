import { useState } from 'react';
import { Home, Mail, Lock, User, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [userType, setUserType] = useState<'tenant' | 'landlord'>('tenant');
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register, forgotPassword } = useAuth();
  const navigate = useNavigate();

  const roleMap: Record<string, string> = {
    TENANT: '/tenant/dashboard',
    LANDLORD: '/landlord/dashboard',
    ADMIN: '/admin',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    try {
      const loggedInUser = await login(formData.email, formData.password);
      // debug: in kết quả trả về để kiểm tra role
      // eslint-disable-next-line no-console
      console.log('AuthPage: login result', loggedInUser);
      // Redirect dựa theo role thực tế từ API
      const dest = roleMap[loggedInUser.role] ?? '/';
      navigate(dest);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Đã xảy ra lỗi khi đăng nhập');
      throw err;
    }
  };

  const handleRegister = async () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    const result = await register({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    });
    setSuccess(result.message);
    setTimeout(() => setMode('login'), 3000);
  };

  const handleForgot = async () => {
    if (!formData.email) { setError('Vui lòng nhập email'); return; }
    const result = await forgotPassword(formData.email);
    setSuccess(result.message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    try {
      if (mode === 'login') await handleLogin();
      else if (mode === 'register') await handleRegister();
      else await handleForgot();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại');
    } finally {
      setIsSubmitting(false);
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
            {mode === 'login' ? 'Đăng nhập' : mode === 'register' ? 'Đăng ký' : 'Quên mật khẩu'}
          </h1>
          <p className="text-muted-foreground">
            {mode === 'login' ? 'Chào mừng bạn trở lại!'
              : mode === 'register' ? 'Tạo tài khoản để bắt đầu'
              : 'Nhập email để nhận link đặt lại mật khẩu'}
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
          {/* Thông báo lỗi / thành công */}
          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              <CheckCircle className="w-4 h-4 shrink-0" />
              {success}
            </div>
          )}

          {/* Chọn loại tài khoản khi register */}
          {mode === 'register' && (
            <div className="mb-6">
              <label className="block text-sm mb-3">Loại tài khoản</label>
              <div className="grid grid-cols-2 gap-3">
                {(['tenant', 'landlord'] as const).map((t) => (
                  <button key={t} type="button" onClick={() => setUserType(t)}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${userType === t ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                    <div className="font-medium">{t === 'tenant' ? 'Người thuê' : 'Chủ nhà'}</div>
                    <div className="text-xs text-muted-foreground mt-1">{t === 'tenant' ? 'Tìm phòng trọ' : 'Cho thuê phòng'}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div>
                <label className="block text-sm mb-2">Họ và tên</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input name="fullName" type="text" placeholder="Nguyễn Văn A"
                    value={formData.fullName} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input name="email" type="email" placeholder="email@example.com"
                  value={formData.email} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm mb-2">Số điện thoại</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input name="phone" type="tel" placeholder="0901234567"
                    value={formData.phone} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
            )}

            {mode !== 'forgot' && (
              <div>
                <label className="block text-sm mb-2">Mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input name="password" type="password" placeholder="••••••••"
                    value={formData.password} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-sm mb-2">Xác nhận mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input name="confirmPassword" type="password" placeholder="••••••••"
                    value={formData.confirmPassword} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="flex items-center justify-between text-sm">
                <span />
                <button type="button" onClick={() => setMode('forgot')} className="text-primary hover:underline">
                  Quên mật khẩu?
                </button>
              </div>
            )}

            <button type="submit" disabled={isSubmitting}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-secondary transition-colors disabled:opacity-50">
              {isSubmitting ? 'Đang xử lý...'
                : mode === 'login' ? 'Đăng nhập'
                : mode === 'register' ? 'Đăng ký'
                : 'Gửi link đặt lại mật khẩu'}
            </button>
          </form>

          <div className="mt-6 text-center">
            {mode === 'forgot' ? (
              <button onClick={() => setMode('login')} className="text-sm text-primary hover:underline">
                ← Quay lại đăng nhập
              </button>
            ) : (
              <p className="text-sm text-muted-foreground">
                {mode === 'login' ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
                <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-primary font-medium hover:underline">
                  {mode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
                </button>
              </p>
            )}
          </div>
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
