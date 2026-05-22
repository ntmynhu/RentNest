import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MapPin, Heart, MessageSquare, Share2, CheckCircle2, Star, X, AlertCircle } from 'lucide-react';
import { listingService, Listing } from '../services/listingService';
import { reviewService, Review } from '../services/reviewService';
import { messageService } from '../services/messageService';
import { reportService } from '../services/reportService';
import { useAuth } from '../context/AuthContext';

const ROOM_TYPE_LABELS: Record<string, string> = {
  SINGLE_ROOM: 'Phòng trọ',
  SHARED_ROOM: 'Phòng ở ghép',
  APARTMENT: 'Căn hộ',
  MINI_APARTMENT: 'Căn hộ mini',
  DORMITORY: 'Ký túc xá',
};

export function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Contact dialog
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [contactMessage, setContactMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [sendSuccess, setSendSuccess] = useState(false);

  // Report dialog
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    const listingId = parseInt(id);
    if (isNaN(listingId)) { setNotFound(true); setLoading(false); return; }

    Promise.all([
      listingService.getById(listingId),
      reviewService.getByListing(listingId),
    ])
      .then(([listingData, reviewData]) => {
        setListing(listingData);
        setReviews(reviewData);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate('/auth'); return; }
    if (!listing || !contactMessage.trim()) return;

    setIsSending(true);
    setSendError('');
    try {
      await messageService.sendToLandlord(listing.landlordId, contactMessage, listing.id);
      setSendSuccess(true);
      setContactMessage('');
    } catch (err: any) {
      setSendError(err?.response?.data?.message || 'Không thể gửi tin nhắn, vui lòng thử lại');
    } finally {
      setIsSending(false);
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate('/auth'); return; }
    if (!listing || !reportReason.trim()) return;

    setIsReporting(true);
    try {
      await reportService.create({
        reportedItemType: 'LISTING',
        reportedItemId: listing.id,
        reason: reportReason,
      });
      setReportSuccess(true);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Không thể gửi báo cáo');
    } finally {
      setIsReporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-96 bg-muted/40 rounded-xl animate-pulse" />
              <div className="h-64 bg-muted/40 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="h-48 bg-muted/40 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy phòng</h2>
          <Link to="/browse" className="text-primary hover:underline">
            Quay lại trang tìm kiếm
          </Link>
        </div>
      </div>
    );
  }

  const avgRating = listing.avgRating ?? (
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : null
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2">
            {/* Image gallery */}
            <div className="mb-6">
              <div className="relative h-96 rounded-xl overflow-hidden bg-muted">
                {listing.images.length > 0 ? (
                  <img
                    src={listing.images[currentImageIndex]?.url}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Không có ảnh
                  </div>
                )}
                {listing.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {listing.images.map((_, index) => (
                      <button key={index} onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentImageIndex ? 'bg-primary w-8' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              {listing.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {listing.images.map((img, index) => (
                    <button key={index} onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Listing info */}
            <div className="bg-card rounded-xl p-6 border border-border mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {ROOM_TYPE_LABELS[listing.roomType] ?? listing.roomType}
                    </span>
                    {listing.status === 'PUBLISHED' && (
                      <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm font-medium">
                        Còn trống
                      </span>
                    )}
                    {avgRating && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500/10 text-yellow-600 rounded-full text-sm font-medium">
                        <Star className="w-4 h-4" />
                        {avgRating.toFixed(1)} ({listing.reviewCount} đánh giá)
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-5 h-5 flex-shrink-0" />
                    <span>{listing.address}{listing.district ? `, ${listing.district}` : ''}{listing.city ? `, ${listing.city}` : ''}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 py-4 border-y border-border">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Giá thuê</div>
                  <div className="text-2xl font-bold text-primary">{formatPrice(listing.price)}/tháng</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Diện tích</div>
                  <div className="text-xl font-semibold">{listing.area}m²</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Lượt xem</div>
                  <div className="text-xl font-semibold">{listing.viewCount}</div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-3">Mô tả</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{listing.description}</p>
              </div>

              {listing.amenities.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-lg mb-3">Tiện ích</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {listing.amenities.map((a, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        <span>{a.amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews section */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="font-semibold text-xl">Đánh giá</h3>
                {avgRating && (
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-5 h-5 ${s <= Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">({reviews.length} đánh giá)</span>
                  </div>
                )}
              </div>

              {reviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-6">Chưa có đánh giá nào</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b border-border pb-4 last:border-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">
                            {review.tenant?.name?.charAt(0) ?? '?'}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-sm">{review.tenant?.name ?? 'Ẩn danh'}</div>
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      {review.text && <p className="text-sm text-muted-foreground">{review.text}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Landlord card */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {listing.landlord?.fullName?.charAt(0) ?? 'L'}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">{listing.landlord?.fullName ?? 'Chủ nhà'}</div>
                    <div className="text-sm text-muted-foreground">Chủ nhà</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!user) navigate('/auth');
                    else setShowContactDialog(true);
                  }}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-secondary transition-colors mb-2"
                >
                  <MessageSquare className="w-5 h-5 inline mr-2" />
                  Nhắn tin cho chủ nhà
                </button>

                <button
                  onClick={() => {
                    if (!user) navigate('/auth');
                    else setShowReportDialog(true);
                  }}
                  className="w-full px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent transition-colors text-sm"
                >
                  Báo cáo vi phạm
                </button>
              </div>

              {/* Listing info */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold mb-4">Thông tin thêm</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Mã tin</span>
                    <span className="font-medium">#{listing.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Ngày đăng</span>
                    <span className="font-medium">{new Date(listing.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Trạng thái</span>
                    <span className={`font-medium ${listing.status === 'PUBLISHED' ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {listing.status === 'PUBLISHED' ? 'Còn trống' : 'Không khả dụng'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Dialog */}
      {showContactDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Nhắn tin cho chủ nhà</h3>
              <button onClick={() => { setShowContactDialog(false); setSendError(''); setSendSuccess(false); }}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {sendSuccess ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="font-semibold text-lg">Đã gửi tin nhắn thành công!</p>
                <p className="text-muted-foreground text-sm mt-1">Chủ nhà sẽ phản hồi sớm</p>
                <button
                  onClick={() => navigate('/messages')}
                  className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-secondary transition-colors"
                >
                  Xem tin nhắn
                </button>
              </div>
            ) : (
              <form onSubmit={handleContact}>
                {sendError && (
                  <div className="mb-3 flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {sendError}
                  </div>
                )}
                <p className="text-sm text-muted-foreground mb-3">
                  Gửi tin nhắn đến <strong>{listing.landlord?.fullName}</strong> về phòng "{listing.title}"
                </p>
                <textarea
                  rows={4}
                  value={contactMessage}
                  onChange={e => setContactMessage(e.target.value)}
                  placeholder="Xin chào, tôi muốn hỏi thêm về phòng này..."
                  className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none mb-4"
                />
                <button
                  type="submit"
                  disabled={isSending || !contactMessage.trim()}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  {isSending ? 'Đang gửi...' : 'Gửi tin nhắn'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Report Dialog */}
      {showReportDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Báo cáo vi phạm</h3>
              <button onClick={() => { setShowReportDialog(false); setReportSuccess(false); }}>
                <X className="w-6 h-6" />
              </button>
            </div>

            {reportSuccess ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="font-semibold">Báo cáo đã được gửi!</p>
                <p className="text-muted-foreground text-sm mt-1">Chúng tôi sẽ xem xét trong vòng 24h</p>
                <button onClick={() => setShowReportDialog(false)}
                  className="mt-4 px-6 py-2 border border-border rounded-lg">
                  Đóng
                </button>
              </div>
            ) : (
              <form onSubmit={handleReport}>
                <div className="mb-4">
                  <label className="block text-sm mb-2">Lý do báo cáo</label>
                  <select
                    value={reportReason}
                    onChange={e => setReportReason(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">-- Chọn lý do --</option>
                    <option value="SPAM">Tin đăng spam / lặp lại</option>
                    <option value="FRAUD">Lừa đảo / thông tin sai sự thật</option>
                    <option value="INAPPROPRIATE">Nội dung không phù hợp</option>
                    <option value="WRONG_PRICE">Giá không đúng thực tế</option>
                    <option value="OTHER">Lý do khác</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isReporting || !reportReason}
                  className="w-full px-6 py-3 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50"
                >
                  {isReporting ? 'Đang gửi...' : 'Gửi báo cáo'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
