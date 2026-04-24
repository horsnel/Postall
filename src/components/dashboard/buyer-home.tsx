'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ClipboardList,
  Timer,
  Wallet,
  PiggyBank,
  ArrowRight,
  Package,
  MapPin,
  Users,
  Heart,
  Zap,
  Clock,
  DollarSign,
  UserCheck,
  Search,
  Sparkles,
} from 'lucide-react'

const stats = [
  { label: 'My Tasks', value: '5', icon: ClipboardList, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'In Progress', value: '2', icon: Timer, color: 'text-teal-600', bg: 'bg-teal-50' },
  { label: 'Escrow Balance', value: '₦150,000', icon: Wallet, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Saved', value: '₦25,000', icon: PiggyBank, color: 'text-cyan-600', bg: 'bg-cyan-50' },
]

const myTasks = [
  { id: '1', title: 'Plumbing Repair - Kitchen Sink', budget: '₦40,000', status: 'in_progress', applicants: 3, postedAgo: '1d ago' },
  { id: '2', title: 'Website Redesign for Restaurant', budget: '₦150,000', status: 'open', applicants: 8, postedAgo: '3h ago' },
  { id: '3', title: 'Move Furniture to New Apartment', budget: '₦25,000', status: 'completed', applicants: 3, postedAgo: '5d ago' },
]

const savedItems = [
  { id: '1', title: 'iPhone 14 Pro Max', price: '₦650,000', location: 'Lagos' },
  { id: '2', title: 'MacBook Air M2', price: '₦800,000', location: 'Lagos' },
  { id: '3', title: 'Samsung 55" Smart TV', price: '₦350,000', location: 'Abuja' },
]

const statusColors: Record<string, string> = {
  open: 'bg-emerald-100 text-emerald-700',
  in_progress: 'bg-amber-100 text-amber-700',
  completed: 'bg-teal-100 text-teal-700',
  cancelled: 'bg-rose-100 text-rose-700',
}

export function BuyerHome() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Buyer Dashboard</h1>
          <p className="text-muted-foreground mt-1">Post tasks, hire talent, and manage your projects.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/post-task">
            <Button className="gap-1.5">
              <ClipboardList className="h-4 w-4" />
              Post Task
            </Button>
          </Link>
        </div>
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

      {/* People Interested Notification */}
      <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50">
        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold">12 people are interested in your &ldquo;Plumbing Repair&rdquo; task</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Review applicants and pick the best person for the job</p>
          </div>
          <Link href="/dashboard/pick-worker">
            <Button size="sm" className="gap-1.5 shrink-0">
              <Sparkles className="h-3.5 w-3.5" />
              Swipe to Pick
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Posted Tasks */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">My Posted Tasks</CardTitle>
            <Link href="/post-task">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                Post new <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {myTasks.map((task) => (
                <Link
                  key={task.id}
                  href="/dashboard/tasks"
                  className="flex items-center gap-4 px-4 py-3 hover:bg-accent transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <Badge variant="secondary" className={`text-[10px] ${statusColors[task.status] || ''}`}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{task.postedAgo}</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{task.applicants} applicants</span>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-emerald-600 shrink-0">{task.budget}</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Saved Items */}
        <Card>
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Heart className="h-4 w-4 text-rose-500" />
              Saved Items
            </CardTitle>
            <Link href="/favorites">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />{item.location}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-emerald-600 shrink-0">{item.price}</p>
                </div>
              ))}
            </div>
            <Link href="/dashboard/pick-worker" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full gap-1.5">
                <UserCheck className="h-3.5 w-3.5" />
                Pick a Worker
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
