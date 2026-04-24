'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { useAuthStore } from '@/lib/auth-store'
import {
  Heart,
  MessageCircle,
  Share2,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
  Bookmark,
  Flag,
  Copy,
  Plus,
  Search,
  Users,
  ChevronDown,
  ChevronUp,
  Send,
  X,
  Check,
  ImageIcon,
  BadgeCheck,
  Clock,
  Filter,
  Smartphone,
  Drama,
  type LucideIcon,
} from 'lucide-react'

// Icon map for post image placeholders
const postImageIconMap: Record<string, LucideIcon> = {
  Smartphone,
  Drama,
}

// ---- Types ----
interface Comment {
  id: string
  author: string
  authorInitials: string
  authorColor: string
  text: string
  time: string
  likes: number
  liked: boolean
  replies?: Comment[]
}

interface CommunityPost {
  id: string
  author: string
  handle: string
  authorInitials: string
  authorColor: string
  verified: boolean
  category: string
  content: string
  image?: string
  timestamp: string
  likes: number
  liked: boolean
  comments: Comment[]
  views: number
  bookmarked: boolean
  isOwn: boolean
}

// ---- Forum Categories ----
const forumCategories = [
  { name: 'General', count: 1247 },
  { name: 'Buyer/Seller Tips', count: 456 },
  { name: 'Housing', count: 892 },
  { name: 'Jobs', count: 634 },
  { name: 'Services', count: 312 },
  { name: 'Events', count: 178 },
  { name: 'Safety', count: 245 },
  { name: 'Tech', count: 567 },
]

const categoryColors: Record<string, string> = {
  'General': 'bg-emerald-100 text-emerald-700',
  'Buyer/Seller Tips': 'bg-amber-100 text-amber-700',
  'Housing': 'bg-orange-100 text-orange-700',
  'Jobs': 'bg-teal-100 text-teal-700',
  'Services': 'bg-cyan-100 text-cyan-700',
  'Events': 'bg-rose-100 text-rose-700',
  'Safety': 'bg-red-100 text-red-700',
  'Tech': 'bg-indigo-100 text-indigo-700',
}

