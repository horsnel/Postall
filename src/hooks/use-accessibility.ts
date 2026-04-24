"use client";

import { useEffect } from "react";

// Announce messages to screen readers via a temporary live region
export function useAnnounce() {
  return (message: string, politeness: "polite" | "assertive" = "polite") => {
    const el = document.createElement("div");
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", politeness);
    el.setAttribute("aria-atomic", "true");
    el.className = "sr-only";
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => document.body.removeChild(el), 1000);
  };
}

// Trap focus within a container (for modals/dialogs)
export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement | null>,
  isActive: boolean
) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusableElements[0] as HTMLElement;
    const lastEl = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (!firstEl || !lastEl) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          lastEl.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastEl) {
          firstEl.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener("keydown", handleTab);
    return () => container.removeEventListener("keydown", handleTab);
  }, [containerRef, isActive]);
}
