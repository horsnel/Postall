"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole =
  | "seller"
  | "freelancer"
  | "errand_runner"
  | "service_provider"
  | "buyer";

export type AccountType = 'individual' | 'business';

export const userRoles: { id: UserRole; label: string; description: string; icon: string; color: string }[] = [
  { id: "seller", label: "Seller", description: "Buy and sell items, products & goods", icon: "ShoppingCart", color: "amber" },
  { id: "freelancer", label: "Freelancer", description: "Offer professional skills & digital services", icon: "Laptop", color: "emerald" },
  { id: "errand_runner", label: "Errand Runner", description: "Complete tasks & run errands for people", icon: "Zap", color: "teal" },
  { id: "service_provider", label: "Service Provider", description: "Offer local services like plumbing, cleaning, tutoring", icon: "SlidersHorizontal", color: "cyan" },
  { id: "buyer", label: "Buyer / Client", description: "Post tasks, hire people & buy items", icon: "Search", color: "rose" },
];

export type VerificationLevel = 'basic' | 'id_verified' | 'business_verified';

export interface AuthUser {
  id: string;
  username: string;
  fullName?: string;
  email?: string;
  phone?: string;
  photo?: string;
  city?: string;
  role: UserRole;
  accountType: AccountType;
  isVerified: boolean;
  isAdmin: boolean;
  profileStrength: number;
  verificationLevel?: VerificationLevel;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

const isServer = typeof window === 'undefined';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null }),
    }),
    {
      name: "postall-auth",
      skipHydration: isServer,
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export const requireAuth = (user: AuthUser | null) => {
  return !!user;
};
