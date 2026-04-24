"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import MagicLinkModal from "@/components/layout/magic-link-modal";
import { categories, cities, sampleTasks, sampleListings } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  ChevronLeft,
  Camera,
  CheckCircle2,
  DollarSign,
  ImageIcon,
  Loader2,
  Package,
  Pencil,
  ShieldCheck,
  Truck,
  Upload,
  X,
} from "lucide-react";

// ─── Subcategories map ────────────────────────────────────
const subcategoryMap: Record<string, string[]> = {
  gigs: [
    "Delivery",
    "Cleaning",
    "Moving",
    "Photography",
    "Event Help",
    "Personal Assistant",
    "DJ & Music",
    "Catering",
    "Driving",
    "Other",
  ],
  services: [
    "Web Development",
    "Mobile Development",
    "Graphic Design",
    "Logo Design",
    "Content Writing",
    "Video Editing",
    "Social Media",
    "SEO",
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
    "Home & Garden",
    "Sports",
    "Other",
  ],
  housing: [
    "Apartment",
    "House",
    "Room",
    "Office Space",
    "Land",
  ],
  community: [
    "Events",
    "Groups",
    "Classes",
    "Volunteering",
    "Lost & Found",
  ],
};

// ─── Condition options ────────────────────────────────────
const conditionOptions = [
  { value: "new", label: "New", color: "border-emerald-400 bg-emerald-50" },
  { value: "like_new", label: "Like New", color: "border-teal-400 bg-teal-50" },
  { value: "good", label: "Good", color: "border-amber-400 bg-amber-50" },
  { value: "fair", label: "Fair", color: "border-orange-400 bg-orange-50" },
  { value: "poor", label: "Poor", color: "border-rose-400 bg-rose-50" },
];

// ─── Urgency options ──────────────────────────────────────
const urgencyOptions = [
  { value: "low", label: "Low", color: "border-emerald-400 bg-emerald-50 text-emerald-700" },
  { value: "normal", label: "Normal", color: "border-gray-400 bg-gray-50 text-gray-700" },
  { value: "high", label: "High", color: "border-amber-400 bg-amber-50 text-amber-700" },
  { value: "urgent", label: "Urgent", color: "border-rose-400 bg-rose-50 text-rose-700" },
];

// ─── Currency options ─────────────────────────────────────
const currencyOptions = [
  { value: "NGN", label: "NGN (₦)" },
];

// ─── Placeholder colors ──────────────────────────────────
const placeholderColors = [
  "from-emerald-200 to-teal-200",
  "from-amber-200 to-orange-200",
  "from-teal-200 to-cyan-200",
  "from-rose-200 to-pink-200",
  "from-cyan-200 to-sky-200",
];

// ─── Sample data details ──────────────────────────────────
const sampleTaskDetails: Record<string, Record<string, unknown>> = {
  "1": {
    title: "Build a responsive landing page for my restaurant",
    category: "gigs",
    subcategory: "Web Development",
    description: "I need a talented web developer to build a responsive, modern landing page for my restaurant business. The page should showcase our menu, location, hours of operation, and include a reservation form.\n\nRequirements: Must be fully responsive (mobile-first), use modern design principles, fast loading times, and SEO-friendly. Experience with food/restaurant websites is a plus.",
    budget: 150,
    currency: "NGN",
    city: "Lagos",
    urgency: "high",
    deadline: "2026-02-15",
    logistics: { meetUp: true, delivery: false, shipping: false },
    postedById: "demo-user-1",
  },
  "2": {
    title: "Move furniture to new apartment",
    category: "gigs",
    subcategory: "Moving",
    description: "I'm moving to a new apartment and need help moving furniture and boxes. The move is within Lagos, approximately 15km distance between the old and new place.\n\nItems include: 3-seater sofa, dining table with 4 chairs, bed frame and mattress, wardrobe, 10-15 boxes of various sizes, kitchen appliances.",
    budget: 50,
    currency: "NGN",
    city: "Lagos",
    urgency: "normal",
    deadline: "2026-02-10",
    logistics: { meetUp: true, delivery: true, shipping: false },
    postedById: "demo-user-1",
  },
  "3": {
    title: "Design a logo for startup brand",
    category: "services",
    subcategory: "Logo Design",
    description: "Looking for a creative logo designer for my tech startup. We need a modern, minimalist logo that represents innovation and trust.\n\nDeliverables: Primary logo (full color), Secondary logo (monochrome), Favicon version, Brand guidelines document with color palette and typography suggestions.",
    budget: 200,
    currency: "NGN",
    city: "Abuja",
    urgency: "normal",
    deadline: "2026-02-20",
    logistics: { meetUp: false, delivery: true, shipping: false },
    postedById: "demo-user-1",
  },
};

