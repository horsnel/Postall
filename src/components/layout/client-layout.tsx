'use client'

import { usePathname } from 'next/navigation'
import { MobileBottomNav } from './mobile-bottom-nav'
import { useAuthStore } from '@/lib/auth-store'
import Header from './header'
import Footer from './footer'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user } = useAuthStore()

  // Don't add padding for dashboard routes - they have their own layout
  const isDashboard = pathname.startsWith('/dashboard')

  // Check if on browse page - this is a public landing page for visitors
  const isBrowsePage = pathname === '/browse' || pathname === '/browse/'

  // Check if on auth pages - these should be full-page without header/footer
  const isAuthPage = pathname === '/login' || pathname === '/register' ||
                     pathname.startsWith('/auth/') || pathname.startsWith('/register/')

  // Don't show mobile bottom nav on:
  // 1. Dashboard routes (dashboard has its own sidebar)
  // 2. Auth pages (full-page authentication)
  // Browse IS included — logged-in users need nav there too
  const showMobileNav = user && !isDashboard && !isAuthPage

  // Show header and footer on all public pages (not dashboard, not auth)
  const showHeaderFooter = !isDashboard && !isAuthPage

  return (
    <div className="min-h-screen flex flex-col">
      {showHeaderFooter && <Header />}
      <div className={`flex-1 ${showMobileNav ? 'pb-[80px] md:pb-0' : ''}`}>
        {children}
      </div>
      {showHeaderFooter && <Footer />}
      {showMobileNav && <MobileBottomNav />}
    </div>
  )
}
