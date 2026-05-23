import { Link } from 'react-router-dom';
import { MapPin, Maximize2, Star } from 'lucide-react';
import { Listing } from '../services/listingService';

interface ListingCardProps {
  listing: Listing;
}

const ROOM_TYPE_LABELS: Record<string, string> = {
  SINGLE_ROOM:    'Phòng trọ',
  SHARED_ROOM:    'Phòng ở ghép',
  APARTMENT:      'Căn hộ',
  MINI_APARTMENT: 'Căn hộ mini',
  DORMITORY:      'Ký túc xá',
};

export function ListingCard({ listing }: ListingCardProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  // Ảnh đầu tiên (isPrimary ưu tiên, không có thì lấy cái đầu tiên)
  const primaryImage =
    listing.images.find(img => img.isPrimary) ?? listing.images[0];

  // Địa chỉ hiển thị
  const location = [listing.district, listing.city].filter(Boolean).join(', ');

  // Tên tiện ích
  const amenityNames = listing.amenities.map(a => a.amenity.name);

  return (
    <Link to={`/listing/${listing.id}`} className="block group">
      <div className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
        <div className="relative h-48 overflow-hidden bg-muted">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              Chưa có ảnh
            </div>
          )}
          <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
            {ROOM_TYPE_LABELS[listing.roomType] ?? listing.roomType}
          </div>
          {listing.status === 'PUBLISHED' && (
            <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              Còn trống
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {listing.title}
          </h3>

          {location && (
            <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="line-clamp-1">{location}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Maximize2 className="w-4 h-4" />
                <span>{listing.area}m²</span>
              </div>
              {listing.avgRating && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>{listing.avgRating.toFixed(1)}</span>
                </div>
              )}
            </div>
            <div className="font-semibold text-lg text-primary">
              {formatPrice(listing.price)}/tháng
            </div>
          </div>

          {amenityNames.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {amenityNames.slice(0, 3).map((name, i) => (
                <span key={i} className="text-xs bg-accent px-2 py-1 rounded-md text-muted-foreground">
                  {name}
                </span>
              ))}
              {amenityNames.length > 3 && (
                <span className="text-xs text-muted-foreground">+{amenityNames.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
