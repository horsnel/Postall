"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import MagicLinkModal from "@/components/layout/magic-link-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  MapPin,
  Star,
  Shield,
  Heart,
  Share2,
  Flag,
  MessageCircle,
  Calendar,
  Clock,
  CheckCircle2,
  Zap,
  SlidersHorizontal,
  Award,
  Users,
  ThumbsUp,
  Briefcase,
  ArrowRight,
  ChevronLeft,
  DollarSign,
  Wrench,
} from "lucide-react";
import { WhatsAppButton } from "@/components/share/whatsapp-button";

// ─── Sample service data ──────────────────────────────────────
const serviceProviders: Record<string, {
  name: string;
  city: string;
  bio: string;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  verified: boolean;
  topRated: boolean;
  memberSince: string;
  initials: string;
  services: { name: string; description: string }[];
  tiers: { name: string; price: number; features: string[]; popular?: boolean }[];
  availability: { day: string; hours: string; available: boolean }[];
  reviews: { name: string; initials: string; rating: number; text: string; date: string }[];
  reviewDistribution: { stars: number; count: number }[];
}> = {
  "1": {
    name: "Emeka Okeke",
    city: "Lagos",
    bio: "Full-stack web developer with 8+ years of experience building scalable web applications, e-commerce platforms, and custom software solutions. I specialize in React, Next.js, Node.js, and cloud architecture.",
    rating: 4.9,
    reviewCount: 127,
    completedJobs: 89,
    verified: true,
    topRated: true,
    memberSince: "Sep 2023",
    initials: "EO",
    services: [
      { name: "Web Development", description: "Custom websites and web applications" },
      { name: "Mobile App Development", description: "iOS and Android apps using React Native" },
      { name: "UI/UX Design", description: "Modern, user-centered interface design" },
      { name: "API Development", description: "RESTful and GraphQL API design" },
      { name: "Database Design", description: "Database architecture and optimization" },
    ],
    tiers: [
      {
        name: "Basic",
        price: 150,
        features: [
          "Single page website or landing page",
          "Responsive design (mobile + desktop)",
          "Up to 3 sections",
          "Contact form integration",
          "1 round of revisions",
        ],
      },
      {
        name: "Standard",
        price: 350,
        features: [
          "Multi-page website (up to 5 pages)",
          "Responsive design (all devices)",
          "Custom animations",
          "CMS integration",
          "SEO optimization",
          "3 rounds of revisions",
        ],
        popular: true,
      },
      {
        name: "Premium",
        price: 750,
        features: [
          "Full web application",
          "Custom backend and database",
          "User authentication system",
          "Admin dashboard",
          "Payment integration",
          "Performance optimization",
          "Unlimited revisions",
          "30-day support after delivery",
        ],
      },
    ],
    availability: [
      { day: "Monday", hours: "9:00 AM - 5:00 PM", available: true },
      { day: "Tuesday", hours: "9:00 AM - 5:00 PM", available: true },
      { day: "Wednesday", hours: "9:00 AM - 5:00 PM", available: true },
      { day: "Thursday", hours: "9:00 AM - 5:00 PM", available: true },
      { day: "Friday", hours: "9:00 AM - 3:00 PM", available: true },
      { day: "Saturday", hours: "10:00 AM - 2:00 PM", available: true },
      { day: "Sunday", hours: "Closed", available: false },
    ],
    reviews: [
      { name: "Amina Bello", initials: "AB", rating: 5, text: "Emeka delivered an amazing e-commerce platform for my fashion brand. Professional, communicative, and the quality exceeded my expectations. Highly recommended!", date: "2 weeks ago" },
      { name: "Kofi Asante", initials: "KA", rating: 5, text: "Great developer! Built my portfolio website in record time. Clean code, fast performance, and beautiful design. Will definitely hire again.", date: "1 month ago" },
      { name: "Sarah Okon", initials: "SO", rating: 4, text: "Solid work on my company website. The only minor issue was a small delay in the initial delivery, but the final result was worth the wait.", date: "2 months ago" },
    ],
    reviewDistribution: [
      { stars: 5, count: 98 },
      { stars: 4, count: 22 },
      { stars: 3, count: 5 },
      { stars: 2, count: 1 },
      { stars: 1, count: 1 },
    ],
  },
};

