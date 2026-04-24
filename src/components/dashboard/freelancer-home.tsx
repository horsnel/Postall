'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { sampleTasks } from '@/lib/constants'
import {
  ClipboardList,
  Send,
  DollarSign,
  Star,
  ArrowRight,
  Briefcase,
  MapPin,
  Users,
  Quote,
  ThumbsUp,
  FolderOpen,
  Sparkles,
} from 'lucide-react'

const stats = [
  { label: 'Active Gigs', value: '3', icon: ClipboardList, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Applications Sent', value: '8', icon: Send, color: 'text-teal-600', bg: 'bg-teal-50' },
  { label: 'Earnings', value: '₦185,000', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Rating', value: '4.8', icon: Star, color: 'text-cyan-600', bg: 'bg-cyan-50' },
]

const reviews = [
  {
    id: '1',
    name: 'Emeka O.',
    initials: 'EO',
    task: 'Website Redesign',
    rating: 5,
    text: 'Absolutely brilliant work! Delivered ahead of schedule and exceeded expectations.',
    time: '2 days ago',
  },
  {
    id: '2',
    name: 'Amina K.',
    initials: 'AK',
    task: 'Logo Design',
    rating: 5,
    text: 'Creative, professional, and very responsive. Will definitely hire again.',
    time: '1 week ago',
  },
]

const categoryColors: Record<string, string> = {
  gigs: 'bg-emerald-100 text-emerald-700',
  services: 'bg-teal-100 text-teal-700',
  jobs: 'bg-cyan-100 text-cyan-700',
  'for-sale': 'bg-amber-100 text-amber-700',
  housing: 'bg-orange-100 text-orange-700',
  community: 'bg-rose-100 text-rose-700',
}

export function FreelancerHome() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Freelancer Dashboard</h1>
          <p className="text-muted-foreground mt-1">Find work, manage gigs, and grow your freelance career.</p>
        </div>
        <Link href="/find-work">
          <Button className="gap-1.5">
            <Sparkles className="h-4 w-4" />
            Find Work
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
        {/* Recommended Tasks */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Recommended Tasks</CardTitle>
            <Link href="/find-work">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                Browse all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {sampleTasks.slice(0, 3).map((task) => (
                <Link
                  key={task.id}
                  href={`/task/${task.id}`}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-accent transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <Badge variant="secondary" className={`text-[10px] ${categoryColors[task.category] || ''}`}>
                        {task.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{task.city}</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{task.applicants} applicants</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-emerald-600">
                      ₦{task.budget.toLocaleString()}
                    </p>
                    <Button variant="ghost" size="sm" className="text-xs mt-0.5">Apply</Button>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skills & Portfolio */}
        <div className="space-y-4">
          <Card className="border-2 border-teal-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-teal-600" />
                Skills & Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {['Web Design', 'React', 'Figma', 'Node.js'].map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-teal-50 text-teal-700">{skill}</Badge>
                ))}
              </div>
              <Link href="/dashboard/profile">
                <Button variant="outline" size="sm" className="w-full gap-1.5">
                  <FolderOpen className="h-3.5 w-3.5" />
                  Edit Portfolio
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-amber-500" />
                Recent Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews.map((review) => (
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
                    <p className="text-xs text-muted-foreground line-clamp-2">"{review.text}"</p>
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
