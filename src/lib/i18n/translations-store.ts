"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { translations, type Locale, type TranslationKey } from "./translations";

const isServer = typeof window === 'undefined';

interface LanguageState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      locale: "en" as Locale,
      setLocale: (locale: Locale) => set({ locale }),
      t: (key: TranslationKey) => {
        const { locale } = get();
        return translations[locale]?.[key] ?? translations.en[key] ?? key;
      },
    }),
    {
      name: "postall-locale",
      skipHydration: isServer,
    }
  )
);
