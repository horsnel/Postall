// @ts-nocheck
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { categories, urgencyLevels, nigerianStates, getCitiesByState } from "@/lib/constants";
import MagicLinkModal from "@/components/layout/magic-link-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Zap,
  SlidersHorizontal,
  Briefcase,
  ShoppingCart,
  Home,
  Users,
  Check,
  ChevronLeft,
  ArrowRight,
  Loader2,
  ImageIcon,
  X,
  Sparkles,
  MapPin,
  CalendarDays,
  Handshake,
  Truck,
  Package,
  Clock,
  AlertCircle,
  Pencil,
  FileText,
  Camera,
  ShieldCheck,
  Upload,
  CheckCircle2,
} from "lucide-react";

// ==================== SUBCATEGORIES MAP ====================
const subcategoriesMap: Record<string, string[]> = {
  gigs: [
    "Delivery & Errands",
    "Cleaning",
    "Moving Help",
    "Event Staff",
    "Personal Assistant",
    "Photography",
    "Music & Entertainment",
    "Pet Sitting",
    "Yard Work",
    "Assembly & Handyman",
  ],
  services: [
    "Web Development",
    "Graphic Design",
    "Writing & Translation",
    "Marketing & SEO",
    "Consulting",
    "Tutoring",
    "Accounting",
    "Legal Services",
  ],
  jobs: [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Remote",
    "Freelance",
  ],
  "for-sale": [
    "Electronics",
    "Furniture",
    "Vehicles",
    "Clothing",
    "Books",
    "Sports & Outdoors",
    "Home & Garden",
    "Music & Instruments",
  ],
  community: [
    "Events",
    "Groups",
    "Volunteers",
    "Classes & Workshops",
    "Lost & Found",
  ],
};

// ==================== CATEGORY CONFIG ====================
const categoryConfig: Record<string, {
  icon: React.ElementType;
  label: string;
  bg: string;
  iconColor: string;
  selectedBorder: string;
}> = {
  gigs: {
    icon: Zap,
    label: "Gigs",
    bg: "bg-[#F0FDF4]",
    iconColor: "text-[#0D8A5C]",
    selectedBorder: "border-[#0D8A5C]",
  },
  services: {
    icon: SlidersHorizontal,
    label: "Services",
    bg: "bg-[#EFF6FF]",
    iconColor: "text-[#3B82F6]",
    selectedBorder: "border-[#3B82F6]",
  },
  jobs: {
    icon: Briefcase,
    label: "Jobs",
    bg: "bg-[#ECFEFF]",
    iconColor: "text-[#06B6D4]",
    selectedBorder: "border-[#06B6D4]",
  },
  "for-sale": {
    icon: ShoppingCart,
    label: "For Sale",
    bg: "bg-[#FFFBEB]",
    iconColor: "text-[#F59E0B]",
    selectedBorder: "border-[#F59E0B]",
  },
  community: {
    icon: Users,
    label: "Community",
    bg: "bg-[#FEF2F2]",
    iconColor: "text-[#EF4444]",
    selectedBorder: "border-[#EF4444]",
  },
};

// ==================== STEP METADATA ====================
const steps = [
  { id: 1, label: "Category & Title", icon: FileText },
  { id: 2, label: "Description", icon: Pencil },
  { id: 3, label: "Budget & Location", icon: MapPin },
  { id: 4, label: "Photos & Logistics", icon: Camera },
  { id: 5, label: "Review & Post", icon: CheckCircle2 },
];

// ==================== FORM DATA TYPE ====================
interface FormData {
  category: string;
  title: string;
  description: string;
  subcategory: string;
  budget: string;
  currency: string;
  state: string;
  city: string;
  location: string;
  urgency: string;
  deadline: Date | undefined;
  logistics: {
    meetup: boolean;
    delivery: boolean;
    shipping: boolean;
  };
  photos: string[];
  deliveryNotes: string;
  agreedTerms: boolean;
}

