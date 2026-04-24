// @ts-nocheck
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
import {
  paidListingCategories,
  formatCurrency,
} from "@/lib/constants";
import {
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Zap,
  Search,
  Gift,
  CreditCard,
  Bitcoin,
  Shield,
  Server,
  Headphones,
  Receipt,
  Tag,
  Star,
  AlertCircle,
  Banknote,
  Percent,
} from "lucide-react";

export default function PricingPage() {
  // Build pricing table data from constants
  const pricingTableData = paidListingCategories.map((cat) => ({
    category: cat.category,
    description: cat.description,
    standard: cat.prices.standard,
    featured: cat.prices.featured,
    urgent: cat.prices.urgent,
    freeLimit: cat.freeLimit,
    premiumThreshold: "premiumThreshold" in cat ? cat.premiumThreshold : undefined,
    premiumPrice: "premiumPrice" in cat ? cat.premiumPrice : undefined,
  }));

  const getCategoryLabel = (id: string) => {
    const labels: Record<string, string> = {
      gigs: "Gigs & Tasks",
      services: "Services",
      jobs: "Jobs",
      "for-sale": "For Sale (Premium)",
      community: "Community",
    };
    return labels[id] || id;
  };

  const getCategoryColor = (id: string) => {
    const colors: Record<string, string> = {
      gigs: "text-emerald-700 bg-emerald-100",
      services: "text-teal-700 bg-teal-100",
      jobs: "text-cyan-700 bg-cyan-100",
      "for-sale": "text-amber-700 bg-amber-100",
      community: "text-rose-700 bg-rose-100",
    };
    return colors[id] || "text-gray-700 bg-gray-100";
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 mb-4 bg-white/10 rounded-full px-4 py-2">
            <Tag className="h-5 w-5 text-emerald-200" />
            <span className="text-emerald-100 font-medium">Listing Pricing</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Listing Pricing
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            Some listings are free, others have small fees. Subsidized prices for everyone.
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-2.5 max-w-6xl">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/browse" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-foreground font-medium">Pricing</span>
          </nav>
        </div>
      </div>

      {/* Section 1 - Free to Post */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-4 border-emerald-300 text-emerald-700">
              <Gift className="h-3.5 w-3.5 mr-1.5" />
              Always Free
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Free to Post</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The following categories are always free or have generous free posting limits.
            </p>
          </div>
          <Card className="border-2 border-emerald-200 bg-emerald-50/30 overflow-hidden">
            <CardContent className="p-0">
              <div className="divide-y">
                {[
                  {
                    icon: <Zap className="h-5 w-5" />,
                    title: "Gigs & Tasks",
                    desc: "Always free to post",
                    detail: "No limit — post unlimited gigs and tasks",
                    color: "text-emerald-600",
                    bg: "bg-emerald-100",
                  },
                  {
                    icon: <Zap className="h-5 w-5" />,
                    title: "Community",
                    desc: "Up to 10 free posts per month",
                    detail: "Events, groups, activities, and more",
                    color: "text-rose-600",
                    bg: "bg-rose-100",
                  },
                  {
                    icon: <Zap className="h-5 w-5" />,
                    title: "Services",
                    desc: "Up to 2 free posts per month",
                    detail: "Professional and freelance service listings",
                    color: "text-teal-600",
                    bg: "bg-teal-100",
                  },
                  {
                    icon: <Zap className="h-5 w-5" />,
                    title: "For Sale",
                    desc: "Up to 5 free posts per month",
                    detail: "Buy and sell items locally",
                    color: "text-amber-600",
                    bg: "bg-amber-100",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 p-5 hover:bg-emerald-50/50 transition-colors">
                    <div className={`h-10 w-10 rounded-lg ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                    <Badge className="bg-emerald-600 text-white shrink-0">
                      {item.desc}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* Section 2 - Paid Categories Pricing Table */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-emerald-300 text-emerald-700">
              <Receipt className="h-3.5 w-3.5 mr-1.5" />
              Pricing Tiers
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Paid Categories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              For categories that require a listing fee, choose the visibility tier that works best for your listing.
            </p>
          </div>

          {/* Tier Explanations */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                  <Tag className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-sm">Standard</h3>
                <p className="text-xs text-muted-foreground mt-1">Normal listing, appears in search results</p>
              </CardContent>
            </Card>
            <Card className="text-center border-2 border-emerald-400">
              <CardContent className="p-4">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                  <Star className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-sm">Featured</h3>
                <p className="text-xs text-muted-foreground mt-1">Shows at top of search results for more visibility</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="h-10 w-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-2">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-sm">Urgent</h3>
                <p className="text-xs text-muted-foreground mt-1">Highlighted with urgent badge for urgent needs</p>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left text-xs font-semibold px-5 py-3">Category</th>
                      <th className="text-center text-xs font-semibold px-4 py-3">Standard</th>
                      <th className="text-center text-xs font-semibold px-4 py-3">
                        <div className="flex flex-col items-center">
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-emerald-600" />
                            Featured
                          </span>
                        </div>
                      </th>
                      <th className="text-center text-xs font-semibold px-4 py-3">
                        <div className="flex flex-col items-center">
                          <span className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3 text-rose-500" />
                            Urgent
                          </span>
                        </div>
                      </th>
                      <th className="text-center text-xs font-semibold px-4 py-3">Free Posts/Month</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {pricingTableData.map((row) => (
                      <tr key={row.category} className="hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <Badge className={`${getCategoryColor(row.category)} text-xs`}>
                              {getCategoryLabel(row.category)}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{row.description}</p>
                        </td>
                        <td className="text-center px-4 py-4">
                          <span className={`font-semibold text-sm ${row.standard === 0 ? "text-emerald-600" : ""}`}>
                            {row.standard === 0 ? "Free" : formatCurrency(row.standard, "NGN")}
                          </span>
                        </td>
                        <td className="text-center px-4 py-4">
                          <span className={`font-semibold text-sm ${row.featured === 0 ? "text-emerald-600" : ""}`}>
                            {row.featured === 0 ? "Free" : formatCurrency(row.featured, "NGN")}
                          </span>
                        </td>
                        <td className="text-center px-4 py-4">
                          <span className={`font-semibold text-sm ${row.urgent === 0 ? "text-emerald-600" : ""}`}>
                            {row.urgent === 0 ? "Free" : formatCurrency(row.urgent, "NGN")}
                          </span>
                        </td>
                        <td className="text-center px-4 py-4">
                          <Badge variant="secondary" className="text-xs">
                            {row.freeLimit === -1 ? "Unlimited" : row.freeLimit === 0 ? "0" : row.freeLimit}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 3 - Premium Items Note */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-amber-800 mb-1">Premium Items</h3>
                  <p className="text-sm text-amber-700 leading-relaxed">
                    Items priced above <strong>₦100,000</strong> have an additional <strong>₦2,000 listing fee</strong> in the
                    For Sale category. This helps maintain quality and reduces spam for high-value listings.
                  </p>
                  <p className="text-xs text-amber-600 mt-2">
                    This applies to electronics, vehicles, furniture, and other premium items in the For Sale category.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Section 4 - Why We Charge */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-4 border-emerald-300 text-emerald-700">
              <Shield className="h-3.5 w-3.5 mr-1.5" />
              Our Commitment
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why We Charge</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Small fees keep the platform running and ensure a great experience for everyone.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                icon: <Server className="h-5 w-5" />,
                title: "Platform maintenance & server costs",
                desc: "Keeping the platform fast, reliable, and available 24/7 across 25+ cities.",
              },
              {
                icon: <Shield className="h-5 w-5" />,
                title: "Fraud prevention & security",
                desc: "Advanced fraud detection, content moderation, and account security systems.",
              },
              {
                icon: <Headphones className="h-5 w-5" />,
                title: "Customer support team",
                desc: "Responsive support team ready to help resolve disputes and answer questions.",
              },
              {
                icon: <CreditCard className="h-5 w-5" />,
                title: "Payment processing fees covered by us",
                desc: "We absorb Paystack and bank processing fees so you pay less.",
              },
              {
                icon: <Percent className="h-5 w-5" />,
                title: "10% service fee on earnings",
                desc: "A 10% platform fee is charged on all earnings (task payouts, product sales, service payments, errand completions). This is automatically deducted before your balance is updated — what you see is what you can withdraw.",
              },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-5 flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Section 5 - Payment Methods */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-4 border-emerald-300 text-emerald-700">
              <Banknote className="h-3.5 w-3.5 mr-1.5" />
              Payment Options
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Payment Methods</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Multiple payment options to suit your preference.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Paystack */}
            <Card className="border-2 border-emerald-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Paystack</h3>
                    <p className="text-xs text-muted-foreground">Secure card & bank payments</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {["Debit & Credit Cards (Visa, Mastercard)", "Bank Transfer", "USSD"].map((method) => (
                    <div key={method} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{method}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Paystack Payments */}
            <Card className="border-2 border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Bitcoin className="h-6 w-6 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Paystack Payments</h3>
                    <p className="text-xs text-muted-foreground">Secure card & bank transfers</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {["USSD", "QR Code", "Pay with Bank"].map((method) => (
                    <div key={method} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>{method}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            All payments are processed securely through escrow for buyer and seller protection.
          </p>
        </div>
      </section>

      {/* Section 6 - CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Zap className="h-12 w-12 mx-auto mb-6 text-emerald-200" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Posting for Free
          </h2>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Join thousands of users who are already posting on PostAll. Most categories are free,
            and paid listings start as low as ₦500. Get started today!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/post-task">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2"
              >
                Start Posting for Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/browse">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                <Search className="h-4 w-4" />
                View All Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
