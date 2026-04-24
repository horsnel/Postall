"use client";

import { useState } from "react";
import Link from "next/link";
import { categories, cities } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  Star,
  Shield,
  BadgeCheck,
  Crown,
  Clock,
  CheckCircle2,
  MessageCircle,
  ArrowUpDown,
  Filter,
  Sparkles,
  Zap,
  SlidersHorizontal,
  Briefcase,
  ShoppingCart,
  Home,
  Users,
  TrendingUp,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────
interface VerifiedSeller {
  id: string;
  name: string;
  username: string;
  avatar: string;
  city: string;
  role: string;
  rating: number;
  reviews: number;
  completed: number;
  verified: boolean;
  topSeller: boolean;
  responseTime: string;
  categories: string[];
}

const sellers: VerifiedSeller[] = [
  { id: "vs1", name: "Emeka Okafor", username: "emeka_creates", avatar: "EO", city: "Lagos", role: "Freelancer", rating: 4.9, reviews: 127, completed: 89, verified: true, topSeller: true, responseTime: "< 1hr", categories: ["Gigs", "Services"] },
  { id: "vs2", name: "Amina Kaduna", username: "amina_designs", avatar: "AK", city: "Abuja", role: "Service Provider", rating: 4.8, reviews: 94, completed: 63, verified: true, topSeller: false, responseTime: "< 2hrs", categories: ["Services"] },
  { id: "vs3", name: "PropertyPro NG", username: "propertypro_ng", avatar: "PP", city: "Lagos", role: "Real Estate Agent", rating: 4.9, reviews: 256, completed: 180, verified: true, topSeller: true, responseTime: "< 30min", categories: ["Housing"] },
  { id: "vs4", name: "Kola Mensah", username: "kwame_fixes", avatar: "KM", city: "Lagos", role: "Errand Runner", rating: 4.7, reviews: 45, completed: 112, verified: true, topSeller: false, responseTime: "< 1hr", categories: ["Gigs", "Services"] },
  { id: "vs5", name: "TechDeals Official", username: "techdeals", avatar: "TD", city: "Lagos", role: "Seller", rating: 4.8, reviews: 312, completed: 450, verified: true, topSeller: true, responseTime: "< 15min", categories: ["For Sale"] },
  { id: "vs6", name: "Fatima Abdullahi", username: "fatima_social", avatar: "FA", city: "Abuja", role: "Freelancer", rating: 5.0, reviews: 78, completed: 54, verified: true, topSeller: false, responseTime: "< 2hrs", categories: ["Jobs", "Services"] },
  { id: "vs7", name: "Lagos Auto Hub", username: "lagos_auto", avatar: "LA", city: "Lagos", role: "Seller", rating: 4.6, reviews: 189, completed: 320, verified: true, topSeller: true, responseTime: "< 1hr", categories: ["For Sale"] },
  { id: "vs8", name: "Blessing Okoro", username: "blessing_homes", avatar: "BO", city: "Abuja", role: "Real Estate Agent", rating: 4.9, reviews: 67, completed: 43, verified: true, topSeller: false, responseTime: "< 45min", categories: ["Housing"] },
  { id: "vs9", name: "QuickFix Services", username: "quickfix_ng", avatar: "QF", city: "Lagos", role: "Service Provider", rating: 4.8, reviews: 201, completed: 287, verified: true, topSeller: true, responseTime: "< 30min", categories: ["Services", "Gigs"] },
];

const categoryColorMap: Record<string, string> = {
  Gigs: "bg-emerald-100 text-emerald-700",
  Services: "bg-teal-100 text-teal-700",
  Jobs: "bg-cyan-100 text-cyan-700",
  "For Sale": "bg-amber-100 text-amber-700",
  Housing: "bg-orange-100 text-orange-700",
  Community: "bg-rose-100 text-rose-700",
};

const roleColors: Record<string, string> = {
  "Freelancer": "bg-emerald-100 text-emerald-700",
  "Service Provider": "bg-teal-100 text-teal-700",
  "Real Estate Agent": "bg-orange-100 text-orange-700",
  "Errand Runner": "bg-cyan-100 text-cyan-700",
  "Seller": "bg-amber-100 text-amber-700",
};

