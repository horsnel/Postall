'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Home,
  MessageCircle,
  Calendar,
  DollarSign,
  ArrowRight,
  MapPin,
  Eye,
  TrendingUp,
  Building2,
  Users,
  Clock,
  ChevronRight,
} from 'lucide-react'

const stats = [
  { label: 'Active Properties', value: '8', icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Inquiries', value: '15', icon: MessageCircle, color: 'text-teal-600', bg: 'bg-teal-50' },
  { label: 'Viewings Scheduled', value: '3', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Commission', value: '₦520,000', icon: DollarSign, color: 'text-cyan-600', bg: 'bg-cyan-50' },
]

const properties = [
  { id: '1', title: '3 Bedroom Flat - Lekki Phase 1', type: 'Apartment', price: '₦2.5M/yr', views: 45, inquiries: 8, status: 'active' },
  { id: '2', title: '4 Bedroom Duplex - Ikoyi', type: 'Duplex', price: '₦8M/yr', views: 120, inquiries: 15, status: 'active' },
  { id: '3', title: 'Office Space - Victoria Island', type: 'Commercial', price: '₦4.5M/yr', views: 67, inquiries: 5, status: 'active' },
]

const upcomingViewings = [
  { id: '1', property: '3 Bedroom Flat - Lekki Phase 1', client: 'Adebayo S.', date: 'Today, 2:00 PM' },
  { id: '2', property: '4 Bedroom Duplex - Ikoyi', client: 'Chinedu O.', date: 'Tomorrow, 10:00 AM' },
  { id: '3', property: 'Office Space - Victoria Island', client: 'Fatima M.', date: 'Wed, 3:30 PM' },
]

export function AgentHome() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Real Estate Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage properties, schedule viewings, and track commissions.</p>
        </div>
        <Link href="/dashboard/listings">
          <Button className="gap-1.5">
            <Building2 className="h-4 w-4" />
            Add Property
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Performance */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Property Performance</CardTitle>
            <Link href="/dashboard/listings">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {properties.map((prop) => (
                <Link
                  key={prop.id}
                  href={`/dashboard/listings`}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-accent transition-colors"
                >
                  <div className="h-12 w-12 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                    <Home className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{prop.title}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-[10px] bg-orange-100 text-orange-700">{prop.type}</Badge>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{prop.views}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" />{prop.inquiries}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-emerald-600">{prop.price}</p>
                    <Badge variant="secondary" className="text-[10px] bg-emerald-100 text-emerald-700 mt-0.5">Active</Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Viewings */}
        <Card className="border-2 border-amber-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-500" />
              Upcoming Viewings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingViewings.map((viewing) => (
                <div key={viewing.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="h-9 w-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{viewing.property}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      with {viewing.client} &middot; {viewing.date}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/tools/market-insights">
                <Button variant="outline" size="sm" className="w-full gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Market Insights
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
