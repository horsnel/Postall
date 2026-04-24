"use client";

import { useState } from "react";
import Link from "next/link";
// Header and Footer are provided by ClientLayout - no duplicates needed
import { categories } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Zap,
  SlidersHorizontal,
  Briefcase,
  ShoppingCart,
  Users,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Layers,
  Monitor,
  Palette,
  HardHat,
  PenTool,
  Camera,
  Video,
  Music,
  Car,
  Sparkles,
  Scissors,
  PaintBucket,
  PartyPopper,
  HeartPulse,
  Scale,
  GraduationCap,
  Calculator,
  Headphones,
  BookOpen,
  Cpu,
  Megaphone,
  Smartphone,
  Truck,
  Armchair,
  Shirt,
  Flower2,
  Dumbbell,
  Library,
  Baby,
  TreePine,
  Compass,
  UserSearch,
  Music2,
  Dog,
  HandHelping,
  Search,
  CalendarDays,
} from "lucide-react";

// ─── Category Data ───────────────────────────────────────────
const categoryData = [
  {
    id: "gigs",
    name: "Gigs",
    icon: Zap,
    description: "Quick one-off jobs and tasks",
    color: "emerald",
    listings: "1,245",
    gradient: "from-emerald-500 to-teal-500",
    bgLight: "bg-emerald-50",
    borderColor: "hover:border-emerald-300",
    subcategories: [
      { name: "Computer", icon: Monitor, count: 312 },
      { name: "Creative", icon: Palette, count: 198 },
      { name: "Labor", icon: HardHat, count: 245 },
      { name: "Writing", icon: PenTool, count: 167 },
      { name: "Photography", icon: Camera, count: 156 },
      { name: "Video", icon: Video, count: 89 },
      { name: "Music", icon: Music, count: 78 },
    ],
  },
  {
    id: "services",
    name: "Services",
    icon: SlidersHorizontal,
    description: "Professional and freelance services",
    color: "teal",
    listings: "2,847",
    gradient: "from-teal-500 to-cyan-500",
    bgLight: "bg-teal-50",
    borderColor: "hover:border-teal-300",
    subcategories: [
      { name: "Automotive", icon: Car, count: 345 },
      { name: "Beauty & Spa", icon: Sparkles, count: 289 },
      { name: "Cleaning", icon: PaintBucket, count: 198 },
      { name: "Computer", icon: Monitor, count: 312 },
      { name: "Event", icon: PartyPopper, count: 234 },
      { name: "Health", icon: HeartPulse, count: 178 },
      { name: "Legal", icon: Scale, count: 156 },
      { name: "Lessons", icon: GraduationCap, count: 245 },
    ],
  },
  {
    id: "jobs",
    name: "Jobs",
    icon: Briefcase,
    description: "Full-time and part-time employment",
    color: "cyan",
    listings: "1,893",
    gradient: "from-cyan-500 to-blue-500",
    bgLight: "bg-cyan-50",
    borderColor: "hover:border-cyan-300",
    subcategories: [
      { name: "Accounting", icon: Calculator, count: 167 },
      { name: "Customer Service", icon: Headphones, count: 234 },
      { name: "Education", icon: BookOpen, count: 198 },
      { name: "Engineering", icon: Cpu, count: 145 },
      { name: "Healthcare", icon: HeartPulse, count: 189 },
      { name: "IT", icon: Monitor, count: 312 },
      { name: "Marketing", icon: Megaphone, count: 278 },
      { name: "Sales", icon: Smartphone, count: 270 },
    ],
  },
  {
    id: "for-sale",
    name: "For Sale",
    icon: ShoppingCart,
    description: "Buy and sell items locally",
    color: "amber",
    listings: "4,521",
    gradient: "from-amber-500 to-orange-500",
    bgLight: "bg-amber-50",
    borderColor: "hover:border-amber-300",
    subcategories: [
      { name: "Electronics", icon: Smartphone, count: 1234 },
      { name: "Vehicles", icon: Truck, count: 567 },
      { name: "Furniture", icon: Armchair, count: 389 },
      { name: "Fashion", icon: Shirt, count: 890 },
      { name: "Home & Garden", icon: Flower2, count: 456 },
      { name: "Sports", icon: Dumbbell, count: 345 },
      { name: "Books", icon: Library, count: 345 },
      { name: "Kids", icon: Baby, count: 195 },
    ],
  },

  {
    id: "community",
    name: "Community",
    icon: Users,
    description: "Events, groups, and activities",
    color: "rose",
    listings: "967",
    gradient: "from-rose-500 to-pink-500",
    bgLight: "bg-rose-50",
    borderColor: "hover:border-rose-300",
    subcategories: [
      { name: "Activities", icon: Compass, count: 145 },
      { name: "Artists", icon: Palette, count: 89 },
      { name: "Events", icon: CalendarDays, count: 234 },
      { name: "Groups", icon: Users, count: 178 },
      { name: "Lost & Found", icon: UserSearch, count: 67 },
      { name: "Musicians", icon: Music2, count: 78 },
      { name: "Pets", icon: Dog, count: 112 },
      { name: "Volunteers", icon: HandHelping, count: 64 },
    ],
  },
];

