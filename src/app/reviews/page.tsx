'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Star,
  CheckCircle2,
  Shield,
  Clock,
  Briefcase,
  ShoppingCart,
  Loader2,
  AlertCircle,
  MessageCircle,
  Search,
  ThumbsUp,
  Camera,
  Edit3,
  Trash2,
  Package,
  SlidersHorizontal,
  Home,
  ChevronRight,
  X,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────
interface ReviewBreakdown {
  communication: number
  quality: number
  timeliness: number
  value: number
}

interface Review {
  id: string
  reviewerName: string
  reviewerInitials: string
  reviewerColor: string
  reviewerVerified: boolean
  rating: number
  comment: string
  date: string
  category: 'task' | 'item' | 'service' | 'rental'
  referenceTitle: string
  referenceLink: string
  breakdown: ReviewBreakdown
  helpfulCount: number
  sellerResponse?: string
}

interface MyReview extends Review {
  editMode: boolean
}

// ─── Sample Data ──────────────────────────────────────────────
const ratingDistribution = { 5: 1593, 4: 490, 3: 245, 2: 74, 1: 48 }
const totalReviews = 2450
const avgRating = 4.8

const sampleReviews: Review[] = [
  {
    id: 'r1',
    reviewerName: 'Amina K.',
    reviewerInitials: 'AK',
    reviewerColor: 'from-emerald-400 to-teal-500',
    reviewerVerified: true,
    rating: 5,
    comment: 'Exceptional work on the website redesign project. The developer delivered pixel-perfect designs and was incredibly responsive throughout. The site loads fast and looks amazing on all devices. Would definitely hire again!',
    date: '2 hours ago',
    category: 'service',
    referenceTitle: 'Restaurant Website Redesign',
    referenceLink: '/task/1',
    breakdown: { communication: 5, quality: 5, timeliness: 5, value: 5 },
    helpfulCount: 24,
    sellerResponse: 'Thank you so much Amina! It was a pleasure working on your restaurant\'s website. I\'m glad you\'re happy with the results. Don\'t hesitate to reach out if you need any updates!',
  },
  {
    id: 'r2',
    reviewerName: 'Kwame Mensah',
    reviewerInitials: 'KM',
    reviewerColor: 'from-blue-400 to-indigo-500',
    reviewerVerified: true,
    rating: 5,
    comment: 'Bought the MacBook Air and it was exactly as described. Came with original box and all accessories. The seller was punctual for the meetup at the safe spot and very friendly. Smooth transaction from start to finish!',
    date: '5 hours ago',
    category: 'item',
    referenceTitle: 'MacBook Air M2 - 512GB',
    referenceLink: '/item/2',
    breakdown: { communication: 5, quality: 5, timeliness: 5, value: 4 },
    helpfulCount: 18,
  },
  {
    id: 'r3',
    reviewerName: 'Sarah Thompson',
    reviewerInitials: 'ST',
    reviewerColor: 'from-rose-400 to-pink-500',
    reviewerVerified: true,
    rating: 4,
    comment: 'Great work on the mobile application. The UI is clean and intuitive. Communication was good throughout the project. It took slightly longer than estimated but the quality of the final product was excellent.',
    date: '1 day ago',
    category: 'task',
    referenceTitle: 'E-commerce Mobile App',
    referenceLink: '/task/3',
    breakdown: { communication: 4, quality: 5, timeliness: 3, value: 4 },
    helpfulCount: 12,
  },
  {
    id: 'r4',
    reviewerName: 'David Okonkwo',
    reviewerInitials: 'DO',
    reviewerColor: 'from-amber-400 to-orange-500',
    reviewerVerified: true,
    rating: 5,
    comment: 'The plumbing service was top-notch. The plumber arrived on time, diagnosed the issue quickly, and fixed everything within an hour. Very professional and charges were fair. Highly recommend this service provider!',
    date: '1 day ago',
    category: 'service',
    referenceTitle: 'Plumbing Repair Service',
    referenceLink: '/item/4',
    breakdown: { communication: 5, quality: 5, timeliness: 5, value: 5 },
    helpfulCount: 31,
    sellerResponse: 'Thank you David! I appreciate your kind words. Plumbing issues can be stressful, so I always try to be as efficient as possible. Happy to help anytime!',
  },
  {
    id: 'r5',
    reviewerName: 'Fatima Abubakar',
    reviewerInitials: 'FA',
    reviewerColor: 'from-violet-400 to-purple-500',
    reviewerVerified: true,
    rating: 5,
    comment: 'Amazing SEO optimization work! Within one month of implementing the recommendations, we saw a 40% increase in organic traffic and a 25% increase in conversions. The detailed report was very insightful. Worth every naira!',
    date: '2 days ago',
    category: 'task',
    referenceTitle: 'Website SEO Optimization',
    referenceLink: '/task/5',
    breakdown: { communication: 5, quality: 5, timeliness: 4, value: 5 },
    helpfulCount: 15,
  },
  {
    id: 'r6',
    reviewerName: 'John Bello',
    reviewerInitials: 'JB',
    reviewerColor: 'from-cyan-400 to-sky-500',
    reviewerVerified: false,
    rating: 4,
    comment: 'Rented a 2-bedroom apartment in Ikeja through PostAll. The agent was honest about the property condition and helped negotiate a fair rent. The escrow payment system gave me confidence. Only minor issue was the viewing scheduling.',
    date: '3 days ago',
    category: 'rental',
    referenceTitle: '2BR Apartment - Ikeja GRA',
    referenceLink: '/item/6',
    breakdown: { communication: 4, quality: 4, timeliness: 3, value: 4 },
    helpfulCount: 8,
  },
  {
    id: 'r7',
    reviewerName: 'Grace Wanjiku',
    reviewerInitials: 'GW',
    reviewerColor: 'from-lime-400 to-green-500',
    reviewerVerified: true,
    rating: 3,
    comment: 'Decent work on the data analysis project. The deliverables were good but there were some delays in communication during the middle of the project. The final report was well-structured and provided actionable insights for our business decisions.',
    date: '4 days ago',
    category: 'task',
    referenceTitle: 'Data Analysis Project',
    referenceLink: '/task/7',
    breakdown: { communication: 3, quality: 4, timeliness: 2, value: 4 },
    helpfulCount: 5,
  },
  {
    id: 'r8',
    reviewerName: 'Michael Chen',
    reviewerInitials: 'MC',
    reviewerColor: 'from-red-400 to-rose-500',
    reviewerVerified: true,
    rating: 5,
    comment: 'Incredible work! The developer set up our entire e-commerce platform from scratch. From design to payment integration to shipping, everything works perfectly. Technical skills are top-notch and very easy to work with.',
    date: '5 days ago',
    category: 'service',
    referenceTitle: 'E-commerce Platform Setup',
    referenceLink: '/task/8',
    breakdown: { communication: 5, quality: 5, timeliness: 4, value: 5 },
    helpfulCount: 42,
    sellerResponse: 'Michael, it was an absolute joy working on your e-commerce project! Your clear requirements made my job much easier. I\'m thrilled the platform is performing well. Let me know if you need any enhancements!',
  },
  {
    id: 'r9',
    reviewerName: 'Lucy Agyeman',
    reviewerInitials: 'LA',
    reviewerColor: 'from-fuchsia-400 to-pink-500',
    reviewerVerified: false,
    rating: 4,
    comment: 'Purchased the standing desk and it works great. Electric adjustment is smooth and quiet. The seller was honest about a minor scratch on the base which I appreciated. Fair pricing for the quality received.',
    date: '1 week ago',
    category: 'item',
    referenceTitle: 'Standing Desk - Electric',
    referenceLink: '/item/9',
    breakdown: { communication: 4, quality: 4, timeliness: 5, value: 4 },
    helpfulCount: 7,
  },
]

