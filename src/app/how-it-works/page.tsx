"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  GitCompare,
  ShieldCheck,
  PackageCheck,
  UserPlus,
  FileText,
  Briefcase,
  Wallet,
  Lock,
  BadgeCheck,
  MapPin,
  Headphones,
  DollarSign,
  Zap,
  Star,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const buyerSteps = [
  {
    step: 1,
    title: "Search & Browse",
    description:
      "Explore thousands of listings, tasks, and services across Nigeria and Africa. Filter by category, location, price, and rating.",
    icon: Search,
    color: "text-blue-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    step: 2,
    title: "Compare & Choose",
    description:
      "Check reviews, compare prices, view seller profiles, and read ratings from real users before making your decision.",
    icon: GitCompare,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    step: 3,
    title: "Pay Securely",
    description:
      "Your payment is held in escrow until you confirm the job is done. If anything goes wrong, you get a full refund.",
    icon: ShieldCheck,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    step: 4,
    title: "Receive & Review",
    description:
      "Get your item or service delivered, verify quality, then release payment. Leave a review to help other buyers.",
    icon: PackageCheck,
    color: "text-purple-500",
    bgColor: "bg-emerald-500/10",
  },
];

const sellerSteps = [
  {
    step: 1,
    title: "Create Your Profile",
    description:
      "Sign up, verify your identity with a valid ID, and set up your seller profile in under 2 minutes. Add your bio, portfolio, and skills.",
    icon: UserPlus,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    step: 2,
    title: "Post Your Listing",
    description:
      "List items for sale, offer your services, or apply for posted tasks. Add photos, descriptions, and set your prices in Naira.",
    icon: FileText,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    step: 3,
    title: "Get Hired & Deliver",
    description:
      "Accept jobs, communicate with clients, deliver your work or items. Track every milestone and payment in real-time.",
    icon: Briefcase,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    step: 4,
    title: "Get Paid",
    description:
      "Withdraw your earnings via bank transfer to any Nigerian bank account through Paystack. Fast payouts, no delays. Note: A 10% platform service fee is automatically deducted from earnings before your balance is updated.",
    icon: Wallet,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
];

const trustFeatures = [
  {
    icon: Lock,
    title: "Escrow Protection",
    description:
      "Every transaction is protected by our escrow system. Your money is held securely until both parties are satisfied. Full refund if things go wrong.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    icon: BadgeCheck,
    title: "Verified Sellers",
    description:
      "All sellers go through our verification process including ID verification, phone confirmation, and address validation for premium badges.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
  {
    icon: MapPin,
    title: "Safe Meeting Spots",
    description:
      "Use our verified Safe Spot locations for in-person transactions. Partnered with banks, malls, and police stations across 25+ cities.",
    color: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Our dedicated support team is available around the clock via WhatsApp, email, and in-app chat. Average response time under 2 hours.",
    color: "text-emerald-600",
    bgColor: "bg-teal-100",
  },
];

const pricingItems = [
  {
    feature: "Browse listings & tasks",
    price: "Free",
    icon: Search,
    highlight: false,
  },
  {
    feature: "Post basic listings",
    price: "Free",
    icon: FileText,
    highlight: false,
  },
  {
    feature: "Escrow protection",
    price: "Free",
    icon: ShieldCheck,
    highlight: false,
  },
  {
    feature: "Featured listing (7 days)",
    price: "₦3,000",
    icon: Star,
    highlight: true,
  },
  {
    feature: "Urgent boost (24 hours)",
    price: "₦5,000",
    icon: Zap,
    highlight: true,
  },
  {
    feature: "Service fee (per transaction)",
    price: "5%",
    icon: DollarSign,
    highlight: false,
  },
];

const faqItems = [
  {
    question: "Is PostAll free to use?",
    answer:
      "Yes! Browsing, signing up, posting basic listings, and using escrow protection are all completely free. We only charge small fees for premium features like featured listings (₦3,000 for 7 days) and urgent boosts (₦5,000 for 24 hours). A 10% service fee applies on all earnings (task completions, product sales, service payments, and errand payouts). This fee is automatically deducted before your wallet balance is updated.",
  },
  {
    question: "How does the escrow system work?",
    answer:
      "When a buyer pays for an item or service, the money is held securely in our escrow account. The seller doesn't receive the funds until the buyer confirms they've received the item/service as described. If there's a dispute, our support team investigates and ensures a fair resolution. If the seller fails to deliver, the buyer gets a full refund.",
  },
  {
    question: "How do I get verified as a seller?",
    answer:
      "To get verified, go to your Dashboard > Settings > Verification. You'll need to upload a valid government-issued ID (NIN, Voter's Card, or International Passport), confirm your phone number, and optionally verify your address. Premium verification (green badge) requires additional steps. The process usually takes 24-48 hours.",
  },
  {
    question: "How do I withdraw my earnings?",
    answer:
      "Go to Dashboard > Wallet > Withdraw. You can withdraw to any Nigerian bank account (we support 20+ banks). Bank transfers are typically processed within 1-2 business days via Paystack secure payment processing.",
  },
  {
    question: "What happens if I have a dispute with a buyer/seller?",
    answer:
      "Open a dispute through the transaction page or contact our support team. Our dispute resolution team will review evidence from both parties, including chat logs, delivery confirmations, and photos. Most disputes are resolved within 48 hours. If the dispute cannot be resolved, escrow funds will be released based on our fair-use policy.",
  },
  {
    question: "Can I use PostAll outside Nigeria?",
    answer:
      "PostAll is currently focused exclusively on the Nigerian market. All transactions are in Nigerian Naira (₦) processed securely through Paystack. We are committed to serving the Nigerian community with the best possible marketplace experience.",
  },
  {
    question: "How do Safe Meeting Spots work?",
    answer:
      "Safe Meeting Spots are verified, secure locations where buyers and sellers can meet for in-person transactions. These include bank branches, shopping malls, police stations, and our partner locations. You can find nearby Safe Spots using our Safe Spot tool. We recommend always using Safe Spots for high-value transactions.",
  },
  {
    question: "How do I promote my listing to get more visibility?",
    answer:
      "PostAll offers several promotion options: Boost (₦1,000) increases your listing's visibility, Featured (₦3,000/week) places your listing at the top of search results, Urgent (₦5,000/24h) adds urgency badges and pushes to the front page, and All-in-One (₦7,500/week) combines all features. Visit Dashboard > Promote to get started.",
  },
  {
    question: "Is my personal information safe on PostAll?",
    answer:
      "Yes, we take your privacy seriously. Personal information like your exact address and phone number is only shared when you explicitly approve it during a transaction. All data is encrypted, and we comply with the Nigeria Data Protection Regulation (NDPR). You control who sees your information through your privacy settings.",
  },
];

export default function HowItWorksPage() {
  const [activeFlow, setActiveFlow] = useState<"buyer" | "seller">("buyer");

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[300px] md:h-[400px] overflow-hidden text-white">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-400" />
            <img src="/images/how-it-works.png" alt="How PostAll works" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
          </div>
          <div className="relative z-10 flex items-center justify-center h-full px-4">
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="bg-white/20 text-white hover:bg-white/30 border-white/30 mb-6 text-sm px-4 py-1">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Simple & Secure
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                How PostAll Works
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                Get started in minutes with our simple 4-step process. Whether
                you&apos;re buying, selling, or freelancing — we&apos;ve got you covered.
              </p>
              <div className="flex items-center justify-center gap-4 md:gap-8 mt-10">
                {[
                  { icon: Search, label: "Browse" },
                  { icon: GitCompare, label: "Compare" },
                  { icon: ShieldCheck, label: "Secure Pay" },
                  { icon: PackageCheck, label: "Deliver" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center animate-pulse" style={{ animationDelay: `${i * 0.3}s`, animationDuration: "3s" }}>
                      <item.icon className="h-7 w-7 md:h-8 md:w-8 text-white" />
                    </div>
                    <span className="text-xs md:text-sm text-white/80 font-medium">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Buyer / Seller Toggle + Steps */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          {/* Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center rounded-xl bg-muted p-1.5 gap-1">
              <button
                onClick={() => setActiveFlow("buyer")}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeFlow === "buyer"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                For Buyers / Clients
              </button>
              <button
                onClick={() => setActiveFlow("seller")}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeFlow === "seller"
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                For Sellers / Freelancers
              </button>
            </div>
          </div>

          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {activeFlow === "buyer"
                ? "How to Buy & Hire on PostAll"
                : "How to Sell & Earn on PostAll"}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {activeFlow === "buyer"
                ? "From finding what you need to getting it delivered — here's your complete guide."
                : "From creating your profile to receiving payments — start earning today."}
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {(activeFlow === "buyer" ? buyerSteps : sellerSteps).map(
              (step, i) => (
                <Card
                  key={i}
                  className="relative group hover:shadow-lg transition-all duration-300 border hover:border-emerald-200 dark:hover:border-emerald-800"
                >
                  <CardContent className="p-6 pt-6">
                    {/* Step Number */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-4xl font-bold text-muted-foreground/20">
                        {String(step.step).padStart(2, "0")}
                      </span>
                      <div
                        className={`h-12 w-12 rounded-xl ${step.bgColor} flex items-center justify-center`}
                      >
                        <step.icon className={`h-6 w-6 ${step.color}`} />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-emerald-600 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                  {i < 3 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight className="h-5 w-5 text-emerald-400" />
                    </div>
                  )}
                </Card>
              )
            )}
          </div>
        </section>

        {/* Trust & Safety Section */}
        <section className="bg-muted/40 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 mb-4"
              >
                <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                Trust & Safety
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Your Safety is Our Priority
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Multiple layers of protection to ensure every transaction on
                PostAll is safe and secure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {trustFeatures.map((feature, i) => (
                <Card
                  key={i}
                  className="hover:shadow-lg transition-all duration-300 border"
                >
                  <CardContent className="p-6">
                    <div
                      className={`h-14 w-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}
                    >
                      <feature.icon className={`h-7 w-7 ${feature.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 mb-4"
            >
              <DollarSign className="h-3.5 w-3.5 mr-1.5" />
              Pricing
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              No hidden fees. Most features are completely free.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {pricingItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
                          <item.icon className="h-5 w-5 text-emerald-600" />
                        </div>
                        <span className="font-medium">{item.feature}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.price === "Free" ? (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-100">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Free
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className={item.highlight ? "border-emerald-300 text-emerald-600" : ""}
                          >
                            {item.price}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <p className="text-center text-sm text-muted-foreground mt-4">
              All prices are in Nigerian Naira (₦). Payments are securely processed through Paystack.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-muted/40 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 mb-4"
              >
                FAQ
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Everything you need to know about using PostAll.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-500 rounded-3xl p-10 md:p-16 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-emerald-50 text-lg mb-8 max-w-xl mx-auto">
                  Join thousands of Nigerians already buying, selling, and
                  earning on PostAll. It only takes 2 minutes to sign up.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/login">
                    <Button
                      size="lg"
                      className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold px-8 h-12"
                    >
                      Sign Up Free
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/browse">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/40 text-white hover:bg-white/10 hover:text-white font-semibold px-8 h-12"
                    >
                      Browse Listings
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
