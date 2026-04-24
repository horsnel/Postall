"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

import { categories, cities, formatCurrency, nigerianStates, getCitiesByState } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import type { LucideIcon } from "lucide-react";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  X,
  Heart,
  ChevronDown,
  ArrowUpDown,
  DollarSign,
  Clock,
  Zap,
  Briefcase,
  ShoppingCart,
  Users,
  TrendingUp,
  Sparkles,
  RotateCcw,
  Filter,
  Smartphone,
  Laptop,
  Package,
  ChartColumnIncreasing,
  TreePine,
  Tv,
  LocateFixed,
  Ruler,
  Compass,
  Map,
  ChevronRight,
  Globe,
  Wrench,
  Navigation,
} from "lucide-react";

// ─── Sample Results ──────────────────────────────────────────
const sampleResults = [
  { id: "s1", title: "iPhone 14 Pro Max - 256GB Deep Purple", price: 650000, currency: "NGN", city: "Lagos", category: "for-sale", condition: "Like New", time: "1h ago", icon: "Smartphone", fav: false, lat: 6.524, lng: 3.379 },
  { id: "s2", title: "WordPress Website Development", price: 75000, currency: "NGN", city: "Lagos", category: "gigs", urgency: "high", time: "3h ago", icon: "Laptop", fav: false, lat: 6.524, lng: 3.379 },
  { id: "s3", title: "Professional Plumbing Services", price: 40000, currency: "NGN", city: "Lagos", category: "services", time: "5h ago", icon: "Wrench", fav: false, lat: 6.454, lng: 3.395 },
  { id: "s4", title: "Social Media Manager Needed", price: 150000, currency: "NGN", city: "Abuja", category: "jobs", time: "6h ago", icon: "Smartphone", fav: true, lat: 9.058, lng: 7.491 },
  { id: "s5", title: "MacBook Air M2 - Space Gray", price: 800000, currency: "NGN", city: "Lagos", category: "for-sale", condition: "Good", time: "8h ago", icon: "Laptop", fav: false, lat: 6.454, lng: 3.395 },
  { id: "s6", title: "Data Analysis with Python - Freelance", price: 150000, currency: "NGN", city: "Lagos", category: "gigs", time: "1d ago", icon: "ChartColumnIncreasing", fav: false, lat: 6.595, lng: 3.342 },
  { id: "s7", title: "Community Clean-Up Drive", price: 0, currency: "NGN", city: "Lagos", category: "community", time: "1d ago", icon: "TreePine", fav: false, lat: 6.468, lng: 3.285 },
  { id: "s8", title: 'Samsung 55" Smart TV - Brand New', price: 350000, currency: "NGN", city: "Abuja", category: "for-sale", condition: "New", time: "2d ago", icon: "Tv", fav: true, lat: 9.058, lng: 7.491 },
];

const categoryColorMap: Record<string, string> = {
  gigs: "bg-emerald-100 text-emerald-700",
  services: "bg-teal-100 text-teal-700",
  jobs: "bg-cyan-100 text-cyan-700",
  "for-sale": "bg-amber-100 text-amber-700",
  community: "bg-rose-100 text-rose-700",
};

const categoryIconMap: Record<string, React.ReactNode> = {
  gigs: <Zap className="h-3 w-3" />,
  services: <Wrench className="h-3 w-3" />,
  jobs: <Briefcase className="h-3 w-3" />,
  "for-sale": <ShoppingCart className="h-3 w-3" />,
  community: <Users className="h-3 w-3" />,
};

const pricePresets = [
  { label: "Under ₦10K", min: 0, max: 10000 },
  { label: "₦10K - ₦50K", min: 10000, max: 50000 },
  { label: "₦50K - ₦200K", min: 50000, max: 200000 },
  { label: "₦200K - ₦500K", min: 200000, max: 500000 },
  { label: "Over ₦500K", min: 500000, max: 999999999 },
];

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

const timeOptions = [
  { value: "hour", label: "Last hour" },
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
];

const distanceOptions = [
  { value: "5", label: "5 km" },
  { value: "10", label: "10 km" },
  { value: "25", label: "25 km" },
  { value: "50", label: "50 km" },
  { value: "100", label: "100 km" },
];

// Simulated user location (Lagos Island)
const userLocation = { lat: 6.454, lng: 3.395 };

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getDistanceKm(item: (typeof sampleResults)[0]): number | null {
  if (item.lat == null || item.lng == null) return null;
  return haversineDistance(userLocation.lat, userLocation.lng, item.lat, item.lng);
}

