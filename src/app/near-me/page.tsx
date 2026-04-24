"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { categories, formatCurrency } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
import type { LucideIcon } from "lucide-react";
import {
  MapPin,
  Compass,
  Clock,
  Heart,
  SlidersHorizontal,
  Zap,
  Briefcase,
  ShoppingCart,
  Users,
  LocateFixed,
  Map,
  DollarSign,
  Crosshair,
  ArrowRight,
  Filter,
  Smartphone,
  Brush,
  Package,
  Palette,
  Car,
  Wrench,
  Navigation,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────
interface NearbyItem {
  id: string;
  title: string;
  price: number;
  distance: string;
  city: string;
  category: string;
  icon: string;
  time: string;
}

const nearbyItems: NearbyItem[] = [
  { id: "nm1", title: "iPhone 14 Pro Max", price: 650000, distance: "0.8 km", city: "Lagos, Lekki", category: "for-sale", icon: "Smartphone", time: "1h ago" },
  { id: "nm2", title: "Professional Cleaning Service", price: 25000, distance: "1.2 km", city: "Lagos, Victoria Island", category: "services", icon: "Brush", time: "3h ago" },
  { id: "nm3", title: "Moving Help Needed", price: 35000, distance: "2.1 km", city: "Lagos, Ikoyi", category: "gigs", icon: "Package", time: "5h ago" },
  { id: "nm4", title: "Graphic Designer Available", price: 50000, distance: "4.0 km", city: "Lagos, Surulere", category: "services", icon: "Palette", time: "2d ago" },
  { id: "nm5", title: "Toyota Camry 2019", price: 7500000, distance: "5.3 km", city: "Lagos, Ikeja", category: "for-sale", icon: "Car", time: "3d ago" },
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

const itemIconMap: Record<string, LucideIcon> = {
  Smartphone,
  Brush,
  Package,
  Palette,
  Car,
};

const itemBgColors: Record<string, string> = {
  Smartphone: "bg-violet-100",
  Brush: "bg-teal-100",
  Package: "bg-amber-100",
  Palette: "bg-rose-100",
  Car: "bg-blue-100",
};

const distanceOptions = [
  { value: "1", label: "1 km" },
  { value: "5", label: "5 km" },
  { value: "10", label: "10 km" },
  { value: "25", label: "25 km" },
  { value: "50", label: "50 km" },
  { value: "any", label: "Any distance" },
];

// ─── Mobile Filter Sheet ────────────────────────────────────
function FilterSheetContent({
  category,
  setCategory,
  distance,
  setDistance,
}: {
  category: string;
  setCategory: (v: string) => void;
  distance: string;
  setDistance: (v: string) => void;
}) {
  return (
    <div className="space-y-6 px-1">
      <div className="space-y-3">
        <h3 className="font-medium text-sm">Category</h3>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Separator />
      <div className="space-y-3">
        <h3 className="font-medium text-sm">Distance</h3>
        <RadioGroup value={distance} onValueChange={setDistance}>
          {distanceOptions.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2.5">
              <RadioGroupItem value={opt.value} id={`dist-${opt.value}`} className="data-[state=checked]:border-emerald-600 data-[state=checked]:text-emerald-600" />
              <Label htmlFor={`dist-${opt.value}`} className="text-sm cursor-pointer">{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}

// ─── Nearby Item Card ────────────────────────────────────────
function NearbyItemCard({ item }: { item: NearbyItem }) {
  const [fav, setFav] = useState(false);
  const catLabel = categories.find((c) => c.id === item.category)?.name || item.category;

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-emerald-200 overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className={`relative h-40 sm:h-auto sm:w-44 flex items-center justify-center shrink-0 ${itemBgColors[item.icon] || "bg-gray-100"}`}>
          {(() => {
            const ItemIcon = itemIconMap[item.icon] || Package;
            return <ItemIcon className="h-12 w-12 text-gray-500/70" />;
          })()}
          <button
            onClick={() => setFav(!fav)}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          >
            <Heart className={`h-4 w-4 ${fav ? "fill-rose-500 text-rose-500" : "text-gray-500"}`} />
          </button>
          {/* Distance badge */}
          <Badge className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-white text-emerald-700 hover:bg-white border-emerald-200 gap-1 shadow-sm">
            <Navigation className="h-3 w-3" />
            {item.distance}
          </Badge>
        </div>

        {/* Content */}
        <CardContent className="p-4 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className={`text-xs ${categoryColorMap[item.category] || ""}`}>
              {categoryIconMap[item.category]}
              <span className="ml-1">{catLabel}</span>
            </Badge>
          </div>
          <h3 className="font-semibold text-base leading-snug group-hover:text-emerald-700 transition-colors mb-2">
            {item.title}
          </h3>
          <p className="font-bold text-emerald-700 text-lg mb-2">
            {formatCurrency(item.price, "NGN")}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {item.city}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {item.time}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Button size="sm" className="gap-1.5">
              View Details
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5">
              <Map className="h-3.5 w-3.5" />
              View on Map
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

// ─── Main Page ───────────────────────────────────────────────
// ─── Google Maps configuration ───────────────────────────────
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
const MAPS_EMBED_URL = GOOGLE_MAPS_API_KEY && !GOOGLE_MAPS_API_KEY.includes("your-")
  ? `https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_API_KEY}&center=6.5244,3.3792&zoom=13&maptype=roadmap`
  : null;

export default function NearMePage() {
  const [detectedCity, setDetectedCity] = useState("Lagos");
  const [category, setCategory] = useState("all");
  const [distance, setDistance] = useState("10");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Browser geolocation detection
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // Nigerian cities near Lagos coordinates — keep Lagos as default for Nigeria region
        setDetectedCity("Lagos");
        console.log("[NearMe] Geolocation detected:", { latitude, longitude });
      },
      (error) => {
        // Silently fall back to default city
        console.log("[NearMe] Geolocation denied, using default city:", error.message);
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
    );
  }, []);

  return (
    <div className="bg-background">
      <div>
        {/* Hero with Map */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              {/* Map — real Google Maps embed or decorative placeholder */}
              <div className="relative h-48 md:h-64 rounded-2xl border-2 border-emerald-200 mb-6 overflow-hidden">
                {MAPS_EMBED_URL ? (
                  <iframe
                    src={MAPS_EMBED_URL}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps — Nearby listings"
                    className="absolute inset-0 w-full h-full"
                  />
                ) : (
                  /* Decorative map placeholder when API key is not configured */
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                      {/* Decorative grid lines */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="grid grid-cols-8 h-full">
                          {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="border-r border-emerald-800" />
                          ))}
                        </div>
                        <div className="grid grid-rows-6 h-full absolute inset-0">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="border-b border-emerald-800" />
                          ))}
                        </div>
                      </div>
                      {/* Center pin */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg animate-bounce">
                          <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div className="mt-2 h-2 w-2 rounded-full bg-emerald-500/50" />
                      </div>
                      {/* Scattered dots (listings) */}
                      <div className="absolute top-8 left-12 h-3 w-3 rounded-full bg-amber-500/70" />
                      <div className="absolute top-16 right-20 h-3 w-3 rounded-full bg-blue-500/70" />
                      <div className="absolute bottom-12 left-1/3 h-3 w-3 rounded-full bg-rose-500/70" />
                      <div className="absolute bottom-20 right-1/4 h-3 w-3 rounded-full bg-orange-500/70" />
                      <div className="absolute top-1/2 left-1/2 h-3 w-3 rounded-full bg-cyan-500/70" />
                    </div>
                  </>
                )}
              </div>

              {/* Title */}
              <div className="text-center mb-4">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                  Near Me
                </h1>
                <p className="text-muted-foreground">
                  Discover listings close to your location
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* Location Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
                <LocateFixed className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold text-emerald-700">
                    {detectedCity}
                  </p>
                  <p className="text-xs text-emerald-600/70">
                    Location detected
                  </p>
                </div>
                <button className="ml-2 text-xs text-emerald-600 hover:underline">
                  Change
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                Showing listings within{" "}
                <span className="font-medium text-foreground">
                  {distance === "any" ? "any distance" : `${distance}km`} of {detectedCity}
                </span>
              </p>
            </div>

            {/* Desktop Filters */}
            <div className="hidden md:flex items-center gap-3">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-9 w-[160px]">
                  <Filter className="h-4 w-4 text-muted-foreground mr-1" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={distance} onValueChange={setDistance}>
                <SelectTrigger className="h-9 w-[150px]">
                  <Navigation className="h-4 w-4 text-muted-foreground mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {distanceOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mobile Filter Button */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" className="h-9 gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="px-4 pb-4 mt-4">
                  <FilterSheetContent
                    category={category}
                    setCategory={setCategory}
                    distance={distance}
                    setDistance={setDistance}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{nearbyItems.length}</span> nearby listings
              </p>
            </div>
            {nearbyItems.map((item) => (
              <NearbyItemCard key={item.id} item={item} />
            ))}
          </div>

          {/* Location Tips */}
          <Card className="border-dashed bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <Crosshair className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Location-based search tips</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    Enable location services for more accurate results
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    Use Safe Spots for secure meetups with sellers
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    Narrow distance to find the closest matches first
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
