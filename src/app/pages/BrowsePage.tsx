import { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ListingCard } from '../components/ListingCard';
import { listingService, Listing, PaginatedResult } from '../services/listingService';

const ROOM_TYPES = [
  { value: 'all',           label: 'Tất cả' },
  { value: 'SINGLE_ROOM',   label: 'Phòng trọ' },
  { value: 'SHARED_ROOM',   label: 'Phòng ở ghép' },
  { value: 'APARTMENT',     label: 'Căn hộ' },
  { value: 'MINI_APARTMENT',label: 'Mini apartment' },
  { value: 'DORMITORY',     label: 'Ký túc xá' },
];

const SORT_OPTIONS = [
  { value: 'NEWEST',        label: 'Mới nhất' },
  { value: 'LOWEST_PRICE',  label: 'Giá thấp nhất' },
  { value: 'HIGHEST_PRICE', label: 'Giá cao nhất' },
  { value: 'LARGEST_AREA',  label: 'Diện tích lớn nhất' },
];

export function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceMin: '', priceMax: '', areaMin: '', areaMax: '',
    roomType: 'all', sortBy: 'NEWEST',
  });
  const [result, setResult] = useState<PaginatedResult<Listing> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: any = { page, limit: 9, sortBy: filters.sortBy };
      if (searchQuery)       params.keyword  = searchQuery;
      if (filters.priceMin)  params.priceMin = Number(filters.priceMin);
      if (filters.priceMax)  params.priceMax = Number(filters.priceMax);
      if (filters.areaMin)   params.areaMin  = Number(filters.areaMin);
      if (filters.areaMax)   params.areaMax  = Number(filters.areaMax);
      if (filters.roomType !== 'all') params.roomType = filters.roomType;

      const data = await listingService.search(params);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, filters, page]);

  // Tự động fetch khi filter/page thay đổi (debounce 400ms cho searchQuery)
  useEffect(() => {
    const timer = setTimeout(fetchListings, searchQuery ? 400 : 0);
    return () => clearTimeout(timer);
  }, [fetchListings]);

  const clearFilters = () => {
    setFilters({ priceMin: '', priceMax: '', areaMin: '', areaMax: '', roomType: 'all', sortBy: 'NEWEST' });
    setSearchQuery('');
    setPage(1);
  };

  const listings = result?.data ?? [];
  const pagination = result?.pagination;

  return (
    <div className="min-h-screen bg-background">
      {/* Header search bar */}
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
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
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
                <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { key: 'priceMin', label: 'Giá tối thiểu', placeholder: 'VNĐ' },
                  { key: 'priceMax', label: 'Giá tối đa',    placeholder: 'VNĐ' },
                  { key: 'areaMin',  label: 'Diện tích tối thiểu', placeholder: 'm²' },
                  { key: 'areaMax',  label: 'Diện tích tối đa', placeholder: 'm²' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm mb-2">{label}</label>
                    <input type="number" placeholder={placeholder}
                      value={(filters as any)[key]}
                      onChange={(e) => { setFilters(f => ({ ...f, [key]: e.target.value })); setPage(1); }}
                      className="w-full px-3 py-2 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm mb-2">Loại phòng</label>
                  <select value={filters.roomType}
                    onChange={(e) => { setFilters(f => ({ ...f, roomType: e.target.value })); setPage(1); }}
                    className="w-full px-3 py-2 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary">
                    {ROOM_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2">Sắp xếp</label>
                  <select value={filters.sortBy}
                    onChange={(e) => { setFilters(f => ({ ...f, sortBy: e.target.value })); setPage(1); }}
                    className="w-full px-3 py-2 rounded-lg bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-primary">
                    {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <button onClick={clearFilters}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm">
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            {isLoading ? 'Đang tìm kiếm...' : (
              <>Tìm thấy <span className="font-semibold text-foreground">{pagination?.total ?? 0}</span> kết quả</>
            )}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl bg-muted/40 animate-pulse h-72" />
            ))}
          </div>
        ) : listings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing as any} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-2 rounded-lg border border-border hover:bg-accent disabled:opacity-40">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${p === page ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-accent'}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
                  className="p-2 rounded-lg border border-border hover:bg-accent disabled:opacity-40">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">Không tìm thấy phòng phù hợp</p>
            <p className="text-sm text-muted-foreground mt-2">Thử điều chỉnh bộ lọc hoặc tìm kiếm khác</p>
          </div>
        )}
      </div>
    </div>
  );
}