const fallbackProvider = {
  name: "Service Provider",
  city: "Lagos",
  bio: "Experienced professional offering quality services. Committed to delivering excellent results on time and within budget.",
  rating: 4.5,
  reviewCount: 25,
  completedJobs: 15,
  verified: true,
  topRated: false,
  memberSince: "Jan 2024",
  initials: "SP",
  services: [
    { name: "Service 1", description: "Professional service offering" },
    { name: "Service 2", description: "Expert consultation" },
  ],
  tiers: [
    { name: "Basic", price: 100, features: ["Basic service package", "1 revision", "Email support"] },
    { name: "Standard", price: 250, features: ["Standard service package", "3 revisions", "Priority support", "Additional features"] },
    { name: "Premium", price: 500, features: ["Premium service package", "Unlimited revisions", "24/7 support", "All features included", "Post-delivery support"] },
  ],
  availability: [
    { day: "Monday", hours: "9:00 AM - 5:00 PM", available: true },
    { day: "Tuesday", hours: "9:00 AM - 5:00 PM", available: true },
    { day: "Wednesday", hours: "9:00 AM - 5:00 PM", available: true },
    { day: "Thursday", hours: "9:00 AM - 5:00 PM", available: true },
    { day: "Friday", hours: "9:00 AM - 5:00 PM", available: true },
    { day: "Saturday", hours: "10:00 AM - 2:00 PM", available: false },
    { day: "Sunday", hours: "Closed", available: false },
  ],
  reviews: [
    { name: "Happy Client", initials: "HC", rating: 5, text: "Great service, delivered on time. Would definitely recommend.", date: "1 week ago" },
  ],
  reviewDistribution: [
    { stars: 5, count: 18 },
    { stars: 4, count: 5 },
    { stars: 3, count: 2 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ],
};

// ─── Main Component ──────────────────────────────────────────
export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = params.id as string;
  const { user } = useAuthStore();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const provider = serviceProviders[serviceId] || fallbackProvider;

  const handleBook = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    // TODO: Open booking dialog
  };

  const handleMessage = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    // TODO: Open message dialog
  };

  const handleSave = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setSaved(!saved);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: provider.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const totalReviews = provider.reviewDistribution.reduce((sum, d) => sum + d.count, 0);

  return (
    <>
      <div className="bg-gray-50/50">
        {/* Breadcrumb with Back Button */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-3 mb-3">
              <Link
                href="/browse"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back to Browse</span>
              </Link>
            </div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/browse">Browse</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/browse/services">Services</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{provider.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Provider Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <Avatar className="h-20 w-20 border-3 border-emerald-200 shadow-sm shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white font-bold text-2xl">
                  {provider.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{provider.name}</h1>
                  {provider.verified && (
                    <Badge className="bg-emerald-100 text-emerald-700 text-xs gap-1">
                      <Shield className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                  {provider.topRated && (
                    <Badge className="bg-amber-100 text-amber-700 text-xs gap-1">
                      <Award className="h-3 w-3" />
                      Top Rated
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{provider.city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-foreground">{provider.rating}</span>
                    <span>({provider.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    <span>{provider.completedJobs} jobs completed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Member since {provider.memberSince}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  {provider.bio}
                </p>
              </div>
              <div className="flex gap-2 sm:flex-col shrink-0">
                <Button className="h-10 gap-2" onClick={handleBook}>
                  <Calendar className="h-4 w-4" />
                  Book Now
                </Button>
                <Button variant="outline" className="h-10 gap-2" onClick={handleMessage}>
                  <MessageCircle className="h-4 w-4" />
                  Message
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* ── Left Column ── */}
            <div className="flex-1 min-w-0 space-y-6">
              {/* Services Offered */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-muted-foreground" />
                  Services Offered
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {provider.services.map((service, i) => (
                    <div key={i} className="p-4 rounded-lg border hover:border-teal-200 hover:bg-teal-50/30 transition-all">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="h-4 w-4 text-teal-600" />
                        <h3 className="text-sm font-semibold">{service.name}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">{service.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Tiers */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  Pricing Plans
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {provider.tiers.map((tier) => (
                    <div
                      key={tier.name}
                      className={`relative rounded-xl border p-5 flex flex-col ${
                        tier.popular
                          ? "border-emerald-300 bg-emerald-50/30 shadow-sm ring-2 ring-emerald-100"
                          : "hover:border-gray-300"
                      }`}
                    >
                      {tier.popular && (
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                          <Badge className="bg-emerald-600 text-white text-xs">
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      <h3 className="font-semibold text-base mb-1">{tier.name}</h3>
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-2xl font-bold text-emerald-700">
                          ₦{tier.price.toLocaleString()}
                        </span>
                      </div>
                      <Separator className="mb-4" />
                      <ul className="space-y-2.5 flex-1">
                        {tier.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={`w-full mt-4 h-10 ${
                          tier.popular ? "" : "bg-gray-900 hover:bg-gray-800"
                        }`}
                        onClick={handleBook}
                      >
                        Select Plan
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  Availability
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {provider.availability.map((slot) => (
                    <div
                      key={slot.day}
                      className={`flex items-center gap-3 p-3 rounded-lg border ${
                        slot.available
                          ? "bg-emerald-50/50 border-emerald-100"
                          : "bg-gray-50 border-gray-200 opacity-60"
                      }`}
                    >
                      <div
                        className={`h-3 w-3 rounded-full shrink-0 ${
                          slot.available ? "bg-emerald-500" : "bg-gray-300"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{slot.day}</p>
                        <p className="text-xs text-muted-foreground">{slot.hours}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  Reviews ({provider.reviewCount})
                </h2>

                {/* Review Summary */}
                <div className="flex flex-col sm:flex-row gap-6 mb-6">
                  {/* Overall rating */}
                  <div className="text-center sm:text-left shrink-0">
                    <div className="text-5xl font-bold text-foreground mb-1">{provider.rating}</div>
                    <div className="flex items-center gap-0.5 justify-center sm:justify-start mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(provider.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">{totalReviews} reviews</p>
                  </div>

                  {/* Distribution bars */}
                  <div className="flex-1 space-y-1.5">
                    {provider.reviewDistribution.map((dist) => (
                      <div key={dist.stars} className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-12 text-right">
                          {dist.stars} star
                        </span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all"
                            style={{
                              width: `${totalReviews > 0 ? (dist.count / totalReviews) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8">{dist.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="mb-6" />

                {/* Review list */}
                <div className="space-y-4">
                  {provider.reviews.map((review, i) => (
                    <div key={i} className="flex gap-3">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarFallback className="bg-gray-100 text-gray-600 text-xs font-medium">
                          {review.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{review.name}</span>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, j) => (
                                <Star
                                  key={j}
                                  className={`h-3 w-3 ${
                                    j < review.rating
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {review.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right Column (Sidebar) ── */}
            <div className="w-full lg:w-[340px] shrink-0 space-y-6">
              {/* Quick Actions */}
              <Card className="py-0 overflow-hidden">
                <CardContent className="p-6 space-y-3">
                  <Button className="w-full h-11 text-base font-semibold gap-2" onClick={handleBook}>
                    <Calendar className="h-5 w-5" />
                    Book Service
                  </Button>
                  <Button variant="outline" className="w-full h-10 gap-2" onClick={handleMessage}>
                    <MessageCircle className="h-4 w-4" />
                    Send Message
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 h-10"
                      onClick={handleSave}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${saved ? "fill-rose-500 text-rose-500" : ""}`} />
                      {saved ? "Saved" : "Save"}
                    </Button>
                    <Button variant="outline" className="flex-1 h-10" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                  <WhatsAppButton
                    title={`${provider.name} - ${provider.services[0]?.name || "Service"}`}
                    size="default"
                    variant="outline"
                    className="w-full"
                  />
                  <Button
                    variant="ghost"
                    className="w-full h-10 text-muted-foreground hover:text-rose-600"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Report
                  </Button>
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card className="py-0 overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-sm">Provider Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-lg bg-emerald-50">
                      <div className="text-xl font-bold text-emerald-700">{provider.completedJobs}</div>
                      <div className="text-xs text-muted-foreground">Jobs Done</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-amber-50">
                      <div className="text-xl font-bold text-amber-700">{provider.reviewCount}</div>
                      <div className="text-xs text-muted-foreground">Reviews</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-teal-50">
                      <div className="text-xl font-bold text-teal-700">{provider.rating}</div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-cyan-50">
                      <div className="text-xl font-bold text-cyan-700">
                        {Math.round((provider.completedJobs / (provider.reviewCount || 1)) * 100)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Response</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Badges */}
              <Card className="py-0 overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-sm mb-3">Trust Badges</h3>
                  <div className="space-y-2">
                    {provider.verified && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 text-sm">
                        <Shield className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="text-emerald-700 font-medium">Identity Verified</span>
                      </div>
                    )}
                    {provider.topRated && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 text-sm">
                        <Award className="h-4 w-4 text-amber-600 shrink-0" />
                        <span className="text-amber-700 font-medium">Top Rated Provider</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-teal-50 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                      <span className="text-teal-700 font-medium">Escrow Protected</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-cyan-50 text-sm">
                      <ThumbsUp className="h-4 w-4 text-cyan-600 shrink-0" />
                      <span className="text-cyan-700 font-medium">Satisfaction Guaranteed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Safety Tips */}
              <Card className="border-amber-200 bg-amber-50/50 py-0">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-amber-600" />
                    Safety Reminder
                  </h3>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      Always discuss requirements before booking
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      Use PostAll&apos;s escrow for secure payments
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      Keep all communication on the platform
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <MagicLinkModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}
