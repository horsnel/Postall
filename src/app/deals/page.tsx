'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  ShoppingBag,
  Clock,
  Flame,
  Zap,
  Tag,
  MapPin,
  BadgeCheck,
  Heart,
  Share2,
  ShoppingCart,
  ChevronRight,
  Smartphone,
  Shirt,
  Home,
  Car,
  Sofa,
  Dumbbell,
  UtensilsCrossed,
  Gamepad2,
  Monitor,
  Gem,
  Watch,
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Category Quick Links ──────────────────────────────────────
const categoryLinks = [
  { id: 'electronics', label: 'Electronics', icon: Smartphone, gradient: 'from-blue-50 to-cyan-50' },
  { id: 'fashion', label: 'Fashion', icon: Shirt, gradient: 'from-pink-50 to-rose-50' },
  { id: 'home', label: 'Home & Living', icon: Sofa, gradient: 'from-amber-50 to-orange-50' },
  { id: 'vehicles', label: 'Vehicles', icon: Car, gradient: 'from-slate-50 to-gray-50' },
  { id: 'health', label: 'Health & Beauty', icon: Dumbbell, gradient: 'from-emerald-50 to-teal-50' },
  { id: 'food', label: 'Food & Drinks', icon: UtensilsCrossed, gradient: 'from-yellow-50 to-amber-50' },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2, gradient: 'from-violet-50 to-purple-50' },
  { id: 'computing', label: 'Computing', icon: Monitor, gradient: 'from-sky-50 to-blue-50' },
];

// ─── Deal Data (Flash Deals with countdown seconds) ─────────────
interface FlashDeal {
  id: string;
  title: string;
  originalPrice: number;
  dealPrice: number;
  discount: number;
  seller: string;
  city: string;
  category: string;
  countdownSeconds: number;
  stock: number;
  sold: number;
  icon: React.ComponentType<{ className?: string }>;
  imageGradient: string;
  verified: boolean;
}

const flashDeals: FlashDeal[] = [
  {
    id: 'fd1',
    title: 'iPhone 15 Pro Max 256GB',
    originalPrice: 850000,
    dealPrice: 680000,
    discount: 20,
    seller: 'TechDeals NG',
    city: 'Lagos',
    category: 'Electronics',
    countdownSeconds: 4 * 3600 + 23 * 60 + 15,
    stock: 3,
    sold: 47,
    icon: Smartphone,
    imageGradient: 'from-gray-100 via-gray-200 to-gray-300',
    verified: true,
  },
  {
    id: 'fd2',
    title: 'Samsung 65" Crystal UHD Smart TV',
    originalPrice: 450000,
    dealPrice: 315000,
    discount: 30,
    seller: 'ElectroHub',
    city: 'Abuja',
    category: 'Electronics',
    countdownSeconds: 2 * 3600 + 15 * 60 + 42,
    stock: 5,
    sold: 23,
    icon: Monitor,
    imageGradient: 'from-blue-50 via-slate-100 to-gray-200',
    verified: true,
  },
  {
    id: 'fd3',
    title: "Men's Designer Suit - Italian Cut",
    originalPrice: 120000,
    dealPrice: 72000,
    discount: 40,
    seller: 'Luxe Fashion',
    city: 'Lagos',
    category: 'Fashion',
    countdownSeconds: 0 * 3600 + 42 * 60 + 8,
    stock: 2,
    sold: 58,
    icon: Shirt,
    imageGradient: 'from-rose-50 via-pink-100 to-fuchsia-50',
    verified: true,
  },
  {
    id: 'fd4',
    title: 'MacBook Air M3 15" - 512GB',
    originalPrice: 1200000,
    dealPrice: 1020000,
    discount: 15,
    seller: 'AppleZone NG',
    city: 'Lagos',
    category: 'Computing',
    countdownSeconds: 8 * 3600 + 5 * 60 + 33,
    stock: 4,
    sold: 16,
    icon: Monitor,
    imageGradient: 'from-sky-50 via-blue-100 to-indigo-50',
    verified: true,
  },
  {
    id: 'fd5',
    title: 'Sony PS5 Slim Bundle + 2 Games',
    originalPrice: 380000,
    dealPrice: 266000,
    discount: 30,
    seller: 'GameZone Africa',
    city: 'Port Harcourt',
    category: 'Gaming',
    countdownSeconds: 0 * 3600 + 28 * 60 + 55,
    stock: 6,
    sold: 34,
    icon: Gamepad2,
    imageGradient: 'from-violet-50 via-purple-100 to-fuchsia-50',
    verified: true,
  },
  {
    id: 'fd6',
    title: 'Toyota Corolla 2021 - Low Mileage',
    originalPrice: 12000000,
    dealPrice: 10200000,
    discount: 15,
    seller: 'AutoFair NG',
    city: 'Abuja',
    category: 'Vehicles',
    countdownSeconds: 12 * 3600 + 45 * 60 + 10,
    stock: 1,
    sold: 0,
    icon: Car,
    imageGradient: 'from-emerald-50 via-teal-50 to-cyan-50',
    verified: true,
  },
  {
    id: 'fd7',
    title: 'Luxury 3-Seater Sofa Set',
    originalPrice: 350000,
    dealPrice: 227500,
    discount: 35,
    seller: 'HomeStyle NG',
    city: 'Lagos',
    category: 'Home & Living',
    countdownSeconds: 6 * 3600 + 10 * 60 + 20,
    stock: 8,
    sold: 12,
    icon: Sofa,
    imageGradient: 'from-amber-50 via-orange-50 to-yellow-50',
    verified: true,
  },
  {
    id: 'fd8',
    title: 'Apple Watch Ultra 2 - GPS + Cellular',
    originalPrice: 600000,
    dealPrice: 480000,
    discount: 20,
    seller: 'TechDeals NG',
    city: 'Lagos',
    category: 'Electronics',
    countdownSeconds: 0 * 3600 + 55 * 60 + 3,
    stock: 4,
    sold: 29,
    icon: Watch,
    imageGradient: 'from-orange-50 via-amber-100 to-yellow-50',
    verified: true,
  },
];

