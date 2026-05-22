import { Link } from 'react-router-dom';
import { MapPin, Maximize2, DollarSign } from 'lucide-react';
import { Listing } from '../data/mockData';

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
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
    <Link to={`/listing/${listing.id}`} className="block group">
      <div className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
        <div className="relative h-48 overflow-hidden">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
            {getRoomTypeLabel(listing.roomType)}
          </div>
          {listing.status === 'available' && (
            <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              Còn trống
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {listing.title}
          </h3>

          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">
              {listing.address.district}, {listing.address.city}
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{listing.area}m²</span>
            </div>
            <div className="font-semibold text-lg text-primary">
              {formatPrice(listing.price)}/tháng
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {listing.amenities.slice(0, 3).map((amenity, index) => (
              <span
                key={index}
                className="text-xs bg-accent px-2 py-1 rounded-md text-muted-foreground"
              >
                {amenity}
              </span>
            ))}
            {listing.amenities.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{listing.amenities.length - 3} tiện ích
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
