import { useState } from 'react';
import { CheckCircle, XCircle, Clock, Users, Home, TrendingUp, Eye } from 'lucide-react';
import { Link } from 'react-router';
import { mockListings, mockUsers } from '../data/mockData';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'users' | 'stats'>('pending');

  const pendingListings = mockListings.filter(l => l.approvalStatus === 'pending');
  const approvedListings = mockListings.filter(l => l.approvalStatus === 'approved');
  const rejectedListings = mockListings.filter(l => l.approvalStatus === 'rejected');

  const totalListings = mockListings.length;
  const totalUsers = mockUsers.length;
  const totalLandlords = mockUsers.filter(u => u.role === 'landlord').length;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleApprove = (listingId: string) => {
    console.log('Approved listing:', listingId);
  };

  const handleReject = (listingId: string) => {
    console.log('Rejected listing:', listingId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Bảng quản trị viên</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{totalListings}</div>
              <div className="text-sm text-muted-foreground">Tổng tin đăng</div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{totalUsers}</div>
              <div className="text-sm text-muted-foreground">Tổng người dùng</div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{totalLandlords}</div>
              <div className="text-sm text-muted-foreground">Chủ nhà</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 border-b border-border mb-6">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'pending'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Chờ duyệt ({pendingListings.length})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'approved'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Đã duyệt ({approvedListings.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'users'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Người dùng
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'stats'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Thống kê
          </button>
        </div>

        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingListings.map(listing => (
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
                          {listing.address.street}, {listing.address.district}, {listing.address.city}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Chủ nhà: <span className="font-medium">{listing.landlordName}</span>
                        </p>
                      </div>
                      <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/10 text-yellow-600">
                        <Clock className="w-4 h-4" />
                        Chờ duyệt
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{listing.description}</p>

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
                        <span className="text-muted-foreground">Ngày đăng: </span>
                        <span className="font-semibold">
                          {new Date(listing.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                      <Link
                        to={`/listing/${listing.id}`}
                        className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm"
                      >
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
                        onClick={() => handleReject(listing.id)}
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

            {pendingListings.length === 0 && (
              <div className="text-center py-16 bg-card rounded-xl border border-border">
                <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Không có tin đăng nào chờ duyệt</h3>
                <p className="text-muted-foreground">Tất cả tin đăng đã được xử lý</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'approved' && (
          <div className="space-y-4">
            {approvedListings.map(listing => (
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
                      <span className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        Đã duyệt
                      </span>
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
                    </div>

                    <div className="mt-4">
                      <Link
                        to={`/listing/${listing.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm"
                      >
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

        {activeTab === 'users' && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">Tên</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Số điện thoại</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Vai trò</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map(user => (
                  <tr key={user.id} className="border-b border-border last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="font-bold text-primary">{user.name.charAt(0)}</span>
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{user.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === 'landlord'
                          ? 'bg-primary/10 text-primary'
                          : user.role === 'admin'
                          ? 'bg-purple-500/10 text-purple-600'
                          : 'bg-blue-500/10 text-blue-600'
                      }`}>
                        {user.role === 'landlord' ? 'Chủ nhà' : user.role === 'admin' ? 'Quản trị viên' : 'Người thuê'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-semibold text-lg mb-4">Thống kê tin đăng</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tổng tin đăng</span>
                  <span className="text-2xl font-bold">{totalListings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Đã duyệt</span>
                  <span className="text-xl font-semibold text-green-600">{approvedListings.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Chờ duyệt</span>
                  <span className="text-xl font-semibold text-yellow-600">{pendingListings.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Từ chối</span>
                  <span className="text-xl font-semibold text-red-600">{rejectedListings.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-semibold text-lg mb-4">Thống kê người dùng</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tổng người dùng</span>
                  <span className="text-2xl font-bold">{totalUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Chủ nhà</span>
                  <span className="text-xl font-semibold text-primary">{totalLandlords}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
