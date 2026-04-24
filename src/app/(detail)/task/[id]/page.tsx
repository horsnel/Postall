"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import MagicLinkModal from "@/components/layout/magic-link-modal";
import { sampleTasks } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  MapPin,
  Clock,
  DollarSign,
  Star,
  Shield,
  Heart,
  Share2,
  Flag,
  Truck,
  Package,
  Handshake,
  AlertTriangle,
  Zap,
  SlidersHorizontal,
  Briefcase,
  ShoppingCart,
  Home,
  CircleUserRound,
  Camera,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Wrench,
} from "lucide-react";
import dynamic from "next/dynamic";

const AICandidateSelector = dynamic(
  () => import("@/components/ai/ai-candidate-selector"),
  { ssr: false }
);
import { WhatsAppButton } from "@/components/share/whatsapp-button";

// ─── Helpers ─────────────────────────────────────────────────
function getCategoryColor(categoryId: string) {
  const map: Record<string, string> = {
    gigs: "bg-emerald-100 text-emerald-700 border-emerald-200",
    services: "bg-teal-100 text-teal-700 border-teal-200",
    jobs: "bg-cyan-100 text-cyan-700 border-cyan-200",
    "for-sale": "bg-amber-100 text-amber-700 border-amber-200",
    housing: "bg-orange-100 text-orange-700 border-orange-200",
    community: "bg-rose-100 text-rose-700 border-rose-200",
  };
  return map[categoryId] || "bg-gray-100 text-gray-700 border-gray-200";
}

function getCategoryLabel(categoryId: string) {
  const map: Record<string, string> = {
    gigs: "Gigs",
    services: "Services",
    jobs: "Jobs",
    "for-sale": "For Sale",
    housing: "Housing",
    community: "Community",
  };
  return map[categoryId] || categoryId;
}

function getCategoryIcon(categoryId: string) {
  const map: Record<string, React.ReactNode> = {
    gigs: <Zap className="h-3.5 w-3.5" />,
    services: <Wrench className="h-3.5 w-3.5" />,
    jobs: <Briefcase className="h-3.5 w-3.5" />,
    "for-sale": <ShoppingCart className="h-3.5 w-3.5" />,
    housing: <Home className="h-3.5 w-3.5" />,
    community: <CircleUserRound className="h-3.5 w-3.5" />,
  };
  return map[categoryId] || <Briefcase className="h-3.5 w-3.5" />;
}

function getUrgencyColor(urgency: string) {
  const map: Record<string, string> = {
    low: "bg-emerald-100 text-emerald-700",
    normal: "bg-gray-100 text-gray-600",
    high: "bg-amber-100 text-amber-700",
    urgent: "bg-rose-100 text-rose-700",
  };
  return map[urgency] || "bg-gray-100 text-gray-600";
}

function getUrgencyLabel(urgency: string) {
  const map: Record<string, string> = {
    low: "Low",
    normal: "Normal",
    high: "High",
    urgent: "Urgent",
  };
  return map[urgency] || urgency;
}

// ─── Sample detailed task data ────────────────────────────────
const taskDetails: Record<string, {
  description: string[];
  logistics: { meetUp: boolean; delivery: boolean; shipping: boolean };
  poster: { name: string; city: string; rating: number; verified: boolean; memberSince: string; initials: string };
}> = {
  "1": {
    description: [
      "I need a talented web developer to build a responsive, modern landing page for my restaurant business. The page should showcase our menu, location, hours of operation, and include a reservation form.",
      "Requirements: Must be fully responsive (mobile-first), use modern design principles, fast loading times, and SEO-friendly. Experience with food/restaurant websites is a plus.",
      "The ideal candidate should be able to deliver within 5-7 days and be open to revisions. Please include links to similar projects in your application.",
      "We prefer someone based in Lagos for easy communication, but remote applicants with strong portfolios will also be considered.",
    ],
    logistics: { meetUp: true, delivery: false, shipping: false },
    poster: { name: "Chef Obi", city: "Lagos", rating: 4.8, verified: true, memberSince: "Jan 2024", initials: "CO" },
  },
  "2": {
    description: [
      "I'm moving to a new apartment and need help moving furniture and boxes. The move is within Lagos, approximately 15km distance between the old and new place.",
      "Items include: 3-seater sofa, dining table with 4 chairs, bed frame and mattress, wardrobe, 10-15 boxes of various sizes, kitchen appliances.",
      "A truck or van will be needed. If you don't have one, I can arrange for a separate truck rental. Heavy lifting is involved so please come prepared.",
      "Ideally looking for 2 people to handle this efficiently. The entire move should take about 4-5 hours including loading and unloading.",
    ],
    logistics: { meetUp: true, delivery: true, shipping: false },
    poster: { name: "Ama Mensah", city: "Abuja", rating: 4.5, verified: true, memberSince: "Mar 2024", initials: "AM" },
  },
  "3": {
    description: [
      "Looking for a creative logo designer for my tech startup. We need a modern, minimalist logo that represents innovation and trust.",
      "Deliverables: Primary logo (full color), Secondary logo (monochrome), Favicon version, Brand guidelines document with color palette and typography suggestions.",
      "We'd like to see 3-5 initial concepts before finalizing. Please include your portfolio or past logo work in your application.",
      "Our startup is in the fintech space, so designs that convey security and innovation would be ideal.",
    ],
    logistics: { meetUp: false, delivery: true, shipping: false },
    poster: { name: "Kevin Oduya", city: "Abuja", rating: 4.9, verified: true, memberSince: "Feb 2024", initials: "KO" },
  },
};

