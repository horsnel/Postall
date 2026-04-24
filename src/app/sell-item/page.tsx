'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  MapPin,
  Clock,
  ShoppingCart,
  Heart,
  Package,
  ChevronDown,
  Filter,
  X,
  LayoutGrid,
  List,
} from 'lucide-react';

// ─── Category Chips ──────────────────────────────────────────────
const productCategories = [
  'Electronics',
  'Furniture',
  'Vehicles',
  'Clothing',
  'Books',
  'Sports',
  'Home & Garden',
  'Other',
];

// ─── Product Data ───────────────────────────────────────────────
interface ProductItem {
  id: string;
  title: string;
  price: number;
  city: string;
  postedAgo: string;
  category: string;
  condition: string;
}

const allProducts: ProductItem[] = [
  { id: 'item1', title: 'iPhone 14 Pro Max - 256GB Space Black', price: 620000, city: 'Lagos', postedAgo: '2h ago', category: 'Electronics', condition: 'Like New' },
  { id: 'item2', title: 'Samsung 55" Crystal UHD Smart TV', price: 285000, city: 'Lagos', postedAgo: '4h ago', category: 'Electronics', condition: 'New' },
  { id: 'item3', title: 'HP ProBook 450 G9 Laptop - Core i7', price: 450000, city: 'Abuja', postedAgo: '6h ago', category: 'Electronics', condition: 'Good' },
  { id: 'item4', title: '6-Seater Dining Table Set - Teak Wood', price: 180000, city: 'Lagos', postedAgo: '1d ago', category: 'Furniture', condition: 'New' },
  { id: 'item5', title: 'Toyota Camry 2019 - Excellent Condition', price: 12500000, city: 'Lagos', postedAgo: '5h ago', category: 'Vehicles', condition: 'Good' },
  { id: 'item6', title: 'Complete Living Room Sofa Set', price: 350000, city: 'Lagos', postedAgo: '2d ago', category: 'Furniture', condition: 'Like New' },
  { id: 'item7', title: "Men's Designer Suit - Italian Cut", price: 45000, city: 'Lagos', postedAgo: '3h ago', category: 'Clothing', condition: 'New' },
  { id: 'item8', title: 'University Textbooks Bundle - Engineering', price: 15000, city: 'Abuja', postedAgo: '8h ago', category: 'Books', condition: 'Good' },
  { id: 'item9', title: 'Treadmill Pro Fitness - Foldable', price: 120000, city: 'Lagos', postedAgo: '1d ago', category: 'Sports', condition: 'Like New' },
  { id: 'item10', title: 'Garden Lawn Mower - Honda Brand', price: 95000, city: 'Port Harcourt', postedAgo: '2d ago', category: 'Home & Garden', condition: 'Good' },
  { id: 'item11', title: 'MacBook Pro M2 - 14" 512GB', price: 850000, city: 'Lagos', postedAgo: '30m ago', category: 'Electronics', condition: 'Like New' },
  { id: 'item12', title: 'Office Executive Chair - Ergonomic', price: 65000, city: 'Lagos', postedAgo: '1d ago', category: 'Furniture', condition: 'New' },
  { id: 'item13', title: 'Honda Civic 2020 - Low Mileage', price: 9800000, city: 'Abuja', postedAgo: '3h ago', category: 'Vehicles', condition: 'Good' },
  { id: 'item14', title: 'Women\'s Ankara Dress Collection (5pcs)', price: 25000, city: 'Lagos', postedAgo: '12h ago', category: 'Clothing', condition: 'New' },
  { id: 'item15', title: 'PS5 Console + 2 Controllers + 3 Games', price: 320000, city: 'Lagos', postedAgo: '6h ago', category: 'Electronics', condition: 'Like New' },
  { id: 'item16', title: 'Dumbbell Set - Adjustable 40kg', price: 45000, city: 'Lagos', postedAgo: '2d ago', category: 'Sports', condition: 'Good' },
];

const sortOptions = ['Newest First', 'Oldest First', 'Price: Low to High', 'Price: High to Low'];

