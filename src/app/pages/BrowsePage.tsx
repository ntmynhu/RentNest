import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ListingCard } from '../components/ListingCard';
import { mockListings } from '../data/mockData';

export function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    areaMin: '',
    areaMax: '',
    roomType: 'all',
    amenities: [] as string[]
  });

  const approvedListings = mockListings.filter(l => l.approvalStatus === 'approved');

  const filteredListings = approvedListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.address.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.address.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPrice =
      (!filters.priceMin || listing.price >= Number(filters.priceMin)) &&
      (!filters.priceMax || listing.price <= Number(filters.priceMax));

    const matchesArea =
      (!filters.areaMin || listing.area >= Number(filters.areaMin)) &&
      (!filters.areaMax || listing.area <= Number(filters.areaMax));

    const matchesRoomType = filters.roomType === 'all' || listing.roomType === filters.roomType;

    return matchesSearch && matchesPrice && matchesArea && matchesRoomType;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 border-b border-border py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Tìm kiếm phòng trọ</h1>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm theo tên, địa điểm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-background border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Bộ lọc</span>
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-6 bg-background rounded-lg border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Bộ lọc nâng cao</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm mb-2">Giá tối thiểu</label>
                  <input
                    type="number"
                    placeholder="VNĐ"
                    value={filters.priceMin}
                    onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Giá tối đa</label>
                  <input
                    type="number"
                    placeholder="VNĐ"
                    value={filters.priceMax}
                    onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Diện tích tối thiểu (m²)</label>
                  <input
                    type="number"
                    placeholder="m²"
                    value={filters.areaMin}
                    onChange={(e) => setFilters({...filters, areaMin: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Loại phòng</label>
                  <select
                    value={filters.roomType}
                    onChange={(e) => setFilters({...filters, roomType: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">Tất cả</option>
                    <option value="studio">Phòng trọ</option>
                    <option value="shared">Phòng ở ghép</option>
                    <option value="apartment">Căn hộ</option>
                    <option value="house">Nhà nguyên căn</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setFilters({
                    priceMin: '',
                    priceMax: '',
                    areaMin: '',
                    areaMax: '',
                    roomType: 'all',
                    amenities: []
                  })}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Tìm thấy <span className="font-semibold text-foreground">{filteredListings.length}</span> kết quả
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Không tìm thấy phòng phù hợp</p>
            <p className="text-sm text-muted-foreground mt-2">Thử điều chỉnh bộ lọc hoặc tìm kiếm khác</p>
          </div>
        )}
      </div>
    </div>
  );
}
