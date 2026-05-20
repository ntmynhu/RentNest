import { Link } from 'react-router';
import { Search, Home, ShieldCheck, MessageSquare, TrendingUp } from 'lucide-react';
import { ListingCard } from '../components/ListingCard';
import { mockListings } from '../data/mockData';

export function HomePage() {
  const approvedListings = mockListings.filter(l => l.approvalStatus === 'approved');
  const popularListings = approvedListings.slice(0, 4);

  return (
    <div>
      <section className="relative bg-gradient-to-br from-accent via-background to-accent/50 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Tìm <span className="text-primary">Tổ Ấm</span> Của Bạn
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nền tảng cho thuê phòng trọ uy tín, kết nối người thuê và chủ nhà một cách dễ dàng và an toàn
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-card rounded-2xl shadow-lg p-4 border border-border">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Nhập địa điểm, quận, thành phố..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Link
                to="/browse"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-secondary transition-colors text-center"
              >
                Tìm kiếm
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Đa dạng lựa chọn</h3>
              <p className="text-muted-foreground">
                Hàng ngàn phòng trọ, căn hộ từ giá rẻ đến cao cấp
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Xác thực tin đăng</h3>
              <p className="text-muted-foreground">
                Mọi tin đăng đều được kiểm duyệt kỹ lưỡng
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Liên hệ trực tiếp</h3>
              <p className="text-muted-foreground">
                Nhắn tin ngay với chủ nhà qua hệ thống
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Phòng nổi bật</h2>
              <p className="text-muted-foreground">Các phòng trọ được quan tâm nhiều nhất</p>
            </div>
            <Link
              to="/browse"
              className="flex items-center gap-2 text-primary hover:text-secondary transition-colors font-medium"
            >
              Xem tất cả
              <TrendingUp className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Dành cho chủ nhà</h2>
              <p className="text-muted-foreground mb-6">
                Đăng tin cho thuê miễn phí, quản lý phòng trọ dễ dàng với RentNest.
                Hệ thống giúp bạn quản lý hợp đồng, theo dõi thanh toán và kết nối với người thuê uy tín.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span>Đăng tin miễn phí, không giới hạn</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span>Quản lý hợp đồng và thanh toán</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span>Nhận thông báo khi có người quan tâm</span>
                </li>
              </ul>
              <Link
                to="/auth"
                className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-secondary transition-colors"
              >
                Đăng ký làm chủ nhà
              </Link>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
                alt="Landlord dashboard"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
