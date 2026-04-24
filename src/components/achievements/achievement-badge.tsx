"use client"
import { Trophy, Flame, Star, Zap, Target, Crown } from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: string
  progress?: number // 0-100
}

const achievementIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Flame,
  Star,
  Zap,
  Crown,
  Target,
  Trophy,
}

const sampleAchievements: Achievement[] = [
  { id: "first_login", title: "Welcome Aboard!", description: "Logged into PostAll", icon: "Flame", unlocked: true, unlockedAt: "2d ago" },
  { id: "first_listing", title: "First Listing", description: "Post your first item or task", icon: "Star", unlocked: true, unlockedAt: "1d ago", progress: 100 },
  { id: "first_sale", title: "First Sale!", description: "Complete your first transaction", icon: "Zap", unlocked: false, progress: 60 },
  { id: "five_star", title: "Five Star Rating", description: "Receive a 5-star review", icon: "Crown", unlocked: false, progress: 30 },
  { id: "streak_7", title: "7-Day Streak", description: "Log in 7 days in a row", icon: "Target", unlocked: false, progress: 43 },
  { id: "top_seller", title: "Top Seller", description: "Complete 10 successful sales", icon: "Trophy", unlocked: false, progress: 20 },
  { id: "social_butterfly", title: "Social Butterfly", description: "Share 5 listings on social media", icon: "Star", unlocked: false, progress: 40 },
  { id: "quick_draw", title: "Quick Draw", description: "Respond to an inquiry within 5 minutes", icon: "Zap", unlocked: false, progress: 80 },
  { id: "verified_pro", title: "Verified Pro", description: "Complete ID verification", icon: "Crown", unlocked: false, progress: 0 },
  { id: "referral_king", title: "Referral King", description: "Invite 10 friends to PostAll", icon: "Trophy", unlocked: false, progress: 10 },
  { id: "reviewer", title: "Helpful Reviewer", description: "Write 5 detailed reviews", icon: "Star", unlocked: false, progress: 20 },
  { id: "marathon", title: "30-Day Streak", description: "Log in 30 days in a row", icon: "Flame", unlocked: false, progress: 7 },
]

export { sampleAchievements, achievementIcons }
export type { Achievement }
