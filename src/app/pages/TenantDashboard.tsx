import { useState, useEffect } from 'react';
import { Home, CreditCard, MessageSquare, Star, AlertCircle, CheckCircle, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { paymentService, Payment } from '../services/paymentService';
import { contractService, Contract } from '../services/contractService';
import { reviewService } from '../services/reviewService';

export function TenantDashboard() {
  const [activeTab, setActiveTab] = useState<'room' | 'messages' | 'reviews'>('room');

  // Payments state
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [paymentsLoading, setPaymentsLoading] = useState(true);

  // Contract / room state
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [contractsLoading, setContractsLoading] = useState(true);

  // Review form state
  const [selectedListingId, setSelectedListingId] = useState<number | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    paymentService.getAll()
      .then(res => {
        setPayments(res?.payments ?? []);
        setSummary(res?.summary ?? {});
      })
      .catch(() => {})
      .finally(() => setPaymentsLoading(false));

    contractService.getMine()
      .then(setContracts)
      .catch(() => {})
      .finally(() => setContractsLoading(false));
  }, []);

  // Pick the most recent ACTIVE contract as current room
  const activeContract = contracts.find(c => c.status === 'ACTIVE') ?? contracts[0] ?? null;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const formatDate = (date: string | null) =>
    date ? new Date(date).toLocaleDateString('vi-VN') : '-';

  const statusLabel = (s: string) => {
    const map: Record<string, string> = {
      PAID: 'Đã thanh toán',
      PENDING: 'Chờ thanh toán',
      OVERDUE: 'Quá hạn',
    };
    return map[s] ?? s;
  };

  const statusColor = (s: string) => {
    if (s === 'PAID') return 'bg-green-500/10 text-green-600';
    if (s === 'OVERDUE') return 'bg-red-500/10 text-red-600';
    return 'bg-yellow-500/10 text-yellow-600';
  };

  const contractStatusLabel = (s: string) => {
    const map: Record<string, string> = {
      DRAFT: 'Nháp', ACTIVE: 'Đang hiệu lực',
      ENDED: 'Đã kết thúc', EXPIRED: 'Hết hạn', ARCHIVED: 'Lưu trữ',
    };
    return map[s] ?? s;
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListingId) { setReviewError('Vui lòng chọn phòng để đánh giá'); return; }
    if (reviewRating === 0) { setReviewError('Vui lòng chọn số sao'); return; }
    setReviewError('');
    setReviewSuccess('');
    setReviewSubmitting(true);
    try {
      await reviewService.create(selectedListingId, { rating: reviewRating, text: reviewText || undefined });
      setReviewSuccess('Đánh giá của bạn đã được gửi thành công!');
      setReviewRating(0);
      setReviewText('');
    } catch (err: any) {
      setReviewError(err?.response?.data?.message || 'Không thể gửi đánh giá. Bạn chỉ có thể đánh giá sau khi đã dọn ra.');
    } finally {
      setReviewSubmitting(false);
    }
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
          {[
            { key: 'room', icon: <Home className="w-4 h-4 inline mr-2" />, label: 'Phòng & Thanh toán' },
            { key: 'messages', icon: <MessageSquare className="w-4 h-4 inline mr-2" />, label: 'Tin nhắn' },
            { key: 'reviews', icon: <Star className="w-4 h-4 inline mr-2" />, label: 'Đánh giá' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
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

        {/* Tab: Phòng & Thanh toán */}
        {activeTab === 'room' && (
          <div className="space-y-6">
            {/* Room info from active contract */}
            {contractsLoading ? (
              <div className="bg-card rounded-xl p-6 border border-border animate-pulse h-36" />
            ) : activeContract ? (
              <div className="bg-card rounded-xl p-6 border border-border">
                <h2 className="text-xl font-semibold mb-4">Thông tin phòng hiện tại</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Tên phòng</label>
                    <p className="font-medium">{activeContract.listing?.title ?? 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Trạng thái hợp đồng</label>
                    <p className="font-medium text-green-600">{contractStatusLabel(activeContract.status)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm text-muted-foreground">Địa chỉ</label>
                    <p className="font-medium">{activeContract.listing?.address ?? 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Tiền thuê hàng tháng</label>
                    <p className="text-xl font-bold text-primary">{formatPrice(activeContract.rentAmount)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Thời hạn</label>
                    <p className="font-medium">
                      {formatDate(activeContract.startDate)} — {formatDate(activeContract.endDate)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-xl p-6 border border-border text-center text-muted-foreground">
                Bạn chưa có hợp đồng thuê phòng nào.
              </div>
            )}

            {/* Payment history */}
            {!paymentsLoading && summary && (
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Đã thanh toán', value: summary.totalPaid ?? 0, color: 'text-green-600' },
                  { label: 'Chờ thanh toán', value: summary.totalPending ?? 0, color: 'text-yellow-600' },
                  { label: 'Quá hạn', value: summary.totalOverdue ?? 0, color: 'text-red-600' },
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
                <h2 className="text-xl font-semibold">Lịch sử thanh toán</h2>
              </div>
              {paymentsLoading ? (
                <div className="p-6 animate-pulse space-y-3">
                  {[1,2,3].map(i => <div key={i} className="h-10 bg-muted/40 rounded" />)}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/30 border-b border-border">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium">Mã</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Hạn thanh toán</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Số tiền</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Trạng thái</th>
                        <th className="px-6 py-3 text-left text-sm font-medium">Ngày thanh toán</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                            Chưa có lịch sử thanh toán
                          </td>
                        </tr>
                      ) : payments.map((payment) => (
                        <tr key={payment.id} className="border-b border-border last:border-0">
                          <td className="px-6 py-4 font-medium text-sm">#{payment.id}</td>
                          <td className="px-6 py-4 text-sm">{formatDate(payment.dueDate)}</td>
                          <td className="px-6 py-4 font-semibold text-primary">
                            {formatPrice(Number(payment.amount))}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(payment.status)}`}>
                              {statusLabel(payment.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">{formatDate(payment.paidDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Tin nhắn */}
        {activeTab === 'messages' && (
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">Tin nhắn</h2>
            <div className="text-center py-16">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                Sử dụng trang Tin nhắn để chat trực tiếp với chủ nhà
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

        {/* Tab: Đánh giá */}
        {activeTab === 'reviews' && (
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-xl font-semibold mb-4">Đánh giá & Xếp hạng</h2>
            <div className="max-w-2xl">
              {reviewError && (
                <div className="mb-4 flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {reviewError}
                </div>
              )}
              {reviewSuccess && (
                <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  {reviewSuccess}
                </div>
              )}

              <form onSubmit={handleSubmitReview}>
                <div className="mb-6">
                  <label className="block text-sm mb-2">Phòng trọ muốn đánh giá</label>
                  {contractsLoading ? (
                    <div className="h-12 bg-muted/40 rounded-lg animate-pulse" />
                  ) : contracts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Bạn chưa có hợp đồng nào để đánh giá.</p>
                  ) : (
                    <select
                      value={selectedListingId ?? ''}
                      onChange={e => setSelectedListingId(Number(e.target.value) || null)}
                      className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">-- Chọn phòng --</option>
                      {contracts.map(c => (
                        <option key={c.id} value={c.listingId}>
                          {c.listing?.title ?? `Phòng #${c.listingId}`}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-sm mb-2">Đánh giá (Sao)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 transition-colors ${
                          reviewRating >= star
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Star className="w-6 h-6" />
                      </button>
                    ))}
                    {reviewRating > 0 && (
                      <span className="self-center text-sm text-muted-foreground ml-2">
                        {reviewRating}/5 sao
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm mb-2">Nội dung đánh giá</label>
                  <textarea
                    rows={5}
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    placeholder="Chia sẻ trải nghiệm của bạn về phòng trọ..."
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  {reviewSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </form>

              <p className="mt-4 text-xs text-muted-foreground">
                * Bạn chỉ có thể đánh giá sau khi đã dọn ra khỏi phòng.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
