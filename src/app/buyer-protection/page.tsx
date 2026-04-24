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
import {
  Shield,
  ShieldCheck,
  Lock,
  BadgeCheck,
  Camera,
  MapPin,
  Siren,
  Scale,
  Search,
  CreditCard,
  Package,
  CheckCircle2,
  ThumbsUp,
  ArrowRight,
  Eye,
  AlertTriangle,
  MessageCircle,
  Banknote,
  Clock,
  CheckCircle,
  UserCheck,
} from "lucide-react";

export default function BuyerProtectionPage() {
  return (
    <div className="flex min-h-screen flex-col">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/10 mb-6">
            <ShieldCheck className="h-8 w-8 text-emerald-200" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Buyer Protection
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Your transactions are safe on PostAll. We&apos;ve built a comprehensive
            protection system to keep your money and purchases secure.
          </p>
        </div>
      </section>

      {/* Our Guarantee */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-2 border-emerald-500 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-emerald-800">
                    100% Money Back Guarantee
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <p className="text-muted-foreground leading-relaxed text-lg">
                If an item is not as described, you&apos;ll get a full refund through our
                escrow system. No questions asked.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: <Banknote className="h-5 w-5" />, label: "Full refund policy" },
                  { icon: <Clock className="h-5 w-5" />, label: "7-day dispute window" },
                  { icon: <BadgeCheck className="h-5 w-5" />, label: "Verified seller program" },
                  { icon: <Lock className="h-5 w-5" />, label: "Secure payments" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
                      {item.icon}
                    </div>
                    <span className="font-medium text-emerald-800">{item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-emerald-300 text-emerald-700">
              <ArrowRight className="h-3.5 w-3.5 mr-1.5" />
              Step by Step
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our buyer protection process is simple and transparent. Here&apos;s how every
              protected transaction works on PostAll.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                icon: <Search className="h-6 w-6" />,
                title: "Browse & Find",
                desc: "Search and discover items across 25+ cities. Filter by category, price, location, and more.",
              },
              {
                step: 2,
                icon: <CreditCard className="h-6 w-6" />,
                title: "Pay via Escrow",
                desc: "Your payment is held safely in escrow until you confirm receipt of the item.",
              },
              {
                step: 3,
                icon: <Package className="h-6 w-6" />,
                title: "Receive & Verify",
                desc: "Check the item matches the listing description. Take photos with Proof Cam as evidence.",
              },
              {
                step: 4,
                icon: <ThumbsUp className="h-6 w-6" />,
                title: "Release or Dispute",
                desc: "Confirm everything is good, or open a dispute within the 7-day window for a full refund.",
              },
            ].map((item) => (
              <Card key={item.step} className="relative text-center">
                <CardContent className="p-6">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <div className="h-14 w-14 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-4 mt-2 text-emerald-700">
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

      {/* Protected By */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-emerald-300 text-emerald-700">
              <Shield className="h-3.5 w-3.5 mr-1.5" />
              Protection Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Protected By</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Multiple layers of security work together to protect every transaction on PostAll.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Lock className="h-6 w-6" />,
                title: "PostAll Escrow",
                desc: "Payments held securely until you confirm",
                color: "emerald",
              },
              {
                icon: <BadgeCheck className="h-6 w-6" />,
                title: "Verified Sellers",
                desc: "Sellers with verified ID get a badge",
                color: "teal",
              },
              {
                icon: <Camera className="h-6 w-6" />,
                title: "Proof Cam",
                desc: "Timestamped photos as transaction evidence",
                color: "cyan",
              },
              {
                icon: <MapPin className="h-6 w-6" />,
                title: "Safe Spots",
                desc: "Pre-vetted meeting locations",
                color: "amber",
              },
              {
                icon: <Siren className="h-6 w-6" />,
                title: "Emergency Button",
                desc: "Instant alert to safety team",
                color: "rose",
              },
              {
                icon: <Scale className="h-6 w-6" />,
                title: "Dispute Resolution",
                desc: "Fair resolution within 72 hours",
                color: "emerald",
              },
            ].map((item, i) => (
              <Card key={i} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className={`h-14 w-14 rounded-xl bg-${item.color}-100 flex items-center justify-center mx-auto mb-4 text-${item.color}-700`}>
                    <div className="text-emerald-700">{item.icon}</div>
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* What's Covered */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-emerald-300 text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              Coverage Details
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What&apos;s Covered</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our buyer protection covers a wide range of scenarios to ensure you can shop with confidence.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                issue: "Item not as described",
                resolution: "Full refund",
                desc: "The item you received doesn't match the listing description, photos, or specifications.",
              },
              {
                issue: "Item never arrived",
                resolution: "Full refund",
                desc: "The seller failed to deliver the item within the agreed timeframe.",
              },
              {
                issue: "Item damaged",
                resolution: "Partial/full refund based on evidence",
                desc: "The item was damaged during shipping or was more damaged than described in the listing.",
              },
              {
                issue: "Wrong item sent",
                resolution: "Full refund + return shipping",
                desc: "The seller sent a completely different item than what was listed.",
              },
              {
                issue: "Digital goods not delivered",
                resolution: "Full refund",
                desc: "Digital items like codes, keys, or downloads were not delivered after payment.",
              },
            ].map((item) => (
              <Card key={item.issue} className="border-l-4 border-l-emerald-500">
                <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1">{item.issue}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 shrink-0 whitespace-nowrap">
                    {item.resolution}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* How to Stay Safe */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-amber-300 text-amber-700">
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              Safety Tips
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How to Stay Safe</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these tips to ensure a safe and smooth experience on PostAll.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <MapPin className="h-5 w-5" />,
                title: "Meet at Safe Spots",
                desc: "Always meet at Safe Spots for in-person transactions",
              },
              {
                icon: <Camera className="h-5 w-5" />,
                title: "Use Proof Cam",
                desc: "Document item condition before purchase with timestamped photos",
              },
              {
                icon: <UserCheck className="h-5 w-5" />,
                title: "Check Seller Profile",
                desc: "Check seller's verified badge and ratings before buying",
              },
              {
                icon: <CreditCard className="h-5 w-5" />,
                title: "Pay on Platform",
                desc: "Never pay outside the platform to keep your protection",
              },
              {
                icon: <AlertTriangle className="h-5 w-5" />,
                title: "Report Suspicious Activity",
                desc: "Report suspicious activity immediately to our safety team",
              },
              {
                icon: <MessageCircle className="h-5 w-5" />,
                title: "Keep Communication On-Platform",
                desc: "Keep all communication on the platform for evidence",
              },
            ].map((tip) => (
              <Card key={tip.title}>
                <CardContent className="p-6">
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 text-amber-700 mb-4">
                    {tip.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tip.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* Escrow Timeline */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-emerald-300 text-emerald-700">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Transaction Flow
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Escrow Timeline</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Here&apos;s exactly what happens to your money from payment to release.
            </p>
          </div>

          <Card>
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-0">
                {[
                  {
                    step: "Payment Made",
                    icon: <CreditCard className="h-5 w-5" />,
                    color: "bg-emerald-600",
                    desc: "You pay for the item",
                  },
                  {
                    step: "In Escrow",
                    icon: <Lock className="h-5 w-5" />,
                    color: "bg-amber-500",
                    desc: "Funds held securely",
                  },
                  {
                    step: "Item Received",
                    icon: <Package className="h-5 w-5" />,
                    color: "bg-cyan-500",
                    desc: "You receive the item",
                  },
                  {
                    step: "Confirmation",
                    icon: <CheckCircle className="h-5 w-5" />,
                    color: "bg-teal-500",
                    desc: "48h review period",
                  },
                  {
                    step: "Funds Released",
                    icon: <CheckCircle2 className="h-5 w-5" />,
                    color: "bg-emerald-600",
                    desc: "Seller gets paid",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex flex-col items-center text-center flex-1">
                      <div className={`h-12 w-12 rounded-full ${item.color} text-white flex items-center justify-center shrink-0 mb-3`}>
                        {item.icon}
                      </div>
                      <h4 className="font-semibold text-sm mb-1">{item.step}</h4>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    {i < 4 && (
                      <div className="hidden md:block w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-400 shrink-0 mb-6" />
                    )}
                    {i < 4 && (
                      <div className="md:hidden flex justify-center w-full py-2">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <ShieldCheck className="h-12 w-12 mx-auto mb-6 text-emerald-200" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Shop with Confidence
          </h2>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Every transaction on PostAll is protected by our escrow system and money-back
            guarantee. Start browsing and buying with complete peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/browse">
              <Button size="lg" variant="secondary" className="gap-2">
                <Search className="h-4 w-4" />
                Start Browsing
              </Button>
            </Link>
            <Link href="/help">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                Need Help?
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
