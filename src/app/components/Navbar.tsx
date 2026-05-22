import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, MessageSquare, LayoutDashboard, ShieldCheck, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const roleLabel = (role: string) => {
    if (role === 'TENANT') return 'Người thuê';
    if (role === 'LANDLORD') return 'Chủ nhà';
    if (role === 'ADMIN') return 'Quản trị viên';
    return role;
  };

  const dashboardPath = (role: string) => {
    if (role === 'TENANT') return '/tenant/dashboard';
    if (role === 'LANDLORD') return '/landlord/dashboard';
    if (role === 'ADMIN') return '/admin';
    return '/';
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-xl text-foreground">RentNest</span>
            </Link>

            <div className="flex items-center gap-6">
              <Link to="/browse" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Search className="w-4 h-4" />
                <span>Tìm phòng</span>
              </Link>
              {user && (
                <>
                  <Link to="/messages" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span>Tin nhắn</span>
                  </Link>
                  {user.role === 'TENANT' && (
                    <Link to="/tenant/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                  )}
                  {user.role === 'LANDLORD' && (
                    <Link to="/landlord/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Quản lý</span>
                    </Link>
                  )}
                  {user.role === 'ADMIN' && (
                    <Link to="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Quản trị</span>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{user.fullName}</span>
                  <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">
                    {roleLabel(user.role)}
                  </span>
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="font-medium">{user.fullName}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-primary mt-1">{roleLabel(user.role)}</p>
                      </div>

                      <Link
                        to={dashboardPath(user.role)}
                        onClick={() => setShowUserMenu(false)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-accent flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/auth" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
