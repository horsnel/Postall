"use client";

import Link from "next/link";
import { useState } from "react";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChevronRight,
  Shield,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Camera,
  Lock,
  Flag,
  Phone,
  MessageCircle,
  UserCheck,
  Eye,
  Banknote,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Users,
  Search,
  HelpCircle,
  Heart,
  Clock,
  Link as LinkIcon,
  Star,
  BadgeCheck,
  AlertOctagon,
  Fish,
  UserX,
  Info,
} from "lucide-react";
import { toast } from "sonner";

// ─── Safety Tips Data ────────────────────────────────────────
const safetyTips = [
  {
    icon: MapPin,
    title: "Meet in Safe Spots",
    description: "Use our verified safe meeting locations with CCTV, security, and high foot traffic.",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: Banknote,
    title: "Never Pay Outside PostAll",
    description: "Our escrow system protects both parties. Outside payments remove all buyer protection.",
    color: "bg-rose-100 text-rose-700",
  },
  {
    icon: BadgeCheck,
    title: "Verify Before You Deal",
    description: "Check verification badges, ratings, reviews, and completion history before transacting.",
    color: "bg-blue-100 text-blue-700",
  },
  {
    icon: AlertTriangle,
    title: "Too Good to Be True?",
    description: "Extremely low prices, rush tactics, or requests for upfront payment are red flags.",
    color: "bg-amber-100 text-amber-700",
  },
  {
    icon: MessageCircle,
    title: "Keep Conversations On-Platform",
    description: "Platform messages create verifiable records that protect you in disputes.",
    color: "bg-teal-100 text-teal-700",
  },
  {
    icon: Star,
    title: "Check Seller Ratings & Reviews",
    description: "Read through past reviews carefully. Low ratings or few reviews warrant extra caution.",
    color: "bg-amber-100 text-amber-700",
  },
  {
    icon: Flag,
    title: "Report Suspicious Activity",
    description: "Use the report button on any listing, profile, or message. We review every report.",
    color: "bg-rose-100 text-rose-700",
  },
  {
    icon: Lock,
    title: "Protect Your Personal Info",
    description: "Never share bank details, passwords, or personal documents outside the platform.",
    color: "bg-muted text-muted-foreground",
  },
];

// ─── Scam Alerts Data ────────────────────────────────────────
const scamAlerts = [
  {
    icon: Banknote,
    title: "Fake Payment Proofs",
    description: "Scammers send doctored screenshots of 'payments made'. Always verify through PostAll's escrow system — never trust external payment receipts.",
    color: "bg-rose-50 border-rose-200",
    iconColor: "text-rose-600",
  },
  {
    icon: AlertOctagon,
    title: '"Send Money First" Requests',
    description: "If anyone asks you to send money via bank transfer, crypto, or any method outside PostAll before delivery or service, it's almost certainly a scam.",
    color: "bg-orange-50 border-orange-200",
    iconColor: "text-orange-600",
  },
  {
    icon: Fish,
    title: "Phishing Links",
    description: "Scammers send links to fake PostAll login pages to steal your credentials. Always check the URL — our domains are postall.com and app.postall.com.",
    color: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-600",
  },
  {
    icon: UserX,
    title: "Identity Theft Attempts",
    description: "Scammers impersonate verified sellers or PostAll staff to gain your trust. Verify identities through the platform's verification system.",
    color: "bg-red-50 border-red-200",
    iconColor: "text-red-600",
  },
];

// ─── Trust Score Data ────────────────────────────────────────
const trustLevels = [
  { level: 1, label: "New User", color: "bg-muted", textColor: "text-muted-foreground", desc: "Profile created, no verification yet", requirements: ["Create account", "Complete profile"] },
  { level: 2, label: "Phone Verified", color: "bg-emerald-200", textColor: "text-emerald-700", desc: "Phone number verified via OTP", requirements: ["Phone verification"] },
  { level: 3, label: "ID Verified", color: "bg-blue-200", textColor: "text-blue-700", desc: "Government-issued ID verified", requirements: ["Phone + ID verification", "Selfie match"] },
  { level: 4, label: "Address Verified", color: "bg-purple-200", textColor: "text-purple-700", desc: "Residential address confirmed", requirements: ["All above + proof of address", "Utility bill match"] },
  { level: 5, label: "Fully Trusted", color: "bg-emerald-400", textColor: "text-white", desc: "Top-tier trust with stellar track record", requirements: ["All above + 50+ completed tasks", "95%+ positive rating", "No disputes"] },
];

