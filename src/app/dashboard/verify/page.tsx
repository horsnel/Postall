'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, type UserRole, type VerificationLevel } from '@/lib/auth-store'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Upload,
  Camera,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  CircleUserRound,
  Mail,
  Building2,
  CreditCard,
  XCircle,
  RefreshCw,
  Phone,
  Lock,
  Unlock,
  Gift,
  Star,
  Zap,
  Crown,
  AlertTriangle,
} from 'lucide-react'

const verificationLevels: {
  level: VerificationLevel
  label: string
  description: string
  icon: typeof ShieldCheck
  color: string
  bgColor: string
  borderColor: string
}[] = [
  {
    level: 'basic',
    label: 'Basic Verification',
    description: 'Verified with magic link email',
    icon: ShieldCheck,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-200',
  },
  {
    level: 'id_verified',
    label: 'ID Verified',
    description: 'Government-issued ID verified',
    icon: ShieldCheck,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-200',
  },
  {
    level: 'business_verified',
    label: 'Business Verified',
    description: 'CAC Certificate verified',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    borderColor: 'border-emerald-200',
  },
]

const documentTypes = [
  { value: 'nin', label: 'National ID (NIN)', description: 'Nigeria National Identification Number' },
  { value: 'voters_card', label: "Voter's Card", description: 'Independent National Electoral Commission' },
  { value: 'passport', label: 'International Passport', description: 'Valid Nigerian passport' },
  { value: 'drivers_license', label: "Driver's License", description: 'Federal Road Safety Corps license' },
  { value: 'cac', label: 'CAC Certificate (Business)', description: 'Corporate Affairs Commission' },
]

const rolesRequiringVerification: UserRole[] = ['seller', 'service_provider']

interface VerificationRecord {
  id: string
  type: string
  status: string
  documentUrl: string | null
  reviewedAt: string | null
  createdAt: string
}

const documentTypeLabels: Record<string, string> = {
  nin: 'National ID (NIN)',
  voters_card: "Voter's Card",
  passport: 'International Passport',
  drivers_license: "Driver's License",
  cac: 'CAC Certificate',
}

const trustScoreConfig = [
  { level: 'basic', label: 'Basic', score: 25, description: 'Email verified' },
  { level: 'phone', label: 'Phone Verified', score: 50, description: 'Phone number verified' },
  { level: 'id', label: 'ID Verified', score: 100, description: 'Government ID verified' },
]

const unlockBenefits = [
  {
    level: 'Basic (25)',
    icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
    benefits: ['Browse and post listings', 'Send and receive messages', 'Save favorites', 'Apply for tasks'],
  },
  {
    level: 'Phone Verified (50)',
    icon: <Phone className="h-4 w-4 text-blue-600" />,
    benefits: ['All Basic benefits', 'Escrow access up to ₦100K', 'Priority support', 'Verified phone badge'],
  },
  {
    level: 'ID Verified (100)',
    icon: <Crown className="h-4 w-4 text-purple-600" />,
    benefits: ['All Phone benefits', 'Unlimited escrow', 'Featured listings', 'Business account access', 'Lower platform fees'],
  },
]

