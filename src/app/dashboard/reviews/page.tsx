'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Star,
  ThumbsUp,
  Flag,
  MessageCircle,
  CircleUserRound,
  Calendar,
  ShoppingCart,
  Award,
  AlertCircle,
  Send,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';

interface ReceivedReview {
  id: string;
  reviewer: string;
  reviewerInitials: string;
  rating: number;
  date: string;
  listingTitle: string;
  text: string;
  helpful: number;
  reported: boolean;
}

interface GivenReview {
  id: string;
  forUser: string;
  forUserInitials: string;
  rating: number;
  date: string;
  listingTitle: string;
  text: string;
}

interface PendingReview {
  id: string;
  transactionTitle: string;
  date: string;
  counterparty: string;
  counterpartyInitials: string;
}

const receivedReviews: ReceivedReview[] = [
  {
    id: 'r1',
    reviewer: 'Amina Kaduna',
    reviewerInitials: 'AK',
    rating: 5,
    date: 'Dec 15, 2024',
    listingTitle: 'WordPress Blog Setup',
    text: 'Excellent work! Delivered on time and the quality exceeded my expectations. The blog looks professional and loads fast. Will definitely hire again.',
    helpful: 12,
    reported: false,
  },
  {
    id: 'r2',
    reviewer: 'Chidi Okafor',
    reviewerInitials: 'CO',
    rating: 4,
    date: 'Dec 12, 2024',
    listingTitle: 'Logo Design Project',
    text: 'Great designer with good communication. The initial concepts were good, though we needed a few revisions. Final result was solid.',
    helpful: 8,
    reported: false,
  },
  {
    id: 'r3',
    reviewer: 'Fatima Al-Rashid',
    reviewerInitials: 'FA',
    rating: 5,
    date: 'Dec 10, 2024',
    listingTitle: 'Social Media Campaign',
    text: 'Outstanding campaign management! Engagement went up 300% in the first week. Very professional and creative approach. Highly recommended.',
    helpful: 15,
    reported: false,
  },
  {
    id: 'r4',
    reviewer: 'Emeka Nwankwo',
    reviewerInitials: 'EN',
    rating: 5,
    date: 'Dec 8, 2024',
    listingTitle: 'Landing Page Design',
    text: 'The landing page looks amazing! Conversion rate improved by 40% after launch. Great attention to detail and responsive design.',
    helpful: 10,
    reported: false,
  },
  {
    id: 'r5',
    reviewer: 'Blessing Adekunle',
    reviewerInitials: 'BA',
    rating: 3,
    date: 'Dec 5, 2024',
    listingTitle: 'Data Analysis Report',
    text: 'The report was decent but could have been more detailed. Delivery was on time though. Some charts needed better formatting.',
    helpful: 3,
    reported: false,
  },
  {
    id: 'r6',
    reviewer: 'Kwame Asante',
    reviewerInitials: 'KA',
    rating: 4,
    date: 'Dec 2, 2024',
    listingTitle: 'E-commerce Setup',
    text: 'Good work setting up the WooCommerce store. Everything works smoothly. A few minor issues with payment gateway integration were resolved quickly.',
    helpful: 6,
    reported: false,
  },
  {
    id: 'r7',
    reviewer: 'Yusuf Ibrahim',
    reviewerInitials: 'YI',
    rating: 5,
    date: 'Nov 28, 2024',
    listingTitle: 'Mobile App UI Design',
    text: 'Absolutely stunning UI designs! The animations and transitions are smooth. Very talented designer who understands user experience deeply.',
    helpful: 9,
    reported: false,
  },
  {
    id: 'r8',
    reviewer: 'Ngozi Eze',
    reviewerInitials: 'NE',
    rating: 4,
    date: 'Nov 25, 2024',
    listingTitle: 'SEO Optimization',
    text: 'Good SEO work, our organic traffic improved significantly. Regular updates and reports were appreciated. Would recommend for SEO projects.',
    helpful: 5,
    reported: false,
  },
];

