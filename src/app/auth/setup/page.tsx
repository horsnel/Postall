'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/auth-store'
import { cities } from '@/lib/constants'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  User,
  CircleUserRound,
  Camera,
  FileText,
  MapPin,
  Bell,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
  Loader2,
  Sparkles,
  Upload,
  X,
  Mail,
  Phone,
  ShieldCheck,
} from 'lucide-react'

const steps = [
  { id: 0, title: 'Account Info', icon: CircleUserRound },
  { id: 1, title: 'Username', icon: User },
  { id: 2, title: 'Photo', icon: Camera },
  { id: 3, title: 'Bio', icon: FileText },
  { id: 4, title: 'City', icon: MapPin },
  { id: 5, title: 'Notifications', icon: Bell },
]

const usernameSuggestions = [
  'emeka_creates',
  'lagos_hustler',
  'task_master_ng',
  'the_handshake',
  'deals_on_deals',
  'quick_fix_pro',
]

export default function AuthSetupPage() {
  const router = useRouter()
  const { setUser, user } = useAuthStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    username: user?.username || '',
    bio: '',
    city: user?.city || '',
    notifyTasks: true,
    notifyMessages: true,
    notifyPromos: false,
    notifyCommunity: true,
  })

  const totalSteps = steps.length
  const progressValue = ((currentStep + 1) / totalSteps) * 100

  const updateField = useCallback((field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handlePhotoUpload = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handlePhotoUpload(file)
  }, [handlePhotoUpload])

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.fullName.trim().length >= 2 && formData.email.includes('@') && formData.phone.length >= 8
      case 1: return formData.username.trim().length >= 3
      case 2: return true
      case 3: return true
      case 4: return formData.city !== ''
      case 5: return true
      default: return false
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setUser({
      id: user?.id || 'demo-user-1',
      username: formData.username.toLowerCase().replace(/\s+/g, '_'),
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      photo: photoPreview || undefined,
      city: formData.city,
      role: user?.role || 'buyer',
      accountType: user?.accountType || 'individual',
      isVerified: true,
      isAdmin: false,
      profileStrength: 100,
      verificationLevel: user?.verificationLevel || 'basic',
    })

    setLoading(false)
    router.push('/auth/role-select')
  }

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 px-4 py-8 md:py-12 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-background to-teal-50 -z-10" />
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-emerald-100/30 blur-3xl -z-10" />

        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Set Up Your Profile</h1>
            <p className="text-muted-foreground">
              Let&apos;s get your account ready so others can find and trust you.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Step {currentStep + 1} of {totalSteps}</span>
              <span>{Math.round(progressValue)}% complete</span>
            </div>
            <Progress value={progressValue} className="h-2" />
            <div className="flex items-center justify-between">
              {steps.map((step) => {
                const StepIcon = step.icon
                const isActive = step.id === currentStep
                const isDone = step.id < currentStep
                return (
                  <button
                    key={step.id}
                    onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                    className={`flex flex-col items-center gap-1.5 transition-all ${
                      isActive ? 'scale-110' : isDone ? 'cursor-pointer opacity-70 hover:opacity-100' : 'opacity-40'
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : isDone
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-muted text-muted-foreground'
                    }`}>
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <StepIcon className="h-4 w-4" />
                      )}
                    </div>
                    <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Step Content */}
          <Card className="border-2">
            <CardContent className="p-6 md:p-8">
              {/* Step 0: Account Info */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <CircleUserRound className="h-5 w-5 text-primary" />
                      Account Information
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Review and confirm your registration details. Your email has been verified via magic link.
                    </p>
                  </div>

                  {/* Email Verified Badge */}
                  <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="text-sm font-medium text-emerald-800">Email Verified</span>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-0 ml-auto">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="setup-fullName" className="text-sm font-medium">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="setup-fullName"
                        placeholder="Your full name"
                        value={formData.fullName}
                        onChange={(e) => updateField('fullName', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="setup-email" className="text-sm font-medium">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="setup-email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className="pl-10"
                        disabled={!!user?.isVerified}
                      />
                    </div>
                    {user?.isVerified && (
                      <p className="text-xs text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified — cannot be changed
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="setup-phone" className="text-sm font-medium">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="setup-phone"
                        type="tel"
                        placeholder="+234 801 234 5678"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Username */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Choose your username
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      This is how others will see you on PostAll.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
                      <Input
                        id="username"
                        placeholder="your_username"
                        value={formData.username}
                        onChange={(e) => updateField('username', e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      3+ characters, letters, numbers, underscores only.
                    </p>
                  </div>

                  {/* AI Username Suggestions */}
                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      AI Suggestions
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {usernameSuggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          onClick={() => updateField('username', suggestion)}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all hover:border-primary hover:bg-primary/5 ${
                            formData.username === suggestion ? 'border-primary bg-primary/10 text-primary' : ''
                          }`}
                        >
                          @{suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Photo Upload */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Camera className="h-5 w-5 text-primary" />
                      Add a profile photo
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Optional, but verified profiles with photos get 3x more responses.
                    </p>
                  </div>

                  {!photoPreview ? (
                    <div
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                        dragOver
                          ? 'border-primary bg-primary/5 scale-[1.02]'
                          : 'border-muted-foreground/25 hover:border-primary/50'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/*'
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0]
                          if (file) handlePhotoUpload(file)
                        }
                        input.click()
                      }}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Drag and drop your photo here</p>
                          <p className="text-xs text-muted-foreground mt-1">or click to browse (JPG, PNG up to 5MB)</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <img
                          src={photoPreview}
                          alt="Profile preview"
                          className="h-32 w-32 rounded-full object-cover border-4 border-emerald-200"
                        />
                        <button
                          onClick={() => setPhotoPreview(null)}
                          className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground">Looking great! Click X to change.</p>
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => setCurrentStep(3)}
                  >
                    Skip for now
                  </Button>
                </div>
              )}

              {/* Step 3: Bio */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Tell us about yourself
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Optional bio to help others know what you do.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="I'm a freelance developer based in Lagos. I love building web apps and helping startups launch their MVPs..."
                      value={formData.bio}
                      onChange={(e) => updateField('bio', e.target.value)}
                      rows={5}
                      maxLength={300}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {formData.bio.length}/300 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      Quick templates
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Freelancer looking for gigs',
                        'Small business owner',
                        'Student looking for part-time work',
                        'Full-time professional',
                      ].map((template) => (
                        <button
                          key={template}
                          onClick={() => updateField('bio', template)}
                          className="inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-all hover:border-primary hover:bg-primary/5"
                        >
                          {template}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => setCurrentStep(4)}
                  >
                    Skip for now
                  </Button>
                </div>
              )}

              {/* Step 4: City */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Confirm your city
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      This helps us show you relevant tasks and items nearby.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city-select">City</Label>
                    <Select value={formData.city} onValueChange={(v) => updateField('city', v)}>
                      <SelectTrigger id="city-select">
                        <SelectValue placeholder="Select your city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.name} value={city.name}>
                            {city.name}, {city.country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Popular cities</Label>
                    <div className="flex flex-wrap gap-2">
                      {cities.slice(0, 5).map((city) => (
                        <button
                          key={city.name}
                          onClick={() => updateField('city', city.name)}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all hover:border-primary hover:bg-primary/5 ${
                            formData.city === city.name ? 'border-primary bg-primary/10 text-primary' : ''
                          }`}
                        >
                          <MapPin className="h-3 w-3" />
                          {city.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Notifications */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      Notification preferences
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Choose what you want to be notified about.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        key: 'notifyTasks',
                        title: 'New tasks & opportunities',
                        desc: 'Get notified when new tasks matching your interests are posted.',
                      },
                      {
                        key: 'notifyMessages',
                        title: 'Messages',
                        desc: 'Get notified when someone messages you.',
                      },
                      {
                        key: 'notifyCommunity',
                        title: 'Community updates',
                        desc: 'Updates from groups and community activities.',
                      },
                      {
                        key: 'notifyPromos',
                        title: 'Promotions & offers',
                        desc: 'Special deals and promotional content from PostAll.',
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between gap-4 rounded-lg border p-4"
                      >
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                        <Switch
                          checked={formData[item.key] as boolean}
                          onCheckedChange={(checked) => updateField(item.key, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation */}
              <Separator className="my-6" />
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (currentStep === 0) {
                      router.push('/register')
                    } else {
                      setCurrentStep((prev) => prev - 1)
                    }
                  }}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  {currentStep === 0 ? 'Back to Register' : 'Previous'}
                </Button>

                {currentStep < totalSteps - 1 ? (
                  <Button
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                    disabled={!canProceed()}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleComplete} disabled={loading}>
                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Complete Setup
                    <CheckCircle2 className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Login link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </main>

    </div>
  )
}
