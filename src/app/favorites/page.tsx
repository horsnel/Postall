"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import MagicLinkModal from "@/components/layout/magic-link-modal";
import { sampleTasks, sampleListings } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronRight,
  Heart,
  MapPin,
  Clock,
  DollarSign,
  ShieldCheck,
  Package,
  ArrowRight,
} from "lucide-react";

type FilterTab = "all" | "tasks" | "items";

interface FavoriteItem {
  id: string;
  type: "task" | "item";
  title: string;
  price: number;
  city: string;
  category: string;
  postedAgo: string;
  favoritedAt: string;
}

const categoryColorMap: Record<string, string> = {
  gigs: "bg-emerald-100 text-emerald-700",
  services: "bg-teal-100 text-teal-700",
  jobs: "bg-cyan-100 text-cyan-700",
  "for-sale": "bg-amber-100 text-amber-700",
  housing: "bg-orange-100 text-orange-700",
  community: "bg-rose-100 text-rose-700",
};

const categoryLabelMap: Record<string, string> = {
  gigs: "Gigs",
  services: "Services",
  jobs: "Jobs",
  "for-sale": "For Sale",
  housing: "Housing",
  community: "Community",
};

const gradientBgs = [
  "bg-gradient-to-br from-emerald-100 to-teal-100",
  "bg-gradient-to-br from-teal-100 to-cyan-100",
  "bg-gradient-to-br from-amber-100 to-orange-100",
  "bg-gradient-to-br from-rose-100 to-pink-100",
  "bg-gradient-to-br from-cyan-100 to-sky-100",
  "bg-gradient-to-br from-orange-100 to-amber-100",
];

const sampleFavorites: FavoriteItem[] = [
  {
    id: "1",
    type: "task",
    title: "Build a responsive landing page for my restaurant",
    price: 150,
    city: "Lagos",
    category: "gigs",
    postedAgo: "2h ago",
    favoritedAt: "1h ago",
  },
  {
    id: "3",
    type: "task",
    title: "Design a logo for startup brand",
    price: 200,
    city: "Abuja",
    category: "services",
    postedAgo: "6h ago",
    favoritedAt: "3h ago",
  },
  {
    id: "1",
    type: "item",
    title: 'iPhone 14 Pro Max - 256GB',
    price: 650,
    city: "Lagos",
    category: "for-sale",
    postedAgo: "1h ago",
    favoritedAt: "30m ago",
  },
  {
    id: "4",
    type: "item",
    title: "Mountain Bike - Trek Marlin 7",
    price: 400,
    city: "Lagos",
    category: "for-sale",
    postedAgo: "8h ago",
    favoritedAt: "5h ago",
  },
  {
    id: "6",
    type: "task",
    title: "Social media management for small business",
    price: 300,
    city: "Lagos",
    category: "jobs",
    postedAgo: "3h ago",
    favoritedAt: "2h ago",
  },
  {
    id: "5",
    type: "item",
    title: "Gaming Chair - Secretlab Titan",
    price: 250,
    city: "Lagos",
    category: "for-sale",
    postedAgo: "12h ago",
    favoritedAt: "8h ago",
  },
  {
    id: "2",
    type: "task",
    title: "Move furniture to new apartment",
    price: 50,
    city: "Lagos",
    category: "gigs",
    postedAgo: "4h ago",
    favoritedAt: "1d ago",
  },
  {
    id: "2",
    type: "item",
    title: "MacBook Air M2",
    price: 800,
    city: "Lagos",
    category: "for-sale",
    postedAgo: "3h ago",
    favoritedAt: "6h ago",
  },
];