const givenReviews: GivenReview[] = [
  {
    id: 'g1',
    forUser: 'Tunde Bakare',
    forUserInitials: 'TB',
    rating: 5,
    date: 'Dec 14, 2024',
    listingTitle: 'Plumbing Services - Bathroom Renovation',
    text: 'Fantastic plumber! Arrived on time, worked cleanly, and finished ahead of schedule. The bathroom looks brand new. Highly professional.',
  },
  {
    id: 'g2',
    forUser: 'Chioma Okonkwo',
    forUserInitials: 'CO',
    rating: 4,
    date: 'Dec 10, 2024',
    listingTitle: 'iPhone 13 Pro - Mint Condition',
    text: 'Phone was exactly as described. Seller was honest about the battery health. Smooth transaction through PostAll escrow.',
  },
  {
    id: 'g3',
    forUser: 'Ahmed Musa',
    forUserInitials: 'AM',
    rating: 5,
    date: 'Dec 5, 2024',
    listingTitle: 'React Native Developer for Fintech App',
    text: 'Brilliant developer! Built the app module quickly with clean code. Great communication throughout the project.',
  },
  {
    id: 'g4',
    forUser: 'Adaeze Obi',
    forUserInitials: 'AO',
    rating: 4,
    date: 'Nov 30, 2024',
    listingTitle: '2BR Apartment - Yaba',
    text: 'Responsive agent who showed me multiple properties. Found the perfect apartment within my budget. Honest and reliable.',
  },
];

const pendingReviews: PendingReview[] = [
  { id: 'p1', transactionTitle: 'Payment received - Logo Redesign', date: 'Dec 16, 2024', counterparty: 'Obi Nwosu', counterpartyInitials: 'ON' },
  { id: 'p2', transactionTitle: 'Payment received - Website Redesign', date: 'Dec 14, 2024', counterparty: 'Zainab Aliyu', counterpartyInitials: 'ZA' },
  { id: 'p3', transactionTitle: 'Sold item - MacBook Pro M2', date: 'Dec 12, 2024', counterparty: 'Tobi Adeyemi', counterpartyInitials: 'TA' },
  { id: 'p4', transactionTitle: 'Task completed - Data Entry', date: 'Dec 10, 2024', counterparty: 'Grace Okonkwo', counterpartyInitials: 'GO' },
  { id: 'p5', transactionTitle: 'Payment received - Flyer Design', date: 'Dec 8, 2024', counterparty: 'Samuel Eze', counterpartyInitials: 'SE' },
];

const starColors = ['text-rose-500', 'text-amber-500', 'text-amber-500', 'text-amber-500', 'text-amber-500'];

