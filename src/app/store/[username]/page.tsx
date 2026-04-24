'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth-store'
import MagicLinkModal from '@/components/layout/magic-link-modal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/constants'
import type { LucideIcon } from 'lucide-react';
import {
  Star,
  MapPin,
  Calendar,
  Shield,
  Clock,
  ShoppingCart,
  Heart,
  LayoutGrid,
  List,
  Package,
  Store as StoreIcon,
  MessageCircle,
  Send,
  Share2,
  ChevronLeft,
  Users,
  TrendingUp,
  Zap,
  Smartphone,
  Laptop,
  Watch,
  Bike,
  Armchair,
  Monitor,
  Headphones,
  Gamepad2,
  Rocket,
} from 'lucide-react'

// ---- Social Links Icons (inline SVGs) ----
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

function TwitterXIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

// ---- Types ----
interface StoreInfo {
  username: string
  displayName: string
  city: string
  memberSince: string
  isVerified: boolean
  rating: number
  reviewCount: number
  responseTime: string
  totalListings: number
  itemsSold: number
  salesThisMonth: number
  followers: number
  description: string
  logoGradient: string
  initials: string
  category: string
}

interface StoreListing {
  id: string
  title: string
  price: number
  condition: string
  city: string
  category: string
  postedAgo: string
  icon: string
  gradient: string
}

interface Review {
  id: string
  author: string
  initials: string
  color: string
  rating: number
  text: string
  date: string
  product: string
}

const sampleStoreInfo: StoreInfo = {
  username: 'emeka_okeke',
  displayName: 'Emeka Okeke',
  city: 'Lagos',
  memberSince: '2024',
  isVerified: true,
  rating: 4.8,
  reviewCount: 47,
  responseTime: 'Within 1 hour',
  totalListings: 24,
  itemsSold: 89,
  salesThisMonth: 12,
  followers: 342,
  description: 'Your trusted source for premium electronics and gadgets in Lagos. We offer the best prices on phones, laptops, gaming accessories, and more. Every item is tested and verified before listing. Fast delivery across Nigeria with escrow protection on every purchase.',
  logoGradient: 'from-emerald-500 to-teal-600',
  initials: 'EO',
  category: 'Electronics',
}

const sampleStoreListings: StoreListing[] = [
  { id: '1', title: 'iPhone 14 Pro Max - 256GB Space Black', price: 650000, condition: 'Like New', city: 'Lagos', category: 'Electronics', postedAgo: '1h ago', icon: 'Smartphone', gradient: 'from-emerald-100 to-teal-100' },
  { id: '2', title: 'MacBook Air M2 - 512GB SSD Space Gray', price: 800000, condition: 'Good', city: 'Lagos', category: 'Electronics', postedAgo: '3h ago', icon: 'Laptop', gradient: 'from-cyan-100 to-blue-100' },
  { id: '3', title: 'Samsung Galaxy Watch 6 Classic', price: 180000, condition: 'New', city: 'Lagos', category: 'Electronics', postedAgo: '5h ago', icon: 'Watch', gradient: 'from-amber-100 to-orange-100' },
  { id: '4', title: 'Mountain Bike - Trek Marlin 7 2023', price: 400000, condition: 'New', city: 'Lagos', category: 'Sports', postedAgo: '8h ago', icon: 'Bike', gradient: 'from-rose-100 to-pink-100' },
  { id: '5', title: 'Gaming Chair - Secretlab Titan Evo', price: 250000, condition: 'Like New', city: 'Lagos', category: 'Furniture', postedAgo: '12h ago', icon: 'Armchair', gradient: 'from-purple-100 to-violet-100' },
  { id: '6', title: 'Standing Desk - Electric Adjustable Pro', price: 280000, condition: 'New', city: 'Lagos', category: 'Furniture', postedAgo: '1d ago', icon: 'Monitor', gradient: 'from-teal-100 to-cyan-100' },
  { id: '7', title: 'AirPods Pro 2nd Gen with MagSafe', price: 95000, condition: 'Like New', city: 'Lagos', category: 'Electronics', postedAgo: '2d ago', icon: 'Headphones', gradient: 'from-emerald-100 to-green-100' },
  { id: '8', title: 'PS5 Digital Edition + 2 Controllers', price: 420000, condition: 'Good', city: 'Lagos', category: 'Gaming', postedAgo: '3d ago', icon: 'Gamepad2', gradient: 'from-indigo-100 to-blue-100' },
  { id: '9', title: 'DJI Mini 3 Pro Drone Fly More Combo', price: 550000, condition: 'New', city: 'Lagos', category: 'Electronics', postedAgo: '4d ago', icon: 'Rocket', gradient: 'from-sky-100 to-indigo-100' },
]

