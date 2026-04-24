'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth-store'
import MagicLinkModal from '@/components/layout/magic-link-modal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Star,
  MapPin,
  Calendar,
  CheckCircle2,
  MessageCircle,
  ShoppingCart,
  Award,
  Shield,
  Clock,
  Eye,
  FileText,
  Briefcase,
  Users,
} from 'lucide-react'

interface UserProfile {
  username: string
  displayName: string
  bio: string
  city: string
  memberSince: string
  isVerified: boolean
  rating: number
  reviewCount: number
  tasksCompleted: number
  activeListings: number
  skills: string[]
  responseTime: string
  verifiedBadges: string[]
}

interface Review {
  id: string
  reviewerName: string
  reviewerAvatar: string
  rating: number
  comment: string
  date: string
  type: string
  referenceTitle: string
}

interface Listing {
  id: string
  title: string
  price: number
  condition: string
  city: string
  postedAgo: string
}

const sampleProfile: UserProfile = {
  username: 'emeka_okeke',
  displayName: 'Emeka Okeke',
  bio: 'Full-stack developer and creative problem solver based in Lagos. I specialize in web development, UI/UX design, and digital marketing. With over 5 years of experience, I have helped businesses build their online presence and grow their customer base. I believe in delivering quality work on time and building lasting professional relationships.',
  city: 'Lagos',
  memberSince: 'March 2023',
  isVerified: true,
  rating: 4.8,
  reviewCount: 47,
  tasksCompleted: 156,
  activeListings: 12,
  skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Figma', 'UI/UX Design', 'Digital Marketing', 'SEO', 'WordPress', 'Python', 'MongoDB'],
  responseTime: 'Within 1 hour',
  verifiedBadges: ['Identity Verified', 'Phone Verified', 'Email Verified', 'Top Seller'],
}

const sampleListings: Listing[] = [
  { id: '1', title: 'iPhone 14 Pro Max - 256GB', price: 650, condition: 'Like New', city: 'Lagos', postedAgo: '1h ago' },
  { id: '2', title: 'MacBook Air M2 - 512GB SSD', price: 800, condition: 'Good', city: 'Lagos', postedAgo: '3h ago' },
  { id: '4', title: 'Mountain Bike - Trek Marlin 7', price: 400, condition: 'New', city: 'Lagos', postedAgo: '8h ago' },
  { id: '5', title: 'Gaming Chair - Secretlab Titan', price: 250, condition: 'Like New', city: 'Lagos', postedAgo: '12h ago' },
  { id: '6', title: 'Standing Desk - Electric Adjustable', price: 280, condition: 'New', city: 'Lagos', postedAgo: '1d ago' },
]

const sampleReviews: Review[] = [
  { id: 'r1', reviewerName: 'Amina K.', reviewerAvatar: 'A', rating: 5, comment: 'Emeka delivered an outstanding website redesign for our restaurant. His attention to detail and communication throughout the project was excellent. Would highly recommend!', date: '2 days ago', type: 'task', referenceTitle: 'Restaurant Website Redesign' },
  { id: 'r2', reviewerName: 'Kwame M.', reviewerAvatar: 'K', rating: 5, comment: 'Very professional and delivered on time. The logo design exceeded our expectations. Emeka really understood our brand vision.', date: '5 days ago', type: 'task', referenceTitle: 'Startup Logo Design' },
  { id: 'r3', reviewerName: 'Sarah T.', reviewerAvatar: 'S', rating: 4, comment: 'Great work on the mobile app. The UI is clean and intuitive. Took a bit longer than expected but the final result was worth it.', date: '1 week ago', type: 'task', referenceTitle: 'E-commerce Mobile App' },
  { id: 'r4', reviewerName: 'David O.', reviewerAvatar: 'D', rating: 5, comment: 'Bought the MacBook Air from Emeka. Item was exactly as described. Met up at a safe spot and transaction was smooth. Highly recommended seller!', date: '1 week ago', type: 'listing', referenceTitle: 'MacBook Air M2' },
  { id: 'r5', reviewerName: 'Fatima A.', reviewerAvatar: 'F', rating: 5, comment: 'Excellent SEO optimization for our company website. We saw a 40% increase in organic traffic within just one month. Incredible results!', date: '2 weeks ago', type: 'task', referenceTitle: 'Website SEO Optimization' },
  { id: 'r6', reviewerName: 'John B.', reviewerAvatar: 'J', rating: 4, comment: 'The gaming chair was in excellent condition. Emeka was punctual for the meetup and very friendly. Would buy from him again.', date: '3 weeks ago', type: 'listing', referenceTitle: 'Gaming Chair - Secretlab Titan' },
]

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'h-6 w-6' : size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5'
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${star <= Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  )
}

const conditionColors: Record<string, string> = {
  'New': 'bg-emerald-100 text-emerald-700',
  'Like New': 'bg-teal-100 text-teal-700',
  'Good': 'bg-amber-100 text-amber-700',
  'Fair': 'bg-orange-100 text-orange-700',
  'Poor': 'bg-rose-100 text-rose-700',
}