export default function FavoritesPage() {
  const { user } = useAuthStore();
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/favorites?userId=${user?.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.favorites && data.favorites.length > 0) {
            setFavorites(data.favorites);
            setLoading(false);
            return;
          }
        }
      } catch {
        // fallback to sample data
      }
      // Use sample data as fallback
      setFavorites(sampleFavorites);
      setLoading(false);
    };

    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const filteredFavorites = useMemo(() => {
    if (activeTab === "all") return favorites;
    return favorites.filter((f) => f.type === activeTab.replace("s", "") || (activeTab === "items" && f.type === "item") || (activeTab === "tasks" && f.type === "task"));
  }, [favorites, activeTab]);

  const handleRemove = (id: string, type: string) => {
    setFavorites((prev) => prev.filter((f) => !(f.id === id && f.type === type)));
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="h-20 w-20 rounded-full bg-rose-100 flex items-center justify-center mx-auto">
            <Heart className="h-10 w-10 text-rose-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Sign in to view your favorites</h1>
          <p className="text-muted-foreground text-lg">
            You need to be logged in to save and manage your favorite items and tasks.
          </p>
          <Button
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => setShowLogin(true)}
          >
            <ShieldCheck className="h-5 w-5 mr-2" />
            Sign In to Continue
          </Button>
          <MagicLinkModal open={showLogin} onOpenChange={setShowLogin} />
        </div>
      </div>
    );
  }

  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: favorites.length },
    { key: "tasks", label: "Tasks", count: favorites.filter((f) => f.type === "task").length },
    { key: "items", label: "Items", count: favorites.filter((f) => f.type === "item").length },
  ];

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30 mb-0">
        <div className="container mx-auto px-4 py-2.5 max-w-6xl">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/browse" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-foreground font-medium">Favorites</span>
          </nav>
        </div>
      </div>
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <Heart className="h-5 w-5 text-rose-600" />
            </div>
            My Favorites
          </h1>
          <p className="text-muted-foreground mt-1 ml-[52px]">
            Items and tasks you&apos;ve saved for later
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {favorites.length} saved {favorites.length === 1 ? "item" : "items"}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {tab.label}
            <span
              className={`ml-1.5 text-xs ${
                activeTab === tab.key ? "text-emerald-200" : "text-muted-foreground/60"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-44 w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 rounded-full bg-rose-50 flex items-center justify-center mb-6">
            <Heart className="h-10 w-10 text-rose-300" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-muted-foreground max-w-sm mb-6">
            {activeTab === "all"
              ? "Start browsing tasks and items, and tap the heart icon to save them here for quick access."
              : `You haven't saved any ${activeTab} yet. Browse and save them to find them here later.`}
          </p>
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/browse">
              Start Browsing
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFavorites.map((item, index) => (
            <Card
              key={`${item.type}-${item.id}`}
              className="overflow-hidden group hover:shadow-lg transition-shadow duration-200"
            >
              {/* Photo placeholder */}
              <div
                className={`h-44 ${gradientBgs[index % gradientBgs.length]} relative flex items-center justify-center`}
              >
                <div className="text-4xl opacity-30">
                  {item.type === "task" ? (
                    <Package className="h-12 w-12" />
                  ) : (
                    <DollarSign className="h-12 w-12" />
                  )}
                </div>
                <Badge
                  variant="secondary"
                  className={`absolute top-3 left-3 text-xs font-medium ${
                    categoryColorMap[item.category] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {categoryLabelMap[item.category] || item.category}
                </Badge>
                <button
                  onClick={() => handleRemove(item.id, item.type)}
                  className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 hover:bg-rose-50 flex items-center justify-center transition-colors shadow-sm"
                  title="Remove from favorites"
                >
                  <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                </button>
                <Badge
                  variant="secondary"
                  className="absolute bottom-3 left-3 text-xs bg-white/90 text-gray-700"
                >
                  {item.type === "task" ? "Task" : "For Sale"}
                </Badge>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-sm leading-snug line-clamp-2 mb-2 group-hover:text-emerald-600 transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-emerald-600">
                    ${item.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.type === "task" ? "Budget" : "Price"}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {item.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {item.postedAgo}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t">
                  <Button asChild variant="outline" size="sm" className="flex-1 h-8 text-xs">
                    <Link
                      href={
                        item.type === "task"
                          ? `/task/${item.id}`
                          : `/item/${item.id}`
                      }
                    >
                      View Details
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                    onClick={() => handleRemove(item.id, item.type)}
                    title="Remove from favorites"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
    </>
  );
}