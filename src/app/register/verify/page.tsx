'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth-store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mail, ArrowRight, RefreshCw, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react'

export default function VerifyEmailPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    if (!user || !user.email) {
      router.push('/register')
    }
  }, [user, router])

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const handleResend = async () => {
    setResendLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setResendLoading(false)
    setCountdown(60)
  }

  const handleVerify = () => {
    setVerified(true)
    setTimeout(() => {
      router.push('/auth/setup')
    }, 1500)
  }

  if (!user || !user.email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Redirecting...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-background to-teal-50 -z-10" />
        <div className="absolute top-0 left-1/3 h-96 w-96 rounded-full bg-emerald-100/40 blur-3xl -z-10" />
        <div className="absolute bottom-0 right-1/3 h-96 w-96 rounded-full bg-teal-100/40 blur-3xl -z-10" />

        <div className="w-full max-w-md space-y-6">
          <Card className="border-2 shadow-lg">
            <CardHeader className="text-center pb-2">
              <div className="flex flex-col items-center space-y-4">
                {verified ? (
                  <div className="h-16 w-16 rounded-2xl bg-emerald-100 flex items-center justify-center shadow-md">
                    <CheckCircle2 className="h-9 w-9 text-emerald-600" />
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center shadow-md">
                    <Mail className="h-9 w-9 text-primary" />
                  </div>
                )}
                <div>
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    {verified ? 'Email Verified!' : 'Check your email'}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {verified
                      ? 'Your email has been verified successfully. Redirecting to setup...'
                      : `We've sent a magic link to ${user.email}. Click it to verify your account.`}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {!verified ? (
                <>
                  {/* Email display */}
                  <div className="rounded-xl bg-muted/50 border p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Magic link sent to</p>
                    <p className="text-base font-semibold">{user.email}</p>
                  </div>

                  {/* Info message */}
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-center">
                    <p className="text-sm text-emerald-700">
                      Didn&apos;t receive the email? Check your spam folder or try resending.
                    </p>
                  </div>

                  {/* Resend button */}
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    disabled={countdown > 0 || resendLoading}
                    onClick={handleResend}
                  >
                    {resendLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Resending...
                      </>
                    ) : countdown > 0 ? (
                      <>
                        <Mail className="h-4 w-4" />
                        Resend in {countdown}s
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        Resend Link
                      </>
                    )}
                  </Button>

                  {/* Demo verify button */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-card px-2 text-muted-foreground">Demo Mode</span>
                    </div>
                  </div>

                  <Button
                    className="w-full gap-2"
                    onClick={handleVerify}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Verify Email (Demo)
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 font-medium">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Redirecting to setup...
                  </div>
                </div>
              )}

              {/* Back to register */}
              {!verified && (
                <p className="text-center text-sm text-muted-foreground">
                  Wrong email?{' '}
                  <Link href="/register" className="font-medium text-primary hover:underline">
                    Go back
                  </Link>
                </p>
              )}
            </CardContent>
          </Card>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Secure Verification</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>No Password Needed</span>
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}