export default function UserProfilePage() {
  const params = useParams()
  const username = params.username as string
  const { user } = useAuthStore()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [contactAction, setContactAction] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const res = await fetch(`/api/users/${username}`)
        if (res.ok) {
          const data = await res.json()
          setProfile(data.profile || sampleProfile)
          setListings(data.listings || sampleListings)
          setReviews(data.reviews || sampleReviews)
        } else {
          setProfile({ ...sampleProfile, username })
          setListings(sampleListings)
          setReviews(sampleReviews)
        }
      } catch {
        setProfile({ ...sampleProfile, username })
        setListings(sampleListings)
        setReviews(sampleReviews)
      }
      setLoading(false)
    }
    fetchData()
  }, [username])

  const handleContact = () => {
    if (!user) {
      setContactAction(true)
      setShowAuthModal(true)
      return
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-muted rounded-xl" />
          <div className="flex gap-6">
            <div className="h-24 w-24 bg-muted rounded-full" />
            <div className="flex-1 space-y-3">
              <div className="h-6 w-48 bg-muted rounded" />
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-4 w-64 bg-muted rounded" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold mb-2">User Not Found</h2>
        <p className="text-muted-foreground mb-6">The user &quot;{username}&quot; does not exist or their profile is not public.</p>
        <Link href="/"><Button>Back to Home</Button></Link>
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-xl border overflow-hidden">
          <div className="h-32 sm:h-40 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          </div>

          <div className="px-4 sm:px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12 sm:-mt-14">
              <div className="relative">
                <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-white shadow-lg">
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-2xl sm:text-3xl font-bold">
                    {profile.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {profile.isVerified && (
                  <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold">{profile.displayName}</h1>
                  {profile.isVerified && (
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 gap-1">
                      <Shield className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {profile.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Member since {profile.memberSince}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {profile.rating} ({profile.reviewCount} reviews)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 pb-1">
                <Button onClick={handleContact} className="gap-1.5">
                  <MessageCircle className="h-4 w-4" />
                  Contact
                </Button>
                <Link href={`/store/${profile.username}`}>
                  <Button variant="outline" className="gap-1.5">
                    <ShoppingCart className="h-4 w-4" />
                    View Store
                  </Button>
                </Link>
              </div>
            </div>

            {profile.bio && (
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-emerald-600">{profile.tasksCompleted}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Tasks Completed</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="h-10 w-10 rounded-lg bg-teal-100 flex items-center justify-center mx-auto mb-2">
                <FileText className="h-5 w-5 text-teal-600" />
              </div>
              <p className="text-2xl font-bold text-teal-600">{profile.activeListings}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Active Listings</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center mx-auto mb-2">
                <Star className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-amber-600">{profile.reviewCount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Reviews</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="h-10 w-10 rounded-lg bg-cyan-100 flex items-center justify-center mx-auto mb-2">
                <Award className="h-5 w-5 text-cyan-600" />
              </div>
              <p className="text-2xl font-bold text-cyan-600">{profile.rating}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="listings" className="mt-8">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="listings" className="gap-1.5">
              <FileText className="h-4 w-4" />
              Listings
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-1.5">
              <Star className="h-4 w-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="about" className="gap-1.5">
              <Eye className="h-4 w-4" />
              About
            </TabsTrigger>
          </TabsList>

          {/* Listings Tab */}
          <TabsContent value="listings">
            {listings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-1">No Active Listings</h3>
                  <p className="text-sm text-muted-foreground">This user currently has no active listings.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {listings.map((listing) => (
                  <Card key={listing.id} className="overflow-hidden group">
                    <div className="h-40 bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-50 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ShoppingCart className="h-12 w-12 text-emerald-300" />
                      </div>
                      <Badge
                        className={`absolute top-3 right-3 ${conditionColors[listing.condition] || 'bg-gray-100 text-gray-700'}`}
                      >
                        {listing.condition}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {listing.title}
                      </h3>
                      <p className="text-lg font-bold text-emerald-600 mt-1">${listing.price}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                        <MapPin className="h-3 w-3" />
                        {listing.city}
                        <span className="text-muted-foreground">·</span>
                        <Clock className="h-3 w-3" />
                        {listing.postedAgo}
                      </div>
                      <Link href={`/item/${listing.id}`}>
                        <Button variant="outline" size="sm" className="w-full mt-3">
                          View Details
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            {reviews.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-1">No Reviews Yet</h3>
                  <p className="text-sm text-muted-foreground">This user has not received any reviews yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4 mt-4 max-h-[600px] overflow-y-auto pr-1">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-teal-400 to-cyan-500 text-white text-sm font-semibold">
                            {review.reviewerAvatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm">{review.reviewerName}</span>
                            {review.rating === 5 && (
                              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[10px] px-1.5 py-0">
                                Top Review
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <StarRating rating={review.rating} />
                            <span className="text-xs text-muted-foreground">{review.date}</span>
                          </div>
                          <p className="text-sm mt-2 leading-relaxed">{review.comment}</p>
                          <div className="flex items-center gap-1.5 mt-2">
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              {review.type === 'task' ? (
                                <><Briefcase className="h-2.5 w-2.5 mr-1" />Task</>
                              ) : (
                                <><ShoppingCart className="h-2.5 w-2.5 mr-1" />Listing</>
                              )}
                            </Badge>
                            <span className="text-xs text-muted-foreground truncate">
                              {review.referenceTitle}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Award className="h-5 w-5 text-emerald-600" />
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Verification Badges */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Shield className="h-5 w-5 text-teal-600" />
                    Verification Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {profile.verifiedBadges.map((badge) => (
                      <div key={badge} className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4 text-teal-600" />
                        </div>
                        <span className="text-sm font-medium">{badge}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Response Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Clock className="h-5 w-5 text-amber-600" />
                    Response Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {profile.displayName} typically responds within <span className="font-semibold text-foreground">{profile.responseTime}</span>.
                    This is based on their average response time over the last 30 days.
                  </p>
                </CardContent>
              </Card>

              {/* Detailed Bio */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-5 w-5 text-cyan-600" />
                    Detailed Bio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium">{profile.city}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Member Since</p>
                      <p className="font-medium">{profile.memberSince}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Reviews</p>
                      <p className="font-medium">{profile.reviewCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Average Rating</p>
                      <p className="font-medium">{profile.rating}/5.0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <MagicLinkModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  )
}
