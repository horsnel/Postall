'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore, userRoles, type UserRole } from '@/lib/auth-store'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ShoppingCart,
  Laptop,
  Home,
  Zap,
  SlidersHorizontal,
  Search,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Building2,
  AlertCircle,
  type LucideIcon,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const iconMap: Record<string, LucideIcon> = {
  ShoppingCart,
  Laptop,
  Home,
  Zap,
  SlidersHorizontal,
  Search,
}

const roleColorMap: Record<string, { border: string; bg: string; text: string; glow: string; ring: string }> = {
  seller: {
    border: 'border-amber-400',
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    glow: 'shadow-amber-200/60',
    ring: 'ring-amber-400/30',
  },
  freelancer: {
    border: 'border-emerald-400',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    glow: 'shadow-emerald-200/60',
    ring: 'ring-emerald-400/30',
  },
  errand_runner: {
    border: 'border-teal-400',
    bg: 'bg-teal-50',
    text: 'text-teal-600',
    glow: 'shadow-teal-200/60',
    ring: 'ring-teal-400/30',
  },
  service_provider: {
    border: 'border-cyan-400',
    bg: 'bg-cyan-50',
    text: 'text-cyan-600',
    glow: 'shadow-cyan-200/60',
    ring: 'ring-cyan-400/30',
  },
  buyer: {
    border: 'border-rose-400',
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    glow: 'shadow-rose-200/60',
    ring: 'ring-rose-400/30',
  },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const rolesRequiringVerification: UserRole[] = ['service_provider']

export default function RoleSelectPage() {
  const router = useRouter()
  const { user, setUser } = useAuthStore()
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const handleContinue = () => {
    if (!selectedRole || !user) return
    setUser({ ...user, role: selectedRole })
    router.push('/dashboard')
  }

  const selectedRoleRequiresVerification = selectedRole
    ? rolesRequiringVerification.includes(selectedRole)
    : false

  const selectedRoleLabel = selectedRole
    ? userRoles.find((r) => r.id === selectedRole)?.label || selectedRole
    : ''

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Redirecting...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 px-4 py-8 md:py-16 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-background to-teal-50 -z-10" />
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-100/30 blur-3xl -z-10" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-teal-100/20 blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4 mb-12"
          >
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 px-4 py-1.5 text-sm">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Welcome, {user.fullName || user.username}!
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              How do you want to use{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                PostAll
              </span>
              ?
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose your primary role to personalize your dashboard experience. 
              You can always change this later in your settings.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Your data is secure and can be updated anytime</span>
            </div>
          </motion.div>

          {/* Role Cards Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-10"
          >
            {userRoles.map((role) => {
              const Icon = iconMap[role.icon] || Zap
              const isSelected = selectedRole === role.id
              const colors = roleColorMap[role.id]

              return (
                <motion.div key={role.id} variants={itemVariants}>
                  <Card
                    onClick={() => setSelectedRole(role.id)}
                    className={`
                      relative cursor-pointer transition-all duration-300 overflow-hidden group
                      ${isSelected
                        ? `${colors.border} ${colors.bg} ring-4 ${colors.ring} shadow-lg ${colors.glow} scale-[1.02]`
                        : 'border-2 border-transparent hover:border-muted-foreground/20 hover:shadow-md'
                      }
                    `}
                  >
                    {/* Selected checkmark */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute top-3 right-3 z-10"
                        >
                          <div className={`h-6 w-6 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center`}>
                            <CheckCircle2 className="h-5 w-5" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <CardContent className="p-5 md:p-6 flex flex-col items-center text-center space-y-3">
                      {/* Icon */}
                      <div
                        className={`
                          h-14 w-14 md:h-16 md:w-16 rounded-2xl flex items-center justify-center transition-all duration-300
                          ${isSelected
                            ? `${colors.bg} ${colors.text} shadow-sm`
                            : 'bg-muted group-hover:bg-primary/10'
                          }
                        `}
                      >
                        <Icon className={`h-7 w-7 md:h-8 md:w-8 transition-colors ${isSelected ? colors.text : 'text-muted-foreground group-hover:text-primary'}`} />
                      </div>

                      {/* Label */}
                      <h3 className={`font-semibold text-sm md:text-base ${isSelected ? colors.text : ''}`}>
                        {role.label}
                      </h3>

                      {/* Description */}
                      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                        {role.description}
                      </p>

                      {/* Select Button */}
                      <Button
                        variant={isSelected ? 'default' : 'outline'}
                        size="sm"
                        className={`mt-1 w-full transition-all ${
                          isSelected
                            ? 'shadow-sm'
                            : 'group-hover:border-primary/40'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Select'}
                        {isSelected && <CheckCircle2 className="h-3.5 w-3.5 ml-1.5" />}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Verification Notice for business roles */}
          <AnimatePresence>
            {selectedRoleRequiresVerification && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8 overflow-hidden"
              >
                <Card className="border-2 border-amber-300 bg-amber-50/50">
                  <CardContent className="p-5 md:p-6 flex gap-4 items-start">
                    <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                      <Building2 className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-amber-900">Identity Verification Required</h3>
                        <Badge className="bg-amber-200 text-amber-800 border-0 text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Required
                        </Badge>
                      </div>
                      <p className="text-sm text-amber-800 leading-relaxed">
                        As a <strong>{selectedRoleLabel}</strong>, you&apos;ll need to complete identity verification with a valid government-issued ID (NIN, Voter&apos;s Card, International Passport, or CAC Certificate for businesses). You can complete this verification from your dashboard after setup.
                      </p>
                      <div className="flex items-center gap-4 text-xs text-amber-700">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          NIN / Voter&apos;s Card
                        </span>
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          International Passport
                        </span>
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          CAC Certificate
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!selectedRole}
              className={`gap-2 px-12 text-base transition-all ${
                selectedRole
                  ? 'shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-200/60'
                  : ''
              }`}
            >
              Continue to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
            <p className="text-sm text-muted-foreground">
              You can change your role anytime from{' '}
              <Link href="/dashboard/settings" className="text-primary hover:underline font-medium">
                Settings
              </Link>
            </p>
          </motion.div>
        </div>
      </main>

    </div>
  )
}
