import { useState, useEffect } from 'react';
import {
  Plus, Home, Users, FileText, DollarSign, MessageSquare,
  Eye, Trash2, AlertCircle, CheckCircle, Link as LinkIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { listingService, Listing } from '../services/listingService';
import { tenantService, Tenant } from '../services/tenantService';
import { contractService, Contract } from '../services/contractService';
import { paymentService, Payment } from '../services/paymentService';

const ROOM_TYPES = [
  { value: 'SINGLE_ROOM', label: 'Phòng trọ' },
  { value: 'SHARED_ROOM', label: 'Phòng ở ghép' },
  { value: 'APARTMENT', label: 'Căn hộ' },
  { value: 'MINI_APARTMENT', label: 'Căn hộ mini' },
  { value: 'DORMITORY', label: 'Ký túc xá' },
];

export function LandlordDashboardNew() {
  const [activeTab, setActiveTab] = useState<'listings' | 'tenants' | 'contracts' | 'payments' | 'messages'>('listings');
  const [showPostForm, setShowPostForm] = useState(false);

  // Data states
  const [listings, setListings] = useState<Listing[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentSummary, setPaymentSummary] = useState<Record<string, number>>({});

  // Loading states
  const [loadingListings, setLoadingListings] = useState(true);
  const [loadingTenants, setLoadingTenants] = useState(true);
  const [loadingContracts, setLoadingContracts] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);

  // Post listing form state
  const [postForm, setPostForm] = useState({
    title: '', description: '', price: '', area: '',
    address: '', district: '', city: 'TP. Hồ Chí Minh',
    roomType: 'SINGLE_ROOM',
  });
  const [postError, setPostError] = useState('');
  const [postSuccess, setPostSuccess] = useState('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  // Paid dialog
  const [markPaidId, setMarkPaidId] = useState<number | null>(null);
  const [paidDate, setPaidDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    listingService.getMyListings()
      .then(setListings)
      .catch(() => {})
      .finally(() => setLoadingListings(false));

    tenantService.getAll()
      .then(setTenants)
      .catch(() => {})
      .finally(() => setLoadingTenants(false));

    contractService.getAll()
      .then(setContracts)
      .catch(() => {})
      .finally(() => setLoadingContracts(false));

    paymentService.getAll()
      .then(res => {
        setPayments(res.payments);
        setPaymentSummary(res.summary);
      })
      .catch(() => {})
      .finally(() => setLoadingPayments(false));
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const formatDate = (date: string | null) =>
    date ? new Date(date).toLocaleDateString('vi-VN') : 'Chưa có';

  const listingStatusLabel = (s: string) => {
    const map: Record<string, string> = {
      PENDING_APPROVAL: 'Chờ duyệt', PUBLISHED: 'Đã duyệt',
      REJECTED: 'Từ chối', UNAVAILABLE: 'Không khả dụng', ARCHIVED: 'Lưu trữ',
    };
    return map[s] ?? s;
  };

  const listingStatusColor = (s: string) => {
    if (s === 'PUBLISHED') return 'bg-green-500/10 text-green-600';
    if (s === 'REJECTED') return 'bg-red-500/10 text-red-600';
    return 'bg-yellow-500/10 text-yellow-600';
  };

  const contractStatusLabel = (s: string) => {
    const map: Record<string, string> = {
      DRAFT: 'Nháp', ACTIVE: 'Đang hiệu lực',
      ENDED: 'Đã kết thúc', EXPIRED: 'Hết hạn', ARCHIVED: 'Lưu trữ',
    };
    return map[s] ?? s;
  };

  const paymentStatusLabel = (s: string) => {
    const map: Record<string, string> = {
      PAID: 'Đã thanh toán', PENDING: 'Chờ thanh toán', OVERDUE: 'Quá hạn',
    };
    return map[s] ?? s;
  };

  const paymentStatusColor = (s: string) => {
    if (s === 'PAID') return 'bg-green-500/10 text-green-600';
    if (s === 'OVERDUE') return 'bg-red-500/10 text-red-600';
    return 'bg-yellow-500/10 text-yellow-600';
  };

  const handleDeleteListing = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xóa tin đăng này?')) return;
    // soft delete — just reload after
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const handleMarkAsPaid = async () => {
    if (!markPaidId) return;
    try {
      const updated = await paymentService.markAsPaid(markPaidId, paidDate);
      setPayments(prev => prev.map(p => p.id === markPaidId ? { ...p, status: 'PAID', paidDate: updated.paidDate } : p));
      setMarkPaidId(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Không thể cập nhật thanh toán');
    }
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, description, price, area, address, district, city, roomType } = postForm;
    if (!title || !description || !price || !area || !address) {
      setPostError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    setPostError('');
    setPostSuccess('');
    setIsSubmittingPost(true);
    try {
      const created = await listingService.create({
        title,
        description,
        price: Number(price),
        area: Number(area),
        address,
        district: district || undefined,
        city: city || undefined,
        roomType,
      });
      setListings(prev => [created, ...prev]);
      setPostSuccess('Tin đăng đã được gửi duyệt thành công!');
      setPostForm({ title: '', description: '', price: '', area: '', address: '', district: '', city: 'TP. Hồ Chí Minh', roomType: 'SINGLE_ROOM' });
      setTimeout(() => { setShowPostForm(false); setPostSuccess(''); }, 2000);
    } catch (err: any) {
      setPostError(err?.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại');
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const pendingPayments = payments.filter(p => p.status !== 'PAID').length;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Bảng điều khiển chủ nhà</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: <Home className="w-5 h-5 text-primary" />, bg: 'bg-primary/10', count: listings.length, label: 'Tin đăng', loading: loadingListings },
              { icon: <Users className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-500/10', count: tenants.length, label: 'Người thuê', loading: loadingTenants },
              { icon: <FileText className="w-5 h-5 text-green-600" />, bg: 'bg-green-500/10', count: contracts.length, label: 'Hợp đồng', loading: loadingContracts },
              { icon: <DollarSign className="w-5 h-5 text-yellow-600" />, bg: 'bg-yellow-500/10', count: pendingPayments, label: 'Chờ thanh toán', loading: loadingPayments },
            ].map((card, i) => (
              <div key={i} className="bg-card rounded-xl p-6 border border-border">
                <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center mb-3`}>
                  {card.icon}
                </div>
                {card.loading
                  ? <div className="h-8 w-12 bg-muted/40 rounded animate-pulse" />
                  : <div className="text-2xl font-bold mb-1">{card.count}</div>
                }
                <div className="text-sm text-muted-foreground">{card.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 border-b border-border">
            {[
              { key: 'listings', icon: <Home className="w-4 h-4 inline mr-2" />, label: 'Tin đăng' },
              { key: 'tenants', icon: <Users className="w-4 h-4 inline mr-2" />, label: 'Người thuê' },
              { key: 'contracts', icon: <FileText className="w-4 h-4 inline mr-2" />, label: 'Hợp đồng' },
              { key: 'payments', icon: <DollarSign className="w-4 h-4 inline mr-2" />, label: 'Thanh toán' },
              { key: 'messages', icon: <MessageSquare className="w-4 h-4 inline mr-2" />, label: 'Tin nhắn' },
            ].map(tab => (
              <button key={tab.key}
                onClick={() => { setActiveTab(tab.key as any); setShowPostForm(false); }}
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'listings' && !showPostForm && (
            <button
              onClick={() => setShowPostForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-secondary transition-colors"
            >
              <Plus className="w-5 h-5" />
              Đăng tin mới
            </button>
          )}
        </div>

        {/* V10: My Listings */}
        {activeTab === 'listings' && !showPostForm && (
          <div className="space-y-4">
            {loadingListings
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-xl bg-muted/40 animate-pulse h-32" />
                ))
              : listings.length === 0
              ? <div className="text-center py-16 text-muted-foreground bg-card rounded-xl border border-border">
                  <Home className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p>Bạn chưa có tin đăng nào. Nhấn "Đăng tin mới" để bắt đầu.</p>
                </div>
              : listings.map(listing => (
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
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${listingStatusColor(listing.status)}`}>
                          {listingStatusLabel(listing.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 mt-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Giá: </span>
                          <span className="font-semibold text-primary">{formatPrice(listing.price)}</span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Diện tích: </span>
                          <span className="text-sm">{listing.area}m²</span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Lượt xem: </span>
                          <span className="text-sm">{listing.viewCount}</span>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-4">
                        <Link
                          to={`/listing/${listing.id}`}
                          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          Xem
                        </Link>
                        <button
                          onClick={() => handleDeleteListing(listing.id)}
                          className="flex items-center gap-2 px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive/10 transition-colors text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* V11: Post Listing Form */}
        {activeTab === 'listings' && showPostForm && (
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Đăng tin mới</h2>
              <button onClick={() => { setShowPostForm(false); setPostError(''); setPostSuccess(''); }}
                className="text-muted-foreground hover:text-foreground">
                Đóng
              </button>
            </div>

            {postError && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {postError}
              </div>
            )}
            {postSuccess && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                <CheckCircle className="w-4 h-4 shrink-0" />
                {postSuccess}
              </div>
            )}

            <form onSubmit={handleSubmitPost}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm mb-2">Tiêu đề tin đăng *</label>
                  <input
                    type="text"
                    value={postForm.title}
                    onChange={e => setPostForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="Phòng trọ giá rẻ gần trường đại học..."
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Giá thuê (VNĐ/tháng) *</label>
                  <input
                    type="number"
                    value={postForm.price}
                    onChange={e => setPostForm(p => ({ ...p, price: e.target.value }))}
                    placeholder="3000000"
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Diện tích (m²) *</label>
                  <input
                    type="number"
                    value={postForm.area}
                    onChange={e => setPostForm(p => ({ ...p, area: e.target.value }))}
                    placeholder="20"
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Loại phòng</label>
                  <select
                    value={postForm.roomType}
                    onChange={e => setPostForm(p => ({ ...p, roomType: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {ROOM_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">Tỉnh/Thành phố</label>
                  <select
                    value={postForm.city}
                    onChange={e => setPostForm(p => ({ ...p, city: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>TP. Hồ Chí Minh</option>
                    <option>Hà Nội</option>
                    <option>Đà Nẵng</option>
                    <option>Cần Thơ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">Quận/Huyện</label>
                  <input
                    type="text"
                    value={postForm.district}
                    onChange={e => setPostForm(p => ({ ...p, district: e.target.value }))}
                    placeholder="Quận 1"
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-2">Địa chỉ cụ thể *</label>
                  <input
                    type="text"
                    value={postForm.address}
                    onChange={e => setPostForm(p => ({ ...p, address: e.target.value }))}
                    placeholder="123 Đường ABC, Phường XYZ"
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-2">Mô tả *</label>
                  <textarea
                    rows={5}
                    value={postForm.description}
                    onChange={e => setPostForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Mô tả chi tiết về phòng trọ..."
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmittingPost}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-secondary transition-colors disabled:opacity-50"
                  >
                    {isSubmittingPost ? 'Đang gửi...' : 'Gửi duyệt'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowPostForm(false); setPostError(''); }}
                    className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* V12: Manage Tenants */}
        {activeTab === 'tenants' && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold">Quản lý người thuê</h2>
            </div>
            {loadingTenants ? (
              <div className="p-6 space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-10 bg-muted/40 rounded animate-pulse" />)}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium">Tên người thuê</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Số điện thoại</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Phòng</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Ngày vào</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenants.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Chưa có người thuê nào</td></tr>
                    ) : tenants.map(tenant => (
                      <tr key={tenant.id} className="border-b border-border last:border-0">
                        <td className="px-6 py-4 font-medium">{tenant.name}</td>
                        <td className="px-6 py-4 text-sm">{tenant.phone}</td>
                        <td className="px-6 py-4 text-sm">{tenant.email}</td>
                        <td className="px-6 py-4 text-sm">{tenant.listing?.title ?? `#${tenant.listingId}`}</td>
                        <td className="px-6 py-4 text-sm">{formatDate(tenant.moveInDate)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tenant.status === 'ACTIVE' ? 'bg-green-500/10 text-green-600' : 'bg-muted text-muted-foreground'
                          }`}>
                            {tenant.status === 'ACTIVE' ? 'Đang thuê' : 'Đã rời đi'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* V13: Manage Contracts */}
        {activeTab === 'contracts' && (
          <div className="space-y-4">
            {loadingContracts ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-muted/40 animate-pulse h-40" />
              ))
            ) : contracts.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground bg-card rounded-xl border border-border">
                Chưa có hợp đồng nào.
              </div>
            ) : contracts.map(contract => (
              <div key={contract.id} className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{contract.listing?.title ?? `Phòng #${contract.listingId}`}</h3>
                    <p className="text-sm text-muted-foreground">Người thuê: {contract.tenant?.name ?? `#${contract.tenantId}`}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    contract.status === 'ACTIVE' ? 'bg-green-500/10 text-green-600' :
                    contract.status === 'DRAFT' ? 'bg-yellow-500/10 text-yellow-600' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {contractStatusLabel(contract.status)}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Ngày bắt đầu</label>
                    <p className="font-medium">{formatDate(contract.startDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Ngày kết thúc</label>
                    <p className="font-medium">{formatDate(contract.endDate)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Tiền thuê</label>
                    <p className="font-medium text-primary">{formatPrice(contract.rentAmount)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Đặt cọc</label>
                    <p className="font-medium">{formatPrice(contract.depositAmount)}</p>
                  </div>
                </div>
                {contract.terms && (
                  <p className="text-sm text-muted-foreground mt-3">{contract.terms}</p>
                )}
                {(contract.status === 'ENDED' || contract.status === 'EXPIRED') && (
                  <div className="mt-4">
                    <button
                      onClick={async () => {
                        try {
                          const archived = await contractService.archive(contract.id);
                          setContracts(prev => prev.map(c => c.id === contract.id ? archived : c));
                        } catch (err: any) {
                          alert(err?.response?.data?.message || 'Không thể lưu trữ hợp đồng');
                        }
                      }}
                      className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm"
                    >
                      Lưu trữ
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* V14: Track Payments */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            {!loadingPayments && (
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Đã thanh toán', value: paymentSummary.totalPaid ?? 0, color: 'text-green-600' },
                  { label: 'Chờ thanh toán', value: paymentSummary.totalPending ?? 0, color: 'text-yellow-600' },
                  { label: 'Quá hạn', value: paymentSummary.totalOverdue ?? 0, color: 'text-red-600' },
                ].map(item => (
                  <div key={item.label} className="bg-card rounded-xl p-4 border border-border text-center">
                    <div className={`text-xl font-bold ${item.color}`}>{formatPrice(item.value)}</div>
                    <div className="text-sm text-muted-foreground mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold">Theo dõi thanh toán</h2>
              </div>
              {loadingPayments ? (
                <div className="p-6 space-y-3">
                  {[1,2,3].map(i => <div key={i} className="h-10 bg-muted/40 rounded animate-pulse" />)}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/30 border-b border-border">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium">Người thuê</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Hạn thanh toán</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Số tiền</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Trạng thái</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Ngày thanh toán</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.length === 0 ? (
                        <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Chưa có dữ liệu thanh toán</td></tr>
                      ) : payments.map(payment => (
                        <tr key={payment.id} className="border-b border-border last:border-0">
                          <td className="px-6 py-4 font-medium">{payment.tenant?.name ?? `#${payment.tenantId}`}</td>
                          <td className="px-6 py-4 text-sm">{formatDate(payment.dueDate)}</td>
                          <td className="px-6 py-4 font-semibold text-primary">{formatPrice(Number(payment.amount))}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${paymentStatusColor(payment.status)}`}>
                              {paymentStatusLabel(payment.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">{formatDate(payment.paidDate)}</td>
                          <td className="px-6 py-4">
                            {payment.status !== 'PAID' && (
                              <button
                                onClick={() => { setMarkPaidId(payment.id); setPaidDate(new Date().toISOString().slice(0, 10)); }}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-secondary transition-colors"
                              >
                                Đánh dấu đã TT
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* V15: Messages */}
        {activeTab === 'messages' && (
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">Tin nhắn</h2>
            <div className="text-center py-16">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                Sử dụng trang Tin nhắn để chat với người thuê
              </p>
              <Link
                to="/messages"
                className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-secondary transition-colors"
              >
                Đến trang Tin nhắn
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Mark as Paid dialog */}
      {markPaidId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Xác nhận thanh toán</h3>
            <div className="mb-4">
              <label className="block text-sm mb-2">Ngày thanh toán</label>
              <input
                type="date"
                value={paidDate}
                onChange={e => setPaidDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={handleMarkAsPaid}
                className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-secondary transition-colors">
                Xác nhận
              </button>
              <button onClick={() => setMarkPaidId(null)}
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
