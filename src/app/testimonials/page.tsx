"use client";

import { useState, useEffect, useRef } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  MapPin,
  Quote,
  Trophy,
  Target,
  Zap,
  Award,
  Heart,
  MessageCircle,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";

interface Testimonial {
  name: string;
  initials: string;
  role: string;
  location: string;
  rating: number;
  text: string;
  verified: boolean;
  date: string;
  color: string;
  category: "buyer" | "seller" | "freelancer" | "agent";
}

interface SuccessStory {
  name: string;
  initials: string;
  role: string;
  location: string;
  quote: string;
  outcome: string;
  metric: string;
  color: string;
}

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  icon: React.ElementType;
}

const stats: StatItem[] = [
  { value: 12500, suffix: "+", label: "Tasks Completed", icon: CheckCircle2 },
  { value: 8200, suffix: "+", label: "Active Users", icon: Users },
  { value: 25, suffix: "+", label: "Cities", icon: MapPin },
  { value: 4.8, suffix: "★", label: "Average Rating", icon: Star },
];

const testimonials: Testimonial[] = [
  {
    name: "Adebayo O.",
    initials: "AO",
    role: "Seller",
    location: "Lagos",
    rating: 5,
    text: "PostAll changed my business. I went from selling in my shop to reaching customers across Lagos. The escrow system gives buyers confidence, and I've made over ₦500K in my first month!",
    verified: true,
    date: "Feb 2026",
    color: "bg-emerald-500",
    category: "seller",
  },
  {
    name: "Chioma N.",
    initials: "CN",
    role: "Buyer",
    location: "Abuja",
    rating: 5,
    text: "I found an incredible interior designer here at half the price I was quoted elsewhere. The whole process from booking to payment was seamless.",
    verified: true,
    date: "Jan 2026",
    color: "bg-emerald-600",
    category: "buyer",
  },
  {
    name: "Emeka T.",
    initials: "ET",
    role: "Freelancer",
    location: "Remote",
    rating: 4,
    text: "As a web developer, PostAll has been my main source of clients. The job matching is accurate and the escrow means I always get paid.",
    verified: true,
    date: "Mar 2026",
    color: "bg-teal-600",
    category: "freelancer",
  },
  {
    name: "Fatima A.",
    initials: "FA",
    role: "Real Estate Agent",
    location: "Port Harcourt",
    rating: 5,
    text: "I've listed 20+ properties and get genuine inquiries daily. The analytics dashboard helps me understand what works and what doesn't.",
    verified: true,
    date: "Feb 2026",
    color: "bg-rose-500",
    category: "agent",
  },
  {
    name: "Kwame M.",
    initials: "KM",
    role: "Errand Runner",
    location: "Lagos",
    rating: 4,
    text: "I make ₦150K monthly completing tasks on PostAll. The swipe-to-pick feature makes it fun to find work, and the payouts are always on time.",
    verified: true,
    date: "Jan 2026",
    color: "bg-amber-500",
    category: "seller",
  },
  {
    name: "Blessing O.",
    initials: "BO",
    role: "Service Provider",
    location: "Lagos",
    rating: 5,
    text: "My cleaning service has grown from 5 to 25 clients in 3 months. PostAll's promote feature really works! The ROI on featured listings is amazing.",
    verified: true,
    date: "Mar 2026",
    color: "bg-cyan-500",
    category: "seller",
  },
  {
    name: "Ibrahim S.",
    initials: "IS",
    role: "Buyer",
    location: "Kano",
    rating: 5,
    text: "I purchased electronics worth ₦200K through PostAll and the escrow protected me perfectly. The seller delivered exactly what was described. Will use again!",
    verified: true,
    date: "Feb 2026",
    color: "bg-indigo-500",
    category: "buyer",
  },
  {
    name: "Adaeze M.",
    initials: "AM",
    role: "Freelancer",
    location: "Enugu",
    rating: 5,
    text: "I'm a graphic designer and I've completed over 30 projects on PostAll. The platform connects me with clients who appreciate quality work.",
    verified: true,
    date: "Mar 2026",
    color: "bg-pink-500",
    category: "freelancer",
  },
  {
    name: "Olumide F.",
    initials: "OF",
    role: "Real Estate Agent",
    location: "Lagos",
    rating: 4,
    text: "The property listing tools are excellent. I can showcase properties with multiple photos, virtual tours, and get verified inquiries from serious buyers.",
    verified: true,
    date: "Jan 2026",
    color: "bg-teal-500",
    category: "agent",
  },
];