// ─── For Sale Data (regular listings, no countdown) ─────────────
interface SaleItem {
  id: string;
  title: string;
  price: number;
  seller: string;
  city: string;
  category: string;
  condition: string;
  icon: React.ComponentType<{ className?: string }>;
  imageGradient: string;
  verified: boolean;
}

const forSaleItems: SaleItem[] = [
  {
    id: 'fs1',
    title: 'JBL Flip 6 Portable Bluetooth Speaker',
    price: 85000,
    seller: 'SoundCity',
    city: 'Lagos',
    category: 'Electronics',
    condition: 'Brand New',
    icon: Smartphone,
    imageGradient: 'from-teal-50 via-cyan-50 to-sky-50',
    verified: true,
  },
  {
    id: 'fs2',
    title: 'Adidas Ultraboost Running Shoes - Size 42',
    price: 45000,
    seller: 'SneakerWorld',
    city: 'Lagos',
    category: 'Fashion',
    condition: 'Brand New',
    icon: Gem,
    imageGradient: 'from-indigo-50 via-blue-50 to-violet-50',
    verified: true,
  },
  {
    id: 'fs3',
    title: 'Infinix Note 40 Pro - 256GB',
    price: 195000,
    seller: 'PhoneHub',
    city: 'Lagos',
    category: 'Electronics',
    condition: 'Brand New',
    icon: Smartphone,
    imageGradient: 'from-emerald-50 via-green-50 to-lime-50',
    verified: true,
  },
  {
    id: 'fs4',
    title: 'Standing Desk - Electric Height Adjustable',
    price: 180000,
    seller: 'OfficeWorld',
    city: 'Abuja',
    category: 'Home & Living',
    condition: 'Brand New',
    icon: Sofa,
    imageGradient: 'from-stone-50 via-neutral-50 to-zinc-50',
    verified: true,
  },
  {
    id: 'fs5',
    title: 'Dell XPS 15 Laptop - Core i7, 16GB RAM',
    price: 550000,
    seller: 'CompuTech',
    city: 'Lagos',
    category: 'Computing',
    condition: 'Like New',
    icon: Monitor,
    imageGradient: 'from-blue-50 via-slate-50 to-gray-100',
    verified: true,
  },
  {
    id: 'fs6',
    title: 'Nike Air Jordan 1 Retro High OG',
    price: 95000,
    seller: 'SneakerVault',
    city: 'Lagos',
    category: 'Fashion',
    condition: 'Brand New',
    icon: Gem,
    imageGradient: 'from-red-50 via-rose-50 to-pink-50',
    verified: false,
  },
  {
    id: 'fs7',
    title: 'Samsung Galaxy S24 Ultra 512GB',
    price: 720000,
    seller: 'MobilePlanet',
    city: 'Port Harcourt',
    category: 'Electronics',
    condition: 'Brand New',
    icon: Smartphone,
    imageGradient: 'from-violet-50 via-purple-50 to-indigo-50',
    verified: true,
  },
  {
    id: 'fs8',
    title: 'King Size Orthopaedic Mattress',
    price: 165000,
    seller: 'SleepWell NG',
    city: 'Lagos',
    category: 'Home & Living',
    condition: 'Brand New',
    icon: Sofa,
    imageGradient: 'from-amber-50 via-yellow-50 to-lime-50',
    verified: true,
  },
];

