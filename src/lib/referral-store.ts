"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ReferralStats {
  invited: number;
  active: number;
  earned: number;
  pending: number;
}

interface ReferralState {
  referralCode: string;
  referralStats: ReferralStats;
  generateCode: (username: string) => void;
  setReferralStats: (stats: Partial<ReferralStats>) => void;
}

function generateReferralCode(username: string): string {
  const upper = username.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const code = upper.length >= 4 ? upper.slice(0, 4) : upper.padEnd(4, "X");
  const hash = username.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const suffix = String(hash % 1000).padStart(3, "0");
  return `${code}-${suffix}`;
}

const isServer = typeof window === 'undefined';

export const useReferralStore = create<ReferralState>()(
  persist(
    (set) => ({
      referralCode: "",
      referralStats: {
        invited: 0,
        active: 0,
        earned: 0,
        pending: 0,
      },
      generateCode: (username: string) => {
        set({ referralCode: generateReferralCode(username) });
      },
      setReferralStats: (stats: Partial<ReferralStats>) => {
        set((s) => ({
          referralStats: { ...s.referralStats, ...stats },
        }));
      },
    }),
    {
      name: "postall-referral",
      skipHydration: isServer,
      partialize: (s) => ({
        referralCode: s.referralCode,
        referralStats: s.referralStats,
      }),
    }
  )
);