const successStories: SuccessStory[] = [
  {
    name: "Adebayo Ogunleye",
    initials: "AO",
    role: "Electronics Seller",
    location: "Lagos",
    quote:
      "Before PostAll, I was struggling to find customers beyond my immediate neighborhood. I signed up, listed my products with good photos, and within the first week, I had 15 orders. The escrow system made buyers trust me instantly. Now I fulfill 50+ orders monthly and have even hired an assistant. PostAll didn't just give me customers — it gave me a real business.",
    outcome: "From zero online presence to ₦500K monthly revenue",
    metric: "₦500K/mo",
    color: "bg-emerald-500",
  },
  {
    name: "Chioma Nwosu",
    initials: "CN",
    role: "Homeowner",
    location: "Abuja",
    quote:
      "I had been searching for a 3-bedroom apartment in Garki for months with no luck. A friend suggested I check PostAll. Within 2 days, I found a beautiful apartment listed by a verified agent. The safe meeting spot feature made the inspection stress-free, and the agent was professional. I signed the lease the following week. I also saved ₦150K compared to agency fees I was quoted elsewhere.",
    outcome: "Found dream apartment in 2 days",
    metric: "2 days",
    color: "bg-emerald-600",
  },
  {
    name: "Emeka Thompson",
    initials: "ET",
    role: "Web Developer",
    location: "Lagos",
    quote:
      "As a freelance developer, finding consistent clients was my biggest challenge. PostAll changed everything. I created a profile, uploaded my portfolio, and started getting job matches immediately. In my first 3 months, I completed 15 projects with zero payment issues thanks to escrow. I now earn ₦350K monthly and have turned down offers from agencies. PostAll gave me the freedom to work on my own terms.",
    outcome: "Got hired for 15 projects in 3 months",
    metric: "15 projects",
    color: "bg-teal-600",
  },
];

const pressLogos = [
  { name: "TechCabal", abbr: "TC" },
  { name: "Disrupt Africa", abbr: "DA" },
  { name: "Guardian Nigeria", abbr: "GN" },
  { name: "Pulse Nigeria", abbr: "PN" },
  { name: "Ventures Africa", abbr: "VA" },
];

