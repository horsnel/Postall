"use client";

import Link from "next/link";
import { TrendingUp, ChartColumnIncreasing, DollarSign, Bell, ArrowRight , ChevronLeft} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const features = [
  {
    icon: ChartColumnIncreasing,
    title: "Compare Prices Across Categories",
    description:
      "Instantly compare prices for services, gigs, and items across all marketplace categories. Make informed decisions with real-time data from thousands of active listings.",
  },
  {
    icon: TrendingUp,
    title: "Price History Trends",
    description:
      "Track how prices change over time with visual charts and trend analysis. Know the best time to buy or sell based on seasonal patterns and market demand.",
  },
  {
    icon: DollarSign,
    title: "Fair Value Calculator",
    description:
      "Get an instant fair value estimate for any task or item based on category, location, and current market conditions. Never overpay or undercharge again.",
  },
  {
    icon: Bell,
    title: "Price Alerts",
    description:
      "Set custom price alerts for specific categories or items. Get notified instantly when prices drop below your target or spike unexpectedly in the market.",
  },
];

const steps = [
  {
    step: 1,
    title: "Select a Category",
    description:
      "Choose the category you want to research — gigs, services, items for sale, or housing. Narrow down by city and subcategory for more precise results.",
  },
  {
    step: 2,
    title: "Analyze Market Data",
    description:
      "View detailed price breakdowns, historical trends, and fair value estimates. Compare your pricing against the current market average in your area.",
  },
  {
    step: 3,
    title: "Set Your Price Smartly",
    description:
      "Use insights to set competitive prices for your listings or negotiate better deals. Enable price alerts to stay updated on market changes.",
  },
];

export default function PriceCheckPage() {
  return (
    <div className="min-h-[60vh]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="bg-white/20 text-white mb-4 hover:bg-white/20">Market Tool</Badge>
          <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Price Check</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Research market prices across categories. Know the fair value before you buy or sell.
          </p>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <div className="container mx-auto max-w-4xl -mt-6 relative z-10 px-4">
        <Card className="shadow-xl border-emerald-200">
          <CardContent className="p-6 text-center">
            <Badge variant="secondary" className="bg-amber-100 text-amber-700 mb-2">
              Coming Soon
            </Badge>
            <h2 className="text-xl font-semibold mb-2">This Tool is Under Development</h2>
            <p className="text-muted-foreground mb-4">
              We&apos;re building this feature with care. Get notified when it launches.
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input placeholder="Enter your email" type="email" className="flex-1" />
              <Button>Notify Me</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-8">What to Expect</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <Card key={feature.title} className="border-emerald-100 hover:border-emerald-300 transition-colors">
              <CardContent className="p-5">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-3">
                  <feature.icon className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-muted/30 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-8">How It Will Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {steps.map((item) => (
              <Card key={item.step} className="text-center">
                <CardContent className="p-5">
                  <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  {item.step < 3 && (
                    <ArrowRight className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-5 w-5 text-emerald-300" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Related Tools */}
      <div className="container mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-muted-foreground mb-4">In the meantime, explore related tools:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Link href="/tools/market-insights">
            <Button variant="outline">Market Insights</Button>
          </Link>
          <Link href="/tools/sell-item">
            <Button variant="outline">Sell Item</Button>
          </Link>
        </div>
        <Link href="/#tools" className="block mt-6 text-sm text-primary hover:underline">
          <ChevronLeft className="h-4 w-4" />Back to All Tools
        </Link>
      </div>
    </div>
  );
}
