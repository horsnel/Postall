"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { sampleListings } from "@/lib/constants";
import {
  Sparkles,
  Zap,
  Star,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Crown,
  Rocket,
  Eye,
  MapPin,
  Clock,
  Tag,
  ImageIcon,
  ShoppingCart,
} from "lucide-react";

export default function PromotePage() {
  return (
    <div className="flex min-h-screen flex-col">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-500 via-amber-600 to-orange-700 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/10 mb-6">
            <Sparkles className="h-8 w-8 text-amber-200" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Promote Your Listing
          </h1>
          <p className="text-lg md:text-xl text-amber-100 max-w-2xl mx-auto leading-relaxed">
            Get more visibility and sell faster with promoted listings. Reach thousands
            of potential buyers across the platform.
          </p>
        </div>
      </section>

      {/* Promotion Tiers */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-amber-300 text-amber-700">
              <Crown className="h-3.5 w-3.5 mr-1.5" />
              Promotion Packages
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Package</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select the promotion tier that fits your budget and selling goals.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Standard Boost */}
            <Card className="relative hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="h-14 w-14 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                  <Zap className="h-7 w-7 text-amber-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Standard Boost</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-emerald-700">&#8358;1,000</span>
                  <span className="text-sm text-muted-foreground">/listing</span>
                </div>
                <div className="space-y-3 mb-6">
                  {[
                    "Show at top of category for 7 days",
                    '"Promoted" badge on your listing',
                    "3x more views on average",
                  ].map((feature) => (
                    <div key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/dashboard/listings">
                  <Button variant="outline" className="w-full gap-2">
                    Boost Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Featured Spotlight */}
            <Card className="relative border-2 border-amber-500 hover:shadow-lg transition-shadow">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-amber-500 text-white">Most Popular</Badge>
              </div>
              <CardContent className="p-6">
                <div className="h-14 w-14 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                  <Star className="h-7 w-7 text-amber-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Featured Spotlight</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-emerald-700">&#8358;3,000</span>
                  <span className="text-sm text-muted-foreground">/listing</span>
                </div>
                <div className="space-y-3 mb-6">
                  {[
                    "Homepage placement for 14 days",
                    'Large "Featured" banner',
                    "5x more views on average",
                    "Priority in search results",
                  ].map((feature) => (
                    <div key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/dashboard/listings">
                  <Button className="w-full gap-2">
                    Go Featured
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Urgent Priority */}
            <Card className="relative hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="h-14 w-14 rounded-xl bg-rose-100 flex items-center justify-center mb-4">
                  <Rocket className="h-7 w-7 text-rose-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Urgent Priority</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-emerald-700">&#8358;5,000</span>
                  <span className="text-sm text-muted-foreground">/listing</span>
                </div>
                <div className="space-y-3 mb-6">
                  {[
                    "Top of ALL categories for 7 days",
                    '"Urgent" glow effect on listing',
                    "10x more views on average",
                    "Push notification to matching buyers",
                  ].map((feature) => (
                    <div key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/dashboard/listings">
                  <Button variant="outline" className="w-full gap-2">
                    Go Urgent
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* How Promotion Works */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-amber-300 text-amber-700">
              <ArrowRight className="h-3.5 w-3.5 mr-1.5" />
              Simple Process
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Promotion Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Getting started takes just 3 simple steps.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                step: 1,
                icon: <Tag className="h-6 w-6" />,
                title: "Select Listing",
                desc: "Choose which listing you want to promote from your dashboard.",
              },
              {
                step: 2,
                icon: <Crown className="h-6 w-6" />,
                title: "Choose Package",
                desc: "Pick Standard, Featured, or Urgent based on your budget and goals.",
              },
              {
                step: 3,
                icon: <Sparkles className="h-6 w-6" />,
                title: "Pay & Go",
                desc: "Payment via Paystack. Your listing goes live immediately after payment.",
              },
            ].map((item) => (
              <Card key={item.step} className="text-center">
                <CardContent className="p-6">
                  <div className="h-14 w-14 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center mx-auto mb-4 text-amber-700">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Before & After Comparison */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-emerald-300 text-emerald-700">
              <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
              Real Results
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Before &amp; After</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See the difference promotion makes. These are average results from promoted listings.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                label: "Before",
                views: "50 views/day",
                icon: <Eye className="h-5 w-5" />,
                color: "bg-gray-100 text-gray-600",
                highlight: false,
              },
              {
                label: "After (Standard)",
                views: "150 views/day",
                icon: <Zap className="h-5 w-5" />,
                color: "bg-amber-100 text-amber-700",
                highlight: true,
              },
              {
                label: "After (Featured)",
                views: "250 views/day",
                icon: <Star className="h-5 w-5" />,
                color: "bg-amber-100 text-amber-700",
                highlight: true,
              },
              {
                label: "After (Urgent)",
                views: "500 views/day",
                icon: <Rocket className="h-5 w-5" />,
                color: "bg-rose-100 text-rose-700",
                highlight: true,
              },
            ].map((item) => (
              <Card key={item.label} className={item.highlight ? "border-2 border-amber-300" : ""}>
                <CardContent className="p-6 text-center">
                  <div className={`h-12 w-12 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-4`}>
                    {item.icon}
                  </div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">{item.label}</h3>
                  <p className="text-2xl font-bold">{item.views}</p>
                  {item.highlight && (
                    <Badge className="mt-3 bg-emerald-100 text-emerald-700 text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Boosted
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Promoted Listings Preview */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-amber-300 text-amber-700">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Preview
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Promoted Listings Preview</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              This is how your promoted listing will look to buyers on PostAll.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleListings.slice(0, 3).map((listing) => (
              <Card key={listing.id} className="overflow-hidden ring-2 ring-amber-400 ring-offset-2 hover:shadow-lg transition-shadow relative">
                <Badge className="absolute top-3 left-3 z-10 bg-amber-500 text-white gap-1">
                  <Zap className="h-3 w-3" />
                  Promoted
                </Badge>
                <div className="aspect-[4/3] bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-amber-300" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold line-clamp-1 mb-2">{listing.title}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-emerald-700">
                      &#8358;{listing.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <MapPin className="h-3 w-3" />
                    {listing.city}
                    <span className="mx-1">|</span>
                    <Clock className="h-3 w-3" />
                    {listing.postedAgo}
                  </div>
                  <div className="text-center pt-3 border-t">
                    <p className="text-xs text-amber-600 font-medium">
                      &#8358;1,000 for 7 days
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/dashboard/listings">
              <Button size="lg" className="gap-2">
                <Sparkles className="h-5 w-5" />
                Promote Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-amber-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Sparkles className="h-12 w-12 mx-auto mb-6 text-amber-200" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Start Selling Faster Today
          </h2>
          <p className="text-amber-100 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Promoted listings get up to 10x more views. Choose your package and start
            reaching more buyers across Nigeria.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard/listings">
              <Button size="lg" variant="secondary" className="gap-2">
                <ShoppingCart className="h-4 w-4" />
                Promote Your Listing
              </Button>
            </Link>
            <Link href="/sell-item">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                Post a New Listing
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