function formatDistance(km: number): string {
  return km < 1 ? `~${Math.round(km * 1000)} m away` : `~${km.toFixed(1)} km away`;
}

// ─── Filter Sidebar Content ──────────────────────────────────
function FilterSidebar({
  filters,
  setFilters,
  onClearAll,
  onApply,
}: {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onClearAll: () => void;
  onApply: () => void;
}) {
  const toggleCategory = (catId: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(catId)
        ? prev.categories.filter((c) => c !== catId)
        : [...prev.categories, catId],
    }));
  };

  const toggleCity = (cityName: string) => {
    setFilters((prev) => ({
      ...prev,
      cities: prev.cities.includes(cityName)
        ? prev.cities.filter((c) => c !== cityName)
        : [...prev.cities, cityName],
    }));
  };

  const toggleCondition = (cond: string) => {
    setFilters((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(cond)
        ? prev.conditions.filter((c) => c !== cond)
        : [...prev.conditions, cond],
    }));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground gap-1"
          onClick={onClearAll}
        >
          <RotateCcw className="h-3 w-3" />
          Clear All
        </Button>
      </div>

      <Separator />

      {/* Category */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm">Category</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2.5">
              <Checkbox
                id={`fcat-${cat.id}`}
                checked={filters.categories.includes(cat.id)}
                onCheckedChange={() => toggleCategory(cat.id)}
                className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
              />
              <Label htmlFor={`fcat-${cat.id}`} className="text-sm cursor-pointer flex items-center gap-2 flex-1">
                {categoryIconMap[cat.id]}
                {cat.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm flex items-center gap-1.5">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          Price Range
        </h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min ₦"
            value={filters.minPrice}
            onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
            className="h-9 text-sm"
            min={0}
          />
          <span className="text-muted-foreground text-sm">-</span>
          <Input
            type="number"
            placeholder="Max ₦"
            value={filters.maxPrice}
            onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
            className="h-9 text-sm"
            min={0}
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {pricePresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  minPrice: String(preset.min),
                  maxPrice: String(preset.max),
                }))
              }
              className="text-xs px-2 py-1 rounded-full border hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Location */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          Location
        </h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {cities.slice(0, 8).map((city) => (
            <div key={city.name} className="flex items-center gap-2.5">
              <Checkbox
                id={`fcity-${city.name}`}
                checked={filters.cities.includes(city.name)}
                onCheckedChange={() => toggleCity(city.name)}
                className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
              />
              <Label htmlFor={`fcity-${city.name}`} className="text-sm cursor-pointer flex-1">
                {city.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* State / Region Filter */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm flex items-center gap-1.5">
          <Map className="h-4 w-4 text-muted-foreground" />
          Nigerian State
        </h3>
        <Select
          value={filters.state}
          onValueChange={(v) =>
            setFilters((prev) => ({ ...prev, state: v, stateCity: "" }))
          }
        >
          <SelectTrigger className="h-9 text-sm">
            <Globe className="h-4 w-4 text-muted-foreground mr-1" />
            <SelectValue placeholder="Select state..." />
          </SelectTrigger>
          <SelectContent>
            {nigerianStates.map((s) => (
              <SelectItem key={s.name} value={s.name}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {filters.state && (
          <Select
            value={filters.stateCity}
            onValueChange={(v) =>
              setFilters((prev) => ({ ...prev, stateCity: v }))
            }
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select city in {filters.state}..." />
            </SelectTrigger>
            <SelectContent>
              {getCitiesByState(filters.state).map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Separator />

      {/* Near Me / Distance Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm flex items-center gap-1.5">
            <LocateFixed className="h-4 w-4 text-muted-foreground" />
            Near Me
          </h3>
          <Switch
            checked={filters.nearMe}
            onCheckedChange={(checked) =>
              setFilters((prev) => ({ ...prev, nearMe: checked }))
            }
            className="data-[state=checked]:bg-emerald-600"
          />
        </div>
        {filters.nearMe && (
          <div className="space-y-2 pl-0.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Ruler className="h-3.5 w-3.5" />
              Distance radius
            </div>
            <RadioGroup
              value={filters.distanceRadius}
              onValueChange={(v) =>
                setFilters((prev) => ({ ...prev, distanceRadius: v }))
              }
              className="grid grid-cols-3 gap-1.5"
            >
              {distanceOptions.map((opt) => (
                <Label
                  key={opt.value}
                  htmlFor={`fdist-${opt.value}`}
                  className={`flex items-center justify-center text-xs rounded-lg border px-2 py-1.5 cursor-pointer transition-colors ${
                    filters.distanceRadius === opt.value
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "border-muted hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700"
                  }`}
                >
                  <RadioGroupItem
                    value={opt.value}
                    id={`fdist-${opt.value}`}
                    className="sr-only"
                  />
                  {opt.label}
                </Label>
              ))}
            </RadioGroup>
          </div>
        )}
      </div>

      <Separator />

      {/* Condition */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm">Condition</h3>
        <div className="space-y-2">
          {["New", "Like New", "Good", "Fair"].map((cond) => (
            <div key={cond} className="flex items-center gap-2.5">
              <Checkbox
                id={`fcond-${cond}`}
                checked={filters.conditions.includes(cond)}
                onCheckedChange={() => toggleCondition(cond)}
                className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
              />
              <Label htmlFor={`fcond-${cond}`} className="text-sm cursor-pointer">
                {cond}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Urgency */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm">Urgency</h3>
        <RadioGroup
          value={filters.urgency}
          onValueChange={(v) => setFilters((prev) => ({ ...prev, urgency: v }))}
        >
          {["all", "low", "normal", "high", "urgent"].map((level) => (
            <div key={level} className="flex items-center gap-2.5">
              <RadioGroupItem value={level} id={`furg-${level}`} className="data-[state=checked]:border-emerald-600 data-[state=checked]:text-emerald-600" />
              <Label htmlFor={`furg-${level}`} className="text-sm cursor-pointer capitalize">
                {level === "all" ? "All" : level}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      {/* Posted Time */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Posted Time
        </h3>
        <RadioGroup
          value={filters.postedTime}
          onValueChange={(v) => setFilters((prev) => ({ ...prev, postedTime: v }))}
        >
          {timeOptions.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2.5">
              <RadioGroupItem value={opt.value} id={`ftime-${opt.value}`} className="data-[state=checked]:border-emerald-600 data-[state=checked]:text-emerald-600" />
              <Label htmlFor={`ftime-${opt.value}`} className="text-sm cursor-pointer">
                {opt.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      {/* Currency Toggle */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm">Currency</h3>
        <ToggleGroup
          type="single"
          value={filters.currencyMode}
          onValueChange={(v) => v && setFilters((prev) => ({ ...prev, currencyMode: v }))}
          className="flex-wrap"
        >
          <ToggleGroupItem value="naira" className="text-xs gap-1">₦ Naira</ToggleGroupItem>
          <ToggleGroupItem value="crypto" className="text-xs gap-1">₮ Crypto</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <Separator />

      {/* Apply Button */}
      <Button onClick={onApply} className="w-full gap-2">
        <Sparkles className="h-4 w-4" />
        Apply Filters
      </Button>
    </div>
  );
}

// ─── Filter State ────────────────────────────────────────────
interface FilterState {
  categories: string[];
  cities: string[];
  conditions: string[];
  urgency: string;
  postedTime: string;
  minPrice: string;
  maxPrice: string;
  currencyMode: string;
  sortBy: string;
  state: string;
  stateCity: string;
  nearMe: boolean;
  distanceRadius: string;
}

const defaultFilters: FilterState = {
  categories: [],
  cities: [],
  conditions: [],
  urgency: "all",
  postedTime: "month",
  minPrice: "",
  maxPrice: "",
  currencyMode: "naira",
  sortBy: "relevance",
  state: "",
  stateCity: "",
  nearMe: false,
  distanceRadius: "25",
};

// ─── Result Card ─────────────────────────────────────────────
const resultIconMap: Record<string, LucideIcon> = {
  Smartphone,
  Laptop,
  Wrench,
  ChartColumnIncreasing,
  TreePine,
  Tv,
};

const resultBgColors: Record<string, string> = {
  Smartphone: "bg-emerald-100",
  Laptop: "bg-emerald-100",
  Wrench: "bg-teal-100",
  ChartColumnIncreasing: "bg-cyan-100",
  TreePine: "bg-emerald-100",
  Tv: "bg-indigo-100",
};

function ResultCard({ item, showDistance }: { item: (typeof sampleResults)[0]; showDistance?: boolean }) {
  const [fav, setFav] = useState(item.fav);
  const categoryLabel = categories.find((c) => c.id === item.category)?.name || item.category;
  const ResultIcon = resultIconMap[item.icon] || Package;
  const distance = showDistance ? getDistanceKm(item) : null;

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-emerald-200 cursor-pointer overflow-hidden h-full">
      {/* Image placeholder */}
      <div className={`relative h-44 flex items-center justify-center ${resultBgColors[item.icon] || "bg-gray-100"}`}>
        <ResultIcon className="h-12 w-12 text-gray-500/70" />
        <button
          onClick={(e) => { e.stopPropagation(); setFav(!fav); }}
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart className={`h-4 w-4 ${fav ? "fill-rose-500 text-rose-500" : "text-gray-500"}`} />
        </button>
        {item.condition && (
          <Badge className="absolute top-3 left-3 bg-white/90 text-gray-700 hover:bg-white/90 text-xs">
            {item.condition}
          </Badge>
        )}
        {distance !== null && (
          <Badge className="absolute bottom-3 left-3 bg-emerald-600/90 text-white hover:bg-emerald-600/90 text-xs gap-1">
            <Navigation className="h-3 w-3" />
            {formatDistance(distance)}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className={`text-xs ${categoryColorMap[item.category] || ""}`}>
            {categoryIconMap[item.category]}
            <span className="ml-1">{categoryLabel}</span>
          </Badge>
        </div>
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors mb-2">
          {item.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="font-bold text-emerald-700 text-base">
            {item.price === 0 ? "Free" : formatCurrency(item.price, item.currency)}
          </span>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {item.city}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {item.time}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Pagination ──────────────────────────────────────────────
function SearchPagination() {
  const pages = [1, 2, 3, "ellipsis", 12];
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" className="cursor-pointer" />
        </PaginationItem>
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <PaginationItem key={`e${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink href="#" isActive={p === 1} className="cursor-pointer">
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <PaginationNext href="#" className="cursor-pointer" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

// ─── Active Filter Chips ─────────────────────────────────────
function ActiveChips({ filters, onClearAll }: { filters: FilterState; onClearAll: () => void }) {
  const chips: { label: string; onRemove: () => void }[] = [];

  filters.categories.forEach((c) => {
    const cat = categories.find((cat) => cat.id === c);
    if (cat) chips.push({ label: cat.name, onRemove: () => {} });
  });
  filters.cities.forEach((c) => {
    chips.push({ label: c, onRemove: () => {} });
  });
  filters.conditions.forEach((c) => {
    chips.push({ label: c, onRemove: () => {} });
  });

  if (filters.urgency !== "all") chips.push({ label: filters.urgency, onRemove: () => {} });
  if (filters.minPrice) chips.push({ label: `Min: ₦${Number(filters.minPrice).toLocaleString()}`, onRemove: () => {} });
  if (filters.maxPrice) chips.push({ label: `Max: ₦${Number(filters.maxPrice).toLocaleString()}`, onRemove: () => {} });
  if (filters.postedTime !== "month") {
    const t = timeOptions.find((o) => o.value === filters.postedTime);
    if (t) chips.push({ label: t.label, onRemove: () => {} });
  }
  if (filters.state) {
    chips.push({ label: `${filters.state}${filters.stateCity ? ` > ${filters.stateCity}` : ""}`, onRemove: () => {} });
  }
  if (filters.nearMe) {
    const distOpt = distanceOptions.find((o) => o.value === filters.distanceRadius);
    chips.push({ label: `Near Me (${distOpt?.label || filters.distanceRadius})`, onRemove: () => {} });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-muted-foreground font-medium">Active:</span>
      {chips.map((chip, i) => (
        <Badge key={i} variant="secondary" className="gap-1 text-xs">
          {chip.label}
          <X className="h-3 w-3 cursor-pointer ml-0.5" onClick={chip.onRemove} />
        </Badge>
      ))}
      <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-6 px-2" onClick={onClearAll}>
        Clear all
      </Button>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────
export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("all");
  const [category, setCategory] = useState("all");
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleClearAll = () => {
    setFilters(defaultFilters);
  };

  const handleApply = () => {
    setMobileOpen(false);
  };

  const activeFilterCount = useMemo(() => {
    let count = filters.categories.length + filters.cities.length + filters.conditions.length;
    if (filters.urgency !== "all") count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.postedTime !== "month") count++;
    if (filters.state) count++;
    if (filters.stateCity) count++;
    if (filters.nearMe) count++;
    return count;
  }, [filters]);

  return (
    <div className="bg-background">
      <div>
        {/* Search Hero */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                Find Anything in <span className="text-emerald-600">Africa</span>
              </h1>
              <p className="text-muted-foreground">
                Search across thousands of listings — tasks, services, items, housing, and more
              </p>
            </div>

            {/* Main Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="What are you looking for?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-12 h-12 text-base rounded-xl border-2 border-emerald-200 focus-visible:border-emerald-500 shadow-sm"
                  />
                </div>
                <div className="flex gap-3">
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="h-12 w-[160px] rounded-xl border-2 border-emerald-200 focus-visible:border-emerald-500">
                      <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city.name} value={city.name}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-12 w-[160px] rounded-xl border-2 border-emerald-200 focus-visible:border-emerald-500">
                      <Sparkles className="h-4 w-4 text-muted-foreground mr-1" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button className="h-12 px-8 rounded-xl gap-2 text-base font-semibold">
                    <Search className="h-5 w-5" />
                    <span className="hidden sm:inline">Search</span>
                  </Button>
                </div>
              </div>
              {/* Currency indicator */}
              <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  Prices in ₦ Naira
                </span>
                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                <span>Powered by Paystack</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 py-6">
          {/* Quick Filter Bar: Near Me toggle on desktop */}
          {filters.nearMe && (
            <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200">
              <LocateFixed className="h-4 w-4 text-emerald-600" />
              <span className="text-sm text-emerald-700 font-medium">
                Showing results within {distanceOptions.find((o) => o.value === filters.distanceRadius)?.label || filters.distanceRadius} of your location
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto h-7 text-xs text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100"
                onClick={() => setFilters((prev) => ({ ...prev, nearMe: false }))}
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>
          )}

          {/* Sort + Filter Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">248</span> results
              </p>
              {/* Quick Near Me toggle */}
              <Button
                variant={filters.nearMe ? "default" : "outline"}
                size="sm"
                className={`h-8 gap-1.5 text-xs ${filters.nearMe ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                onClick={() => setFilters((prev) => ({ ...prev, nearMe: !prev.nearMe }))}
              >
                <LocateFixed className="h-3.5 w-3.5" />
                Near Me
              </Button>
              <ActiveChips filters={filters} onClearAll={handleClearAll} />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Select
                value={filters.sortBy}
                onValueChange={(v) => setFilters((prev) => ({ ...prev, sortBy: v }))}
              >
                <SelectTrigger className="h-9 w-full sm:w-[200px]">
                  <ArrowUpDown className="h-4 w-4 text-muted-foreground mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Mobile Filter Button */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="outline" className="h-9 gap-2 shrink-0">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="h-5 w-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[340px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Search Filters</SheetTitle>
                  </SheetHeader>
                  <div className="px-4 pb-4 mt-4">
                    <FilterSidebar
                      filters={filters}
                      setFilters={setFilters}
                      onClearAll={handleClearAll}
                      onApply={handleApply}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Desktop Sidebar - Collapsible */}
            <aside className={`hidden lg:block shrink-0 transition-all duration-300 ${sidebarCollapsed ? "w-10" : "w-[280px]"}`}>
              <div className="sticky top-20 bg-white rounded-xl border shadow-sm">
                {/* Collapse toggle */}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="absolute -right-3 top-4 z-10 h-6 w-6 rounded-full border bg-white shadow-sm flex items-center justify-center hover:bg-emerald-50 transition-colors"
                >
                  <ChevronRight className={`h-3.5 w-3.5 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`} />
                </button>
                {!sidebarCollapsed && (
                  <div className="p-5 max-h-[calc(100vh-6rem)] overflow-y-auto">
                    <FilterSidebar
                      filters={filters}
                      setFilters={setFilters}
                      onClearAll={handleClearAll}
                      onApply={handleApply}
                    />
                  </div>
                )}
                {sidebarCollapsed && (
                  <div className="flex flex-col items-center gap-2 pt-4 px-1">
                    <Filter className="h-5 w-5 text-muted-foreground" />
                    {activeFilterCount > 0 && (
                      <span className="h-5 w-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </aside>

            {/* Results Grid */}
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {sampleResults.map((item) => (
                  <ResultCard key={item.id} item={item} showDistance={filters.nearMe} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex justify-center">
                <SearchPagination />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
