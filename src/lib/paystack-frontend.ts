"use client";

import { useState, useCallback, useRef } from "react";

// ─── Public key from environment ──────────────────────────────
export const PAYSTACK_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";

// ─── Placeholder detection ────────────────────────────────────
function isPlaceholderKey(key: string): boolean {
  return (
    !key ||
    key.includes("your-") ||
    key.includes("pk_test_") === false ||
    key.length < 20
  );
}

// ─── Paystack inline popup types ──────────────────────────────
interface PaystackPopupOptions {
  email: string;
  amount: number; // amount in kobo
  reference: string;
  metadata?: Record<string, unknown>;
  onClose?: () => void;
  onSuccess?: (reference: string) => void;
  callbackUrl?: string;
}

interface PaystackPopupReturn {
  openPaystack: () => void;
  isLoading: boolean;
}

// Extend Window to include PaystackPop
declare global {
  interface Window {
    PaystackPop: {
      setup: (config: Record<string, unknown>) => {
        openIframe: () => void;
      };
    };
  }
}

/**
 * Dynamically loads the Paystack inline JS script.
 * Returns true if script was already loaded or loaded successfully.
 */
function loadPaystackScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    // Check if script is already loaded
    if (window.PaystackPop) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v2/inline.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

/**
 * Hook to open Paystack inline popup for payment.
 * Falls back to mock mode if the public key is a placeholder.
 */
export function usePaystackPopup(options: PaystackPopupOptions): PaystackPopupReturn {
  const [isLoading, setIsLoading] = useState(false);
  const mockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openPaystack = useCallback(async () => {
    const { email, amount, reference, metadata, onClose, onSuccess, callbackUrl } =
      options;

    // ── Mock mode when key is not configured ───────────────────
    if (isPlaceholderKey(PAYSTACK_PUBLIC_KEY)) {
      console.warn(
        "[Paystack] Public key not configured. Running in mock mode."
      );
      setIsLoading(true);

      // Simulate 2-second payment success
      mockTimerRef.current = setTimeout(() => {
        setIsLoading(false);
        console.log("[Paystack] Mock payment successful:", { reference, amount });
        onSuccess?.(reference);
      }, 2000);

      return;
    }

    // ── Real Paystack popup ────────────────────────────────────
    setIsLoading(true);

    try {
      const scriptLoaded = await loadPaystackScript();

      if (!scriptLoaded || !window.PaystackPop) {
        setIsLoading(false);
        console.error("[Paystack] Failed to load Paystack script.");
        return;
      }

      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email,
        amount,
        ref: reference,
        metadata: metadata ?? {},
        onClose: () => {
          setIsLoading(false);
          onClose?.();
        },
        callback: () => {
          setIsLoading(false);
          onSuccess?.(reference);
          // Optionally redirect
          if (callbackUrl) {
            window.location.href = callbackUrl;
          }
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error("[Paystack] Error opening popup:", error);
      setIsLoading(false);
    }
  }, [options]);

  return { openPaystack, isLoading };
}
