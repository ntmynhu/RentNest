import { useState } from 'react';
import { Plus, Home, Users, FileText, DollarSign, MessageSquare, Edit, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockListings } from '../data/mockData';

// V10-V16: Landlord Dashboard Views
export function LandlordDashboardNew() {
  const [activeTab, setActiveTab] = useState<'listings' | 'tenants' | 'contracts' | 'payments' | 'messages'>('listings');
  const [showPostForm, setShowPostForm] = useState(false);

  const myListings = mockListings.filter(l => l.landlordId === 'l1');

  // Mock tenant data (V12)
  const tenants = [
    {
      id: 'tenant-001',
      tenantName: 'Nguyễn Văn Minh',
      phoneNumber: '0901234567',
      email: 'minh@email.com',
      roomId: '1',
      moveInDate: '2026-01-15',
      moveOutDate: null
    },
    {
      id: 'tenant-002',
      tenantName: 'Lê Thị Hương',
      phoneNumber: '0902345678',
      email: 'huong@email.com',
      roomId: '3',
      moveInDate: '2026-02-01',
      moveOutDate: null
    }
  ];

  // Mock contract data (V13)
  const contracts = [
    {
      id: 'contract-001',
      tenantId: 'tenant-001',
      tenantName: 'Nguyễn Văn Minh',
      roomId: '1',
      roomTitle: 'Phòng trọ cao cấp gần trường ĐH Bách Khoa',
      startDate: '2026-01-15',
      endDate: '2026-07-15',
      rentAmount: 4500000,
      terms: 'Hợp đồng 6 tháng, thanh toán đầu mỗi tháng',
      contractStatus: 'Đang hiệu lực'
    }
  ];

  // Mock payment tracking data (V14)
  const paymentTracking = [
    {
      tenantName: 'Nguyễn Văn Minh',
      paymentId: 'PAY-001',
      dueDate: '2026-06-01',
      amount: 4500000,
      paymentStatus: 'Chưa thanh toán',
      paymentDate: null
    },
    {
      tenantName: 'Nguyễn Văn Minh',
      paymentId: 'PAY-002',
      dueDate: '2026-05-01',
      amount: 4500000,
      paymentStatus: 'Đã thanh toán',
      paymentDate: '2026-04-28'
    },
    {
      tenantName: 'Lê Thị Hương',
      paymentId: 'PAY-003',
      dueDate: '2026-06-01',
      amount: 2000000,
      paymentStatus: 'Đã thanh toán',
      paymentDate: '2026-05-30'
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'Chưa có';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Bảng điều khiển chủ nhà</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{myListings.length}</div>
              <div className="text-sm text-muted-foreground">Tin đăng</div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{tenants.length}</div>
              <div className="text-sm text-muted-foreground">Người thuê</div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{contracts.length}</div>
              <div className="text-sm text-muted-foreground">Hợp đồng</div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">
                {paymentTracking.filter(p => p.paymentStatus === 'Chưa thanh toán').length}
              </div>
              <div className="text-sm text-muted-foreground">Chờ thanh toán</div>
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
              <Home className="w-4 h-4 inline mr-2" />
              Tin đăng
            </button>
            <button
              onClick={() => setActiveTab('tenants')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === 'tenants'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Người thuê
            </button>
            <button
              onClick={() => setActiveTab('contracts')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === 'contracts'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Hợp đồng
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === 'payments'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <DollarSign className="w-4 h-4 inline mr-2" />
              Thanh toán
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === 'messages'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Tin nhắn
            </button>
          </div>

          {activeTab === 'listings' && (
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
                        <p className="text-sm text-muted-foreground">{listing.address.district}, {listing.address.city}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        listing.approvalStatus === 'approved' ? 'bg-green-500/10 text-green-600' :
                        listing.approvalStatus === 'pending' ? 'bg-yellow-500/10 text-yellow-600' :
                        'bg-red-500/10 text-red-600'
                      }`}>
                        {listing.approvalStatus === 'approved' ? 'Đã duyệt' :
                         listing.approvalStatus === 'pending' ? 'Chờ duyệt' : 'Bị từ chối'}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 mt-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Giá: </span>
                        <span className="font-semibold text-primary">{formatPrice(listing.price)}</span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Ngày đăng: </span>
                        <span className="text-sm">{formatDate(listing.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <Link to={`/listing/${listing.id}`} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm">
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
          </div>
        )}

        {/* V11: Post/Edit Listing Form */}
        {activeTab === 'listings' && showPostForm && (
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Đăng tin mới</h2>
              <button onClick={() => setShowPostForm(false)} className="text-muted-foreground hover:text-foreground">
                Đóng
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm mb-2">Hình ảnh phòng</label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <p className="text-muted-foreground">Nhấp để tải lên hoặc kéo thả hình ảnh</p>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-2">Tiêu đề tin đăng</label>
                <input type="text" className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm mb-2">Giá thuê (VNĐ/tháng)</label>
                <input type="number" className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm mb-2">Diện tích (m²)</label>
                <input type="number" className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm mb-2">Tỉnh/Thành phố</label>
                <select className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>TP. Hồ Chí Minh</option>
                  <option>Hà Nội</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2">Quận/Huyện</label>
                <select className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Quận 1</option>
                  <option>Quận 10</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2">Phường/Xã</label>
                <input type="text" className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm mb-2">Loại phòng</label>
                <select className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Phòng trọ</option>
                  <option>Căn hộ</option>
                  <option>Nhà nguyên căn</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-2">Địa chỉ cụ thể</label>
                <input type="text" className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-2">Mô tả</label>
                <textarea rows={5} className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"></textarea>
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-secondary transition-colors">
                  Gửi duyệt
                </button>
                <button className="px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent transition-colors">
                  Lưu nháp
                </button>
              </div>
            </div>
          </div>
        )}

        {/* V12: Manage Tenants */}
        {activeTab === 'tenants' && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-semibold">Quản lý người thuê</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-secondary transition-colors">
                <Plus className="w-4 h-4" />
                Thêm người thuê
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium">Tên người thuê</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Số điện thoại</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Phòng</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Ngày vào</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map(tenant => (
                    <tr key={tenant.id} className="border-b border-border last:border-0">
                      <td className="px-6 py-4 font-medium">{tenant.tenantName}</td>
                      <td className="px-6 py-4 text-sm">{tenant.phoneNumber}</td>
                      <td className="px-6 py-4 text-sm">{tenant.email}</td>
                      <td className="px-6 py-4 text-sm">Phòng #{tenant.roomId}</td>
                      <td className="px-6 py-4 text-sm">{formatDate(tenant.moveInDate)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-accent rounded-lg">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-destructive/10 text-destructive rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* V13: Manage Contracts */}
        {activeTab === 'contracts' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-secondary transition-colors">
                <Plus className="w-5 h-5" />
                Tạo hợp đồng mới
              </button>
            </div>
            {contracts.map(contract => (
              <div key={contract.id} className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{contract.roomTitle}</h3>
                    <p className="text-sm text-muted-foreground">Người thuê: {contract.tenantName}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm font-medium">
                    {contract.contractStatus}
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
                    <label className="text-sm text-muted-foreground">Điều khoản</label>
                    <p className="text-sm">{contract.terms}</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm">
                    <Edit className="w-4 h-4" />
                    Cập nhật
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm">
                    Lưu trữ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* V14: Track Payments */}
        {activeTab === 'payments' && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold">Theo dõi thanh toán</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30 border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium">Người thuê</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Mã thanh toán</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Hạn thanh toán</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Số tiền</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Ngày thanh toán</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentTracking.map(payment => (
                    <tr key={payment.paymentId} className="border-b border-border last:border-0">
                      <td className="px-6 py-4 font-medium">{payment.tenantName}</td>
                      <td className="px-6 py-4 text-sm">{payment.paymentId}</td>
                      <td className="px-6 py-4 text-sm">{formatDate(payment.dueDate)}</td>
                      <td className="px-6 py-4 font-semibold text-primary">{formatPrice(payment.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          payment.paymentStatus === 'Đã thanh toán'
                            ? 'bg-green-500/10 text-green-600'
                            : 'bg-yellow-500/10 text-yellow-600'
                        }`}>
                          {payment.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{formatDate(payment.paymentDate)}</td>
                      <td className="px-6 py-4">
                        {payment.paymentStatus === 'Chưa thanh toán' && (
                          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-secondary transition-colors">
                            Cập nhật
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* V15: Messaging */}
        {activeTab === 'messages' && (
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">Tin nhắn</h2>
            <div className="text-center py-16">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Chức năng tin nhắn - Xem trang Messages để sử dụng
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
