"use client"
import { ShieldCheck, BadgeCheck, Award, Star, Crown, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type BadgeType = 'verified' | 'id_checked' | 'top_performer' | 'business' | 'featured' | 'quick_responder'

interface VerificationBadgeProps {
  type: BadgeType
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  animated?: boolean
  className?: string
}

export function VerificationBadge({ type, size = "sm", showLabel = false, animated = false, className }: VerificationBadgeProps) {
  const configs: Record<BadgeType, { icon: typeof ShieldCheck; label: string; colors: string; bgColor: string }> = {
    verified: {
      icon: ShieldCheck,
      label: "Verified Seller",
      colors: "text-emerald-600",
      bgColor: "bg-emerald-50 border-emerald-200",
    },
    id_checked: {
      icon: BadgeCheck,
      label: "ID Checked",
      colors: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-200",
    },
    top_performer: {
      icon: Award,
      label: "Top Performer",
      colors: "text-amber-600",
      bgColor: "bg-amber-50 border-amber-200",
    },
    business: {
      icon: Crown,
      label: "Business Account",
      colors: "text-purple-600",
      bgColor: "bg-purple-50 border-purple-200",
    },
    featured: {
      icon: Star,
      label: "Featured",
      colors: "text-orange-600",
      bgColor: "bg-orange-50 border-orange-200",
    },
    quick_responder: {
      icon: Zap,
      label: "Quick Responder",
      colors: "text-cyan-600",
      bgColor: "bg-cyan-50 border-cyan-200",
    },
  }

  const config = configs[type]
  const Icon = config.icon
  const sizeClasses = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" }

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1 border",
        config.bgColor,
        config.colors,
        size === "lg" ? "px-2 py-1 text-xs" : "px-1.5 py-0.5 text-[10px]",
        animated && "badge-pulse",
        className
      )}
    >
      <Icon className={cn(sizeClasses[size], "shrink-0")} />
      {showLabel && <span className="font-medium">{config.label}</span>}
    </Badge>
  )
}

// Composite badge row for user profiles
export function UserBadgeRow({ verificationLevel, rating, responseTime, className }: {
  verificationLevel?: string
  rating?: number
  responseTime?: string
  className?: string
}) {
  const badges: BadgeType[] = []
  if (verificationLevel === 'basic' || verificationLevel === 'id_verified' || verificationLevel === 'business_verified') {
    badges.push('verified')
  }
  if (verificationLevel === 'id_verified') {
    badges.push('id_checked')
  }
  if (verificationLevel === 'business_verified') {
    badges.push('business')
  }
  if (rating && rating >= 4.5) {
    badges.push('top_performer')
  }
  if (responseTime && parseInt(responseTime) <= 30) {
    badges.push('quick_responder')
  }

  return (
    <div className={cn("flex items-center gap-1 flex-wrap", className)}>
      {badges.map((type) => (
        <VerificationBadge key={type} type={type} size="sm" />
      ))}
    </div>
  )
}
