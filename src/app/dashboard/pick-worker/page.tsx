"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Check,
  Star,
  ChevronLeft,
  Shield,
  Clock,
  MapPin,
  CheckCircle2,
  Briefcase,
  Sparkles,
  Wallet,
  Info,
  ArrowRight,
  Users,
  Heart,
} from "lucide-react";

interface Worker {
  id: string;
  name: string;
  initials: string;
  city: string;
  role: string;
  rating: number;
  completed: number;
  rate: string;
  bio: string;
}

// Default fallback workers
const fallbackWorkers: Worker[] = [
  { id: "w1", name: "Emeka Okafor", initials: "EO", city: "Lagos", role: "Freelancer", rating: 4.9, completed: 47, rate: "₦15,000/hr", bio: "Full-stack developer with 5 years experience. Specialize in React, Next.js, and Node.js." },
  { id: "w2", name: "Amina Kaduna", initials: "AK", city: "Lagos", role: "Service Provider", rating: 4.7, completed: 32, rate: "₦12,000/hr", bio: "Creative designer and branding expert. I make brands stand out." },
  { id: "w3", name: "Kwame Mensah", initials: "KM", city: "Lagos", role: "Errand Runner", rating: 4.8, completed: 63, rate: "₦8,000/hr", bio: "Fast and reliable. I handle deliveries, errands, and logistics across the city." },
  { id: "w4", name: "Fatima Al-Rashid", initials: "FA", city: "Abuja", role: "Freelancer", rating: 5.0, completed: 21, rate: "₦20,000/hr", bio: "Social media strategist. I've grown 50+ brand accounts to 100K+ followers." },
  { id: "w5", name: "Chinedu Eze", initials: "CE", city: "Lagos", role: "Errand Runner", rating: 4.6, completed: 89, rate: "₦7,500/hr", bio: "I'm your go-to guy for anything. Moving, cleaning, delivery - you name it." },
  { id: "w6", name: "Blessing Okoro", initials: "BO", city: "Port Harcourt", role: "Service Provider", rating: 4.9, completed: 54, rate: "₦10,000/hr", bio: "Professional plumber and electrician. 10 years experience in home repairs." },
  { id: "w7", name: "David Okafor", initials: "DO", city: "Abuja", role: "Freelancer", rating: 4.5, completed: 18, rate: "₦18,000/hr", bio: "Mobile app developer. Flutter, React Native, and Kotlin expert." },
  { id: "w8", name: "Zainab Mohammed", initials: "ZM", city: "Abuja", role: "Real Estate Agent", rating: 4.8, completed: 29, rate: "₦25,000/flat", bio: "Premium property agent. I find the best homes and deals in Abuja." },
];

const avatarColors = [
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-amber-500",
  "bg-orange-500",
  "bg-rose-500",
  "bg-emerald-600",
  "bg-teal-600",
];

function ConfettiEffect() {
  const confetti = [
    { color: "bg-emerald-400", left: "10%", delay: "0s" },
    { color: "bg-amber-400", left: "20%", delay: "0.1s" },
    { color: "bg-teal-400", left: "30%", delay: "0.2s" },
    { color: "bg-rose-400", left: "40%", delay: "0.05s" },
    { color: "bg-cyan-400", left: "50%", delay: "0.15s" },
    { color: "bg-orange-400", left: "60%", delay: "0.25s" },
    { color: "bg-emerald-300", left: "70%", delay: "0.1s" },
    { color: "bg-amber-300", left: "80%", delay: "0.2s" },
    { color: "bg-teal-300", left: "90%", delay: "0.15s" },
    { color: "bg-rose-300", left: "15%", delay: "0.3s" },
    { color: "bg-cyan-300", left: "45%", delay: "0.05s" },
    { color: "bg-orange-300", left: "75%", delay: "0.25s" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((c, i) => (
        <div
          key={i}
          className={`absolute top-0 w-2 h-2 rounded-full ${c.color} animate-confetti`}
          style={{
            left: c.left,
            animationDelay: c.delay,
          }}
        />
      ))}
    </div>
  );
}

