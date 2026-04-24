'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore, type UserRole } from '@/lib/auth-store'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  ShoppingCart,
  MessageCircle,
  Wallet,
  CircleUserRound,
  Settings,
  Bell,
  Heart,
  Star,
  Menu,
  LogIn,
  ChevronRight,
  Briefcase,
  Building2,
  Compass,
  SlidersHorizontal,
  Search,
  Zap,
  Users,
  Calendar,
  Eye,
  Sparkles,
  Bookmark,
  History,
} from 'lucide-react'

type SidebarItem = {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  roles?: UserRole[]
}

const commonItems: SidebarItem[] = [
  { label: 'Dashboard Home', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Messages', href: '/dashboard/messages', icon: MessageCircle, badge: 3 },
  { label: 'Notifications', href: '/notifications', icon: Bell },
  { label: 'Favorites', href: '/favorites', icon: Heart },
  { label: 'Saved Searches', href: '/saved-searches', icon: Bookmark },
  { label: 'Recently Viewed', href: '/recently-viewed', icon: History },
  { label: 'Profile', href: '/dashboard/profile', icon: CircleUserRound },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
]

const roleSpecificItems: SidebarItem[] = [
  { label: 'My Listings', href: '/dashboard/listings', icon: ShoppingCart, roles: ['seller'] },
  { label: 'My Tasks', href: '/dashboard/tasks', icon: ClipboardList, roles: ['freelancer', 'errand_runner', 'buyer'] },
  { label: 'Applications', href: '/dashboard/applications', icon: FileText, roles: ['freelancer', 'buyer'] },
  { label: 'Find Work', href: '/find-work', icon: Search, roles: ['freelancer'] },
  { label: 'Pick Worker', href: '/dashboard/pick-worker', icon: Users, roles: ['buyer'] },
  { label: 'Bookings', href: '/dashboard/tasks', icon: Calendar, roles: ['service_provider'] },
  { label: 'My Services', href: '/dashboard/listings', icon: SlidersHorizontal, roles: ['service_provider'] },
]

function getVisibleItems(role?: UserRole): SidebarItem[] {
  const visible: SidebarItem[] = [...commonItems]
  if (role) {
    for (const item of roleSpecificItems) {
      if (item.roles?.includes(role) && !visible.some(v => v.href === item.href)) {
        visible.push(item)
      }
    }
  }
  return visible
}

function SidebarNav({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const items = useMemo(() => getVisibleItems(user?.role), [user?.role])

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-5">
        <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">PA</span>
        </div>
        <div>
          <span className="font-bold text-lg">PostAll</span>
          <p className="text-[11px] text-muted-foreground -mt-0.5">
            {user?.role ? user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Dashboard'}
          </p>
        </div>
      </div>
      <Separator />
      <ScrollArea className="flex-1 px-3 py-3">
        <nav className="space-y-1">
          {items.map((item) => {
            const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link key={`${item.label}-${item.href}`} href={item.href} onClick={onItemClick}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}>
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className={`h-5 min-w-[20px] justify-center px-1.5 text-[10px] ${isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-emerald-100 text-emerald-700'}`}>
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
      <Separator />
      <div className="p-4">
        {user && (
          <Link href="/dashboard/profile" onClick={onItemClick} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-accent transition-colors">
            <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">{user.username.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.username}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user.role ? user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : ''}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        )}
      </div>
    </div>
  )
}

export default function DashboardSubLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuthStore()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Please Log In</h2>
          <p className="text-muted-foreground">You need to be logged in to access this page.</p>
          <Link href="/login"><Button size="lg" className="gap-2"><LogIn className="h-4 w-4" />Log In / Sign Up</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r bg-card"><SidebarNav /></aside>
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 p-0"><SheetTitle className="sr-only">Navigation</SheetTitle><SidebarNav onItemClick={() => setSidebarOpen(false)} /></SheetContent>
      </Sheet>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur px-4 lg:px-6">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild className="lg:hidden"><Button variant="ghost" size="icon" className="shrink-0"><Menu className="h-5 w-5" /></Button></SheetTrigger>
            <SheetContent side="left" className="w-72 p-0"><SheetTitle className="sr-only">Navigation</SheetTitle><SidebarNav onItemClick={() => setSidebarOpen(false)} /></SheetContent>
          </Sheet>
          <div className="flex-1 min-w-0"><p className="text-sm text-muted-foreground">Welcome back, <span className="font-medium text-foreground">{user.username}</span></p></div>
          <Link href="/dashboard/messages"><Button variant="ghost" size="icon" className="relative"><MessageCircle className="h-4 w-4" /><span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center">3</span></Button></Link>
          <Button variant="ghost" size="icon"><Bell className="h-4 w-4" /></Button>
          <Link href="/dashboard/profile"><Avatar className="h-8 w-8 cursor-pointer"><AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">{user.username.charAt(0).toUpperCase()}</AvatarFallback></Avatar></Link>
        </header>
        <main className="flex-1 overflow-y-auto"><div className="container mx-auto p-4 lg:p-6 max-w-6xl">{children}</div></main>
      </div>
    </div>
  )
}