// ─── FAQ Data ────────────────────────────────────────────────
const safetyFaqs = [
  { q: "How does PostAll's escrow system protect me?", a: "When you make a payment, funds are held securely in our escrow account until both parties confirm the transaction is complete. Neither the buyer nor seller can access the funds prematurely. If there's a dispute, our mediation team reviews all evidence before releasing funds." },
  { q: "What should I do if I suspect a scam?", a: "Immediately stop communication, use the Report button on the listing or profile, and do not send any money outside the platform. Contact our safety team at safety@postall.com or call +234 800 SAFE PA. The faster you report, the better we can protect you and others." },
  { q: "What happens when I report someone?", a: "Our safety team reviews every report within 24 hours. We investigate the account, messages, and transaction history. If the report is valid, we may warn, suspend, or permanently ban the offending account. You'll be notified of the outcome." },
  { q: "Are there safe meeting locations I can use?", a: "Yes! Our Safe Spots tool helps you find pre-vetted meeting locations in your city. These locations have good lighting, CCTV coverage, security presence, and high foot traffic. Visit /tools/safe-spots to find locations near you." },
  { q: "How do I verify my identity on PostAll?", a: "Go to your profile settings and click 'Verify Identity'. You'll need to upload a government-issued ID (NIN, voter's card, passport, or driver's license) and take a live selfie. Verification typically completes within 1-2 business days." },
  { q: "What if a transaction goes wrong?", a: "Open a dispute through the transaction page within 7 days. Our mediation team will review messages, Proof Cam images, and escrow details. Most disputes are resolved within 72 hours. You can also contact support@postall.com for urgent issues." },
];