function WorkerCard({ worker, isTop, onSwipe }: { worker: Worker; isTop: boolean; onSwipe: (dir: "left" | "right") => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);
  const greenOverlay = useTransform(x, [0, 150], [0, 0.3]);
  const redOverlay = useTransform(x, [-150, 0], [0.3, 0]);

  const dragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number; y: number }; velocity: { x: number } }) => {
      if (info.offset.x > 100 || info.velocity.x > 500) {
        onSwipe("right");
      } else if (info.offset.x < -100 || info.velocity.x < -500) {
        onSwipe("left");
      }
    },
    [onSwipe]
  );

  const roleColors: Record<string, string> = {
    Freelancer: "bg-emerald-100 text-emerald-700",
    "Service Provider": "bg-teal-100 text-teal-700",
    "Errand Runner": "bg-amber-100 text-amber-700",
    "Real Estate Agent": "bg-cyan-100 text-cyan-700",
  };

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={dragEnd}
      whileDrag={{ scale: 1.03 }}
      initial={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
      animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 10 }}
      exit={{
        x: 500,
        opacity: 0,
        rotate: 20,
        transition: { duration: 0.4 },
      }}
    >
      {/* Green overlay for right swipe */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-emerald-500 z-10 pointer-events-none flex items-center justify-center"
        style={{ opacity: greenOverlay }}
      >
        <div className="bg-white rounded-2xl px-6 py-3 shadow-lg flex items-center gap-2">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          <span className="text-emerald-700 font-bold text-xl">PICK</span>
        </div>
      </motion.div>

      {/* Red overlay for left swipe */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-rose-500 z-10 pointer-events-none flex items-center justify-center"
        style={{ opacity: redOverlay }}
      >
        <div className="bg-white rounded-2xl px-6 py-3 shadow-lg flex items-center gap-2">
          <X className="h-8 w-8 text-rose-600" />
          <span className="text-rose-700 font-bold text-xl">SKIP</span>
        </div>
      </motion.div>

      <Card className="h-full w-full shadow-xl border-0 overflow-hidden">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Avatar and top info */}
          <div className="pt-8 pb-4 px-6 text-center flex-shrink-0">
            <div className={`h-24 w-24 rounded-full ${avatarColors[parseInt(worker.id.replace(/\D/g, ""), 10) % avatarColors.length]} flex items-center justify-center mx-auto shadow-lg`}>
              <span className="text-white text-3xl font-bold">{worker.initials}</span>
            </div>
            <h2 className="text-xl font-bold mt-4">{worker.name}</h2>
            <div className="flex items-center justify-center gap-1.5 mt-1 text-muted-foreground text-sm">
              <MapPin className="h-3.5 w-3.5" />
              {worker.city}
            </div>
            <Badge className={`mt-2 ${roleColors[worker.role] || "bg-gray-100 text-gray-700"} border-0`}>
              {worker.role}
            </Badge>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 px-6 py-3 bg-muted/30 flex-shrink-0">
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span className="font-bold text-sm">{worker.rating}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Rating</p>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="font-bold text-sm">{worker.completed}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Completed</p>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <Wallet className="h-4 w-4 text-teal-500" />
                <span className="font-bold text-sm">{worker.rate}</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">Rate</p>
            </div>
          </div>

          {/* Bio */}
          <div className="flex-1 px-6 py-4">
            <p className="text-sm text-muted-foreground leading-relaxed">{worker.bio}</p>
          </div>

          {/* Swipe hint */}
          <div className="px-6 pb-4 flex-shrink-0">
            <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <ChevronLeft className="h-3.5 w-3.5" />
              Swipe right to pick, left to skip
              <ChevronLeft className="h-3.5 w-3.5 rotate-180" />
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function PickWorkerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const taskId = searchParams.get("taskId") || "demo";
  const [workers, setWorkers] = useState<Worker[]>(fallbackWorkers);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch interested workers from API
  useEffect(() => {
    async function loadWorkers() {
      try {
        const res = await fetch(`/api/task-interest?taskId=${taskId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.workers && data.workers.length > 0) {
            setWorkers(
              data.workers.map((w: { id: string; name: string; initials: string; city: string; role: string; rating: number; completed: number; rate: string; bio: string }) => ({
                id: w.id,
                name: w.name,
                initials: w.initials,
                city: w.city,
                role: w.role,
                rating: w.rating,
                completed: w.completed,
                rate: w.rate,
                bio: w.bio,
              }))
            );
          }
        }
      } catch {
        // Fallback to default workers on error
      } finally {
        setIsLoading(false);
      }
    }
    loadWorkers();
  }, [taskId]);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [animating, setAnimating] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pickedWorker, setPickedWorker] = useState<Worker | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const visibleWorkers = workers.slice(currentIndex, currentIndex + 3);
  const currentWorker = workers[currentIndex];

  const handleSwipe = useCallback(
    (dir: "left" | "right") => {
      if (animating) return;
      setDirection(dir);
      setAnimating(true);

      if (dir === "right" && currentWorker) {
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
          setPickedWorker(currentWorker);
          setShowPaymentModal(true);
        }, 800);
      } else {
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setAnimating(false);
          setDirection(null);
          setExpanded(false);
        }, 400);
      }
    },
    [animating, currentWorker]
  );

  const handlePick = () => {
    if (currentWorker) {
      handleSwipe("right");
    }
  };

  const handleSkip = () => {
    handleSwipe("left");
  };

  const handlePaymentConfirm = () => {
    setShowPaymentModal(false);
    router.push("/dashboard/messages");
  };

  const handlePaymentSkip = () => {
    setShowPaymentModal(false);
    setShowConfetti(false);
    setCurrentIndex((prev) => prev + 1);
    setAnimating(false);
    setDirection(null);
    setExpanded(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="h-12 w-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin mb-4" />
        <p className="text-sm text-muted-foreground">Loading interested workers...</p>
      </div>
    );
  }

  // No more workers
  if (currentIndex >= workers.length) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md text-center space-y-6">
          <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <Users className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold">All Workers Reviewed!</h2>
          <p className="text-muted-foreground">
            You&apos;ve reviewed all {workers.length} workers who expressed interest. Go to your messages to chat with picked workers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => setCurrentIndex(0)} variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Review Again
            </Button>
            <Button onClick={() => router.push("/dashboard/messages")} className="bg-emerald-600 hover:bg-emerald-700 gap-2">
              <ArrowRight className="h-4 w-4" />
              Go to Messages
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col">
      {/* Confetti */}
      {showConfetti && <ConfettiEffect />}

      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="shrink-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="text-center flex-1 min-w-0 px-2">
            <h1 className="text-lg font-bold">Pick a Worker</h1>
            <p className="text-xs text-muted-foreground truncate">
              WordPress Website Redesign - ₦75,000
            </p>
          </div>
          <div className="shrink-0">
            <Badge variant="secondary" className="text-xs">
              {workers.length - currentIndex} left
            </Badge>
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 py-3 px-4">
        {workers.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i < currentIndex
                ? "w-2 bg-gray-300"
                : i === currentIndex
                ? "w-6 bg-emerald-500"
                : "w-2 bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Card stack */}
      <div className="flex-1 flex items-center justify-center px-4 py-2">
        <div className="relative w-full max-w-sm" style={{ height: "520px" }}>
          <AnimatePresence>
            {visibleWorkers
              .slice()
              .reverse()
              .map((worker, reverseIndex) => {
                const actualIndex = visibleWorkers.length - 1 - reverseIndex;
                const isTop = actualIndex === 0 && !animating;

                return (
                  <WorkerCard
                    key={worker.id + currentIndex}
                    worker={worker}
                    isTop={isTop}
                    onSwipe={handleSwipe}
                  />
                );
              })}
          </AnimatePresence>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 pb-6 pt-2">
        <div className="max-w-sm mx-auto">
          {/* Expanded details */}
          {expanded && currentWorker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <Card className="border border-dashed">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Briefcase className="h-4 w-4 text-emerald-600" />
                    About {currentWorker.name}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {currentWorker.bio}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-[11px] text-muted-foreground">Response Rate</p>
                      <p className="text-sm font-semibold">98%</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-[11px] text-muted-foreground">Avg. Delivery</p>
                      <p className="text-sm font-semibold">2 days</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-[11px] text-muted-foreground">Member Since</p>
                      <p className="text-sm font-semibold">2022</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-[11px] text-muted-foreground">Languages</p>
                      <p className="text-sm font-semibold">English</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                    <Shield className="h-3.5 w-3.5" />
                    Verified and background-checked
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Bottom action buttons */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handleSkip}
              disabled={animating}
              className="h-14 w-14 rounded-full border-2 border-rose-200 hover:border-rose-400 hover:bg-rose-50 text-rose-500 hover:text-rose-600 p-0 shrink-0"
            >
              <X className="h-7 w-7" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              disabled={animating}
              className="gap-1.5 text-xs"
            >
              <Star className="h-3.5 w-3.5" />
              {expanded ? "Less Info" : "More Info"}
            </Button>

            <Button
              size="lg"
              onClick={handlePick}
              disabled={animating}
              className="h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white p-0 shrink-0 shadow-lg shadow-emerald-200"
            >
              <Check className="h-7 w-7" />
            </Button>
          </div>

          {/* Labels under buttons */}
          <div className="flex items-center justify-center gap-12 mt-1.5">
            <span className="text-[10px] text-muted-foreground">Skip</span>
            <span className="text-[10px] text-muted-foreground">Pick</span>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-md">
          {pickedWorker && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  Pay into Escrow
                </DialogTitle>
                <DialogDescription>
                  Secure payment to start working with {pickedWorker.name}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {/* Worker picked confirmation */}
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                  <div className={`h-12 w-12 rounded-full ${avatarColors[workers.indexOf(pickedWorker) % avatarColors.length]} flex items-center justify-center shrink-0`}>
                    <span className="text-white font-bold">{pickedWorker.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm">{pickedWorker.name}</p>
                    <p className="text-xs text-muted-foreground">{pickedWorker.role} · {pickedWorker.city}</p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-0">Picked</Badge>
                </div>

                <Separator />

                {/* Payment summary */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Task</span>
                    <span className="font-medium">WordPress Website Redesign</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Worker</span>
                    <span className="font-medium">{pickedWorker.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Service Fee (5%)</span>
                    <span className="font-medium">₦3,750</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold text-emerald-600">₦78,750</span>
                  </div>
                </div>

                {/* Safety info */}
                <div className="flex items-start gap-2.5 p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <Shield className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Money held safely in escrow until the task is completed and you confirm satisfaction. Full refund available if the worker doesn&apos;t deliver.
                  </p>
                </div>

                {/* Payment buttons */}
                <div className="space-y-2.5">
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base font-semibold gap-2"
                    onClick={handlePaymentConfirm}
                  >
                    <Wallet className="h-5 w-5" />
                    Pay ₦78,750 Now
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-10 gap-2"
                    onClick={handlePaymentConfirm}
                  >
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Pay with Crypto
                  </Button>
                </div>

                <p className="text-center text-[11px] text-muted-foreground">
                  By paying, you agree to our <a href="/terms" className="text-emerald-600 underline">Terms of Service</a>
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