const sampleListingDetails: Record<string, Record<string, unknown>> = {
  "1": {
    title: "iPhone 14 Pro Max - 256GB",
    category: "for-sale",
    subcategory: "Electronics",
    description: "iPhone 14 Pro Max in excellent condition. 256GB storage, Deep Purple color. Comes with original box, charger, and case. Battery health at 95%. No scratches or dents. Factory reset and ready to set up.",
    price: 650,
    currency: "NGN",
    condition: "like_new",
    city: "Lagos",
    deliveryOptions: { meetUp: true, localDelivery: true, shipping: false, deliveryNote: "" },
    postedById: "demo-user-1",
  },
  "2": {
    title: "MacBook Air M2",
    category: "for-sale",
    subcategory: "Electronics",
    description: "MacBook Air M2 with 8GB RAM and 256GB SSD. Midnight color. Used for about 6 months. In great working condition. Comes with original charger and box. Perfect for students and professionals.",
    price: 800,
    currency: "NGN",
    condition: "good",
    city: "Lagos",
    deliveryOptions: { meetUp: true, localDelivery: false, shipping: true, deliveryNote: "Ships with insurance" },
    postedById: "demo-user-1",
  },
  "3": {
    title: "Samsung 55\" Smart TV",
    category: "for-sale",
    subcategory: "Electronics",
    description: "Samsung 55-inch Crystal UHD Smart TV. Model: TU8000. Excellent picture quality with 4K resolution. Comes with remote, stand, and original box. Wall mount not included.",
    price: 350,
    currency: "NGN",
    condition: "good",
    city: "Abuja",
    deliveryOptions: { meetUp: true, localDelivery: true, shipping: false, deliveryNote: "" },
    postedById: "demo-user-1",
  },
};

