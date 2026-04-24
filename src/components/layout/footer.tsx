"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { categories } from "@/lib/constants";
import { useState, useRef } from "react";
import { Twitter, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleBrandingClick = () => {
    // Clear existing timer
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    const newCount = clickCount + 1;
    setClickCount(newCount);

    // Reset count after 1 second of no clicks
    clickTimerRef.current = setTimeout(() => {
      setClickCount(0);
    }, 1000);

    // Triple click detected
    if (newCount >= 3) {
      setClickCount(0);
      setShowPasswordPrompt(true);
    }
  };

  const handlePasswordSubmit = () => {
    if (password === "postall2024") {
      setShowPasswordPrompt(false);
      setPassword("");
      setPasswordError(false);
      router.push("/dashboard/dev-lab");
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  return (
    <>
      <footer className="glass-card mt-auto rounded-none border-t-0 border-t relative">
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#0D8A5C] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PA</span>
                </div>
                <button
                  onClick={handleBrandingClick}
                  className="font-bold text-xl text-[#0D8A5C] hover:text-[#0D8A5C]/80 transition-colors cursor-pointer bg-transparent border-none outline-none"
                  aria-label="PostAll branding"
                >
                  PostAll
                </button>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The all-in-one marketplace platform. Post tasks, find work, buy and sell items, and access 24 powerful tools — all in one place. No signup required to browse.
              </p>
              {/* O.L.H.M.E.S branding */}
              <div className="flex items-center gap-1 pt-2">
                <span className="text-xs text-muted-foreground">A product of</span>
                <button
                  onClick={handleBrandingClick}
                  className="font-bold text-sm tracking-widest text-[#0D8A5C] hover:text-[#0D8A5C]/80 transition-colors cursor-pointer bg-transparent border-none outline-none"
                  aria-label="O.L.H.M.E.S branding"
                >
                  O.L.H.M.E.S
                </button>
              </div>
              <div className="flex items-center gap-6">
                <div className="h-10 w-10 rounded-full bg-[#0D8A5C]/10 flex items-center justify-center hover:bg-[#0D8A5C]/20 transition-colors cursor-pointer">
                  <Twitter className="h-5 w-5 text-[#0D8A5C]" />
                </div>
                <div className="h-10 w-10 rounded-full bg-[#0D8A5C]/10 flex items-center justify-center hover:bg-[#0D8A5C]/20 transition-colors cursor-pointer">
                  <Facebook className="h-5 w-5 text-[#0D8A5C]" />
                </div>
                <div className="h-10 w-10 rounded-full bg-[#0D8A5C]/10 flex items-center justify-center hover:bg-[#0D8A5C]/20 transition-colors cursor-pointer">
                  <Instagram className="h-5 w-5 text-[#0D8A5C]" />
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider">Categories</h3>
              <nav className="space-y-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/browse/${cat.id}`}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Marketplace */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider">Marketplace</h3>
              <nav className="space-y-2">
                <Link href="/browse" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Browse All</Link>
                <Link href="/jobs" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Jobs & Careers</Link>
                <Link href="/services" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Services</Link>
                <Link href="/deals" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Deals & Promos</Link>
                <Link href="/events" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Events</Link>
                <Link href="/stores" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Stores</Link>
              </nav>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider">Quick Links</h3>
              <nav className="space-y-2">
                <Link href="/post-task" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Post a Task</Link>
                <Link href="/sell-item" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Sell an Item</Link>
                <Link href="/find-work" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Find Work</Link>
                <Link href="/favorites" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Favorites</Link>
                <Link href="/reviews" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Reviews</Link>
                <Link href="/how-it-works" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
                <Link href="/testimonials" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</Link>
              </nav>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider">Company</h3>
              <nav className="space-y-2">
                <Link href="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
                <Link href="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link>
                <Link href="/safety" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Safety Center</Link>
                <Link href="/help" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Help Center</Link>
                <Link href="/pricing" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
                <Link href="/advertise" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Advertise</Link>
                <Link href="/blog" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
                <Link href="/terms" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
                <Link href="/privacy" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              </nav>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs text-muted-foreground">Accepted:</span>
                <span className="inline-flex items-center rounded-md bg-[#F3F4F6] text-[#374151] px-2 py-0.5 text-xs font-medium">₦ NGN</span>
                <span className="inline-flex items-center rounded-md bg-[#F3F4F6] text-[#374151] px-2 py-0.5 text-xs font-medium">Visa</span>
                <span className="inline-flex items-center rounded-md bg-[#F3F4F6] text-[#374151] px-2 py-0.5 text-xs font-medium">Mastercard</span>
                <span className="inline-flex items-center rounded-md bg-[#F3F4F6] text-[#374151] px-2 py-0.5 text-xs font-medium">Bank Transfer</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} PostAll. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Platform escrow protected</span>
              <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground" />
              <span>Paystack powered</span>
              <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground" />
              <span>Available in 25+ cities</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Password Prompt Modal */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4 text-[#374151]">Admin Access</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
              placeholder="Enter password"
              className={`w-full h-11 px-4 rounded-lg border ${passwordError ? 'border-red-500 bg-red-50' : 'border-[#E5E7EB]'} text-sm outline-none focus:ring-2 focus:ring-[#0D8A5C]/20 transition-shadow`}
              autoFocus
            />
            {passwordError && (
              <p className="text-red-500 text-xs mt-2">Incorrect password. Please try again.</p>
            )}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowPasswordPrompt(false);
                  setPassword("");
                  setPasswordError(false);
                }}
                className="flex-1 h-10 rounded-lg border border-[#E5E7EB] text-sm font-medium text-[#374151] hover:bg-[#F3F4F6] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="flex-1 h-10 rounded-lg bg-[#0D8A5C] text-white text-sm font-medium hover:bg-[#0D8A5C]/90 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
