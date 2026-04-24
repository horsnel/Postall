'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { LucideIcon } from 'lucide-react';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Search,
  CirclePlus,
  Flame,
  Tag,
  Filter,
  Monitor,
  UtensilsCrossed,
  Rocket,
  PersonStanding,
  Smartphone,
  Palette,
  Trophy,
  Briefcase,
  Music,
  Code,
  Recycle,
  Mic,
  Package,
} from 'lucide-react'

interface EventItem {
  id: string
  title: string
  date: string
  time: string
  location: string
  city: string
  category: string
  price: number
  icon: string
  attendees: number
  featured?: boolean
  organizer?: string
}

const eventIconMap: Record<string, LucideIcon> = {
  Monitor,
  UtensilsCrossed,
  Rocket,
  PersonStanding,
  Smartphone,
  Palette,
  Trophy,
  Briefcase,
  Music,
  Code,
  Recycle,
  Mic,
  Package,
};

const featuredEvents: EventItem[] = [
  { id: 'e1', title: 'Lagos Tech Summit 2026', date: 'Apr 15, 2026', time: '9:00 AM - 5:00 PM', location: 'Eko Convention Centre, Victoria Island', city: 'Lagos', category: 'Tech', price: 5000, icon: 'Monitor', attendees: 2500, featured: true, organizer: 'TechHub Lagos' },
  { id: 'e2', title: 'Lagos Food Festival', date: 'Apr 20-22, 2026', time: '10:00 AM - 8:00 PM', location: 'Landmark Centre, Victoria Island', city: 'Lagos', category: 'Food', price: 0, icon: 'UtensilsCrossed', attendees: 5000, featured: true, organizer: 'Lagos Tourism' },
  { id: 'e3', title: 'Lagos Startup Weekend', date: 'Apr 25-27, 2026', time: '6:00 PM Fri - 9:00 PM Sun', location: 'Civic Centre, Lagos', city: 'Lagos', category: 'Tech', price: 3000, icon: 'Rocket', attendees: 150, featured: true, organizer: 'Startup Nigeria' },
]

const allEvents: EventItem[] = [
  { id: 'e4', title: 'Yoga in the Park', date: 'Every Saturday', time: '7:00 AM', location: 'Freedom Park, Lagos', city: 'Lagos', category: 'Community', price: 0, icon: 'PersonStanding', attendees: 45 },
  { id: 'e5', title: 'Digital Marketing Masterclass', date: 'Apr 12, 2026', time: '10:00 AM - 4:00 PM', location: 'Online (Zoom)', city: 'Lagos', category: 'Workshops', price: 15000, icon: 'Smartphone', attendees: 120 },
  { id: 'e6', title: 'Lagos Art Exhibition', date: 'Apr 18 - May 2, 2026', time: '10:00 AM - 6:00 PM', location: 'Nike Art Gallery, Lekki', city: 'Lagos', category: 'Arts', price: 2000, icon: 'Palette', attendees: 800 },
  { id: 'e7', title: 'Football Tournament', date: 'Apr 19, 2026', time: '8:00 AM - 6:00 PM', location: 'Teslim Balogun Stadium, Surulere', city: 'Lagos', category: 'Sports', price: 0, icon: 'Trophy', attendees: 300 },
  { id: 'e8', title: 'Freelance Business Workshop', date: 'Apr 22, 2026', time: '2:00 PM - 5:00 PM', location: 'Co-Creation Hub, Yaba', city: 'Lagos', category: 'Workshops', price: 10000, icon: 'Briefcase', attendees: 60 },
  { id: 'e9', title: 'Live Music Night', date: 'Every Friday', time: '7:00 PM - 11:00 PM', location: 'The Jazzhole, Ikoyi', city: 'Lagos', category: 'Concerts', price: 5000, icon: 'Music', attendees: 100 },
  { id: 'e10', title: 'Python Coding Bootcamp', date: 'May 1-15, 2026', time: '9:00 AM - 3:00 PM', location: 'AltSchool Africa, Yaba', city: 'Lagos', category: 'Classes', price: 50000, icon: 'Code', attendees: 30 },
  { id: 'e11', title: 'Community Cleanup Drive', date: 'Apr 14, 2026', time: '7:00 AM - 12:00 PM', location: 'Lagos Mainland', city: 'Lagos', category: 'Community', price: 0, icon: 'Recycle', attendees: 200 },
  { id: 'e12', title: 'Afrobeats Concert', date: 'May 3, 2026', time: '6:00 PM - 11:00 PM', location: 'New Africa Shrine', city: 'Lagos', category: 'Concerts', price: 10000, icon: 'Mic', attendees: 2000 },
]

const eventCategories = ['All', 'Meetups', 'Workshops', 'Concerts', 'Sports', 'Tech', 'Arts', 'Food', 'Community', 'Classes']
const dateFilters = ['Any Date', 'Today', 'This Week', 'This Month', 'This Weekend']
const cityOptions = ['All Cities', 'Lagos', 'Abuja', 'Port Harcourt', 'Ibadan']

