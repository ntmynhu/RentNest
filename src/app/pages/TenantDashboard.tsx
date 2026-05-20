import { useState } from 'react';
import { Home, CreditCard, MessageSquare, Star, Flag } from 'lucide-react';

// V06: Tenant: My Room & Payments
export function TenantDashboard() {
  const [activeTab, setActiveTab] = useState<'room' | 'messages' | 'reviews'>('room');

  // Mock data for tenant's room
  const tenantRoom = {
    roomTitle: 'Phòng trọ cao cấp gần trường ĐH Bách Khoa',
    roomAddress: '123 Lý Thường Kiệt, Phường 7, Quận 10, TP. HCM',
    contractStatus: 'Đang hiệu lực',
    monthlyRent: 4500000
  };

  // Mock payment data
  const payments = [
    {
      paymentId: 'PAY-001',
      dueDate: '2026-06-01',
      amount: 4500000,
      paymentStatus: 'Chưa thanh toán',
      paymentDate: null
    },
    {
      paymentId: 'PAY-002',
      dueDate: '2026-05-01',
      amount: 4500000,
      paymentStatus: 'Đã thanh toán',
      paymentDate: '2026-04-28'
    },
    {
      paymentId: 'PAY-003',
      dueDate: '2026-04-01',
      amount: 4500000,
      paymentStatus: 'Đã thanh toán',
      paymentDate: '2026-03-30'
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (date: string | null) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('vi-VN');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Bảng điều khiển người thuê</h1>
          <p className="text-muted-foreground">Quản lý phòng trọ và thanh toán của bạn</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 border-b border-border mb-6">
          <button
            onClick={() => setActiveTab('room')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'room'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Home className="w-4 h-4 inline mr-2" />
            Phòng & Thanh toán
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
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'reviews'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Star className="w-4 h-4 inline mr-2" />
            Đánh giá
          </button>
        </div>

        {activeTab === 'room' && (
          <div className="space-y-6">
            {/* V06: My Room & Payments */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-xl font-semibold mb-4">Thông tin phòng hiện tại</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Tên phòng</label>
                  <p className="font-medium">{tenantRoom.roomTitle}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Trạng thái hợp đồng</label>
                  <p className="font-medium text-green-600">{tenantRoom.contractStatus}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-muted-foreground">Địa chỉ</label>
                  <p className="font-medium">{tenantRoom.roomAddress}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Tiền thuê hàng tháng</label>
                  <p className="text-xl font-bold text-primary">{formatPrice(tenantRoom.monthlyRent)}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-semibold">Lịch sử thanh toán</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/30 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium">Mã thanh toán</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Hạn thanh toán</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Số tiền</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Trạng thái</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Ngày thanh toán</th>
                      <th className="px-6 py-3 text-left text-sm font-medium">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.paymentId} className="border-b border-border last:border-0">
                        <td className="px-6 py-4 font-medium">{payment.paymentId}</td>
                        <td className="px-6 py-4 text-sm">{formatDate(payment.dueDate)}</td>
                        <td className="px-6 py-4 font-semibold text-primary">
                          {formatPrice(payment.amount)}
                        </td>
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
                              Thanh toán
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

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

        {activeTab === 'reviews' && (
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">Đánh giá & Xếp hạng</h2>
            {/* V08: Review & Rating Form */}
            <div className="max-w-2xl">
              <div className="mb-6">
                <label className="block text-sm mb-2">Phòng trọ</label>
                <input
                  type="text"
                  value={tenantRoom.roomTitle}
                  disabled
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm mb-2">Đánh giá (Sao)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Star className="w-6 h-6" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm mb-2">Nội dung đánh giá</label>
                <textarea
                  rows={5}
                  placeholder="Chia sẻ trải nghiệm của bạn về phòng trọ..."
                  className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-secondary transition-colors">
                Gửi đánh giá
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