const storeIconMap: Record<string, LucideIcon> = {
  Smartphone,
  Laptop,
  Watch,
  Bike,
  Armchair,
  Monitor,
  Headphones,
  Gamepad2,
  Rocket,
}

const sampleReviews: Review[] = [
  { id: 'r1', author: 'Adebayo Johnson', initials: 'AJ', color: 'bg-emerald-500', rating: 5, text: 'Excellent seller! The iPhone was exactly as described. Fast shipping and great communication throughout the process. Will definitely buy again!', date: '2 days ago', product: 'iPhone 14 Pro Max' },
  { id: 'r2', author: 'Fatima Abdullahi', initials: 'FA', color: 'bg-rose-500', rating: 5, text: 'Very trustworthy seller. Used the escrow service and everything went smoothly. The MacBook was in perfect condition. Highly recommended!', date: '1 week ago', product: 'MacBook Air M2' },
  { id: 'r3', author: 'Kwame Mensah', initials: 'KM', color: 'bg-blue-500', rating: 4, text: 'Good product overall. Minor scratches not mentioned in description but the price was fair. Seller responded quickly and was professional.', date: '2 weeks ago', product: 'Samsung Galaxy Watch 6' },
]

const allCategories = ['All Categories', 'Electronics', 'Furniture', 'Sports', 'Gaming']

const conditionColors: Record<string, string> = {
  'New': 'bg-emerald-100 text-emerald-700',
  'Like New': 'bg-teal-100 text-teal-700',
  'Good': 'bg-amber-100 text-amber-700',
  'Fair': 'bg-orange-100 text-orange-700',
  'Poor': 'bg-rose-100 text-rose-700',
}

const socialLinks = [
  { name: 'WhatsApp', icon: WhatsAppIcon, color: 'text-green-600 hover:bg-green-50 hover:text-green-700', href: '#' },
  { name: 'Telegram', icon: TelegramIcon, color: 'text-blue-500 hover:bg-blue-50 hover:text-blue-600', href: '#' },
  { name: 'Instagram', icon: InstagramIcon, color: 'text-pink-600 hover:bg-pink-50 hover:text-pink-700', href: '#' },
  { name: 'Twitter/X', icon: TwitterXIcon, color: 'text-foreground hover:bg-muted hover:text-foreground', href: '#' },
  { name: 'Facebook', icon: FacebookIcon, color: 'text-blue-600 hover:bg-blue-50 hover:text-blue-700', href: '#' },
]

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'h-4 w-4' : 'h-3 w-3'
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${cls} ${star <= Math.floor(rating) ? 'fill-amber-400 text-amber-400' : star - 0.5 <= rating ? 'fill-amber-200 text-amber-400' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
  )
}