const myReviews: MyReview[] = [
  {
    id: 'my1',
    reviewerName: 'You (DemoUser)',
    reviewerInitials: 'DU',
    reviewerColor: 'from-emerald-500 to-teal-600',
    reviewerVerified: true,
    rating: 5,
    comment: 'Excellent seller! The iPhone was in perfect condition, exactly as described. Met at the designated safe spot and the transaction was seamless. Highly recommend.',
    date: '1 week ago',
    category: 'item',
    referenceTitle: 'iPhone 14 Pro Max - 256GB',
    referenceLink: '/item/10',
    breakdown: { communication: 5, quality: 5, timeliness: 5, value: 4 },
    helpfulCount: 11,
    editMode: false,
  },
  {
    id: 'my2',
    reviewerName: 'You (DemoUser)',
    reviewerInitials: 'DU',
    reviewerColor: 'from-emerald-500 to-teal-600',
    reviewerVerified: true,
    rating: 4,
    comment: 'Good logo design work. Understood the brief well and delivered on time. A few minor revisions were needed but overall satisfied with the final output.',
    date: '2 weeks ago',
    category: 'task',
    referenceTitle: 'Company Logo Redesign',
    referenceLink: '/task/11',
    breakdown: { communication: 4, quality: 4, timeliness: 4, value: 4 },
    helpfulCount: 3,
    editMode: false,
  },
  {
    id: 'my3',
    reviewerName: 'You (DemoUser)',
    reviewerInitials: 'DU',
    reviewerColor: 'from-emerald-500 to-teal-600',
    reviewerVerified: true,
    rating: 5,
    comment: 'Amazing cleaning service! The apartment was spotless after the deep cleaning. Very thorough and professional team. Will definitely book again.',
    date: '3 weeks ago',
    category: 'service',
    referenceTitle: 'Deep Cleaning Service - 3BR',
    referenceLink: '/item/12',
    breakdown: { communication: 5, quality: 5, timeliness: 5, value: 5 },
    helpfulCount: 6,
    editMode: false,
  },
]

