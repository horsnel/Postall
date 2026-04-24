'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore, type UserRole, type VerificationLevel } from '@/lib/auth-store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Loader2, AlertCircle, ArrowRight, ShieldCheck, Building2 } from 'lucide-react'

type Status = 'loading' | 'success' | 'expired' | 'error'

function VerifyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setUser } = useAuthStore()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<Status>(() => (!token ? 'error' : 'loading'))
  const [redirectCount, setRedirectCount] = useState(4)
  const [isFirstTime, setIsFirstTime] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [userData, setUserData] = useState<{ role?: string } | null>(null)

  useEffect(() => {
    if (!token) {
      setTimeout(() => setStatus('error'), 0)
      return
    }

    const verifyToken = async () => {
      try {
        const res = await fetch('/api/auth/verify-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        })

        const data = await res.json()

        if (!res.ok) {
          if (data.error?.includes('expired')) {
            setStatus('expired')
          } else {
            setStatus('error')
            setErrorMessage(data.error || 'Verification failed')
          }
          return
        }

        // Set user in auth store
        const userData = data.user
        setUserData(userData)
        setUser({
          id: userData.id,
          username: userData.username,
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          city: userData.city,
          role: userData.role as UserRole,
          accountType: (userData.accountType as 'individual' | 'business') || 'individual',
          isVerified: true,
          isAdmin: userData.isAdmin || false,
          profileStrength: userData.profileStrength || 25,
          verificationLevel: 'basic' as VerificationLevel,
        })

        setIsFirstTime(data.isFirstTime || false)
        setStatus('success')
      } catch (err) {
        console.error('Verification error:', err)
        setStatus('error')
        setErrorMessage('Network error. Please try again.')
      }
    }

    verifyToken()
  }, [token, setUser])

  // Check if user role requires business verification
  const businessRoles = ['service_provider']
  const isBusinessRole = businessRoles.includes(userData?.role as string || '')

  // Redirect countdown after success
  useEffect(() => {
    if (status !== 'success') return

    const countdown = setInterval(() => {
      setRedirectCount((prev) => {
        if (prev <= 1) {
          clearInterval(countdown)
          // If first time, go to role select; if business role go to verify; otherwise dashboard
          if (isFirstTime) {
            router.push('/auth/role-select')
          } else if (isBusinessRole) {
            router.push('/dashboard/verify')
          } else {
            router.push('/dashboard')
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdown)
  }, [status, isFirstTime, isBusinessRole, router])

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-background to-teal-50 -z-10" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-emerald-100/30 blur-3xl -z-10" />

        <div className="w-full max-w-md">
          <Card className="border-2 shadow-lg">
            <CardContent className="p-8">
              {/* Loading State */}
              {status === 'loading' && (
                <div className="flex flex-col items-center space-y-6 py-8">
                  <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  </div>
                  <div className="text-center space-y-2">
                    <h1 className="text-xl font-bold">Verifying your link...</h1>
                    <p className="text-sm text-muted-foreground">
                      Validating your magic link token. This will only take a moment.
                    </p>
                  </div>
                </div>
              )}

              {/* Success State */}
              {status === 'success' && (
                <div className="flex flex-col items-center space-y-6 py-4">
                  <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                  </div>
                  <div className="text-center space-y-2">
                    <h1 className="text-xl font-bold text-emerald-700">Email Verified!</h1>
                    <p className="text-sm text-muted-foreground">
                      Welcome to PostAll. Redirecting you...
                    </p>
                  </div>

                  {/* Business verification notice */}
                  {isBusinessRole && !isFirstTime && (
                    <div className="w-full rounded-lg bg-amber-50 border border-amber-200 p-4">
                      <div className="flex items-start gap-3">
                        <Building2 className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-amber-800">Business Account Verification Required</p>
                          <p className="text-xs text-amber-700 mt-1">
                            As a business account, you need to verify your ID to access all features. You&apos;ll be redirected to the verification page.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Countdown */}
                  <div className="w-full space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-sm text-muted-foreground">
                        Redirecting in {redirectCount} second{redirectCount !== 1 ? 's' : ''}...
                      </span>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => {
                        if (isFirstTime) router.push('/auth/role-select')
                        else if (isBusinessRole) router.push('/dashboard/verify')
                        else router.push('/dashboard')
                      }}
                    >
                      {isFirstTime
                        ? 'Choose Your Role'
                        : isBusinessRole
                          ? 'Verify Your Account'
                          : 'Go to Dashboard'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>

                  {/* First time prompt */}
                  {isFirstTime && (
                    <div className="w-full rounded-lg bg-emerald-50 border border-emerald-200 p-4">
                      <p className="text-sm text-emerald-700 font-medium">First time on PostAll?</p>
                      <p className="text-xs text-emerald-600 mt-1">
                        Let&apos;s set up your profile so others can find and trust you.
                      </p>
                      <Link href="/auth/setup">
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-3 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                        >
                          <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
                          Set Up Profile
                          <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Expired State */}
              {status === 'expired' && (
                <div className="flex flex-col items-center space-y-6 py-8">
                  <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center">
                    <AlertCircle className="h-10 w-10 text-amber-600" />
                  </div>
                  <div className="text-center space-y-2">
                    <h1 className="text-xl font-bold text-amber-700">Link Expired</h1>
                    <p className="text-sm text-muted-foreground">
                      This magic link has expired (valid for 30 minutes). Please request a new one.
                    </p>
                  </div>

                  <div className="w-full space-y-3">
                    <Link href="/register">
                      <Button className="w-full">
                        Request New Magic Link
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="outline" className="w-full">
                        Back to Login
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Error State */}
              {status === 'error' && (
                <div className="flex flex-col items-center space-y-6 py-8">
                  <div className="h-20 w-20 rounded-full bg-rose-100 flex items-center justify-center">
                    <AlertCircle className="h-10 w-10 text-rose-600" />
                  </div>
                  <div className="text-center space-y-2">
                    <h1 className="text-xl font-bold text-rose-700">Invalid Link</h1>
                    <p className="text-sm text-muted-foreground">
                      {errorMessage || 'This magic link is invalid or has already been used. Please request a new one.'}
                    </p>
                  </div>

                  <div className="w-full space-y-3">
                    <Link href="/register">
                      <Button className="w-full">
                        Request New Magic Link
                      </Button>
                    </Link>
                    <Link href="/">
                      <Button variant="outline" className="w-full">
                        Back to Home
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

    </div>
  )
}

export default function AuthVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  )
}