const fallbackDetail = {
  description: [
    "This task requires a skilled professional to complete the work described above. Please review all details carefully before applying.",
    "The ideal candidate should have relevant experience and be able to deliver quality work within the expected timeline.",
    "Feel free to ask any questions before applying. Clear communication is important for successful task completion.",
  ],
  logistics: { meetUp: true, delivery: true, shipping: true },
  poster: { name: "Task Poster", city: "Lagos", rating: 4.5, verified: true, memberSince: "Jan 2024", initials: "TP" },
};

// ─── Placeholder images ──────────────────────────────────────
const placeholderColors = [
  "from-emerald-200 to-teal-200",
  "from-amber-200 to-orange-200",
  "from-teal-200 to-cyan-200",
  "from-rose-200 to-pink-200",
  "from-cyan-200 to-sky-200",
];

// ─── Main Component ──────────────────────────────────────────
export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.id as string;
  const { user } = useAuthStore();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [taskData, setTaskData] = useState<(typeof sampleTasks)[0] | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Fetch task data
  useEffect(() => {
    async function loadTask() {
      try {
        const res = await fetch(`/api/tasks/${taskId}`);
        if (res.ok) {
          const data = await res.json();
          setTaskData(data);
        } else {
          // Fallback to sample data
          const found = sampleTasks.find((t) => t.id === taskId);
          if (found) {
            setTaskData(found);
          } else {
            setNotFound(true);
          }
        }
      } catch {
        const found = sampleTasks.find((t) => t.id === taskId);
        if (found) {
          setTaskData(found);
        } else {
          setNotFound(true);
        }
      }
    }
    loadTask();
  }, [taskId]);

  // Set detail based on task id
  const detail = useMemo(() => {
    return taskDetails[taskId] || fallbackDetail;
  }, [taskId]);

  const handleApply = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    // TODO: Navigate to application form
  };

  const handleSave = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setSaved(!saved);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: taskData?.title || "Task", url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (notFound) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Briefcase className="h-7 w-7 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Task Not Found</h2>
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            This task may have been removed or the link is incorrect. Browse our marketplace to find available tasks.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/browse">
              <Button>Browse Tasks</Button>
            </Link>
            <Link href="/jobs">
              <Button variant="outline">View Jobs</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!taskData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4 animate-pulse">
            <Briefcase className="h-7 w-7 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Loading task...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we load the task details</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50/50">
        {/* Breadcrumb with Back Button */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-3 mb-3">
              <Link
                href="/browse"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Back to Browse</span>
              </Link>
            </div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/browse">Browse</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`/browse/${taskData.category}`}>
                      {getCategoryLabel(taskData.category)}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1 max-w-[200px] sm:max-w-none">
                    {taskData.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* ── Left Column ── */}
            <div className="flex-1 min-w-0 space-y-6">
              {/* Title & Badges */}
              <div className="bg-white rounded-xl border p-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge
                    variant="outline"
                    className={`${getCategoryColor(taskData.category)} text-xs`}
                  >
                    {getCategoryIcon(taskData.category)}
                    <span className="ml-1">{getCategoryLabel(taskData.category)}</span>
                  </Badge>
                  <Badge className={`${getUrgencyColor(taskData.urgency)} text-xs`}>
                    {getUrgencyLabel(taskData.urgency)}
                  </Badge>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                  {taskData.title}
                </h1>

                {/* Budget */}
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                  <span className="text-3xl sm:text-4xl font-bold text-emerald-700">
                    ₦{taskData.budget.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">budget</span>
                </div>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{taskData.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>Posted {taskData.postedAgo || "recently"}</span>
                  </div>
                  {taskData.applicants !== undefined && (
                    <div className="flex items-center gap-1.5">
                      <CircleUserRound className="h-4 w-4" />
                      <span>{taskData.applicants} applicant{taskData.applicants !== 1 ? "s" : ""}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Photo Gallery */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Camera className="h-5 w-5 text-muted-foreground" />
                  Photos
                </h2>
                {/* Main Image */}
                <div className={`relative aspect-[16/10] rounded-lg overflow-hidden mb-3 bg-gradient-to-br ${placeholderColors[activeImage]}`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${placeholderColors[activeImage]} flex items-center justify-center`}>
                    <ImageIcon className="h-16 w-16 text-white/60" />
                  </div>
                </div>
                {/* Thumbnails */}
                <div className="grid grid-cols-5 gap-2">
                  {placeholderColors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === i
                          ? "border-emerald-500 ring-2 ring-emerald-200"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <div className={`w-full h-full bg-gradient-to-br ${color} flex items-center justify-center`}>
                        <ImageIcon className="h-4 w-4 text-white/60" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-semibold text-lg mb-4">Description</h2>
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  {detail.description.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              {/* Logistics */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-semibold text-lg mb-4">Logistics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div
                    className={`flex items-center gap-3 p-4 rounded-lg border ${
                      detail.logistics.meetUp
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-gray-50 border-gray-200 opacity-50"
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${detail.logistics.meetUp ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                      <Handshake className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Meet-up</p>
                      <p className="text-xs text-muted-foreground">{detail.logistics.meetUp ? "Available" : "Not available"}</p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-3 p-4 rounded-lg border ${
                      detail.logistics.delivery
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-gray-50 border-gray-200 opacity-50"
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${detail.logistics.delivery ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Delivery</p>
                      <p className="text-xs text-muted-foreground">{detail.logistics.delivery ? "Available" : "Not available"}</p>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-3 p-4 rounded-lg border ${
                      detail.logistics.shipping
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-gray-50 border-gray-200 opacity-50"
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${detail.logistics.shipping ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Shipping</p>
                      <p className="text-xs text-muted-foreground">{detail.logistics.shipping ? "Available" : "Not available"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Safety Tips */}
              <Card className="border-amber-200 bg-amber-50/50">
                <CardContent className="p-6">
                  <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-amber-600" />
                    Safety Tips
                  </h2>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      Always meet in a public place for the first transaction
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      Never pay in advance before verifying the task poster
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      Use PostAll&apos;s escrow service for secure payments
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      Check the poster&apos;s rating and verification status before proceeding
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      Keep all communication within the platform for your protection
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* ── Right Column (Sidebar) ── */}
            <div className="w-full lg:w-[340px] shrink-0 space-y-6">
              {/* Poster Profile Card */}
              <Card className="py-0 overflow-hidden">
                <CardContent className="p-0">
                  {/* Profile header */}
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 flex items-center gap-4">
                    <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                      <AvatarFallback className="bg-emerald-600 text-white font-semibold text-lg">
                        {detail.poster.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-semibold truncate">{detail.poster.name}</h3>
                        {detail.poster.verified && (
                          <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <Shield className="h-3.5 w-3.5 text-emerald-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{detail.poster.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(detail.poster.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                      <span className="text-sm font-medium ml-1">{detail.poster.rating}</span>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Member since</span>
                      <span className="font-medium">{detail.poster.memberSince}</span>
                    </div>

                    {detail.poster.verified && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 text-sm">
                        <Shield className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="text-emerald-700 font-medium">Verified Poster</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card className="py-0 overflow-hidden">
                <CardContent className="p-6 space-y-3">
                  <Button className="w-full h-11 text-base font-semibold" onClick={handleApply}>
                    Apply Now
                  </Button>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1 h-10"
                      onClick={handleSave}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${saved ? "fill-rose-500 text-rose-500" : ""}`} />
                      {saved ? "Saved" : "Save"}
                    </Button>
                    <Button variant="outline" className="flex-1 h-10" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                  <WhatsAppButton
                    title={taskData.title}
                    price={`₦${taskData.budget.toLocaleString()}`}
                    size="default"
                    variant="outline"
                    className="w-full"
                  />
                  <Button
                    variant="ghost"
                    className="w-full h-10 text-muted-foreground hover:text-rose-600"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Report Listing
                  </Button>
                </CardContent>
              </Card>

              {/* AI Candidate Recommendation */}
              <Card className="py-0 overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-emerald-600" />
                    AI Worker Matching
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Let AI analyze and recommend the best workers for this task
                  </p>
                  <AICandidateSelector
                    taskId={taskId}
                    taskDescription={taskData?.title || ""}
                    taskSkills={taskData?.category ? [taskData.category] : []}
                    location={taskData?.city || "Lagos"}
                    budget={taskData?.budget || 0}
                  />
                </CardContent>
              </Card>

              {/* Similar Tasks */}
              <Card className="py-0 overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Similar Tasks</h3>
                  <div className="space-y-3">
                    {sampleTasks
                      .filter((t) => t.id !== taskId)
                      .slice(0, 3)
                      .map((similar) => (
                        <Link key={similar.id} href={`/task/${similar.id}`}>
                          <div className="p-3 rounded-lg border hover:border-emerald-200 hover:bg-emerald-50/30 transition-all cursor-pointer">
                            <h4 className="text-sm font-medium line-clamp-2 mb-2 group-hover:text-emerald-700">
                              {similar.title}
                            </h4>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="font-semibold text-emerald-700 text-sm">
                                ₦{similar.budget.toLocaleString()}
                              </span>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {similar.city}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <MagicLinkModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}