export default function VerifyPage() {
  const router = useRouter()
  const { user, setUser } = useAuthStore()
  const [docType, setDocType] = useState('')
  const [idPreview, setIdPreview] = useState<string | null>(null)
  const [idFile, setIdFile] = useState<File | null>(null)
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null)
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [selfieDragOver, setSelfieDragOver] = useState(false)
  const [verificationHistory, setVerificationHistory] = useState<VerificationRecord[]>([])

  const currentLevel = user?.verificationLevel || 'basic'
  const needsIDVerification = user?.role ? rolesRequiringVerification.includes(user.role) : false

  // Calculate current trust score
  const getTrustScore = () => {
    if (currentLevel === 'id_verified' || currentLevel === 'business_verified') return 100
    if (user?.phone) return 50
    return 25
  }

  const trustScore = getTrustScore()

  // Verification steps
  const verificationSteps = [
    {
      label: 'Email Verified',
      icon: Mail,
      completed: true, // Always true since they're logged in
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
    {
      label: 'Phone Verified',
      icon: Phone,
      completed: !!user?.phone,
      color: !!user?.phone ? 'text-emerald-600' : 'text-muted-foreground',
      bgColor: !!user?.phone ? 'bg-emerald-100' : 'bg-muted',
    },
    {
      label: 'ID Document Verified',
      icon: ShieldCheck,
      completed: currentLevel === 'id_verified' || currentLevel === 'business_verified',
      color: (currentLevel === 'id_verified' || currentLevel === 'business_verified') ? 'text-emerald-600' : 'text-muted-foreground',
      bgColor: (currentLevel === 'id_verified' || currentLevel === 'business_verified') ? 'bg-emerald-100' : 'bg-muted',
      required: needsIDVerification,
    },
  ]

  // Fetch verification history
  useEffect(() => {
    if (!user?.id) return
    fetch(`/api/verify-id?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVerificationHistory(data.verifications || [])
          // Check if any verification was approved
          const approved = data.verifications?.find((v: VerificationRecord) => v.status === 'verified')
          const rejected = data.verifications?.find((v: VerificationRecord) => v.status === 'rejected')
          const pending = data.verifications?.find((v: VerificationRecord) => v.status === 'pending')

          if (approved) {
            const approvedType = approved.type
            if (approvedType === 'cac' && user) {
              setUser({ ...user, verificationLevel: 'business_verified' })
            } else if (user) {
              setUser({ ...user, verificationLevel: 'id_verified' })
            }
            setSubmitted(false)
          } else if (pending && !submitted) {
            setSubmitted(true)
          } else if (rejected) {
            setSubmitted(false)
          }
        }
      })
      .catch(() => { /* ignore */ })
  }, [user, setUser, submitted])

  const handleFileUpload = useCallback((file: File, setPreview: (val: string | null) => void, setFile: (val: File | null) => void) => {
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be under 5MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
        setFile(file)
      }
      reader.readAsDataURL(file)
    } else {
      toast.error('Please upload an image file (JPG, PNG)')
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, setPreview: (val: string | null) => void, setFile: (val: File | null) => void) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file, setPreview, setFile)
  }, [handleFileUpload])

  const handleSubmitVerification = async () => {
    if (!user || !docType || !idFile) return
    setSubmitting(true)

    try {
      // Convert file to base64 data URL for storage
      const documentUrl = idPreview || ''
      const res = await fetch('/api/verify-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          documentType: docType,
          documentUrl,
          selfieUrl: selfiePreview || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Failed to submit verification')
        setSubmitting(false)
        return
      }

      toast.success('Verification submitted! We\'ll review it within 1-2 business days.')
      setSubmitted(true)
      setIdPreview(null)
      setIdFile(null)
      setSelfiePreview(null)
      setSelfieFile(null)
      setDocType('')
    } catch {
      toast.error('Network error. Please try again.')
    }

    setSubmitting(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Redirecting...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-emerald-600" />
          Identity Verification
        </h1>
        <p className="text-muted-foreground">
          Manage your verification status and upload identity documents.
        </p>
      </div>

      {/* Verification Progress Stepper */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Verification Progress</CardTitle>
          <CardDescription>Complete all steps to maximize your Trust Score</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Connector line */}
            <div className="absolute top-5 left-6 right-6 h-0.5 bg-muted hidden sm:block" />
            <div
              className="absolute top-5 left-6 h-0.5 bg-emerald-500 transition-all duration-500 hidden sm:block"
              style={{ width: `${(verificationSteps.filter(s => s.completed).length / verificationSteps.length) * 100}%` }}
            />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4 sm:gap-0 sm:justify-between">
              {verificationSteps.map((step, idx) => {
                const Icon = step.icon
                return (
                  <div key={step.label} className="flex items-start gap-3 sm:flex-col sm:items-center sm:text-center flex-1">
                    <div className={`relative h-10 w-10 rounded-full ${step.bgColor} flex items-center justify-center shrink-0 z-10 border-2 ${step.completed ? 'border-emerald-500' : 'border-muted'}`}>
                      {step.completed ? (
                        <CheckCircle2 className={`h-5 w-5 ${step.color}`} />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                      {step.required && !step.completed && (
                        <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-rose-500 flex items-center justify-center">
                          <AlertTriangle className="h-2 w-2 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${step.completed ? step.color : 'text-muted-foreground'}`}>
                        {step.label}
                      </p>
                      {step.completed ? (
                        <Badge className={`${step.bgColor} ${step.color} border-0 text-[10px] mt-1`}>
                          <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                          Done
                        </Badge>
                      ) : step.required ? (
                        <Badge className="bg-rose-100 text-rose-700 border-0 text-[10px] mt-1">
                          Required
                        </Badge>
                      ) : (
                        <p className="text-[10px] text-muted-foreground mt-1">Optional</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust Score + Current Level Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trust Score */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4 text-emerald-600" />
              Trust Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              {/* Circular Score */}
              <div className="relative h-24 w-24 shrink-0">
                <svg className="h-24 w-24 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="currentColor" className="text-muted/30" strokeWidth="8" fill="none" />
                  <circle
                    cx="50" cy="50" r="42"
                    stroke="currentColor"
                    className={trustScore >= 100 ? 'text-emerald-500' : trustScore >= 50 ? 'text-blue-500' : 'text-amber-500'}
                    strokeWidth="8" fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(trustScore / 100) * 264} 264`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{trustScore}</span>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                {trustScoreConfig.map((item, idx) => {
                  const scores = trustScoreConfig.map(i => i.score)
                  const higher = scores.find(s => s > item.score)
                  const isCurrent = trustScore >= item.score && (!higher || trustScore < higher)
                  const isAchieved = trustScore >= item.score
                  return (
                    <div key={item.level} className="flex items-center gap-2">
                      {isAchieved ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-medium ${isAchieved ? 'text-emerald-700' : 'text-muted-foreground'}`}>
                            {item.label}
                          </span>
                          <span className={`text-xs font-bold ${isAchieved ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                            {item.score}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Verification Level */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Current Verification Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {verificationLevels.map((v) => {
                const isActive = currentLevel === v.level
                const isLocked = !isActive && (
                  v.level === 'id_verified' && currentLevel !== 'id_verified' && currentLevel !== 'business_verified'
                ) || (
                  v.level === 'business_verified' && currentLevel !== 'business_verified'
                )

                return (
                  <div
                    key={v.level}
                    className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${
                      isActive
                        ? `${v.bgColor} ${v.borderColor} border-2`
                        : isLocked
                          ? 'bg-muted/30 border-muted opacity-60'
                          : 'border-muted'
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-lg ${isActive ? v.bgColor : 'bg-muted'} flex items-center justify-center shrink-0`}>
                      {isLocked ? (
                        <ShieldX className="h-4 w-4 text-muted-foreground" />
                      ) : isActive ? (
                        <v.icon className={`h-4 w-4 ${v.color}`} />
                      ) : (
                        <CheckCircle2 className={`h-4 w-4 ${v.color}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{v.label}</p>
                        {isActive && (
                          <Badge className={`${v.bgColor} ${v.color} border-0 text-[10px]`}>
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{v.description}</p>
                    </div>
                    {isActive && <CheckCircle2 className={`h-4 w-4 ${v.color} shrink-0`} />}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* What You Unlock At Each Level */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Unlock className="h-4 w-4 text-emerald-600" />
            What You Unlock
          </CardTitle>
          <CardDescription>Higher verification levels unlock more features and higher limits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {unlockBenefits.map((tier) => (
              <div key={tier.level} className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center gap-2">
                  {tier.icon}
                  <span className="text-sm font-semibold">{tier.level}</span>
                </div>
                <ul className="space-y-1.5">
                  {tier.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ID Verification Required Notice for Business/Agent Roles */}
      {needsIDVerification && currentLevel !== 'id_verified' && currentLevel !== 'business_verified' && (
        <Card className="border-amber-300 bg-amber-50/50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-900">
                  ID Verification is REQUIRED for your account type
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  As a <span className="font-medium">{user.role.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</span>,
                  you must complete ID document verification to access all platform features including escrow, promoted listings, and business tools.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Basic Verification Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="h-4 w-4 text-emerald-600" />
            Email Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-800">You are verified with magic link email</p>
                <p className="text-xs text-emerald-700 mt-0.5">{user.email}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role-Specific Verification */}
      {needsIDVerification ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4 text-amber-600" />
              ID Document Verification
            </CardTitle>
            <CardDescription>
              As a {user.role.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}, you need to verify your identity with a government-issued ID.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {submitted ? (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-6 text-center space-y-3">
                <div className="h-14 w-14 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto">
                  <Clock className="h-7 w-7 text-amber-600" />
                </div>
                <div>
                  <p className="text-base font-semibold text-amber-900">Verification Submitted</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Your documents are being reviewed. This typically takes 1-2 business days.
                  </p>
                </div>
                <Badge className="bg-amber-200 text-amber-800 border-0">
                  <Clock className="h-3 w-3 mr-1" />
                  Pending Review
                </Badge>
              </div>
            ) : currentLevel === 'id_verified' || currentLevel === 'business_verified' ? (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-3">
                <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-7 w-7 text-emerald-600" />
                </div>
                <div>
                  <p className="text-base font-semibold text-emerald-900">Identity Verified</p>
                  <p className="text-sm text-emerald-700 mt-1">
                    Your {currentLevel === 'business_verified' ? 'CAC Certificate' : 'government-issued ID'} has been verified successfully.
                  </p>
                </div>
                <Badge className="bg-emerald-200 text-emerald-800 border-0">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
            ) : (
              <>
                {/* Document Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Document Type</Label>
                  <Select value={docType} onValueChange={setDocType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((doc) => (
                        <SelectItem key={doc.value} value={doc.value}>
                          <div>
                            <span className="font-medium">{doc.label}</span>
                            <span className="text-xs text-muted-foreground ml-2">— {doc.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* ID Document Upload */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Upload ID Document</Label>
                  {!idPreview ? (
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                        dragOver ? 'border-emerald-500 bg-emerald-50' : 'hover:border-primary/50'
                      }`}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={(e) => handleDrop(e, setIdPreview, setIdFile)}
                      onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/*'
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0]
                          if (file) handleFileUpload(file, setIdPreview, setIdFile)
                        }
                        input.click()
                      }}
                    >
                      <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm font-medium">Drag and drop or click to upload</p>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 5MB</p>
                      <p className="text-xs text-muted-foreground mt-1">Make sure all text is clearly visible</p>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border-2 border-emerald-200">
                      <img src={idPreview} alt="ID Document" className="w-full max-h-56 object-contain bg-muted/20" />
                      <button
                        onClick={() => { setIdPreview(null); setIdFile(null) }}
                        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 shadow-md"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-emerald-600 text-white">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Document Ready
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>

                {/* Selfie Upload */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-1.5">
                    <Camera className="h-3.5 w-3.5" />
                    Selfie Holding ID <span className="text-xs text-muted-foreground">(Optional but recommended)</span>
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Take a clear photo of yourself holding your ID document next to your face.
                  </p>
                  {!selfiePreview ? (
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                        selfieDragOver ? 'border-emerald-500 bg-emerald-50' : 'hover:border-primary/50'
                      }`}
                      onDragOver={(e) => { e.preventDefault(); setSelfieDragOver(true) }}
                      onDragLeave={() => setSelfieDragOver(false)}
                      onDrop={(e) => handleDrop(e, setSelfiePreview, setSelfieFile)}
                      onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/*'
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0]
                          if (file) handleFileUpload(file, setSelfiePreview, setSelfieFile)
                        }
                        input.click()
                      }}
                    >
                      <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium">Upload selfie holding your ID</p>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 5MB</p>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border-2 border-emerald-200">
                      <img src={selfiePreview} alt="Selfie with ID" className="w-full max-h-48 object-contain bg-muted/20" />
                      <button
                        onClick={() => { setSelfiePreview(null); setSelfieFile(null) }}
                        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 shadow-md"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Submit Button */}
                <Button
                  className="w-full"
                  onClick={handleSubmitVerification}
                  disabled={!docType || !idFile || submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting for Verification...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Submit for Verification
                    </>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-6 text-center space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto">
                <ShieldCheck className="h-7 w-7 text-emerald-600" />
              </div>
              <div>
                <p className="text-base font-semibold text-emerald-900">Your current verification level (Basic) is sufficient for your role</p>
                <p className="text-sm text-emerald-700 mt-1">
                  As a {user.role.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}, you have full access to all platform features.
                </p>
              </div>
              <Badge className="bg-emerald-200 text-emerald-800 border-0">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Fully Verified
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Verification History */}
      {verificationHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Verification History
              <Badge variant="secondary" className="text-[10px]">
                {verificationHistory.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {verificationHistory.map((record) => (
                <div key={record.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                    record.status === 'verified' ? 'bg-emerald-100' :
                    record.status === 'pending' ? 'bg-amber-100' :
                    'bg-rose-100'
                  }`}>
                    {record.status === 'verified' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : record.status === 'pending' ? (
                      <Clock className="h-4 w-4 text-amber-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-rose-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">
                        {documentTypeLabels[record.type] || record.type}
                      </p>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] ${
                          record.status === 'verified' ? 'bg-emerald-100 text-emerald-700' :
                          record.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {record.status === 'verified' ? 'Approved' :
                         record.status === 'pending' ? 'Pending' : 'Rejected'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Submitted {new Date(record.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {record.reviewedAt && ` · Reviewed ${new Date(record.reviewedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                    </p>
                  </div>
                  {record.status === 'rejected' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => {
                        setSubmitted(false)
                        setDocType(record.type)
                      }}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Re-submit
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Verification Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Accepted Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'National ID (NIN)', icon: CreditCard, desc: 'Nigeria National Identification Number' },
              { label: "Voter's Card", icon: FileText, desc: 'Independent National Electoral Commission' },
              { label: 'International Passport', icon: CircleUserRound, desc: 'Valid Nigerian passport' },
              { label: "Driver's License", icon: CreditCard, desc: 'Federal Road Safety Corps license' },
              { label: 'CAC Certificate', icon: Building2, desc: 'Corporate Affairs Commission (Businesses)' },
            ].map((doc) => (
              <div key={doc.label} className="flex items-start gap-3 rounded-lg border p-3">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
                  <doc.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{doc.label}</p>
                  <p className="text-xs text-muted-foreground">{doc.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Tips */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Tips for successful verification:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                Use good lighting — avoid shadows on the document
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                Ensure all text is clearly readable
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                Include the full document (all corners visible)
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                Document must not be expired
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
