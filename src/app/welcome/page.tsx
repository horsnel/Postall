'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Zap,
  Users,
  Lock,
  Bitcoin,
  Bot,
  MapPin,
  ArrowRight,
  Sparkles,
  Shield,
  Star,
  TrendingUp,
  Globe,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const features = [
  {
    icon: Zap,
    title: 'Post Tasks & Hire',
    description: 'Post tasks and have talented people compete for them',
    color: 'from-emerald-400 to-emerald-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
  },
  {
    icon: Users,
    title: 'Swipe to Pick',
    description: 'Tinder-style swiping to pick the best person for your job',
    color: 'from-teal-400 to-teal-600',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-600',
  },
  {
    icon: Lock,
    title: 'Secure Escrow',
    description: 'Your money is safe until the job is done',
    color: 'from-cyan-400 to-cyan-600',
    bgColor: 'bg-cyan-50',
    textColor: 'text-cyan-600',
  },
  {
    icon: Bitcoin,
    title: 'Easy Payments',
    description: 'Naira payments via Paystack — fast and secure',
    color: 'from-amber-400 to-amber-600',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
  },
  {
    icon: Bot,
    title: '24 Free Tools',
    description: 'AI assistant, price checker, safe spots and more',
    color: 'from-orange-400 to-orange-600',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
  },
  {
    icon: MapPin,
    title: 'Built for Africa',
    description: 'Lagos, Abuja, Port Harcourt, Ibadan — we\'re local',
    color: 'from-rose-400 to-rose-600',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-600',
  },
]

const statsData = [
  { value: '10,000+', label: 'Users', icon: Users },
  { value: '25+', label: 'Cities', icon: Globe },
  { value: '₦500M+', label: 'Transactions', icon: TrendingUp },
  { value: '4.8', label: 'Average Rating', icon: Star },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
}

const featureVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
}

const headlines = [
  'The Future of Marketplace',
  'Hire. Sell. Earn.',
  'Africa\'s Smartest Platform',
  'Built for You',
]

function useTypewriter(words: string[], typingSpeed = 80, pauseDuration = 2500) {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = words[wordIndex]
    let timeout: NodeJS.Timeout

    if (!isDeleting && text === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration)
    } else if (isDeleting && text === '') {
      timeout = setTimeout(() => {
        setIsDeleting(false)
        setWordIndex((prev) => (prev + 1) % words.length)
      }, 300)
    } else {
      timeout = setTimeout(
        () => {
          setText(isDeleting ? currentWord.slice(0, text.length - 1) : currentWord.slice(0, text.length + 1))
        },
        isDeleting ? typingSpeed / 2 : typingSpeed
      )
    }

    return () => clearTimeout(timeout)
  }, [text, wordIndex, isDeleting, words, typingSpeed, pauseDuration])

  return text
}

export default function WelcomePage() {
  const displayText = useTypewriter(headlines, 70, 2800)

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
      {/* Hero Background Image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900" />
        <img src="/images/welcome-hero.png" alt="PostAll African marketplace" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between px-6 md:px-12 py-6"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <span className="text-white font-bold text-lg">PA</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">PostAll</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                Log In
              </Button>
            </Link>
            <Link href="/auth/setup">
              <Button className="bg-white text-emerald-900 hover:bg-white/90 shadow-lg shadow-white/20 gap-1.5">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 py-12 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Badge className="bg-white/10 text-emerald-300 border-white/20 px-4 py-1.5 text-sm backdrop-blur-sm mb-8">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Africa&apos;s #1 Marketplace Platform
            </Badge>
          </motion.div>

          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3, type: 'spring', stiffness: 100 }}
            className="mb-8"
          >
            <div className="h-24 w-24 md:h-32 md:w-32 rounded-3xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40">
              <span className="text-white font-black text-4xl md:text-5xl">PA</span>
            </div>
          </motion.div>

          {/* Typewriter Headline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-4"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight">
              {displayText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                className="inline-block w-1 md:w-2 h-8 md:h-14 bg-emerald-400 ml-2 align-middle"
              />
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-lg md:text-xl text-white/70 max-w-2xl mb-10 leading-relaxed"
          >
            Post tasks, sell items, offer services, and hire talent — all in one place.
            Secure escrow, Paystack payments, and 24 free tools included.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-16"
          >
            <Link href="/auth/setup">
              <Button size="lg" className="bg-white text-emerald-900 hover:bg-white/90 shadow-xl shadow-white/20 gap-2 px-8 h-12 text-base font-semibold">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white gap-2 px-8 h-12 text-base backdrop-blur-sm"
              >
                Already have an account? <span className="font-semibold">Log In</span>
              </Button>
            </Link>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-5xl w-full mb-16"
          >
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  variants={featureVariants}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group"
                >
                  <div className="rounded-2xl bg-white/[0.07] backdrop-blur-md border border-white/[0.12] p-6 hover:bg-white/[0.12] transition-all duration-300 h-full">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="max-w-4xl w-full"
          >
            <div className="rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/[0.1] p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {statsData.map((stat, i) => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.label} className="text-center">
                      <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                        <Icon className="h-5 w-5 text-emerald-400" />
                      </div>
                      <p className="text-2xl md:text-3xl font-bold text-white flex items-center justify-center gap-1">
                        {stat.value}
                        {stat.label === 'Average Rating' && <Star className="h-5 w-5 fill-amber-400 text-amber-400" />}
                      </p>
                      <p className="text-sm text-white/50 mt-1">{stat.label}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.8 }}
            className="mt-12 mb-8"
          >
            <p className="text-white/40 text-sm">
              Trusted by thousands across Africa &middot; Free to join &middot; No hidden fees
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