// ─── Product Card (Grid) ────────────────────────────────────────
function ProductCard({
  product,
  saved,
  onSave,
}: {
  product: ProductItem;
  saved: boolean;
  onSave: (id: string) => void;
}) {
  return (
    <Link href={`/item/${product.id}`} className="block group">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow border rounded-2xl bg-white" style={{ borderColor: '#E5E7EB' }}>
        <CardContent className="p-0">
          <div className="flex flex-col">
            {/* Icon Area */}
            <div className="flex items-center justify-center p-4 pb-0">
              <div className="h-20 flex items-center justify-center w-full bg-[#F0FDF4] rounded-xl">
                <Package className="h-12 w-12 text-[#0D8A5C]" />
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 space-y-3">
              {/* Save Button */}
              <div className="flex items-center justify-end">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSave(product.id);
                  }}
                  className="p-1 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <Heart
                    className={`h-4 w-4 transition-colors ${
                      saved ? 'fill-red-500 text-red-500' : 'text-[#9CA3AF]'
                    }`}
                  />
                </button>
              </div>

              {/* Title */}
              <h3
                className="text-base font-medium leading-snug text-[#1F2937] group-hover:underline line-clamp-2"
              >
                {product.title}
              </h3>

              {/* Price */}
              <p className="text-lg font-semibold text-[#0D8A5C]">
                ₦{product.price.toLocaleString()}
              </p>

              {/* Meta Row */}
              <div className="flex items-center gap-3 text-xs text-[#9CA3AF]">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {product.city}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {product.postedAgo}
                </span>
              </div>

              {/* View Details Button */}
              <Button className="w-full bg-[#0D8A5C] hover:bg-[#0a7350] text-white rounded-lg h-9 text-sm">
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// ─── Product Card (List) ────────────────────────────────────────
function ProductCardList({
  product,
  saved,
  onSave,
}: {
  product: ProductItem;
  saved: boolean;
  onSave: (id: string) => void;
}) {
  return (
    <Link href={`/item/${product.id}`} className="block group">
      <Card className="overflow-hidden hover:shadow-md transition-shadow border rounded-2xl bg-white" style={{ borderColor: '#E5E7EB' }}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Icon Area */}
            <div className="shrink-0">
              <div className="h-16 w-16 flex items-center justify-center bg-[#F0FDF4] rounded-xl">
                <Package className="h-8 w-8 text-[#0D8A5C]" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3
                className="text-base font-medium leading-snug text-[#1F2937] group-hover:underline line-clamp-1 mb-1"
              >
                {product.title}
              </h3>

              <div className="flex items-center gap-3 text-xs text-[#9CA3AF] mb-2">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {product.city}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {product.postedAgo}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#F3F4F6] text-[#374151]">
                  {product.condition}
                </span>
              </div>

              <Button className="bg-[#0D8A5C] hover:bg-[#0a7350] text-white rounded-lg h-8 text-xs px-4">
                View Details
              </Button>
            </div>

            {/* Price & Save */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSave(product.id);
                }}
                className="p-1 rounded-full hover:bg-gray-50 transition-colors"
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${
                    saved ? 'fill-red-500 text-red-500' : 'text-[#9CA3AF]'
                  }`}
                />
              </button>
              <p className="text-lg font-semibold text-[#0D8A5C]">
                ₦{product.price.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// ════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ════════════════════════════════════════════════════════════════
export default function SellItemPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Electronics');
  const [sortBy, setSortBy] = useState('Newest First');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  /* ── Filtering ── */
  const filteredProducts = useMemo(() => {
    let results = allProducts.filter((p) => {
      const matchCategory = activeCategory === 'Other'
        ? !productCategories.slice(0, -1).includes(p.category)
        : p.category === activeCategory;
      const matchSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });

    switch (sortBy) {
      case 'Oldest First':
        results = [...results].reverse();
        break;
      case 'Price: Low to High':
        results = [...results].sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        results = [...results].sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return results;
  }, [searchQuery, activeCategory, sortBy]);

  const hasActiveFilters = searchQuery || activeCategory !== 'Electronics' || sortBy !== 'Newest First';

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('Electronics');
    setSortBy('Newest First');
  };

  const toggleSave = (id: string) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  /* ──────────────── RENDER ──────────────── */
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex-1">
        {/* ═══ PAGE HEADER ═══ */}
        <section style={{ background: '#FFFBEB' }}>
          <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm mb-4" style={{ color: '#9CA3AF' }}>
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <span>Browse</span>
              <span>/</span>
              <span className="text-[#374151] font-medium">For Sale</span>
            </nav>

            {/* Title Row */}
            <div className="flex items-center gap-4">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: '#F59E0B' }}
              >
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-[28px] font-semibold" style={{ color: '#1F2937' }}>
                  For Sale
                </h1>
                <p className="text-sm" style={{ color: '#9CA3AF' }}>
                  Buy and sell items locally
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ CATEGORY CHIPS ═══ */}
        <section className="border-b" style={{ borderColor: '#E5E7EB' }}>
          <div className="container mx-auto px-4 py-4 max-w-6xl">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {productCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all"
                  style={
                    activeCategory === cat
                      ? { background: '#0D8A5C', color: '#FFFFFF' }
                      : { background: '#F3F4F6', color: '#374151' }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SEARCH & FILTER BAR ═══ */}
        <section className="border-b" style={{ borderColor: '#E5E7EB' }}>
          <div className="container mx-auto px-4 py-3 max-w-6xl">
            <div className="flex items-center gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#9CA3AF' }} />
                <Input
                  placeholder="Search in For Sale..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 rounded-full border-0 text-sm"
                  style={{ background: '#F3F4F6', color: '#1F2937' }}
                />
              </div>

              {/* Sort Dropdown */}
              <button
                className="hidden sm:flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg border"
                style={{ color: '#9CA3AF', borderColor: '#E5E7EB' }}
                onClick={() => {
                  const idx = sortOptions.indexOf(sortBy);
                  setSortBy(sortOptions[(idx + 1) % sortOptions.length]);
                }}
              >
                {sortBy}
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* View Toggle */}
              <div className="hidden sm:flex items-center border rounded-lg p-0.5" style={{ borderColor: '#E5E7EB' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  className="p-1.5 rounded-md transition-colors"
                  style={viewMode === 'grid' ? { background: '#0D8A5C', color: '#FFFFFF' } : { color: '#9CA3AF' }}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className="p-1.5 rounded-md transition-colors"
                  style={viewMode === 'list' ? { background: '#0D8A5C', color: '#FFFFFF' } : { color: '#9CA3AF' }}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Filters Button */}
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 rounded-full h-10 border-0"
                style={{ background: '#F3F4F6', color: '#374151' }}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <span className="h-2 w-2 rounded-full" style={{ background: '#0D8A5C' }} />
                )}
              </Button>
            </div>

            {/* Mobile Sort Row */}
            <div className="flex items-center gap-2 mt-2 sm:hidden">
              <button
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border"
                style={{ color: '#9CA3AF', borderColor: '#E5E7EB' }}
                onClick={() => {
                  const idx = sortOptions.indexOf(sortBy);
                  setSortBy(sortOptions[(idx + 1) % sortOptions.length]);
                }}
              >
                {sortBy}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <div className="flex items-center border rounded-lg p-0.5" style={{ borderColor: '#E5E7EB' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  className="p-1.5 rounded-md transition-colors"
                  style={viewMode === 'grid' ? { background: '#0D8A5C', color: '#FFFFFF' } : { color: '#9CA3AF' }}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className="p-1.5 rounded-md transition-colors"
                  style={viewMode === 'list' ? { background: '#0D8A5C', color: '#FFFFFF' } : { color: '#9CA3AF' }}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ MAIN CONTENT ═══ */}
        <main className="container mx-auto px-4 py-6 md:py-8 max-w-6xl flex-1">
          {/* Results count */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm" style={{ color: '#9CA3AF' }}>
              {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
            {hasActiveFilters && (
              <button
                className="flex items-center gap-1 text-xs hover:underline"
                style={{ color: '#0D8A5C' }}
                onClick={clearFilters}
              >
                <X className="h-3 w-3" />
                Clear all
              </button>
            )}
          </div>

          {/* ── Empty State ── */}
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div
                className="h-16 w-16 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: '#F3F4F6' }}
              >
                <Search className="h-7 w-7" style={{ color: '#9CA3AF' }} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#1F2937' }}>
                No items found
              </h3>
              <p className="text-sm mb-5 max-w-sm" style={{ color: '#9CA3AF' }}>
                We couldn&apos;t find any items matching your criteria. Try adjusting your search or filters.
              </p>
              <ul className="space-y-2 text-sm mb-6" style={{ color: '#374151' }}>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: '#0D8A5C' }} />
                  Try a different search term
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: '#0D8A5C' }} />
                  Browse a different category
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: '#0D8A5C' }} />
                  Check back later for new listings
                </li>
              </ul>
              <Button
                className="gap-1.5 rounded-full"
                style={{ background: '#0D8A5C', color: '#FFFFFF' }}
                onClick={clearFilters}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <>
              {/* GRID VIEW */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      saved={savedIds.includes(product.id)}
                      onSave={toggleSave}
                    />
                  ))}
                </div>
              )}

              {/* LIST VIEW */}
              {viewMode === 'list' && (
                <div className="flex flex-col gap-3">
                  {filteredProducts.map((product) => (
                    <ProductCardList
                      key={product.id}
                      product={product}
                      saved={savedIds.includes(product.id)}
                      onSave={toggleSave}
                    />
                  ))}
                </div>
              )}

              {/* Load More */}
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  className="rounded-full px-8"
                  style={{ borderColor: '#E5E7EB', color: '#374151' }}
                >
                  Load more items
                </Button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