// ─── Popular Categories for Bottom Grid ─────────────────────────
const popularCategories = [
  { id: 'electronics', label: 'Electronics', icon: Smartphone, count: '2,450+ items', color: 'bg-emerald-50 text-emerald-700' },
  { id: 'fashion', label: 'Fashion', icon: Shirt, count: '1,830+ items', color: 'bg-pink-50 text-pink-600' },
  { id: 'home', label: 'Home & Living', icon: Sofa, count: '960+ items', color: 'bg-amber-50 text-amber-600' },
  { id: 'vehicles', label: 'Vehicles', icon: Car, count: '540+ items', color: 'bg-emerald-50 text-emerald-600' },
  { id: 'computing', label: 'Computing', icon: Monitor, count: '780+ items', color: 'bg-sky-50 text-sky-600' },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2, count: '420+ items', color: 'bg-emerald-50 text-emerald-700' },
  { id: 'health', label: 'Health & Beauty', icon: Dumbbell, count: '1,120+ items', color: 'bg-rose-50 text-rose-600' },
  { id: 'food', label: 'Food & Drinks', icon: UtensilsCrossed, count: '680+ items', color: 'bg-orange-50 text-orange-600' },
];

// ─── Countdown Timer Hook ──────────────────────────────────────
function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [initialSeconds]);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const isUrgent = seconds < 3600;

  return { hours, minutes, secs, isUrgent, seconds };
}

// ─── Countdown Display Component ────────────────────────────────
function CountdownDisplay({
  hours,
  minutes,
  secs,
  isUrgent,
  size = 'sm',
}: {
  hours: number;
  minutes: number;
  secs: number;
  isUrgent: boolean;
  size?: 'sm' | 'lg';
}) {
  const digitSize = size === 'lg' ? 'text-2xl sm:text-4xl' : 'text-base sm:text-lg';
  const labelSize = size === 'lg' ? 'text-[10px] sm:text-xs' : 'text-[8px] sm:text-[10px]';

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div
        className={`${digitSize} font-mono font-bold leading-none px-2 py-1 rounded-md ${
          isUrgent
            ? 'bg-red-500 text-white'
            : 'bg-white/20 text-white'
        }`}
      >
        {String(value).padStart(2, '0')}
      </div>
      <span className={`${labelSize} text-white/60 mt-0.5 uppercase tracking-wider font-medium`}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <TimeBlock value={hours} label="Hrs" />
      <span className={`${digitSize} font-bold text-white/40 leading-none -mt-4`}>:</span>
      <TimeBlock value={minutes} label="Min" />
      <span className={`${digitSize} font-bold text-white/40 leading-none -mt-4`}>:</span>
      <TimeBlock value={secs} label="Sec" />
    </div>
  );
}

