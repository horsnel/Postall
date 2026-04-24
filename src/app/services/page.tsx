'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  MapPin,
  Heart,
  Clock,
  Users,
  SlidersHorizontal,
  LayoutGrid,
  List,
  ChevronDown,
  Filter,
  X,
  Share2,
  Copy,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';

/* ──────────────── Category Chips ──────────────── */
const serviceCategories = [
  'Plumbing',
  'Electrical',
  'Cleaning',
  'Tutoring',
  'Design',
  'Photography',
  'Event Planning',
  'Other',
];

/* ──────────────── Sample Service Data ──────────────── */
interface ServiceItem {
  id: string;
  title: string;
  price: string;
  city: string;
  applicants: number;
  postedAgo: string;
  urgency: 'normal' | 'urgent';
  category: string;
}

const allServices: ServiceItem[] = [
  { id: 'svc1', title: 'Professional Plumbing Repair for Bathroom', price: '₦50,000', city: 'Lagos', applicants: 5, postedAgo: '2h ago', urgency: 'normal', category: 'Plumbing' },
  { id: 'svc2', title: 'Full House Deep Cleaning Service', price: '₦35,000', city: 'Lagos', applicants: 12, postedAgo: '4h ago', urgency: 'normal', category: 'Cleaning' },
  { id: 'svc3', title: 'Math & English Tutoring (Primary Level)', price: '₦25,000', city: 'Abuja', applicants: 8, postedAgo: '6h ago', urgency: 'normal', category: 'Tutoring' },
  { id: 'svc4', title: 'Electrical Wiring & Installation', price: '₦75,000', city: 'Lagos', applicants: 3, postedAgo: '1d ago', urgency: 'urgent', category: 'Electrical' },
  { id: 'svc5', title: 'Logo & Brand Identity Design', price: '₦120,000', city: 'Abuja', applicants: 15, postedAgo: '30m ago', urgency: 'normal', category: 'Design' },
  { id: 'svc6', title: 'Wedding Photography Package', price: '₦250,000', city: 'Lagos', applicants: 6, postedAgo: '1d ago', urgency: 'normal', category: 'Photography' },
  { id: 'svc7', title: 'Corporate Event Planning', price: '₦500,000', city: 'Lagos', applicants: 2, postedAgo: '3h ago', urgency: 'urgent', category: 'Event Planning' },
  { id: 'svc8', title: 'Burst Pipe Emergency Repair', price: '₦40,000', city: 'Port Harcourt', applicants: 1, postedAgo: '30m ago', urgency: 'urgent', category: 'Plumbing' },
  { id: 'svc9', title: 'Website UI/UX Redesign', price: '₦200,000', city: 'Lagos', applicants: 9, postedAgo: '5h ago', urgency: 'normal', category: 'Design' },
  { id: 'svc10', title: 'SAT & GRE Test Prep Tutoring', price: '₦80,000', city: 'Abuja', applicants: 7, postedAgo: '2d ago', urgency: 'normal', category: 'Tutoring' },
  { id: 'svc11', title: 'Product Photography for E-commerce', price: '₦60,000', city: 'Lagos', applicants: 11, postedAgo: '8h ago', urgency: 'normal', category: 'Photography' },
  { id: 'svc12', title: 'Post-Construction Cleaning', price: '₦90,000', city: 'Lagos', applicants: 4, postedAgo: '1d ago', urgency: 'normal', category: 'Cleaning' },
];

const sortOptions = ['Newest First', 'Oldest First', 'Price: Low to High', 'Price: High to Low', 'Most Applicants'];

