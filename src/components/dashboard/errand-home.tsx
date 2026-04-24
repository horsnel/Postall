'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ClipboardList,
  CheckCircle2,
  Star,
  Zap,
  DollarSign,
  ArrowRight,
  MapPin,
  Clock,
  Timer,
  Compass,
  FastForward,
  Package,
} from 'lucide-react'

const stats = [
  { label: 'Available Tasks', value: '24', icon: ClipboardList, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Active Tasks', value: '2', icon: Timer, color: 'text-teal-600', bg: 'bg-teal-50' },
  { label: 'Completed', value: '47', icon: CheckCircle2, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Rating', value: '4.9', icon: Star, color: 'text-cyan-600', bg: 'bg-cyan-50' },
]

const nearbyTasks = [
  { id: '1', title: 'Pick up package from Ikeja Mall', location: 'Ikeja, Lagos', budget: '₦5,000', urgency: 'normal', distance: '2.3 km' },
  { id: '2', title: 'Deliver documents to Victoria Island', location: 'VI, Lagos', budget: '₦8,000', urgency: 'high', distance: '5.1 km' },
  { id: '3', title: 'Grocery shopping for elderly client', location: 'Lekki, Lagos', budget: '₦6,500', urgency: 'normal', distance: '1.8 km' },
  { id: '4', title: 'Pick up dry cleaning', location: 'Yaba, Lagos', budget: '₦3,000', urgency: 'low', distance: '3.4 km' },
]

const urgencyColors: Record<string, string> = {
  low: 'bg-emerald-100 text-emerald-700',
  normal: 'bg-muted text-muted-foreground',
  high: 'bg-amber-100 text-amber-700',
  urgent: 'bg-rose-100 text-rose-700',
}

export function ErrandHome() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Errand Runner Dashboard</h1>
          <p className="text-muted-foreground mt-1">Find tasks near you, complete errands, and earn money.</p>
        </div>
        <Link href="/find-work">
          <Button className="gap-1.5">
            <Compass className="h-4 w-4" />
            Find Tasks
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
                <p className="text-2xl font-bold mt-3 flex items-center gap-1">
                  {stat.value}
                  {stat.label === 'Rating' && <Star className="h-4 w-4 fill-amber-400 text-amber-400" />}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Near You */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Compass className="h-4 w-4 text-teal-500" />
              Tasks Near You
            </CardTitle>
            <Link href="/find-work">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {nearbyTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-accent transition-colors"
                >
                  <div className="h-11 w-11 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                    <Package className="h-5 w-5 text-teal-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{task.location}</span>
                      <span className="flex items-center gap-1 text-teal-600"><Compass className="h-3 w-3" />{task.distance}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-2">
                    <div>
                      <p className="text-sm font-bold text-emerald-600">{task.budget}</p>
                      <Badge variant="secondary" className={`text-[10px] ${urgencyColors[task.urgency] || ''}`}>
                        {task.urgency}
                      </Badge>
                    </div>
                    <Button size="sm" className="gap-1 shrink-0">
                      <FastForward className="h-3 w-3" />
                      Accept
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Earnings This Week */}
        <div className="space-y-4">
          <Card className="border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                Earnings This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-emerald-600">₦45,000</p>
              <div className="flex items-center gap-1 mt-1 text-sm text-emerald-600">
                <Zap className="h-3.5 w-3.5" />
                <span>+12% from last week</span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tasks completed</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Avg per task</span>
                  <span className="font-medium">₦5,625</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Best task</span>
                  <span className="font-medium text-emerald-600">₦12,000</span>
                </div>
              </div>
              <Link href="/dashboard/wallet" className="block mt-4">
                <Button variant="outline" size="sm" className="w-full">View Wallet</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                Active Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: 'Deliver documents', status: 'In progress', time: 'Due in 2 hours' },
                  { title: 'Grocery pickup', status: 'Picked up', time: 'Due in 4 hours' },
                ].map((task, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Timer className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.status} &middot; {task.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
