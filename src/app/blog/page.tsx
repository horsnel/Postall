"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  ArrowRight,
  Clock,
  User,
  Mail,
  Lock,
  Tag,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  DollarSign,
  Users,
  Lightbulb,
  ChartColumnIncreasing,
  CheckCircle2,
  ChevronRight,
  Rss,
} from "lucide-react";

interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

const blogCategories = [
  { name: "Marketplace Tips", count: 8, icon: Lightbulb },
  { name: "Safety & Trust", count: 5, icon: ShieldCheck },
  { name: "Selling Guides", count: 6, icon: DollarSign },
  { name: "Community Stories", count: 4, icon: Users },
  { name: "Platform Updates", count: 3, icon: Sparkles },
  { name: "Success Stories", count: 4, icon: TrendingUp },
];

const articles: BlogArticle[] = [
  {
    id: "1",
    title: "10 Proven Strategies to Get More Applicants on Your Task Listings",
    excerpt:
      "Discover the top strategies successful task posters use to attract quality applicants. From writing compelling descriptions to setting competitive budgets, these tips will transform your listing performance.",
    category: "Marketplace Tips",
    author: "Chinedu Eze",
    date: "Jan 18, 2026",
    readTime: "8 min read",
    featured: true,
  },
  {
    id: "2",
    title: "The Complete Guide to Escrow: How Your Money Stays Safe on PostAll",
    excerpt:
      "Understanding how escrow protection works is key to transacting safely. Learn the step-by-step process of how funds are held securely and released only when both parties are satisfied.",
    category: "Safety & Trust",
    author: "Amina Kaduna",
    date: "Jan 15, 2026",
    readTime: "6 min read",
  },
  {
    id: "3",
    title: "How to Price Your Items Competitively and Sell Faster",
    excerpt:
      "Pricing can make or break a sale. Learn research techniques, pricing psychology, and how to use market insights data to set prices that attract buyers while maximizing your earnings.",
    category: "Selling Guides",
    author: "Fatima Al-Rashid",
    date: "Jan 12, 2026",
    readTime: "7 min read",
  },
  {
    id: "4",
    title: "From Side Hustle to Full-Time: Emeka's Freelance Journey on PostAll",
    excerpt:
      "Meet Emeka Okafor, a Lagos-based web developer who went from occasional gigs to earning a full-time income through PostAll. He shares his strategies, challenges, and advice for newcomers.",
    category: "Success Stories",
    author: "Editorial Team",
    date: "Jan 10, 2026",
    readTime: "10 min read",
  },
  {
    id: "5",
    title: "5 Red Flags to Watch Out for When Buying Online",
    excerpt:
      "Protect yourself from scams with these essential warning signs. Learn what to look for in seller profiles, listings, and communication patterns to keep your transactions safe.",
    category: "Safety & Trust",
    author: "Kwame Mensah",
    date: "Jan 8, 2026",
    readTime: "5 min read",
  },
  {
    id: "6",
    title: "Introducing Smart Alerts: Never Miss the Perfect Opportunity",
    excerpt:
      "Our new Smart Alerts feature uses intelligent matching to notify you when tasks or items matching your interests are posted. Set up your preferences and let opportunities come to you.",
    category: "Platform Updates",
    author: "PostAll Team",
    date: "Jan 5, 2026",
    readTime: "4 min read",
  },
  {
    id: "7",
    title: "Building Trust: A Complete Guide to Getting Verified on PostAll",
    excerpt:
      "Verification badges signal trustworthiness to other users. Learn the step-by-step process to get verified, what documents you need, and how it impacts your marketplace success.",
    category: "Marketplace Tips",
    author: "Chinedu Eze",
    date: "Jan 3, 2026",
    readTime: "6 min read",
  },
  {
    id: "8",
    title: "How Our Community in Lagos is Redefining Local Commerce",
    excerpt:
      "Lagos's PostAll community has grown by 200% in the past year. Discover how sellers, freelancers, and buyers are creating a thriving local marketplace ecosystem together.",
    category: "Community Stories",
    author: "Editorial Team",
    date: "Dec 30, 2024",
    readTime: "8 min read",
  },
  {
    id: "9",
    title: "Photography Tips: Make Your Listings Stand Out with Great Photos",
    excerpt:
      "Listings with quality photos get 3x more views. Learn smartphone photography techniques, lighting tips, and composition tricks that make your items and services irresistible.",
    category: "Selling Guides",
    author: "Amina Kaduna",
    date: "Dec 28, 2024",
    readTime: "7 min read",
  },
];

const categoryColorMap: Record<string, string> = {
  "Marketplace Tips": "bg-emerald-100 text-emerald-700",
  "Safety & Trust": "bg-rose-100 text-rose-700",
  "Selling Guides": "bg-amber-100 text-amber-700",
  "Community Stories": "bg-teal-100 text-teal-700",
  "Platform Updates": "bg-cyan-100 text-cyan-700",
  "Success Stories": "bg-orange-100 text-orange-700",
};

const gradientBgs = [
  "bg-gradient-to-br from-emerald-200 to-teal-200",
  "bg-gradient-to-br from-amber-200 to-orange-200",
  "bg-gradient-to-br from-rose-200 to-pink-200",
  "bg-gradient-to-br from-teal-200 to-cyan-200",
  "bg-gradient-to-br from-cyan-200 to-sky-200",
  "bg-gradient-to-br from-orange-200 to-amber-200",
];

