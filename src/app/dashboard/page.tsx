'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useAuthStore, type UserRole } from '@/lib/auth-store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SellerHome } from '@/components/dashboard/seller-home'
import { FreelancerHome } from '@/components/dashboard/freelancer-home'
import { AgentHome } from '@/components/dashboard/agent-home'
import { ErrandHome } from '@/components/dashboard/errand-home'
import { ProviderHome } from '@/components/dashboard/provider-home'
import { BuyerHome } from '@/components/dashboard/buyer-home'
import { toast } from 'sonner'
import {
  CircleUserRound,
  ArrowRight,
  Sparkles,
  Flame,
  Gift,
  Check,
  X,
} from 'lucide-react'

const roleHomeMap: Record<UserRole, React.ComponentType> = {
  seller: SellerHome,
  freelancer: FreelancerHome,
  errand_runner: ErrandHome,
  service_provider: ProviderHome,
  buyer: BuyerHome,
}

function getInitialBonusState() {
  if (typeof window === 'undefined') return { streakDays: 3, claimed: false }
  const maxStreak = 7
  const today = new Date().toDateString()
  const lastClaim = localStorage.getItem('postall-daily-bonus')
  const claimedToday = lastClaim === today

  let streakDays = 3
  const storedStreak = localStorage.getItem('postall-login-streak')
  if (storedStreak) {
    const parsed = parseInt(storedStreak)
    if (!isNaN(parsed)) {
      const lastDate = localStorage.getItem('postall-streak-date')
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      if (lastDate === yesterday.toDateString() || lastDate === today) {
        streakDays = Math.min(parsed, maxStreak)
      }
    }
  }

  return { streakDays, claimed: claimedToday }
}

function DailyBonusBanner() {
  const [streakDays, setStreakDays] = useState(() => getInitialBonusState().streakDays)
  const [claimed, setClaimed] = useState(() => getInitialBonusState().claimed)
  const [showConfetti, setShowConfetti] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const maxStreak = 7
  const bonusPerDay = 50
  const totalBonus = bonusPerDay * maxStreak

  const handleClaimBonus = useCallback(() => {
    if (claimed) return

    const today = new Date().toDateString()
    localStorage.setItem('postall-daily-bonus', today)

    const newStreak = Math.min(streakDays + 1, maxStreak)
    localStorage.setItem('postall-login-streak', String(newStreak))
    localStorage.setItem('postall-streak-date', today)
    setStreakDays(newStreak)
    setClaimed(true)
    setShowConfetti(true)

    toast.success('₦50 added to your wallet!', {
      description: `Day ${newStreak} bonus claimed. Keep your streak going!`,
    })

    setTimeout(() => setShowConfetti(false), 3000)
  }, [claimed, streakDays])

  if (dismissed) return null

  return (
    <>
      {/* Confetti animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <ConfettiEffect />
        </div>
      )}

      <Card className="relative overflow-hidden border-2 border-emerald-200 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-3 right-3 h-6 w-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors z-10"
        >
          <X className="h-3.5 w-3.5 text-white" />
        </button>

        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

        <CardContent className="p-4 md:p-5">
          <div className="flex items-center gap-4">
            {/* Streak icon */}
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0 backdrop-blur-sm">
              <Flame className="h-6 w-6 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-bold text-sm md:text-base">Daily Bonus!</h3>
                <Badge className="bg-white/20 text-white border-0 text-[10px]">
                  Day {streakDays} of {maxStreak}
                </Badge>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 h-2 rounded-full bg-white/20 overflow-hidden max-w-[200px]">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-700"
                    style={{ width: `${(streakDays / maxStreak) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-emerald-100 shrink-0">
                  ₦{bonusPerDay}/day · ₦{totalBonus} total
                </span>
              </div>

              <div className="flex items-center gap-1">
                {Array.from({ length: maxStreak }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all ${
                      i < streakDays
                        ? 'bg-white text-emerald-600 shadow-sm'
                        : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {i < streakDays ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      '₦'
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Claim button */}
            <Button
              size="sm"
              onClick={handleClaimBonus}
              disabled={claimed}
              className={`shrink-0 gap-1.5 ${
                claimed
                  ? 'bg-white/20 text-white/70'
                  : 'bg-white text-emerald-600 hover:bg-emerald-50 shadow-lg'
              }`}
            >
              {claimed ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Claimed
                </>
              ) : (
                <>
                  <Gift className="h-3.5 w-3.5" />
                  Claim ₦50
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

function ConfettiEffect() {
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 500,
    duration: 1500 + Math.random() * 2000,
    color: ['#10B981', '#F59E0B', '#3B82F6', '#EC4899', '#8B5CF6', '#EF4444'][Math.floor(Math.random() * 6)],
    size: 6 + Math.random() * 8,
  }))

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti rounded-sm"
          style={{
            left: `${p.left}%`,
            top: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}ms`,
            animationDuration: `${p.duration}ms`,
          }}
        />
      ))}
    </>
  )
}

export default function DashboardHome() {
  const { user } = useAuthStore()

  // No user — handled by layout auth gate, but just in case
  if (!user) {
    return null
  }

  // No role selected — show setup prompt
  if (!user.role) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-20 w-20 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
            <CircleUserRound className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Complete Your Setup</h2>
          <p className="text-muted-foreground mt-2 max-w-md">
            Choose how you&apos;d like to use PostAll to get a personalized dashboard experience tailored to your needs.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <Link href="/auth/role-select">
              <Button size="lg" className="gap-2 shadow-lg shadow-emerald-200/50">
                <Sparkles className="h-4 w-4" />
                Choose Your Role
              </Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            You previously set up your profile. Just pick a role to continue.
          </p>
        </div>
      </div>
    )
  }

  // Render role-specific home with daily bonus
  const RoleHome = roleHomeMap[user.role] || BuyerHome
  return (
    <div className="space-y-6">
      <DailyBonusBanner />
      <RoleHome />
    </div>
  )
}
