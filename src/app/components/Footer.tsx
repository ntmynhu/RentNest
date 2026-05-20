import { Link } from 'react-router';
import { Home, Facebook, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-xl">RentNest</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Nền tảng cho thuê phòng trọ uy tín, kết nối người thuê và chủ nhà một cách dễ dàng.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Về chúng tôi</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition-colors">Giới thiệu</Link></li>
              <li><Link to="/how-it-works" className="hover:text-foreground transition-colors">Cách hoạt động</Link></li>
              <li><Link to="/pricing" className="hover:text-foreground transition-colors">Bảng giá</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/faq" className="hover:text-foreground transition-colors">Câu hỏi thường gặp</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Liên hệ</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">Điều khoản sử dụng</Link></li>
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">Chính sách bảo mật</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>1900 xxxx</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@rentnest.vn</span>
              </li>
              <li className="flex items-center gap-2 mt-4">
                <a href="#" className="hover:text-foreground transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 RentNest. Bản quyền thuộc về RentNest Vietnam.</p>
        </div>
      </div>
    </footer>
  );
}