export default function SafetyPage() {
  const [liveChatLoading, setLiveChatLoading] = useState(false);

  const handleLiveChat = () => {
    setLiveChatLoading(true);
    setTimeout(() => {
      setLiveChatLoading(false);
      toast.success("Connecting to live chat...", { description: "A safety agent will be with you shortly." });
    }, 1500);
  };

  return (
    <>
      {/* ─── Hero Section ─── */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 mb-4 bg-white/10 rounded-full px-4 py-2">
            <ShieldCheck className="h-5 w-5 text-emerald-200" />
            <span className="text-emerald-100 font-medium">Safety Center</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Your Safety Is Our{" "}
            <span className="text-emerald-200">Priority</span>
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            We&apos;ve built an entire ecosystem of safety tools — from escrow protection and
            proof cameras to safe spots and AI-powered scam detection. Learn how to stay safe.
          </p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-2.5 max-w-6xl">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/browse" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-foreground font-medium">Safety Center</span>
          </nav>
        </div>
      </div>

      {/* ─── Quick Emergency Actions ─── */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid sm:grid-cols-3 gap-4">
            {/* Report Scam */}
            <button
              onClick={() => {
                toast.info("Redirecting to Report Center...", { description: "Use the form to submit your report" });
              }}
              className="group"
            >
              <Card className="border-2 border-rose-200 hover:border-rose-400 hover:shadow-lg transition-all h-full">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-rose-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-rose-200 transition-colors">
                    <AlertTriangle className="h-8 w-8 text-rose-600" />
                  </div>
                  <h3 className="font-bold text-lg text-rose-700 mb-1">Report Scam</h3>
                  <p className="text-sm text-muted-foreground">
                    Flag suspicious activity or a scam attempt
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-1 text-rose-600 text-sm font-medium">
                    Report Now <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </button>

            {/* Emergency Line */}
            <a href="tel:+234800723372">
              <Card className="border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-lg transition-all h-full">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-lg text-emerald-700 mb-1">Emergency Line</h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    24/7 Safety Hotline
                  </p>
                  <p className="text-lg font-bold text-emerald-700">+234 800 SAFE PA</p>
                </CardContent>
              </Card>
            </a>

            {/* Live Chat */}
            <button onClick={handleLiveChat} className="group">
              <Card className="border-2 border-teal-200 hover:border-teal-400 hover:shadow-lg transition-all h-full">
                <CardContent className="p-6 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-teal-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-200 transition-colors">
                    <MessageCircle className="h-8 w-8 text-teal-600" />
                  </div>
                  <h3 className="font-bold text-lg text-teal-700 mb-1">Live Chat Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Chat instantly with a safety agent
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-1 text-teal-600 text-sm font-medium">
                    {liveChatLoading ? (
                      <span className="flex items-center gap-1">
                        <div className="h-4 w-4 border-2 border-teal-300 border-t-teal-600 rounded-full animate-spin" />
                        Connecting...
                      </span>
                    ) : (
                      <>
                        Start Chat <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </button>
          </div>
        </div>
      </section>

      {/* ─── Safety Tips Grid ─── */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-3 border-emerald-300 text-emerald-700">
              <Shield className="h-3.5 w-3.5 mr-1.5" />
              Stay Protected
            </Badge>
            <h2 className="text-3xl font-bold mb-3">Safety Tips</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these guidelines to protect yourself and ensure every transaction is safe and secure.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {safetyTips.map((tip) => {
              const Icon = tip.icon;
              return (
                <Card key={tip.title} className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-5">
                    <div className={`h-10 w-10 rounded-xl ${tip.color} flex items-center justify-center mb-3`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1.5">{tip.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{tip.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Scam Awareness Section ─── */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-3 border-rose-300 text-rose-700">
              <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
              Be Aware
            </Badge>
            <h2 className="text-3xl font-bold mb-3">Common Scams to Watch For</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Knowing these common scam tactics will help you recognize and avoid them before it&apos;s too late.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {scamAlerts.map((scam) => {
              const Icon = scam.icon;
              return (
                <Card key={scam.title} className={`border ${scam.color} h-full`}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm ${scam.iconColor}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-1.5">{scam.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">{scam.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Trust Score Explanation ─── */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-3 border-blue-300 text-blue-700">
              <BadgeCheck className="h-3.5 w-3.5 mr-1.5" />
              Verification Levels
            </Badge>
            <h2 className="text-3xl font-bold mb-3">Trust Score System</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our 5-tier verification system helps you gauge the trustworthiness of every user on the platform.
            </p>
          </div>
          <div className="space-y-3">
            {trustLevels.map((level) => (
              <Card key={level.level}>
                <CardContent className="p-4 flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-full ${level.color} ${level.textColor} flex items-center justify-center shrink-0 text-lg font-bold`}>
                    {level.level}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm">{level.label}</h3>
                      <span className="text-xs text-muted-foreground">— {level.desc}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mt-2">
                      {level.requirements.map((req) => (
                        <Badge key={req} variant="outline" className="text-[10px] px-2 py-0">
                          <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-500" />
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Safe Spot Map CTA ─── */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="overflow-hidden border-emerald-200">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="h-20 w-20 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <MapPin className="h-10 w-10 text-emerald-600" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold mb-2">Find Safe Meeting Spots</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Browse our directory of pre-vetted meeting locations with CCTV, good lighting,
                    security presence, and high foot traffic. Stay safe during every in-person transaction.
                  </p>
                </div>
                <div className="shrink-0">
                  <Link href="/tools/safe-spots">
                    <Button size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                      <MapPin className="h-4 w-4" />
                      View Safe Spots
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* ─── How Escrow Protects You (Kept from original) ─── */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-3 border-emerald-300 text-emerald-700">
              <Lock className="h-3.5 w-3.5 mr-1.5" />
              Payment Protection
            </Badge>
            <h2 className="text-3xl font-bold mb-3">How Escrow Protects You</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our escrow system holds funds securely until both parties confirm satisfaction.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: 1, title: "Buyer Pays", desc: "Funds deposited into secure escrow", icon: Banknote },
              { step: 2, title: "Work Happens", desc: "Seller delivers or completes the task", icon: Clock },
              { step: 3, title: "Buyer Verifies", desc: "Inspect and confirm satisfaction", icon: Eye },
              { step: 4, title: "Seller Paid", desc: "Funds released to seller's wallet", icon: CheckCircle2 },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.step} className="text-center h-full">
                  <CardContent className="p-5">
                    <div className="h-12 w-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                      {item.step}
                    </div>
                    <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                      <Icon className="h-4 w-4 text-emerald-700" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Separator className="max-w-4xl mx-auto" />

      {/* ─── Safety FAQ ─── */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-3 border-emerald-300 text-emerald-700">
              <HelpCircle className="h-3.5 w-3.5 mr-1.5" />
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold mb-3">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Quick answers to the most common safety questions.
            </p>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {safetyFaqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-background rounded-lg border px-4">
                <AccordionTrigger className="text-sm font-medium text-left hover:no-underline py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ─── Emergency Contacts ─── */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="border-rose-200 bg-rose-50/50 dark:bg-rose-950/10">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
                Emergency Contacts
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-rose-600 shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-sm">Nigeria Emergency</p>
                      <p className="text-sm text-muted-foreground">112 (Police, Fire, Ambulance)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-rose-600 shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-sm">Lagos Emergency</p>
                      <p className="text-sm text-muted-foreground">112 (General Emergency)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-rose-600 shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-sm">Abuja Emergency</p>
                      <p className="text-sm text-muted-foreground">999 (Police), 112 (General)</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Shield className="h-4 w-4 text-rose-600 shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-sm">PostAll Safety Team</p>
                      <p className="text-sm text-muted-foreground">+234 800 SAFE PA</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageCircle className="h-4 w-4 text-rose-600 shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-sm">Safety Email</p>
                      <p className="text-sm text-muted-foreground">safety@postall.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Info className="h-4 w-4 text-rose-600 shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-sm">In-App Emergency</p>
                      <p className="text-sm text-muted-foreground">Tap Emergency button in any transaction</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <ShieldCheck className="h-12 w-12 mx-auto mb-6 text-emerald-200" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Stay Safe, Stay Smart
          </h2>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Your safety is our top priority. Familiarize yourself with our safety tools,
            follow these guidelines, and don&apos;t hesitate to reach out if you ever need help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/help">
              <Button size="lg" variant="secondary" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                Visit Help Center
              </Button>
            </Link>
            <Link href="/tools/safe-spots">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                <MapPin className="h-4 w-4" />
                Find Safe Spots
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
