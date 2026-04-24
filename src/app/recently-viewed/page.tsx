"use client";

import { useState } from "react";
import Link from "next/link";
import { categories, formatCurrency } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LucideIcon } from "lucide-react";
import {
  History,
  MapPin,
  Clock,
  User,
  Trash2,
  TrendingDown,
  Eye,
  ArrowUpDown,
  Zap,
  SlidersHorizontal,
  Briefcase,
  ShoppingCart,
  Home,
  Users,
  AlertTriangle,
  Laptop,
  Package,
  Wrench,
} from "lucide-react";

// ─── Types & Data ────────────────────────────────────────────
interface RecentlyViewedItem {
  id: string;
  title: string;
  price: number;
  currency: string;
  city: string;
  viewedAt: string;
  category: string;
  seller: string;
  status?: "sold" | "unavailable" | "active";
  priceDrop?: { amount: number; originalPrice: number };
}

const initialItems: RecentlyViewedItem[] = [
  { id: "rv1", title: "iPhone 14 Pro Max", price: 650000, currency: "NGN", city: "Lagos", viewedAt: "2 hours ago", category: "for-sale", seller: "Emeka O.", status: "active" },
  { id: "rv2", title: "3BR Flat Lekki Phase 1", price: 2500000, currency: "NGN", city: "Lagos", viewedAt: "5 hours ago", category: "housing", seller: "PropertyPro", status: "active" },
  { id: "rv3", title: "Logo Design Service", price: 50000, currency: "NGN", city: "Abuja", viewedAt: "1 day ago", category: "services", seller: "Amina K.", status: "active" },
  { id: "rv4", title: "WordPress Blog Setup", price: 75000, currency: "NGN", city: "Port Harcourt", viewedAt: "1 day ago", category: "gigs", seller: "Chidi M.", status: "sold" },
  { id: "rv5", title: "MacBook Air M2", price: 800000, currency: "NGN", city: "Lagos", viewedAt: "2 days ago", category: "for-sale", seller: "TechDeals", status: "active", priceDrop: { amount: 50000, originalPrice: 850000 } },
  { id: "rv6", title: "Social Media Campaign", price: 150000, currency: "NGN", city: "Lagos", viewedAt: "3 days ago", category: "jobs", seller: "Fatima A.", status: "active" },
  { id: "rv7", title: "Mountain Bike Trek 7", price: 400000, currency: "NGN", city: "Lagos", viewedAt: "4 days ago", category: "for-sale", seller: "LagosBikes", status: "unavailable" },
  { id: "rv8", title: "Data Entry Project", price: 30000, currency: "NGN", city: "Lagos", viewedAt: "5 days ago", category: "gigs", seller: "Chinedu E.", status: "active" },
];

const categoryColorMap: Record<string, string> = {
  gigs: "bg-emerald-100 text-emerald-700",
  services: "bg-teal-100 text-teal-700",
  jobs: "bg-cyan-100 text-cyan-700",
  "for-sale": "bg-amber-100 text-amber-700",
  housing: "bg-orange-100 text-orange-700",
  community: "bg-rose-100 text-rose-700",
};

const categoryIconMap: Record<string, React.ReactNode> = {
  gigs: <Zap className="h-3.5 w-3.5" />,
  services: <Wrench className="h-3.5 w-3.5" />,
  jobs: <Briefcase className="h-3.5 w-3.5" />,
  "for-sale": <ShoppingCart className="h-3.5 w-3.5" />,
  housing: <Home className="h-3.5 w-3.5" />,
  community: <Users className="h-3.5 w-3.5" />,
};

const categoryImgMap: Record<string, { icon: string; bg: string }> = {
  gigs: { icon: "Laptop", bg: "bg-emerald-50" },
  services: { icon: "Wrench", bg: "bg-teal-50" },
  jobs: { icon: "Briefcase", bg: "bg-cyan-50" },
  "for-sale": { icon: "Package", bg: "bg-amber-50" },
  housing: { icon: "Home", bg: "bg-orange-50" },
  community: { icon: "Users", bg: "bg-rose-50" },
};

const categoryLucideIconMap: Record<string, LucideIcon> = {
  Laptop,
  SlidersHorizontal,
  Briefcase,
  Package,
  Home,
  Users,
};

type SortOption = "recent" | "price_low" | "price_high";