// ─── Seller Card ─────────────────────────────────────────────
function SellerCard({ seller }: { seller: VerifiedSeller }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-emerald-200 overflow-hidden">
      {/* Top banner */}
      <div className="h-16 bg-gradient-to-r from-emerald-500 to-teal-500 relative">
        {seller.topSeller && (
          <Badge className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 hover:bg-yellow-400 gap-1 text-xs">
            <Crown className="h-3 w-3" />
            Top Seller
          </Badge>
        )}
      </div>
      <CardContent className="p-5 -mt-8 relative">
        {/* Avatar */}
        <div className="flex items-end gap-3 mb-4">
          <div className="relative">
            <Avatar className="h-16 w-16 border-4 border-white shadow-md">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                {seller.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white">
              <BadgeCheck className="h-3.5 w-3.5 text-white" />
            </div>
          </div>
          <div className="pb-1 min-w-0">
            <h3 className="font-bold text-base truncate group-hover:text-emerald-700 transition-colors">
              {seller.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">@{seller.username}</p>
          </div>
        </div>

        {/* Info badges */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <Badge variant="secondary" className={`text-xs ${roleColors[seller.role] || "bg-gray-100 text-gray-700"}`}>
            {seller.role}
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {seller.city}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-bold text-sm">{seller.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({seller.reviews} reviews)
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y">
          <div className="text-center">
            <p className="font-bold text-sm text-emerald-700">{seller.completed}</p>
            <p className="text-[11px] text-muted-foreground">Completed</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-sm text-emerald-700">{seller.reviews}</p>
            <p className="text-[11px] text-muted-foreground">Reviews</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-sm text-emerald-700 flex items-center justify-center gap-1">
              <Clock className="h-3 w-3" />
            </p>
            <p className="text-[11px] text-muted-foreground">{seller.responseTime}</p>
          </div>
        </div>

        {/* Category tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {seller.categories.map((cat) => (
            <Badge key={cat} variant="outline" className={`text-xs ${categoryColorMap[cat] || ""}`}>
              {cat}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/user/${seller.username}`} className="flex-1">
            <Button size="sm" variant="outline" className="w-full gap-1.5">
              <Search className="h-3.5 w-3.5" />
              View Profile
            </Button>
          </Link>
          <Button size="sm" className="flex-1 gap-1.5">
            <MessageCircle className="h-3.5 w-3.5" />
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ───────────────────────────────────────────────
export default function VerifiedSellersPage() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  const filtered = [...sellers]
    .filter((s) => {
      if (categoryFilter !== "all" && !s.categories.includes(categoryFilter)) return false;
      if (cityFilter !== "all" && s.city !== cityFilter) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "reviews") return b.reviews - a.reviews;
      if (sortBy === "listings") return b.completed - a.completed;
      return 0;
    });

  const topSellerCount = sellers.filter((s) => s.topSeller).length;

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <div className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-b">
          <div className="container mx-auto px-4 py-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
              <Shield className="h-4 w-4" />
              Verified & Trusted
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Verified Sellers
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Trusted professionals with verified identity and excellent reviews
            </p>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-muted-foreground">ID Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                <span className="text-muted-foreground">4.5+ Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <span className="text-muted-foreground">{topSellerCount} Top Sellers</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              Filters:
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-9 w-[160px]">
                <Sparkles className="h-4 w-4 text-muted-foreground mr-1" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="h-9 w-[160px]">
                <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.slice(0, 8).map((city) => (
                  <SelectItem key={city.name} value={city.name}>{city.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-9 w-[180px]">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rating</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
                <SelectItem value="listings">Most Listings</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground ml-auto">
              Showing <span className="font-medium text-foreground">{filtered.length}</span> verified sellers
            </p>
          </div>

          {/* Seller Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((seller) => (
              <SellerCard key={seller.id} seller={seller} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No sellers match your filters</h3>
              <p className="text-muted-foreground">Try adjusting your category or city filters.</p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 text-center">
            <Card className="border-dashed bg-gradient-to-r from-emerald-50 to-teal-50 max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <TrendingUp className="h-10 w-10 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold mb-2">Become a Verified Seller</h3>
                <p className="text-muted-foreground mb-6">
                  Get verified to build trust, attract more buyers, and grow your business on PostAll.
                </p>
                <Link href="/verify-seller">
                  <Button className="gap-2">
                    <Shield className="h-4 w-4" />
                    Start Verification
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

    </div>
  );
}
