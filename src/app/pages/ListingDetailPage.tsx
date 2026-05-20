import { useParams, Link } from 'react-router';
import { useState } from 'react';
import { MapPin, Maximize2, Calendar, Heart, MessageSquare, Share2, CheckCircle2, X } from 'lucide-react';
import { mockListings } from '../data/mockData';

export function ListingDetailPage() {
  const { id } = useParams();
  const listing = mockListings.find(l => l.id === id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactDialog, setShowContactDialog] = useState(false);

  if (!listing) {
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getRoomTypeLabel = (type: string) => {
    const labels = {
      studio: 'Phòng trọ',
      shared: 'Phòng ở ghép',
      apartment: 'Căn hộ',
      house: 'Nhà nguyên căn'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="relative h-96 rounded-xl overflow-hidden bg-muted">
                <img
                  src={listing.images[currentImageIndex]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
                {listing.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {listing.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
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
                  {listing.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-card rounded-xl p-6 border border-border mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {getRoomTypeLabel(listing.roomType)}
                    </span>
                    {listing.status === 'available' && (
                      <span className="px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-sm font-medium">
                        Còn trống
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-5 h-5" />
                    <span>
                      {listing.address.street}, {listing.address.ward}, {listing.address.district}, {listing.address.city}
                    </span>
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                  <Heart className="w-6 h-6" />
                </button>
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
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-3">Mô tả</h3>
                <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-3">Tiện ích</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {listing.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-3">Tiện ích cơ bản</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      listing.utilities.electricity ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {listing.utilities.electricity ?
                        <CheckCircle2 className="w-4 h-4 text-white" /> :
                        <X className="w-4 h-4 text-white" />
                      }
                    </div>
                    <span>Điện</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      listing.utilities.water ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {listing.utilities.water ?
                        <CheckCircle2 className="w-4 h-4 text-white" /> :
                        <X className="w-4 h-4 text-white" />
                      }
                    </div>
                    <span>Nước</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      listing.utilities.internet ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {listing.utilities.internet ?
                        <CheckCircle2 className="w-4 h-4 text-white" /> :
                        <X className="w-4 h-4 text-white" />
                      }
                    </div>
                    <span>Internet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      listing.utilities.parking ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {listing.utilities.parking ?
                        <CheckCircle2 className="w-4 h-4 text-white" /> :
                        <X className="w-4 h-4 text-white" />
                      }
                    </div>
                    <span>Chỗ đậu xe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      listing.utilities.aircon ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {listing.utilities.aircon ?
                        <CheckCircle2 className="w-4 h-4 text-white" /> :
                        <X className="w-4 h-4 text-white" />
                      }
                    </div>
                    <span>Điều hòa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-card rounded-xl p-6 border border-border mb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {listing.landlordName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">{listing.landlordName}</div>
                    <div className="text-sm text-muted-foreground">Chủ nhà</div>
                  </div>
                </div>

                <button
                  onClick={() => setShowContactDialog(true)}
                  className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-secondary transition-colors mb-2"
                >
                  <MessageSquare className="w-5 h-5 inline mr-2" />
                  Nhắn tin cho chủ nhà
                </button>

                <button className="w-full px-6 py-3 border border-border rounded-lg font-medium hover:bg-accent transition-colors">
                  <Share2 className="w-5 h-5 inline mr-2" />
                  Chia sẻ
                </button>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold mb-4">Thông tin thêm</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Mã tin</span>
                    <span className="font-medium">#{listing.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Ngày đăng</span>
                    <span className="font-medium">
                      {new Date(listing.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Trạng thái</span>
                    <span className="font-medium text-green-600">
                      {listing.status === 'available' ? 'Còn trống' : 'Đã thuê'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showContactDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Liên hệ chủ nhà</h3>
              <button onClick={() => setShowContactDialog(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-muted-foreground mb-4">
              Vui lòng đăng nhập để nhắn tin với chủ nhà
            </p>
            <Link
              to="/auth"
              className="block w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-secondary transition-colors text-center"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
