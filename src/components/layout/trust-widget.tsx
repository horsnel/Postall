'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  ShieldCheck,
  Clock,
  Star,
  Lock,
  CheckCircle2,
} from 'lucide-react'

interface TrustWidgetProps {
  /** Overall trust score 0-100 */
  score?: number
  /** Whether seller is verified */
  verified?: boolean
  /** Average response time */
  responseTime?: string
  /** Seller rating 0-5 */
  rating?: number
  /** Number of reviews */
  reviewCount?: number
  /** Whether escrow protection is available */
  escrow?: boolean
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Layout variant */
  layout?: 'horizontal' | 'vertical' | 'badge'
}

function AnimatedScoreRing({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const [animatedScore, setAnimatedScore] = useState(0)

  const sizes = {
    sm: { outer: 36, inner: 28, stroke: 4, text: 'text-xs' },
    md: { outer: 56, inner: 44, stroke: 5, text: 'text-sm' },
    lg: { outer: 72, inner: 58, stroke: 6, text: 'text-base' },
  }
  const s = sizes[size]
  const radius = (s.inner - s.stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const center = s.outer / 2

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1200
    const steps = duration / 20
    const increment = score / steps
    const timer = setInterval(() => {
      start += increment
      if (start >= score) {
        setAnimatedScore(score)
        clearInterval(timer)
      } else {
        setAnimatedScore(Math.floor(start))
      }
    }, 20)
    return () => clearInterval(timer)
  }, [inView, score])

  return (
    <div ref={ref} className="relative" style={{ width: s.outer, height: s.outer }}>
      <svg width={s.outer} height={s.outer} className="transform -rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={s.stroke}
          className="text-[#F3F4F6]"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={s.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-[#0D8A5C] transition-all duration-1000 ease-out"
          style={{ strokeDashoffset: inView ? offset : circumference, transition: 'stroke-dashoffset 1.2s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-bold ${s.text} text-[#0D8A5C]`}>
          {animatedScore}
        </span>
      </div>
    </div>
  )
}

export default function TrustWidget({
  score = 92,
  verified = true,
  responseTime = '~15min',
  rating = 4.8,
  reviewCount = 156,
  escrow = true,
  size = 'md',
  layout = 'horizontal',
}: TrustWidgetProps) {
  const isSmall = size === 'sm'

  // Badge variant - compact inline badge
  if (layout === 'badge') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F3F4F6] border border-[#E5E7EB]">
        {verified ? (
          <ShieldCheck className="h-3.5 w-3.5 text-[#0D8A5C]" />
        ) : (
          <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
        )}
        <span className="text-xs font-medium text-[#374151]">
          {verified ? 'Verified' : 'Unverified'}
        </span>
        {escrow && (
          <>
            <span className="text-[#E5E7EB] mx-0.5">|</span>
            <Lock className="h-3 w-3 text-[#0D8A5C]" />
            <span className="text-[10px] text-[#9CA3AF]">Escrow</span>
          </>
        )}
      </div>
    )
  }

  // Vertical variant
  if (layout === 'vertical') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-3 p-4 rounded-xl border bg-card"
      >
        <AnimatedScoreRing score={score} size={size} />
        <div className="flex flex-col items-center gap-2 w-full">
          {verified && (
            <div className="flex items-center gap-1.5 text-sm">
              <CheckCircle2 className="h-4 w-4 text-[#22C55E]" />
              <span className="font-medium">Verified Seller</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-foreground">{rating}</span>
            <span>({reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-[#9CA3AF]" />
            <span>{responseTime}</span>
          </div>
          {escrow && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Lock className="h-4 w-4 text-[#3B82F6]" />
              <span>Escrow Protected</span>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  // Horizontal variant (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 p-3 rounded-xl border bg-card"
    >
      <AnimatedScoreRing score={score} size={size} />
      <div className="flex flex-col gap-1.5 min-w-0">
        {/* Verified badge */}
        <div className="flex items-center gap-1.5">
          {verified ? (
            <>
              <ShieldCheck className="h-4 w-4 text-[#0D8A5C] shrink-0" />
              <span className={`font-medium ${isSmall ? 'text-xs' : 'text-sm'} truncate`}>Verified Seller</span>
            </>
          ) : (
            <span className={`text-muted-foreground ${isSmall ? 'text-xs' : 'text-sm'}`}>Not verified</span>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            <Star className={`h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B] shrink-0`} />
            <span className={`font-semibold ${isSmall ? 'text-xs' : 'text-sm'}`}>{rating}</span>
            <span className={`text-muted-foreground ${isSmall ? 'text-[10px]' : 'text-xs'}`}>({reviewCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-[#9CA3AF] shrink-0" />
            <span className={`text-muted-foreground ${isSmall ? 'text-xs' : 'text-sm'}`}>{responseTime}</span>
          </div>
          {escrow && (
            <div className="flex items-center gap-1">
              <Lock className="h-3.5 w-3.5 text-[#3B82F6] shrink-0" />
              <span className={`text-muted-foreground ${isSmall ? 'text-xs' : 'text-sm'}`}>Escrow</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