const initialFormData: FormData = {
  category: "",
  title: "",
  description: "",
  subcategory: "",
  budget: "",
  currency: "NGN",
  state: "",
  city: "",
  location: "",
  urgency: "normal",
  deadline: undefined,
  logistics: {
    meetup: true,
    delivery: false,
    shipping: false,
  },
  photos: [],
  deliveryNotes: "",
  agreedTerms: false,
};

// ==================== SIMULATED PHOTOS ====================
const samplePhotoPlaceholders = [
  "https://placehold.co/600x400/e2e8f0/94a3b8?text=Photo+1",
  "https://placehold.co/600x400/e2e8f0/94a3b8?text=Photo+2",
  "https://placehold.co/600x400/e2e8f0/94a3b8?text=Photo+3",
];

// ==================== URGENCY COLORS ====================
const urgencyColorMap: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-700",
  normal: "bg-emerald-100 text-emerald-700",
  high: "bg-amber-100 text-amber-700",
  urgent: "bg-rose-100 text-rose-700",
};

// ==================== MAIN COMPONENT ====================
export default function PostTaskPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiEnhancing, setIsAiEnhancing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData | "logistics" | "terms", string>>>({});

  const totalSteps = steps.length;

  // Available subcategories based on selected category
  const availableSubcategories = useMemo(() => {
    if (!formData.category) return [];
    return subcategoriesMap[formData.category] || [];
  }, [formData.category]);

  // Available cities based on selected state
  const availableCities = useMemo(() => {
    if (!formData.state) return [];
    return getCitiesByState(formData.state);
  }, [formData.state]);

  // ==================== AUTH GATE ====================
  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#F0FDF4] flex items-center justify-center mb-6">
            <ShieldCheck className="w-8 h-8 text-[#0D8A5C]" />
          </div>
          <h1 className="text-2xl font-bold mb-3 text-[#1F2937]">Sign in to post a task</h1>
          <p className="text-[#9CA3AF] mb-6">
            You need to be logged in to create a task listing on PostAll. Sign in with your phone or email.
          </p>
          <Button
            onClick={() => setShowAuthModal(true)}
            className="bg-[#0D8A5C] hover:bg-[#0B7A52] text-white font-semibold h-12 px-8 rounded-xl"
          >
            Sign in to continue
          </Button>
          <MagicLinkModal
            open={showAuthModal}
            onOpenChange={setShowAuthModal}
          />
        </div>
      </div>
    );
  }

  // ==================== VALIDATION ====================
  function validateStep(step: number): boolean {
    const newErrors: Partial<Record<keyof FormData | "logistics" | "terms", string>> = {};

    if (step === 1) {
      if (!formData.category) newErrors.category = "Please select a category";
      if (!formData.title.trim()) newErrors.title = "Please enter a task title";
      else if (formData.title.trim().length < 10) newErrors.title = "Title must be at least 10 characters";
    }

    if (step === 2) {
      if (!formData.description.trim()) newErrors.description = "Please enter a description";
      else if (formData.description.trim().length < 30) newErrors.description = "Description must be at least 30 characters";
      if (availableSubcategories.length > 0 && !formData.subcategory) {
        newErrors.subcategory = "Please select a subcategory";
      }
    }

    if (step === 3) {
      if (!formData.budget || parseFloat(formData.budget) <= 0) newErrors.budget = "Please enter a valid budget";
      if (!formData.state) newErrors.state = "Please select a state";
      if (!formData.city) newErrors.city = "Please select a city";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ==================== STEP NAVIGATION ====================
  function handleNext() {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      setErrors({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleBack() {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToStep(step: number) {
    setCurrentStep(step);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ==================== AI ENHANCE (SIMULATED) ====================
  async function handleAiEnhance() {
    if (!formData.description.trim()) return;
    setIsAiEnhancing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const enhanced = `${formData.description.trim()}\n\nAdditional details: I am looking for someone with relevant experience who can deliver quality work within the specified timeframe. Clear communication and professionalism are important. Feel free to ask questions before applying.`;
    setFormData((prev) => ({ ...prev, description: enhanced }));
    setIsAiEnhancing(false);
  }

  // ==================== PHOTO HANDLING (SIMULATED) ====================
  function handleAddPhoto() {
    if (formData.photos.length < 5) {
      const nextPhoto = samplePhotoPlaceholders[formData.photos.length % samplePhotoPlaceholders.length];
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, nextPhoto.replace("Photo", `Photo ${prev.photos.length + 1}`)],
      }));
    }
  }

  function handleRemovePhoto(index: number) {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  }

  // ==================== SUBMIT ====================
  async function handleSubmit() {
    if (!formData.agreedTerms) {
      setErrors({ terms: "You must agree to the Terms of Service" });
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        subcategory: formData.subcategory || null,
        budget: parseFloat(formData.budget),
        currency: formData.currency,
        city: formData.city,
        location: formData.location.trim() || null,
        urgency: formData.urgency,
        deadline: formData.deadline?.toISOString() || null,
        photos: JSON.stringify(formData.photos),
        logistics: JSON.stringify(formData.logistics),
        aiEnhanced: formData.description.includes("Additional details:"),
        postedById: user.id,
        status: "open",
      };

      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/dashboard/tasks");
      } else {
        setErrors({ title: "Failed to create task. Please try again." });
      }
    } catch {
      setErrors({ title: "Network error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  }

  // ==================== CATEGORY NAME LOOKUP ====================
  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name || id;

  // ==================== FORM FIELD HELPERS ====================
  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const updateLogistics = (key: keyof FormData["logistics"], value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      logistics: { ...prev.logistics, [key]: value },
    }));
  };

  // ==================== STEPPER ====================
  function StepIndicator() {
    return (
      <div className="bg-[#F3F4F6] rounded-xl p-6 mb-8 overflow-x-auto">
        <div className="flex items-center min-w-[600px] sm:min-w-0">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                {/* Step circle + label */}
                <div className="flex flex-col items-center gap-1.5 min-w-[56px]">
                  <button
                    type="button"
                    onClick={() => goToStep(step.id)}
                    className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                      isCompleted
                        ? "bg-[#0D8A5C] text-white"
                        : isCurrent
                        ? "bg-[#0D8A5C] text-white"
                        : "bg-[#E5E7EB] text-[#9CA3AF]"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </button>
                  <span
                    className={`text-xs font-medium whitespace-nowrap transition-colors ${
                      isCompleted || isCurrent
                        ? "text-[#1F2937]"
                        : "text-[#9CA3AF]"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="flex-1 flex items-center px-2">
                    <div
                      className={`h-[2px] w-full rounded-full transition-colors duration-300 ${
                        isCompleted ? "bg-[#0D8A5C]" : "bg-[#E5E7EB]"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==================== STEP 1: CATEGORY & TITLE ====================
  function Step1Content() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1F2937] mb-1">Choose a Category & Title</h2>
          <p className="text-sm text-[#9CA3AF]">
            Select the category that best fits your task and give it a clear title.
          </p>
        </div>

        {/* Category Selection Grid */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-[#1F2937]">Category</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => {
              const config = categoryConfig[cat.id];
              if (!config) return null;
              const CatIcon = config.icon;
              const isSelected = formData.category === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    updateField("category", cat.id);
                    // Reset subcategory when category changes
                    updateField("subcategory", "");
                  }}
                  className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200 ${config.bg} ${
                    isSelected ? config.selectedBorder + " shadow-sm" : "border-transparent hover:border-gray-200"
                  }`}
                >
                  <CatIcon className={`w-8 h-8 ${config.iconColor}`} />
                  <span className={`text-sm font-medium ${config.iconColor}`}>
                    {config.label}
                  </span>
                </button>
              );
            })}
          </div>
          {errors.category && (
            <p className="text-sm text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.category}
            </p>
          )}
        </div>

        {/* Subcategory (appears after category selection) */}
        {availableSubcategories.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1F2937]">Subcategory</label>
            <Select
              value={formData.subcategory}
              onValueChange={(val) => updateField("subcategory", val)}
            >
              <SelectTrigger className="w-full h-12 rounded-xl border-gray-200">
                <SelectValue placeholder="Select a subcategory..." />
              </SelectTrigger>
              <SelectContent>
                {availableSubcategories.map((sub) => (
                  <SelectItem key={sub} value={sub}>
                    {sub}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Title Input */}
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-[#1F2937]">
            Task Title
          </label>
          <Input
            id="title"
            placeholder="Give your task a clear title"
            value={formData.title}
            onChange={(e) => updateField("title", e.target.value)}
            maxLength={120}
            className="h-12 text-base rounded-xl border-gray-200 focus:border-[#0D8A5C] focus:ring-[#0D8A5C]/20"
          />
          <div className="flex items-center justify-between">
            {errors.title ? (
              <p className="text-sm text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
              </p>
            ) : (
              <p className="text-xs text-[#9CA3AF]">
                Be specific so the right people find your task
              </p>
            )}
            <span className={`text-xs ${formData.title.length > 100 ? "text-amber-500" : "text-[#9CA3AF]"}`}>
              {formData.title.length}/120
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ==================== STEP 2: DESCRIPTION ====================
  function Step2Content() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1F2937] mb-1">Describe Your Task</h2>
          <p className="text-sm text-[#9CA3AF]">
            Provide as much detail as possible to attract qualified applicants.
          </p>
        </div>

        {/* Description Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="description" className="text-sm font-medium text-[#1F2937]">
              Description
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 text-[#0D8A5C] border-[#0D8A5C]/30 hover:bg-[#F0FDF4] hover:text-[#0D8A5C]"
              onClick={handleAiEnhance}
              disabled={isAiEnhancing || !formData.description.trim()}
            >
              {isAiEnhancing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              {isAiEnhancing ? "Enhancing..." : "AI Enhance"}
            </Button>
          </div>
          <Textarea
            id="description"
            placeholder="Describe what you need done in detail..."
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            className="text-base resize-none rounded-xl border-gray-200 focus:border-[#0D8A5C] focus:ring-[#0D8A5C]/20"
            style={{ minHeight: "200px" }}
          />
          <div className="flex items-center justify-between">
            {errors.description ? (
              <p className="text-sm text-rose-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.description}
              </p>
            ) : (
              <p className="text-xs text-[#9CA3AF]">
                The more detail you provide, the better matches you&apos;ll get
              </p>
            )}
            <span className={`text-xs ${formData.description.length > 2000 ? "text-amber-500" : "text-[#9CA3AF]"}`}>
              {formData.description.length}/2000
            </span>
          </div>
        </div>

        {/* Tips Section - Green Badges */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-[#1F2937]">Tips for a great description</label>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F0FDF4] text-[#0D8A5C] text-xs font-medium border border-[#0D8A5C]/20">
              <Sparkles className="w-3 h-3" /> Be specific about what you need
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F0FDF4] text-[#0D8A5C] text-xs font-medium border border-[#0D8A5C]/20">
              Mention required skills or experience
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F0FDF4] text-[#0D8A5C] text-xs font-medium border border-[#0D8A5C]/20">
              Include your preferred timeline
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F0FDF4] text-[#0D8A5C] text-xs font-medium border border-[#0D8A5C]/20">
              Specify any tools or materials needed
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ==================== STEP 3: BUDGET & LOCATION ====================
  function Step3Content() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1F2937] mb-1">Budget & Location</h2>
          <p className="text-sm text-[#9CA3AF]">
            Define your budget and where the task should be completed.
          </p>
        </div>

        {/* Budget Input with ₦ Prefix */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#1F2937]">What&apos;s your budget?</label>
          <div className="flex gap-3">
            <Select
              value={formData.currency}
              onValueChange={(val) => updateField("currency", val)}
            >
              <SelectTrigger className="w-28 h-12 rounded-xl border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NGN">NGN ₦</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-[#9CA3AF]">
                ₦
              </span>
              <Input
                type="number"
                placeholder="0.00"
                value={formData.budget}
                onChange={(e) => updateField("budget", e.target.value)}
                min="1"
                step="0.01"
                className="h-12 pl-12 text-lg font-semibold rounded-xl border-gray-200 focus:border-[#0D8A5C] focus:ring-[#0D8A5C]/20"
              />
            </div>
          </div>
          {errors.budget ? (
            <p className="text-sm text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.budget}
            </p>
          ) : (
            <p className="text-xs text-[#9CA3AF]">Set a fair price to attract quality applicants</p>
          )}
        </div>

        {/* Urgency Selector */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-[#1F2937]">How urgent is this?</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {urgencyLevels.map((level) => {
              const isSelected = formData.urgency === level.value;
              return (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => updateField("urgency", level.value)}
                  className={`flex items-center justify-center px-4 py-3 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isSelected
                      ? level.color + " ring-2 ring-offset-2 ring-current/20"
                      : "bg-[#F3F4F6] text-[#9CA3AF] hover:bg-gray-200"
                  }`}
                >
                  {level.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* State Dropdown (Nigerian States) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#1F2937] flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#0D8A5C]" /> State
          </label>
          <Select
            value={formData.state}
            onValueChange={(val) => {
              updateField("state", val);
              updateField("city", "");
            }}
          >
            <SelectTrigger className="w-full h-12 rounded-xl border-gray-200">
              <SelectValue placeholder="Select your state..." />
            </SelectTrigger>
            <SelectContent className="max-h-64 overflow-y-auto">
              {nigerianStates.map((state) => (
                <SelectItem key={state.name} value={state.name}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.state && (
            <p className="text-sm text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.state}
            </p>
          )}
        </div>

        {/* City Dropdown (depends on state) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#1F2937] flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#0D8A5C]" /> City
          </label>
          <Select
            value={formData.city}
            onValueChange={(val) => updateField("city", val)}
            disabled={!formData.state}
          >
            <SelectTrigger className="w-full h-12 rounded-xl border-gray-200">
              <SelectValue placeholder={formData.state ? "Select your city..." : "Select a state first..."} />
            </SelectTrigger>
            <SelectContent className="max-h-64 overflow-y-auto">
              {availableCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.city && (
            <p className="text-sm text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.city}
            </p>
          )}
        </div>

        {/* Location Type Checkboxes */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-[#1F2937]">Location Type</label>
          <div className="flex flex-wrap gap-3">
            {[
              { key: "meetup" as const, label: "Meet-up", icon: Handshake },
              { key: "delivery" as const, label: "Delivery", icon: Package },
              { key: "shipping" as const, label: "Shipping", icon: Truck },
            ].map((loc) => {
              const isChecked = formData.logistics[loc.key];
              return (
                <button
                  key={loc.key}
                  type="button"
                  onClick={() => updateLogistics(loc.key, !isChecked)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    isChecked
                      ? "border-[#0D8A5C] bg-[#F0FDF4] text-[#0D8A5C]"
                      : "border-gray-200 text-[#9CA3AF] hover:border-gray-300"
                  }`}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) => updateLogistics(loc.key, !!checked)}
                    className="data-[state=checked]:bg-[#0D8A5C] data-[state=checked]:border-[#0D8A5C]"
                  />
                  <loc.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{loc.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Specific Location */}
        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-medium text-[#1F2937]">
            Specific Location <span className="text-[#9CA3AF] font-normal">(optional)</span>
          </label>
          <Input
            id="location"
            placeholder="e.g., Victoria Island, Lekki Phase 1..."
            value={formData.location}
            onChange={(e) => updateField("location", e.target.value)}
            className="h-11 rounded-xl border-gray-200 focus:border-[#0D8A5C] focus:ring-[#0D8A5C]/20"
          />
        </div>
      </div>
    );
  }

  // ==================== STEP 4: PHOTOS & LOGISTICS ====================
  function Step4Content() {
    const [calendarOpen, setCalendarOpen] = useState(false);
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1F2937] mb-1">Photos & Logistics</h2>
          <p className="text-sm text-[#9CA3AF]">
            Add photos and provide delivery details.
          </p>
        </div>

        {/* Photo Upload Area */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-[#1F2937]">
            Photos <span className="text-[#9CA3AF] font-normal">(up to 5)</span>
          </label>

          {/* Photo Grid */}
          {formData.photos.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {formData.photos.map((_, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group"
                >
                  <div className="w-full h-full bg-[#F3F4F6] flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-[#9CA3AF]" />
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="bg-white text-rose-500 rounded-full p-1.5 shadow-md hover:bg-rose-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="absolute bottom-1.5 left-1.5 text-[10px] bg-white/80 text-[#374151] px-1.5 py-0.5 rounded-md font-medium">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Upload Area - Dashed border with Camera icon */}
          {formData.photos.length < 5 && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleAddPhoto();
              }}
              onClick={handleAddPhoto}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200 ${
                dragOver
                  ? "border-[#0D8A5C] bg-[#F0FDF4]"
                  : "border-gray-300 hover:border-[#0D8A5C] hover:bg-[#F0FDF4]/50"
              }`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${dragOver ? "bg-[#0D8A5C]/10" : "bg-[#F3F4F6]"}`}>
                <Camera className={`w-7 h-7 ${dragOver ? "text-[#0D8A5C]" : "text-[#9CA3AF]"}`} />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-[#374151]">
                  {dragOver ? "Drop your photo here" : "Tap to add photos"}
                </p>
                <p className="text-xs text-[#9CA3AF] mt-1">
                  PNG, JPG, or WebP (max 5MB each)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Delivery Notes Textarea */}
        <div className="space-y-2">
          <label htmlFor="deliveryNotes" className="text-sm font-medium text-[#1F2937]">
            Delivery Notes <span className="text-[#9CA3AF] font-normal">(optional)</span>
          </label>
          <Textarea
            id="deliveryNotes"
            placeholder="Any special instructions for delivery or meetup..."
            value={formData.deliveryNotes}
            onChange={(e) => updateField("deliveryNotes", e.target.value)}
            className="text-sm resize-none rounded-xl border-gray-200 focus:border-[#0D8A5C] focus:ring-[#0D8A5C]/20"
            rows={3}
          />
        </div>

        {/* Preferred Date Picker */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#1F2937] flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4 text-[#0D8A5C]" /> Preferred Date
            <span className="text-[#9CA3AF] font-normal">(optional)</span>
          </label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={`w-full h-12 rounded-xl border border-gray-200 flex items-center gap-2 px-4 text-sm transition-colors hover:border-[#0D8A5C] ${
                  !formData.deadline ? "text-[#9CA3AF]" : "text-[#1F2937]"
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                {formData.deadline
                  ? formData.deadline.toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Pick a preferred date..."}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.deadline}
                onSelect={(date) => {
                  updateField("deadline", date);
                  setCalendarOpen(false);
                }}
                disabled={{ before: new Date() }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    );
  }

  // ==================== STEP 5: REVIEW & POST ====================
  function Step5Content() {
    const activeLogistics = Object.entries(formData.logistics)
      .filter(([, val]) => val)
      .map(([key]) => key);

    const logisticsLabels: Record<string, string> = {
      meetup: "Meet-up",
      delivery: "Local Delivery",
      shipping: "Shipping",
    };

    const logisticsIcons: Record<string, React.ElementType> = {
      meetup: Handshake,
      delivery: Package,
      shipping: Truck,
    };

    const urgencyLevel = urgencyLevels.find((u) => u.value === formData.urgency);

    const currencySymbol = "₦";

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1F2937] mb-1">Review your task before posting</h2>
          <p className="text-sm text-[#9CA3AF]">
            Double-check everything below, then hit Post Task when you&apos;re ready.
          </p>
        </div>

        {/* Category & Title Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#1F2937]">Category & Title</h3>
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="text-xs font-medium text-[#0D8A5C] hover:text-[#0B7A52] flex items-center gap-1"
            >
              <Pencil className="w-3 h-3" /> Edit
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {(() => {
              const config = categoryConfig[formData.category];
              if (!config) return null;
              const CatIcon = config.icon;
              return (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.iconColor}`}>
                  <CatIcon className="w-3 h-3" />
                  {getCategoryName(formData.category)}
                </span>
              );
            })()}
            {formData.subcategory && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#F3F4F6] text-[#374151]">
                {formData.subcategory}
              </span>
            )}
          </div>
          <p className="text-base font-semibold text-[#1F2937]">{formData.title}</p>
        </div>

        {/* Description Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#1F2937]">Description</h3>
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="text-xs font-medium text-[#0D8A5C] hover:text-[#0B7A52] flex items-center gap-1"
            >
              <Pencil className="w-3 h-3" /> Edit
            </button>
          </div>
          <p className="text-sm text-[#374151] whitespace-pre-line line-clamp-5">
            {formData.description}
          </p>
          {formData.description.includes("Additional details:") && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F0FDF4] text-[#0D8A5C] border border-[#0D8A5C]/20">
              <Sparkles className="w-3 h-3" /> AI Enhanced
            </span>
          )}
        </div>

        {/* Budget & Location Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#1F2937]">Budget & Location</h3>
            <button
              type="button"
              onClick={() => goToStep(3)}
              className="text-xs font-medium text-[#0D8A5C] hover:text-[#0B7A52] flex items-center gap-1"
            >
              <Pencil className="w-3 h-3" /> Edit
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[#9CA3AF] mb-1">Budget</p>
              <p className="text-lg font-bold text-[#0D8A5C]">
                {currencySymbol} {formData.budget}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#9CA3AF] mb-1">Urgency</p>
              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${urgencyColorMap[formData.urgency] || "bg-gray-100 text-gray-700"}`}>
                {urgencyLevel?.label || formData.urgency}
              </span>
            </div>
            <div>
              <p className="text-xs text-[#9CA3AF] mb-1">State</p>
              <p className="text-sm font-medium text-[#374151]">{formData.state || "Not set"}</p>
            </div>
            <div>
              <p className="text-xs text-[#9CA3AF] mb-1">City</p>
              <p className="text-sm font-medium text-[#374151] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#9CA3AF]" />
                {formData.city || "Not set"}
              </p>
            </div>
            {formData.location && (
              <div className="col-span-2">
                <p className="text-xs text-[#9CA3AF] mb-1">Location</p>
                <p className="text-sm font-medium text-[#374151]">{formData.location}</p>
              </div>
            )}
          </div>
        </div>

        {/* Photos & Logistics Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#1F2937]">Photos & Logistics</h3>
            <button
              type="button"
              onClick={() => goToStep(4)}
              className="text-xs font-medium text-[#0D8A5C] hover:text-[#0B7A52] flex items-center gap-1"
            >
              <Pencil className="w-3 h-3" /> Edit
            </button>
          </div>
          {formData.photos.length > 0 ? (
            <div className="flex gap-2 mb-2">
              {formData.photos.slice(0, 3).map((_, index) => (
                <div
                  key={index}
                  className="w-14 h-14 rounded-lg bg-[#F3F4F6] border border-gray-200 flex items-center justify-center"
                >
                  <ImageIcon className="w-5 h-5 text-[#9CA3AF]" />
                </div>
              ))}
              {formData.photos.length > 3 && (
                <div className="w-14 h-14 rounded-lg bg-[#F3F4F6] border border-gray-200 flex items-center justify-center">
                  <span className="text-xs font-medium text-[#9CA3AF]">
                    +{formData.photos.length - 3}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-[#9CA3AF] mb-2">No photos added</p>
          )}
          <div className="flex flex-wrap gap-2">
            {activeLogistics.map((type) => {
              const Icon = logisticsIcons[type];
              return (
                <span
                  key={type}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F0FDF4] text-[#0D8A5C] border border-[#0D8A5C]/20"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {logisticsLabels[type]}
                </span>
              );
            })}
            {activeLogistics.length === 0 && (
              <p className="text-sm text-[#9CA3AF]">No logistics preferences set</p>
            )}
          </div>
          {formData.deadline && (
            <div className="flex items-center gap-1.5 text-sm text-[#374151]">
              <CalendarDays className="w-3.5 h-3.5 text-[#9CA3AF]" />
              Preferred date: {formData.deadline.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          )}
          {formData.deliveryNotes && (
            <div>
              <p className="text-xs text-[#9CA3AF] mb-0.5">Delivery Notes</p>
              <p className="text-sm text-[#374151]">{formData.deliveryNotes}</p>
            </div>
          )}
        </div>

        {/* Safety Notice */}
        <div className="rounded-xl bg-[#FFFBEB] border border-[#F59E0B]/30 p-4">
          <h4 className="text-sm font-semibold text-[#92400E] mb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Safety Reminder
          </h4>
          <ul className="text-xs text-[#92400E]/80 space-y-1">
            <li>&#8226; Always use PostAll&apos;s built-in escrow for secure payments</li>
            <li>&#8226; Meet in public places for in-person exchanges</li>
            <li>&#8226; Never pay outside the platform</li>
          </ul>
        </div>

        {/* Error message */}
        {errors.title && (
          <div className="rounded-xl bg-[#FEF2F2] border border-rose-200 p-3">
            <p className="text-sm text-rose-600 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> {errors.title}
            </p>
          </div>
        )}

        {/* Terms Checkbox */}
        <div className="flex items-start gap-3 pt-2">
          <Checkbox
            id="agree-terms"
            checked={formData.agreedTerms}
            onCheckedChange={(checked) => {
              updateField("agreedTerms", !!checked);
              if (errors.terms) setErrors((prev) => ({ ...prev, terms: undefined }));
            }}
            className="mt-0.5 data-[state=checked]:bg-[#0D8A5C] data-[state=checked]:border-[#0D8A5C]"
          />
          <label htmlFor="agree-terms" className="text-sm text-[#374151] cursor-pointer leading-relaxed">
            I agree to PostAll&apos;s{" "}
            <button type="button" className="text-[#0D8A5C] font-medium hover:underline">
              Terms of Service
            </button>{" "}
            and{" "}
            <button type="button" className="text-[#0D8A5C] font-medium hover:underline">
              Community Guidelines
            </button>
          </label>
        </div>
        {errors.terms && (
          <p className="text-sm text-rose-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.terms}
          </p>
        )}

        {/* Post Task Button - Full Width */}
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.agreedTerms}
          className="w-full h-12 bg-[#0D8A5C] hover:bg-[#0B7A52] text-white font-semibold rounded-xl text-base disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Posting...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Post Task
            </>
          )}
        </Button>
      </div>
    );
  }

  // ==================== RENDER ACTIVE STEP ====================
  function renderStepContent() {
    switch (currentStep) {
      case 1:
        return <Step1Content />;
      case 2:
        return <Step2Content />;
      case 3:
        return <Step3Content />;
      case 4:
        return <Step4Content />;
      case 5:
        return <Step5Content />;
      default:
        return null;
    }
  }

  // ==================== MAIN RENDER ====================
  return (
    <div className="bg-[#F3F4F6]/50 min-h-[80vh]">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937] mb-2">Post a Task</h1>
          <p className="text-[#9CA3AF]">
            Step {currentStep} of {totalSteps} — {steps[currentStep - 1]?.label}
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator />

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 lg:p-8">
          <div className="transition-all duration-300 ease-in-out">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons (not shown on step 5) */}
          {currentStep < totalSteps && (
            <>
              <div className="border-t border-gray-100 my-6" />
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex items-center justify-center w-40 h-10 bg-[#F3F4F6] text-[#374151] font-medium rounded-xl hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center justify-center w-40 h-10 bg-[#0D8A5C] text-white font-medium rounded-xl hover:bg-[#0B7A52] transition-colors"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