const categoryColors: Record<string, string> = {
  Tech: 'bg-cyan-100 text-cyan-700',
  Food: 'bg-amber-100 text-amber-700',
  Workshops: 'bg-violet-100 text-violet-700',
  Arts: 'bg-pink-100 text-pink-700',
  Sports: 'bg-emerald-100 text-emerald-700',
  Community: 'bg-teal-100 text-teal-700',
  Concerts: 'bg-rose-100 text-rose-700',
  Classes: 'bg-indigo-100 text-indigo-700',
  Meetups: 'bg-orange-100 text-orange-700',
}

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('All Cities')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDate, setSelectedDate] = useState('Any Date')
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all')

  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      const matchesSearch = !searchQuery || event.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCity = selectedCity === 'All Cities' || event.city === selectedCity
      const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory
      const matchesPrice =
        priceFilter === 'all' ||
        (priceFilter === 'free' && event.price === 0) ||
        (priceFilter === 'paid' && event.price > 0)
      return matchesSearch && matchesCity && matchesCategory && matchesPrice
    })
  }, [searchQuery, selectedCity, selectedCategory, priceFilter])

  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-emerald-50/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.1),rgba(0,0,0,0))]" />
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl relative">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10 gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Local Events
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Events Near <span className="text-primary">You</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
              Discover local events, meetups, workshops, and activities happening in your city and beyond.
            </p>
            <div className="flex items-center justify-center gap-3 mt-8">
              <Link href="/events/create">
                <Button size="lg" className="gap-2 text-base">
                  <CirclePlus className="h-5 w-5" />
                  Post an Event
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-16 z-30 bg-background border-b shadow-sm">
        <div className="container mx-auto px-4 py-3 max-w-5xl">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-[130px] h-9">
                  <Filter className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cityOptions.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {eventCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger className="w-[150px] h-9 hidden md:flex">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateFilters.map((date) => (
                    <SelectItem key={date} value={date}>{date}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center rounded-md border bg-muted/50 p-0.5">
                <button
                  onClick={() => setPriceFilter('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${priceFilter === 'all' ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setPriceFilter('free')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${priceFilter === 'free' ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'hover:bg-background/50'}`}
                >
                  Free
                </button>
                <button
                  onClick={() => setPriceFilter('paid')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${priceFilter === 'paid' ? 'bg-amber-100 text-amber-700 shadow-sm' : 'hover:bg-background/50'}`}
                >
                  Paid
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 max-w-5xl flex-1">
        {/* Featured Events */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="h-5 w-5 text-amber-500" />
            <h2 className="text-2xl font-bold">Featured Events</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="h-48 bg-gradient-to-br from-primary/5 via-primary/10 to-emerald-50 flex flex-col items-center justify-center relative">
                  {(() => { const Ic = eventIconMap[event.icon] || Package; return <Ic className="h-14 w-14 text-primary/40 mb-2" />; })()}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <Badge className="bg-amber-500 text-white hover:bg-amber-500 gap-1">
                      <Flame className="h-3 w-3" />
                      Featured
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className={categoryColors[event.category] || 'bg-muted text-muted-foreground'}>
                      {event.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="h-3.5 w-3.5" />
                    {event.date}
                    <span className="mx-1">·</span>
                    <Clock className="h-3.5 w-3.5" />
                    {event.time}
                  </div>
                  <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  {event.organizer && (
                    <p className="text-xs text-muted-foreground mt-1.5">
                      by <span className="font-medium text-foreground">{event.organizer}</span>
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">{event.attendees.toLocaleString()}</span>
                        <span className="text-muted-foreground text-xs">attending</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {event.price === 0 ? (
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Free</Badge>
                      ) : (
                        <span className="font-bold text-primary">₦{event.price.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  <Button className="w-full mt-4 gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Attend
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Events Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Events</h2>
            <span className="text-sm text-muted-foreground">
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {filteredEvents.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-1">No events found</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Try adjusting your filters or search query to discover more events.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCity('All Cities')
                    setSelectedCategory('All')
                    setSelectedDate('Any Date')
                    setPriceFilter('all')
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow group">
                  <CardContent className="p-0">
                    <div className="h-32 bg-gradient-to-br from-muted/50 to-muted flex flex-col items-center justify-center relative">
                      {(() => { const Ic = eventIconMap[event.icon] || Package; return <Ic className="h-12 w-12 text-muted-foreground/50" />; })()}
                      <div className="absolute top-2.5 right-2.5">
                        <Badge className={`text-[10px] ${categoryColors[event.category] || 'bg-muted text-muted-foreground'}`}>
                          {event.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                        <Calendar className="h-3 w-3" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                        <Clock className="h-3 w-3" />
                        {event.time}
                      </div>
                      <h3 className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{event.attendees.toLocaleString()}</span>
                        </div>
                        <div>
                          {event.price === 0 ? (
                            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px]">Free</Badge>
                          ) : (
                            <span className="text-sm font-bold text-primary">₦{event.price.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-3 gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        Attend
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>

    </div>
  )
}
