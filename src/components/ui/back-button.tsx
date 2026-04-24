"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface BackButtonProps {
  /** Custom href to navigate to. If not provided, uses browser back */
  href?: string;
  /** Label to show on desktop. Defaults to "Back" */
  label?: string;
  /** Show Home icon instead of Back arrow */
  showHome?: boolean;
  /** Fallback URL if there's no history to go back to */
  fallbackHref?: string;
  /** Additional CSS classes */
  className?: string;
  /** Size variant */
  size?: "default" | "sm" | "lg" | "icon";
  /** Variant style */
  variant?: "default" | "ghost" | "outline" | "secondary";
}

export function BackButton({
  href,
  label = "Back",
  showHome = false,
  fallbackHref = "/browse",
  className = "",
  size = "default",
  variant = "ghost",
}: BackButtonProps) {
  const router = useRouter();

  // If explicit href is provided, use Link
  if (href) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={href}>
            <Button
              variant={variant}
              size={size}
              className={`gap-2 ${className}`}
            >
              {showHome ? (
                <Home className="h-4 w-4" />
              ) : (
                <ArrowLeft className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">{showHome ? "Home" : label}</span>
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          {showHome ? "Go to Home" : `Go ${label.toLowerCase()}`}
        </TooltipContent>
      </Tooltip>
    );
  }

  // Otherwise, use router.back() with fallback
  const handleBack = () => {
    // Check if there's history to go back to
    if (typeof window !== "undefined" && window.history.length > 1) {
      // Check if the previous page is from the same origin
      const navEntries = performance.getEntriesByType("navigation");
      const isSameOrigin = navEntries.length > 0 || document.referrer.includes(window.location.origin);
      
      if (isSameOrigin || window.history.length > 2) {
        router.back();
        return;
      }
    }
    // Fallback to the fallback URL
    router.push(fallbackHref);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          onClick={handleBack}
          className={`gap-2 ${className}`}
        >
          {showHome ? (
            <Home className="h-4 w-4" />
          ) : (
            <ArrowLeft className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">{showHome ? "Home" : label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {showHome ? "Go to Home" : `Go ${label.toLowerCase()}`}
      </TooltipContent>
    </Tooltip>
  );
}

/** Compact back button for mobile headers */
export function BackButtonCompact({
  href,
  fallbackHref = "/browse",
  className = "",
}: Omit<BackButtonProps, "size" | "variant">) {
  const router = useRouter();

  if (href) {
    return (
      <Link
        href={href}
        className={`p-2 -ml-2 rounded-lg hover:bg-[#F3F4F6] transition-colors text-[#6B7280] hover:text-[#374151] ${className}`}
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>
    );
  }

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`p-2 -ml-2 rounded-lg hover:bg-[#F3F4F6] transition-colors text-[#6B7280] hover:text-[#374151] ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
}
