'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore, userRoles, type UserRole } from '@/lib/auth-store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ShieldCheck,
  Loader2,
  Mail,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  ShoppingCart,
  Laptop,
  Zap,
  SlidersHorizontal,
  Search,
} from 'lucide-react'
import { toast } from 'sonner'

const roleIcons: Record<UserRole, typeof ShoppingCart> = {
  seller: ShoppingCart,
  freelancer: Laptop,
  errand_runner: Zap,
  service_provider: SlidersHorizontal,
  buyer: Search,
}

export default function RegisterPage() {
  const router = useRouter()
  const { user, setUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: '' as UserRole | '',
  })

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  // Don't render form if user is logged in
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Redirecting to dashboard...</div>
      </div>
    )
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isValid = formData.email.includes('@') && formData.role !== ''

  const selectedRole = userRoles.find((r) => r.id === formData.role)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    
    setLoading(true)

    // Simulate a brief delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const email = formData.email.toLowerCase()
    const username = email.split('@')[0]
    
    // Create a mock user (no database required)
    setUser({
      id: 'user-' + Date.now(),
      username: username,
      email: email,
      fullName: formData.fullName || username.charAt(0).toUpperCase() + username.slice(1),
      phone: formData.phone || '+234 800 000 0000',
      photo: null,
      city: 'Lagos',
      role: formData.role as UserRole,
      accountType: 'individual',
      isVerified: true,
      isAdmin: true,
      profileStrength: 100,
      verificationLevel: 'business_verified',
    })

    toast.success('Account created successfully!')
    router.push('/dashboard')
    setLoading(false)
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
        <div className="w-full max-w-lg space-y-6">
          <Card className="border-2 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="flex flex-col items-center space-y-4">
                <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-md">
                  <span className="text-primary-foreground font-bold text-xl">PA</span>
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    Create your account
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Enter any email to get instant access
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    Full Name <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      placeholder="e.g. Chinedu Okafor"
                      value={formData.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Email */}
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
                      onChange={(e) => updateField('email', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Password */}
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
                      onChange={(e) => updateField('password', e.target.value)}
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

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+234 801 234 5678"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Role Selector */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    How will you use PostAll?
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {userRoles.map((role) => {
                      const RoleIcon = roleIcons[role.id]
                      const isSelected = formData.role === role.id
                      return (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => updateField('role', role.id)}
                          className={`flex items-center gap-2.5 rounded-xl border-2 p-3 text-left transition-all ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 shadow-sm'
                              : 'border-muted hover:border-muted-foreground/30 bg-card'
                          }`}
                        >
                          <div
                            className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-emerald-100 dark:bg-emerald-900/50'
                                : 'bg-muted'
                            }`}
                          >
                            <RoleIcon
                              className={`h-4 w-4 ${
                                isSelected ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
                              }`}
                            />
                          </div>
                          <div className="min-w-0">
                            <p
                              className={`text-xs font-semibold truncate ${
                                isSelected ? 'text-emerald-700 dark:text-emerald-400' : ''
                              }`}
                            >
                              {role.label}
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate">
                              {role.description}
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Register Button */}
                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={!isValid || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>

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
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-2 text-muted-foreground">Already have an account?</span>
                </div>
              </div>

              <Link href="/login" className="block">
                <Button variant="outline" className="w-full">
                  Log in
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
