import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Users, Home, TrendingUp, Eye, AlertTriangle, Ban } from 'lucide-react';
import { Link } from 'react-router-dom';
import { listingService, Listing, PaginatedResult } from '../services/listingService';
import { userService, AdminUser } from '../services/userService';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'users' | 'stats'>('pending');

  // Pending listings
  const [pendingListings, setPendingListings] = useState<Listing[]>([]);
  const [pendingPage, setPendingPage] = useState(1);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [loadingPending, setLoadingPending] = useState(true);

  // Approved listings
  const [approvedListings, setApprovedListings] = useState<Listing[]>([]);
  const [loadingApproved, setLoadingApproved] = useState(false);

  // Users
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  // Reject dialog
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Ban dialog
  const [banUserId, setBanUserId] = useState<number | null>(null);
  const [banReason, setBanReason] = useState('');

  // Warn dialog
  const [warnUserId, setWarnUserId] = useState<number | null>(null);
  const [warnReason, setWarnReason] = useState('');

  useEffect(() => {
    loadPending(1);
  }, []);

  useEffect(() => {
    if (activeTab === 'approved' && approvedListings.length === 0) {
      loadApproved();
    }
    if (activeTab === 'users' && users.length === 0) {
      loadUsers();
    }
  }, [activeTab]);

  const loadPending = (page: number) => {
    setLoadingPending(true);
    listingService.getPending(page)
      .then((res: PaginatedResult<Listing>) => {
        setPendingListings(res.data);
        setPendingTotal(res.pagination.total);
        setPendingPage(page);
      })
      .catch(() => {})
      .finally(() => setLoadingPending(false));
  };

  const loadApproved = () => {
    setLoadingApproved(true);
    listingService.search({ sortBy: 'NEWEST', limit: 20 })
      .then(res => setApprovedListings(res.data))
      .catch(() => {})
      .finally(() => setLoadingApproved(false));
  };

  const loadUsers = (search?: string) => {
    setLoadingUsers(true);
    userService.getAll({ search, limit: 50 })
      .then(res => {
        setUsers(res.data);
        setUsersTotal(res.pagination.total);
      })
      .catch(() => {})
      .finally(() => setLoadingUsers(false));
  };

  const handleApprove = async (id: number) => {
    try {
      await listingService.approve(id);
      setPendingListings(prev => prev.filter(l => l.id !== id));
      setPendingTotal(prev => prev - 1);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Không thể duyệt tin đăng');
    }
  };

  const handleReject = async () => {
    if (!rejectId || !rejectReason.trim()) return;
    try {
      await listingService.reject(rejectId, rejectReason);
      setPendingListings(prev => prev.filter(l => l.id !== rejectId));
      setPendingTotal(prev => prev - 1);
      setRejectId(null);
      setRejectReason('');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Không thể từ chối tin đăng');
    }
  };

  const handleBan = async () => {
    if (!banUserId || !banReason.trim()) return;
    try {
      await userService.ban(banUserId, banReason);
      setUsers(prev => prev.map(u => u.id === banUserId ? { ...u, status: 'BANNED' } : u));
      setBanUserId(null);
      setBanReason('');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Không thể ban người dùng');
    }
  };

  const handleWarn = async () => {
    if (!warnUserId || !warnReason.trim()) return;
    try {
      await userService.warn(warnUserId, warnReason);
      setWarnUserId(null);
      setWarnReason('');
      alert('Đã gửi cảnh báo thành công');
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Không thể gửi cảnh báo');
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const totalLandlords = users.filter(u => u.role === 'LANDLORD').length;
  const totalTenants = users.filter(u => u.role === 'TENANT').length;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Bảng quản trị viên</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: <Clock className="w-5 h-5 text-yellow-600" />, bg: 'bg-yellow-500/10', count: pendingTotal, label: 'Chờ duyệt' },
              { icon: <Home className="w-5 h-5 text-primary" />, bg: 'bg-primary/10', count: approvedListings.length, label: 'Đã duyệt' },
              { icon: <Users className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-500/10', count: usersTotal, label: 'Tổng người dùng' },
              { icon: <TrendingUp className="w-5 h-5 text-green-600" />, bg: 'bg-green-500/10', count: totalLandlords, label: 'Chủ nhà' },
            ].map((card, i) => (
              <div key={i} className="bg-card rounded-xl p-6 border border-border">
                <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center mb-3`}>
                  {card.icon}
                </div>
                <div className="text-2xl font-bold mb-1">{card.count}</div>
                <div className="text-sm text-muted-foreground">{card.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 border-b border-border mb-6">
          {[
            { key: 'pending', label: `Chờ duyệt (${pendingTotal})` },
            { key: 'approved', label: 'Đã duyệt' },
            { key: 'users', label: 'Người dùng' },
            { key: 'stats', label: 'Thống kê' },
          ].map(tab => (
            <button key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Pending listings */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            {loadingPending ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-muted/40 animate-pulse h-40" />
              ))
            ) : pendingListings.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-xl border border-border">
                <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Không có tin đăng nào chờ duyệt</h3>
                <p className="text-muted-foreground">Tất cả tin đăng đã được xử lý</p>
              </div>
            ) : (
              <>
                {pendingListings.map(listing => (
                  <div key={listing.id} className="bg-card rounded-xl p-6 border border-border">
                    <div className="flex flex-col md:flex-row gap-6">
                      {listing.images[0] && (
                        <img
                          src={listing.images[0].url}
                          alt={listing.title}
                          className="w-full md:w-48 h-32 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{listing.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {listing.district ? `${listing.district}, ` : ''}{listing.city ?? ''}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Chủ nhà: <span className="font-medium">{listing.landlord?.fullName ?? `#${listing.landlordId}`}</span>
                            </p>
                          </div>
                          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/10 text-yellow-600">
                            <Clock className="w-4 h-4" />
                            Chờ duyệt
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{listing.description}</p>

                        <div className="flex items-center gap-6 mt-3 text-sm">
                          <span className="text-muted-foreground">Giá: <span className="font-semibold text-primary">{formatPrice(listing.price)}/tháng</span></span>
                          <span className="text-muted-foreground">Diện tích: <span className="font-semibold">{listing.area}m²</span></span>
                          <span className="text-muted-foreground">Ngày đăng: <span className="font-semibold">{new Date(listing.createdAt).toLocaleDateString('vi-VN')}</span></span>
                        </div>

                        <div className="flex items-center gap-3 mt-4">
                          <Link to={`/listing/${listing.id}`}
                            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm">
                            <Eye className="w-4 h-4" />
                            Xem chi tiết
                          </Link>
                          <button
                            onClick={() => handleApprove(listing.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Duyệt
                          </button>
                          <button
                            onClick={() => { setRejectId(listing.id); setRejectReason(''); }}
                            className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors text-sm"
                          >
                            <XCircle className="w-4 h-4" />
                            Từ chối
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {pendingTotal > pendingListings.length && (
                  <div className="text-center">
                    <button
                      onClick={() => loadPending(pendingPage + 1)}
                      className="px-6 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm"
                    >
                      Tải thêm
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Approved listings */}
        {activeTab === 'approved' && (
          <div className="space-y-4">
            {loadingApproved ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-muted/40 animate-pulse h-32" />
              ))
            ) : approvedListings.filter(l => l.status === 'PUBLISHED').map(listing => (
              <div key={listing.id} className="bg-card rounded-xl p-6 border border-border">
                <div className="flex flex-col md:flex-row gap-6">
                  {listing.images[0] && (
                    <img src={listing.images[0].url} alt={listing.title}
                      className="w-full md:w-48 h-32 object-cover rounded-lg" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{listing.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {listing.district ? `${listing.district}, ` : ''}{listing.city}
                        </p>
                      </div>
                      <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        Đã duyệt
                      </span>
                    </div>
                    <div className="flex items-center gap-6 mt-3 text-sm">
                      <span className="text-muted-foreground">Giá: <span className="font-semibold text-primary">{formatPrice(listing.price)}/tháng</span></span>
                      <span className="text-muted-foreground">Diện tích: <span className="font-semibold">{listing.area}m²</span></span>
                      <span className="text-muted-foreground">Lượt xem: <span className="font-semibold">{listing.viewCount}</span></span>
                    </div>
                    <div className="mt-3">
                      <Link to={`/listing/${listing.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm">
                        <Eye className="w-4 h-4" />
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Users management */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && loadUsers(userSearch)}
                className="flex-1 px-4 py-2 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={() => loadUsers(userSearch)}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-secondary transition-colors"
              >
                Tìm
              </button>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {loadingUsers ? (
                <div className="p-6 space-y-3">
                  {[1,2,3,4,5].map(i => <div key={i} className="h-10 bg-muted/40 rounded animate-pulse" />)}
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-muted/30 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium">Tên</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Vai trò</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Trạng thái</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Không tìm thấy người dùng</td></tr>
                    ) : users.map(u => (
                      <tr key={u.id} className="border-b border-border last:border-0">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="font-bold text-primary text-sm">{u.fullName.charAt(0)}</span>
                            </div>
                            <span className="font-medium">{u.fullName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            u.role === 'LANDLORD' ? 'bg-primary/10 text-primary' :
                            u.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-600' :
                            'bg-blue-500/10 text-blue-600'
                          }`}>
                            {u.role === 'LANDLORD' ? 'Chủ nhà' :
                             u.role === 'ADMIN' ? 'Quản trị viên' : 'Người thuê'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            u.status === 'ACTIVE' ? 'bg-green-500/10 text-green-600' :
                            u.status === 'BANNED' ? 'bg-red-500/10 text-red-600' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {u.status === 'ACTIVE' ? 'Hoạt động' :
                             u.status === 'BANNED' ? 'Đã cấm' : 'Không hoạt động'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {u.role !== 'ADMIN' && u.status !== 'BANNED' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => { setWarnUserId(u.id); setWarnReason(''); }}
                                className="flex items-center gap-1 px-3 py-1 border border-yellow-400 text-yellow-600 rounded-lg text-xs hover:bg-yellow-50 transition-colors"
                              >
                                <AlertTriangle className="w-3 h-3" />
                                Cảnh báo
                              </button>
                              <button
                                onClick={() => { setBanUserId(u.id); setBanReason(''); }}
                                className="flex items-center gap-1 px-3 py-1 border border-destructive text-destructive rounded-lg text-xs hover:bg-destructive/10 transition-colors"
                              >
                                <Ban className="w-3 h-3" />
                                Cấm
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Stats */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-semibold text-lg mb-4">Thống kê tin đăng</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Chờ duyệt</span>
                  <span className="text-xl font-semibold text-yellow-600">{pendingTotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Đã duyệt (PUBLISHED)</span>
                  <span className="text-xl font-semibold text-green-600">
                    {approvedListings.filter(l => l.status === 'PUBLISHED').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-semibold text-lg mb-4">Thống kê người dùng</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tổng người dùng</span>
                  <span className="text-2xl font-bold">{usersTotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Chủ nhà</span>
                  <span className="text-xl font-semibold text-primary">{totalLandlords}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Người thuê</span>
                  <span className="text-xl font-semibold text-blue-600">{totalTenants}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reject Dialog */}
      {rejectId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Lý do từ chối</h3>
            <textarea
              rows={4}
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Nhập lý do từ chối tin đăng..."
              className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={handleReject} disabled={!rejectReason.trim()}
                className="flex-1 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50">
                Từ chối
              </button>
              <button onClick={() => setRejectId(null)}
                className="flex-1 py-2 border border-border rounded-lg font-medium hover:bg-accent transition-colors">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ban Dialog */}
      {banUserId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Lý do cấm người dùng</h3>
            <textarea rows={4} value={banReason} onChange={e => setBanReason(e.target.value)}
              placeholder="Nhập lý do cấm..."
              className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={handleBan} disabled={!banReason.trim()}
                className="flex-1 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium disabled:opacity-50">
                Cấm
              </button>
              <button onClick={() => setBanUserId(null)}
                className="flex-1 py-2 border border-border rounded-lg font-medium hover:bg-accent transition-colors">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warn Dialog */}
      {warnUserId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Gửi cảnh báo</h3>
            <textarea rows={4} value={warnReason} onChange={e => setWarnReason(e.target.value)}
              placeholder="Nội dung cảnh báo..."
              className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={handleWarn} disabled={!warnReason.trim()}
                className="flex-1 py-2 bg-yellow-500 text-white rounded-lg font-medium disabled:opacity-50">
                Gửi cảnh báo
              </button>
              <button onClick={() => setWarnUserId(null)}
                className="flex-1 py-2 border border-border rounded-lg font-medium hover:bg-accent transition-colors">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
