import { useState } from 'react';
import { Plus, Home, Users, DollarSign, Edit, Trash2, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router';
import { mockListings } from '../data/mockData';

export function LandlordDashboard() {
  const [activeTab, setActiveTab] = useState<'listings' | 'tenants' | 'payments'>('listings');

  const myListings = mockListings.filter(l => l.landlordId === 'l1');
  const approvedListings = myListings.filter(l => l.approvalStatus === 'approved');
  const pendingListings = myListings.filter(l => l.approvalStatus === 'pending');
  const availableListings = myListings.filter(l => l.status === 'available');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      approved: { text: 'Đã duyệt', bg: 'bg-green-500/10', color: 'text-green-600', icon: CheckCircle },
      pending: { text: 'Chờ duyệt', bg: 'bg-yellow-500/10', color: 'text-yellow-600', icon: Clock },
      rejected: { text: 'Bị từ chối', bg: 'bg-red-500/10', color: 'text-red-600', icon: XCircle }
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
    const Icon = badge.icon;
    return (
      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.color}`}>
        <Icon className="w-4 h-4" />
        {badge.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Bảng quản lý chủ nhà</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{myListings.length}</div>
              <div className="text-sm text-muted-foreground">Tổng tin đăng</div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{approvedListings.length}</div>
              <div className="text-sm text-muted-foreground">Đã duyệt</div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{pendingListings.length}</div>
              <div className="text-sm text-muted-foreground">Chờ duyệt</div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{availableListings.length}</div>
              <div className="text-sm text-muted-foreground">Còn trống</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 border-b border-border">
            <button
              onClick={() => setActiveTab('listings')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === 'listings'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Quản lý tin đăng
            </button>
            <button
              onClick={() => setActiveTab('tenants')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === 'tenants'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Quản lý người thuê
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === 'payments'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Thanh toán
            </button>
          </div>

          {activeTab === 'listings' && (
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-secondary transition-colors">
              <Plus className="w-5 h-5" />
              Đăng tin mới
            </button>
          )}
        </div>

        {activeTab === 'listings' && (
          <div className="space-y-4">
            {myListings.map(listing => (
              <div key={listing.id} className="bg-card rounded-xl p-6 border border-border">
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full md:w-48 h-32 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{listing.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {listing.address.district}, {listing.address.city}
                        </p>
                      </div>
                      {getStatusBadge(listing.approvalStatus)}
                    </div>

                    <div className="flex items-center gap-6 mt-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Giá: </span>
                        <span className="font-semibold text-primary">{formatPrice(listing.price)}/tháng</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Diện tích: </span>
                        <span className="font-semibold">{listing.area}m²</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Trạng thái: </span>
                        <span className={`font-semibold ${
                          listing.status === 'available' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {listing.status === 'available' ? 'Còn trống' : 'Đã thuê'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                      <Link
                        to={`/listing/${listing.id}`}
                        className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        Xem
                      </Link>
                      <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm">
                        <Edit className="w-4 h-4" />
                        Sửa
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-destructive text-destructive rounded-lg hover:bg-destructive/10 transition-colors text-sm">
                        <Trash2 className="w-4 h-4" />
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {myListings.length === 0 && (
              <div className="text-center py-16 bg-card rounded-xl border border-border">
                <Home className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Chưa có tin đăng nào</h3>
                <p className="text-muted-foreground mb-6">Bắt đầu đăng tin cho thuê phòng của bạn</p>
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-secondary transition-colors">
                  Đăng tin ngay
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tenants' && (
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="text-center py-16">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Quản lý người thuê</h3>
              <p className="text-muted-foreground">Chưa có người thuê nào</p>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="text-center py-16">
              <DollarSign className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Theo dõi thanh toán</h3>
              <p className="text-muted-foreground">Chưa có giao dịch nào</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
