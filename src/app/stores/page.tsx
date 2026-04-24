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
import {
  Star,
  MapPin,
  Search,
  Shield,
  Award,
  Store,
  Filter,
  ShoppingCart,
  ArrowRight,
  Plus,
  Zap,
  Users,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react'

interface StoreItem {
  id: string
  name: string
  username: string
  description: string
  city: string
  rating: number
  reviews: number
  listings: number
  verified: boolean
  topSeller: boolean
  logo: string
  categories: string[]
  logoColor: string
  featured?: boolean
  sales?: number
  followers?: number
}

const stores: StoreItem[] = [
  { id: 'st1', name: 'TechDeals Official', username: 'techdeals', description: 'Your one-stop shop for electronics and gadgets. Best prices guaranteed.', city: 'Lagos', rating: 4.8, reviews: 312, listings: 45, verified: true, topSeller: true, logo: 'TD', categories: ['Electronics', 'Gadgets'], logoColor: 'from-emerald-500 to-teal-600', featured: true, sales: 89, followers: 1240 },
  { id: 'st2', name: 'PropertyPro NG', username: 'propertypro_ng', description: 'Lagos\' most trusted property agency. Over 200 properties listed.', city: 'Lagos', rating: 4.9, reviews: 256, listings: 189, verified: true, topSeller: true, logo: 'PP', categories: ['Housing', 'Real Estate'], logoColor: 'from-cyan-500 to-blue-600', featured: true, sales: 67, followers: 890 },
  { id: 'st3', name: 'QuickFix Services', username: 'quickfix_ng', description: 'Fast and reliable home services. Plumbing, electrical, cleaning and more.', city: 'Lagos', rating: 4.8, reviews: 201, listings: 12, verified: true, topSeller: true, logo: 'QF', categories: ['Services'], logoColor: 'from-amber-500 to-orange-600', featured: true, sales: 134, followers: 560 },
  { id: 'st4', name: 'Fashion Forward', username: 'fashion_forward', description: 'Trendy fashion for men and women. Affordable prices, premium quality.', city: 'Lagos', rating: 4.6, reviews: 145, listings: 67, verified: true, topSeller: false, logo: 'FF', categories: ['Fashion', 'Accessories'], logoColor: 'from-pink-500 to-rose-600' },
  { id: 'st5', name: 'Lagos Auto Hub', username: 'lagos_auto', description: 'Premium vehicles at competitive prices. Inspected and certified.', city: 'Lagos', rating: 4.7, reviews: 189, listings: 28, verified: true, topSeller: true, logo: 'LA', categories: ['Vehicles'], logoColor: 'from-violet-500 to-purple-600' },
  { id: 'st6', name: 'HomeComfort', username: 'homecomfort_ng', description: 'Furniture and home decor. Making houses feel like homes since 2019.', city: 'Lagos', rating: 4.5, reviews: 98, listings: 34, verified: true, topSeller: false, logo: 'HC', categories: ['Furniture', 'Home'], logoColor: 'from-teal-500 to-emerald-600' },
  { id: 'st7', name: 'GadgetWorld NG', username: 'gadgetworld_ng', description: 'Nigeria\'s favorite electronics store. Phones, laptops, and accessories.', city: 'Lagos', rating: 4.7, reviews: 167, listings: 52, verified: true, topSeller: false, logo: 'GW', categories: ['Electronics'], logoColor: 'from-indigo-500 to-blue-600' },
  { id: 'st8', name: 'Blessing Homes', username: 'blessing_homes', description: 'Abuja\'s premier real estate agent. Find your dream home today.', city: 'Abuja', rating: 4.9, reviews: 67, listings: 23, verified: true, topSeller: false, logo: 'BH', categories: ['Housing'], logoColor: 'from-emerald-600 to-teal-700' },
  { id: 'st9', name: 'SkillUp Academy', username: 'skillup_academy', description: 'Online and offline tech training. Python, Web Dev, Data Science.', city: 'Lagos', rating: 4.8, reviews: 134, listings: 8, verified: true, topSeller: false, logo: 'SA', categories: ['Education', 'Services'], logoColor: 'from-cyan-600 to-teal-600' },
]

const categoryFilters = ['All', 'Electronics', 'Fashion', 'Home', 'Services', 'Vehicles']
const cityOptions = ['All Cities', 'Lagos', 'Abuja', 'Port Harcourt', 'Ibadan']
const ratingOptions = ['Any Rating', '4+ Stars', '3+ Stars']
const sortOptions = ['Popular', 'Newest', 'Rating', 'Most Listings']

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= Math.floor(rating)
              ? 'fill-amber-400 text-amber-400'
              : star - 0.5 <= rating
              ? 'fill-amber-200 text-amber-400'
              : 'text-gray-200'
          }`}
        />
      ))}
    </div>
  )
}

export default function StoresPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedCity, setSelectedCity] = useState('All Cities')
  const [selectedRating, setSelectedRating] = useState('Any Rating')
  const [sortBy, setSortBy] = useState('Popular')

  const featuredStores = stores.filter(s => s.featured)

  const filteredStores = useMemo(() => {
    let result = [...stores]

    if (searchQuery) {
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.categories.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    if (selectedCity !== 'All Cities') {
      result = result.filter((s) => s.city === selectedCity)
    }
    if (selectedCategory !== 'All') {
      result = result.filter((s) => {
        const storeCats = s.categories.map(c => c.toLowerCase())
        const filterCat = selectedCategory.toLowerCase()
        return storeCats.some(c => c.includes(filterCat))
      })
    }
    if (selectedRating === '4+ Stars') {
      result = result.filter((s) => s.rating >= 4)
    } else if (selectedRating === '3+ Stars') {
      result = result.filter((s) => s.rating >= 3)
    }

    switch (sortBy) {
      case 'Newest':
        result.reverse()
        break
      case 'Rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'Most Listings':
        result.sort((a, b) => b.listings - a.listings)
        break
      case 'Popular':
      default:
        result.sort((a, b) => b.reviews - a.reviews)
        break
    }

    return result
  }, [searchQuery, selectedCity, selectedCategory, selectedRating, sortBy])

  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10 gap-1.5">
              <Store className="h-3.5 w-3.5" />
              Marketplace
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-[#374151]">
              Browse <span className="text-[#0D8A5C]">Stores</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
              Discover trusted sellers and businesses on PostAll. Shop with confidence from verified stores.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Stores Section */}
      <section className="bg-background border-b">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex items-center gap-2 mb-5">
            <Zap className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-bold">Featured Stores</h2>
            <Badge variant="secondary" className="text-xs">{featuredStores.length} stores</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredStores.map((store) => (
              <Link key={store.id} href={`/store/${store.username}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group h-full">
                  {/* Store banner */}
                  <div className={`h-32 bg-gradient-to-r ${store.logoColor} relative`}>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
                    <Badge className="absolute top-3 left-3 bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                    <div className="absolute -bottom-8 left-5">
                      <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${store.logoColor} flex items-center justify-center border-4 border-background shadow-md`}>
                        <span className="text-white font-bold text-lg">{store.logo}</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5 pt-12">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-base group-hover:text-primary transition-colors line-clamp-1">
                        {store.name}
                      </h3>
                      {store.verified && (
                        <Shield className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                      {store.description}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <StarRating rating={store.rating} />
                      <span className="text-xs font-semibold">{store.rating}</span>
                      <span className="text-xs text-muted-foreground">({store.reviews})</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {store.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <ShoppingCart className="h-3 w-3" />
                        {store.listings} listings
                      </span>
                      {store.followers && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {store.followers.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {store.categories.map((cat) => (
                        <Badge key={cat} variant="secondary" className="text-[10px] px-1.5 py-0">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                    <Button className="w-full gap-1.5 text-sm" size="sm">
                      Visit Store
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
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
                placeholder="Search stores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[130px] h-9">
                  <Filter className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryFilters.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-[120px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cityOptions.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedRating} onValueChange={setSelectedRating}>
                <SelectTrigger className="w-[110px] h-9 hidden md:flex">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ratingOptions.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[130px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 max-w-5xl flex-1">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-muted-foreground">
            {filteredStores.length} store{filteredStores.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {filteredStores.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Store className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-1">No stores found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Try adjusting your filters or search to find what you&apos;re looking for.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('All')
                  setSelectedCity('All Cities')
                  setSelectedRating('Any Rating')
                  setSortBy('Popular')
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStores.map((store) => (
              <Link key={store.id} href={`/store/${store.username}`}>
                <Card className="overflow-hidden hover:shadow-md transition-shadow group h-full cursor-pointer">
                  <CardContent className="p-0">
                    {/* Store header with logo */}
                    <div className="p-5 pb-4">
                      <div className="flex items-start gap-3">
                        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${store.logoColor} flex items-center justify-center shrink-0 shadow-sm`}>
                          <span className="text-white font-bold text-sm">{store.logo}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-bold text-sm group-hover:text-primary transition-colors line-clamp-1">
                              {store.name}
                            </h3>
                            {store.verified && (
                              <Shield className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {store.topSeller && (
                              <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 text-[9px] px-1.5 py-0 gap-0.5">
                                <Award className="h-2.5 w-2.5" />
                                Top Seller
                              </Badge>
                            )}
                            {store.verified && (
                              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[9px] px-1.5 py-0">
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                        {store.description}
                      </p>

                      {/* Rating and stats */}
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5">
                          <StarRating rating={store.rating} />
                          <span className="text-xs font-semibold">{store.rating}</span>
                          <span className="text-xs text-muted-foreground">({store.reviews})</span>
                        </div>
                      </div>

                      {/* City and listings */}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {store.city}
                        </span>
                        <span className="flex items-center gap-1">
                          <ShoppingCart className="h-3 w-3" />
                          {store.listings} listings
                        </span>
                      </div>

                      {/* Category tags */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {store.categories.map((cat) => (
                          <Badge key={cat} variant="secondary" className="text-[10px] px-1.5 py-0">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Visit Store button */}
                    <div className="px-5 pb-4 pt-0">
                      <Button variant="outline" size="sm" className="w-full gap-1.5">
                        Visit Store
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Create Your Store CTA */}
        <Card className="mt-10 overflow-hidden border-[#E5E7EB] shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div className="bg-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="h-14 w-14 rounded-2xl bg-[#F3F4F6] flex items-center justify-center shrink-0">
                <Store className="h-7 w-7 text-[#0D8A5C]" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-[#374151]">Create Your Own Store</h3>
                <p className="text-[#9CA3AF] mt-1 text-sm">
                  Start selling on PostAll today. Get your own branded storefront, reach thousands of buyers, and grow your business.
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-3 justify-center sm:justify-start">
                  <span className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Free to start
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Escrow protection
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Analytics dashboard
                  </span>
                </div>
              </div>
              <Link href="/sell-item">
                <Button size="lg" className="bg-[#0D8A5C] hover:bg-[#086B43] text-white shadow-sm gap-2 font-semibold shrink-0">
                  <Plus className="h-4 w-4" />
                  Open Your Store
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

    </div>
  )
}