const communityHighlights = [
  {
    icon: Trophy,
    title: "10,000th Task Completed",
    description: "Milestone reached in February 2026",
    time: "2 weeks ago",
    color: "text-amber-500",
  },
  {
    icon: MapPin,
    title: "Reached 25+ Cities in Nigeria",
    description: "Now serving all major Nigerian cities",
    time: "1 month ago",
    color: "text-emerald-500",
  },
  {
    icon: ShieldCheck,
    title: "Zero Payment Fraud in Q1 2026",
    description: "Escrow system maintaining 100% safety record",
    time: "Ongoing",
    color: "text-blue-500",
  },
  {
    icon: Users,
    title: "8,000+ Verified Users",
    description: "Growing community of trusted buyers & sellers",
    time: "This week",
    color: "text-purple-500",
  },
  {
    icon: Star,
    title: "4.8 Average Platform Rating",
    description: "Based on 3,200+ verified reviews",
    time: "Updated daily",
    color: "text-yellow-500",
  },
  {
    icon: Zap,
    title: "New Feature: Swipe-to-Pick",
    description: "Match with workers instantly using the new discovery feature",
    time: "3 weeks ago",
    color: "text-rose-500",
  },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  const displayValue =
    target % 1 !== 0 ? count.toFixed(1) : count.toLocaleString();

  return (
    <span className="inline-flex items-center gap-1">
      {displayValue}
      {suffix === '★' ? <Star className="h-5 w-5 fill-amber-400 text-amber-400" /> : suffix}
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= rating
              ? "text-amber-400 fill-amber-400"
              : "text-gray-300 dark:text-gray-600"
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 border h-full flex flex-col">
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`h-11 w-11 rounded-full ${testimonial.color} flex items-center justify-center shrink-0`}
            >
              <span className="text-white text-sm font-semibold">
                {testimonial.initials}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm">{testimonial.name}</span>
                {testimonial.verified && (
                  <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {testimonial.role} in {testimonial.location}
              </p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {testimonial.date}
          </span>
        </div>

        <StarRating rating={testimonial.rating} />

        <Quote className="h-5 w-5 text-emerald-300 mt-3 mb-1" />
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
          {testimonial.text}
        </p>
      </CardContent>
    </Card>
  );
}

function SuccessStoryCard({ story }: { story: SuccessStory }) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border h-full flex flex-col">
      <div className={`${story.color} p-6 text-white`}>
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <span className="text-lg font-bold">{story.initials}</span>
          </div>
          <div>
            <h3 className="font-semibold text-lg">{story.name}</h3>
            <p className="text-white/80 text-sm">
              {story.role} • {story.location}
            </p>
          </div>
        </div>
      </div>
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            <Target className="h-3 w-3 mr-1" />
            {story.outcome}
          </Badge>
        </div>
        <Quote className="h-5 w-5 text-emerald-300 mb-1" />
        <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">
          &ldquo;{story.quote}&rdquo;
        </p>
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              Key Metric: {story.metric}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TestimonialsPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredTestimonials =
    activeCategory === "all"
      ? testimonials
      : testimonials.filter((t) => t.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-background">

      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[300px] md:h-[400px] overflow-hidden text-white">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-400" />
            <img src="/images/testimonials-hero.png" alt="Trusted by thousands" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
          </div>
          <div className="relative z-10 flex items-center justify-center h-full px-4">
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="bg-white/20 text-white hover:bg-white/30 border-white/30 mb-6 text-sm px-4 py-1">
                <Heart className="h-3.5 w-3.5 mr-1.5" />
                Social Proof
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Trusted by Thousands
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                Join a thriving community of buyers, sellers, freelancers, and
                agents who love using PostAll every day.
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Platform Stats */}
        <section className="container mx-auto px-4 -mt-8 relative z-20 mb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {stats.map((stat, i) => (
              <Card
                key={i}
                className="text-center shadow-lg border hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-1">
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Testimonials */}
        <section className="container mx-auto px-4 py-8 md:py-16">
          <div className="text-center mb-12">
            <Badge
              variant="secondary"
              className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 mb-4"
            >
              <Star className="h-3.5 w-3.5 mr-1.5" />
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Real stories from real people using PostAll across Nigeria and
              Africa.
            </p>
          </div>

          {/* Category Tabs */}
          <Tabs
            defaultValue="all"
            onValueChange={setActiveCategory}
            className="w-full mb-8"
          >
            <div className="flex justify-center">
              <TabsList className="bg-muted p-1 h-auto flex-wrap">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="buyer">Buyers</TabsTrigger>
                <TabsTrigger value="seller">Sellers</TabsTrigger>
                <TabsTrigger value="freelancer">Freelancers</TabsTrigger>
                <TabsTrigger value="agent">Real Estate Agents</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredTestimonials.map((testimonial, i) => (
              <TestimonialCard key={i} testimonial={testimonial} />
            ))}
          </div>
        </section>

        {/* Success Stories */}
        <section className="bg-muted/40 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 mb-4"
              >
                <Award className="h-3.5 w-3.5 mr-1.5" />
                Success Stories
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Real People, Real Results
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Hear from users who have transformed their businesses and lives
                with PostAll.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {successStories.map((story, i) => (
                <SuccessStoryCard key={i} story={story} />
              ))}
            </div>
          </div>
        </section>

        {/* Press / Media Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">
              As Seen On
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              {pressLogos.map((logo, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-muted/60 hover:bg-muted rounded-xl px-6 py-4 transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-muted-foreground/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-muted-foreground">
                      {logo.abbr}
                    </span>
                  </div>
                  <span className="font-semibold text-muted-foreground">
                    {logo.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community Highlights */}
        <section className="bg-muted/40 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge
                variant="secondary"
                className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 mb-4"
              >
                <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                Community
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Community Highlights
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Recent achievements and milestones from the PostAll community.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {communityHighlights.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 p-5 hover:bg-muted/50 transition-colors"
                      >
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                          <item.icon className={`h-5 w-5 ${item.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{item.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.description}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {item.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
                  Join the Community
                </h2>
                <p className="text-emerald-50 text-lg mb-8 max-w-xl mx-auto">
                  Be part of Africa&apos;s fastest-growing marketplace. Your
                  success story could be next.
                </p>
                <Link href="/login">
                  <Button
                    size="lg"
                    className="bg-white text-emerald-600 hover:bg-emerald-50 font-semibold px-8 h-12"
                  >
                    Get Started Free
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
