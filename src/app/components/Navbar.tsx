import { Link } from 'react-router-dom';
import { Home, Search, MessageSquare, LayoutDashboard, ShieldCheck, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout, switchRole } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

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

            <div className="hidden md:flex items-center gap-6">
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
                  {user.role === 'tenant' && (
                    <Link to="/tenant/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                  )}
                  {user.role === 'landlord' && (
                    <Link to="/landlord/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Quản lý</span>
                    </Link>
                  )}
                  {user.role === 'admin' && (
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
                  <span className="hidden sm:inline">{user.name}</span>
                  <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">
                    {user.role === 'tenant' ? 'Người thuê' : user.role === 'landlord' ? 'Chủ nhà' : 'Admin'}
                  </span>
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>

                      {/* Demo: Switch role */}
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-xs text-muted-foreground mb-2">DEMO: Chuyển vai trò</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              switchRole('tenant');
                              setShowUserMenu(false);
                            }}
                            className={`flex-1 px-3 py-1.5 text-xs rounded ${
                              user.role === 'tenant' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                            }`}
                          >
                            Người thuê
                          </button>
                          <button
                            onClick={() => {
                              switchRole('landlord');
                              setShowUserMenu(false);
                            }}
                            className={`flex-1 px-3 py-1.5 text-xs rounded ${
                              user.role === 'landlord' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                            }`}
                          >
                            Chủ nhà
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
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