// ─── Item Card ───────────────────────────────────────────────
function ViewedItemCard({ item }: { item: RecentlyViewedItem }) {
  const catLabel = categories.find((c) => c.id === item.category)?.name || item.category;
  const img = categoryImgMap[item.category] || { icon: "Package", bg: "bg-gray-50" };
  const CategoryIcon = categoryLucideIconMap[img.icon] || Package;

  return (
    <Card className={`group hover:shadow-md transition-all duration-200 overflow-hidden ${item.status === "sold" ? "opacity-70" : item.status === "unavailable" ? "opacity-50" : "hover:border-emerald-200"}`}>
      {/* Image area */}
      <div className={`relative h-36 flex items-center justify-center ${img.bg}`}>
        <CategoryIcon className="h-10 w-10 text-gray-500/70" />
        {/* Status badges */}
        {item.status === "sold" && (
          <Badge className="absolute top-2 left-2 bg-rose-500 text-white hover:bg-rose-500 gap-1">
            <AlertTriangle className="h-3 w-3" />
            Sold
          </Badge>
        )}
        {item.status === "unavailable" && (
          <Badge variant="secondary" className="absolute top-2 left-2 bg-gray-500 text-white hover:bg-gray-500 gap-1">
            No longer available
          </Badge>
        )}
        {item.priceDrop && item.status === "active" && (
          <Badge className="absolute top-2 right-2 bg-emerald-500 text-white hover:bg-emerald-500 gap-1">
            <TrendingDown className="h-3 w-3" />
            ₦{(item.priceDrop.amount / 1000).toFixed(0)}K less!
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className={`text-xs ${categoryColorMap[item.category] || ""}`}>
            {categoryIconMap[item.category]}
            <span className="ml-1">{catLabel}</span>
          </Badge>
        </div>
        <h3 className={`font-semibold text-sm leading-snug line-clamp-1 mb-2 ${item.status === "active" ? "group-hover:text-emerald-700" : ""} transition-colors`}>
          {item.title}
        </h3>

        {/* Price drop alert */}
        {item.priceDrop && item.status === "active" && (
          <div className="flex items-center gap-2 mb-2 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
            <TrendingDown className="h-4 w-4 text-emerald-600 shrink-0" />
            <p className="text-xs text-emerald-700">
              <span className="font-semibold">₦{item.priceDrop.amount.toLocaleString()}</span> less than when you viewed!
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-emerald-700 text-sm">
              {formatCurrency(item.price, item.currency)}
            </span>
            {item.priceDrop && (
              <span className="text-xs text-muted-foreground line-through ml-1.5">
                {formatCurrency(item.priceDrop.originalPrice, item.currency)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {item.city}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            Viewed {item.viewedAt}
          </span>
        </div>

        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>by {item.seller}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ───────────────────────────────────────────────
export default function RecentlyViewedPage() {
  const [items, setItems] = useState<RecentlyViewedItem[]>(initialItems);
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === "price_low") return a.price - b.price;
    if (sortBy === "price_high") return b.price - a.price;
    return 0; // "recent" = default order
  });

  const handleClearAll = () => {
    setItems([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <History className="h-6 w-6 text-primary" />
            Recently Viewed
          </h1>
          <p className="text-muted-foreground mt-1">
            Items you&apos;ve recently browsed, with price drop alerts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="h-9 w-[180px]">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently viewed</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
          {items.length > 0 && (
            <Button variant="outline" onClick={handleClearAll} className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Viewed</p>
            <p className="text-2xl font-bold">{items.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Price Drops</p>
            <p className="text-2xl font-bold text-emerald-600">
              {items.filter((i) => i.priceDrop).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Sold</p>
            <p className="text-2xl font-bold text-rose-600">
              {items.filter((i) => i.status === "sold").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Available</p>
            <p className="text-2xl font-bold text-primary">
              {items.filter((i) => i.status === "active").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No recently viewed items</h3>
            <p className="text-muted-foreground mt-1 max-w-sm">
              Start browsing listings and they&apos;ll appear here. We&apos;ll also alert you about price drops!
            </p>
            <Link href="/browse" className="mt-4">
              <Button className="gap-2">
                <Eye className="h-4 w-4" />
                Start Browsing
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Items Grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedItems.map((item) => (
            <ViewedItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