const categoryIcons: Record<string, typeof Briefcase> = {
  task: Briefcase,
  item: ShoppingCart,
  service: SlidersHorizontal,
  rental: Home,
}

const revieweeOptions = [
  'Tunde Enterprises',
  'GlamByNneka',
  'HairByChioma',
  'TechDeals Store',
  'PropertyPro Agency',
  'QuickFix Services',
]

const listingOptions = [
  'MacBook Air M2 - 512GB',
  'iPhone 14 Pro Max - 256GB',
  'Restaurant Website Redesign',
  'Logo Design Project',
  '2BR Apartment - Ikeja GRA',
  'Deep Cleaning Service - 3BR',
]

// ─── Components ───────────────────────────────────────────────
function StarRating({
  rating,
  size = 'md',
  interactive = false,
  onRate,
}: {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onRate?: (r: number) => void
}) {
  const [hover, setHover] = useState(0)
  const sizeClasses = { sm: 'h-3.5 w-3.5', md: 'h-5 w-5', lg: 'h-7 w-7' }

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
        >
          <Star
            className={`${sizeClasses[size]} ${
              star <= (interactive ? hover || rating : rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-300'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  )
}

function MiniProgressBar({ label, value }: { label: string; value: number }) {
  const labels: Record<string, string> = {
    communication: 'Communication',
    quality: 'Quality of Work',
    timeliness: 'Timeliness',
    value: 'Value for Money',
  }
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-20 text-muted-foreground shrink-0">{labels[label] || label}</span>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
      <span className="w-6 text-right font-medium">{value}</span>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────
export default function ReviewsPage() {
  // Filter state
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [searchQuery, setSearchQuery] = useState('')

  // Write review state
  const [writeDialogOpen, setWriteDialogOpen] = useState(false)
  const [overallRating, setOverallRating] = useState(0)
  const [reviewee, setReviewee] = useState('')
  const [listing, setListing] = useState('')
  const [commRating, setCommRating] = useState(0)
  const [qualityRating, setQualityRating] = useState(0)
  const [timeRating, setTimeRating] = useState(0)
  const [valueRating, setValueRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Helpful state
  const [helpfulSet, setHelpfulSet] = useState<Set<string>>(new Set())

  const toggleHelpful = (id: string) => {
    setHelpfulSet((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Filter reviews
  const filteredReviews = useMemo(() => {
    let reviews = [...sampleReviews]
    if (categoryFilter !== 'all') reviews = reviews.filter((r) => r.category === categoryFilter)
    if (ratingFilter !== 'all') reviews = reviews.filter((r) => r.rating === Number(ratingFilter))
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      reviews = reviews.filter(
        (r) =>
          r.comment.toLowerCase().includes(q) ||
          r.reviewerName.toLowerCase().includes(q) ||
          r.referenceTitle.toLowerCase().includes(q)
      )
    }
    if (sortBy === 'highest') reviews.sort((a, b) => b.rating - a.rating)
    if (sortBy === 'lowest') reviews.sort((a, b) => a.rating - b.rating)
    if (sortBy === 'helpful') reviews.sort((a, b) => b.helpfulCount - a.helpfulCount)
    return reviews
  }, [categoryFilter, ratingFilter, sortBy, searchQuery])

  const handleSubmitReview = () => {
    if (overallRating === 0 || !reviewText.trim()) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitSuccess(true)
      setTimeout(() => {
        setSubmitSuccess(false)
        setWriteDialogOpen(false)
        setOverallRating(0)
        setReviewee('')
        setListing('')
        setCommRating(0)
        setQualityRating(0)
        setTimeRating(0)
        setValueRating(0)
        setReviewText('')
      }, 2000)
    }, 1500)
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-gray-50/30">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-white" />
            <div className="absolute bottom-10 right-20 h-48 w-48 rounded-full bg-white" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-white" />
          </div>
          <div className="container mx-auto px-4 py-12 sm:py-16 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
                Reviews & Ratings
              </h1>
              <p className="text-emerald-100 text-sm sm:text-base mb-8">
                Read authentic reviews from real users. Share your experience and help build trust in our marketplace.
              </p>
              <div className="inline-flex items-center gap-4 bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-4">
                <div className="text-center">
                  <p className="text-4xl sm:text-5xl font-bold">{avgRating}</p>
                  <StarRating rating={Math.round(avgRating)} size="sm" />
                  <p className="text-xs text-emerald-100 mt-1">Average Rating</p>
                </div>
                <div className="h-12 w-px bg-white/30" />
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold">{totalReviews.toLocaleString()}</p>
                  <p className="text-xs text-emerald-100 mt-1">Verified Reviews</p>
                </div>
                <div className="h-12 w-px bg-white/30" />
                <div className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold">94%</p>
                  <p className="text-xs text-emerald-100 mt-1">Satisfaction Rate</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Review Stats */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-6 items-center">
                {/* Overall Rating */}
                <div className="text-center md:text-left">
                  <p className="text-5xl font-bold text-emerald-600">{avgRating}</p>
                  <StarRating rating={Math.round(avgRating)} size="lg" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Based on {totalReviews.toLocaleString()} reviews
                  </p>
                </div>
                {/* Distribution Bars */}
                <div className="space-y-2.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = ratingDistribution[star as keyof typeof ratingDistribution]
                    const pct = Math.round((count / totalReviews) * 100)
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-12">
                          <span className="text-sm font-medium">{star}</span>
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        </div>
                        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              star >= 4 ? 'bg-emerald-500' : star === 3 ? 'bg-amber-400' : 'bg-rose-400'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex items-center gap-2 w-24 justify-end">
                          <span className="text-xs text-muted-foreground">{count.toLocaleString()}</span>
                          <span className="text-xs font-medium w-10 text-right">{pct}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="all-reviews" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all-reviews" className="gap-1.5">
                  <MessageCircle className="h-3.5 w-3.5" />
                  All Reviews
                </TabsTrigger>
                <TabsTrigger value="my-reviews" className="gap-1.5">
                  <Star className="h-3.5 w-3.5" />
                  My Reviews
                </TabsTrigger>
              </TabsList>
              <Button
                onClick={() => setWriteDialogOpen(true)}
                className="gap-1.5"
              >
                <MessageCircle className="h-4 w-4" />
                Write a Review
              </Button>
            </div>

            {/* All Reviews Tab */}
            <TabsContent value="all-reviews" className="space-y-6">
              {/* Filter Bar */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search reviews..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full sm:w-[160px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="task">Tasks</SelectItem>
                        <SelectItem value="item">Items</SelectItem>
                        <SelectItem value="service">Services</SelectItem>
                        <SelectItem value="rental">Rentals</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={ratingFilter} onValueChange={setRatingFilter}>
                      <SelectTrigger className="w-full sm:w-[140px]">
                        <SelectValue placeholder="Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ratings</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="1">1 Star</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full sm:w-[170px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Most Recent</SelectItem>
                        <SelectItem value="highest">Highest Rated</SelectItem>
                        <SelectItem value="lowest">Lowest Rated</SelectItem>
                        <SelectItem value="helpful">Most Helpful</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews Grid */}
              {filteredReviews.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-1">No Reviews Found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      No reviews match your selected filters.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCategoryFilter('all')
                        setRatingFilter('all')
                        setSearchQuery('')
                      }}
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredReviews.map((review) => (
                    <Card key={review.id} className="flex flex-col">
                      <CardContent className="p-5 flex-1 flex flex-col gap-3">
                        {/* Header */}
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarFallback
                              className={`bg-gradient-to-br ${review.reviewerColor} text-white text-sm font-semibold`}
                            >
                              {review.reviewerInitials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm">{review.reviewerName}</span>
                              {review.reviewerVerified && (
                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px] px-1.5 py-0 gap-0.5">
                                  <CheckCircle2 className="h-2.5 w-2.5" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <StarRating rating={review.rating} size="sm" />
                              <span className="text-xs text-muted-foreground">{review.date}</span>
                            </div>
                          </div>
                        </div>

                        {/* Category Badge & Reference */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-1">
                            {(() => {
                              const Icon = categoryIcons[review.category] || ShoppingCart
                              return <><Icon className="h-2.5 w-2.5" />{review.category.charAt(0).toUpperCase() + review.category.slice(1)}</>
                            })()}
                          </Badge>
                          <Link
                            href={review.referenceLink}
                            className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline truncate flex items-center gap-0.5"
                          >
                            {review.referenceTitle}
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                        </div>

                        {/* Review Text */}
                        <p className="text-sm leading-relaxed text-foreground/90 flex-1">
                          {review.comment}
                        </p>

                        {/* Rating Breakdown Mini Bars */}
                        <div className="space-y-1.5">
                          <MiniProgressBar label="communication" value={review.breakdown.communication} />
                          <MiniProgressBar label="quality" value={review.breakdown.quality} />
                          <MiniProgressBar label="timeliness" value={review.breakdown.timeliness} />
                          <MiniProgressBar label="value" value={review.breakdown.value} />
                        </div>

                        {/* Helpful Button */}
                        <div className="flex items-center justify-between pt-1">
                          <button
                            onClick={() => toggleHelpful(review.id)}
                            className={`flex items-center gap-1.5 text-xs transition-colors ${
                              helpfulSet.has(review.id)
                                ? 'text-emerald-600'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            <ThumbsUp className={`h-3.5 w-3.5 ${helpfulSet.has(review.id) ? 'fill-emerald-600' : ''}`} />
                            Helpful ({review.helpfulCount + (helpfulSet.has(review.id) ? 1 : 0)})
                          </button>
                        </div>

                        {/* Seller Response */}
                        {review.sellerResponse && (
                          <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 mt-1">
                            <p className="text-[10px] font-semibold text-emerald-700 mb-1 flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              Seller responded:
                            </p>
                            <p className="text-xs text-emerald-800 leading-relaxed">
                              {review.sellerResponse}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* My Reviews Tab */}
            <TabsContent value="my-reviews" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Reviews you have written for other users on PostAll.
              </p>
              {myReviews.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-1">No Reviews Yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You haven&apos;t written any reviews yet.
                    </p>
                    <Button onClick={() => setWriteDialogOpen(true)}>
                      Write Your First Review
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {myReviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarFallback
                              className={`bg-gradient-to-br ${review.reviewerColor} text-white text-sm font-semibold`}
                            >
                              {review.reviewerInitials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm">{review.reviewerName}</span>
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 gap-1">
                                {(() => {
                                  const Icon = categoryIcons[review.category] || ShoppingCart
                                  return <><Icon className="h-2.5 w-2.5" />{review.category.charAt(0).toUpperCase() + review.category.slice(1)}</>
                                })()}
                              </Badge>
                              <Link
                                href={review.referenceLink}
                                className="text-xs text-emerald-600 hover:underline flex items-center gap-0.5"
                              >
                                {review.referenceTitle}
                                <ChevronRight className="h-3 w-3" />
                              </Link>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <StarRating rating={review.rating} size="sm" />
                              <span className="text-xs text-muted-foreground">{review.date}</span>
                            </div>
                            <p className="text-sm mt-2 leading-relaxed text-foreground/90">
                              {review.comment}
                            </p>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mt-3">
                              <MiniProgressBar label="communication" value={review.breakdown.communication} />
                              <MiniProgressBar label="quality" value={review.breakdown.quality} />
                              <MiniProgressBar label="timeliness" value={review.breakdown.timeliness} />
                              <MiniProgressBar label="value" value={review.breakdown.value} />
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              <Button variant="outline" size="sm" className="text-xs gap-1 h-8">
                                <Edit3 className="h-3 w-3" />
                                Edit
                              </Button>
                              <Button variant="outline" size="sm" className="text-xs gap-1 h-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50">
                                <Trash2 className="h-3 w-3" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Write a Review Dialog */}
      <Dialog open={writeDialogOpen} onOpenChange={setWriteDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-emerald-600" />
              Write a Review
            </DialogTitle>
          </DialogHeader>

          {submitSuccess ? (
            <div className="text-center py-8">
              <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-7 w-7 text-emerald-600" />
              </div>
              <p className="font-semibold text-lg text-emerald-600">Review Submitted!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Thank you for sharing your experience.
              </p>
            </div>
          ) : (
            <div className="space-y-5 pt-2">
              {/* Overall Star Rating */}
              <div className="space-y-2">
                <Label>Overall Rating</Label>
                <div className="flex items-center gap-3">
                  <StarRating rating={overallRating} size="lg" interactive onRate={setOverallRating} />
                  <span className="text-sm text-muted-foreground">
                    {overallRating > 0
                      ? ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][overallRating]
                      : 'Select a rating'}
                  </span>
                </div>
              </div>

              {/* Reviewee & Listing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Reviewee</Label>
                  <Select value={reviewee} onValueChange={setReviewee}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user you interacted with" />
                    </SelectTrigger>
                    <SelectContent>
                      {revieweeOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Listing / Task</Label>
                  <Select value={listing} onValueChange={setListing}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select listing" />
                    </SelectTrigger>
                    <SelectContent>
                      {listingOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Rating Categories */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Rate by Category</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-xs font-medium">Communication</span>
                    <StarRating rating={commRating} size="sm" interactive onRate={setCommRating} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-xs font-medium">Quality of Work</span>
                    <StarRating rating={qualityRating} size="sm" interactive onRate={setQualityRating} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-xs font-medium">Timeliness</span>
                    <StarRating rating={timeRating} size="sm" interactive onRate={setTimeRating} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-xs font-medium">Value for Money</span>
                    <StarRating rating={valueRating} size="sm" interactive onRate={setValueRating} />
                  </div>
                </div>
              </div>

              {/* Text Review */}
              <div className="space-y-2">
                <Label>Your Review</Label>
                <Textarea
                  placeholder="Share your experience in detail. What went well? What could be improved?"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                  maxLength={2000}
                />
                <p className="text-xs text-muted-foreground text-right">{reviewText.length}/2,000</p>
              </div>

              {/* Photo Upload Area */}
              <div className="space-y-2">
                <Label>Photos (optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer">
                  <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Add photos to your review
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Drag & drop or click to upload (max 5 photos)
                  </p>
                </div>
              </div>

              {/* Submit */}
              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmitReview}
                disabled={submitting || overallRating === 0 || !reviewText.trim()}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