// ---- Sample Data ----
const initialPosts: CommunityPost[] = [
  {
    id: 'p1',
    author: 'Adebayo Johnson',
    handle: '@adebayo_j',
    authorInitials: 'AJ',
    authorColor: 'bg-emerald-500',
    verified: true,
    category: 'Buyer/Seller Tips',
    content: 'Just closed my biggest deal on PostAll! Sold a MacBook Pro for ₦1.2M. Here are 5 tips that helped me sell fast:\n\n1. Take clear, well-lit photos\n2. Write an honest, detailed description\n3. Price competitively - check similar listings first\n4. Respond to messages within 30 minutes\n5. Use the escrow service for high-value items\n\nHope this helps someone!',
    timestamp: '2h ago',
    likes: 34,
    liked: false,
    comments: [
      { id: 'c1', author: 'Chinedu E.', authorInitials: 'CE', authorColor: 'bg-amber-500', text: 'Great tips! The escrow tip is so important for high-value items. I always use it.', time: '1h ago', likes: 5, liked: false },
      { id: 'c2', author: 'Fatima A.', authorInitials: 'FA', authorColor: 'bg-rose-500', text: 'How do you take good photos? My items never look as appealing in photos.', time: '45m ago', likes: 2, liked: false },
      { id: 'c3', author: 'Adebayo Johnson', authorInitials: 'AJ', authorColor: 'bg-emerald-500', text: 'Use natural light! Take photos near a window during the day. Clean the item first too.', time: '30m ago', likes: 8, liked: false },
    ],
    views: 245,
    bookmarked: false,
    isOwn: true,
  },
  {
    id: 'p2',
    author: 'Kwame Mensah',
    handle: '@kwame_m',
    authorInitials: 'KM',
    authorColor: 'bg-emerald-600',
    verified: true,
    category: 'Housing',
    content: 'WARNING: Fake landlord scam in East Legon area! Someone is posing as a landlord and collecting "inspection fees" from multiple people for the same apartment. The real landlord confirmed he never listed on any platform.\n\nBe careful out there, everyone. Always verify the landlord\'s identity and never pay inspection fees before seeing the property.',
    timestamp: '4h ago',
    likes: 50,
    liked: false,
    comments: [
      { id: 'c4', author: 'Ama S.', authorInitials: 'AS', authorColor: 'bg-teal-600', text: 'This happened to me last month! I lost ₦15K. Thank you for warning others.', time: '3h ago', likes: 12, liked: false },
      { id: 'c5', author: 'Emeka O.', authorInitials: 'EO', authorColor: 'bg-teal-500', text: 'Report this to PostAll support immediately. They can ban the scammer.', time: '2h ago', likes: 7, liked: false },
    ],
    views: 489,
    bookmarked: false,
    isOwn: false,
  },
  {
    id: 'p3',
    author: 'Zainab Mohammed',
    handle: '@zainab_m',
    authorInitials: 'ZM',
    authorColor: 'bg-pink-500',
    verified: false,
    category: 'Jobs',
    content: 'Just got hired through PostAll for a remote data entry role paying ₦180K/month! The whole process took less than a week. Applied on Monday, had an interview on Wednesday, and got the offer on Friday.\n\nFor anyone job hunting: make sure your profile is complete and your response rate is high. Employers notice these things!',
    timestamp: '6h ago',
    likes: 28,
    liked: false,
    comments: [
      { id: 'c6', author: 'David K.', authorInitials: 'DK', authorColor: 'bg-orange-500', text: 'Congrats Zainab! Can you share tips on how to improve response rate?', time: '5h ago', likes: 3, liked: false },
      { id: 'c7', author: 'Zainab Mohammed', authorInitials: 'ZM', authorColor: 'bg-pink-500', text: 'Turn on push notifications and try to reply within the first hour. Also, set up auto-reply for when you\'re busy!', time: '4h ago', likes: 6, liked: false },
      { id: 'c8', author: 'Grace T.', authorInitials: 'GT', authorColor: 'bg-cyan-500', text: 'That\'s amazing! I\'ve been looking for remote work. Which category did you apply under?', time: '3h ago', likes: 1, liked: false },
    ],
    views: 178,
    bookmarked: false,
    isOwn: false,
  },
  {
    id: 'p4',
    author: 'Tunde Bakare',
    handle: '@tunde_b',
    authorInitials: 'TB',
    authorColor: 'bg-orange-500',
    verified: true,
    category: 'Tech',
    content: 'iPhone 16 Pro review after 2 weeks of use:\n\n+ Camera is incredible - the 48MP main lens blows everything away\n+ Battery life is noticeably better than 15 Pro\n+ Action button is actually useful once you customize it\n- Price is still too high (₦1.2M+ in Nigeria)\n- Not much different from 15 Pro in daily use\n\nVerdict: If you have a 13 or older, it\'s worth the upgrade. If you have a 15 Pro, save your money.',
    image: 'Smartphone',
    timestamp: '8h ago',
    likes: 45,
    liked: false,
    comments: [
      { id: 'c9', author: 'GadgetLover', authorInitials: 'GL', authorColor: 'bg-indigo-500', text: 'Agree with the camera assessment. The video quality is insane!', time: '7h ago', likes: 4, liked: false },
      { id: 'c10', author: 'TechNerd NG', authorInitials: 'TN', authorColor: 'bg-emerald-600', text: 'I\'d add that the Always-On display finally looks good. The brightness adjustment helps a lot.', time: '6h ago', likes: 2, liked: false },
    ],
    views: 356,
    bookmarked: false,
    isOwn: false,
  },
  {
    id: 'p5',
    author: 'DemoUser',
    handle: '@demouser',
    authorInitials: 'DU',
    authorColor: 'bg-teal-700',
    verified: true,
    category: 'General',
    content: 'Happy to be part of this community! Just signed up on PostAll and already love the experience. The escrow system gives me so much confidence buying things online.\n\nQuick question for the community: What\'s the best category to browse if I\'m looking for home furniture in Lagos?',
    timestamp: '10h ago',
    likes: 12,
    liked: false,
    comments: [
      { id: 'c11', author: 'InteriorDiva', authorInitials: 'ID', authorColor: 'bg-amber-600', text: 'Welcome! Check the "For Sale" category and filter by Lagos. There are some great furniture listings from stores in Ikeja and Lekki.', time: '9h ago', likes: 3, liked: false },
    { id: 'c12', author: 'LagosFinder', authorInitials: 'LF', authorColor: 'bg-teal-600', text: 'Also try searching for "furniture" in the browse page. Some sellers don\'t categorize properly.', time: '8h ago', likes: 1, liked: false },
    ],
    views: 89,
    bookmarked: false,
    isOwn: true,
  },
  {
    id: 'p6',
    author: 'Amara Obi',
    handle: '@amara_obi',
    authorInitials: 'AO',
    authorColor: 'bg-teal-500',
    verified: false,
    category: 'Services',
    content: 'Looking for a reliable web developer to build an e-commerce site for my small business. Budget is around ₦300K-₦500K.\n\nRequirements:\n- Product catalog with search\n- Payment integration (Paystack)\n- Mobile responsive\n- Admin dashboard\n\nPlease share your portfolio and timeline if interested!',
    timestamp: '12h ago',
    likes: 8,
    liked: false,
    comments: [
      { id: 'c13', author: 'CodeMaster', authorInitials: 'CM', authorColor: 'bg-blue-600', text: 'I can handle this! I built 3 e-commerce sites last month. Let me send you my portfolio via chat.', time: '11h ago', likes: 5, liked: false },
      { id: 'c14', author: 'DevNinja', authorInitials: 'DN', authorColor: 'bg-green-600', text: 'For ₦500K, I\'d recommend using Next.js + Shopify integration. Much faster and cheaper to maintain.', time: '10h ago', likes: 3, liked: false },
      { id: 'c15', author: 'Amara Obi', authorInitials: 'AO', authorColor: 'bg-teal-500', text: 'Thanks everyone! I\'ll review the proposals and get back to you.', time: '9h ago', likes: 1, liked: false },
    ],
    views: 134,
    bookmarked: false,
    isOwn: false,
  },
  {
    id: 'p7',
    author: 'Segun Adeyemi',
    handle: '@segun_a',
    authorInitials: 'SA',
    authorColor: 'bg-red-500',
    verified: true,
    category: 'Events',
    content: 'Lagos Tech Summit 2026 is happening next month! Who else is going?\n\nDate: March 15-17, 2026\nVenue: Eko Convention Centre\nEarly bird tickets: ₦25K (ends this week)\n\nI attended last year and it was incredible. Great networking opportunities and the workshops were top-notch. DM me if you want to go together!',
    image: 'Drama',
    timestamp: '1d ago',
    likes: 22,
    liked: false,
    comments: [
      { id: 'c16', author: 'TechGal', authorInitials: 'TG', authorColor: 'bg-pink-600', text: 'Already got my ticket! Can\'t wait for the AI workshop on Day 2.', time: '20h ago', likes: 4, liked: false },
      { id: 'c17', author: 'StartupKing', authorInitials: 'SK', authorColor: 'bg-amber-700', text: 'Last year I got my first investor at this event. Highly recommend for anyone in the tech space!', time: '18h ago', likes: 6, liked: false },
    ],
    views: 267,
    bookmarked: false,
    isOwn: false,
  },
  {
    id: 'p8',
    author: 'Ngozi Eze',
    handle: '@ngozi_eze',
    authorInitials: 'NE',
    authorColor: 'bg-amber-500',
    verified: true,
    category: 'Safety',
    content: 'Important safety tip for everyone:\n\nAlways meet buyers/sellers at a PostAll Safe Spot or a busy public place during daytime. I always meet at the mall food court - lots of CCTV and people around.\n\nAlso, never send money as "advance payment" before seeing the item. If the deal seems too good to be true, it probably is. Stay safe everyone!',
    timestamp: '1d ago',
    likes: 41,
    liked: false,
    comments: [
      { id: 'c18', author: 'SafetyFirst', authorInitials: 'SF', authorColor: 'bg-red-600', text: 'Amen! I always check the seller\'s verification badge and ratings before meeting. Better safe than sorry.', time: '22h ago', likes: 8, liked: false },
      { id: 'c19', author: 'NewUser', authorInitials: 'NU', authorColor: 'bg-muted-foreground', text: 'What are PostAll Safe Spots? Where can I find them?', time: '20h ago', likes: 0, liked: false },
      { id: 'c20', author: 'Ngozi Eze', authorInitials: 'NE', authorColor: 'bg-amber-500', text: 'They\'re listed in the "Safe Spots" tool on PostAll. Popular locations include malls, police station parking lots, and registered businesses.', time: '19h ago', likes: 5, liked: false },
      { id: 'c21', author: 'LagosBuyer', authorInitials: 'LB', authorColor: 'bg-emerald-600', text: 'I also tell a friend where I\'m going and share my live location. Extra layer of safety!', time: '18h ago', likes: 9, liked: false },
    ],
    views: 502,
    bookmarked: false,
    isOwn: false,
  },
  {
    id: 'p9',
    author: 'Olufemi Adeleke',
    handle: '@femi_ade',
    authorInitials: 'OA',
    authorColor: 'bg-indigo-500',
    verified: false,
    category: 'General',
    content: 'Unpopular opinion: PostAll is better than Jiji and OLX combined. The escrow system alone puts it way ahead. I\'ve bought 12 items here and never had a single issue.\n\nThe community forums are a nice touch too. Where else can you get advice from real buyers and sellers before making a purchase?',
    timestamp: '2d ago',
    likes: 19,
    liked: false,
    comments: [
      { id: 'c22', author: 'JijiRefugee', authorInitials: 'JR', authorColor: 'bg-orange-600', text: '100% agree! Moved here from Jiji 3 months ago and never looked back.', time: '1d ago', likes: 7, liked: false },
    ],
    views: 156,
    bookmarked: false,
    isOwn: true,
  },
  {
    id: 'p10',
    author: 'Chioma Nwosu',
    handle: '@chioma_n',
    authorInitials: 'CN',
    authorColor: 'bg-rose-500',
    verified: true,
    category: 'Buyer/Seller Tips',
    content: 'How to negotiate like a pro on PostAll:\n\n1. Always start at 70-80% of asking price\n2. Be polite and friendly - nobody wants to deal with a rude buyer\n3. Point out any flaws honestly (but don\'t be nitpicky)\n4. Offer to pay immediately if they accept your price\n5. Be willing to walk away\n\nI\'ve saved over ₦200K in the last 3 months using these techniques. Happy shopping!',
    timestamp: '2d ago',
    likes: 37,
    liked: false,
    comments: [
      { id: 'c23', author: 'DealHunter', authorInitials: 'DH', authorColor: 'bg-green-600', text: 'The "pay immediately" tip is golden. Sellers love quick transactions.', time: '2d ago', likes: 11, liked: false },
      { id: 'c24', author: 'SellerPro', authorInitials: 'SP', authorColor: 'bg-blue-600', text: 'As a seller, I can confirm that friendly buyers always get better deals from me', time: '1d ago', likes: 6, liked: false },
      { id: 'c25', author: 'BudgetQueen', authorInitials: 'BQ', authorColor: 'bg-purple-600', text: 'I once negotiated a washing machine from ₦180K down to ₦120K! It really works.', time: '1d ago', likes: 4, liked: false },
    ],
    views: 423,
    bookmarked: false,
    isOwn: false,
  },
]

