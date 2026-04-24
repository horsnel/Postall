'use client'

import { TrendingUp, Activity, ShoppingCart, Users, Star, Zap, ArrowUpRight } from 'lucide-react'

const stats = [
  { icon: TrendingUp, text: '2.5M+ in transactions today', color: 'text-[#0D8A5C]' },
  { icon: ShoppingCart, text: '150+ new listings this hour', color: 'text-[#0D8A5C]' },
  { icon: Star, text: '98% buyer satisfaction rate', color: 'text-[#0D8A5C]' },
  { icon: Users, text: '50,000+ active users online', color: 'text-[#0D8A5C]' },
  { icon: Zap, text: '1,200+ tasks completed today', color: 'text-[#0D8A5C]' },
  { icon: Activity, text: '25+ cities covered in Nigeria', color: 'text-[#0D8A5C]' },
]

export default function StatsTicker() {
  // Double the items for seamless loop
  const items = [...stats, ...stats]

  return (
    <div className="relative overflow-hidden bg-[#F3F4F6] border-y border-[#E5E7EB] py-3">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#F3F4F6] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#F3F4F6] to-transparent z-10 pointer-events-none" />

      <div className="animate-stats-ticker flex gap-8 whitespace-nowrap">
        {items.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div
              key={`stat-${i}`}
              className="inline-flex items-center gap-2 shrink-0 px-4 py-1 rounded-full bg-white border border-[#E5E7EB]"
            >
              <Icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-sm font-medium text-[#374151]">
                {stat.text}
              </span>
              <ArrowUpRight className="h-3 w-3 text-[#0D8A5C]" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
