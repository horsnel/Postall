'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Search, Plus, MessageCircle, CircleUserRound } from 'lucide-react'
import { useNotificationStore } from '@/lib/notification-store'

export function MobileBottomNav() {
  const pathname = usePathname()
  const unreadMessageCount = useNotificationStore((s) => s.unreadMessageCount)

  // Only show on non-dashboard pages (ClientLayout already gates this with showMobileNav)
  if (pathname.startsWith('/dashboard')) return null

  const tabs = [
    { href: '/browse', icon: Home, label: 'Home', active: pathname === '/browse' || pathname === '/browse/' },
    { href: '/search', icon: Search, label: 'Search', active: pathname.startsWith('/search') },
    { href: '/post-task', icon: Plus, label: 'Post', active: false, isCenter: true },
    { href: '/dashboard/messages', icon: MessageCircle, label: 'Messages', active: pathname.startsWith('/dashboard/messages') },
    { href: '/dashboard/profile', icon: CircleUserRound, label: 'Profile', active: pathname.startsWith('/dashboard/profile') },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#FFFFFF] border-t border-[#E5E7EB] h-[64px]"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-full px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const Icon = tab.icon

          if (tab.isCenter) {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex flex-col items-center justify-center -mt-[20px]"
                aria-label={tab.label}
              >
                <div className="h-14 w-14 rounded-full bg-[#0D8A5C] hover:bg-[#0D8A5C]/90 flex items-center justify-center shadow-lg shadow-[#0D8A5C]/25 transition-colors">
                  <Icon className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-[11px] font-medium text-[#0D8A5C] mt-1">Post</span>
              </Link>
            )
          }

          const isMessagesTab = tab.href === '/dashboard/messages'

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center justify-center flex-1 h-full relative"
              aria-label={tab.label}
              aria-current={tab.active ? 'page' : undefined}
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    tab.active ? 'text-[#0D8A5C]' : 'text-[#9CA3AF]'
                  }`}
                />
                {isMessagesTab && unreadMessageCount > 0 && (
                  <span className="absolute -top-2 -right-3 min-w-[18px] h-[18px] rounded-full bg-[#0D8A5C] text-white text-[10px] font-bold flex items-center justify-center px-1">
                    {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] font-medium mt-0.5 ${
                  tab.active ? 'text-[#0D8A5C]' : 'text-[#9CA3AF]'
                }`}
              >
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
