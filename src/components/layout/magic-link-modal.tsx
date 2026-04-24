"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Mail, ChevronLeft, Loader2 } from "lucide-react";

interface MagicLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MagicLinkModal({ open, onOpenChange }: MagicLinkModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    // Simulate sending magic link
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSent(true);
    setLoading(false);
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    onOpenChange(false);
    window.location.href = "/api/auth/google";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {sent ? "Check your email" : "Welcome to PostAll"}
          </DialogTitle>
          <DialogDescription>
            {sent
              ? "We've sent a magic link to your email. Click it to log in instantly."
              : "Enter your email and we'll send you a magic link to log in instantly."}
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-primary/5 border border-primary/10 p-4 text-center">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                <Mail className="h-7 w-7 text-emerald-600" />
              </div>
              <p className="text-sm font-medium">Magic link sent!</p>
              <p className="text-xs text-muted-foreground mt-1">
                to {email}
              </p>
            </div>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                disabled={countdown > 0}
                onClick={handleSend}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend link"}
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setSent(false)}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Try different email
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 h-11 px-4 rounded-md border border-border bg-card hover:bg-muted/50 active:bg-muted transition-colors text-sm font-medium text-foreground shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <div className="h-5 w-5 border-2 border-border border-t-foreground rounded-full animate-spin" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              )}
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or continue with email</span>
              </div>
            </div>

            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                onClick={handleSend}
                disabled={loading || !email.includes("@")}
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Send Magic Link via Email
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to our{" "}
              <a href="/terms" className="underline hover:text-foreground">Terms</a> and{" "}
              <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