function StarRating({ rating, size = 'sm', interactive = false, onRate }: { rating: number; size?: 'sm' | 'md' | 'lg'; interactive?: boolean; onRate?: (r: number) => void }) {
  const sizeClass = size === 'lg' ? 'h-7 w-7' : size === 'md' ? 'h-5 w-5' : 'h-4 w-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
        >
          <Star
            className={`${sizeClass} ${
              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReceivedReview[]>(receivedReviews);
  const [writeRating, setWriteRating] = useState(0);
  const [writeText, setWriteText] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stats
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1) : '0.0';
  const fiveStar = reviews.filter(r => r.rating === 5).length;
  const fourStar = reviews.filter(r => r.rating === 4).length;
  const threeStar = reviews.filter(r => r.rating === 3).length;
  const twoStar = reviews.filter(r => r.rating === 2).length;
  const oneStar = reviews.filter(r => r.rating === 1).length;

  const markHelpful = (id: string) => {
    setReviews(prev => prev.map(r => (r.id === id ? { ...r, helpful: r.helpful + 1 } : r)));
    toast.success('Marked as helpful');
  };

  const markReported = (id: string) => {
    setReviews(prev => prev.map(r => (r.id === id ? { ...r, reported: true } : r)));
    toast.success('Review reported', { description: 'Our team will review this report.' });
  };

  const handleSubmitReview = () => {
    if (!selectedTransaction) {
      toast.error('Please select a transaction');
      return;
    }
    if (writeRating === 0) {
      toast.error('Please select a star rating');
      return;
    }
    if (writeText.trim().length < 10) {
      toast.error('Please write at least 10 characters');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setWriteRating(0);
      setWriteText('');
      setSelectedTransaction('');
      toast.success('Review submitted!', {
        description: 'Thank you for your feedback.',
      });
    }, 1500);
  };

  const reviewerColors = [
    'bg-emerald-100 text-emerald-700',
    'bg-emerald-100 text-emerald-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-teal-100 text-teal-700',
    'bg-rose-100 text-rose-700',
    'bg-cyan-100 text-cyan-700',
    'bg-orange-100 text-orange-700',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Star className="h-6 w-6 text-amber-500" />
          Reviews
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage your reviews, ratings, and feedback
        </p>
      </div>

      {/* Review Stats Card */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6">
            {/* Left: Average + Total */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="text-center sm:text-left">
                <p className="text-5xl font-bold text-emerald-600">{averageRating}</p>
                <StarRating rating={Math.round(Number(averageRating))} size="lg" />
                <p className="text-sm text-muted-foreground mt-1">
                  Based on <span className="font-medium text-foreground">{totalReviews}</span> reviews
                </p>
              </div>

              <Separator orientation="vertical" className="hidden sm:block h-24" />
              <Separator className="sm:hidden" />

              {/* Rating Breakdown */}
              <div className="flex-1 w-full max-w-xs space-y-2">
                {[
                  { stars: 5, count: fiveStar, color: 'bg-emerald-500' },
                  { stars: 4, count: fourStar, color: 'bg-emerald-400' },
                  { stars: 3, count: threeStar, color: 'bg-amber-500' },
                  { stars: 2, count: twoStar, color: 'bg-orange-500' },
                  { stars: 1, count: oneStar, color: 'bg-rose-500' },
                ].map(({ stars, count, color }) => (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-xs font-medium w-8 flex items-center gap-0.5">{stars}<Star className="h-3 w-3 fill-amber-400 text-amber-400" /></span>
                    <Progress
                      value={totalReviews > 0 ? (count / totalReviews) * 100 : 0}
                      className={`h-2 flex-1 ${color}`}
                    />
                    <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Quick Stats */}
            <div className="flex flex-row md:flex-col gap-4 md:gap-3">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Award className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-lg font-bold">{fiveStar}</p>
                  <p className="text-xs text-muted-foreground">5-Star Reviews</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-lg font-bold">92%</p>
                  <p className="text-xs text-muted-foreground">Positive</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="received" className="space-y-4">
        <TabsList>
          <TabsTrigger value="received" className="gap-1.5">
            <MessageCircle className="h-3.5 w-3.5" />
            Reviews Received
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 ml-1">{totalReviews}</Badge>
          </TabsTrigger>
          <TabsTrigger value="write" className="gap-1.5">
            <Send className="h-3.5 w-3.5" />
            Write a Review
            <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 ml-1">{pendingReviews.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="given" className="gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            My Reviews Given
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 ml-1">{givenReviews.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Reviews Received Tab */}
        <TabsContent value="received">
          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {reviews.map((review, index) => (
              <Card key={review.id} className="border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${reviewerColors[index % reviewerColors.length]}`}>
                      {review.reviewerInitials}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm">{review.reviewer}</p>
                          <StarRating rating={review.rating} size="sm" />
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                          <Calendar className="h-3 w-3" />
                          {review.date}
                        </span>
                      </div>

                      {/* Listing */}
                      <div className="flex items-center gap-1 mt-1">
                        <ShoppingCart className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{review.listingTitle}</span>
                      </div>

                      {/* Review Text */}
                      <p className="text-sm mt-2 text-muted-foreground leading-relaxed">{review.text}</p>

                      {/* Actions */}
                      <div className="flex items-center gap-3 mt-3 pt-2 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 h-7 text-xs"
                          onClick={() => markHelpful(review.id)}
                        >
                          <ThumbsUp className="h-3 w-3" />
                          Helpful ({review.helpful})
                        </Button>
                        {!review.reported ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 h-7 text-xs text-muted-foreground hover:text-rose-600"
                            onClick={() => markReported(review.id)}
                          >
                            <Flag className="h-3 w-3" />
                            Report
                          </Button>
                        ) : (
                          <Badge variant="secondary" className="text-[10px] bg-rose-100 text-rose-700">
                            <Flag className="h-3 w-3 mr-1" />
                            Reported
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Write a Review Tab */}
        <TabsContent value="write">
          <div className="space-y-6 max-w-2xl">
            {/* Pending Transactions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Pending Reviews
                </CardTitle>
                <CardDescription>
                  You have {pendingReviews.length} transaction{pendingReviews.length > 1 ? 's' : ''} waiting for your review
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                {pendingReviews.map((tx, index) => (
                  <div
                    key={tx.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedTransaction === tx.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedTransaction(tx.id)}
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${reviewerColors[index % reviewerColors.length]}`}>
                      {tx.counterpartyInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{tx.transactionTitle}</p>
                      <p className="text-xs text-muted-foreground">with {tx.counterparty} · {tx.date}</p>
                    </div>
                    {selectedTransaction === tx.id && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Review Form */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Send className="h-4 w-4 text-emerald-600" />
                  Write Your Review
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Select Transaction */}
                <div className="space-y-2">
                  <Label>Select Transaction *</Label>
                  <Select value={selectedTransaction} onValueChange={setSelectedTransaction}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a transaction to review" />
                    </SelectTrigger>
                    <SelectContent>
                      {pendingReviews.map((tx) => (
                        <SelectItem key={tx.id} value={tx.id}>
                          {tx.transactionTitle} — {tx.counterparty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Star Rating */}
                <div className="space-y-2">
                  <Label>Your Rating *</Label>
                  <div className="flex items-center gap-3">
                    <StarRating rating={writeRating} size="lg" interactive onRate={setWriteRating} />
                    {writeRating > 0 && (
                      <span className="text-sm font-medium text-amber-600">
                        {writeRating === 1 ? 'Poor' : writeRating === 2 ? 'Fair' : writeRating === 3 ? 'Good' : writeRating === 4 ? 'Very Good' : 'Excellent'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Review Text */}
                <div className="space-y-2">
                  <Label>Your Review *</Label>
                  <Textarea
                    placeholder="Share your experience... (minimum 10 characters)"
                    value={writeText}
                    onChange={(e) => setWriteText(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {writeText.length}/500 characters
                  </p>
                </div>

                <Button
                  className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleSubmitReview}
                  disabled={isSubmitting || !selectedTransaction || writeRating === 0 || writeText.length < 10}
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Review
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* My Reviews Given Tab */}
        <TabsContent value="given">
          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {givenReviews.map((review, index) => (
              <Card key={review.id} className="border shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${reviewerColors[index % reviewerColors.length]}`}>
                      {review.forUserInitials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm">Review for {review.forUser}</p>
                          <StarRating rating={review.rating} size="sm" />
                        </div>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                          <Calendar className="h-3 w-3" />
                          {review.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 mt-1">
                        <ShoppingCart className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{review.listingTitle}</span>
                      </div>

                      <p className="text-sm mt-2 text-muted-foreground leading-relaxed">{review.text}</p>

                      <div className="mt-3 pt-2 border-t">
                        <Badge variant="secondary" className="text-[10px] bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Published
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
