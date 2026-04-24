'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Sparkles,
  Zap,
  Star,
  Rocket,
  Crown,
  CheckCircle2,
  ArrowRight,
  Eye,
  MessageCircle,
  Clock,
  TrendingUp,
  ShoppingCart,
  CircleDollarSign,
  ChartColumnIncreasing,
  Package,
} from 'lucide-react'

interface ListingItem {
  id: string
  title: string
  category: string
  price: number
  views: number
  inquiries: number
  posted: string
  status: string
}

interface PromotionOption {
  id: string
  name: string
  price: number
  period: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  features: string[]
  expectedReach: string
  color: string
  popular?: boolean
}

const sampleListings: ListingItem[] = [
  { id: 'pl1', title: 'iPhone 14 Pro Max - 256GB', category: 'For Sale', price: 650000, views: 245, inquiries: 3, posted: '5 days ago', status: 'active' },
  { id: 'pl2', title: 'WordPress Website Development', category: 'Gigs', price: 75000, views: 89, inquiries: 0, posted: '2 days ago', status: 'active' },
  { id: 'pl3', title: 'Professional Plumbing Services', category: 'Services', price: 40000, views: 156, inquiries: 7, posted: '1 week ago', status: 'active' },
]

const promotionOptions: PromotionOption[] = [
  {
    id: 'boost',
    name: 'Boost',
    price: 1000,
    period: '/week',
    icon: Zap,
    description: 'Appears higher in search results',
    features: ['Higher search ranking', '7 days visibility boost', '"Boosted" badge'],
    expectedReach: 'Estimated 3x more views',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'featured',
    name: 'Featured',
    price: 3000,
    period: '/week',
    icon: Star,
    description: 'Shows in Featured sections',
    features: ['Homepage Featured section', 'Category page placement', '"Featured" banner', 'Priority search ranking'],
    expectedReach: 'Estimated 5x more views',
    color: 'bg-emerald-100 text-emerald-700',
    popular: true,
  },
  {
    id: 'urgent',
    name: 'Urgent',
    price: 5000,
    period: '/week',
    icon: Rocket,
    description: 'Gets "Urgent" badge + top placement',
    features: ['"Urgent" badge on listing', 'Top of all results', 'Push notification to buyers', '7 days of priority placement'],
    expectedReach: 'Estimated 8x more views',
    color: 'bg-rose-100 text-rose-700',
  },
  {
    id: 'all-in-one',
    name: 'All-in-One Package',
    price: 7500,
    period: '/week',
    icon: Crown,
    description: 'Boost + Featured + Urgent combined',
    features: ['Everything in Boost', 'Everything in Featured', 'Everything in Urgent', 'Maximum visibility', 'Save ₦1,500 vs buying separately'],
    expectedReach: 'Estimated 10x more views',
    color: 'bg-emerald-100 text-emerald-700',
    popular: true,
  },
]

const analyticsData = [
  { label: 'Before Promotion', views: 45, inquiries: 2, color: 'bg-gray-300' },
  { label: 'After Boost', views: 135, inquiries: 6, color: 'bg-amber-400' },
  { label: 'After Featured', views: 225, inquiries: 11, color: 'bg-emerald-400' },
  { label: 'After All-in-One', views: 450, inquiries: 22, color: 'bg-teal-500' },
]

