/**
 * A/B Testing Framework for PostAll
 * Feature flags and experiment management with localStorage persistence.
 */

import { useState, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────
export type FeatureFlags =
  | 'new_checkout_flow'
  | 'ai_listing_enhance'
  | 'social_proof_badges'
  | 'instant_chat'
  | 'dark_mode_default'
  | 'bulk_actions';

export interface ABExperiment {
  id: string;
  name: string;
  description: string;
  variants: string[];
  trafficAllocation: number; // 0-1, fraction in variant B
  startDate: string;
  endDate: string;
  status: 'active' | 'paused' | 'completed';
}

// ─── Default Feature Flags ────────────────────────────────────
const DEFAULT_FLAGS: Record<FeatureFlags, boolean> = {
  new_checkout_flow: false,
  ai_listing_enhance: true,
  social_proof_badges: true,
  instant_chat: false,
  dark_mode_default: false,
  bulk_actions: true,
};

// ─── Sample Experiments ───────────────────────────────────────
export const SAMPLE_EXPERIMENTS: ABExperiment[] = [
  {
    id: 'checkout_redesign',
    name: 'Checkout Redesign',
    description: 'Testing new streamlined checkout flow vs existing multi-step flow',
    variants: ['control', 'new_flow'],
    trafficAllocation: 0.5,
    startDate: '2026-01-15',
    endDate: '2026-02-15',
    status: 'active',
  },
  {
    id: 'ai_enhance_prominent',
    name: 'AI Enhance Button Placement',
    description: 'Show AI enhance button prominently vs inline placement in sell form',
    variants: ['control', 'prominent'],
    trafficAllocation: 0.3,
    startDate: '2026-01-20',
    endDate: '2026-02-20',
    status: 'active',
  },
  {
    id: 'social_proof_test',
    name: 'Social Proof Badges',
    description: 'Show "X people viewing" and "Y sold recently" badges on listings',
    variants: ['control', 'badges_on'],
    trafficAllocation: 0.5,
    startDate: '2026-01-10',
    endDate: '2026-02-10',
    status: 'active',
  },
];

// ─── Feature Flag Hook ────────────────────────────────────────
export function useFeatureFlag(flagName: FeatureFlags): boolean {
  const [value, setValue] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(`postall-flag-${flagName}`);
      return stored !== null ? stored === 'true' : DEFAULT_FLAGS[flagName];
    } catch {
      return DEFAULT_FLAGS[flagName];
    }
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`postall-flag-${flagName}`);
      if (stored !== null && stored !== String(value)) {
        setTimeout(() => setValue(stored === 'true'), 0);
      }
    } catch {
      // localStorage not available
    }
  }, [flagName, value]);

  const setFlag = useCallback((enabled: boolean) => {
    setValue(enabled);
    try {
      localStorage.setItem(`postall-flag-${flagName}`, String(enabled));
    } catch {
      // localStorage not available
    }
  }, [flagName]);

  return value;
}

// ─── A/B Experiment Hook ──────────────────────────────────────
export function useABExperiment(experimentId: string) {
  const [variant, setVariant] = useState<string | null>(null);
  const [isControl, setIsControl] = useState(true);
  const [isNewVariant, setIsNewVariant] = useState(false);

  useEffect(() => {
    const experiment = SAMPLE_EXPERIMENTS.find((e) => e.id === experimentId);
    if (!experiment) return;

    if (experiment.status === 'paused' || experiment.status === 'completed') {
      if (variant !== 'control') setTimeout(() => {
        setVariant('control');
        setIsControl(true);
        setIsNewVariant(false);
      }, 0);
      return;
    }

    try {
      const stored = localStorage.getItem(`postall-ab-${experimentId}`);
      if (stored) {
        if (variant !== stored) setTimeout(() => {
          setVariant(stored);
          setIsControl(stored === experiment.variants[0]);
          setIsNewVariant(stored !== experiment.variants[0]);
        }, 0);
        return;
      }

      // Random assignment
      const assigned = Math.random() < experiment.trafficAllocation
        ? experiment.variants[1]
        : experiment.variants[0];

      localStorage.setItem(`postall-ab-${experimentId}`, assigned);
      setTimeout(() => {
        setVariant(assigned);
        setIsControl(assigned === experiment.variants[0]);
        setIsNewVariant(assigned !== experiment.variants[0]);
      }, 0);
    } catch {
      if (variant !== experiment.variants[0]) {
        setTimeout(() => setVariant(experiment.variants[0]), 0);
      }
    }
  }, [experimentId, variant]);

  const trackConversion = useCallback(() => {
    if (!variant) return;
    // In production, this would send an event to your analytics backend
    console.log(`[AB Test] Conversion tracked for ${experimentId}: variant="${variant}"`);
  }, [experimentId, variant]);

  return { variant, isControl, isNewVariant, trackConversion };
}

// ─── Utility: Get all experiments ──────────────────────────────
export function getStoredExperiments(): ABExperiment[] {
  return SAMPLE_EXPERIMENTS;
}

// ─── Utility: Update experiment status ─────────────────────────
export function updateExperimentStatus(id: string, status: ABExperiment['status']): void {
  const idx = SAMPLE_EXPERIMENTS.findIndex((e) => e.id === id);
  if (idx !== -1) {
    SAMPLE_EXPERIMENTS[idx].status = status;
  }
}

// ─── Feature Flag Store Hook (for dashboard) ─────────────────
export interface ABTestingFeatureFlag {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
  startDate: string;
  endDate: string;
  category: string;
  variant?: string;
  rolloutPercentage?: number;
  metric?: string;
}

const INITIAL_FLAGS: ABTestingFeatureFlag[] = [
  { id: '1', name: 'new_checkout_flow', enabled: false, description: 'Streamlined 1-step checkout process', startDate: '2026-01-01', endDate: '2026-02-28', category: 'Checkout' },
  { id: '2', name: 'ai_listing_enhance', enabled: true, description: 'AI-powered listing description enhancement', startDate: '2026-01-10', endDate: '2026-03-10', category: 'AI Tools' },
  { id: '3', name: 'social_proof_badges', enabled: true, description: 'Show viewer/sold count badges on listings', startDate: '2026-01-05', endDate: '2026-02-28', category: 'UX' },
  { id: '4', name: 'instant_chat', enabled: false, description: 'Enable instant chat without escrow', startDate: '2026-01-15', endDate: '2026-03-15', category: 'Messaging' },
  { id: '5', name: 'dark_mode_default', enabled: false, description: 'Set dark mode as default theme', startDate: '2026-01-01', endDate: '2026-02-28', category: 'Appearance' },
  { id: '6', name: 'bulk_actions', enabled: true, description: 'Bulk select, archive, delete listings', startDate: '2026-01-01', endDate: '', category: 'Dashboard' },
];

export function useABTestingStore() {
  const [flags, setFlags] = useState<ABTestingFeatureFlag[]>(INITIAL_FLAGS);

  const setFlag = useCallback((id: string, enabled: boolean) => {
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled } : f))
    );
  }, []);

  const createFlag = useCallback((flag: Omit<ABTestingFeatureFlag, 'id'>) => {
    const newId = String(Date.now());
    setFlags((prev) => [...prev, { ...flag, id: newId }]);
  }, []);

  const deleteFlag = useCallback((id: string) => {
    setFlags((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return { flags, setFlag, createFlag, deleteFlag };
}
