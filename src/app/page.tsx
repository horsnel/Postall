'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/auth-store'

export default function HomePage() {
  const router = useRouter()
  const { user } = useAuthStore()

  useEffect(() => {
    // Redirect logged-in users to dashboard
    // Unauthenticated users go to browse page
    if (user) {
      router.replace('/dashboard')
    } else {
      router.replace('/browse')
    }
  }, [user, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="h-12 w-12 rounded-full border-4 border-[#0D8A5C]/20 border-t-[#0D8A5C] animate-spin mx-auto" />
        <p className="text-muted-foreground">Loading PostAll...</p>
      </div>
    </div>
  )
}
