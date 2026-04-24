'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { sampleTasks, sampleListings } from '@/lib/constants'
import {
  Package,
  Eye,
  MessageCircle,
  DollarSign,
  CirclePlus,
  Heart,
  Store,
  Megaphone,
  TrendingUp,
  ArrowRight,
  Lightbulb,
  MapPin,
  Star,
  Clock,
} from 'lucide-react'

const stats = [
  { label: 'Active Listings', value: '12', icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Total Views', value: '1,245', icon: Eye, color: 'text-teal-600', bg: 'bg-teal-50' },
  { label: 'Messages', value: '5', icon: MessageCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Revenue', value: '₦245,000', icon: DollarSign, color: 'text-cyan-600', bg: 'bg-cyan-50' },
]

const quickActions = [
  { label: 'Post Item', icon: CirclePlus, href: '/sell-item', color: 'bg-emerald-50 text-emerald-600' },
  { label: 'View Favorites', icon: Heart, href: '/favorites', color: 'bg-rose-50 text-rose-600' },
  { label: 'My Store', icon: Store, href: '/dashboard/listings', color: 'bg-amber-50 text-amber-600' },
  { label: 'Promote Listing', icon: Megaphone, href: '/dashboard/listings', color: 'bg-teal-50 text-teal-600' },
]

const sellerTips = [
  'Add clear, well-lit photos to get 3x more views',
  'Respond to messages within 1 hour for better ratings',
  'Price competitively — check Market Insights for averages',
]

export function SellerHome() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Seller Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your listings, track sales, and grow your store.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className={`rounded-lg p-2 w-fit ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold mt-3">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Link key={action.label} href={action.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${action.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Recent Listings</CardTitle>
            <Link href="/dashboard/listings">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {sampleListings.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  href={`/item/${item.id}`}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-accent transition-colors"
                >
                  <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{item.city}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{item.postedAgo}</span>
                      <Badge variant="secondary" className="text-[10px] bg-emerald-100 text-emerald-700">{item.condition}</Badge>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-emerald-600 shrink-0">₦{item.price.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              Tips for Sellers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sellerTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                    {i + 1}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/tools/market-insights">
                <Button variant="outline" size="sm" className="w-full gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" />
                  View Market Insights
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
