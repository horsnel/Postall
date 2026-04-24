'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAuthStore } from '@/lib/auth-store'
import { useReferralStore } from '@/lib/referral-store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import {
  Gift,
  Copy,
  CheckCircle2,
  Users,
  DollarSign,
  Clock,
  Share2,
  MessageCircle,
  Twitter,
  ArrowRight,
  PartyPopper,
  Trophy,
  Star,
  Zap,
  Check,
  Link as LinkIcon,
  UserPlus,
} from 'lucide-react'

interface ReferralEntry {
  id: string
  name: string
  dateJoined: string
  status: 'active' | 'inactive'
  earned: number
}

const sampleReferrals: ReferralEntry[] = []

const milestones = [
  { target: 5, bonus: 1000, label: '₦1,000 bonus', icon: Star },
  { target: 20, bonus: 5000, label: '₦5,000 bonus', icon: Trophy },
]

export default function ReferralsPage() {
  const { user } = useAuthStore()
  const { referralCode, referralStats, generateCode, setReferralStats } = useReferralStore()
  const [copied, setCopied] = useState(false)
  const [referrals, setReferrals] = useState<ReferralEntry[]>(sampleReferrals)

  // Generate referral code from username
  useEffect(() => {
    if (user?.username && !referralCode) {
      generateCode(user.username)
    }
  }, [user?.username, referralCode, generateCode])

  // Fetch referral stats from API
  useEffect(() => {
    if (!user?.id) return
    fetch(`/api/referrals?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.stats) {
            setReferralStats({
              invited: data.stats.invited || 0,
              active: data.stats.active || 0,
              earned: data.stats.earned || 0,
              pending: data.stats.pending || 0,
            })
          }
          if (data.referrals) {
            setReferrals(data.referrals)
          }
        }
      })
      .catch(() => { /* use default data */ })
  }, [user?.id, setReferralStats])

  const referralLink = useMemo(() => {
    if (!referralCode) return ''
    return `${typeof window !== 'undefined' ? window.location.origin : 'https://postall.com'}/signup?ref=${referralCode}`
  }, [referralCode])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      toast.success('Referral link copied!', { description: 'Share it with your friends' })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const handleShareWhatsApp = () => {
    const text = `Join me on PostAll - Nigeria's largest marketplace! Use my referral code ${referralCode} and we both get ₦500. Sign up here: ${referralLink}`
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const handleShareTwitter = () => {
    const text = `Just joined PostAll - Nigeria's largest marketplace! Use my referral code ${referralCode} and we both get ₦500`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`
    window.open(url, '_blank')
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-6 md:p-8 text-white overflow-hidden">
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-sm mb-3">
              <Gift className="h-4 w-4" />
              <span className="font-medium">Referral Program</span>
            </div>
            <h1 className="text-2xl md:text-2xl font-bold mb-2">
              Invite Friends, Earn ₦500
            </h1>
            <p className="text-emerald-100 text-sm md:text-base max-w-md">
              Share your referral link with friends. When they sign up and verify their email, you both get ₦500 credited to your wallet!
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="h-28 w-28 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <PartyPopper className="h-14 w-14 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Referral Code + Share */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1.5">Your Referral Code</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 rounded-lg bg-emerald-50 border-2 border-emerald-200 px-4 py-3 flex items-center justify-center">
                  <span className="text-xl md:text-2xl font-bold tracking-widest text-emerald-700 font-mono">
                    {referralCode || 'LOADING...'}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 shrink-0"
                  onClick={handleCopyLink}
                >
                  {copied ? <Check className="h-5 w-5 text-emerald-600" /> : <Copy className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-1.5">Your Referral Link</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-lg border bg-muted/50 px-3 py-2.5 truncate text-sm text-muted-foreground">
                  {referralLink || 'Generating...'}
                </div>
                <Button variant="outline" size="sm" onClick={handleCopyLink} className="shrink-0 gap-1.5">
                  {copied ? <Check className="h-3.5 w-3.5" /> : <LinkIcon className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm font-medium mb-2">Share via</p>
              <div className="flex items-center gap-3 flex-wrap">
                <Button
                  variant="outline"
                  className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                  onClick={handleShareWhatsApp}
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 border-sky-200 text-sky-700 hover:bg-sky-50"
                  onClick={handleShareTwitter}
                >
                  <Twitter className="h-4 w-4" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={handleCopyLink}
                >
                  <Share2 className="h-4 w-4" />
                  Copy Link
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-2">
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-emerald-600">{referralStats.invited}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total Invited</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-emerald-600">{referralStats.active}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Active Referrals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-2">
              <DollarSign className="h-5 w-5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-amber-600">₦{referralStats.earned.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total Earned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-2">
              <Clock className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-emerald-600">₦{referralStats.pending.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Pending Payouts</p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-emerald-600" />
            Your Referrals
          </CardTitle>
          <CardDescription>People who signed up using your referral code</CardDescription>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <Users className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="font-semibold text-sm">No referrals yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Share your referral link with friends to start earning ₦500 per sign-up!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Name</TableHead>
                    <TableHead className="text-xs">Date Joined</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                    <TableHead className="text-xs text-right">Earned</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrals.map((ref) => (
                    <TableRow key={ref.id}>
                      <TableCell className="text-sm font-medium">{ref.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{ref.dateJoined}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] ${
                            ref.status === 'active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {ref.status === 'active' ? (
                            <><CheckCircle2 className="h-2.5 w-2.5 mr-0.5" /> Active</>
                          ) : (
                            'Inactive'
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-right text-emerald-600">
                        ₦{ref.earned.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: 1,
                title: 'Share Your Link',
                description: 'Send your unique referral code to friends via WhatsApp, Twitter, or any messaging app.',
                icon: Share2,
                color: 'text-emerald-600',
                bg: 'bg-emerald-100',
              },
              {
                step: 2,
                title: 'Friend Signs Up',
                description: 'Your friend clicks the link, signs up on PostAll, and verifies their email address.',
                icon: UserPlus,
                color: 'text-emerald-600',
                bg: 'bg-emerald-100',
              },
              {
                step: 3,
                title: 'Both Get ₦500',
                description: 'Once your friend verifies and completes 1 transaction, you both receive ₦500 in your wallets.',
                icon: Gift,
                color: 'text-amber-600',
                bg: 'bg-amber-100',
              },
            ].map((item) => (
              <div key={item.step} className="relative rounded-lg border p-4 text-center">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-background border flex items-center justify-center text-xs font-bold text-emerald-600">
                  {item.step}
                </div>
                <div className={`h-12 w-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mx-auto mb-3 mt-2`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold mb-1">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bonus Milestones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-600" />
            Bonus Milestones
          </CardTitle>
          <CardDescription>Invite more friends for extra rewards!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {milestones.map((milestone) => {
              const progress = Math.min((referralStats.invited / milestone.target) * 100, 100)
              const achieved = referralStats.invited >= milestone.target
              return (
                <div
                  key={milestone.target}
                  className={`rounded-lg border p-4 ${achieved ? 'bg-emerald-50 border-emerald-200' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`h-8 w-8 rounded-lg ${achieved ? 'bg-emerald-100' : 'bg-amber-100'} flex items-center justify-center`}>
                        {achieved ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <milestone.icon className="h-4 w-4 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Invite {milestone.target} friends</p>
                        <p className="text-xs text-muted-foreground">{milestone.label}</p>
                      </div>
                    </div>
                    {achieved && (
                      <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">Claimed</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${achieved ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{referralStats.invited}/{milestone.target}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Terms */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Zap className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">Referral Program Terms</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Your friend must verify their email address to qualify.</li>
                <li>Your friend must complete at least 1 transaction (listing, task, or purchase).</li>
                <li>Both you and your friend will receive ₦500 credited to your PostAll wallets.</li>
                <li>Maximum referral bonus: ₦50,000 per user.</li>
                <li>PostAll reserves the right to modify or discontinue the referral program at any time.</li>
                <li>Fraudulent referrals (self-referrals, fake accounts) will result in disqualification.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