// ─── Flash Deal Card Component ──────────────────────────────────
function FlashDealCard({ deal }: { deal: FlashDeal }) {
  const DealIcon = deal.icon;
  const { hours, minutes, secs, isUrgent } = useCountdown(deal.countdownSeconds);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
    toast.success(saved ? 'Removed from saved items' : 'Item saved!');
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success('Share link copied to clipboard!');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`${deal.title} added to cart!`);
  };

  const stockPercent = Math.min(((deal.sold) / (deal.sold + deal.stock)) * 100, 100);

  return (
    <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 bg-white group rounded-2xl">
      <CardContent className="p-0">
        {/* Image Area */}
        <div className="relative">
          <div
            className={`w-full aspect-[4/3] bg-gradient-to-br ${deal.imageGradient} flex items-center justify-center relative overflow-hidden`}
          >
            <DealIcon className="h-16 w-16 text-gray-300/80 group-hover:scale-110 transition-transform duration-300" />
            {/* Discount Badge */}
            <Badge className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md border-0">
              -{deal.discount}%
            </Badge>
            {/* Save & Share */}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5">
              <button
                onClick={handleSave}
                className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                aria-label="Save item"
              >
                <Heart className={`h-4 w-4 transition-colors ${saved ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
              </button>
              <button
                onClick={handleShare}
                className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                aria-label="Share item"
              >
                <Share2 className="h-4 w-4 text-gray-500" />
              </button>
            </div>
            {/* Low Stock Indicator */}
            {deal.stock <= 3 && (
              <Badge className="absolute bottom-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-0 shadow-sm">
                Only {deal.stock} left!
              </Badge>
            )}
          </div>

          {/* Countdown Timer Strip */}
          <div
            className={`px-3 py-2 flex items-center justify-center gap-2 ${
              isUrgent ? 'bg-red-50' : 'bg-gray-50'
            }`}
          >
            <Clock className={`h-3.5 w-3.5 ${isUrgent ? 'text-red-500' : 'text-gray-400'}`} />
            <CountdownDisplay hours={hours} minutes={minutes} secs={secs} isUrgent={isUrgent} size="sm" />
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3 sm:p-4 space-y-2">
          {/* Title */}
          <Link href={`/item/${deal.id}`} className="block">
            <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-[#0D8A5C] transition-colors">
              {deal.title}
            </h3>
          </Link>

          {/* Price Row */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-bold text-[#0D8A5C]">
              ₦{deal.dealPrice.toLocaleString()}
            </span>
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              ₦{deal.originalPrice.toLocaleString()}
            </span>
          </div>

          {/* Stock Progress Bar */}
          <div className="space-y-1">
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0D8A5C] to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${stockPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400">{deal.sold} sold</p>
          </div>

          {/* Seller Info */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {deal.verified && <BadgeCheck className="h-3.5 w-3.5 text-[#0D8A5C]" />}
            <span className="font-medium text-gray-700 truncate">{deal.seller}</span>
            <span className="flex items-center gap-0.5 shrink-0">
              <MapPin className="h-3 w-3" />
              {deal.city}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <Button
              className="flex-1 h-9 gap-1.5 bg-[#0D8A5C] hover:bg-[#0a7350] text-white text-xs sm:text-sm font-semibold rounded-xl"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Add to Cart
            </Button>
            <Link href={`/item/${deal.id}`} className="block">
              <Button className="h-9 gap-1.5 bg-white hover:bg-gray-50 text-[#0D8A5C] border border-[#0D8A5C] text-xs sm:text-sm font-semibold rounded-xl">
                Shop Now
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── For Sale Card Component ────────────────────────────────────
function ForSaleCard({ item }: { item: SaleItem }) {
  const ItemIcon = item.icon;
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
    toast.success(saved ? 'Removed from saved items' : 'Item saved!');
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success('Share link copied to clipboard!');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`${item.title} added to cart!`);
  };

  return (
    <Card className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 bg-white group rounded-2xl">
      <CardContent className="p-0">
        {/* Image Area */}
        <div className="relative">
          <div
            className={`w-full aspect-[4/3] bg-gradient-to-br ${item.imageGradient} flex items-center justify-center relative overflow-hidden`}
          >
            <ItemIcon className="h-16 w-16 text-gray-300/80 group-hover:scale-110 transition-transform duration-300" />
            {/* Condition Badge */}
            <Badge className="absolute top-3 left-3 bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-0">
              {item.condition}
            </Badge>
            {/* Save & Share */}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5">
              <button
                onClick={handleSave}
                className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                aria-label="Save item"
              >
                <Heart className={`h-4 w-4 transition-colors ${saved ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
              </button>
              <button
                onClick={handleShare}
                className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                aria-label="Share item"
              >
                <Share2 className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3 sm:p-4 space-y-2">
          {/* Title */}
          <Link href={`/item/${item.id}`} className="block">
            <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-[#0D8A5C] transition-colors">
              {item.title}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              ₦{item.price.toLocaleString()}
            </span>
          </div>

          {/* Seller Info */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {item.verified && <BadgeCheck className="h-3.5 w-3.5 text-[#0D8A5C]" />}
            <span className="font-medium text-gray-700 truncate">{item.seller}</span>
            <span className="flex items-center gap-0.5 shrink-0">
              <MapPin className="h-3 w-3" />
              {item.city}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <Button
              className="flex-1 h-9 gap-1.5 bg-[#0D8A5C] hover:bg-[#0a7350] text-white text-xs sm:text-sm font-semibold rounded-xl"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Add to Cart
            </Button>
            <Link href={`/item/${item.id}`} className="block">
              <Button className="h-9 gap-1.5 bg-white hover:bg-gray-50 text-[#0D8A5C] border border-[#0D8A5C] text-xs sm:text-sm font-semibold rounded-xl">
                View
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ════════════════════════════════════════════════════════════════
export default function DealsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Main hero countdown (big timer)
  const heroCountdown = useCountdown(5 * 3600 + 23 * 60 + 39);

  // Filter deals by category
  const filteredFlashDeals =
    activeCategory === 'all'
      ? flashDeals
      : flashDeals.filter((d) => d.category.toLowerCase() === activeCategory);

  const filteredSaleItems =
    activeCategory === 'all'
      ? forSaleItems
      : forSaleItems.filter((d) => d.category.toLowerCase() === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-white">

      <div className="flex-1">
        {/* ═══ HERO HEADER: Green Gradient #0D8A5C → #064E3B ═══ */}
        <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D8A5C 0%, #064E3B 100%)' }}>
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/[0.03] rounded-full" />

          <div className="relative container mx-auto px-4 py-10 md:py-16 lg:py-20 text-center">
            {/* Shopping Bag Icon */}
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-5">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
              Deals &amp; Shopping
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-lg mx-auto mb-8">
              Incredible deals on electronics, fashion, vehicles and more. Don&apos;t miss out!
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search deals, products, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-white rounded-xl text-gray-800 placeholder:text-gray-400 border-0 shadow-lg shadow-black/10 focus-visible:ring-white/30 text-base"
                />
              </div>
            </div>

            {/* Hero Countdown */}
            <div className="flex flex-col items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
                <Flame className="h-4 w-4 text-orange-300" />
                Flash Sale Ends In
              </div>
              <CountdownDisplay
                hours={heroCountdown.hours}
                minutes={heroCountdown.minutes}
                secs={heroCountdown.secs}
                isUrgent={heroCountdown.isUrgent}
                size="lg"
              />
            </div>
          </div>
        </section>

        {/* ═══ CATEGORY QUICK LINKS ═══ */}
        <section className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
          <div className="container mx-auto px-4 py-3 max-w-6xl">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setActiveCategory('all')}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === 'all'
                    ? 'bg-[#0D8A5C] text-white shadow-md shadow-[#0D8A5C]/25'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Flame className="h-3.5 w-3.5" />
                All
              </button>
              {categoryLinks.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#0D8A5C] text-white shadow-md shadow-[#0D8A5C]/25'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ FLASH DEALS SECTION ═══ */}
        <main className="container mx-auto px-4 max-w-6xl">
          <section className="pt-6 md:pt-8 pb-4">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">Flash Deals</h2>
                  <p className="text-xs text-gray-400">Limited time offers — grab them before they&apos;re gone!</p>
                </div>
              </div>
              <Link href="/browse?filter=deals" className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#0D8A5C] hover:underline">
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Flash Deals Grid: 2 cols mobile, 3 cols tablet, 4 cols desktop */}
            {filteredFlashDeals.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {filteredFlashDeals.map((deal) => (
                  <FlashDealCard key={deal.id} deal={deal} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-5 bg-gray-100">
                  <Flame className="h-7 w-7 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">No flash deals in this category</h3>
                <p className="text-sm mb-5 max-w-sm text-gray-400">Check back soon or browse other categories!</p>
                <Button
                  className="gap-1.5 rounded-full bg-[#0D8A5C] hover:bg-[#0a7350] text-white"
                  onClick={() => setActiveCategory('all')}
                >
                  View All Deals
                </Button>
              </div>
            )}
          </section>

          <Separator className="my-4 md:my-6" />

          {/* ═══ FOR SALE SECTION ═══ */}
          <section className="pb-6 md:pb-8">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#F0FDF4] flex items-center justify-center">
                  <Tag className="h-5 w-5 text-[#0D8A5C]" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">For Sale</h2>
                  <p className="text-xs text-gray-400">Great items at fair prices from verified sellers</p>
                </div>
              </div>
              <Link href="/browse?filter=sale" className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#0D8A5C] hover:underline">
                View All <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* For Sale Grid: 2 cols mobile, 3 cols tablet, 4 cols desktop */}
            {filteredSaleItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {filteredSaleItems.map((item) => (
                  <ForSaleCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-5 bg-gray-100">
                  <Tag className="h-7 w-7 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">No items for sale in this category</h3>
                <p className="text-sm mb-5 max-w-sm text-gray-400">Try browsing other categories!</p>
                <Button
                  className="gap-1.5 rounded-full bg-[#0D8A5C] hover:bg-[#0a7350] text-white"
                  onClick={() => setActiveCategory('all')}
                >
                  View All Items
                </Button>
              </div>
            )}
          </section>

          <Separator className="my-4 md:my-6" />

          {/* ═══ POPULAR CATEGORIES GRID ═══ */}
          <section className="pb-8 md:pb-12">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Popular Categories</h2>
                <p className="text-xs text-gray-400">Browse items by category</p>
              </div>
              <Link href="/browse" className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#0D8A5C] hover:underline">
                All Categories <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {popularCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.id}
                    href={`/browse/${cat.id}`}
                    className="group"
                  >
                    <div className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 hover:border-[#0D8A5C]/20 hover:shadow-md transition-all duration-200 bg-white">
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${cat.color} group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-gray-800 group-hover:text-[#0D8A5C] transition-colors truncate">
                          {cat.label}
                        </h3>
                        <p className="text-xs text-gray-400">{cat.count}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ═══ SELLER CTA ═══ */}
          <div className="text-center py-10 md:py-14 px-6 rounded-2xl bg-gradient-to-br from-[#F0FDF4] to-emerald-50 border border-emerald-100 mb-6 md:mb-8">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[#0D8A5C]/10 mb-4">
              <ShoppingBag className="h-7 w-7 text-[#0D8A5C]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Are you a seller?</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Post your items, create deals, and reach thousands of buyers across Nigeria and Africa.
            </p>
            <Link href="/dashboard/promote">
              <Button className="gap-2 bg-[#0D8A5C] hover:bg-[#0a7350] text-white rounded-xl h-11 px-6 font-semibold shadow-md shadow-[#0D8A5C]/25">
                <ShoppingBag className="h-4 w-4" />
                Start Selling
              </Button>
            </Link>
          </div>
        </main>
      </div>

    </div>
  );
}
