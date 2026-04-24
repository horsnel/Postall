'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShieldCheck, Mail, Lock, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const { user, setUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email) {
      toast.error('Please enter an email')
      return
    }

    setLoading(true)

    // Simulate a brief delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Generate a mock user from any email
    const email = formData.email.toLowerCase()
    const username = email.split('@')[0]
    
    setUser({
      id: 'user-' + Date.now(),
      username: username,
      email: email,
      fullName: username.charAt(0).toUpperCase() + username.slice(1),
      phone: '+234 800 000 0000',
      photo: null,
      city: 'Lagos',
      role: 'buyer',
      accountType: 'individual',
      isVerified: true,
      isAdmin: true,
      profileStrength: 100,
      verificationLevel: 'business_verified',
    })

    toast.success('Welcome to PostAll!')
    router.push('/dashboard')
    setLoading(false)
  }

  // Don't render anything if user is logged in (redirecting)
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Redirecting to dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-background to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 -z-10" />
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-emerald-100/40 dark:bg-emerald-900/20 blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-teal-100/40 dark:bg-teal-900/20 blur-3xl -z-10" />

      {/* Back to Browse Link */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6">
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Browse
        </Link>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          {/* Logo + Heading Card */}
          <Card className="border-2 shadow-lg">
            <CardContent className="p-8 space-y-6">
              {/* Logo */}
              <div className="flex flex-col items-center space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-md">
                  <span className="text-primary-foreground font-bold text-xl">PA</span>
                </div>
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-bold tracking-tight">Welcome to PostAll</h1>
                  <p className="text-muted-foreground text-sm">
                    Enter any email to get instant access
                  </p>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="any@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Any password works"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full h-11" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Instant Access</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Full Features</span>
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground">New to PostAll?</span>
                </div>
              </div>

              {/* Sign up link */}
              <Link href="/register" className="block">
                <Button variant="outline" className="w-full">
                  Create a new account
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Footer text */}
          <p className="text-xs text-center text-muted-foreground px-4">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
          </p>
        </div>
      </main>
    </div>
  )
}
