'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import {
  MessageCircle,
  Plus,
  Search,
  Users,
  Lightbulb,
  Trophy,
  Flame,
  Pin,
  Eye,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

interface ForumCategory {
  id: string
  name: string
  description: string
  posts: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  latestPost: { title: string; author: string; time: string }
}

interface Discussion {
  id: string
  title: string
  category: string
  author: string
  replies: number
  views: number
  time: string
  hot: boolean
  pinned?: boolean
}

const categories: ForumCategory[] = [
  {
    id: 'general',
    name: 'General Discussion',
    description: 'Talk about anything related to PostAll and marketplace life.',
    posts: '1.2K',
    icon: MessageCircle,
    color: 'bg-blue-100 text-blue-700',
    latestPost: { title: 'How I received my first PostAll payment', author: 'David O.', time: '5d ago' },
  },
  {
    id: 'tips',
    name: 'Tips & Tricks',
    description: 'Share your marketplace tips and best practices with the community.',
    posts: '450',
    icon: Lightbulb,
    color: 'bg-amber-100 text-amber-700',
    latestPost: { title: 'Best practices for selling electronics on PostAll', author: 'Emeka O.', time: '2h ago' },
  },
  {
    id: 'success',
    name: 'Success Stories',
    description: 'Share your wins and celebrate milestones with fellow users.',
    posts: '320',
    icon: Trophy,
    color: 'bg-emerald-100 text-emerald-700',
    latestPost: { title: 'How I earned ₦500K in my first month as a freelancer', author: 'Amina K.', time: '5h ago' },
  },
  {
    id: 'feedback',
    name: 'Feedback & Suggestions',
    description: 'Help us improve PostAll. Share your ideas and report issues.',
    posts: '180',
    icon: MessageCircle,
    color: 'bg-purple-100 text-purple-700',
    latestPost: { title: 'Feature request: Dark mode scheduling', author: 'Fatima A.', time: '2d ago' },
  },
]

const discussions: Discussion[] = [
  { id: 'd1', title: 'Best practices for selling electronics on PostAll', category: 'Tips & Tricks', author: 'Emeka O.', replies: 23, views: 450, time: '2h ago', hot: true },
  { id: 'd2', title: 'How I earned ₦500K in my first month as a freelancer', category: 'Success Stories', author: 'Amina K.', replies: 45, views: 1200, time: '5h ago', hot: true },
  { id: 'd3', title: 'Safety tips: Meeting buyers for the first time', category: 'Tips & Tricks', author: 'Kwame M.', replies: 18, views: 890, time: '1d ago', hot: false },
  { id: 'd4', title: 'Feature request: Dark mode scheduling', category: 'Feedback', author: 'Fatima A.', replies: 8, views: 320, time: '2d ago', hot: false },
  { id: 'd5', title: 'My experience using the escrow system', category: 'Success Stories', author: 'Chinedu E.', replies: 32, views: 980, time: '3d ago', hot: false },
  { id: 'd6', title: 'How to get verified quickly on PostAll', category: 'Tips & Tricks', author: 'Zainab M.', replies: 12, views: 567, time: '4d ago', hot: false },
  { id: 'd7', title: 'Introduce yourself! New members thread', category: 'General', author: 'PostAll Team', replies: 156, views: 2300, time: '1w ago', hot: false, pinned: true },
  { id: 'd8', title: 'My first withdrawal experience', category: 'General', author: 'David O.', replies: 28, views: 780, time: '5d ago', hot: false },
]

const categoryBadgeColors: Record<string, string> = {
  'Tips & Tricks': 'bg-amber-100 text-amber-700',
  'Success Stories': 'bg-emerald-100 text-emerald-700',
  'Feedback': 'bg-purple-100 text-purple-700',
  'General': 'bg-blue-100 text-blue-700',
}

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredDiscussions = discussions.filter((d) => {
    const matchesSearch =
      !searchQuery ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || d.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Pinned first, then by recency
  const sortedDiscussions = [...filteredDiscussions].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return 0
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-emerald-50/50 border-b">
        <div className="container mx-auto px-4 py-10 md:py-14 max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                Community Forum
              </h1>
              <p className="text-muted-foreground mt-2 max-w-lg">
                Connect with fellow PostAll users, share tips, celebrate wins, and help shape the future of the platform.
              </p>
            </div>
            <Button size="lg" className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              New Discussion
            </Button>
          </div>
        </div>
      </div>

      {/* Prominent Forums CTA */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-white">
              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Join the Discussion
              </h2>
              <p className="text-emerald-100 mt-1 text-sm md:text-base">
                Visit our full Community Hub with live posts, comments, likes, and real-time discussions. Share tips, ask questions, and connect with 8,000+ members!
              </p>
            </div>
            <Link href="/community/forums">
              <Button size="lg" className="gap-2 bg-white text-emerald-700 hover:bg-emerald-50 shadow-lg font-semibold px-6 h-11 shrink-0">
                <MessageCircle className="h-4 w-4" />
                Enter Community Hub
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Forum Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Forum Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <Card
                  key={cat.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() =>
                    setSelectedCategory(selectedCategory === cat.name ? null : cat.name)
                  }
                >
                  <CardContent className="p-4 md:p-5">
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${cat.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{cat.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {cat.posts} posts
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{cat.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <span className="font-medium truncate">Latest: {cat.latestPost.title}</span>
                          <span className="shrink-0">by {cat.latestPost.author}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Search and filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          {selectedCategory && (
            <Button variant="outline" onClick={() => setSelectedCategory(null)}>
              Clear filter: {selectedCategory}
            </Button>
          )}
        </div>

        {/* Recent Discussions */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            Recent Discussions
            {selectedCategory && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                in {selectedCategory}
              </span>
            )}
          </h2>
        </div>

        <div className="space-y-2">
          {sortedDiscussions.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <MessageCircle className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="font-semibold">No discussions found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or category filter.
                </p>
              </CardContent>
            </Card>
          ) : (
            sortedDiscussions.map((discussion) => (
              <Card
                key={discussion.id}
                className={`hover:shadow-md transition-shadow cursor-pointer ${discussion.pinned ? 'border-primary/30 bg-primary/5' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {discussion.pinned && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary gap-1">
                            <Pin className="h-3 w-3" />
                            Pinned
                          </Badge>
                        )}
                        {discussion.hot && (
                          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 gap-1">
                            <Flame className="h-3 w-3" />
                            Hot
                          </Badge>
                        )}
                        <Badge
                          variant="secondary"
                          className={categoryBadgeColors[discussion.category] || 'bg-muted text-muted-foreground'}
                        >
                          {discussion.category}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-sm md:text-base leading-snug">
                        {discussion.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                        <span className="font-medium">by {discussion.author}</span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {discussion.replies} replies
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {discussion.views.toLocaleString()} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {discussion.time}
                        </span>
                      </div>
                    </div>
                    <div className="hidden sm:flex flex-col items-end gap-1 shrink-0 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {discussion.replies}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {discussion.views}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-8">
          <p className="text-sm text-muted-foreground">
            Showing {sortedDiscussions.length} of {discussions.length} discussions
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 3}
              onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
