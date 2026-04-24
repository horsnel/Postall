'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Bell,
  MessageCircle,
  Camera,
  Package,
  MapPin,
  Wallet,
  Smartphone,
  QrCode,
  Globe,
  Mail,
  Download,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react'

const features = [
  {
    icon: Bell,
    title: 'Instant Notifications',
    description: 'Get real-time alerts for messages, price drops, and new matching listings.',
  },
  {
    icon: MessageCircle,
    title: 'Chat on the Go',
    description: 'Full messaging support so you can negotiate deals anywhere, anytime.',
  },
  {
    icon: Camera,
    title: 'Snap & Sell in Seconds',
    description: 'Take a photo, add details, and list your item in under 60 seconds.',
  },
  {
    icon: Package,
    title: 'Track Your Orders',
    description: 'Monitor your tasks, orders, and deliveries with live status updates.',
  },
  {
    icon: MapPin,
    title: 'Safe Meeting Locator',
    description: 'Find verified safe meeting spots near you for secure in-person exchanges.',
  },
  {
    icon: Wallet,
    title: 'Wallet Access',
    description: 'Manage your wallet, send and receive payments via Paystack from your phone.',
  },
]

export default function DownloadPage() {
  const [email, setEmail] = useState('')

  return (
    <div className="min-h-screen flex flex-col">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-emerald-50/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.1),rgba(0,0,0,0))]" />
        <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: text content */}
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10 gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Coming Soon
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                Get PostAll on{' '}
                <span className="text-primary">Mobile</span>
              </h1>
              <p className="text-lg text-muted-foreground mt-4 max-w-lg">
                The full PostAll marketplace experience in your pocket. Buy, sell, find work, and connect with thousands of users — all from your phone.
              </p>

              {/* Download buttons (disabled) */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Button size="lg" variant="outline" disabled className="opacity-60 cursor-not-allowed gap-3 justify-center">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] leading-tight opacity-70">Download on the</p>
                    <p className="text-sm font-semibold leading-tight">App Store</p>
                  </div>
                </Button>
                <Button size="lg" variant="outline" disabled className="opacity-60 cursor-not-allowed gap-3 justify-center">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 010 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] leading-tight opacity-70">Get it on</p>
                    <p className="text-sm font-semibold leading-tight">Google Play</p>
                  </div>
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mt-4 flex items-center gap-1.5">
                <Smartphone className="h-4 w-4" />
                <Link href="/" className="underline underline-offset-4 hover:text-primary transition-colors">
                  Already available on Web
                </Link>
              </p>
            </div>

            {/* Right: Phone mockup + QR code */}
            <div className="flex flex-col items-center gap-6">
              {/* Phone mockup placeholder */}
              <div className="relative">
                <div className="w-64 h-[500px] rounded-[40px] border-4 border-gray-800 bg-gray-900 shadow-2xl overflow-hidden">
                  {/* Status bar */}
                  <div className="bg-gray-800 px-6 pt-3 pb-2 flex items-center justify-between">
                    <span className="text-xs text-gray-400">9:41</span>
                    <div className="w-20 h-5 rounded-full bg-gray-700" />
                    <div className="flex gap-1">
                      <div className="w-4 h-2 rounded-sm bg-gray-600" />
                      <div className="w-4 h-2 rounded-sm bg-gray-600" />
                    </div>
                  </div>
                  {/* App content mockup */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-xs">PA</span>
                      </div>
                      <span className="font-bold text-white text-sm">PostAll</span>
                    </div>
                    <div className="h-9 rounded-lg bg-gray-800 flex items-center px-3">
                      <span className="text-gray-500 text-xs">Search items, tasks...</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {['For Sale', 'Gigs', 'Services', 'Jobs', 'Community', 'Fashion', 'Electronics', 'Furniture'].map((cat) => (
                        <div key={cat} className="flex flex-col items-center gap-1">
                          <div className="h-10 w-10 rounded-xl bg-gray-800 flex items-center justify-center">
                            <div className="h-4 w-4 rounded bg-gray-700" />
                          </div>
                          <span className="text-[9px] text-gray-400">{cat}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 space-y-2">
                      <p className="text-xs text-gray-400 font-medium">Recent Listings</p>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 rounded-xl bg-gray-800 p-2 flex gap-2">
                          <div className="h-full w-14 rounded-lg bg-gray-700 shrink-0" />
                          <div className="flex-1 space-y-1.5 py-1">
                            <div className="h-3 w-3/4 rounded bg-gray-700" />
                            <div className="h-2 w-1/2 rounded bg-gray-700/70" />
                            <div className="h-2 w-1/3 rounded bg-emerald-900/50" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-primary/10 rounded-[50px] blur-2xl -z-10" />
              </div>

              {/* QR Code placeholder */}
              <Card className="border-dashed">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-32 w-32 rounded-xl bg-muted flex flex-col items-center justify-center mb-3">
                    <QrCode className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">Scan to Download</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Point your camera here when the app launches
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Everything You Need on the Go</h2>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
              Full marketplace power in your pocket with features built for mobile-first.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Email signup */}
      <section className="py-16 md:py-20 bg-primary/5 border-y">
        <div className="container mx-auto px-4 max-w-xl text-center">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Bell className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Get Notified on Launch Day</h2>
          <p className="text-muted-foreground mt-2">
            Be the first to know when PostAll is available on iOS and Android. No spam, just one email.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button className="gap-2 shrink-0">
              <Mail className="h-4 w-4" />
              Notify Me
            </Button>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" />
              No spam
            </span>
            <span className="flex items-center gap-1">
              <Zap className="h-3.5 w-3.5" />
              Free forever
            </span>
            <span className="flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" />
              iOS & Android
            </span>
          </div>
        </div>
      </section>

      {/* Already on web note */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <Card className="border-dashed">
            <CardContent className="p-6">
              <Globe className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-lg">Already Available on Web</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                While the mobile app is in development, you can enjoy the full PostAll experience right in your browser. It works great on mobile browsers too!
              </p>
              <Link href="/" className="mt-4 inline-block">
                <Button variant="outline" className="gap-2">
                  <Globe className="h-4 w-4" />
                  Go to Web App
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

    </div>
  )
}
