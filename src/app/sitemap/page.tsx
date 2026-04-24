'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart,
  Search,
  Grid3X3,
  MapPin,
  Flame,
  CalendarDays,
  Store,
  BadgeCheck,
  CirclePlus,
  Briefcase,
  Megaphone,
  CreditCard,
  Users,
  MessageCircle,
  AlertTriangle,
  Heart,
  Star,
  ChartColumnIncreasing,
  LayoutDashboard,
  CircleUserRound,
  Settings,
  Wallet,
  Bell,
  Package,
  TrendingUp,
  Clock,
  Eye,
  FileText,
  Info,
  HelpCircle,
  Shield,
  BookOpen,
  Scale,
  Globe,
  Zap,
  Languages,
  Map as MapIcon,
  Lock,
  Truck,
  GraduationCap,
  Recycle,
  Siren,
  Bot,
  Camera,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { tools } from '@/lib/constants';

interface SitemapSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  links: { label: string; href: string; icon?: React.ComponentType<{ className?: string }> }[];
}

function getToolIcon(name: string): React.ComponentType<{ className?: string }> {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    CirclePlus, Search, ShoppingCart, Bot, TrendingUp, Shield,
    BadgeCheck, Star, Camera, MessageCircle, Calendar, Truck,
    Lock, Zap, ChartColumnIncreasing, Bell, Languages, MapIcon, Users,
    GraduationCap, Recycle, CalendarDays, Siren, Eye,
  };
  return iconMap[name] || Zap;
}

const sections: SitemapSection[] = [
  {
    title: 'Marketplace',
    icon: ShoppingCart,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    links: [
      { label: 'Browse Listings', href: '/browse', icon: Search },
      { label: 'Search', href: '/browse', icon: Search },
      { label: 'Categories', href: '/browse', icon: Grid3X3 },
      { label: 'Near Me', href: '/browse', icon: MapPin },
      { label: 'Today\'s Deals', href: '/deals', icon: Flame },
      { label: 'Events', href: '/tools/events', icon: CalendarDays },
      { label: 'Stores', href: '/browse', icon: Store },
      { label: 'Verified Sellers', href: '/verify-seller', icon: BadgeCheck },
    ],
  },
  {
    title: 'Post & Sell',
    icon: CirclePlus,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    links: [
      { label: 'Post a Task', href: '/post-task', icon: CirclePlus },
      { label: 'Sell an Item', href: '/sell-item', icon: ShoppingCart },
      { label: 'Find Work', href: '/find-work', icon: Briefcase },
      { label: 'Promote Listing', href: '/dashboard/promote', icon: Megaphone },
      { label: 'Pricing', href: '/pricing', icon: CreditCard },
    ],
  },
  {
    title: 'Community',
    icon: Users,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    links: [
      { label: 'Forums', href: '/community', icon: MessageCircle },
      { label: 'Lost & Found', href: '/community/lost-found', icon: Search },
      { label: 'Events', href: '/tools/events', icon: CalendarDays },
      { label: 'Safety Tips', href: '/safety', icon: Shield },
    ],
  },
  {
    title: 'Account',
    icon: CircleUserRound,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    links: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { label: 'Profile', href: '/dashboard/profile', icon: CircleUserRound },
      { label: 'Settings', href: '/dashboard/settings', icon: Settings },
      { label: 'Wallet', href: '/dashboard/wallet', icon: Wallet },
      { label: 'Messages', href: '/dashboard/messages', icon: MessageCircle },
      { label: 'Notifications', href: '/notifications', icon: Bell },
      { label: 'Favorites', href: '/favorites', icon: Heart },
      { label: 'Reviews', href: '/reviews', icon: Star },
    ],
  },
  {
    title: 'Seller Tools',
    icon: ChartColumnIncreasing,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    links: [
      { label: 'My Listings', href: '/dashboard/listings', icon: Package },
      { label: 'Analytics', href: '/dashboard/analytics', icon: ChartColumnIncreasing },
      { label: 'Response Dashboard', href: '/dashboard/responses', icon: Clock },
      { label: 'Promote Listing', href: '/dashboard/promote', icon: Megaphone },
      { label: 'My Store', href: '/dashboard', icon: Store },
    ],
  },
  {
    title: 'Information',
    icon: Info,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    links: [
      { label: 'About PostAll', href: '/about', icon: Info },
      { label: 'Help Center', href: '/help', icon: HelpCircle },
      { label: 'Safety Center', href: '/safety', icon: Shield },
      { label: 'Blog', href: '/blog', icon: BookOpen },
      { label: 'Terms of Service', href: '/terms', icon: Scale },
      { label: 'Privacy Policy', href: '/privacy', icon: Scale },
      { label: 'Advertise', href: '/advertise', icon: Globe },
    ],
  },
  {
    title: 'Tools',
    icon: Zap,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    links: tools.map((tool) => ({
      label: tool.name,
      href: `/tools/${tool.id}`,
      icon: getToolIcon(tool.icon),
    })),
  },
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">

      <div className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Sitemap</h1>
            <p className="text-emerald-100 text-lg max-w-md mx-auto">
              Find any page on PostAll quickly
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => {
              const SectionIcon = section.icon;
              return (
                <Card key={section.title} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className={`h-8 w-8 rounded-lg ${section.bg} flex items-center justify-center`}>
                        <SectionIcon className={`h-4 w-4 ${section.color}`} />
                      </div>
                      {section.title}
                      <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
                        {section.links.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <nav className="space-y-1 max-h-96 overflow-y-auto pr-1">
                      {section.links.map((link) => {
                        const LinkIcon = link.icon;
                        return (
                          <Link
                            key={link.href + link.label}
                            href={link.href}
                            className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors group"
                          >
                            {LinkIcon && (
                              <LinkIcon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground shrink-0" />
                            )}
                            <span className="flex-1">{link.label}</span>
                            <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                          </Link>
                        );
                      })}
                    </nav>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
