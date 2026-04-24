"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import MagicLinkModal from "@/components/layout/magic-link-modal";
import { sampleListings } from "@/lib/constants";
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
  Tag,
  ImageIcon,
  Scale,
  CheckCircle2,
  ShoppingCart,
  Gavel,
  ChevronLeft,
} from "lucide-react";
import { WhatsAppButton } from "@/components/share/whatsapp-button";

// ─── Condition color mapping ──────────────────────────────────
function getConditionColor(condition: string) {
  const map: Record<string, string> = {
    New: "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Like New": "bg-teal-100 text-teal-700 border-teal-200",
    Good: "bg-amber-100 text-amber-700 border-amber-200",
    Fair: "bg-orange-100 text-orange-700 border-orange-200",
    Poor: "bg-rose-100 text-rose-700 border-rose-200",
  };
  return map[condition] || "bg-gray-100 text-gray-700 border-gray-200";
}

function getConditionDot(condition: string) {
  const map: Record<string, string> = {
    New: "bg-emerald-500",
    "Like New": "bg-teal-500",
    Good: "bg-amber-500",
    Fair: "bg-orange-500",
    Poor: "bg-rose-500",
  };
  return map[condition] || "bg-gray-500";
}

// ─── Sample detailed item data ────────────────────────────────
const itemDetails: Record<string, {
  description: string[];
  deliveryOptions: { meetUp: boolean; delivery: boolean; shipping: boolean; meetUpLocation?: string; deliveryPrice?: number };
  seller: { name: string; city: string; rating: number; verified: boolean; memberSince: string; initials: string; listings: number };
  specs?: string[];
}> = {
  "1": {
    description: [
      "Selling my iPhone 14 Pro Max 256GB in Space Black. The phone is in excellent like-new condition with no scratches or dents.",
      "Battery health is at 95% and the phone has been kept in a protective case since day one. Comes with original box, charger, and all accessories.",
      "This phone was purchased brand new just 6 months ago. Selling because I upgraded to the newest model. All features work perfectly including the camera, Face ID, and all ports.",
      "Factory reset and ready for a new owner. iCloud has been removed. No carrier lock - works with any network.",
    ],
    deliveryOptions: { meetUp: true, delivery: true, shipping: true, meetUpLocation: "Victoria Island, Lagos", deliveryPrice: 15 },
    seller: { name: "Tobi Adeyemi", city: "Lagos", rating: 4.9, verified: true, memberSince: "Nov 2023", initials: "TA", listings: 12 },
    specs: ["Storage: 256GB", "Color: Space Black", "Battery Health: 95%", "OS: iOS 18", "Screen: 6.7\" Super Retina XDR"],
  },
  "2": {
    description: [
      "MacBook Air M2 with 8GB RAM and 256GB SSD. This laptop is in good condition with some minor wear on the bottom case from regular use.",
      "The M2 chip provides excellent performance for everyday tasks, coding, and content creation. Battery still holds a great charge - about 8-10 hours of use.",
      "Comes with original charger and box. No keyboard issues, trackpad works perfectly. Screen has no dead pixels or marks.",
    ],
    deliveryOptions: { meetUp: true, delivery: false, shipping: true, meetUpLocation: "Wuse 2, Abuja", deliveryPrice: 25 },
    seller: { name: "Blessing Okafor", city: "Abuja", rating: 4.7, verified: true, memberSince: "Jan 2024", initials: "BO", listings: 5 },
    specs: ["Chip: Apple M2", "RAM: 8GB", "Storage: 256GB SSD", "Display: 13.6\"", "Color: Midnight"],
  },
  "4": {
    description: [
      "Brand new Trek Marlin 7 mountain bike, still in original packaging. This is a 2024 model with upgraded components.",
      "Perfect for trail riding, cross-country, and weekend adventures. Features a lightweight aluminum frame, Shimano Deore 12-speed drivetrain, and hydraulic disc brakes.",
      "I bought two by mistake and can only keep one. This is your chance to get a brand new bike at a great price. Original receipt available.",
      "Frame size is Medium (17.5\"), suitable for riders 5'6\" - 5'10\". Comes with full manufacturer warranty.",
    ],
    deliveryOptions: { meetUp: true, delivery: true, shipping: false, meetUpLocation: "Lekki, Lagos", deliveryPrice: 20 },
    seller: { name: "Chidi Obi", city: "Lagos", rating: 4.6, verified: false, memberSince: "Apr 2024", initials: "CO", listings: 3 },
    specs: ["Frame: Aluminum", "Fork: RockShox Judy", "Drivetrain: Shimano Deore 12-speed", "Brakes: Hydraulic Disc", "Size: Medium (17.5\")"],
  },
};