/* ════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════ */
export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('Newest First');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  /* ── Filtering ── */
  const filteredServices = useMemo(() => {
    let results = allServices.filter((s) => {
      const matchCategory = !activeCategory
        ? true
        : activeCategory === 'Other'
          ? !serviceCategories.slice(0, -1).includes(s.category)
          : s.category === activeCategory;
      const matchSearch =
        !searchQuery ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.city.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });

    /* Sorting */
    switch (sortBy) {
      case 'Oldest First':
        results = [...results].reverse();
        break;
      case 'Price: Low to High':
        results = [...results].sort(
          (a, b) => parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, ''))
        );
        break;
      case 'Price: High to Low':
        results = [...results].sort(
          (a, b) => parseInt(b.price.replace(/[^0-9]/g, '')) - parseInt(a.price.replace(/[^0-9]/g, ''))
        );
        break;
      case 'Most Applicants':
        results = [...results].sort((a, b) => b.applicants - a.applicants);
        break;
      default:
        break;
    }

    return results;
  }, [searchQuery, activeCategory, sortBy]);

  const hasActiveFilters = searchQuery || activeCategory || sortBy !== 'Newest First';

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory(null);
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
        <section
          className="relative"
          style={{
            background: '#F3F4F6',
            backgroundImage: 'radial-gradient(circle, #D1D5DB 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm mb-4" style={{ color: '#9CA3AF', fontSize: '14px' }}>
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <span>Browse</span>
              <span>/</span>
              <span className="font-medium" style={{ color: '#374151' }}>Services</span>
            </nav>

            {/* Title Row */}
            <div className="flex items-center gap-4">
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: '#0D8A5C' }}
              >
                <SlidersHorizontal className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1
                  className="font-semibold leading-tight"
                  style={{ color: '#1F2937', fontSize: '28px' }}
                >
                  Services
                </h1>
                <p className="text-sm" style={{ color: '#9CA3AF', fontSize: '14px' }}>
                  Professional and freelance services
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ CATEGORY CHIPS ═══ */}
        <section className="border-b" style={{ borderColor: '#E5E7EB' }}>
          <div className="container mx-auto px-4 py-4 max-w-6xl">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {serviceCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
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
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4"
                  style={{ color: '#9CA3AF' }}
                />
                <Input
                  placeholder="Search in Services..."
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
              <div
                className="hidden sm:flex items-center border rounded-lg p-0.5"
                style={{ borderColor: '#E5E7EB' }}
              >
                <button
                  onClick={() => setViewMode('grid')}
                  className="p-1.5 rounded-md transition-colors"
                  style={
                    viewMode === 'grid'
                      ? { background: '#0D8A5C', color: '#FFFFFF' }
                      : { color: '#9CA3AF' }
                  }
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className="p-1.5 rounded-md transition-colors"
                  style={
                    viewMode === 'list'
                      ? { background: '#0D8A5C', color: '#FFFFFF' }
                      : { color: '#9CA3AF' }
                  }
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

            {/* Mobile Sort & View Row */}
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
              <div
                className="flex items-center border rounded-lg p-0.5 ml-auto"
                style={{ borderColor: '#E5E7EB' }}
              >
                <button
                  onClick={() => setViewMode('grid')}
                  className="p-1.5 rounded-md transition-colors"
                  style={
                    viewMode === 'grid'
                      ? { background: '#0D8A5C', color: '#FFFFFF' }
                      : { color: '#9CA3AF' }
                  }
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className="p-1.5 rounded-md transition-colors"
                  style={
                    viewMode === 'list'
                      ? { background: '#0D8A5C', color: '#FFFFFF' }
                      : { color: '#9CA3AF' }
                  }
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
              {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
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
          {filteredServices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div
                className="h-16 w-16 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: '#F3F4F6' }}
              >
                <Search className="h-7 w-7" style={{ color: '#9CA3AF' }} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#1F2937' }}>
                No results found
              </h3>
              <p className="text-sm mb-5 max-w-sm" style={{ color: '#9CA3AF' }}>
                We couldn&apos;t find any services matching your criteria. Try adjusting your search or
                filters.
              </p>
              <ul className="space-y-2 text-sm mb-6" style={{ color: '#374151' }}>
                <li className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ background: '#0D8A5C' }}
                  />
                  Try a different search term
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ background: '#0D8A5C' }}
                  />
                  Browse a different category
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ background: '#0D8A5C' }}
                  />
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      saved={savedIds.includes(service.id)}
                      onSave={toggleSave}
                    />
                  ))}
                </div>
              )}

              {/* LIST VIEW */}
              {viewMode === 'list' && (
                <div className="flex flex-col gap-3">
                  {filteredServices.map((service) => (
                    <ServiceCardList
                      key={service.id}
                      service={service}
                      saved={savedIds.includes(service.id)}
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
                  Load more services
                </Button>
              </div>
            </>
          )}
        </main>
      </div>

    </div>
  );
}

/* ════════════════════════════════════════════════════
   SERVICE CARD — GRID
   ════════════════════════════════════════════════════ */
function ServiceCard({
  service,
  saved,
  onSave,
}: {
  service: ServiceItem;
  saved: boolean;
  onSave: (id: string) => void;
}) {
  return (
    <Link href={`/task/${service.id}`} className="block group">
      <Card
        className="overflow-hidden hover:shadow-lg transition-shadow border"
        style={{ borderColor: '#E5E7EB', borderRadius: '16px' }}
      >
        <CardContent className="p-4">
          <div className="flex flex-col gap-3">
            {/* Top Row: Badge + Actions */}
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={
                  service.urgency === 'urgent'
                    ? { background: '#FEE2E2', color: '#EF4444' }
                    : { background: '#F3F4F6', color: '#374151' }
                }
              >
                {service.urgency === 'urgent' ? 'Urgent' : 'Normal'}
              </span>
              <div className="flex items-center gap-1">
                {/* Share Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="p-1 rounded-full hover:bg-gray-50 transition-colors"
                    >
                      <Share2 className="h-4 w-4 text-[#9CA3AF]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                      <Copy className="h-4 w-4" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                      <MessageSquare className="h-4 w-4" />
                      Share via Message
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                      <ExternalLink className="h-4 w-4" />
                      Share Externally
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Heart/Save */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSave(service.id);
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
            </div>

            {/* Title */}
            <h3
              className="text-base font-medium leading-snug group-hover:underline line-clamp-2"
              style={{ color: '#1F2937' }}
            >
              {service.title}
            </h3>

            {/* Price */}
            <p className="text-lg font-semibold" style={{ color: '#0D8A5C' }}>
              {service.price}
            </p>

            {/* Meta Row */}
            <div className="flex items-center gap-3 text-xs" style={{ color: '#9CA3AF' }}>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {service.city}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {service.applicants} applicants
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {service.postedAgo}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/* ════════════════════════════════════════════════════
   SERVICE CARD — LIST
   ════════════════════════════════════════════════════ */
function ServiceCardList({
  service,
  saved,
  onSave,
}: {
  service: ServiceItem;
  saved: boolean;
  onSave: (id: string) => void;
}) {
  return (
    <Link href={`/task/${service.id}`} className="block group">
      <Card
        className="overflow-hidden hover:shadow-md transition-shadow border"
        style={{ borderColor: '#E5E7EB', borderRadius: '16px' }}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              {/* Top Row */}
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={
                    service.urgency === 'urgent'
                      ? { background: '#FEE2E2', color: '#EF4444' }
                      : { background: '#F3F4F6', color: '#374151' }
                  }
                >
                  {service.urgency === 'urgent' ? 'Urgent' : 'Normal'}
                </span>
              </div>

              {/* Title */}
              <h3
                className="text-base font-medium leading-snug group-hover:underline line-clamp-1 mb-1"
                style={{ color: '#1F2937' }}
              >
                {service.title}
              </h3>

              {/* Meta Row */}
              <div className="flex items-center gap-3 text-xs" style={{ color: '#9CA3AF' }}>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {service.city}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {service.applicants} applicants
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {service.postedAgo}
                </span>
              </div>
            </div>

            {/* Price & Actions */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              <div className="flex items-center gap-1">
                {/* Share Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="p-1 rounded-full hover:bg-gray-50 transition-colors"
                    >
                      <Share2 className="h-4 w-4 text-[#9CA3AF]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                      <Copy className="h-4 w-4" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                      <MessageSquare className="h-4 w-4" />
                      Share via Message
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-sm cursor-pointer">
                      <ExternalLink className="h-4 w-4" />
                      Share Externally
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Heart/Save */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSave(service.id);
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
              <p className="text-lg font-semibold" style={{ color: '#0D8A5C' }}>
                {service.price}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