// ─── Category Card ───────────────────────────────────────────
function CategoryCard({ cat }: { cat: (typeof categoryData)[0] }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = cat.icon;

  return (
    <Card
      className={`group transition-all duration-300 hover:shadow-lg ${cat.borderColor} cursor-pointer overflow-hidden`}
      onClick={() => setExpanded(!expanded)}
    >
      <CardContent className="p-6">
        {/* Top Section */}
        <div className="flex items-start gap-4">
          <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shrink-0 shadow-sm`}>
            <Icon className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg group-hover:text-emerald-700 transition-colors">{cat.name}</h3>
              <Badge variant="secondary" className="text-xs font-medium">
                {cat.listings}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{cat.description}</p>
          </div>
        </div>

        {/* Subcategory tags (collapsed view) */}
        {!expanded && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {cat.subcategories.slice(0, 4).map((sub) => (
              <span
                key={sub.name}
                className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground"
              >
                {sub.name}
              </span>
            ))}
            {cat.subcategories.length > 4 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                +{cat.subcategories.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Expanded subcategories */}
        {expanded && (
          <div className="mt-4 space-y-2">
            <Separator />
            <div className="grid grid-cols-2 gap-2 pt-2">
              {cat.subcategories.map((sub) => {
                const SubIcon = sub.icon;
                return (
                  <Link
                    key={sub.name}
                    href={`/browse/${cat.id}?sub=${sub.name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-accent transition-colors group/sub"
                  >
                    <div className={`h-8 w-8 rounded-lg ${cat.bgLight} flex items-center justify-center shrink-0`}>
                      <SubIcon className="h-4 w-4 text-muted-foreground group-hover/sub:text-emerald-600 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate group-hover/sub:text-emerald-700 transition-colors">{sub.name}</p>
                      <p className="text-xs text-muted-foreground">{sub.count.toLocaleString()} listings</p>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover/sub:opacity-100 transition-opacity" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Expand indicator */}
        <div className="mt-4 flex items-center justify-center text-xs text-muted-foreground">
          {expanded ? (
            <span className="flex items-center gap-1">
              <ChevronDown className="h-3.5 w-3.5" />
              Click to collapse
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5" />
              Click to see all subcategories
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ───────────────────────────────────────────────
export default function CategoriesPage() {
  const totalListings = categoryData.reduce((sum, cat) => sum + parseInt(cat.listings.replace(/,/g, "")), 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-b">
          <div className="container mx-auto px-4 py-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-4">
              <Layers className="h-4 w-4" />
              {totalListings.toLocaleString()}+ active listings
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Browse All Categories
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Explore thousands of listings across all categories. Find exactly what you need.
            </p>
          </div>
        </div>

        {/* Category Grid */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryData.map((cat) => (
              <CategoryCard key={cat.id} cat={cat} />
            ))}
          </div>

          {/* Browse All CTA */}
          <div className="mt-12 text-center">
            <Card className="border-dashed bg-gradient-to-r from-emerald-50 to-teal-50 max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <Search className="h-10 w-10 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold mb-2">Can&apos;t find what you&apos;re looking for?</h3>
                <p className="text-muted-foreground mb-6">
                  Try our advanced search to find exactly what you need across all categories and cities.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Link href="/search">
                    <Button className="gap-2">
                      <Search className="h-4 w-4" />
                      Advanced Search
                    </Button>
                  </Link>
                  <Link href="/browse">
                    <Button variant="outline" className="gap-2">
                      <ArrowRight className="h-4 w-4" />
                      Browse All Listings
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
