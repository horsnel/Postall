'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CalendarCheck,
  SlidersHorizontal,
  Star,
  DollarSign,
  ArrowRight,
  Clock,
  MapPin,
  ThumbsUp,
  Quote,
  Briefcase,
  Sparkles,
  Monitor,
  Home,
} from 'lucide-react'

const stats = [
  { label: 'Bookings', value: '12', icon: CalendarCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Active Jobs', value: '3', icon: Briefcase, color: 'text-teal-600', bg: 'bg-teal-50' },
  { label: 'Reviews', value: '28', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Revenue', value: '₦380,000', icon: DollarSign, color: 'text-cyan-600', bg: 'bg-cyan-50' },
]

const todaySchedule = [
  { id: '1', time: '9:00 AM', service: 'Plumbing Repair', client: 'Mr. Adesanya', location: 'Lekki, Lagos', status: 'confirmed' },
  { id: '2', time: '1:00 PM', service: 'AC Maintenance', client: 'Mrs. Okafor', location: 'Ikoyi, Lagos', status: 'confirmed' },
  { id: '3', time: '4:30 PM', service: 'Electrical Wiring', client: 'Engr. Bello', location: 'Yaba, Lagos', status: 'pending' },
]

const serviceCategories = [
  { label: 'Plumbing', icon: SlidersHorizontal, color: 'bg-emerald-50 text-emerald-600', href: '/browse/services' },
  { label: 'Electrical', icon: Sparkles, color: 'bg-teal-50 text-teal-600', href: '/browse/services' },
  { label: 'Cleaning', icon: Home, color: 'bg-cyan-50 text-cyan-600', href: '/browse/services' },
  { label: 'Tech Repair', icon: Monitor, color: 'bg-amber-50 text-amber-600', href: '/browse/services' },
]

const customerReviews = [
  {
    id: '1',
    name: 'Blessing A.',
    initials: 'BA',
    service: 'Plumbing Repair',
    rating: 5,
    text: 'Fixed the leaking pipe in under an hour. Very professional and clean!',
    time: '3 days ago',
  },
  {
    id: '2',
    name: 'Kunle M.',
    initials: 'KM',
    service: 'AC Maintenance',
    rating: 5,
    text: 'My AC works like new. Honest pricing and excellent service.',
    time: '1 week ago',
  },
]

export function ProviderHome() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Service Provider Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage bookings, services, and grow your client base.</p>
        </div>
        <Link href="/dashboard/listings">
          <Button className="gap-1.5">
            <SlidersHorizontal className="h-4 w-4" />
            Add Service
          </Button>
        </Link>
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

      {/* Service Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {serviceCategories.map((cat) => {
          const Icon = cat.icon
          return (
            <Link key={cat.label} href={cat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${cat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">{cat.label}</span>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-teal-500" />
              Today&apos;s Schedule
            </CardTitle>
            <Link href="/dashboard/tasks">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaySchedule.map((slot) => (
                <div key={slot.id} className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                  <div className="text-center shrink-0">
                    <p className="text-sm font-bold text-emerald-600">{slot.time}</p>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] mt-1 ${slot.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
                    >
                      {slot.status}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{slot.service}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Client: {slot.client} &middot; <MapPin className="inline h-3 w-3" /> {slot.location}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Reviews */}
        <Card className="border-2 border-amber-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-amber-500" />
              Customer Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerReviews.map((review) => (
                <div key={review.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                      {review.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{review.name}</p>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">&ldquo;{review.text}&rdquo;</p>
                  <p className="text-[10px] text-muted-foreground">{review.service} &middot; {review.time}</p>
                </div>
              ))}
            </div>
            <Link href="/reviews" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full">See All Reviews</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