export default function BlogPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const featuredArticle = articles.find((a) => a.featured);

  const filteredArticles = useMemo(() => {
    if (!activeCategory) return articles.filter((a) => !a.featured);
    return articles.filter(
      (a) => a.category === activeCategory && !a.featured
    );
  }, [activeCategory]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-400/20 rounded-full blur-2xl" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4" />
              PostAll Blog
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Insights, Tips & Community Stories
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 max-w-lg mx-auto">
              Expert advice for buyers and sellers, safety guides, platform updates, and inspiring stories from our growing community.
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-2.5 max-w-6xl">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/browse" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="text-foreground font-medium">Blog</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-7xl">
        {/* Featured Article */}
        {featuredArticle && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-muted-foreground uppercase tracking-wide">
                Featured Article
              </h2>
            </div>
            <Link href={`/blog/${featuredArticle.id}`} className="block group">
              <Card className="overflow-hidden group-hover:shadow-xl transition-shadow duration-300">
                <div className="md:flex">
                  <div className="md:w-1/2 h-56 md:h-auto bg-gradient-to-br from-emerald-300 to-teal-400 relative flex items-center justify-center">
                    <div className="text-6xl text-white/30">
                      <BookOpen className="h-16 w-16" />
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">
                        Featured
                      </Badge>
                    </div>
                  </div>
                  <div className="md:w-1/2">
                    <CardContent className="p-6 md:p-8 flex flex-col justify-center h-full">
                      <Badge
                        variant="secondary"
                        className={`w-fit mb-3 ${
                          categoryColorMap[featuredArticle.category] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {featuredArticle.category}
                      </Badge>
                      <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 group-hover:text-emerald-600 transition-colors">
                        {featuredArticle.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {featuredArticle.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1.5">
                          <User className="h-4 w-4" />
                          {featuredArticle.author}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {featuredArticle.readTime}
                        </span>
                        <span>{featuredArticle.date}</span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold text-sm group-hover:gap-3 transition-all">
                        Read More
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </Link>
          </section>
        )}

        <Separator className="mb-10" />

        {/* Main content area with sidebar */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Articles */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold tracking-tight">
                {activeCategory || "All Articles"}
              </h2>
              {activeCategory && (
                <button
                  onClick={() => setActiveCategory(null)}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Clear filter
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.map((article, index) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.id}`}
                  className="block group"
                >
                  <Card className="overflow-hidden h-full group-hover:shadow-lg transition-shadow duration-200">
                    {/* Image placeholder */}
                    <div
                      className={`h-40 ${gradientBgs[index % gradientBgs.length]} relative flex items-center justify-center`}
                    >
                      <div className="text-white/25 text-5xl">
                        <BookOpen className="h-12 w-12" />
                      </div>
                      <Badge
                        variant="secondary"
                        className={`absolute top-3 left-3 text-xs font-medium ${
                          categoryColorMap[article.category] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {article.category}
                      </Badge>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-sm leading-snug line-clamp-2 mb-2 group-hover:text-emerald-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1.5">
                          <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
                            <span className="text-[9px] font-bold text-emerald-700">
                              {article.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </span>
                          </div>
                          <span className="font-medium">
                            {article.author}
                          </span>
                        </div>
                        <span>{article.date}</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-xs group-hover:gap-2 transition-all">
                        Read More
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-72 xl:w-80 shrink-0 space-y-8">
            {/* Categories */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Tag className="h-4 w-4 text-emerald-600" />
                  Categories
                </h3>
                <div className="space-y-1">
                  {blogCategories.map((cat) => {
                    const CatIcon = cat.icon;
                    const isActive = activeCategory === cat.name;
                    return (
                      <button
                        key={cat.name}
                        onClick={() =>
                          setActiveCategory(isActive ? null : cat.name)
                        }
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 font-medium"
                            : "hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <CatIcon
                            className={`h-4 w-4 ${
                              isActive ? "text-emerald-600" : ""
                            }`}
                          />
                          {cat.name}
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-[10px] h-5 min-w-[24px] justify-center"
                        >
                          {cat.count}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-semibold">Stay in the Loop</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Get the latest tips, platform updates, and community stories
                  delivered to your inbox weekly.
                </p>

                {subscribed ? (
                  <div className="rounded-lg bg-emerald-100 p-4 text-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-emerald-700">
                      You&apos;re subscribed!
                    </p>
                    <p className="text-xs text-emerald-600 mt-1">
                      Check your inbox for a confirmation email.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-3">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-10"
                    />
                    <Button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      disabled={!email.trim() || !email.includes("@")}
                    >
                      <Rss className="h-4 w-4 mr-2" />
                      Subscribe
                    </Button>
                  </form>
                )}

                <div className="flex items-center gap-1.5 mt-3 text-[11px] text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  We respect your privacy. Unsubscribe anytime.
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <ChartColumnIncreasing className="h-4 w-4 text-emerald-600" />
                  Quick Links
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/help"
                    className="flex items-center justify-between text-sm text-muted-foreground hover:text-emerald-600 py-1.5 transition-colors"
                  >
                    <span>Help Center</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/safety"
                    className="flex items-center justify-between text-sm text-muted-foreground hover:text-emerald-600 py-1.5 transition-colors"
                  >
                    <span>Safety Center</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/pricing"
                    className="flex items-center justify-between text-sm text-muted-foreground hover:text-emerald-600 py-1.5 transition-colors"
                  >
                    <span>Pricing & Fees</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/about"
                    className="flex items-center justify-between text-sm text-muted-foreground hover:text-emerald-600 py-1.5 transition-colors"
                  >
                    <span>About PostAll</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
