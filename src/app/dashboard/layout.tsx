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
  Settings2,
  Bell,
  Heart,
  Star,
  Menu,
  LogIn,
  ChevronRight,
  Briefcase,
  Compass,
  SlidersHorizontal,
  Search,
  Users,
  ChartColumnIncreasing,
  Truck,
  ShieldCheck,
  Gift,
  Trophy,
  ArrowLeft,
  Home,
} from 'lucide-react'

type SidebarItem = {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  roles?: UserRole[] // if defined, only show for these roles
}

const commonItems: SidebarItem[] = [
  { label: 'Dashboard Home', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Messages', href: '/dashboard/messages', icon: MessageCircle, badge: 3 },
  { label: 'Notifications', href: '/notifications', icon: Bell },
  { label: 'Favorites', href: '/favorites', icon: Heart },
  { label: 'Saved Searches', href: '/saved-searches', icon: Search },
  { label: 'Recently Viewed', href: '/recently-viewed', icon: ClipboardList },
  { label: 'Profile', href: '/dashboard/profile', icon: CircleUserRound },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings2 },
  { label: 'Notification Prefs', href: '/dashboard/notification-prefs', icon: Settings2 },
  { label: 'Reviews', href: '/dashboard/reviews', icon: Star },
  { label: 'Delivery Tracking', href: '/dashboard/tracking', icon: Truck },
  { label: 'Analytics', href: '/dashboard/analytics', icon: ChartColumnIncreasing },
  { label: 'Verification', href: '/dashboard/verify', icon: ShieldCheck },
  { label: 'Referrals', href: '/dashboard/referrals', icon: Gift },
  { label: 'Achievements', href: '/dashboard/achievements', icon: Trophy },
  { label: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
]

const roleSpecificItems: SidebarItem[] = [
  // Seller
  { label: 'My Listings', href: '/dashboard/listings', icon: ShoppingCart, roles: ['seller'] },
  // Freelancer
  { label: 'My Tasks', href: '/dashboard/tasks', icon: ClipboardList, roles: ['freelancer'] },
  { label: 'Applications', href: '/dashboard/applications', icon: FileText, roles: ['freelancer'] },
  { label: 'Find Work', href: '/find-work', icon: Search, roles: ['freelancer'] },
  // Errand Runner
  { label: 'Available Tasks', href: '/find-work', icon: Compass, roles: ['errand_runner'] },
  { label: 'My Tasks', href: '/dashboard/tasks', icon: ClipboardList, roles: ['errand_runner'] },
  { label: 'Earnings', href: '/dashboard/wallet', icon: Wallet, roles: ['errand_runner'] },
  // Service Provider
  { label: 'Bookings', href: '/dashboard/tasks', icon: Briefcase, roles: ['service_provider'] },
  { label: 'My Services', href: '/dashboard/listings', icon: SlidersHorizontal, roles: ['service_provider'] },
  { label: 'Reviews', href: '/reviews', icon: Star, roles: ['service_provider'] },
  // Buyer
  { label: 'My Tasks', href: '/dashboard/tasks', icon: ClipboardList, roles: ['buyer'] },
  { label: 'Pick Worker', href: '/dashboard/pick-worker', icon: Users, roles: ['buyer'] },
  { label: 'My Applications', href: '/dashboard/applications', icon: FileText, roles: ['buyer'] },
]

function getVisibleItems(role?: UserRole): SidebarItem[] {
  const visible: SidebarItem[] = []

  // Common items — filter by roles if specified
  for (const item of commonItems) {
    if (!item.roles || (role && item.roles.includes(role))) {
      visible.push(item)
    }
  }

  // Role-specific items
  if (role) {
    for (const item of roleSpecificItems) {
      if (item.roles && item.roles.includes(role)) {
        // Avoid duplicate hrefs (e.g., Wallet for errand_runner is already common)
        if (!visible.some(v => v.href === item.href && v.label === item.label)) {
          visible.push(item)
        }
      }
    }
  }

  return visible
}

function SidebarNav({
  onItemClick,
}: {
  onItemClick?: () => void;
}) {
  const pathname = usePathname()
  const { user } = useAuthStore()

  const items = useMemo(() => getVisibleItems(user?.role), [user?.role])

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5">
        <Link href="/browse" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full bg-[#0D8A5C] flex items-center justify-center">
            <span className="text-white font-bold text-sm">PA</span>
          </div>
          <div>
            <span className="font-bold text-lg text-[#0D8A5C]">PostAll</span>
            <p className="text-[11px] text-muted-foreground -mt-0.5">
              {user?.role ? user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Dashboard'}
            </p>
          </div>
        </Link>
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-3">
        <nav className="space-y-1" aria-label="Dashboard navigation">
          {items.map((item) => {
            const isActive =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                onClick={onItemClick}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#0D8A5C] text-white shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge
                    variant="secondary"
                    className={`h-5 min-w-[20px] justify-center px-1.5 text-[10px] ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User footer */}
      <Separator />
      <div className="p-4">
        {user && (
          <Link
            href="/dashboard/profile"
            onClick={onItemClick}
            className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-accent transition-colors"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-[#0D8A5C]/10 text-[#0D8A5C] text-sm font-medium">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.username}</p>
              <p className="text-[11px] text-muted-foreground truncate">
                {user.role ? user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Set up your role'}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        )}
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuthStore();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="h-16 w-16 rounded-2xl bg-[#0D8A5C]/10 flex items-center justify-center mx-auto">
            <LogIn className="h-8 w-8 text-[#0D8A5C]" />
          </div>
          <h2 className="text-2xl font-bold">Please Log In</h2>
          <p className="text-muted-foreground">
            You need to be logged in to access the dashboard. Sign in to manage
            your tasks, applications, messages, and more.
          </p>
          <Link href="/login">
            <Button size="lg" className="gap-2 bg-[#0D8A5C] hover:bg-[#0D8A5C]/90">
              <LogIn className="h-4 w-4" />
              Log In / Sign Up
            </Button>
          </Link>
          <Link href="/browse">
            <Button variant="ghost" className="mt-2">
              <Home className="h-4 w-4 mr-2" />
              Back to Browse
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r bg-card" aria-label="Dashboard sidebar">
        <SidebarNav />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
          {/* Mobile menu button */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">Dashboard Navigation</SheetTitle>
              <SidebarNav onItemClick={() => setSidebarOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* Greeting */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground">
              Welcome back,{" "}
              <span className="font-medium text-foreground">
                {user.username}
              </span>
            </p>
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-2">
            <Link href="/dashboard/messages">
              <Button variant="ghost" size="icon" className="relative">
                <MessageCircle className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center">
                  3
                </span>
              </Button>
            </Link>
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-emerald-500 text-[10px] font-bold text-white flex items-center justify-center">
                  5
                </span>
              </Button>
            </Link>
            <Link href="/dashboard/profile">
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback className="bg-[#0D8A5C]/10 text-[#0D8A5C] text-sm font-medium">
                  {user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 lg:p-6 max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