export default function StorePage() {
  const params = useParams()
  const username = params.username as string
  const { user } = useAuthStore()
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null)
  const [listings, setListings] = useState<StoreListing[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('newest')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [following, setFollowing] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [buyDialogOpen, setBuyDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<StoreListing | null>(null)
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const res = await fetch(`/api/users/${username}`)
        if (res.ok) {
          const data = await res.json()
          setStoreInfo(data.storeInfo || { ...sampleStoreInfo, username })
          setListings(data.listings || sampleStoreListings)
        } else {
          setStoreInfo({ ...sampleStoreInfo, username })
          setListings(sampleStoreListings)
        }
      } catch {
        setStoreInfo({ ...sampleStoreInfo, username })
        setListings(sampleStoreListings)
      }
      setLoading(false)
    }
    fetchData()
  }, [username])

  const filteredAndSorted = useMemo(() => {
    let result = [...listings]
    if (categoryFilter !== 'All Categories') {
      result = result.filter((l) => l.category === categoryFilter)
    }
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      default:
        break
    }
    return result
  }, [listings, categoryFilter, sortBy])

  const handleFollow = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    setFollowing(!following)
    toast.success(following ? 'Unfollowed store' : 'Following store!')
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: `${storeInfo?.displayName}'s Store on PostAll`, url })
      } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('Store link copied to clipboard!')
    }
  }

  const handleBuyNow = (product: StoreListing) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    setSelectedProduct(product)
    setBuyDialogOpen(true)
  }

  const handleProceedToPayment = () => {
    toast.success('Redirecting to Paystack...')
    setTimeout(() => {
      setBuyDialogOpen(false)
      toast.info('Demo mode — payment would be processed via Paystack')
    }, 1500)
  }

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      toast.error('Please type a message')
      return
    }
    setSendingMessage(true)
    setTimeout(() => {
      setSendingMessage(false)
      setMessageDialogOpen(false)
      setMessageText('')
      toast.success('Message sent to seller!')
    }, 800)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-muted rounded-xl" />
          <div className="h-16 bg-muted rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 bg-muted rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!storeInfo) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <StoreIcon className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold mb-2">Store Not Found</h2>
        <p className="text-muted-foreground mb-6">The store for &quot;{username}&quot; does not exist.</p>
        <Link href="/"><Button>Back to Home</Button></Link>
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-6xl">
        {/* Back link + Share */}
        <div className="flex items-center justify-between mb-4">
          <Link href="/stores" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Back to All Stores
          </Link>
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            Share Store
          </Button>
        </div>

        {/* Store Header Banner */}
        <div className="rounded-2xl overflow-hidden shadow-sm">
          <div className={`h-44 sm:h-56 bg-gradient-to-r ${storeInfo.logoGradient} relative`}>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          <Card className="rounded-t-none border-t-0">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start gap-4 -mt-14 sm:-mt-16">
                {/* Store Logo */}
                <div className={`h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-br ${storeInfo.logoGradient} flex items-center justify-center border-4 border-white shadow-lg relative z-10 shrink-0`}>
                  <span className="text-white font-bold text-lg sm:text-2xl">{storeInfo.initials}</span>
                </div>

                <div className="flex-1 pt-2 sm:pt-8 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-bold">{storeInfo.displayName}</h1>
                    {storeInfo.isVerified && (
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 gap-1">
                        <Shield className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      <StoreIcon className="h-3 w-3 mr-1" />
                      {storeInfo.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Joined {storeInfo.memberSince}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {storeInfo.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {storeInfo.responseTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <StarRating rating={storeInfo.rating} />
                      <span className="text-sm font-semibold">{storeInfo.rating}</span>
                      <span className="text-xs text-muted-foreground">({storeInfo.reviewCount} reviews)</span>
                    </div>
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      <span className="font-medium">{storeInfo.followers.toLocaleString()}</span> followers
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 sm:pt-8 flex-wrap shrink-0">
                  <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-1.5">
                        <MessageCircle className="h-4 w-4" />
                        <span className="hidden sm:inline">Contact Seller</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Message {storeInfo.displayName}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${storeInfo.logoGradient} flex items-center justify-center`}>
                            <span className="text-white font-bold text-sm">{storeInfo.initials}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{storeInfo.displayName}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {storeInfo.responseTime}
                            </p>
                          </div>
                        </div>
                        <Textarea
                          placeholder={`Hi ${storeInfo.displayName}, I'm interested in your products...`}
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          rows={4}
                          className="resize-none"
                        />
                        <Button className="w-full gap-2" onClick={handleSendMessage} disabled={sendingMessage}>
                          {sendingMessage ? (
                            <span className="flex items-center gap-2">
                              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Sending...
                            </span>
                          ) : (
                            <>
                              <Send className="h-4 w-4" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant={following ? 'secondary' : 'default'}
                    onClick={handleFollow}
                    className="gap-1.5"
                  >
                    <Heart className={`h-4 w-4 ${following ? 'fill-rose-500 text-rose-500' : ''}`} />
                    {following ? 'Following' : 'Follow'}
                  </Button>
                </div>
              </div>

              {/* Social Links Row */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <span className="text-xs text-muted-foreground mr-1">Connect:</span>
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    title={social.name}
                    className={`h-9 w-9 rounded-lg border flex items-center justify-center transition-colors ${social.color}`}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Store Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
              <Package className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-700">{storeInfo.totalListings}</p>
              <p className="text-xs text-emerald-600/70">Products Listed</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-teal-50 border border-teal-100">
            <div className="h-10 w-10 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-teal-700">{storeInfo.salesThisMonth}</p>
              <p className="text-xs text-teal-600/70">Sales This Month</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-amber-50 border border-amber-100">
            <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
              <Star className="h-5 w-5 text-amber-600 fill-amber-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-amber-700">{storeInfo.rating}/5.0</p>
              <p className="text-xs text-amber-600/70">Rating</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-cyan-50 border border-cyan-100">
            <div className="h-10 w-10 rounded-lg bg-cyan-100 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-cyan-700">&lt; 1hr</p>
              <p className="text-xs text-cyan-600/70">Response Time</p>
            </div>
          </div>
        </div>

        {/* About This Store */}
        <Card className="mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <StoreIcon className="h-4 w-4 text-emerald-500" />
              About This Store
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-muted-foreground leading-relaxed">{storeInfo.description}</p>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Listings Area */}
          <div className="flex-1 min-w-0">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 p-4 rounded-xl border bg-card">
              <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {allCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-1 ml-auto">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Listings Grid / List */}
            {filteredAndSorted.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-1">No Active Listings</h3>
                  <p className="text-sm text-muted-foreground">
                    {categoryFilter !== 'All Categories'
                      ? `No listings found in "${categoryFilter}". Try another category.`
                      : 'This store has no active listings at the moment.'}
                  </p>
                </CardContent>
              </Card>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredAndSorted.map((listing) => (
                  <Card key={listing.id} className="overflow-hidden group">
                    <div className={`h-40 bg-gradient-to-br ${listing.gradient} relative`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        {(() => { const Ic = storeIconMap[listing.icon] || Package; return <Ic className="h-12 w-12 text-gray-500/60" />; })()}
                      </div>
                      <Badge className={`absolute top-3 right-3 ${conditionColors[listing.condition] || 'bg-muted text-muted-foreground'}`}>
                        {listing.condition}
                      </Badge>
                      <Badge variant="secondary" className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm text-[10px]">
                        {listing.category}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {listing.title}
                      </h3>
                      <p className="text-lg font-bold text-emerald-600 mt-1">{formatCurrency(listing.price)}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                        <MapPin className="h-3 w-3" />
                        {listing.city}
                        <span className="text-muted-foreground">·</span>
                        <Clock className="h-3 w-3" />
                        {listing.postedAgo}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs gap-1"
                          onClick={() => { setSelectedProduct(listing); setMessageDialogOpen(true) }}
                        >
                          <MessageCircle className="h-3 w-3" />
                          Contact
                        </Button>
                        <Button
                          className="flex-1 text-xs gap-1"
                          size="sm"
                          onClick={() => handleBuyNow(listing)}
                        >
                          <Zap className="h-3 w-3" />
                          Buy Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAndSorted.map((listing) => (
                  <Card key={listing.id} className="overflow-hidden group">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`h-24 w-24 sm:h-28 sm:w-28 rounded-lg bg-gradient-to-br ${listing.gradient} flex items-center justify-center shrink-0`}>
                          {(() => { const Ic = storeIconMap[listing.icon] || Package; return <Ic className="h-10 w-10 text-gray-500/60" />; })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <Badge className={`text-[10px] px-1.5 py-0 ${conditionColors[listing.condition] || 'bg-muted text-muted-foreground'}`}>
                              {listing.condition}
                            </Badge>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              {listing.category}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-emerald-600 transition-colors">
                            {listing.title}
                          </h3>
                          <p className="text-lg font-bold text-emerald-600 mt-0.5">{formatCurrency(listing.price)}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            {listing.city}
                            <span>·</span>
                            <Clock className="h-3 w-3" />
                            {listing.postedAgo}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => { setSelectedProduct(listing); setMessageDialogOpen(true) }}>
                              <MessageCircle className="h-3 w-3" />
                              Contact Seller
                            </Button>
                            <Button size="sm" className="text-xs gap-1" onClick={() => handleBuyNow(listing)}>
                              <Zap className="h-3 w-3" />
                              Buy Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Reviews Section */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  Customer Reviews
                  <Badge variant="secondary">{storeInfo.reviewCount}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sampleReviews.map((review) => (
                  <div key={review.id}>
                    <div className="flex items-start gap-3">
                      <div className={`h-9 w-9 rounded-full ${review.color} flex items-center justify-center shrink-0`}>
                        <span className="text-white text-xs font-semibold">{review.initials}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">{review.author}</span>
                          <StarRating rating={review.rating} />
                          <span className="text-xs text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">Purchased: {review.product}</p>
                        <p className="text-sm mt-1.5">{review.text}</p>
                      </div>
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Buy Now Dialog */}
      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Purchase Item</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-4 p-4 bg-muted rounded-xl">
                <div className={`h-16 w-16 rounded-lg bg-gradient-to-br ${selectedProduct.gradient} flex items-center justify-center shrink-0`}>
                  {(() => { const Ic = storeIconMap[selectedProduct.icon] || Package; return <Ic className="h-8 w-8 text-gray-500/60" />; })()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm line-clamp-2">{selectedProduct.title}</h3>
                  <p className="text-lg font-bold text-emerald-600 mt-1">{formatCurrency(selectedProduct.price)}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Seller</span>
                  <span className="font-medium">{storeInfo?.displayName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Condition</span>
                  <Badge className={conditionColors[selectedProduct.condition] || 'bg-muted text-muted-foreground'}>
                    {selectedProduct.condition}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Location</span>
                  <span>{selectedProduct.city}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm font-semibold">
                  <span>Total</span>
                  <span className="text-emerald-600 text-lg">{formatCurrency(selectedProduct.price)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                <Shield className="h-4 w-4 text-emerald-600 shrink-0" />
                <p className="text-xs text-emerald-700">Your payment is protected by PostAll Escrow until you confirm receipt of the item.</p>
              </div>
              <Button className="w-full gap-2 h-11" onClick={handleProceedToPayment}>
                <Zap className="h-4 w-4" />
                Proceed to Payment
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <MagicLinkModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  )
}
