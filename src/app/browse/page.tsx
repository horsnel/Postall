"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import {
  cities,
  sampleTasks,
  recentActivity,
  tools,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CirclePlus,
  Search,
  MapPin,
  Clock,
  Users,
  Briefcase,
  Zap,
  ShoppingCart,
  Bot,
  TrendingUp,
  Shield,
  BadgeCheck,
  Camera,
  MessageCircle,
  Calendar,
  Truck,
  Lock,
  ChartColumnIncreasing,
  Bell,
  Languages,
  Users as UsersIcon,
  GraduationCap,
  Recycle,
  CalendarDays,
  Siren,
  Star,
  ArrowRight,
  CheckCircle2,
  Store,
  Activity,
  Sparkles,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

// ─── Icon Mapping for Tools ─────────────────────────────────
const toolIconMap: Record<string, typeof CirclePlus> = {
  CirclePlus,
  Search,
  ShoppingCart,
  Bot,
  TrendingUp,
  Shield,
  BadgeCheck,
  Camera,
  MessageCircle,
  Calendar,
  Truck,
  Lock,
  ChartColumnIncreasing,
  Bell,
  Languages,
  MapPin,
  Users: UsersIcon,
  GraduationCap,
  Recycle,
  CalendarDays,
  Siren,
  Zap,
  Star,
};

// ─── Get Tool Icon Component ─────────────────────────────────
function getToolIcon(iconName: string) {
  const IconComponent = toolIconMap[iconName] || CirclePlus;
  return <IconComponent className="h-5 w-5" />;
}

// ─── Color Mapping ───────────────────────────────────────────
const colorMap: Record<string, { bg: string; text: string; border: string; light: string }> = {
  emerald: {
    bg: "bg-emerald-500",
    text: "text-emerald-600",
    border: "border-emerald-200",
    light: "bg-emerald-50",
  },
  teal: {
    bg: "bg-teal-500",
    text: "text-teal-600",
    border: "border-teal-200",
    light: "bg-teal-50",
  },
  cyan: {
    bg: "bg-cyan-500",
    text: "text-cyan-600",
    border: "border-cyan-200",
    light: "bg-cyan-50",
  },
  amber: {
    bg: "bg-amber-500",
    text: "text-amber-600",
    border: "border-amber-200",
    light: "bg-amber-50",
  },
  rose: {
    bg: "bg-rose-500",
    text: "text-rose-600",
    border: "border-rose-200",
    light: "bg-rose-50",
  },
};

// ─── Category Icons ──────────────────────────────────────────
const categoryIconMap: Record<string, typeof Zap> = {
  gigs: Zap,
  services: SlidersHorizontal,
  jobs: Briefcase,
  "for-sale": ShoppingCart,
  community: Users,
};

function getCategoryIcon(categoryId: string) {
  const IconComponent = categoryIconMap[categoryId] || Briefcase;
  return <IconComponent className="h-4 w-4" />;
}

// ─── Sample Popular Stores ───────────────────────────────────
const popularStores = [
  {
    id: "1",
    name: "TechHub Lagos",
    logo: "TH",
    rating: 4.9,
    itemCount: 234,
    location: "Lagos",
    category: "Electronics",
    coverColor: "from-cyan-500 to-teal-500",
  },
  {
    id: "2",
    name: "Fashion Palace",
    logo: "FP",
    rating: 4.7,
    itemCount: 156,
    location: "Abuja",
    category: "Fashion",
    coverColor: "from-rose-500 to-pink-500",
  },
  {
    id: "3",
    name: "Home Essentials",
    logo: "HE",
    rating: 4.8,
    itemCount: 89,
    location: "Port Harcourt",
    category: "Home & Garden",
    coverColor: "from-amber-500 to-orange-500",
  },
  {
    id: "4",
    name: "GadgetZone",
    logo: "GZ",
    rating: 4.6,
    itemCount: 312,
    location: "Lagos",
    category: "Electronics",
    coverColor: "from-emerald-500 to-teal-500",
  },
];

// ─── Sample Recently Viewed ─────────────────────────────────
const recentlyViewedItems = [
  {
    id: "1",
    title: "iPhone 14 Pro Max - 256GB",
    price: 650000,
    city: "Lagos",
    image: null,
    viewedAt: "2 hours ago",
  },
  {
    id: "2",
    title: "MacBook Air M2",
    price: 800000,
    city: "Accra",
    image: null,
    viewedAt: "5 hours ago",
  },
  {
    id: "3",
    title: "Samsung 55\" Smart TV",
    price: 350000,
    city: "Nairobi",
    image: null,
    viewedAt: "Yesterday",
  },
];

