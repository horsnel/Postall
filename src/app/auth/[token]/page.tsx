'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth-store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Loader2, AlertCircle, ArrowRight } from 'lucide-react'

type Status = 'loading' | 'success' | 'error'

export default function AuthTokenPage() {
  const params = useParams()
  const router = useRouter()
  const { setUser } = useAuthStore()
  const token = params.token as string
  const [status, setStatus] = useState<Status>(() => (!token ? 'error' : 'loading'))
  const [redirectCount, setRedirectCount] = useState(3)

  useEffect(() => {
    if (!token) return

    // Simulate token validation
    const validateTimer = setTimeout(() => {
      // In production, this would call an API to validate the token
      // For demo, any non-empty token is valid
      if (token.length > 0) {
        setStatus('success')

        // Auto-login user
        setUser({
          id: 'demo-user-1',
          username: 'emeka_okeke',
          fullName: 'Emeka Okeke',
          email: 'emeka@example.com',
          phone: '+2348012345678',
          city: 'Lagos',
          role: 'buyer',
          accountType: 'individual',
          isVerified: true,
          isAdmin: false,
          profileStrength: 85,
          verificationLevel: 'basic',
        })
      } else {
        setStatus('error')
      }
    }, 2000)

    return () => clearTimeout(validateTimer)
  }, [token, setUser])

  // Redirect countdown after success
  useEffect(() => {
    if (status !== 'success') return

    const countdown = setInterval(() => {
      setRedirectCount((prev) => {
        if (prev <= 1) {
          clearInterval(countdown)
          router.push('/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(countdown)
  }, [status, router])

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
                    <h1 className="text-xl font-bold text-emerald-700">Login Successful!</h1>
                    <p className="text-sm text-muted-foreground">
                      Welcome back to PostAll. Redirecting you to your dashboard...
                    </p>
                  </div>

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
                      onClick={() => router.push('/dashboard')}
                    >
                      Go to Dashboard
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>

                  {/* First time prompt */}
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
                        Set Up Profile
                        <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
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
                      This magic link has expired or is invalid. Please request a new one.
                    </p>
                  </div>

                  <div className="w-full space-y-3">
                    <Link href="/login">
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