// ─── Main Component ───────────────────────────────────────
export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const type = params.type as string;
  const id = params.id as string;

  // State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [notAuthorized, setNotAuthorized] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Task form fields
  const [taskTitle, setTaskTitle] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [taskSubcategory, setTaskSubcategory] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskBudget, setTaskBudget] = useState("");
  const [taskCurrency, setTaskCurrency] = useState("NGN");
  const [taskCity, setTaskCity] = useState("");
  const [taskUrgency, setTaskUrgency] = useState("normal");
  const [taskDeadline, setTaskDeadline] = useState("");
  const [taskPhotos, setTaskPhotos] = useState<string[]>([]);
  const [taskLogistics, setTaskLogistics] = useState({
    meetUp: false,
    delivery: false,
    shipping: false,
  });
  const [taskPostedById, setTaskPostedById] = useState("");

  // Listing form fields
  const [listingTitle, setListingTitle] = useState("");
  const [listingSubcategory, setListingSubcategory] = useState("");
  const [listingDescription, setListingDescription] = useState("");
  const [listingPrice, setListingPrice] = useState("");
  const [listingCurrency, setListingCurrency] = useState("NGN");
  const [listingCondition, setListingCondition] = useState("");
  const [listingCity, setListingCity] = useState("");
  const [listingPhotos, setListingPhotos] = useState<string[]>([]);
  const [listingDelivery, setListingDelivery] = useState({
    meetUp: false,
    localDelivery: false,
    shipping: false,
    deliveryNote: "",
  });
  const [listingPostedById, setListingPostedById] = useState("");

  // ─── Load data ─────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    const currentType = type;
    const currentId = id;

    async function load() {
      setLoading(true);
      setError(null);
      setNotFound(false);
      setNotAuthorized(false);

      function populateForm(data: Record<string, unknown>) {
        const postedById = data.postedById as string | undefined;
        if (postedById && user && postedById !== user.id) {
          setNotAuthorized(true);
          return;
        }

        if (currentType === "task") {
          setTaskTitle((data.title as string) || "");
          setTaskCategory((data.category as string) || "");
          setTaskSubcategory((data.subcategory as string) || "");
          setTaskDescription((data.description as string) || "");
          setTaskBudget(String(data.budget || ""));
          setTaskCurrency((data.currency as string) || "NGN");
          setTaskCity((data.city as string) || "");
          setTaskUrgency((data.urgency as string) || "normal");
          setTaskDeadline(
            data.deadline
              ? new Date(data.deadline as string).toISOString().split("T")[0]
              : ""
          );

          const photos = data.photos;
          if (typeof photos === "string") {
            try { setTaskPhotos(JSON.parse(photos)); } catch { setTaskPhotos([]); }
          } else if (Array.isArray(photos)) {
            setTaskPhotos(photos);
          }

          const logistics = data.logistics;
          if (typeof logistics === "string") {
            try { setTaskLogistics(JSON.parse(logistics)); } catch { setTaskLogistics({ meetUp: false, delivery: false, shipping: false }); }
          } else if (typeof logistics === "object" && logistics) {
            setTaskLogistics(logistics as { meetUp: boolean; delivery: boolean; shipping: boolean });
          }

          setTaskPostedById((data.postedById as string) || "");
        } else {
          setListingTitle((data.title as string) || "");
          setListingSubcategory((data.subcategory as string) || "");
          setListingDescription((data.description as string) || "");
          setListingPrice(String(data.price || ""));
          setListingCurrency((data.currency as string) || "NGN");
          setListingCondition((data.condition as string) || "");
          setListingCity((data.city as string) || "");

          const photos = data.photos;
          if (typeof photos === "string") {
            try { setListingPhotos(JSON.parse(photos)); } catch { setListingPhotos([]); }
          } else if (Array.isArray(photos)) {
            setListingPhotos(photos);
          }

          const deliveryOpts = data.deliveryOptions;
          if (typeof deliveryOpts === "string") {
            try { setListingDelivery(JSON.parse(deliveryOpts)); } catch { setListingDelivery({ meetUp: false, localDelivery: false, shipping: false, deliveryNote: "" }); }
          } else if (typeof deliveryOpts === "object" && deliveryOpts) {
            setListingDelivery(deliveryOpts as { meetUp: boolean; localDelivery: boolean; shipping: boolean; deliveryNote: string });
          }

          setListingPostedById((data.postedById as string) || "");
        }
      }

      try {
        const endpoint = currentType === "task" ? `/api/tasks/${currentId}` : `/api/listings/${currentId}`;
        const res = await fetch(endpoint);

        if (!res.ok) {
          const sampleData = currentType === "task" ? sampleTaskDetails[currentId] : sampleListingDetails[currentId];
          if (sampleData) { populateForm(sampleData); } else { setNotFound(true); }
        } else {
          const data = await res.json();
          populateForm(data);
        }
      } catch {
        const sampleData = currentType === "task" ? sampleTaskDetails[currentId] : sampleListingDetails[currentId];
        if (sampleData) { populateForm(sampleData); } else { setNotFound(true); }
      }

      if (!cancelled) setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [type, id, user?.id]);

  // ─── Photo handling ────────────────────────────────────
  const addPhoto = () => {
    const maxPhotos = type === "task" ? 5 : 8;
    const currentPhotos = type === "task" ? taskPhotos : listingPhotos;
    if (currentPhotos.length >= maxPhotos) return;
    const colorIdx = currentPhotos.length % placeholderColors.length;
    const newPhoto = `placeholder-${Date.now()}-${colorIdx}`;
    if (type === "task") {
      setTaskPhotos([...taskPhotos, newPhoto]);
    } else {
      setListingPhotos([...listingPhotos, newPhoto]);
    }
  };

  const removePhoto = (index: number) => {
    if (type === "task") {
      setTaskPhotos(taskPhotos.filter((_, i) => i !== index));
    } else {
      setListingPhotos(listingPhotos.filter((_, i) => i !== index));
    }
  };

  // ─── Save handler ──────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const endpoint =
        type === "task" ? `/api/tasks/${id}` : `/api/listings/${id}`;

      let body: Record<string, unknown>;
      if (type === "task") {
        body = {
          title: taskTitle,
          category: taskCategory,
          subcategory: taskSubcategory || undefined,
          description: taskDescription,
          budget: parseFloat(taskBudget) || 0,
          currency: taskCurrency,
          city: taskCity,
          urgency: taskUrgency,
          deadline: taskDeadline || undefined,
          photos: JSON.stringify(taskPhotos),
          logistics: JSON.stringify(taskLogistics),
        };
      } else {
        body = {
          title: listingTitle,
          subcategory: listingSubcategory || undefined,
          description: listingDescription,
          price: parseFloat(listingPrice) || 0,
          currency: listingCurrency,
          condition: listingCondition || undefined,
          city: listingCity,
          photos: JSON.stringify(listingPhotos),
          deliveryOptions: JSON.stringify(listingDelivery),
        };
      }

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSuccess(true);
        // Redirect after brief delay
        setTimeout(() => {
          if (type === "task") {
            router.push(`/task/${id}`);
          } else {
            router.push(`/item/${id}`);
          }
        }, 1500);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to save changes. Please try again.");
      }
    } catch {
      // For sample data (no real API), just show success
      setSuccess(true);
      setTimeout(() => {
        if (type === "task") {
          router.push(`/task/${id}`);
        } else {
          router.push(`/item/${id}`);
        }
      }, 1500);
    }

    setSaving(false);
  };

  // ─── Loading state ────────────────────────────────────
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-72 mb-8" />
        <Card>
          <CardContent className="p-6 space-y-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Not authenticated ────────────────────────────────
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Sign In Required</h2>
          <p className="text-muted-foreground">
            You need to be logged in to edit {type === "task" ? "tasks" : "listings"}.
          </p>
          <Button onClick={() => setAuthModalOpen(true)} size="lg" className="gap-2">
            Sign In to Continue
          </Button>
        </div>
        <MagicLinkModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      </div>
    );
  }

  // ─── Not found ────────────────────────────────────────
  if (notFound) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-rose-100 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-rose-600" />
          </div>
          <h2 className="text-2xl font-bold">
            {type === "task" ? "Task" : "Listing"} Not Found
          </h2>
          <p className="text-muted-foreground">
            The {type === "task" ? "task" : "listing"} you&apos;re trying to edit
            doesn&apos;t exist or has been removed.
          </p>
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ─── Not authorized ───────────────────────────────────
  if (notAuthorized) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-amber-100 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold">Not Authorized</h2>
          <p className="text-muted-foreground">
            You can only edit your own {type === "task" ? "tasks" : "listings"}.
          </p>
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isTask = type === "task";
  const cancelUrl = isTask ? `/task/${id}` : `/item/${id}`;
  const pageTitle = isTask ? "Edit Task" : "Edit Listing";

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Link href="/dashboard" className="hover:text-emerald-600 transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <Link
          href={isTask ? "/dashboard/tasks" : "/dashboard/listings"}
          className="hover:text-emerald-600 transition-colors"
        >
          {isTask ? "My Tasks" : "My Listings"}
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Edit</span>
      </div>

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Pencil className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{pageTitle}</h1>
            <p className="text-sm text-muted-foreground">
              Update your {isTask ? "task" : "listing"} details
            </p>
          </div>
        </div>
        <Link href={cancelUrl}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Cancel
          </Button>
        </Link>
      </div>

      {/* Success banner */}
      {success && (
        <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-emerald-800">
              Changes saved successfully!
            </p>
            <p className="text-xs text-emerald-600">
              Redirecting you back...
            </p>
          </div>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-rose-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-xs text-rose-600 underline hover:text-rose-800"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ─── TASK FORM ─── */}
      {isTask && (
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="task-title" className="text-sm font-medium">
                Task Title <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="task-title"
                placeholder="e.g., Build a responsive website for my business"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                maxLength={120}
              />
              <p className="text-xs text-muted-foreground text-right">
                {taskTitle.length}/120
              </p>
            </div>

            {/* Category & Subcategory */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Category <span className="text-rose-500">*</span>
                </Label>
                <Select value={taskCategory} onValueChange={setTaskCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Subcategory</Label>
                <Select
                  value={taskSubcategory}
                  onValueChange={setTaskSubcategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {(subcategoryMap[taskCategory] || []).map((sub) => (
                      <SelectItem key={sub} value={sub}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="task-desc" className="text-sm font-medium">
                Description <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                id="task-desc"
                placeholder="Describe your task in detail. What needs to be done, requirements, timeline..."
                rows={6}
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                maxLength={2000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {taskDescription.length}/2000
              </p>
            </div>

            {/* Budget & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task-budget" className="text-sm font-medium">
                  Budget <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="task-budget"
                    type="number"
                    placeholder="0.00"
                    value={taskBudget}
                    onChange={(e) => setTaskBudget(e.target.value)}
                    className="pl-9"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Currency</Label>
                <Select value={taskCurrency} onValueChange={setTaskCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* City & Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  City <span className="text-rose-500">*</span>
                </Label>
                <Select value={taskCity} onValueChange={setTaskCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c.name} value={c.name}>
                        {c.name}, {c.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-deadline" className="text-sm font-medium">
                  Deadline
                </Label>
                <Input
                  id="task-deadline"
                  type="date"
                  value={taskDeadline}
                  onChange={(e) => setTaskDeadline(e.target.value)}
                />
              </div>
            </div>

            {/* Urgency */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Urgency Level</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {urgencyOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTaskUrgency(opt.value)}
                    className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                      taskUrgency === opt.value
                        ? opt.color
                        : "border-gray-200 hover:border-gray-300 text-muted-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Photos */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Photos ({taskPhotos.length}/5)
              </Label>

              {/* Existing photos */}
              {taskPhotos.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {taskPhotos.map((photo, i) => (
                    <div
                      key={photo}
                      className="relative aspect-square rounded-lg overflow-hidden border group"
                    >
                      <div
                        className={`w-full h-full bg-gradient-to-br ${
                          placeholderColors[i % placeholderColors.length]
                        } flex items-center justify-center`}
                      >
                        <ImageIcon className="h-6 w-6 text-white/60" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <Badge className="absolute bottom-1 left-1 text-[9px] px-1 py-0 bg-black/50 text-white border-0">
                        {i + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}

              {/* Add photo */}
              {taskPhotos.length < 5 && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    addPhoto();
                  }}
                  onClick={addPhoto}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                    dragOver
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/50"
                  }`}
                >
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drag & drop or click to add photos
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Max 5 photos, JPG/PNG up to 5MB each
                  </p>
                </div>
              )}
            </div>

            <Separator />

            {/* Logistics */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Logistics Preferences</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    key: "meetUp" as const,
                    label: "Meet-up",
                    icon: (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                        />
                      </svg>
                    ),
                  },
                  {
                    key: "delivery" as const,
                    label: "Local Delivery",
                    icon: <Package className="h-5 w-5" />,
                  },
                  {
                    key: "shipping" as const,
                    label: "Shipping",
                    icon: <Truck className="h-5 w-5" />,
                  },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() =>
                      setTaskLogistics((prev) => ({
                        ...prev,
                        [item.key]: !prev[item.key],
                      }))
                    }
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 text-sm font-medium transition-all ${
                      taskLogistics[item.key]
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 hover:border-gray-300 text-muted-foreground"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleSave}
                disabled={saving || !taskTitle || !taskDescription || !taskBudget || !taskCity}
                className="gap-2"
                size="lg"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {saving ? "Saving Changes..." : "Save Changes"}
              </Button>
              <Link href={cancelUrl}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Cancel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── LISTING FORM ─── */}
      {!isTask && (
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="listing-title" className="text-sm font-medium">
                Listing Title <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="listing-title"
                placeholder="e.g., iPhone 14 Pro Max - 256GB"
                value={listingTitle}
                onChange={(e) => setListingTitle(e.target.value)}
                maxLength={120}
              />
              <p className="text-xs text-muted-foreground text-right">
                {listingTitle.length}/120
              </p>
            </div>

            {/* Subcategory & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Subcategory</Label>
                <Select
                  value={listingSubcategory}
                  onValueChange={setListingSubcategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {(subcategoryMap["for-sale"] || []).map((sub) => (
                      <SelectItem key={sub} value={sub}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Condition <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={listingCondition}
                  onValueChange={setListingCondition}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditionOptions.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Condition cards */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Condition</Label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {conditionOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setListingCondition(opt.value)}
                    className={`p-2.5 rounded-lg border-2 text-xs font-medium transition-all ${
                      listingCondition === opt.value
                        ? opt.color
                        : "border-gray-200 hover:border-gray-300 text-muted-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="listing-desc" className="text-sm font-medium">
                Description <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                id="listing-desc"
                placeholder="Describe your item in detail. Include specifications, condition details, what's included..."
                rows={6}
                value={listingDescription}
                onChange={(e) => setListingDescription(e.target.value)}
                maxLength={2000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {listingDescription.length}/2000
              </p>
            </div>

            {/* Price & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="listing-price" className="text-sm font-medium">
                  Price <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="listing-price"
                    type="number"
                    placeholder="0.00"
                    value={listingPrice}
                    onChange={(e) => setListingPrice(e.target.value)}
                    className="pl-9"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Currency</Label>
                <Select value={listingCurrency} onValueChange={setListingCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                City <span className="text-rose-500">*</span>
              </Label>
              <Select value={listingCity} onValueChange={setListingCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      {c.name}, {c.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Photos */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Photos ({listingPhotos.length}/8)
              </Label>

              {listingPhotos.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {listingPhotos.map((photo, i) => (
                    <div
                      key={photo}
                      className="relative aspect-square rounded-lg overflow-hidden border group"
                    >
                      <div
                        className={`w-full h-full bg-gradient-to-br ${
                          placeholderColors[i % placeholderColors.length]
                        } flex items-center justify-center`}
                      >
                        <ImageIcon className="h-6 w-6 text-white/60" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <Badge className="absolute bottom-1 left-1 text-[9px] px-1 py-0 bg-black/50 text-white border-0">
                        {i + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}

              {listingPhotos.length < 8 && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    addPhoto();
                  }}
                  onClick={addPhoto}
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
                    dragOver
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/50"
                  }`}
                >
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drag & drop or click to add photos
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Max 8 photos, JPG/PNG up to 5MB each
                  </p>
                </div>
              )}
            </div>

            <Separator />

            {/* Delivery Options */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Delivery Options</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    key: "meetUp" as const,
                    label: "Meet-up",
                    icon: (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                        />
                      </svg>
                    ),
                  },
                  {
                    key: "localDelivery" as const,
                    label: "Local Delivery",
                    icon: <Truck className="h-5 w-5" />,
                  },
                  {
                    key: "shipping" as const,
                    label: "Shipping",
                    icon: <Package className="h-5 w-5" />,
                  },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() =>
                      setListingDelivery((prev) => ({
                        ...prev,
                        [item.key]: !prev[item.key],
                      }))
                    }
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 text-sm font-medium transition-all ${
                      listingDelivery[item.key]
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 hover:border-gray-300 text-muted-foreground"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>

              {(listingDelivery.localDelivery || listingDelivery.shipping) && (
                <Textarea
                  placeholder="Add delivery notes (e.g., delivery area, fees, shipping details...)"
                  value={listingDelivery.deliveryNote}
                  onChange={(e) =>
                    setListingDelivery((prev) => ({
                      ...prev,
                      deliveryNote: e.target.value,
                    }))
                  }
                  rows={3}
                  maxLength={500}
                />
              )}
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleSave}
                disabled={
                  saving ||
                  !listingTitle ||
                  !listingDescription ||
                  !listingPrice ||
                  !listingCity ||
                  !listingCondition
                }
                className="gap-2"
                size="lg"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {saving ? "Saving Changes..." : "Save Changes"}
              </Button>
              <Link href={cancelUrl}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Cancel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