// ─── Live Activity Ticker ────────────────────────────────────
function LiveActivityTicker() {
  const [currentActivity, setCurrentActivity] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentActivity((prev) => (prev + 1) % recentActivity.length);
        setIsVisible(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "task_completed":
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />;
      case "item_sold":
        return <ShoppingCart className="h-3.5 w-3.5 text-amber-500" />;
      case "new_task":
        return <Briefcase className="h-3.5 w-3.5 text-cyan-500" />;
      case "user_verified":
        return <BadgeCheck className="h-3.5 w-3.5 text-blue-500" />;
      case "review_posted":
        return <Star className="h-3.5 w-3.5 text-amber-500" />;
      case "task_assigned":
        return <Users className="h-3.5 w-3.5 text-teal-500" />;
      default:
        return <Activity className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  const activity = recentActivity[currentActivity];

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-full border border-emerald-200 dark:border-emerald-800">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <div
        className={`flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 transition-all duration-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
        }`}
      >
        {getActivityIcon(activity.type)}
        <span>{activity.text}</span>
        <span className="text-emerald-500 dark:text-emerald-600">• {activity.time}</span>
      </div>
    </div>
  );
}

// ─── Hero Section ────────────────────────────────────────────
function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");

  return (
    <section className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 -z-10" />
      <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-emerald-100/50 dark:bg-emerald-900/20 blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-teal-100/50 dark:bg-teal-900/20 blur-3xl -z-10" />

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-medium shadow-lg">
            <Sparkles className="h-4 w-4" />
            24 Free Tools - No Signup to Browse
          </div>

          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Nigeria&apos;s Trusted
              </span>
              <br />
              <span className="text-foreground">P2P Marketplace</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Post tasks, find work, sell items, and connect with verified people — all with escrow protection.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search tasks, jobs, items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 border-0 bg-transparent focus-visible:ring-0 text-base"
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="w-[140px] h-12 border-0 bg-gray-50 dark:bg-gray-800">
                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.slice(0, 10).map((city) => (
                      <SelectItem key={city.name} value={city.name}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="lg" className="h-12 px-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap justify-center gap-8 pt-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">50,000+</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">100,000+</p>
                <p className="text-sm text-muted-foreground">Listings</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center">
                <Shield className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">₦2B+</p>
                <p className="text-sm text-muted-foreground">In Escrow</p>
              </div>
            </div>
          </div>

          {/* Live Activity Ticker */}
          <div className="flex justify-center pt-4">
            <LiveActivityTicker />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Tools Grid Section ──────────────────────────────────────
function ToolsGridSection() {
  return (
    <section className="py-16 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            24 Free Tools at Your Fingertips
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to buy, sell, work, and connect — all in one place.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {tools.map((tool) => {
            const colors = colorMap[tool.color] || colorMap.emerald;
            return (
              <Link
                key={tool.id}
                href={`/tool/${tool.id}`}
                className="group"
              >
                <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border-transparent hover:border-emerald-200 dark:hover:border-emerald-800">
                  <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                    <div
                      className={`h-12 w-12 rounded-xl ${colors.light} dark:${colors.light.replace(
                        "bg-",
                        "bg-gray-800"
                      )} flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <span className={colors.text}>{getToolIcon(tool.icon)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {tool.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 hidden md:block">
                        {tool.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Featured Tasks Section ───────────────────────────────────
function FeaturedTasksSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Featured Tasks
            </h2>
            <p className="text-muted-foreground mt-1">
              High-priority tasks looking for people like you
            </p>
          </div>
          <Link
            href="/browse?filter=tasks"
            className="hidden md:flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium"
          >
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {sampleTasks.slice(0, 6).map((task) => {
            const colors = colorMap[task.category === "gigs" ? "emerald" : task.category === "services" ? "teal" : task.category === "jobs" ? "cyan" : "amber"];
            return (
              <Card
                key={task.id}
                className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <CardContent className="p-0">
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`${colors.light} ${colors.text} ${colors.border} text-xs`}
                        >
                          {getCategoryIcon(task.category)}
                          <span className="ml-1 capitalize">{task.category}</span>
                        </Badge>
                        {task.urgency === "urgent" && (
                          <Badge className="bg-rose-100 text-rose-700 text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        {task.postedAgo}
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 mb-3">
                      {task.title}
                    </h3>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{task.city}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{task.applicants} applicants</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                          ₦{task.budget.toLocaleString()}
                        </p>
                      </div>
                      <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600">
                        Apply Now
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Link
          href="/browse?filter=tasks"
          className="md:hidden flex items-center justify-center gap-1 mt-6 text-emerald-600 dark:text-emerald-400 font-medium"
        >
          View all tasks <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

// ─── Built on Trust Section ───────────────────────────────────
function TrustSection() {
  const trustBadges = [
    {
      icon: BadgeCheck,
      title: "Verified Sellers",
      description: "All sellers are ID verified for your safety",
      color: "emerald",
    },
    {
      icon: Lock,
      title: "Escrow Protection",
      description: "Payments held securely until job is done",
      color: "teal",
    },
    {
      icon: Star,
      title: "Ratings & Reviews",
      description: "Real reviews from real transactions",
      color: "amber",
    },
    {
      icon: Clock,
      title: "Fast Responses",
      description: "Average response time under 30 minutes",
      color: "cyan",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Built on Trust
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your safety is our priority. Every transaction is protected.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {trustBadges.map((badge, index) => {
            const Icon = badge.icon;
            const colors = colorMap[badge.color];
            return (
              <Card
                key={index}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-transparent shadow-md hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`h-14 w-14 rounded-2xl ${colors.light} dark:bg-gray-700 flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className={`h-7 w-7 ${colors.text}`} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{badge.title}</h3>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Recently Viewed Section ──────────────────────────────────
function RecentlyViewedSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Recently Viewed
            </h2>
            <p className="text-muted-foreground mt-1">
              Continue where you left off
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentlyViewedItems.map((item) => (
            <Card
              key={item.id}
              className="group hover:shadow-md transition-all cursor-pointer"
            >
              <CardContent className="p-4 flex gap-4">
                {/* Image Placeholder */}
                <div className="h-20 w-20 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center shrink-0">
                  <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    ₦{item.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {item.city}
                    </span>
                    <span>Viewed {item.viewedAt}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works Section ─────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Browse & Discover",
      description: "Search through thousands of tasks, jobs, and items from verified sellers across Nigeria.",
      icon: Search,
      color: "emerald",
    },
    {
      number: "02",
      title: "Post or Apply",
      description: "Post your own task or apply to existing ones. It's free to post tasks and browse listings.",
      icon: CirclePlus,
      color: "teal",
    },
    {
      number: "03",
      title: "Secure with Escrow",
      description: "Payments are held safely in escrow until the work is completed to your satisfaction.",
      icon: Lock,
      color: "cyan",
    },
    {
      number: "04",
      title: "Get Paid",
      description: "Complete the work, get great reviews, and receive instant payment to your bank account.",
      icon: TrendingUp,
      color: "amber",
    },
  ];

  return (
    <section className="py-16 bg-gray-50/50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Getting started is easy. Here's how PostAll works in 4 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const colors = colorMap[step.color];
            return (
              <div key={index} className="relative">
                {/* Connector Line - hidden on mobile and last item */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-800 -z-10" />
                )}
                <Card className="h-full bg-white dark:bg-gray-800 border-transparent shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <span className="text-3xl font-bold text-gray-200 dark:text-gray-700">
                        {step.number}
                      </span>
                      <div
                        className={`h-12 w-12 rounded-xl ${colors.light} dark:bg-gray-700 flex items-center justify-center`}
                      >
                        <Icon className={`h-6 w-6 ${colors.text}`} />
                      </div>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Popular Stores Section ───────────────────────────────────
function PopularStoresSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Popular Stores
            </h2>
            <p className="text-muted-foreground mt-1">
              Shop from trusted sellers with great reviews
            </p>
          </div>
          <Link
            href="/stores"
            className="hidden md:flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium"
          >
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {popularStores.map((store) => (
            <Card
              key={store.id}
              className="group overflow-hidden hover:shadow-lg transition-all cursor-pointer"
            >
              <CardContent className="p-0">
                {/* Cover */}
                <div
                  className={`h-24 bg-gradient-to-r ${store.coverColor} relative`}
                >
                  <div className="absolute -bottom-6 left-4">
                    <div className="h-14 w-14 rounded-xl bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center border-2 border-white">
                      <span className="font-bold text-lg text-gray-700 dark:text-gray-200">
                        {store.logo}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-8 pb-4 px-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {store.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">{store.category}</p>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="h-4 w-4 fill-amber-400" />
                      <span className="text-sm font-medium">{store.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Store className="h-3 w-3" />
                      {store.itemCount} items
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {store.location}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Link
          href="/stores"
          className="md:hidden flex items-center justify-center gap-1 mt-6 text-emerald-600 dark:text-emerald-400 font-medium"
        >
          View all stores <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

// ─── CTA Section ──────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 border-0 shadow-xl overflow-hidden">
          <CardContent className="p-8 md:p-12 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white transform translate-x-1/3 -translate-y-1/3" />
              <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-white transform -translate-x-1/3 translate-y-1/3" />
            </div>

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Ready to Get Started?
                </h2>
                <p className="text-emerald-100 text-lg max-w-xl">
                  Join thousands of Nigerians already using PostAll to find work, sell items, and grow their business.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-white text-emerald-600 hover:bg-gray-100 min-w-[140px]"
                  >
                    Create Account
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/browse">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 min-w-[140px]"
                  >
                    Browse Listings
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// ─── Main Page ───────────────────────────────────────────────
export default function BrowsePageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="bg-gray-50/50 dark:bg-gray-900/50 min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="h-12 w-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <BrowsePage />
    </Suspense>
  );
}

function BrowsePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Tools Grid */}
      <ToolsGridSection />

      {/* Featured Tasks */}
      <FeaturedTasksSection />

      {/* Built on Trust */}
      <TrustSection />

      {/* Recently Viewed */}
      <RecentlyViewedSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Popular Stores */}
      <PopularStoresSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
