'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  Smartphone,
  Car,
  Home,
  Shirt,
  SlidersHorizontal,
  Briefcase,
  Sofa,
  Leaf,
  Heart,
  Tablet,
  type LucideIcon,
} from 'lucide-react'

interface Category {
  id: string
  name: string
  icon: LucideIcon
  count: number
}

const categories: Category[] = [
  { id: 'electronics', name: 'Electronics', icon: Smartphone, count: 12450 },
  { id: 'vehicles', name: 'Vehicles', icon: Car, count: 3520 },
  { id: 'property', name: 'Property', icon: Home, count: 3150 },
  { id: 'fashion', name: 'Fashion', icon: Shirt, count: 8900 },
  { id: 'services', name: 'Services', icon: SlidersHorizontal, count: 2500 },
  { id: 'jobs', name: 'Jobs', icon: Briefcase, count: 5000 },
  { id: 'furniture', name: 'Furniture', icon: Sofa, count: 2180 },
  { id: 'agriculture', name: 'Agriculture', icon: Leaf, count: 1670 },
  { id: 'health', name: 'Health & Beauty', icon: Heart, count: 3200 },
  { id: 'phones', name: 'Phones & Tablets', icon: Tablet, count: 9800 },
]

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`
  return String(n)
}

export default function CategoryShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section className="py-12 md:py-16 bg-[#F3F4F6]">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Browse Categories
          </h2>
          <p className="text-muted-foreground mt-2">
            Explore listings across all categories
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Link href={`/browse?category=${cat.id}`}>
                  <div className="group rounded-xl border border-[#E5E7EB] bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:border-[#0D8A5C] transition-all duration-200 cursor-pointer">
                    <div className="p-5 flex flex-col items-center text-center gap-3">
                      <div className="h-14 w-14 rounded-2xl bg-[#F3F4F6] flex items-center justify-center group-hover:bg-[#0D8A5C] transition-colors duration-200">
                        <Icon className="h-7 w-7 text-[#0D8A5C] group-hover:text-white transition-colors duration-200" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm group-hover:text-[#0D8A5C] transition-colors duration-200">
                          {cat.name}
                        </p>
                        <p className="text-xs text-[#9CA3AF] mt-0.5">
                          {formatCount(cat.count)} listings
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