export default function ForumsPage() {
  const { user } = useAuthStore()
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)
  const [editingPost, setEditingPost] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [newPostCategory, setNewPostCategory] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [creatingPost, setCreatingPost] = useState(false)

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = !searchQuery ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || post.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [posts, searchQuery, selectedCategory])

  // Like post
  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      return {
        ...p,
        liked: !p.liked,
        likes: p.liked ? p.likes - 1 : p.likes + 1,
      }
    }))
  }

  // Toggle comment section
  const toggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const next = new Set(prev)
      if (next.has(postId)) next.delete(postId)
      else next.add(postId)
      return next
    })
  }

  // Like comment
  const toggleCommentLike = (postId: string, commentId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      return {
        ...p,
        comments: p.comments.map(c => {
          if (c.id !== commentId) return c
          return { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
        }),
      }
    }))
  }

  // Add comment
  const addComment = (postId: string) => {
    const text = commentInputs[postId]?.trim()
    if (!text) return
    const newComment: Comment = {
      id: `c-new-${Date.now()}`,
      author: user?.username || 'DemoUser',
      authorInitials: (user?.username || 'DU').slice(0, 2).toUpperCase(),
      authorColor: 'bg-teal-700',
      text,
      time: 'Just now',
      likes: 0,
      liked: false,
    }
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      return { ...p, comments: [...p.comments, newComment] }
    }))
    setCommentInputs(prev => ({ ...prev, [postId]: '' }))
    toast.success('Comment added!')
  }

  // Delete post
  const confirmDelete = () => {
    if (postToDelete) {
      setPosts(prev => prev.filter(p => p.id !== postToDelete))
      toast.success('Post deleted')
    }
    setDeleteDialogOpen(false)
    setPostToDelete(null)
  }

  // Edit post
  const startEdit = (post: CommunityPost) => {
    setEditingPost(post.id)
    setEditContent(post.content)
  }

  const saveEdit = () => {
    if (editingPost && editContent.trim().length >= 10) {
      setPosts(prev => prev.map(p => {
        if (p.id !== editingPost) return p
        return { ...p, content: editContent }
      }))
      setEditingPost(null)
      setEditContent('')
      toast.success('Post updated!')
    }
  }

  // Bookmark
  const toggleBookmark = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      return { ...p, bookmarked: !p.bookmarked }
    }))
    toast.success('Bookmark updated')
  }

  // Share / copy link
  const handleShare = (postId: string) => {
    const url = `${window.location.origin}/community/forums#post-${postId}`
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard!')
    }).catch(() => {
      toast.error('Failed to copy link')
    })
  }

  // Report
  const handleReport = (postId: string) => {
    toast.success('Post reported. We\'ll review it shortly.')
  }

  // Create post
  const handleCreatePost = () => {
    if (!newPostCategory || newPostContent.trim().length < 10) {
      toast.error('Please select a category and write at least 10 characters')
      return
    }
    setCreatingPost(true)
    setTimeout(() => {
      const newPost: CommunityPost = {
        id: `p-new-${Date.now()}`,
        author: user?.username || 'DemoUser',
        handle: `@${(user?.username || 'demouser').toLowerCase()}`,
        authorInitials: (user?.username || 'DU').slice(0, 2).toUpperCase(),
        authorColor: 'bg-teal-700',
        verified: !!user?.isVerified,
        category: newPostCategory,
        content: newPostContent,
        timestamp: 'Just now',
        likes: 0,
        liked: false,
        comments: [],
        views: 0,
        bookmarked: false,
        isOwn: true,
      }
      setPosts(prev => [newPost, ...prev])
      setNewPostCategory('')
      setNewPostContent('')
      setCreatingPost(false)
      setCreateDialogOpen(false)
      toast.success('Post published!')
    }, 800)
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">

      {/* Hero / Header */}
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-teal-500/20 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-8 md:py-12 relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">Community Hub</h1>
                  <p className="text-emerald-200 text-sm flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    8,240 members · 4,531 discussions
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 bg-white"
                />
              </div>
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-1.5 bg-white text-emerald-700 hover:bg-emerald-50 shrink-0">
                    <Plus className="h-4 w-4" />
                    Create Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create New Post</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">Category</Label>
                      <Select value={newPostCategory} onValueChange={setNewPostCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {forumCategories.map((cat) => (
                            <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">Content</Label>
                      <Textarea
                        placeholder="What's on your mind? (minimum 10 characters)"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        rows={5}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground mt-1">{newPostContent.length}/500 characters</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-1.5 block">Image (Optional)</Label>
                      <Button variant="outline" className="w-full gap-2 h-10 border-dashed">
                        <ImageIcon className="h-4 w-4" />
                        Upload Image
                      </Button>
                    </div>
                    <Button
                      className="w-full"
                      onClick={handleCreatePost}
                      disabled={creatingPost || !newPostCategory || newPostContent.trim().length < 10}
                    >
                      {creatingPost ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Posting...
                        </span>
                      ) : 'Post'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-6xl flex-1">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Categories (Desktop) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <Card className="sticky top-4">
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Categories
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      !selectedCategory ? 'bg-emerald-100 text-emerald-700 font-medium' : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <span>All Posts</span>
                    <span className="text-xs">{posts.length}</span>
                  </button>
                  {forumCategories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.name ? 'bg-emerald-100 text-emerald-700 font-medium' : 'hover:bg-muted text-muted-foreground'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${categoryColors[cat.name]?.split(' ')[0] || 'bg-muted-foreground'}`} />
                        {cat.name}
                      </span>
                      <span className="text-xs">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Mobile Category Filter */}
          <div className="lg:hidden mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  !selectedCategory ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground'
                }`}
              >
                All
              </button>
              {forumCategories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat.name ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Feed */}
          <div className="flex-1 space-y-4">
            {filteredPosts.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-1">No posts found</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {searchQuery || selectedCategory
                      ? 'Try adjusting your search or clearing the category filter.'
                      : 'Be the first to create a post in this community!'}
                  </p>
                  {(searchQuery || selectedCategory) && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => { setSearchQuery(''); setSelectedCategory(null) }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredPosts.map((post) => {
                const isCommentExpanded = expandedComments.has(post.id)
                const visibleComments = isCommentExpanded ? post.comments : post.comments.slice(0, 3)
                const hasMoreComments = post.comments.length > 3

                return (
                  <Card key={post.id} className="overflow-hidden">
                    {/* Post Header */}
                    <CardContent className="p-4 pb-0">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className={`${post.authorColor} text-white text-sm font-semibold`}>
                              {post.authorInitials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-sm">{post.author}</span>
                              {post.verified && <BadgeCheck className="h-4 w-4 text-emerald-600" />}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <span>{post.handle}</span>
                              <span>·</span>
                              <span>{post.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={`text-[10px] px-2 py-0.5 ${categoryColors[post.category] || 'bg-muted text-muted-foreground'}`}>
                            {post.category}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              {post.isOwn && (
                                <>
                                  <DropdownMenuItem onClick={() => startEdit(post)} className="gap-2 cursor-pointer">
                                    <Pencil className="h-4 w-4" />
                                    Edit Post
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => { setPostToDelete(post.id); setDeleteDialogOpen(true) }}
                                    className="gap-2 text-rose-600 focus:text-rose-600 cursor-pointer"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Post
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                </>
                              )}
                              <DropdownMenuItem onClick={() => toggleBookmark(post.id)} className="gap-2 cursor-pointer">
                                <Bookmark className={`h-4 w-4 ${post.bookmarked ? 'fill-emerald-600 text-emerald-600' : ''}`} />
                                {post.bookmarked ? 'Remove Bookmark' : 'Bookmark'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReport(post.id)} className="gap-2 cursor-pointer">
                                <Flag className="h-4 w-4" />
                                Report
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleShare(post.id)} className="gap-2 cursor-pointer">
                                <Copy className="h-4 w-4" />
                                Copy Link
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>

                    {/* Post Content */}
                    <CardContent className="p-4 pt-3">
                      {editingPost === post.id ? (
                        <div className="space-y-3">
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={4}
                            className="resize-none"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={saveEdit} className="gap-1">
                              <Check className="h-3.5 w-3.5" /> Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingPost(null)} className="gap-1">
                              <X className="h-3.5 w-3.5" /> Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="whitespace-pre-line text-sm leading-relaxed">
                          {post.content}
                        </div>
                      )}

                      {/* Optional Image Placeholder */}
                      {post.image && !editingPost && (
                        <div className="mt-3 h-48 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl flex items-center justify-center">
                          {(() => { const ImgIcon = postImageIconMap[post.image] || ImageIcon; return <ImgIcon className="h-16 w-16 text-muted-foreground/40" />; })()}
                        </div>
                      )}
                    </CardContent>

                    {/* Action Bar */}
                    <div className="border-t">
                      <div className="flex items-center justify-between px-4 py-2">
                        <div className="flex items-center gap-1">
                          {/* Like */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`gap-1.5 h-8 px-2 text-xs ${post.liked ? 'text-rose-600 hover:text-rose-600' : 'text-muted-foreground'}`}
                            onClick={() => toggleLike(post.id)}
                          >
                            <Heart className={`h-4 w-4 ${post.liked ? 'fill-rose-500' : ''}`} />
                            {post.likes > 0 && post.likes}
                          </Button>

                          {/* Comment */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 h-8 px-2 text-xs text-muted-foreground"
                            onClick={() => toggleComments(post.id)}
                          >
                            <MessageCircle className="h-4 w-4" />
                            {post.comments.length > 0 && post.comments.length}
                          </Button>

                          {/* Share */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 h-8 px-2 text-xs text-muted-foreground"
                            onClick={() => handleShare(post.id)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>

                          {/* Views */}
                          <span className="flex items-center gap-1 text-xs text-muted-foreground ml-1">
                            <Eye className="h-3.5 w-3.5" />
                            {post.views}
                          </span>
                        </div>

                        {/* Bookmark quick toggle */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleBookmark(post.id)}
                        >
                          <Bookmark className={`h-4 w-4 ${post.bookmarked ? 'fill-emerald-600 text-emerald-600' : 'text-muted-foreground'}`} />
                        </Button>
                      </div>

                      {/* Expanded Comments */}
                      {isCommentExpanded && (
                        <div className="border-t bg-muted/20 px-4 py-3">
                          {/* Existing Comments */}
                          <div className="space-y-3 mb-3 max-h-96 overflow-y-auto">
                            {visibleComments.map((comment) => (
                              <div key={comment.id} className="flex gap-2.5">
                                <Avatar className="h-7 w-7 shrink-0">
                                  <AvatarFallback className={`${comment.authorColor} text-white text-[10px]`}>
                                    {comment.authorInitials}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold">{comment.author}</span>
                                    <span className="text-[10px] text-muted-foreground">{comment.time}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-0.5">{comment.text}</p>
                                  <button
                                    className={`flex items-center gap-1 mt-1 text-[10px] ${comment.liked ? 'text-rose-600' : 'text-muted-foreground hover:text-foreground'} transition-colors`}
                                    onClick={() => toggleCommentLike(post.id, comment.id)}
                                  >
                                    <Heart className={`h-3 w-3 ${comment.liked ? 'fill-rose-500' : ''}`} />
                                    {comment.likes > 0 ? comment.likes : 'Like'}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* View all / Show less */}
                          {hasMoreComments && (
                            <button
                              className="text-xs text-emerald-600 font-medium mb-3 block hover:underline"
                              onClick={() => toggleComments(post.id)}
                            >
                              View all {post.comments.length} comments
                            </button>
                          )}

                          {/* Add Comment */}
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7 shrink-0">
                              <AvatarFallback className="bg-teal-600 text-white text-[10px]">
                                {(user?.username || 'DU').slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 relative">
                              <Input
                                placeholder="Add a comment..."
                                value={commentInputs[post.id] || ''}
                                onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                                onKeyDown={(e) => { if (e.key === 'Enter') addComment(post.id) }}
                                className="h-8 text-sm pr-8"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-0.5 top-0.5 h-7 w-7"
                                onClick={() => addComment(post.id)}
                              >
                                <Send className="h-3.5 w-3.5 text-emerald-600" />
                              </Button>
                            </div>
                          </div>

                          {/* Show less */}
                          {post.comments.length <= 3 && (
                            <button
                              className="text-xs text-muted-foreground mt-2 hover:text-foreground transition-colors flex items-center gap-1"
                              onClick={() => toggleComments(post.id)}
                            >
                              <ChevronUp className="h-3 w-3" />
                              Hide comments
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone and the post will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-rose-600 hover:bg-rose-700 focus:ring-rose-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}
