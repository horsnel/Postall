"use client";

import { createContext, useContext, useCallback, type ReactNode } from "react";
import { useLanguageStore } from "@/lib/i18n/translations-store";
import { locales, type Locale, type LocaleInfo, type TranslationKey } from "@/lib/i18n/translations";

// ─── Translation Context ─────────────────────────────────
interface TranslationContextValue {
  t: (key: TranslationKey) => string;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  locales: LocaleInfo[];
}

const TranslationContext = createContext<TranslationContextValue | null>(null);

// ─── Translation Provider ────────────────────────────────
export function TranslationProvider({ children }: { children: ReactNode }) {
  const locale = useLanguageStore((s) => s.locale);
  const setLocaleStore = useLanguageStore((s) => s.setLocale);
  const tFn = useLanguageStore((s) => s.t);

  const setLocale = useCallback(
    (newLocale: Locale) => {
      setLocaleStore(newLocale);
    },
    [setLocaleStore]
  );

  const value: TranslationContextValue = {
    t: tFn,
    locale,
    setLocale,
    locales,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

// ─── useTranslation Hook ─────────────────────────────────
// Always calls hooks at the top level, returns context value when available,
// falls back to store values when used outside provider.
export function useTranslation() {
  const ctx = useContext(TranslationContext);
  const storeLocale = useLanguageStore((s) => s.locale);
  const storeSetLocale = useLanguageStore((s) => s.setLocale);
  const storeT = useLanguageStore((s) => s.t);

  if (ctx) {
    return ctx;
  }

  return {
    t: storeT,
    locale: storeLocale,
    setLocale: storeSetLocale,
    locales,
  };
}