const fallbackItemDetail = {
  description: [
    "This item is available for purchase. Please review the listing details carefully before making an offer.",
    "Contact the seller if you have any questions about the item condition, specifications, or delivery options.",
    "All transactions through PostAll are protected by our secure payment system and buyer protection policy.",
  ],
  deliveryOptions: { meetUp: true, delivery: true, shipping: true },
  seller: { name: "Seller", city: "Lagos", rating: 4.5, verified: true, memberSince: "Jan 2024", initials: "SL", listings: 8 },
};

// ─── Placeholder images ──────────────────────────────────────
const placeholderColors = [
  "from-amber-200 to-orange-200",
  "from-teal-200 to-cyan-200",
  "from-emerald-200 to-teal-200",
  "from-rose-200 to-pink-200",
  "from-cyan-200 to-sky-200",
];

// ─── Main Component ──────────────────────────────────────────
export default function ItemDetailPage() {
  const params = useParams();
  const itemId = params.id as string;
  const { user } = useAuthStore();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [itemData, setItemData] = useState<(typeof sampleListings)[0] | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Fetch item data
  useEffect(() => {
    async function loadItem() {
      try {
        const res = await fetch(`/api/listings/${itemId}`);
        if (res.ok) {
          const data = await res.json();
          setItemData(data);
        } else {
          const found = sampleListings.find((l) => l.id === itemId);
          if (found) {
            setItemData(found);
          } else {
            setNotFound(true);
          }
        }
      } catch {
        const found = sampleListings.find((l) => l.id === itemId);
        if (found) {
          setItemData(found);
        } else {
          setNotFound(true);
        }
      }
    }
    loadItem();
  }, [itemId]);

  const detail = useMemo(() => {
    return itemDetails[itemId] || fallbackItemDetail;
  }, [itemId]);

  const handlePurchase = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    // TODO: Open purchase dialog
  };

  const handleMakeOffer = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    // TODO: Open offer dialog
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
      navigator.share({ title: itemData?.title || "Item", url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (notFound) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <ShoppingCart className="h-7 w-7 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Item Not Found</h2>
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            This item may have been sold or removed. Browse our marketplace to find great deals.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/browse">
              <Button>Browse Items</Button>
            </Link>
            <Link href="/deals">
              <Button variant="outline">View Deals</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!itemData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4 animate-pulse">
            <ShoppingCart className="h-7 w-7 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Loading item...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we load the item details</p>
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
                    <Link href="/browse/for-sale">For Sale</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1 max-w-[200px] sm:max-w-none">
                    {itemData.title}
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
              {/* Title & Price */}
              <div className="bg-white rounded-xl border p-6">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge
                    variant="outline"
                    className={`${getConditionColor(itemData.condition || "Good")} text-xs`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${getConditionDot(itemData.condition || "Good")} mr-1.5`} />
                    {itemData.condition || "Good"}
                  </Badge>
                  <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    For Sale
                  </Badge>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                  {itemData.title}
                </h1>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                  <span className="text-3xl sm:text-4xl font-bold text-emerald-700">
                    ₦{itemData.price.toLocaleString()}
                  </span>
                </div>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{itemData.city}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>Posted {itemData.postedAgo || "recently"}</span>
                  </div>
                </div>
              </div>

              {/* Photo Gallery */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  Photos
                </h2>
                {/* Main Image */}
                <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-3">
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

              {/* Specs (if available) */}
              {detail.specs && detail.specs.length > 0 && (
                <div className="bg-white rounded-xl border p-6">
                  <h2 className="font-semibold text-lg mb-4">Specifications</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {detail.specs.map((spec, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span className="text-muted-foreground">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-semibold text-lg mb-4">Description</h2>
                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  {detail.description.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              {/* Delivery Options */}
              <div className="bg-white rounded-xl border p-6">
                <h2 className="font-semibold text-lg mb-4">Delivery Options</h2>
                <div className="space-y-3">
                  <div className={`flex items-center gap-3 p-4 rounded-lg border ${detail.deliveryOptions.meetUp ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200 opacity-50"}`}>
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${detail.deliveryOptions.meetUp ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                      <Handshake className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">Meet-up</p>
                      {detail.deliveryOptions.meetUpLocation && (
                        <p className="text-xs text-muted-foreground">{detail.deliveryOptions.meetUpLocation}</p>
                      )}
                    </div>
                    {detail.deliveryOptions.meetUp && (
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">Free</Badge>
                    )}
                  </div>
                  <div className={`flex items-center gap-3 p-4 rounded-lg border ${detail.deliveryOptions.delivery ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200 opacity-50"}`}>
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${detail.deliveryOptions.delivery ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                      <Package className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">Local Delivery</p>
                      <p className="text-xs text-muted-foreground">Within the city</p>
                    </div>
                    {detail.deliveryOptions.delivery && detail.deliveryOptions.deliveryPrice && (
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                        +₦{detail.deliveryOptions.deliveryPrice}
                      </Badge>
                    )}
                  </div>
                  <div className={`flex items-center gap-3 p-4 rounded-lg border ${detail.deliveryOptions.shipping ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200 opacity-50"}`}>
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${detail.deliveryOptions.shipping ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"}`}>
                      <Truck className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">Shipping</p>
                      <p className="text-xs text-muted-foreground">Nationwide delivery</p>
                    </div>
                    {detail.deliveryOptions.shipping && (
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">Available</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right Column (Sidebar) ── */}
            <div className="w-full lg:w-[340px] shrink-0 space-y-6">
              {/* Seller Profile Card */}
              <Card className="py-0 overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 flex items-center gap-4">
                    <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                      <AvatarFallback className="bg-amber-600 text-white font-semibold text-lg">
                        {detail.seller.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-semibold truncate">{detail.seller.name}</h3>
                        {detail.seller.verified && (
                          <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <Shield className="h-3.5 w-3.5 text-emerald-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{detail.seller.city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(detail.seller.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                      <span className="text-sm font-medium ml-1">{detail.seller.rating}</span>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Active listings</span>
                      <span className="font-medium">{detail.seller.listings}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Member since</span>
                      <span className="font-medium">{detail.seller.memberSince}</span>
                    </div>

                    {detail.seller.verified && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 text-sm">
                        <Shield className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="text-emerald-700 font-medium">Verified Seller</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card className="py-0 overflow-hidden">
                <CardContent className="p-6 space-y-3">
                  <Button className="w-full h-11 text-base font-semibold" onClick={handlePurchase}>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Purchase Item
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-10"
                    onClick={handleMakeOffer}
                  >
                    <Gavel className="h-4 w-4 mr-2" />
                    Make an Offer
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
                    title={itemData.title}
                    price={`₦${itemData.price.toLocaleString()}`}
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

              {/* Safety Reminder */}
              <Card className="border-amber-200 bg-amber-50/50 py-0">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-amber-600" />
                    Buyer Protection
                  </h3>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      Secure payment via PostAll escrow
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      Full refund if item not as described
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                      Verified seller badge for trusted members
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Similar Items */}
              <Card className="py-0 overflow-hidden">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Similar Items</h3>
                  <div className="space-y-3">
                    {sampleListings
                      .filter((l) => l.id !== itemId)
                      .slice(0, 3)
                      .map((similar) => (
                        <Link key={similar.id} href={`/item/${similar.id}`}>
                          <div className="p-3 rounded-lg border hover:border-amber-200 hover:bg-amber-50/30 transition-all cursor-pointer">
                            <h4 className="text-sm font-medium line-clamp-2 mb-2">
                              {similar.title}
                            </h4>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="font-semibold text-emerald-700 text-sm">
                                ₦{similar.price.toLocaleString()}
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