export default function PromoteListingPage() {
  const [selectedListing, setSelectedListing] = useState<string | null>(null)
  const [selectedPromotion, setSelectedPromotion] = useState<string | null>(null)

  const currentListing = sampleListings.find((l) => l.id === selectedListing)
  const currentPromotion = promotionOptions.find((p) => p.id === selectedPromotion)

  const maxViews = Math.max(...analyticsData.map((d) => d.views))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-amber-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Promote Your Listing</h1>
            <p className="text-sm text-muted-foreground">
              Choose a listing and select a promotion package to get more visibility.
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Step 1: Select Listing */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">1</span>
          Select a Listing to Promote
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleListings.map((listing) => {
            const isSelected = selectedListing === listing.id
            return (
              <Card
                key={listing.id}
                className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary/[0.02]' : ''}`}
                onClick={() => setSelectedListing(isSelected ? null : listing.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary" className="text-[10px]">
                      {listing.category}
                    </Badge>
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px]">
                      {listing.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm leading-snug line-clamp-2 mb-2">{listing.title}</h3>
                  <p className="text-lg font-bold text-primary mb-3">₦{listing.price.toLocaleString()}</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        Views
                      </span>
                      <span className="font-medium text-foreground">{listing.views}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        Inquiries
                      </span>
                      <span className="font-medium text-foreground">{listing.inquiries}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Posted
                      </span>
                      <span>{listing.posted}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <div className={`h-1.5 rounded-full w-full ${isSelected ? 'bg-primary' : 'bg-gray-200'} transition-colors`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Step 2: Select Promotion */}
      {selectedListing && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">2</span>
            Choose a Promotion Package
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {promotionOptions.map((option) => {
              const Icon = option.icon
              const isSelected = selectedPromotion === option.id
              return (
                <Card
                  key={option.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary/[0.02]' : ''}`}
                  onClick={() => setSelectedPromotion(isSelected ? null : option.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${option.color}`}>
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">{option.name}</h3>
                        {option.popular && (
                          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[8px] px-1.5 py-0 mt-0.5">
                            Popular
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{option.description}</p>
                    <div className="mb-3">
                      <span className="text-xl font-bold text-primary">₦{option.price.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">{option.period}</span>
                    </div>
                    <ul className="space-y-1.5 mb-3">
                      {option.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px]">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className={`text-center py-2 px-3 rounded-lg ${option.color} text-xs font-medium`}>
                      <TrendingUp className="h-3 w-3 inline mr-1" />
                      {option.expectedReach}
                    </div>
                    <div className="mt-3 pt-3 border-t">
                      <div className={`h-1.5 rounded-full w-full ${isSelected ? 'bg-primary' : 'bg-gray-200'} transition-colors`} />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      )}

      {/* Payment summary */}
      {selectedListing && selectedPromotion && (
        <Card className="border-primary/30 bg-primary/[0.02]">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-sm mb-1">Payment Summary</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>
                    Listing: <span className="font-medium text-foreground">{currentListing?.title}</span>
                  </p>
                  <p>
                    Package: <span className="font-medium text-foreground">{currentPromotion?.name}</span>
                  </p>
                  <p className="text-lg font-bold text-primary pt-1">
                    Total: ₦{currentPromotion?.price.toLocaleString()}{currentPromotion?.period}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Button className="gap-2" size="lg">
                  <CircleDollarSign className="h-4 w-4" />
                  Pay ₦{currentPromotion?.price.toLocaleString()}
                </Button>
                <p className="text-xs text-muted-foreground text-right">
                  Pay with <span className="font-medium">Paystack</span> or <span className="font-medium">Crypto</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Promotion Analytics */}
      <section>
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold">Promotion Analytics</h2>
          <p className="text-sm text-muted-foreground">
            See how promotion impacts listing performance. Your promoted listings get{' '}
            <span className="font-semibold text-primary">4.2x more views</span> on average.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Views Before & After Promotion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-xs">{item.label}</span>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {item.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {item.inquiries}
                      </span>
                    </div>
                  </div>
                  <div className="h-8 bg-muted rounded-lg overflow-hidden relative">
                    <div
                      className={`h-full ${item.color} rounded-lg transition-all duration-500 flex items-center justify-end pr-2`}
                      style={{ width: `${(item.views / maxViews) * 100}%` }}
                    >
                      <span className="text-[10px] font-bold text-white drop-shadow-sm">
                        {item.views}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="h-5 w-5 text-emerald-700" />
                </div>
                <p className="text-xl font-bold text-emerald-700">4.2x</p>
                <p className="text-xs text-muted-foreground">Avg. view increase</p>
              </div>
              <div className="text-center">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center mx-auto mb-2">
                  <ChartColumnIncreasing className="h-5 w-5 text-amber-700" />
                </div>
                <p className="text-xl font-bold text-amber-700">67%</p>
                <p className="text-xs text-muted-foreground">Faster sales</p>
              </div>
              <div className="text-center">
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center mx-auto mb-2">
                  <Package className="h-5 w-5 text-purple-700" />
                </div>
                <p className="text-xl font-bold text-purple-700">89%</p>
                <p className="text-xs text-muted-foreground">Satisfaction rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* More listings link */}
      <div className="text-center pb-4">
        <p className="text-sm text-muted-foreground mb-2">
          Want to promote more listings?
        </p>
        <Link href="/dashboard/listings">
          <Button variant="outline" className="gap-1.5">
            <ShoppingCart className="h-4 w-4" />
            View All My Listings
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
